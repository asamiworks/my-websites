'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { BankTransferInfo, BusinessType, TaxFilingMethod, BlueReturnDeduction } from '@/types/invoice';
import AdminNav from '@/components/admin/AdminNav';
import styles from './page.module.css';

const ADMIN_EMAIL = 'admin@asami-works.com';

export default function AdminSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [bankInfo, setBankInfo] = useState<BankTransferInfo>({
    bankName: '',
    branchName: '',
    accountType: '',
    accountNumber: '',
    accountHolder: '',
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    closingDayType: 'end_of_month',
    closingDay: undefined as number | undefined,
    issueDayType: 'first_of_next_month',
    issueDay: undefined as number | undefined,
    dueDateType: 'end_of_issue_month',
    dueDateDays: undefined as number | undefined,
    dueDateDay: undefined as number | undefined,
    adjustDueDateForHolidays: true,
    taxRate: 0, // 消費税率（0 = 免税、0.08 = 8%、0.1 = 10%）
  });

  const [businessSettings, setBusinessSettings] = useState({
    businessType: 'sole_proprietorship' as BusinessType,
    taxFilingMethod: 'blue' as TaxFilingMethod,
    blueReturnDeduction: 65 as BlueReturnDeduction,
    fiscalYearEnd: '03-31',
    incorporationDate: '',
    capitalStock: undefined as number | undefined,
    representativeName: '',
  });

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

    if (user && user.email === ADMIN_EMAIL) {
      loadBankInfo();
    }
  }, [user, authLoading, router]);

  const loadBankInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (response.ok) {
        if (data.bankInfo) {
          setBankInfo({
            bankName: data.bankInfo.bankName ?? '',
            branchName: data.bankInfo.branchName ?? '',
            accountType: data.bankInfo.accountType ?? '',
            accountNumber: data.bankInfo.accountNumber ?? '',
            accountHolder: data.bankInfo.accountHolder ?? '',
          });
        }
        if (data.invoiceSettings) {
          setInvoiceSettings(data.invoiceSettings);
        }
        if (data.businessSettings) {
          setBusinessSettings({
            businessType: data.businessSettings.businessType ?? 'sole_proprietorship',
            taxFilingMethod: data.businessSettings.taxFilingMethod ?? 'blue',
            blueReturnDeduction: data.businessSettings.blueReturnDeduction ?? 65,
            fiscalYearEnd: data.businessSettings.fiscalYearEnd ?? '03-31',
            incorporationDate: data.businessSettings.incorporationDate ?? '',
            capitalStock: data.businessSettings.capitalStock,
            representativeName: data.businessSettings.representativeName ?? '',
          });
        }
      } else {
        throw new Error(data.error || '設定の読み込みに失敗しました');
      }
    } catch (err: any) {
      console.error('Error loading settings:', err);
      setError(err.message || '設定の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setSaving(true);

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bankInfo,
          invoiceSettings,
          businessSettings,
          userId: user?.uid,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('設定を保存しました');
      } else {
        throw new Error(data.error || '設定の保存に失敗しました');
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || '設定の保存に失敗しました');
    } finally {
      setSaving(false);
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

  return (
    <div className={styles.pageWrapper}>
      <AdminNav />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>管理者設定</h1>
          <p className={styles.subtitle}>
            銀行振込の振込先情報と請求書の設定を管理します
          </p>
        </div>

      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}

      {success && (
        <div className={styles.successMessage}>{success}</div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 事業設定セクション */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>事業設定</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              事業形態 <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.select}
              value={businessSettings.businessType}
              onChange={(e) => setBusinessSettings({ ...businessSettings, businessType: e.target.value as BusinessType })}
              required
            >
              <option value="sole_proprietorship">個人事業主</option>
              <option value="corporation">法人</option>
            </select>
            <p className={styles.helpText}>
              {businessSettings.businessType === 'sole_proprietorship'
                ? '会計期間：1月1日〜12月31日（暦年）'
                : '会計期間：決算日に基づく任意の1年間'}
            </p>
          </div>

          {businessSettings.businessType === 'sole_proprietorship' ? (
            // 個人事業主用の設定
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  申告方法 <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.select}
                  value={businessSettings.taxFilingMethod}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, taxFilingMethod: e.target.value as TaxFilingMethod })}
                  required
                >
                  <option value="blue">青色申告</option>
                  <option value="white">白色申告</option>
                </select>
              </div>

              {businessSettings.taxFilingMethod === 'blue' && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    青色申告特別控除額
                  </label>
                  <select
                    className={styles.select}
                    value={businessSettings.blueReturnDeduction}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, blueReturnDeduction: Number(e.target.value) as BlueReturnDeduction })}
                  >
                    <option value="65">65万円（電子申告 or 電子帳簿保存）</option>
                    <option value="55">55万円（複式簿記）</option>
                    <option value="10">10万円（簡易簿記）</option>
                  </select>
                </div>
              )}
            </>
          ) : (
            // 法人用の設定
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  決算日 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={businessSettings.fiscalYearEnd}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, fiscalYearEnd: e.target.value })}
                  placeholder="MM-DD形式（例：03-31）"
                  pattern="[0-9]{2}-[0-9]{2}"
                  required
                />
                <p className={styles.helpText}>
                  例：3月決算の場合は「03-31」と入力してください
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  設立日
                </label>
                <input
                  type="date"
                  className={styles.input}
                  value={businessSettings.incorporationDate}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, incorporationDate: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  資本金（万円）
                </label>
                <input
                  type="number"
                  className={styles.input}
                  value={businessSettings.capitalStock || ''}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, capitalStock: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="例：300"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  代表者名
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={businessSettings.representativeName}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, representativeName: e.target.value })}
                  placeholder="例：山田 太郎"
                />
              </div>
            </>
          )}
        </div>

        {/* 振込先情報セクション */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>振込先情報</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              銀行名 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              value={bankInfo.bankName}
              onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
              placeholder="例：みずほ銀行"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              支店名 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              value={bankInfo.branchName}
              onChange={(e) => setBankInfo({ ...bankInfo, branchName: e.target.value })}
              placeholder="例：渋谷支店"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              口座種別 <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.select}
              value={bankInfo.accountType}
              onChange={(e) => setBankInfo({ ...bankInfo, accountType: e.target.value })}
              required
            >
              <option value="">選択してください</option>
              <option value="普通">普通</option>
              <option value="当座">当座</option>
              <option value="貯蓄">貯蓄</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              口座番号 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              value={bankInfo.accountNumber}
              onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
              placeholder="例：1234567"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              口座名義 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              value={bankInfo.accountHolder}
              onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })}
              placeholder="例：カ）アサミワークス"
              required
            />
          </div>
        </div>

        {/* 請求書設定セクション */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>請求書設定</h2>

            {/* 締め日設定 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                締め日 <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={invoiceSettings.closingDayType}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, closingDayType: e.target.value })}
                required
              >
                <option value="end_of_month">月末</option>
                <option value="specific_day">指定日</option>
              </select>
              {invoiceSettings.closingDayType === 'specific_day' && (
                <input
                  type="number"
                  className={styles.input}
                  style={{ marginTop: '8px' }}
                  value={invoiceSettings.closingDay || ''}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, closingDay: parseInt(e.target.value) || undefined })}
                  min="1"
                  max="31"
                  placeholder="日にち（1-31）"
                />
              )}
            </div>

            {/* 発行日設定 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                発行日 <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={invoiceSettings.issueDayType}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, issueDayType: e.target.value })}
                required
              >
                <option value="next_day">締め日の翌日</option>
                <option value="first_of_next_month">翌月1日</option>
                <option value="specific_day">指定日</option>
              </select>
              {invoiceSettings.issueDayType === 'specific_day' && (
                <input
                  type="number"
                  className={styles.input}
                  style={{ marginTop: '8px' }}
                  value={invoiceSettings.issueDay || ''}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, issueDay: parseInt(e.target.value) || undefined })}
                  min="1"
                  max="31"
                  placeholder="日にち（1-31）"
                />
              )}
              <p className={styles.helpText}>
                現在の設定: 締め日{invoiceSettings.closingDayType === 'end_of_month' ? '月末' : `${invoiceSettings.closingDay}日`}の
                {invoiceSettings.issueDayType === 'next_day' ? '翌日' :
                 invoiceSettings.issueDayType === 'first_of_next_month' ? '翌月1日' :
                 `翌月${invoiceSettings.issueDay}日`}に発行
              </p>
            </div>

            {/* 支払い期限設定 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                支払い期限 <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={invoiceSettings.dueDateType}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, dueDateType: e.target.value })}
                required
              >
                <option value="end_of_issue_month">発行月の月末</option>
                <option value="days_after_issue">発行日からN日後</option>
                <option value="specific_day">指定日</option>
              </select>
              {invoiceSettings.dueDateType === 'days_after_issue' && (
                <input
                  type="number"
                  className={styles.input}
                  style={{ marginTop: '8px' }}
                  value={invoiceSettings.dueDateDays || ''}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, dueDateDays: parseInt(e.target.value) || undefined })}
                  min="1"
                  placeholder="日数"
                />
              )}
              {invoiceSettings.dueDateType === 'specific_day' && (
                <input
                  type="number"
                  className={styles.input}
                  style={{ marginTop: '8px' }}
                  value={invoiceSettings.dueDateDay || ''}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, dueDateDay: parseInt(e.target.value) || undefined })}
                  min="1"
                  max="31"
                  placeholder="日にち（1-31）"
                />
              )}
              <p className={styles.helpText}>
                例: 11/1発行の場合、支払い期限は
                {invoiceSettings.dueDateType === 'end_of_issue_month' ? '11/30' :
                 invoiceSettings.dueDateType === 'days_after_issue' ? `発行日から${invoiceSettings.dueDateDays || 'N'}日後` :
                 `11月${invoiceSettings.dueDateDay || 'XX'}日`}
              </p>
            </div>

            {/* 土日祝日前倒し */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={invoiceSettings.adjustDueDateForHolidays}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, adjustDueDateForHolidays: e.target.checked })}
                />
                <span>支払い期限が土日祝日の場合、前営業日に前倒しする</span>
              </label>
            </div>

            {/* 消費税率 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                消費税率 <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={invoiceSettings.taxRate}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, taxRate: parseFloat(e.target.value) })}
                required
              >
                <option value={0}>0% (免税事業者)</option>
                <option value={0.08}>8% (軽減税率)</option>
                <option value={0.1}>10% (標準税率)</option>
              </select>
              <p className={styles.helpText}>
                現在の設定: {invoiceSettings.taxRate === 0 ? '免税事業者（消費税0%）' : `消費税${(invoiceSettings.taxRate * 100).toFixed(0)}%`}
              </p>
            </div>
        </div>

        <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.push('/admin/clients')}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={saving}
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>

        <div className={styles.previewCard}>
          <h2 className={styles.cardTitle}>プレビュー</h2>
          <div className={styles.preview}>
            <div className={styles.previewRow}>
              <span className={styles.previewLabel}>銀行名:</span>
              <span className={styles.previewValue}>{bankInfo.bankName || '未設定'}</span>
            </div>
            <div className={styles.previewRow}>
              <span className={styles.previewLabel}>支店名:</span>
              <span className={styles.previewValue}>{bankInfo.branchName || '未設定'}</span>
            </div>
            <div className={styles.previewRow}>
              <span className={styles.previewLabel}>口座種別:</span>
              <span className={styles.previewValue}>{bankInfo.accountType || '未設定'}</span>
            </div>
            <div className={styles.previewRow}>
              <span className={styles.previewLabel}>口座番号:</span>
              <span className={styles.previewValue}>{bankInfo.accountNumber || '未設定'}</span>
            </div>
            <div className={styles.previewRow}>
              <span className={styles.previewLabel}>口座名義:</span>
              <span className={styles.previewValue}>{bankInfo.accountHolder || '未設定'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
