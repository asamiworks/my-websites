'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import { Expense, ExpenseCategory, EXPENSE_CATEGORY_LABELS } from '@/types/invoice';
import styles from './page.module.css';

const ADMIN_EMAIL = 'admin@asami-works.com';

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  communication: '#3182ce',
  transportation: '#38a169',
  supplies: '#dd6b20',
  utilities: '#d69e2e',
  rent: '#805ad5',
  outsourcing: '#e53e3e',
  advertising: '#ed64a6',
  entertainment: '#667eea',
  insurance: '#38b2ac',
  depreciation: '#718096',
  taxes: '#c53030',
  professional_fees: '#2c5282',
  software: '#00b5d8',
  education: '#9f7aea',
  officer_compensation: '#742a2a',
  employee_salary: '#276749',
  welfare_expenses: '#5f370e',
  meeting_expenses: '#553c9a',
  statutory_welfare: '#1a365d',
  other: '#a0aec0',
};

export default function AdminExpensesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // フィルター
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear().toString());
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // フォームデータ
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'supplies' as ExpenseCategory,
    amount: 0,
    description: '',
    vendor: '',
    receiptUrl: '',
    taxDeductible: true,
    homeUseRatio: 100,
    paymentMethod: 'cash' as 'cash' | 'card' | 'bank_transfer' | 'other',
    memo: '',
    tags: [] as string[],
  });

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
      loadExpenses();
    }
  }, [user, authLoading, router, fiscalYear, selectedCategory, startDate, endDate]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (fiscalYear) params.append('fiscalYear', fiscalYear);
      if (selectedCategory) params.append('category', selectedCategory);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/admin/expenses?${params}`);
      const data = await response.json();

      if (response.ok) {
        setExpenses(data.expenses);
      } else {
        throw new Error(data.error || '経費の読み込みに失敗しました');
      }
    } catch (err: any) {
      console.error('Error loading expenses:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      const date = expense.date.toDate ? expense.date.toDate() : new Date(expense.date as any);
      setFormData({
        date: date.toISOString().split('T')[0],
        category: expense.category,
        amount: expense.amount,
        description: expense.description,
        vendor: expense.vendor || '',
        receiptUrl: expense.receiptUrl || '',
        taxDeductible: expense.taxDeductible,
        homeUseRatio: expense.homeUseRatio || 100,
        paymentMethod: expense.paymentMethod || 'cash',
        memo: expense.memo || '',
        tags: expense.tags || [],
      });
    } else {
      setEditingExpense(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: 'supplies',
        amount: 0,
        description: '',
        vendor: '',
        receiptUrl: '',
        taxDeductible: true,
        homeUseRatio: 100,
        paymentMethod: 'cash',
        memo: '',
        tags: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExpense(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingExpense) {
        // 更新
        const response = await fetch(`/api/admin/expenses/${editingExpense.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || '経費の更新に失敗しました');
        }

        alert('経費を更新しました');
      } else {
        // 新規作成
        const response = await fetch('/api/admin/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || '経費の作成に失敗しました');
        }

        alert('経費を登録しました');
      }

      handleCloseModal();
      loadExpenses();
    } catch (err: any) {
      console.error('Error saving expense:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (expense: Expense) => {
    if (!confirm(`経費「${expense.description}」を削除しますか？`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/expenses/${expense.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '経費の削除に失敗しました');
      }

      alert('経費を削除しました');
      loadExpenses();
    } catch (err: any) {
      console.error('Error deleting expense:', err);
      alert(err.message);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        type: 'expenses',
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
      a.download = `expenses_${fiscalYear}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Error exporting:', err);
      alert('エクスポートに失敗しました');
    }
  };

  // 集計
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalDeductible = expenses.reduce((sum, exp) => {
    const amount = exp.taxDeductible && exp.deductibleAmount
      ? exp.deductibleAmount
      : (exp.taxDeductible ? exp.amount : 0);
    return sum + amount;
  }, 0);
  const categoryBreakdown = expenses.reduce((acc, exp) => {
    const amount = exp.taxDeductible && exp.deductibleAmount
      ? exp.deductibleAmount
      : (exp.taxDeductible ? exp.amount : 0);
    acc[exp.category] = (acc[exp.category] || 0) + amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

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
            <h1 className={styles.title}>経費管理</h1>
            <p className={styles.subtitle}>
              {expenses.length}件の経費 | 合計 ¥{totalAmount.toLocaleString()}
            </p>
          </div>
          <div className={styles.headerButtons}>
            <button className={styles.exportButton} onClick={handleExport}>
              📊 CSVエクスポート
            </button>
            <button className={styles.addButton} onClick={() => handleOpenModal()}>
              + 経費を追加
            </button>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>{error}</div>
        )}

        {/* フィルター */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>年度</label>
            <select
              className={styles.filterSelect}
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}年</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>カテゴリ</label>
            <select
              className={styles.filterSelect}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ExpenseCategory | '')}
            >
              <option value="">すべてのカテゴリ</option>
              {Object.entries(EXPENSE_CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>開始日</label>
            <input
              type="date"
              className={styles.filterInput}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>終了日</label>
            <input
              type="date"
              className={styles.filterInput}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* サマリー */}
        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>総経費</div>
            <div className={styles.summaryValue}>
              ¥{totalAmount.toLocaleString()}
            </div>
            <div className={styles.summarySubtext}>{expenses.length}件</div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>経費計上額</div>
            <div className={styles.summaryValue}>
              ¥{totalDeductible.toLocaleString()}
            </div>
            <div className={styles.summarySubtext}>
              {totalAmount > 0 ? `${Math.round((totalDeductible / totalAmount) * 100)}%` : '0%'}
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>平均経費</div>
            <div className={styles.summaryValue}>
              ¥{expenses.length > 0 ? Math.round(totalAmount / expenses.length).toLocaleString() : 0}
            </div>
            <div className={styles.summarySubtext}>1件あたり</div>
          </div>
        </div>

        {/* 経費テーブル */}
        {expenses.length === 0 ? (
          <div className={styles.empty}>
            <p>経費がありません</p>
            <button className={styles.addButton} onClick={() => handleOpenModal()}>
              最初の経費を登録
            </button>
          </div>
        ) : (
          <div className={styles.expensesTable}>
            <table>
              <thead>
                <tr>
                  <th>日付</th>
                  <th>カテゴリ</th>
                  <th>摘要</th>
                  <th>支払先</th>
                  <th>金額</th>
                  <th>経費計上額</th>
                  <th>支払方法</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => {
                  const date = expense.date.toDate ? expense.date.toDate() : new Date(expense.date as any);
                  const deductibleAmount = expense.taxDeductible && expense.deductibleAmount
                    ? expense.deductibleAmount
                    : (expense.taxDeductible ? expense.amount : 0);

                  return (
                    <tr key={expense.id}>
                      <td>{date.toLocaleDateString('ja-JP')}</td>
                      <td>
                        <span
                          className={styles.categoryBadge}
                          style={{
                            backgroundColor: `${CATEGORY_COLORS[expense.category]}20`,
                            color: CATEGORY_COLORS[expense.category],
                          }}
                        >
                          {EXPENSE_CATEGORY_LABELS[expense.category]}
                        </span>
                      </td>
                      <td>
                        {expense.description}
                        {expense.memo && (
                          <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                            {expense.memo}
                          </div>
                        )}
                      </td>
                      <td>{expense.vendor || '-'}</td>
                      <td className={styles.amount}>¥{expense.amount.toLocaleString()}</td>
                      <td>
                        <div className={styles.amount}>¥{deductibleAmount.toLocaleString()}</div>
                        {expense.homeUseRatio && expense.homeUseRatio < 100 && (
                          <div className={styles.deductible}>
                            按分率 {expense.homeUseRatio}%
                          </div>
                        )}
                        {!expense.taxDeductible && (
                          <div className={styles.nonDeductible}>経費計上不可</div>
                        )}
                      </td>
                      <td>
                        {expense.paymentMethod === 'cash' && '現金'}
                        {expense.paymentMethod === 'card' && 'カード'}
                        {expense.paymentMethod === 'bank_transfer' && '振込'}
                        {expense.paymentMethod === 'other' && 'その他'}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.editButton}
                            onClick={() => handleOpenModal(expense)}
                          >
                            編集
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(expense)}
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* モーダル */}
        {showModal && (
          <div className={styles.modal} onClick={handleCloseModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {editingExpense ? '経費編集' : '経費登録'}
                </h2>
                <button className={styles.closeButton} onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      日付 <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="date"
                      className={styles.input}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      カテゴリ <span className={styles.required}>*</span>
                    </label>
                    <select
                      className={styles.select}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                      required
                    >
                      {Object.entries(EXPENSE_CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      金額 <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      className={styles.input}
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                      min="0"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>支払方法</label>
                    <select
                      className={styles.select}
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    >
                      <option value="cash">現金</option>
                      <option value="card">カード</option>
                      <option value="bank_transfer">振込</option>
                      <option value="other">その他</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    摘要 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="例：事務用品購入"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>支払先</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    placeholder="例：Amazon"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.taxDeductible}
                      onChange={(e) => setFormData({ ...formData, taxDeductible: e.target.checked })}
                    />
                    <span>経費として計上する</span>
                  </label>
                </div>

                {formData.taxDeductible && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      家事按分率（個人事業主用）
                    </label>
                    <input
                      type="number"
                      className={styles.input}
                      value={formData.homeUseRatio}
                      onChange={(e) => setFormData({ ...formData, homeUseRatio: parseInt(e.target.value) || 100 })}
                      min="0"
                      max="100"
                    />
                    <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
                      経費計上額: ¥{Math.round(formData.amount * (formData.homeUseRatio / 100)).toLocaleString()}
                    </div>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.label}>メモ</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.memo}
                    onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                    placeholder="補足情報があれば入力してください"
                    rows={3}
                  />
                </div>

                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                    キャンセル
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    {editingExpense ? '更新' : '登録'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
