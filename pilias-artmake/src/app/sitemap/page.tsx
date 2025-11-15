import Link from 'next/link'
import { ChevronRight, FileText, MapPin, Heart, DollarSign, Camera, Users, Phone } from 'lucide-react'

type SiteMapItem = {
  title: string
  href?: string
  icon?: React.ReactNode
  external?: boolean
  children?: {
    title: string
    href: string
    external?: boolean
  }[]
}

export default function SitemapPage() {
  const siteStructure: SiteMapItem[] = [
    {
      title: 'ホーム',
      href: '/',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      title: 'アートメイクの特徴',
      icon: <Heart className="w-4 h-4" />,
      children: [
        { title: '眉毛アートメイク', href: '/artmake-features/eyebrow' },
        { title: 'リップアートメイク', href: '/artmake-features/lip' },
      ]
    },
    {
      title: 'パラメディカルアートメイク',
      href: '/paramedical',
      icon: <Heart className="w-4 h-4" />,
      children: [
        { title: '傷痕カモフラージュ', href: '/paramedical/scar' },
        { title: '白斑カモフラージュ', href: '/paramedical/vitiligo' },
        { title: '口唇口蓋裂修正', href: '/paramedical/cleft-lip' },
        { title: 'ストレッチマーク', href: '/paramedical/stretch-marks' },
      ]
    },
    {
      title: '施術の流れ',
      href: '/flow',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      title: '料金表',
      href: '/pricing',
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      title: '施術症例',
      href: '/gallery',
      icon: <Camera className="w-4 h-4" />,
    },
    {
      title: 'PILIASARTMAKEについて',
      icon: <Users className="w-4 h-4" />,
      children: [
        { title: '代表挨拶', href: '/about/greeting' },
      ]
    },
    {
      title: '提携院 / アクセス',
      href: '/clinics',
      icon: <MapPin className="w-4 h-4" />,
      children: [
        { title: '銀座・新橋エリア', href: '/clinics/ginza' },
        { title: '柏エリア', href: '/clinics/kashiwa' },
        { title: '横浜エリア', href: '/clinics/yokohama' },
      ]
    },
    {
      title: 'お問い合わせ',
      icon: <Phone className="w-4 h-4" />,
      children: [
        { title: '公式LINE', href: 'https://lin.ee/bhodgys', external: true },
        { title: 'Instagram', href: 'https://www.instagram.com/asuka_artmake_para/', external: true },
      ]
    },
    {
      title: '規約・ポリシー',
      icon: <FileText className="w-4 h-4" />,
      children: [
        { title: 'プライバシーポリシー', href: '/privacy' },
        { title: '特定商取引法に基づく表記', href: '/terms' },
      ]
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
            <span className="text-greige-800 font-medium">サイトマップ</span>
          </nav>
        </div>
      </div>

      {/* メインコンテンツ */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-serif text-greige-800 text-center mb-8">
              サイトマップ
            </h1>
            
            <p className="text-center text-greige-600 mb-12">
              PILIAS ARTMAKEウェブサイトの全ページ一覧です
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteStructure.map((section, index) => (
                <div key={index} className="bg-white rounded-lg border border-greige-200 p-6">
                  <div className="mb-4">
                    {section.href ? (
                      <Link 
                        href={section.href}
                        className="flex items-center text-lg font-medium text-greige-800 hover:text-greige-600 transition-colors"
                      >
                        {section.icon && <span className="mr-2">{section.icon}</span>}
                        {section.title}
                      </Link>
                    ) : (
                      <h2 className="flex items-center text-lg font-medium text-greige-800">
                        {section.icon && <span className="mr-2">{section.icon}</span>}
                        {section.title}
                      </h2>
                    )}
                  </div>
                  
                  {section.children && (
                    <ul className="space-y-2">
                      {section.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          {child.external ? (
                            <a
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-greige-600 hover:text-greige-800 transition-colors"
                            >
                              <ChevronRight className="w-3 h-3 mr-1" />
                              {child.title}
                              <svg
                                className="w-3 h-3 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          ) : (
                            <Link
                              href={child.href}
                              className="flex items-center text-sm text-greige-600 hover:text-greige-800 transition-colors"
                            >
                              <ChevronRight className="w-3 h-3 mr-1" />
                              {child.title}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* お問い合わせ */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6 text-center">
              <h2 className="text-lg font-medium text-greige-800 mb-3">
                お探しのページが見つからない場合
              </h2>
              <p className="text-sm text-greige-600 mb-4">
                ページが見つからない、またはご不明な点がございましたら、お気軽にお問い合わせください。
              </p>
              <a
                href="https://lin.ee/bhodgys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#06C755] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#05B04C] transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.95 3.66 9.05 8.44 9.79.31.06.73-.1.86-.23.11-.11.37-.76.48-1.03.11-.28.06-.52-.02-.72-1.61-1.76-2.65-3.57-2.65-5.81 0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.24-1.04 4.05-2.65 5.81-.08.2-.13.44-.02.72.11.27.37.92.48 1.03.13.13.55.29.86.23C20.34 21.05 24 16.95 24 12c0-5.52-4.48-10-10-10z"/>
                </svg>
                公式LINEで問い合わせる
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}