'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { Client, Invoice } from '@/types/invoice';
import styles from './page.module.css';

export default function ClientInvoicesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      loadInvoicesData();
    }
  }, [user, authLoading, router]);

  const loadInvoicesData = async () => {
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
      const invoicesQuery = query(
        collection(db, 'invoices'),
        where('clientId', '==', clientData.id),
        orderBy('issueDate', 'desc')
      );
      const invoicesSnapshot = await getDocs(invoicesQuery);
      const invoicesData = invoicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invoice[];

      setInvoices(invoicesData);
    } catch (err) {
      console.error('Error loading invoices:', err);
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

  const filteredInvoices = invoices.filter(invoice => {
    if (filterStatus === 'all') return true;
    return invoice.status === filterStatus;
  });

  if (authLoading || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  if (error && !client) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/client/dashboard')}>
          ← ダッシュボードに戻る
        </button>
        <h1 className={styles.title}>請求書一覧</h1>
        <p className={styles.subtitle}>
          {filteredInvoices.length}件の請求書
        </p>
      </div>

      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}

      {/* フィルター */}
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>ステータスで絞り込み:</label>
        <select
          className={styles.filterSelect}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">すべて</option>
          <option value="sent">送付済み</option>
          <option value="paid">支払い済み</option>
          <option value="overdue">期限超過</option>
        </select>
      </div>

      {/* 請求書テーブル */}
      {filteredInvoices.length === 0 ? (
        <div className={styles.empty}>
          <p>請求書がありません</p>
        </div>
      ) : (
        <div className={styles.invoicesTable}>
          <table>
            <thead>
              <tr>
                <th>請求書番号</th>
                <th>発行日</th>
                <th>支払期限</th>
                <th>金額</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className={styles.invoiceNumber}>#{invoice.invoiceNumber}</td>
                  <td>{formatDate(invoice.issueDate)}</td>
                  <td>{formatDate(invoice.dueDate)}</td>
                  <td className={styles.amount}>{formatCurrency(invoice.totalAmount)}</td>
                  <td>
                    <span className={`${styles.status} ${getStatusClass(invoice.status)}`}>
                      {getStatusLabel(invoice.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.viewButton}
                      onClick={() => router.push(`/client/invoices/${invoice.id}`)}
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
