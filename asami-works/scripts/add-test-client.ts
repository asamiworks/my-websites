import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { resolve } from 'path';

// .env.localを読み込む
config({ path: resolve(__dirname, '../.env.local') });

// Firebase設定（.env.localから）
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addTestClient() {
  try {
    console.log('📝 テストクライアントを追加中...');

    const testClient = {
      clientName: '【テスト】山田太郎様',
      email: 'test@example.com',
      phone: '090-1234-5678',
      address: '〒100-0001 東京都千代田区千代田1-1',
      contractStartDate: Timestamp.now(),
      productionFee: 330000,
      productionFeePaid: true,
      productionFeeBreakdown: {
        initialPayment: 330000,
        initialPaymentPaid: true,
      },
      managementFeeSchedule: [
        {
          fromDate: Timestamp.now(),
          monthlyFee: 5500,
          description: '月額管理費用',
        },
      ],
      paymentMethod: 'bank_transfer',
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      _testData: true, // テストデータであることを示すフラグ
    };

    const docRef = await addDoc(collection(db, 'clients'), testClient);

    console.log('✅ テストクライアントを追加しました！');
    console.log('クライアントID:', docRef.id);
    console.log('クライアント名:', testClient.clientName);
    console.log('月額管理費:', testClient.managementFeeSchedule[0].monthlyFee, '円');

    process.exit(0);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

addTestClient();
