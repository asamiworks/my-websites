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

    if (!invoiceData) {
      return NextResponse.json(
        { error: 'Invoice data not found' },
        { status: 404 }
      );
    }

    // 既に支払済みの場合
    if (invoiceData.status === 'paid') {
      return NextResponse.json(
        { alreadyPaid: true, message: 'Invoice is already paid' },
        { status: 200 }
      );
    }

    // 既に決済処理が開始されている場合（stripePaymentIntentIdが存在する場合）
    if (invoiceData.stripePaymentIntentId) {
      // 既存のPayment Intentの状態を確認
      try {
        const existingIntent = await stripe.paymentIntents.retrieve(invoiceData.stripePaymentIntentId);
        if (existingIntent.status === 'succeeded') {
          // 既に成功している場合は請求書を更新して終了
          await db.collection('invoices').doc(invoiceId).update({
            status: 'paid',
            paidAmount: invoiceData.totalAmount,
            paidAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
          return NextResponse.json(
            { alreadyPaid: true, message: 'Payment already completed' },
            { status: 200 }
          );
        } else if (existingIntent.status === 'processing') {
          return NextResponse.json(
            { processing: true, message: 'Payment is still processing' },
            { status: 200 }
          );
        }
        // その他の状態（canceled, requires_action等）の場合は新規決済を許可
      } catch (err) {
        // Payment Intentが見つからない等のエラーは無視して新規決済を許可
        console.log('Could not retrieve existing payment intent, proceeding with new charge');
      }
    }

    // クライアント情報を取得
    const clientDoc = await db.collection('clients').doc(invoiceData.clientId).get();

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

    const stripeCustomerId = clientData.stripeCustomerId;
    const stripePaymentMethodId = clientData.stripePaymentMethodId;

    if (!stripeCustomerId || !stripePaymentMethodId) {
      return NextResponse.json(
        { error: 'クレジットカードが登録されていません' },
        { status: 400 }
      );
    }

    // 冪等性キーを生成（同じ請求書に対する重複リクエストを防止）
    const idempotencyKey = `invoice_${invoiceId}_${invoiceData.invoiceNumber}`;

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
    }, {
      idempotencyKey,
    });

    if (paymentIntent.status === 'succeeded') {
      // Firestoreの請求書を更新
      await db.collection('invoices').doc(invoiceId).update({
        status: 'paid',
        paidAmount: invoiceData.totalAmount,
        paidAt: Timestamp.now(),
        stripePaymentIntentId: paymentIntent.id,
        paymentMethod: 'credit_card',
        updatedAt: Timestamp.now(),
      });

      // 一回払い項目（制作費）の支払い済みフラグを更新
      if (clientData.productionFeeBreakdown && invoiceData.items) {
        // 現在のproductionFeeBreakdownを取得（なければ空オブジェクト）
        const currentBreakdown = clientData.productionFeeBreakdown || {};
        const items = invoiceData.items;

        // フラグを更新（既存の値を保持しつつ更新）
        const updatedBreakdown = { ...currentBreakdown };

        if (items.some((item: any) => item.description?.includes('初期費用'))) {
          updatedBreakdown.initialPaymentPaid = true;
        }

        if (items.some((item: any) => item.description?.includes('中間費用'))) {
          updatedBreakdown.intermediatePaymentPaid = true;
        }

        if (items.some((item: any) => item.description?.includes('最終金'))) {
          updatedBreakdown.finalPaymentPaid = true;
        }

        // フラグが更新される場合のみ実行
        const hasChanges = items.some((item: any) =>
          item.description?.includes('初期費用') ||
          item.description?.includes('中間費用') ||
          item.description?.includes('最終金')
        );

        if (hasChanges) {
          await db.collection('clients').doc(invoiceData.clientId).update({
            productionFeeBreakdown: updatedBreakdown,
            updatedAt: Timestamp.now(),
          });
        }
      }

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
