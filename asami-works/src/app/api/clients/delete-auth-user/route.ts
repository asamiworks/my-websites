import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authUid } = body;

    // バリデーション
    if (!authUid) {
      return NextResponse.json(
        { error: 'authUid is required' },
        { status: 400 }
      );
    }

    // Firebase Authenticationからユーザーを削除
    await auth.deleteUser(authUid);

    return NextResponse.json({
      success: true,
      message: 'ユーザーを削除しました',
    });

  } catch (error: any) {
    console.error('Error deleting auth user:', error);

    // Firebase Authエラーのハンドリング
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'ユーザー削除に失敗しました' },
      { status: 500 }
    );
  }
}
