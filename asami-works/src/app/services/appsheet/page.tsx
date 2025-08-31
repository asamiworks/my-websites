import Head from "next/head";
import styles from "./AppSheetService.module.css";
import RelatedLinks from "@/components/RelatedLinks";

export const metadata = {
  title: "AppSheet業務改善システム開発 | エクセル業務をスマホアプリ化 - AsamiWorks",
  description: "AppSheet + GAS連携で業務効率化を実現。シフト管理・在庫管理・予約管理など、エクセル業務をスマホアプリに変換。初期費用80万円〜、月額5万円〜。実績：会員制高級クラブのシフト管理システム。",
  keywords: "AppSheet,業務改善,アプリ開発,GAS連携,シフト管理,在庫管理,予約管理,エクセル,スマホアプリ,Google Apps Script,LINE連携,業務効率化,DX,デジタルトランスフォーメーション",
  openGraph: {
    title: "AppSheet業務改善システム開発 | AsamiWorks",
    description: "エクセル業務をスマホアプリ化。GAS連携で自動計算も実現。",
    type: "website",
    url: "https://asami-works.com/services/appsheet",
    images: [{
      url: "https://asami-works.com/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "AppSheet業務改善システム"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "AppSheet業務改善システム開発 | AsamiWorks",
    description: "エクセル業務をスマホアプリ化。GAS連携で自動計算も実現。"
  }
};

export default function AppSheetService() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AppSheet業務改善システム開発",
    "provider": {
      "@type": "Organization",
      "name": "AsamiWorks"
    },
    "description": "AppSheet + GAS連携による業務改善システムの開発。エクセル業務をスマホアプリ化し、業務効率化を実現します。",
    "areaServed": "JP",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AppSheetサービスプラン",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "基本プラン",
          "price": "800000",
          "priceCurrency": "JPY",
          "description": "初期開発費用（要件定義・設計・開発・導入研修含む）"
        },
        {
          "@type": "Offer",
          "name": "月額利用料",
          "price": "50000",
          "priceCurrency": "JPY",
          "description": "AppSheet利用料・保守サポート・システムアップデート含む"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <link rel="canonical" href="https://asami-works.com/services/appsheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className={styles.container}>
        <section className={styles.hero} aria-label="AppSheet業務改善システムの紹介">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              エクセル業務を
              <br />
              スマホアプリに変える
            </h1>
            <p className={styles.heroDescription}>
              AppSheetで作る業務改善システム。プログラミング不要で3週間〜導入可能
            </p>
            <div className={styles.buttonGroup}>
              <a href="/form" className={styles.primaryButton} aria-label="無料相談の申し込みフォームへ">
                無料相談を申し込む
              </a>
              <a href="#cases" className={styles.secondaryButton} aria-label="導入イメージセクションへスクロール">
                導入イメージを見る
              </a>
            </div>
          </div>
        </section>

        <section className={styles.problemSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>こんな課題を解決します</h2>
            <div className={styles.problemGrid}>
              <div className={styles.problemItem}>
                <h3 className={styles.problemTitle}>エクセル管理の限界</h3>
                <p className={styles.problemDescription}>
                  複数人での同時編集ができず、データの不整合が発生
                </p>
              </div>
              <div className={styles.problemItem}>
                <h3 className={styles.problemTitle}>現場での入力が困難</h3>
                <p className={styles.problemDescription}>
                  スマホで使えないため、後でまとめて入力する二度手間
                </p>
              </div>
              <div className={styles.problemItem}>
                <h3 className={styles.problemTitle}>リアルタイム性の欠如</h3>
                <p className={styles.problemDescription}>
                  最新情報の共有が遅れ、意思決定のスピードが低下
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="cases" className={styles.casesSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>導入実績</h2>
            <div className={styles.caseDetailCard}>
              <div className={styles.caseDetailHeader}>
                <h3 className={styles.caseDetailTitle}>会員制高級クラブ：シフト・予約管理システム</h3>
                <span className={styles.gasTag}>GAS連携</span>
              </div>
              <div className={styles.caseDetailContent}>
                <div className={styles.caseOverview}>
                  <p>
                    会員制高級クラブで実際に運用中。スタッフのシフト提出をAppSheetで管理し、シフト提出の促しもLINE通知で自動化。
                    来店予約も管理できて、予約がオーバーブッキングする場合はエラーを表示。カレンダー形式で予約状況を確認でき、
                    個人情報を隠しているためキャスト間でのトラブルも防げます。
                  </p>
                </div>
                
                <div className={styles.caseFeatures}>
                  <h4 className={styles.caseFeaturesTitle}>実装した主な機能</h4>
                  <div className={styles.featuresList}>
                    <div className={styles.featureItem}>
                      <h5>シフト管理機能</h5>
                      <ul>
                        <li>スタッフ・キャストがスマホから簡単にシフト希望を提出</li>
                        <li>管理者はリアルタイムで提出状況を確認</li>
                        <li>未提出者への自動リマインド機能</li>
                      </ul>
                    </div>
                    <div className={styles.featureItem}>
                      <h5>LINE通知連携</h5>
                      <ul>
                        <li>毎週決まった時間にシフト提出をLINEで自動通知</li>
                        <li>新規予約が入った際にスタッフへLINE通知</li>
                        <li>重要な連絡事項の一斉送信</li>
                      </ul>
                    </div>
                    <div className={styles.featureItem}>
                      <h5>予約管理機能</h5>
                      <ul>
                        <li>出勤人数に基づく予約可否の自動判定</li>
                        <li>オーバーブッキング時のエラー表示</li>
                        <li>カレンダー形式での予約状況確認</li>
                      </ul>
                    </div>
                    <div className={styles.featureItem}>
                      <h5>プライバシー保護</h5>
                      <ul>
                        <li>個人情報の適切な表示制御</li>
                        <li>役職に応じたアクセス権限設定</li>
                        <li>キャスト間でのトラブル防止</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className={styles.caseResults}>
                  <h4 className={styles.caseResultsTitle}>導入効果</h4>
                  <ul className={styles.resultsList}>
                    <li><strong>シフト提出率100%達成</strong> - LINE通知により提出忘れがゼロに</li>
                    <li><strong>予約管理の完全デジタル化</strong> - 紙の台帳から脱却し、ミスを削減</li>
                    <li><strong>業務効率30%向上</strong> - 自動化により管理業務の時間を大幅削減</li>
                    <li><strong>スタッフ満足度向上</strong> - スマホで簡単操作、どこからでもアクセス可能</li>
                  </ul>
                </div>
                
                <div className={styles.caseTestimonial}>
                  <p className={styles.testimonialText}>
                    「導入前は紙の台帳とLINEグループでの連絡で管理していましたが、AppSheetとGAS連携により
                    すべてが自動化されました。特にLINE通知機能は、スタッフとのコミュニケーションを
                    スムーズにし、シフト提出率の大幅な改善につながりました。」
                  </p>
                  <p className={styles.testimonialAuthor}>- 店舗マネージャー様</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>AppSheetでできること</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <h3 className={styles.featureTitle}>スマホ・タブレット対応</h3>
                <p className={styles.featureDescription}>
                  iOS/Android両対応。現場でそのまま入力できるため、転記ミスや入力漏れを防止。
                </p>
              </div>
              <div className={styles.featureItem}>
                <h3 className={styles.featureTitle}>リアルタイムデータ共有</h3>
                <p className={styles.featureDescription}>
                  入力したデータは即座に反映。チーム全体で最新情報を共有できます。
                </p>
              </div>
              <div className={styles.featureItem}>
                <h3 className={styles.featureTitle}>自動通知・アラート</h3>
                <p className={styles.featureDescription}>
                  異常値や期限切れを自動検知してメール通知。見逃しを防ぎ迅速な対応が可能。
                </p>
              </div>
              <div className={styles.featureItem}>
                <h3 className={styles.featureTitle}>データ分析・可視化</h3>
                <p className={styles.featureDescription}>
                  蓄積データを自動集計しグラフ化。経営判断に必要な情報を一目で把握。
                </p>
              </div>
              <div className={styles.featureItem}>
                <h3 className={styles.featureTitle}>既存システム連携</h3>
                <p className={styles.featureDescription}>
                  Google Workspace、Excelなど既存のツールとシームレスに連携。
                </p>
              </div>
              <div className={styles.featureItem}>
                <h3 className={styles.featureTitle}>セキュアな環境</h3>
                <p className={styles.featureDescription}>
                  Googleのインフラを利用し、企業データを安全に管理。アクセス権限も細かく設定可能。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.gasSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.highlightText}>GAS連携で実現する</span>
              <br />
              スマートな自動計算
            </h2>
            <p className={styles.gasSubtitle}>
              AppSheet + Google Apps Script で、複雑な計算処理も自動化
            </p>
            
            <div className={styles.gasExampleCard}>
              <div className={styles.gasExampleHeader}>
                <h3 className={styles.gasExampleTitle}>導入実績：会員制高級クラブのシフト・予約管理</h3>
                <p className={styles.gasExampleBadge}>実際の運用事例</p>
              </div>
              <div className={styles.gasExampleContent}>
                <div className={styles.gasFlowDiagram}>
                  <div className={styles.gasFlowItem}>
                    <h4>AppSheet</h4>
                    <p>スタッフ・キャストがシフト希望を提出</p>
                  </div>
                  <div className={styles.gasFlowArrow}>→</div>
                  <div className={styles.gasFlowItem}>
                    <h4>GAS＋LINE</h4>
                    <p>シフト提出をLINEで自動リマインド</p>
                  </div>
                  <div className={styles.gasFlowArrow}>→</div>
                  <div className={styles.gasFlowItem}>
                    <h4>AppSheet</h4>
                    <p>出勤数に応じた予約管理・LINE通知</p>
                  </div>
                </div>
                <div className={styles.gasResultBox}>
                  <p className={styles.gasResultTitle}>実現した機能：</p>
                  <ul className={styles.gasResultList}>
                    <li>毎週決まった時間にシフト提出をLINEで自動通知</li>
                    <li>新規予約が入った際にスタッフへLINE通知</li>
                    <li>1週間分のシフトを半自動で作成（最終調整は手動）</li>
                    <li>出勤人数に基づく予約可否の管理</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.gasCapabilitiesGrid}>
              <div className={styles.gasCapability}>
                <h3 className={styles.gasCapabilityTitle}>自動計算・データ処理</h3>
                <p className={styles.gasCapabilityDescription}>
                  売上集計、在庫計算、勤怠計算など、AppSheetだけでは難しい複雑な計算処理をGASで実現
                </p>
              </div>
              <div className={styles.gasCapability}>
                <h3 className={styles.gasCapabilityTitle}>Google Workspace連携</h3>
                <p className={styles.gasCapabilityDescription}>
                  Gmail、カレンダー、ドライブ、スプレッドシートなど、Googleサービスとの深い連携が可能
                </p>
              </div>
              <div className={styles.gasCapability}>
                <h3 className={styles.gasCapabilityTitle}>定期実行・バッチ処理</h3>
                <p className={styles.gasCapabilityDescription}>
                  日次・週次・月次の自動集計、データのバックアップ、定期的なデータ更新など
                </p>
              </div>
              <div className={styles.gasCapability}>
                <h3 className={styles.gasCapabilityTitle}>LINE通知（実績あり）</h3>
                <p className={styles.gasCapabilityDescription}>
                  LINE Messaging APIを使った通知機能。シフト提出リマインドや予約通知などを自動化
                </p>
              </div>
            </div>

            <div className={styles.gasPotentialBox}>
              <h3 className={styles.gasPotentialTitle}>GAS連携で実現できる基本機能</h3>
              <div className={styles.gasPotentialGrid}>
                <div className={styles.gasPotentialItem}>
                  <p>メール自動送信・一斉配信</p>
                </div>
                <div className={styles.gasPotentialItem}>
                  <p>データの自動集計・グラフ作成</p>
                </div>
                <div className={styles.gasPotentialItem}>
                  <p>Googleカレンダー連携</p>
                </div>
                <div className={styles.gasPotentialItem}>
                  <p>LINE通知連携</p>
                </div>
              </div>
              <p className={styles.gasPotentialNote}>
                ※AppSheet単体では実現できない機能も、GAS連携により実現可能です。
                ただし、複雑な処理は開発コストが高くなるため、まずは基本的な機能から始めることをお勧めします。
              </p>
            </div>
          </div>
        </section>

        <section className={styles.approachSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>効率的な導入アプローチ</h2>
            <div className={styles.approachGrid}>
              <div className={styles.approachCard}>
                <h3 className={styles.approachTitle}>段階的な意思決定</h3>
                <p className={styles.approachDescription}>
                  まずは現在の業務フローを詳しくヒアリング。AppSheetでの実現可能性を検証し、決裁権限者の承認を得てから本格的な開発に着手します。
                </p>
              </div>
              <div className={styles.approachCard}>
                <h3 className={styles.approachTitle}>投資対効果の明確化</h3>
                <p className={styles.approachDescription}>
                  現状の人件費と導入後の削減効果を数値化。経営層が判断しやすい形で費用対効果をご提示します。
                </p>
              </div>
              <div className={styles.approachCard}>
                <h3 className={styles.approachTitle}>社内調整のサポート</h3>
                <p className={styles.approachDescription}>
                  稟議書作成に必要な資料提供や、IT部門への技術説明など、社内承認プロセスをサポートします。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.pricingSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>シンプルな料金体系</h2>
            <p className={styles.pricingSubtitle}>
              AppSheet利用料・保守サポート・アップデートすべて込みの安心価格
            </p>
            <div className={styles.pricingTable}>
              <div className={styles.pricingColumn}>
                <h3 className={styles.pricingTitle}>初期開発費用</h3>
                <div className={styles.pricingCard}>
                  <p className={styles.pricingAmount}>80万円〜</p>
                  <p className={styles.pricingNote}>（開発規模により変動）</p>
                  <ul className={styles.pricingList}>
                    <li>要件定義・設計</li>
                    <li>アプリ開発・実装</li>
                    <li>テスト・デバッグ</li>
                    <li>導入研修・マニュアル作成</li>
                  </ul>
                </div>
              </div>
              <div className={styles.pricingColumn}>
                <h3 className={styles.pricingTitle}>月額利用料</h3>
                <div className={styles.pricingCard}>
                  <p className={styles.pricingAmount}>5万円〜</p>
                  <p className={styles.pricingNote}>（利用人数により変動）</p>
                  <ul className={styles.pricingList}>
                    <li>AppSheet利用料込み（利用人数により変動）</li>
                    <li>日常サポート対応</li>
                    <li>月次レポート作成</li>
                    <li>システムアップデート</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className={styles.roiNote}>
              <p>
                ※AppSheetのライセンス費用は利用人数により変動します。詳細はお問い合わせください。
              </p>
            </div>
          </div>
        </section>

        <section className={styles.flowSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>導入までの流れ</h2>
            <div className={styles.flowGrid}>
              <div className={styles.flowItem}>
                <div className={styles.flowNumber}>1</div>
                <h3 className={styles.flowTitle}>無料相談・概要説明</h3>
                <p className={styles.flowDescription}>
                  課題をヒアリング。AppSheetでできることと、貴社の業務への適用可能性をご説明します。
                </p>
                <p className={styles.flowDuration}>30〜60分</p>
              </div>
              <div className={styles.flowItem}>
                <div className={styles.flowNumber}>2</div>
                <h3 className={styles.flowTitle}>決裁権限者との面談</h3>
                <p className={styles.flowDescription}>
                  投資対効果の説明と概算見積をご提示。社内検討に必要な資料もご提供します。
                </p>
                <p className={styles.flowDuration}>1〜2週間</p>
              </div>
              <div className={styles.flowItem}>
                <div className={styles.flowNumber}>3</div>
                <h3 className={styles.flowTitle}>要件定義・プロトタイプ開発</h3>
                <p className={styles.flowDescription}>
                  ご契約後、詳細な要件定義を実施。実際の業務に即したプロトタイプを開発します。
                </p>
                <p className={styles.flowDuration}>2〜3週間</p>
              </div>
              <div className={styles.flowItem}>
                <div className={styles.flowNumber}>4</div>
                <h3 className={styles.flowTitle}>導入・運用開始</h3>
                <p className={styles.flowDescription}>
                  操作研修を実施し、本番運用開始。導入後も継続的にサポートします。
                </p>
                <p className={styles.flowDuration}>1〜2日</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.faqSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>よくあるご質問</h2>
            <div className={styles.faqGrid}>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>プログラミング知識は必要ですか？</h3>
                <p className={styles.faqAnswer}>
                  いいえ、お客様側では不要です。弊社が開発・設定を行い、お客様は通常のアプリとして利用するだけです。
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>既存のエクセルデータは移行できますか？</h3>
                <p className={styles.faqAnswer}>
                  はい、可能です。既存のエクセルデータをそのまま活用し、AppSheetアプリに移行できます。
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>セキュリティは大丈夫ですか？</h3>
                <p className={styles.faqAnswer}>
                  AppSheetはGoogleのインフラを使用し、企業向けの高いセキュリティ基準を満たしています。
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>どんな業務に向いていますか？</h3>
                <p className={styles.faqAnswer}>
                  定型的な入力業務、承認フロー、データ収集・分析など、エクセルで管理している業務全般に適しています。
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>GAS連携で何ができますか？</h3>
                <p className={styles.faqAnswer}>
                  複雑な自動計算、Google Workspace連携、定期的なデータ集計、LINE通知などが可能です。AppSheet単体では難しい処理もGASとの連携で実現できます。
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>導入後の変更は可能ですか？</h3>
                <p className={styles.faqAnswer}>
                  はい、業務の変化に応じて機能追加や修正が可能です。GAS連携により、計算ロジックの変更などにも柔軟に対応できます。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>まずは無料相談でご状況をお聞かせください</h2>
            <p className={styles.ctaDescription}>
              現在の課題と業務フローをヒアリングし、AppSheetでの解決方法をご提案いたします。<br />
              貴社の業務に合わせた具体的な活用イメージをご説明します。
            </p>
            <a href="/form" className={styles.ctaButton}>
              無料相談を申し込む
            </a>
          </div>
        </section>
      </div>
      
      <RelatedLinks />
    </>
  );
}