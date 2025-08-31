'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import { LineButton } from '@/components/ui/Button'
import { ChevronRight, Phone, Calendar, Clipboard, Palette, Shield, Heart, Home, AlertCircle } from 'lucide-react'

export default function FlowPage() {
  const steps = [
    {
      number: '01',
      title: 'カウンセリング予約',
      icon: <Phone className="w-8 h-8" />,
      duration: '5分',
      description: '公式LINEから簡単予約',
      details: [
        'LINE ID: bhodgys を友だち追加',
        'ご希望の日時を3つお知らせください',
        'お悩みや施術希望部位をお伝えください',
        '24時間受付中（返信は営業時間内）',
      ],
      bgColor: 'from-blue-50 to-white',
      iconColor: 'text-blue-500',
    },
    {
      number: '02',
      title: '問診・カウンセリング',
      icon: <Clipboard className="w-8 h-8" />,
      duration: '30分',
      description: 'お悩みを詳しくヒアリング',
      details: [
        '問診票のご記入',
        '既往歴・アレルギーの確認',
        'お悩みやご希望を詳しくお伺い',
        '施術内容・リスクの説明',
        '料金のご案内',
      ],
      bgColor: 'from-green-50 to-white',
      iconColor: 'text-green-500',
    },
    {
      number: '03',
      title: 'デザイン決定',
      icon: <Palette className="w-8 h-8" />,
      duration: '30-40分',
      description: '理想のデザインを作成',
      details: [
        '黄金比測定で最適なバランスを確認',
        'お顔立ちに合わせたデザイン提案',
        '色の選定（肌色に合わせて）',
        '納得いくまで調整',
        '最終確認と同意書サイン',
      ],
      bgColor: 'from-purple-50 to-white',
      iconColor: 'text-purple-500',
    },
    {
      number: '04',
      title: '麻酔',
      icon: <Shield className="w-8 h-8" />,
      duration: '20-30分',
      description: '痛みを最小限に',
      details: [
        '麻酔クリームを塗布',
        '20-30分待機',
        '痛みの確認',
        '必要に応じて追加麻酔',
      ],
      bgColor: 'from-yellow-50 to-white',
      iconColor: 'text-yellow-500',
    },
    {
      number: '05',
      title: '施術',
      icon: <Heart className="w-8 h-8" />,
      duration: '60-90分',
      description: '丁寧に施術',
      details: [
        '専用器具で色素を注入',
        '細かく確認しながら進行',
        '痛みがあれば都度調整',
        '左右のバランスを確認',
        '仕上がりの最終チェック',
      ],
      bgColor: 'from-amber-50 to-white',
iconColor: 'text-amber-500',
    },
    {
      number: '06',
      title: 'アフターケア説明',
      icon: <Home className="w-8 h-8" />,
      duration: '10分',
      description: '自宅でのケア方法',
      details: [
        'ワセリンの塗り方説明',
        '注意事項の確認',
        'ダウンタイムの説明',
        '次回予約の案内',
        'LINE での24時間サポート',
      ],
      bgColor: 'from-indigo-50 to-white',
      iconColor: 'text-indigo-500',
    },
    {
      number: '07',
      title: '2回目施術',
      icon: <Calendar className="w-8 h-8" />,
      duration: '1-2ヶ月後',
      description: '定着と仕上げ',
      details: [
        '1回目の定着具合を確認',
        '色味・形の微調整',
        'より自然な仕上がりに',
        '完成度を高める',
      ],
      bgColor: 'from-teal-50 to-white',
      iconColor: 'text-teal-500',
    },
  ]

  const beforeCare = [
    {
      timing: '1ヶ月前〜',
      items: [
        'レーザー、ピーリング、美容施術は受けない',
        'レチノール系スキンケアは中止',
        '施術部位の保湿を心がける',
      ],
    },
    {
      timing: '2週間前〜',
      items: [
        '眉脱色、お顔の脱毛は済ませる',
        '日焼けは避ける',
      ],
    },
    {
      timing: '前日〜当日',
      items: [
        '飲酒・カフェイン摂取は控える',
        '十分な睡眠をとる',
        '眉毛は切らない・剃らない（眉施術の方）',
        '普段通りのメイクでご来院OK',
      ],
    },
  ]

  const afterCare = [
    {
      timing: '施術後24時間',
      items: [
        '絶対に濡らさない',
        '傷口から色素が流れ落ちるのを防ぐ',
      ],
      important: true,
    },
    {
      timing: '施術後1週間',
      items: [
        '1日2回ワセリンを塗布',
        '施術部位のメイク・クレンジング不可',
        'アルコール、激しい運動、プール、サウナは避ける',
        'かさぶたは無理に剥がさない',
        '紫外線対策をする',
      ],
    },
    {
      timing: '施術後1ヶ月',
      items: [
        'レチノール系化粧品は中止継続',
        '美容施術は1ヶ月以降から',
        '色の定着を待つ',
      ],
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
            <span className="text-greige-800 font-medium">施術の流れ</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-greige-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-serif text-greige-800 mb-4">
              施術の流れ
            </h1>
            <p className="text-lg text-greige-600">
              カウンセリングから施術完了まで、安心のサポート体制
            </p>
          </div>
        </div>
      </section>

      {/* 施術の流れ */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* タイムライン */}
            <div className="relative">
              {/* 縦線（モバイル） */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-greige-200 lg:hidden" />
              
              <div className="space-y-8 lg:space-y-12">
                {steps.map((step, index) => (
                  <div key={step.number} className="relative">
                    {/* 横線（デスクトップ） */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 left-1/2 w-full h-0.5 bg-greige-200 transform -translate-y-1/2" style={{ zIndex: -1 }} />
                    )}
                    
                    <div className="flex items-start lg:items-center">
                      {/* ステップ番号（モバイル） */}
                      <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full border-4 border-greige-200 flex items-center justify-center lg:hidden">
                        <span className="text-xl font-bold text-greige-700">{step.number}</span>
                      </div>
                      
                      {/* カード */}
                      <div className="flex-1 ml-6 lg:ml-0">
                        <Card className={`bg-gradient-to-br ${step.bgColor}`}>
                          <div className="flex flex-col lg:flex-row lg:items-center">
                            {/* アイコン */}
                            <div className="mb-4 lg:mb-0 lg:mr-6">
                              <div className={`w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center ${step.iconColor}`}>
                                {step.icon}
                              </div>
                            </div>
                            
                            {/* 内容 */}
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span className="hidden lg:inline-block text-2xl font-bold text-greige-300 mr-3">
                                  {step.number}
                                </span>
                                <h3 className="text-xl font-medium text-greige-800">
                                  {step.title}
                                </h3>
                                <span className="ml-auto text-sm text-greige-500 bg-white px-3 py-1 rounded-full">
                                  {step.duration}
                                </span>
                              </div>
                              <p className="text-greige-600 mb-3">{step.description}</p>
                              <ul className="space-y-1">
                                {step.details.map((detail, idx) => (
                                  <li key={idx} className="flex items-start text-sm text-greige-600">
                                    <span className="w-1.5 h-1.5 bg-greige-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 所要時間まとめ */}
            <div className="mt-12 bg-greige-50 rounded-2xl p-6 lg:p-8">
              <h3 className="text-lg font-medium text-greige-800 mb-4">トータル所要時間</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="font-medium text-greige-800 mb-1">初回施術</p>
                  <p className="text-2xl font-bold text-greige-700">約2.5〜3時間</p>
                  <p className="text-sm text-greige-600 mt-1">カウンセリング含む</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-medium text-greige-800 mb-1">2回目以降</p>
                  <p className="text-2xl font-bold text-greige-700">約1.5〜2時間</p>
                  <p className="text-sm text-greige-600 mt-1">デザイン確定済みのため短縮</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 施術前後のケア */}
      <section className="py-12 lg:py-16 bg-greige-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              施術前後のケア
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 施術前 */}
              <div>
                <h3 className="text-xl font-medium text-greige-800 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">前</span>
                  施術前の過ごし方
                </h3>
                <div className="space-y-4">
                  {beforeCare.map((period) => (
                    <Card key={period.timing}>
                      <p className="font-medium text-greige-800 mb-3">{period.timing}</p>
                      <ul className="space-y-2">
                        {period.items.map((item, idx) => (
                          <li key={idx} className="flex items-start text-sm text-greige-600">
                            <span className="w-1.5 h-1.5 bg-greige-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 施術後 */}
              <div>
                <h3 className="text-xl font-medium text-greige-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mr-3">後</span>
                  施術後の過ごし方
                </h3>
                <div className="space-y-4">
                  {afterCare.map((period) => (
                    <Card 
                      key={period.timing}
                      className={period.important ? 'border-2 border-amber-300' : ''}
                    >
                      <p className="font-medium text-greige-800 mb-3 flex items-center">
                        {period.timing}
                        {period.important && (
                          <span className="ml-2 text-amber-500">
                            <AlertCircle className="w-4 h-4" />
                          </span>
                        )}
                      </p>
                      <ul className="space-y-2">
                        {period.items.map((item, idx) => (
                          <li key={idx} className="flex items-start text-sm text-greige-600">
                            <span className={`w-1.5 h-1.5 ${
  period.important ? 'bg-amber-400' : 'bg-greige-400'
} rounded-full mr-2 mt-1.5 flex-shrink-0`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
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
            安心の施術体制
          </h2>
          <p className="text-greige-600 mb-8 max-w-2xl mx-auto">
            経験豊富な施術者が、最初から最後まで責任を持って対応いたします
          </p>
          <LineButton size="lg">LINE無料カウンセリング予約</LineButton>
        </div>
      </section>
    </div>
  )
}