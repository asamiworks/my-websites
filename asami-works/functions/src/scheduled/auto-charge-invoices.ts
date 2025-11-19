import { onDocumentCreated, onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Firebase Admin初期化（index.tsで初期化されていない場合）
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

// Stripeインスタンスを取得する関数（遅延初期化）
let stripeInstance: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripeInstance = new Stripe(apiKey, {
      apiVersion: '2025-10-29.clover',
    });
  }
  return stripeInstance;
}

/**
 * 請求書が作成されたときに自動的にクレジットカード決済を実行
 *
 * 条件:
 * - ステータスが 'sent'
 * - 支払い方法が 'credit_card'
 * - Stripeの支払い方法が登録されている
 * - まだ支払われていない
 */
export const autoChargeInvoiceOnCreate = onDocumentCreated({
  document: 'invoices/{invoiceId}',
  timeoutSeconds: 540,
  memory: '512MiB'
}, async (event) => {
  const invoiceId = event.params.invoiceId;
  const invoiceData = event.data?.data();

  if (!invoiceData) {
    console.log(`Invoice ${invoiceId}: No data found`);
    return;
  }

  console.log(`Invoice ${invoiceId} created. Status: ${invoiceData.status}`);

  // 自動決済の条件をチェック
  if (invoiceData.status !== 'sent') {
    console.log(`Invoice ${invoiceId}: Status is not 'sent', skipping auto-charge`);
    return;
  }

  // クライアント情報を取得
  const clientId = invoiceData.clientId;
  if (!clientId) {
    console.log(`Invoice ${invoiceId}: No client ID found`);
    return;
  }

  const clientDoc = await db.collection('clients').doc(clientId).get();
  if (!clientDoc.exists) {
    console.error(`Invoice ${invoiceId}: Client ${clientId} not found`);
    return;
  }

  const clientData = clientDoc.data();

  // クレジットカード支払いでない場合はスキップ
  if (clientData?.paymentMethod !== 'credit_card') {
    console.log(`Invoice ${invoiceId}: Payment method is not credit_card (${clientData?.paymentMethod}), skipping auto-charge`);
    return;
  }

  // Stripe情報が登録されているかチェック
  const customerId = clientData?.stripeCustomerId;
  const paymentMethodId = clientData?.stripePaymentMethodId;

  if (!customerId || !paymentMethodId) {
    console.log(`Invoice ${invoiceId}: No Stripe payment method registered for client ${clientData?.clientName}`);
    return;
  }

  try {
    console.log(`Invoice ${invoiceId}: Starting auto-charge for ${clientData?.clientName} (${invoiceData.totalAmount}円)`);

    // Payment Intentを作成して決済
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(invoiceData.totalAmount || 0), // 円単位
      currency: 'jpy',
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true, // オフセッション決済（自動決済）
      confirm: true, // 即座に確認
      metadata: {
        invoiceId,
        clientId,
        invoiceNumber: invoiceData.invoiceNumber || '',
        autoCharged: 'true',
      },
      description: `請求書 ${invoiceData.invoiceNumber} - ${clientData?.clientName}`,
    });

    // 決済成功時の処理
    if (paymentIntent.status === 'succeeded') {
      const invoiceUpdateData: any = {
        status: 'paid',
        paidAmount: invoiceData.totalAmount,
        paidDate: admin.firestore.Timestamp.now(),
        stripePaymentIntentId: paymentIntent.id,
        paymentMethod: 'card',
        autoCharged: true,
        updatedAt: admin.firestore.Timestamp.now(),
      };

      // クライアントのカード情報を保存
      if (clientData?.cardLast4) {
        invoiceUpdateData.cardLast4 = clientData.cardLast4;
      }
      if (clientData?.cardBrand) {
        invoiceUpdateData.cardBrand = clientData.cardBrand;
      }

      await db.collection('invoices').doc(invoiceId).update(invoiceUpdateData);

      // 一回払い項目（制作費）の支払い済みフラグを更新
      if (clientData?.productionFeeBreakdown && invoiceData.items) {
        const updateData: any = {
          updatedAt: admin.firestore.Timestamp.now(),
        };

        const items = invoiceData.items;

        // 初期費用が含まれているかチェック
        if (items.some((item: any) => item.description?.includes('初期費用'))) {
          updateData['productionFeeBreakdown.initialPaymentPaid'] = true;
        }

        // 中間費用が含まれているかチェック
        if (items.some((item: any) => item.description?.includes('中間費用'))) {
          updateData['productionFeeBreakdown.intermediatePaymentPaid'] = true;
        }

        // 最終金が含まれているかチェック
        if (items.some((item: any) => item.description?.includes('最終金'))) {
          updateData['productionFeeBreakdown.finalPaymentPaid'] = true;
        }

        // フラグが更新される場合のみ実行
        if (Object.keys(updateData).length > 1) {
          await db.collection('clients').doc(clientId).update(updateData);
          console.log(`Invoice ${invoiceId}: Updated production fee paid flags`);
        }
      }

      console.log(`Invoice ${invoiceId}: Auto-charge succeeded. Payment Intent: ${paymentIntent.id}`);
    } else {
      console.error(`Invoice ${invoiceId}: Payment status is ${paymentIntent.status}`);

      // 決済失敗をログに記録
      await db.collection('invoices').doc(invoiceId).update({
        lastChargeAttempt: admin.firestore.Timestamp.now(),
        lastChargeError: `Payment status: ${paymentIntent.status}`,
        updatedAt: admin.firestore.Timestamp.now(),
      });
    }
  } catch (error: any) {
    console.error(`Invoice ${invoiceId}: Auto-charge failed:`, error);

    // エラー情報を記録
    await db.collection('invoices').doc(invoiceId).update({
      lastChargeAttempt: admin.firestore.Timestamp.now(),
      lastChargeError: error.message || 'Unknown error',
      lastChargeErrorCode: error.code || null,
      updatedAt: admin.firestore.Timestamp.now(),
    });

    // Stripeカードエラーの場合は詳細をログ
    if (error.type === 'StripeCardError') {
      console.error(`Invoice ${invoiceId}: Card error - ${error.code}: ${error.message}`);
    }
  }
});

