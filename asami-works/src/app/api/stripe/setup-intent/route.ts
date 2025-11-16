import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId } = body;

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

    // Stripe顧客がまだ作成されていない場合は作成
    let stripeCustomerId = clientData?.stripeCustomerId;
    let needsNewCustomer = false;

    // 既存の顧客IDがある場合、現在のモードで存在するか確認
    if (stripeCustomerId) {
      try {
        await stripe.customers.retrieve(stripeCustomerId);
      } catch (error: any) {
        // 顧客が見つからない場合（異なるモード）、新しい顧客を作成
        if (error.code === 'resource_missing') {
          console.log('Existing customer not found in current mode, creating new one');
          needsNewCustomer = true;
        } else {
          throw error;
        }
      }
    } else {
      needsNewCustomer = true;
    }

    if (needsNewCustomer) {
      const customer = await stripe.customers.create({
        email: clientData?.email,
        name: clientData?.clientName,
        metadata: {
          clientId,
        },
      });

      stripeCustomerId = customer.id;

      // Firestoreに保存
      await db.collection('clients').doc(clientId).update({
        stripeCustomerId,
        updatedAt: new Date(),
      });
    }

    // SetupIntentを作成
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
    });

  } catch (error: any) {
    console.error('Error creating setup intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create setup intent' },
      { status: 500 }
    );
  }
}
