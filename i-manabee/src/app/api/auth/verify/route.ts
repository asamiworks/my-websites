// 認証トークン検証API
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, createAuthErrorResponse } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const authResult = await verifyAuthToken(request);

    if (!authResult.success) {
      return createAuthErrorResponse(authResult);
    }

    return NextResponse.json({
      success: true,
      user: {
        uid: authResult.user!.uid,
        email: authResult.user!.email,
        role: authResult.user!.role
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);

    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request); // GET でも POST と同じ処理
}