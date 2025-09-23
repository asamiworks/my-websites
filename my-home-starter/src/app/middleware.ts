import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import admin from "firebase-admin";

// ===== メンテナンスモード設定 =====
// 環境変数から読み込み
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

// Firebase Admin SDK 初期化
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // ===== メンテナンスモードの処理（全ルート対象） =====
  if (MAINTENANCE_MODE) {
    // メンテナンス中でもアクセスを許可するパス
    const allowedPaths = [
      '/',                    // トップページ
      '/favicon.ico',        
      '/_next',              // Next.jsの静的ファイル
      '/images',             // 画像
      '/icons',              // アイコン
      '/google-icon.svg',    
      '/admin',              // 管理者は引き続きアクセス可能
      '/login',              // ログインページも許可
      '/api/auth',           // 認証APIも許可
    ];
    
    const isAllowed = allowedPaths.some(path => {
      if (path.includes('.') && !path.includes('*')) {
        return pathname === path;
      }
      return pathname === path || pathname.startsWith(path + '/');
    });
    
    // 管理者ページ以外で、許可されていないパスはリダイレクト
    if (!isAllowed && !pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  // ===== 既存の管理者認証処理（/admin/* のみ） =====
  if (pathname.startsWith('/admin')) {
    const authToken = req.cookies.get("firebase-auth-token");

    if (!authToken) {
      console.warn("[Middleware] 未ログイン: トークンが見つかりません");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      // トークンの検証
      const decodedToken = await admin.auth().verifyIdToken(authToken.value);

      if (!decodedToken.admin) {
        console.warn("[Middleware] 権限エラー: 管理者ではありません");
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("[Middleware] 認証エラー:", error.message);
      } else {
        console.error("[Middleware] 予期しないエラー:", error);
      }

      // トークンが無効の場合も /login にリダイレクト
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 認証成功時
    console.info("[Middleware] 認証成功");
  }
  
  return NextResponse.next();
}

// Middlewareを適用するパス（全ルートに拡張）
export const config = {
  matcher: [
    /*
     * 以下を除くすべてのパスにマッチ:
     * - api/auth (認証API)
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化)
     * - favicon.ico
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};