'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase-config';
import { Client, Invoice } from '@/types/invoice';
import CardRegistrationForm from '@/components/mypage/CardRegistrationForm';
import styles from './page.module.css';

export default function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showCardForm, setShowCardForm] = useState(false);
  const [bulkPaying, setBulkPaying] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);

  // セッション管理: 5分（300秒）後に自動ログアウト
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;

    const resetTimers = () => {
      // 既存のタイマーをクリア
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (warningTimer) clearTimeout(warningTimer);
      setSessionWarning(false);

      // 4分後に警告を表示
      warningTimer = setTimeout(() => {
        setSessionWarning(true);
      }, 4 * 60 * 1000); // 4分

      // 5分後に自動ログアウト
      inactivityTimer = setTimeout(async () => {
        alert('セッションが切れました。再度ログインしてください。');
        await signOut(auth);
        router.push('/mypage/login');
      }, 5 * 60 * 1000); // 5分
    };

    // ユーザーアクティビティをリッスン
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimers);
    });

    // 初回タイマー設定
    resetTimers();

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (warningTimer) clearTimeout(warningTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimers);
      });
    };
  }, [router]);

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // ログインしていない場合はログインページにリダイレクト
        router.push('/mypage/login');
        return;
      }

      // ユーザーがログインしている場合、クライアント情報を取得
      loadClientData(user.uid);
    });

    return () => unsubscribe();
  }, [router]);

  const loadClientData = async (authUid: string) => {
    try {
      setLoading(true);
      setError(null);

      // authUidからクライアント情報を取得
      const clientsQuery = query(
        collection(db, 'clients'),
        where('authUid', '==', authUid)
      );
      const clientsSnapshot = await getDocs(clientsQuery);

      if (clientsSnapshot.empty) {
        setError('クライアント情報が見つかりません');
        return;
      }

      const clientData = {
        id: clientsSnapshot.docs[0].id,
        ...clientsSnapshot.docs[0].data()
      } as Client;

      setClient(clientData);

      // 初期パスワードの場合は設定ページにリダイレクト
      if (clientData.hasInitialPassword) {
        alert('セキュリティのため、初回ログイン時にパスワードを変更してください。');
        router.push('/mypage/settings');
        return;
      }

      // 請求書データを取得
      const invoicesQuery = query(
        collection(db, 'invoices'),
        where('clientId', '==', clientData.id)
      );
      const invoicesSnapshot = await getDocs(invoicesQuery);
      const invoicesData = invoicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invoice[];

      // 発行日でソート（新しい順）
      invoicesData.sort((a, b) => {
        const dateA = a.issueDate.toDate ? a.issueDate.toDate().getTime() : new Date(a.issueDate as any).getTime();
        const dateB = b.issueDate.toDate ? b.issueDate.toDate().getTime() : new Date(b.issueDate as any).getTime();
        return dateB - dateA;
      });

      setInvoices(invoicesData);
    } catch (err: any) {
      console.error('Error loading client data:', err);
      setError('データの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  // 初回ログイン時のカード登録フォーム自動表示
  useEffect(() => {
    const isFirstLogin = searchParams.get('firstLogin') === 'true';

    if (isFirstLogin && client && !loading) {
      // 支払い方法がクレジットカードで、カードが未登録の場合
      if (client.paymentMethod === 'credit_card' && !client.stripePaymentMethodId) {
        // URLパラメータをクリア
        router.replace('/mypage/dashboard', { scroll: false });

        // カード登録フォームを表示
        setTimeout(() => {
          setShowCardForm(true);
        }, 500);
      }
    }
  }, [client, loading, searchParams, router]);

  const handleLogout = async () => {
    const confirmed = confirm('ログアウトしますか？');
    if (!confirmed) return;

    try {
      await signOut(auth);
      router.push('/mypage/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('ログアウトに失敗しました');
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ja-JP');
  };

  const formatCurrency = (amount: number): string => {
    return `¥${amount.toLocaleString()}`;
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      draft: '下書き',
      sent: '送信済み',
      paid: '支払い済み',
      overdue: '期限超過',
      canceled: 'キャンセル',
    };
    return labels[status] || status;
  };

  const getPaymentMethodLabel = (method?: string): string => {
    const labels: Record<string, string> = {
      credit_card: 'クレジットカード',
      bank_debit: '口座引き落とし',
      bank_transfer: '銀行振込',
    };
    return method ? labels[method] || method : '未設定';
  };

  const handleCardRegistrationSuccess = () => {
    setShowCardForm(false);
    if (client && auth.currentUser) {
      loadClientData(auth.currentUser.uid);
    }
  };

  const handleSinglePayment = async (invoice: Invoice) => {
    const confirmed = confirm(
      `請求書 ${invoice.invoiceNumber}\n金額: ¥${invoice.totalAmount.toLocaleString()}\n\nこの請求書を支払いますか？`
    );

    if (!confirmed) return;

    try {
      const response = await fetch('/api/stripe/auto-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('支払いが完了しました！');
        if (client && auth.currentUser) {
          await loadClientData(auth.currentUser.uid);
        }
      } else {
        throw new Error(data.error || '支払いに失敗しました');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('支払いに失敗しました: ' + error.message);
    }
  };

  const handleBulkPayment = async () => {
    const unpaidInvoices = invoices.filter(inv => inv.status === 'sent');

    if (unpaidInvoices.length === 0) {
      alert('支払いが必要な請求書がありません');
      return;
    }

    const totalAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const confirmed = confirm(
      `${unpaidInvoices.length}件の請求書（合計 ¥${totalAmount.toLocaleString()}）を一括で支払いますか？`
    );

    if (!confirmed) return;

    setBulkPaying(true);

    try {
      const response = await fetch('/api/stripe/bulk-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceIds: unpaidInvoices.map(inv => inv.id),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { summary, results } = data;

        if (summary.failed === 0) {
          alert(`すべての請求書の支払いが完了しました！\n\n支払い件数: ${summary.succeeded}件\n合計金額: ¥${summary.totalAmount.toLocaleString()}`);
        } else {
          const failedInvoices = results.filter((r: any) => !r.success);
          alert(
            `一部の請求書の支払いに失敗しました。\n\n` +
            `成功: ${summary.succeeded}件\n` +
            `失敗: ${summary.failed}件\n\n` +
            `失敗した請求書:\n${failedInvoices.map((r: any) => `- ${r.invoiceNumber}: ${r.error}`).join('\n')}`
          );
        }

        if (client && auth.currentUser) {
          await loadClientData(auth.currentUser.uid);
        }
      } else {
        throw new Error(data.error || '一括支払いに失敗しました');
      }
    } catch (error: any) {
      console.error('Bulk payment error:', error);
      alert('一括支払いに失敗しました: ' + error.message);
    } finally {
      setBulkPaying(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || 'クライアント情報が見つかりません'}</div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {sessionWarning && (
        <div className={styles.sessionWarning}>
          ⚠️ セッションが1分後に切れます。何か操作をしてください。
        </div>
      )}

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>マイページ</h1>
          <p className={styles.subtitle}>AsamiWorks クライアント専用ページ</p>
        </div>
        <div className={styles.headerButtons}>
          <button onClick={() => router.push('/mypage/settings')} className={styles.settingsButton}>
            ⚙️ 設定
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            ログアウト
          </button>
        </div>
      </header>

      {/* クライアント情報 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>お客様情報</h2>
        <div className={styles.card}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>お名前</span>
              <span className={styles.infoValue}>{client.clientName}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>メールアドレス</span>
              <span className={styles.infoValue}>{client.email || '-'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>電話番号</span>
              <span className={styles.infoValue}>{client.phone || '-'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>支払い方法</span>
              <span className={styles.infoValue}>{getPaymentMethodLabel(client.paymentMethod)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* クレジットカード情報 */}
      {client.paymentMethod === 'credit_card' && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>支払い情報</h2>
          <div className={styles.card}>
            {!showCardForm && client.stripePaymentMethodId ? (
              <div className={styles.paymentInfo}>
                <div className={styles.cardDetails}>
                  <div className={styles.cardIcon}>💳</div>
                  <div className={styles.cardInfo}>
                    <p className={styles.cardBrand}>
                      {client.cardBrand?.toUpperCase() || 'カード'}
                    </p>
                    <p className={styles.cardNumber}>
                      **** **** **** {client.cardLast4 || '****'}
                    </p>
                  </div>
                </div>
                <p className={styles.autoChargeNote}>
                  ✓ 請求書が発行されると自動的に決済されます
                </p>
                <button
                  className={styles.updatePaymentButton}
                  onClick={() => setShowCardForm(true)}
                >
                  カードを変更
                </button>
              </div>
            ) : !showCardForm ? (
              <div className={styles.paymentInfo}>
                <p className={styles.noPayment}>
                  クレジットカードが未登録です
                </p>
                <p className={styles.cardBenefit}>
                  カードを登録すると、請求書が発行された際に自動的に決済されます
                </p>
                <button
                  className={styles.registerPaymentButton}
                  onClick={() => setShowCardForm(true)}
                >
                  クレジットカードを登録
                </button>
              </div>
            ) : (
              <div className={styles.cardFormContainer}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowCardForm(false)}
                >
                  ← 戻る
                </button>
                <CardRegistrationForm
                  clientId={client.id!}
                  onSuccess={handleCardRegistrationSuccess}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* 請求書履歴 */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>請求書履歴</h2>
          {client.paymentMethod === 'credit_card' &&
           client.stripePaymentMethodId &&
           invoices.filter(inv => inv.status === 'sent').length > 0 && (
            <button
              onClick={handleBulkPayment}
              disabled={bulkPaying}
              className={styles.bulkPayButton}
            >
              {bulkPaying ? '決済処理中...' : `すべて支払う (${invoices.filter(inv => inv.status === 'sent').length}件)`}
            </button>
          )}
        </div>
        <div className={styles.card}>
          {invoices.length === 0 ? (
            <p className={styles.empty}>請求書はまだありません</p>
          ) : (
            <div className={styles.invoiceList}>
              {invoices.map((invoice) => (
                <div key={invoice.id} className={styles.invoiceItem}>
                  <div className={styles.invoiceHeader}>
                    <span className={styles.invoiceNumber}>{invoice.invoiceNumber}</span>
                    <span className={`${styles.invoiceStatus} ${styles[`status-${invoice.status}`]}`}>
                      {getStatusLabel(invoice.status)}
                    </span>
                  </div>
                  <div className={styles.invoiceDetails}>
                    <div className={styles.invoiceDetail}>
                      <span className={styles.detailLabel}>発行日</span>
                      <span className={styles.detailValue}>{formatDate(invoice.issueDate)}</span>
                    </div>
                    <div className={styles.invoiceDetail}>
                      <span className={styles.detailLabel}>支払期限</span>
                      <span className={styles.detailValue}>{formatDate(invoice.dueDate)}</span>
                    </div>
                    <div className={styles.invoiceDetail}>
                      <span className={styles.detailLabel}>金額</span>
                      <span className={styles.detailValue}>{formatCurrency(invoice.totalAmount)}</span>
                    </div>
                  </div>
                  <div className={styles.invoiceActions}>
                    {invoice.status === 'sent' && client.paymentMethod === 'credit_card' && client.stripePaymentMethodId && (
                      <button
                        className={styles.payButton}
                        onClick={() => handleSinglePayment(invoice)}
                      >
                        支払う
                      </button>
                    )}
                    {invoice.pdfUrl && (
                      <a
                        href={invoice.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.pdfButton}
                      >
                        📄 請求書PDF
                      </a>
                    )}
                    {invoice.status === 'paid' && invoice.receiptUrl && (
                      <a
                        href={invoice.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.receiptButton}
                      >
                        📋 領収書PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2025 AsamiWorks. All rights reserved.</p>
      </footer>
    </div>
  );
}
