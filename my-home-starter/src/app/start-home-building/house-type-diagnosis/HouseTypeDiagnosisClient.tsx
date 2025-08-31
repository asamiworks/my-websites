"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSimulator } from "../../../contexts/SimulatorContext";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../contexts/ToastContext";
import styles from "./HouseTypeDiagnosisPage.module.css";

interface Question {
  id: string;
  text: string;
  options: {
    value: number;
    label: string;
  }[];
}

const questions: Question[] = [
  {
    id: "q1",
    text: "家づくりで最も重視するポイントは？",
    options: [
      { value: 1, label: "高性能・高断熱" },
      { value: 2, label: "コストパフォーマンス" },
      { value: 3, label: "デザイン性" },
      { value: 4, label: "機能性・使いやすさ" }
    ]
  },
  {
    id: "q2",
    text: "理想の暮らし方は？",
    options: [
      { value: 1, label: "省エネで快適な暮らし" },
      { value: 2, label: "無理のない予算で豊かな暮らし" },
      { value: 3, label: "おしゃれで個性的な暮らし" },
      { value: 4, label: "家族みんなが使いやすい暮らし" }
    ]
  }
];

const HouseTypeDiagnosisClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, updateHouseTypeDiagnosis, isLoading, setEditMode } = useSimulator();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  // 編集モードかどうかを判定
  const fromParam = searchParams?.get('from');
  const isEditMode = fromParam === 'summary' || fromParam === 'mypage';
  const isFromMyPage = fromParam === 'mypage';
  
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<string>("");
  const [hasViewedResult, setHasViewedResult] = useState(false);
  const [answersAfterDiagnosis, setAnswersAfterDiagnosis] = useState<Record<string, number>>({});

  // 編集モードの設定
  useEffect(() => {
    if (setEditMode) {
      setEditMode(isFromMyPage);
    }
  }, [isFromMyPage, setEditMode]);

  // 初期データの読み込み
  useEffect(() => {
    if (data?.houseTypeDiagnosis && !isLoading) {
      const diagnosis = data.houseTypeDiagnosis;
      
      // 保存された回答を復元
      const restoredAnswers: Record<string, number> = {};
      questions.forEach(question => {
        if (diagnosis[question.id] !== undefined) {
          restoredAnswers[question.id] = diagnosis[question.id] as number;
        }
      });
      
      if (Object.keys(restoredAnswers).length > 0) {
        setAnswers(restoredAnswers);
        
        // 全ての質問に回答済みかチェック
        const allAnswered = questions.every(q => restoredAnswers[q.id] !== undefined);
        if (allAnswered) {
          setIsComplete(true);
          calculateDiagnosis(restoredAnswers);
          // 保存済みデータの場合は診断済みとして扱う
          setHasViewedResult(true);
          setAnswersAfterDiagnosis(restoredAnswers);
          
          // 編集モードの場合は結果も表示
          if (isEditMode) {
            setShowResult(true);
          }
        }
      }
    }
  }, [data, isLoading, isEditMode]);

  // 診断結果の計算
  const calculateDiagnosis = (currentAnswers: Record<string, number>) => {
    const q1 = currentAnswers.q1 || 0;
    const q2 = currentAnswers.q2 || 0;
    
    // 診断ロジック（質問の回答に基づいて結果を決定）
    if (q1 === 1 && q2 === 1) {
      setDiagnosisResult("高性能住宅タイプ");
    } else if (q1 === 2 && q2 === 2) {
      setDiagnosisResult("コスパ重視タイプ");
    } else if (q1 === 3 && q2 === 3) {
      setDiagnosisResult("デザイン重視タイプ");
    } else if (q1 === 4 && q2 === 4) {
      setDiagnosisResult("機能性重視タイプ");
    } else {
      // その他の組み合わせ
      const average = (q1 + q2) / 2;
      if (average <= 1.5) {
        setDiagnosisResult("品質重視タイプ");
      } else if (average <= 2.5) {
        setDiagnosisResult("バランス重視タイプ");
      } else if (average <= 3.5) {
        setDiagnosisResult("個性重視タイプ");
      } else {
        setDiagnosisResult("実用性重視タイプ");
      }
    }
  };

  // 回答の変更
  const handleAnswerChange = (questionId: string, value: number) => {
    const newAnswers = {
      ...answers,
      [questionId]: value
    };
    setAnswers(newAnswers);

    // 全ての質問に回答したかチェック
    const allAnswered = questions.every(q => newAnswers[q.id] !== undefined);
    if (allAnswered) {
      setIsComplete(true);
      calculateDiagnosis(newAnswers);
    } else {
      setIsComplete(false);
      setShowResult(false);
    }

    // 診断結果を見た後に回答が変更された場合
    if (hasViewedResult) {
      const hasChanged = JSON.stringify(newAnswers) !== JSON.stringify(answersAfterDiagnosis);
      if (hasChanged) {
        setHasViewedResult(false);
        setShowResult(false);
      }
    }
  };

  // 診断結果の表示
  const handleShowResult = async () => {
    if (!isComplete) {
      showToast("warning", "すべての質問に回答してください");
      return;
    }

    // 診断結果を保存
    await updateHouseTypeDiagnosis(answers);
    setShowResult(true);
    setHasViewedResult(true);
    setAnswersAfterDiagnosis(answers);
    
    if (isEditMode) {
      showToast("success", "家づくりタイプ診断を更新しました");
    } else {
      showToast("success", "診断が完了しました");
    }
  };

  // 次へ進む
  const handleNext = async () => {
    if (!isComplete) {
      showToast("warning", "すべての質問に回答してください");
      return;
    }

    if (!hasViewedResult) {
      showToast("warning", "診断結果を確認してください");
      return;
    }

    // 診断結果を保存（まだ保存していない場合）
    if (!showResult) {
      await updateHouseTypeDiagnosis(answers);
    }

    if (isFromMyPage) {
      // マイページからの編集の場合はマイページに戻る
      router.push("/my-page");
    } else {
      // 編集モードでも通常モードでもサマリーページへ
      router.push("/start-home-building/summary");
    }
  };

  // 戻るボタンの処理
  const handleBack = () => {
    if (isFromMyPage) {
      router.push("/my-page");
    } else if (isEditMode) {
      router.push("/start-home-building/summary");
    } else {
      router.push("/start-home-building/building-location");
    }
  };

  // 結果を保存（ログインページへ）
  const handleSaveResults = () => {
    router.push("/login?from=simulator");
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
          {isEditMode ? "家づくりタイプ診断を編集" : "家づくりタイプ診断"}
        </h1>
        <p className={styles.subtitle}>
          {isEditMode 
            ? "家づくりタイプを再診断できます" 
            : "あなたに最適な家づくりのタイプを診断します"
          }
        </p>
      </header>

      {/* 進捗バー */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progress} 
          style={{ width: isEditMode ? "100%" : "80%" }}
        ></div>
      </div>

      {/* 質問フォーム */}
      <main className={styles.main}>
        <div className={styles.formContainer}>
          {questions.map((question, index) => (
            <div key={question.id} className={styles.questionSection}>
              <h2 className={styles.questionTitle}>
                Q{index + 1}. {question.text}
              </h2>
              <div className={styles.optionsGrid}>
                {question.options.map((option) => (
                  <label
                    key={option.value}
                    className={`${styles.optionLabel} ${
                      answers[question.id] === option.value ? styles.selected : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={() => handleAnswerChange(question.id, option.value)}
                      className={styles.optionInput}
                    />
                    <span className={styles.optionText}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* 診断ボタン */}
          {isComplete && (!showResult || !hasViewedResult) && (
            <button
              type="button"
              onClick={handleShowResult}
              className={styles.diagnosisButton}
            >
              {isEditMode && hasViewedResult ? "再診断する" : 
               hasViewedResult ? "再診断する" : 
               "診断結果を見る"}
            </button>
          )}

          {/* 診断結果 */}
          {showResult && (
            <div className={styles.resultContainer}>
              <h2 className={styles.resultTitle}>診断結果</h2>
              <div className={styles.resultContent}>
                <p className={styles.resultType}>
                  あなたは「{diagnosisResult}」です
                </p>
                <p className={styles.resultDescription}>
                  {getResultDescription(diagnosisResult)}
                </p>
              </div>
              
              {/* 保存ボタン（未認証時かつ非編集モード時のみ表示） */}
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
              disabled={!isComplete || !hasViewedResult}
            >
              {isFromMyPage ? "保存してマイページに戻る" : 
               isEditMode ? "保存してサマリーに戻る" : "診断結果を見る"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// 診断結果の説明文を取得
const getResultDescription = (resultType: string): string => {
  const descriptions: Record<string, string> = {
    "高性能住宅タイプ": "最新の技術で快適性と省エネを両立する住まいがおすすめです。",
    "コスパ重視タイプ": "予算内で最大限の価値を実現する賢い選択ができます。",
    "デザイン重視タイプ": "個性的で美しい住まいで、毎日の暮らしを豊かにします。",
    "機能性重視タイプ": "使いやすさを追求した、ストレスフリーな住まいが理想的です。",
    "品質重視タイプ": "長く安心して暮らせる、確かな品質の住まいを選びましょう。",
    "バランス重視タイプ": "各要素をバランスよく取り入れた、万人に愛される住まいです。",
    "個性重視タイプ": "あなたらしさを表現できる、オリジナリティあふれる住まいを。",
    "実用性重視タイプ": "日々の暮らしやすさを第一に考えた、実用的な住まいがぴったりです。",
  };
  
  return descriptions[resultType] || "あなたに最適な住まいを見つけましょう。";
};

export default HouseTypeDiagnosisClient;