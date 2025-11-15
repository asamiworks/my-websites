'use client';

import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import styles from './page.module.css';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className={styles.pageWrapper}>
      <AdminNav />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cancelIcon}>⚠️</div>
          <h1 className={styles.title}>決済がキャンセルされました</h1>
          <p className={styles.message}>
            Stripe決済の設定がキャンセルされました。<br />
            月額課金は設定されていません。
          </p>

          <div className={styles.info}>
            <h3>次のステップ</h3>
            <ul>
              <li>クライアント一覧に戻って、再度設定を試すことができます</li>
              <li>問題が発生した場合は、Stripeサポートにお問い合わせください</li>
              <li>クライアント情報を確認して、再度決済設定を行ってください</li>
            </ul>
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={styles.primaryButton}
              onClick={() => router.push('/admin/clients')}
            >
              クライアント一覧に戻る
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => router.back()}
            >
              前のページに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
