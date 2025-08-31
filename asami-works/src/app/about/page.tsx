import Link from 'next/link';
import styles from './About.module.css';

export const metadata = {
  title: 'AsamiWorksについて | Web制作・デザイン・補助金サポート',
  description: 'AsamiWorksは、中小企業・個人事業主様のデジタル化を支援するWeb制作サービスです。ホームページ制作から補助金申請サポートまで、ワンストップでご提供します。',
  openGraph: {
    title: 'AsamiWorksについて | Web制作・デザイン・補助金サポート',
    description: 'AsamiWorksは、中小企業・個人事業主様のデジタル化を支援するWeb制作サービスです。',
  },
};

export default function AboutPage() {
  return (
    <main className={styles.main}>
      {/* ヒーローセクション */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleMain}>AsamiWorks</span>
            <span className={styles.heroTitleSub}>あなたのビジネスを次のステージへ</span>
          </h1>
          <p className={styles.heroDescription}>
            Web制作から補助金申請まで、<br />
            デジタル化の全てをサポートします
          </p>
          <div className={styles.heroCta}>
            <Link href="/estimate" className={styles.ctaButtonPrimary}>
              料金シミュレーション
            </Link>
            <Link href="/form" className={styles.ctaButtonSecondary}>
              無料相談する
            </Link>
          </div>
        </div>
      </section>

      {/* AsamiWorksについて */}
      <section className={styles.about}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionTitleEn}>About</span>
            <span className={styles.sectionTitleJa}>AsamiWorksについて</span>
          </h2>
          
          <div className={styles.aboutContent}>
            <div className={styles.aboutMain}>
              <p className={styles.aboutLead}>
                AsamiWorksは、茨城県を拠点に活動するWeb制作サービスです。<br />
                「デジタルの力で、すべてのビジネスに新しい可能性を」をモットーに、
                中小企業・個人事業主様のデジタル化を全力でサポートしています。
              </p>
              
              <div className={styles.aboutFeatures}>
                <div className={styles.featureCard}>
                  <h3 className={styles.featureTitle}>デザイン × 戦略</h3>
                  <p className={styles.featureDescription}>
                    見た目の美しさだけでなく、ビジネスの成果につながるデザインを追求します
                  </p>
                </div>
                
                <div className={styles.featureCard}>
                  <h3 className={styles.featureTitle}>補助金サポート</h3>
                  <p className={styles.featureDescription}>
                    IT導入補助金など、各種補助金の申請からサポートまでワンストップで対応
                  </p>
                </div>
                
                <div className={styles.featureCard}>
                  <h3 className={styles.featureTitle}>スピード対応</h3>
                  <p className={styles.featureDescription}>
                    お客様のビジネスチャンスを逃さない、迅速かつ丁寧な対応を心がけています
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 制作実績セクション */}
      <section className={styles.works}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionTitleEn}>Works</span>
            <span className={styles.sectionTitleJa}>制作実績</span>
          </h2>
          <div className={styles.worksGrid}>
            
            <article className={styles.workCard}>
              <div className={styles.workImageWrapper}>
                <img
                  src="/images/works/nodebase.jpg"
                  alt="株式会社ノードベース ホームページ"
                  className={styles.workImage}
                />
                <div className={styles.workOverlay}>
                  <Link 
                    href="https://nodebase.jp" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.workViewButton}
                  >
                    サイトを見る →
                  </Link>
                </div>
              </div>
              <div className={styles.workInfo}>
                <h3 className={styles.workTitle}>株式会社ノードベース</h3>
                <p className={styles.workDescription}>
                  「つながる、ひろがる」をコンセプトに、教育・写真・結婚相談の3事業を展開。将来の事業拡張を見据えた拡張性の高い設計で、React + Viteによるモダンな技術スタックを採用。
                </p>
                <div className={styles.workTags}>
                  <span className={styles.workTag}>React開発</span>
                  <span className={styles.workTag}>コーポレートサイト</span>
                </div>
              </div>
            </article>
            
            <article className={styles.workCard}>
              <div className={styles.workImageWrapper}>
                <img
                  src="/images/works/pilias-artmake.jpg"
                  alt="PILIAS ARTMAKE ホームページ"
                  className={styles.workImage}
                />
                <div className={styles.workOverlay}>
                  <Link 
                    href="https://pilias-artmake.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.workViewButton}
                  >
                    サイトを見る →
                  </Link>
                </div>
              </div>
              <div className={styles.workInfo}>
                <h3 className={styles.workTitle}>PILIAS ARTMAKE</h3>
                <p className={styles.workDescription}>
                  美しさを追求する方や、傷痕や白斑などの医療的な悩みを抱えている方に真摯に向き合う、完全予約制のパラメディカルアートメイク・医療アートメイク
                </p>
                <div className={styles.workTags}>
                  <span className={styles.workTag}>医療系</span>
                  <span className={styles.workTag}>オリジナルデザイン</span>
                </div>
              </div>
            </article>

            <article className={styles.workCard}>
              <div className={styles.workImageWrapper}>
                <img
                  src="/images/works/appare-seitai.jpg"
                  alt="天晴れ整体院 ホームページ"
                  className={styles.workImage}
                />
                <div className={styles.workOverlay}>
                  <Link 
                    href="https://appare-seitai.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.workViewButton}
                  >
                    サイトを見る →
                  </Link>
                </div>
              </div>
              <div className={styles.workInfo}>
                <h3 className={styles.workTitle}>天晴れ整体院</h3>
                <p className={styles.workDescription}>
                  完全予約制で一人ひとりに寄り添う施術を提供する整体院。丁寧なカウンセリングと確かな技術が特徴。
                </p>
                <div className={styles.workTags}>
                  <span className={styles.workTag}>LP制作</span>
                  <span className={styles.workTag}>SEO対策</span>
                </div>
              </div>
            </article>

            <article className={styles.workCard}>
              <div className={styles.workImageWrapper}>
                <img
                  src="/images/works/adachi-electric.jpg"
                  alt="株式会社足立電気 ホームページ"
                  className={styles.workImage}
                />
                <div className={styles.workOverlay}>
                  <Link 
                    href="https://jh-ad.jp" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.workViewButton}
                  >
                    サイトを見る →
                  </Link>
                </div>
              </div>
              <div className={styles.workInfo}>
                <h3 className={styles.workTitle}>株式会社足立電気</h3>
                <p className={styles.workDescription}>
                  茨城県龍ヶ崎にある電気設備・公共工事を中心とした地域密着型の電気会社様
                </p>
                <div className={styles.workTags}>
                  <span className={styles.workTag}>コーポレートサイト</span>
                  <span className={styles.workTag}>レスポンシブ対応</span>
                </div>
              </div>
            </article>

            <article className={styles.workCard}>
              <div className={styles.workImageWrapper}>
                <img
                  src="/images/works/members-club-zen.jpg"
                  alt="メンバーズクラブ善 ホームページ"
                  className={styles.workImage}
                />
                <div className={styles.workOverlay}>
                  <Link 
                    href="https://club-zen.jp/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.workViewButton}
                  >
                    サイトを見る →
                  </Link>
                </div>
              </div>
              <div className={styles.workInfo}>
                <h3 className={styles.workTitle}>メンバーズクラブ善</h3>
                <p className={styles.workDescription}>
                  茨城県つくば市にある会員制高級クラブ。WordPressを利用しているため、スタッフがブログ投稿も可能。
                </p>
                <div className={styles.workTags}>
                  <span className={styles.workTag}>WordPress</span>
                  <span className={styles.workTag}>Instagram連携</span>
                </div>
              </div>
            </article>

            <article className={styles.workCard}>
              <div className={styles.workImageWrapper}>
                <img
                  src="/images/works/ibaraki-memorial.jpg"
                  alt="茨城メモリアルパーク ホームページ"
                  className={styles.workImage}
                />
                <div className={styles.workOverlay}>
                  <Link 
                    href="https://ibaraki-memorial-park.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.workViewButton}
                  >
                    サイトを見る →
                  </Link>
                </div>
              </div>
              <div className={styles.workInfo}>
                <h3 className={styles.workTitle}>茨城メモリアルパーク</h3>
                <p className={styles.workDescription}>
                  茨城県土浦市にあるリース型霊園。広い敷地とアクセス性の良さが特徴。
                </p>
                <div className={styles.workTags}>
                  <span className={styles.workTag}>LP制作</span>
                  <span className={styles.workTag}>SEO対策</span>
                </div>
              </div>
            </article>

            <article className={styles.workCard}>
              <div className={styles.workImageWrapper}>
                <img
                  src="/images/works/wild-dirt-rc.jpg"
                  alt="ワイルドダートRCつくば ホームページ"
                  className={styles.workImage}
                />
                <div className={styles.workOverlay}>
                  <Link 
                    href="https://wrc-tsukuba.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.workViewButton}
                  >
                    サイトを見る →
                  </Link>
                </div>
              </div>
              <div className={styles.workInfo}>
                <h3 className={styles.workTitle}>ワイルドダートRCつくば</h3>
                <p className={styles.workDescription}>
                  日本最大級の屋外ラジコンコースを展開するRCサーキット場
                </p>
                <div className={styles.workTags}>
                  <span className={styles.workTag}>LP制作</span>
                  <span className={styles.workTag}>モバイル対応</span>
                </div>
              </div>
            </article>
            
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>
            まずは無料でご相談ください
          </h2>
          <p className={styles.ctaDescription}>
            お客様のビジネスに最適なソリューションをご提案します
          </p>
          
          <div className={styles.ctaButtons}>
            <div className={styles.ctaCard}>
              <h3 className={styles.ctaCardTitle}>料金シミュレーション</h3>
              <p className={styles.ctaCardDescription}>
                最短30秒で概算見積もりが確認できます
              </p>
              <Link href="/estimate" className={styles.ctaCardButton}>
                今すぐ試してみる →
              </Link>
            </div>
            
            <div className={styles.ctaCard}>
              <h3 className={styles.ctaCardTitle}>無料相談</h3>
              <p className={styles.ctaCardDescription}>
                代表が直接、丁寧にヒアリングいたします
              </p>
              <Link href="/form" className={styles.ctaCardButton}>
                相談を申し込む →
              </Link>
            </div>
          </div>
          
          <div className={styles.ctaNote}>
            <p>
              相談は完全無料・売り込みは一切ありません
            </p>
            <p>
              オンライン相談も可能です
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}