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
  Star,
  Shield,
  Users,
  Phone,
  Navigation
} from 'lucide-react'

export default function GinzaClinicPage() {
  const clinics = [
    {
      name: 'THE GINZA ART CLINIC',
      description: '銀座の中心地に位置する高級感あふれるクリニック。プライバシーに配慮した完全個室で、落ち着いた雰囲気の中で施術を受けられます。',
      address: '東京都中央区銀座7-4-12',
      access: '銀座駅 A2出口より徒歩3分',
      mapUrl: 'https://maps.app.goo.gl/9nZknSVfWh5o24Mh7',
      features: ['完全個室', '最新設備', 'パウダールーム完備', '高級感のある内装'],
      specialties: ['眉毛アートメイク', 'リップアートメイク', 'パラメディカル'],
    },
    {
      name: '医療ボディクリニック',
      description: 'ビジネス街の新橋に位置し、お仕事帰りにも通いやすい立地。夜間診療も行っており、忙しい方にも安心です。',
      address: '東京都港区新橋2-5-14',
      access: '新橋駅より徒歩5分',
      mapUrl: 'https://maps.app.goo.gl/9fVdrGEpw2tDuRZN6',
      features: ['駅近', '夜間診療可', '男性OK', '広々とした待合室'],
      specialties: ['眉毛アートメイク', 'ヘアライン', 'メンズアートメイク'],
    },
    {
      name: 'メディカルブロー銀座院',
      description: '全国展開の大手クリニック。豊富な症例実績と最新技術を誇り、研修施設としても機能しています。',
      address: '東京都中央区銀座6-9-7',
      access: '銀座駅 A5出口より徒歩2分',
      mapUrl: 'https://maps.app.goo.gl/q9GNirhGSMkr58W99',
      features: ['大型院', '症例数No.1', '研修施設', '最新技術導入'],
      specialties: ['全メニュー対応', '最新技術', '教育プログラム'],
    },
  ]

  const areaFeatures = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: '都心の一等地',
      description: '銀座・新橋エリアは東京の中心地。アクセス抜群で通いやすい立地です。',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: '高品質な施術',
      description: '都内でも特に技術力の高い施術者が集まる、ハイクオリティなエリアです。',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '安心の医療体制',
      description: '大手医療機関が多く、安全管理体制が整った環境で施術を受けられます。',
    },
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
            <span className="text-greige-800 font-medium">銀座・新橋</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-greige-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-greige-100 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-serif text-greige-800 mb-4">
              銀座・新橋エリア
            </h1>
            <p className="text-lg text-greige-600 mb-2">
              東京都心の一等地で受ける、最高品質のアートメイク
            </p>
            <p className="text-base text-greige-500">
              3つの提携院から、お客様のライフスタイルに合わせてお選びいただけます
            </p>
          </div>
        </div>
      </section>

      {/* エリアの特徴 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              銀座・新橋エリアの特徴
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {areaFeatures.map((feature) => (
                <Card key={feature.title} hover className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-greige-100 rounded-full flex items-center justify-center text-greige-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-medium text-greige-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-greige-600">{feature.description}</p>
                </Card>
              ))}
            </div>

            {/* エリア説明 */}
            <div className="bg-greige-50 rounded-2xl p-8">
              <h3 className="text-lg font-medium text-greige-800 mb-4">このエリアがおすすめの方</h3>
              <ul className="space-y-2">
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-greige-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  都内にお住まい・お勤めの方
                </li>
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-greige-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  仕事帰りに施術を受けたい方
                </li>
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-greige-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  最新技術・設備での施術を希望される方
                </li>
                <li className="flex items-start text-greige-600">
                  <span className="w-1.5 h-1.5 bg-greige-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  プライバシーを重視される方
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
              提携クリニック
            </h2>

            <div className="space-y-8">
              {clinics.map((clinic, index) => (
                <Card key={clinic.name} className="bg-white overflow-hidden">
                  <div className="lg:flex">
                    {/* 地図エリア */}
                    <div className="lg:w-1/3 h-48 lg:h-auto bg-gradient-to-br from-greige-100 to-greige-50 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-greige-300" />
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-greige-700 text-white text-xs px-3 py-1 rounded-full">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    {/* 情報エリア */}
                    <div className="lg:w-2/3 p-6 lg:p-8">
                      <h3 className="text-xl font-medium text-greige-800 mb-3">{clinic.name}</h3>
                      <p className="text-greige-600 mb-4">{clinic.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-start text-sm mb-2">
                            <MapPin className="w-4 h-4 text-greige-400 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium text-greige-700">住所</p>
                              <p className="text-greige-600">{clinic.address}</p>
                            </div>
                          </div>
                          <div className="flex items-start text-sm">
                            <Train className="w-4 h-4 text-greige-400 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium text-greige-700">アクセス</p>
                              <p className="text-greige-600">{clinic.access}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-greige-700 text-sm mb-2">特徴</p>
                          <div className="flex flex-wrap gap-1">
                            {clinic.features.map((feature) => (
                              <span key={feature} className="text-xs bg-greige-100 text-greige-600 px-2 py-1 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-greige-100">
                        <div>
                          <p className="text-xs text-greige-500">得意施術</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {clinic.specialties.map((specialty) => (
                              <span key={specialty} className="text-xs text-greige-600">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                        <a
                          href={clinic.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-greige-600 hover:text-greige-800 transition-colors"
                        >
                          <Navigation className="w-4 h-4 mr-1" />
                          地図を見る
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* アクセス情報 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              アクセス情報
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <h3 className="font-medium text-greige-800 mb-4 flex items-center">
                  <Train className="w-5 h-5 mr-2 text-greige-600" />
                  主要路線
                </h3>
                <ul className="space-y-2 text-sm text-greige-600">
                  <li>・JR山手線（新橋駅）</li>
                  <li>・東京メトロ銀座線（銀座駅・新橋駅）</li>
                  <li>・東京メトロ日比谷線（銀座駅）</li>
                  <li>・東京メトロ丸ノ内線（銀座駅）</li>
                  <li>・都営浅草線（新橋駅）</li>
                </ul>
              </Card>

              <Card>
                <h3 className="font-medium text-greige-800 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-greige-600" />
                  所要時間の目安
                </h3>
                <ul className="space-y-2 text-sm text-greige-600">
                  <li>・東京駅から：約5分</li>
                  <li>・新宿駅から：約15分</li>
                  <li>・渋谷駅から：約13分</li>
                  <li>・品川駅から：約10分</li>
                  <li>・羽田空港から：約30分</li>
                </ul>
              </Card>
            </div>

            {/* 予約情報 */}
            <div className="mt-8 bg-blue-50 rounded-2xl p-8">
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-greige-800 mb-2">ご予約について</h3>
                  <p className="text-greige-600 mb-4">
                    銀座・新橋エリアの3院は、どちらの院でも同じ品質の施術を受けていただけます。
                    お客様のご都合に合わせて、通いやすい院をお選びください。
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
      <section className="py-12 lg:py-16 bg-gradient-to-br from-greige-50 to-cream">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-serif text-greige-800 mb-4">
            銀座・新橋エリアで施術をご希望の方へ
          </h2>
          <p className="text-greige-600 mb-8 max-w-2xl mx-auto">
            まずは無料カウンセリングで、お客様に最適な院をご案内いたします
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