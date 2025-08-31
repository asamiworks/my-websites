'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import { LineButton } from '@/components/ui/Button'
import { DetailAccordion } from '@/components/ui/Accordion'
import { ChevronRight, Heart, Shield, Info, CheckCircle, AlertCircle, Clock, Calendar, AlertTriangle } from 'lucide-react'

export default function StretchMarksPage() {
  const stretchMarkTypes = [
    {
      type: '妊娠線',
      description: '妊娠による急激な皮膚の伸展',
      location: 'お腹、胸、太もも',
      color: 'from-[#FDF6F0] to-white',
    },
    {
      type: '成長線',
      description: '成長期の急激な身長の伸び',
      location: '背中、腰、膝裏',
      color: 'from-[#F5EDE4] to-white',
    },
    {
      type: '肉割れ',
      description: '急激な体重増加による皮膚の伸展',
      location: '太もも、お尻、二の腕',
      color: 'from-[#FAF0E6] to-white',
    },
    {
      type: 'その他',
      description: 'ステロイド使用、クッシング症候群など',
      location: '様々な部位',
      color: 'from-[#F8F2EC] to-white',
    },
  ]

  const treatmentStages = [
    {
      stage: '赤〜紫の線',
      timing: '新しい（6ヶ月以内）',
      treatment: '炎症が落ち着いてから施術',
      effectiveness: '△',
    },
    {
      stage: 'ピンク色の線',
      timing: '6ヶ月〜1年',
      treatment: '白色に落ち着いてから施術可能',
      effectiveness: '△',
    },
    {
      stage: '白色の線',
      timing: '1年以上経過',
      treatment: '最も施術に適している',
      effectiveness: '◎',
    },
  ]

  const detailSections = [
    {
      title: 'ストレッチマーク修正とは',
      icon: <Info className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            ストレッチマーク（妊娠線・肉割れ）は、
            皮膚の急激な伸展により真皮のコラーゲン繊維が断裂することで生じる線状の痕です。
            スキンリジュビネーション技術により、皮膚に微細な刺激を与えることで
            自然な修復プロセスを促進し、線を目立たなくすることができます。
          </p>
          
          <div className="bg-greige-50 rounded-lg p-4">
            <h4 className="font-medium text-greige-800 mb-2">この施術の特徴</h4>
            <ul className="space-y-1 text-sm text-greige-600">
              <li>• スキンリジュビネーション（皮膚への微細な刺激）による自然な修復</li>
              <li>• 肌の再生力を活性化させる技術</li>
              <li>• 線の深さと状態に応じた施術法の選択</li>
              <li>• 必要に応じて色素を補助的に使用</li>
              <li>• 広範囲にも対応可能（分割施術）</li>
              <li>• 2〜3回の施術で完成</li>
            </ul>
          </div>

          <Card className="bg-[#FFF8F0] border border-[#E8D5C4]">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-[#B8956A] mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-[#8B7355]">
                  スキンリジュビネーション技術により、
                  ストレッチマークの凹凸を改善し、
                  周囲の肌との質感の差を軽減します。
                  効果には個人差があります。
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
                <p className="font-medium">問診・カウンセリング（30分）</p>
                <p className="text-sm mt-1 text-greige-600">ストレッチマークの状態を詳しく確認</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
              <div>
                <p className="font-medium">施術計画の作成</p>
                <p className="text-sm mt-1 text-greige-600">範囲と状態に応じて施術方法と回数を決定</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">4</span>
              <div>
                <p className="font-medium">施術準備（20分）</p>
                <p className="text-sm mt-1 text-greige-600">施術部位の消毒と準備</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">5</span>
              <div>
                <p className="font-medium">麻酔（20分）</p>
                <p className="text-sm mt-1 text-greige-600">麻酔クリームで痛みを軽減</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">6</span>
              <div>
                <p className="font-medium">施術（30〜90分）</p>
                <p className="text-sm mt-1 text-greige-600">スキンリジュビネーション技術で丁寧に修正</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">7</span>
              <div>
                <p className="font-medium">アフターケア説明（10分）</p>
                <p className="text-sm mt-1 text-greige-600">施術後のケア方法をご説明</p>
              </div>
            </li>
          </ol>

          <Card className="bg-[#F0F7FF]">
            <h4 className="font-medium text-[#4A6FA5] mb-2">施術時間の目安</h4>
            <ul className="space-y-1 text-sm text-[#5B7FA6]">
              <li>• 名刺サイズ（5×9cm）：約30分</li>
              <li>• ハガキサイズ（10×15cm）：約60分</li>
              <li>• それ以上：範囲により要相談</li>
            </ul>
          </Card>

          <Card className="bg-greige-50">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-greige-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-greige-600">
                  基本的にはスキンリジュビネーション（皮膚への微細な刺激）による施術を行います。
                  必要に応じて、補助的に色素を使用する場合があります。
                </p>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      title: '施術前の注意事項',
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <Card className="bg-[#F0F7FF]">
            <h4 className="font-medium text-[#4A6FA5] mb-2">施術1ヶ月前〜</h4>
            <ul className="space-y-1 text-sm text-[#5B7FA6]">
              <li>• レーザー、ピーリングなどの美容施術は受けないでください</li>
              <li>• レチノール系(ビタミンA)スキンケアは中止してください</li>
              <li>• 施術部位の保湿をお願いいたします</li>
            </ul>
          </Card>
          <Card className="bg-[#FFF8F0]">
            <h4 className="font-medium text-[#B8956A] mb-2">前日〜当日</h4>
            <ul className="space-y-1 text-sm text-[#8B7355]">
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
              <li>• 感染予防のため清潔に保つ</li>
            </ul>
          </Card>
          <Card className="bg-[#FFF8F0]">
            <h4 className="font-medium text-[#B8956A] mb-2">施術後1週間</h4>
            <ul className="space-y-1 text-sm text-[#8B7355]">
              <li>• 1日2回ワセリンで保護</li>
              <li>• 紫外線対策を徹底する</li>
              <li>• かさぶたは自然に剥がれるのを待つ</li>
              <li>• アルコール、激しい運動、プール、海水浴は避ける</li>
            </ul>
          </Card>
          <Card className="bg-[#F0F8F0]">
            <h4 className="font-medium text-[#5A8A5A] mb-2">経過観察</h4>
            <ul className="space-y-2 text-sm text-[#4A7A4A]">
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
              <li><strong>7. ストレッチマークが新しすぎる方（6ヶ月以内の赤紫色）</strong></li>
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
              <p className="font-medium text-greige-800 mb-1">Q. どのような技術を使いますか？</p>
              <p className="text-sm text-greige-600">
                A. スキンリジュビネーションという皮膚に微細な刺激を与える技術を使用します。
                肌の自然な再生力を活性化させることで、ストレッチマークを目立たなくします。
                必要に応じて色素を補助的に使用する場合もあります。
              </p>
            </div>
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. どのくらい目立たなくなりますか？</p>
              <p className="text-sm text-greige-600">
                A. 個人差はありますが、50〜80%程度目立たなくなります。特に白色化したストレッチマークに効果的です。
              </p>
            </div>
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. 痛みはありますか？</p>
              <p className="text-sm text-greige-600">
                A. 麻酔クリームを使用するため、痛みは最小限です。チクチクする程度とお考えください。
              </p>
            </div>
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. 妊娠中・授乳中でも施術できますか？</p>
              <p className="text-sm text-greige-600">
                A. 申し訳ございませんが、妊娠中・授乳中の方は施術をお受けいただけません。
              </p>
            </div>
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. 日焼けした肌でも大丈夫ですか？</p>
              <p className="text-sm text-greige-600">
                A. 日焼けが落ち着いてからの施術をおすすめします。肌の状態に合わせて施術方法を調整いたします。
              </p>
            </div>
            <div>
              <p className="font-medium text-greige-800 mb-1">Q. 何回くらい施術が必要ですか？</p>
              <p className="text-sm text-greige-600">
                A. 多くの場合、2〜3回の施術で自然な仕上がりになります。範囲や状態により異なります。
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
            <span className="text-greige-800 font-medium">ストレッチマーク</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-greige-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-serif text-greige-800 mb-4">
              ストレッチマーク修正
            </h1>
            <p className="text-lg text-greige-600">
              妊娠線・肉割れを目立たなくし、
              <br />
              なめらかで美しい肌の印象へ
            </p>
          </div>
        </div>
      </section>

      {/* ストレッチマークの種類 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              対応可能なストレッチマーク
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {stretchMarkTypes.map((type) => (
                <Card key={type.type} hover className={`bg-gradient-to-br ${type.color}`}>
                  <div>
                    <h3 className="font-medium text-greige-800 mb-1">{type.type}</h3>
                    <p className="text-sm text-greige-600 mb-2">{type.description}</p>
                    <p className="text-xs text-greige-500">
                      主な部位：{type.location}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {/* 施術適応の時期 */}
            <div className="mt-12">
              <h3 className="text-xl font-medium text-greige-800 text-center mb-6">
                施術に適した時期
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-greige-50">
                      <th className="border border-greige-200 px-4 py-3 text-left text-sm">色の状態</th>
                      <th className="border border-greige-200 px-4 py-3 text-left text-sm">経過時間</th>
                      <th className="border border-greige-200 px-4 py-3 text-left text-sm">施術について</th>
                      <th className="border border-greige-200 px-4 py-3 text-center text-sm">効果</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treatmentStages.map((stage) => (
                      <tr key={stage.stage}>
                        <td className="border border-greige-200 px-4 py-3 text-sm">{stage.stage}</td>
                        <td className="border border-greige-200 px-4 py-3 text-sm">{stage.timing}</td>
                        <td className="border border-greige-200 px-4 py-3 text-sm">{stage.treatment}</td>
                        <td className="border border-greige-200 px-4 py-3 text-center text-xl">{stage.effectiveness}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-greige-500 mt-2 text-center">
                ※ 白色化したストレッチマークが最も施術効果が高くなります
              </p>
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
                    <th className="border border-greige-200 px-4 py-3 text-left">サイズ</th>
                    <th className="border border-greige-200 px-4 py-3 text-left">説明</th>
                    <th className="border border-greige-200 px-4 py-3 text-right">料金</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-greige-200 px-4 py-3 font-medium">5×9cm</td>
                    <td className="border border-greige-200 px-4 py-3 text-greige-600">名刺サイズ</td>
                    <td className="border border-greige-200 px-4 py-3 text-right font-medium">¥15,000</td>
                  </tr>
                  <tr>
                    <td className="border border-greige-200 px-4 py-3 font-medium">10×15cm</td>
                    <td className="border border-greige-200 px-4 py-3 text-greige-600">ハガキサイズ</td>
                    <td className="border border-greige-200 px-4 py-3 text-right font-medium">¥33,000</td>
                  </tr>
                  <tr className="bg-greige-50">
                    <td className="border border-greige-200 px-4 py-3 font-medium">それ以上</td>
                    <td className="border border-greige-200 px-4 py-3 text-greige-600">カスタムサイズ</td>
                    <td className="border border-greige-200 px-4 py-3 text-right font-medium">要相談</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <Card className="mt-6 bg-[#F0F7FF]">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-[#4A6FA5] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#5B7FA6]">
                    広範囲の場合は、複数回に分けて施術いたします。
                    スキンリジュビネーション技術により、多くの妊娠線は2〜3回の施術で大幅に改善されます。
                    まずは気になる部分から始めることも可能です。
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
            ストレッチマークの悩みを解決しませんか
          </h2>
          <p className="text-greige-600 mb-8 max-w-2xl mx-auto">
            多くの方が「もっと早く受ければよかった」とおっしゃいます。
            <br />
            まずは無料カウンセリングでご相談ください。
          </p>
          <LineButton size="lg">公式LINE無料カウンセリング予約</LineButton>
        </div>
      </section>
    </div>
  )
}