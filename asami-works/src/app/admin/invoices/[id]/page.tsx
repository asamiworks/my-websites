'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { Invoice } from '@/types/invoice';
import styles from './page.module.css';

const ADMIN_EMAIL = 'admin@asami-works.com';

export default function AdminInvoiceDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAsPaid, setMarkingAsPaid] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
      return;
    }

    // 管理者メールアドレスチェック
    if (!authLoading && user && user.email !== ADMIN_EMAIL) {
      router.push('/');
      return;
    }

    if (user && user.email === ADMIN_EMAIL && invoiceId) {
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

  const handleMarkAsPaid = async () => {
    if (!invoice || !user) return;

    // 確認ダイアログ
    if (!confirm('この請求書を支払済みにマークしますか？')) {
      return;
    }

    try {
      setMarkingAsPaid(true);
      setError(null);

      await updateDoc(doc(db, 'invoices', invoice.id), {
        status: 'paid',
        paidAt: Timestamp.now(),
        paymentMethod: 'bank_transfer',
        manuallyMarkedAsPaid: true,
        markedAsPaidBy: user.uid,
        updatedAt: Timestamp.now(),
      });

      // 請求書を再読み込み
      await loadInvoice();
    } catch (err) {
      console.error('Error marking invoice as paid:', err);
      setError('支払済みマークに失敗しました');
    } finally {
      setMarkingAsPaid(false);
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return '下書き';
      case 'sent':
        return '送付済み';
      case 'paid':
        return '支払い済み';
      case 'overdue':
        return '期限超過';
      case 'cancelled':
        return 'キャンセル';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'paid':
        return styles.statusPaid;
      case 'sent':
        return styles.statusSent;
      case 'overdue':
        return styles.statusOverdue;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusDraft;
    }
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
        <button className={styles.backButton} onClick={() => router.push('/admin/invoices')}>
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
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/admin/invoices')}>
          ← 一覧に戻る
        </button>
      </div>

      <div className={styles.invoiceCard}>
        <div className={styles.invoiceHeader}>
          <div>
            <h1 className={styles.invoiceNumber}>請求書 #{invoice.invoiceNumber}</h1>
            <p className={styles.invoiceClient}>{invoice.clientName} 様</p>
          </div>
          <div className={`${styles.status} ${getStatusClass(invoice.status)}`}>
            {getStatusLabel(invoice.status)}
          </div>
        </div>

        <div className={styles.invoiceInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>発行日:</span>
            <span className={styles.infoValue}>{formatDate(invoice.issueDate)}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>支払期限:</span>
            <span className={styles.infoValue}>{formatDate(invoice.dueDate)}</span>
          </div>
          {invoice.paidAt && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>支払日:</span>
              <span className={styles.infoValue}>{formatDate(invoice.paidAt)}</span>
            </div>
          )}
          {invoice.paymentMethod && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>支払方法:</span>
              <span className={styles.infoValue}>
                {invoice.paymentMethod === 'card' ? 'クレジットカード' :
                 invoice.paymentMethod === 'bank_transfer' ? '銀行振込' :
                 'その他'}
                {invoice.manuallyMarkedAsPaid && ' (手動マーク)'}
              </span>
            </div>
          )}
          {invoice.stripePaymentIntentId && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Payment Intent ID:</span>
              <span className={styles.infoValue}>{invoice.stripePaymentIntentId}</span>
            </div>
          )}
        </div>

        <div className={styles.itemsSection}>
          <h2 className={styles.sectionTitle}>明細</h2>
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>項目</th>
                <th>数量</th>
                <th>単価</th>
                <th>金額</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td>{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.totalsSection}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>小計:</span>
            <span className={styles.totalValue}>{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>消費税 ({invoice.taxRate * 100}%):</span>
            <span className={styles.totalValue}>{formatCurrency(invoice.taxAmount)}</span>
          </div>
          <div className={styles.totalRowFinal}>
            <span className={styles.totalLabel}>合計:</span>
            <span className={styles.totalValueFinal}>{formatCurrency(invoice.totalAmount)}</span>
          </div>
        </div>

        {invoice.notes && (
          <div className={styles.notesSection}>
            <h2 className={styles.sectionTitle}>備考</h2>
            <p className={styles.notes}>{invoice.notes}</p>
          </div>
        )}

        <div className={styles.actionSection}>
          {invoice.status !== 'paid' && (
            <button
              className={styles.markPaidButton}
              onClick={handleMarkAsPaid}
              disabled={markingAsPaid}
            >
              {markingAsPaid ? '処理中...' : '✓ 支払済みにする'}
            </button>
          )}
          <button
            className={styles.editButton}
            onClick={() => router.push(`/admin/invoices?edit=${invoice.id}`)}
          >
            編集
          </button>
          <button
            className={styles.clientButton}
            onClick={() => router.push(`/admin/clients`)}
          >
            クライアント管理
          </button>
        </div>
      </div>
    </div>
  );
}
