import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId is required' },
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

    if (!clientData) {
      return NextResponse.json(
        { error: 'Client data not found' },
        { status: 404 }
      );
    }

    // Stripeの支払い方法を削除
    if (clientData.stripePaymentMethodId) {
      try {
        await stripe.paymentMethods.detach(clientData.stripePaymentMethodId);
      } catch (stripeError: any) {
        console.error('Stripe payment method deletion error:', stripeError);
        // Stripeでの削除に失敗してもFirestoreは更新する
      }
    }

    // Firestoreのカード情報をクリア
    await db.collection('clients').doc(clientId).update({
      stripePaymentMethodId: null,
      cardLast4: null,
      cardBrand: null,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'カード情報を削除しました',
    });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json(
      { error: 'カード情報の削除に失敗しました' },
      { status: 500 }
    );
  }
}
