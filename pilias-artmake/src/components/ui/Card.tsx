import Link from 'next/link'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ArrowRight, Clock } from 'lucide-react'

// 基本的なCardコンポーネント
interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export default function Card({ 
  children, 
  className, 
  hover = false,
  gradient = false 
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white p-6',
        hover && 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        gradient && 'bg-gradient-to-br from-white to-greige-50',
        className
      )}
    >
      {children}
    </div>
  )
}

// メニューカード（施術メニュー用）
interface MenuCardProps {
  title: string
  description: string
  price?: {
    regular?: number
    monitor?: number
    retouch?: number
  }
  badge?: string
  features?: string[]
  href?: string
  image?: string
}

export function MenuCard({
  title,
  description,
  price,
  badge,
  features,
  href,
  image,
}: MenuCardProps) {
  const cardContent = (
    <Card hover={!!href} className="relative overflow-hidden h-full">
      {badge && (
        <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs px-3 py-1 rounded-full z-10">
          {badge}
        </span>
      )}
      
      {image && (
        <div className="h-48 -mx-6 -mt-6 mb-4 bg-gradient-to-br from-greige-100 to-greige-50 flex items-center justify-center">
          <span className="text-greige-400">画像エリア</span>
        </div>
      )}
      
      <h3 className="text-xl font-medium text-greige-800 mb-3">{title}</h3>
      <p className="text-greige-600 text-sm mb-4 line-clamp-3">{description}</p>
      
      {features && features.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-greige-100 text-greige-600 px-2 py-1 rounded"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {price && (
        <div className="mt-auto pt-4 border-t border-greige-100">
          {price.monitor && (
            <p className="text-sm text-amber-600 mb-1">
              モニター価格: ¥{price.monitor.toLocaleString()}
            </p>
          )}
          {price.regular && (
            <p className="text-lg font-medium text-greige-800">
              ¥{price.regular.toLocaleString()}
            </p>
          )}
        </div>
      )}
      
      {href && (
        <div className="mt-4 flex items-center text-greige-600 hover:text-greige-800 transition-colors">
          <span className="text-sm">詳しく見る</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      )}
    </Card>
  )

  // hrefがある場合はLinkでラップ、ない場合はそのまま返す
  if (href) {
    return <Link href={href}>{cardContent}</Link>
  }
  
  return cardContent
}

// 情報カード（クリニック情報など）
interface InfoCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  icon?: ReactNode
  className?: string
}

export function InfoCard({ 
  title, 
  subtitle, 
  children, 
  icon,
  className 
}: InfoCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-start">
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 bg-greige-100 rounded-lg flex items-center justify-center mr-4">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-medium text-greige-800 mb-1">{title}</h3>
          {subtitle && (
            <p className="text-sm text-greige-500 mb-3">{subtitle}</p>
          )}
          <div className="text-greige-600">{children}</div>
        </div>
      </div>
    </Card>
  )
}

// ステップカード（施術の流れなど）
interface StepCardProps {
  number: string | number
  title: string
  description: string
  icon?: ReactNode
  duration?: string
  className?: string
}

export function StepCard({ 
  number, 
  title, 
  description, 
  icon,
  duration,
  className 
}: StepCardProps) {
  return (
    <Card className={cn('relative', className)}>
      <div className="flex items-start">
        <div className="flex-shrink-0 w-12 h-12 bg-greige-700 text-white rounded-full flex items-center justify-center font-bold mr-4">
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-greige-800">{title}</h3>
            {duration && (
              <span className="flex items-center text-sm text-greige-500">
                <Clock className="w-4 h-4 mr-1" />
                {duration}
              </span>
            )}
          </div>
          <p className="text-greige-600">{description}</p>
          {icon && (
            <div className="mt-3">{icon}</div>
          )}
        </div>
      </div>
    </Card>
  )
}

// 価格カード
interface PriceCardProps {
  title: string
  price: number
  unit?: string
  features?: string[]
  highlighted?: boolean
  className?: string
}

export function PriceCard({ 
  title, 
  price, 
  unit = '円',
  features,
  highlighted = false,
  className 
}: PriceCardProps) {
  return (
    <Card 
      className={cn(
        highlighted && 'border-2 border-amber-300 bg-amber-50',
        className
      )}
    >
      {highlighted && (
        <span className="inline-block bg-amber-500 text-white text-xs px-3 py-1 rounded-full mb-3">
          おすすめ
        </span>
      )}
      <h3 className="text-xl font-medium text-greige-800 mb-3">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold text-greige-800">
          ¥{price.toLocaleString()}
        </span>
        <span className="text-greige-600 ml-1">{unit}</span>
      </div>
      {features && (
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm text-greige-600">
              <span className="w-1.5 h-1.5 bg-greige-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

// 統計カード
interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function StatCard({ 
  label, 
  value, 
  unit,
  icon,
  trend,
  className 
}: StatCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-2">
        {icon && (
          <div className="w-10 h-10 bg-greige-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        )}
        {trend && (
          <span className={cn(
            'text-sm font-medium',
            trend === 'up' && 'text-green-600',
            trend === 'down' && 'text-amber-600',
            trend === 'neutral' && 'text-greige-600'
          )}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trend === 'neutral' && '→'}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-greige-800">
        {value}
        {unit && <span className="text-lg font-normal text-greige-600 ml-1">{unit}</span>}
      </p>
      <p className="text-sm text-greige-600 mt-1">{label}</p>
    </Card>
  )
}