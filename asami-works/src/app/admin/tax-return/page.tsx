'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import { EXPENSE_CATEGORY_LABELS } from '@/types/invoice';
import styles from './page.module.css';

const ADMIN_EMAIL = 'admin@asami-works.com';

export default function AdminTaxReturnPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taxData, setTaxData] = useState<any>(null);

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
      loadTaxReturnData();
    }
  }, [user, authLoading, router, fiscalYear]);

  const loadTaxReturnData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ fiscalYear });
      const response = await fetch(`/api/admin/tax/return?${params}`);
      const data = await response.json();

      if (response.ok) {
        setTaxData(data);
      } else {
        throw new Error(data.error || 'データの読み込みに失敗しました');
      }
    } catch (err: any) {
      console.error('Error loading tax return data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        type: 'financial',
        format: 'csv',
        fiscalYear,
      });

      const response = await fetch(`/api/admin/export?${params}`);

      if (!response.ok) {
        throw new Error('エクスポートに失敗しました');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tax_return_${fiscalYear}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Error exporting:', err);
      alert('エクスポートに失敗しました');
    }
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

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <AdminNav />
        <div className={styles.container}>
          <div className={styles.errorMessage}>{error}</div>
        </div>
      </div>
    );
  }

  if (!taxData) {
    return (
      <div className={styles.pageWrapper}>
        <AdminNav />
        <div className={styles.container}>
          <div className={styles.error}>データがありません</div>
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
            <h1 className={styles.title}>確定申告サポート</h1>
            <p className={styles.subtitle}>
              {fiscalYear}年度の収支・税額計算
            </p>
          </div>
          <div className={styles.controls}>
            <select
              className={styles.yearSelector}
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}年</option>
              ))}
            </select>
            <button className={styles.exportButton} onClick={handleExport}>
              📊 CSVエクスポート
            </button>
          </div>
        </div>

        {/* アラート */}
        <div className={styles.alert}>
          <div className={styles.alertTitle}>⚠️ 重要なお知らせ</div>
          <div className={styles.alertText}>
            このページの税額計算は概算です。実際の確定申告では、控除額や所得税率などが個人の状況により異なります。
            必ず税理士または税務署にご相談ください。
          </div>
        </div>

        {/* サマリー */}
        <div className={styles.summaryCard}>
          <h2 className={styles.sectionTitle}>収支サマリー</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>売上高</div>
              <div className={styles.infoValue}>
                ¥{taxData.summary.totalRevenue.toLocaleString()}
              </div>
              <div className={styles.infoSubtext}>
                {taxData.invoiceCount}件の請求書
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>経費合計</div>
              <div className={styles.infoValue}>
                ¥{taxData.summary.totalExpenses.toLocaleString()}
              </div>
              <div className={styles.infoSubtext}>
                {taxData.expenseCount}件の経費
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>事業所得</div>
              <div className={styles.infoValue}>
                ¥{taxData.summary.businessIncome.toLocaleString()}
              </div>
              <div className={styles.infoSubtext}>
                売上 - 経費
              </div>
            </div>
          </div>
        </div>

        {/* 所得計算 */}
        <div className={styles.calculation}>
          <h2 className={styles.sectionTitle}>所得・税額計算</h2>

          <div className={styles.calculationRow}>
            <div className={styles.calculationLabel}>売上高</div>
            <div className={styles.calculationValue}>
              ¥{taxData.revenue.toLocaleString()}
            </div>
          </div>

          <div className={styles.calculationRow}>
            <div className={styles.calculationLabel}>必要経費</div>
            <div className={styles.calculationValue}>
              -¥{taxData.expenses.total.toLocaleString()}
            </div>
          </div>

          <div className={`${styles.calculationRow} ${styles.highlight}`}>
            <div className={styles.calculationLabel}>事業所得（売上 - 経費）</div>
            <div className={styles.calculationValue}>
              ¥{taxData.income.business.toLocaleString()}
            </div>
          </div>

          <div className={styles.calculationRow}>
            <div className={styles.calculationLabel}>
              青色申告特別控除
              <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                電子申告または電子帳簿保存で65万円控除
              </div>
            </div>
            <div className={styles.calculationValue}>
              -¥{taxData.income.blueReturnDeduction.toLocaleString()}
            </div>
          </div>

          <div className={`${styles.calculationRow} ${styles.total}`}>
            <div className={styles.calculationLabel}>課税所得</div>
            <div className={styles.calculationValue}>
              ¥{taxData.income.taxable.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 税額 */}
        <div className={styles.calculation}>
          <h2 className={styles.sectionTitle}>概算税額</h2>

          <div className={styles.calculationRow}>
            <div className={styles.calculationLabel}>
              源泉徴収税額（既納付）
              <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                報酬から差し引かれた税額
              </div>
            </div>
            <div className={styles.calculationValue}>
              ¥{taxData.tax.withholdingTax.toLocaleString()}
            </div>
          </div>

          <div className={styles.calculationRow}>
            <div className={styles.calculationLabel}>
              概算所得税
              <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                累進課税適用後
              </div>
            </div>
            <div className={styles.calculationValue}>
              ¥{taxData.tax.estimatedIncomeTax.toLocaleString()}
            </div>
          </div>

          <div className={styles.calculationRow}>
            <div className={styles.calculationLabel}>
              概算住民税
              <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                課税所得の10%
              </div>
            </div>
            <div className={styles.calculationValue}>
              ¥{taxData.tax.estimatedResidentTax.toLocaleString()}
            </div>
          </div>

          <div className={styles.calculationRow}>
            <div className={styles.calculationLabel}>
              概算事業税
              <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                (事業所得 - 290万円) × 5%
              </div>
            </div>
            <div className={styles.calculationValue}>
              ¥{taxData.tax.estimatedBusinessTax.toLocaleString()}
            </div>
          </div>

          <div className={`${styles.calculationRow} ${styles.total}`}>
            <div className={styles.calculationLabel}>
              概算税額合計
              <div style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.9 }}>
                所得税 + 住民税 + 事業税
              </div>
            </div>
            <div className={styles.calculationValue}>
              ¥{taxData.tax.totalEstimatedTax.toLocaleString()}
            </div>
          </div>

          <div className={`${styles.calculationRow} ${styles.highlight}`}>
            <div className={styles.calculationLabel}>
              税引後手取り
              <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                事業所得 - 概算税額合計
              </div>
            </div>
            <div className={styles.calculationValue}>
              ¥{taxData.summary.netIncomeAfterTax.toLocaleString()}
            </div>
          </div>
        </div>

        {/* カテゴリ別経費 */}
        <div className={styles.expensesTable}>
          <h2 className={styles.sectionTitle}>カテゴリ別経費内訳</h2>
          <table>
            <thead>
              <tr>
                <th>カテゴリ</th>
                <th style={{ textAlign: 'right' }}>金額</th>
                <th style={{ textAlign: 'right' }}>割合</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(taxData.expenses.byCategory)
                .filter(([_, amount]: [string, any]) => amount > 0)
                .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                .map(([category, amount]: [string, any]) => (
                  <tr key={category}>
                    <td>{EXPENSE_CATEGORY_LABELS[category as keyof typeof EXPENSE_CATEGORY_LABELS]}</td>
                    <td className={styles.amount} style={{ textAlign: 'right' }}>
                      ¥{amount.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', color: '#718096' }}>
                      {((amount / taxData.expenses.total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              <tr style={{ fontWeight: 700, background: '#f7fafc' }}>
                <td>合計</td>
                <td className={styles.amount} style={{ textAlign: 'right' }}>
                  ¥{taxData.expenses.total.toLocaleString()}
                </td>
                <td style={{ textAlign: 'right' }}>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
