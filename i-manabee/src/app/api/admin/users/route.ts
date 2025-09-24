// 管理者用ユーザー管理API
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess, createAuthErrorResponse } from '@/lib/auth/middleware';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    // 管理者権限の確認
    const authResult = await verifyAdminAccess(request);

    if (!authResult.success) {
      return createAuthErrorResponse(authResult);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const searchQuery = searchParams.get('search');

    // ユーザー一覧の取得
    let query = adminDb.collection('users')
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (page > 1) {
      const offset = (page - 1) * limit;
      query = query.offset(offset);
    }

    const snapshot = await query.get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // パスワード等の機密情報は除外
      password: undefined,
      tokens: undefined
    }));

    // 検索フィルタリング
    let filteredUsers = users;
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(search) ||
        user.displayName?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      users: filteredUsers,
      pagination: {
        page,
        limit,
        total: snapshot.size,
        hasMore: snapshot.size === limit
      }
    });

  } catch (error) {
    console.error('Admin users API error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}