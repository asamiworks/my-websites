import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ScrollAnimation from '../../components/ScrollAnimation'

// ヒーロー画像のインポート
import hero1 from '../../assets/images/hero/hero-01.jpg'

function Photography() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="photography-page">
      {/* ヒーローセクション */}
      <section className="section-hero photo-section">
        <img src={hero1} alt="Photography" className="photo-bg" />
        <div className="hero-overlay"></div>
        <div style={{ 
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          color: 'var(--washi-white)'
        }}>
          <h1 className="hero-title" style={{ color: 'var(--washi-white)', textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)' }}>Photography</h1>
          <p className="hero-subtitle" style={{ color: 'var(--washi-white)', textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>特別な瞬間を、永遠の記憶に</p>
        </div>
      </section>

      {/* サービス紹介 */}
      <section className="section">
        <div className="container">
          <ScrollAnimation>
            <div className="text-center mb-xl">
              <h2>撮影サービス</h2>
              <p className="text-lead">
                ウェディングから企業PRまで<br />
                あらゆるシーンで心に残る写真を撮影します
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation>
            <div className="grid grid-3 mb-xl">
              <div className="card">
                <h3>Wedding</h3>
                <p className="text-handwrite mb-sm">一生に一度の特別な日</p>
                <p className="text-small">
                  前撮り、当日撮影、フォトウェディングなど、お二人の幸せな瞬間を美しく自然な形で記録します。
                  和装・洋装どちらにも対応し、ロケーション撮影も承ります。
                </p>
              </div>
              <div className="card">
                <h3>Portrait</h3>
                <p className="text-handwrite mb-sm">あなたらしさを引き出す</p>
                <p className="text-small">
                  プロフィール写真、宣材写真、家族写真、マタニティフォトなど、
                  自然な表情と雰囲気を大切に、その人らしさを引き出す撮影を心がけています。
                </p>
              </div>
              <div className="card">
                <h3>Corporate</h3>
                <p className="text-handwrite mb-sm">企業の魅力を伝える</p>
                <p className="text-small">
                  会社案内、採用広報、商品撮影、イベント記録など、
                  ビジネスシーンに必要な撮影を幅広く承ります。企業の想いを写真で表現します。
                </p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* 撮影の流れ */}
      <section className="section" style={{ backgroundColor: 'var(--misaki-lightest)' }}>
        <div className="container">
          <ScrollAnimation>
            <h2 className="text-center mb-lg">撮影の流れ</h2>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="mb-md">
                <h4>1. お問い合わせ・ヒアリング</h4>
                <p className="text-small">
                  まずはお気軽にご相談ください。撮影の目的、イメージ、ご予算などをお伺いし、最適なプランをご提案します。
                </p>
              </div>
              <div className="mb-md">
                <h4>2. お見積もり・ご契約</h4>
                <p className="text-small">
                  ヒアリング内容を基に、詳細なお見積もりをご提示します。内容にご納得いただけましたら、ご契約となります。
                </p>
              </div>
              <div className="mb-md">
                <h4>3. 撮影準備・打ち合わせ</h4>
                <p className="text-small">
                  撮影場所の下見、当日のスケジュール確認、衣装や小物の準備など、細かな打ち合わせを行います。
                </p>
              </div>
              <div className="mb-md">
                <h4>4. 撮影当日</h4>
                <p className="text-small">
                  リラックスした雰囲気の中で撮影を進めます。自然な表情を引き出しながら、ご希望のイメージを形にしていきます。
                </p>
              </div>
              <div className="mb-md">
                <h4>5. 写真の選定・納品</h4>
                <p className="text-small">
                  撮影後、丁寧に編集を行い、最高の仕上がりでお届けします。データ納品、アルバム制作など、ご希望に応じて対応いたします。
                </p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* 制作実績へのCTA */}
      <section className="section">
        <div className="container">
          <ScrollAnimation>
            <div className="text-center">
              <h2 className="mb-md">制作実績</h2>
              <p className="text-lead mb-lg">
                これまでに撮影させていただいた作品をご覧ください。<br />
                お客様の大切な瞬間を、心を込めて撮影しています。
              </p>
              <Link to="/business/photography/works" className="btn btn-primary" style={{ marginRight: '1rem' }}>
                作品を見る
              </Link>
              <Link to="/business" className="btn btn-secondary">
                事業一覧に戻る
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* お問い合わせCTA */}
      <section className="section" style={{ backgroundColor: 'var(--washi-cream)' }}>
        <div className="container">
          <ScrollAnimation>
            <div className="text-center">
              <h2 className="mb-md">撮影のご依頼・お問い合わせ</h2>
              <p className="text-lead mb-md">
                料金や詳細については、お気軽にお問い合わせください。<br />
                ご希望に合わせた最適なプランをご提案いたします。
              </p>
              <Link to="/contact" className="btn btn-primary">
                お問い合わせはこちら
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  )
}

export default Photography