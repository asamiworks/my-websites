'use client'

import { useEffect, useRef, useState } from 'react'
import Card from '@/components/ui/Card'
import { CheckCircle, Heart, Sparkles } from 'lucide-react'

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // パラメディカルを先に配置
  const medicalItems = [
    { name: '傷痕修正', available: true },
    { name: '白斑カモフラージュ', available: true },
    { name: 'ストレッチマーク修正', available: true },
    { name: '口唇口蓋裂修正', available: true },
  ]

  const beautyItems = [
    { name: '眉', available: true },
    { name: 'リップ', available: true },
  ]

  const differences = [
    {
      aspect: '深さ',
      artmake: '表皮〜真皮上層',
      tattoo: '真皮深層',
    },
    {
      aspect: '持続期間',
      artmake: '1〜3年で薄くなる',
      tattoo: '永久に残る',
    },
    {
      aspect: '施術者',
      artmake: '医師・看護師',
      tattoo: '彫師',
    },
    {
      aspect: '麻酔',
      artmake: '使用可能',
      tattoo: '使用不可',
    },
  ]

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* セクションタイトル */}
        <div className={`text-center mb-12 lg:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl lg:text-4xl font-serif text-greige-800 mb-4">
            アートメイクとは
          </h2>
          <p className="text-lg text-greige-600 max-w-3xl mx-auto">
            医療行為として行う、美容と医療補助の施術
          </p>
          <p className="text-base text-greige-500 max-w-3xl mx-auto mt-2">
            針がついた専用の器具を使って、皮膚に傷をつけながら色素を入れる施術。
            <br className="hidden lg:block" />
            医師の管理のもと、美容から医療的な悩みまで幅広く対応します。
          </p>
        </div>

        {/* 2つの分野（パラメディカルを先に、大きく） */}
        <div className={`grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto mb-16 lg:mb-20 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          
          {/* 医療補助（パラメディカル）を先に配置 */}
          <div className="group md:order-1">
            <Card 
              hover 
              className="h-full bg-gradient-to-br from-greige-50 via-white to-greige-50/30 border-2 border-greige-200 shadow-lg"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-greige-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-10 h-10 text-greige-600" />
                </div>
                <h3 className="text-2xl font-medium text-greige-800">医療補助</h3>
                <p className="text-base font-medium text-greige-700 mt-1">パラメディカル</p>
              </div>
              <ul className="space-y-3">
                {medicalItems.map((item, index) => (
                  <li 
                    key={index}
                    className="flex items-center bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow border border-greige-200"
                  >
                    <span className="w-2 h-2 bg-greige-500 rounded-full mr-3" />
                    <span className="text-greige-700 font-medium">{item.name}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-greige-50 rounded-lg">
                <p className="text-sm text-greige-700 font-medium">
                  傷痕や白斑など医療的な悩みを解決
                </p>
                <p className="text-xs text-greige-600 mt-1">
                  スキンリジュビネーション技術で自然な改善
                </p>
              </div>
            </Card>
          </div>

          {/* 美容（2番目に配置） */}
          <div className="group md:order-2">
            <Card 
              hover 
              className="h-full bg-gradient-to-br from-greige-50 via-white to-greige-50/30 border border-greige-100"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-greige-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-greige-600" />
                </div>
                <h3 className="text-xl font-medium text-greige-800">美容</h3>
              </div>
              <ul className="space-y-3">
                {beautyItems.map((item, index) => (
                  <li 
                    key={index}
                    className="flex items-center bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="w-2 h-2 bg-greige-400 rounded-full mr-3" />
                    <span className="text-greige-700">{item.name}アートメイク</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-greige-50/50 rounded-lg">
                <p className="text-sm text-greige-600">
                  メイクの時間短縮と、24時間美しさをキープ
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* パラメディカルの詳細説明 */}
        <div className={`max-w-5xl mx-auto mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-gradient-to-r from-greige-50 to-white rounded-2xl p-8 border border-greige-200">
            <h3 className="text-xl font-medium text-greige-800 mb-4 text-center">
              パラメディカルアートメイクの特徴
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-greige-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-greige-700 font-bold">1</span>
                </div>
                <h4 className="font-medium text-greige-700 mb-2">医療的アプローチ</h4>
                <p className="text-sm text-greige-600">
                  スキンリジュビネーション技術で
                  肌の自然な再生を促進
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-greige-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-greige-700 font-bold">2</span>
                </div>
                <h4 className="font-medium text-greige-700 mb-2">幅広い対応</h4>
                <p className="text-sm text-greige-600">
                  傷痕、白斑、口唇口蓋裂、
                  ストレッチマークなど
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-greige-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-greige-700 font-bold">3</span>
                </div>
                <h4 className="font-medium text-greige-700 mb-2">心のケア</h4>
                <p className="text-sm text-greige-600">
                  プライバシーに配慮し、
                  自信を取り戻すサポート
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* アートメイクとタトゥーの違い */}
        <div className={`max-w-5xl mx-auto transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h3 className="text-2xl font-medium text-greige-800 text-center mb-8">
            アートメイクとタトゥーの違い
          </h3>

          {/* 比較カード */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* アートメイク */}
            <Card className="bg-gradient-to-b from-greige-50 to-white">
              <h4 className="font-medium text-greige-800 mb-4 text-center text-lg">アートメイク</h4>
              
              {/* 皮膚の層のイラスト（テキストベース） */}
              <div className="mb-6 bg-white rounded-lg p-4">
                <div className="space-y-2">
                  <div className="h-8 bg-greige-100 rounded flex items-center justify-center text-xs text-greige-700">
                    表皮
                  </div>
                  <div className="h-8 bg-greige-200 rounded flex items-center justify-center text-xs text-greige-800 font-bold">
                    真皮上層 ← ここに色素
                  </div>
                  <div className="h-8 bg-greige-300 rounded flex items-center justify-center text-xs text-greige-900">
                    真皮
                  </div>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm text-greige-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  色素は薄くなっていく
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  医師の診察が必要
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  麻酔使用できる
                </li>
              </ul>
            </Card>

            {/* タトゥー */}
            <Card className="bg-gradient-to-b from-gray-50 to-white">
              <h4 className="font-medium text-greige-800 mb-4 text-center text-lg">タトゥー</h4>
              
              {/* 皮膚の層のイラスト（テキストベース） */}
              <div className="mb-6 bg-white rounded-lg p-4">
                <div className="space-y-2">
                  <div className="h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-700">
                    表皮
                  </div>
                  <div className="h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-800">
                    真皮上層
                  </div>
                  <div className="h-8 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-900 font-bold">
                    真皮 ← ここに色素
                  </div>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm text-greige-600">
                <li className="flex items-center">
                <span className="w-4 h-4 mr-2 text-amber-500">×</span>
                  永久に残る
                </li>
                <li className="flex items-center">
                <span className="w-4 h-4 mr-2 text-amber-500">×</span>
                  医師の診察不要
                </li>
                <li className="flex items-center">
                <span className="w-4 h-4 mr-2 text-amber-500">×</span>
                  麻酔使用できない
                </li>
              </ul>
            </Card>
          </div>

          {/* 比較表 */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-greige-50">
                  <th className="border border-greige-200 px-4 py-3 text-left text-sm font-medium text-greige-700">
                    比較項目
                  </th>
                  <th className="border border-greige-200 px-4 py-3 text-left text-sm font-medium text-greige-700">
                    アートメイク
                  </th>
                  <th className="border border-greige-200 px-4 py-3 text-left text-sm font-medium text-greige-700">
                    タトゥー
                  </th>
                </tr>
              </thead>
              <tbody>
                {differences.map((diff, index) => (
                  <tr key={index} className="hover:bg-greige-50/50 transition-colors">
                    <td className="border border-greige-200 px-4 py-3 text-sm font-medium text-greige-700">
                      {diff.aspect}
                    </td>
                    <td className="border border-greige-200 px-4 py-3 text-sm text-greige-600">
                      {diff.artmake}
                    </td>
                    <td className="border border-greige-200 px-4 py-3 text-sm text-greige-600">
                      {diff.tattoo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}