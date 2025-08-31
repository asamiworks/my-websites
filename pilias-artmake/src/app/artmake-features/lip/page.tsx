'use client'

import Image from 'next/image'
import Link from 'next/link'
import Button, { LineButton } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { DetailAccordion } from '@/components/ui/Accordion'
import { ChevronRight, AlertCircle, Heart, Sparkles, Clock, Shield, Info, Calendar, AlertTriangle } from 'lucide-react'

export default function LipPage() {
  // 詳細情報セクション
  const detailSections = [
    {
      title: 'リップアートメイクの特徴',
      icon: <Heart className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            リップアートメイクは、唇の色と形を美しく整え、
            血色感のある魅力的な唇を演出します。
            くすみを改善し、自然で健康的な唇の色を保ちます。
          </p>
          <div className="bg-greige-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-greige-800 mb-2">アートメイクは2〜3回入れて完成します</h4>
            <p className="text-sm text-greige-600">
              1回目では体の免疫反応が働き色素が異物と捉えられてしまうため1ヶ月ほどで薄くなります。
              短期間のうちにもう一度入れることにより、1回目と反応が変わり定着しやすくなります。
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* 変更: bg-rose-50 → bg-greige-50 */}
            <div className="bg-greige-50 rounded-lg p-4">
              <h4 className="font-medium text-greige-800 mb-2">こんなお悩みに</h4>
              <ul className="space-y-1 text-sm text-greige-600">
                <li>• 唇の血色が悪い</li>
                <li>• 唇の形が左右非対称</li>
                <li>• 口紅が落ちやすい</li>
                <li>• 唇が薄い・小さい</li>
                <li>• 年齢による唇のくすみ</li>
              </ul>
            </div>
            <div className="bg-greige-50 rounded-lg p-4">
              <h4 className="font-medium text-greige-800 mb-2">施術後の効果</h4>
              <ul className="space-y-1 text-sm text-greige-600">
                <li>• 24時間血色感のある唇</li>
                <li>• 自然で健康的な唇の色</li>
                <li>• マスクへの色移りなし</li>
                <li>• 若々しい印象に</li>
                <li>• 理想の唇の形に調整</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'デザインの種類',
      icon: <Sparkles className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center">
              <h4 className="font-medium text-greige-800 mb-2">フルリップ</h4>
              <p className="text-sm text-greige-600">
                唇全体に色を入れ、ふっくらとした印象に
              </p>
            </Card>
            <Card className="text-center">
              <h4 className="font-medium text-greige-800 mb-2">リップライン</h4>
              <p className="text-sm text-greige-600">
                輪郭を整え、形をはっきりさせる
              </p>
            </Card>
            <Card className="text-center">
              <h4 className="font-medium text-greige-800 mb-2">グラデーション</h4>
              <p className="text-sm text-greige-600">
                内側から外側へ自然なグラデーション
              </p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: '施術の流れ',
      icon: <Clock className="w-5 h-5" />,
      content: (
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
              <p className="text-sm mt-1 text-greige-600">唇のお悩みやご希望の色・形を確認</p>
            </div>
          </li>
          <li className="flex">
            <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
            <div>
              <p className="font-medium">デザイン・色選び（20分）</p>
              <p className="text-sm mt-1 text-greige-600">お肌の色に合わせた色選びとデザイン決定</p>
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
              <p className="font-medium">施術（60〜90分）</p>
              <p className="text-sm mt-1 text-greige-600">丁寧に色素を入れていきます</p>
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
      ),
    },
    {
      title: '施術前の過ごし方',
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
              <li>• 普段通りのメイクをしてお越しください</li>
            </ul>
          </Card>
          {/* 変更: text-red-600 → text-amber-600 */}
          <p className="text-sm text-amber-600 font-medium">
            ※腫れや出血、赤みが強く出たり、色素の定着が悪くなる可能性がありますのでしっかりと守ってください
          </p>
        </div>
      ),
    },
    {
      title: 'リップアートメイクのダウンタイム',
      icon: <AlertCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-medium text-amber-800 mb-3">リップアートメイクダウンタイムについて</p>
            <div className="space-y-3">
              <div className="border-l-4 border-amber-400 pl-3">
                <p className="font-medium text-amber-900">1. 腫れ</p>
                <p className="text-sm text-amber-700">皆さん1.5倍〜3倍ほど腫れますが、マスクを着けずに外出できる程度です</p>
              </div>
              <div className="border-l-4 border-amber-400 pl-3">
                <p className="font-medium text-amber-900">2. 皮むけ</p>
                <p className="text-sm text-amber-700">個人差がありますが3〜7日かけて皮がむけます。<br />
                {/* 変更: text-red-600 → text-amber-800 */}
                <span className="text-amber-800 font-medium">無理やり剝がさない！！ワセリンを塗って保湿してください。</span></p>
              </div>
              <div className="border-l-4 border-amber-400 pl-3">
                <p className="font-medium text-amber-900">3. 口唇ヘルペス</p>
                <p className="text-sm text-amber-700">既往がある方は予防薬の内服をお願いいたします。<br />
                ※抗ウイルス薬別途¥3,300<br />
                発症された場合にはお近くの皮膚科を受診してください。</p>
              </div>
            </div>
          </div>

          <h4 className="font-medium text-greige-800 mt-6 mb-3">ダウンタイムの経過</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {/* 変更: bg-rose-50, text-rose-### → bg-greige-50, text-greige-### */}
            <Card className="bg-greige-50">
              <p className="font-medium text-greige-800 mb-2">施術当日</p>
              <p className="text-sm text-greige-700">
                色も形もいい感じ。直後は少し濃いかなくらい。1〜2時間後から徐々に濃くなる
              </p>
            </Card>
            <Card className="bg-amber-50">
              <p className="font-medium text-amber-800 mb-2">翌日〜3日目</p>
              <p className="text-sm text-amber-700">
                1番濃くなる時期。普段のメイクより濃くなる（我慢の時期です）
              </p>
            </Card>
            <Card className="bg-blue-50">
              <p className="font-medium text-blue-800 mb-2">4〜5日目</p>
              <p className="text-sm text-blue-700">
                薄皮が剥がれ落ち始める。色味にムラが出る。欠けているように見えることも！痒みもあり我慢の時期です
              </p>
            </Card>
            <Card className="bg-green-50">
              <p className="font-medium text-green-800 mb-2">1週間後</p>
              <p className="text-sm text-green-700">
                薄皮がほとんど剥がれ、薄く・細く・短く感じる。<strong>定着は1週間後ではなく1か月後です</strong>
              </p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: '術後の過ごし方（リップ）',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          {/* 変更: bg-red-50 border-red-200 → bg-amber-50 border-amber-200 */}
          <Card className="bg-amber-50 border-amber-200">
            <h4 className="font-medium text-amber-800 mb-2">施術後24時間</h4>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• 感染予防、色素定着のため24時間は施術部位は濡らさないでください</li>
              <li>• 傷口から色素が流れ落ちてしまいます</li>
            </ul>
          </Card>
          <Card className="bg-amber-50">
            <h4 className="font-medium text-amber-800 mb-2">施術後1週間</h4>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• 1日2回施術部位にワセリンを塗ってください</li>
              <li>• 施術部位のクレンジング、洗顔、メイク、スキンケアは避けてください</li>
              <li>• アルコール、激しい運動、プール、海水浴は避けてください</li>
              <li>• 施術後3〜7日で薄いかさぶたができます。無理に剥がさないでください</li>
              <li>• できる限り紫外線対策をしてください</li>
            </ul>
          </Card>
          {/* 変更: bg-rose-50, text-rose-### → bg-greige-50, text-greige-### */}
          <Card className="bg-greige-50">
            <h4 className="font-medium text-greige-800 mb-2">リップの方のみ</h4>
            <ul className="space-y-1 text-sm text-greige-700">
              <li>• 生ものや辛い物、味の濃いものは避けてください</li>
              <li>• 飲み物はストローを使用して召し上がってください</li>
            </ul>
          </Card>
          <Card className="bg-green-50">
            <h4 className="font-medium text-green-800 mb-2">施術後1ヶ月間</h4>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• レチノール系(ビタミンA)化粧品は中止してください</li>
              <li>• 美容施術は施術後1ヶ月以降からOKです</li>
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
          {/* 変更: bg-red-50 border-red-200 → bg-amber-50 border-amber-200 */}
          <Card className="bg-amber-50 border-amber-200">
            <h4 className="font-medium text-amber-800 mb-3 flex items-center">
              {/* 変更: bg-red-100 text-red-600 → bg-amber-100 text-amber-600 */}
              <span className="bg-amber-100 text-amber-600 text-xs px-2 py-1 rounded mr-2">禁忌</span>
              施術できない方
            </h4>
            <ul className="space-y-2 text-sm text-amber-700">
              <li><strong>1. 妊娠中・授乳中の方</strong><br />　…安全が保証されないため</li>
              <li><strong>2. 感染症の方</strong><br />　…傷をつけていく施術のため出血等による感染リスク</li>
              <li><strong>3. 糖尿病の方</strong><br />　…傷が悪化したり、傷の治りが遅い</li>
              <li><strong>4. ケロイド体質の方</strong><br />　…表皮に傷をつけた部分がケロイドとして残ってしまう</li>
              <li><strong>5. 麻酔・金属アレルギーの方</strong><br />　…麻酔や製剤に含まれている成分に反応してアレルギー反応を起こすリスク</li>
              <li><strong>6. 半年以内に施術部位の切開手術をされた方</strong><br />　…傷が完治していない可能性があるため</li>
              <li><strong>7. 口唇ヘルペスが活動期の方</strong></li>
              <li><strong>8. 1ヶ月以内にヒアルロン酸注入をされた方</strong></li>
            </ul>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <h4 className="font-medium text-amber-800 mb-3 flex items-center">
              <span className="bg-amber-100 text-amber-600 text-xs px-2 py-1 rounded mr-2">注意</span>
              注意が必要な方
            </h4>
            <ul className="space-y-2 text-sm text-amber-700">
              <li><strong>1. アトピー体質、お肌が弱い方</strong><br />　…麻酔や施術により赤みが強く出たりお肌が荒れてしまう可能性あり</li>
              <li><strong>2. 血友病、抗凝固薬</strong><br />　…アートメイク中に瞬間的に血圧が上昇する可能性あり</li>
              <li><strong>4. 生理中の方</strong><br />　…お肌が敏感になり痛みを感じやすくなったり、炎症を起こしやすい</li>
              <li><strong>5. 1ヶ月以内に施術部位および周囲の美容施術を受けられた方</strong><br />　（ピーリング、ダーマペン、脱毛等）<br />　…出血や感染リスクが高いので基本的にはお断りしております</li>
              <li><strong>6. 口唇ヘルペスの既往がある方</strong><br />　…予防薬の内服が必要です</li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      title: '料金について',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
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
                  <td className="border border-greige-200 px-4 py-3">リップアートメイク 通常（1回）</td>
                  <td className="border border-greige-200 px-4 py-3 text-right font-medium">¥55,000</td>
                </tr>
                {/* 変更: bg-rose-50 → bg-amber-50, text-rose-600 → text-amber-600 */}
                <tr className="bg-amber-50">
                  <td className="border border-greige-200 px-4 py-3">リップアートメイク モニター（1回）</td>
                  <td className="border border-greige-200 px-4 py-3 text-right font-medium text-amber-600">¥44,000</td>
                </tr>
                <tr>
                  <td className="border border-greige-200 px-4 py-3">リタッチ（3回目以降）</td>
                  <td className="border border-greige-200 px-4 py-3 text-right font-medium">¥40,000</td>
                </tr>
                <tr>
                  <td className="border border-greige-200 px-4 py-3">1年以内のリタッチ（3回目以降）</td>
                  <td className="border border-greige-200 px-4 py-3 text-right font-medium">¥38,000</td>
                </tr>
                <tr className="bg-amber-50">
                  <td className="border border-greige-200 px-4 py-3">抗ウイルス薬（ヘルペス予防）</td>
                  <td className="border border-greige-200 px-4 py-3 text-right font-medium">¥3,300</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* 変更: bg-rose-50 border-rose-200, text-rose-### → bg-greige-50 border-greige-200, text-greige-### */}
          <Card className="bg-greige-50 border-greige-200">
            <p className="font-medium text-greige-800 mb-2">モニター条件</p>
            <ul className="space-y-1 text-sm text-greige-700">
              <li>1. 全顔お写真のSNS掲載にご協力いただける方</li>
              <li>2. 2回目施術にご来院いただける方</li>
            </ul>
          </Card>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>※ 注意事項：</strong>モニター条件を満たさない場合、通常料金との差額をお支払いいただきます。
            </p>
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
            <Link href="/artmake-features" className="text-greige-600 hover:text-greige-800">
              アートメイクの特徴
            </Link>
            <ChevronRight className="w-4 h-4 text-greige-400" />
            <span className="text-greige-800 font-medium">リップアートメイク</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-greige-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-serif text-greige-800 mb-4">
              リップアートメイク
            </h1>
            <p className="text-lg text-greige-600">
              血色感のある魅力的な唇を24時間キープ
            </p>
          </div>
        </div>
      </section>

      {/* ビフォーアフター */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-8">
            施術症例
          </h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 症例1 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative aspect-square">
                  <Image 
                    src="/images/treatments/lip-case-01.jpg" 
                    alt="リップアートメイク症例1 - 上：Before / 下：After"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
                <div className="p-3 bg-greige-50">
                  <p className="text-sm text-greige-600 text-center">
                    くすみの改善と自然な血色感
                  </p>
                </div>
              </div>

              {/* 症例2 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative aspect-square">
                  <Image 
                    src="/images/treatments/lip-case-02.jpg" 
                    alt="リップアートメイク症例2 - 左：After / 右：Before"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
                <div className="p-3 bg-greige-50">
                  <p className="text-sm text-greige-600 text-center">
                    血色感のある理想の唇へ
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700 text-center">
                ※施術直後〜1ヶ月後の経過写真です<br />
                ※効果には個人差があります<br />
                ※モニター様のご協力により掲載しております
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 詳細情報 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-8">
              詳細情報
            </h2>
            <DetailAccordion sections={detailSections} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-greige-50 to-cream">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-serif text-greige-800 mb-4">
            魅力的な唇を手に入れましょう
          </h2>
          <p className="text-greige-600 mb-8 max-w-2xl mx-auto">
            自然な血色感で、いつでも健康的な唇へ
          </p>
          <LineButton size="lg">公式LINE無料カウンセリング予約</LineButton>
        </div>
      </section>
    </div>
  )
}