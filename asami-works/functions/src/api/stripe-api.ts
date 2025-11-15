import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const cors = require('cors');

// CORS設定
const corsHandler = cors({
  origin: [
    'https://asami-works.com',
    'https://asamiworks-679b3.web.app',
    'https://asamiworks-679b3.firebaseapp.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

const db = getFirestore();

// Stripe初期化（遅延初期化）
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripeInstance = new Stripe(apiKey, {
      apiVersion: '2025-10-29.clover',
    });
  }
  return stripeInstance;
}

/**
 * Stripe Checkout Sessionを作成
 */
export const createCheckoutSession = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    // OPTIONSリクエストに対応
    if (request.method === 'OPTIONS') {
      response.status(200).send();
      return;
    }

    // POSTメソッドのみ許可
    if (request.method !== 'POST') {
      response.status(405).send('Method Not Allowed');
      return;
    }

    try {
      const { invoiceId } = request.body;

      if (!invoiceId) {
        response.status(400).json({
          success: false,
          message: '請求書IDが指定されていません'
        });
        return;
      }

      // 請求書を取得
      const invoiceDoc = await db.collection('invoices').doc(invoiceId).get();

      if (!invoiceDoc.exists) {
        response.status(404).json({
          success: false,
          message: '請求書が見つかりません'
        });
        return;
      }

      const invoice = invoiceDoc.data();

      if (!invoice) {
        response.status(404).json({
          success: false,
          message: '請求書データが不正です'
        });
        return;
      }

      // 既に支払い済みの場合はエラー
      if (invoice.status === 'paid') {
        response.status(400).json({
          success: false,
          message: 'この請求書は既に支払い済みです'
        });
        return;
      }

      // Stripe Checkout Sessionを作成
      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'jpy',
              product_data: {
                name: `請求書 #${invoice.invoiceNumber}`,
                description: `${invoice.clientName} 様宛`,
              },
              unit_amount: Math.round(invoice.totalAmount),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${request.headers.origin || 'https://asami-works.com'}/mypage/invoices/${invoiceId}/success`,
        cancel_url: `${request.headers.origin || 'https://asami-works.com'}/mypage/invoices/${invoiceId}`,
        metadata: {
          invoiceId: invoiceId,
          clientId: invoice.clientId,
        },
        customer_email: invoice.clientEmail || undefined,
      });

      // Checkout Session IDを請求書に保存
      await db.collection('invoices').doc(invoiceId).update({
        stripeCheckoutSessionId: session.id,
        updatedAt: Timestamp.now(),
      });

      response.json({
        success: true,
        sessionId: session.id,
        url: session.url,
      });

    } catch (error) {
      console.error('Stripe Checkout Session creation error:', error);
      response.status(500).json({
        success: false,
        message: 'Checkout Sessionの作成に失敗しました',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
});

/**
 * Stripe Webhookハンドラー
 */
export const stripeWebhook = functions.https.onRequest(async (request, response) => {
  const sig = request.headers['stripe-signature'];

  if (!sig) {
    response.status(400).send('Stripe signature missing');
    return;
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    event = getStripe().webhooks.constructEvent(
      request.rawBody,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    response.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return;
  }

  // イベントタイプに応じて処理
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  response.json({ received: true });
});

/**
 * Checkout Session完了時の処理
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);

  const invoiceId = session.metadata?.invoiceId;

  if (!invoiceId) {
    console.error('Invoice ID not found in session metadata');
    return;
  }

  try {
    await db.collection('invoices').doc(invoiceId).update({
      status: 'paid',
      paidAt: Timestamp.now(),
      paymentMethod: 'card',
      stripePaymentIntentId: session.payment_intent as string,
      updatedAt: Timestamp.now(),
    });

    console.log(`Invoice ${invoiceId} marked as paid`);
  } catch (error) {
    console.error('Error updating invoice:', error);
  }
}

/**
 * Payment Intent成功時の処理
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  // 追加の処理が必要な場合はここに実装
}

/**
 * Payment Intent失敗時の処理
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id);
  // 失敗時の通知などを実装
}
