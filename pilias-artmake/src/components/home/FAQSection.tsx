'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { FAQAccordion } from '@/components/ui/Accordion'

// FAQアイテムの型定義
interface FAQItem {
  category: string
  question: string
  answer: string
}

// FAQデータ
const faqItems: FAQItem[] = [
  // 料金について
  {
    category: '料金について',
    question: '料金はどのくらいですか？',
    answer: '【眉毛・リップアートメイク】\n・通常価格：1回 55,000円\n・モニター価格：1回 44,000円\n・リタッチ（3回目以降）：40,000円\n・1年以内のリタッチ（3回目以降）：38,000円\n\n【パラメディカルアートメイク】\n・傷痕：1×1cm 12,000円〜\n・白斑：5×5cm 30,000円\n・口唇口蓋裂：1回 30,000円\n・ストレッチマーク：5×9cm 15,000円〜\n\n詳しい料金は料金ページをご確認ください。',
  },
  {
    category: '料金について',
    question: 'モニター価格の条件は何ですか？',
    answer: 'モニター価格の適用条件は以下の2つです：\n\n1. 全顔お写真のSNS掲載にご協力いただける方\n2. 2回目施術にご来院いただける方\n\n両方の条件を満たす方に、通常55,000円を44,000円でご提供しています。\n詳しくはカウンセリング時にご説明いたします。',
  },
  {
    category: '料金について',
    question: '支払い方法は何がありますか？',
    answer: '現金、クレジットカード、電子マネーなど各種お支払い方法をご用意しています。\n\n分割払いをご希望の方は、カウンセリング時にご相談ください。\n詳しくは各提携院によって異なりますので、予約時にご確認ください。',
  },

  // 施術について
  {
    category: '施術について',
    question: 'アートメイクの施術時間はどのくらいですか？',
    answer: 'カウンセリングを含めて、初回は約2〜3時間程度お時間をいただきます。\n施術自体は約1.5〜2時間です。\n2回目以降は1.5時間程度となります。\nデザインにこだわりたい方は、お時間に余裕を持ってご来院ください。',
  },
  {
    category: '施術について',
    question: '何回の施術で完成しますか？',
    answer: 'アートメイクは2〜3回の施術で完成します。\n\n1回目では体の免疫反応が働き、色素が異物と捉えられてしまうため、1ヶ月ほどで薄くなります。\n短期間のうちにもう一度入れることにより、1回目と反応が変わり定着しやすくなります。\n\n簡単には消せないものなので、1回目は調整がきくように控えめに入れていきます。',
  },
  {
    category: '施術について',
    question: 'アートメイクはどのくらい持ちますか？',
    answer: '個人差はありますが、1〜3年程度持続します。\n\n肌質や生活習慣、アフターケアの方法によって持続期間は変わります。\n・脂性肌の方：色素が定着しづらく、やや短め\n・乾燥肌の方：色素が定着しやすく、長持ちしやすい\n\n美しい状態を保つために、1〜2年ごとのリタッチをおすすめしています。',
  },
  {
    category: '施術について',
    question: 'パラメディカルアートメイクとは何ですか？',
    answer: 'パラメディカルアートメイクは、医療補助を目的としたアートメイクです。\n\n【対応可能な症例】\n・傷痕のカモフラージュ\n・白斑の色素補正\n・口唇口蓋裂術後の修正\n・ストレッチマークの改善\n\n美容目的ではなく、医療的な悩みを解決し、自信を取り戻すお手伝いをします。\n適応条件がございますので、まずはご相談ください。',
  },

  // 痛みについて
  {
    category: '痛みについて',
    question: '施術中の痛みはありますか？',
    answer: '施術前に麻酔クリームを使用しますので、痛みは最小限に抑えられます。\n\n個人差はありますが、ほとんどの方が「思ったより痛くなかった」「毛抜きで抜く程度」とおっしゃいます。\n痛みに弱い方は、事前にお申し出ください。麻酔の量や時間を調整いたします。',
  },
  {
    category: '痛みについて',
    question: '麻酔は使用できますか？',
    answer: '医療機関での施術のため、表面麻酔（麻酔クリーム）を使用できます。\n\n施術部位に麻酔クリームを塗布し、20〜30分程度置いてから施術を開始します。\n追加の麻酔も可能ですので、痛みを感じた場合は遠慮なくお申し出ください。',
  },

  // ダウンタイムについて
  {
    category: 'ダウンタイムについて',
    question: '施術後の腫れや赤みはどのくらい続きますか？',
    answer: '【眉】\n施術直後〜3日目：少し濃く見える時期\n4〜5日目：薄皮が剥がれ始める\n1週間後：ほぼ落ち着く\n\n【リップ】\n施術直後〜3日目：1.5〜3倍程度腫れる（マスクで隠せる程度）\n3〜7日目：皮むけが起こる\n1週間後：落ち着く\n\n個人差がありますので、大切なご予定の2週間前までの施術をおすすめします。',
  },
  {
    category: 'ダウンタイムについて',
    question: '施術後すぐにメイクはできますか？',
    answer: '施術部位以外は、当日からメイク可能です。\n\n【施術部位】\n・24時間：絶対に濡らさない\n・1週間：メイク、クレンジング、洗顔料の使用不可\n・1週間後：通常通りメイク可能\n\n施術部位は1週間、ワセリンでの保護のみとなります。',
  },

  // 施術できない方
  {
    category: '施術できない方',
    question: '施術を受けられない人はいますか？',
    answer: '以下の方は施術をお受けいただけません：\n\n【施術不可】\n・妊娠中、授乳中の方\n・感染症の方\n・重度の糖尿病の方\n・ケロイド体質の方\n・麻酔、金属アレルギーの方\n・半年以内に施術部位の切開手術をされた方\n\n【要相談】\n・アトピー体質、お肌が弱い方\n・血友病、抗凝固薬服用中の方\n・生理中の方\n・1ヶ月以内に施術部位周囲の美容施術を受けられた方\n\n該当する方は、必ず事前にご相談ください。',
  },
  {
    category: '施術できない方',
    question: '未成年でも施術は受けられますか？',
    answer: '未成年の方の施術は、保護者の同意が必要です。\n\n18歳未満の方：保護者の同伴が必要\n18〜19歳の方：保護者の同意書が必要\n\n施術内容やリスクについて、保護者の方にも十分にご理解いただいた上で施術を行います。',
  },

  // アフターケア
  {
    category: 'アフターケア',
    question: '施術後のケアはどうすればいいですか？',
    answer: '【施術後24時間】\n・絶対に濡らさない（傷口から色素が流れ落ちてしまいます）\n\n【施術後1週間】\n・1日2回、施術部位にワセリンを塗布\n・施術部位のクレンジング、洗顔、メイク、スキンケアは避ける\n・アルコール、激しい運動、プール、海水浴、サウナは避ける\n・かさぶたは無理に剥がさない\n・紫外線対策をする\n\n【リップの方のみ】\n・生ものや辛い物、味の濃いものは避ける\n・飲み物はストローを使用\n\n【施術後1ヶ月】\n・レチノール系化粧品は中止\n・美容施術は1ヶ月以降から',
  },
  {
    category: 'アフターケア',
    question: 'かさぶたが取れて薄くなったのですが失敗ですか？',
    answer: '失敗ではありません。これは正常な経過です。\n\n施術後3〜7日でかさぶたが剥がれると、一時的に薄く感じることがあります。\nその後、1ヶ月かけて徐々に色が定着していきます。\n\n1ヶ月後の状態を見て、2回目の施術で色味や濃さを調整します。\n1回目は控えめに、2回目でしっかりと仕上げることで、自然で美しい仕上がりになります。',
  },
  {
    category: 'アフターケア',
    question: 'リタッチはいつ頃必要ですか？',
    answer: '美しい状態を保つために、以下のタイミングでのリタッチをおすすめします：\n\n【2〜3回目まで】\n1〜2ヶ月後：定着のための施術\n\n【完成後】\n1〜2年ごと：色味の補充、形の微調整\n\n3回目以降のリタッチは割引料金でご案内しています。\n1年以内のリタッチは、さらにお得な料金設定です。',
  },
  {
    category: 'アフターケア',
    question: 'リップアートメイク後にヘルペスが出ることはありますか？',
    answer: '口唇ヘルペスの既往がある方は、施術の刺激により発症する可能性があります。\n\n【予防対策】\n・既往がある方は予防薬の内服をお願いします（別途3,300円）\n・施術前後の体調管理を万全に\n\n発症された場合は、速やかにお近くの皮膚科を受診してください。\n事前にリスクをご理解いただいた上で施術を行います。',
  },
]

