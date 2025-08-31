"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../demo.lp.module.css";   // ✅ 正しい共通CSS

// 型定義
type BusinessType = "beauty" | "nail" | "hair";
type ThemeType = "elegant" | "natural" | "modern";

// 業種別コンテンツ設定
const businessContent = {
  beauty: {
    label: "エステ・リラクゼーションサロン",
    hero: {
      subtitle: {
        elegant: "極上の癒しと美への誘い",
        natural: "心と体に優しい癒しの時間",
        modern: "最新技術で叶える理想の美"
      },
      title: "Beauty Salon",
      description: {
        elegant: "一流の技術と最高級のおもてなしで\n至福のひとときをご提供いたします",
        natural: "オーガニックにこだわった自然派トリートメントで\n本来の美しさを引き出します",
        modern: "医療レベルの最新美容機器と\nデータに基づいた施術プログラム"
      }
    },
    services: [
      {
        name: "フェイシャルエステ",
        description: {
          elegant: "贅沢な美容成分で極上の肌へ",
          natural: "天然由来成分で肌本来の力を",
          modern: "最新マシンで即効性のある結果を"
        },
        price: "¥12,000〜",
        campaignPrice: "¥6,000〜"
      },
      {
        name: "痩身エステ",
        description: {
          elegant: "優雅に理想のボディラインへ",
          natural: "体に優しいハンドトリートメント",
          modern: "科学的アプローチで効率的に"
        },
        price: "¥15,000〜",
        campaignPrice: "¥7,500〜"
      },
      {
        name: "リンパマッサージ",
        description: {
          elegant: "深いリラクゼーションと美の融合",
          natural: "自然治癒力を高める優しいケア",
          modern: "医学的根拠に基づく施術"
        },
        price: "¥8,000〜",
        campaignPrice: "¥4,000〜"
      }
    ],
    features: {
      elegant: [
        "完全個室のラグジュアリー空間",
        "世界基準の技術とホスピタリティ",
        "オーダーメイドの贅沢なケア"
      ],
      natural: [
        "自然光が入る癒しの空間",
        "オーガニック認証取得の製品使用",
        "心身のバランスを整えるケア"
      ],
      modern: [
        "清潔感あふれる最新設備",
        "AIによる肌診断システム",
        "効果を可視化するビフォーアフター"
      ]
    }
  },
  nail: {
    label: "ネイルサロン・まつげエクステ",
    hero: {
      subtitle: {
        elegant: "指先から始まる上質な美しさ",
        natural: "ナチュラルな美しさを大切に",
        modern: "トレンドを先取りするサロン"
      },
      title: "Nail & Beauty",
      description: {
        elegant: "洗練されたデザインと丁寧な施術で\n特別な指先を演出いたします",
        natural: "爪に優しい施術と自然な仕上がりで\n毎日を心地よく彩ります",
        modern: "最新トレンドと革新的な技術で\nあなただけのスタイルを創造"
      }
    },
    services: [
      {
        name: "ジェルネイル",
        description: {
          elegant: "上品で洗練されたデザイン",
          natural: "爪に優しい自然な仕上がり",
          modern: "最新アートとトレンドデザイン"
        },
        price: "¥6,000〜",
        campaignPrice: "¥3,000〜"
      },
      {
        name: "まつげエクステ",
        description: {
          elegant: "エレガントな目元を演出",
          natural: "ナチュラルで軽やかな仕上がり",
          modern: "最新技術で持続性アップ"
        },
        price: "¥8,000〜",
        campaignPrice: "¥4,000〜"
      },
      {
        name: "眉毛スタイリング",
        description: {
          elegant: "品格ある美しい眉ラインへ",
          natural: "自然な眉の美しさを引き出す",
          modern: "黄金比に基づくデザイン"
        },
        price: "¥5,000〜",
        campaignPrice: "¥2,500〜"
      }
    ],
    features: {
      elegant: [
        "プライベートサロンの贅沢な時間",
        "一流ブランドの材料のみ使用",
        "繊細で上品なデザイン提案"
      ],
      natural: [
        "リラックスできる温かい雰囲気",
        "爪と肌に優しい成分を厳選",
        "自然な美しさを引き出す技術"
      ],
      modern: [
        "フォトジェニックな店内空間",
        "デジタルカタログで選べるデザイン",
        "SNS映えする仕上がり"
      ]
    }
  },
  hair: {
    label: "美容室・ヘアサロン",
    hero: {
      subtitle: {
        elegant: "至高のヘアデザインをあなたに",
        natural: "髪本来の美しさを大切に",
        modern: "最先端のヘアスタイルを提案"
      },
      title: "Hair Salon",
      description: {
        elegant: "一流スタイリストが創り出す\nあなただけの特別なスタイル",
        natural: "髪と頭皮に優しい施術で\n健康的な美しさを実現します",
        modern: "トレンドと技術の融合で\n新しい自分を発見"
      }
    },
    services: [
      {
        name: "カット",
        description: {
          elegant: "骨格と雰囲気を活かす上質カット",
          natural: "髪質を活かしたナチュラルカット",
          modern: "最新トレンドを取り入れたカット"
        },
        price: "¥4,500〜",
        campaignPrice: "¥2,250〜"
      },
      {
        name: "カラー",
        description: {
          elegant: "艶やかで品のある色合い",
          natural: "オーガニックカラーで優しく染める",
          modern: "ハイトーンから特殊カラーまで"
        },
        price: "¥7,000〜",
        campaignPrice: "¥3,500〜"
      },
      {
        name: "トリートメント",
        description: {
          elegant: "極上の手触りとツヤを実現",
          natural: "髪本来の力を引き出すケア",
          modern: "分子レベルで髪を修復"
        },
        price: "¥5,000〜",
        campaignPrice: "¥2,500〜"
      }
    ],
    features: {
      elegant: [
        "完全予約制のプライベート空間",
        "経験豊富なトップスタイリスト",
        "最高級ヘアケア製品を使用"
      ],
      natural: [
        "アットホームな雰囲気",
        "髪と地肌に優しいメニュー",
        "丁寧なカウンセリング"
      ],
      modern: [
        "デザイナーズ空間",
        "最新のデジタルパーマ機器",
        "トレンド発信サロン"
      ]
    }
  }
};

