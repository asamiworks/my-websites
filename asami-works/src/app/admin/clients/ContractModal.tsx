'use client';

import { useState, useEffect } from 'react';
import { Timestamp, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { Client, ManagementFeeSchedule, ProductionFeeBreakdown } from '@/types/invoice';
import styles from './ContractModal.module.css';

interface ContractModalProps {
  client: Client;
  onClose: () => void;
  onSave: (contractData: ContractData) => Promise<void>;
}

export interface ContractData {
  contractStartDate: Date | null;
  productionFee: number;
  productionFeePaid: boolean;
  productionFeeBreakdown: ProductionFeeBreakdown;
  paymentMethod: 'credit_card' | 'bank_transfer';
  billingFrequency: 'monthly' | 'yearly';
  managementFeeSchedule: ManagementFeeSchedule[];
}

export default function ContractModal({ client, onClose, onSave }: ContractModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPaidPeriod, setLastPaidPeriod] = useState<{
    start: any;
    end: any;
  } | null>(null);

  // 最新の支払済み請求書から支払い完了期間を取得
  useEffect(() => {
    const fetchLastPaidPeriod = async () => {
      try {
        const invoicesRef = collection(db, 'invoices');
        const q = query(
          invoicesRef,
          where('clientId', '==', client.id),
          where('status', '==', 'paid'),
          orderBy('billingPeriodEnd', 'desc'),
          limit(1)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const invoiceData = snapshot.docs[0].data();
          if (invoiceData.billingPeriodStart || invoiceData.billingPeriodEnd) {
            setLastPaidPeriod({
              start: invoiceData.billingPeriodStart,
              end: invoiceData.billingPeriodEnd,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching last paid period:', err);
      }
    };

    fetchLastPaidPeriod();
  }, [client.id]);

  // Timestampを安全に日付文字列に変換するヘルパー関数
  const timestampToDateString = (timestamp: any): string => {
    if (!timestamp) return '';
    try {
      if (timestamp.toMillis) {
        return new Date(timestamp.toMillis()).toISOString().split('T')[0];
      } else if (timestamp.toDate) {
        return timestamp.toDate().toISOString().split('T')[0];
      } else if (timestamp instanceof Date) {
        return timestamp.toISOString().split('T')[0];
      }
    } catch (e) {
      console.error('Error converting timestamp:', e);
    }
    return '';
  };

  const [contractData, setContractData] = useState<ContractData>({
    contractStartDate: client.contractStartDate?.toDate() || null,
    productionFee: client.productionFee || 0,
    productionFeePaid: client.productionFeePaid || false,
    productionFeeBreakdown: client.productionFeeBreakdown || {
      initialPayment: undefined,
      initialPaymentDueDate: undefined,
      initialPaymentPaid: false,
      intermediatePayment: undefined,
      intermediatePaymentDueDate: undefined,
      intermediatePaymentPaid: false,
      finalPayment: undefined,
      finalPaymentDueDate: undefined,
      finalPaymentPaid: false,
    },
    paymentMethod: (client.paymentMethod || 'credit_card') as 'credit_card' | 'bank_transfer',
    billingFrequency: client.billingFrequency || 'monthly',
    managementFeeSchedule: client.managementFeeSchedule || [],
  });

  const handleAddSchedule = () => {
    // デフォルトの説明を設定
    const scheduleCount = contractData.managementFeeSchedule.length;
    const description = scheduleCount === 0 ? '月額管理費用1' : scheduleCount === 1 ? '月額管理費用2' : `月額管理費用${scheduleCount + 1}`;

    setContractData({
      ...contractData,
      managementFeeSchedule: [
        ...contractData.managementFeeSchedule,
        {
          fromDate: undefined,
          toDate: undefined,
          monthlyFee: 0,
          description,
        },
      ],
    });
  };

  const handleRemoveSchedule = (index: number) => {
    setContractData({
      ...contractData,
      managementFeeSchedule: contractData.managementFeeSchedule.filter((_, i) => i !== index),
    });
  };

  const handleScheduleChange = (index: number, field: keyof ManagementFeeSchedule, value: any) => {
    const newSchedule = [...contractData.managementFeeSchedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setContractData({ ...contractData, managementFeeSchedule: newSchedule });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    if (!contractData.contractStartDate) {
      setError('契約開始日を入力してください');
      return;
    }

    try {
      setLoading(true);
      await onSave(contractData);
      onClose();
    } catch (err) {
      console.error('Error saving contract:', err);
      setError('契約情報の保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            契約情報 - {client.clientName}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}

          {/* 契約開始日 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              契約開始日 <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              className={styles.input}
              value={contractData.contractStartDate?.toISOString().split('T')[0] || ''}
              onChange={(e) =>
                setContractData({
                  ...contractData,
                  contractStartDate: e.target.value ? new Date(e.target.value) : null,
                })
              }
              required
            />
          </div>

          {/* 制作費の内訳 */}
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>制作費の内訳</h3>
          </div>

          {/* 初期費用 */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>初期費用</label>
              <input
                type="number"
                className={styles.input}
                value={contractData.productionFeeBreakdown.initialPayment || ''}
                onChange={(e) =>
                  setContractData({
                    ...contractData,
                    productionFeeBreakdown: {
                      ...contractData.productionFeeBreakdown,
                      initialPayment: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })
                }
                min="0"
                step="1"
                placeholder="金額（円）"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>請求日</label>
              <input
                type="date"
                className={styles.input}
                value={timestampToDateString(contractData.productionFeeBreakdown.initialPaymentDueDate)}
                onChange={(e) =>
                  setContractData({
                    ...contractData,
                    productionFeeBreakdown: {
                      ...contractData.productionFeeBreakdown,
                      initialPaymentDueDate: e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : undefined,
                    },
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={contractData.productionFeeBreakdown.initialPaymentPaid || false}
                  onChange={(e) =>
                    setContractData({
                      ...contractData,
                      productionFeeBreakdown: {
                        ...contractData.productionFeeBreakdown,
                        initialPaymentPaid: e.target.checked,
                      },
                    })
                  }
                />
                <span>支払済み</span>
              </label>
            </div>
          </div>

          {/* 中間費用 */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>中間費用</label>
              <input
                type="number"
                className={styles.input}
                value={contractData.productionFeeBreakdown.intermediatePayment || ''}
                onChange={(e) =>
                  setContractData({
                    ...contractData,
                    productionFeeBreakdown: {
                      ...contractData.productionFeeBreakdown,
                      intermediatePayment: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })
                }
                min="0"
                step="1"
                placeholder="金額（円）"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>請求日</label>
              <input
                type="date"
                className={styles.input}
                value={timestampToDateString(contractData.productionFeeBreakdown.intermediatePaymentDueDate)}
                onChange={(e) =>
                  setContractData({
                    ...contractData,
                    productionFeeBreakdown: {
                      ...contractData.productionFeeBreakdown,
                      intermediatePaymentDueDate: e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : undefined,
                    },
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={contractData.productionFeeBreakdown.intermediatePaymentPaid || false}
                  onChange={(e) =>
                    setContractData({
                      ...contractData,
                      productionFeeBreakdown: {
                        ...contractData.productionFeeBreakdown,
                        intermediatePaymentPaid: e.target.checked,
                      },
                    })
                  }
                />
                <span>支払済み</span>
              </label>
            </div>
          </div>

          {/* 最終金 */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>最終金</label>
              <input
                type="number"
                className={styles.input}
                value={contractData.productionFeeBreakdown.finalPayment || ''}
                onChange={(e) =>
                  setContractData({
                    ...contractData,
                    productionFeeBreakdown: {
                      ...contractData.productionFeeBreakdown,
                      finalPayment: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })
                }
                min="0"
                step="1"
                placeholder="金額（円）"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>請求日</label>
              <input
                type="date"
                className={styles.input}
                value={timestampToDateString(contractData.productionFeeBreakdown.finalPaymentDueDate)}
                onChange={(e) =>
                  setContractData({
                    ...contractData,
                    productionFeeBreakdown: {
                      ...contractData.productionFeeBreakdown,
                      finalPaymentDueDate: e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : undefined,
                    },
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={contractData.productionFeeBreakdown.finalPaymentPaid || false}
                  onChange={(e) =>
                    setContractData({
                      ...contractData,
                      productionFeeBreakdown: {
                        ...contractData.productionFeeBreakdown,
                        finalPaymentPaid: e.target.checked,
                      },
                    })
                  }
                />
                <span>支払済み</span>
              </label>
            </div>
          </div>

          {/* 支払い方法 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>支払い方法</label>
            <select
              className={styles.select}
              value={contractData.paymentMethod}
              onChange={(e) =>
                setContractData({
                  ...contractData,
                  paymentMethod: e.target.value as 'credit_card' | 'bank_transfer',
                })
              }
            >
              <option value="credit_card">クレジットカード</option>
              <option value="bank_transfer">銀行振込</option>
            </select>
          </div>

          {/* 請求頻度 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              請求頻度 <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.select}
              value={contractData.billingFrequency}
              onChange={(e) =>
                setContractData({
                  ...contractData,
                  billingFrequency: e.target.value as 'monthly' | 'yearly',
                })
              }
              required
            >
              <option value="monthly">月額請求</option>
              <option value="yearly">年額請求（11ヶ月分 + 1ヶ月サービス）</option>
            </select>
            <p className={styles.helpText}>
              月額請求: 毎月請求書を発行します<br />
              年額請求: 契約開始月に年1回、11ヶ月分の料金で請求します（1ヶ月サービス）
            </p>
          </div>

          {/* 支払い完了期間（読み取り専用・請求書データから取得） */}
          {lastPaidPeriod && (
            <div className={styles.formGroup}>
              <label className={styles.label}>支払い完了期間</label>
              <div className={styles.readOnlyField}>
                {lastPaidPeriod.start && timestampToDateString(lastPaidPeriod.start)}
                {lastPaidPeriod.start && lastPaidPeriod.end && ' 〜 '}
                {lastPaidPeriod.end && timestampToDateString(lastPaidPeriod.end)}
              </div>
              <p className={styles.helpText}>
                最新の支払済み請求書から自動取得されます
              </p>
            </div>
          )}

          {/* 管理費スケジュール */}
          <div className={styles.scheduleSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>管理費スケジュール</h3>
              <button
                type="button"
                className={styles.addButton}
                onClick={handleAddSchedule}
              >
                + 期間を追加
              </button>
            </div>

            {contractData.managementFeeSchedule.length === 0 ? (
              <p className={styles.emptyText}>
                管理費スケジュールが設定されていません
              </p>
            ) : (
              <div className={styles.scheduleList}>
                {contractData.managementFeeSchedule.map((schedule, index) => (
                  <div key={index} className={styles.scheduleItem}>
                    <div className={styles.scheduleFields}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>説明</label>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="例：月額管理費用1"
                          value={schedule.description || ''}
                          onChange={(e) => handleScheduleChange(index, 'description', e.target.value)}
                        />
                      </div>

                      <div className={styles.periodFields}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>開始日</label>
                          <input
                            type="date"
                            className={styles.input}
                            value={timestampToDateString(schedule.fromDate)}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                'fromDate',
                                e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : undefined
                              )
                            }
                          />
                        </div>
                        <span style={{ margin: '0 10px', alignSelf: 'center' }}>〜</span>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>終了日（空欄で無期限）</label>
                          <input
                            type="date"
                            className={styles.input}
                            placeholder="無期限の場合は空欄"
                            value={timestampToDateString(schedule.toDate)}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                'toDate',
                                e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : undefined
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className={styles.feeField}>
                        <label className={styles.label}>月額管理費</label>
                        <input
                          type="number"
                          className={styles.input}
                          placeholder="月額管理費"
                          value={schedule.monthlyFee}
                          onChange={(e) =>
                            handleScheduleChange(index, 'monthlyFee', parseInt(e.target.value) || 0)
                          }
                          min="0"
                          step="1"
                          required
                        />
                        <span>円</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemoveSchedule(index)}
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              キャンセル
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
