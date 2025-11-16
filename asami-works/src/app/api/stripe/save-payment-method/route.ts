import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, paymentMethodId } = body;

    if (!clientId || !paymentMethodId) {
      return NextResponse.json(
        { error: 'clientId and paymentMethodId are required' },
        { status: 400 }
      );
    }

    // Firestoreからクライアント情報を取得
    const clientDoc = await db.collection('clients').doc(clientId).get();

    if (!clientDoc.exists) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    const clientData = clientDoc.data();
    const stripeCustomerId = clientData?.stripeCustomerId;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: 'Stripe customer not found' },
        { status: 400 }
      );
    }

    // 支払い方法を顧客にアタッチ
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    // デフォルトの支払い方法として設定
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // 支払い方法の詳細を取得
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // Firestoreに保存
    await db.collection('clients').doc(clientId).update({
      stripePaymentMethodId: paymentMethodId,
      cardLast4: paymentMethod.card?.last4 || null,
      cardBrand: paymentMethod.card?.brand || null,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Payment method saved successfully',
      cardLast4: paymentMethod.card?.last4,
      cardBrand: paymentMethod.card?.brand,
    });

  } catch (error: any) {
    console.error('Error saving payment method:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save payment method' },
      { status: 500 }
    );
  }
}
