'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { Invoice, InvoiceStatus } from '@/types/invoice';
import AdminNav from '@/components/admin/AdminNav';
import styles from './page.module.css';

const ADMIN_EMAIL = 'admin@asami-works.com';

export default function PaymentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>([]);
  const [paidInvoices, setPaidInvoices] = useState<Invoice[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'other'>('bank_transfer');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [showBulkPaymentModal, setShowBulkPaymentModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
      return;
    }

    if (!authLoading && user && user.email !== ADMIN_EMAIL) {
      router.push('/');
      return;
    }

    if (user && user.email === ADMIN_EMAIL) {
      loadInvoices();
    }
  }, [user, authLoading, router]);

  const loadInvoices = async () => {
    try {
      setLoading(true);

      // 未払い請求書を取得（sent, overdue）
      const unpaidQuery = query(
        collection(db, 'invoices'),
        where('status', 'in', ['sent', 'overdue']),
        orderBy('dueDate', 'asc')
      );
      const unpaidSnapshot = await getDocs(unpaidQuery);
      const unpaidData = unpaidSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invoice[];
      setUnpaidInvoices(unpaidData);

      // 最近の支払い済み請求書を取得（最新30件）
      const paidQuery = query(
        collection(db, 'invoices'),
        where('status', '==', 'paid'),
        orderBy('updatedAt', 'desc')
      );
      const paidSnapshot = await getDocs(paidQuery);
      const paidData = paidSnapshot.docs.slice(0, 30).map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invoice[];
      setPaidInvoices(paidData);
    } catch (err) {
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPaymentModal = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.totalAmount.toString());

    // クライアントの支払い方法をデフォルトとして取得
    try {
      const clientDoc = await getDoc(doc(db, 'clients', invoice.clientId));
      if (clientDoc.exists()) {
        const clientData = clientDoc.data();
        const method = clientData.paymentMethod === 'credit_card' ? 'card' :
                       clientData.paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'bank_transfer';
        setPaymentMethod(method);
      } else {
        setPaymentMethod('bank_transfer');
      }
    } catch (err) {
      setPaymentMethod('bank_transfer');
    }

    setShowPaymentModal(true);
  };

  // 複数選択のトグル
  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices(prev =>
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  // 同じクライアントの請求書のみ選択可能かチェック
  const canSelectInvoice = (invoice: Invoice) => {
    if (selectedInvoices.length === 0) return true;
    const firstSelected = unpaidInvoices.find(inv => inv.id === selectedInvoices[0]);
    return firstSelected?.clientId === invoice.clientId;
  };

  // 一括入金確認
  const handleBulkConfirmPayment = async () => {
    if (selectedInvoices.length === 0) return;

    const invoicesToProcess = unpaidInvoices.filter(inv => selectedInvoices.includes(inv.id));
    if (invoicesToProcess.length === 0) return;

    const totalAmount = invoicesToProcess.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const clientId = invoicesToProcess[0].clientId;

    try {
      // 全ての請求書を入金確認
      for (const invoice of invoicesToProcess) {
        await updateDoc(doc(db, 'invoices', invoice.id), {
          status: 'paid' as InvoiceStatus,
          paidAmount: invoice.totalAmount,
          paymentDifference: 0,
          paymentMethod,
          paidAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }

      // クライアントのlastPaidPeriodを更新（最新の期間で）
      const clientRef = doc(db, 'clients', clientId);
      const latestInvoice = invoicesToProcess.reduce((latest, inv) => {
        const latestEnd = latest.billingPeriodEnd || latest.issueDate;
        const invEnd = inv.billingPeriodEnd || inv.issueDate;
        return invEnd > latestEnd ? inv : latest;
      });

      const updateData: any = { updatedAt: Timestamp.now() };
      if (latestInvoice.billingPeriodEnd) {
        const periodEnd = latestInvoice.billingPeriodEnd as any;
        const endDate = periodEnd.toDate ? periodEnd.toDate() : new Date(periodEnd);
        const year = endDate.getFullYear();
        const month = String(endDate.getMonth() + 1).padStart(2, '0');
        updateData.lastPaidPeriod = `${year}-${month}`;
      } else if (latestInvoice.billingMonth) {
        updateData.lastPaidPeriod = latestInvoice.billingMonth;
      }
      await updateDoc(clientRef, updateData);

      setShowBulkPaymentModal(false);
      setSelectedInvoices([]);
      setPaymentMethod('bank_transfer');

      alert(`${invoicesToProcess.length}件の請求書の入金を確認しました\n合計金額: ¥${totalAmount.toLocaleString()}`);
      loadInvoices();
    } catch (err) {
      console.error('Error confirming bulk payment:', err);
      alert('一括入金確認に失敗しました');
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedInvoice) return;

    const paidAmount = parseFloat(paymentAmount);
    if (isNaN(paidAmount) || paidAmount < 0) {
      alert('正しい入金額を入力してください');
      return;
    }

    const paymentDifference = paidAmount - selectedInvoice.totalAmount;

    try {
      // 請求書を更新
      await updateDoc(doc(db, 'invoices', selectedInvoice.id), {
        status: 'paid' as InvoiceStatus,
        paidAmount,
        paymentDifference,
        paymentMethod,
        paidAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // クライアントの累積過不足金とlastPaidPeriodを更新
      const clientRef = doc(db, 'clients', selectedInvoice.clientId);
      const clientDoc = await getDoc(clientRef);

      if (clientDoc.exists()) {
        const currentDifference = clientDoc.data().accumulatedDifference || 0;
        const newDifference = currentDifference + paymentDifference;

        // lastPaidPeriodを更新（請求書のbillingPeriodEndまたはbillingMonthから）
        const updateData: any = {
          accumulatedDifference: newDifference,
          updatedAt: Timestamp.now(),
        };

        // billingPeriodEndがある場合はその月を、なければbillingMonthを使用
        if (selectedInvoice.billingPeriodEnd) {
          const endDate = selectedInvoice.billingPeriodEnd.toDate ?
            selectedInvoice.billingPeriodEnd.toDate() :
            new Date(selectedInvoice.billingPeriodEnd);
          const year = endDate.getFullYear();
          const month = String(endDate.getMonth() + 1).padStart(2, '0');
          updateData.lastPaidPeriod = `${year}-${month}`;
        } else if (selectedInvoice.billingMonth) {
          updateData.lastPaidPeriod = selectedInvoice.billingMonth;
        }

        await updateDoc(clientRef, updateData);
      }

      setShowPaymentModal(false);
      setSelectedInvoice(null);
      setPaymentAmount('');
      setPaymentMethod('bank_transfer');

      if (paymentDifference !== 0) {
        const diffLabel = paymentDifference > 0 ? '過払い' : '不足';
        alert(`入金を確認しました\n\n${diffLabel}金額: ¥${Math.abs(paymentDifference).toLocaleString()}\n次回請求書で調整されます`);
      } else {
        alert('入金を確認しました');
      }

      loadInvoices();
    } catch (err) {
      console.error('Error confirming payment:', err);
      alert('入金確認に失敗しました');
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

  const getOverdueDays = (dueDate: any) => {
    if (!dueDate) return 0;
    const due = dueDate.toDate ? dueDate.toDate() : new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (authLoading || loading) {
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
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>入金確認</h1>
            <p className={styles.subtitle}>
              未払い請求書: {unpaidInvoices.length}件
            </p>
          </div>
        </div>

        {/* 未払い請求書セクション */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>未払い請求書</h2>
            {selectedInvoices.length > 0 && (
              <button
                className={styles.bulkButton}
                onClick={() => setShowBulkPaymentModal(true)}
              >
                選択した{selectedInvoices.length}件を一括入金確認
              </button>
            )}
          </div>
          {unpaidInvoices.length === 0 ? (
            <div className={styles.empty}>未払いの請求書はありません</div>
          ) : (
            <div className={styles.invoicesTable}>
              <table>
                <thead>
                  <tr>
                    <th className={styles.checkboxCol}>
                      <input
                        type="checkbox"
                        checked={selectedInvoices.length === unpaidInvoices.length && unpaidInvoices.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // 全選択（同一クライアントのみ）
                            if (unpaidInvoices.length > 0) {
                              const firstClientId = unpaidInvoices[0].clientId;
                              const sameClientInvoices = unpaidInvoices
                                .filter(inv => inv.clientId === firstClientId)
                                .map(inv => inv.id);
                              setSelectedInvoices(sameClientInvoices);
                            }
                          } else {
                            setSelectedInvoices([]);
                          }
                        }}
                      />
                    </th>
                    <th>請求書番号</th>
                    <th>クライアント</th>
                    <th>請求額</th>
                    <th>発行日</th>
                    <th>支払期限</th>
                    <th>状態</th>
                    <th>アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {unpaidInvoices.map((invoice) => {
                    const overdueDays = getOverdueDays(invoice.dueDate);
                    const isSelected = selectedInvoices.includes(invoice.id);
                    const canSelect = canSelectInvoice(invoice);
                    return (
                      <tr key={invoice.id} className={isSelected ? styles.selectedRow : ''}>
                        <td className={styles.checkboxCol}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!canSelect}
                            onChange={() => toggleInvoiceSelection(invoice.id)}
                            title={!canSelect ? '同じクライアントの請求書のみ選択できます' : ''}
                          />
                        </td>
                        <td className={styles.invoiceNumber}>{invoice.invoiceNumber}</td>
                        <td>{invoice.clientName}</td>
                        <td className={styles.amount}>{formatCurrency(invoice.totalAmount)}</td>
                        <td>{formatDate(invoice.issueDate)}</td>
                        <td>{formatDate(invoice.dueDate)}</td>
                        <td>
                          {overdueDays > 0 ? (
                            <span className={styles.overdue}>期限超過 ({overdueDays}日)</span>
                          ) : (
                            <span className={styles.pending}>未払い</span>
                          )}
                        </td>
                        <td>
                          <button
                            className={styles.confirmButton}
                            onClick={() => handleOpenPaymentModal(invoice)}
                          >
                            入金確認
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 入金履歴セクション */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>入金履歴（最新30件）</h2>
          {paidInvoices.length === 0 ? (
            <div className={styles.empty}>入金履歴がありません</div>
          ) : (
            <div className={styles.invoicesTable}>
              <table>
                <thead>
                  <tr>
                    <th>請求書番号</th>
                    <th>クライアント</th>
                    <th>請求額</th>
                    <th>入金額</th>
                    <th>過不足</th>
                    <th>入金確認日</th>
                  </tr>
                </thead>
                <tbody>
                  {paidInvoices.map((invoice) => {
                    const difference = (invoice.paidAmount || invoice.totalAmount) - invoice.totalAmount;
                    return (
                      <tr key={invoice.id}>
                        <td className={styles.invoiceNumber}>{invoice.invoiceNumber}</td>
                        <td>{invoice.clientName}</td>
                        <td>{formatCurrency(invoice.totalAmount)}</td>
                        <td className={styles.amount}>
                          {formatCurrency(invoice.paidAmount || invoice.totalAmount)}
                        </td>
                        <td>
                          {difference === 0 ? (
                            <span className={styles.noDifference}>±¥0</span>
                          ) : difference > 0 ? (
                            <span className={styles.overpaid}>+{formatCurrency(difference)}</span>
                          ) : (
                            <span className={styles.underpaid}>{formatCurrency(difference)}</span>
                          )}
                        </td>
                        <td>{formatDate(invoice.updatedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 入金確認モーダル */}
      {showPaymentModal && selectedInvoice && (
        <div className={styles.modal} onClick={() => setShowPaymentModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>入金確認</h2>
              <button className={styles.closeButton} onClick={() => setShowPaymentModal(false)}>
                ×
              </button>
            </div>

            <div className={styles.form}>
              <div className={styles.invoiceInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>請求書番号:</span>
                  <span className={styles.infoValue}>{selectedInvoice.invoiceNumber}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>クライアント:</span>
                  <span className={styles.infoValue}>{selectedInvoice.clientName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>請求額:</span>
                  <span className={styles.infoValueAmount}>
                    {formatCurrency(selectedInvoice.totalAmount)}
                  </span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  入金額 <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  className={styles.input}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="入金額を入力してください"
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  支払い方法 <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.input}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'bank_transfer' | 'other')}
                  required
                >
                  <option value="bank_transfer">銀行振込</option>
                  <option value="card">クレジットカード</option>
                  <option value="other">その他</option>
                </select>
              </div>

              {paymentAmount && !isNaN(parseFloat(paymentAmount)) && (
                <div className={
                  parseFloat(paymentAmount) === selectedInvoice.totalAmount
                    ? styles.differenceBoxSuccess
                    : parseFloat(paymentAmount) > selectedInvoice.totalAmount
                      ? styles.differenceBoxWarning
                      : styles.differenceBoxError
                }>
                  <div className={styles.differenceHeader}>
                    <span className={styles.differenceLabel}>
                      {parseFloat(paymentAmount) === selectedInvoice.totalAmount
                        ? '✓ 過不足なし'
                        : parseFloat(paymentAmount) > selectedInvoice.totalAmount
                          ? '⚠ 過払い'
                          : '⚠ 不足'}
                    </span>
                    {parseFloat(paymentAmount) !== selectedInvoice.totalAmount && (
                      <span className={styles.differenceAmount}>
                        {parseFloat(paymentAmount) > selectedInvoice.totalAmount ? '+' : ''}
                        {formatCurrency(parseFloat(paymentAmount) - selectedInvoice.totalAmount)}
                      </span>
                    )}
                  </div>
                  {parseFloat(paymentAmount) !== selectedInvoice.totalAmount && (
                    <p className={styles.differenceNote}>
                      次回請求書で自動調整されます
                    </p>
                  )}
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowPaymentModal(false)}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={handleConfirmPayment}
                  disabled={!paymentAmount || isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) < 0}
                >
                  入金確認
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 一括入金確認モーダル */}
      {showBulkPaymentModal && selectedInvoices.length > 0 && (
        <div className={styles.modal} onClick={() => setShowBulkPaymentModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>一括入金確認</h2>
              <button className={styles.closeButton} onClick={() => setShowBulkPaymentModal(false)}>
                ×
              </button>
            </div>

            <div className={styles.form}>
              <div className={styles.invoiceInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>選択件数:</span>
                  <span className={styles.infoValue}>{selectedInvoices.length}件</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>クライアント:</span>
                  <span className={styles.infoValue}>
                    {unpaidInvoices.find(inv => inv.id === selectedInvoices[0])?.clientName}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>合計請求額:</span>
                  <span className={styles.infoValueAmount}>
                    {formatCurrency(
                      unpaidInvoices
                        .filter(inv => selectedInvoices.includes(inv.id))
                        .reduce((sum, inv) => sum + inv.totalAmount, 0)
                    )}
                  </span>
                </div>
              </div>

              <div className={styles.selectedList}>
                <label className={styles.label}>選択した請求書</label>
                <ul className={styles.invoiceList}>
                  {unpaidInvoices
                    .filter(inv => selectedInvoices.includes(inv.id))
                    .map(inv => (
                      <li key={inv.id}>
                        {inv.invoiceNumber} - {formatCurrency(inv.totalAmount)}
                      </li>
                    ))}
                </ul>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  支払い方法 <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.input}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'bank_transfer' | 'other')}
                  required
                >
                  <option value="bank_transfer">銀行振込</option>
                  <option value="card">クレジットカード</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowBulkPaymentModal(false)}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={handleBulkConfirmPayment}
                >
                  一括入金確認
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
