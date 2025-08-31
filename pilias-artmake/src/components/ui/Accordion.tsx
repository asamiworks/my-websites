'use client'

import { useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Plus, Minus, HelpCircle } from 'lucide-react'

// 単一のアコーディオンアイテム
interface AccordionItemProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  icon?: ReactNode
  variant?: 'default' | 'bordered' | 'filled'
  className?: string
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  icon,
  variant = 'default',
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const variantStyles = {
    default: 'border-b border-greige-200',
    bordered: 'border border-greige-200 rounded-lg mb-3',
    filled: 'bg-greige-50 rounded-lg mb-3',
  }

  const paddingStyles = {
    default: 'py-4',
    bordered: 'p-4',
    filled: 'p-5',
  }

  return (
    <div className={cn(variantStyles[variant], className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between text-left transition-colors hover:text-greige-700',
          paddingStyles[variant],
          isOpen ? 'text-greige-800' : 'text-greige-600'
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center flex-1">
          {icon && <span className="mr-3">{icon}</span>}
          <span className="font-medium text-base lg:text-lg pr-4">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            'w-5 h-5 flex-shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div
          className={cn(
            'text-greige-600',
            variant === 'default' ? 'pb-4' : variant === 'bordered' ? 'px-4 pb-4' : 'px-5 pb-5'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// アコーディオングループ
interface AccordionGroupProps {
  children: ReactNode
  allowMultiple?: boolean
  variant?: 'default' | 'bordered' | 'filled'
  className?: string
}

export function AccordionGroup({
  children,
  allowMultiple = true,
  variant = 'default',
  className,
}: AccordionGroupProps) {
  return (
    <div className={cn(
      variant === 'default' && 'border-t border-greige-200',
      className
    )}>
      {children}
    </div>
  )
}

// FAQ専用アコーディオン
interface FAQItem {
  question: string
  answer: string
  category?: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  showCategories?: boolean
  variant?: 'default' | 'bordered' | 'filled'
  className?: string
}

export function FAQAccordion({
  items,
  showCategories = false,
  variant = 'bordered',
  className,
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // カテゴリごとにグループ化
  const groupedItems = showCategories
    ? items.reduce((acc, item) => {
        const category = item.category || 'その他'
        if (!acc[category]) acc[category] = []
        acc[category].push(item)
        return acc
      }, {} as Record<string, FAQItem[]>)
    : { all: items }

  return (
    <div className={className}>
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="mb-8">
          {showCategories && category !== 'all' && (
            <h3 className="text-lg font-medium text-greige-800 mb-4 flex items-center">
              <span className="w-1 h-5 bg-greige-400 rounded-full mr-3" />
              {category}
            </h3>
          )}
          
          <AccordionGroup variant={variant} allowMultiple={false}>
            {categoryItems.map((item, index) => {
              const globalIndex = items.indexOf(item)
              const isOpen = openIndex === globalIndex

              return (
                <div
                  key={globalIndex}
                  className={cn(
                    variant === 'bordered' && 'border border-greige-200 rounded-lg mb-3',
                    variant === 'filled' && 'bg-greige-50 rounded-lg mb-3',
                    variant === 'default' && 'border-b border-greige-200'
                  )}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                    className={cn(
                      'w-full flex items-start justify-between text-left transition-colors hover:text-greige-700',
                      variant === 'default' ? 'py-4' : 'p-5',
                      isOpen ? 'text-greige-800' : 'text-greige-600'
                    )}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start flex-1">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-greige-100 text-greige-600 text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                        Q
                      </div>
                      <span className="font-medium text-base lg:text-lg pr-4">
                        {item.question}
                      </span>
                    </div>
                    <Plus
                      className={cn(
                        'w-5 h-5 flex-shrink-0 transition-all duration-200 mt-1',
                        isOpen && 'rotate-45'
                      )}
                    />
                  </button>
                  
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300',
                      isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    )}
                  >
                    <div
                      className={cn(
                        'text-greige-600',
                        variant === 'default' ? 'pb-4 pl-10' : 'px-5 pb-5 pl-[52px]'
                      )}
                    >
                      <div className="flex items-start">
                        {/* 変更: bg-rose-100 text-rose-600 → bg-greige-100 text-greige-600 */}
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-greige-100 text-greige-600 text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                          A
                        </div>
                        <div className="flex-1 leading-relaxed whitespace-pre-wrap">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </AccordionGroup>
        </div>
      ))}
    </div>
  )
}

// 施術詳細用アコーディオン
interface DetailAccordionProps {
  sections: {
    title: string
    content: ReactNode
    icon?: ReactNode
  }[]
  defaultOpenIndex?: number
  variant?: 'default' | 'bordered' | 'filled'
  className?: string
}

export function DetailAccordion({
  sections,
  defaultOpenIndex = 0,
  variant = 'filled',
  className,
}: DetailAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex)

  return (
    <div className={className}>
      {sections.map((section, index) => (
        <div
          key={index}
          className={cn(
            variant === 'bordered' && 'border border-greige-200 rounded-lg mb-3',
            variant === 'filled' && 'bg-gradient-to-br from-greige-50 to-white rounded-lg mb-3',
            variant === 'default' && 'border-b border-greige-200'
          )}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className={cn(
              'w-full flex items-center justify-between text-left transition-colors hover:text-greige-700',
              variant === 'default' ? 'py-4' : 'p-5',
              openIndex === index ? 'text-greige-800' : 'text-greige-600'
            )}
            aria-expanded={openIndex === index}
          >
            <div className="flex items-center flex-1">
              {section.icon && (
                <span className="mr-3 text-greige-500">{section.icon}</span>
              )}
              <span className="font-medium text-base lg:text-lg">{section.title}</span>
            </div>
            <ChevronDown
              className={cn(
                'w-5 h-5 flex-shrink-0 transition-transform duration-200',
                openIndex === index && 'rotate-180'
              )}
            />
          </button>
          
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              openIndex === index ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div
              className={cn(
                'text-greige-600',
                variant === 'default' ? 'pb-4' : 'px-5 pb-5'
              )}
            >
              {section.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}