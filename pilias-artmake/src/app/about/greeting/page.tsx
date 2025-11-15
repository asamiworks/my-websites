'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Card from '@/components/ui/Card'
import { LineButton } from '@/components/ui/Button'
import { ChevronRight, Award, Shield, Users, Sparkles, CheckCircle, Star, Heart, Calendar } from 'lucide-react'

export default function GreetingPage() {
  const [isVisible, setIsVisible] = useState<Record<number, boolean>>({})
  const observerRefs = useRef<(HTMLElement | null)[]>([])

  const [isHeroVisible, setIsHeroVisible] = useState(false)
  const [isProfileVisible, setIsProfileVisible] = useState(false)
  const [isCardsVisible, setIsCardsVisible] = useState(false)
  const [isQualPhiloVisible, setIsQualPhiloVisible] = useState(false)
  const [isMessageVisible, setIsMessageVisible] = useState(false)

  const heroRef = useRef<HTMLElement>(null)
  const profileRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLElement>(null)
  const qualPhiloRef = useRef<HTMLElement>(null)
  const messageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const heroObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsHeroVisible(true)
    }, observerOptions)

    const profileObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsProfileVisible(true)
    }, observerOptions)

    const cardsObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsCardsVisible(true)
    }, observerOptions)

    const qualPhiloObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsQualPhiloVisible(true)
    }, observerOptions)

    const messageObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsMessageVisible(true)
    }, observerOptions)

    if (heroRef.current) heroObserver.observe(heroRef.current)
    if (profileRef.current) profileObserver.observe(profileRef.current)
    if (cardsRef.current) cardsObserver.observe(cardsRef.current)
    if (qualPhiloRef.current) qualPhiloObserver.observe(qualPhiloRef.current)
    if (messageRef.current) messageObserver.observe(messageRef.current)

    const observers: IntersectionObserver[] = []

    observerRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setIsVisible(prev => ({ ...prev, [index]: true }))
              }, index * 100) // 順番にフェードイン
            }
          },
          { threshold: 0.1 }
        )
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => {
      heroObserver.disconnect()
      profileObserver.disconnect()
      cardsObserver.disconnect()
      qualPhiloObserver.disconnect()
      messageObserver.disconnect()
      observers.forEach(observer => observer.disconnect())
    }
  }, [])

  const qualifications = [
    '正看護師免許',
    '都内有名アートメイクスクール卒業',
    'CHIHIRO BROWS ACADEMY実技講習受講',
    'PGC Schools 白斑・傷跡・ストレッチマーク・スキンリジュビネーションコースディプロマ保有',
    'PGC Schools 口唇口蓋裂コースディプロマ保有',
  ]

  const career = [
    { 
      year: '2014', 
      event: '音楽高校フルート専攻に入学し音楽の道を目指す',
      image: '/images/about/career/2014-music.jpg',
      imageAlt: '音楽高校時代の写真'
    },
    { 
      year: '2017', 
      event: '色々と考えた結果、音楽の道を諦めることを決意。小児医療に興味を持ち、音楽高校卒業した後看護大学校へ入学',
      image: null
    },
    { 
      year: '2021', 
      event: '神奈川県立こども医療センター手術室・PICUにて小児急性期医療の経験を積む',
      image: '/images/about/career/2021-hospital.jpg',
      imageAlt: 'こども医療センターでの勤務'
    },
    { 
      year: '2024', 
      event: '小児在宅医療に興味を持ち小児訪問看護ステーションに転職',
      image: null
    },
    { 
      year: '2024', 
      event: '手術後の傷跡に悩む方々の力になりたいと考えたのをきっかけに都内アートメイクスクールにて基礎を学び、眉・リップの技術習得。その後国内初の革新的アートメイクスクールにてパラメディカルアートメイクの技術習得',
      image: '/images/about/career/2024-training.jpg',
      imageAlt: 'アートメイク研修'
    },
    { 
      year: '2025', 
      event: 'PILIASARTMAKE として事業開始。フリーランスにてクリニックと提携し施術。施術所: 銀座・新橋・柏・横浜',
      image: '/images/about/career/2025-pilias.jpg',
      imageAlt: 'PILIAS ARTMAKE開業'
    },
  ]

  const philosophy = [
    {
      icon: <Star className="w-5 h-5" />,
      title: '寄り添う心',
      description: 'お客様一人ひとりのお悩みに真摯に向き合います',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: '安全第一',
      description: '医療従事者として衛生管理と安全性を最優先に',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: '美の追求',
      description: '最新技術で自然で美しい仕上がりを追求',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: '信頼関係',
      description: 'お客様の人生に寄り添うパートナーとして',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* パンくずリスト */}
      <div className="bg-[#F5F3F0] py-3">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-[#8B8680] hover:text-[#6B6560] transition-colors">
              ホーム
            </Link>
            <ChevronRight className="w-4 h-4 text-[#C5C0B8]" />
            <Link href="/about" className="text-[#8B8680] hover:text-[#6B6560] transition-colors">
              PILIAS ARTMAKEについて
            </Link>
            <ChevronRight className="w-4 h-4 text-[#C5C0B8]" />
            <span className="text-[#6B6560] font-medium">代表挨拶</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section ref={heroRef} className="py-16 lg:py-24 bg-gradient-to-br from-[#F5F3F0] via-[#FAF9F7] to-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E5E0D8] rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F5F3F0] rounded-full opacity-30 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl lg:text-6xl font-serif text-[#6B6560] mb-6 tracking-wide transition-all duration-1000 ${
              isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              代表挨拶
            </h1>
            <p className={`text-lg lg:text-xl text-[#8B8680] transition-all duration-1000 delay-200 ${
              isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              美と医療の架け橋となり、皆様の人生に寄り添います
            </p>
          </div>
        </div>
      </section>

      {/* プロフィール */}
      <section ref={profileRef} className="py-16 lg:py-24 bg-[#FAF9F7]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className={`lg:flex lg:gap-12 transition-all duration-1000 ${
              isProfileVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {/* 写真エリア */}
              <div className="lg:w-1/3 mb-6 lg:mb-0">
                <div className="relative max-w-[200px] mx-auto lg:max-w-none">
                  <div className="relative aspect-[3/4] rounded-xl lg:rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/profile/representative.jpg"
                      alt="代表 ASUKA"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 200px, 33vw"
                    />
                  </div>
                </div>
              </div>

              {/* テキストエリア */}
              <div className="lg:w-2/3">
                <div className="mb-6 lg:mb-8 text-center lg:text-left">
                  <h2 className="text-xl lg:text-2xl font-medium text-[#6B6560] mb-1 lg:mb-2">
                    代表　ASUKA
                  </h2>
                 
                </div>

                <div className="prose prose-stone max-w-none">
                  <p className="text-sm lg:text-base text-[#6B6560] mb-3 lg:mb-4 leading-relaxed">
                    皆様、初めまして。PILIAS ARTMAKE代表のASUKAと申します。
                  </p>
                  
                  <p className="text-sm lg:text-base text-[#6B6560] mb-3 lg:mb-4 leading-relaxed">
                    私は看護師として医療現場で働く中で、病気や事故で外見に悩みを抱える多くの患者様と出会いました。
                    その経験から、医療の知識と技術を活かして、より多くの方の「美」と「自信」をサポートしたいという想いで、
                    アートメイクの道を選びました。
                  </p>

                  <p className="text-sm lg:text-base text-[#6B6560] mb-3 lg:mb-4 leading-relaxed">
                    美容アートメイクはもちろん、パラメディカルアートメイクにも力を入れているのは、
                    外見の悩みが心の健康にも大きく影響することを、医療現場で実感してきたからです。
                    傷跡や白斑、手術痕などでお悩みの方が、アートメイクによって自信を取り戻し、
                    笑顔になっていく姿を見ることが、私の最大の喜びです。
                  </p>

                  <p className="text-sm lg:text-base text-[#6B6560] mb-4 lg:mb-6 leading-relaxed">
                    PILIAS ARTMAKEでは、医療従事者としての責任と誇りを持ち、
                    安全性を最優先に、お客様一人ひとりに寄り添った施術を心がけています。
                    どんな小さな悩みでも、お気軽にご相談ください。
                    あなたの「なりたい自分」を一緒に実現させていただきます。
                  </p>

                  <p className="text-sm lg:text-base text-[#6B6560] font-medium">
                    皆様にお会いできることを、心より楽しみにしております。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILIAS名前の由来と始動宣言セクション（横並び） */}
      <section ref={cardsRef} className="py-16 lg:py-24 bg-gradient-to-br from-[#F5F3F0] to-[#FAF9F7]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">

              {/* PILIAS名前の由来（2枚目の内容） */}
              <Card className={`p-6 lg:p-8 bg-gradient-to-br from-[#FFF8F3] to-white shadow-xl border border-[#E5E0D8] h-full transition-all duration-700 ${
                isCardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}>
                <div className="text-center h-full flex flex-col justify-center">
                  <h2 className="text-xl lg:text-3xl font-serif text-[#6B6560] mb-6 lg:mb-8">
                    "Pilias"とは
                  </h2>
                  
                  <div className="mb-6 lg:mb-8">
                    <div className="flex items-center justify-center gap-3 lg:gap-6 text-lg lg:text-2xl font-medium text-[#6B6560]">
                      <div>
                        <p className="text-sm lg:text-base text-[#8B8680] mb-1">Pili</p>
                        <p className="text-base lg:text-xl font-bold text-[#6B6560]">繋がり</p>
                       
                      </div>
                      <span className="text-xl lg:text-3xl text-[#A8A29E]">+</span>
                      <div>
                        <p className="text-sm lg:text-base text-[#8B8680] mb-1">As</p>
                        <p className="text-base lg:text-xl font-bold text-[#6B6560]">明日</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 lg:space-y-4 text-xs lg:text-sm text-[#6B6560] leading-relaxed">
                    <p>
                      あなたとの <span className="text-[#8B8680] font-bold">"繋がり"</span> を大切に<br />
                      ともに <span className="text-[#8B8680] font-bold">"明日"</span> を描いていきたい
                    </p>
                    
                    <p>
                      あなたにずっと寄り添って<br />
                      明日に繋げる役割となれるように
                    </p>
                    
                    <p className="text-[#8B8680] font-serif text-sm lg:text-base italic mt-4 lg:mt-6">
                      Pili me 'oe mau loa...
                    </p>
                    <p className="text-xs text-[#8B8680]">
                      （あなたにずっと寄り添う）
                    </p>
                  </div>
                </div>
              </Card>

              {/* 始動宣言（1枚目の内容） */}
              <Card className={`p-6 lg:p-8 bg-gradient-to-br from-[#FFF8F3] to-white shadow-xl border border-[#E5E0D8] h-full transition-all duration-700 delay-200 ${
                isCardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}>
                <div className="text-center h-full flex flex-col justify-center">
                  <div>
                    <p className="text-xs lg:text-sm text-[#8B8680] mb-2">
                      私アートメイク看護師ASUKAは
                    </p>
                    <h2 className="text-lg lg:text-2xl font-serif text-[#6B6560] mb-6 lg:mb-8">
                      "PILIAS ARTMAKE" として<br className="lg:hidden" />始動いたしました。
                    </h2>
                  </div>
                  
                  <div className="space-y-4 lg:space-y-6">
                    <div>
                      <p className="text-[#8B8680] font-serif text-sm lg:text-base italic mb-1">
                        Pili me 'oe mau loa
                      </p>
                      <p className="text-xs text-[#8B8680]">
                        「あなたにずっと寄り添う」
                      </p>
                    </div>

                    <div className="space-y-3 text-xs lg:text-sm text-[#6B6560] leading-relaxed">
                      <p>
                        あなたとの <span className="text-[#8B8680] font-bold">"繋がり"</span> を大切に<br />
                        ともに <span className="text-[#8B8680] font-bold">"明日"</span> を描いていきたい
                      </p>
                      
                      <p>
                        あなたにずっと寄り添って<br />
                        明日に繋げる役割となれるように
                      </p>
                      
                      <p className="text-xs text-[#8B8680] mt-3">
                        という意味が込められています
                      </p>
                    </div>

                    <div className="pt-4 lg:pt-6 border-t border-[#E5E0D8]">
                      <p className="text-xs lg:text-sm text-[#6B6560] mb-4">
                        今後とも"PILIAS ARTMAKE"を<br className="lg:hidden" />よろしくお願いいたします
                      </p>
                      
                      <div className="mt-4 lg:mt-6">
                        <p className="font-serif text-base lg:text-lg text-[#6B6560] italic">Asuka</p>
                        <div className="mt-2">
                          <span className="text-xs lg:text-sm font-medium text-[#8B8680] tracking-wider">PILIAS ARTMAKE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* 資格・理念セクション */}
      <section ref={qualPhiloRef} className="py-16 lg:py-24 bg-[#FAF9F7]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              {/* 保有資格 */}
              <Card className={`p-6 lg:p-8 bg-[#F5F3F0] border-[#E5E0D8] transition-all duration-700 ${
                isQualPhiloVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div className="flex items-center mb-4 lg:mb-6">
                  <Award className="w-6 h-6 text-[#8B8680] mr-3" />
                  <h3 className="text-xl lg:text-2xl font-medium text-[#6B6560]">保有資格</h3>
                </div>
                <ul className="space-y-3">
                  {qualifications.map((qual) => (
                    <li 
                      key={qual} 
                      className="flex items-start text-sm lg:text-base text-[#6B6560]"
                    >
                      <CheckCircle className="w-5 h-5 text-[#A8A29E] mr-3 mt-0.5 flex-shrink-0" />
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* 私たちの理念 */}
              <Card className={`p-6 lg:p-8 bg-[#F5F3F0] border-[#E5E0D8] transition-all duration-700 delay-200 ${
                isQualPhiloVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div className="flex items-center mb-4 lg:mb-6">
                  <Heart className="w-6 h-6 text-[#8B8680] mr-3" />
                  <h3 className="text-xl lg:text-2xl font-medium text-[#6B6560]">私たちの理念</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {philosophy.map((item) => (
                    <div key={item.title}>
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-[#E5E0D8] rounded-full flex items-center justify-center text-[#8B8680] mr-3 flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-sm lg:text-base font-medium text-[#6B6560] mb-1">{item.title}</h4>
                          <p className="text-xs lg:text-sm text-[#8B8680] leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 経歴セクション - 写真付きデザイン */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-[#F5F3F0] to-[#FAF9F7] overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 lg:mb-16">
              <h2 className="text-2xl lg:text-4xl font-serif text-[#6B6560] mb-3">
                私の歩み
              </h2>
              <p className="text-sm lg:text-base text-[#8B8680]">
                音楽から医療、そしてアートメイクへ
              </p>
            </div>

            {/* デスクトップ: 写真付きタイムライン */}
            <div className="hidden lg:block relative">
              {/* 中央の縦線 */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#D4CFC7] to-transparent transform -translate-x-1/2"></div>
              
              <div className="relative space-y-20">
                {career.map((item, index) => (
                  <div 
                    key={index}
                    ref={(el) => {
                      if (el) observerRefs.current[index] = el
                    }}
                    className={`transition-all duration-1000 ${
                      isVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className={`flex items-center gap-12 ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}>
                      {/* テキスト部分 */}
                      <div className="flex-1">
                        <div className={`${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                            <div className="mb-4">
                              <span className="inline-block bg-[#E5E0D8] px-4 py-2 rounded-full">
                                <span className="text-lg font-bold text-[#6B6560]">{item.year}</span>
                              </span>
                            </div>
                            <div className="max-w-md">
                              <div className="p-6 bg-white rounded-2xl shadow-md border border-[#E5E0D8]">
                                <p className="text-sm lg:text-base text-[#6B6560] leading-relaxed">
                                  {item.event}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 中央のドット */}
                      <div className="relative flex-shrink-0 z-10">
                        <div className="w-6 h-6 bg-white rounded-full border-4 border-[#A8A29E] shadow-lg relative">
                          <div className="absolute inset-0 bg-[#A8A29E] rounded-full animate-ping opacity-20"></div>
                        </div>
                      </div>

                      {/* 写真部分 */}
                      <div className="flex-1">
                        {item.image ? (
                          <div className={`${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                            <div className={`inline-block ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                              <div className="relative group">
                                <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                                  <Image
                                    src={item.image}
                                    alt={item.imageAlt || `${item.year}年の写真`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 256px"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                                {/* 装飾的な要素 */}
                                <div className="absolute -z-10 -top-4 -left-4 w-full h-full rounded-2xl bg-[#E5E0D8]/20 transform rotate-3"></div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-64 h-80"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* モバイル: 写真付き縦型タイムライン */}
            <div className="lg:hidden relative">
              {/* 左側の縦線 */}
              <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#D4CFC7] to-transparent"></div>
              
              <div className="relative space-y-8">
                {career.map((item, index) => (
                  <div 
                    key={index}
                    ref={(el) => {
                      if (el) observerRefs.current[index + 6] = el
                    }}
                    className={`transition-all duration-700 ${
                      isVisible[index + 6] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  >
                    {/* ドットと年号 */}
                    <div className="flex items-center mb-4">
                      <div className="w-4 h-4 bg-white rounded-full border-4 border-[#A8A29E] shadow-md relative z-10"></div>
                      <span className="ml-6 inline-block bg-[#E5E0D8] px-3 py-1 rounded-full">
                        <span className="text-sm font-bold text-[#6B6560]">{item.year}</span>
                      </span>
                    </div>
                    
                    {/* 写真（ある場合） */}
                    {item.image && (
                      <div className="ml-10 mb-4">
                        <div className="relative aspect-[3/4] max-w-[200px] mx-auto rounded-xl overflow-hidden shadow-lg">
                          <Image
                            src={item.image}
                            alt={item.imageAlt || `${item.year}年の写真`}
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* テキスト */}
                    <div className="ml-10 p-4 bg-white rounded-xl border border-[#E5E0D8] shadow-sm">
                      <p className="text-xs text-[#6B6560] leading-relaxed">
                        {item.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* メッセージ */}
      <section ref={messageRef} className="py-16 lg:py-24 bg-[#FAF9F7]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Card className={`p-6 lg:p-10 bg-gradient-to-br from-white to-[#FFF8F3] border-[#E5E0D8] shadow-lg transition-all duration-1000 ${
              isMessageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="lg:flex lg:gap-12 lg:items-start">
                {/* 画像 - モバイルでは上、デスクトップでは右 */}
                <div className="lg:order-2 lg:w-1/3 mb-6 lg:mb-0">
                  <div className="relative aspect-[4/3] lg:aspect-[3/4] max-w-sm mx-auto lg:max-w-none rounded-xl overflow-hidden shadow-md">
                    <Image
                      src="/images/profile/treatment.jpg"
                      alt="施術風景"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>

                {/* テキスト */}
                <div className="lg:order-1 lg:w-2/3">
                  <h2 className="text-xl lg:text-2xl font-serif text-[#6B6560] mb-4 lg:mb-6 text-center lg:text-left">
                    最後に
                  </h2>
                  <div className="space-y-4 lg:space-y-5">
                    <p className="text-sm lg:text-base text-[#6B6560] leading-relaxed">
                      看護師になることを目指した17歳の時から、私が大切にしたい看護は変わっていません。
                      <br />
                      <span className="font-medium">「ともに考える看護」</span>です。
                    </p>

                    <p className="text-sm lg:text-base text-[#6B6560] leading-relaxed">
                      これは看護学校の受験、研究発表、病院の採用試験、院内研修発表、どの場所でも言葉にし、臨床現場でも実践してきました。
                      <br />
                      今まで出会った全ての患者様・家族とともに進んできた道です。
                    </p>

                    <p className="text-sm lg:text-base text-[#6B6560] leading-relaxed">
                      状態や目指すゴールを擦り合わせた上で、時にはアートメイクではなく別の方法を提案することもあるかもしれません。
                      <br />
                      皆様おひとりおひとりにとって最善の方法を考えることが私の役割だと思っています。
                    </p>

                    <p className="text-sm lg:text-base text-[#6B6560] leading-relaxed">
                      <span className="font-medium">「点ではなく線で看る看護」</span>
                      <br />
                      看護学校の先生から何度も教えられた言葉です。私の永遠の目標は、患者様の今だけではなく、今まで歩んできた道と今後の未来まで考えられる看護師になること。
                    </p>

                    <p className="text-sm lg:text-base text-[#6B6560] leading-relaxed">
                      一緒に考えて悩んで、一緒に進んで行けたらと思います。
                    </p>
                  </div>

                  <div className="text-right mt-6 lg:mt-8">
                    <p className="font-serif text-base lg:text-lg text-[#6B6560]">
                      PILIAS ARTMAKE 代表　ASUKA
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F5F3F0] to-[#FAF9F7]">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-xl lg:text-3xl font-serif text-[#6B6560] mb-3 lg:mb-4">
            お気軽にご相談ください
          </h2>
          <p className="text-sm lg:text-base text-[#8B8680] mb-6 lg:mb-8 max-w-2xl mx-auto">
            どんな小さなお悩みでも、真摯にお答えいたします
          </p>
          <LineButton size="lg" className="text-sm lg:text-base">LINE無料カウンセリング</LineButton>
        </div>
      </section>
    </div>
  )
}