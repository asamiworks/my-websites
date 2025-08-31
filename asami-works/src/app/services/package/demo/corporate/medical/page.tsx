"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../demo.corporate.module.css";

// 型定義
type BusinessType = "hospital" | "care" | "welfare";
type ThemeType = "professional" | "innovative" | "friendly";
type PageType = "home" | "about" | "service" | "contact";

// 業種別コンテンツ設定
const businessContent = {
  hospital: {
    label: "病院・クリニック",
    defaultName: "健康会クリニック",
    tagline: {
      professional: "地域の健康を守る、信頼の医療",
      innovative: "最先端医療で、新しい健康の形を",
      friendly: "あなたの笑顔が、私たちの喜び"
    },
    home: {
      hero: {
        title: {
          professional: "確かな医療技術で\n地域の皆様の健康を支えます",
          innovative: "革新的な医療で\n未来の健康を創造します",
          friendly: "心に寄り添う医療で\nあなたの健康をサポート"
        },
        description: "患者様一人ひとりに最適な医療を提供し、\n健康で豊かな生活の実現をお手伝いします"
      },
      features: [
        { title: "総合診療", desc: "幅広い診療科目で対応" },
        { title: "最新設備", desc: "充実した医療機器" },
        { title: "経験豊富", desc: "専門医による診療" }
      ],
      stats: [
        { number: "15,000+", label: "年間診療実績", desc: "地域の皆様に選ばれ続けています" },
        { number: "98%", label: "患者満足度", desc: "高品質な医療サービスの提供" },
        { number: "24/7", label: "救急対応", desc: "いつでも安心の医療体制" }
      ],
      specialties: [
        { name: "糖尿病専門外来", time: "月・木 午後", doctor: "専門医2名" },
        { name: "禁煙外来", time: "火・金 午前", doctor: "認定指導医" },
        { name: "睡眠時無呼吸外来", time: "水 終日", doctor: "専門医1名" }
      ]
    },
    about: {
      mission: "私たちは、地域に根ざした医療機関として、患者様の健康と幸せを第一に考え、質の高い医療サービスを提供します。",
      values: [
        { title: "信頼", desc: "患者様との信頼関係を大切にします" },
        { title: "革新", desc: "最新の医療技術を積極的に導入します" },
        { title: "連携", desc: "地域医療機関との連携を重視します" }
      ],
      history: [
        { year: "2010年", event: "クリニック開院" },
        { year: "2015年", event: "新館増設、MRI導入" },
        { year: "2020年", event: "地域医療連携センター開設" },
        { year: "2024年", event: "AI診断支援システム導入" }
      ],
      message: {
        title: "院長挨拶",
        content: "地域の皆様の健康を第一に考え、最新の医療技術と温かい心で診療にあたっています。どんな小さな不安も、お気軽にご相談ください。",
        name: "院長 山田太郎"
      },
      info: {
        established: "2010年4月",
        beds: "120床",
        staff: "医師15名、看護師40名、その他スタッフ30名",
        equipment: "MRI、CT、内視鏡、超音波診断装置 他"
      }
    },
    service: {
      departments: [
        { 
          name: "内科", 
          desc: "一般内科から専門外来まで幅広く対応",
          details: "風邪から生活習慣病まで、幅広い疾患に対応。健康診断も実施。"
        },
        { 
          name: "外科", 
          desc: "高度な手術技術で安全な治療を提供",
          details: "日帰り手術から入院手術まで、最新設備で安全に実施。"
        },
        { 
          name: "小児科", 
          desc: "お子様の健康を総合的にサポート",
          details: "予防接種、乳幼児健診、アレルギー相談など幅広く対応。"
        },
        { 
          name: "整形外科", 
          desc: "運動器の疾患・外傷を専門的に治療",
          details: "スポーツ外傷からリハビリまで、トータルサポート。"
        }
      ],
      medical_checkup: {
        title: "健康診断・人間ドック",
        plans: [
          { name: "基本健診", price: "8,000円〜", time: "約1時間" },
          { name: "生活習慣病健診", price: "15,000円〜", time: "約2時間" },
          { name: "人間ドック", price: "40,000円〜", time: "半日" }
        ]
      }
    }
  },
  care: {
    label: "介護施設・デイサービス",
    defaultName: "やすらぎの里",
    tagline: {
      professional: "専門的なケアで、安心の毎日を",
      innovative: "新しい介護の形で、豊かな生活を",
      friendly: "家族のような温かさで、寄り添います"
    },
    home: {
      hero: {
        title: {
          professional: "プロフェッショナルな介護で\n安心・安全な生活をサポート",
          innovative: "最新の介護技術で\n新しい生活スタイルを提案",
          friendly: "家族のような温かさで\n毎日に笑顔をお届けします"
        },
        description: "ご利用者様一人ひとりの個性を大切に、\n自立した生活を支援いたします"
      },
      features: [
        { title: "24時間体制", desc: "安心の介護サポート" },
        { title: "個別ケア", desc: "一人ひとりに合わせた支援" },
        { title: "充実設備", desc: "快適な生活環境" }
      ],
      stats: [
        { number: "500+", label: "累計利用者数", desc: "多くの方に選ばれています" },
        { number: "95%", label: "ご家族満足度", desc: "安心してお任せいただけます" },
        { number: "50名", label: "専門スタッフ", desc: "経験豊富なプロフェッショナル" }
      ],
      specialties: [
        { name: "認知症ケア", time: "専門スタッフ常駐", doctor: "認知症ケア専門士3名" },
        { name: "リハビリテーション", time: "毎日実施", doctor: "理学療法士2名" },
        { name: "レクリエーション", time: "日替わりプログラム", doctor: "専任スタッフ" }
      ]
    },
    about: {
      mission: "ご利用者様の尊厳を守り、その人らしい生活を実現するため、心のこもった介護サービスを提供します。",
      values: [
        { title: "尊重", desc: "個人の尊厳と自立を大切にします" },
        { title: "安心", desc: "安全で快適な環境を提供します" },
        { title: "笑顔", desc: "明るく温かい雰囲気づくりに努めます" }
      ],
      history: [
        { year: "2015年", event: "デイサービス開設" },
        { year: "2017年", event: "特別養護老人ホーム開設" },
        { year: "2020年", event: "訪問介護事業開始" },
        { year: "2023年", event: "地域交流スペース開設" }
      ],
      message: {
        title: "施設長メッセージ",
        content: "私たちは「第二の我が家」として、ご利用者様が安心して過ごせる環境づくりに努めています。スタッフ一同、真心を込めてお世話させていただきます。",
        name: "施設長 佐藤花子"
      },
      info: {
        established: "2015年7月",
        capacity: "入所定員50名、デイサービス定員30名",
        staff: "介護職員35名、看護師5名、その他10名",
        equipment: "機械浴、リハビリ機器、車椅子対応設備 完備"
      }
    },
    service: {
      departments: [
        { 
          name: "特別養護老人ホーム", 
          desc: "24時間365日の手厚い介護",
          details: "医療ケアが必要な方も安心。看護師常駐で医療機関と連携。"
        },
        { 
          name: "デイサービス", 
          desc: "日中の活動と交流の場を提供",
          details: "送迎付き。入浴、食事、レクリエーションで充実の一日を。"
        },
        { 
          name: "ショートステイ", 
          desc: "短期間の宿泊介護サービス",
          details: "ご家族の休息や急な用事の際も安心してご利用いただけます。"
        },
        { 
          name: "訪問介護", 
          desc: "ご自宅での生活を支援",
          details: "身体介護から生活援助まで、ご自宅での暮らしをサポート。"
        }
      ],
      medical_checkup: {
        title: "各種プログラム",
        plans: [
          { name: "体験利用", price: "無料", time: "1日" },
          { name: "デイサービス", price: "介護保険適用", time: "9:00-17:00" },
          { name: "ショートステイ", price: "介護保険適用", time: "1泊2日〜" }
        ]
      }
    }
  },
  welfare: {
    label: "福祉法人・NPO",
    defaultName: "みんなの未来",
    tagline: {
      professional: "専門性を活かし、社会に貢献",
      innovative: "新しい福祉の形を創造",
      friendly: "みんなで支え合う、温かい社会へ"
    },
    home: {
      hero: {
        title: {
          professional: "専門的な支援で\n一人ひとりの自立を実現",
          innovative: "革新的な福祉サービスで\n新しい可能性を創出",
          friendly: "みんなが笑顔になれる\n温かい社会を目指して"
        },
        description: "障がいのある方々が、地域で自分らしく\n生きることができる社会の実現を目指します"
      },
      features: [
        { title: "就労支援", desc: "働く喜びを実現" },
        { title: "生活支援", desc: "日常生活をサポート" },
        { title: "相談支援", desc: "専門スタッフが対応" }
      ],
      stats: [
        { number: "200+", label: "支援実績", desc: "多様なニーズに対応" },
        { number: "30+", label: "提携企業", desc: "就労機会の創出" },
        { number: "15年", label: "活動実績", desc: "地域に根ざした支援" }
      ],
      specialties: [
        { name: "就労移行支援", time: "平日9:00-17:00", doctor: "就労支援員5名" },
        { name: "生活訓練", time: "個別プログラム", doctor: "生活支援員3名" },
        { name: "余暇活動支援", time: "土日祝日", doctor: "ボランティア多数" }
      ]
    },
    about: {
      mission: "すべての人が、その人らしく生きることができる共生社会の実現を目指し、包括的な福祉サービスを提供します。",
      values: [
        { title: "共生", desc: "誰もが共に生きる社会を目指します" },
        { title: "自立", desc: "一人ひとりの自立を支援します" },
        { title: "参加", desc: "社会参加の機会を創出します" }
      ],
      history: [
        { year: "2012年", event: "NPO法人設立" },
        { year: "2015年", event: "就労継続支援B型事業所開設" },
        { year: "2018年", event: "相談支援事業開始" },
        { year: "2022年", event: "地域交流センター開設" }
      ],
      message: {
        title: "理事長より",
        content: "障がいの有無に関わらず、誰もが自分らしく生きられる社会を目指しています。地域の皆様と共に、新しい福祉の形を創っていきたいと考えています。",
        name: "理事長 鈴木次郎"
      },
      info: {
        established: "2012年10月",
        users: "登録利用者数 約200名",
        staff: "支援員20名、相談員5名、事務員3名",
        equipment: "作業場、相談室、多目的ホール 完備"
      }
    },
    service: {
      departments: [
        { 
          name: "就労継続支援B型", 
          desc: "働く場の提供と技能向上支援",
          details: "パン製造、清掃作業、農作業など多様な作業を提供。"
        },
        { 
          name: "生活介護", 
          desc: "日中活動と生活支援サービス",
          details: "創作活動、生産活動、余暇活動を通じて充実した日中を。"
        },
        { 
          name: "相談支援", 
          desc: "生活全般の相談と計画作成",
          details: "サービス利用計画の作成から日常の困りごとまで幅広く相談。"
        },
        { 
          name: "地域交流事業", 
          desc: "地域との繋がりを創出",
          details: "イベント開催、ボランティア受入れ、啓発活動を実施。"
        }
      ],
      medical_checkup: {
        title: "支援プログラム",
        plans: [
          { name: "見学・相談", price: "無料", time: "随時" },
          { name: "体験利用", price: "無料", time: "1週間まで" },
          { name: "各種支援サービス", price: "福祉サービス適用", time: "個別設定" }
        ]
      }
    }
  }
};

