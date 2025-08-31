"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../demo.lp.module.css";

// 型定義
type BusinessType = "clinic" | "dental" | "fitness";
type ThemeType = "elegant" | "natural" | "modern";

// 業種別コンテンツ設定
const businessContent = {
  clinic: {
    label: "整体院・整骨院",
    hero: {
      subtitle: {
        elegant: "身体の痛みに寄り添う確かな技術",
        natural: "自然治癒力を高める優しい施術",
        modern: "最新の医療技術で根本改善"
      },
      title: "Chiropractic Clinic",
      description: {
        elegant: "経験豊富な施術者が\n一人ひとりの症状に合わせた施術をご提供",
        natural: "身体本来の力を引き出し\n健康で快適な毎日をサポートします",
        modern: "科学的根拠に基づいた施術で\n確実な改善を目指します"
      }
    },
    services: [
      {
        name: "骨盤矯正",
        description: {
          elegant: "身体の土台から整える施術",
          natural: "優しい手技で自然な位置へ",
          modern: "3D姿勢分析による精密矯正"
        },
        price: "¥6,000〜",
        campaignPrice: "¥3,000〜"
      },
      {
        name: "肩こり・腰痛改善",
        description: {
          elegant: "深層筋へアプローチする本格施術",
          natural: "痛みの原因から優しくケア",
          modern: "最新機器と手技の融合治療"
        },
        price: "¥5,000〜",
        campaignPrice: "¥2,500〜"
      },
      {
        name: "スポーツ整体",
        description: {
          elegant: "アスリートのための専門施術",
          natural: "身体能力を引き出すケア",
          modern: "パフォーマンス向上プログラム"
        },
        price: "¥7,000〜",
        campaignPrice: "¥3,500〜"
      }
    ],
    features: {
      elegant: [
        "完全予約制のプライベート施術",
        "国家資格保有の施術者が対応",
        "落ち着いた空間での丁寧な施術"
      ],
      natural: [
        "薬に頼らない自然療法",
        "身体に優しい手技療法",
        "リラックスできる温かい雰囲気"
      ],
      modern: [
        "最新の検査機器を完備",
        "データに基づく施術計画",
        "短期間での改善を実現"
      ]
    }
  },
  dental: {
    label: "歯科医院",
    hero: {
      subtitle: {
        elegant: "美しく健康な歯を永く保つために",
        natural: "歯と心に優しい治療を",
        modern: "最先端技術で叶える理想の口元"
      },
      title: "Dental Clinic",
      description: {
        elegant: "丁寧なカウンセリングと\n高度な技術で理想の口元を実現",
        natural: "痛みの少ない優しい治療で\n家族みんなの歯の健康を守ります",
        modern: "デジタル技術を駆使した\n精密で効率的な治療をご提供"
      }
    },
    services: [
      {
        name: "一般歯科",
        description: {
          elegant: "丁寧で確実な基本治療",
          natural: "痛みの少ない優しい治療",
          modern: "最新機器による精密治療"
        },
        price: "保険適用",
        campaignPrice: "初診料無料"
      },
      {
        name: "審美歯科",
        description: {
          elegant: "自然で美しい仕上がり",
          natural: "歯本来の美しさを大切に",
          modern: "最新素材で理想の白さへ"
        },
        price: "¥30,000〜",
        campaignPrice: "¥15,000〜"
      },
      {
        name: "インプラント",
        description: {
          elegant: "高品質な素材で長期安定",
          natural: "身体に優しい治療法",
          modern: "3Dシミュレーション導入"
        },
        price: "¥300,000〜",
        campaignPrice: "相談無料"
      }
    ],
    features: {
      elegant: [
        "完全個室でプライバシー確保",
        "経験豊富な専門医が担当",
        "高級感のある院内環境"
      ],
      natural: [
        "キッズスペース完備",
        "バリアフリー対応",
        "リラックスできる待合室"
      ],
      modern: [
        "デジタルレントゲン完備",
        "CAD/CAMシステム導入",
        "予約管理アプリ対応"
      ]
    }
  },
  fitness: {
    label: "フィットネスジム・パーソナルトレーニング",
    hero: {
      subtitle: {
        elegant: "理想の身体を手に入れる",
        natural: "健康的で美しい身体づくり",
        modern: "科学的トレーニングで最速変化"
      },
      title: "Personal Training Gym",
      description: {
        elegant: "完全個室のプライベート空間で\nあなただけの特別なトレーニング",
        natural: "無理なく続けられる\n身体に優しいトレーニングプログラム",
        modern: "最新の科学的メソッドで\n効率的にボディメイク"
      }
    },
    services: [
      {
        name: "パーソナルトレーニング",
        description: {
          elegant: "マンツーマンの贅沢な指導",
          natural: "個人に合わせた優しい指導",
          modern: "AIが最適メニューを提案"
        },
        price: "¥8,000〜",
        campaignPrice: "¥4,000〜"
      },
      {
        name: "ダイエットプログラム",
        description: {
          elegant: "美しく痩せるボディメイク",
          natural: "健康的に理想体重へ",
          modern: "遺伝子検査で効率的に"
        },
        price: "¥50,000〜/月",
        campaignPrice: "¥25,000〜/月"
      },
      {
        name: "体幹トレーニング",
        description: {
          elegant: "しなやかで美しい身体へ",
          natural: "身体の軸を整える",
          modern: "最新機器で効果的に鍛える"
        },
        price: "¥6,000〜",
        campaignPrice: "¥3,000〜"
      }
    ],
    features: {
      elegant: [
        "完全個室のトレーニング空間",
        "一流トレーナーが専属指導",
        "高級アメニティ完備"
      ],
      natural: [
        "無理のないペースで継続",
        "栄養士による食事サポート",
        "アットホームな雰囲気"
      ],
      modern: [
        "最新トレーニング機器導入",
        "体組成計で数値管理",
        "アプリで24時間サポート"
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

export default function MedicalLPDemo() {
  const router = useRouter();
  const [shopName, setShopName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("clinic");
  const [theme, setTheme] = useState<ThemeType>("elegant");
  const [isControlOpen, setIsControlOpen] = useState(false);

  const business = businessContent[businessType];
  const displayName = shopName || "VITA";
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
                  {businessType === 'dental' ? '初診料無料' : '全メニュー50%OFF'}
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
                {displayName}は、患者様一人ひとりの健康と笑顔のために<br />
                最高の技術と心のこもったケアをご提供いたします
              </p>
              <div className={styles.conceptImage}>
                <div className={styles.imagePlaceholder}>
                  <span>院内の雰囲気写真</span>
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
                    私たちは、皆様の健康と幸せを第一に考えています。<br />
                    安心できる環境で、一人ひとりに合った<br />
                    最適なケアをご提供いたします。
                  </p>
                </div>
                <div className={styles.welcomeImage}>
                  <div className={styles.imagePlaceholder}>
                    <span>スタッフの笑顔写真</span>
                    <small>温かい雰囲気の写真推奨</small>
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
                {theme === "elegant" ? "Services" : theme === "natural" ? "診療内容" : "SERVICE MENU"}
              </h2>
              <div className={styles.serviceGrid}>
                {business.services.map((service, index) => (
                  <article key={index} className={styles.serviceCard}>
                    <div className={styles.serviceImage}>
                      <div className={styles.imagePlaceholder}>
                        <span>{service.name}のイメージ</span>
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
                        <span className={styles.priceCampaign}>{service.campaignPrice}</span>
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
              <h2 className={styles.experienceTitle}>Quality Care</h2>
              <p className={styles.experienceSubtitle}>安心と信頼の医療環境</p>
              <div className={styles.experienceGrid}>
                <div className={styles.experienceCard}>
                  <div className={styles.imagePlaceholder}>
                    <span>最新設備の写真</span>
                  </div>
                  <p>{businessType === 'dental' ? '最新の医療機器を完備' : '清潔で快適な施術空間'}</p>
                </div>
                <div className={styles.experienceCard}>
                  <div className={styles.imagePlaceholder}>
                    <span>カウンセリング風景</span>
                  </div>
                  <p>丁寧なカウンセリングで安心</p>
                </div>
              </div>
            </div>
          </section>
        );

      case "voice":
        return (
          <section key={sectionName} className={`${styles.voice} ${styles[theme]}`}>
            <div className={styles.voiceInner}>
              <h2 className={styles.voiceTitle}>患者様の声</h2>
              <div className={styles.voiceGrid}>
                <div className={styles.voiceCard}>
                  <div className={styles.voiceHeader}>
                    <span className={styles.voiceAuthor}>T.S様 40代</span>
                    <span className={styles.voiceService}>{business.services[0].name}</span>
                  </div>
                  <p className={styles.voiceText}>
                    {businessType === 'clinic' 
                      ? "長年の腰痛が改善しました。丁寧な説明で安心して通えています。"
                      : businessType === 'dental'
                      ? "痛みもなく、説明も丁寧で安心して治療を受けられました。"
                      : "自分に合ったペースで続けられて、確実に成果が出ています。"}
                  </p>
                </div>
                <div className={styles.voiceCard}>
                  <div className={styles.voiceHeader}>
                    <span className={styles.voiceAuthor}>Y.M様 30代</span>
                    <span className={styles.voiceService}>{business.services[1].name}</span>
                  </div>
                  <p className={styles.voiceText}>
                    {businessType === 'clinic'
                      ? "スタッフの方々が親切で、リラックスして施術を受けられます。"
                      : businessType === 'dental'
                      ? "子供も怖がらずに通えています。優しい先生で本当に良かったです。"
                      : "目標達成できました！トレーナーさんのサポートに感謝です。"}
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
                  <h3>{businessType === 'fitness' ? 'ボディメイク実績' : '治療実績'}</h3>
                  <div className={styles.resultImages}>
                    <div className={styles.resultBefore}>
                      <div className={styles.imagePlaceholder}>
                        <span>BEFORE</span>
                        <small>{businessType === 'fitness' ? 'トレーニング前' : '治療前の状態'}</small>
                      </div>
                    </div>
                    <div className={styles.resultArrow}>→</div>
                    <div className={styles.resultAfter}>
                      <div className={styles.imagePlaceholder}>
                        <span>AFTER</span>
                        <small>{businessType === 'fitness' ? '3ヶ月後の変化' : '治療後の改善'}</small>
                      </div>
                    </div>
                  </div>
                  <p className={styles.resultDescription}>
                    {businessType === 'fitness' 
                      ? "3ヶ月で理想のボディに変身"
                      : "確かな技術で症状を改善"}
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
                {businessType === 'clinic' && ["ご予約", "問診・検査", "施術", "アフターケア"].map((step, index) => (
                  <div key={index} className={styles.flowItem}>
                    <div className={styles.flowNumber}>{index + 1}</div>
                    <h3>{step}</h3>
                    <p>丁寧に対応いたします</p>
                  </div>
                ))}
                {businessType === 'dental' && ["ご予約", "初診・検査", "治療計画", "治療・メンテナンス"].map((step, index) => (
                  <div key={index} className={styles.flowItem}>
                    <div className={styles.flowNumber}>{index + 1}</div>
                    <h3>{step}</h3>
                    <p>安心の治療プロセス</p>
                  </div>
                ))}
                {businessType === 'fitness' && ["カウンセリング", "体験トレーニング", "プラン作成", "トレーニング開始"].map((step, index) => (
                  <div key={index} className={styles.flowItem}>
                    <div className={styles.flowNumber}>{index + 1}</div>
                    <h3>{step}</h3>
                    <p>あなたに合わせたサポート</p>
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
                        <th>診療時間</th>
                        <td>{businessType === 'fitness' ? '6:00〜23:00' : '9:00〜19:00'}</td>
                      </tr>
                      <tr>
                        <th>定休日</th>
                        <td>{businessType === 'dental' ? '日曜・祝日' : businessType === 'clinic' ? '水曜・日曜' : '年中無休'}</td>
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
                今なら{businessType === 'dental' ? '初診料' : '初回'}<span className={styles.ctaHighlight}>{businessType === 'dental' ? '無料' : '50%OFF'}</span>
              </h2>
              <p className={styles.ctaText}>
                {businessType === 'clinic' ? 'まずはお気軽にご相談ください' 
                  : businessType === 'dental' ? 'お口の健康チェックから始めましょう'
                  : '理想の身体への第一歩を踏み出しましょう'}
              </p>
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
                'あなたの施設でシミュレーション'
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
              <label>施設名</label>
              <input
                type="text"
                placeholder="あなたの施設名を入力"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className={styles.shopNameInput}
              />
            </div>

            <div className={styles.controlGroup}>
              <label>業種</label>
              <div className={styles.buttonGroup}>
                <button
                  className={businessType === "clinic" ? styles.active : ""}
                  onClick={() => setBusinessType("clinic")}
                >
                  整体院・整骨院
                </button>
                <button
                  className={businessType === "dental" ? styles.active : ""}
                  onClick={() => setBusinessType("dental")}
                >
                  歯科医院
                </button>
                <button
                  className={businessType === "fitness" ? styles.active : ""}
                  onClick={() => setBusinessType("fitness")}
                >
                  フィットネス・パーソナル
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