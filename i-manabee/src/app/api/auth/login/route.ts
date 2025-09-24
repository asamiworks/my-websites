// ログインAPI（追加の検証・ログ記録用）
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// リクエストデータのバリデーションスキーマ
const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  rememberMe: z.boolean().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'バリデーションエラー',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { email, rememberMe = false } = validationResult.data;

    // ユーザーの存在確認
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return NextResponse.json(
          { error: 'メールアドレスまたはパスワードが正しくありません' },
          { status: 401 }
        );
      }
      throw error;
    }

    // アカウント状態の確認
    if (userRecord.disabled) {
      return NextResponse.json(
        { error: 'このアカウントは無効になっています' },
        { status: 403 }
      );
    }

    // Firestoreからユーザーデータ取得
    const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'ユーザーデータが見つかりません' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // ログイン記録の更新
    await adminDb.collection('users').doc(userRecord.uid).update({
      'profile.lastLoginAt': new Date(),
      'profile.loginCount': (userData?.profile?.loginCount || 0) + 1
    });

    // セキュリティログの記録
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await adminDb.collection('security_logs').add({
      userId: userRecord.uid,
      email: userRecord.email,
      action: 'login_attempt',
      status: 'success',
      timestamp: new Date(),
      metadata: {
        ip: clientIP,
        userAgent,
        rememberMe
      }
    });

    // レスポンスデータ
    const responseData = {
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified
      },
      userData,
      sessionConfig: {
        rememberMe,
        expiresIn: rememberMe ? '30d' : '24h'
      },
      message: 'ログインが成功しました'
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error: any) {
    console.error('ログインAPI エラー:', error);

    // セキュリティログ（失敗）の記録
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    try {
      await adminDb.collection('security_logs').add({
        action: 'login_attempt',
        status: 'failed',
        timestamp: new Date(),
        metadata: {
          ip: clientIP,
          userAgent,
          error: error.message
        }
      });
    } catch (logError) {
      console.error('セキュリティログ記録エラー:', logError);
    }

    return NextResponse.json(
      { error: 'ログイン処理でエラーが発生しました' },
      { status: 500 }
    );
  }
}