import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ScrollAnimation from '../components/ScrollAnimation'
import '../styles/pages/Business.css'

// Home.jsxと同じ画像をインポート（1500×1000pxに統一）
import educationImage from '../assets/images/business/education-main.jpg'
import photographyImage from '../assets/images/business/photography-main.jpg'
import marriageImage from '../assets/images/business/marriage-main.jpg'

function Business() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 事業データ（画像を全てに追加）
  const businesses = [
    {
      id: 'education',
      title: 'Education',
      catchphrase: '学びを通じて、未来を創る',
      description: 'プログラミングからビジネススキルまで、実践的な学びの場を提供。個人の成長と可能性を最大限に引き出す教育プログラムで、新しい未来を切り拓きます。',
      image: educationImage,
      status: 'Coming Soon',
      isActive: false
    },
    {
      id: 'photography',
      title: 'Photography',
      catchphrase: '特別な瞬間を、永遠の記憶に',
      description: 'ウェディングから企業PRまで、特別な瞬間を美しく切り取り、心に残る作品として形にします。一瞬の輝きを永遠の価値に変える、プロフェッショナルな撮影サービスを提供しています。',
      image: photographyImage,
      status: 'サービス提供中',
      link: '/business/photography/works',
      isActive: true
    },
    {
      id: 'marriage',
      title: 'Marriage Consulting',
      catchphrase: '人生のパートナーとの出会いをサポート',
      description: '理想のパートナーとの出会いから成婚まで、専任カウンセラーが寄り添いながらサポート。あなたの幸せな未来への第一歩を、私たちと一緒に踏み出しましょう。',
      image: marriageImage,
      status: 'Coming Soon',
      isActive: false
    }
  ]

  return (
    <div className="business-page">
      <section className="section">
        <div className="container">
          <ScrollAnimation>
            <div className="business-header">
              <h1>Business</h1>
              <p className="lead-text">
                株式会社ノードベースは、写真・結婚相談・教育の3つの事業を通じて、<br />
                人々の大切な瞬間と成長をサポートします。
              </p>
            </div>
          </ScrollAnimation>

          <div className="business-grid">
            {businesses.map((business, index) => (
              <ScrollAnimation key={business.id} delay={index * 0.2}>
                <div className="business-card">
                  {/* 画像セクション */}
                  <div className="business-card-image">
                    <img 
                      src={business.image} 
                      alt={business.title}
                    />
                    {/* ステータスバッジ */}
                    <div 
                      className={`business-status-badge ${
                        business.isActive ? 'active' : 'coming-soon'
                      }`}
                    >
                      {business.status}
                    </div>
                  </div>
                  
                  {/* コンテンツセクション */}
                  <div className="business-card-content">
                    <h3>{business.title}</h3>
                    <p className="business-catchphrase">{business.catchphrase}</p>
                    <p className="business-description">{business.description}</p>
                    
                    {/* アクションボタン */}
                    <div className="business-action">
                      {business.isActive && business.link ? (
                        <Link to={business.link} className="business-link">
                          <span>作品を見る</span>
                          <span className="business-link-arrow">→</span>
                        </Link>
                      ) : (
                        <span className="business-status-text">準備中</span>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* お問い合わせセクション */}
      <section className="business-contact">
        <div className="container">
          <ScrollAnimation>
            <h2>お問い合わせ</h2>
            <p className="contact-description">
              各事業に関するご質問・ご相談は、お気軽にお問い合わせください。
            </p>
            <Link to="/contact" className="contact-button">
              <span>お問い合わせはこちら</span>
              <span className="contact-button-arrow">→</span>
            </Link>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  )
}

export default Business