// 構造化データを生成する関数
const generateFAQStructuredData = (items: FAQItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://pilias-artmake.com/#faq',
    name: 'PILIAS ARTMAKE よくある質問',
    description: '医療アートメイク・パラメディカルアートメイクに関するよくある質問と回答',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      '@id': `https://pilias-artmake.com/#faq-${item.question.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
      name: item.question,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/\n/g, ' '),
        author: {
          '@type': 'Organization',
          name: 'PILIAS ARTMAKE',
        },
        dateCreated: '2024-01-01',
        dateModified: new Date().toISOString().split('T')[0],
      },
      dateCreated: '2024-01-01',
      author: {
        '@type': 'Person',
        name: 'お客様',
      },
    })),
    author: {
      '@type': 'Organization',
      name: 'PILIAS ARTMAKE',
      url: 'https://pilias-artmake.com',
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
  }
}

// カテゴリーごとの説明文（SEO用）
const categoryDescriptions: Record<string, string> = {
  '料金について': 'アートメイクの料金体系、モニター価格の条件、お支払い方法について詳しく説明します。',
  '施術について': 'アートメイクの施術時間、完成までの回数、持続期間、パラメディカルアートメイクについて解説します。',
  '痛みについて': '施術中の痛みの程度や麻酔の使用について、多くの方が気になる痛みに関する情報をお伝えします。',
  'ダウンタイムについて': '施術後の腫れや赤み、メイクの制限など、ダウンタイム期間の過ごし方について説明します。',
  '施術できない方': '安全のため施術をお受けいただけない方の条件、注意が必要な方について詳しく説明します。',
  'アフターケア': '施術後のケア方法、リタッチのタイミング、正しいアフターケアで美しい仕上がりを保つ方法を解説します。',
}

export default function FAQSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // カテゴリーの展開/折りたたみを管理
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  // カテゴリーごとにFAQをグループ化
  const groupedFAQ = faqItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, FAQItem[]>)

  return (
    <>
      {/* 構造化データ */}
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQStructuredData(faqItems)),
        }}
      />

      <section 
        ref={sectionRef} 
        className="py-16 lg:py-24 bg-gradient-to-b from-white to-greige-50"
        aria-labelledby="faq-heading"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <div className="container mx-auto px-4 lg:px-8">
          {/* セクションタイトル */}
          <header className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 
              id="faq-heading"
              className="text-3xl lg:text-4xl font-serif text-greige-800 mb-4"
              itemProp="name"
            >
              よくある質問
            </h2>
            <p 
              className="text-lg text-greige-600"
              itemProp="description"
            >
              お客様からよくいただくご質問をまとめました
            </p>
          </header>

          {/* FAQ コンテンツ */}
          <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* カテゴリー別FAQ */}
            <div className="space-y-6">
              {Object.entries(groupedFAQ).map(([category, items], categoryIndex) => (
                <div 
                  key={category}
                  className="bg-white rounded-lg shadow-sm border border-greige-100 overflow-hidden"
                  style={{
                    animationDelay: `${categoryIndex * 100}ms`,
                  }}
                >
                  {/* カテゴリーヘッダー */}
                  <h3 className="bg-greige-50 px-6 py-4 font-medium text-greige-800 border-b border-greige-100">
                    <span className="flex items-center justify-between">
                      {category}
                      <span className="text-sm text-greige-500">
                        {items.length}件の質問
                      </span>
                    </span>
                  </h3>

                  {/* カテゴリーの説明（SEO用、非表示） */}
                  <div className="sr-only" aria-label={`${category}の説明`}>
                    {categoryDescriptions[category]}
                  </div>

                  {/* FAQ項目 */}
                  <div className="divide-y divide-greige-100">
                    {items.map((item, itemIndex) => (
                      <article
                        key={`${category}-${itemIndex}`}
                        className="p-6 hover:bg-greige-50/50 transition-colors"
                        itemScope
                        itemProp="mainEntity"
                        itemType="https://schema.org/Question"
                      >
                        {/* 質問 */}
                        <h4 
                          className="text-base font-medium text-greige-800 mb-3 flex items-start"
                          itemProp="name"
                        >
                         <span className="inline-block w-6 h-6 bg-greige-100 text-greige-600 rounded-full text-xs font-bold flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            Q
                          </span>
                          <span>{item.question}</span>
                        </h4>

                        {/* 回答 */}
                        <div 
                          className="pl-9"
                          itemScope
                          itemProp="acceptedAnswer"
                          itemType="https://schema.org/Answer"
                        >
                          <div 
                            className="text-sm text-greige-600 leading-relaxed whitespace-pre-line"
                            itemProp="text"
                          >
                            {item.answer}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* オリジナルのFAQAccordionコンポーネントも保持（互換性のため） */}
            <div className="mt-8 lg:hidden">
              <FAQAccordion 
                items={faqItems} 
                showCategories 
                variant="bordered"
              />
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <p className="text-greige-600 mb-4">
                その他ご不明な点がございましたら、お気軽にお問い合わせください
              </p>
              <a
                href="https://line.me/R/ti/p/@209fsxqv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#06C755] text-white font-medium rounded-full hover:bg-[#05b34a] transition-colors shadow-md hover:shadow-lg"
                aria-label="LINEで質問する"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                LINEで質問する
              </a>
            </div>

            {/* SEO用の追加情報（非表示） */}
            <div className="sr-only">
              <p>
                PILIAS ARTMAKEは、医療アートメイクとパラメディカルアートメイクの専門クリニックです。
                銀座・柏・横浜の提携院で、眉毛アートメイク、リップアートメイク、傷跡修正、白斑カモフラージュ、
                口唇口蓋裂修正、ストレッチマーク改善などの施術を行っています。
              </p>
              <p>
                経験豊富な医療従事者が、安全で確実な施術を提供します。
                カウンセリングから施術、アフターケアまで、お客様一人ひとりに寄り添った対応を心がけています。
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}