"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../demo.corporate.module.css";

// 型定義
type BusinessType = "management" | "accounting" | "legal";
type ThemeType = "professional" | "innovative" | "friendly";
type PageType = "home" | "about" | "service" | "contact";

// 業種別コンテンツ設定
const businessContent = {
  management: {
    label: "経営コンサルティング",
    defaultName: "ビジネスパートナーズ",
    tagline: {
      professional: "戦略的パートナーとして、企業成長を実現",
      innovative: "革新的なソリューションで、未来を創造",
      friendly: "共に考え、共に成長する"
    },
    home: {
      hero: {
        title: {
          professional: "経営課題の解決から\n持続的成長まで総合支援",
          innovative: "データドリブンな戦略で\nビジネスを次のステージへ",
          friendly: "お客様と共に歩む\n経営改革のパートナー"
        },
        description: "豊富な実績と専門知識を活かし、\n企業の課題解決と価値創造をサポートします"
      },
      features: [
        { title: "豊富な実績", desc: "500社以上の支援実績" },
        { title: "専門性", desc: "各分野のエキスパート在籍" },
        { title: "伴走支援", desc: "実行まで徹底サポート" }
      ],
      stats: [
        { number: "500+", label: "支援企業数", desc: "上場企業から中小企業まで" },
        { number: "95%", label: "顧客満足度", desc: "高い評価をいただいています" },
        { number: "45名", label: "コンサルタント", desc: "各分野の専門家が在籍" }
      ],
      services: [
        { name: "経営戦略策定", time: "3〜6ヶ月", spec: "中長期計画立案" },
        { name: "DX推進支援", time: "6〜12ヶ月", spec: "デジタル化戦略" },
        { name: "M&A支援", time: "6〜18ヶ月", spec: "買収・統合支援" }
      ]
    },
    about: {
      mission: "私たちは、クライアント企業の真のパートナーとして、経営課題の解決と持続的な成長を支援し、社会に価値を創造します。",
      values: [
        { title: "誠実", desc: "クライアントとの信頼関係を最重視" },
        { title: "専門", desc: "高度な専門知識とスキルの追求" },
        { title: "成果", desc: "具体的な成果にコミット" }
      ],
      history: [
        { year: "2005年", event: "コンサルティング事業開始" },
        { year: "2010年", event: "東京オフィス開設" },
        { year: "2018年", event: "DX支援サービス開始" },
        { year: "2023年", event: "AI活用コンサルティング開始" }
      ],
      message: {
        title: "代表メッセージ",
        content: "激変する経営環境において、企業の持続的成長を実現するには、従来の枠組みを超えた変革が必要です。私たちは、豊富な経験と最新の知見を活かし、お客様と共に新たな価値創造に挑戦してまいります。",
        name: "代表取締役 田中一郎"
      },
      info: {
        established: "2005年4月",
        capital: "資本金 3,000万円",
        employees: "コンサルタント 45名",
        clients: "上場企業から中小企業まで幅広く支援",
        office: "東京、大阪、つくば"
      }
    },
    service: {
      departments: [
        { 
          name: "経営戦略コンサルティング", 
          desc: "中長期経営計画の策定、事業戦略の立案",
          details: "市場分析から戦略立案、実行支援まで、経営の全体最適化を支援します。"
        },
        { 
          name: "組織・人事コンサルティング", 
          desc: "組織改革、人事制度設計、人材育成",
          details: "組織の活性化と人材の成長を通じて、企業競争力の向上を実現します。"
        },
        { 
          name: "DXコンサルティング", 
          desc: "デジタル化戦略、業務プロセス改革",
          details: "最新技術を活用した業務改革で、生産性向上とイノベーションを支援します。"
        },
        { 
          name: "M&A・事業承継支援", 
          desc: "企業買収、事業承継の戦略立案から実行まで",
          details: "企業価値の最大化と円滑な事業承継を、専門チームがサポートします。"
        }
      ],
      process: {
        title: "コンサルティングプロセス",
        items: [
          { name: "現状分析", desc: "課題の明確化", period: "1〜2ヶ月" },
          { name: "戦略立案", desc: "解決策の策定", period: "2〜3ヶ月" },
          { name: "実行支援", desc: "変革の推進", period: "3〜12ヶ月" }
        ]
      }
    }
  },
  accounting: {
    label: "会計事務所・税理士",
    defaultName: "つくば会計事務所",
    tagline: {
      professional: "確かな専門知識で、経営を支える",
      innovative: "最新の会計システムで、効率的な経営を",
      friendly: "親身になって、お客様の成長を応援"
    },
    home: {
      hero: {
        title: {
          professional: "税務・会計の専門家として\n企業経営をサポート",
          innovative: "クラウド会計で\n経営の見える化を実現",
          friendly: "身近な相談相手として\n共に歩む会計事務所"
        },
        description: "税務申告から経営相談まで、\nワンストップでサポートいたします"
      },
      features: [
        { title: "幅広い対応", desc: "個人から法人まで" },
        { title: "最新システム", desc: "クラウド会計導入支援" },
        { title: "親身な対応", desc: "経営者の立場で助言" }
      ],
      stats: [
        { number: "300社", label: "顧問先企業", desc: "幅広い業種に対応" },
        { number: "30年", label: "業界経験", desc: "豊富な実績と信頼" },
        { number: "15名", label: "専門スタッフ", desc: "税理士・会計士が在籍" }
      ],
      services: [
        { name: "月次決算", time: "毎月対応", spec: "経営状況の把握" },
        { name: "確定申告", time: "年1回", spec: "適正な税務申告" },
        { name: "経営相談", time: "随時対応", spec: "資金繰り・事業計画" }
      ]
    },
    about: {
      mission: "私たちは、正確な会計・税務サービスを通じて、お客様の健全な経営と事業発展に貢献します。",
      values: [
        { title: "正確", desc: "ミスのない確実な業務遂行" },
        { title: "迅速", desc: "スピーディーな対応" },
        { title: "提案", desc: "積極的な改善提案" }
      ],
      history: [
        { year: "1995年", event: "会計事務所開設" },
        { year: "2005年", event: "法人化、税理士法人設立" },
        { year: "2015年", event: "クラウド会計導入支援開始" },
        { year: "2022年", event: "経営コンサルティング部門設立" }
      ],
      message: {
        title: "代表税理士挨拶",
        content: "中小企業の経営者様にとって、税務・会計は重要な経営課題です。私たちは単なる記帳代行ではなく、経営のパートナーとして、お客様の事業発展を全力でサポートいたします。",
        name: "代表税理士 山田太郎"
      },
      info: {
        established: "1995年10月",
        representative: "代表税理士 山田太郎",
        employees: "税理士3名、職員12名",
        clients: "顧問先 約300社",
        office: "つくば本店、土浦支店"
      }
    },
    service: {
      departments: [
        { 
          name: "税務顧問", 
          desc: "月次決算、税務申告、税務相談",
          details: "毎月の試算表作成から決算・申告まで、税務全般をサポートします。"
        },
        { 
          name: "経理代行", 
          desc: "記帳代行、給与計算、年末調整",
          details: "煩雑な経理業務をアウトソーシング。本業に専念できる環境を提供します。"
        },
        { 
          name: "経営支援", 
          desc: "資金繰り相談、事業計画策定支援",
          details: "財務データを基に、経営改善や資金調達のアドバイスを行います。"
        },
        { 
          name: "相続・事業承継", 
          desc: "相続税対策、事業承継計画の立案",
          details: "スムーズな世代交代と、税負担の最適化をサポートします。"
        }
      ],
      process: {
        title: "サービス料金目安",
        items: [
          { name: "個人事業主", desc: "記帳代行込み", period: "月額2万円〜" },
          { name: "法人（小規模）", desc: "月次決算込み", period: "月額3万円〜" },
          { name: "法人（中規模）", desc: "経営相談込み", period: "月額5万円〜" }
        ]
      }
    }
  },
  legal: {
    label: "法律事務所",
    defaultName: "つくば総合法律事務所",
    tagline: {
      professional: "法の専門家として、正義を実現",
      innovative: "新しい法的課題に、先進的アプローチで",
      friendly: "身近な法律相談パートナー"
    },
    home: {
      hero: {
        title: {
          professional: "企業法務から個人案件まで\n幅広い法的サービスを提供",
          innovative: "最新の法的知見で\n複雑な問題を解決",
          friendly: "お客様に寄り添う\n頼れる法律事務所"
        },
        description: "豊富な経験と専門性を活かし、\n最適な法的解決策をご提案します"
      },
      features: [
        { title: "総合力", desc: "あらゆる法的問題に対応" },
        { title: "専門性", desc: "各分野の専門弁護士" },
        { title: "迅速対応", desc: "スピーディーな問題解決" }
      ],
      stats: [
        { number: "2,000件", label: "年間相談件数", desc: "豊富な解決実績" },
        { number: "8名", label: "弁護士数", desc: "各分野の専門家" },
        { number: "98%", label: "解決率", desc: "高い問題解決力" }
      ],
      services: [
        { name: "企業法務", time: "顧問契約", spec: "月額5万円〜" },
        { name: "民事訴訟", time: "着手金", spec: "30万円〜" },
        { name: "法律相談", time: "初回相談", spec: "30分5,000円" }
      ]
    },
    about: {
      mission: "私たちは、法の専門家として、クライアントの権利と利益を守り、公正な社会の実現に貢献します。",
      values: [
        { title: "公正", desc: "法と正義に基づく活動" },
        { title: "信頼", desc: "クライアントとの信頼関係構築" },
        { title: "解決", desc: "最適な問題解決の追求" }
      ],
      history: [
        { year: "2008年", event: "法律事務所開設" },
        { year: "2012年", event: "企業法務部門強化" },
        { year: "2018年", event: "知的財産部門設立" },
        { year: "2023年", event: "国際法務対応開始" }
      ],
      message: {
        title: "代表弁護士メッセージ",
        content: "法律問題は、早期の適切な対応が重要です。私たちは、クライアントの立場に立って、最善の解決策を追求します。どんな小さな疑問でも、お気軽にご相談ください。",
        name: "代表弁護士 鈴木一郎"
      },
      info: {
        established: "2008年4月",
        representative: "代表弁護士 鈴木一郎",
        employees: "弁護士 8名、事務員 5名",
        areas: "企業法務、民事、刑事、家事事件",
        office: "つくば本部、東京オフィス"
      }
    },
    service: {
      departments: [
        { 
          name: "企業法務", 
          desc: "契約書作成、コンプライアンス、労務問題",
          details: "企業活動に関わる法的リスクを予防し、トラブル時には迅速に対応します。"
        },
        { 
          name: "民事・商事", 
          desc: "債権回収、不動産、損害賠償請求",
          details: "契約トラブルから不動産問題まで、幅広い民事案件に対応します。"
        },
        { 
          name: "知的財産", 
          desc: "特許、商標、著作権の保護・活用",
          details: "知的財産の権利化から侵害対応まで、トータルサポートします。"
        },
        { 
          name: "個人向けサービス", 
          desc: "相続、離婚、交通事故、債務整理",
          details: "個人の方の法律問題を、親身になってサポートします。"
        }
      ],
      process: {
        title: "弁護士費用の目安",
        items: [
          { name: "法律相談", desc: "初回相談", period: "30分 5,000円" },
          { name: "顧問契約", desc: "企業法務顧問", period: "月額 5万円〜" },
          { name: "訴訟代理", desc: "着手金", period: "30万円〜" }
        ]
      }
    }
  }
};

