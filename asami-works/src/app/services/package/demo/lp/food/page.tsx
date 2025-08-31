"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../demo.lp.module.css";

// 型定義
type BusinessType = "cafe" | "izakaya" | "takeout";
type ThemeType = "elegant" | "natural" | "modern";

// 業種別コンテンツ設定
const businessContent = {
  cafe: {
    label: "カフェ・喫茶店",
    hero: {
      subtitle: {
        elegant: "優雅なひとときをあなたに",
        natural: "心安らぐ憩いの空間",
        modern: "都会のオアシスで特別な時間を"
      },
      title: "Café & Coffee",
      description: {
        elegant: "厳選された豆と洗練された空間で\n至福のコーヒータイムをお届けします",
        natural: "オーガニックコーヒーと手作りスイーツで\nほっと一息つける場所",
        modern: "最新のコーヒー文化と\nスタイリッシュな空間の融合"
      }
    },
    services: [
      {
        name: "スペシャルティコーヒー",
        description: {
          elegant: "世界各地の希少な豆を使用",
          natural: "有機栽培の優しい味わい",
          modern: "バリスタが淹れる究極の一杯"
        },
        price: "¥650〜",
        campaignPrice: "¥500〜"
      },
      {
        name: "季節のスイーツ",
        description: {
          elegant: "パティシエ特製の贅沢な逸品",
          natural: "素材の味を活かした手作り",
          modern: "インスタ映えする創作デザート"
        },
        price: "¥480〜",
        campaignPrice: "¥380〜"
      },
      {
        name: "ランチセット",
        description: {
          elegant: "シェフ厳選の本日のプレート",
          natural: "地産地消の健康ランチ",
          modern: "カフェ飯の新定番メニュー"
        },
        price: "¥1,200〜",
        campaignPrice: "¥980〜"
      }
    ],
    features: {
      elegant: [
        "落ち着いた上質な空間",
        "ソムリエ資格保有バリスタ",
        "会員限定の特別メニュー"
      ],
      natural: [
        "緑あふれる癒しの店内",
        "ペット同伴OK",
        "キッズスペース完備"
      ],
      modern: [
        "Wi-Fi・電源完備",
        "コワーキングスペース",
        "キャッシュレス決済対応"
      ]
    }
  },
  izakaya: {
    label: "居酒屋・バー",
    hero: {
      subtitle: {
        elegant: "大人の社交場で特別な夜を",
        natural: "温かいおもてなしと美味しい料理",
        modern: "新感覚の創作料理とお酒"
      },
      title: "Dining Bar",
      description: {
        elegant: "厳選された日本酒と\n匠の技が光る料理の数々",
        natural: "地元の新鮮食材を使った\n心温まる家庭的な料理",
        modern: "革新的な料理とカクテルで\n新しい食体験をご提供"
      }
    },
    services: [
      {
        name: "おまかせコース",
        description: {
          elegant: "季節の食材を贅沢に使用",
          natural: "旬の味覚を楽しむ",
          modern: "シェフの創作料理フルコース"
        },
        price: "¥5,000〜",
        campaignPrice: "¥3,500〜"
      },
      {
        name: "飲み放題プラン",
        description: {
          elegant: "プレミアム日本酒も含む",
          natural: "地酒・地ビール充実",
          modern: "クラフトカクテル込み"
        },
        price: "¥2,500〜",
        campaignPrice: "¥1,980〜"
      },
      {
        name: "宴会・貸切",
        description: {
          elegant: "完全個室で特別な時間",
          natural: "アットホームなパーティー",
          modern: "プロジェクター完備"
        },
        price: "¥4,000〜/人",
        campaignPrice: "¥3,000〜/人"
      }
    ],
    features: {
      elegant: [
        "完全個室のVIPルーム",
        "日本酒ソムリエ在籍",
        "会員制の隠れ家空間"
      ],
      natural: [
        "掘りごたつ式の座敷",
        "店主自慢の手料理",
        "常連さんとの交流"
      ],
      modern: [
        "カウンター席で楽しむライブ感",
        "タブレット注文システム",
        "SNS映えする空間演出"
      ]
    }
  },
  takeout: {
    label: "テイクアウト専門店",
    hero: {
      subtitle: {
        elegant: "プレミアムな味をご自宅で",
        natural: "手作りの温かさをお届け",
        modern: "スマートに楽しむ新グルメ"
      },
      title: "Takeout Deli",
      description: {
        elegant: "レストランクオリティの料理を\nテイクアウトでお楽しみください",
        natural: "愛情込めた手作り弁当で\n毎日の食事を豊かに",
        modern: "アプリで簡単注文\n出来立てをスピーディーにお渡し"
      }
    },
    services: [
      {
        name: "日替わり弁当",
        description: {
          elegant: "シェフ特製の豪華弁当",
          natural: "栄養バランス満点",
          modern: "ヘルシー志向の新メニュー"
        },
        price: "¥980〜",
        campaignPrice: "¥780〜"
      },
      {
        name: "パーティーセット",
        description: {
          elegant: "オードブルプレート",
          natural: "みんなで楽しむ大皿料理",
          modern: "インスタ映えするケータリング"
        },
        price: "¥3,000〜",
        campaignPrice: "¥2,500〜"
      },
      {
        name: "デザート・ドリンク",
        description: {
          elegant: "パティシエ特製スイーツ",
          natural: "季節のフルーツジュース",
          modern: "タピオカ・スムージー"
        },
        price: "¥380〜",
        campaignPrice: "¥300〜"
      }
    ],
    features: {
      elegant: [
        "ミシュラン経験シェフ監修",
        "高級食材を使用",
        "ギフトボックス対応"
      ],
      natural: [
        "無添加・無農薬食材",
        "アレルギー対応可能",
        "エコ容器使用"
      ],
      modern: [
        "アプリで事前注文",
        "非接触受け取りボックス",
        "デリバリー対応"
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

export default function FoodLPDemo() {
  const router = useRouter();
  const [shopName, setShopName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("cafe");
  const [theme, setTheme] = useState<ThemeType>("elegant");
  const [isControlOpen, setIsControlOpen] = useState(false);

  const business = businessContent[businessType];
  const displayName = shopName || "SAVORY";
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
                  {businessType === 'takeout' ? '注文する' : '予約する'}
                </button>
                <p className={styles.ctaNote}>
                  <span className={styles.badge}>オープン記念</span>
                  全メニュー20%OFF
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
                {displayName}は、お客様に最高の食体験を<br />
                心を込めたおもてなしでご提供いたします
              </p>
              <div className={styles.conceptImage}>
                <div className={styles.imagePlaceholder}>
                  <span>店内の雰囲気写真</span>
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
                    美味しい料理と心地よい空間で<br />
                    お客様の大切な時間を彩ります。<br />
                    ぜひ、ごゆっくりお過ごしください。
                  </p>
                </div>
                <div className={styles.welcomeImage}>
                  <div className={styles.imagePlaceholder}>
                    <span>料理の写真</span>
                    <small>美味しそうな料理写真推奨</small>
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
                {theme === "elegant" ? "Menu" : theme === "natural" ? "おすすめメニュー" : "MENU"}
              </h2>
              <div className={styles.serviceGrid}>
                {business.services.map((service, index) => (
                  <article key={index} className={styles.serviceCard}>
                    <div className={styles.serviceImage}>
                      <div className={styles.imagePlaceholder}>
                        <span>{service.name}の写真</span>
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
                        <span className={styles.priceCampaign}>今なら {service.campaignPrice}</span>
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
                    <span>{businessType === 'cafe' ? 'こだわりのコーヒー' : businessType === 'izakaya' ? 'こだわりの日本酒' : 'こだわりの食材'}</span>
                  </div>
                  <p>厳選された素材へのこだわり</p>
                </div>
                <div className={styles.experienceCard}>
                  <div className={styles.imagePlaceholder}>
                    <span>{businessType === 'takeout' ? '清潔な調理場' : 'くつろぎの空間'}</span>
                  </div>
                  <p>{businessType === 'takeout' ? '安心・安全な調理環境' : '心地よい時間をお約束'}</p>
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
                    <span className={styles.voiceAuthor}>K.M様 30代</span>
                    <span className={styles.voiceService}>{business.services[0].name}</span>
                  </div>
                  <p className={styles.voiceText}>
                    {businessType === 'cafe' 
                      ? "落ち着いた雰囲気で、コーヒーも本当に美味しいです。毎週通っています。"
                      : businessType === 'izakaya'
                      ? "料理もお酒も最高！スタッフさんの対応も素晴らしいです。"
                      : "いつも美味しくて、リピートしています。コスパも最高です！"}
                  </p>
                </div>
                <div className={styles.voiceCard}>
                  <div className={styles.voiceHeader}>
                    <span className={styles.voiceAuthor}>T.S様 40代</span>
                    <span className={styles.voiceService}>{business.services[1].name}</span>
                  </div>
                  <p className={styles.voiceText}>
                    {businessType === 'cafe'
                      ? "スイーツが絶品！友人とのお茶会にぴったりの場所です。"
                      : businessType === 'izakaya'
                      ? "会社の飲み会でいつも利用しています。みんな大満足です。"
                      : "パーティーセットは見た目も豪華で、みんなに喜ばれました。"}
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
              <h2 className={styles.resultsTitle}>GALLERY</h2>
              <div className={styles.resultsGrid}>
                <div className={styles.resultCard}>
                  <h3>人気メニュー</h3>
                  <div className={styles.resultImages}>
                    <div className={styles.resultBefore}>
                      <div className={styles.imagePlaceholder}>
                        <span>朝の一品</span>
                        <small>{businessType === 'cafe' ? 'モーニングセット' : businessType === 'izakaya' ? '前菜' : '朝食弁当'}</small>
                      </div>
                    </div>
                    <div className={styles.resultArrow}>→</div>
                    <div className={styles.resultAfter}>
                      <div className={styles.imagePlaceholder}>
                        <span>夜の一品</span>
                        <small>{businessType === 'cafe' ? 'ディナープレート' : businessType === 'izakaya' ? 'メイン料理' : '夕食弁当'}</small>
                      </div>
                    </div>
                  </div>
                  <p className={styles.resultDescription}>
                    時間帯に合わせた特別メニュー
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
                {businessType === 'takeout' 
                  ? ["メニュー選択", "注文・決済", "調理", "受け取り"].map((step, index) => (
                    <div key={index} className={styles.flowItem}>
                      <div className={styles.flowNumber}>{index + 1}</div>
                      <h3>{step}</h3>
                      <p>
                        {index === 0 && "お好みの商品を選択"}
                        {index === 1 && "簡単決済"}
                        {index === 2 && "出来立てを調理"}
                        {index === 3 && "スムーズにお渡し"}
                      </p>
                    </div>
                  ))
                  : ["ご予約", "ご来店", "お食事", "お会計"].map((step, index) => (
                    <div key={index} className={styles.flowItem}>
                      <div className={styles.flowNumber}>{index + 1}</div>
                      <h3>{step}</h3>
                      <p>
                        {index === 0 && "お電話・Webで"}
                        {index === 1 && "お席へご案内"}
                        {index === 2 && "ごゆっくりと"}
                        {index === 3 && "キャッシュレス対応"}
                      </p>
                    </div>
                  ))
                }
              </div>
            </div>
          </section>
        );

      case "price":
        return (
          <section key={sectionName} className={`${styles.price} ${styles[theme]}`}>
            <div className={styles.priceInner}>
              <h2 className={styles.priceTitle}>MENU & PRICE</h2>
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
                        <td>
                          {businessType === 'cafe' ? '8:00〜21:00' 
                            : businessType === 'izakaya' ? '17:00〜24:00'
                            : '11:00〜20:00'}
                        </td>
                      </tr>
                      <tr>
                        <th>定休日</th>
                        <td>{businessType === 'izakaya' ? '日曜日' : '不定休'}</td>
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
                今なら全品<span className={styles.ctaHighlight}>20%OFF</span>
              </h2>
              <p className={styles.ctaText}>
                {businessType === 'cafe' ? 'ゆったりとした時間をお過ごしください' 
                  : businessType === 'izakaya' ? '美味しい料理とお酒でお待ちしています'
                  : '出来立ての美味しさをお届けします'}
              </p>
              <div className={styles.ctaButtons}>
                <button className={styles.ctaButtonPrimary}>
                  {businessType === 'takeout' ? '注文アプリを開く' : '今すぐ予約'}
                </button>
                <button className={styles.ctaButtonSecondary}>
                  {businessType === 'takeout' ? 'メニューを見る' : 'お問い合わせ'}
                  <small>{businessType === 'takeout' ? 'PDF版メニュー' : 'LINEでも受付中'}</small>
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
                'あなたのお店でシミュレーション'
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
                placeholder="あなたの店舗名を入力"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className={styles.shopNameInput}
              />
            </div>

            <div className={styles.controlGroup}>
              <label>業種</label>
              <div className={styles.buttonGroup}>
                <button
                  className={businessType === "cafe" ? styles.active : ""}
                  onClick={() => setBusinessType("cafe")}
                >
                  カフェ・喫茶店
                </button>
                <button
                  className={businessType === "izakaya" ? styles.active : ""}
                  onClick={() => setBusinessType("izakaya")}
                >
                  居酒屋・バー
                </button>
                <button
                  className={businessType === "takeout" ? styles.active : ""}
                  onClick={() => setBusinessType("takeout")}
                >
                  テイクアウト専門
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