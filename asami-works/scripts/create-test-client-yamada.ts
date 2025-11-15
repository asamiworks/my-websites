import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';

// Firebase Admin初期化
if (!getApps().length) {
  const serviceAccountPath = join(process.cwd(), 'firebase-admin-key.json');
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = getFirestore();

async function createYamadaClient() {
  try {
    // マイページトークンを生成
    const mypageToken = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const clientData = {
      clientName: '山田太郎',
      email: 'yamada.taro@example.com',
      phone: '090-1234-5678',
      address: '東京都渋谷区恵比寿1-1-1',
      paymentMethod: 'credit_card',
      mypageToken,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await db.collection('clients').add(clientData);

    console.log('✅ 山田太郎様のアカウントを作成しました！');
    console.log('');
    console.log('📋 クライアント情報:');
    console.log(`  - ID: ${docRef.id}`);
    console.log(`  - 名前: ${clientData.clientName}`);
    console.log(`  - メール: ${clientData.email}`);
    console.log(`  - 電話: ${clientData.phone}`);
    console.log(`  - 支払い方法: クレジットカード`);
    console.log('');
    console.log('🔗 マイページURL:');
    console.log(`  http://localhost:3000/mypage/${mypageToken}`);
    console.log('');
    console.log('💡 このURLをブラウザで開いてマイページにアクセスできます！');

    process.exit(0);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

createYamadaClient();
