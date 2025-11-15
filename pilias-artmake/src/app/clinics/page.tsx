'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import { LineButton } from '@/components/ui/Button'
import {
  ChevronRight,
  MapPin,
  Train,
  ExternalLink,
  Instagram
} from 'lucide-react'

export default function ClinicsPage() {
  const [selectedArea, setSelectedArea] = useState<'all' | 'ginza-shinbashi' | 'chiba' | 'kanagawa'>('all')

  const [isHeroVisible, setIsHeroVisible] = useState(false)
  const [isClinicsVisible, setIsClinicsVisible] = useState(false)
  const [isInstagramVisible, setIsInstagramVisible] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const clinicsRef = useRef<HTMLElement>(null)
  const instagramRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const heroObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsHeroVisible(true)
    }, observerOptions)

    const clinicsObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsClinicsVisible(true)
    }, observerOptions)

    const instagramObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsInstagramVisible(true)
    }, observerOptions)

    if (heroRef.current) heroObserver.observe(heroRef.current)
    if (clinicsRef.current) clinicsObserver.observe(clinicsRef.current)
    if (instagramRef.current) instagramObserver.observe(instagramRef.current)

    return () => {
      heroObserver.disconnect()
      clinicsObserver.disconnect()
      instagramObserver.disconnect()
    }
  }, [])

  const clinics = [
    {
      id: 'ginza-art',
      name: 'THE GINZA ART CLINIC',
      area: 'ginza-shinbashi',
      areaLabel: '銀座',
      address: '東京都中央区銀座7-4-12',
      access: '銀座駅 A2出口より徒歩3分',
      mapUrl: 'https://maps.app.goo.gl/9nZknSVfWh5o24Mh7',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6482.7572060731245!2d139.7565929!3d35.667678599999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b6c62939aa7%3A0x2e181f42082e1664!2sTHE%20GINZA%20ART%20CLINIC!5e0!3m2!1sja!2sjp!4v1754892393083!5m2!1sja!2sjp',
    },
    {
      id: 'medical-body',
      name: '医療ボディクリニック',
      area: 'ginza-shinbashi',
      areaLabel: '新橋',
      address: '東京都港区新橋2-5-14',
      access: '新橋駅より徒歩5分',
      mapUrl: 'https://maps.app.goo.gl/9fVdrGEpw2tDuRZN6',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.087671598411!2d139.76759500000003!3d35.6748432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bd5e09eeedb%3A0xebd6098dc530992!2z5Yy755mC44OA44Kk44Ko44OD44OI5bCC6ZaAIERyLuWMu-eZguODnOODh-OCo-OCr-ODquODi-ODg-OCrw!5e0!3m2!1sja!2sjp!4v1754892484698!5m2!1sja!2sjp',
    },
    {
      id: 'medical-brow-ginza',
      name: 'メディカルブロー銀座院',
      area: 'ginza-shinbashi',
      areaLabel: '銀座',
      address: '東京都中央区銀座6-9-7',
      access: '銀座駅 A5出口より徒歩2分',
      mapUrl: 'https://maps.app.goo.gl/q9GNirhGSMkr58W99',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.271406996577!2d139.760516!3d35.67031860000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b2adf2c97b1%3A0x4c7418d88129f286!2z44Oh44OH44Kj44Kr44Or44OW44Ot44O86YqA5bqn6Zmi!5e0!3m2!1sja!2sjp!4v1754892500264!5m2!1sja!2sjp',
    },
    {
      id: 'kashiwa',
      name: '柏院',
      area: 'chiba',
      areaLabel: '柏',
      address: '千葉県柏市中央町',
      access: '柏駅より徒歩5分',
      mapUrl: 'https://maps.app.goo.gl/ZgDvEkuo6PZ269ZK6',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3233.474593807965!2d139.9710389!3d35.8618848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60189d635384689b%3A0x42daf8b376785178!2z44G544Oq44K544K544Kt44Oz44Kv44Oq44OL44OD44Kv!5e0!3m2!1sja!2sjp!4v1754892513657!5m2!1sja!2sjp',
    },
    {
      id: 'medical-brow-yokohama',
      name: 'メディカルブロー横浜院',
      area: 'kanagawa',
      areaLabel: '横浜',
      address: '神奈川県横浜市西区',
      access: '横浜駅より徒歩3分',
      mapUrl: 'https://maps.app.goo.gl/Wfj34wpfYa9LxKwn8',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.687949590585!2d139.6229756!3d35.4625191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60185d9bc1c787d5%3A0xa8c413349119f9e2!2z44Oh44OH44Kj44Kr44Or44OW44Ot44O85qiq5rWc6Zmi!5e0!3m2!1sja!2sjp!4v1754892530258!5m2!1sja!2sjp',
    },
  ]

  const filteredClinics = selectedArea === 'all' 
    ? clinics 
    : clinics.filter(clinic => clinic.area === selectedArea)

  const areas = [
    { value: 'all', label: '全て', count: clinics.length },
    { value: 'ginza-shinbashi', label: '銀座・新橋', count: clinics.filter(c => c.area === 'ginza-shinbashi').length },
    { value: 'chiba', label: '千葉', count: clinics.filter(c => c.area === 'chiba').length },
    { value: 'kanagawa', label: '神奈川', count: clinics.filter(c => c.area === 'kanagawa').length },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* パンくずリスト */}
      <div className="bg-greige-50 py-3">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-greige-600 hover:text-greige-800">
              ホーム
            </Link>
            <ChevronRight className="w-4 h-4 text-greige-400" />
            <span className="text-greige-800 font-medium">提携院 / アクセス</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section ref={heroRef} className="py-16 lg:py-24 bg-gradient-to-br from-greige-50 via-white to-cream relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-greige-100 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cream rounded-full opacity-40 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="text-center">
            <h1 className={`text-4xl lg:text-6xl font-serif text-greige-800 mb-6 transition-all duration-1000 ${
              isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              提携院 / アクセス
            </h1>
            <p className={`text-lg lg:text-xl text-greige-600 transition-all duration-1000 delay-200 ${
              isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              東京・千葉・神奈川の5院でお待ちしております
            </p>
          </div>
        </div>
      </section>

      {/* エリア選択 */}
      <section className="py-8 bg-white sticky top-[68px] z-20 border-b border-greige-200">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap gap-2 bg-greige-50 rounded-full p-1">
              {areas.map((area) => (
                <button
                  key={area.value}
                  onClick={() => setSelectedArea(area.value as 'all' | 'ginza-shinbashi' | 'chiba' | 'kanagawa')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedArea === area.value
                      ? 'bg-white text-greige-800 shadow-md'
                      : 'text-greige-600 hover:text-greige-800'
                  }`}
                >
                  {area.label}（{area.count}院）
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* クリニック一覧 */}
      <section ref={clinicsRef} className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="space-y-8">
            {filteredClinics.map((clinic, index) => (
              <Card
                key={clinic.id}
                className={`overflow-hidden transition-all duration-700 ${
                  isClinicsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="lg:flex">
                  {/* Google Maps埋め込み */}
                  <div className="lg:w-1/2 h-64 lg:h-[400px] relative">
                    <iframe
                      src={clinic.embedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${clinic.name}の地図`}
                      className="absolute inset-0 w-full h-full"
                    />
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <span className="bg-greige-700 text-white text-xs px-3 py-1 rounded-full shadow-md">
                        {clinic.areaLabel}
                      </span>
                    </div>
                  </div>

                  {/* 情報エリア */}
                  <div className="lg:w-1/2 p-6 lg:p-12">
                    <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 mb-8">
                      {clinic.name}
                    </h2>

                    <div className="space-y-6">
                      {/* 住所 */}
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-greige-400 mr-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-base font-medium text-greige-700 mb-1">住所</p>
                          <p className="text-base text-greige-600">{clinic.address}</p>
                        </div>
                      </div>

                      {/* アクセス */}
                      <div className="flex items-start">
                        <Train className="w-5 h-5 text-greige-400 mr-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-base font-medium text-greige-700 mb-1">アクセス</p>
                          <p className="text-base text-greige-600">{clinic.access}</p>
                        </div>
                      </div>

                      {/* 外部リンク */}
                      <div className="pt-6">
                        <a
                          href={clinic.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-base text-greige-600 hover:text-greige-800 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Google Mapで詳しく見る
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Instagram連携セクション */}
          <div ref={instagramRef} className="mt-16">
            <Card className={`bg-white text-center p-8 lg:p-12 transition-all duration-1000 ${
              isInstagramVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <Instagram className="w-16 h-16 text-greige-400 mx-auto mb-6" />
              <h2 className="text-2xl font-medium text-greige-800 mb-4">
                ご予約状況はInstagramから
              </h2>
              <p className="text-greige-600 mb-6">
                各院の予約状況や最新情報を配信しています。
                <br />
                ご予約・お問い合わせはこちらからお願いします。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a
                  href="https://www.instagram.com/asuka_artmake_para/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full hover:shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all group"
                >
                  <Instagram className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="font-medium">@asuka_artmake_para</span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </a>
              </div>

              <p className="text-sm text-greige-500">
                ※各院の詳細な診療時間は、予約時にご確認ください
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}