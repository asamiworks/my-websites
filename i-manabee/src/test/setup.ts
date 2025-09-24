// テスト環境のグローバル設定

// Jest DOM matchers
import '@testing-library/jest-dom';

// React Testing Library の設定
import { configure } from '@testing-library/react';

// MSW (Mock Service Worker) の設定
import { server } from './mocks/server';

// カスタムマッチャーの拡張
expect.extend({
  // 年齢グループの検証
  toBeValidAgeGroup(received: string) {
    const validAgeGroups = ['junior', 'middle', 'senior'];
    const pass = validAgeGroups.includes(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid age group`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be one of ${validAgeGroups.join(', ')}`,
        pass: false,
      };
    }
  },

  // NGワードの検証
  toContainNGWord(received: string) {
    // 簡略版のNGワード検証（実際はより複雑な処理）
    const ngWords = ['バカ', 'アホ', 'しね', '殺す'];
    const pass = ngWords.some(word => received.includes(word));

    if (pass) {
      return {
        message: () => `expected "${received}" not to contain NG words`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected "${received}" to contain NG words`,
        pass: false,
      };
    }
  },

  // トークン数の検証
  toBeWithinTokenLimit(received: number, limit: number) {
    const pass = received <= limit;

    if (pass) {
      return {
        message: () => `expected ${received} to exceed token limit of ${limit}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within token limit of ${limit}`,
        pass: false,
      };
    }
  },
});

// TypeScript の型宣言
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidAgeGroup(): R;
      toContainNGWord(): R;
      toBeWithinTokenLimit(limit: number): R;
    }
  }
}

// React Testing Library の設定
configure({
  // テスト結果の待機時間
  asyncUtilTimeout: 5000,

  // テストID の設定
  testIdAttribute: 'data-testid',

  // デバッグ時の DOM 出力制限
  getElementError: (message, container) => {
    const error = new Error(
      [
        message,
        '',
        'DOM Debug Info:',
        '================',
      ].join('\n')
    );
    error.name = 'TestingLibraryElementError';
    return error;
  },
});

// MSW サーバーの設定
beforeAll(() => {
  // テスト開始前にモックサーバーを開始
  server.listen({
    onUnhandledRequest: 'error',
  });
});

afterEach(() => {
  // 各テスト後にハンドラーをリセット
  server.resetHandlers();

  // ローカルストレージのクリア
  localStorage.clear();
  sessionStorage.clear();

  // Zustand ストアのリセット
  // 注: 実際のストアリセット処理が必要
});

afterAll(() => {
  // すべてのテスト終了後にモックサーバーを停止
  server.close();
});

// エラーハンドリングの設定
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // React の警告を無視（テスト環境での不要な警告を抑制）
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('Warning: ReactDOM.render is no longer supported') ||
     message.includes('Warning: An invalid form control'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// タイムゾーンの設定（テストの一貫性のため）
process.env.TZ = 'UTC';

// Firebase エミュレータの設定
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

// テスト用の環境変数
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'i-manabee-test';
process.env.OPENAI_API_KEY = 'test-api-key';

// Intersection Observer のモック
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// ResizeObserver のモック
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// matchMedia のモック（レスポンシブテスト用）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Geolocation API のモック
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn().mockImplementation(success =>
      success({
        coords: {
          latitude: 35.6762,
          longitude: 139.6503,
        },
      })
    ),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  },
});

// Web Crypto API のモック
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    getRandomValues: (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
  },
});

// テスト用のユーティリティ関数
export const createMockUser = (overrides = {}) => ({
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  ...overrides,
});

export const createMockChildProfile = (overrides = {}) => ({
  id: 'test-child-id',
  name: 'テストちゃん',
  ageGroup: 'junior' as const,
  grade: '小学3年生',
  pin: '1234',
  createdAt: new Date(),
  ...overrides,
});

export const createMockChatMessage = (overrides = {}) => ({
  id: 'test-message-id',
  content: 'テストメッセージ',
  role: 'user' as const,
  timestamp: new Date(),
  tokenCount: 10,
  ...overrides,
});

// テスト用の待機関数
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// テスト用のエラー情報
export const testErrors = {
  network: new Error('Network error'),
  auth: new Error('Authentication failed'),
  validation: new Error('Validation error'),
  unknown: new Error('Unknown error'),
};