/**
 * 既存の請求書のステータスが 'sent' に変更されたときに自動決済
 * （手動で請求書を送信した場合など）
 */
export const autoChargeInvoiceOnUpdate = onDocumentWritten({
  document: 'invoices/{invoiceId}',
  timeoutSeconds: 540,
  memory: '512MiB'
}, async (event) => {
  const invoiceId = event.params.invoiceId;
  const beforeData = event.data?.before.data();
  const afterData = event.data?.after.data();

  if (!afterData) {
    console.log(`Invoice ${invoiceId}: Document deleted`);
    return;
  }

  // 新規作成の場合はスキップ（onDocumentCreatedで処理される）
  if (!beforeData) {
    return;
  }

  // ステータスが 'sent' に変更された場合のみ処理
  const wasNotSent = beforeData.status !== 'sent';
  const isNowSent = afterData.status === 'sent';

  if (!wasNotSent || !isNowSent) {
    return;
  }

  console.log(`Invoice ${invoiceId}: Status changed to 'sent'`);

  // 既に支払い済みの場合はスキップ
  if (afterData.status === 'paid' || afterData.paidDate) {
    console.log(`Invoice ${invoiceId}: Already paid, skipping`);
    return;
  }

  // クライアント情報を取得
  const clientId = afterData.clientId;
  if (!clientId) {
    console.log(`Invoice ${invoiceId}: No client ID found`);
    return;
  }

  const clientDoc = await db.collection('clients').doc(clientId).get();
  if (!clientDoc.exists) {
    console.error(`Invoice ${invoiceId}: Client ${clientId} not found`);
    return;
  }

  const clientData = clientDoc.data();

  // クレジットカード支払いでない場合はスキップ
  if (clientData?.paymentMethod !== 'credit_card') {
    console.log(`Invoice ${invoiceId}: Payment method is not credit_card, skipping auto-charge`);
    return;
  }

  // Stripe情報が登録されているかチェック
  const customerId = clientData?.stripeCustomerId;
  const paymentMethodId = clientData?.stripePaymentMethodId;

  if (!customerId || !paymentMethodId) {
    console.log(`Invoice ${invoiceId}: No Stripe payment method registered`);
    return;
  }

  try {
    console.log(`Invoice ${invoiceId}: Starting auto-charge (status updated) for ${clientData?.clientName}`);

    // Payment Intentを作成して決済
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(afterData.totalAmount || 0),
      currency: 'jpy',
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      metadata: {
        invoiceId,
        clientId,
        invoiceNumber: afterData.invoiceNumber || '',
        autoCharged: 'true',
        trigger: 'status_update',
      },
      description: `請求書 ${afterData.invoiceNumber} - ${clientData?.clientName}`,
    });

    if (paymentIntent.status === 'succeeded') {
      const invoiceUpdateData: any = {
        status: 'paid',
        paidAmount: afterData.totalAmount,
        paidDate: admin.firestore.Timestamp.now(),
        stripePaymentIntentId: paymentIntent.id,
        paymentMethod: 'card',
        autoCharged: true,
        updatedAt: admin.firestore.Timestamp.now(),
      };

      // クライアントのカード情報を保存
      if (clientData?.cardLast4) {
        invoiceUpdateData.cardLast4 = clientData.cardLast4;
      }
      if (clientData?.cardBrand) {
        invoiceUpdateData.cardBrand = clientData.cardBrand;
      }

      await db.collection('invoices').doc(invoiceId).update(invoiceUpdateData);

      // 一回払い項目（制作費）の支払い済みフラグを更新
      if (clientData?.productionFeeBreakdown && afterData.items) {
        const updateData: any = {
          updatedAt: admin.firestore.Timestamp.now(),
        };

        const items = afterData.items;

        // 初期費用が含まれているかチェック
        if (items.some((item: any) => item.description?.includes('初期費用'))) {
          updateData['productionFeeBreakdown.initialPaymentPaid'] = true;
        }

        // 中間費用が含まれているかチェック
        if (items.some((item: any) => item.description?.includes('中間費用'))) {
          updateData['productionFeeBreakdown.intermediatePaymentPaid'] = true;
        }

        // 最終金が含まれているかチェック
        if (items.some((item: any) => item.description?.includes('最終金'))) {
          updateData['productionFeeBreakdown.finalPaymentPaid'] = true;
        }

        // フラグが更新される場合のみ実行
        if (Object.keys(updateData).length > 1) {
          await db.collection('clients').doc(clientId).update(updateData);
          console.log(`Invoice ${invoiceId}: Updated production fee paid flags (status update)`);
        }
      }

      console.log(`Invoice ${invoiceId}: Auto-charge succeeded (status update)`);
    } else {
      console.error(`Invoice ${invoiceId}: Payment status is ${paymentIntent.status}`);

      await db.collection('invoices').doc(invoiceId).update({
        lastChargeAttempt: admin.firestore.Timestamp.now(),
        lastChargeError: `Payment status: ${paymentIntent.status}`,
        updatedAt: admin.firestore.Timestamp.now(),
      });
    }
  } catch (error: any) {
    console.error(`Invoice ${invoiceId}: Auto-charge failed (status update):`, error);

    await db.collection('invoices').doc(invoiceId).update({
      lastChargeAttempt: admin.firestore.Timestamp.now(),
      lastChargeError: error.message || 'Unknown error',
      lastChargeErrorCode: error.code || null,
      updatedAt: admin.firestore.Timestamp.now(),
    });
  }
});
