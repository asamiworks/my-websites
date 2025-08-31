"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../demo.corporate.module.css";

// 型定義
type BusinessType = "transport" | "warehouse" | "moving";
type ThemeType = "professional" | "innovative" | "friendly";
type PageType = "home" | "about" | "service" | "contact";

// 業種別コンテンツ設定
const businessContent = {
  transport: {
    label: "運送会社・配送業",
    defaultName: "つくば運輸",
    tagline: {
      professional: "確実な輸送で、信頼をお届け",
      innovative: "最新技術で、物流を革新",
      friendly: "お客様の荷物を、心を込めて運びます"
    },
    home: {
      hero: {
        title: {
          professional: "安全・確実な輸送で\nビジネスの成功を支えます",
          innovative: "IoTとAIを活用した\n次世代物流サービス",
          friendly: "大切な荷物を\n笑顔でお届けします"
        },
        description: "全国ネットワークと豊富な車両で、\nあらゆる輸送ニーズにお応えします"
      },
      features: [
        { title: "全国ネットワーク", desc: "日本全国をカバー" },
        { title: "豊富な車両", desc: "用途に応じた多様な車両" },
        { title: "24時間対応", desc: "緊急配送にも対応" }
      ],
      stats: [
        { number: "45年", label: "創業実績", desc: "地域に根ざした信頼" },
        { number: "99.9%", label: "定時配送率", desc: "確実な配送サービス" },
        { number: "80台", label: "保有車両数", desc: "多様なニーズに対応" }
      ],
      services: [
        { name: "定期便サービス", time: "毎日運行", spec: "固定ルート・定時配送" },
        { name: "チャーター便", time: "24時間受付", spec: "専用車両での輸送" },
        { name: "温度管理輸送", time: "冷蔵・冷凍対応", spec: "-25℃〜常温まで" }
      ]
    },
    about: {
      mission: "私たちは、安全・確実・迅速な輸送サービスを通じて、お客様のビジネスと社会の発展に貢献します。",
      values: [
        { title: "安全", desc: "安全第一の輸送サービス" },
        { title: "信頼", desc: "お客様との信頼関係を大切に" },
        { title: "環境", desc: "環境に配慮した物流の実現" }
      ],
      history: [
        { year: "1980年", event: "つくば運輸として創業" },
        { year: "1995年", event: "関東全域への配送網確立" },
        { year: "2010年", event: "環境対応車両導入開始" },
        { year: "2023年", event: "AI配送管理システム導入" }
      ],
      message: {
        title: "代表メッセージ",
        content: "創業以来、地域の皆様と共に歩んでまいりました。これからも安全・確実な輸送を第一に、お客様の大切な荷物を心を込めてお届けします。最新技術も積極的に導入し、より良いサービスの提供に努めてまいります。",
        name: "代表取締役 山田太郎"
      },
      info: {
        established: "1980年4月",
        capital: "資本金 5,000万円",
        employees: "従業員数 150名",
        fleet: "保有車両 80台（大型・中型・小型）",
        license: "一般貨物自動車運送事業 関自貨第123号"
      }
    },
    service: {
      departments: [
        { 
          name: "一般貨物輸送", 
          desc: "企業間物流から個人宅配送まで幅広く対応",
          details: "パレット輸送から小口配送まで、お客様のニーズに合わせた輸送サービスを提供します。"
        },
        { 
          name: "定期便サービス", 
          desc: "定期ルート便による安定的な輸送",
          details: "決まった時間に、決まったルートで。計画的な物流を実現します。"
        },
        { 
          name: "チャーター便", 
          desc: "お客様専用の貸切輸送サービス",
          details: "大量輸送や特殊な荷物にも、専用車両で対応いたします。"
        },
        { 
          name: "温度管理輸送", 
          desc: "冷蔵・冷凍品の品質を保つ輸送",
          details: "食品から医薬品まで、温度管理が必要な商品を安全に輸送します。"
        }
      ],
      fleet: {
        title: "保有車両",
        items: [
          { name: "大型トラック", desc: "10t車", count: "20台" },
          { name: "中型トラック", desc: "4t車", count: "30台" },
          { name: "小型トラック", desc: "2t車", count: "30台" }
        ]
      }
    }
  },
  warehouse: {
    label: "倉庫業・物流センター",
    defaultName: "つくば物流センター",
    tagline: {
      professional: "最適な保管と流通で、価値を創造",
      innovative: "スマート倉庫で、物流を最適化",
      friendly: "お客様の大切な商品を、丁寧に管理"
    },
    home: {
      hero: {
        title: {
          professional: "高品質な倉庫サービスで\n物流の効率化を実現",
          innovative: "AI・ロボットを活用した\n次世代型物流センター",
          friendly: "お客様の商品を\n大切にお預かりします"
        },
        description: "最新設備と徹底した品質管理で、\n安心・安全な保管サービスを提供します"
      },
      features: [
        { title: "最新設備", desc: "自動化された倉庫システム" },
        { title: "在庫管理", desc: "リアルタイム在庫管理" },
        { title: "流通加工", desc: "検品・梱包・出荷まで対応" }
      ],
      stats: [
        { number: "30,000㎡", label: "延床面積", desc: "大規模倉庫施設" },
        { number: "50,000", label: "パレット収容", desc: "大量保管可能" },
        { number: "99.99%", label: "在庫精度", desc: "正確な在庫管理" }
      ],
      services: [
        { name: "常温倉庫", time: "24時間入出庫", spec: "15,000㎡" },
        { name: "定温倉庫", time: "温度管理", spec: "15℃〜25℃" },
        { name: "冷蔵・冷凍倉庫", time: "品質保持", spec: "-25℃〜10℃" }
      ]
    },
    about: {
      mission: "私たちは、効率的な保管・流通サービスを通じて、お客様のサプライチェーンの最適化に貢献します。",
      values: [
        { title: "品質", desc: "徹底した品質管理体制" },
        { title: "効率", desc: "最新技術による効率化" },
        { title: "柔軟", desc: "お客様のニーズに柔軟対応" }
      ],
      history: [
        { year: "1995年", event: "物流センター開設" },
        { year: "2005年", event: "自動倉庫システム導入" },
        { year: "2015年", event: "第2センター開設" },
        { year: "2022年", event: "ロボット倉庫稼働開始" }
      ],
      message: {
        title: "センター長メッセージ",
        content: "最新の物流技術と経験豊富なスタッフで、お客様の物流課題を解決します。在庫の見える化から配送まで、トータルでサポートいたします。これからも進化を続け、より良いサービスを提供してまいります。",
        name: "センター長 佐藤次郎"
      },
      info: {
        established: "1995年7月",
        capital: "資本金 8,000万円",
        employees: "従業員数 200名",
        capacity: "延床面積 30,000㎡、収容能力 50,000パレット",
        license: "倉庫業登録 関東運輸局第456号"
      }
    },
    service: {
      departments: [
        { 
          name: "保管サービス", 
          desc: "常温・定温・冷蔵・冷凍倉庫完備",
          details: "商品特性に応じた最適な保管環境を提供。24時間365日の入出庫にも対応します。"
        },
        { 
          name: "在庫管理", 
          desc: "WMSによる正確な在庫管理",
          details: "リアルタイムで在庫状況を把握。Web上でいつでも在庫確認が可能です。"
        },
        { 
          name: "流通加工", 
          desc: "ピッキング、梱包、ラベリング",
          details: "商品の検品から出荷準備まで、付加価値サービスを提供します。"
        },
        { 
          name: "配送サービス", 
          desc: "倉庫から全国への配送手配",
          details: "提携運送会社との連携により、最適な配送ルートを提案します。"
        }
      ],
      fleet: {
        title: "設備・機能",
        items: [
          { name: "自動倉庫", desc: "最新自動化システム", count: "2基" },
          { name: "フォークリフト", desc: "電動式", count: "50台" },
          { name: "トラックバース", desc: "同時接車", count: "20台分" }
        ]
      }
    }
  },
  moving: {
    label: "引越し・物流サービス",
    defaultName: "つくば引越センター",
    tagline: {
      professional: "プロフェッショナルな引越しサービス",
      innovative: "新しい引越しのカタチを提案",
      friendly: "新生活を笑顔でスタート"
    },
    home: {
      hero: {
        title: {
          professional: "確かな技術と経験で\n安心の引越しをサポート",
          innovative: "デジタル技術で\nスマートな引越しを実現",
          friendly: "お客様の新しい門出を\n心を込めてお手伝い"
        },
        description: "個人の引越しから企業移転まで、\n幅広いニーズに対応いたします"
      },
      features: [
        { title: "丁寧な作業", desc: "プロの技術で安心" },
        { title: "充実サービス", desc: "梱包から設置まで" },
        { title: "適正価格", desc: "明確な料金体系" }
      ],
      stats: [
        { number: "25年", label: "営業実績", desc: "地域密着のサービス" },
        { number: "5,000件", label: "年間引越実績", desc: "豊富な経験" },
        { number: "98%", label: "顧客満足度", desc: "丁寧な対応" }
      ],
      services: [
        { name: "単身引越し", time: "最短即日", spec: "15,000円〜" },
        { name: "家族引越し", time: "事前見積もり", spec: "50,000円〜" },
        { name: "オフィス移転", time: "休日・夜間対応", spec: "要見積もり" }
      ]
    },
    about: {
      mission: "私たちは、お客様の大切な思い出と共に、新しい生活のスタートを全力でサポートします。",
      values: [
        { title: "丁寧", desc: "一つ一つの荷物を大切に" },
        { title: "迅速", desc: "スピーディーな作業" },
        { title: "安心", desc: "万全の保証体制" }
      ],
      history: [
        { year: "2000年", event: "引越しサービス開始" },
        { year: "2008年", event: "法人向けサービス拡充" },
        { year: "2015年", event: "オンライン見積もり開始" },
        { year: "2023年", event: "AI見積もりシステム導入" }
      ],
      message: {
        title: "代表メッセージ",
        content: "引越しは人生の大切な節目です。お客様の新しいスタートを、私たちが全力でサポートします。荷物だけでなく、思い出も大切に運ぶ。それが私たちの使命です。",
        name: "代表 鈴木三郎"
      },
      info: {
        established: "2000年10月",
        capital: "資本金 3,000万円",
        employees: "従業員数 80名",
        service: "年間引越件数 5,000件以上",
        license: "一般貨物自動車運送事業 関自貨第789号"
      }
    },
    service: {
      departments: [
        { 
          name: "個人引越し", 
          desc: "単身からファミリーまで対応",
          details: "お客様のライフスタイルに合わせた、最適な引越しプランをご提案します。"
        },
        { 
          name: "法人引越し", 
          desc: "オフィス移転、店舗移転",
          details: "業務への影響を最小限に。計画的な移転をサポートします。"
        },
        { 
          name: "梱包サービス", 
          desc: "プロによる丁寧な梱包作業",
          details: "大切な荷物を、専用資材で安全に梱包。開梱・設置まで対応します。"
        },
        { 
          name: "トランクルーム", 
          desc: "一時保管サービスも提供",
          details: "リフォーム中や建て替え時の一時保管にも対応いたします。"
        }
      ],
      fleet: {
        title: "サービス料金目安",
        items: [
          { name: "単身パック", desc: "1R〜1K", count: "15,000円〜" },
          { name: "2人家族", desc: "2DK〜2LDK", count: "50,000円〜" },
          { name: "4人家族", desc: "3LDK〜", count: "80,000円〜" }
        ]
      }
    }
  }
};

