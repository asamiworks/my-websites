import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Firebase Admin初期化 (Application Default Credentialsを使用)
initializeApp({
  credential: applicationDefault(),
  projectId: 'asamiworks-679b3'
});

const db = getFirestore();

// youth-worksのクライアントデータ型
interface YouthWorksClient {
  id: string;
  clientName: string;
  siteName?: string;
  postalCode?: string;
  address1?: string;
  sitePublishDate?: string;
  initialProductionCost?: number;
  hasInvoicedProduction?: boolean;
  billingFrequency?: 'monthly' | 'yearly';
  currentManagementFee?: number;
  feeChangeHistory?: Array<{
    effectiveDate: string;
    newManagementFee: number;
    reason?: string;
    createdAt: string;
  }>;
  contractStartDate?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  lastPaidPeriod?: string;
  accumulatedDifference?: number;
  clientType?: 'corporate' | 'individual';
  websiteType?: 'landingpage' | 'homepage';
}

// asami-worksのクライアント型
interface AsamiWorksClient {
  id: string;
  clientName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  contractStartDate?: Timestamp | null;
  productionFee?: number;
  productionFeePaid?: boolean;
  productionFeeBreakdown?: {
    initialPayment?: number;
    initialPaymentPaid?: boolean;
    intermediatePayment?: number;
    intermediatePaymentPaid?: boolean;
    finalPayment?: number;
    finalPaymentPaid?: boolean;
  };
  managementFeeSchedule?: Array<{
    fromDate?: Timestamp;
    toDate?: Timestamp;
    monthlyFee: number;
    description?: string;
  }>;
  paymentMethod?: 'credit_card' | 'bank_transfer';
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // 追加情報（元データ保存用）
  _youthWorksData?: {
    siteName?: string;
    sitePublishDate?: string;
    billingFrequency?: string;
    lastPaidPeriod?: string;
    clientType?: string;
    websiteType?: string;
  };
}

// データ変換関数
function convertClient(youthClient: YouthWorksClient): AsamiWorksClient {
  // メールアドレス生成（実際のメールがない場合）
  const email = `client-${youthClient.id.substring(0, 8)}@temp.asami-works.com`;

  // 住所結合
  const address = [youthClient.postalCode, youthClient.address1]
    .filter(Boolean)
    .join(' ') || null;

  // 契約開始日変換
  const contractStartDate = youthClient.contractStartDate
    ? Timestamp.fromDate(new Date(youthClient.contractStartDate))
    : null;

  // 管理費スケジュール作成
  const managementFeeSchedule: Array<{
    fromDate?: Timestamp;
    toDate?: Timestamp;
    monthlyFee: number;
    description?: string;
  }> = [];

  if (youthClient.currentManagementFee) {
    // 現在の管理費
    managementFeeSchedule.push({
      fromDate: contractStartDate || undefined,
      toDate: undefined, // 無期限
      monthlyFee: youthClient.currentManagementFee,
      description: '月額管理費用1'
    });

    // 将来の料金変更
    if (youthClient.feeChangeHistory && youthClient.feeChangeHistory.length > 0) {
      // 最新の変更のみ追加（重複を避けるため）
      const latestChange = youthClient.feeChangeHistory[youthClient.feeChangeHistory.length - 1];
      managementFeeSchedule.push({
        fromDate: Timestamp.fromDate(new Date(latestChange.effectiveDate)),
        toDate: undefined,
        monthlyFee: latestChange.newManagementFee,
        description: latestChange.reason || '月額管理費用2'
      });
    }
  }

  // 制作費の内訳（初期費用のみ設定）
  const productionFeeBreakdown = youthClient.initialProductionCost ? {
    initialPayment: youthClient.initialProductionCost,
    initialPaymentPaid: youthClient.hasInvoicedProduction || false,
    intermediatePayment: undefined,
    intermediatePaymentPaid: false,
    finalPayment: undefined,
    finalPaymentPaid: false,
  } : undefined;

  return {
    id: youthClient.id,
    clientName: youthClient.clientName,
    email,
    phone: null,
    address,
    contractStartDate,
    productionFee: youthClient.initialProductionCost || 0,
    productionFeePaid: youthClient.hasInvoicedProduction || false,
    productionFeeBreakdown,
    managementFeeSchedule: managementFeeSchedule.length > 0 ? managementFeeSchedule : undefined,
    paymentMethod: 'bank_transfer', // デフォルト
    isActive: youthClient.isActive !== false,
    createdAt: Timestamp.fromDate(new Date(youthClient.createdAt)),
    updatedAt: Timestamp.fromDate(new Date(youthClient.updatedAt)),
    _youthWorksData: {
      siteName: youthClient.siteName,
      sitePublishDate: youthClient.sitePublishDate,
      billingFrequency: youthClient.billingFrequency,
      lastPaidPeriod: youthClient.lastPaidPeriod,
      clientType: youthClient.clientType,
      websiteType: youthClient.websiteType,
    }
  };
}

// メイン処理
async function importClients() {
  try {
    console.log('📖 youth-worksのクライアントデータを読み込み中...');

    // youth-worksのクライアントデータ読み込み
    const youthWorksDataPath = path.join(__dirname, '../../youth-works/data/clients.json');
    const youthWorksData: YouthWorksClient[] = JSON.parse(
      fs.readFileSync(youthWorksDataPath, 'utf-8')
    );

    console.log(`✅ ${youthWorksData.length}件のクライアントデータを読み込みました`);

    console.log('\n🔄 データ変換中...');

    // データ変換
    const asamiWorksClients = youthWorksData.map(convertClient);

    console.log('✅ データ変換完了\n');

    // Firestoreにインポート
    console.log('📤 Firestoreにインポート中...');

    let successCount = 0;
    let errorCount = 0;

    for (const client of asamiWorksClients) {
      try {
        // IDを使ってドキュメントを作成（既存データは上書きしない）
        const docRef = db.collection('clients').doc(client.id);
        const doc = await docRef.get();

        if (doc.exists) {
          console.log(`  ⏭️  スキップ: ${client.clientName} (既存)`);
          continue;
        }

        await docRef.set(client);
        console.log(`  ✅ インポート: ${client.clientName}`);
        successCount++;
      } catch (err) {
        console.error(`  ❌ エラー: ${client.clientName}`, err);
        errorCount++;
      }
    }

    console.log('\n📊 インポート結果:');
    console.log(`  成功: ${successCount}件`);
    console.log(`  エラー: ${errorCount}件`);
    console.log(`  スキップ: ${asamiWorksClients.length - successCount - errorCount}件`);
    console.log('\n🎉 インポート完了！');

  } catch (error) {
    console.error('❌ インポートエラー:', error);
    process.exit(1);
  }
}

// 実行
importClients()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
