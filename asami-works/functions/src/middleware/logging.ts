import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // リクエスト情報を記録
  const requestId = Math.random().toString(36).substring(7);
  (req as any).requestId = requestId;
  
  logger.info('Incoming request', {
    ip: req.ip,
    method: req.method,
    path: req.path,
    userAgent: req.get('user-agent'),
    metadata: {
      requestId,
      headers: {
        'content-type': req.get('content-type'),
        'x-forwarded-for': req.get('x-forwarded-for'),
        'referer': req.get('referer')
      }
    }
  });
  
  // レスポンスのロギング
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      metadata: {
        requestId,
        responseSize: JSON.stringify(data).length
      }
    });
    
    // 異常なレスポンスの検出
    if (res.statusCode >= 400) {
      logger.warn('Error response sent', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        error: data,
        metadata: { requestId }
      });
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// セキュリティイベントのロギング
export const securityEventLogger = {
  logFailedAuth(ip: string, reason: string) {
    logger.security('Authentication failed', {
      ip,
      metadata: { reason }
    });
  },
  
  logSuspiciousActivity(ip: string, activity: string, details?: any) {
    logger.security('Suspicious activity detected', {
      ip,
      metadata: { activity, details }
    });
  },
  
  logRateLimitExceeded(ip: string, endpoint: string) {
    logger.security('Rate limit exceeded', {
      ip,
      path: endpoint,
      metadata: { type: 'RATE_LIMIT_VIOLATION' }
    });
  }
};