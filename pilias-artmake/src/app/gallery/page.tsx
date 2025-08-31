'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ChevronRight, Instagram, Filter, Eye } from 'lucide-react'

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [displayCount, setDisplayCount] = useState(8) // 初期表示数を8枚に設定
  const MAX_DISPLAY = 60 // 最大表示数を30枚に制限
  
  // 施術症例のサンプルデータ
  // 画像ファイル名の規則: /images/gallery/[category]/[id].jpg
  const galleryItems = [
    // ========== 眉毛アートメイク (30件) ==========
    {
      id: 1,
      category: 'eyebrow',
      title: '毛並み眉 - ナチュラル仕上げ',
      description: '自眉が薄い方への毛並み技法。自然な毛流れを再現しました。',
      image: '/images/gallery/eyebrow/01.jpg',
    },
    {
      id: 2,
      category: 'eyebrow',
      title: 'パウダー眉 - ふんわり仕上げ',
      description: 'メイクをしたようなふんわりとした仕上がりに。',
      image: '/images/gallery/eyebrow/02.jpg',
    },
    {
      id: 3,
      category: 'eyebrow',
      title: 'MIX技法 - 立体感のある眉',
      description: '毛並みとパウダーを組み合わせた立体的な仕上がり。',
      image: '/images/gallery/eyebrow/03.jpg',
    },
    {
      id: 4,
      category: 'eyebrow',
      title: 'アーチ眉デザイン',
      description: '顔の黄金比に合わせたアーチ眉デザイン。',
      image: '/images/gallery/eyebrow/04.jpg',
    },
    {
      id: 5,
      category: 'eyebrow',
      title: '平行眉（ストレート）',
      description: '若見え効果のある親しみやすい平行眉。',
      image: '/images/gallery/eyebrow/05.jpg',
    },
    {
      id: 6,
      category: 'eyebrow',
      title: '平行眉（セミアーチ）',
      description: '程よいカーブで柔らかく優しい印象に。',
      image: '/images/gallery/eyebrow/06.jpg',
    },
    {
      id: 7,
      category: 'eyebrow',
      title: '上がり眉 - クールデザイン',
      description: 'シャープで知的な印象の上がり眉。',
      image: '/images/gallery/eyebrow/07.jpg',
    },
    {
      id: 8,
      category: 'eyebrow',
      title: 'ハンサム眉（海外風）',
      description: '凛々しくクールな海外風デザイン。',
      image: '/images/gallery/eyebrow/08.jpg',
    },
    {
      id: 9,
      category: 'eyebrow',
      title: '毛並み眉 - 極細技法',
      description: '1本1本丁寧に描いた極細毛並み。',
      image: '/images/gallery/eyebrow/09.jpg',
    },
    {
      id: 10,
      category: 'eyebrow',
      title: 'パウダー眉 - 濃いめ仕上げ',
      description: 'しっかりメイク派の方向けの濃いめパウダー。',
      image: '/images/gallery/eyebrow/10.jpg',
    },
    {
      id: 11,
      category: 'eyebrow',
      title: 'MIX技法 - ナチュラルグラデーション',
      description: '眉頭から眉尻にかけて自然なグラデーション。',
      image: '/images/gallery/eyebrow/11.jpg',
    },
    {
      id: 12,
      category: 'eyebrow',
      title: '左右差修正',
      description: '左右非対称だった眉を整えました。',
      image: '/images/gallery/eyebrow/12.jpg',
    },
    {
      id: 13,
      category: 'eyebrow',
      title: '無毛症の方への施術',
      description: '全く眉毛がない方への自然な眉デザイン。',
      image: '/images/gallery/eyebrow/13.jpg',
    },
    {
      id: 14,
      category: 'eyebrow',
      title: '部分的な薄毛カバー',
      description: '眉尻だけが薄い方への部分施術。',
      image: '/images/gallery/eyebrow/14.jpg',
    },
    {
      id: 15,
      category: 'eyebrow',
      title: '太眉トレンドデザイン',
      description: '今流行りの太眉をナチュラルに表現。',
      image: '/images/gallery/eyebrow/15.jpg',
    },
    {
      id: 16,
      category: 'eyebrow',
      title: '細眉エレガントデザイン',
      description: '上品で洗練された細眉スタイル。',
      image: '/images/gallery/eyebrow/16.jpg',
    },
    {
      id: 17,
      category: 'eyebrow',
      title: '男性向け眉デザイン',
      description: '男性の骨格に合わせた自然な眉。',
      image: '/images/gallery/eyebrow/17.jpg',
    },
    {
      id: 18,
      category: 'eyebrow',
      title: 'エイジングケア眉',
      description: '年齢による眉の薄さをカバー。',
      image: '/images/gallery/eyebrow/18.jpg',
    },
    {
      id: 19,
      category: 'eyebrow',
      title: '毛並み眉 - ダークブラウン',
      description: '髪色に合わせたダークブラウンの毛並み。',
      image: '/images/gallery/eyebrow/19.jpg',
    },
    {
      id: 20,
      category: 'eyebrow',
      title: 'パウダー眉 - ライトブラウン',
      description: '明るい髪色に合わせたライトブラウン。',
      image: '/images/gallery/eyebrow/20.jpg',
    },
    {
      id: 21,
      category: 'eyebrow',
      title: '黄金比率眉デザイン',
      description: '顔の黄金比率に基づいた理想的な眉。',
      image: '/images/gallery/eyebrow/21.jpg',
    },
    {
      id: 22,
      category: 'eyebrow',
      title: '眉毛リフトアップ効果',
      description: '目元をリフトアップして見せる眉デザイン。',
      image: null, // '/images/gallery/eyebrow/22.jpg',
    },
    {
      id: 23,
      category: 'eyebrow',
      title: '小顔効果眉デザイン',
      description: '顔を小さく見せる眉の角度と長さ。',
      image: null, // '/images/gallery/eyebrow/23.jpg',
    },
    {
      id: 24,
      category: 'eyebrow',
      title: '目力アップ眉',
      description: '目を大きく見せる眉デザイン。',
      image: null, // '/images/gallery/eyebrow/24.jpg',
    },
    {
      id: 25,
      category: 'eyebrow',
      title: 'ナチュラルアーチ',
      description: '自然なアーチで優しい印象に。',
      image: null, // '/images/gallery/eyebrow/25.jpg',
    },
    {
      id: 26,
      category: 'eyebrow',
      title: 'モード系シャープ眉',
      description: 'ファッショナブルなシャープデザイン。',
      image: null, // '/images/gallery/eyebrow/26.jpg',
    },
    {
      id: 27,
      category: 'eyebrow',
      title: '韓国風平行眉',
      description: '韓国アイドル風の平行眉デザイン。',
      image: null, // '/images/gallery/eyebrow/27.jpg',
    },
    {
      id: 28,
      category: 'eyebrow',
      title: '欧米風アーチ眉',
      description: '欧米人のような立体的なアーチ眉。',
      image: null, // '/images/gallery/eyebrow/28.jpg',
    },
    {
      id: 29,
      category: 'eyebrow',
      title: 'オフィス向け上品眉',
      description: 'ビジネスシーンに適した上品な眉。',
      image: null, // '/images/gallery/eyebrow/29.jpg',
    },
    {
      id: 30,
      category: 'eyebrow',
      title: 'カジュアルナチュラル眉',
      description: '普段使いしやすいナチュラルデザイン。',
      image: null, // '/images/gallery/eyebrow/30.jpg',
    },

    // ========== リップアートメイク (30件) ==========
    {
      id: 31,
      category: 'lip',
      title: 'リップ - 血色改善',
      description: 'くすみがちな唇を明るい血色感のある色に。',
      image: '/images/gallery/lip/01.jpg',
    },
    {
      id: 32,
      category: 'lip',
      title: 'リップライン修正',
      description: '左右非対称な唇のラインを整えました。',
      image: '/images/gallery/lip/02.jpg',
    },
    {
      id: 33,
      category: 'lip',
      title: 'オーバーリップデザイン',
      description: 'ボリューム感のあるオーバーリップ。',
      image: '/images/gallery/lip/03.jpg',
    },
    {
      id: 34,
      category: 'lip',
      title: 'ナチュラルピンク',
      description: '自然な血色のナチュラルピンク。',
      image: '/images/gallery/lip/04.jpg',
    },
    {
      id: 35,
      category: 'lip',
      title: 'コーラルピンク',
      description: '健康的で明るいコーラルピンク。',
      image: '/images/gallery/lip/05.jpg',
    },
    {
      id: 36,
      category: 'lip',
      title: 'ローズピンク',
      description: '上品で女性らしいローズピンク。',
      image: null, // '/images/gallery/lip/06.jpg',
    },
    {
      id: 37,
      category: 'lip',
      title: 'ベージュピンク',
      description: '大人っぽいベージュピンク。',
      image: null, // '/images/gallery/lip/07.jpg',
    },
    {
      id: 38,
      category: 'lip',
      title: 'くすみ改善 - ビフォーアフター',
      description: '青みがかったくすみを改善。',
      image: null, // '/images/gallery/lip/08.jpg',
    },
    {
      id: 39,
      category: 'lip',
      title: '口角アップデザイン',
      description: '口角を上げて見せるデザイン。',
      image: null, // '/images/gallery/lip/09.jpg',
    },
    {
      id: 40,
      category: 'lip',
      title: 'M字リップ',
      description: '美しいM字カーブのリップライン。',
      image: null, // '/images/gallery/lip/10.jpg',
    },
    {
      id: 41,
      category: 'lip',
      title: 'グラデーションリップ',
      description: '内側から外側へ自然なグラデーション。',
      image: null, // '/images/gallery/lip/11.jpg',
    },
    {
      id: 42,
      category: 'lip',
      title: 'フルリップデザイン',
      description: '全体的にボリュームアップ。',
      image: null, // '/images/gallery/lip/12.jpg',
    },
    {
      id: 43,
      category: 'lip',
      title: '薄い唇のボリュームアップ',
      description: '薄い唇に自然なボリューム感を。',
      image: null, // '/images/gallery/lip/13.jpg',
    },
    {
      id: 44,
      category: 'lip',
      title: '厚い唇の調整',
      description: '厚すぎる唇を自然に調整。',
      image: null, // '/images/gallery/lip/14.jpg',
    },
    {
      id: 45,
      category: 'lip',
      title: '年齢によるシワ改善',
      description: '唇の縦ジワを目立たなく。',
      image: null, // '/images/gallery/lip/15.jpg',
    },
    {
      id: 46,
      category: 'lip',
      title: 'ティントリップ風',
      description: 'ティントリップのような自然な染まり。',
      image: null, // '/images/gallery/lip/16.jpg',
    },
    {
      id: 47,
      category: 'lip',
      title: 'マットリップ風',
      description: 'マットな質感を表現。',
      image: null, // '/images/gallery/lip/17.jpg',
    },
    {
      id: 48,
      category: 'lip',
      title: 'グロッシーリップ風',
      description: 'ツヤ感のあるグロッシーな仕上がり。',
      image: null, // '/images/gallery/lip/18.jpg',
    },
    {
      id: 49,
      category: 'lip',
      title: '韓国風グラデーション',
      description: '韓国メイク風のグラデーションリップ。',
      image: null, // '/images/gallery/lip/19.jpg',
    },
    {
      id: 50,
      category: 'lip',
      title: 'ヌーディーカラー',
      description: '肌なじみの良いヌーディーカラー。',
      image: null, // '/images/gallery/lip/20.jpg',
    },
    {
      id: 51,
      category: 'lip',
      title: 'ピーチカラー',
      description: 'フレッシュなピーチカラー。',
      image: null, // '/images/gallery/lip/21.jpg',
    },
    {
      id: 52,
      category: 'lip',
      title: 'オレンジピンク',
      description: '元気で明るいオレンジピンク。',
      image: null, // '/images/gallery/lip/22.jpg',
    },
    {
      id: 53,
      category: 'lip',
      title: 'ダークローズ',
      description: '大人っぽいダークローズ。',
      image: null, // '/images/gallery/lip/23.jpg',
    },
    {
      id: 54,
      category: 'lip',
      title: 'サーモンピンク',
      description: '優しいサーモンピンク。',
      image: null, // '/images/gallery/lip/24.jpg',
    },
    {
      id: 55,
      category: 'lip',
      title: '人中短縮効果',
      description: '人中を短く見せるリップデザイン。',
      image: null, // '/images/gallery/lip/25.jpg',
    },
    {
      id: 56,
      category: 'lip',
      title: '若見えリップ',
      description: '若々しい印象のリップデザイン。',
      image: null, // '/images/gallery/lip/26.jpg',
    },
    {
      id: 57,
      category: 'lip',
      title: 'セクシーリップ',
      description: 'セクシーで魅力的なリップ。',
      image: null, // '/images/gallery/lip/27.jpg',
    },
    {
      id: 58,
      category: 'lip',
      title: 'キュートリップ',
      description: '可愛らしい印象のリップ。',
      image: null, // '/images/gallery/lip/28.jpg',
    },
    {
      id: 59,
      category: 'lip',
      title: 'エレガントリップ',
      description: '上品でエレガントなリップ。',
      image: null, // '/images/gallery/lip/29.jpg',
    },
    {
      id: 60,
      category: 'lip',
      title: 'ナチュラルリップ',
      description: 'すっぴんでも浮かないナチュラルリップ。',
      image: null, // '/images/gallery/lip/30.jpg',
    },

    // ========== パラメディカルアートメイク (30件) ==========
    {
      id: 61,
      category: 'paramedical',
      title: '白斑カモフラージュ（顔）',
      description: '顔の白斑を自然な肌色でカバー。',
      image: '/images/gallery/paramedical/01.jpg',
    },
    {
      id: 62,
      category: 'paramedical',
      title: '傷痕カモフラージュ（1×1cm）',
      description: '小さな傷痕を目立たなく。',
      image: '/images/gallery/paramedical/02.jpg',
    },
    {
      id: 63,
      category: 'paramedical',
      title: '口唇口蓋裂の修正',
      description: '口唇口蓋裂の術後の傷跡を自然にカバー。',
      image: '/images/gallery/paramedical/03.jpg',
    },
    {
      id: 64,
      category: 'paramedical',
      title: 'ストレッチマーク（妊娠線）',
      description: '妊娠線を目立たなくする施術。',
      image: null, // '/images/gallery/paramedical/04.jpg',
    },
    {
      id: 65,
      category: 'paramedical',
      title: '傷痕カモフラージュ（2×2cm）',
      description: '中サイズの傷痕をカバー。',
      image: null, // '/images/gallery/paramedical/05.jpg',
    },
    {
      id: 66,
      category: 'paramedical',
      title: '傷痕カモフラージュ（3×3cm）',
      description: '大きめの傷痕を自然にカバー。',
      image: null, // '/images/gallery/paramedical/06.jpg',
    },
    {
      id: 67,
      category: 'paramedical',
      title: '白斑カモフラージュ（手）',
      description: '手の白斑を肌色でカバー。',
      image: null, // '/images/gallery/paramedical/07.jpg',
    },
    {
      id: 68,
      category: 'paramedical',
      title: '白斑カモフラージュ（首）',
      description: '首元の白斑を自然にカバー。',
      image: null, // '/images/gallery/paramedical/08.jpg',
    },
    {
      id: 69,
      category: 'paramedical',
      title: '手術痕（帝王切開）',
      description: '帝王切開の傷跡を目立たなく。',
      image: null, // '/images/gallery/paramedical/09.jpg',
    },
    {
      id: 70,
      category: 'paramedical',
      title: '手術痕（盲腸）',
      description: '盲腸手術の傷跡カバー。',
      image: null, // '/images/gallery/paramedical/10.jpg',
    },
    {
      id: 71,
      category: 'paramedical',
      title: 'やけど跡',
      description: 'やけど跡を目立たなくする施術。',
      image: null, // '/images/gallery/paramedical/11.jpg',
    },
    {
      id: 72,
      category: 'paramedical',
      title: 'ニキビ跡',
      description: 'ニキビ跡の凹凸を目立たなく。',
      image: null, // '/images/gallery/paramedical/12.jpg',
    },
    {
      id: 73,
      category: 'paramedical',
      title: '水疱瘡跡',
      description: '水疱瘡の跡を自然にカバー。',
      image: null, // '/images/gallery/paramedical/13.jpg',
    },
    {
      id: 74,
      category: 'paramedical',
      title: 'ストレッチマーク（腕）',
      description: '腕のストレッチマークをカバー。',
      image: null, // '/images/gallery/paramedical/14.jpg',
    },
    {
      id: 75,
      category: 'paramedical',
      title: 'ストレッチマーク（太もも）',
      description: '太もものストレッチマークを目立たなく。',
      image: null, // '/images/gallery/paramedical/15.jpg',
    },
    {
      id: 76,
      category: 'paramedical',
      title: 'ストレッチマーク（お腹）',
      description: 'お腹のストレッチマークをカバー。',
      image: null, // '/images/gallery/paramedical/16.jpg',
    },
    {
      id: 77,
      category: 'paramedical',
      title: '乳輪乳頭再建',
      description: '乳がん術後の乳輪乳頭再建。',
      image: null, // '/images/gallery/paramedical/17.jpg',
    },
    {
      id: 78,
      category: 'paramedical',
      title: '乳輪の色素修正',
      description: '乳輪の色素を自然に調整。',
      image: null, // '/images/gallery/paramedical/18.jpg',
    },
    {
      id: 79,
      category: 'paramedical',
      title: '脱毛症（円形）',
      description: '円形脱毛症の部分をカバー。',
      image: null, // '/images/gallery/paramedical/19.jpg',
    },
    {
      id: 80,
      category: 'paramedical',
      title: '頭皮の傷跡',
      description: '頭皮の傷跡を髪の毛のように見せる。',
      image: null, // '/images/gallery/paramedical/20.jpg',
    },
    {
      id: 81,
      category: 'paramedical',
      title: 'ほくろ再建',
      description: '除去したほくろを自然に再現。',
      image: null, // '/images/gallery/paramedical/21.jpg',
    },
    {
      id: 82,
      category: 'paramedical',
      title: '白斑（広範囲）',
      description: '広範囲の白斑を段階的にカバー。',
      image: null, // '/images/gallery/paramedical/22.jpg',
    },
    {
      id: 83,
      category: 'paramedical',
      title: 'リストカット跡',
      description: 'リストカット跡を優しくカバー。',
      image: null, // '/images/gallery/paramedical/23.jpg',
    },
    {
      id: 84,
      category: 'paramedical',
      title: '事故による傷跡',
      description: '交通事故等の傷跡をカバー。',
      image: null, // '/images/gallery/paramedical/24.jpg',
    },
    {
      id: 85,
      category: 'paramedical',
      title: 'ケロイド跡',
      description: 'ケロイド状の傷跡を目立たなく。',
      image: null, // '/images/gallery/paramedical/25.jpg',
    },
    {
      id: 86,
      category: 'paramedical',
      title: '肉割れ',
      description: '急激な体重変化による肉割れをカバー。',
      image: null, // '/images/gallery/paramedical/26.jpg',
    },
    {
      id: 87,
      category: 'paramedical',
      title: '色素沈着',
      description: '色素沈着を自然な肌色に。',
      image: null, // '/images/gallery/paramedical/27.jpg',
    },
    {
      id: 88,
      category: 'paramedical',
      title: '先天性母斑',
      description: '生まれつきの母斑をカバー。',
      image: null, // '/images/gallery/paramedical/28.jpg',
    },
    {
      id: 89,
      category: 'paramedical',
      title: 'レーザー治療跡',
      description: 'レーザー治療後の色素脱失をカバー。',
      image: null, // '/images/gallery/paramedical/29.jpg',
    },
    {
      id: 90,
      category: 'paramedical',
      title: '薬剤による色素異常',
      description: '薬の副作用による色素異常を調整。',
      image: null, // '/images/gallery/paramedical/30.jpg',
    },
  ]

  // 画像がある項目のみフィルタリング
  const itemsWithImages = galleryItems.filter(item => item.image)

  const filters = [
    { value: 'all', label: 'すべて', count: Math.min(itemsWithImages.length, MAX_DISPLAY) },
    { value: 'eyebrow', label: '眉', count: Math.min(itemsWithImages.filter(item => item.category === 'eyebrow').length, MAX_DISPLAY) },
    { value: 'lip', label: 'リップ', count: Math.min(itemsWithImages.filter(item => item.category === 'lip').length, MAX_DISPLAY) },
    { value: 'paramedical', label: 'パラメディカル', count: Math.min(itemsWithImages.filter(item => item.category === 'paramedical').length, MAX_DISPLAY) },
  ]

  const filteredItems = activeFilter === 'all' 
    ? itemsWithImages 
    : itemsWithImages.filter(item => item.category === activeFilter)

  // 最大30件に制限してから表示数を適用
  const limitedItems = filteredItems.slice(0, MAX_DISPLAY)
  const displayedItems = limitedItems.slice(0, displayCount)
  const hasMoreItems = limitedItems.length > displayCount
  
  // フィルター変更時に表示数をリセット
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    setDisplayCount(8) // フィルター変更時は初期表示数に戻す
  }
  
  // もっと見るボタンの処理
  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 8, limitedItems.length))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* パンくずリスト */}
      <div className="bg-stone-50 py-3">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-stone-600 hover:text-stone-800">
              ホーム
            </Link>
            <ChevronRight className="w-4 h-4 text-stone-400" />
            <span className="text-stone-800 font-medium">施術症例</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-stone-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-serif text-stone-800 mb-4">
              施術症例
            </h1>
            <p className="text-lg text-stone-600 mb-6">
              1000件以上の実績から、お客様に最適な施術をご提案
            </p>
            
           
          </div>
        </div>
      </section>

      {/* フィルター */}
      <section className="py-8 bg-white border-b border-stone-200">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-stone-600" />
              <span className="text-stone-700 font-medium">カテゴリー：</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => handleFilterChange(filter.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === filter.value
                      ? 'bg-stone-700 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 text-xs opacity-70">({filter.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ギャラリーグリッド */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          {displayedItems.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedItems.map((item) => (
                  <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
                    {/* Before/After画像 */}
                    <Image
                      src={item.image!}
                      alt="Before/After"
                      fill
                      className="object-cover"
                    />
                    
                    {/* ホバー時のオーバーレイ */}
                    
                    
                    {/* カテゴリーバッジ */}
                    {/* カテゴリーバッジ */}
<div className="absolute top-2 left-2">
  <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
    item.category === 'paramedical'
      ? 'bg-greige-500/90 text-white'   // 修正: rose → greige
      : item.category === 'lip'
      ? 'bg-stone-500/90 text-white'    // 修正: pink → stone
      : 'bg-stone-700/90 text-white'
  }`}>
    {item.category === 'eyebrow' && '眉'}
    {item.category === 'lip' && 'リップ'}
    {item.category === 'paramedical' && 'パラメディカル'}
  </span>
</div>
                  </div>
                ))}
              </div>
              
              {/* もっと見るボタン */}
              {hasMoreItems && (
                <div className="text-center mt-12">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={loadMore}
                  >
                    もっと症例を見る
                  </Button>
                </div>
              )}
              
              {/* 表示件数情報 */}
              <div className="text-center mt-6 text-sm text-stone-500">
                {displayedItems.length}件を表示中
                {filteredItems.length > MAX_DISPLAY && (
                  <span className="ml-2 text-xs">
                    （全{filteredItems.length}件中、最新{MAX_DISPLAY}件まで表示可能）
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-stone-600">
                現在、該当する症例写真はありません。
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Instagram連携セクション */}
      <section className="py-12 lg:py-16 bg-stone-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white text-center p-8 lg:p-12">
              <Instagram className="w-16 h-16 text-stone-400 mx-auto mb-6" />
              <h2 className="text-2xl font-medium text-stone-800 mb-4">
                Instagramで最新症例をチェック
              </h2>
              <p className="text-stone-600 mb-6">
                日々の施術症例や、ビフォーアフター写真を配信しています。
                <br />
                施術の参考にぜひご覧ください。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  href="https://www.instagram.com/asuka_artmake_para/"
                  external
                  icon={<Instagram className="w-5 h-5" />}
                >
                  @asuka_artmake_para
                </Button>
                
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 注意事項 */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-stone-500">
              ※掲載している症例写真は、お客様の同意を得て掲載しております。
              <br />
              ※施術効果には個人差があります。
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-stone-50 to-amber-50">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-serif text-stone-800 mb-4">
            あなたも理想の仕上がりを
          </h2>
          <p className="text-stone-600 mb-8 max-w-2xl mx-auto">
            豊富な症例実績から、お客様に最適な施術をご提案いたします
          </p>
          <Button variant="line" size="lg">
            LINE無料カウンセリング予約
          </Button>
        </div>
      </section>
    </div>
  )
}