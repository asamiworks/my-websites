import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. 個人情報の定義',
      content: `個人情報とは、個人に関する情報であり、氏名、生年月日、性別、電話番号、電子メールアドレス、職業、勤務先等、特定の個人を識別し得る情報をいいます。`
    },
    {
      title: '2. 個人情報の収集・利用',
      content: `当院は、以下の目的のため、その範囲内においてのみ、個人情報を収集・利用いたします。当院による個人情報の収集・利用は、お客様の自発的な提供によるものであり、お客様が個人情報を提供された場合は、当院が本ポリシーに則って個人情報を利用することをお客様が許諾したものとします。

・ご予約およびご予約の確認のため
・カウンセリングおよび施術の提供のため
・施術に関するご相談・お問い合わせへの回答のため
・施術後のアフターケアのため
・当院からのお知らせ・ご案内のため
・医療安全管理のため
・医療の質の向上のため`
    },
    {
      title: '3. 個人情報の管理',
      content: `当院は、個人情報の漏洩、消失、毀損等のないよう、適切な情報セキュリティ対策を実施し、個人情報の安全管理に努めます。`
    },
    {
      title: '4. 個人情報の第三者への提供',
      content: `当院は、お客様より取得した個人情報を適切に管理し、次のいずれかに該当する場合を除き、お客様の同意を得ることなく第三者に提供いたしません。

・法令に基づく場合
・人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
・公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
・国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき`
    },
    {
      title: '5. 個人情報の開示・訂正・削除',
      content: `お客様は、当院に対してご自身の個人情報の開示を求めることができます。また、開示の結果、誤った情報があり、訂正や削除のご依頼をいただいた場合、速やかに対応いたします。`
    },
    {
      title: '6. Cookie（クッキー）',
      content: `当サイトでは、一部のコンテンツにおいてCookieを使用しております。Cookieとは、ウェブサイトがお客様のコンピュータやモバイルデバイスに送信する小さなデータファイルです。Cookieを使用することで、ウェブサイトはお客様の設定や訪問履歴を記憶し、より良いサービスを提供することができます。`
    },
    {
      title: '7. アクセス解析ツール',
      content: `当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。このGoogleアナリティクスはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。`
    },
    {
      title: '8. 法令等の遵守',
      content: `当院は、個人情報の保護に関する法令およびその他の規範を遵守します。`
    },
    {
      title: '9. 個人情報保護方針の変更',
      content: `当院は、必要に応じて、本プライバシーポリシーの内容を変更することがあります。変更した場合には、当サイト上に掲載することにより通知いたします。`
    },
    {
      title: '10. お問い合わせ',
      content: `個人情報の取り扱いに関するお問い合わせは、以下の連絡先までお願いいたします。

PILIAS ARTMAKE
公式LINE: @209fsxqv
Instagram: @asuka_artmake_para`
    }
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
            <span className="text-greige-800 font-medium">プライバシーポリシー</span>
          </nav>
        </div>
      </div>

      {/* メインコンテンツ */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-serif text-greige-800 text-center mb-8">
              プライバシーポリシー
            </h1>
            
            <div className="prose prose-greige max-w-none">
              <p className="text-greige-600 mb-8">
                PILIAS ARTMAKE（以下、「当院」といいます。）は、本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
              </p>

              <div className="space-y-8">
                {sections.map((section, index) => (
                  <div key={index} className="border-b border-greige-200 pb-6 last:border-0">
                    <h2 className="text-xl font-medium text-greige-800 mb-3">
                      {section.title}
                    </h2>
                    <div className="text-greige-600 whitespace-pre-wrap">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-greige-50 rounded-lg">
                <p className="text-sm text-greige-600">
                  制定日：2025年8月12日<br />
                  最終更新日：2025年8月18日
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}