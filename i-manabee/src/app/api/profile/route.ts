// プロファイル管理API
import { NextRequest, NextResponse } from 'next/server';
import { authenticateWithRateLimit, createAuthErrorResponse } from '@/lib/auth/middleware';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const authResult = await authenticateWithRateLimit(request, 'general');

    if (!authResult.success) {
      return createAuthErrorResponse(authResult);
    }

    const userId = authResult.user!.uid;

    // ユーザープロファイルの取得
    const userDoc = await adminDb.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // 子どもプロファイル一覧の取得
    const childrenSnapshot = await adminDb.collection('child_profiles')
      .where('parentId', '==', userId)
      .get();

    const children = childrenSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      profile: {
        id: userDoc.id,
        email: userData?.email,
        displayName: userData?.displayName,
        plan: userData?.plan || 'free',
        createdAt: userData?.createdAt,
        lastLoginAt: userData?.lastLoginAt,
        settings: userData?.settings || {}
      },
      children
    });

  } catch (error) {
    console.error('Profile API error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 認証チェック
    const authResult = await authenticateWithRateLimit(request, 'general');

    if (!authResult.success) {
      return createAuthErrorResponse(authResult);
    }

    const userId = authResult.user!.uid;
    const updates = await request.json();

    // 更新可能なフィールドのホワイトリスト
    const allowedFields = [
      'displayName',
      'settings.notifications',
      'settings.language',
      'settings.timezone'
    ];

    const sanitizedUpdates: any = {};
    Object.keys(updates).forEach(key => {
      if (allowedFields.some(field => key.startsWith(field))) {
        sanitizedUpdates[key] = updates[key];
      }
    });

    // プロファイルの更新
    await adminDb.collection('users').doc(userId).update({
      ...sanitizedUpdates,
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile update error:', error);

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}