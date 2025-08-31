"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../demo.corporate.module.css";

// 型定義
type BusinessType = "manufacturing" | "logistics" | "construction";
type ThemeType = "professional" | "innovative" | "friendly";
type PageType = "home" | "about" | "service" | "contact";

// 業種別コンテンツ設定
const businessContent = {
  manufacturing: {
    label: "製造業",
    defaultName: "つくば精密工業",
    tagline: {
      professional: "確かな技術で、産業の発展に貢献",
      innovative: "革新的な技術で、未来を創造",
      friendly: "お客様と共に、ものづくりの喜びを"
    },
    home: {
      hero: {
        title: {
          professional: "精密加工技術で\n産業の発展を支えます",
          innovative: "最新テクノロジーで\n製造業の未来を創る",
          friendly: "心を込めたものづくりで\nお客様の期待に応えます"
        },
        description: "高品質な製品と確かな技術力で、\nお客様のニーズに応える製造ソリューションを提供"
      },
      features: [
        { title: "高精度加工", desc: "±0.001mmの精密加工技術" },
        { title: "品質管理", desc: "ISO9001認証取得" },
        { title: "短納期対応", desc: "柔軟な生産体制" }
      ],
      stats: [
        { number: "50年", label: "創業実績", desc: "確かな技術の蓄積" },
        { number: "1,000社", label: "取引実績", desc: "幅広い業界に対応" },
        { number: "99.9%", label: "品質保証率", desc: "高い品質管理体制" }
      ],
      capabilities: [
        { name: "精密機械加工", time: "小ロット〜量産", spec: "CNC旋盤・マシニング" },
        { name: "板金加工", time: "試作〜量産", spec: "レーザー・プレス加工" },
        { name: "組立・検査", time: "一貫生産", spec: "品質保証体制完備" }
      ]
    },
    about: {
      mission: "私たちは、高品質な製品づくりを通じて、お客様の事業発展と産業の進歩に貢献します。",
      values: [
        { title: "品質", desc: "妥協のない品質追求" },
        { title: "技術", desc: "継続的な技術革新" },
        { title: "信頼", desc: "お客様との長期的な信頼関係" }
      ],
      history: [
        { year: "1974年", event: "創業、金属加工業開始" },
        { year: "1990年", event: "新工場建設、CNC設備導入" },
        { year: "2010年", event: "ISO9001認証取得" },
        { year: "2023年", event: "IoT生産管理システム導入" }
      ],
      message: {
        title: "代表挨拶",
        content: "創業以来50年、私たちは「品質第一」を掲げ、お客様の信頼に応えてまいりました。これからも最新技術と職人技術の融合により、より良い製品づくりに邁進してまいります。",
        name: "代表取締役 田中太郎"
      },
      info: {
        established: "1974年4月",
        capital: "資本金 5,000万円",
        employees: "従業員 120名",
        factory: "本社工場、第二工場",
        certification: "ISO9001、エコアクション21"
      }
    },
    service: {
      departments: [
        { 
          name: "精密機械加工", 
          desc: "CNC旋盤、マシニングセンターによる高精度加工",
          details: "複雑形状から大型部品まで、多様な加工ニーズに対応します。"
        },
        { 
          name: "板金・プレス加工", 
          desc: "レーザー加工、プレス成形、溶接加工",
          details: "試作から量産まで、一貫した板金加工サービスを提供します。"
        },
        { 
          name: "表面処理", 
          desc: "めっき、塗装、アルマイト処理",
          details: "耐食性、装飾性を高める各種表面処理に対応します。"
        },
        { 
          name: "組立・検査", 
          desc: "部品組立から完成品検査まで一貫対応",
          details: "品質保証体制のもと、高品質な製品をお届けします。"
        }
      ],
      equipment: {
        title: "主要設備",
        items: [
          { name: "CNC旋盤", desc: "最新5軸制御", count: "10台" },
          { name: "マシニングセンター", desc: "高速・高精度", count: "15台" },
          { name: "三次元測定機", desc: "品質保証", count: "3台" }
        ]
      }
    }
  },
  logistics: {
    label: "物流・運送業",
    defaultName: "つくば物流センター",
    tagline: {
      professional: "確実な物流で、ビジネスを支える",
      innovative: "スマート物流で、新しい価値を創造",
      friendly: "お客様の大切な荷物を、心を込めて"
    },
    home: {
      hero: {
        title: {
          professional: "確実・迅速な物流で\nビジネスの成功を支援",
          innovative: "最新の物流システムで\nサプライチェーンを最適化",
          friendly: "お客様の笑顔のために\n真心込めてお届けします"
        },
        description: "全国ネットワークと最新システムで、\n効率的で確実な物流サービスを提供"
      },
      features: [
        { title: "全国配送", desc: "日本全国翌日配送可能" },
        { title: "在庫管理", desc: "リアルタイム在庫管理" },
        { title: "温度管理", desc: "冷蔵・冷凍輸送対応" }
      ],
      stats: [
        { number: "10,000件", label: "月間配送実績", desc: "確実な配送サービス" },
        { number: "99.8%", label: "配送成功率", desc: "高い信頼性" },
        { number: "50台", label: "保有車両", desc: "多様な輸送ニーズに対応" }
      ],
      capabilities: [
        { name: "一般貨物輸送", time: "365日対応", spec: "全国ネットワーク" },
        { name: "倉庫保管", time: "24時間体制", spec: "温度管理可能" },
        { name: "流通加工", time: "即日対応", spec: "検品・梱包・仕分け" }
      ]
    },
    about: {
      mission: "私たちは、安全・確実・迅速な物流サービスを通じて、お客様のビジネス成功と社会の発展に貢献します。",
      values: [
        { title: "安全", desc: "安全第一の輸送サービス" },
        { title: "信頼", desc: "確実な配送の実現" },
        { title: "効率", desc: "最適な物流ソリューション" }
      ],
      history: [
        { year: "1985年", event: "運送事業開始" },
        { year: "2000年", event: "物流センター開設" },
        { year: "2015年", event: "WMS導入、IT化推進" },
        { year: "2023年", event: "自動倉庫システム導入" }
      ],
      message: {
        title: "代表挨拶",
        content: "物流は経済の血流です。私たちは、お客様の大切な商品を確実にお届けすることで、ビジネスの成功に貢献してまいります。最新技術と人の力を融合させ、より良いサービスを追求し続けます。",
        name: "代表取締役 佐藤次郎"
      },
      info: {
        established: "1985年7月",
        capital: "資本金 3,000万円",
        employees: "従業員 85名（ドライバー50名）",
        facility: "物流センター 3拠点",
        certification: "Gマーク認定、グリーン経営認証"
      }
    },
    service: {
      departments: [
        { 
          name: "一般貨物輸送", 
          desc: "企業間物流、チャーター便、定期便",
          details: "小口配送から大型輸送まで、多様な輸送ニーズに対応します。"
        },
        { 
          name: "倉庫・保管サービス", 
          desc: "常温・冷蔵・冷凍倉庫、在庫管理",
          details: "最新のWMSによる在庫管理で、効率的な保管サービスを提供します。"
        },
        { 
          name: "流通加工", 
          desc: "検品、仕分け、梱包、ラベリング",
          details: "物流に付随する各種加工作業を、高品質で提供します。"
        },
        { 
          name: "3PLサービス", 
          desc: "物流業務の包括的アウトソーシング",
          details: "お客様の物流部門として、トータルソリューションを提供します。"
        }
      ],
      equipment: {
        title: "保有設備・車両",
        items: [
          { name: "大型トラック", desc: "10t車", count: "20台" },
          { name: "中型トラック", desc: "4t車", count: "15台" },
          { name: "冷凍冷蔵車", desc: "温度管理車両", count: "10台" }
        ]
      }
    }
  },
  construction: {
    label: "建設業",
    defaultName: "つくば建設",
    tagline: {
      professional: "確かな技術で、街づくりに貢献",
      innovative: "最新技術で、未来の建築を創造",
      friendly: "地域と共に、豊かな暮らしを築く"
    },
    home: {
      hero: {
        title: {
          professional: "確かな施工技術で\n安心・安全な建築を実現",
          innovative: "最新建築技術で\n未来の街づくりを",
          friendly: "地域の皆様と共に\n豊かな環境を創造"
        },
        description: "住宅から商業施設まで、\n幅広い建築ニーズにお応えします"
      },
      features: [
        { title: "総合建設", desc: "設計から施工まで一貫対応" },
        { title: "技術力", desc: "経験豊富な技術者集団" },
        { title: "アフターサービス", desc: "充実の保証・メンテナンス" }
      ],
      stats: [
        { number: "1,500棟", label: "施工実績", desc: "豊富な実績と信頼" },
        { number: "40年", label: "創業年数", desc: "地域に根ざした実績" },
        { number: "100名", label: "技術者数", desc: "確かな技術力" }
      ],
      capabilities: [
        { name: "住宅建築", time: "注文住宅・分譲", spec: "省エネ・耐震設計" },
        { name: "商業施設", time: "店舗・オフィス", spec: "デザイン性重視" },
        { name: "公共工事", time: "学校・病院", spec: "安全性最優先" }
      ]
    },
    about: {
      mission: "私たちは、安全で快適な建築物の提供を通じて、地域社会の発展と人々の豊かな暮らしに貢献します。",
      values: [
        { title: "安全", desc: "安全第一の施工管理" },
        { title: "品質", desc: "高品質な建築物の提供" },
        { title: "環境", desc: "環境に配慮した建築" }
      ],
      history: [
        { year: "1984年", event: "創業、住宅建築開始" },
        { year: "1995年", event: "商業施設建築参入" },
        { year: "2010年", event: "ISO14001認証取得" },
        { year: "2022年", event: "ZEB・ZEH対応開始" }
      ],
      message: {
        title: "代表挨拶",
        content: "創業以来40年、地域の皆様と共に歩んでまいりました。これからも安全で快適な建築物を通じて、皆様の暮らしを支え、地域の発展に貢献してまいります。",
        name: "代表取締役 鈴木三郎"
      },
      info: {
        established: "1984年4月",
        capital: "資本金 8,000万円",
        employees: "従業員 100名（技術者70名）",
        license: "建設業許可 特定建設業",
        certification: "ISO9001、ISO14001"
      }
    },
    service: {
      departments: [
        { 
          name: "住宅建築", 
          desc: "注文住宅、分譲住宅、リフォーム",
          details: "お客様の理想の住まいを、確かな技術で実現します。"
        },
        { 
          name: "商業施設", 
          desc: "店舗、オフィスビル、工場、倉庫",
          details: "機能性とデザイン性を両立した商業空間を創造します。"
        },
        { 
          name: "公共施設", 
          desc: "学校、病院、福祉施設、公営住宅",
          details: "安全性と利便性を最優先に、公共施設を建設します。"
        },
        { 
          name: "土木工事", 
          desc: "道路、橋梁、造成、外構工事",
          details: "インフラ整備から外構まで、幅広い土木工事に対応します。"
        }
      ],
      equipment: {
        title: "施工実績",
        items: [
          { name: "住宅", desc: "戸建て・マンション", count: "800棟" },
          { name: "商業施設", desc: "店舗・オフィス", count: "500棟" },
          { name: "公共施設", desc: "学校・病院", count: "200棟" }
        ]
      }
    }
  }
};

