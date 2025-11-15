'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // セッション情報を取得（オプション）
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <AdminNav />
        <div className={styles.container}>
          <div className={styles.loading}>読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <AdminNav />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✅</div>
          <h1 className={styles.title}>決済が完了しました</h1>
          <p className={styles.message}>
            Stripe月額課金の設定が完了しました。<br />
            今後、毎月自動的に課金が行われます。
          </p>

          <div className={styles.info}>
            <h3>次のステップ</h3>
            <ul>
              <li>クライアントに確認メールが送信されました</li>
              <li>初回の課金は即座に実行されます</li>
              <li>2回目以降は毎月同じ日に自動課金されます</li>
              <li>Stripeダッシュボードで詳細を確認できます</li>
            </ul>
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={styles.primaryButton}
              onClick={() => router.push('/admin/clients')}
            >
              クライアント一覧に戻る
            </button>
            <a
              href="https://dashboard.stripe.com/test/subscriptions"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryButton}
            >
              Stripeで確認
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className={styles.pageWrapper}>
        <AdminNav />
        <div className={styles.container}>
          <div className={styles.loading}>読み込み中...</div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
