"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import styles from "../../styles/Contact.module.css";

// 型定義
type EstimateData = {
  planType?: 'package' | 'original';  // プランタイプ
  // パッケージプラン用
  packageSiteType?: 'lp' | 'hp';
  packageTheme?: string;
  packageName?: string;
  // オリジナルプラン用
  siteType?: string;
  options?: string[];
  pageCount?: number;
  totalPrice: number;
  selectedLanguages?: string[];
};

type FormData = {
  company: string;
  name: string;
  email: string;
  tel: string;
  message: string;
};

type SubmitMessage = {
  type: 'success' | 'error';
  text: string;
};

// ラベルマップ
const siteTypeLabelMap: Record<string, string> = {
  lp: "ランディングページ",
  corporate: "コーポレートサイト",
  grant: "小規模事業者持続化補助金対応型",
};

const optionLabelMap: Record<string, string> = {
  responsive: "レスポンシブデザイン最適化",
  internal_seo: "内部SEO最適化",
  form: "お問合せフォーム設置",
  writing: "ライティング代行（ブログ記事）",
  seo: "SEO技術対策",
  analytics: "Google Analytics・サーチコンソール設定",
  security: "セキュリティ強化対策",
  ad_support: "広告出稿サポート",
  multilingual: "多言語対応",
  instagram: "Instagram連携・埋め込み",
  wordpress: "WordPress導入",
  payment: "決済システム連携（Stripe等）",
  mypage: "マイページ機能 & 管理者ページ",
  chat: "チャット機能",
  mailmagazine: "メールマガジン配信システム",
  reservation: "予約システム連携（STORES予約等）",
  video: "動画制作",
  logo_flyer: "ロゴ・チラシ制作との連携",
};

const optionPrices: Record<string, number> = {
  responsive: 77000,
  internal_seo: 0,
  form: 33000,
  writing: 22000,
  seo: 88000,
  analytics: 22000,
  security: 33000,
  ad_support: 33000,
  multilingual: 110000, // 基本価格（言語別計算は別途）
  instagram: 165000,
  wordpress: 110000,
  payment: 660000,
  mypage: 330000,
  chat: 495000, // 基本価格（マイページあり時）
  mailmagazine: 55000,
  reservation: 220000,
  video: 0, // 別途見積もり
  logo_flyer: 0, // 別途見積もり
};

// 言語オプションのラベルマップ
const languageLabelMap: Record<string, string> = {
  english: "英語",
  chinese: "中国語（簡体字）",
  traditional_chinese: "中国語（繁体字）",
  korean: "韓国語",
  spanish: "スペイン語",
  french: "フランス語",
  german: "ドイツ語",
  other: "その他"
};

