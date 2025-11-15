import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

// ランダムパスワード生成
function generatePassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, clientName, clientId } = body;

    // バリデーション
    if (!email || !clientName || !clientId) {
      return NextResponse.json(
        { error: '必須パラメータが不足しています' },
        { status: 400 }
      );
    }

    // 初期パスワードを生成
    const initialPassword = generatePassword(12);

    // Firebase Authenticationユーザーを作成
    const userRecord = await auth.createUser({
      email,
      password: initialPassword,
      displayName: clientName,
      emailVerified: false,
    });

    // カスタムクレームを設定（クライアントIDを紐付け）
    await auth.setCustomUserClaims(userRecord.uid, {
      clientId,
      role: 'client',
    });

    return NextResponse.json({
      success: true,
      uid: userRecord.uid,
      initialPassword,
    });

  } catch (error: any) {
    console.error('Error creating auth user:', error);

    // Firebase Authエラーのハンドリング
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'ユーザー作成に失敗しました' },
      { status: 500 }
    );
  }
}
