import Link from 'next/link'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'line' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  external?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  external = false,
  onClick,
  disabled = false,
  className,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  // サイズのスタイル
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  }

  // バリアントのスタイル
  const variantStyles = {
    primary: 'bg-greige-700 text-white hover:bg-greige-800 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-greige-700 border-2 border-greige-300 hover:border-greige-400 hover:bg-greige-50',
    outline: 'bg-transparent text-greige-700 border-2 border-greige-700 hover:bg-greige-700 hover:text-white',
    line: 'bg-[#06C755] text-white hover:bg-[#05B04C] shadow-md hover:shadow-lg',
    ghost: 'bg-transparent text-greige-600 hover:bg-greige-50 hover:text-greige-800',
  }

  // 共通のクラス
  const baseStyles = cn(
    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 transform hover:-translate-y-0.5',
    sizeStyles[size],
    variantStyles[variant],
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed hover:translate-y-0',
    className
  )

  // ボタンの中身
  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  )

  // リンクボタン
  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseStyles}
          aria-label={ariaLabel}
        >
          {buttonContent}
        </a>
      )
    }
    return (
      <Link href={href} className={baseStyles} aria-label={ariaLabel}>
        {buttonContent}
      </Link>
    )
  }

  // 通常のボタン
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      aria-label={ariaLabel}
    >
      {buttonContent}
    </button>
  )
}

// LINE CTAボタン専用コンポーネント
export function LineButton({
  children = '無料カウンセリング予約',
  size = 'md',
  className,
  fullWidth = false,
}: {
  children?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullWidth?: boolean
}) {
  const lineIcon = (
    <svg
      className={cn(
        size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
      )}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.95 3.66 9.05 8.44 9.79.31.06.73-.1.86-.23.11-.11.37-.76.48-1.03.11-.28.06-.52-.02-.72-1.61-1.76-2.65-3.57-2.65-5.81 0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.24-1.04 4.05-2.65 5.81-.08.2-.13.44-.02.72.11.27.37.92.48 1.03.13.13.55.29.86.23C20.34 21.05 24 16.95 24 12c0-5.52-4.48-10-10-10z"/>
    </svg>
  )

  return (
    <Button
      variant="line"
      size={size}
      href="https://lin.ee/bhodgys"
      external
      icon={lineIcon}
      className={className}
      fullWidth={fullWidth}
      ariaLabel="LINE予約"
    >
      {children}
    </Button>
  )
}