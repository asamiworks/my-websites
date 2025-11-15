'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, orderBy, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { Client, Invoice } from '@/types/invoice';
import AdminNav from '@/components/admin/AdminNav';
import styles from './page.module.css';

const ADMIN_EMAIL = 'admin@asami-works.com';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // クライアントデータを取得
      try {
        const clientsQuery = query(
          collection(db, 'clients'),
          orderBy('createdAt', 'desc')
        );
        const clientsSnapshot = await getDocs(clientsQuery);
        const clientsData = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Client[];
        setClients(clientsData);
      } catch (err: any) {
        console.error('Error loading clients:', err);
        if (err?.code === 'permission-denied') {
          setError('Firestore権限エラー: firestore.rulesをデプロイしてください。');
        } else {
          setClients([]);
        }
      }

      // 請求書データを取得（存在する場合）
      try {
        const invoicesQuery = query(
          collection(db, 'invoices'),
          orderBy('createdAt', 'desc')
        );
        const invoicesSnapshot = await getDocs(invoicesQuery);
        const invoicesData = invoicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Invoice[];
        setInvoices(invoicesData);
      } catch (err) {
        console.log('Invoices collection not found yet:', err);
        setInvoices([]);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      if (!error) {
        setError('ダッシュボードデータの読み込みに失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 統計データの計算
  const activeClientsCount = clients.filter(c => c.isActive).length;

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentMonthInvoices = invoices.filter(inv => {
    if (!inv.issueDate) return false;
    const invoiceDate = inv.issueDate.toDate ? inv.issueDate.toDate() : new Date(inv.issueDate as any);
    const invoiceMonth = invoiceDate.toISOString().slice(0, 7);
    return invoiceMonth === currentMonth;
  });

  const currentMonthTotal = currentMonthInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

  // 最近の請求書（最新5件）
  const recentInvoices = [...invoices]
    .sort((a, b) => {
      const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt as any);
      const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt as any);
      return bDate.getTime() - aDate.getTime();
    })
    .slice(0, 5);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return '入金済み';
      case 'sent': return '送信済み';
      case 'overdue': return '期限超過';
      case 'cancelled': return 'キャンセル';
      case 'draft': return '下書き';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'paid': return styles.statusPaid;
      case 'sent': return styles.statusSent;
      case 'overdue': return styles.statusOverdue;
      case 'cancelled': return styles.statusCancelled;
      case 'draft': return styles.statusDraft;
      default: return '';
    }
  };

  if (authLoading || loading) {
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
        {/* ヘッダー */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>ダッシュボード</h1>
            <p className={styles.subtitle}>
              システムの統計情報と最近の活動を表示します
            </p>
          </div>
        </div>

      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}

      {/* 統計カード */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>アクティブクライアント数</div>
          <div className={styles.statValue}>{activeClientsCount}</div>
          <div className={styles.statSubtext}>全{clients.length}件中</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>今月の請求書</div>
          <div className={styles.statValue}>{currentMonthInvoices.length}件</div>
          <div className={styles.statSubtext}>
            {new Date().getFullYear()}年{new Date().getMonth() + 1}月
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>今月の総請求額</div>
          <div className={styles.statValue}>¥{currentMonthTotal.toLocaleString()}</div>
          <div className={styles.statSubtext}>
            {currentMonthInvoices.filter(inv => inv.status === 'paid').length}件入金済み
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>システムステータス</div>
          <div className={styles.statusIndicator}>
            <div className={styles.statusDot}></div>
            <div className={styles.statusText}>正常稼働中</div>
          </div>
          <div className={styles.statSubtext}>最終更新: {formatDate(Timestamp.now())}</div>
        </div>
      </div>

      {/* クイックアクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>クイックアクション</h3>
        <div className={styles.actionsGrid}>
          <Link href="/admin/clients" className={styles.actionButton}>
            <span className={styles.actionIcon}>👥</span>
            <span className={styles.actionLabel}>クライアント管理</span>
          </Link>
          <Link href="/admin/invoices/generate" className={styles.actionButtonPrimary}>
            <span className={styles.actionIcon}>📄</span>
            <span className={styles.actionLabel}>請求書生成</span>
          </Link>
          <Link href="/admin/invoices" className={styles.actionButton}>
            <span className={styles.actionIcon}>📋</span>
            <span className={styles.actionLabel}>請求書一覧</span>
          </Link>
        </div>
      </div>

      {/* 最近の活動 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>最近の請求書</h3>
        {recentInvoices.length === 0 ? (
          <div className={styles.empty}>
            <p>まだ請求書がありません</p>
            <Link href="/admin/invoices/generate" className={styles.emptyButton}>
              最初の請求書を作成
            </Link>
          </div>
        ) : (
          <div className={styles.activityList}>
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className={styles.activityItem}>
                <div className={styles.activityInfo}>
                  <div className={styles.activityName}>{invoice.clientName}</div>
                  <div className={styles.activityMeta}>
                    {invoice.invoiceNumber} • {formatDate(invoice.issueDate)}
                  </div>
                </div>
                <div className={styles.activityRight}>
                  <div className={styles.activityAmount}>
                    ¥{(invoice.totalAmount || 0).toLocaleString()}
                  </div>
                  <div className={`${styles.activityStatus} ${getStatusClass(invoice.status)}`}>
                    {getStatusLabel(invoice.status)}
                  </div>
                </div>
              </div>
            ))}
            {invoices.length > 5 && (
              <div className={styles.viewAll}>
                <Link href="/admin/invoices" className={styles.viewAllLink}>
                  すべての請求書を見る →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
