// PIN認証API
import { NextRequest, NextResponse } from 'next/server';
import { authenticateWithRateLimit, createAuthErrorResponse } from '@/lib/auth/middleware';
import { adminDb } from '@/lib/firebase/admin';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const pinVerificationSchema = z.object({
  childId: z.string().min(1, 'Child ID is required'),
  pin: z.string().length(4, 'PIN must be 4 digits').regex(/^\d{4}$/, 'PIN must be numeric')
});

export async function POST(request: NextRequest) {
  try {
    // 保護者認証チェック（レート制限付き）
    const authResult = await authenticateWithRateLimit(request, 'pin');

    if (!authResult.success) {
      return createAuthErrorResponse(authResult);
    }

    const parentId = authResult.user!.uid;

    // リクエストの検証
    const body = await request.json();
    const validation = pinVerificationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validation.error.errors
        },
        { status: 400 }
      );
    }

    const { childId, pin } = validation.data;

    // 子どもプロファイルの取得
    const childDoc = await adminDb.collection('child_profiles').doc(childId).get();

    if (!childDoc.exists) {
      return NextResponse.json(
        { error: 'Child profile not found' },
        { status: 404 }
      );
    }

    const childData = childDoc.data();

    // 保護者の確認
    if (childData?.parentId !== parentId) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // PINの検証
    const isValidPin = await bcrypt.compare(pin, childData.pin);

    if (!isValidPin) {
      // PIN試行回数の記録
      await adminDb.collection('pin_attempts').add({
        childId,
        parentId,
        timestamp: new Date(),
        success: false,
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      });

      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }

    // セッションの作成
    const sessionData = {
      childId,
      parentId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2時間
      lastActivity: new Date()
    };

    const sessionDoc = await adminDb.collection('child_sessions').add(sessionData);
    const sessionId = sessionDoc.id;

    // 成功ログ
    await adminDb.collection('pin_attempts').add({
      childId,
      parentId,
      sessionId,
      timestamp: new Date(),
      success: true,
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    // 子どもプロファイルの最終ログイン時刻更新
    await adminDb.collection('child_profiles').doc(childId).update({
      'profile.lastLoginAt': new Date()
    });

    // レスポンスにセッション情報を含める
    const response = NextResponse.json({
      success: true,
      sessionId,
      expiresAt: sessionData.expiresAt.toISOString(),
      child: {
        id: childId,
        name: childData.name,
        ageGroup: childData.ageGroup,
        grade: childData.grade,
        avatar: childData.profile?.avatar
      }
    });

    // セッションクッキーの設定
    response.cookies.set('pin-session', JSON.stringify({
      childId,
      sessionId,
      expiresAt: sessionData.expiresAt.getTime()
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 // 2時間（秒）
    });

    return response;

  } catch (error) {
    console.error('PIN verification error:', error);

    return NextResponse.json(
      { error: 'PIN verification failed' },
      { status: 500 }
    );
  }
}