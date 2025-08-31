'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import { LineButton } from '@/components/ui/Button'
import { ChevronRight, Info, Gift, Calendar, CreditCard, AlertCircle } from 'lucide-react'

export default function PricingPage() {
  const beautyMenus = [
    {
      name: '眉毛アートメイク',
      description: '自然な毛並みを再現し、理想の眉を実現',
      prices: {
        regular: 55000,
        monitor: 44000,
        retouch: 40000,
        retouchWithinYear: 38000,
      },
      note: 'リタッチは3回目以降の料金です',
    },
    {
      name: 'リップアートメイク',
      description: '血色感のある美しい唇を演出',
      prices: {
        regular: 55000,
        monitor: 44000,
        retouch: 40000,
        retouchWithinYear: 38000,
      },
      note: 'リタッチは3回目以降の料金です',
    },
  ]

  const paramedicalMenus = [
    {
      name: '傷痕',
      description: '事故や手術による傷痕を目立たなくします',
      prices: [
        { size: '1×1cm', price: 12000 },
        { size: '2×2cm', price: 22000 },
        { size: '3×3cm', price: 30000 },
      ],
    },
    {
      name: '白斑',
      description: '白斑部分を自然な肌色でカバー',
      prices: [
        { size: '5×5cm', price: 30000 },
        { size: 'リタッチ（2ヶ月以内）', price: 14000 },
      ],
    },
    {
      name: '口唇口蓋裂',
      description: '口唇口蓋裂の手術痕を自然にカバー',
      prices: [
        { size: '1回', price: 30000 },
      ],
    },
    {
      name: 'ストレッチマーク',
      description: '妊娠線や肉割れを目立たなくします',
      prices: [
        { size: '5×9cm（名刺サイズ）', price: 15000 },
        { size: '10×15cm（ハガキサイズ）', price: 33000 },
      ],
    },
  ]

  const paymentMethods = ['現金', 'クレジットカード']

  const cancellationPolicy = [
    { timing: '予約日の2日前まで', fee: '無料' },
    { timing: '予約日の前日', fee: '施術料金の50%' },
    { timing: '当日キャンセル・無断キャンセル', fee: '施術料金の100%' },
  ]

  const notes = [
    '表示価格は全て税込みです',
    '施術は完全予約制です',
    'カウンセリングは無料です',
    '施術前に医師の診察が必要です',
    'パラメディカルアートメイクは適応条件がございますのでご相談ください',
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
            <span className="text-greige-800 font-medium">料金表</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-greige-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-serif text-greige-800 mb-4">
              料金表
            </h1>
            <p className="text-lg text-greige-600">
              明確な料金体系で安心の施術をご提供
            </p>
          </div>
        </div>
      </section>

      {/* 美容アートメイク料金 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              美容アートメイク
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {beautyMenus.map((menu) => (
                <Card key={menu.name} hover className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-greige-50 rounded-full -translate-y-16 translate-x-16 opacity-50" />
                  
                  <h3 className="text-xl font-medium text-greige-800 mb-2">{menu.name}</h3>
                  <p className="text-sm text-greige-600 mb-6">{menu.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-greige-100">
                      <span className="text-greige-700">通常価格（1回）</span>
                      <span className="text-xl font-medium text-greige-800">
                        ¥{menu.prices.regular.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-greige-100">
                      <span className="text-greige-700 flex items-center">
                        モニター価格（1回）
                        <Gift className="w-4 h-4 ml-1 text-amber-500" />
                      </span>
                      <span className="text-xl font-medium text-amber-600">
                        ¥{menu.prices.monitor.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-greige-100">
                      <span className="text-greige-700">リタッチ（3回目〜）</span>
                      <span className="text-lg text-greige-700">
                        ¥{menu.prices.retouch.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-greige-700">リタッチ（1年以内）</span>
                      <span className="text-lg text-greige-700">
                        ¥{menu.prices.retouchWithinYear.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {menu.note && (
                    <p className="mt-4 text-xs text-greige-500 flex items-start">
                      <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                      {menu.note}
                    </p>
                  )}
                </Card>
              ))}
            </div>

            {/* モニター条件 */}
            <div className="mt-8 bg-amber-50 rounded-2xl p-6 lg:p-8">
              <h3 className="text-lg font-medium text-greige-800 mb-4 flex items-center">
                <Gift className="w-5 h-5 text-amber-500 mr-2" />
                モニター条件
              </h3>
              <ul className="space-y-2 text-sm text-greige-600">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">①</span>
                  全顔お写真のSNS掲載にご協力いただける方
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">②</span>
                  2回目施術にご来院いただける方
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* パラメディカルアートメイク料金 */}
      <section className="py-12 lg:py-16 bg-greige-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              パラメディカルアートメイク
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {paramedicalMenus.map((menu) => (
                <Card key={menu.name} className="bg-white">
                  <h3 className="text-xl font-medium text-greige-800 mb-2">{menu.name}</h3>
                  <p className="text-sm text-greige-600 mb-4">{menu.description}</p>
                  
                  <div className="space-y-2">
                    {menu.prices.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-greige-100 last:border-0">
                        <span className="text-greige-700 text-sm">{item.size}</span>
                        <span className="text-lg font-medium text-greige-800">
                          ¥{item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 bg-amber-50 rounded-xl p-6">
              <p className="text-sm text-amber-800 flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                パラメディカルアートメイクは適応条件がございます。カウンセリング時に詳しくご説明いたします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* オプション・その他 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              その他料金
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 追加オプション */}
              <Card>
                <h3 className="text-lg font-medium text-greige-800 mb-4">追加オプション</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-greige-100">
                    <span className="text-greige-700">麻酔クリーム</span>
                    <span className="text-greige-800">無料（基本料金に含む）</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <span className="text-greige-700">抗ウイルス薬</span>
                      <p className="text-xs text-greige-500 mt-1">ヘルペス予防（リップ施術）</p>
                    </div>
                    <span className="text-lg font-medium text-greige-800">¥3,300</span>
                  </div>
                </div>
              </Card>

              {/* 支払い方法 */}
              <Card>
                <h3 className="text-lg font-medium text-greige-800 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-greige-600" />
                  お支払い方法
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <div key={method} className="bg-greige-50 rounded-lg p-3 text-center">
                      <span className="text-greige-700">{method}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-greige-500">
                  ※医療ローンについてはお問い合わせください
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* キャンセルポリシー */}
      <section className="py-12 lg:py-16 bg-greige-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white">
              <h3 className="text-lg font-medium text-greige-800 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-greige-600" />
                キャンセルポリシー
              </h3>
              
              <div className="space-y-3 mb-6">
                {cancellationPolicy.map((policy) => (
                  <div key={policy.timing} className="flex justify-between items-center py-2 border-b border-greige-100">
                    <span className="text-greige-700">{policy.timing}</span>
                    <span className="font-medium text-greige-800">{policy.fee}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-greige-600">
                ※体調不良や緊急の場合はご相談ください
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 注意事項 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-medium text-greige-800 mb-6 text-center">ご注意事項</h3>
            <ul className="space-y-2">
              {notes.map((note, index) => (
                <li key={index} className="flex items-start text-sm text-greige-600">
                  <span className="w-1.5 h-1.5 bg-greige-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-greige-50 to-cream">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-serif text-greige-800 mb-4">
            料金についてのご相談
          </h2>
          <p className="text-greige-600 mb-8 max-w-2xl mx-auto">
            詳しい料金やお支払い方法について、お気軽にお問い合わせください
          </p>
          <LineButton size="lg">LINE無料カウンセリング予約</LineButton>
        </div>
      </section>
    </div>
  )
}