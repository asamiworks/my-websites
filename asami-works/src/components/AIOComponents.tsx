// src/components/AIOComponents.tsx
import React from 'react'

// 1. FAQ構造化コンポーネント（AI検索で高評価）
export function FAQSection({ faqs }: { faqs: Array<{q: string, a: string}> }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="faq-section">
        <h2>よくある質問</h2>
        {faqs.map((faq, index) => (
          <div key={index} itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">{faq.q}</h3>
            <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
              <p itemProp="text">{faq.a}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}

// 2. ステップバイステップガイド（SGE最適化）
export function HowToSection({ 
  title, 
  steps 
}: { 
  title: string
  steps: Array<{name: string, text: string, image?: string}>
}) {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image })
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <section className="how-to-section">
        <h2>{title}</h2>
        <ol>
          {steps.map((step, index) => (
            <li key={index}>
              <h3>ステップ {index + 1}: {step.name}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}

// 3. 比較表コンポーネント（AI検索での表示率UP）
export function ComparisonTable({ 
  items 
}: { 
  items: Array<{
    feature: string
    basic: string | boolean
    premium: string | boolean
  }>
}) {
  return (
    <div className="comparison-table" itemScope itemType="https://schema.org/Table">
      <table>
        <thead>
          <tr>
            <th>機能</th>
            <th>ベーシックプラン</th>
            <th>プレミアムプラン</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.feature}</td>
              <td>{typeof item.basic === 'boolean' ? (item.basic ? '✓' : '×') : item.basic}</td>
              <td>{typeof item.premium === 'boolean' ? (item.premium ? '✓' : '×') : item.premium}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 4. レビュー/評価コンポーネント
export function ReviewSection({ 
  reviews 
}: { 
  reviews: Array<{
    author: string
    rating: number
    review: string
    date: string
  }>
}) {
  const aggregateRating = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRating) }}
      />
      <section className="reviews">
        <h2>お客様の声</h2>
        {reviews.map((review, index) => (
          <div key={index} itemScope itemType="https://schema.org/Review">
            <div itemProp="author" itemScope itemType="https://schema.org/Person">
              <span itemProp="name">{review.author}</span>
            </div>
            <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
              <span itemProp="ratingValue">{review.rating}</span>/5
            </div>
            <p itemProp="reviewBody">{review.review}</p>
            <time itemProp="datePublished">{review.date}</time>
          </div>
        ))}
      </section>
    </>
  )
}