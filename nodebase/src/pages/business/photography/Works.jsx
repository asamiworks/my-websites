import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollAnimation from '../../../components/ScrollAnimation'

// ギャラリー画像のインポート
import gallery1 from '../../../assets/images/gallery/camera-01.jpg'
import gallery2 from '../../../assets/images/gallery/camera-02.jpg'
import gallery3 from '../../../assets/images/gallery/camera-03.jpg'
import gallery4 from '../../../assets/images/gallery/camera-04.jpg'
import gallery5 from '../../../assets/images/gallery/camera-05.jpg'
import gallery6 from '../../../assets/images/gallery/camera-06.jpg'

function Works() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [hoveredId, setHoveredId] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const galleryImages = [
    { id: 1, src: gallery1, alt: 'Natural Light' },
    { id: 2, src: gallery2, alt: 'Urban Story' },
    { id: 3, src: gallery3, alt: 'Golden Hour' },
    { id: 4, src: gallery4, alt: 'Precious Time' },
    { id: 5, src: gallery5, alt: 'Business Portrait' },
    { id: 6, src: gallery6, alt: 'Forever Young' }
  ]

  const services = [
    {
      title: 'Wedding',
      subtitle: '一生に一度の特別な日',
      description: '幸せな瞬間を\n美しく記録'
    },
    {
      title: 'Portrait',
      subtitle: 'あなたらしさを',
      description: '自然な表情を\n大切に'
    },
    {
      title: 'Corporate',
      subtitle: '企業の魅力を',
      description: 'ビジネスに\n必要な一枚'
    }
  ]

  const galleryContainerStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: isMobile ? '40px' : '60px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  }

  const imageContainerStyle = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    aspectRatio: '3/4',
    cursor: 'pointer'
  }

  const imageStyle = (isHovered) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
    filter: isHovered ? 'brightness(0.95)' : 'brightness(1)'
  })

  const headerStyle = {
    textAlign: 'center',
    padding: isMobile ? '60px 20px 40px' : '100px 20px 60px',
    maxWidth: '800px',
    margin: '0 auto'
  }

  const servicesContainerStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: isMobile ? '40px' : '60px',
    maxWidth: '1000px',
    margin: isMobile ? '80px auto' : '140px auto',
    padding: '0 40px'
  }

  const serviceCardStyle = {
    textAlign: 'center',
    padding: '20px'
  }

  const ctaSectionStyle = {
    textAlign: 'center',
    padding: isMobile ? '80px 20px' : '140px 20px',
    backgroundColor: '#fafafa',
    marginTop: isMobile ? '80px' : '120px'
  }

  return (
    <div className="works-page" style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* ヘッダーセクション */}
      <section>
        <div style={headerStyle}>
          <ScrollAnimation>
            <h1 style={{ 
              fontSize: isMobile ? 'clamp(2rem, 6vw, 2.5rem)' : 'clamp(2.5rem, 4vw, 3.5rem)',
              fontWeight: '200',
              letterSpacing: '0.2em',
              marginBottom: '24px',
              color: '#222'
            }}>
              PHOTOGRAPH
            </h1>
            <p style={{
              fontSize: isMobile ? '0.95rem' : '1rem',
              color: '#666',
              letterSpacing: '0.1em',
              fontWeight: '400'
            }}>
              特別な瞬間を、永遠の記憶に
            </p>
          </ScrollAnimation>
        </div>

        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          marginBottom: isMobile ? '40px' : '80px'
        }}>
          <Link to="/business" style={{
            display: 'inline-block',
            color: '#999',
            textDecoration: 'none',
            fontSize: '0.85rem',
            letterSpacing: '0.05em',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#333'
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#999'
          }}>
            ← 事業内容に戻る
          </Link>
        </div>
      </section>

      {/* ギャラリーセクション */}
      <section style={{ marginBottom: isMobile ? '60px' : '100px' }}>
        <div style={galleryContainerStyle}>
          {galleryImages.map((image, index) => (
            <ScrollAnimation key={image.id} delay={index * 0.1}>
              <div
                style={imageContainerStyle}
                onMouseEnter={() => setHoveredId(image.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <img 
                  src={image.src}
                  alt={image.alt}
                  style={imageStyle(hoveredId === image.id)}
                  loading="lazy"
                />
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </section>

      {/* サービス説明セクション */}
      <section>
        <ScrollAnimation>
          <div style={servicesContainerStyle}>
            {services.map((service, index) => (
              <div key={index} style={serviceCardStyle}>
                <h3 style={{ 
                  fontSize: isMobile ? '1.4rem' : '1.6rem',
                  fontWeight: '300',
                  letterSpacing: '0.08em',
                  marginBottom: '24px',
                  color: '#222'
                }}>
                  {service.title}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem',
                  color: '#888',
                  marginBottom: '16px',
                  letterSpacing: '0.05em',
                  fontStyle: 'italic'
                }}>
                  {service.subtitle}
                </p>
                <p style={{ 
                  fontSize: '0.85rem',
                  color: '#666',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-line',
                  letterSpacing: '0.03em'
                }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollAnimation>
      </section>

      {/* CTA セクション */}
      <section style={ctaSectionStyle}>
        <ScrollAnimation>
          <h2 style={{ 
            fontSize: isMobile ? 'clamp(1.6rem, 5vw, 2rem)' : 'clamp(1.8rem, 3vw, 2.3rem)',
            fontWeight: '300',
            letterSpacing: '0.12em',
            marginBottom: '24px',
            color: '#222'
          }}>
            撮影のご依頼
          </h2>
          <p style={{
            fontSize: '0.95rem',
            color: '#666',
            marginBottom: '48px',
            letterSpacing: '0.06em'
          }}>
            まずはお気軽にお問い合わせください
          </p>
          <Link 
            to="/contact" 
            style={{
              display: 'inline-block',
              padding: isMobile ? '14px 48px' : '16px 56px',
              backgroundColor: '#222',
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.9rem',
              letterSpacing: '0.12em',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid #222'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = '#222'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#222'
              e.target.style.color = 'white'
            }}
          >
            お問い合わせはこちら
          </Link>
        </ScrollAnimation>
      </section>
    </div>
  )
}

export default Works