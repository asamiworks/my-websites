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
  Building2,
  ShoppingBag,
  Sparkles,
  Users,
  Phone,
  Navigation,
  Anchor
} from 'lucide-react'

export default function YokohamaClinicPage() {
  const clinic = {
    name: 'メディカルブロー横浜院',
    description: '横浜駅西口から徒歩3分の好立地。神奈川県最大級の施術室を完備し、最新設備と技術で高品質な施術を提供。ショッピングのついでに立ち寄れる便利な立地で、モダンで洗練された空間です。',
    address: '神奈川県横浜市西区北幸1-1-8',
    access: [
      { line: 'JR各線', station: '横浜駅', exit: '西口', time: '徒歩3分' },
      { line: '東急東横線', station: '横浜駅', exit: '西口', time: '徒歩3分' },
      { line: '相鉄線', station: '横浜駅', exit: '西口', time: '徒歩3分' },
      { line: '横浜市営地下鉄', station: '横浜駅', exit: '9番出口', time: '徒歩1分' },
      { line: '京急本線', station: '横浜駅', exit: '西口', time: '徒歩5分' },
    ],
    mapUrl: 'https://maps.app.goo.gl/Wfj34wpfYa9LxKwn8',
    features: [
      '神奈川エリア最大級',
      '駅直結',
      '最新設備完備',
      'モダンな内装',
      'ショッピング施設隣接',
      '年中無休'
    ],
    hours: {
      weekday: '10:00〜19:00',
      weekend: '10:00〜19:00',
      holiday: '年中無休（年末年始を除く）'
    },
    specialties: [
      '眉毛アートメイク',
      'リップアートメイク',
      'アイライン',
      'ヘアライン',
      'パラメディカルアートメイク',
      'メンズアートメイク'
    ]
  }

  const areaFeatures = [
    {
      icon: <Anchor className="w-6 h-6" />,
      title: '横浜の中心地',
      description: '神奈川県最大のターミナル駅から徒歩3分。県内全域からアクセス抜群です。',
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: 'ショッピングも楽しめる',
      description: '商業施設が充実したエリアで、施術前後のお買い物も楽しめます。',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: '最新設備・技術',
      description: '神奈川県最大級の施術室と最新機器で、快適な施術環境を提供します。',
    },
  ]

  const accessFrom = [
    { from: '川崎駅', time: '約8分', line: 'JR東海道線' },
    { from: '鎌倉駅', time: '約25分', line: 'JR横須賀線' },
    { from: '藤沢駅', time: '約20分', line: 'JR東海道線' },
    { from: '小田原駅', time: '約35分', line: 'JR東海道線' },
    { from: '町田駅', time: '約30分', line: 'JR横浜線' },
    { from: '大船駅', time: '約15分', line: 'JR東海道線' },
  ]

  const nearbySpots = [
    { name: '横浜高島屋', type: 'デパート', time: '徒歩1分' },
    { name: 'ジョイナス', type: 'ショッピング', time: '徒歩1分' },
    { name: '横浜モアーズ', type: 'ファッション', time: '徒歩3分' },
    { name: 'そごう横浜店', type: 'デパート', time: '徒歩5分' },
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
            <span className="text-greige-800 font-medium">横浜</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-serif text-greige-800 mb-4">
              横浜エリア
            </h1>
            <p className="text-lg text-greige-600 mb-2">
              神奈川県最大のターミナル駅で、最高のアクセス環境
            </p>
            <p className="text-base text-greige-500">
              最新設備と洗練された空間で、上質な施術体験を
            </p>
          </div>
        </div>
      </section>

      {/* エリアの特徴 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              横浜エリアの特徴
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {areaFeatures.map((feature) => (
                <Card key={feature.title} hover className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-medium text-greige-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-greige-600">{feature.description}</p>
                </Card>
              ))}
            </div>

            {/* エリア説明 */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-lg font-medium text-greige-800 mb-4">このエリアがおすすめの方</h3>
              <ul className="space-y-2">
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  神奈川県全域からアクセスしやすい立地をお探しの方
                </li>
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  最新設備での施術を希望される方
                </li>
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  ショッピングのついでに立ち寄りたい方
                </li>
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  土日祝日も通院したい方
                </li>
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  モダンで洗練された空間を好まれる方
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
                <div className="lg:w-2/5 h-64 lg:h-auto bg-gradient-to-br from-blue-100 to-blue-50 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-blue-300" />
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
                        <p className="font-medium text-greige-700">アクセス</p>
                        {clinic.access.map((access, idx) => (
                          <p key={idx} className="text-greige-600 text-sm">
                            {access.line} {access.station} {access.exit} {access.time}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* 診療時間 */}
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-greige-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-greige-700">診療時間</p>
                        <p className="text-greige-600">平日: {clinic.hours.weekday}</p>
                        <p className="text-greige-600">土日祝: {clinic.hours.weekend}</p>
                        <p className="text-greige-600">{clinic.hours.holiday}</p>
                      </div>
                    </div>
                  </div>

                  {/* 特徴 */}
                  <div className="mt-6">
                    <p className="font-medium text-greige-700 mb-3">特徴</p>
                    <div className="flex flex-wrap gap-2">
                      {clinic.features.map((feature) => (
                        <span key={feature} className="px-3 py-1 bg-blue-50 text-greige-700 rounded-full text-sm">
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clinic.specialties.map((specialty) => (
                  <div key={specialty} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                    <span className="text-greige-700">{specialty}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-greige-500">
                ※全メニューに対応可能な総合クリニックです
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* アクセス・周辺情報 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              アクセス・周辺情報
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* 各エリアからのアクセス */}
              <div>
                <h3 className="text-lg font-medium text-greige-800 mb-4">各エリアからのアクセス</h3>
                <div className="space-y-3">
                  {accessFrom.map((access) => (
                    <Card key={access.from} className="bg-blue-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-greige-800">{access.from}から</p>
                          <p className="text-xs text-greige-600">{access.line}</p>
                        </div>
                        <p className="text-lg font-medium text-blue-600">{access.time}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 周辺施設 */}
              <div>
                <h3 className="text-lg font-medium text-greige-800 mb-4">周辺施設</h3>
                <div className="space-y-3">
                  {nearbySpots.map((spot) => (
                    <Card key={spot.name} className="bg-greige-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-greige-800">{spot.name}</p>
                          <p className="text-xs text-greige-600">{spot.type}</p>
                        </div>
                        <p className="text-sm text-greige-600">{spot.time}</p>
                      </div>
                    </Card>
                  ))}
                </div>
                <p className="mt-4 text-sm text-greige-500">
                  ※施術前後のお買い物も楽しめる便利な立地です
                </p>
              </div>
            </div>

            {/* 横浜駅の特徴 */}
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8">
              <div className="flex items-start">
                <Building2 className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-greige-800 mb-2">横浜駅について</h3>
                  <p className="text-greige-600 mb-4">
                    横浜駅は1日の乗降客数が約230万人を超える、日本有数のターミナル駅です。
                    JR・私鉄・地下鉄が乗り入れ、神奈川県内のどこからでもアクセスしやすい立地です。
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-greige-600">
                    <div>
                      <p className="font-medium mb-1">乗り入れ路線</p>
                      <ul className="space-y-1">
                        <li>・JR（東海道線、横須賀線、湘南新宿ライン、横浜線、根岸線）</li>
                        <li>・東急東横線</li>
                        <li>・京急本線</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-1">　</p>
                      <ul className="space-y-1">
                        <li>・相鉄線</li>
                        <li>・横浜市営地下鉄ブルーライン</li>
                        <li>・みなとみらい線（接続）</li>
                      </ul>
                    </div>
                  </div>
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
                    年中無休で診療しておりますので、お客様のご都合に合わせて施術日をお選びいただけます。
                    人気のクリニックのため、お早めのご予約をおすすめします。
                  </p>
                  <p className="text-sm text-greige-500">
                    ※完全予約制となっております
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-cream">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-serif text-greige-800 mb-4">
            横浜エリアで施術をご希望の方へ
          </h2>
          <p className="text-greige-600 mb-8 max-w-2xl mx-auto">
            神奈川県最大級の施設で、最高品質の施術をご提供いたします
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