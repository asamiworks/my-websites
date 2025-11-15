'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { Client, Invoice, BankTransferInfo } from '@/types/invoice';
import styles from './page.module.css';

export default function InvoiceDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [bankInfo, setBankInfo] = useState<BankTransferInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const invoiceId = params?.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    if (user && invoiceId) {
      loadInvoiceData();
    }
  }, [user, authLoading, router, invoiceId]);

  const loadInvoiceData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // クライアント情報を取得
      const clientsQuery = query(
        collection(db, 'clients'),
        where('email', '==', user.email)
      );
      const clientsSnapshot = await getDocs(clientsQuery);

      if (clientsSnapshot.empty) {
        setError('クライアント情報が見つかりません');
        setLoading(false);
        return;
      }

      const clientData = {
        id: clientsSnapshot.docs[0].id,
        ...clientsSnapshot.docs[0].data()
      } as Client;

      setClient(clientData);

      // 請求書を取得
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

      // 請求書が自分のものか確認
      if (invoiceData.clientId !== clientData.id) {
        setError('この請求書にアクセスする権限がありません');
        setLoading(false);
        return;
      }

      setInvoice(invoiceData);

      // 銀行振込の場合は振込先情報を取得
      if (clientData.paymentMethod === 'bank_transfer') {
        const bankDoc = await getDoc(doc(db, 'settings', 'bank_transfer'));
        if (bankDoc.exists()) {
          setBankInfo(bankDoc.data() as BankTransferInfo);
        }
      }
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

  const handlePayment = async () => {
    if (!invoice || !client) return;

    try {
      setPaymentProcessing(true);
      setError(null);

      // Stripe決済処理を実行
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
          clientId: client.id,
        }),
      });

      if (!response.ok) {
        throw new Error('決済セッションの作成に失敗しました');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('決済の開始に失敗しました。もう一度お試しください。');
    } finally {
      setPaymentProcessing(false);
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
        <button className={styles.backButton} onClick={() => router.push('/mypage/invoices')}>
          ← 請求書一覧に戻る
        </button>
      </div>
    );
  }

  if (!invoice || !client) {
    return null;
  }

  const canPay = invoice.status === 'sent' || invoice.status === 'overdue';
  const isCreditCard = client.paymentMethod === 'credit_card';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/mypage/invoices')}>
          ← 請求書一覧に戻る
        </button>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>請求書詳細</h1>
          <span className={`${styles.status} ${getStatusClass(invoice.status)}`}>
            {getStatusLabel(invoice.status)}
          </span>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}

      {/* 請求書情報 */}
      <div className={styles.invoiceCard}>
        <div className={styles.invoiceHeader}>
          <div>
            <div className={styles.invoiceNumber}>#{invoice.invoiceNumber}</div>
            <div className={styles.invoiceMeta}>
              {invoice.isAutoGenerated && (
                <span className={styles.autoGenBadge}>自動生成</span>
              )}
            </div>
          </div>
          <div className={styles.totalAmount}>
            <div className={styles.totalLabel}>合計金額</div>
            <div className={styles.totalValue}>{formatCurrency(invoice.totalAmount)}</div>
          </div>
        </div>

        <div className={styles.invoiceInfo}>
          <div className={styles.infoRow}>
            <span className={styles.label}>発行日:</span>
            <span className={styles.value}>{formatDate(invoice.issueDate)}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>支払期限:</span>
            <span className={styles.value}>{formatDate(invoice.dueDate)}</span>
          </div>
          {invoice.billingMonth && (
            <div className={styles.infoRow}>
              <span className={styles.label}>請求月:</span>
              <span className={styles.value}>{invoice.billingMonth}</span>
            </div>
          )}
        </div>

        {/* 請求項目 */}
        <div className={styles.itemsSection}>
          <h3 className={styles.sectionTitle}>請求項目</h3>
          <div className={styles.itemsTable}>
            <table>
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
                    <td className={styles.itemAmount}>{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>小計:</span>
              <span className={styles.summaryValue}>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>消費税 ({(invoice.taxRate * 100).toFixed(0)}%):</span>
              <span className={styles.summaryValue}>{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span className={styles.summaryLabel}>合計:</span>
              <span className={styles.summaryValue}>{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* 備考 */}
        {invoice.notes && (
          <div className={styles.notesSection}>
            <h3 className={styles.sectionTitle}>備考</h3>
            <p className={styles.notes}>{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* 支払いセクション */}
      {canPay && isCreditCard && (
        <div className={styles.paymentSection}>
          <h3 className={styles.sectionTitle}>お支払い</h3>
          <p className={styles.paymentDescription}>
            クレジットカードでお支払いいただけます。安全な決済ページに移動します。
          </p>
          <button
            className={styles.payButton}
            onClick={handlePayment}
            disabled={paymentProcessing}
          >
            {paymentProcessing ? '処理中...' : 'クレジットカードで支払う'}
          </button>
        </div>
      )}

      {/* 銀行振込情報 */}
      {canPay && !isCreditCard && bankInfo && (
        <div className={styles.paymentSection}>
          <h3 className={styles.sectionTitle}>お振込先情報</h3>
          <div className={styles.bankInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>銀行名:</span>
              <span className={styles.value}>{bankInfo.bankName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>支店名:</span>
              <span className={styles.value}>{bankInfo.branchName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>口座種別:</span>
              <span className={styles.value}>{bankInfo.accountType}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>口座番号:</span>
              <span className={styles.value}>{bankInfo.accountNumber}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>口座名義:</span>
              <span className={styles.value}>{bankInfo.accountHolder}</span>
            </div>
          </div>
          <div className={styles.notice}>
            <p>※ お振込の際は、請求書番号「{invoice.invoiceNumber}」をお名前の後にご記入ください。</p>
            <p>※ 振込手数料はお客様負担となります。</p>
            <p>※ お振込確認後、ステータスが「支払い済み」に更新されます。</p>
          </div>
        </div>
      )}

      {/* 支払済みメッセージ */}
      {invoice.status === 'paid' && (
        <div className={styles.paidMessage}>
          <div className={styles.paidIcon}>✓</div>
          <div className={styles.paidText}>
            この請求書は支払い済みです
          </div>
          {invoice.paidAt && (
            <div className={styles.paidDate}>
              支払日: {formatDate(invoice.paidAt)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
