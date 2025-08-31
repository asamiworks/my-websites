import { Request, Response, NextFunction } from 'express';

// カスタムセキュリティヘッダー
export const customSecurityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // 基本的なセキュリティヘッダー
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  
  // HSTS（HTTPS強制）
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // CSP（Content Security Policy）
  const cspDirectives = [
    "default-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://www.google.com/recaptcha/",
    "frame-src https://www.google.com/recaptcha/",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', cspDirectives);
  
  // API 専用のヘッダー
  if (req.path.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  // CORS プリフライトリクエストのキャッシュ
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400'); // 24時間
  }
  
  next();
};

// リクエストサニタイゼーション
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  // SQLインジェクション対策の基本的なパターン
  const sqlInjectionPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
    /(--|\/\*|\*\/|xp_|sp_)/gi,
    /(<script|<\/script|javascript:|onerror=|onload=)/gi
  ];
  
  // リクエストボディのチェック
  if (req.body && typeof req.body === 'object') {
    const bodyString = JSON.stringify(req.body);
    
    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(bodyString)) {
        res.status(400).json({
          error: 'Bad Request',
          message: '不正なリクエストが検出されました'
        });
        return;
      }
    }
  }
  
  // URLパラメータのチェック
  const urlString = req.originalUrl;
  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(urlString)) {
      res.status(400).json({
        error: 'Bad Request',
        message: '不正なリクエストが検出されました'
      });
      return;
    }
  }
  
  next();
};

// リクエストサイズ制限
export const requestSizeLimit = (maxSize: string = '10mb') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.get('content-length');
    
    if (contentLength) {
      const bytes = parseInt(contentLength);
      const maxBytes = parseSize(maxSize);
      
      if (bytes > maxBytes) {
        res.status(413).json({
          error: 'Payload Too Large',
          message: 'リクエストサイズが大きすぎます'
        });
        return;
      }
    }
    
    next();
  };
};

// サイズ文字列をバイトに変換
function parseSize(size: string): number {
  const units: { [key: string]: number } = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024
  };
  
  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([a-z]+)$/);
  if (!match) {
    throw new Error('Invalid size format');
  }
  
  const [, value, unit] = match;
  return parseFloat(value) * (units[unit] || 1);
}

// セキュリティレスポンスヘッダーの削除（情報漏洩防止）
export const removeSecurityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  next();
};

// IP ホワイトリスト（必要に応じて使用）
export const ipWhitelist = (allowedIps: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const forwarded = req.headers['x-forwarded-for'] as string;
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : 
                     req.headers['x-real-ip'] as string || 
                     req.ip || 'unknown';
    
    if (!allowedIps.includes(clientIp)) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'アクセスが拒否されました'
      });
      return;
    }
    
    next();
  };
};