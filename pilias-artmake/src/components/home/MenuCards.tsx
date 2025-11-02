'use client'

import { useEffect, useRef, useState } from 'react'
import { MenuCard } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ArrowRight, Heart, Shield, Gift, AlertCircle } from 'lucide-react'

// メニューアイテムの型定義
interface MenuItem {
  title: string
  description: string
  price: {
    regular: number
    monitor?: number
    retouch?: number
    retouchWithinYear?: number
  }
  href: string
  badge?: string
  features?: string[]
}

export default function MenuCards() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'medical' | 'beauty'>('medical') // パラメディカルをデフォルトに
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

  const medicalMenus: MenuItem[] = [
    {
      title: '傷痕修正',
      description: '事故や手術による傷痕を目立たなくし、肌の色味を整えます。自信を取り戻すお手伝いをします。',
      price: {
        regular: 12000,
      },
      href: '/paramedical/scar',
      badge: '医療補助',
    },
    {
      title: '白斑カモフラージュ',
      description: '白斑症による色素脱失部分を自然な肌色でカバー。メイクなしでも気にならない肌へ。',
      price: {
        regular: 30000,
        retouch: 14000,
      },
      href: '/paramedical/vitiligo',
      badge: '医療補助',
    },
    {
      title: '口唇口蓋裂修正',
      description: '口唇口蓋裂の手術痕を目立たなくし、唇の形を整えます。自然な口元を演出。',
      price: {
        regular: 30000,
      },
      href: '/paramedical/cleft-lip',
      badge: '医療補助',
    },
    {
      title: 'ストレッチマーク修正',
      description: '妊娠線や肉割れを目立たなくします。スキンリジュビネーション技術で肌を改善。',
      price: {
        regular: 15000,
      },
      href: '/paramedical/stretch-marks',
      badge: '医療補助',
    },
  ]

  const beautyMenus: MenuItem[] = [
    {
      title: '眉毛アートメイク',
      description: '自然な毛並みを1本1本手彫りで描き、理想の眉を24時間キープ。朝のメイク時間を大幅に短縮できます。',
      price: {
        regular: 98000,
        monitor: 88000,
        retouch: 40000,
        retouchWithinYear: 35000,
      },
      href: '/artmake-features/eyebrow',
    },
    {
      title: 'リップアートメイク',
      description: '唇の色と形を美しく整え、血色感のある魅力的な唇を演出。自然で健康的な唇の色を保ちます。',
      price: {
        regular: 98000,
        monitor: 88000,
        retouch: 40000,
        retouchWithinYear: 35000,
      },
      href: '/artmake-features/lip',
    },
  ]

  const currentMenus = activeTab === 'medical' ? medicalMenus : beautyMenus

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-gradient-to-b from-white via-greige-50/30 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* セクションタイトル */}
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl lg:text-4xl font-serif text-greige-800 mb-4">
            施術メニュー
          </h2>
          <p className="text-lg text-greige-600 mb-2">
            医療的な悩みから美容まで幅広く対応
          </p>
          {/* パラメディカル強調バッジ */}
          <div className="flex justify-center gap-3 mt-4">
            <span className="inline-flex items-center px-4 py-2 bg-[#FDF6F0] text-[#B8956A] rounded-full text-sm font-medium">
              <Heart className="w-4 h-4 mr-2" />
              パラメディカル専門
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-greige-50 text-greige-600 rounded-full text-sm">
              <Shield className="w-4 h-4 mr-2" />
              医師管理の安心施術
            </span>
          </div>
        </div>

        {/* タブ切り替え（パラメディカルを先に） */}
        <div className={`flex justify-center mb-12 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex bg-white rounded-full shadow-md p-1">
            <button
              onClick={() => setActiveTab('medical')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'medical'
                  ? 'bg-[#C8A882] text-white shadow-lg'
                  : 'text-greige-600 hover:text-greige-800'
              }`}
            >
              <span className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                パラメディカル
              </span>
            </button>
            <button
              onClick={() => setActiveTab('beauty')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'beauty'
                  ? 'bg-greige-700 text-white shadow-lg'
                  : 'text-greige-600 hover:text-greige-800'
              }`}
            >
              美容アートメイク
            </button>
          </div>
        </div>

        {/* パラメディカル特別メッセージ */}
        {activeTab === 'medical' && (
          <div className={`max-w-4xl mx-auto mb-8 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-gradient-to-r from-[#FDF6F0] to-white rounded-2xl p-6 border border-[#E8D5C4]">
              <div className="text-center">
                <h3 className="text-lg font-medium text-greige-800 mb-3">
                  パラメディカルアートメイクで、あなたの悩みを解決します
                </h3>
                <p className="text-sm text-greige-600">
                  傷痕、白斑、口唇口蓋裂、ストレッチマークなど、医療的な悩みに特化した施術を提供。
                  <br />
                  プライバシーに配慮し、一人ひとりに寄り添ったカウンセリングを行います。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* メニューカード */}
        <div className={`grid md:grid-cols-2 ${activeTab === 'beauty' ? 'lg:grid-cols-2 max-w-4xl mx-auto' : 'lg:grid-cols-2 xl:grid-cols-4'} gap-6 mb-12 transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {currentMenus.map((menu, index) => (
            <div
              key={menu.title}
              className="transition-all duration-500 relative"
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <MenuCard
                title={menu.title}
                description={menu.description}
                price={menu.price}
                href={menu.href}
                badge={menu.badge}
                features={menu.features}
              />
            </div>
          ))}
        </div>

        {/* モニター条件と注意事項 */}
        <div className={`max-w-3xl mx-auto transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {activeTab === 'beauty' ? (
            <div className="bg-gradient-to-br from-amber-50 via-cream to-greige-50 rounded-2xl p-6 lg:p-8 border border-amber-100 shadow-md">
              <div className="flex items-center mb-6">
                <div className="bg-amber-500 text-white rounded-full p-2 mr-3">
                  <Gift className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-greige-800">
                  モニター価格適用条件
                </h3>
              </div>
              <div className="bg-white/60 rounded-xl p-4 lg:p-5 backdrop-blur-sm">
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      1
                    </span>
                    <span className="text-greige-700 leading-relaxed">全顔お写真掲載OK</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      2
                    </span>
                    <span className="text-greige-700 leading-relaxed">3ヶ月以内に2回目施術でご来院</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-greige-200">
                  <p className="text-sm text-greige-700">
                    <span className="font-medium">リタッチ料金：</span>
                    3回目以降 ¥40,000 / 3回目以降（1年以内）¥35,000
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#FDF6F0] to-white rounded-2xl p-6 lg:p-8 shadow-md border border-[#E8D5C4]">
              <h3 className="text-lg font-medium text-greige-800 mb-4 flex items-center">
                <Heart className="w-5 h-5 text-[#C8A882] mr-3" />
                パラメディカルアートメイクの特徴
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-greige-700 text-sm">対応可能な症例</h4>
                  <ul className="space-y-1 text-sm text-greige-600">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#D4B896] rounded-full mr-2" />
                      手術痕・事故による傷痕
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#D4B896] rounded-full mr-2" />
                      白斑症による色素脱失
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#D4B896] rounded-full mr-2" />
                      口唇口蓋裂の術後
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#D4B896] rounded-full mr-2" />
                      妊娠線・ストレッチマーク
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-greige-700 text-sm">施術の特徴</h4>
                  <ul className="space-y-1 text-sm text-greige-600">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#D4B896] rounded-full mr-2" />
                      スキンリジュビネーション技術
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#D4B896] rounded-full mr-2" />
                      色素を使わない施術も可能
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#D4B896] rounded-full mr-2" />
                      プライバシーに配慮
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#D4B896] rounded-full mr-2" />
                      医師管理で安心
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E8D5C4]">
                <p className="text-sm text-greige-600">
                  適応条件がございます。まずは無料カウンセリングでご相談ください。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 詳細ボタン */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              href="/paramedical"
              icon={<Heart className="w-5 h-5" />}
            >
              パラメディカル詳細を見る
            </Button>
            <Button
              variant="outline"
              href="/pricing"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              料金表を詳しく見る
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}