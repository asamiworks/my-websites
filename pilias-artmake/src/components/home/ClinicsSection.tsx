'use client'

import { useEffect, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import { MapPin, Train, Instagram, MessageCircle } from 'lucide-react'

export default function ClinicsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedArea, setSelectedArea] = useState<'all' | 'ginza-shinbashi' | 'chiba' | 'kanagawa'>('all')
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

  const clinics = [
    {
      name: 'THE GINZA ART CLINIC',
      area: '銀座',
      category: 'ginza-shinbashi',
      address: '東京都中央区銀座7-4-12',
      access: '銀座駅 A2出口より徒歩3分',
      mapUrl: 'https://maps.app.goo.gl/9nZknSVfWh5o24Mh7',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6482.7572060731245!2d139.7565929!3d35.667678599999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b6c62939aa7%3A0x2e181f42082e1664!2sTHE%20GINZA%20ART%20CLINIC!5e0!3m2!1sja!2sjp!4v1754892393083!5m2!1sja!2sjp',
    },
    {
      name: '医療ボディクリニック',
      area: '新橋',
      category: 'ginza-shinbashi',
      address: '東京都港区新橋2-5-14',
      access: '新橋駅より徒歩5分',
      mapUrl: 'https://maps.app.goo.gl/9fVdrGEpw2tDuRZN6',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.087671598411!2d139.76759500000003!3d35.6748432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bd5e09eeedb%3A0xebd6098dc530992!2z5Yy755mC44OA44Kk44Ko44OD44OI5bCC6ZaAIERyLuWMu-eZguODnOODh-OCo-OCr-ODquODi-ODg-OCrw!5e0!3m2!1sja!2sjp!4v1754892484698!5m2!1sja!2sjp',
    },
    {
      name: 'メディカルブロー銀座院',
      area: '銀座',
      category: 'ginza-shinbashi',
      address: '東京都中央区銀座6-9-7',
      access: '銀座駅 A5出口より徒歩2分',
      mapUrl: 'https://maps.app.goo.gl/q9GNirhGSMkr58W99',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.271406996577!2d139.760516!3d35.67031860000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b2adf2c97b1%3A0x4c7418d88129f286!2z44Oh44OH44Kj44Kr44Or44OW44Ot44O86YqA5bqn6Zmi!5e0!3m2!1sja!2sjp!4v1754892500264!5m2!1sja!2sjp',
    },
    {
      name: '柏院',
      area: '柏',
      category: 'chiba',
      address: '千葉県柏市中央町',
      access: '柏駅より徒歩5分',
      mapUrl: 'https://maps.app.goo.gl/ZgDvEkuo6PZ269ZK6',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3233.474593807965!2d139.9710389!3d35.8618848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60189d635384689b%3A0x42daf8b376785178!2z44G544Oq44K544K544Kt44Oz44Kv44Oq44OL44OD44Kv!5e0!3m2!1sja!2sjp!4v1754892513657!5m2!1sja!2sjp',
    },
    {
      name: 'メディカルブロー横浜院',
      area: '横浜',
      category: 'kanagawa',
      address: '神奈川県横浜市西区',
      access: '横浜駅より徒歩3分',
      mapUrl: 'https://maps.app.goo.gl/Wfj34wpfYa9LxKwn8',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.687949590585!2d139.6229756!3d35.4625191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60185d9bc1c787d5%3A0xa8c413349119f9e2!2z44Oh44OH44Kj44Kr44Or44OW44Ot44O85qiq5rWc6Zmi!5e0!3m2!1sja!2sjp!4v1754892530258!5m2!1sja!2sjp',
    },
  ]

  // フィルタリングされたクリニックを取得
  const filteredClinics = selectedArea === 'all' 
    ? clinics 
    : clinics.filter(clinic => clinic.category === selectedArea)

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* セクションタイトル */}
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl lg:text-4xl font-serif text-greige-800 mb-4">
            提携院 / アクセス
          </h2>
          <p className="text-lg text-greige-600">
            お近くのクリニックをお選びいただけます
          </p>
        </div>

        {/* エリア別タブ */}
        <div className={`flex justify-center mb-8 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex flex-wrap gap-2 bg-greige-50 rounded-full p-1">
            <button
              onClick={() => setSelectedArea('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedArea === 'all'
                  ? 'bg-white text-greige-800 shadow-sm'
                  : 'text-greige-600 hover:text-greige-800'
              }`}
            >
              全て（5院）
            </button>
            <button
              onClick={() => setSelectedArea('ginza-shinbashi')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedArea === 'ginza-shinbashi'
                  ? 'bg-white text-greige-800 shadow-sm'
                  : 'text-greige-600 hover:text-greige-800'
              }`}
            >
              銀座・新橋（3院）
            </button>
            <button
              onClick={() => setSelectedArea('chiba')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedArea === 'chiba'
                  ? 'bg-white text-greige-800 shadow-sm'
                  : 'text-greige-600 hover:text-greige-800'
              }`}
            >
              千葉（1院）
            </button>
            <button
              onClick={() => setSelectedArea('kanagawa')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedArea === 'kanagawa'
                  ? 'bg-white text-greige-800 shadow-sm'
                  : 'text-greige-600 hover:text-greige-800'
              }`}
            >
              神奈川（1院）
            </button>
          </div>
        </div>

        {/* クリニックカード */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {filteredClinics.map((clinic, index) => (
            <div
              key={clinic.name}
              className="transition-all duration-500"
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                {/* Google Maps埋め込み */}
                <div className="relative h-48 bg-greige-100">
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
                      {clinic.area}
                    </span>
                  </div>
                </div>

                {/* 情報エリア */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-greige-800 mb-3">
                    {clinic.name}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start text-sm text-greige-600">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{clinic.address}</span>
                    </div>
                    <div className="flex items-start text-sm text-greige-600">
                      <Train className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{clinic.access}</span>
                    </div>
                  </div>

                  {/* マップリンク */}
                  <a
                    href={clinic.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-greige-500 hover:text-greige-700 transition-colors group"
                  >
                    <span>Google Mapで詳しく見る</span>
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

     

        {/* 詳細ページへのリンク */}
        <div className={`text-center mt-8 transition-all duration-1000 delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Button
            variant="ghost"
            href="/clinics"
          >
            全ての提携院を詳しく見る
          </Button>
        </div>
      </div>
    </section>
  )
}