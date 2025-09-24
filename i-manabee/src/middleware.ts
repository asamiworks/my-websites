// Next.js ミドルウェア - 基本的なルート保護とセキュリティ
import { NextRequest, NextResponse } from 'next/server';

// セキュリティヘッダー設定
const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '),
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.openai.com https://*.firebaseapp.com https://*.googleapis.com https://www.google-analytics.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ')
};

// IP許可リスト（管理者API用）
const ADMIN_IP_WHITELIST = [
  '127.0.0.1',
  '::1',
  // 本番環境では実際の管理者IPを設定
];

// ボットとクローラーの検出パターン
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python/i,
  /php/i
];

// 危険なパスパターン
const DANGEROUS_PATHS = [
  '/.env',
  '/admin',
  '/wp-admin',
  '/phpMyAdmin',
  '/.git',
  '/config',
  '/backup',
  '/test',
  '/debug'
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const ip = getClientIP(request);

  try {
    // 1. セキュリティヘッダーの設定
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // 2. 危険なパスへのアクセス拒否
    if (DANGEROUS_PATHS.some(pattern => pathname.startsWith(pattern))) {
      console.warn(`Dangerous path access attempt: ${pathname} from ${ip}`);
      return new NextResponse('Not Found', { status: 404 });
    }

    // 3. ボット/クローラーの検出と制限
    if (BOT_PATTERNS.some(pattern => pattern.test(userAgent))) {
      // 許可されたボット（検索エンジンなど）以外は制限
      const allowedBots = ['googlebot', 'bingbot', 'slurp'];
      const isAllowedBot = allowedBots.some(bot =>
        userAgent.toLowerCase().includes(bot)
      );

      if (!isAllowedBot) {
        console.warn(`Bot access denied: ${userAgent} from ${ip}`);
        return new NextResponse('Forbidden', { status: 403 });
      }

      // 許可されたボットでも一部のパスは制限
      if (pathname.startsWith('/api/') || pathname.startsWith('/chat')) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    // 4. 管理者API用IP制限
    if (pathname.startsWith('/api/admin/')) {
      if (!ADMIN_IP_WHITELIST.includes(ip)) {
        console.warn(`Admin API access denied from unauthorized IP: ${ip}`);
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    // 5. API パスの基本チェック（詳細な認証はAPI側で実施）
    if (pathname.startsWith('/api/')) {
      // OPTIONSリクエストの処理
      if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
          },
        });
      }
    }

    // 6. 基本的な認証チェック（詳細チェックはAPI側で実施）
    if (requiresAuthentication(pathname)) {
      const authToken = request.cookies.get('auth-token');
      const sessionCookie = request.cookies.get('session');

      // 基本的なトークンの存在チェックのみ（検証はAPI側で実施）
      if (!authToken && !sessionCookie) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // 7. 子ども向けページの年齢制限チェック
    if (pathname.startsWith('/chat') || pathname.startsWith('/child-login')) {
      // セッションから年齢グループを取得してCSPを調整
      const ageGroup = getAgeGroupFromRequest(request);
      if (ageGroup === 'junior') {
        // より厳格なCSPを適用
        response.headers.set('Content-Security-Policy', getStrictCSP());
      }
    }

    // 8. CORS設定（API用）
    if (pathname.startsWith('/api/')) {
      const origin = request.headers.get('origin');
      const allowedOrigins = [
        'https://i-manabee.com',
        'https://staging.i-manabee.com',
        'http://localhost:3000'
      ];

      if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
      }
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Max-Age', '86400');
    }

    // 9. 基本的なアクセスログの記録
    logSecurityEvent(request, 'access_granted', {
      pathname,
      ip,
      userAgent: userAgent.substring(0, 200),
    });

    return response;

  } catch (error) {
    console.error('Middleware error:', error);

    // エラーログ記録
    logSecurityEvent(request, 'middleware_error', {
      pathname,
      ip,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    // フォールバック - 基本的なセキュリティヘッダーのみ設定
    const fallbackResponse = NextResponse.next();
    fallbackResponse.headers.set('X-Frame-Options', 'DENY');
    fallbackResponse.headers.set('X-Content-Type-Options', 'nosniff');

    return fallbackResponse;
  }
}

// クライアントIPアドレスの取得
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  if (realIP) {
    return realIP;
  }

  return '127.0.0.1'; // フォールバック
}

// パス種別の判定（ログ用）
function getPathType(pathname: string): string {
  if (pathname.includes('/chat/')) return 'chat';
  if (pathname.includes('/auth/')) return 'auth';
  if (pathname.includes('/pin-verify')) return 'pin';
  if (pathname.includes('/admin/')) return 'admin';
  if (pathname.startsWith('/api/')) return 'api';
  return 'page';
}

// 認証が必要なページの判定
function requiresAuthentication(pathname: string): boolean {
  const protectedPaths = [
    '/dashboard',
    '/chat',
    '/profile',
    '/settings',
    '/child-login'
  ];

  return protectedPaths.some(path => pathname.startsWith(path));
}

// リクエストから年齢グループを取得（簡略版）
function getAgeGroupFromRequest(request: NextRequest): 'junior' | 'middle' | 'senior' {
  // 実際の実装では、セッションデータから取得
  const ageGroupCookie = request.cookies.get('age-group');
  return (ageGroupCookie?.value as 'junior' | 'middle' | 'senior') || 'middle';
}

// 厳格なCSP（小学生向け）
function getStrictCSP(): string {
  return [
    "default-src 'self'",
    "script-src 'self'", // unsafe-evalとunsafe-inlineを除去
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.firebaseapp.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
    "block-all-mixed-content"
  ].join('; ');
}

// セキュリティイベントのログ記録（Edge Runtime対応）
function logSecurityEvent(
  request: NextRequest,
  eventType: string,
  metadata: Record<string, any>
): void {
  try {
    // Edge Runtimeでは同期的なログ記録のみ
    console.log('[SECURITY]', {
      timestamp: new Date().toISOString(),
      eventType,
      url: request.url,
      method: request.method,
      pathType: getPathType(new URL(request.url).pathname),
      ...metadata
    });
  } catch (error) {
    // ログ記録の失敗は静かに処理
    console.error('Security logging failed:', error);
  }
}

// ミドルウェアの適用パス設定
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};