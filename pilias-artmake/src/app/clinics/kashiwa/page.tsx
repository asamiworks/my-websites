'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import { LineButton } from '@/components/ui/Button'
import Button from '@/components/ui/Button'
import { 
  ChevronRight, 
  MapPin, 
  Train, 
  Clock, 
  Car,
  Trees,
  Heart,
  Users,
  Phone,
  Navigation,
  Home
} from 'lucide-react'

export default function KashiwaClinicPage() {
  const clinic = {
    name: '柏院',
    description: '千葉県柏市の中心部に位置し、柏駅から徒歩5分の好立地。駐車場も完備しており、車でのアクセスも便利です。アットホームな雰囲気で、リラックスして施術を受けていただけます。',
    address: '千葉県柏市中央町2-1',
    access: {
      train: [
        { line: 'JR常磐線', station: '柏駅', exit: '東口', time: '徒歩5分' },
        { line: '東武野田線', station: '柏駅', exit: '東口', time: '徒歩5分' },
      ],
      car: '駐車場完備（無料）'
    },
    mapUrl: 'https://maps.app.goo.gl/ZgDvEkuo6PZ269ZK6',
    features: [
      '千葉エリア最大級',
      '駐車場完備',
      'ゆったり空間',
      'アットホームな雰囲気',
      'キッズスペースあり',
      'バリアフリー対応'
    ],
    hours: {
      weekday: '10:00〜19:00',
      saturday: '10:00〜18:00',
      sunday: '10:00〜18:00',
      holiday: '火曜定休'
    },
    specialties: [
      '眉毛アートメイク',
      'リップアートメイク',
      'パラメディカルアートメイク',
      'メンズアートメイク'
    ]
  }

  const areaFeatures = [
    {
      icon: <Trees className="w-6 h-6" />,
      title: 'ゆったりとした環境',
      description: '都心の喧騒を離れ、落ち着いた環境で施術を受けられます。',
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: '車でのアクセス良好',
      description: '無料駐車場完備で、千葉県全域から車でお越しいただけます。',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'アットホームな対応',
      description: '地域密着型のクリニックで、親身になって対応いたします。',
    },
  ]

  const accessFrom = [
    { from: '松戸駅', time: '約15分', line: 'JR常磐線' },
    { from: '我孫子駅', time: '約10分', line: 'JR常磐線' },
    { from: '船橋駅', time: '約30分', line: '東武野田線' },
    { from: '流山おおたかの森駅', time: '約20分', line: 'つくばエクスプレス・東武野田線' },
    { from: '千葉駅', time: '約40分', line: 'JR総武線・常磐線' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* パンくずリスト */}
      <div className="bg-greige-50 py-3">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-greige-600 hover:text-greige-800">
              ホーム
            </Link>
            <ChevronRight className="w-4 h-4 text-greige-400" />
            <Link href="/clinics" className="text-greige-600 hover:text-greige-800">
              提携院
            </Link>
            <ChevronRight className="w-4 h-4 text-greige-400" />
            <span className="text-greige-800 font-medium">柏</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-green-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-serif text-greige-800 mb-4">
              柏エリア
            </h1>
            <p className="text-lg text-greige-600 mb-2">
              千葉県北西部の中心地で、アクセス良好な立地
            </p>
            <p className="text-base text-greige-500">
              駐車場完備で、千葉県全域から通いやすいクリニック
            </p>
          </div>
        </div>
      </section>

      {/* エリアの特徴 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              柏エリアの特徴
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {areaFeatures.map((feature) => (
                <Card key={feature.title} hover className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-medium text-greige-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-greige-600">{feature.description}</p>
                </Card>
              ))}
            </div>

            {/* エリア説明 */}
            <div className="bg-green-50 rounded-2xl p-8">
              <h3 className="text-lg font-medium text-greige-800 mb-4">このエリアがおすすめの方</h3>
              <ul className="space-y-2">
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  千葉県北西部にお住まいの方
                </li>
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  車でのアクセスを希望される方
                </li>
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  ゆったりとした環境で施術を受けたい方
                </li>
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  お子様連れでの来院を希望される方
                </li>
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  アットホームな雰囲気を好まれる方
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* クリニック詳細 */}
      <section className="py-12 lg:py-16 bg-greige-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              クリニック詳細
            </h2>

            <Card className="bg-white overflow-hidden">
              <div className="lg:flex">
                {/* 地図エリア */}
                <div className="lg:w-2/5 h-64 lg:h-auto bg-gradient-to-br from-green-100 to-green-50 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home className="w-16 h-16 text-green-300" />
                  </div>
                  <a
                    href={clinic.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md hover:shadow-lg transition-shadow flex items-center space-x-2 text-sm"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>地図を開く</span>
                  </a>
                </div>

                {/* 情報エリア */}
                <div className="lg:w-3/5 p-6 lg:p-8">
                  <h3 className="text-2xl font-medium text-greige-800 mb-4">{clinic.name}</h3>
                  <p className="text-greige-600 mb-6">{clinic.description}</p>

                  <div className="space-y-4">
                    {/* 住所 */}
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-greige-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-greige-700">住所</p>
                        <p className="text-greige-600">{clinic.address}</p>
                      </div>
                    </div>

                    {/* アクセス */}
                    <div className="flex items-start">
                      <Train className="w-5 h-5 text-greige-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-greige-700">電車でのアクセス</p>
                        {clinic.access.train.map((train, idx) => (
                          <p key={idx} className="text-greige-600">
                            {train.line} {train.station} {train.exit} {train.time}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* 車でのアクセス */}
                    <div className="flex items-start">
                      <Car className="w-5 h-5 text-greige-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-greige-700">車でのアクセス</p>
                        <p className="text-greige-600">{clinic.access.car}</p>
                      </div>
                    </div>

                    {/* 診療時間 */}
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-greige-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-greige-700">診療時間</p>
                        <p className="text-greige-600">平日: {clinic.hours.weekday}</p>
                        <p className="text-greige-600">土曜: {clinic.hours.saturday}</p>
                        <p className="text-greige-600">日曜: {clinic.hours.sunday}</p>
                        <p className="text-greige-600">休診: {clinic.hours.holiday}</p>
                      </div>
                    </div>
                  </div>

                  {/* 特徴 */}
                  <div className="mt-6">
                    <p className="font-medium text-greige-700 mb-3">特徴</p>
                    <div className="flex flex-wrap gap-2">
                      {clinic.features.map((feature) => (
                        <span key={feature} className="px-3 py-1 bg-green-50 text-greige-700 rounded-full text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 施術メニュー */}
            <div className="mt-8 bg-white rounded-2xl p-8">
              <h3 className="text-lg font-medium text-greige-800 mb-4">対応可能な施術</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {clinic.specialties.map((specialty) => (
                  <div key={specialty} className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                    <span className="text-greige-700">{specialty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* アクセス情報 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              各エリアからのアクセス
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accessFrom.map((access) => (
                <Card key={access.from} className="bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-greige-800">{access.from}から</p>
                      <p className="text-sm text-greige-600">{access.line}</p>
                    </div>
                    <p className="text-lg font-medium text-green-600">{access.time}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* 駐車場案内 */}
            <div className="mt-8 bg-green-50 rounded-2xl p-8">
              <div className="flex items-start">
                <Car className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-greige-800 mb-2">駐車場のご案内</h3>
                  <p className="text-greige-600 mb-2">
                    クリニック専用の無料駐車場を完備しております。
                  </p>
                  <ul className="space-y-1 text-sm text-greige-600">
                    <li>・駐車可能台数：10台</li>
                    <li>・利用料金：無料</li>
                    <li>・車高制限：なし</li>
                    <li>・大型車も駐車可能</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 予約情報 */}
            <div className="mt-8 bg-blue-50 rounded-2xl p-8">
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-greige-800 mb-2">ご予約について</h3>
                  <p className="text-greige-600 mb-4">
                    完全予約制となっております。LINEから簡単にご予約いただけます。
                  </p>
                  <p className="text-sm text-greige-500">
                    ※土日は混み合いますので、お早めのご予約をおすすめします
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-green-50 to-cream">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-serif text-greige-800 mb-4">
            柏エリアで施術をご希望の方へ
          </h2>
          <p className="text-greige-600 mb-8 max-w-2xl mx-auto">
            千葉県にお住まいの方に、通いやすい立地でお待ちしております
          </p>
          <LineButton size="lg">LINE無料カウンセリング予約</LineButton>
          <div className="mt-8">
            <Button variant="ghost" href="/clinics">
              他のエリアを見る
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}