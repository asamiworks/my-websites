// src/app/api/auth/login/route.ts
// ログイン記録API（認証後の記録専用）
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// リクエストデータのバリデーションスキーマ
const loginRecordSchema = z.object({
  idToken: z.string().min(1, 'IDトークンが必要です'), // Firebaseの認証トークン
  rememberMe: z.boolean().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validationResult = loginRecordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'バリデーションエラー',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { idToken, rememberMe = false } = validationResult.data;

    // Firebase IDトークンの検証
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error: any) {
      console.error('トークン検証エラー:', error);
      return NextResponse.json(
        { error: '認証トークンが無効です' },
        { status: 401 }
      );
    }

    const uid = decodedToken.uid;
    const email = decodedToken.email;

    // ユーザーの存在確認
    let userRecord;
    try {
      userRecord = await adminAuth.getUser(uid);
    } catch (error: any) {
      console.error('ユーザー取得エラー:', error);
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // アカウント状態の確認
    if (userRecord.disabled) {
      return NextResponse.json(
        { error: 'このアカウントは無効になっています' },
        { status: 403 }
      );
    }

    // メール認証の確認（必要に応じて）
    if (!userRecord.emailVerified) {
      // 警告を返すが、ログインは許可
      console.warn('メール未認証のユーザーがログイン:', email);
    }

    // Firestoreからユーザーデータ取得
    const userDoc = await adminDb.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      // 初回ログインの場合、ユーザーデータを作成
      const newUserData = {
        id: uid,
        email: email || '',
        displayName: userRecord.displayName || '',
        plan: 'free',
        role: 'parent',
        createdAt: new Date(),
        lastLogin: new Date(),
        profile: {
          loginCount: 1,
          lastLoginAt: new Date()
        },
        settings: {
          emailNotifications: true,
          weeklyReports: true,
          safetyAlerts: true
        }
      };

      await adminDb.collection('users').doc(uid).set(newUserData);
      
      // レスポンス用にデータを準備
      const responseData = {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified
        },
        userData: newUserData,
        sessionConfig: {
          rememberMe,
          expiresIn: rememberMe ? '30d' : '24h'
        },
        isFirstLogin: true,
        message: '初回ログインが成功しました'
      };

      return NextResponse.json(responseData, { status: 200 });
    }

    const userData = userDoc.data();

    // ログイン記録の更新
    await adminDb.collection('users').doc(uid).update({
      'lastLogin': new Date(),
      'profile.lastLoginAt': new Date(),
      'profile.loginCount': (userData?.profile?.loginCount || 0) + 1
    });

    // セキュリティログの記録
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    request.headers.get('cf-connecting-ip') || // Cloudflare
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await adminDb.collection('security_logs').add({
      userId: uid,
      email: email,
      action: 'login_success',
      timestamp: new Date(),
      metadata: {
        ip: clientIP,
        userAgent,
        rememberMe,
        emailVerified: userRecord.emailVerified
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
      isFirstLogin: false,
      message: 'ログインが成功しました'
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error: any) {
    console.error('ログイン記録API エラー:', error);

    // セキュリティログ（失敗）の記録
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    request.headers.get('cf-connecting-ip') ||
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    try {
      await adminDb.collection('security_logs').add({
        action: 'login_record_failed',
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

// オプション: ログイン履歴取得API
export async function GET(request: NextRequest) {
  try {
    // Authorization headerからトークンを取得
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const idToken = authHeader.substring(7);

    // トークン検証
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json(
        { error: '無効なトークンです' },
        { status: 401 }
      );
    }

    const uid = decodedToken.uid;

    // 最近のログイン履歴を取得
    const logsSnapshot = await adminDb
      .collection('security_logs')
      .where('userId', '==', uid)
      .where('action', '==', 'login_success')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    const loginHistory = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
    }));

    return NextResponse.json({
      loginHistory,
      total: loginHistory.length
    });

  } catch (error) {
    console.error('ログイン履歴取得エラー:', error);
    return NextResponse.json(
      { error: 'ログイン履歴の取得に失敗しました' },
      { status: 500 }
    );
  }
}