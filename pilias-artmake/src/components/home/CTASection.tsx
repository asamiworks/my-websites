'use client'

import { useEffect, useRef, useState } from 'react'
import { LineButton } from '@/components/ui/Button'
import { CheckCircle, Calendar, MessageCircle, Shield, Instagram } from 'lucide-react'

export default function CTASection() {
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

  const benefits = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: '完全予約制',
      description: 'お一人おひとりに丁寧に向き合います',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: '無料カウンセリング',
      description: 'お悩みやご希望を丁寧にヒアリング',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '医師管理',
      description: '医療機関での安心・安全な施術',
    },
  ]

  const steps = [
    { number: '01', title: 'Instagram確認', description: '予約枠をチェック' },
    { number: '02', title: 'LINE登録', description: '公式LINEを友だち追加' },
    { number: '03', title: 'カウンセリング', description: 'お悩みをじっくり相談' },
    { number: '04', title: '施術', description: '理想を実現' },
  ]

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-gradient-to-br from-greige-50 via-cream to-white relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-greige-100 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-greige-100 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* メインCTA */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl lg:text-4xl font-serif text-greige-800 mb-6">
            まずは無料カウンセリングから
          </h2>
          <p className="text-lg text-greige-600 mb-8 max-w-2xl mx-auto">
            お客様一人ひとりのお悩みに寄り添い、
            <br className="hidden lg:block" />
            最適な施術プランをご提案いたします
          </p>
          
          {/* SNSボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <a
              href="https://www.instagram.com/asuka_artmake_para/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-greige-600 to-greige-500 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
              <span className="font-medium">予約枠を確認</span>
            </a>
            
            <LineButton size="lg" className="shadow-xl hover:shadow-2xl">
              LINE無料カウンセリング予約
            </LineButton>
          </div>
          
          <p className="text-sm text-greige-500">
            予約枠はInstagramでお知らせ / LINEは24時間受付中
          </p>
        </div>

        {/* ベネフィット */}
        <div className={`grid md:grid-cols-3 gap-6 mb-16 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-greige-100 rounded-full flex items-center justify-center text-greige-600 mr-4">
                  {benefit.icon}
                </div>
                <h3 className="font-medium text-greige-800">{benefit.title}</h3>
              </div>
              <p className="text-sm text-greige-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* 予約の流れ */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h3 className="text-2xl font-medium text-greige-800 text-center mb-8">
            ご予約の流れ
          </h3>
          
          <div className="relative">
            {/* 接続線（デスクトップのみ） */}
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-greige-200 via-greige-300 to-greige-200" />
            
            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="relative text-center"
                  style={{
                    transitionDelay: `${600 + index * 100}ms`,
                  }}
                >
                  {/* ステップ番号 */}
                  <div className="relative inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4 hover:shadow-lg transition-shadow">
                    <span className="text-xl font-bold text-greige-700">{step.number}</span>
                  </div>
                  
                  {/* ステップ内容 */}
                  <h4 className="font-medium text-greige-800 mb-1">{step.title}</h4>
                  <p className="text-sm text-greige-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 注意事項 */}
        <div className={`max-w-3xl mx-auto mt-16 bg-white rounded-2xl p-8 shadow-md transition-all duration-1000 delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h3 className="text-lg font-medium text-greige-800 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            ご予約にあたって
          </h3>
          
          <ul className="space-y-3 text-sm text-greige-600">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-greige-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
              <span>カウンセリングは無料です。施術を強要することはございません</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-greige-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
              <span>未成年の方は保護者の同意が必要です</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-greige-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
              <span>オンラインカウンセリングも承っております</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-greige-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
              <span>キャンセル・変更は前日までにご連絡ください</span>
            </li>
          </ul>

          <div className="mt-6 pt-6 border-t border-greige-200">
            <div className="text-center">
              <p className="text-greige-600 mb-4">
                ご不明な点がございましたら、お気軽にお問い合わせください
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://www.instagram.com/asuka_artmake_para/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-greige-300 text-greige-700 rounded-full hover:bg-greige-50 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span className="text-sm">Instagramで確認</span>
                </a>
                <LineButton>今すぐLINEで相談する</LineButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}