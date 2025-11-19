import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db, Timestamp } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceIds } = body;

    if (!invoiceIds || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return NextResponse.json(
        { error: 'invoiceIds array is required' },
        { status: 400 }
      );
    }

    const results: any[] = [];
    let totalAmount = 0;
    let succeeded = 0;
    let failed = 0;

    // 各請求書を順番に処理
    for (const invoiceId of invoiceIds) {
      try {
        // 請求書情報を取得
        const invoiceDoc = await db.collection('invoices').doc(invoiceId).get();

        if (!invoiceDoc.exists) {
          results.push({
            invoiceId,
            success: false,
            error: 'Invoice not found',
          });
          failed++;
          continue;
        }

        const invoiceData = invoiceDoc.data();

        if (!invoiceData) {
          results.push({
            invoiceId,
            success: false,
            error: 'Invoice data not found',
          });
          failed++;
          continue;
        }

        // 既に支払済みの場合はスキップ
        if (invoiceData.status === 'paid') {
          results.push({
            invoiceId,
            invoiceNumber: invoiceData.invoiceNumber,
            success: false,
            error: 'Already paid',
          });
          failed++;
          continue;
        }

        // クライアント情報を取得
        const clientDoc = await db.collection('clients').doc(invoiceData.clientId).get();

        if (!clientDoc.exists) {
          results.push({
            invoiceId,
            invoiceNumber: invoiceData.invoiceNumber,
            success: false,
            error: 'Client not found',
          });
          failed++;
          continue;
        }

        const clientData = clientDoc.data();

        if (!clientData) {
          results.push({
            invoiceId,
            invoiceNumber: invoiceData.invoiceNumber,
            success: false,
            error: 'Client data not found',
          });
          failed++;
          continue;
        }

        const stripeCustomerId = clientData.stripeCustomerId;
        const stripePaymentMethodId = clientData.stripePaymentMethodId;

        if (!stripeCustomerId || !stripePaymentMethodId) {
          results.push({
            invoiceId,
            invoiceNumber: invoiceData.invoiceNumber,
            success: false,
            error: 'No payment method registered',
          });
          failed++;
          continue;
        }

        // Payment Intentを作成して課金
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(invoiceData.totalAmount), // 円単位
          currency: 'jpy',
          customer: stripeCustomerId,
          payment_method: stripePaymentMethodId,
          off_session: true,
          confirm: true,
          description: `請求書 ${invoiceData.invoiceNumber}`,
          metadata: {
            invoiceId,
            invoiceNumber: invoiceData.invoiceNumber,
            clientId: invoiceData.clientId,
          },
        });

        if (paymentIntent.status === 'succeeded') {
          // 請求書を更新
          const invoiceUpdateData: Record<string, unknown> = {
            status: 'paid',
            paidAt: Timestamp.now(),
            stripePaymentIntentId: paymentIntent.id,
            paymentMethod: 'card',
            updatedAt: Timestamp.now(),
          };

          // クライアントのカード情報を保存
          if (clientData.cardLast4) {
            invoiceUpdateData.cardLast4 = clientData.cardLast4;
          }
          if (clientData.cardBrand) {
            invoiceUpdateData.cardBrand = clientData.cardBrand;
          }

          await db.collection('invoices').doc(invoiceId).update(invoiceUpdateData);

          // 支払い完了期間を更新（月額管理費の重複請求を防止）
          const clientUpdateData: Record<string, unknown> = {
            updatedAt: Timestamp.now(),
          };

          if (invoiceData.billingPeriodStart) {
            clientUpdateData.lastPaidPeriodStart = invoiceData.billingPeriodStart;
          }
          if (invoiceData.billingPeriodEnd) {
            clientUpdateData.lastPaidPeriodEnd = invoiceData.billingPeriodEnd;
            // 後方互換性のため lastPaidPeriod も更新
            const periodEnd = invoiceData.billingPeriodEnd;
            const endDate = periodEnd.toDate ? periodEnd.toDate() : new Date(periodEnd);
            const year = endDate.getFullYear();
            const month = String(endDate.getMonth() + 1).padStart(2, '0');
            clientUpdateData.lastPaidPeriod = `${year}-${month}`;
          }

          if (Object.keys(clientUpdateData).length > 1) {
            await db.collection('clients').doc(invoiceData.clientId).update(clientUpdateData);
          }

          totalAmount += invoiceData.totalAmount;
          succeeded++;

          results.push({
            invoiceId,
            invoiceNumber: invoiceData.invoiceNumber,
            success: true,
            amount: invoiceData.totalAmount,
            paymentIntentId: paymentIntent.id,
          });
        } else {
          results.push({
            invoiceId,
            invoiceNumber: invoiceData.invoiceNumber,
            success: false,
            error: `Payment failed with status: ${paymentIntent.status}`,
          });
          failed++;
        }
      } catch (error: any) {
        console.error(`Error processing invoice ${invoiceId}:`, error);

        let errorMessage = error.message || 'Payment failed';
        if (error.type === 'StripeCardError' || error.code === 'card_declined') {
          errorMessage = 'カードが拒否されました';
        } else if (error.code === 'insufficient_funds') {
          errorMessage = '残高不足です';
        }

        results.push({
          invoiceId,
          success: false,
          error: errorMessage,
        });
        failed++;
      }
    }

    return NextResponse.json({
      summary: {
        total: invoiceIds.length,
        succeeded,
        failed,
        totalAmount,
      },
      results,
    });

  } catch (error: any) {
    console.error('Error processing bulk payment:', error);
    return NextResponse.json(
      { error: error.message || 'Bulk payment failed' },
      { status: 500 }
    );
  }
}