export default function ContactPage() {
  const router = useRouter();
  const [estimate, setEstimate] = useState<EstimateData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    company: "",
    name: "",
    email: "",
    tel: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(null);

  // スクロール制御：確認画面表示時と送信メッセージ表示時にトップへ
  useEffect(() => {
    if (confirmed || submitMessage) {
      window.scrollTo(0, 0);
    }
  }, [confirmed, submitMessage]);

  // 標準仕様の判定
  const getLockedOptions = (siteType: string): string[] => {
    const baseOptions = ["responsive", "internal_seo"];
    if (siteType === "grant") return [...baseOptions, "form", "wordpress", "seo"];
    if (siteType === "corporate") return [...baseOptions, "form"];
    return baseOptions;
  };

  // 基本料金の取得
  const getBasePrice = (siteType: string): number => {
    switch (siteType) {
      case "lp": return 220000;
      case "corporate": return 385000;
      case "grant": return 770000;
      default: return 0;
    }
  };

  // チャット機能の価格を動的に計算
  const getChatPrice = (options: string[]): number => {
    const basePrice = 495000;
    const additionalPrice = 220000;
    return options.includes("mypage") ? basePrice : basePrice + additionalPrice;
  };

  // 多言語対応の価格を計算
  const getMultilingualPrice = (langCount: number, pages: number): number => {
    if (langCount === 0) return 0;
    const basePrice = 110000;
    const pricePerPage = 22000;
    return basePrice + (pricePerPage * pages * langCount);
  };

  // オプション価格を取得（動的価格対応）
  const getOptionPrice = (option: string, allOptions: string[], pageCount: number, selectedLanguages: string[]): number => {
    if (option === "chat") {
      return getChatPrice(allOptions);
    }
    if (option === "multilingual") {
      return getMultilingualPrice(selectedLanguages.length, pageCount);
    }
    return optionPrices[option] || 0;
  };

  // 月額サポートプランの料金を計算（更新版）
  const calculateMonthlyFee = (planType: string, year: number = 1): number => {
    if (!estimate) return 0;
    const total = estimate.totalPrice;
    
    if (year === 1) {
      // 初年度
      switch (planType) {
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
      // 2年目以降
      switch (planType) {
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

  // 詳細なメッセージを作成する関数
  const createDetailedMessage = (): string => {
    let message = formData.message || '';
    
    if (estimate) {
      message += '\n\n【概算見積もり内容】\n';
      
      // パッケージプランの場合
      if (estimate.planType === 'package') {
        message += `プランタイプ: パッケージプラン\n`;
        message += `サイトタイプ: ${estimate.packageSiteType === 'lp' ? 'ランディングページ' : 'ホームページ'}\n`;
        
        if (estimate.packageTheme) {
          const themeLabel = estimate.packageSiteType === 'lp' 
            ? (estimate.packageTheme === 'elegant' ? 'エレガント' : 
               estimate.packageTheme === 'natural' ? 'ナチュラル' : 'モダン')
            : (estimate.packageTheme === 'professional' ? 'プロフェッショナル' : 
               estimate.packageTheme === 'innovative' ? 'イノベーティブ' : 'フレンドリー');
          message += `選択デザイン: ${themeLabel}\n`;
        }
        
        if (estimate.packageName) {
          message += `${estimate.packageSiteType === 'lp' ? '店舗名' : '会社名'}: ${estimate.packageName}\n`;
        }
        
        message += `概算金額: ${estimate.totalPrice.toLocaleString()}円（税込）\n`;
        message += `\n※月額運用費: ${estimate.packageSiteType === 'lp' ? '11,000' : '16,500'}円（初年度）\n`;
        message += `※サーバー・ドメイン・SSL証明書・基本保守すべて込み\n`;
        message += `※2年目以降は月額6,600円への移行も可能\n`;
        
        return message;
      }
      
      // オリジナルプランの場合
      if (estimate.planType === 'original' && estimate.siteType) {
        const options = estimate.options || [];
        const selectedLanguages = estimate.selectedLanguages || [];
        
        message += `プランタイプ: オリジナルプラン\n`;
        message += `サイトタイプ: ${siteTypeLabelMap[estimate.siteType]}\n`;
        message += `概算金額: ${estimate.totalPrice.toLocaleString()}円（税込）\n`;
        
        if (options.length > 0) {
          message += '\n選択オプション:\n';
          options.forEach(opt => {
            const isLocked = getLockedOptions(estimate.siteType!).includes(opt);
            let optionLabel = optionLabelMap[opt] || opt;
            
            // 特殊なオプションの追加情報
            if (opt === "chat" && !options.includes("mypage")) {
              optionLabel += "（マイページなし・追加料金発生）";
            } else if (opt === "multilingual" && selectedLanguages.length > 0) {
              optionLabel += `（${selectedLanguages.length}言語：${selectedLanguages.map(lang => languageLabelMap[lang] || lang).join('、')}）`;
            }
            
            message += `- ${optionLabel}${isLocked ? '（標準仕様）' : ''}\n`;
          });
        }
        
        if (estimate.pageCount) {
          message += `\nページ数: ${estimate.pageCount}ページ\n`;
        }

        // 月額サポートプラン必須かどうかの判定
        const requiresSupportPlan = estimate.siteType === "grant" || 
          options.includes("wordpress") || 
          options.includes("payment") ||
          options.includes("mypage") || 
          options.includes("chat") ||
          options.includes("mailmagazine") ||
          options.includes("reservation") ||
          options.includes("instagram");

        const getRequiredSupportPlanLevel = () => {
          if (estimate.siteType === "grant" || 
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

        if (requiresSupportPlan) {
          const planLevel = getRequiredSupportPlanLevel();
          if (planLevel === "premium") {
            const monthlyFee = calculateMonthlyFee("premium", 1);
            message += `\n※プレミアムプラン（月額${monthlyFee.toLocaleString()}円）への加入が必須となります。\n`;
            message += `（制作費の3%程度、2年目以降は${calculateMonthlyFee("premium", 2).toLocaleString()}円/月）\n`;
          } else if (planLevel === "business") {
            const monthlyFee = calculateMonthlyFee("business", 1);
            message += `\n※ビジネスプラン以上（月額${monthlyFee.toLocaleString()}円〜）への加入が必須となります。\n`;
            message += `（制作費の2.5%程度、2年目以降は${calculateMonthlyFee("business", 2).toLocaleString()}円/月〜）\n`;
          }
        }
      }
    }
    
    return message;
  };

  useEffect(() => {
    const stored = localStorage.getItem("estimateData");
    if (stored) setEstimate(JSON.parse(stored));

    const savedForm = sessionStorage.getItem("contactForm");
    if (savedForm) setFormData(JSON.parse(savedForm));

    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "このページを離れると、入力内容が失われる可能性があります。";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
    setSubmitMessage(null); // メッセージをクリア
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.company) newErrors.company = "会社名を入力してください";
    if (!formData.name) newErrors.name = "担当者名を入力してください";
    if (!formData.email) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "正しいメールアドレスを入力してください";
    }
    return newErrors;
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
    } else {
      sessionStorage.setItem("contactForm", JSON.stringify(formData));
      setConfirmed(true);
      setSubmitMessage(null);
      // スクロールアップ（useEffectでも実行されるが、念のため）
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitMessage(null);

      // 詳細なメッセージを作成
      const detailedMessage = createDetailedMessage();

      // API送信用のデータ
      const submitData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.tel,
        message: detailedMessage
      };

      // api.tsを使用してリクエスト送信
      const data = await api.contact(submitData);

      if (data.success) {
        // 送信成功
        setSubmitMessage({
          type: 'success',
          text: data.message || 'お問い合わせを受け付けました。自動返信メールをご確認ください。'
        });
        
        // フォームをリセット
        localStorage.removeItem("estimateData");
        sessionStorage.removeItem("contactForm");
        setConfirmed(false);
        setFormData({ company: "", name: "", email: "", tel: "", message: "" });
        setEstimate(null);
        
        // スクロールアップ
        window.scrollTo({ top: 0, behavior: "smooth" });
        
        // 3秒後にトップページにリダイレクト
        setTimeout(() => {
          router.push('/');
        }, 3000);
        
      } else {
        // 送信失敗
        throw new Error(data.message || 'システムエラーが発生しました');
      }

    } catch (error) {
      console.error('送信エラー:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'ネットワークエラーが発生しました。時間をおいて再度お試しください。'
      });
      // エラー時もスクロールアップ
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 見積もり内容の表示コンポーネント
  const renderEstimateDetails = () => {
    if (!estimate) return null;

    // パッケージプランの場合
    if (estimate.planType === 'package') {
      return (
        <div className={styles.estimateBox}>
          <h2>概算見積もり（パッケージプラン）</h2>
          <div className={styles.totalPrice}>
            {estimate.totalPrice.toLocaleString()}円（税込）
          </div>
          
          <div className={styles.breakdown}>
            <div className={styles.breakdownItem}>
              <span>
                {estimate.packageSiteType === 'lp' ? 'ランディングページ' : 'ホームページ'} 制作費
              </span>
              <span>{estimate.totalPrice.toLocaleString()}円</span>
            </div>
            
            {estimate.packageTheme && (
              <div className={styles.breakdownItem} style={{ fontSize: '0.9rem', color: '#666' }}>
                <span>選択デザイン</span>
                <span>
                  {estimate.packageSiteType === 'lp' 
                    ? (estimate.packageTheme === 'elegant' ? 'エレガント' : 
                       estimate.packageTheme === 'natural' ? 'ナチュラル' : 'モダン')
                    : (estimate.packageTheme === 'professional' ? 'プロフェッショナル' : 
                       estimate.packageTheme === 'innovative' ? 'イノベーティブ' : 'フレンドリー')
                  }
                </span>
              </div>
            )}
            
            {estimate.packageName && (
              <div className={styles.breakdownItem} style={{ fontSize: '0.9rem', color: '#666' }}>
                <span>{estimate.packageSiteType === 'lp' ? '店舗名' : '会社名'}</span>
                <span>{estimate.packageName}</span>
              </div>
            )}
          </div>

          <div style={{
            margin: "20px 0",
            padding: "15px",
            background: "#f8f9fa",
            borderRadius: "6px",
            border: "1px solid #dee2e6"
          }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "1rem", color: "#333" }}>
              月額運用費について
            </h4>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>
              <p style={{ margin: "5px 0" }}>
                初年度：月額 {estimate.packageSiteType === 'lp' ? '11,000' : '16,500'}円（税込）
              </p>
              <p style={{ margin: "5px 0" }}>
                2年目以降：月額 6,600円（税込）への移行も可能
              </p>
              <p style={{ margin: "10px 0 0 0", fontSize: "0.85rem" }}>
                ※サーバー・ドメイン・SSL証明書・基本保守すべて込み
              </p>
            </div>
          </div>

          <div className={styles.valueStatement}>
            <p>
              <strong>テンプレートデザインを活用した低価格プラン</strong><br />
              短納期でビジネスをすぐにスタートできます。
            </p>
          </div>

          <p className={styles.editLink}>
            内容を変更したい場合は{" "}
            <button
              type="button"
              onClick={() => router.push("/estimate")}
              className={styles.linkButton}
            >
              簡易見積もりフォームに戻る
            </button>{" "}
            ことができます。
          </p>
        </div>
      );
    }

    // オリジナルプランの場合
    if (!estimate.siteType) return null;

    const basePrice = getBasePrice(estimate.siteType);
    const lockedOptions = getLockedOptions(estimate.siteType);
    const options = estimate.options || [];
    const selectedLanguages = estimate.selectedLanguages || [];
    const pageCount = estimate.pageCount || (estimate.siteType === "lp" ? 1 : estimate.siteType === "corporate" ? 4 : 5);
    
    // 追加ページ料金の計算
    const pagePrice = estimate.siteType === "corporate" && estimate.pageCount && estimate.pageCount > 4
      ? (estimate.pageCount - 4) * 11000
      : estimate.siteType === "grant" && estimate.pageCount && estimate.pageCount > 5
      ? (estimate.pageCount - 5) * 11000
      : 0;

    // 月額サポートプラン必須かどうかの判定
    const requiresSupportPlan = estimate.siteType === "grant" || 
      options.includes("wordpress") || 
      options.includes("payment") ||
      options.includes("mypage") || 
      options.includes("chat") ||
      options.includes("mailmagazine") ||
      options.includes("reservation") ||
      options.includes("instagram");

    const getRequiredSupportPlanLevel = () => {
      if (estimate.siteType === "grant" || 
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

    return (
      <div className={styles.estimateBox}>
        <h2>概算見積もり（オリジナルプラン）</h2>
        <div className={styles.totalPrice}>
          {estimate.totalPrice.toLocaleString()}円（税込）
        </div>
        
        <div className={styles.breakdown}>
          <div className={styles.breakdownItem}>
            <span>{siteTypeLabelMap[estimate.siteType]} 基本料金</span>
            <span>{basePrice.toLocaleString()}円</span>
          </div>
          
          {options.map(opt => {
            const isLocked = lockedOptions.includes(opt);
            const price = getOptionPrice(opt, options, pageCount, selectedLanguages);
            let label = optionLabelMap[opt] || opt;
            
            // 特殊なオプションのラベル調整
            if (opt === "chat") {
              label += options.includes("mypage") ? "（マイページ実装時）" : "（マイページなし・追加料金発生）";
            } else if (opt === "multilingual" && selectedLanguages.length > 0) {
              label += ` (${selectedLanguages.length}言語選択)`;
            } else if (opt === "video" || opt === "logo_flyer") {
              label += "（別途お見積もり）";
            }
            
            return (
              <div key={opt} className={styles.breakdownItem}>
                <span>{label}</span>
                <span>
                  {isLocked ? "標準仕様" : 
                   opt === "seo" && options.includes("wordpress") ? "標準仕様" :
                   opt === "analytics" && options.includes("wordpress") ? "標準仕様" :
                   (opt === "video" || opt === "logo_flyer") ? "別途お見積もり" :
                   `+${price.toLocaleString()}円`}
                </span>
              </div>
            );
          })}
          
          {pagePrice > 0 && (
            <div className={styles.breakdownItem}>
              <span>追加ページ ({estimate.pageCount! - (estimate.siteType === "grant" ? 5 : 4)}ページ)</span>
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

        {requiresSupportPlan && (
          <div className={styles.premiumNotice}>
            <p>
              {getRequiredSupportPlanLevel() === "premium" 
                ? `※プレミアムプラン（月額${calculateMonthlyFee("premium", 1).toLocaleString()}円）への加入が必須となります。`
                : `※ビジネスプラン以上（月額${calculateMonthlyFee("business", 1).toLocaleString()}円〜）への加入が必須となります。`}
              <br />
              <span style={{ fontSize: "0.85rem", color: "#666" }}>
                {getRequiredSupportPlanLevel() === "premium"
                  ? `（制作費の3%程度、2年目以降は${calculateMonthlyFee("premium", 2).toLocaleString()}円/月）`
                  : `（制作費の2.5%程度、2年目以降は${calculateMonthlyFee("business", 2).toLocaleString()}円/月〜）`}
              </span>
              <br />
              <span style={{ fontSize: "0.8rem", color: "#666" }}>
                理由：
                {(() => {
                  const reasons = [];
                  if (estimate.siteType === "grant") reasons.push("小規模事業者持続化補助金対応型サイト");
                  if (options.includes("wordpress")) reasons.push("WordPress導入");
                  if (options.includes("payment")) reasons.push("決済システム連携");
                  if (options.includes("mypage")) reasons.push("マイページ機能");
                  if (options.includes("chat")) reasons.push("チャット機能");
                  if (options.includes("mailmagazine")) reasons.push("メールマガジン配信システム");
                  if (options.includes("reservation")) reasons.push("予約システム連携");
                  if (options.includes("instagram")) reasons.push("Instagram連携・埋め込み");
                  return reasons.join("・") + "が選択されているため";
                })()}
              </span>
              {estimate.siteType === "grant" && (
                <>
                  <br />
                  ※補助金申請はお客様ご自身で行っていただきますが、準備は丁寧にサポートいたします。
                </>
              )}
              {options.includes("payment") && (
                <>
                  <br />
                  ※Stripe、PayPal等の外部決済サービスと連携し、安全な決済環境を構築します。
                </>
              )}
              {options.includes("ad_support") && (
                <>
                  <br />
                  ※広告出稿サポートの広告費は別途必要です。
                </>
              )}
              {options.includes("reservation") && (
                <>
                  <br />
                  ※STORES予約等の外部サービスの月額利用料は別途必要です。
                </>
              )}
              {options.includes("chat") && !options.includes("mypage") && (
                <>
                  <br />
                  ※チャット機能はマイページ実装なしの場合、追加料金220,000円が発生します。
                </>
              )}
            </p>
          </div>
        )}

        <div className={styles.valueStatement}>
          <p>
            <strong>高品質なデザイン・SEO最適化・継続的な保守サポート・充実したアフターケア</strong>
            により、長期的なROI（投資対効果）を実現します。
          </p>
        </div>

        <p className={styles.editLink}>
          内容を変更したい場合は{" "}
          <button
            type="button"
            onClick={() => router.push("/estimate")}
            className={styles.linkButton}
          >
            簡易見積もりフォームに戻る
          </button>{" "}
          ことができます。
        </p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* 送信メッセージ */}
      {submitMessage && (
        <div className={`${styles.message} ${styles[submitMessage.type]}`}>
          {submitMessage.text}
          {submitMessage.type === 'success' && (
            <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
              3秒後にトップページに移動します...
            </p>
          )}
        </div>
      )}

      {/* 入力フォーム（確認前のみ）- 上に配置 */}
      {!confirmed && !submitMessage && (
        <>
          <h1 className={styles.title}>依頼フォーム</h1>
          <form onSubmit={handleConfirm} className={styles.form}>
            <label className={styles.label}>会社名（または屋号）
              <input name="company" value={formData.company} onChange={handleChange} className={styles.input} />
              {errors.company && <p className={styles.error}>{errors.company}</p>}
            </label>
            <label className={styles.label}>担当者名
              <input name="name" value={formData.name} onChange={handleChange} className={styles.input} />
              {errors.name && <p className={styles.error}>{errors.name}</p>}
            </label>
            <label className={styles.label}>メールアドレス
              <input name="email" value={formData.email} onChange={handleChange} className={styles.input} />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
            </label>
            <label className={styles.label}>電話番号（任意）
              <input name="tel" value={formData.tel} onChange={handleChange} className={styles.input} />
            </label>
            <label className={styles.label}>その他・ご要望など（任意）
              <textarea name="message" value={formData.message} onChange={handleChange} className={styles.textarea} rows={4} />
            </label>
            <button type="submit" className={styles.submitButton}>入力内容を確認する</button>
          </form>
        </>
      )}

      {/* 確認画面 */}
      {confirmed && !submitMessage && (
        <div className={styles.confirmBox}>
          <h2>入力内容の確認</h2>
          <p><strong>会社名：</strong>{formData.company}</p>
          <p><strong>担当者名：</strong>{formData.name}</p>
          <p><strong>メールアドレス：</strong>{formData.email}</p>
          <p><strong>電話番号：</strong>{formData.tel || "（未入力）"}</p>
          <p><strong>メッセージ：</strong>{formData.message || "（未入力）"}</p>
          
          <button 
            onClick={handleSubmit} 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? '送信中...' : 'この内容で送信する'}
          </button>
          <button 
            onClick={() => setConfirmed(false)} 
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            修正する
          </button>
        </div>
      )}

      {/* 見積もり情報表示 - 下に配置 */}
      {estimate && !submitMessage && renderEstimateDetails()}
    </div>
  );
}