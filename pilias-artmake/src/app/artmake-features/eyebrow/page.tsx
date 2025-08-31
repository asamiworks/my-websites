'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button, { LineButton } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { DetailAccordion } from '@/components/ui/Accordion'
import { ChevronRight, Check, AlertCircle, Palette, Users, Clock, Shield, Heart, Calendar, AlertTriangle, Info } from 'lucide-react'

export default function EyebrowPage() {
  const [selectedTechnique, setSelectedTechnique] = useState<'hair' | 'powder' | 'mix'>('hair')

  // 眉の技法データ
  const techniques = {
    hair: {
      name: '毛並み',
      description: '毛並みを1本1本手彫りで描く技法。自然でナチュラルな仕上がり',
      suitable: ['自眉毛が薄い方', '普通肌、乾燥肌の方', 'ナチュラルな仕上がりを希望の方'],
      image: '/images/gallery/eyebrow/20.jpg',
    },
    powder: {
      name: 'パウダー',
      description: '手彫りでドットを描く技法。ふんわりメイクをしたような仕上がり',
      suitable: ['全体的に毛量がある方', 'どの肌質の方にもおすすめ', '薄くふんわりor濃くしっかりご希望の方'],
      image: '/images/gallery/eyebrow/08.jpg',
    },
    mix: {
      name: 'MIX',
      description: '毛並みとパウダーを合わせた技法。よりナチュラルで立体感のある仕上がり',
      suitable: ['自眉が全体的にあるが薄い方', '普通肌、乾燥肌、ややオイリー肌の方', 'メイクをしたような仕上がり'],
      image: '/images/gallery/eyebrow/03.jpg',
    },
  }

  // 眉デザインの種類
  const designs = [
    { name: '平行眉（ストレート）', features: '若見え効果・親しみやすい' },
    { name: '平行眉（セミアーチ）', features: '程よいカーブ・柔らかい・優しい印象・ナチュラル' },
    { name: 'アーチ眉', features: '知的な印象・大人っぽい・落ち着きがある' },
    { name: '上がり眉', features: 'クールで知的・シャープ・強そうな印象' },
    { name: '上がりストレート眉', features: 'クール・知的・凛とした印象' },
    { name: 'ハンサム眉（海外風）', features: '凛々しい・クール・意思の強さを感じさせる' },
  ]

  // 肌質の分類 - 変更: color指定をやめて直接クラス名で管理
  const skinTypes = [
    {
      type: '乾燥肌',
      characteristics: ['色味が定着しやすい', '濃い色は避ける'],
      bgClass: 'bg-blue-50',
      borderClass: 'border-blue-200',
      titleClass: 'text-blue-800',
      textClass: 'text-blue-700'
    },
    {
      type: '混合肌・脂性肌',
      characteristics: ['色素がにじみやすい', '色味が定着しづらい'],
      bgClass: 'bg-yellow-50',
      borderClass: 'border-yellow-200',
      titleClass: 'text-yellow-800',
      textClass: 'text-yellow-700'
    },
    {
      type: '皮膚が薄い方・アトピー肌',
      characteristics: ['赤みが出やすい', '出血しやすい', '止血しながら施術を進めます'],
      // 変更: red系 → amber系
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-200',
      titleClass: 'text-amber-800',
      textClass: 'text-amber-700'
    }
  ]

  // 詳細情報セクション
  const detailSections = [
    {
      title: 'アートメイクとタトゥーの違い',
      icon: <Info className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-blue-50">
              <h4 className="font-medium text-blue-800 mb-3">アートメイク</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>・ 表皮〜真皮上層に色素を入れる</li>
                <li>・ 色素は1〜3年で薄くなっていく</li>
                <li>・ 医師の診察が必要（医療行為）</li>
                <li>・ 麻酔使用できる</li>
              </ul>
            </Card>
            <Card className="bg-gray-50">
              <h4 className="font-medium text-gray-800 mb-3">タトゥー</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>・ 真皮に色素を入れる</li>
                <li>・ 永久に残る</li>
                <li>・ 医療行為ではない</li>
                <li>・ 麻酔使用できない</li>
              </ul>
            </Card>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>重要：</strong>アートメイクは医療行為です。針がついた専用の器具を使って、皮膚に傷をつけながら色素を入れ、眉やリップなどを描く施術です。医師の管理のもと、医療機関で施術できます。
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '施術の特徴と持続期間',
      icon: <Palette className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-greige-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-greige-800 mb-2">アートメイクは2〜3回入れて完成します</h4>
            <p className="text-sm text-greige-600">
              1回目では体の免疫反応が働き色素が異物と捉えられてしまうため1ヶ月ほどで薄くなります。
              短期間のうちにもう一度入れることにより、1回目と反応が変わり定着しやすくなります。
              簡単には消せないものなので1回目は調整がきくように控えめに入れていきます。
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">メリット</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• 運動、海、プール、温泉でも落ちない</li>
                <li>• ノーメイクに自信が持てる</li>
                <li>• コンプレックス解消</li>
                <li>• メイクの時間短縮</li>
                <li>• 左右対称の眉毛</li>
              </ul>
            </div>
            {/* 変更: bg-rose-50 → bg-greige-50 */}
            <div className="bg-greige-50 rounded-lg p-4">
              <h4 className="font-medium text-greige-800 mb-2">デメリット</h4>
              <ul className="space-y-1 text-sm text-greige-700">
                <li>• 施術中の痛み</li>
                <li>• 術後3日〜1週間の腫れ/赤み</li>
                <li>• 術後のかさぶた</li>
                <li>• 簡単に消せない</li>
                <li>• 1〜3年毎にメンテナンスが必要</li>
              </ul>
            </div>
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
              <p className="text-sm mt-1 text-greige-600">お悩みやご希望を詳しくお伺いします</p>
            </div>
          </li>
          <li className="flex">
            <span className="flex-shrink-0 w-8 h-8 bg-greige-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
            <div>
              <p className="font-medium">デザイン決定（30〜40分）</p>
              <p className="text-sm mt-1 text-greige-600">黄金比を基に理想のデザインを作成</p>
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
              <p className="font-medium">施術（60〜90分）</p>
              <p className="text-sm mt-1 text-greige-600">丁寧に色素を入れていきます</p>
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
              <p className="font-medium">2回目施術（1〜2ヶ月後）</p>
              <p className="text-sm mt-1 text-greige-600">色の定着と調整を行います</p>
            </div>
          </li>
        </ol>
      ),
    },
    {
      title: '肌質と特徴',
      icon: <Heart className="w-5 h-5" />,
      content: (
        <div className="grid md:grid-cols-3 gap-4">
          {skinTypes.map((skin) => (
            <Card key={skin.type} className={`${skin.bgClass} ${skin.borderClass}`}>
              <h4 className={`font-medium ${skin.titleClass} mb-2`}>{skin.type}</h4>
              <ul className="space-y-1">
                {skin.characteristics.map((char, index) => (
                  <li key={index} className={`text-sm ${skin.textClass}`}>• {char}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
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
              <li>• レーザー、ピーリング、ボトックス、ヒアルロン酸などの美容施術は受けないでください</li>
              <li>• レチノール系(ビタミンA)スキンケアは中止してください</li>
              <li>• 施術部位の保湿をお願いいたします</li>
            </ul>
          </Card>
          <Card className="bg-green-50">
            <h4 className="font-medium text-green-800 mb-2">施術2週間前〜</h4>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• 眉脱色、お顔の脱毛をされる場合は2週間前までにお済ませください</li>
            </ul>
          </Card>
          <Card className="bg-amber-50">
            <h4 className="font-medium text-amber-800 mb-2">前日〜当日</h4>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• 飲酒やカフェイン摂取はお控えください</li>
              <li>• しっかり睡眠をとってください</li>
              <li>• 前日は就寝前に施術部位をしっかり保湿してください</li>
              <li>• 眉毛は1週間前から切ったり剃ったりせずにお越しください</li>
              <li>• 普段通りのメイクをしてお越しください（眉も普段通りのメイクでOK）</li>
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
      title: 'ダウンタイムについて',
      icon: <AlertCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-medium text-amber-800 mb-3">ダウンタイムの経過</p>
            <div className="space-y-3">
              <div className="border-l-4 border-amber-400 pl-3">
                <p className="font-medium text-amber-900">施術当日</p>
                <p className="text-sm text-amber-700">色も形もいい感じ。直後は少し濃いかなくらい。1〜2時間後から徐々に濃くなる。24時間は絶対に濡らさない（傷口から色素が流れ落ちてしまいます）</p>
              </div>
              <div className="border-l-4 border-amber-400 pl-3">
                <p className="font-medium text-amber-900">翌日〜3日目</p>
                <p className="text-sm text-amber-700">1番濃くなる時期。普段のメイクより濃くなる（我慢の時期です）。24時間後から水洗い可能。洗顔料は1週間つけない。眉メイクも1週間我慢です</p>
              </div>
              <div className="border-l-4 border-amber-400 pl-3">
                <p className="font-medium text-amber-900">4〜5日目</p>
                <p className="text-sm text-amber-700">薄皮が剥がれ落ち始める。色味にムラが出る。欠けているように見えることも！痒みもあり我慢の時期です。眉はできるだけ触らない。痒みがあるときはワセリンを付け足す＆冷やす</p>
              </div>
              <div className="border-l-4 border-amber-400 pl-3">
                <p className="font-medium text-amber-900">1週間後</p>
                <p className="text-sm text-amber-700">薄皮がほとんど剥がれ、薄く・細く・短く感じる。定着は1週間後ではなく1か月後です</p>
              </div>
              <div className="border-l-4 border-green-400 pl-3">
                <p className="font-medium text-green-900">1か月後</p>
                <p className="text-sm text-green-700">色が定着し、自然な仕上がりに。<strong>完全な定着までお待ちください</strong></p>
              </div>
            </div>
          </div>

          <h4 className="font-medium text-greige-800 mt-6 mb-3">ダウンタイムの対処法</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-blue-50">
              <p className="font-medium text-blue-800 mb-2">痒いとき、赤みが出ているとき</p>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• ワセリンを塗り足してください</li>
                <li>• 保冷剤などで施術部位を冷やしてください</li>
              </ul>
            </Card>
            {/* 変更: bg-red-50 → bg-amber-50 */}
            <Card className="bg-amber-50">
              <p className="font-medium text-amber-800 mb-2">出血したとき</p>
              <p className="text-sm text-amber-700">• 焦らずティッシュで押さえて止血してください</p>
            </Card>
            <Card className="bg-green-50">
              <p className="font-medium text-green-800 mb-2">痛いとき</p>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• 保冷剤などで冷やしてください</li>
                <li>• 痛み止めのお薬を内服してください</li>
              </ul>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: '術後の過ごし方',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          {/* 変更: bg-red-50 border-red-200 → bg-amber-50 border-amber-200 */}
          <Card className="bg-amber-50 border-amber-200">
            <h4 className="font-medium text-amber-800 mb-2">施術後24時間</h4>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• 感染予防、色素定着のため24時間は施術部位は濡らさないでください</li>
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
                  <td className="border border-greige-200 px-4 py-3">眉毛アートメイク 通常（1回）</td>
                  <td className="border border-greige-200 px-4 py-3 text-right font-medium">¥55,000</td>
                </tr>
                {/* 変更: bg-rose-50 → bg-amber-50, text-rose-600 → text-amber-600 */}
                <tr className="bg-amber-50">
                  <td className="border border-greige-200 px-4 py-3">眉毛アートメイク モニター（1回）</td>
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
              </tbody>
            </table>
          </div>
          {/* 変更: bg-rose-50 border-rose-200 → bg-greige-50 border-greige-200 */}
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
            <span className="text-greige-800 font-medium">眉毛アートメイク</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-greige-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-serif text-greige-800 mb-4">
              眉毛アートメイク
            </h1>
            <p className="text-lg text-greige-600">
              自然な毛並みを再現し、理想の眉を24時間キープ
            </p>
          </div>
        </div>
      </section>

      {/* 眉の技法選択 */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-8">
            眉毛アートメイクの種類
          </h2>

          {/* 技法選択タブ */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-greige-100 rounded-full p-1">
              {Object.entries(techniques).map(([key, technique]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTechnique(key as 'hair' | 'powder' | 'mix')}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    selectedTechnique === key
                      ? 'bg-white text-greige-800 shadow-md'
                      : 'text-greige-600 hover:text-greige-800'
                  }`}
                >
                  {technique.name}
                </button>
              ))}
            </div>
          </div>

          {/* 選択された技法の詳細 */}
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6">
                {/* 画像エリア */}
                <div className="flex items-center justify-center p-4 md:p-6">
                  <div className="relative w-full max-w-[280px] md:max-w-[320px] lg:max-w-[360px] aspect-square bg-gradient-to-br from-greige-100 to-greige-50 overflow-hidden rounded-lg shadow-md">
                    <Image
                      src={techniques[selectedTechnique].image}
                      alt={`${techniques[selectedTechnique].name}の施術例`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 360px"
                      priority
                    />
                  </div>
                </div>

                {/* 情報エリア */}
                <div className="p-4 md:p-6 flex flex-col justify-center">
                  <h3 className="text-xl font-medium text-greige-800 mb-3">
                    {techniques[selectedTechnique].name}
                  </h3>
                  <p className="text-greige-600 mb-4">
                    {techniques[selectedTechnique].description}
                  </p>
                  <div className="bg-greige-50 rounded-lg p-4">
                    <p className="font-medium text-greige-800 mb-2">こんな方におすすめ</p>
                    <ul className="space-y-1">
                      {techniques[selectedTechnique].suitable.map((item, index) => (
                        <li key={index} className="flex items-start text-sm text-greige-600">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* デザインパターン */}
      <section className="py-12 lg:py-16 bg-greige-50">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-medium text-greige-800 text-center mb-8">
            デザインパターン（6種類）
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {designs.map((design) => (
              <Card key={design.name} hover className="text-center">
                <h3 className="font-medium text-greige-800 mb-2">{design.name}</h3>
                <p className="text-sm text-greige-600">{design.features}</p>
              </Card>
            ))}
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
            理想の眉を手に入れましょう
          </h2>
          <p className="text-greige-600 mb-8 max-w-2xl mx-auto">
            まずは無料カウンセリングで、あなたに最適なデザインをご提案します
          </p>
          <LineButton size="lg">公式LINE無料カウンセリング予約</LineButton>
        </div>
      </section>
    </div>
  )
}