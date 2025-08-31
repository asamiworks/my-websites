"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../demo.lp.module.css";

// 型定義
type BusinessType = "cram" | "music" | "programming";
type ThemeType = "elegant" | "natural" | "modern";

// 業種別コンテンツ設定
const businessContent = {
  cram: {
    label: "学習塾・個別指導塾",
    hero: {
      subtitle: {
        elegant: "確かな学力と自信を育む",
        natural: "のびのび学べる環境で成長",
        modern: "最新の教育メソッドで成績向上"
      },
      title: "Study Academy",
      description: {
        elegant: "一人ひとりに寄り添う丁寧な指導で\n志望校合格へと導きます",
        natural: "楽しく学びながら\n自ら考える力を育てます",
        modern: "AIとデータ分析を活用した\n効率的な学習プログラム"
      }
    },
    services: [
      {
        name: "個別指導コース",
        description: {
          elegant: "マンツーマンでの丁寧な指導",
          natural: "お子様のペースに合わせた学習",
          modern: "AIが最適な学習プランを提案"
        },
        price: "¥20,000〜/月",
        campaignPrice: "¥10,000〜/月"
      },
      {
        name: "高校受験対策",
        description: {
          elegant: "合格実績豊富な講師陣",
          natural: "無理なく実力を伸ばす指導",
          modern: "データ分析で弱点を克服"
        },
        price: "¥30,000〜/月",
        campaignPrice: "¥15,000〜/月"
      },
      {
        name: "定期テスト対策",
        description: {
          elegant: "内申点アップを確実に",
          natural: "基礎から応用まで丁寧に",
          modern: "効率的な学習で成績アップ"
        },
        price: "¥15,000〜/月",
        campaignPrice: "¥7,500〜/月"
      }
    ],
    features: {
      elegant: [
        "経験豊富なプロ講師陣",
        "静かで集中できる学習環境",
        "きめ細やかな進路指導"
      ],
      natural: [
        "アットホームな雰囲気",
        "褒めて伸ばす指導方針",
        "保護者との密な連携"
      ],
      modern: [
        "タブレット学習導入",
        "オンライン授業対応",
        "学習管理アプリ完備"
      ]
    }
  },
  music: {
    label: "音楽教室・ピアノ教室",
    hero: {
      subtitle: {
        elegant: "音楽で豊かな感性を育む",
        natural: "楽しみながら音楽を学ぶ",
        modern: "最新メソッドで上達を加速"
      },
      title: "Music School",
      description: {
        elegant: "クラシックからポップスまで\n幅広いジャンルをマスター",
        natural: "音楽の楽しさを大切に\n一人ひとりの個性を伸ばします",
        modern: "デジタル技術を活用した\n革新的なレッスンスタイル"
      }
    },
    services: [
      {
        name: "ピアノレッスン",
        description: {
          elegant: "基礎から本格的な演奏まで",
          natural: "楽しく弾けるようになる",
          modern: "電子ピアノで効率的に上達"
        },
        price: "¥8,000〜/月",
        campaignPrice: "¥4,000〜/月"
      },
      {
        name: "ボーカルレッスン",
        description: {
          elegant: "正しい発声法を身につける",
          natural: "好きな歌を気持ちよく歌う",
          modern: "録音機材で成長を実感"
        },
        price: "¥10,000〜/月",
        campaignPrice: "¥5,000〜/月"
      },
      {
        name: "音楽理論・作曲",
        description: {
          elegant: "音楽の深い理解を目指す",
          natural: "創造力を自由に発揮",
          modern: "DTMで本格的な作曲"
        },
        price: "¥12,000〜/月",
        campaignPrice: "¥6,000〜/月"
      }
    ],
    features: {
      elegant: [
        "音大卒の優秀な講師陣",
        "グランドピアノ完備",
        "年2回の発表会開催"
      ],
      natural: [
        "リラックスできる空間",
        "生徒のペースを大切に",
        "アンサンブルの機会も"
      ],
      modern: [
        "防音室完備",
        "録音・配信設備",
        "オンラインレッスン対応"
      ]
    }
  },
  programming: {
    label: "プログラミングスクール",
    hero: {
      subtitle: {
        elegant: "論理的思考力を育てる",
        natural: "楽しく学ぶプログラミング",
        modern: "最先端技術をマスター"
      },
      title: "Code Academy",
      description: {
        elegant: "基礎から応用まで\n体系的なカリキュラムで学習",
        natural: "ゲーム作りを通じて\n楽しくプログラミングを習得",
        modern: "実践的なプロジェクトで\n即戦力エンジニアを育成"
      }
    },
    services: [
      {
        name: "キッズプログラミング",
        description: {
          elegant: "論理的思考の基礎を築く",
          natural: "遊びながら学ぶコーディング",
          modern: "Scratchで創造力を発揮"
        },
        price: "¥12,000〜/月",
        campaignPrice: "¥6,000〜/月"
      },
      {
        name: "Webアプリ開発",
        description: {
          elegant: "本格的な開発スキルを習得",
          natural: "自分のアイデアを形に",
          modern: "最新フレームワークを学習"
        },
        price: "¥20,000〜/月",
        campaignPrice: "¥10,000〜/月"
      },
      {
        name: "AI・機械学習",
        description: {
          elegant: "最先端技術を体系的に学ぶ",
          natural: "実例で理解を深める",
          modern: "実践的なAI開発"
        },
        price: "¥30,000〜/月",
        campaignPrice: "¥15,000〜/月"
      }
    ],
    features: {
      elegant: [
        "現役エンジニアが指導",
        "少人数制の丁寧な指導",
        "就職・転職サポート"
      ],
      natural: [
        "初心者に優しい環境",
        "仲間と学べる雰囲気",
        "質問しやすい環境"
      ],
      modern: [
        "最新の開発環境",
        "クラウド環境完備",
        "ハッカソン定期開催"
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

export default function EducationLPDemo() {
  const router = useRouter();
  const [shopName, setShopName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("cram");
  const [theme, setTheme] = useState<ThemeType>("elegant");
  const [isControlOpen, setIsControlOpen] = useState(false);

  const business = businessContent[businessType];
  const displayName = shopName || "BRIGHT";
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
                  無料体験を申し込む
                </button>
                <p className={styles.ctaNote}>
                  <span className={styles.badge}>期間限定</span>
                  初月授業料50%OFF
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
                {displayName}は、生徒一人ひとりの可能性を信じ<br />
                最高の教育環境と指導で夢の実現をサポートします
              </p>
              <div className={styles.conceptImage}>
                <div className={styles.imagePlaceholder}>
                  <span>教室の雰囲気写真</span>
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
                    学ぶ楽しさ、できる喜びを大切にしています。<br />
                    一人ひとりの個性に合わせた指導で<br />
                    確実な成長をお約束します。
                  </p>
                </div>
                <div className={styles.welcomeImage}>
                  <div className={styles.imagePlaceholder}>
                    <span>授業風景の写真</span>
                    <small>楽しく学ぶ様子を推奨</small>
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
                {theme === "elegant" ? "Courses" : theme === "natural" ? "コース紹介" : "COURSE MENU"}
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
                        <span className={styles.priceCampaign}>初月 {service.campaignPrice}</span>
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
              <h2 className={styles.experienceTitle}>Learning Environment</h2>
              <p className={styles.experienceSubtitle}>最高の学習環境をご用意</p>
              <div className={styles.experienceGrid}>
                <div className={styles.experienceCard}>
                  <div className={styles.imagePlaceholder}>
                    <span>{businessType === 'music' ? '防音室完備' : '快適な学習スペース'}</span>
                  </div>
                  <p>{businessType === 'music' ? '集中して練習できる環境' : '集中して学習できる環境'}</p>
                </div>
                <div className={styles.experienceCard}>
                  <div className={styles.imagePlaceholder}>
                    <span>{businessType === 'programming' ? '最新の機材' : '充実した教材'}</span>
                  </div>
                  <p>学習効果を最大化する設備</p>
                </div>
              </div>
            </div>
          </section>
        );

      case "voice":
        return (
          <section key={sectionName} className={`${styles.voice} ${styles[theme]}`}>
            <div className={styles.voiceInner}>
              <h2 className={styles.voiceTitle}>生徒・保護者の声</h2>
              <div className={styles.voiceGrid}>
                <div className={styles.voiceCard}>
                  <div className={styles.voiceHeader}>
                    <span className={styles.voiceAuthor}>
                      {businessType === 'cram' ? '中2生の保護者' : businessType === 'music' ? '小学生の保護者' : '高校生'}
                    </span>
                    <span className={styles.voiceService}>{business.services[0].name}</span>
                  </div>
                  <p className={styles.voiceText}>
                    {businessType === 'cram' 
                      ? "成績が大幅に上がりました。先生方の熱心な指導に感謝しています。"
                      : businessType === 'music'
                      ? "楽しく通っています。発表会で成長を実感できて嬉しいです。"
                      : "分かりやすい説明で、プログラミングが楽しくなりました。"}
                  </p>
                </div>
                <div className={styles.voiceCard}>
                  <div className={styles.voiceHeader}>
                    <span className={styles.voiceAuthor}>
                      {businessType === 'cram' ? '高3受験生' : businessType === 'music' ? '社会人' : '大学生'}
                    </span>
                    <span className={styles.voiceService}>{business.services[1].name}</span>
                  </div>
                  <p className={styles.voiceText}>
                    {businessType === 'cram'
                      ? "志望校に合格できました！最後まで支えてくださり本当に感謝です。"
                      : businessType === 'music'
                      ? "仕事帰りに通えて、良いリフレッシュになっています。"
                      : "実践的な内容で、就職活動でもアピールできました。"}
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
              <h2 className={styles.resultsTitle}>ACHIEVEMENTS</h2>
              <div className={styles.resultsGrid}>
                <div className={styles.resultCard}>
                  <h3>{businessType === 'cram' ? '合格実績' : businessType === 'music' ? '発表会の様子' : '生徒作品'}</h3>
                  <div className={styles.resultImages}>
                    <div className={styles.resultBefore}>
                      <div className={styles.imagePlaceholder}>
                        <span>{businessType === 'cram' ? '入塾時' : 'BEFORE'}</span>
                        <small>{businessType === 'cram' ? '偏差値45' : '初心者レベル'}</small>
                      </div>
                    </div>
                    <div className={styles.resultArrow}>→</div>
                    <div className={styles.resultAfter}>
                      <div className={styles.imagePlaceholder}>
                        <span>{businessType === 'cram' ? '合格時' : 'AFTER'}</span>
                        <small>{businessType === 'cram' ? '偏差値65' : '上級レベル'}</small>
                      </div>
                    </div>
                  </div>
                  <p className={styles.resultDescription}>
                    {businessType === 'cram' 
                      ? "着実な成績向上を実現"
                      : businessType === 'music'
                      ? "確実にスキルアップ"
                      : "実践的なスキルを習得"}
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
              <h2 className={styles.flowTitle}>入会までの流れ</h2>
              <div className={styles.flowList}>
                {["お問い合わせ", "無料体験", "カウンセリング", "入会手続き"].map((step, index) => (
                  <div key={index} className={styles.flowItem}>
                    <div className={styles.flowNumber}>{index + 1}</div>
                    <h3>{step}</h3>
                    <p>
                      {index === 0 && "まずはお気軽に"}
                      {index === 1 && "実際に体験"}
                      {index === 2 && "目標を設定"}
                      {index === 3 && "学習スタート"}
                    </p>
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
                        <th>開校時間</th>
                        <td>{businessType === 'cram' ? '14:00〜22:00' : '10:00〜21:00'}</td>
                      </tr>
                      <tr>
                        <th>定休日</th>
                        <td>{businessType === 'cram' ? '日曜日' : '月曜日'}</td>
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
                今なら初月<span className={styles.ctaHighlight}>50%OFF</span>
              </h2>
              <p className={styles.ctaText}>
                {businessType === 'cram' ? 'まずは無料体験授業から' 
                  : businessType === 'music' ? '無料体験レッスン実施中'
                  : 'プログラミングの世界へ踏み出そう'}
              </p>
              <div className={styles.ctaButtons}>
                <button className={styles.ctaButtonPrimary}>
                  無料体験を申し込む
                </button>
                <button className={styles.ctaButtonSecondary}>
                  資料請求する
                  <small>詳しいパンフレット送付</small>
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
                'あなたの教室でシミュレーション'
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
              <label>教室名</label>
              <input
                type="text"
                placeholder="あなたの教室名を入力"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className={styles.shopNameInput}
              />
            </div>

            <div className={styles.controlGroup}>
              <label>業種</label>
              <div className={styles.buttonGroup}>
                <button
                  className={businessType === "cram" ? styles.active : ""}
                  onClick={() => setBusinessType("cram")}
                >
                  学習塾・個別指導
                </button>
                <button
                  className={businessType === "music" ? styles.active : ""}
                  onClick={() => setBusinessType("music")}
                >
                  音楽教室・ピアノ
                </button>
                <button
                  className={businessType === "programming" ? styles.active : ""}
                  onClick={() => setBusinessType("programming")}
                >
                  プログラミング
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