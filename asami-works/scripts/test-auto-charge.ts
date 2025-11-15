import * as admin from 'firebase-admin';

// Emulator環境用の設定
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Firebase Admin初期化
admin.initializeApp({
  projectId: 'demo-test-project',
});

const db = admin.firestore();

async function testAutoCharge() {
  try {
    console.log('🧪 自動決済のローカルテストを開始します...\n');

    // 1. テストクライアントを作成
    console.log('1️⃣ テストクライアントを作成中...');
    const clientRef = await db.collection('clients').add({
      clientName: 'テストクライアント',
      email: 'test@example.com',
      paymentMethod: 'credit_card',
      stripeCustomerId: 'cus_test_xxxxx', // ⚠️ 実際のStripeテストカスタマーIDに変更してください
      stripePaymentMethodId: 'pm_test_xxxxx', // ⚠️ 実際のStripeテスト支払い方法IDに変更してください
      cardBrand: 'Visa',
      cardLast4: '4242',
      isActive: true,
      createdAt: admin.firestore.Timestamp.now(),
    });

    console.log(`✅ クライアント作成完了: ${clientRef.id}\n`);

    // 2. テスト請求書を作成（これがトリガーを発動させる）
    console.log('2️⃣ テスト請求書を作成中（トリガー発動）...');
    const invoiceRef = await db.collection('invoices').add({
      clientId: clientRef.id,
      clientName: 'テストクライアント',
      invoiceNumber: `INV-TEST-${Date.now()}`,
      status: 'sent', // 👈 これが 'sent' なので自動決済トリガーが発動する
      totalAmount: 100, // 100円（Stripeテスト用の少額）
      items: [
        {
          description: 'テスト請求',
          quantity: 1,
          unitPrice: 100,
          amount: 100,
        },
      ],
      subtotal: 100,
      taxRate: 0.1,
      taxAmount: 10,
      issueDate: admin.firestore.Timestamp.now(),
      dueDate: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ),
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });

    console.log(`✅ 請求書作成完了: ${invoiceRef.id}`);
    console.log(`📄 請求書番号: INV-TEST-${Date.now()}\n`);

    console.log('⏳ 3秒待機してトリガー処理を確認...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 3. 請求書のステータスを確認
    console.log('\n3️⃣ 請求書のステータスを確認中...');
    const invoiceDoc = await invoiceRef.get();
    const invoiceData = invoiceDoc.data();

    console.log('\n📊 請求書データ:');
    console.log(`  - ステータス: ${invoiceData?.status}`);
    console.log(`  - 金額: ¥${invoiceData?.totalAmount}`);
    console.log(`  - 支払い日: ${invoiceData?.paidDate?.toDate() || '未払い'}`);
    console.log(`  - 自動決済: ${invoiceData?.autoCharged ? 'はい' : 'いいえ'}`);
    console.log(`  - Stripe Payment Intent ID: ${invoiceData?.stripePaymentIntentId || 'なし'}`);

    if (invoiceData?.lastChargeError) {
      console.log(`\n⚠️ エラー: ${invoiceData.lastChargeError}`);
    }

    if (invoiceData?.status === 'paid') {
      console.log('\n✅ 自動決済が成功しました！');
    } else {
      console.log('\n⏳ まだ支払い処理中、またはエラーが発生しました');
      console.log('Functions Emulatorのログを確認してください');
    }

    console.log('\n🔍 Emulator UI で確認: http://localhost:4000');
    console.log(`   - Firestore > invoices > ${invoiceRef.id}`);

  } catch (error) {
    console.error('❌ テスト中にエラーが発生しました:', error);
  } finally {
    console.log('\n✨ テスト完了');
    process.exit(0);
  }
}

testAutoCharge();
