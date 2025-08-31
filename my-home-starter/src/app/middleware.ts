import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import admin from "firebase-admin";

// Firebase Admin SDK 初期化
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export async function middleware(req: NextRequest) {
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
  return NextResponse.next();
}

// Middlewareを適用するパス
export const config = {
  matcher: ["/admin/:path*"], // /admin 以下のすべてのルートに適用
};
