// MSW (Mock Service Worker) サーバー設定

import { setupServer } from 'msw/node';
import { rest } from 'msw';

// API モックハンドラー
const handlers = [
  // 認証API のモック
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        user: {
          uid: 'test-user-id',
          email: 'test@example.com',
          displayName: 'Test User',
        },
      })
    );
  }),

  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        message: 'User registered successfully',
      })
    );
  }),

  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Logged out successfully',
      })
    );
  }),

  // チャットAPI のモック
  rest.post('/api/chat/send', async (req, res, ctx) => {
    const { message, ageGroup } = await req.json();

    // NGワード検知のシミュレーション
    const ngWords = ['バカ', 'アホ'];
    const containsNGWord = ngWords.some(word => message.includes(word));

    if (containsNGWord) {
      return res(
        ctx.status(400),
        ctx.json({
          success: false,
          error: 'Inappropriate content detected',
          ngWordDetected: true,
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: {
          id: 'test-response-id',
          content: 'テスト用のAI応答です。',
          role: 'assistant',
          timestamp: new Date().toISOString(),
          tokenCount: 15,
        },
      })
    );
  }),

  rest.get('/api/chat/history', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        messages: [
          {
            id: 'msg-1',
            content: 'こんにちは',
            role: 'user',
            timestamp: new Date().toISOString(),
            tokenCount: 5,
          },
          {
            id: 'msg-2',
            content: 'こんにちは！何かお手伝いできることはありますか？',
            role: 'assistant',
            timestamp: new Date().toISOString(),
            tokenCount: 20,
          },
        ],
      })
    );
  }),

  // プロファイルAPI のモック
  rest.get('/api/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        profile: {
          id: 'test-profile-id',
          name: '田中太郎',
          email: 'test@example.com',
          plan: 'free',
          children: [
            {
              id: 'child-1',
              name: 'たなかちゃん',
              ageGroup: 'junior',
              grade: '小学3年生',
            },
          ],
        },
      })
    );
  }),

  rest.post('/api/profile/children', async (req, res, ctx) => {
    const { name, ageGroup, grade } = await req.json();

    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        child: {
          id: 'new-child-id',
          name,
          ageGroup,
          grade,
          createdAt: new Date().toISOString(),
        },
      })
    );
  }),

  // PIN認証API のモック
  rest.post('/api/auth/verify-pin', async (req, res, ctx) => {
    const { pin, childId } = await req.json();

    if (pin === '1234') {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          session: {
            childId,
            sessionId: 'test-session-id',
            expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          },
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        error: 'Invalid PIN',
      })
    );
  }),

  // 使用量API のモック
  rest.get('/api/usage', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        usage: {
          tokens: 1250,
          limit: 10000,
          messages: 45,
          period: 'monthly',
          resetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
      })
    );
  }),

  // ヘルスチェックAPI のモック
  rest.get('/api/health', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'healthy',
        timestamp: Date.now(),
        services: [
          { name: 'database', status: 'healthy', responseTime: 45 },
          { name: 'openai', status: 'healthy', responseTime: 120 },
          { name: 'auth', status: 'healthy', responseTime: 30 },
        ],
      })
    );
  }),

  rest.get('/api/health/:service', (req, res, ctx) => {
    const { service } = req.params;

    return res(
      ctx.status(200),
      ctx.json({
        service,
        status: 'healthy',
        responseTime: 50,
        timestamp: Date.now(),
      })
    );
  }),

  // 監視API のモック
  rest.post('/api/monitoring/metrics', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        stored: 10,
        alerts: 0,
        message: 'Metrics stored successfully',
      })
    );
  }),

  rest.post('/api/monitoring/alerts', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        alertId: 'test-alert-id',
        severity: 'warning',
        notificationsSent: 1,
        isDuplicate: false,
      })
    );
  }),

  // OpenAI API のモック
  rest.post('https://api.openai.com/v1/chat/completions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 'chatcmpl-test',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-3.5-turbo',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'テスト用のAI応答メッセージです。',
            },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 15,
          total_tokens: 25,
        },
      })
    );
  }),

  rest.get('https://api.openai.com/v1/models', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        object: 'list',
        data: [
          {
            id: 'gpt-3.5-turbo',
            object: 'model',
            created: 1677610602,
            owned_by: 'openai',
          },
          {
            id: 'gpt-4',
            object: 'model',
            created: 1687882411,
            owned_by: 'openai',
          },
        ],
      })
    );
  }),

  // エラーレスポンスのテスト用ハンドラー
  rest.post('/api/test/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        success: false,
        error: 'Internal server error',
      })
    );
  }),

  rest.post('/api/test/timeout', (req, res, ctx) => {
    return res(
      ctx.delay(10000), // 10秒の遅延
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Delayed response',
      })
    );
  }),

  // 認証エラーのテスト
  rest.post('/api/test/auth-error', (req, res, ctx) => {
    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        error: 'Unauthorized',
      })
    );
  }),

  // レート制限エラーのテスト
  rest.post('/api/test/rate-limit', (req, res, ctx) => {
    return res(
      ctx.status(429),
      ctx.json({
        error: 'Rate limit exceeded',
        retryAfter: 60,
      })
    );
  }),
];

// MSW サーバーの作成
export const server = setupServer(...handlers);

// テスト用のユーティリティ
export const mockHandlers = {
  // 認証失敗のシミュレーション
  authFailure: rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        error: 'Invalid credentials',
      })
    );
  }),

  // ネットワークエラーのシミュレーション
  networkError: rest.post('/api/chat/send', (req, res, ctx) => {
    return res.networkError('Network connection failed');
  }),

  // サーバーエラーのシミュレーション
  serverError: rest.get('/api/profile', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        success: false,
        error: 'Internal server error',
      })
    );
  }),

  // 緊急アラートのシミュレーション
  emergencyAlert: rest.post('/api/chat/send', async (req, res, ctx) => {
    const { message } = await req.json();

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        alert: {
          level: 'emergency',
          message: 'Inappropriate content detected',
          notificationSent: true,
        },
        message: {
          id: 'blocked-message-id',
          content: 'このメッセージは表示できません。',
          role: 'system',
          timestamp: new Date().toISOString(),
        },
      })
    );
  }),
};