'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import { LineButton } from '@/components/ui/Button'
import { DetailAccordion } from '@/components/ui/Accordion'
import { ChevronRight, Shield, Heart, Clock, AlertCircle, CheckCircle, Info, Calendar, AlertTriangle } from 'lucide-react'

export default function VitiligoPage() {
  const vitiligoTypes = [
    {
      type: '尋常性白斑',
      description: '最も一般的な白斑症',
      features: ['左右対称に現れることが多い', '進行性の場合がある', '全身に広がる可能性'],
      percentage: '約70%',
    },
    {
      type: '分節型白斑',
      description: '神経の走行に沿って現れる',
      features: ['片側性に現れる', '比較的若年で発症', '進行が限定的'],
      percentage: '約20%',
    },
    {
      type: '限局型白斑',
      description: '特定の部位に限定',
      features: ['1〜数個の白斑', '範囲が限定的', '進行が緩やか'],
      percentage: '約10%',
    },
  ]

  const treatableAreas = [
    { area: '顔面', description: '額、頬、口周り' },
    { area: '首・デコルテ', description: '首筋、鎖骨周辺' },
    { area: '手・腕', description: '手の甲、前腕' },
    { area: '脚', description: '膝、すね、太もも' },
    { area: '背中', description: '肩甲骨周辺' },
    { area: 'その他', description: 'ご相談ください' },
  ]

  const detailSections = [
    {
      title: '白斑カモフラージュとは',
      icon: <Info className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            白斑症（尋常性白斑）は、メラニン色素を作る細胞が減少または消失することで、
            皮膚の一部が白く抜ける疾患です。
            医療補助としてのパラメディカルアートメイクでは、白斑部分に周囲の肌色に合わせた色素を注入し、
            目立たなくする施術を行います。
          </p>
          
          <div className="bg-greige-50 rounded-lg p-4">
            <h4 className="font-medium text-greige-800 mb-2">施術の特徴</h4>
            <ul className="space-y-1 text-sm text-greige-600">
              <li>• 肌色を細かく分析してカスタムカラーを作成</li>
              <li>• 複数の色を使用して自然なグラデーション</li>
              <li>• 日焼けによる色の変化にも対応可能</li>
              <li>• 段階的に色を調整して最適な仕上がりに</li>
              <li>• 2〜3回の施術で完成</li>
            </ul>
          </div>

          <Card className="bg-amber-50 border border-amber-200">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-700">
                  白斑の進行が活発な時期は施術を控え、
                  症状が安定してから施術を行うことをおすすめします。
                  まずは皮膚科での診察を受けてください。
                </p>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      title: '施術の流れ',
      icon: <Clock className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <ol className="space-y-4">
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">1</span>
              <div>
                <p className="font-medium">カウンセリング予約</p>
                <p className="text-sm mt-1 text-greige-600">公式LINEから簡単予約</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">2</span>
              <div>
                <p className="font-medium">問診・カウンセリング（60分）</p>
                <p className="text-sm mt-1 text-greige-600">白斑の状態確認、既往歴の確認、施術計画の立案</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
              <div>
                <p className="font-medium">カラーマッチング（30分）</p>
                <p className="text-sm mt-1 text-greige-600">周囲の肌色を詳細に分析し、最適な色を調合</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">4</span>
              <div>
                <p className="font-medium">麻酔（20分）</p>
                <p className="text-sm mt-1 text-greige-600">麻酔クリームで痛みを軽減</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">5</span>
              <div>
                <p className="font-medium">施術（60-120分）</p>
                <p className="text-sm mt-1 text-greige-600">丁寧に色素を注入していきます</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">6</span>
              <div>
                <p className="font-medium">アフターケア説明（10分）</p>
                <p className="text-sm mt-1 text-greige-600">施術後のケア方法をご説明</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">7</span>
              <div>
                <p className="font-medium">2回目施術（1-2ヶ月後）</p>
                <p className="text-sm mt-1 text-greige-600">色の定着を確認し、必要に応じて調整</p>
              </div>
            </li>
          </ol>
        </div>
      ),
    },
    {
      title: '施術前の注意事項',
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <Card className="bg-blue-50">
            <h4 className="font-medium text-blue-800 mb-2">施術1ヶ月前〜</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• レーザー、ピーリングなどの美容施術は受けないでください</li>
              <li>• レチノール系(ビタミンA)スキンケアは中止してください</li>
              <li>• 施術部位の保湿をお願いいたします</li>
              <li>• 皮膚科での診察を受けてください</li>
            </ul>
          </Card>
          <Card className="bg-amber-50">
            <h4 className="font-medium text-amber-800 mb-2">前日〜当日</h4>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• 飲酒やカフェイン摂取はお控えください</li>
              <li>• しっかり睡眠をとってください</li>
              <li>• 施術部位を清潔に保ってください</li>
              <li>• 日焼けは避けてください</li>
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
              <li>• 感染予防と色素定着のため</li>
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
              <li>• 直後：施術部位がやや赤みを帯びる</li>
              <li>• 3-7日：かさぶたができ、徐々に剥がれる</li>
              <li>• 2週間：色が落ち着き始める</li>
              <li>• 1ヶ月：色が定着し、自然な仕上がりに</li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      title: '施術を受けられない方・注意が必要な方',
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
              <li><strong>7. 白斑が進行中の方</strong></li>
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
              <li><strong>5. 日焼けをしている方</strong></li>
            </ul>
          </Card>
          <p className="text-sm text-greige-600">
            ※パラメディカルアートメイクは適応条件がございますので、まずはご相談ください
          </p>
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
              <p className="font-medium text-greige-800 mb-1">Q. 白斑が広範囲ですが施術できますか？</p>
              <p className="text-sm text-greige-600">
                A. 広範囲の場合は、数回に分けて施術を行います。まずは目立つ部分から始めることをおすすめします。
              </p>
            </div>
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. 日焼けしても大丈夫ですか？</p>
              <p className="text-sm text-greige-600">
                A. 施術後1ヶ月は日焼けを避けてください。その後は通常通り日焼けできますが、色の調整が必要になる場合があります。
              </p>
            </div>
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. 白斑が進行中でも施術できますか？</p>
              <p className="text-sm text-greige-600">
                A. 進行が活発な時期は避け、症状が安定してからの施術をおすすめします。
              </p>
            </div>
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. 効果はどのくらい持続しますか？</p>
              <p className="text-sm text-greige-600">
                A. 個人差はありますが、1〜3年程度持続します。定期的なメンテナンスで効果を維持できます。
              </p>
            </div>
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. 保険は適用されますか？</p>
              <p className="text-sm text-greige-600">
                A. 残念ながら保険適用外となります。ただし、医療費控除の対象になる場合があります。
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
            <span className="text-greige-800 font-medium">白斑カモフラージュ</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-greige-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-serif text-greige-800 mb-4">
              白斑カモフラージュ
            </h1>
            <p className="text-lg text-greige-600">
              白斑症による色素脱失を自然にカバーし、
              <br />
              メイクなしでも自信を持てる肌へ
            </p>
          </div>
        </div>
      </section>

      {/* 白斑の種類 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              対応可能な白斑症
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {vitiligoTypes.map((type) => (
                <Card key={type.type} hover>
                  <div className="text-center mb-3">
                    <span className="text-2xl font-bold text-greige-700">{type.percentage}</span>
                    <p className="text-xs text-greige-500">の患者様</p>
                  </div>
                  <h3 className="font-medium text-greige-800 mb-2">{type.type}</h3>
                  <p className="text-sm text-greige-600 mb-3">{type.description}</p>
                  <ul className="space-y-1">
                    {type.features.map((feature) => (
                      <li key={feature} className="text-xs text-greige-500 flex items-start">
                        <span className="w-1 h-1 bg-greige-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            {/* 施術可能部位 */}
            <h3 className="text-xl font-medium text-greige-800 text-center mb-6">
              施術可能部位
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {treatableAreas.map((area) => (
                <Card key={area.area} className="text-center p-3">
                  <p className="text-sm font-medium text-greige-800">{area.area}</p>
                  <p className="text-xs text-greige-500 mt-1">{area.description}</p>
                </Card>
              ))}
            </div>
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
                    <th className="border border-greige-200 px-4 py-3 text-left">サイズ・メニュー</th>
                    <th className="border border-greige-200 px-4 py-3 text-left">説明</th>
                    <th className="border border-greige-200 px-4 py-3 text-right">料金</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-greige-200 px-4 py-3 font-medium">5×5cm</td>
                    <td className="border border-greige-200 px-4 py-3 text-greige-600">手のひらサイズ</td>
                    <td className="border border-greige-200 px-4 py-3 text-right font-medium">¥30,000</td>
                  </tr>
                  <tr>
                    <td className="border border-greige-200 px-4 py-3 font-medium">リタッチ（2ヶ月以内）</td>
                    <td className="border border-greige-200 px-4 py-3 text-greige-600">早期の色調整</td>
                    <td className="border border-greige-200 px-4 py-3 text-right font-medium">¥14,000</td>
                  </tr>
                  <tr className="bg-greige-50">
                    <td className="border border-greige-200 px-4 py-3 font-medium">それ以上のサイズ</td>
                    <td className="border border-greige-200 px-4 py-3 text-greige-600">カスタムサイズ</td>
                    <td className="border border-greige-200 px-4 py-3 text-right font-medium">要相談</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <Card className="mt-6 bg-blue-50">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700">
                    広範囲の場合は、複数回に分けて施術いたします。
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
            白斑の悩みから解放されませんか
          </h2>
          <p className="text-greige-600 mb-8 max-w-2xl mx-auto">
            多くの方が施術後「もっと早く受ければよかった」とおっしゃいます。
            <br />
            まずは無料カウンセリングでご相談ください。
          </p>
          <LineButton size="lg">公式LINE無料カウンセリング予約</LineButton>
        </div>
      </section>
    </div>
  )
}