export default function ConsultingCorporateDemo() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("management");
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
                    無料相談はこちら
                  </button>
                </div>
              </div>
            </section>

            {/* 特徴セクション */}
            <section className={`${styles.features} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>選ばれる理由</h2>
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
                  {businessType === 'management' ? '主要サービス' : businessType === 'accounting' ? 'サービス内容' : '取扱分野'}
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
                <h1>事務所紹介</h1>
                <p>私たちの理念と専門性</p>
              </div>
            </section>

            {/* ミッション */}
            <section className={`${styles.mission} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>理念・ミッション</h2>
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
                <h2 className={styles.sectionTitle}>事務所概要</h2>
                <table className={styles.infoTable}>
                  <tbody>
                    <tr>
                      <th>事務所名</th>
                      <td>{businessType === 'management' ? '株式会社' : ''}{displayName}</td>
                    </tr>
                    <tr>
                      <th>設立</th>
                      <td>{business.about.info.established}</td>
                    </tr>
                    <tr>
                      <th>{businessType === 'management' ? '資本金' : '代表'}</th>
                      <td>
                        {businessType === 'management' && 'capital' in business.about.info && business.about.info.capital}
                        {businessType === 'accounting' && 'representative' in business.about.info && business.about.info.representative}
                        {businessType === 'legal' && 'representative' in business.about.info && business.about.info.representative}
                      </td>
                    </tr>
                    <tr>
                      <th>スタッフ</th>
                      <td>{business.about.info.employees}</td>
                    </tr>
                    <tr>
                      <th>{businessType === 'management' ? '実績' : businessType === 'accounting' ? '顧問先' : '取扱分野'}</th>
                      <td>
                        {businessType === 'management' && 'clients' in business.about.info && business.about.info.clients}
                        {businessType === 'accounting' && 'clients' in business.about.info && business.about.info.clients}
                        {businessType === 'legal' && 'areas' in business.about.info && business.about.info.areas}
                      </td>
                    </tr>
                    <tr>
                      <th>拠点</th>
                      <td>{business.about.info.office}</td>
                    </tr>
                    <tr>
                      <th>所在地</th>
                      <td>〒305-0001 茨城県つくば市天王台1-1-1<br />つくばビジネスセンター5F</td>
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

            {/* プロセス・料金 */}
            <section className={`${styles.pricing} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>{business.service.process.title}</h2>
                <div className={styles.pricingGrid}>
                  {business.service.process.items.map((item, index) => (
                    <div key={index} className={styles.pricingCard}>
                      <h3>{item.name}</h3>
                      <div className={styles.pricingPrice}>{item.period}</div>
                      <div className={styles.pricingTime}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 実績・事例 */}
            <section className={`${styles.facilities} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>実績・成功事例</h2>
                <div className={styles.facilityGrid}>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>成功事例1</span>
                    </div>
                    <p>{businessType === 'management' ? '売上150%達成の事例' : businessType === 'accounting' ? '節税対策の成功事例' : '企業法務の解決事例'}</p>
                  </div>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>成功事例2</span>
                    </div>
                    <p>{businessType === 'management' ? '組織改革の成功事例' : businessType === 'accounting' ? '事業承継の支援事例' : '知的財産保護の事例'}</p>
                  </div>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>成功事例3</span>
                    </div>
                    <p>{businessType === 'management' ? 'DX推進の成功事例' : businessType === 'accounting' ? 'クラウド化支援事例' : '労務問題解決事例'}</p>
                  </div>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>成功事例4</span>
                    </div>
                    <p>{businessType === 'management' ? 'M&A成功事例' : businessType === 'accounting' ? '資金調達支援事例' : '契約トラブル解決事例'}</p>
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
                    <p>受付時間: 平日 9:00〜18:00</p>
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
                    <p>つくばビジネスセンター5F</p>
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
                    <li>つくばエクスプレス「つくば駅」より徒歩5分</li>
                    <li>JR常磐線「土浦駅」よりバス20分</li>
                    <li>提携駐車場あり（有料）</li>
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
                    <h3>Q. 初回相談は無料ですか？</h3>
                    <p>A. {businessType === 'management' ? '初回相談は無料です。お気軽にご相談ください。' : businessType === 'accounting' ? '初回30分は無料相談を承っております。' : '初回相談は30分5,000円となります。'}</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Q. どのような規模の企業に対応していますか？</h3>
                    <p>A. {businessType === 'management' ? '大企業から中小企業、スタートアップまで幅広く対応しています。' : businessType === 'accounting' ? '個人事業主から上場企業まで、規模を問わず対応いたします。' : '個人の方から大企業まで、幅広く対応しております。'}</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Q. オンラインでの相談は可能ですか？</h3>
                    <p>A. はい、Zoom等を使用したオンライン相談も承っております。</p>
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
                'あなたの事務所でシミュレーション'
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
              <label>事務所名</label>
              <input
                type="text"
                placeholder="あなたの事務所名を入力"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={styles.companyNameInput}
              />
            </div>

            <div className={styles.controlGroup}>
              <label>業種</label>
              <div className={styles.buttonGroup}>
                <button
                  className={businessType === "management" ? styles.active : ""}
                  onClick={() => setBusinessType("management")}
                >
                  経営コンサル
                </button>
                <button
                  className={businessType === "accounting" ? styles.active : ""}
                  onClick={() => setBusinessType("accounting")}
                >
                  会計・税理士
                </button>
                <button
                  className={businessType === "legal" ? styles.active : ""}
                  onClick={() => setBusinessType("legal")}
                >
                  法律事務所
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
              事務所紹介
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
              <p>受付時間: 平日 9:00〜18:00</p>
              <p>Email: info@example.com</p>
            </div>
            <div className={styles.footerSection}>
              <h3>アクセス</h3>
              <p>〒305-0001</p>
              <p>茨城県つくば市天王台1-1-1</p>
              <p>つくばビジネスセンター5F</p>
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