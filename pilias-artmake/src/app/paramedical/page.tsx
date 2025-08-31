'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import { LineButton } from '@/components/ui/Button'
import Button from '@/components/ui/Button'
import { ChevronRight, Heart, Shield, Users, CheckCircle, AlertCircle, ArrowRight, Sparkles, HandHeart, Stethoscope } from 'lucide-react'

export default function ParamedicalPage() {
  const treatments = [
    {
      id: 'scar',
      name: '傷痕カモフラージュ',
      icon: <Sparkles className="w-6 h-6" />,
      description: '事故や手術による傷痕を目立たなくし、自然な肌の見た目を取り戻します。',
      targets: [
        '手術跡',
        '事故による傷痕',
        'リストカット跡',
        'やけど跡',
      ],
      process: '傷痕の状態を確認し、周囲の肌色に合わせて色素を調合。複数回の施術で自然にカバー。',
      price: '1×1cm: ¥12,000〜',
      href: '/paramedical/scar',
    },
    {
      id: 'vitiligo',
      name: '白斑カモフラージュ',
      icon: <HandHeart className="w-6 h-6" />,
      description: '白斑症による色素脱失部分を自然な肌色でカバーし、メイクなしでも気にならない肌へ。',
      targets: [
        '尋常性白斑',
        '分節型白斑',
        '顔面の白斑',
        '手足の白斑',
      ],
      process: '白斑の範囲と周囲の肌色を分析し、最適な色素を選定。段階的に色を入れていきます。',
      price: '5×5cm: ¥30,000〜',
      href: '/paramedical/vitiligo',
    },
    {
      id: 'cleft-lip',
      name: '口唇口蓋裂修正',
      icon: <Heart className="w-6 h-6" />,
      description: '口唇口蓋裂の手術痕を目立たなくし、唇の形を整えて自然な口元を演出します。',
      targets: [
        '口唇裂術後',
        '口蓋裂術後',
        '唇の形の非対称',
        '傷跡のカバー',
      ],
      process: '手術痕の状態を確認し、唇の形を整えながら色素を入れます。自然な仕上がりを重視。',
      price: '1回: ¥30,000',
      href: '/paramedical/cleft-lip',
    },
    {
      id: 'stretch-marks',
      name: 'ストレッチマーク',
      icon: <Stethoscope className="w-6 h-6" />,
      description: '妊娠線や肉割れを目立たなくし、滑らかな肌の印象を取り戻します。',
      targets: [
        '妊娠線',
        '急激な体重変化による肉割れ',
        '成長期のストレッチマーク',
        '筋トレによる肉割れ',
      ],
      process: 'ストレッチマークの深さと色を確認し、周囲の肌色に馴染むよう段階的に施術。',
      price: '名刺サイズ: ¥15,000〜',
      href: '/paramedical/stretch-marks',
    },
  ]

  const benefits = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: '心理的負担の軽減',
      description: '外見の悩みから解放され、自信を持って日常生活を送れるようになります。',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: '医療知識に基づく施術',
      description: '看護師資格を持つ施術者が、医学的知識に基づいた安全な施術を提供します。',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '豊富な症例実績',
      description: 'パラメディカル専門の技術研修を受け、多くの症例を経験しています。',
    },
  ]

  const faqs = [
    {
      question: 'パラメディカルアートメイクは保険適用されますか？',
      answer: '現在、パラメディカルアートメイクは保険適用外となります。ただし、医療費控除の対象となる場合がありますので、詳しくはご相談ください。',
    },
    {
      question: '何回の施術で完成しますか？',
      answer: '症状や範囲により異なりますが、通常2〜3回の施術で完成します。傷痕の状態によっては追加施術が必要な場合もあります。',
    },
    {
      question: '施術の痛みはありますか？',
      answer: '麻酔クリームを使用しますので、痛みは最小限に抑えられます。傷痕部分は感覚が鈍い場合も多く、通常のアートメイクより痛みを感じにくいことが多いです。',
    },
    {
      question: '効果はどのくらい持続しますか？',
      answer: '個人差はありますが、1〜3年程度持続します。定期的なメンテナンスで美しい状態を保つことができます。',
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
            <span className="text-greige-800 font-medium">パラメディカルアートメイク</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-[#FDF6F0] to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-serif text-greige-800 mb-4">
              パラメディカルアートメイク
            </h1>
            <p className="text-lg text-greige-600 mb-2">
              医療補助アートメイクで、心と体の悩みを解決
            </p>
            <p className="text-base text-greige-500">
              傷痕・白斑・手術痕など、外見の悩みを自然にカバーし、
              <br className="hidden lg:block" />
              自信を取り戻すお手伝いをいたします
            </p>
          </div>
        </div>
      </section>

      {/* パラメディカルアートメイクとは */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 mb-4">
                パラメディカルアートメイクとは
              </h2>
              <p className="text-greige-600 max-w-3xl mx-auto">
                医療補助を目的としたアートメイクで、病気や事故、手術などによる外見の変化をカバーする技術です。
                医療従事者の知識と技術により、自然で美しい仕上がりを実現します。
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <Card key={benefit.title} hover className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-[#FDF6F0] rounded-full flex items-center justify-center text-[#C8A882]">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-greige-800 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-greige-600">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 施術メニュー */}
      <section className="py-12 lg:py-16 bg-greige-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              施術メニュー
            </h2>

            <div className="grid lg:grid-cols-2 gap-6">
              {treatments.map((treatment) => (
                <Card key={treatment.id} className="bg-white overflow-hidden group hover:shadow-lg transition-all duration-300">
                  {/* ヘッダー部分 */}
                  <div className="bg-gradient-to-r from-[#FDF6F0] to-[#FAF0E6] p-6 border-b border-greige-100">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#C8A882] mr-4 
                                    group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        {treatment.icon}
                      </div>
                      <h3 className="text-xl font-medium text-greige-800">
                        {treatment.name}
                      </h3>
                    </div>
                  </div>

                  {/* コンテンツ部分 */}
                  <div className="p-6">
                    <p className="text-greige-600 mb-4 text-sm leading-relaxed">
                      {treatment.description}
                    </p>

                    {/* 対象となる症状 */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-greige-700 mb-2">対象となる症状</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {treatment.targets.map((target) => (
                          <div key={target} className="flex items-start text-xs text-greige-600">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                            <span>{target}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 施術の特徴 */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-greige-700 mb-2">施術の特徴</h4>
                      <p className="text-xs text-greige-600 leading-relaxed">{treatment.process}</p>
                    </div>

                    {/* 料金と詳細ボタン */}
                    <div className="flex items-center justify-between pt-4 border-t border-greige-100">
                      <div>
                        <span className="text-xs text-greige-500">料金目安</span>
                        <p className="text-base font-medium text-greige-800">{treatment.price}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        href={treatment.href}
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                        iconPosition="right"
                        className="group-hover:bg-[#FDF6F0] group-hover:border-[#C8A882] group-hover:text-[#8B6F47] transition-colors duration-300"
                      >
                        詳しく見る
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* 補足情報 */}
            <div className="mt-8 text-center">
              <p className="text-sm text-greige-500">
                ※ 料金は施術範囲や状態により変動します。詳しくは無料カウンセリングにてご相談ください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 施術可能条件 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-amber-50 border-2 border-amber-200">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-greige-800 mb-3">施術をお受けいただく前に</h3>
                  <p className="text-greige-600 mb-4">
                    パラメディカルアートメイクには適応条件があります。以下の方は事前にご相談ください。
                  </p>
                  <ul className="space-y-2 text-sm text-greige-600">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                      傷痕が完全に治癒していない方（最低6ヶ月以上経過が必要）
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                      ケロイド体質の方
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                      皮膚疾患がある方
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                      妊娠中・授乳中の方
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* よくある質問 */}
      <section className="py-12 lg:py-16 bg-greige-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              よくある質問
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-white">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#FDF6F0] rounded-full flex items-center justify-center text-[#B8956A] text-sm font-medium mr-4">
                      Q
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-greige-800 mb-2">{faq.question}</h3>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-greige-600 text-sm font-medium mr-4">
                          A
                        </div>
                        <p className="text-greige-600 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-[#FDF6F0] to-cream">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Heart className="w-12 h-12 text-[#D4B896] mx-auto mb-6" />
          <h2 className="text-2xl lg:text-3xl font-serif text-greige-800 mb-4">
            あなたの悩みに寄り添います
          </h2>
          <p className="text-greige-600 mb-8 max-w-2xl mx-auto">
            外見の悩みは心の負担にもなります。
            <br />
            一人で悩まず、まずは無料カウンセリングでご相談ください。
          </p>
          <LineButton size="lg">LINE無料カウンセリング予約</LineButton>
          <p className="mt-4 text-sm text-greige-500">
            プライバシーに配慮した完全個室でご相談いただけます
          </p>
        </div>
      </section>
    </div>
  )
}