// セクション構成の定義
const sectionLayouts = {
  elegant: ["hero", "concept", "services", "experience", "access", "cta"],
  natural: ["hero", "welcome", "services", "voice", "flow", "access", "cta"],
  modern: ["hero", "features", "services", "results", "price", "access", "cta"]
};

export default function InteractiveLPDemo() {
  const router = useRouter();
  const [shopName, setShopName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("beauty");
  const [theme, setTheme] = useState<ThemeType>("elegant");
  const [isControlOpen, setIsControlOpen] = useState(false); // 初期状態を閉じた状態に

  const business = businessContent[businessType];
  const displayName = shopName || "LUNA";
  const layoutSections = sectionLayouts[theme];

  // フォームへ遷移
  // 見積もりフォームへ遷移
const handleOrder = () => {
  const params = new URLSearchParams({
    type: 'package',
    plan: 'lp',
    theme: theme,
    shopName: shopName || 'LUNA'
  });
  router.push(`/estimate?${params.toString()}`);
};

  // セクションコンポーネントのマッピング
  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case "hero":
        return (
          <section key={sectionName} className={`${styles.hero} ${styles[theme]}`}>
            <div className={styles.heroOverlay}></div>
            <div className={styles.heroContent}>
              <p className={styles.heroSubtitle}>{business.hero.subtitle[theme]}</p>
              <h1 className={styles.heroTitle}>
                {business.hero.title} <span className={styles.heroHighlight}>{displayName}</span>
              </h1>
              <p className={styles.heroDescription}>{business.hero.description[theme]}</p>
              <div className={styles.heroCta}>
                <button className={styles.ctaButton}>
                  今すぐ予約する
                </button>
                <p className={styles.ctaNote}>
                  <span className={styles.badge}>初回限定</span>
                  全メニュー50%OFF
                </p>
              </div>
            </div>
          </section>
        );

      case "concept":
        return (
          <section key={sectionName} className={`${styles.concept} ${styles[theme]}`}>
            <div className={styles.conceptInner}>
              <h2 className={styles.conceptTitle}>Concept</h2>
              <p className={styles.conceptText}>
                {displayName}は、お客様一人ひとりに寄り添い<br />
                最高のおもてなしと技術でお迎えいたします
              </p>
              <div className={styles.conceptImage}>
                <div className={styles.imagePlaceholder}>
                  <span>コンセプトイメージ写真</span>
                  <small>推奨サイズ: 1200×600px</small>
                </div>
              </div>
            </div>
          </section>
        );

      case "welcome":
        return (
          <section key={sectionName} className={`${styles.welcome} ${styles[theme]}`}>
            <div className={styles.welcomeInner}>
              <h2 className={styles.welcomeTitle}>ようこそ、{displayName}へ</h2>
              <div className={styles.welcomeContent}>
                <div className={styles.welcomeText}>
                  <p>
                    私たちは、お客様の「なりたい」を大切にしています。<br />
                    アットホームな空間で、リラックスしながら<br />
                    あなただけの美しさを見つけてください。
                  </p>
                </div>
                <div className={styles.welcomeImage}>
                  <div className={styles.imagePlaceholder}>
                    <span>店内の雰囲気写真</span>
                    <small>明るく温かい雰囲気の写真推奨</small>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case "features":
        return (
          <section key={sectionName} className={`${styles.features} ${styles[theme]}`}>
            <div className={styles.featuresInner}>
              <h2 className={styles.featuresTitle}>
                <span className={styles.featuresTitleEn}>FEATURES</span>
                <span className={styles.featuresTitleJa}>選ばれる理由</span>
              </h2>
              <div className={styles.featureGrid}>
                {business.features[theme].map((feature, index) => (
                  <div key={index} className={styles.featureCard}>
                    <div className={styles.featureNumber}>{String(index + 1).padStart(2, '0')}</div>
                    <h3>{feature}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "services":
        return (
          <section key={sectionName} className={`${styles.services} ${styles[theme]}`}>
            <div className={styles.servicesInner}>
              <h2 className={styles.servicesTitle}>
                {theme === "elegant" ? "Services" : theme === "natural" ? "メニュー" : "SERVICE MENU"}
              </h2>
              <div className={styles.serviceGrid}>
                {business.services.map((service, index) => (
                  <article key={index} className={styles.serviceCard}>
                    <div className={styles.serviceImage}>
                      <div className={styles.imagePlaceholder}>
                        <span>{service.name}の施術イメージ</span>
                        <small>推奨: 800×600px</small>
                      </div>
                    </div>
                    <div className={styles.serviceContent}>
                      <h3>{service.name}</h3>
                      <p className={styles.serviceDescription}>
                        {service.description[theme]}
                      </p>
                      <div className={styles.servicePrice}>
                        <span className={styles.priceRegular}>{service.price}</span>
                        <span className={styles.priceCampaign}>初回 {service.campaignPrice}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      case "experience":
        return (
          <section key={sectionName} className={`${styles.experience} ${styles[theme]}`}>
            <div className={styles.experienceInner}>
              <h2 className={styles.experienceTitle}>Special Experience</h2>
              <p className={styles.experienceSubtitle}>特別な体験をあなたに</p>
              <div className={styles.experienceGrid}>
                <div className={styles.experienceCard}>
                  <div className={styles.imagePlaceholder}>
                    <span>ラグジュアリーな空間</span>
                  </div>
                  <p>完全個室でゆったりとした時間</p>
                </div>
                <div className={styles.experienceCard}>
                  <div className={styles.imagePlaceholder}>
                    <span>こだわりの設備</span>
                  </div>
                  <p>最高級の機器と製品を使用</p>
                </div>
              </div>
            </div>
          </section>
        );

      case "voice":
        return (
          <section key={sectionName} className={`${styles.voice} ${styles[theme]}`}>
            <div className={styles.voiceInner}>
              <h2 className={styles.voiceTitle}>お客様の声</h2>
              <div className={styles.voiceGrid}>
                <div className={styles.voiceCard}>
                  <div className={styles.voiceHeader}>
                    <span className={styles.voiceAuthor}>A.K様 30代</span>
                    <span className={styles.voiceService}>{business.services[0].name}</span>
                  </div>
                  <p className={styles.voiceText}>
                    「とても親切で、リラックスできました。仕上がりも大満足です！」
                  </p>
                </div>
                <div className={styles.voiceCard}>
                  <div className={styles.voiceHeader}>
                    <span className={styles.voiceAuthor}>M.T様 40代</span>
                    <span className={styles.voiceService}>{business.services[1].name}</span>
                  </div>
                  <p className={styles.voiceText}>
                    「技術が素晴らしく、効果も実感できています。また通いたいです。」
                  </p>
                </div>
              </div>
            </div>
          </section>
        );

      case "results":
        return (
          <section key={sectionName} className={`${styles.results} ${styles[theme]}`}>
            <div className={styles.resultsInner}>
              <h2 className={styles.resultsTitle}>BEFORE / AFTER</h2>
              <div className={styles.resultsGrid}>
                <div className={styles.resultCard}>
                  <h3>{business.services[0].name}</h3>
                  <div className={styles.resultImages}>
                    <div className={styles.resultBefore}>
                      <div className={styles.imagePlaceholder}>
                        <span>BEFORE</span>
                        <small>施術前の状態</small>
                      </div>
                    </div>
                    <div className={styles.resultArrow}>→</div>
                    <div className={styles.resultAfter}>
                      <div className={styles.imagePlaceholder}>
                        <span>AFTER</span>
                        <small>施術後の変化</small>
                      </div>
                    </div>
                  </div>
                  <p className={styles.resultDescription}>
                    わずか1回の施術で、これだけの変化が
                  </p>
                </div>
              </div>
            </div>
          </section>
        );

      case "flow":
        return (
          <section key={sectionName} className={`${styles.flow} ${styles[theme]}`}>
            <div className={styles.flowInner}>
              <h2 className={styles.flowTitle}>ご利用の流れ</h2>
              <div className={styles.flowList}>
                {["ご予約", "カウンセリング", "施術", "アフターケア"].map((step, index) => (
                  <div key={index} className={styles.flowItem}>
                    <div className={styles.flowNumber}>{index + 1}</div>
                    <h3>{step}</h3>
                    <p>お客様に合わせた丁寧な対応</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "price":
        return (
          <section key={sectionName} className={`${styles.price} ${styles[theme]}`}>
            <div className={styles.priceInner}>
              <h2 className={styles.priceTitle}>PRICE LIST</h2>
              <div className={styles.priceTable}>
                {business.services.map((service, index) => (
                  <div key={index} className={styles.priceRow}>
                    <div className={styles.priceName}>{service.name}</div>
                    <div className={styles.priceAmount}>
                      <span className={styles.priceRegular}>{service.price}</span>
                      <span className={styles.priceCampaign}>{service.campaignPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "access":
        return (
          <section key={sectionName} className={`${styles.access} ${styles[theme]}`}>
            <div className={styles.accessInner}>
              <h2 className={styles.accessTitle}>
                {theme === "elegant" ? "Access" : theme === "natural" ? "アクセス" : "ACCESS"}
              </h2>
              <div className={styles.accessContent}>
                <div className={styles.accessInfo}>
                  <h3>{business.hero.title} {displayName}</h3>
                  <table className={styles.accessTable}>
                    <tbody>
                      <tr>
                        <th>住所</th>
                        <td>〒305-0001<br />茨城県つくば市天王台1-1-1</td>
                      </tr>
                      <tr>
                        <th>電話番号</th>
                        <td>029-123-4567</td>
                      </tr>
                      <tr>
                        <th>営業時間</th>
                        <td>10:00〜20:00</td>
                      </tr>
                      <tr>
                        <th>定休日</th>
                        <td>水曜日</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.accessMap}>
                  <div className={styles.imagePlaceholder}>
                    <span>Google Map</span>
                    <small>地図を埋め込みます</small>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case "cta":
        return (
          <section key={sectionName} className={`${styles.cta} ${styles[theme]}`}>
            <div className={styles.ctaInner}>
              <h2 className={styles.ctaTitle}>
                今なら初回<span className={styles.ctaHighlight}>50%OFF</span>
              </h2>
              <p className={styles.ctaText}>まずはお気軽にお試しください</p>
              <div className={styles.ctaButtons}>
                <button className={styles.ctaButtonPrimary}>
                  電話で予約する
                </button>
                <button className={styles.ctaButtonSecondary}>
                  LINEで予約する
                  <small>24時間受付中</small>
                </button>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${styles.wrapper} ${styles[theme]}`}>
      {/* コントロールパネル */}
      <div className={`${styles.controlPanel} ${!isControlOpen ? styles.controlPanelClosed : ''}`}>
        <div className={styles.controlInner}>
          <div className={styles.controlHeader}>
            <h3>
              {isControlOpen ? (
                'あなたのサロンでシミュレーション'
              ) : (
                <span style={{ fontSize: '0.9rem' }}>
                  {displayName} | {businessContent[businessType].label.split('・')[0]} | {theme === 'elegant' ? 'エレガント' : theme === 'natural' ? 'ナチュラル' : 'モダン'}
                </span>
              )}
            </h3>
            <button 
              className={styles.toggleButton}
              onClick={() => setIsControlOpen(!isControlOpen)}
              aria-label={isControlOpen ? 'コントロールパネルを閉じる' : 'コントロールパネルを開く'}
              title={isControlOpen ? 'コントロールパネルを閉じる' : 'コントロールパネルを開く'}
            >
              {isControlOpen ? '▲' : '▼'}
            </button>
          </div>
          
          <div className={`${styles.controlContent} ${!isControlOpen ? styles.hidden : ''}`}>
            <div className={styles.controlGroup}>
              <label>店舗名</label>
              <input
                type="text"
                placeholder="あなたのサロン名を入力"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className={styles.shopNameInput}
              />
            </div>

            <div className={styles.controlGroup}>
              <label>業種</label>
              <div className={styles.buttonGroup}>
                <button
                  className={businessType === "beauty" ? styles.active : ""}
                  onClick={() => setBusinessType("beauty")}
                >
                  エステ・リラクゼーション
                </button>
                <button
                  className={businessType === "nail" ? styles.active : ""}
                  onClick={() => setBusinessType("nail")}
                >
                  ネイル・まつげ
                </button>
                <button
                  className={businessType === "hair" ? styles.active : ""}
                  onClick={() => setBusinessType("hair")}
                >
                  美容室・ヘアサロン
                </button>
              </div>
            </div>

            <div className={styles.controlGroup}>
              <label>デザイン</label>
              <div className={styles.buttonGroup}>
                <button
                  className={theme === "elegant" ? styles.active : ""}
                  onClick={() => setTheme("elegant")}
                >
                  エレガント
                </button>
                <button
                  className={theme === "natural" ? styles.active : ""}
                  onClick={() => setTheme("natural")}
                >
                  ナチュラル
                </button>
                <button
                  className={theme === "modern" ? styles.active : ""}
                  onClick={() => setTheme("modern")}
                >
                  モダン
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className={`${styles.main} ${isControlOpen ? styles.mainOpen : ''}`}>
        {layoutSections.map((section) => renderSection(section))}
      </main>

      {/* 固定CTAフッター */}
      <div className={styles.fixedCta}>
        <div className={styles.fixedCtaInner}>
          <div className={styles.fixedCtaText}>
            <p>気に入ったデザインが見つかりましたか？</p>
            <small>初期費用5万円〜 / 月額1万円（2年間）</small>
          </div>
          <button className={styles.fixedCtaButton} onClick={handleOrder}>
            このデザインで制作を依頼する
          </button>
        </div>
      </div>
    </div>
  );
}