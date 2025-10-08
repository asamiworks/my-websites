import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { UserService } from '@/lib/firebase/firestore';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    // 署名検証
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    // イベントタイプ別処理
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;

  if (!userId || !plan) {
    throw new Error('Missing metadata');
  }

  // サブスクリプション情報を取得
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // Firestoreにサブスクリプション情報を保存
  await UserService.updateUser(userId, {
    plan: plan as any,
    payment: {
      stripeCustomerId: session.customer as string,
      subscriptionId: subscription.id,
      nextBillingDate: new Date(subscription.current_period_end * 1000).toISOString(),
    },
  });

  console.log('Subscription created successfully:', subscription.id);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.warn('Missing userId in subscription metadata');
    return;
  }

  // ユーザー情報を更新
  const userData = await UserService.getUser(userId);
  if (userData) {
    await UserService.updateUser(userId, {
      payment: {
        ...userData.payment,
        nextBillingDate: new Date(subscription.current_period_end * 1000).toISOString(),
      },
    });
  }

  console.log('Subscription updated successfully:', subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.warn('Missing userId in subscription metadata');
    return;
  }

  // プランを無料に戻す
  await UserService.updateUser(userId, {
    plan: 'free',
    payment: {
      stripeCustomerId: subscription.customer as string,
      subscriptionId: '',
      nextBillingDate: '',
    },
  });

  console.log('Subscription canceled for user:', userId);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // 請求成功時の処理（必要に応じて実装）
  console.log(`Invoice payment succeeded: ${invoice.id}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // 請求失敗時の処理（メール通知等）
  console.log(`Invoice payment failed: ${invoice.id}`);

  // TODO: 必要に応じてユーザーへの通知を実装
}