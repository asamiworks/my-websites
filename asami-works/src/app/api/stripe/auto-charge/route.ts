import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db, Timestamp } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'invoiceId is required' },
        { status: 400 }
      );
    }

    // Firestoreから請求書情報を取得
    const invoiceDoc = await db.collection('invoices').doc(invoiceId).get();

    if (!invoiceDoc.exists) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const invoiceData = invoiceDoc.data();

    // 既に支払済みの場合
    if (invoiceData?.status === 'paid') {
      return NextResponse.json(
        { error: 'Invoice is already paid' },
        { status: 400 }
      );
    }

    // クライアント情報を取得
    const clientDoc = await db.collection('clients').doc(invoiceData?.clientId).get();

    if (!clientDoc.exists) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    const clientData = clientDoc.data();
    const stripeCustomerId = clientData?.stripeCustomerId;
    const stripePaymentMethodId = clientData?.stripePaymentMethodId;

    if (!stripeCustomerId || !stripePaymentMethodId) {
      return NextResponse.json(
        { error: 'クレジットカードが登録されていません' },
        { status: 400 }
      );
    }

    // Payment Intentを作成して即座に課金
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(invoiceData.totalAmount), // 円単位
      currency: 'jpy',
      customer: stripeCustomerId,
      payment_method: stripePaymentMethodId,
      off_session: true, // オフセッション（ユーザー不在時）の支払い
      confirm: true, // すぐに確定
      description: `請求書 ${invoiceData.invoiceNumber}`,
      metadata: {
        invoiceId,
        invoiceNumber: invoiceData.invoiceNumber,
        clientId: invoiceData.clientId,
      },
    });

    if (paymentIntent.status === 'succeeded') {
      // Firestoreの請求書を更新
      await db.collection('invoices').doc(invoiceId).update({
        status: 'paid',
        paidAt: Timestamp.now(),
        stripePaymentIntentId: paymentIntent.id,
        updatedAt: Timestamp.now(),
      });

      return NextResponse.json({
        success: true,
        message: '支払いが完了しました',
        paymentIntentId: paymentIntent.id,
      });
    } else {
      throw new Error(`Payment failed with status: ${paymentIntent.status}`);
    }

  } catch (error: any) {
    console.error('Error processing payment:', error);

    // Stripe特有のエラーハンドリング
    let errorMessage = error.message || 'Payment failed';

    if (error.type === 'StripeCardError') {
      errorMessage = 'カードが拒否されました: ' + error.message;
    } else if (error.code === 'card_declined') {
      errorMessage = 'カードが拒否されました';
    } else if (error.code === 'insufficient_funds') {
      errorMessage = '残高不足です';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