export default function MedicalCorporateDemo() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("hospital");
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
                    詳しく見る
                  </button>
                </div>
              </div>
            </section>

            {/* 特徴セクション */}
            <section className={`${styles.features} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>私たちの特徴</h2>
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

            {/* 専門外来・プログラム */}
            <section className={`${styles.specialties} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>
                  {businessType === 'hospital' ? '専門外来' : businessType === 'care' ? '特別プログラム' : '支援プログラム'}
                </h2>
                <div className={styles.specialtyGrid}>
                  {business.home.specialties.map((specialty, index) => (
                    <div key={index} className={styles.specialtyCard}>
                      <h3>{specialty.name}</h3>
                      <div className={styles.specialtyInfo}>
                        <p className={styles.specialtyTime}>{specialty.time}</p>
                        <p className={styles.specialtyDoctor}>{specialty.doctor}</p>
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
                <h1>法人紹介</h1>
                <p>私たちの理念と取り組み</p>
              </div>
            </section>

            {/* ミッション */}
            <section className={`${styles.mission} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>理念</h2>
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
                <h2 className={styles.sectionTitle}>基本情報</h2>
                <table className={styles.infoTable}>
                  <tbody>
                    <tr>
                      <th>法人名</th>
                      <td>{displayName}</td>
                    </tr>
                    <tr>
                      <th>設立</th>
                      <td>{business.about.info.established}</td>
                    </tr>
                    <tr>
                      <th>{businessType === 'hospital' ? '病床数' : businessType === 'care' ? '定員' : '利用者数'}</th>
                      <td>
                        {businessType === 'hospital' && 'beds' in business.about.info && business.about.info.beds}
                        {businessType === 'care' && 'capacity' in business.about.info && business.about.info.capacity}
                        {businessType === 'welfare' && 'users' in business.about.info && business.about.info.users}
                      </td>
                    </tr>
                    <tr>
                      <th>職員数</th>
                      <td>{business.about.info.staff}</td>
                    </tr>
                    <tr>
                      <th>設備</th>
                      <td>{business.about.info.equipment}</td>
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
                <h1>事業紹介</h1>
                <p>提供するサービス</p>
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

            {/* 料金プラン */}
            <section className={`${styles.pricing} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>{business.service.medical_checkup.title}</h2>
                <div className={styles.pricingGrid}>
                  {business.service.medical_checkup.plans.map((plan, index) => (
                    <div key={index} className={styles.pricingCard}>
                      <h3>{plan.name}</h3>
                      <div className={styles.pricingPrice}>{plan.price}</div>
                      <div className={styles.pricingTime}>所要時間: {plan.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 施設・設備 */}
            <section className={`${styles.facilities} ${styles[theme]}`}>
              <div className={styles.container}>
                <h2 className={styles.sectionTitle}>施設・設備</h2>
                <div className={styles.facilityGrid}>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>施設外観</span>
                    </div>
                    <p>最新設備を備えた清潔な施設</p>
                  </div>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>待合室・ロビー</span>
                    </div>
                    <p>リラックスできる快適な空間</p>
                  </div>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>診療室・作業室</span>
                    </div>
                    <p>プライバシーに配慮した個室</p>
                  </div>
                  <div className={styles.facilityCard}>
                    <div className={styles.imagePlaceholder}>
                      <span>リハビリ室・多目的室</span>
                    </div>
                    <p>充実した設備で機能回復をサポート</p>
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
                    <li>つくばエクスプレス「つくば駅」より徒歩10分</li>
                    <li>JR常磐線「土浦駅」よりバス20分</li>
                    <li>駐車場50台完備（無料）</li>
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
                    <h3>Q. 初診の際に必要なものは？</h3>
                    <p>A. 保険証、お薬手帳（お持ちの方）、紹介状（お持ちの方）をご持参ください。</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Q. 予約は必要ですか？</h3>
                    <p>A. 当日受付も可能ですが、待ち時間短縮のため事前予約をおすすめしています。</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h3>Q. 駐車場はありますか？</h3>
                    <p>A. 無料駐車場を50台分ご用意しております。</p>
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
                'あなたの法人でシミュレーション'
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
              <label>法人名</label>
              <input
                type="text"
                placeholder="あなたの法人名を入力"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={styles.companyNameInput}
              />
            </div>

            <div className={styles.controlGroup}>
              <label>業種</label>
              <div className={styles.buttonGroup}>
                <button
                  className={businessType === "hospital" ? styles.active : ""}
                  onClick={() => setBusinessType("hospital")}
                >
                  病院・クリニック
                </button>
                <button
                  className={businessType === "care" ? styles.active : ""}
                  onClick={() => setBusinessType("care")}
                >
                  介護施設
                </button>
                <button
                  className={businessType === "welfare" ? styles.active : ""}
                  onClick={() => setBusinessType("welfare")}
                >
                  福祉法人・NPO
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
              法人紹介
            </button>
            <button
              className={currentPage === 'service' ? styles.navActive : ''}
              onClick={() => setCurrentPage('service')}
            >
              事業紹介
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
              <p>つくばエクスプレス つくば駅より徒歩10分</p>
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