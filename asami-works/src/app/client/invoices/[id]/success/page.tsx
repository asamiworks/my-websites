'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { Invoice } from '@/types/invoice';
import styles from './page.module.css';

export default function PaymentSuccessPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/mypage');
      return;
    }

    if (user && invoiceId) {
      loadInvoice();
    }
  }, [user, authLoading, invoiceId, router]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      setError(null);

      const invoiceDoc = await getDoc(doc(db, 'invoices', invoiceId));

      if (!invoiceDoc.exists()) {
        setError('請求書が見つかりません');
        setLoading(false);
        return;
      }

      const invoiceData = {
        id: invoiceDoc.id,
        ...invoiceDoc.data()
      } as Invoice;

      setInvoice(invoiceData);
    } catch (err) {
      console.error('Error loading invoice:', err);
      setError('請求書の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  if (authLoading || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  if (error && !invoice) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button className={styles.button} onClick={() => router.push('/client/invoices')}>
          一覧に戻る
        </button>
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <svg
            className={styles.checkmark}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className={styles.checkmarkCircle}
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className={styles.checkmarkCheck}
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>

        <h1 className={styles.successTitle}>お支払いが完了しました</h1>
        <p className={styles.successMessage}>
          ご利用ありがとうございます。お支払いが正常に処理されました。
        </p>

        <div className={styles.invoiceDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>請求書番号:</span>
            <span className={styles.detailValue}>#{invoice.invoiceNumber}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>お支払い金額:</span>
            <span className={styles.detailValueAmount}>
              {formatCurrency(invoice.totalAmount)}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>支払日:</span>
            <span className={styles.detailValue}>
              {invoice.paidAt ? formatDate(invoice.paidAt) : formatDate(new Date())}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>支払方法:</span>
            <span className={styles.detailValue}>クレジットカード</span>
          </div>
        </div>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            領収書はご登録のメールアドレスに送信されます。
          </p>
          <p className={styles.infoText}>
            請求書の詳細は、マイページの請求書一覧からご確認いただけます。
          </p>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={() => router.push(`/client/invoices/${invoice.id}`)}
          >
            請求書を確認
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() => router.push('/client/invoices')}
          >
            請求書一覧に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
