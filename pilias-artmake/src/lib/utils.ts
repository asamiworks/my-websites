import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSSのクラス名を結合するユーティリティ関数
 * clsxで条件付きクラスを処理し、twMergeで重複を解決
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 日付をフォーマットする
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'long') {
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * 価格をフォーマットする
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('ja-JP')
}

/**
 * 電話番号をフォーマットする
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // ハイフンや空白を削除
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  // 日本の電話番号形式にフォーマット
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  } else if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  }
  
  return phoneNumber
}

/**
 * スクロール位置を取得
 */
export function getScrollPosition(): number {
  if (typeof window === 'undefined') return 0
  return window.pageYOffset || document.documentElement.scrollTop
}

/**
 * スムーズスクロール
 */
export function smoothScrollTo(elementId: string, offset: number = 100): void {
  if (typeof window === 'undefined') return
  
  const element = document.getElementById(elementId)
  if (!element) return
  
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - offset
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  })
}

/**
 * デバイス判定
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

/**
 * URLのバリデーション
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 文字列を指定文字数で切り詰める
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * ランダムIDを生成
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}