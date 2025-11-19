"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../styles/Estimate.module.css";

interface SiteTypeOption {
  value: string;
  label: string;
  price: number;
  description: string;
}

interface OptionDetail {
  value: string;
  label: string;
  price: number;
}

interface PresetConfiguration {
  siteType: string;
  options: string[];
  message: string;
  pageCount?: number;
  selectedLanguages?: string[];
}

// メインのコンポーネントをSuspenseの内側で使用するために分離
function EstimateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultRef = useRef<HTMLElement>(null);

  // 状態
  const [siteType, setSiteType] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrices, setShowPrices] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [presetMessage, setPresetMessage] = useState<string | null>(null);

  const optionDetails: OptionDetail[] = [
    { value: "responsive", label: "レスポンシブデザイン最適化", price: 77000 },
    { value: "internal_seo", label: "内部SEO最適化", price: 0 },
    { value: "form", label: "お問合せフォーム設置", price: 33000 },
    { value: "writing", label: "ライティング代行（ブログ記事,商品説明等）", price: 22000 },
    { value: "seo", label: "SEO対策強化", price: 88000 },
    { value: "analytics", label: "Google Analytics・サーチコンソール設定", price: 22000 },
    { value: "security", label: "セキュリティ強化対策", price: 33000 },
    { value: "ad_support", label: "広告出稿サポート", price: 33000 },
    { value: "multilingual", label: "多言語対応", price: 110000 },
    { value: "instagram", label: "Instagram連携・埋め込み", price: 165000 },
    { value: "wordpress", label: "WordPress導入", price: 110000 },
    { value: "payment", label: "決済システム連携（Stripe等）", price: 660000 },
    { value: "mypage", label: "マイページ機能 & 管理者ページ", price: 330000 },
    { value: "chat", label: "チャット機能", price: 495000 },
    { value: "mailmagazine", label: "メールマガジン配信システム", price: 55000 },
    { value: "reservation", label: "予約システム連携（STORES予約等）", price: 220000 },
    { value: "video", label: "動画制作", price: 0 },
    { value: "logo_flyer", label: "ロゴ・チラシ制作との連携", price: 0 },
  ];

  // チャット機能の価格を動的に計算
  const getChatPrice = (currentOptions: string[]) => {
    const basePrice = 495000;
    const additionalPrice = 220000;
    return currentOptions.includes("mypage") ? basePrice : basePrice + additionalPrice;
  };

  // 言語オプション
  const languageOptions = [
    { value: "english", label: "英語" },
    { value: "chinese", label: "中国語（簡体字）" },
    { value: "traditional_chinese", label: "中国語（繁体字）" },
    { value: "korean", label: "韓国語" },
    { value: "spanish", label: "スペイン語" },
    { value: "french", label: "フランス語" },
    { value: "german", label: "ドイツ語" },
    { value: "other", label: "その他" }
  ];

  // 多言語対応の価格を計算
  const getMultilingualPrice = (langCount: number, pages: number) => {
    if (langCount === 0) return 0;
    const basePrice = 110000;
    const pricePerPage = 22000;
    return basePrice + (pricePerPage * pages * langCount);
  };

  const siteTypeOptions: SiteTypeOption[] = [
    { 
      value: "lp", 
      label: "ランディングページ", 
      price: 220000, 
      description: "コンバージョン特化の高品質1ページサイト・レスポンシブ・内部SEO標準装備"
    },
    { 
      value: "corporate", 
      label: "コーポレートサイト", 
      price: 385000, 
      description: "企業信頼性向上・集客力強化・4ページ構成・プロフェッショナルデザイン"
    },
    { 
      value: "grant", 
      label: "小規模事業者持続化補助金対応型", 
      price: 770000, 
      description: "補助金申請対応・高機能システム・プレミアム保守プラン必須・申請サポート付"
    },
  ];

  const getLockedOptions = useCallback((type: string): string[] => {
    const baseOptions = ["responsive", "internal_seo"];
    if (type === "grant") {
      return [...baseOptions, "form", "wordpress", "seo"];
    }
    if (type === "corporate") return [...baseOptions, "form"];
    return baseOptions;
  }, []);

  // プリセット構成
  const presetConfigurations: Record<string, PresetConfiguration> = {
    // 既存のLPプリセット
    btob: {
      siteType: "lp",
      options: ["form"],
      message: "BtoB資料請求LPの構成が選択されました"
    },
    ad: {
      siteType: "lp",
      options: ["analytics", "ad_support"],
      message: "広告運用特化型LPの構成が選択されました"
    },
    ec: {
      siteType: "lp",
      options: ["form", "security", "writing", "instagram"],
      message: "高機能商品販売LPの構成が選択されました"
    },
    // コーポレートサイトのプリセット
    trust: {
      siteType: "corporate",
      options: ["seo", "security"],
      message: "信頼性重視型サイトの構成が選択されました"
    },
    info: {
      siteType: "corporate",
      options: ["wordpress", "writing"],
      pageCount: 5,
      message: "情報発信強化型サイトの構成が選択されました"
    },
    global: {
      siteType: "corporate",
      options: ["seo"],
      pageCount: 7,
      selectedLanguages: ["english"],
      message: "グローバル展開型サイトの構成が選択されました"
    },
    // 補助金対応サイトのプリセット
    grant_info: {
      siteType: "grant",
      options: ["instagram"],
      pageCount: 6,
      message: "補助金対応：情報発信サイトの構成が選択されました"
    },
    grant_product: {
      siteType: "grant",
      options: ["security", "ad_support", "reservation"],
      pageCount: 10,
      message: "補助金対応：商品紹介サイトの構成が選択されました"
    },
    grant_advanced: {
      siteType: "grant",
      options: ["mypage", "payment", "security", "mailmagazine"],
      pageCount: 5,
      message: "補助金対応：高機能サイトの構成が選択されました"
    }
  };

  // プリセット適用と自動スクロール
  const applyPresetAndScroll = useCallback((preset: string) => {
    const config = presetConfigurations[preset as keyof typeof presetConfigurations];
    if (config) {
      setSiteType(config.siteType);
      const locked = getLockedOptions(config.siteType);
      setOptions([...locked, ...config.options]);
      
      // ページ数の設定
      if (config.pageCount) {
        setPageCount(config.pageCount);
      } else {
        setPageCount(config.siteType === "grant" ? 5 : config.siteType === "corporate" ? 4 : 1);
      }
      
      // 多言語設定
      if (config.selectedLanguages) {
        setSelectedLanguages(config.selectedLanguages);
        // 多言語対応オプションも追加
        if (!config.options.includes("multilingual")) {
          setOptions([...locked, ...config.options, "multilingual"]);
        }
      }
      
      setShowPrices(true); // プリセットから来た場合は価格を表示
      setPresetMessage(config.message);

      // 少し遅延してからスクロール（DOMが更新されるのを待つ）
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
          });
        }
      }, 100);
    }
  }, [getLockedOptions]);

  // 初期表示時の処理
  useEffect(() => {
    const preset = searchParams.get('preset');

    if (preset && presetConfigurations[preset as keyof typeof presetConfigurations]) {
      // プリセットがある場合
      applyPresetAndScroll(preset);
      setIsLoading(false);
    } else {
      // 通常の初期化処理
      const stored = localStorage.getItem("estimateData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // siteTypeが有効な値の場合のみ復元
          if (parsed.siteType && ['lp', 'corporate', 'grant'].includes(parsed.siteType)) {
            setSiteType(parsed.siteType);
            setOptions(parsed.options || []);
            setPageCount(parsed.pageCount || 4);
            setSelectedLanguages(parsed.selectedLanguages || []);
            setShowPrices(parsed.showPrices !== undefined ? parsed.showPrices : false);
          }
          // 古いパッケージプランデータの場合はクリア
        } catch {
          // エラー時は初期状態
        }
      }
      setIsLoading(false);
    }
  }, [searchParams, applyPresetAndScroll]);

  // siteType変更時に強制的に初期化（プリセット適用時は除く）
  useEffect(() => {
    if (!siteType) return;
    const preset = searchParams.get('preset');
    if (preset) return; // プリセット適用時はスキップ

    const locked = getLockedOptions(siteType);
    setOptions([...locked]);
    setPageCount(siteType === "grant" ? 5 : siteType === "corporate" ? 4 : 1);
    setSelectedLanguages([]);
  }, [siteType, getLockedOptions, searchParams]);

  // メッセージを一定時間後に消す
  useEffect(() => {
    if (presetMessage) {
      const timer = setTimeout(() => {
        setPresetMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [presetMessage]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>見積もりフォームを読み込み中...</p>
        </div>
      </div>
    );
  }

  // 価格計算
  const basePrice =
    siteType === "lp" ? 220000 : siteType === "corporate" ? 385000 : siteType === "grant" ? 770000 : 0;

  const optionPrice = options.reduce((sum, opt) => {
    const item = optionDetails.find(o => o.value === opt);
    const isLocked = siteType ? getLockedOptions(siteType).includes(opt) : false;
    if (isLocked) return sum;
    
    if (opt === "seo" && options.includes("wordpress")) {
      return sum;
    }
    
    if (opt === "analytics" && options.includes("wordpress")) {
      return sum;
    }
    
    if (opt === "chat") {
      return sum + getChatPrice(options);
    }
    
    if (opt === "multilingual") {
      const pages = pageCount || (siteType === "lp" ? 1 : siteType === "corporate" ? 4 : 5);
      return sum + getMultilingualPrice(selectedLanguages.length, pages);
    }
    
    return sum + (item?.price || 0);
  }, 0);

  const pagePrice =
    siteType === "corporate" && pageCount && pageCount > 4
      ? (pageCount - 4) * 11000
      : siteType === "grant" && pageCount && pageCount > 5
      ? (pageCount - 5) * 11000
      : 0;

  const totalPrice = basePrice + optionPrice + pagePrice;

  // 月額サポートプラン必須かどうかを判定
  const requiresSupportPlan = () => {
    return siteType === "grant" ||
           options.includes("wordpress") ||
           options.includes("payment") ||
           options.includes("mypage") ||
           options.includes("chat") ||
           options.includes("mailmagazine") ||
           options.includes("reservation") ||
           options.includes("instagram");
  };

  // 必要なサポートプランのレベルを判定
  const getRequiredSupportPlanLevel = () => {
    if (siteType === "grant" ||
        options.includes("payment") ||
        options.includes("mypage") ||
        options.includes("chat") ||
        options.includes("mailmagazine") ||
        options.includes("instagram")) {
      return "premium";
    }
    if (options.includes("wordpress") || options.includes("reservation")) {
      return "business";
    }
    return null;
  };

  const handleSiteTypeChange = (newType: string) => {
    setSiteType(newType);
    setPresetMessage(null); // サイトタイプを手動で変更したらメッセージを消す
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const locked = siteType ? getLockedOptions(siteType) : [];
    if (locked.includes(value)) return;

    setOptions(prev => {
      let newOptions;
      if (checked) {
        newOptions = [...prev, value];
        if (value === "payment" && !prev.includes("security")) {
          newOptions.push("security");
        }
      } else {
        newOptions = prev.filter(v => v !== value);
        if (value === "wordpress") {
          newOptions = newOptions.filter(v => v !== "payment" && v !== "mailmagazine");
        }
        if (value === "multilingual") {
          setSelectedLanguages([]);
        }
      }
      return newOptions;
    });
  };

  const handlePageCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = Number(e.target.value);
    setPageCount(newCount);
  };

  const handleProceed = () => {
    const estimateData = {
      siteType,
      options,
      pageCount,
      totalPrice,
      showPrices,
      selectedLanguages
    };

    localStorage.setItem("estimateData", JSON.stringify(estimateData));
    router.push("/contact");
  };

  // 選択されたサイトタイプの情報を取得
  const currentSiteType = siteTypeOptions.find(opt => opt.value === siteType);

  // 月額サポートプランの料金を計算
  const calculateMonthlyFee = (plan: string, year: number = 1) => {
    const total = totalPrice;

    if (year === 1) {
      switch (plan) {
        case "standard":
          const standardFee = Math.max(total * 0.02, 8800);
          return Math.min(standardFee, 27500);
        case "business":
          const businessFee = Math.max(total * 0.025, 16500);
          return Math.min(businessFee, 38500);
        case "premium":
          const premiumFee = Math.max(total * 0.03, 27500);
          return Math.min(premiumFee, 48400);
        default:
          return 0;
      }
    } else {
      switch (plan) {
        case "standard":
          const standardFee = Math.max(total * 0.01, 6600);
          return Math.min(standardFee, 16500);
        case "business":
          const businessFee = Math.max(total * 0.015, 8800);
          return Math.min(businessFee, 22000);
        case "premium":
          const premiumFee = Math.max(total * 0.02, 13200);
          return Math.min(premiumFee, 33000);
        default:
          return 0;
      }
    }
  };

  // 月額サポートプランの詳細情報
  const supportPlanDetails: Record<string, {
    name: string;
    firstYear: { content: string };
    secondYear: { content: string };
  }> = {
    standard: {
      name: "スタンダードプラン",
      firstYear: {
        content: "月2回までの軽微修正、ドメイン・サーバー管理"
      },
      secondYear: {
        content: "月1回の修正、稼働チェック、ドメイン・サーバー管理"
      }
    },
    business: {
      name: "ビジネスプラン",
      firstYear: {
        content: "月4回まで修正、SEO簡易診断、更新サポート、ドメイン・サーバー管理"
      },
      secondYear: {
        content: "月2回までの修正、SEOチェック、ドメイン・サーバー管理"
      }
    },
    premium: {
      name: "プレミアムプラン",
      firstYear: {
        content: "修正無制限、解析レポート、改善提案、ドメイン・サーバー管理含む"
      },
      secondYear: {
        content: "月4回までの修正、SEOチェック・改善サポート、ドメイン・サーバー管理"
      }
    }
  };

  // メインの見積もりフォーム
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>見積もりフォーム</h1>
        <p>ご要望に合わせたプランをお選びください</p>
        <p className={styles.taxNote}>※表示している価格は全て税込です</p>
      </header>

      {/* プリセットメッセージの表示 */}
      {presetMessage && (
        <div className={styles.presetNotification}>
          <span className={styles.presetIcon}>✓</span>
          <span>{presetMessage}</span>
        </div>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.stepNumber}>1</span>
          サイトの種類を選択
        </h2>
        <div className={styles.siteTypeOptions}>
          {siteTypeOptions.map(option => (
            <label
              key={option.value}
              className={`${styles.siteTypeOption} ${
                siteType === option.value ? styles.selected : ""
              }`}
            >
              <input
                type="radio"
                name="siteType"
                value={option.value}
                checked={siteType === option.value}
                onChange={(e) => handleSiteTypeChange(e.target.value)}
                className={styles.hiddenRadio}
              />
              <div className={styles.optionContent}>
                <h3>
                  {option.label}
                  {option.value === "grant" && (
                    <span className={styles.recommendedBadge}>おすすめ</span>
                  )}
                </h3>
                <p className={styles.optionDescription}>{option.description}</p>
                <div className={styles.optionPrice}>
                  {option.price.toLocaleString()}円〜
                </div>
              </div>
              <div className={styles.radioIndicator}></div>
            </label>
          ))}
        </div>
        {currentSiteType && (
          <div className={styles.siteTypeDetails}>
            <h4>選択されたプランの詳細</h4>
            <div className={styles.valueProposition}>
              {currentSiteType.value === "lp" && (
                <ul>
                  <li><strong>コンバージョン最適化設計：</strong>訪問者を顧客に変える戦略的な構成</li>
                  <li><strong>レスポンシブデザイン標準装備：</strong>全デバイスで美しく表示</li>
                  <li><strong>内部SEO最適化：</strong>検索エンジンからの流入を最大化</li>
                  <li><strong>高速ページ表示：</strong>離脱率を最小限に抑制</li>
                </ul>
              )}
              {currentSiteType.value === "corporate" && (
                <ul>
                  <li><strong>企業信頼性の向上：</strong>プロフェッショナルなデザインで企業価値を最大化</li>
                  <li><strong>お問合せ促進：</strong>訪問者が簡単に連絡できるフォームを標準装備</li>
                  <li><strong>内部SEO最適化：</strong>検索エンジンに適した基本的なSEO対策を実装</li>
                  <li><strong>4ページ構成：</strong>企業情報を効果的に整理・配置</li>
                </ul>
              )}
              {currentSiteType.value === "grant" && (
                <ul>
                  <li><strong>補助金申請対応：</strong>各種補助金の要件を満たした高機能システム</li>
                  <li><strong>WordPress標準装備：</strong>110,000円相当のWordPressを無料で提供</li>
                  <li><strong>SEO対策標準装備：</strong>88,000円相当のSEO基本対策を無料で実装</li>
                  <li><strong>申請書類サポート：</strong>補助金申請に必要な資料作成を支援</li>
                  <li><strong>プレミアム保守プラン必須：</strong>月額27,500円〜のプレミアムプランへの加入が必要</li>
                  <li><strong>拡張性確保：</strong>将来的な機能追加にも柔軟に対応</li>
                </ul>
              )}
            </div>
          </div>
        )}
      </section>

      {siteType && (
        <>
          <section className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNumber}>2</span>
                必要な機能・オプション
              </h2>
              <button
                type="button"
                onClick={() => setShowPrices(!showPrices)}
                style={{
                  padding: '6px 16px',
                  fontSize: '0.85rem',
                  border: showPrices ? '1px solid #005bac' : '2px solid #005bac',
                  borderRadius: '4px',
                  background: showPrices ? '#005bac' : 'white',
                  color: showPrices ? 'white' : '#005bac',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontWeight: showPrices ? 'normal' : 'bold',
                  boxShadow: showPrices ? 'none' : '0 2px 4px rgba(0,91,172,0.2)'
                }}
              >
                {showPrices ? '価格を非表示' : '価格を表示'}
              </button>
            </div>
            <div className={styles.optionsGroup}>
              {optionDetails.map(option => {
                const isLocked = getLockedOptions(siteType).includes(option.value);
                const isChecked = options.includes(option.value);
                const isDisabled = isLocked || 
                  (option.value === "seo" && (siteType === "lp" || options.includes("wordpress"))) ||
                  (option.value === "analytics" && options.includes("wordpress")) ||
                  (option.value === "payment" && !options.includes("wordpress")) ||
                  (option.value === "mailmagazine" && !options.includes("wordpress")) ||
                  (option.value === "security" && options.includes("payment"));
                
                return (
                  <label 
                    key={option.value} 
                    className={`${styles.optionItem} ${
                      isChecked ? styles.selected : ""
                    } ${isLocked ? styles.locked : ""} ${
                      isDisabled && !isLocked ? styles.disabled : ""
                    }`}
                    title={
                      isLocked 
                        ? "標準仕様に含まれています" 
                        : option.value === "seo" && siteType === "lp"
                          ? "ランディングページは1ページ構成のため標準仕様"
                          : option.value === "seo" && options.includes("wordpress")
                            ? "WordPress選択時は標準仕様"
                            : option.value === "analytics" && options.includes("wordpress")
                              ? "WordPress選択時は標準仕様"
                              : option.value === "payment" && !options.includes("wordpress")
                                ? "WordPress導入が必要です"
                                : option.value === "mailmagazine" && !options.includes("wordpress")
                                  ? "WordPress導入が必要です"
                                  : option.value === "security" && options.includes("payment")
                                    ? "決済システム選択時は必須です"
                                    : option.value === "chat"
                                      ? options.includes("wordpress")
                                        ? `カスタマーサポート専用チャット：${getChatPrice(options).toLocaleString()}円`
                                        : `追加費用：${getChatPrice(options).toLocaleString()}円`
                                      : option.value === "multilingual"
                                        ? selectedLanguages.length > 0
                                          ? `追加費用：${getMultilingualPrice(selectedLanguages.length, pageCount || (siteType === "lp" ? 1 : siteType === "corporate" ? 4 : 5)).toLocaleString()}円`
                                          : "言語を選択してください"
                                        : showPrices
                                          ? `追加費用：${option.price.toLocaleString()}円`
                                          : ""
                    }
                  >
                    <input
                      type="checkbox"
                      className={styles.hiddenCheckbox}
                      value={option.value}
                      onChange={handleOptionChange}
                      checked={isChecked}
                      disabled={isDisabled}
                    />
                    <div className={styles.checkboxIndicator}>
                      {isChecked && <span className={styles.checkmark}>✓</span>}
                    </div>
                    <div className={styles.optionDetails}>
                      <span className={styles.optionLabel}>
                        {option.label}
                        {option.value === "seo" && siteType === "lp" && (
                          <span style={{ color: "#999", fontSize: "0.8rem" }}>
                            {" "}※ランディングページは1ページ構成のため標準仕様
                          </span>
                        )}
                        {option.value === "seo" && options.includes("wordpress") && (
                          <span style={{ color: "#999", fontSize: "0.8rem" }}>
                            {" "}※WordPress選択時は標準仕様
                          </span>
                        )}
                        {option.value === "analytics" && options.includes("wordpress") && (
                          <span style={{ color: "#999", fontSize: "0.8rem" }}>
                            {" "}※WordPress選択時は標準仕様
                          </span>
                        )}
                        {option.value === "wordpress" && (
                          <span style={{ color: "#666", fontSize: "0.8rem" }}>
                            {" "}※ビジネスプラン以上必須
                          </span>
                        )}
                        {option.value === "payment" && (
                          <span style={{ color: "#666", fontSize: "0.8rem" }}>
                            {" "}※WordPress導入時のみ・セキュリティ対策必須・プレミアムプラン必須
                          </span>
                        )}
                        {option.value === "mailmagazine" && (
                          <span style={{ color: "#666", fontSize: "0.8rem" }}>
                            {" "}※WordPress導入時のみ・プレミアムプラン必須
                          </span>
                        )}
                        {option.value === "security" && options.includes("payment") && (
                          <span style={{ color: "#d83a00", fontSize: "0.8rem" }}>
                            {" "}※決済システム利用のため必須
                          </span>
                        )}
                        {option.value === "instagram" && (
                          <span style={{ color: "#666", fontSize: "0.8rem" }}>
                            {" "}※プレミアムプラン必須
                          </span>
                        )}
                        {option.value === "reservation" && (
                          <span style={{ color: "#666", fontSize: "0.8rem" }}>
                            {" "}※ビジネスプラン以上必須
                          </span>
                        )}
                        {option.value === "chat" && (
                          <span style={{ color: "#666", fontSize: "0.8rem" }}>
                            {options.includes("wordpress")
                              ? " ※カスタマーサポート専用・プレミアムプラン必須"
                              : options.includes("mypage") 
                                ? " ※マイページ実装のため割引価格・プレミアムプラン必須" 
                                : " ※マイページ実装で割引あり・プレミアムプラン必須"}
                          </span>
                        )}
                        {option.value === "multilingual" && selectedLanguages.length > 0 && (
                          <span style={{ color: "#666", fontSize: "0.8rem" }}>
                            {` （${selectedLanguages.length}言語選択中）`}
                          </span>
                        )}
                        {(option.value === "video" || option.value === "logo_flyer") && (
                          <span style={{ color: "#666", fontSize: "0.8rem" }}>
                            {" "}（別途お見積もり）
                          </span>
                        )}
                      </span>
                      {showPrices && (
                        <span className={styles.optionPriceText}>
                          {isLocked
                            ? "（標準仕様）"
                            : option.value === "seo" && (siteType === "lp" || options.includes("wordpress"))
                              ? "（標準仕様）"
                              : option.value === "analytics" && options.includes("wordpress")
                                ? "（標準仕様）"
                                : option.value === "payment" && !options.includes("wordpress")
                                  ? "（WordPress導入が必要）"
                                  : option.value === "mailmagazine" && !options.includes("wordpress")
                                    ? "（WordPress導入が必要）"
                                    : option.value === "security" && options.includes("payment")
                                      ? "（決済システムのため必須）"
                                      : (option.value === "video" || option.value === "logo_flyer")
                                        ? "（別途お見積もり）"
                                        : option.value === "chat"
                                          ? `（+${getChatPrice(options).toLocaleString()}円）`
                                          : option.value === "multilingual"
                                            ? selectedLanguages.length > 0 
                                              ? `（+${getMultilingualPrice(selectedLanguages.length, pageCount || (siteType === "lp" ? 1 : siteType === "corporate" ? 4 : 5)).toLocaleString()}円）`
                                              : "（言語を選択してください）"
                                            : option.value === "ad_support"
                                              ? `（${option.price.toLocaleString()}円〜）`
                                              : option.value === "mailmagazine"
                                                ? `（${option.price.toLocaleString()}円〜）`
                                                : option.value === "reservation"
                                                  ? `（${option.price.toLocaleString()}円〜）`
                                                  : `（+${option.price.toLocaleString()}円）`}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {options.includes("multilingual") && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle} style={{ fontSize: '1.1rem' }}>
                対応言語の選択
              </h3>
              <div style={{
                padding: '20px',
                background: '#f3faff',
                borderRadius: '6px',
                border: '1px solid #e1ecf7'
              }}>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#666' }}>
                  対応する言語を選択してください（複数選択可）
                  <br />
                  <span style={{ fontSize: '0.8rem' }}>
                    ※基本料金110,000円 + ページ翻訳料金（22,000円/ページ×言語数）
                  </span>
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                  {languageOptions.map(lang => (
                    <label
                      key={lang.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: selectedLanguages.includes(lang.value) ? '#e8f4ff' : 'white',
                        borderColor: selectedLanguages.includes(lang.value) ? '#005bac' : '#ddd',
                        transition: 'all 0.3s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(lang.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLanguages([...selectedLanguages, lang.value]);
                          } else {
                            setSelectedLanguages(selectedLanguages.filter(l => l !== lang.value));
                          }
                        }}
                        style={{ marginRight: '8px' }}
                      />
                      {lang.label}
                    </label>
                  ))}
                </div>
                {selectedLanguages.length > 0 && (
                  <div style={{ marginTop: '16px', padding: '12px', background: 'white', borderRadius: '4px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>
                      <strong>選択言語数：</strong>{selectedLanguages.length}言語<br />
                      <strong>ページ数：</strong>{pageCount || (siteType === "lp" ? 1 : siteType === "corporate" ? 4 : 5)}ページ<br />
                      <strong>多言語対応費用：</strong>
                      {getMultilingualPrice(selectedLanguages.length, pageCount || (siteType === "lp" ? 1 : siteType === "corporate" ? 4 : 5)).toLocaleString()}円
                    </p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#666' }}>
                      計算式：110,000円 + 22,000円 × {pageCount || (siteType === "lp" ? 1 : siteType === "corporate" ? 4 : 5)}ページ × {selectedLanguages.length}言語 = {getMultilingualPrice(selectedLanguages.length, pageCount || (siteType === "lp" ? 1 : siteType === "corporate" ? 4 : 5)).toLocaleString()}円
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {(siteType === "corporate" || siteType === "grant") && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNumber}>3</span>
                ページ数の設定
              </h2>
              <div className={styles.pageCountSection}>
                <div className={styles.pageCountInfo}>
                  <p>基本{siteType === "grant" ? "5" : "4"}ページ含む</p>
                  <p className={styles.pageCountNote}>
                    追加ページは1ページあたり11,000円
                  </p>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="pageCount">ページ数：</label>
                  <input
                    id="pageCount"
                    type="number"
                    className={styles.pageCountInput}
                    min={siteType === "grant" ? 5 : 4}
                    value={pageCount || 0}
                    onChange={handlePageCountChange}
                  />
                </div>
              </div>
            </section>
          )}

          <section className={styles.result} ref={resultRef}>
            <div className={styles.resultHeader}>
              <h2>概算見積もり</h2>
              <div className={styles.totalPrice}>
                {totalPrice.toLocaleString()}円（税込）
              </div>
            </div>
            
            <div className={styles.breakdown}>
              <div className={styles.breakdownItem}>
                <span>{currentSiteType?.label} 基本料金</span>
                <span>{basePrice.toLocaleString()}円</span>
              </div>
              {options.map(opt => {
                const detail = optionDetails.find(o => o.value === opt);
                const isLocked = getLockedOptions(siteType).includes(opt);
                
                return detail ? (
                  <div key={opt} className={styles.breakdownItem}>
                    <span>
                      {detail.label}
                      {opt === "multilingual" && selectedLanguages.length > 0 && 
                        ` (${selectedLanguages.length}言語選択)`
                      }
                      {opt === "chat" && options.includes("wordpress") && 
                        " (カスタマーサポート専用)"
                      }
                    </span>
                    <span>
                      {isLocked ? "標準仕様" : 
                       opt === "seo" && options.includes("wordpress") ? "標準仕様" :
                       opt === "analytics" && options.includes("wordpress") ? "標準仕様" :
                       (opt === "video" || opt === "logo_flyer") ? "別途お見積もり" :
                       opt === "chat" ? `+${getChatPrice(options).toLocaleString()}円` :
                       opt === "multilingual" ? `+${getMultilingualPrice(selectedLanguages.length, pageCount || (siteType === "lp" ? 1 : siteType === "corporate" ? 4 : 5)).toLocaleString()}円` :
                       opt === "ad_support" || opt === "mailmagazine" || opt === "reservation"
                         ? `+${detail.price.toLocaleString()}円〜`
                         : `+${detail.price.toLocaleString()}円`}
                    </span>
                  </div>
                ) : null;
              })}
              {pagePrice > 0 && (
                <div className={styles.breakdownItem}>
                  <span>追加ページ ({pageCount! - (siteType === "grant" ? 5 : 4)}ページ)</span>
                  <span>+{pagePrice.toLocaleString()}円</span>
                </div>
              )}
            </div>

            {/* 大規模サイトに関する注意書きを追加 */}
            <div style={{
              margin: "16px 0",
              padding: "12px 16px",
              background: "#fff9e6",
              borderRadius: "6px",
              border: "1px solid #ffd966",
              fontSize: "0.85rem",
              color: "#666"
            }}>
              <p style={{ margin: 0 }}>
                <strong>⚠️ 大規模サイトをご検討の場合</strong><br />
                月間100万PV以上、データベース容量50GB以上、または特殊なサーバー要件がある場合は、
                別途サーバー費用が必要となる場合があります。詳細はお問い合わせください。
              </p>
            </div>

            {requiresSupportPlan() && (
              <div className={styles.grantNotice}>
                <p style={{ fontSize: "0.9rem", marginTop: "10px", color: "#a00" }}>
                  ※月額サポートプランへの加入が必須となります。
                </p>
                
                {/* 必要プランの表示 */}
                <div style={{ 
                  margin: "12px 0", 
                  padding: "16px", 
                  background: "#fff8f0", 
                  borderRadius: "6px",
                  border: "1px solid #ffddbb"
                }}>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#333" }}>
                    {getRequiredSupportPlanLevel() === "premium" 
                      ? "必須プラン：プレミアムプラン"
                      : "必須プラン：ビジネスプラン以上"}
                  </h4>
                  
                  {/* 月額費用の表示 */}
                  {getRequiredSupportPlanLevel() === "business" ? (
                    // WordPressまたは予約システムの場合：ビジネスとプレミアムの両方を表示
                    <div style={{ marginBottom: "12px" }}>
                      <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "8px" }}>
                        以下のプランから選択可能です：
                      </p>
                      
                      {/* ビジネスプラン */}
                      <div style={{ marginBottom: "12px", paddingLeft: "8px", borderLeft: "3px solid #ffa500" }}>
                        <p style={{ fontWeight: "bold", margin: "0 0 4px 0" }}>ビジネスプラン</p>
                        <div style={{ fontSize: "0.9rem" }}>
                          <span>初年度：</span>
                          <span style={{ fontWeight: "bold", color: "#d83a00" }}>
                            {calculateMonthlyFee("business", 1).toLocaleString()}円/月
                          </span>
                          <span style={{ color: "#666" }}> / 2年目以降：</span>
                          <span>{calculateMonthlyFee("business", 2).toLocaleString()}円/月</span>
                        </div>
                      </div>
                      
                      {/* プレミアムプラン */}
                      <div style={{ paddingLeft: "8px", borderLeft: "3px solid #0066cc" }}>
                        <p style={{ fontWeight: "bold", margin: "0 0 4px 0" }}>プレミアムプラン（推奨）</p>
                        <div style={{ fontSize: "0.9rem" }}>
                          <span>初年度：</span>
                          <span style={{ fontWeight: "bold", color: "#d83a00" }}>
                            {calculateMonthlyFee("premium", 1).toLocaleString()}円/月
                          </span>
                          <span style={{ color: "#666" }}> / 2年目以降：</span>
                          <span>{calculateMonthlyFee("premium", 2).toLocaleString()}円/月</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // その他の場合：プレミアムプランのみ表示
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0"
                      }}>
                        <span style={{ fontWeight: "bold" }}>初年度月額費用</span>
                        <span style={{ fontWeight: "bold", color: "#d83a00" }}>
                          {calculateMonthlyFee("premium", 1).toLocaleString()}円/月
                        </span>
                      </div>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        padding: "8px 0"
                      }}>
                        <span>2年目以降月額費用</span>
                        <span style={{ color: "#666" }}>
                          {calculateMonthlyFee("premium", 2).toLocaleString()}円/月
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* プラン内容の詳細 */}
                  <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "8px" }}>
                    {getRequiredSupportPlanLevel() === "business" ? (
                      <>
                        <p style={{ margin: "4px 0", fontWeight: "bold" }}>各プランに含まれるサービス：</p>
                        <div style={{ marginBottom: "8px" }}>
                          <p style={{ margin: "4px 0", textDecoration: "underline" }}>ビジネスプラン：</p>
                          <p style={{ margin: "4px 0", paddingLeft: "12px" }}>
                            【初年度】{supportPlanDetails.business.firstYear.content}
                          </p>
                          <p style={{ margin: "4px 0", paddingLeft: "12px" }}>
                            【2年目以降】{supportPlanDetails.business.secondYear.content}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: "4px 0", textDecoration: "underline" }}>プレミアムプラン：</p>
                          <p style={{ margin: "4px 0", paddingLeft: "12px" }}>
                            【初年度】{supportPlanDetails.premium.firstYear.content}
                          </p>
                          <p style={{ margin: "4px 0", paddingLeft: "12px" }}>
                            【2年目以降】{supportPlanDetails.premium.secondYear.content}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p style={{ margin: "4px 0", fontWeight: "bold" }}>
                          {supportPlanDetails.premium.name}に含まれるサービス：
                        </p>
                        <p style={{ margin: "4px 0" }}>
                          【初年度】{supportPlanDetails.premium.firstYear.content}
                        </p>
                        <p style={{ margin: "4px 0" }}>
                          【2年目以降】{supportPlanDetails.premium.secondYear.content}
                        </p>
                      </>
                    )}
                    <p style={{ margin: "8px 0 0 0", color: "#0066cc", fontWeight: "bold" }}>
                      ※ドメイン・サーバー費用も月額プランに含まれます
                    </p>
                  </div>
                </div>
                
                {/* 選択理由の表示 */}
                <p style={{ fontSize: "0.8rem", color: "#666", margin: "8px 0 0 0" }}>
                  理由：
                  {(() => {
                    const reasons = [];
                    if (siteType === "grant") reasons.push("小規模事業者持続化補助金対応型サイト");
                    if (options.includes("wordpress")) reasons.push("WordPress導入");
                    if (options.includes("payment")) reasons.push("決済システム連携");
                    if (options.includes("mypage")) reasons.push("マイページ機能");
                    if (options.includes("chat")) reasons.push("チャット機能");
                    if (options.includes("mailmagazine")) reasons.push("メールマガジン配信システム");
                    if (options.includes("reservation")) reasons.push("予約システム連携");
                    if (options.includes("instagram")) reasons.push("Instagram連携・埋め込み");
                    return reasons.join("・") + "が選択されているため";
                  })()}
                </p>
                
                {/* 追加注記 */}
                {siteType === "grant" && (
                  <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "4px" }}>
                    ※補助金申請はお客様ご自身で行っていただきますが、準備は丁寧にサポートいたします。
                  </p>
                )}
                {options.includes("payment") && (
                  <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "4px" }}>
                    ※Stripe、PayPal等の外部決済サービスと連携し、安全な決済環境を構築します。
                  </p>
                )}
                {options.includes("ad_support") && (
                  <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "4px" }}>
                    ※広告出稿サポートの広告費は別途必要です。
                  </p>
                )}
                {options.includes("reservation") && (
                  <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "4px" }}>
                    ※STORES予約等の外部サービスの月額利用料は別途必要です。
                  </p>
                )}
                {options.includes("chat") && !options.includes("mypage") && (
                  <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "4px" }}>
                    ※チャット機能はマイページ実装なしの場合、追加料金220,000円が発生します。
                  </p>
                )}
              </div>
            )}

            <div className={styles.valueStatement}>
              <p>
                <strong>高品質なデザイン・SEO最適化・継続的な保守サポート・充実したアフターケア</strong>
                により、長期的なROI（投資対効果）を実現します。
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <button 
              onClick={handleProceed} 
              className={styles.button}
              aria-label="この内容で依頼フォームへ進む"
            >
              この内容で依頼フォームへ進む
            </button>
          </section>
        </>
      )}
    </div>
  );
}

// ローディングコンポーネント
function EstimateLoading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTopColor: '#005bac',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
      <p>見積もりフォームを読み込み中...</p>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}

// メインのエクスポートコンポーネント（Suspenseでラップ）
export default function EstimatePage() {
  return (
    <Suspense fallback={<EstimateLoading />}>
      <EstimateContent />
    </Suspense>
  );
}