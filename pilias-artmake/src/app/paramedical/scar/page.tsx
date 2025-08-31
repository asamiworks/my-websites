'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import { LineButton } from '@/components/ui/Button'
import { DetailAccordion } from '@/components/ui/Accordion'
import { ChevronRight, Shield, Heart, Clock, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export default function ScarPage() {
  const scarTypes = [
    {
      type: '手術痕',
      description: '外科手術による縫合痕',
      examples: ['帝王切開', '虫垂炎', '腫瘍摘出', '美容整形'],
    },
    {
      type: '事故による傷痕',
      description: '交通事故や怪我による傷',
      examples: ['切り傷', '擦り傷の痕', '縫合痕', '打撲痕'],
    },
    {
      type: '火傷痕',
      description: '熱傷による色素沈着や瘢痕',
      examples: ['軽度火傷痕', '日焼け痕', '熱傷瘢痕', 'レーザー治療痕'],
    },
    {
      type: 'リストカット痕',
      description: '自傷行為による傷痕',
      examples: ['線状瘢痕', '複数の傷痕', '古い傷痕', '色素沈着'],
    },
    {
      type: 'その他',
      description: '様々な原因による傷痕',
      examples: ['ニキビ痕', '水疱瘡痕', 'BCG痕', '注射痕'],
    },
  ]

  const treatmentProcess = [
    {
      phase: 'カウンセリング予約',
      duration: '公式LINE',
      details: [
        '公式LINEから簡単予約',
        '傷痕の写真を事前送付可能',
        'プライバシーに配慮した対応',
      ],
    },
    {
      phase: '問診・カウンセリング',
      duration: '30-60分',
      details: [
        '傷痕の状態を詳しく確認',
        '傷の深さ、質感を診察',
        '施術可能かどうかの判断',
        'お客様のご希望をヒアリング',
      ],
    },
    {
      phase: '施術準備',
      duration: '20分',
      details: [
        '施術部位の消毒',
        '施術方法の最終確認',
        '必要に応じて写真撮影',
      ],
    },
    {
      phase: '麻酔',
      duration: '20分',
      details: [
        '麻酔クリームの塗布',
        '痛みを最小限に',
      ],
    },
    {
      phase: '施術',
      duration: '30-90分',
      details: [
        'スキンリジュビネーション技術での修正',
        '皮膚への微細な刺激で再生を促進',
        '傷の質感を整える処理',
        '周囲の肌との境界を自然に',
      ],
    },
    {
      phase: 'アフターケア説明',
      duration: '10分',
      details: [
        '全体のバランス確認',
        'アフターケアの説明',
        '次回予約の案内',
      ],
    },
    {
      phase: '2回目施術',
      duration: '2-3ヶ月後',
      details: [
        '傷痕の状態確認',
        '必要に応じて追加施術',
        '完成度を高める',
      ],
    },
  ]

  const pricing = [
    { size: '1×1cm', price: 12000, description: '小さな傷痕' },
    { size: '2×2cm', price: 22000, description: '中サイズの傷痕' },
    { size: '3×3cm', price: 30000, description: '大きめの傷痕' },
    { size: 'それ以上', price: '要相談', description: 'カスタム料金' },
  ]

  const detailSections = [
    {
      title: '傷痕修正とは',
      icon: <Info className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            傷痕修正は、事故や手術で生じた傷痕を、
            スキンリジュビネーション技術により目立たなくする施術です。
            皮膚に微細な刺激を与えることで自然な修復プロセスを活性化し、
            傷痕の質感を整え、周囲の肌になじませることで自然な見た目に改善します。
          </p>
          <div className="bg-greige-50 rounded-lg p-4">
            <h4 className="font-medium text-greige-800 mb-2">この施術の特徴</h4>
            <ul className="space-y-2 text-sm text-greige-600">
              <li>• スキンリジュビネーション（皮膚への微細な刺激）による自然な修復</li>
              <li>• 肌の再生力を活性化させる技術</li>
              <li>• 傷痕の質感を改善し、凹凸を目立たなくする</li>
              <li>• 必要に応じて色素を補助的に使用</li>
              <li>• 段階的な改善が可能</li>
              <li>• 2〜3回の施術で完成</li>
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">重要な注意点</h4>
            <p className="text-sm text-amber-700">
              スキンリジュビネーション技術により傷痕を目立たなくすることができますが、
              完全に消すことはできません。
              肌の自然な再生力を活用して改善を図ります。
              効果には個人差があることをご理解ください。
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '適応となる傷痕',
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-green-50">
              <h4 className="font-medium text-green-800 mb-2">施術可能な傷痕</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• 完全に治癒した傷痕（6ヶ月以上経過）</li>
                <li>• 色素沈着や色素脱失がある傷</li>
                <li>• 平坦または軽度の凹凸がある傷</li>
                <li>• 白色を帯びた傷痕</li>
                <li>• 手術痕・事故痕・火傷痕</li>
                <li>• リストカット痕</li>
              </ul>
            </Card>
            <Card className="bg-amber-50">
              <h4 className="font-medium text-amber-800 mb-2">施術不可の傷痕</h4>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>• まだ治癒していない傷</li>
                <li>• ケロイド状の傷痕</li>
                <li>• 深い凹凸がある傷</li>
                <li>• 炎症や感染がある傷</li>
                <li>• 悪性腫瘍の可能性がある部位</li>
              </ul>
            </Card>
          </div>
          <p className="text-sm text-greige-600">
            ※パラメディカルアートメイクは適応条件がございますので、まずはご相談ください
          </p>
        </div>
      ),
    },
    {
      title: '施術の流れ',
      icon: <Clock className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          {treatmentProcess.map((phase, index) => (
            <div key={phase.phase} className="flex">
              <div className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-greige-800">{phase.phase}</h4>
                  <span className="text-sm text-greige-500">{phase.duration}</span>
                </div>
                <ul className="space-y-1">
                  {phase.details.map((detail) => (
                    <li key={detail} className="text-sm text-greige-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-greige-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          
          <Card className="bg-greige-50 mt-6">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-greige-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-greige-600">
                  基本的にはスキンリジュビネーション（皮膚への微細な刺激）による施術を行います。
                  傷痕の状態に応じて、必要な場合のみ補助的に色素を使用することがあります。
                </p>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      title: '施術前の注意事項',
      icon: <AlertCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <Card className="bg-blue-50">
            <h4 className="font-medium text-blue-800 mb-2">施術1ヶ月前〜</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• レーザー、ピーリングなどの美容施術は受けないでください</li>
              <li>• レチノール系(ビタミンA)スキンケアは中止してください</li>
              <li>• 施術部位の保湿をお願いいたします</li>
            </ul>
          </Card>
          <Card className="bg-amber-50">
            <h4 className="font-medium text-amber-800 mb-2">前日〜当日</h4>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• 飲酒やカフェイン摂取はお控えください</li>
              <li>• しっかり睡眠をとってください</li>
              <li>• 施術部位を清潔に保ってください</li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      title: 'アフターケア',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <Card className="bg-amber-50 border-amber-200">
            <h4 className="font-medium text-amber-800 mb-2">施術後24時間</h4>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• 施術部位は絶対に濡らさない</li>
              <li>• 感染予防のため清潔に保つ</li>
            </ul>
          </Card>
          <Card className="bg-amber-50">
            <h4 className="font-medium text-amber-800 mb-2">施術後1週間</h4>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• 1日2回ワセリンで保護</li>
              <li>• 紫外線対策を徹底する</li>
              <li>• かさぶたは自然に剥がれるのを待つ</li>
              <li>• アルコール、激しい運動、プール、海水浴は避ける</li>
            </ul>
          </Card>
          <Card className="bg-green-50">
            <h4 className="font-medium text-green-800 mb-2">経過観察</h4>
            <ul className="space-y-2 text-sm text-green-700">
              <li>• 1週間後：かさぶたが剥がれ始める</li>
              <li>• 2週間後：肌の再生が始まる</li>
              <li>• 1ヶ月後：改善効果を確認</li>
              <li>• 2-3ヶ月後：必要に応じて2回目施術</li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      title: '施術を受けられない方',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <Card className="bg-amber-50 border-amber-200">
            <h4 className="font-medium text-amber-800 mb-3">
              <span className="bg-amber-100 text-amber-600 text-xs px-2 py-1 rounded mr-2">禁忌</span>
              施術できない方
            </h4>
            <ul className="space-y-2 text-sm text-amber-700">
              <li><strong>1. 妊娠中・授乳中の方</strong></li>
              <li><strong>2. 感染症の方</strong></li>
              <li><strong>3. 糖尿病の方</strong></li>
              <li><strong>4. ケロイド体質の方</strong></li>
              <li><strong>5. 麻酔・金属アレルギーの方</strong></li>
              <li><strong>6. 半年以内に施術部位の切開手術をされた方</strong></li>
              <li><strong>7. 傷が完全に治癒していない方</strong></li>
            </ul>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <h4 className="font-medium text-amber-800 mb-3">
              <span className="bg-amber-100 text-amber-600 text-xs px-2 py-1 rounded mr-2">注意</span>
              注意が必要な方
            </h4>
            <ul className="space-y-2 text-sm text-amber-700">
              <li><strong>1. アトピー体質、お肌が弱い方</strong></li>
              <li><strong>2. 血友病、抗凝固薬服用中の方</strong></li>
              <li><strong>3. 生理中の方</strong></li>
              <li><strong>4. 1ヶ月以内に施術部位周囲の美容施術を受けられた方</strong></li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      title: 'よくあるご質問',
      icon: <Info className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. どのような技術を使いますか？</p>
              <p className="text-sm text-greige-600">
                A. スキンリジュビネーションという皮膚に微細な刺激を与える技術を使用します。
                肌の自然な再生力を活性化させることで、傷痕を目立たなくします。
                傷痕の状態により、必要に応じて色素を補助的に使用する場合もあります。
              </p>
            </div>
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. どのくらい目立たなくなりますか？</p>
              <p className="text-sm text-greige-600">
                A. 個人差はありますが、多くの方が満足いく改善を実感されています。
                完全に消すことはできませんが、日常生活で気にならない程度まで改善が期待できます。
              </p>
            </div>
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. 痛みはありますか？</p>
              <p className="text-sm text-greige-600">
                A. 麻酔クリームを使用するため、痛みは最小限です。チクチクする程度とお考えください。
              </p>
            </div>
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. リストカット痕も施術できますか？</p>
              <p className="text-sm text-greige-600">
                A. はい、施術可能です。プライバシーに配慮し、判断することなくサポートいたします。
                まずは無料カウンセリングでご相談ください。
              </p>
            </div>
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. 何回くらい施術が必要ですか？</p>
              <p className="text-sm text-greige-600">
                A. 傷痕の状態により異なりますが、多くの場合2〜3回の施術で自然な仕上がりになります。
              </p>
            </div>
          </div>
        </div>
      ),
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
            <Link href="/paramedical" className="text-greige-600 hover:text-greige-800">
              パラメディカル
            </Link>
            <ChevronRight className="w-4 h-4 text-greige-400" />
            <span className="text-greige-800 font-medium">傷痕修正</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-greige-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-serif text-greige-800 mb-4">
              傷痕修正
            </h1>
            <p className="text-lg text-greige-600">
              事故や手術による傷痕を目立たなくし、
              <br />
              自信を持って肌を見せられるようにサポートします
            </p>
          </div>
        </div>
      </section>

      {/* 対応可能な傷痕 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              対応可能な傷痕
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scarTypes.map((scar) => (
                <Card key={scar.type} hover>
                  <h3 className="font-medium text-greige-800 mb-2 text-center">
                    {scar.type}
                  </h3>
                  <p className="text-sm text-greige-600 mb-3 text-center">
                    {scar.description}
                  </p>
                  <div className="border-t border-greige-200 pt-3">
                    <p className="text-xs text-greige-500 mb-2">例：</p>
                    <div className="flex flex-wrap gap-1">
                      {scar.examples.map((example) => (
                        <span
                          key={example}
                          className="text-xs px-2 py-1 bg-greige-50 rounded-full text-greige-600"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* メッセージ */}
            <Card className="mt-8 bg-gradient-to-br from-[#FDF6F0] to-white border border-[#E8D5C4]">
              <div className="text-center">
                <Heart className="w-8 h-8 text-[#D4B896] mx-auto mb-3" />
                <p className="text-greige-700 leading-relaxed">
                  リストカット痕でお悩みの方へ
                  <br />
                  過去の傷を隠すお手伝いをさせてください。
                  プライバシーは厳守し、判断することなく寄り添います。
                  新しい一歩を踏み出すサポートをいたします。
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 詳細情報 */}
      <section className="py-12 lg:py-16 bg-greige-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-8">
              詳細情報
            </h2>
            <DetailAccordion sections={detailSections} />
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-8">
              料金
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-greige-50">
                    <th className="border border-greige-200 px-4 py-3 text-left">サイズ</th>
                    <th className="border border-greige-200 px-4 py-3 text-left">説明</th>
                    <th className="border border-greige-200 px-4 py-3 text-right">料金</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.map((item) => (
                    <tr key={item.size}>
                      <td className="border border-greige-200 px-4 py-3 font-medium">
                        {item.size}
                      </td>
                      <td className="border border-greige-200 px-4 py-3 text-greige-600">
                        {item.description}
                      </td>
                      <td className="border border-greige-200 px-4 py-3 text-right font-medium">
                        {typeof item.price === 'number' 
                          ? `¥${item.price.toLocaleString()}`
                          : item.price
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <Card className="mt-6 bg-blue-50">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700">
                    スキンリジュビネーション技術により、傷痕の状態を改善します。
                    多くの場合、2〜3回の施術で自然な仕上がりになります。
                    詳しくは無料カウンセリングでご相談ください。
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-greige-50 to-cream">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-serif text-greige-800 mb-4">
            傷痕の悩みから解放されましょう
          </h2>
          <p className="text-greige-600 mb-8 max-w-2xl mx-auto">
            まずは無料カウンセリングで、あなたの傷痕の状態を確認させてください
          </p>
          <LineButton size="lg">公式LINE無料カウンセリング予約</LineButton>
        </div>
      </section>
    </div>
  )
}