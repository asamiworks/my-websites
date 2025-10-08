import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { UserService } from '@/lib/firebase/firestore';
import { createCheckoutSession, createCustomer } from '@/lib/stripe/server';

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, plan } = await req.json();

    if (!priceId || !plan) {
      return NextResponse.json(
        { error: 'Price ID and plan are required' },
        { status: 400 }
      );
    }

    // ユーザー情報取得
    const userData = await UserService.getUser(req.user.uid);

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Stripe Customer取得または作成
    let customerId = userData.payment?.stripeCustomerId;

    if (!customerId) {
      const customer = await createCustomer({
        email: req.user.email!,
        name: userData.displayName || req.user.displayName,
        metadata: {
          userId: req.user.uid,
        },
      });
      customerId = customer.id;

      // Firestoreにcustomer IDを保存
      await UserService.updateUser(req.user.uid, {
        payment: {
          ...userData.payment,
          stripeCustomerId: customerId,
        },
      });
    }

    // Checkout Session作成
    const session = await createCheckoutSession({
      customerId,
      customerEmail: req.user.email!,
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: req.user.uid,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout session creation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
});