export default function LogisticsCorporateDemo() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("transport");
  const [theme, setTheme] = useState<ThemeType>("professional");
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [isControlOpen, setIsControlOpen] = useState(false);

  const business = businessContent[businessType];
  const displayName = companyName || business.defaultName;

  // フォームへ遷移
  // 見積もりフォームへ遷移
const handleOrder = () => {
  const params = new URLSearchParams({
    type: 'package',
    plan: 'hp',
    theme: theme,
    company: displayName
  });
  router.push(`/estimate?${params.toString()}`);
};

  // ページコンテンツのレンダリング
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <div className={`${styles.page} ${styles.homePage}`}>
            {/* ヒーローセクション */}
            <section className={`${styles.hero} ${styles[theme]}`}>
              <div className={styles.heroOverlay}></div>
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                  {business.home.hero.title[theme]}
                </h1>
                <p className={styles.heroDescription}>
                  {business.home.hero.description}
                </p>
                <div className={styles.heroCta}>
                  <button className={styles.ctaButton}>
                    お見積もりはこちら
                  </button>
                </div>
              </div>
            </section>

            {/* 特徴セクション */}
            <section className={`${styles.features} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>私たちの強み</h2>
                <div className={styles.featureGrid}>
                  {business.home.features.map((feature, index) => (
                    <div key={index} className={styles.featureCard}>
                      <h3>{feature.title}</h3>
                      <p>{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 実績セクション */}
            <section className={`${styles.stats} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>実績・データ</h2>
                <div className={styles.statsGrid}>
                  {business.home.stats.map((stat, index) => (
                    <div key={index} className={styles.statCard}>
                      <div className={styles.statNumber}>{stat.number}</div>
                      <div className={styles.statLabel}>{stat.label}</div>
                      <p className={styles.statDesc}>{stat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* サービス紹介 */}
            <section className={`${styles.specialties} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>
                  {businessType === 'transport' ? '主要サービス' : businessType === 'warehouse' ? '倉庫タイプ' : 'サービスプラン'}
                </h2>
                <div className={styles.specialtyGrid}>
                  {business.home.services.map((service, index) => (
                    <div key={index} className={styles.specialtyCard}>
                      <h3>{service.name}</h3>
                      <div className={styles.specialtyInfo}>
                        <p className={styles.specialtyTime}>{service.time}</p>
                        <p className={styles.specialtyDoctor}>{service.spec}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );

      case "about":
        return (
          <div className={`${styles.page} ${styles.aboutPage}`}>
            <section className={`${styles.pageHeader} ${styles[theme]}`}>
              <div className={styles.container}>
                <h1>会社紹介</h1>
                <p>私たちの理念と取り組み</p>
              </div>
            </section>

            {/* ミッション */}
            <section className={`${styles.mission} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>企業理念</h2>
                <p className={styles.missionText}>{business.about.mission}</p>
              </div>
            </section>

            {/* 価値観 */}
            <section className={`${styles.values} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>私たちの価値観</h2>
                <div className={styles.valueGrid}>
                  {business.about.values.map((value, index) => (
                    <div key={index} className={styles.valueCard}>
                      <h3>{value.title}</h3>
                      <p>{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* メッセージ */}
            <section className={`${styles.message} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>{business.about.message.title}</h2>
                <div className={styles.messageContent}>
                  <div className={styles.messageImage}>
                    <div className={styles.imagePlaceholder}>
                      <span>代表者写真</span>
                    </div>
                  </div>
                  <div className={styles.messageText}>
                    <p>{business.about.message.content}</p>
                    <p className={styles.messageName}>{business.about.message.name}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 沿革 */}
            <section className={`${styles.history} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>沿革</h2>
                <div className={styles.historyTimeline}>
                  {business.about.history.map((item, index) => (
                    <div key={index} className={styles.historyItem}>
                      <div className={styles.historyYear}>{item.year}</div>
                      <div className={styles.historyEvent}>{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 基本情報 */}
            <section className={`${styles.info} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>会社概要</h2>
                <table className={styles.infoTable}>
                  <tbody>
                    <tr>
                      <th>会社名</th>
                      <td>{businessType === 'transport' || businessType === 'warehouse' ? '株式会社' : ''}{displayName}</td>
                    </tr>
                    <tr>
                      <th>設立</th>
                      <td>{business.about.info.established}</td>
                    </tr>
                    <tr>
                      <th>資本金</th>
                      <td>{business.about.info.capital}</td>
                    </tr>
                    <tr>
                      <th>従業員数</th>
                      <td>{business.about.info.employees}</td>
                    </tr>
                    <tr>
                      <th>{businessType === 'transport' ? '保有車両' : businessType === 'warehouse' ? '施設規模' : 'サービス実績'}</th>
                      <td>
                        {businessType === 'transport' && 'fleet' in business.about.info && business.about.info.fleet}
                        {businessType === 'warehouse' && 'capacity' in business.about.info && business.about.info.capacity}
                        {businessType === 'moving' && 'service' in business.about.info && business.about.info.service}
                      </td>
                    </tr>
                    <tr>
                      <th>許可番号</th>
                      <td>{business.about.info.license}</td>
                    </tr>
                    <tr>
                      <th>所在地</th>
                      <td>〒305-0001 茨城県つくば市天王台1-1-1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        );

      case "service":
        return (
          <div className={`${styles.page} ${styles.servicePage}`}>
            <section className={`${styles.pageHeader} ${styles[theme]}`}>
              <div className={styles.container}>
                <h1>サービス紹介</h1>
                <p>提供するサービス一覧</p>
              </div>
            </section>

            {/* サービス一覧 */}
            <section className={`${styles.services} ${styles[theme]}`}>
              <div className={styles.container}>
                <div className={styles.serviceGrid}>
                  {business.service.departments.map((dept, index) => (
                    <div key={index} className={styles.serviceCard}>
                      <h3>{dept.name}</h3>
                      <p className={styles.serviceDesc}>{dept.desc}</p>
                      <p className={styles.serviceDetails}>{dept.details}</p>
                      <button className={styles.serviceButton}>詳しく見る</button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 車両・設備 */}
            <section className={`${styles.pricing} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>{business.service.fleet.title}</h2>
                <div className={styles.pricingGrid}>
                  {business.service.fleet.items.map((item, index) => (
                    <div key={index} className={styles.pricingCard}>
                      <h3>{item.name}</h3>
                      <div className={styles.pricingPrice}>{item.count}</div>
                      <div className={styles.pricingTime}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 施設・設備 */}
            <section className={`${styles.facilities} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>
                  {businessType === 'transport' ? '保有車両' : businessType === 'warehouse' ? '設備・施設' : 'サービス体制'}
                </h2>
                <div className={styles.facilityGrid}>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>{businessType === 'transport' ? '大型トラック' : businessType === 'warehouse' ? '自動倉庫システム' : '専用車両'}</span>
                    </div>
                    <p>{businessType === 'transport' ? '長距離輸送に対応' : businessType === 'warehouse' ? '効率的な入出庫管理' : '家財を安全に運搬'}</p>
                  </div>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>{businessType === 'transport' ? '温度管理車' : businessType === 'warehouse' ? '温度管理倉庫' : '梱包資材'}</span>
                    </div>
                    <p>{businessType === 'transport' ? '品質を保つ輸送' : businessType === 'warehouse' ? '商品に最適な環境' : 'プロ仕様の梱包材'}</p>
                  </div>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>{businessType === 'transport' ? 'GPS管理システム' : businessType === 'warehouse' ? 'WMSシステム' : '養生資材'}</span>
                    </div>
                    <p>{businessType === 'transport' ? 'リアルタイム配送管理' : businessType === 'warehouse' ? '在庫の見える化' : '建物を傷つけない作業'}</p>
                  </div>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>{businessType === 'transport' ? '配送センター' : businessType === 'warehouse' ? 'トラックバース' : 'トランクルーム'}</span>
                    </div>
                    <p>{businessType === 'transport' ? '効率的な配送拠点' : businessType === 'warehouse' ? 'スムーズな入出庫' : '一時保管サービス'}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case "contact":
        return (
          <div className={`${styles.page} ${styles.contactPage}`}>
            <section className={`${styles.pageHeader} ${styles[theme]}`}>
              <div className={styles.container}>
                <h1>お問い合わせ</h1>
                <p>お気軽にご相談ください</p>
              </div>
            </section>

            {/* お問い合わせ情報 */}
            <section className={`${styles.contactInfo} ${styles[theme]}`}>
              <div className={styles.container}>
                <div className={styles.contactGrid}>
                  <div className={styles.contactCard}>
                    <h3>お電話でのお問い合わせ</h3>
                    <p className={styles.contactTel}>029-123-4567</p>
                    <p>受付時間: {businessType === 'transport' ? '24時間対応' : '平日 9:00〜18:00'}</p>
                  </div>
                  <div className={styles.contactCard}>
                    <h3>メールでのお問い合わせ</h3>
                    <p className={styles.contactEmail}>info@example.com</p>
                    <p>24時間受付（返信は営業時間内）</p>
                  </div>
                  <div className={styles.contactCard}>
                    <h3>アクセス</h3>
                    <p>〒305-0001</p>
                    <p>茨城県つくば市天王台1-1-1</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 地図 */}
            <section className={`${styles.map} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>アクセスマップ</h2>
                <div className={styles.mapContainer}>
                  <div className={styles.imagePlaceholder} style={{ height: '400px' }}>
                    <span>Google マップ</span>
                    <small>地図を埋め込みます</small>
                  </div>
                </div>
                <div className={styles.accessInfo}>
                  <h3>交通アクセス</h3>
                  <ul>
                    <li>{businessType === 'warehouse' ? '常磐自動車道 つくばICより5分' : 'つくばエクスプレス つくば駅より車で10分'}</li>
                    <li>JR常磐線 土浦駅より車で20分</li>
                    <li>駐車場完備（無料）</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* よくある質問 */}
            <section className={`${styles.faq} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>よくある質問</h2>
                <div className={styles.faqList}>
                  <div className={styles.faqItem}>
                    <h3>Q. 見積もりは無料ですか？</h3>
                    <p>A. はい、お見積もりは無料です。お気軽にご相談ください。</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Q. {businessType === 'transport' ? '緊急配送は可能ですか？' : businessType === 'warehouse' ? '短期間の保管は可能ですか？' : '土日の引越しは可能ですか？'}</h3>
                    <p>A. {businessType === 'transport' ? '24時間対応しております。緊急の場合もご相談ください。' : businessType === 'warehouse' ? 'はい、1か月からの短期保管も承っております。' : 'はい、土日祝日も対応しております。'}</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Q. 対応エリアはどこまでですか？</h3>
                    <p>A. {businessType === 'moving' ? '関東全域に対応しております。その他の地域もご相談ください。' : '全国対応しております。詳細はお問い合わせください。'}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
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
                'あなたの会社でシミュレーション'
              ) : (
                <span style={{ fontSize: '0.9rem' }}>
                  {displayName} | {business.label} | {theme === 'professional' ? 'プロフェッショナル' : theme === 'innovative' ? 'イノベーティブ' : 'フレンドリー'}
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
              <label>会社名</label>
              <input
                type="text"
                placeholder="あなたの会社名を入力"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={styles.companyNameInput}
              />
            </div>

            <div className={styles.controlGroup}>
              <label>業種</label>
              <div className={styles.buttonGroup}>
                <button
                  className={businessType === "transport" ? styles.active : ""}
                  onClick={() => setBusinessType("transport")}
                >
                  運送・配送
                </button>
                <button
                  className={businessType === "warehouse" ? styles.active : ""}
                  onClick={() => setBusinessType("warehouse")}
                >
                  倉庫・物流センター
                </button>
                <button
                  className={businessType === "moving" ? styles.active : ""}
                  onClick={() => setBusinessType("moving")}
                >
                  引越し
                </button>
              </div>
            </div>

            <div className={styles.controlGroup}>
              <label>デザイン</label>
              <div className={styles.buttonGroup}>
                <button
                  className={theme === "professional" ? styles.active : ""}
                  onClick={() => setTheme("professional")}
                >
                  プロフェッショナル
                </button>
                <button
                  className={theme === "innovative" ? styles.active : ""}
                  onClick={() => setTheme("innovative")}
                >
                  イノベーティブ
                </button>
                <button
                  className={theme === "friendly" ? styles.active : ""}
                  onClick={() => setTheme("friendly")}
                >
                  フレンドリー
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ヘッダー */}
      <header className={`${styles.header} ${styles[theme]}`}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <h1>{displayName}</h1>
            <p className={styles.tagline}>{business.tagline[theme]}</p>
          </div>
          <nav className={styles.nav}>
            <button
              className={currentPage === 'home' ? styles.navActive : ''}
              onClick={() => setCurrentPage('home')}
            >
              TOP
            </button>
            <button
              className={currentPage === 'about' ? styles.navActive : ''}
              onClick={() => setCurrentPage('about')}
            >
              会社紹介
            </button>
            <button
              className={currentPage === 'service' ? styles.navActive : ''}
              onClick={() => setCurrentPage('service')}
            >
              サービス紹介
            </button>
            <button
              className={currentPage === 'contact' ? styles.navActive : ''}
              onClick={() => setCurrentPage('contact')}
            >
              お問い合わせ
            </button>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className={`${styles.main} ${isControlOpen ? styles.mainOpen : ''}`}>
        {renderPage()}
      </main>

      {/* フッター（お問い合わせ情報） */}
      <footer className={`${styles.footer} ${styles[theme]}`}>
        <div className={styles.footerInner}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>お問い合わせ</h3>
              <p className={styles.tel}>TEL: 029-123-4567</p>
              <p>受付時間: {businessType === 'transport' ? '24時間対応' : '平日 9:00〜18:00'}</p>
              <p>Email: info@example.com</p>
            </div>
            <div className={styles.footerSection}>
              <h3>アクセス</h3>
              <p>〒305-0001</p>
              <p>茨城県つくば市天王台1-1-1</p>
              <p>{businessType === 'warehouse' ? '常磐自動車道 つくばICより5分' : 'つくばエクスプレス つくば駅より車で10分'}</p>
            </div>
            <div className={styles.footerSection}>
              <h3>{displayName}</h3>
              <p className={styles.footerTagline}>{business.tagline[theme]}</p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 {displayName}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 固定CTAフッター */}
      <div className={styles.fixedCta}>
        <div className={styles.fixedCtaInner}>
          <div className={styles.fixedCtaText}>
            <p>このデザインで企業サイトを作りませんか？</p>
            <small>初期費用11万円〜 / 月額1.65万円（2年間）</small>
          </div>
          <button className={styles.fixedCtaButton} onClick={handleOrder}>
            このデザインで制作を依頼する
          </button>
        </div>
      </div>
    </div>
  );
}