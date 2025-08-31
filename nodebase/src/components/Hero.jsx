import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/components/Hero.css';

// 田園風景画像のインポート
import heroImage1 from '../assets/images/hero/hero-01.jpg';
import heroImage2 from '../assets/images/hero/hero-02.jpg';
import heroImage3 from '../assets/images/hero/hero-03.jpg';
import heroImage4 from '../assets/images/hero/hero-04.jpg';
import heroImage5 from '../assets/images/hero/hero-05.jpg';

// nodebaseロゴのインポート
import nodebaseLogo from '../assets/images/nodebase-logo.svg';

const Hero = () => {
  const images = [heroImage1, heroImage2, heroImage3, heroImage4, heroImage5];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  
  // 画像のプリロード
  useEffect(() => {
    const preloadImages = async () => {
      const promises = images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });
      
      try {
        await Promise.all(promises);
        setImagesPreloaded(true);
      } catch (error) {
        console.error('画像のプリロードに失敗しました:', error);
        setImagesPreloaded(true); // エラーでも続行
      }
    };
    
    preloadImages();
  }, []);
  
  // 初回ロード完了
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // 画像の自動切り替え（8秒ごと）
  useEffect(() => {
    if (!imagesPreloaded) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [images.length, imagesPreloaded]);
  
  return (
    <section className="hero-misaki">
      {/* 背景画像のスライドショー */}
      <div className="hero-images">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            className="hero-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2.5,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
            style={{ willChange: 'opacity' }}
          >
            <img 
              src={images[currentImageIndex]} 
              alt="田園風景"
              loading="eager"
              decoding="async"
            />
            <div className="hero-overlay" />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* メインコンテンツ */}
      <div className="hero-content">
        <div className="hero-inner">
          <div className={`hero-title ${isLoaded ? 'animate' : ''}`}>
            <img 
              src={nodebaseLogo} 
              alt="nodebase"
              className="nodebase-logo"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;