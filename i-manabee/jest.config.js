const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Next.js app のパス
  dir: './',
})

// Jestのカスタム設定
const customJestConfig = {
  // テスト環境の設定
  testEnvironment: 'jsdom',

  // セットアップファイル
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],

  // テストファイルのパターン
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],

  // カバレッジ設定
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],

  // カバレッジ閾値
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 85,
      lines: 80,
      statements: 80,
    },
  },

  // カバレッジレポーター
  coverageReporters: [
    'text',
    'lcov',
    'json-summary',
    'html',
  ],

  // モジュールパスマッピング
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/test/(.*)$': '<rootDir>/src/test/$1',
  },

  // モックファイルの場所
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node',
  ],

  // テスト前の環境設定
  globalSetup: '<rootDir>/src/test/globalSetup.ts',
  globalTeardown: '<rootDir>/src/test/globalTeardown.ts',

  // タイムアウト設定
  testTimeout: 10000,

  // 並列実行の設定
  maxWorkers: '50%',

  // 詳細設定
  verbose: true,

  // ファイル変換設定
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },

  // 静的ファイルのモック
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/test/__mocks__/fileMock.js',
  },

  // ESModulesの変換設定
  transformIgnorePatterns: [
    'node_modules/(?!(firebase|@firebase|openai|gpt-3-encoder)/)',
  ],

  // テスト結果レポーター
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-results',
      outputName: 'junit.xml',
    }],
  ],

  // プロジェクト設定（複数のテストスイートを並行実行）
  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '<rootDir>/src/**/__tests__/unit/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.unit.{test,spec}.{js,jsx,ts,tsx}',
      ],
      testEnvironment: 'jsdom',
    },
    {
      displayName: 'integration',
      testMatch: [
        '<rootDir>/src/**/__tests__/integration/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.integration.{test,spec}.{js,jsx,ts,tsx}',
      ],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/src/test/integrationSetup.ts'],
    },
  ],

  // watchモードの設定
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/out/',
    '<rootDir>/coverage/',
  ],

  // キャッシュの設定
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',

  // エラー発生時の設定
  errorOnDeprecated: true,

  // テスト実行前後のフック
  globalSetup: '<rootDir>/src/test/globalSetup.ts',
  globalTeardown: '<rootDir>/src/test/globalTeardown.ts',
}

module.exports = createJestConfig(customJestConfig)