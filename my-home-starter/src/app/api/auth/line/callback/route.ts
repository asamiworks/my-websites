// src/app/api/auth/line/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=missing_params", request.url));
  }

  try {
    // 1. LINEのアクセストークンを取得
    const tokenResponse = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `${request.nextUrl.origin}/api/auth/line/callback`,
        client_id: process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID!,
        client_secret: process.env.LINE_LOGIN_CHANNEL_SECRET!,
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Token response error:", await tokenResponse.text());
      return NextResponse.redirect(new URL("/login?error=token_error", request.url));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Firebase Functions経由でカスタムトークンを取得（プロフィール取得も含む）
    // Firebase Functions v2のonCall関数を呼び出す
    const { initializeApp } = await import("firebase/app");
    const { getFunctions, httpsCallable } = await import("firebase/functions");
    
    const app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
    
    const functions = getFunctions(app, "asia-northeast1");
    const verifyLineToken = httpsCallable<{ accessToken: string }, { customToken: string; userData: any }>(
      functions,
      "verifyLineToken"
    );

    try {
      const result = await verifyLineToken({ accessToken });
      const { customToken, userData } = result.data;

      // 3. クライアントサイドでログインするためのトークンをセッションストレージに保存
      const redirectUrl = new URL("/auth/line/callback", request.url);
      redirectUrl.searchParams.set("token", customToken);
      redirectUrl.searchParams.set("userId", userData.uid);
      
      return NextResponse.redirect(redirectUrl);
      
    } catch (error) {
      console.error("Firebase Functions error:", error);
      return NextResponse.redirect(new URL("/login?error=auth_error", request.url));
    }

  } catch (error) {
    console.error("LINE callback error:", error);
    return NextResponse.redirect(new URL("/login?error=unexpected_error", request.url));
  }
}