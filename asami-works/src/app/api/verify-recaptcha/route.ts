import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'トークンが提供されていません' },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY is not configured');
      return NextResponse.json(
        { success: false, error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    // Google reCAPTCHA APIでトークンを検証
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
    });

    const verifyData = await verifyResponse.json();

    if (verifyData.success && verifyData.score >= 0.5) {
      return NextResponse.json({
        success: true,
        score: verifyData.score,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'reCAPTCHA検証に失敗しました',
        score: verifyData.score,
      });
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
