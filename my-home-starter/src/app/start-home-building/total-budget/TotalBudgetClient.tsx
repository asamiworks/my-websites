"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useSimulator } from "../../../contexts/SimulatorContext";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../contexts/ToastContext";
import styles from "./TotalBudgetPage.module.css";

// Modalのアプリケーション要素を設定（アクセシビリティ対応）
if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

const TotalBudgetClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, updateTotalBudget, isLoading, setEditMode } = useSimulator();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // 編集モードかどうかを判定（summaryまたはmypageから）
  const fromParam = searchParams ? searchParams.get('from') : null;
  const isEditMode = fromParam === 'summary' || fromParam === 'mypage';
  const isFromMyPage = fromParam === 'mypage';

  // フォーム状態
  const [annualIncome, setAnnualIncome] = useState("");
  const [monthlyLoanRepayment, setMonthlyLoanRepayment] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [spouseIncome, setSpouseIncome] = useState("");
  const [spouseLoanRepayment, setSpouseLoanRepayment] = useState("");
  const [showSpouseFields, setShowSpouseFields] = useState(false);
  
  // 計算結果
  const [totalBudget, setTotalBudget] = useState<number | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isInputValid, setIsInputValid] = useState(true);
  const [repaymentRate] = useState(0.003849);

  // モーダル状態
  const [isAnnualIncomeModalOpen, setIsAnnualIncomeModalOpen] = useState(false);
  const [isLoanRepaymentModalOpen, setIsLoanRepaymentModalOpen] = useState(false);
  const [isDownPaymentModalOpen, setIsDownPaymentModalOpen] = useState(false);
  const [isSpouseIncomeModalOpen, setIsSpouseIncomeModalOpen] = useState(false);

  // 編集モードの設定
  useEffect(() => {
    if (setEditMode) {
      setEditMode(isFromMyPage);
    }
  }, [isFromMyPage, setEditMode]);

  // 初期データの読み込み
  useEffect(() => {
    if (data && !isLoading) {
      if (data.annualIncome) setAnnualIncome(data.annualIncome.toString());
      if (data.monthlyLoanRepayment) setMonthlyLoanRepayment(data.monthlyLoanRepayment.toString());
      if (data.downPayment) setDownPayment(data.downPayment.toString());
      if (data.spouseIncome) {
        setSpouseIncome(data.spouseIncome.toString());
        setShowSpouseFields(data.spouseIncome > 0);
      }
      if (data.spouseLoanRepayment) setSpouseLoanRepayment(data.spouseLoanRepayment.toString());
      if (data.totalBudget) {
        setTotalBudget(data.totalBudget);
        setIsCalculated(true);
      }
    }
  }, [data, isLoading]);

  // 入力値の変更ハンドラー
  const handleInputChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setIsCalculated(false);
  };

  // 改善された諸経費計算関数
  const calculateMiscCosts = (totalBudget: number): number => {
    let rate = 0.08;
    
    if (totalBudget <= 3000) {
      rate = 0.10;
    } else if (totalBudget <= 5000) {
      const excess = totalBudget - 3000;
      const rateReduction = (excess / 2000) * 0.02;
      rate = 0.10 - rateReduction;
    } else {
      const excess = totalBudget - 5000;
      const rateReduction = Math.min(excess / 5000 * 0.02, 0.02);
      rate = 0.08 - rateReduction;
    }
    
    return Math.floor(totalBudget * rate);
  };

  // 総予算計算
  const calculateTotalBudget = useCallback(async () => {
    const annualIncomeNum = parseFloat(annualIncome) || 0;
    const monthlyLoanRepaymentNum = parseFloat(monthlyLoanRepayment) || 0;
    const downPaymentNum = parseFloat(downPayment) || 0;
    const spouseIncomeNum = parseFloat(spouseIncome) || 0;
    const spouseLoanRepaymentNum = parseFloat(spouseLoanRepayment) || 0;

    const combinedIncome = annualIncomeNum + spouseIncomeNum;
    const combinedLoanRepayment = monthlyLoanRepaymentNum + spouseLoanRepaymentNum;

    if (annualIncomeNum > 0 && monthlyLoanRepaymentNum >= 0 && downPaymentNum >= 0) {
      const incomePerMonth = combinedIncome / 12;
      const adjustedLoanRepayment = combinedLoanRepayment / 10000;
      const budget = (incomePerMonth * 0.35 - adjustedLoanRepayment) / repaymentRate + downPaymentNum;
      const roundedBudget = Math.max(0, Math.round(budget));

      setTotalBudget(roundedBudget);
      setIsCalculated(true);
      setIsInputValid(true);

      // 諸経費と建物予算を計算
      const miscCosts = calculateMiscCosts(roundedBudget);
      const landBudget = data?.landBudget || 0;
      const buildingBudget = Math.floor(roundedBudget - miscCosts - landBudget);

      // データを保存（関連する予算も更新）
      await updateTotalBudget({
        totalBudget: roundedBudget,
        annualIncome: annualIncomeNum,
        monthlyLoanRepayment: monthlyLoanRepaymentNum,
        downPayment: downPaymentNum,
        spouseIncome: spouseIncomeNum,
        spouseLoanRepayment: spouseLoanRepaymentNum,
        // 関連データも更新
        miscCosts,
        buildingBudget,
      });

      if (isEditMode) {
        showToast("success", "総予算情報を更新しました");
      } else {
        showToast("success", "総予算を計算しました");
      }
    } else {
      setIsInputValid(false);
      showToast("error", "すべての入力欄に正しい値を入力してください");
    }
  }, [
    annualIncome,
    monthlyLoanRepayment,
    downPayment,
    spouseIncome,
    spouseLoanRepayment,
    repaymentRate,
    updateTotalBudget,
    showToast,
    isEditMode,
    data,
  ]);

  // 次のステップへ
  const handleNext = () => {
    if (!isCalculated || !totalBudget) {
      showToast("warning", "まず総予算を計算してください");
      return;
    }
    
    if (isFromMyPage) {
      // マイページからの編集の場合はマイページに戻る
      router.push("/my-page");
    } else if (isEditMode) {
      // サマリーからの編集の場合はサマリーページに戻る
      router.push("/start-home-building/summary");
    } else {
      // 通常モードの場合は次のページへ
      router.push("/start-home-building/house-size");
    }
  };

  // 戻るボタンの処理
  const handleBack = () => {
    if (isFromMyPage) {
      router.push("/my-page");
    } else if (isEditMode) {
      router.push("/start-home-building/summary");
    } else {
      router.push("/start-home-building");
    }
  };

  // 結果を保存（ログインページへ）
  const handleSaveResults = () => {
    router.push("/login?from=simulator");
  };

  // 数値のフォーマット
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>読み込み中...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          {isEditMode ? "総予算を編集" : "家づくりの総予算を求める"}
        </h1>
        <p className={styles.subtitle}>
          {isEditMode 
            ? "総予算情報を修正してください" 
            : "あなたの家づくりにかかる総予算を確認しましょう。"
          }
        </p>
      </header>

      {/* 進捗バー */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progress} 
          style={{ width: isEditMode ? "100%" : "20%" }}
        ></div>
      </div>

      {/* フォーム */}
      <main className={styles.main}>
        <div className={styles.formContainer}>
          {/* 年収入力 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              昨年の年収を入力してください
              <button
                type="button"
                className={styles.infoButton}
                onClick={() => setIsAnnualIncomeModalOpen(true)}
              >
                説明を見る
              </button>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={annualIncome}
                onChange={(e) => handleInputChange(setAnnualIncome, e.target.value)}
                className={styles.input}
                placeholder="400"
              />
              <span className={styles.unit}>万円</span>
            </div>
          </div>

          {/* 既存ローン返済額 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              現在あるローンの毎月返済額を入力してください
              <button
                type="button"
                className={styles.infoButton}
                onClick={() => setIsLoanRepaymentModalOpen(true)}
              >
                説明を見る
              </button>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={monthlyLoanRepayment}
                onChange={(e) => handleInputChange(setMonthlyLoanRepayment, e.target.value)}
                className={styles.input}
                placeholder="10,000"
              />
              <span className={styles.unit}>円</span>
            </div>
          </div>

          {/* 頭金 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              住宅に組み込む頭金の額を入力してください
              <button
                type="button"
                className={styles.infoButton}
                onClick={() => setIsDownPaymentModalOpen(true)}
              >
                説明を見る
              </button>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={downPayment}
                onChange={(e) => handleInputChange(setDownPayment, e.target.value)}
                className={styles.input}
                placeholder="100"
              />
              <span className={styles.unit}>万円</span>
            </div>
          </div>

          {/* 配偶者の収入追加ボタン */}
          {!showSpouseFields && (
            <div className={styles.spouseToggle}>
              <button
                type="button"
                onClick={() => setShowSpouseFields(true)}
                className={styles.toggleButton}
              >
                配偶者の年収を入力して総予算を増やす
              </button>
            </div>
          )}

          {/* 配偶者フィールド */}
          {showSpouseFields && (
            <>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  配偶者の年収を入力してください
                  <button
                    type="button"
                    className={styles.infoButton}
                    onClick={() => setIsSpouseIncomeModalOpen(true)}
                  >
                    説明を見る
                  </button>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={spouseIncome}
                    onChange={(e) => handleInputChange(setSpouseIncome, e.target.value)}
                    className={styles.input}
                    placeholder="300"
                  />
                  <span className={styles.unit}>万円</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  配偶者の現在あるローンの毎月返済額を入力してください
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={spouseLoanRepayment}
                    onChange={(e) => handleInputChange(setSpouseLoanRepayment, e.target.value)}
                    className={styles.input}
                    placeholder="5,000"
                  />
                  <span className={styles.unit}>円</span>
                </div>
              </div>
            </>
          )}

          {/* 計算ボタン */}
          <button
            type="button"
            onClick={calculateTotalBudget}
            className={styles.calculateButton}
          >
            {isEditMode ? "再計算する" : "計算する"}
          </button>

          {/* エラーメッセージ */}
          {!isInputValid && (
            <p className={styles.errorMessage}>
              すべての入力欄に正しい値を入力してください。
            </p>
          )}

          {/* 計算結果 */}
          {isCalculated && totalBudget !== null && (
            <div className={styles.resultContainer}>
              <h2 className={styles.resultTitle}>家づくり総予算</h2>
              <div className={styles.resultAmount}>
                <span className={styles.resultNumber}>
                  {formatNumber(totalBudget)}
                </span>
                <span className={styles.resultUnit}>万円</span>
              </div>
              
              {/* 諸経費と建物予算の表示（編集モード時） */}
              {isEditMode && (
                <div className={styles.budgetBreakdown}>
                  <p className={styles.breakdownItem}>
                    諸経費（約{Math.round((calculateMiscCosts(totalBudget) / totalBudget) * 100)}%）: 
                    <span className={styles.breakdownValue}>
                      {formatNumber(calculateMiscCosts(totalBudget))}万円
                    </span>
                  </p>
                  <p className={styles.breakdownItem}>
                    建物予算: 
                    <span className={styles.breakdownValue}>
                      {formatNumber(Math.floor(totalBudget - calculateMiscCosts(totalBudget) - (data?.landBudget || 0)))}万円
                    </span>
                  </p>
                </div>
              )}
              
              {/* 保存ボタン（未認証時のみ表示） */}
              {!isAuthenticated && !isEditMode && (
                <div className={styles.saveButtonContainer}>
                  <button
                    type="button"
                    onClick={handleSaveResults}
                    className={styles.saveButton}
                  >
                    結果を保存する
                  </button>
                  <p className={styles.saveNote}>
                    ※ ログインすると結果を保存できます
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ナビゲーション */}
          <div className={styles.navigation}>
            <button
              type="button"
              onClick={handleBack}
              className={styles.backButton}
            >
              {isEditMode ? "キャンセル" : "戻る"}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={styles.nextButton}
              disabled={!isCalculated}
            >
              {isFromMyPage ? "保存してマイページに戻る" : 
               isEditMode ? "保存してサマリーに戻る" : "次へ進む"}
            </button>
          </div>
        </div>
      </main>

      {/* 説明モーダル - 昨年の年収 */}
      <Modal
        isOpen={isAnnualIncomeModalOpen}
        onRequestClose={() => setIsAnnualIncomeModalOpen(false)}
        contentLabel="昨年の年収の説明"
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <div className={styles.modalContent}>
          <button 
            className={styles.closeButton} 
            onClick={() => setIsAnnualIncomeModalOpen(false)}
          >
            ×
          </button>
          <h2>昨年の年収について</h2>
          <p>住宅ローンを借りる方の源泉徴収票に記載の税引前の金額を入力してください。</p>
        </div>
      </Modal>

      {/* 説明モーダル - ローン返済額 */}
      <Modal
        isOpen={isLoanRepaymentModalOpen}
        onRequestClose={() => setIsLoanRepaymentModalOpen(false)}
        contentLabel="ローン返済額の説明"
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <div className={styles.modalContent}>
          <button 
            className={styles.closeButton} 
            onClick={() => setIsLoanRepaymentModalOpen(false)}
          >
            ×
          </button>
          <h2>ローン返済額について</h2>
          <p className={styles.modalText}>
            下記の借入額に影響があるローンの種類に該当するものがある場合、毎月の支払い額を合算してください。<br /><br />
            <strong>借入額に影響があるローンの種類</strong><br />
            ・マイカーローン<br />
            ・教育ローン<br />
            ・クレジットカードのリボ払い/分割払い<br />
            ・消費者金融の借入<br />
            ・携帯電話等の割賦払い<br />
            ・旅行費用、結婚式費用の個人ローン 他<br />
            <br />
            <strong>借入額に影響がないローンの種類</strong><br />
            ・公共料金や通信料金（未払いは影響あり）<br />
            ・家賃の支払い<br />
            ・一部のリース契約（所有権がない場合）
          </p>
        </div>
      </Modal>

      {/* 説明モーダル - 頭金 */}
      <Modal
        isOpen={isDownPaymentModalOpen}
        onRequestClose={() => setIsDownPaymentModalOpen(false)}
        contentLabel="頭金の説明"
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <div className={styles.modalContent}>
          <button 
            className={styles.closeButton} 
            onClick={() => setIsDownPaymentModalOpen(false)}
          >
            ×
          </button>
          <h2>頭金について</h2>
          <p>
            住宅購入時に用意できる頭金の額を入力してください。<br />
            ご両親からの資金援助も頭金に含みます。
          </p>
        </div>
      </Modal>

      {/* 説明モーダル - 配偶者年収 */}
      <Modal
        isOpen={isSpouseIncomeModalOpen}
        onRequestClose={() => setIsSpouseIncomeModalOpen(false)}
        contentLabel="配偶者の年収を合算する際の注意点"
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <div className={styles.modalContent}>
          <button 
            className={styles.closeButton} 
            onClick={() => setIsSpouseIncomeModalOpen(false)}
          >
            ×
          </button>
          <h2>配偶者の年収を合算する際の注意点</h2>
          <p>
            配偶者の年収を合算する場合、以下の点に注意してください：
          </p>
          <ul>
            <li>配偶者が安定した収入を持っていること。</li>
            <li>パートやアルバイトの場合、合算金額が制限される可能性があります。</li>
            <li>借入先によって収入合算の条件が異なりますので、借入額は参考として下さい。</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default TotalBudgetClient;