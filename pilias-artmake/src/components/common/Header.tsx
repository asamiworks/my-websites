'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Instagram } from 'lucide-react'
import { cn } from '@/lib/utils'

// ナビゲーションメニューのデータ
const navigationItems = [
  {
    label: 'アートメイクの特徴',
    href: '#',
    subItems: [
      { label: 'パラメディカルアートメイクとは', href: '/paramedical' },
      { label: '施術の流れ', href: '/flow' },
      { label: '料金', href: '/pricing' },
      { label: '施術症例', href: '/gallery' }
    ]
  },
  {
    label: 'PILIASARTMAKEについて',
    href: '#',
    subItems: [
      { label: '代表挨拶', href: '/about/greeting' },
      { label: '提携院 / アクセス', href: '/clinics' }
    ]
  }
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  // スクロール検知
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // モバイルメニュー開閉時のスクロール制御
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <header
      className={cn(
        'fixed top-0 z-40 w-full bg-white/95 backdrop-blur-md transition-all duration-300',
        isScrolled ? 'py-2 shadow-md' : 'py-3'
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* ロゴ */}
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105"
          >
            <img 
              src="/logo.png"
              alt="PILIAS ARTMAKE"
              className="h-12 md:h-14 w-auto"
              width={240}
              height={150}
            />
          </Link>

          {/* デスクトップナビゲーション */}
          <div className="hidden items-center space-x-8 md:flex">
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(index)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className="flex items-center space-x-1 py-2 text-sm font-medium text-greige-700 transition-colors hover:text-greige-900"
                  aria-expanded={openDropdown === index}
                >
                  <span>{item.label}</span>
                  <ChevronDown className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    openDropdown === index && "rotate-180"
                  )} />
                </button>

                {/* ドロップダウンメニュー */}
                <div className={cn(
                  "absolute left-0 top-full w-64 transition-all duration-200",
                  openDropdown === index 
                    ? "opacity-100 visible translate-y-0" 
                    : "opacity-0 invisible -translate-y-2"
                )}>
                  {/* 隙間を埋めるためのブリッジ */}
                  <div className="h-2" />
                  
                  <div className="rounded-lg bg-white py-2 shadow-lg border border-greige-100">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className="block px-4 py-2.5 text-sm text-greige-600 transition-colors hover:bg-greige-50 hover:text-greige-900"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="flex items-center space-x-4">
              <a
                href="https://www.instagram.com/asuka_artmake_para/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-greige-600 transition-colors hover:text-greige-900"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://lin.ee/bhodgys"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#06C755] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#05b34a] hover:shadow-md"
              >
                公式LINE
              </a>
            </div>
          </div>

          {/* モバイルメニューボタン */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-greige-700 transition-colors hover:text-greige-900 md:hidden"
            aria-label="メニュー"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* モバイルメニュー */}
        <div
          className={cn(
            'fixed inset-x-0 top-[68px] z-50 h-[calc(100vh-68px)] bg-white transition-transform duration-300 md:hidden',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="overflow-y-auto p-4">
            {navigationItems.map((item, index) => (
              <div key={index} className="border-b border-greige-100 py-4">
                <div className="font-medium text-greige-700">{item.label}</div>
                <div className="mt-2 space-y-2 pl-4">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className="block py-2 text-sm text-greige-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* モバイルCTA */}
            <div className="mt-6 space-y-4">
              <a
                href="https://www.instagram.com/asuka_artmake_para/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 rounded-full border border-greige-300 py-3 text-greige-700"
              >
                <Instagram className="h-5 w-5" />
                <span>Instagram</span>
              </a>
              <a
                href="https://lin.ee/bhodgys"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-full bg-[#06C755] py-3 text-center font-medium text-white"
              >
                公式LINE予約
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}