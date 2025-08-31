'use client'

import { useEffect, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import { Instagram, Heart } from 'lucide-react'

export default function InstagramSection() {
  const [isVisible, setIsVisible] = useState(false)
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

  // Instagram投稿のプレースホルダーデータ
  const posts = [
    { id: 1, type: 'eyebrow', likes: 156, caption: '自然な毛並み眉✨' },
    { id: 2, type: 'lip', likes: 234, caption: '血色感のあるリップに💋' },
    { id: 3, type: 'eyebrow', likes: 189, caption: '黄金比で理想の眉に' },
    { id: 4, type: 'paramedical', likes: 342, caption: '白斑カモフラージュ症例' },
    { id: 5, type: 'eyebrow', likes: 267, caption: 'パウダー眉で優しい印象に' },
    { id: 6, type: 'lip', likes: 198, caption: 'くすみ改善で若々しく' },
    { id: 7, type: 'paramedical', likes: 421, caption: '傷痕修正の症例' },
    { id: 8, type: 'eyebrow', likes: 312, caption: 'MIX技法で立体感のある眉' },
  ]

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
          <p className="text-lg text-greige-600 mb-6">
            実際の施術例をInstagramでご紹介しています
          </p>
          
          {/* Instagramアカウント */}
          <div className="inline-flex items-center space-x-2 text-greige-600">
            <Instagram className="w-5 h-5" />
            <span className="font-medium">@asuka_artmake_para</span>
          </div>
        </div>

        {/* Instagram Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-12 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="group relative aspect-square bg-gradient-to-br from-greige-100 to-greige-50 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              {/* 画像プレースホルダー */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Instagram className="w-12 h-12 text-greige-300" />
              </div>
              
              {/* ホバー時のオーバーレイ */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">{post.likes}</span>
                </div>
                <p className="text-xs px-4 text-center">{post.caption}</p>
              </div>
              
              {/* タイプバッジ */}
              <div className="absolute top-2 left-2">
                <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                  post.type === 'paramedical' 
                     ? 'bg-greige-500/80 text-white' 
    : 'bg-white/80 text-greige-700'
                }`}>
                  {post.type === 'eyebrow' && '眉'}
                  {post.type === 'lip' && 'リップ'}
                  {post.type === 'paramedical' && 'パラメディカル'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram埋め込みエリア（プレースホルダー） */}
        <div className={`bg-white rounded-2xl p-8 shadow-md mb-8 transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="text-center text-greige-400">
            <Instagram className="w-16 h-16 mx-auto mb-4" />
            <p className="text-sm">
              Instagram フィードがここに表示されます
              <br />
              （Instagram APIの設定が必要です）
            </p>
          </div>
        </div>

        {/* フォローボタン */}
        <div className={`text-center transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Button
            variant="outline"
            href="https://www.instagram.com/asuka_artmake_para/"
            external
            icon={<Instagram className="w-5 h-5" />}
          >
            Instagramをフォロー
          </Button>
          <p className="mt-4 text-sm text-greige-500">
            最新の症例写真や施術情報を配信中
          </p>
        </div>
      </div>
    </section>
  )
}