export default function ManufacturingCorporateDemo() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("manufacturing");
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
                    お問い合わせ
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

            {/* 技術・サービス */}
            <section className={`${styles.specialties} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>
                  {businessType === 'manufacturing' ? '製造能力' : businessType === 'logistics' ? 'サービス内容' : '事業内容'}
                </h2>
                <div className={styles.specialtyGrid}>
                  {business.home.capabilities.map((capability, index) => (
                    <div key={index} className={styles.specialtyCard}>
                      <h3>{capability.name}</h3>
                      <div className={styles.specialtyInfo}>
                        <p className={styles.specialtyTime}>{capability.time}</p>
                        <p className={styles.specialtyDoctor}>{capability.spec}</p>
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
                <p>私たちの理念と歩み</p>
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

            {/* 会社情報 */}
            <section className={`${styles.info} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>会社概要</h2>
                <table className={styles.infoTable}>
                  <tbody>
                    <tr>
                      <th>会社名</th>
                      <td>株式会社{displayName}</td>
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
                      <th>{businessType === 'manufacturing' ? '工場' : businessType === 'logistics' ? '拠点' : '許可'}</th>
                      <td>
                        {businessType === 'manufacturing' && 'factory' in business.about.info && business.about.info.factory}
                        {businessType === 'logistics' && 'facility' in business.about.info && business.about.info.facility}
                        {businessType === 'construction' && 'license' in business.about.info && business.about.info.license}
                      </td>
                    </tr>
                    <tr>
                      <th>認証</th>
                      <td>{business.about.info.certification}</td>
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
                <h1>事業内容</h1>
                <p>提供するサービス・製品</p>
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

            {/* 設備・実績 */}
            <section className={`${styles.pricing} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>{business.service.equipment.title}</h2>
                <div className={styles.pricingGrid}>
                  {business.service.equipment.items.map((item, index) => (
                    <div key={index} className={styles.pricingCard}>
                      <h3>{item.name}</h3>
                      <div className={styles.pricingPrice}>{item.count}</div>
                      <div className={styles.pricingTime}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 施設・工場 */}
            <section className={`${styles.facilities} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>
                  {businessType === 'manufacturing' ? '工場・設備' : businessType === 'logistics' ? '物流拠点' : '施工事例'}
                </h2>
                <div className={styles.facilityGrid}>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>{businessType === 'manufacturing' ? '本社工場' : businessType === 'logistics' ? '物流センター' : '住宅施工例'}</span>
                    </div>
                    <p>{businessType === 'manufacturing' ? '最新設備を備えた生産拠点' : businessType === 'logistics' ? '効率的な物流オペレーション' : '快適な住環境の実現'}</p>
                  </div>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>{businessType === 'manufacturing' ? '品質管理室' : businessType === 'logistics' ? '自動倉庫' : '商業施設施工例'}</span>
                    </div>
                    <p>{businessType === 'manufacturing' ? '徹底した品質管理体制' : businessType === 'logistics' ? '最新の自動化システム' : '機能的な商業空間'}</p>
                  </div>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>{businessType === 'manufacturing' ? '技術開発室' : businessType === 'logistics' ? '配送センター' : '公共施設施工例'}</span>
                    </div>
                    <p>{businessType === 'manufacturing' ? '新技術の研究開発' : businessType === 'logistics' ? '迅速な配送体制' : '安全で使いやすい公共空間'}</p>
                  </div>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>{businessType === 'manufacturing' ? '検査工程' : businessType === 'logistics' ? '車両基地' : 'リフォーム事例'}</span>
                    </div>
                    <p>{businessType === 'manufacturing' ? '厳格な検査体制' : businessType === 'logistics' ? '万全の車両管理' : '新しい価値の創造'}</p>
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
                    <p>受付時間: 平日 8:30〜17:30</p>
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
                    <li>つくばエクスプレス「つくば駅」より車で10分</li>
                    <li>常磐自動車道「つくばIC」より5分</li>
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
                    <p>A. はい、お見積もりは無料で承っております。お気軽にご相談ください。</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Q. 小ロットでも対応可能ですか？</h3>
                    <p>A. {businessType === 'manufacturing' ? '試作1個から量産まで、幅広く対応いたします。' : businessType === 'logistics' ? '小口配送から大型輸送まで対応可能です。' : '小規模工事から大規模プロジェクトまで承ります。'}</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Q. 納期はどのくらいですか？</h3>
                    <p>A. {businessType === 'manufacturing' ? '製品により異なりますが、最短3日から対応可能です。' : businessType === 'logistics' ? '配送エリアにより異なりますが、翌日配送も可能です。' : '工事規模により異なりますが、詳細はお問い合わせください。'}</p>
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
                  className={businessType === "manufacturing" ? styles.active : ""}
                  onClick={() => setBusinessType("manufacturing")}
                >
                  製造業
                </button>
                <button
                  className={businessType === "logistics" ? styles.active : ""}
                  onClick={() => setBusinessType("logistics")}
                >
                  物流・運送
                </button>
                <button
                  className={businessType === "construction" ? styles.active : ""}
                  onClick={() => setBusinessType("construction")}
                >
                  建設業
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
              事業内容
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
              <p>受付時間: 平日 8:30〜17:30</p>
              <p>Email: info@example.com</p>
            </div>
            <div className={styles.footerSection}>
              <h3>アクセス</h3>
              <p>〒305-0001</p>
              <p>茨城県つくば市天王台1-1-1</p>
              <p>つくばエクスプレス つくば駅より車で10分</p>
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