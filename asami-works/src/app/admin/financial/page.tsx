'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { EXPENSE_CATEGORY_LABELS } from '@/types/invoice';
import styles from './page.module.css';

const ADMIN_EMAIL = 'admin@asami-works.com';

const COLORS = [
  '#3182ce', '#38a169', '#dd6b20', '#d69e2e', '#805ad5',
  '#e53e3e', '#ed64a6', '#667eea', '#38b2ac', '#718096',
  '#c53030', '#2c5282', '#00b5d8', '#9f7aea', '#a0aec0',
];

export default function AdminFinancialPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);

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
      loadFinancialReport();
    }
  }, [user, authLoading, router, fiscalYear]);

  const loadFinancialReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        fiscalYear,
        period: 'yearly',
      });

      const response = await fetch(`/api/admin/financial/reports?${params}`);
      const data = await response.json();

      if (response.ok) {
        setReportData(data);
      } else {
        throw new Error(data.error || 'レポートの読み込みに失敗しました');
      }
    } catch (err: any) {
      console.error('Error loading financial report:', err);
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
      a.download = `financial_report_${fiscalYear}.csv`;
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

  if (!reportData) {
    return (
      <div className={styles.pageWrapper}>
        <AdminNav />
        <div className={styles.container}>
          <div className={styles.error}>データがありません</div>
        </div>
      </div>
    );
  }

  const { summary, monthlyData } = reportData;

  // カテゴリ別経費データ（円グラフ用）
  const pieChartData = summary.expenses.byCategoryWithLabels.map((item: any, index: number) => ({
    name: item.label,
    value: item.amount,
    color: COLORS[index % COLORS.length],
  }));

  // 月次推移データ（折れ線グラフ用）
  const lineChartData = monthlyData?.map((item: any) => ({
    month: `${item.month}月`,
    売上: item.revenue,
    経費: item.expenses,
    利益: item.profit,
  })) || [];

  // 月次推移データ（棒グラフ用）
  const barChartData = monthlyData?.map((item: any) => ({
    month: `${item.month}月`,
    売上: item.revenue,
    経費: item.expenses,
  })) || [];

  return (
    <div className={styles.pageWrapper}>
      <AdminNav />
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>財務ダッシュボード</h1>
            <p className={styles.subtitle}>
              売上・経費・利益の分析と可視化
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

        {/* KPI カード */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              💰
            </div>
            <div className={styles.kpiLabel}>売上高</div>
            <div className={styles.kpiValue}>
              ¥{summary.revenue.total.toLocaleString()}
            </div>
            <div className={styles.kpiChange}>
              {summary.counts.invoices}件の請求書
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              📊
            </div>
            <div className={styles.kpiLabel}>総経費</div>
            <div className={styles.kpiValue}>
              ¥{summary.expenses.total.toLocaleString()}
            </div>
            <div className={styles.kpiChange}>
              {summary.counts.expenses}件の経費
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              💹
            </div>
            <div className={styles.kpiLabel}>営業利益</div>
            <div className={styles.kpiValue}>
              ¥{summary.profit.operating.toLocaleString()}
            </div>
            <div className={`${styles.kpiChange} ${summary.profit.operating >= 0 ? styles.positive : styles.negative}`}>
              利益率 {summary.profit.margin.toFixed(1)}%
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
              ✅
            </div>
            <div className={styles.kpiLabel}>入金済み</div>
            <div className={styles.kpiValue}>
              ¥{summary.revenue.paid.toLocaleString()}
            </div>
            <div className={styles.kpiChange}>
              {summary.revenue.total > 0
                ? `${Math.round((summary.revenue.paid / summary.revenue.total) * 100)}%`
                : '0%'} 回収済み
            </div>
          </div>
        </div>

        {/* チャート */}
        <div className={styles.chartsGrid}>
          {/* 月次推移（折れ線グラフ） */}
          <div className={`${styles.chartCard} ${styles.fullWidthChart}`}>
            <h3 className={styles.chartTitle}>月次収支推移</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="売上"
                  stroke="#667eea"
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="経費"
                  stroke="#f5576c"
                  strokeWidth={3}
                  dot={{ fill: '#f5576c', r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="利益"
                  stroke="#43e97b"
                  strokeWidth={3}
                  dot={{ fill: '#43e97b', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 売上vs経費（棒グラフ） */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>月次売上・経費比較</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="売上" fill="#667eea" />
                <Bar dataKey="経費" fill="#f5576c" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* カテゴリ別経費（円グラフ） */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>カテゴリ別経費内訳</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>

            <div className={styles.categoryLegend}>
              {pieChartData.map((item: any, index: number) => (
                <div key={index} className={styles.categoryItem}>
                  <div
                    className={styles.categoryColor}
                    style={{ backgroundColor: item.color }}
                  />
                  <div className={styles.categoryLabel}>{item.name}</div>
                  <div className={styles.categoryAmount}>
                    ¥{item.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
