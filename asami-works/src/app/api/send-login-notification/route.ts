import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, loginTime, userAgent } = await request.json();

    if (!email || !loginTime) {
      return NextResponse.json(
        { success: false, error: '必要な情報が不足しています' },
        { status: 400 }
      );
    }

    // ログイン通知をコンソールに出力
    // 本番環境では、ここでメール送信などの処理を行う
    console.log('=== Admin Login Notification ===');
    console.log('Email:', email);
    console.log('Login Time:', loginTime);
    console.log('User Agent:', userAgent);
    console.log('================================');

    // TODO: 実際のメール送信処理を実装する場合はここに追加
    // 例: Resend, SendGrid, Nodemailer などを使用

    return NextResponse.json({
      success: true,
      message: 'ログイン通知を送信しました',
    });
  } catch (error) {
    console.error('Login notification error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
