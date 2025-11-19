import { Metadata } from "next";
import styles from "./CorporateService.module.css";
import RelatedLinks from "@/components/RelatedLinks";

export const metadata: Metadata = {
  title: "コーポレートサイト制作 | SEO・AIO対策対応 - AsamiWorks",
  description: "AI時代だからこそ、現場に足を運び企業の雰囲気を感じて制作。SEO対策に加えAI検索最適化（AIO）にも対応。見つけてもらえるコーポレートサイトを構築します。",
  keywords: ["コーポレートサイト", "企業サイト", "Web制作", "SEO対策", "AIO対策", "AI最適化", "茨城", "千葉"],
  openGraph: {
    title: "コーポレートサイト制作 | SEO・AIO対策対応 - AsamiWorks",
    description: "AI時代だからこそ、現場に足を運び企業の雰囲気を感じて制作。SEO対策に加えAI検索最適化（AIO）にも対応。",
    url: "https://asami-works.com/services/original/corporate",
    siteName: "AsamiWorks",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "コーポレートサイト制作 | SEO・AIO対策対応",
    description: "AI時代だからこそ、現場訪問とSEO・AIO対策で差別化",
  },
  alternates: {
    canonical: "/services/original/corporate",
  },
};

export default function CorporateService() {
  return (
    <div className={styles.container}>
      {/* ヒーローセクション */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            AI時代だからこそ
            <br />
            "人"が作る価値がある
          </h1>
          <p className={styles.heroDescription}>
            現場の空気を感じ、企業の本質を捉えたサイトを
          </p>
          <div className={styles.buttonGroup}>
            <a href="/form" className={styles.primaryButton}>
              無料相談を予約する
            </a>
            <a href="#approach" className={styles.secondaryButton}>
              詳細を見る
            </a>
          </div>
        </div>
      </section>

      {/* 課題提起セクション */}
      <section className={styles.challengeSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>誰でもサイトが作れる時代の課題</h2>
          <div className={styles.challengeContent}>
            <p className={styles.challengeText}>
              AIの発達により、今や誰でも手軽にホームページを作成できるようになりました。
              しかし、それは同時に膨大な数のWebサイトが存在することを意味します。
            </p>
            <p className={styles.challengeText}>
              <strong>作ったサイトは、見つけてもらえていますか？</strong>
            </p>
            <p className={styles.challengeText}>
              従来のSEO対策だけでは不十分な時代です。
              ChatGPTやPerplexityなどのAI検索が普及する中、
              <strong>AI検索最適化（AIO）</strong>への対応が、
              これからのWebサイトには欠かせません。
            </p>
          </div>
        </div>
      </section>

      {/* アプローチセクション */}
      <section id="approach" className={styles.approachSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>私たちのアプローチ</h2>
          <div className={styles.approachGrid}>
            <div className={styles.approachItem}>
              <h3 className={styles.approachTitle}>現場訪問による深い理解</h3>
              <p className={styles.approachDescription}>
                貴社のオフィスや店舗に足を運び、働く人々の姿、空間の雰囲気、
                お客様との接点を自分の目で見て感じます。
                その体験が、言葉では伝えきれない企業の魅力をサイトに反映させる原動力になります。
              </p>
              <p className={styles.approachNote}>
                ※関東圏内は出張費込み。圏外は別途お見積もり
              </p>
            </div>
            <div className={styles.approachItem}>
              <h3 className={styles.approachTitle}>SEO + AIO 対策</h3>
              <p className={styles.approachDescription}>
                Google検索への最適化（SEO）はもちろん、
                AI検索エンジンに正確に情報を伝える構造化データやセマンティックなマークアップを実装。
                人にもAIにも「見つけてもらえる」サイトを構築します。
              </p>
            </div>
            <div className={styles.approachItem}>
              <h3 className={styles.approachTitle}>企業の本質を伝えるデザイン</h3>
              <p className={styles.approachDescription}>
                テンプレートの流用ではなく、現場で感じた企業の個性や強みを
                デザインに落とし込みます。
                訪問者に「この会社と取引したい」と思わせる説得力のあるサイトを制作します。
              </p>
            </div>
            <div className={styles.approachItem}>
              <h3 className={styles.approachTitle}>継続的な改善サポート</h3>
              <p className={styles.approachDescription}>
                公開して終わりではありません。
                アクセス解析をもとにした改善提案や、コンテンツ更新のサポートで
                サイトの価値を維持・向上させます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AIOとは */}
      <section className={styles.aioSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>AIO（AI検索最適化）とは</h2>
          <div className={styles.aioContent}>
            <p className={styles.aioText}>
              AIO（AI Optimization）とは、ChatGPTやPerplexity、Google AIなどの
              AI検索エンジンに対してWebサイトの情報を正確に伝えるための最適化技術です。
            </p>
            <div className={styles.aioFeatures}>
              <div className={styles.aioFeature}>
                <h4>構造化データの実装</h4>
                <p>企業情報、サービス内容、所在地などをAIが理解しやすい形式で記述</p>
              </div>
              <div className={styles.aioFeature}>
                <h4>セマンティックなHTML</h4>
                <p>文章の意味や文脈をAIが正確に把握できるマークアップ</p>
              </div>
              <div className={styles.aioFeature}>
                <h4>明確なコンテンツ構造</h4>
                <p>質問と回答の形式など、AIが情報を抽出しやすい構成</p>
              </div>
            </div>
            <p className={styles.aioText}>
              これらの対策により、AI検索の回答に貴社の情報が引用される可能性が高まります。
            </p>
          </div>
        </div>
      </section>

      {/* 制作内容 */}
      <section className={styles.structureSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>制作内容</h2>
          <div className={styles.structureCard}>
            <div>
              <h3 className={styles.structureTitle}>基本4ページ構成</h3>
              <ul className={styles.structureList}>
                <li className={styles.structureItem}>
                  <span className={styles.structureNumber}>1.</span>
                  <div className={styles.structureContent}>
                    <p className={styles.structurePageTitle}>トップページ</p>
                    <p className={styles.structurePageDescription}>企業の第一印象を決める重要なページ。キービジュアル、主要サービス、最新情報などを配置</p>
                  </div>
                </li>
                <li className={styles.structureItem}>
                  <span className={styles.structureNumber}>2.</span>
                  <div className={styles.structureContent}>
                    <p className={styles.structurePageTitle}>会社概要</p>
                    <p className={styles.structurePageDescription}>企業情報、代表挨拶、沿革、アクセスマップなど信頼性を高める情報を掲載</p>
                  </div>
                </li>
                <li className={styles.structureItem}>
                  <span className={styles.structureNumber}>3.</span>
                  <div className={styles.structureContent}>
                    <p className={styles.structurePageTitle}>事業内容</p>
                    <p className={styles.structurePageDescription}>提供サービスや商品を分かりやすく紹介。強みや特徴をアピール</p>
                  </div>
                </li>
                <li className={styles.structureItem}>
                  <span className={styles.structureNumber}>4.</span>
                  <div className={styles.structureContent}>
                    <p className={styles.structurePageTitle}>お問い合わせ</p>
                    <p className={styles.structurePageDescription}>フォーム、電話番号、営業時間など、顧客との接点を明確に</p>
                  </div>
                </li>
              </ul>
              <div className={styles.structureIncludes}>
                <p className={styles.includesTitle}>すべてのプランに含まれるもの：</p>
                <ul className={styles.includesList}>
                  <li>スマホ・タブレット完全対応</li>
                  <li>SEO内部対策</li>
                  <li>AIO対策（構造化データ実装）</li>
                  <li>SSL証明書設定</li>
                  <li>お問い合わせフォーム</li>
                  <li>現場出張（関東圏内）</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* こんな企業様に */}
      <section className={styles.targetSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>こんな企業様におすすめ</h2>
          <div className={styles.targetGrid}>
            <div className={styles.targetItem}>
              <h3 className={styles.targetTitle}>Webからの問い合わせを増やしたい</h3>
              <p className={styles.targetDescription}>SEO・AIO対策で検索からの流入を強化し、問い合わせにつなげます</p>
            </div>
            <div className={styles.targetItem}>
              <h3 className={styles.targetTitle}>自社の魅力がうまく伝わっていない</h3>
              <p className={styles.targetDescription}>現場訪問で感じた強みを、説得力のあるコンテンツに変換します</p>
            </div>
            <div className={styles.targetItem}>
              <h3 className={styles.targetTitle}>AIで作ったサイトに違和感がある</h3>
              <p className={styles.targetDescription}>人の手と目で作る、温かみと信頼感のあるデザインを提供します</p>
            </div>
            <div className={styles.targetItem}>
              <h3 className={styles.targetTitle}>大手制作会社は敷居が高い</h3>
              <p className={styles.targetDescription}>個人事業だからこその柔軟さと、丁寧なコミュニケーションで対応します</p>
            </div>
          </div>
        </div>
      </section>

      {/* 制作の流れ */}
      <section className={styles.flowSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>制作の流れ</h2>
          <div className={styles.flowList}>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>1</div>
              <div className={styles.flowContent}>
                <h3>無料相談・ヒアリング</h3>
                <p>オンラインまたは対面で、現状の課題や目標をお聞きします</p>
              </div>
            </div>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>2</div>
              <div className={styles.flowContent}>
                <h3>現場訪問</h3>
                <p>貴社を訪問し、雰囲気や強みを体感。写真撮影も可能です</p>
              </div>
            </div>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>3</div>
              <div className={styles.flowContent}>
                <h3>構成・デザイン提案</h3>
                <p>訪問で得た情報をもとに、サイト構成とデザインを作成</p>
              </div>
            </div>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>4</div>
              <div className={styles.flowContent}>
                <h3>制作・SEO/AIO実装</h3>
                <p>デザイン確定後、コーディングと各種最適化を実施</p>
              </div>
            </div>
            <div className={styles.flowItem}>
              <div className={styles.flowNumber}>5</div>
              <div className={styles.flowContent}>
                <h3>公開・運用開始</h3>
                <p>最終確認後に公開。継続的なサポートもご用意しています</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 料金について */}
      <section className={styles.pricingSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>料金について</h2>
          <div className={styles.pricingContent}>
            <p className={styles.pricingText}>
              基本プラン（4ページ構成・出張費込み）は<strong>600,000円〜</strong>（税抜）です。
            </p>
            <p className={styles.pricingText}>
              ページ追加、WordPress導入、多言語対応など、
              ご要望に応じたオプションもご用意しています。
              詳細は見積もりフォームでシミュレーションいただくか、
              無料相談でお気軽にお尋ねください。
            </p>
            <div className={styles.pricingButtons}>
              <a href="/estimate" className={styles.estimateButton}>
                見積もりシミュレーション
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>まずはお話をお聞かせください</h2>
          <p className={styles.ctaDescription}>
            「こんなサイトにしたい」「今のサイトの課題は…」など、
            漠然としたイメージでも構いません。
            お話を伺いながら、最適な形を一緒に考えていきます。
          </p>
          <a href="/form" className={styles.ctaButton}>
            無料相談を予約する
          </a>
        </div>
      </section>

      <RelatedLinks />
    </div>
  );
}
