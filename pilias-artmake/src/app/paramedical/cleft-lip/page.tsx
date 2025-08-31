'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import { LineButton } from '@/components/ui/Button'
import { DetailAccordion } from '@/components/ui/Accordion'
import { ChevronRight, Heart, Shield, Info, CheckCircle, AlertCircle, Clock, Calendar, AlertTriangle } from 'lucide-react'

export default function CleftLipPage() {
  const improvements = [
    {
      title: '唇の輪郭修正',
      description: '手術痕による不自然な輪郭を整え、左右対称に近づけます',
    },
    {
      title: '色の均一化',
      description: '傷痕部分の色素不足を補い、自然な唇の色に',
    },
    {
      title: '傷痕のカモフラージュ',
      description: '目立つ手術痕を自然にぼかします',
    },
  ]

  const detailSections = [
    {
      title: '口唇口蓋裂修正とは',
      icon: <Info className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            口唇口蓋裂の手術後に残る傷痕や、唇の形の非対称性を
            医療補助としてのアートメイク技術で自然に修正します。
            唇の輪郭を整え、色を均一にすることで、
            より自然で美しい口元を実現します。
          </p>
          
          <div className="bg-greige-50 rounded-lg p-4">
            <h4 className="font-medium text-greige-800 mb-2">この施術でできること</h4>
            <ul className="space-y-1 text-sm text-greige-600">
              <li>• 唇の輪郭を左右対称に近づける</li>
              <li>• 手術痕を目立たなくする</li>
              <li>• 唇の色を均一にする</li>
              <li>• 自然なボリューム感を演出</li>
              <li>• 口紅なしでも血色感のある唇に</li>
            </ul>
          </div>

          <Card className="bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-700">
              <strong>重要：</strong>手術から最低6ヶ月以上経過し、
              傷が完全に治癒してからの施術となります。
              事前に主治医の許可を得てください。
            </p>
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
                <p className="text-sm mt-1 text-greige-600">手術歴の確認、ご希望のデザイン相談</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
              <div>
                <p className="font-medium">デザイン作成（30分）</p>
                <p className="text-sm mt-1 text-greige-600">理想的な唇の形をデザイン</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">4</span>
              <div>
                <p className="font-medium">麻酔（30分）</p>
                <p className="text-sm mt-1 text-greige-600">唇は敏感なため、しっかりと麻酔を効かせます</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">5</span>
              <div>
                <p className="font-medium">施術（60-90分）</p>
                <p className="text-sm mt-1 text-greige-600">丁寧に色素を注入</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">6</span>
              <div>
                <p className="font-medium">アフターケア説明（10分）</p>
                <p className="text-sm mt-1 text-greige-600">リップ特有の注意事項をご説明</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">7</span>
              <div>
                <p className="font-medium">2回目施術（1〜2ヶ月後）</p>
                <p className="text-sm mt-1 text-greige-600">色の定着と調整を行います</p>
              </div>
            </li>
          </ol>
          
          <Card className="bg-blue-50">
            <h4 className="font-medium text-blue-800 mb-2">施術回数について</h4>
            <p className="text-sm text-blue-700">
              通常2〜3回の施術で理想的な仕上がりになります。
              1回目は控えめに、2回目以降で調整していきます。
            </p>
          </Card>
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
              <li>• レーザー、ピーリング、ヒアルロン酸などの美容施術は受けないでください</li>
              <li>• レチノール系(ビタミンA)スキンケアは中止してください</li>
              <li>• 唇の保湿をお願いいたします</li>
            </ul>
          </Card>
          <Card className="bg-amber-50">
            <h4 className="font-medium text-amber-800 mb-2">前日〜当日</h4>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• 飲酒やカフェイン摂取はお控えください</li>
              <li>• しっかり睡眠をとってください</li>
              <li>• 前日は就寝前に唇をしっかり保湿してください</li>
              <li>• 主治医の許可書をご持参ください（必要な場合）</li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      title: 'ダウンタイムとアフターケア',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-medium text-amber-800 mb-3">ダウンタイムについて</p>
            <div className="space-y-2 text-sm text-amber-700">
              <p><strong>腫れ：</strong>2〜3日（通常のリップより腫れやすい場合があります）</p>
              <p><strong>皮むけ：</strong>3〜7日（無理に剥がさずワセリンで保護）</p>
              <p><strong>色の定着：</strong>1ヶ月後に確認</p>
            </div>
          </div>

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
              <li>• 生ものや辛い物、味の濃いものは避ける</li>
              <li>• 飲み物はストローを使用</li>
              <li>• リップメイクは避ける</li>
            </ul>
          </Card>

          <Card className="bg-green-50">
            <h4 className="font-medium text-green-800 mb-2">施術後1ヶ月</h4>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• レチノール系化粧品は中止継続</li>
              <li>• 美容施術は1ヶ月以降から</li>
              <li>• 色の定着を確認</li>
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
              <li><strong>6. 半年以内に口唇部の手術をされた方</strong></li>
              <li><strong>7. 口唇ヘルペスが活動期の方</strong></li>
              <li><strong>8. 主治医の許可が得られない方</strong></li>
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
              <li><strong>4. 口唇ヘルペスの既往がある方</strong><br />　→予防薬の内服が必要です</li>
            </ul>
          </Card>
          <p className="text-sm text-greige-600">
            ※パラメディカルアートメイクは適応条件がございますので、まずはご相談ください
          </p>
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
            <span className="text-greige-800 font-medium">口唇口蓋裂修正</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-greige-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-serif text-greige-800 mb-4">
              口唇口蓋裂修正
            </h1>
            <p className="text-lg text-greige-600">
              手術痕を自然にカバーし、
              <br />
              美しい口元で笑顔に自信を
            </p>
          </div>
        </div>
      </section>

      {/* 改善できること */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-12">
              改善できること
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {improvements.map((item) => (
                <Card key={item.title} hover>
                  <h3 className="font-medium text-greige-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-greige-600">{item.description}</p>
                </Card>
              ))}
            </div>

            {/* メッセージ */}
            <Card className="mt-8 bg-gradient-to-br from-[#FDF6F0] to-white border border-[#E8D5C4]">
              <div className="text-center">
                <Heart className="w-8 h-8 text-[#D4B896] mx-auto mb-3" />
                <p className="text-greige-700 leading-relaxed">
                  口唇口蓋裂の手術を受けられた方へ
                  <br />
                  手術痕が気になって思い切り笑えない、
                  口紅が綺麗に塗れないなどのお悩みを解決します。
                  自然で美しい口元で、自信を持って笑顔になれるよう
                  お手伝いさせてください。
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
                    <th className="border border-greige-200 px-4 py-3 text-left">メニュー</th>
                    <th className="border border-greige-200 px-4 py-3 text-right">料金</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-greige-200 px-4 py-3">口唇口蓋裂修正（1回）</td>
                    <td className="border border-greige-200 px-4 py-3 text-right font-medium">¥30,000</td>
                  </tr>
                  <tr>
                    <td className="border border-greige-200 px-4 py-3">リタッチ（2回目以降）</td>
                    <td className="border border-greige-200 px-4 py-3 text-right font-medium">¥30,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <Card className="mt-6 bg-blue-50">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700">
                    多くの場合、2〜3回の施術で理想的な仕上がりになります。
                    施術回数は傷の状態により個人差があります。
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
            美しい口元で自信を取り戻しましょう
          </h2>
          <p className="text-greige-600 mb-8 max-w-2xl mx-auto">
            まずは無料カウンセリングで、あなたのお悩みをお聞かせください
          </p>
          <LineButton size="lg">公式LINE無料カウンセリング予約</LineButton>
        </div>
      </section>
    </div>
  )
}