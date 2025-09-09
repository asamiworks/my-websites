'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // 画像が読み込まれたらSetに追加
  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index))
  }

  // グリッドベースの配置（WebP形式＋blur対応）
  const overlayImages = [
    {
      src: '/images/hero/hero-01.webp',
      lowSrc: '/images/hero/hero-01-low.webp', // 低解像度版
      blurDataURL: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAwAgCdASoKAAcAAkA4JZwCdAEO/gM6PAA+PSqURiKRiIGBABgSzADpkyP/kAeQB5AH/yAP/j/QAP7+7u7u7u7u7g==', // 10x7pxのブラー画像
      gridArea: 'a',
      delay: '0.1s'
    },
    {
      src: '/images/hero/hero-02.webp',
      lowSrc: '/images/hero/hero-02-low.webp',
      blurDataURL: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAwAgCdASoKAAcAAkA4JZwCdAEO/gM6PAA+PSqURiKRiIGBABgSzADpkyP/kAeQB5AH/yAP/j/QAP7+7u7u7u7u7g==',
      gridArea: 'b',
      delay: '0.2s'
    },
    {
      src: '/images/hero/hero-03.webp',
      lowSrc: '/images/hero/hero-03-low.webp',
      blurDataURL: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAwAgCdASoKAAcAAkA4JZwCdAEO/gM6PAA+PSqURiKRiIGBABgSzADpkyP/kAeQB5AH/yAP/j/QAP7+7u7u7u7u7g==',
      gridArea: 'c',
      delay: '0.3s'
    },
    {
      src: '/images/hero/hero-04.webp',
      lowSrc: '/images/hero/hero-04-low.webp',
      blurDataURL: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAwAgCdASoKAAcAAkA4JZwCdAEO/gM6PAA+PSqURiKRiIGBABgSzADpkyP/kAeQB5AH/yAP/j/QAP7+7u7u7u7u7g==',
      gridArea: 'd',
      delay: '0.4s'
    },
    {
      src: '/images/hero/hero-05.webp',
      lowSrc: '/images/hero/hero-05-low.webp',
      blurDataURL: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAwAgCdASoKAAcAAkA4JZwCdAEO/gM6PAA+PSqURiKRiIGBABgSzADpkyP/kAeQB5AH/yAP/j/QAP7+7u7u7u7u7g==',
      gridArea: 'e',
      delay: '0.5s'
    },
    {
      src: '/images/hero/hero-06.webp',
      lowSrc: '/images/hero/hero-06-low.webp',
      blurDataURL: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAwAgCdASoKAAcAAkA4JZwCdAEO/gM6PAA+PSqURiKRiIGBABgSzADpkyP/kAeQB5AH/yAP/j/QAP7+7u7u7u7u7g==',
      gridArea: 'f',
      delay: '0.6s'
    },
    {
      src: '/images/hero/hero-07.webp',
      lowSrc: '/images/hero/hero-07-low.webp',
      blurDataURL: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAwAgCdASoKAAcAAkA4JZwCdAEO/gM6PAA+PSqURiKRiIGBABgSzADpkyP/kAeQB5AH/yAP/j/QAP7+7u7u7u7u7g==',
      gridArea: 'g',
      delay: '0.7s'
    },
    {
      src: '/images/hero/hero-08.webp',
      lowSrc: '/images/hero/hero-08-low.webp',
      blurDataURL: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAwAgCdASoKAAcAAkA4JZwCdAEO/gM6PAA+PSqURiKRiIGBABgSzADpkyP/kAeQB5AH/yAP/j/QAP7+7u7u7u7u7g==',
      gridArea: 'h',
      delay: '0.8s'
    }
  ]

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* 背景画像 with ブラー */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 via-transparent to-gray-100/50 z-10" />
        <Image
          src="/images/hero/hero.webp"
          alt="背景"
          fill
          className="object-cover"
          style={{ filter: 'blur(2px) brightness(1.1)' }}
          priority
          quality={90}
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAwAgCdASoKAAcAAkA4JZwCdAEO/gM6PAA+PSqURiKRiIGBABgSzADpkyP/kAeQB5AH/yAP/j/QAP7+7u7u7u7u7g=="
        />
        {/* グレーオーバーレイ */}
        <div className="absolute inset-0 bg-gray-200/20 z-10" />
      </div>

      {/* グリッドレイアウトの画像群 */}
      <div 
        className="absolute inset-0 z-20 grid grid-cols-12 grid-rows-12 gap-2 p-4 lg:p-8"
        style={{
          gridTemplateAreas: `
            "a a a a a . d d d d d ."
            "a a a a a . d d d d d ."
            "a a a a a . d d d d d ."
            "a a a a a . d d d d d ."
            "a a a a a . . . h h . ."
            ". b b b . . . . h h . ."
            ". b b b . . . . . g g g"
            ". b b b . e e e e g g g"
            "c c c . . e e e e g g g"
            "c c c f f e e e e g g g"
            "c c c f f e e e e g g g"
            ". . . f f . . . . g g g"
          `
        }}
      >
        {overlayImages.map((image, index) => (
          <div
            key={index}
            className={`relative transition-all duration-1000 ease-out ${
              isLoaded 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-95'
            }`}
            style={{
              gridArea: image.gridArea,
              transitionDelay: isLoaded ? image.delay : '0s',
            }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden group">
              {/* グラデーションマスク */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-100/20 z-10 pointer-events-none" />
              
              {/* 低解像度画像（最初に表示） */}
              <Image
                src={image.lowSrc}
                alt=""
                fill
                className="object-cover transition-opacity duration-300"
                style={{ 
                  opacity: loadedImages.has(index) ? 0 : 0.15,
                  mixBlendMode: 'multiply',
                  filter: 'blur(8px)'
                }}
                sizes="(max-width: 768px) 20vw, 15vw"
                priority={index < 3} // 最初の3枚を優先
              />
              
              {/* 高解像度画像（後から表示） */}
              <Image
                src={image.src}
                alt={`施術例${index + 1}`}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
                style={{ 
                  opacity: loadedImages.has(index) ? 0.15 : 0,
                  mixBlendMode: 'multiply'
                }}
                sizes="(max-width: 768px) 40vw, 25vw"
                loading={index < 3 ? "eager" : "lazy"} // 最初の3枚は即座に、残りは遅延
                placeholder="blur"
                blurDataURL={image.blurDataURL}
                onLoad={() => handleImageLoad(index)}
              />
              
              {/* エッジのソフトフェード */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    radial-gradient(ellipse at center, transparent 60%, rgba(229, 231, 235, 0.3) 100%),
                    linear-gradient(to bottom, rgba(229, 231, 235, 0.1) 0%, transparent 10%, transparent 90%, rgba(229, 231, 235, 0.1) 100%)
                  `
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 中央のSVGロゴ */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96">
          {/* 背景のぼかし円 */}
          <div className="absolute inset-0 bg-white/30 rounded-full blur-xl" />
          
          {/* SVGロゴ2（下層）- フェードイン */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 3s ease-out',
              transitionDelay: isLoaded ? '1s' : '0s',
            }}
          >
            <Image
              src="/images/hero/logo-2.svg"
              alt="PILIAS Logo 2"
              fill
              className="object-contain"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))',
              }}
              priority
            />
          </div>
          
          {/* SVGロゴ1（上層）- フェードイン */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 3s ease-out',
              transitionDelay: isLoaded ? '1s' : '0s',
            }}
          >
            <Image
              src="/images/hero/logo-1.svg"
              alt="PILIAS Logo 1"
              fill
              className="object-contain"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))',
              }}
              priority
            />
          </div>
        </div>
      </div>

      {/* モバイル用の詳細版 */}
      <style jsx>{`
        @media (max-width: 768px) {
          .grid {
            grid-template-areas:
              ". a a a a a a d d d d ."
              ". a a a a a a d d d d ."
              ". a a a a a a d d d d ."
              ". . . . . . . . . . . ."
              "b b b b . . . . h h h h"
              "b b b b . . . . h h h h"
              "b b b b . . . . h h h h"
              ". . . . . . . . . . . ."
              "c c c c . e e e e . f f"
              "c c c c . e e e e . f f"
              ". . . . g g g g g g . ."
              ". . . . g g g g g g . ." !important;
            grid-template-columns: repeat(12, 1fr) !important;
            grid-template-rows: repeat(12, 1fr) !important;
          }
        }

        @keyframes fadeScaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes clear-reveal {
          0% {
            opacity: 0;
            clip-path: polygon(
              50% 50%,
              50% 50%,
              50% 50%,
              50% 50%
            );
          }
          25% {
            opacity: 0.3;
            clip-path: polygon(
              20% 30%,
              80% 40%,
              50% 50%,
              50% 50%
            );
          }
          50% {
            opacity: 0.6;
            clip-path: polygon(
              10% 20%,
              90% 30%,
              70% 80%,
              30% 70%
            );
          }
          75% {
            opacity: 0.85;
            clip-path: polygon(
              0% 15%,
              100% 10%,
              85% 90%,
              15% 95%
            );
          }
          100% {
            opacity: 1;
            clip-path: polygon(
              0% 0%,
              100% 0%,
              100% 100%,
              0% 100%
            );
          }
        }

        .animate-clear-reveal {
          animation: clear-reveal 3s ease-out forwards;
        }
      `}</style>
    </section>
  )
}