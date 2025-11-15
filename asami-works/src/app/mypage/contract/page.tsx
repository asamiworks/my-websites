'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { Client, BankTransferInfo } from '@/types/invoice';
import styles from './page.module.css';

export default function ContractPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [bankInfo, setBankInfo] = useState<BankTransferInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      loadContractData();
    }
  }, [user, authLoading, router]);

  const loadContractData = async () => {
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

      // 銀行振込の場合は振込先情報を取得
      if (clientData.paymentMethod === 'bank_transfer') {
        const bankDoc = await getDoc(doc(db, 'settings', 'bank_transfer'));
        if (bankDoc.exists()) {
          setBankInfo(bankDoc.data() as BankTransferInfo);
        }
      }
    } catch (err) {
      console.error('Error loading contract data:', err);
      setError('契約情報の読み込みに失敗しました');
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

  const calculateMonthsFromStart = () => {
    if (!client?.contractStartDate) return 0;
    const startDate = client.contractStartDate.toDate();
    const now = new Date();
    const months = (now.getFullYear() - startDate.getFullYear()) * 12 +
                   (now.getMonth() - startDate.getMonth()) + 1;
    return Math.max(0, months);
  };

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

  if (!client) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/mypage/dashboard')}>
          ← ダッシュボードに戻る
        </button>
        <h1 className={styles.title}>契約情報</h1>
      </div>

      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}

      {/* 基本情報 */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>基本情報</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoRow}>
            <span className={styles.label}>クライアント名:</span>
            <span className={styles.value}>{client.clientName}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>メールアドレス:</span>
            <span className={styles.value}>{client.email}</span>
          </div>
          {client.phone && (
            <div className={styles.infoRow}>
              <span className={styles.label}>電話番号:</span>
              <span className={styles.value}>{client.phone}</span>
            </div>
          )}
          {client.address && (
            <div className={styles.infoRow}>
              <span className={styles.label}>住所:</span>
              <span className={styles.value}>{client.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* 契約詳細 */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>契約詳細</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoRow}>
            <span className={styles.label}>契約開始日:</span>
            <span className={styles.value}>{formatDate(client.contractStartDate)}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>契約月数:</span>
            <span className={styles.value}>{calculateMonthsFromStart()}ヶ月目</span>
          </div>
          {client.productionFee && client.productionFee > 0 && (
            <>
              <div className={styles.infoRow}>
                <span className={styles.label}>制作費:</span>
                <span className={styles.value}>{formatCurrency(client.productionFee)}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>制作費支払い:</span>
                <span className={styles.value}>
                  {client.productionFeePaid ? (
                    <span className={styles.paidBadge}>支払済み</span>
                  ) : (
                    <span className={styles.unpaidBadge}>未払い</span>
                  )}
                </span>
              </div>
            </>
          )}
          <div className={styles.infoRow}>
            <span className={styles.label}>支払方法:</span>
            <span className={styles.value}>
              {client.paymentMethod === 'credit_card' ? 'クレジットカード' : '銀行振込'}
            </span>
          </div>
        </div>
      </div>

      {/* 管理費スケジュール */}
      {client.managementFeeSchedule && client.managementFeeSchedule.length > 0 && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>管理費スケジュール</h2>
          <div className={styles.scheduleList}>
            {client.managementFeeSchedule.map((schedule, index) => (
              <div key={index} className={styles.scheduleItem}>
                <div className={styles.schedulePeriod}>
                  {schedule.fromMonth}ヶ月目
                  {schedule.toMonth ? ` 〜 ${schedule.toMonth}ヶ月目` : ' 〜 '}
                </div>
                <div className={styles.scheduleFee}>
                  {formatCurrency(schedule.monthlyFee)}/月
                </div>
                {schedule.description && (
                  <div className={styles.scheduleDescription}>
                    {schedule.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 振込先情報（銀行振込の場合） */}
      {client.paymentMethod === 'bank_transfer' && bankInfo && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>振込先情報</h2>
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
            <p>※ お振込の際は、請求書番号をお名前の後にご記入ください。</p>
            <p>※ 振込手数料はお客様負担となります。</p>
          </div>
        </div>
      )}
    </div>
  );
}
