import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import * as functions from 'firebase-functions';

// IPアドレス取得関数
const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'] as string;
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] as string || req.ip || 'unknown';
};

// レート制限作成関数
export const createRateLimiter = (options: {
  windowMs?: number;
  max?: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // デフォルト15分
    max: options.max || 10, // デフォルト10リクエスト
    message: options.message || 'リクエスト数が上限に達しました。しばらくしてからお試しください。',
    standardHeaders: true, // `RateLimit-*` headers
    legacyHeaders: false, // `X-RateLimit-*` headers を無効化
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    
    // Firebase Functions での IP 取得
    keyGenerator: (req: Request) => {
      return getClientIp(req);
    },
    
    // レート制限に達した時のハンドラー
    handler: (req: Request, res: Response) => {
      functions.logger.warn('Rate limit exceeded', {
        ip: getClientIp(req),
        path: req.path,
        method: req.method,
        headers: {
          'user-agent': req.headers['user-agent'],
          'referer': req.headers['referer']
        }
      });
      
      res.status(429).json({
        error: 'Too Many Requests',
        message: options.message || 'リクエスト数が上限に達しました。',
        retryAfter: res.getHeader('Retry-After')
      });
    },
    
    // リクエストをスキップする条件
    skip: (req: Request) => {
      // 開発環境ではスキップ（オプション）
      if (process.env.FUNCTIONS_EMULATOR === 'true' && process.env.SKIP_RATE_LIMIT === 'true') {
        return true;
      }
      return false;
    }
  });
};

// メール送信用の厳しいレート制限
export const emailRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1時間
  max: 5, // 1時間に5通まで
  message: '送信制限に達しました。1時間後に再度お試しください。',
  skipSuccessfulRequests: false // 成功したリクエストもカウント
});

// API 全般用の標準レート制限
export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 15分に100リクエストまで
  message: 'APIリクエスト数が上限に達しました。15分後に再度お試しください。'
});

// Instagram API用の緩いレート制限
export const instagramRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1分
  max: 30, // 1分に30リクエストまで
  message: 'Instagram APIのリクエスト制限に達しました。'
});