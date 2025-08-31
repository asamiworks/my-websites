import { motion } from 'framer-motion'
import { useState } from 'react'

function Gallery({ preview = false }) {
  // プレビュー用の画像データ（実際の画像パスに置き換えてください）
  const galleryImages = [
    { id: 1, src: '/src/assets/images/gallery/image1.jpg', alt: 'Wedding photo 1' },
    { id: 2, src: '/src/assets/images/gallery/image2.jpg', alt: 'Nature photo' },
    { id: 3, src: '/src/assets/images/gallery/image3.jpg', alt: 'Wedding photo 2' },
    { id: 4, src: '/src/assets/images/gallery/image4.jpg', alt: 'Landscape' },
    { id: 5, src: '/src/assets/images/gallery/image5.jpg', alt: 'Portrait' },
    { id: 6, src: '/src/assets/images/gallery/image6.jpg', alt: 'Event photo' },
  ]

  const displayImages = preview ? galleryImages.slice(0, 3) : galleryImages

  return (
    <div className="gallery">
      <div className="gallery-grid">
        {displayImages.map((image, index) => (
          <motion.div
            key={image.id}
            className="gallery-item"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="gallery-image-wrapper">
              <div 
                className="gallery-image"
                style={{
                  background: `linear-gradient(135deg, var(--color-sky-light), var(--color-green-light))`,
                  paddingBottom: '100%'
                }}
              >
                {/* 実際の画像に置き換えてください */}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Gallery