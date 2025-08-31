'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

interface NavigationProps {
  mobile?: boolean
  onClose?: () => void
}

interface MenuItem {
  label: string
  href?: string
  children?: {
    label: string
    href: string
  }[]
}

const menuItems: MenuItem[] = [
  {
    label: 'アートメイクの特徴',
    children: [
      { label: 'パラメディカルアートメイクとは', href: '/artmake-features/paramedical' },
      { label: '施術の流れ', href: '/flow' },
      { label: '料金', href: '/pricing' },
      { label: '施術症例', href: '/gallery' },
    ]
  },
  {
    label: 'PILIAS ARTMAKEについて',
    children: [
      { label: '代表挨拶', href: '/about/greeting' },
      { label: '提携院 / アクセス', href: '/clinics' },
    ]
  }
]

export default function Navigation({ mobile = false, onClose }: NavigationProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  const handleLinkClick = () => {
    if (onClose) onClose()
    setOpenDropdown(null)
  }

  if (mobile) {
    // モバイルメニュー
    return (
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left text-greige-700 hover:bg-greige-50 rounded-lg transition-colors"
            >
              <span className="font-medium">{item.label}</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${
                  openDropdown === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {openDropdown === index && item.children && (
              <div className="mt-1 ml-4 space-y-1">
                {item.children.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    href={child.href}
                    onClick={handleLinkClick}
                    className="block px-3 py-2 text-sm text-greige-600 hover:text-greige-800 hover:bg-greige-50 rounded-lg transition-colors"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    )
  }

  // デスクトップメニュー
  return (
    <>
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="relative group"
          onMouseEnter={() => setOpenDropdown(index)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {item.href ? (
            <Link
              href={item.href}
              className="flex items-center space-x-1 text-greige-700 hover:text-greige-900 transition-colors py-2"
            >
              <span>{item.label}</span>
            </Link>
          ) : (
            <button className="flex items-center space-x-1 text-greige-700 hover:text-greige-900 transition-colors py-2">
              <span>{item.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
          
          {item.children && (
            <div
              className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-greige-100 overflow-hidden transition-all duration-200 ${
                openDropdown === index
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="py-2">
                {item.children.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    href={child.href}
                    className="block px-4 py-2.5 text-sm text-greige-700 hover:bg-greige-50 hover:text-greige-900 transition-colors"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  )
}