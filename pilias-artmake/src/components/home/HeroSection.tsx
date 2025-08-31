'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { LineButton } from '@/components/ui/Button'
import { ArrowDown } from 'lucide-react'

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // 画像コラージュの配置（画像ファイル名を追加）
  const imagePositions = [
    { 
      src: '/images/hero/hero-1.jpg',
      alt: '眉毛アートメイク施術例',
      top: '10%', 
      right: '5%', 
      size: 'w-32 h-32 lg:w-48 lg:h-48', 
      delay: '0.2s' 
    },
    { 
      src: '/images/hero/hero-2.jpg',
      alt: 'リップアートメイク施術例',
      top: '30%', 
      right: '34%', 
      size: 'w-24 h-24 lg:w-36 lg:h-36', 
      delay: '0.4s' 
    },
    { 
      src: '/images/hero/hero-3.jpg',
      alt: 'パラメディカルアートメイク施術例',
      bottom: '20%', 
      right: '0%', 
      size: 'w-28 h-28 lg:w-40 lg:h-40', 
      delay: '0.6s' 
    },
    { 
      src: '/images/hero/hero-4.jpg',
      alt: 'アートメイクカウンセリング',
      bottom: '32%', 
      right: '28%', 
      size: 'w-20 h-20 lg:w-32 lg:h-32', 
      delay: '0.8s' 
    },
    { 
      src: '/images/hero/hero-5.jpg',
      alt: 'アートメイク施術風景',
      top: '38%', 
      right: '6%', 
      size: 'w-24 h-24 lg:w-32 lg:h-32', 
      delay: '1s' 
    },
  ]

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] bg-gradient-to-br from-cream via-white to-greige-50 overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0">
        {/* グラデーション円 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-greige-100 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-greige-100 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-br from-greige-50 to-transparent rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 h-full relative">
        <div className="min-h-[600px] lg:min-h-[700px] grid lg:grid-cols-2 items-center">
          {/* 左側：テキストコンテンツ */}
          <div className="py-20 lg:py-0 z-10">
            {/* メインキャッチコピー */}
            <div className={`transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h1 className="font-serif text-4xl lg:text-6xl xl:text-7xl text-greige-800 leading-tight mb-6">
                <span className="block">Artmake</span>
                <span className="block mt-2">Counseling</span>
              </h1>
            </div>

            {/* サブキャッチコピー */}
            <div className={`transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <p className="text-lg lg:text-xl text-greige-600 mb-2">
                パラメディカルアートメイク・医療アートメイク
              </p>
              <div className="font-serif text-base lg:text-lg text-greige-500 mb-8">
                <p className="italic mb-1">Pili me 'oe mau loa…</p>
                <p className="text-sm lg:text-base ml-4">
                  "繋がり"を大切に　　あなたにずっと寄り添います
                </p>
              </div>
            </div>

            {/* CTA ボタン */}
            <div className={`transition-all duration-1000 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <LineButton size="lg" className="shadow-xl hover:shadow-2xl">
                無料カウンセリング予約
              </LineButton>
              <p className="mt-4 text-sm text-greige-500">
                完全予約制 / オンライン相談も可能
              </p>
            </div>

            {/* 特徴バッジ */}
            <div className={`mt-12 flex flex-wrap gap-3 transition-all duration-1000 delay-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}>
              <span className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-greige-600 shadow-sm">
                <span className="w-2 h-2 bg-greige-400 rounded-full mr-2" />
                医師管理の安心施術
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-greige-600 shadow-sm">
              <span className="w-2 h-2 bg-greige-400 rounded-full mr-2" />
                症例実績多数
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-greige-600 shadow-sm">
                <span className="w-2 h-2 bg-greige-400 rounded-full mr-2" />
                提携院5院
              </span>
            </div>
          </div>

          {/* 右側：画像コラージュ */}
          <div className="hidden lg:block relative h-full">
            {imagePositions.map((image, index) => (
              <div
                key={index}
                className={`absolute ${image.size} transition-all duration-1000 ${
                  isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
                style={{
                  top: image.top,
                  bottom: image.bottom,
                  right: image.right,
                  transitionDelay: image.delay,
                }}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-greige-100 to-white">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 0vw, (max-width: 1200px) 25vw, 20vw"
                  />
                </div>
              </div>
            ))}

            {/* ロゴ/ブランド要素 */}
            <div
              className={`absolute bottom-24 right-28 transition-all duration-1000 delay-1000 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="font-serif text-2xl text-greige-800 mb-1">PILIAS</div>
                <div className="text-sm text-greige-600">ARTMAKE</div>
                <div className="mt-2 w-20 h-[2px] bg-gradient-to-r from-greige-400 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* スクロールインジケーター */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-greige-400" />
      </div>
    </section>
  )
}