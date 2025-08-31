import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function TermsPage() {
  const information = [
    {
      label: '事業者名',
      value: 'PILIAS ARTMAKE'
    },
    {
      label: '代表者',
      value: '福田あすか'
    },
    {
      label: '所在地',
      value: '提携院により異なります\n詳細は各院ページをご確認ください'
    },
    {
      label: '連絡先',
      value: `公式LINE: @209fsxqv
Instagram: @asuka_artmake_para
※お問い合わせは公式LINEにて承ります`
    },
    {
      label: '営業時間',
      value: '完全予約制\n各院により異なります'
    },
    {
      label: '定休日',
      value: '各院により異なります'
    },
    {
      label: '販売価格',
      value: '各施術メニューの料金表をご確認ください\n※表示価格は全て税込価格です'
    },
    {
      label: '商品代金以外の必要料金',
      value: '無し\n※施術料金に全て含まれています'
    },
    {
      label: '支払い方法',
      value: `現金
クレジットカード（VISA、MasterCard、JCB、AMEX、Diners）
※医療ローンについてはお問い合わせください`
    },
    {
      label: '支払い時期',
      value: '施術当日'
    },
    {
      label: 'サービス提供時期',
      value: 'ご予約いただいた施術日'
    },
    {
      label: 'キャンセルポリシー',
      value: `予約日の2日前まで：無料
予約日の前日：施術料金の50%
当日キャンセル・無断キャンセル：施術料金の100%
※体調不良や緊急の場合はご相談ください`
    },
    {
      label: '返品・返金について',
      value: 'サービスの性質上、施術開始後の返金はお受けできません。\nただし、当院の過失による場合はこの限りではありません。'
    }
  ]

  const medicalNotes = [
    'アートメイクは医療行為です。医師の管理下で施術を行います。',
    '施術前に必ず医師による診察があります。',
    '妊娠中・授乳中の方、感染症の方など、施術をお受けいただけない場合があります。',
    '施術の効果には個人差があります。',
    'アレルギーや既往歴がある方は必ず事前にお申し出ください。'
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
            <span className="text-greige-800 font-medium">特定商取引法に基づく表記</span>
          </nav>
        </div>
      </div>

      {/* メインコンテンツ */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-serif text-greige-800 text-center mb-8">
              特定商取引法に基づく表記
            </h1>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <tbody>
                  {information.map((item, index) => (
                    <tr key={index} className="border-b border-greige-200 last:border-0">
                      <td className="bg-greige-50 px-4 py-4 text-sm font-medium text-greige-700 w-1/3 align-top">
                        {item.label}
                      </td>
                      <td className="px-4 py-4 text-sm text-greige-600 whitespace-pre-wrap">
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 医療に関する注意事項 */}
            <div className="mt-12 bg-amber-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-greige-800 mb-4">
                医療に関する注意事項
              </h2>
              <ul className="space-y-2">
                {medicalNotes.map((note, index) => (
                  <li key={index} className="flex items-start text-sm text-greige-600">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* 免責事項 */}
            <div className="mt-8 bg-greige-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-greige-800 mb-4">
                免責事項
              </h2>
              <div className="text-sm text-greige-600 space-y-3">
                <p>
                  当院のウェブサイトに掲載されている情報については、正確性や完全性を保証するものではありません。
                  当サイトの情報を利用することで生じたいかなる損害についても、当院は責任を負いかねます。
                </p>
                <p>
                  施術の効果には個人差があり、掲載している症例写真と同様の結果を保証するものではありません。
                </p>
                <p>
                  当サイトからリンクしている外部サイトについては、当院は一切の責任を負いません。
                </p>
              </div>
            </div>

            {/* 著作権について */}
            <div className="mt-8 bg-greige-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-greige-800 mb-4">
                著作権について
              </h2>
              <div className="text-sm text-greige-600">
                <p>
                  当サイトに掲載されているすべてのコンテンツ（文章、画像、ロゴ、その他）の著作権は、
                  PILIAS ARTMAKEまたは正当な権利を有する第三者に帰属します。
                  これらの無断転載、複製、改変等の行為は禁止されています。
                </p>
              </div>
            </div>

            {/* 準拠法と管轄裁判所 */}
            <div className="mt-8 bg-greige-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-greige-800 mb-4">
                準拠法と管轄裁判所
              </h2>
              <div className="text-sm text-greige-600">
                <p>
                  本規約の解釈にあたっては、日本法を準拠法とします。
                  本サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
                </p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-greige-50 rounded-lg">
              <p className="text-sm text-greige-600">
                最終更新日：2025年8月18日
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}