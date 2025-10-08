import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { UserService } from '@/lib/firebase/firestore';
import { createPortalSession } from '@/lib/stripe/server';

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ユーザー情報取得
    const userData = await UserService.getUser(req.user.uid);

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const customerId = userData.payment?.stripeCustomerId;

    if (!customerId) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // Portal Session作成
    const session = await createPortalSession({
      customerId,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Portal session creation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
});