import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db, Timestamp } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId, amount, reason } = body;

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

    if (!invoiceData) {
      return NextResponse.json(
        { error: 'Invoice data not found' },
        { status: 404 }
      );
    }

    // stripePaymentIntentIdがない場合は返金不可
    if (!invoiceData.stripePaymentIntentId) {
      return NextResponse.json(
        { error: 'この請求書にはStripe決済情報がありません' },
        { status: 400 }
      );
    }

    // Payment Intentの状態を確認
    const paymentIntent = await stripe.paymentIntents.retrieve(invoiceData.stripePaymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: '決済が完了していないため返金できません' },
        { status: 400 }
      );
    }

    // 返金金額を決定（指定がなければ全額返金）
    const refundAmount = amount ? Math.round(amount) : paymentIntent.amount;

    // 返金を実行
    const refund = await stripe.refunds.create({
      payment_intent: invoiceData.stripePaymentIntentId,
      amount: refundAmount,
      reason: reason || 'requested_by_customer',
    });

    if (refund.status === 'succeeded' || refund.status === 'pending') {
      // Firestoreの請求書を更新
      const updateData: any = {
        refundId: refund.id,
        refundAmount,
        refundedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // 全額返金の場合はステータスをrefundedに変更
      if (refundAmount >= paymentIntent.amount) {
        updateData.status = 'refunded';
      } else {
        // 部分返金の場合はpartially_refundedに
        updateData.status = 'partially_refunded';
        updateData.partialRefundAmount = refundAmount;
      }

      await db.collection('invoices').doc(invoiceId).update(updateData);

      return NextResponse.json({
        success: true,
        message: refundAmount >= paymentIntent.amount
          ? '全額返金が完了しました'
          : `¥${refundAmount.toLocaleString()}の部分返金が完了しました`,
        refundId: refund.id,
        refundAmount,
        refundStatus: refund.status,
      });
    } else {
      throw new Error(`Refund failed with status: ${refund.status}`);
    }

  } catch (error: any) {
    console.error('Error processing refund:', error);

    let errorMessage = error.message || 'Refund failed';

    // Stripe特有のエラーハンドリング
    if (error.type === 'StripeInvalidRequestError') {
      if (error.message.includes('has already been refunded')) {
        errorMessage = 'この決済は既に返金されています';
      } else if (error.message.includes('greater than unrefunded amount')) {
        errorMessage = '返金金額が決済金額を超えています';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
