// src/app/Contact/metadata.ts
import { Metadata } from 'next'

export const contactMetadata: Metadata = {
  title: 'お問い合わせ | ASAMI WORKS - Webデザイン・開発のご相談',
  description: 'ASAMI WORKSへのお問い合わせはこちら。Webサイト制作、リニューアル、SEO対策など、お気軽にご相談ください。24時間以内に返信いたします。',
  keywords: 'Web制作 問い合わせ, ホームページ制作 相談, SEO対策 依頼, ASAMI WORKS コンタクト',
  openGraph: {
    title: 'お問い合わせ | ASAMI WORKS',
    description: 'プロフェッショナルなWeb制作のご相談はこちらから',
    url: 'https://asami-works.com/Contact',
    type: 'website',
    images: [{
      url: 'https://asami-works.com/contact-og.jpg',
      width: 1200,
      height: 630,
      alt: 'ASAMI WORKS お問い合わせ',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'お問い合わせ | ASAMI WORKS',
    description: 'Web制作のプロフェッショナルにご相談ください',
  },
  alternates: {
    canonical: 'https://asami-works.com/Contact',
  },
}

// src/app/form/metadata.ts
export const formMetadata: Metadata = {
  title: 'プロジェクト相談フォーム | ASAMI WORKS - 詳細なご要望をお聞かせください',
  description: 'Webプロジェクトの詳細なご要望をお聞かせください。予算、納期、デザインイメージなど、具体的なご相談が可能です。',
  keywords: 'Web制作 見積もり, ホームページ制作 相談フォーム, プロジェクト依頼, ASAMI WORKS',
  openGraph: {
    title: 'プロジェクト相談フォーム | ASAMI WORKS',
    description: '詳細なプロジェクト要件をお聞かせください',
    url: 'https://asami-works.com/form',
    type: 'website',
  },
}

// 各ページで使用
// import { contactMetadata } from './metadata'
// export const metadata = contactMetadata