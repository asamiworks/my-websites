'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { ArrowRight, Camera } from 'lucide-react'

export default function GallerySection() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'beauty' | 'paramedical'>('all')
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // 症例写真データ（画像パスを追加）
  const cases = [
    { 
      id: 1, 
      category: 'beauty', 
      type: '眉毛', 
      title: 'MIX技法', 
      description: '印象をより明るく',
      image: '/images/gallery/eyebrow/03.jpg' // 画像パスを追加
    },
    { 
      id: 2, 
      category: 'beauty', 
      type: 'リップ', 
      title: '血色感のあるリップ', 
      description: '自然な色味',
      image: '/images/gallery/lip/01.jpg' // 画像パスを追加
    },
    { 
      id: 3, 
      category: 'beauty', 
      type: '眉毛', 
      title: 'パウダー眉', 
      description: '立体感のある眉',
      image: '/images/gallery/eyebrow/02.jpg' // 画像パスを追加
    },
    { 
      id: 4, 
      category: 'beauty', 
      type: '眉毛', 
      title: 'セミアーチ眉デザイン', 
      description: '顔の黄金比に合わせた美しいアーチ',
      image: '/images/gallery/eyebrow/19.jpg' // 画像パスを追加
    },
    { 
      id: 5, 
      category: 'beauty', 
      type: '眉毛', 
      title: 'MIX技法', 
      description: 'ふんわり優しい印象',
      image: '/images/gallery/eyebrow/01.jpg' // 画像パスを追加
    },
    { 
      id: 6, 
      category: 'beauty', 
      type: 'リップ', 
      title: 'くすみ改善', 
      description: '若々しい唇に',
      image: '/images/gallery/lip/02.jpg' // 画像パスを追加
    },
    { 
      id: 7, 
      category: 'paramedical', 
      type: '傷痕', 
      title: '傷痕修正', 
      description: '目立たない仕上がり',
      image: '/images/gallery/paramedical/01.jpg' // 画像パスを追加
    },
    { 
      id: 8, 
      category: 'paramedical', 
      type: 'ストレッチマーク', 
      title: '妊娠線改善', 
      description: '滑らかな肌へ',
      image: '/images/gallery/paramedical/02.jpg' // 画像パスを追加
    },
  ]

  const filteredCases = selectedCategory === 'all' 
    ? cases 
    : cases.filter(item => item.category === selectedCategory)

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-gradient-to-b from-white to-greige-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* セクションタイトル */}
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl lg:text-4xl font-serif text-greige-800 mb-4">
            症例写真
          </h2>
          <p className="text-lg text-greige-600 mb-8">
            実際の施術例をご紹介します
          </p>

          {/* カテゴリータブ */}
          <div className="inline-flex bg-white rounded-full shadow-md p-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-greige-700 text-white'
                  : 'text-greige-600 hover:text-greige-800'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setSelectedCategory('beauty')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'beauty'
                  ? 'bg-greige-700 text-white'
                  : 'text-greige-600 hover:text-greige-800'
              }`}
            >
              美容
            </button>
            <button
              onClick={() => setSelectedCategory('paramedical')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'paramedical'
                  ? 'bg-greige-700 text-white'
                  : 'text-greige-600 hover:text-greige-800'
              }`}
            >
              パラメディカル
            </button>
          </div>
        </div>

        {/* 症例写真グリッド */}
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {filteredCases.map((caseItem, index) => (
            <div
              key={caseItem.id}
              className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              {/* 画像エリア */}
              <div className="aspect-[4/5] bg-gradient-to-br from-greige-100 to-greige-50 relative">
                {caseItem.image ? (
                  <Image
                    src={caseItem.image}
                    alt={caseItem.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="w-12 h-12 text-greige-300" />
                  </div>
                )}
              </div>
              
              {/* 情報エリア */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    caseItem.category === 'paramedical'
                    ? 'bg-greige-100 text-greige-600'
                    : 'bg-greige-100 text-greige-600'
                  }`}>
                    {caseItem.type}
                  </span>
                </div>
                <h3 className="font-medium text-greige-800 text-sm mb-1">
                  {caseItem.title}
                </h3>
                <p className="text-xs text-greige-500">
                  {caseItem.description}
                </p>
              </div>


            </div>
          ))}
        </div>

        {/* 詳細ページへのリンク */}
        <div className={`text-center transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Button
            variant="ghost"
            href="/gallery"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
          >
            すべての症例を見る
          </Button>
        </div>
      </div>
    </section>
  )
}