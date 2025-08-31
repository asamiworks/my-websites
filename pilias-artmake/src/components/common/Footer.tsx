import Link from 'next/link'
import { MapPin, Clock, Instagram, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-greige-50 border-t border-greige-200">
      {/* メインフッター */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* ロゴ & 説明 */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="font-serif text-2xl text-greige-800">
                PILIAS
                <span className="ml-2 text-base text-greige-600">ARTMAKE</span>
              </div>
            </Link>
            <p className="text-sm text-greige-600 leading-relaxed">
              医療アートメイク・パラメディカルアートメイクの専門クリニック。
              美容から医療補助まで、お客様一人ひとりに寄り添った施術を提供いたします。
            </p>
          </div>

          {/* 診療情報 */}
          <div>
            <h3 className="font-medium text-greige-800 mb-4">診療情報</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2 text-sm text-greige-600">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">完全予約制</p>
                  <p>通知: Instagram</p>
                  <p>問合せ: 公式LINE</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 text-sm text-greige-600">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">提携院</p>
                  <p>銀座・柏・横浜</p>
                </div>
              </div>
            </div>
          </div>

          {/* メニュー */}
          <div>
            <h3 className="font-medium text-greige-800 mb-4">メニュー</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/artmake-features/eyebrow" className="text-greige-600 hover:text-greige-800 transition-colors">
                  眉毛アートメイク
                </Link>
              </li>
              <li>
                <Link href="/artmake-features/lip" className="text-greige-600 hover:text-greige-800 transition-colors">
                  リップアートメイク
                </Link>
              </li>
              <li>
                <Link href="/paramedical" className="text-greige-600 hover:text-greige-800 transition-colors">
                  パラメディカルアートメイク
                </Link>
              </li>
              <li>
                <Link href="/flow" className="text-greige-600 hover:text-greige-800 transition-colors">
                  施術の流れ
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-greige-600 hover:text-greige-800 transition-colors">
                  料金表
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-greige-600 hover:text-greige-800 transition-colors">
                  症例写真
                </Link>
              </li>
            </ul>
          </div>

          {/* お問い合わせ */}
          <div>
            <h3 className="font-medium text-greige-800 mb-4">お問い合わせ</h3>
            <div className="space-y-4">
              {/* LINE CTA */}
              <a
                href="https://line.me/R/ti/p/@209fsxqv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-greige-600 hover:text-greige-800 transition-colors text-sm"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.95 3.66 9.05 8.44 9.79.31.06.73-.1.86-.23.11-.11.37-.76.48-1.03.11-.28.06-.52-.02-.72-1.61-1.76-2.65-3.57-2.65-5.81 0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.24-1.04 4.05-2.65 5.81-.08.2-.13.44-.02.72.11.27.37.92.48 1.03.13.13.55.29.86.23C20.34 21.05 24 16.95 24 12c0-5.52-4.48-10-10-10z"/>
                </svg>
                <span>公式LINE予約</span>
              </a>
              
              {/* Instagram */}
              <a
                href="https://www.instagram.com/asuka_artmake_para/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-greige-600 hover:text-greige-800 transition-colors text-sm"
              >
                <Instagram className="w-5 h-5" />
                <span>@asuka_artmake_para</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 法的情報 */}
      <div className="border-t border-greige-200 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start space-x-6 text-xs text-greige-600">
              <Link href="/privacy" className="hover:text-greige-800 transition-colors">
                プライバシーポリシー
              </Link>
              <Link href="/terms" className="hover:text-greige-800 transition-colors">
                特定商取引法に基づく表記
              </Link>
              <Link href="/sitemap" className="hover:text-greige-800 transition-colors">
                サイトマップ
              </Link>
            </div>
            
            <div className="text-xs text-greige-500">
              © {currentYear} PILIAS ARTMAKE. All rights reserved. Site by{' '}
              <a 
                href="https://asami-works.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                AsamiWorks
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}