import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function BusinessCard({ 
  title, 
  description, 
  icon, 
  color,
  // 新規追加props
  image,
  catchphrase,
  status,
  link,
  ctaText,
  disabled = false,
  className = ''
}) {
  // カラークラスの決定（既存のsky/green + 新規カラー対応）
  const getColorClass = () => {
    switch(color) {
      case 'sky': return 'card-sky'
      case 'green': return 'card-green'
      case 'misaki': return 'card-misaki'
      case 'marriage': return 'card-marriage'
      case 'education': return 'card-education'
      default: return 'card-default'
    }
  }
  
  const colorClass = getColorClass()
  const isDisabled = disabled || status === 'Coming Soon'
  
  // カードの中身をレンダリング
  const cardContent = (
    <>
      {/* 画像がある場合は表示 */}
      {image && (
        <div className="business-card-image">
          <img src={image} alt={title} />
          {status && (
            <span className={`business-card-status ${isDisabled ? 'status-coming' : 'status-active'}`}>
              {status}
            </span>
          )}
        </div>
      )}
      
      {/* アイコン（画像がない場合のみ表示） */}
      {!image && icon && (
        <div className="business-card-icon">{icon}</div>
      )}
      
      {/* タイトル */}
      <h3 className="business-card-title">{title}</h3>
      
      {/* キャッチフレーズ（あれば） */}
      {catchphrase && (
        <p className="business-card-catchphrase">{catchphrase}</p>
      )}
      
      {/* 説明文 */}
      <p className="business-card-description">{description}</p>
      
      {/* CTAボタン（リンクがある場合） */}
      {link && ctaText && !isDisabled && (
        <div className="business-card-cta">
          <span className="cta-text">{ctaText}</span>
          <span className="cta-arrow">→</span>
        </div>
      )}
      
      {/* Coming Soonの場合 */}
      {isDisabled && !link && (
        <div className="business-card-cta disabled">
          <span className="cta-text">準備中</span>
        </div>
      )}
    </>
  )
  
  // モーションの設定
  const motionProps = isDisabled ? {} : {
    whileHover: { 
      y: -10, 
      boxShadow: color === 'misaki' 
        ? '0 20px 40px rgba(90, 154, 156, 0.3)'
        : color === 'marriage'
        ? '0 20px 40px rgba(228, 165, 160, 0.3)'
        : color === 'education'
        ? '0 20px 40px rgba(46, 80, 144, 0.3)'
        : '0 20px 40px rgba(135, 206, 235, 0.3)'
    },
    transition: { duration: 0.3 }
  }
  
  // リンクがある場合はLinkコンポーネントでラップ
  if (link && !isDisabled) {
    return (
      <Link to={link} className="business-card-link">
        <motion.div 
          className={`business-card ${colorClass} ${isDisabled ? 'card-disabled' : ''} ${className}`}
          {...motionProps}
        >
          {cardContent}
        </motion.div>
      </Link>
    )
  }
  
  // リンクがない場合は通常のdiv
  return (
    <motion.div 
      className={`business-card ${colorClass} ${isDisabled ? 'card-disabled' : ''} ${className}`}
      {...motionProps}
    >
      {cardContent}
    </motion.div>
  )
}

export default BusinessCard