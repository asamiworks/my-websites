'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase-config';
import { collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import AdminNav from '@/components/admin/AdminNav';
import styles from './page.module.css';

const ADMIN_EMAIL = 'admin@asami-works.com';

interface ImportResult {
  success: boolean;
  total?: number;
  imported?: number;
  skipped?: number;
  errors?: number;
  errorDetails?: string[];
  error?: string;
}

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

// undefined を削除するヘルパー関数
function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  }

  // Timestamp オブジェクトはそのまま返す
  if (obj instanceof Timestamp) {
    return obj;
  }

  if (obj !== null && typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefined(value);
      }
    }
    return cleaned;
  }

  return obj;
}

// データ変換関数
function convertClient(youthClient: YouthWorksClient): any {
  const address = [youthClient.postalCode, youthClient.address1]
    .filter(Boolean)
    .join(' ') || null;

  const contractStartDate = youthClient.contractStartDate
    ? Timestamp.fromDate(new Date(youthClient.contractStartDate))
    : null;

  const managementFeeSchedule: Array<{
    fromDate?: Timestamp;
    toDate?: Timestamp;
    monthlyFee: number;
    description?: string;
  }> = [];

  if (youthClient.currentManagementFee) {
    managementFeeSchedule.push({
      fromDate: contractStartDate || undefined,
      toDate: undefined,
      monthlyFee: youthClient.currentManagementFee,
      description: '月額管理費用1'
    });

    if (youthClient.feeChangeHistory && youthClient.feeChangeHistory.length > 0) {
      const latestChange = youthClient.feeChangeHistory[youthClient.feeChangeHistory.length - 1];
      managementFeeSchedule.push({
        fromDate: Timestamp.fromDate(new Date(latestChange.effectiveDate)),
        toDate: undefined,
        monthlyFee: latestChange.newManagementFee,
        description: latestChange.reason || '月額管理費用2'
      });
    }
  }

  const productionFeeBreakdown = youthClient.initialProductionCost ? {
    initialPayment: youthClient.initialProductionCost,
    initialPaymentPaid: youthClient.hasInvoicedProduction || false,
  } : undefined;

  const clientData = {
    clientName: youthClient.clientName,
    email: null,
    phone: null,
    address,
    contractStartDate,
    productionFee: youthClient.initialProductionCost || 0,
    productionFeePaid: youthClient.hasInvoicedProduction || false,
    productionFeeBreakdown,
    managementFeeSchedule: managementFeeSchedule.length > 0 ? managementFeeSchedule : undefined,
    paymentMethod: 'bank_transfer',
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

  // undefined を削除して返す
  return removeUndefined(clientData);
}

export default function ImportPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  if (!authLoading && !user) {
    router.push('/admin/login');
    return null;
  }

  if (!authLoading && user && user.email !== ADMIN_EMAIL) {
    router.push('/');
    return null;
  }

  const handleImport = async () => {
    if (!confirm('youth-worksのクライアントデータをインポートしますか？')) {
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      // 1. APIからyouth-worksデータを取得
      console.log('📖 youth-worksのクライアントデータを読み込み中...');
      const response = await fetch('/api/admin/youth-works-data');

      if (!response.ok) {
        throw new Error('データの取得に失敗しました');
      }

      const { data: youthWorksData } = await response.json();
      console.log(`✅ ${youthWorksData.length}件のクライアントデータを読み込みました`);

      // 2. データ変換
      console.log('🔄 データ変換中...');
      const asamiWorksClients = youthWorksData.map((client: YouthWorksClient) => ({
        id: client.id,
        data: convertClient(client)
      }));
      console.log('✅ データ変換完了');

      // 3. Firestoreにインポート（クライアントサイドから直接書き込み）
      console.log('📤 Firestoreにインポート中...');
      let successCount = 0;
      let errorCount = 0;
      let skipCount = 0;
      const errors: string[] = [];

      for (const client of asamiWorksClients) {
        try {
          const docRef = doc(db, 'clients', client.id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log(`⏭️  スキップ: ${client.data.clientName} (既存)`);
            skipCount++;
            continue;
          }

          await setDoc(docRef, client.data);
          console.log(`✅ インポート: ${client.data.clientName}`);
          successCount++;
        } catch (err: any) {
          console.error(`❌ エラー: ${client.data.clientName}`, err);
          errors.push(`${client.data.clientName}: ${err.message}`);
          errorCount++;
        }
      }

      setResult({
        success: true,
        total: asamiWorksClients.length,
        imported: successCount,
        skipped: skipCount,
        errors: errorCount,
        errorDetails: errors
      });

    } catch (error: any) {
      console.error('❌ インポートエラー:', error);
      setResult({
        success: false,
        error: error.message || 'インポートに失敗しました'
      });
    } finally {
      setImporting(false);
    }
  };

  if (authLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <AdminNav />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>データインポート</h1>
          <p className={styles.subtitle}>
            youth-worksのクライアントデータをasami-worksにインポートします
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>クライアントデータインポート</h2>
            <p className={styles.cardDescription}>
              youth-worksプロジェクトの data/clients.json ファイルから
              クライアントデータを読み込み、Firestoreにインポートします。
            </p>
            <ul className={styles.notesList}>
              <li>既存のクライアントはスキップされます</li>
              <li>新しいクライアントのみが追加されます</li>
              <li>メールアドレスは空欄でインポートされます（後で編集可能）</li>
              <li>元のyouth-worksデータは _youthWorksData フィールドに保存されます</li>
            </ul>

            <button
              className={styles.importButton}
              onClick={handleImport}
              disabled={importing}
            >
              {importing ? 'インポート中...' : 'インポート開始'}
            </button>
          </div>

          {result && (
            <div className={result.success ? styles.resultSuccess : styles.resultError}>
              <h3 className={styles.resultTitle}>
                {result.success ? '✅ インポート完了' : '❌ エラー'}
              </h3>

              {result.success ? (
                <div className={styles.resultStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>総数:</span>
                    <span className={styles.statValue}>{result.total}件</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>インポート:</span>
                    <span className={styles.statValue}>{result.imported}件</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>スキップ:</span>
                    <span className={styles.statValue}>{result.skipped}件</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>エラー:</span>
                    <span className={styles.statValue}>{result.errors}件</span>
                  </div>
                </div>
              ) : (
                <p className={styles.errorMessage}>{result.error}</p>
              )}

              {result.errorDetails && result.errorDetails.length > 0 && (
                <div className={styles.errorDetails}>
                  <h4>エラー詳細:</h4>
                  <ul>
                    {result.errorDetails.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.success && result.imported && result.imported > 0 && (
                <button
                  className={styles.viewClientsButton}
                  onClick={() => router.push('/admin/clients')}
                >
                  クライアント一覧を見る
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
