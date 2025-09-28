'use client';

import React from 'react';
import Link from 'next/link';

export default function AiDisclaimerPage() {
  return (
    <div className="min-h-screen bg-bg-cream">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-main mb-2">
              AI利用に関する免責事項
            </h1>
            <p className="text-text-sub">最終更新日: 2025年9月25日</p>
          </div>

          <div className="space-y-8">
            <section className="bg-yellow-50 p-6 rounded-lg border-l-4 border-warning-yellow">
              <h2 className="text-xl font-semibold text-text-main mb-3">
                ⚠️ 重要：AI技術の特性について
              </h2>
              <p className="text-text-main leading-relaxed">
                i-manabee（あいまなびー）で使用しているAI（人工知能）は、
                機械学習技術に基づく自動応答システムです。
                AIの回答には限界があることを予めご理解ください。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">1. AIの回答に関する免責事項</h2>
              <div className="space-y-4">
                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-text-main mb-3">
                    🚫 正確性の保証について
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-text-main">
                    <li>AIの回答は参考情報であり、内容の正確性を保証するものではありません</li>
                    <li>科学的事実、数学的計算、歴史的事実等についても間違いが含まれる可能性があります</li>
                    <li>最新の情報や時事的な内容については、古い情報に基づく場合があります</li>
                    <li>重要な判断や決定の際は、必ず信頼できる情報源で確認してください</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">2. 学習効果・成績向上に関する免責事項</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-text-main mb-3">
                    📚 学習成果について
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-text-main">
                    <li>学習成果や理解度向上には個人差があります</li>
                    <li>成績向上や学習目標の達成を約束するものではありません</li>
                    <li>定期テストや受験の結果について責任を負いません</li>
                    <li>学習の進捗は個人の努力や学習環境に大きく依存します</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">3. 専門的助言に関する制限</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-100 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-text-main mb-3">❌ 提供できない助言</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-text-main">
                    <li>医学的診断・治療法</li>
                    <li>法律相談・法的助言</li>
                    <li>投資・金融アドバイス</li>
                    <li>心理カウンセリング</li>
                    <li>薬物・危険物質に関する情報</li>
                    <li>違法行為の方法</li>
                  </ul>
                </div>
                <div className="bg-green-100 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-text-main mb-3">✅ 適切な利用方法</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-text-main">
                    <li>一般的な学習サポート</li>
                    <li>宿題の考え方のヒント</li>
                    <li>学習方法のアドバイス</li>
                    <li>基礎的な知識の説明</li>
                    <li>創作活動の支援</li>
                    <li>日常的な悩み相談</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">4. 生成コンテンツの権利・責任</h2>
              <div className="space-y-4 text-text-main">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">📝 コンテンツの利用について</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>AIが生成した文章や回答は、ユーザー様が自由に利用できます</li>
                    <li>ただし、生成内容に他者の権利を侵害する要素が含まれていないか確認してください</li>
                    <li>学校の課題等で利用する際は、各教育機関の規則に従ってください</li>
                    <li>商用利用については事前にお問い合わせください</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">5. 技術的制限・サービス停止</h2>
              <div className="space-y-4 text-text-main">
                <p>以下の事由によるサービス停止・制限については責任を負いません：</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="list-disc list-inside space-y-1">
                    <li>システムメンテナンス</li>
                    <li>サーバー障害</li>
                    <li>インターネット接続の問題</li>
                    <li>第三者AIサービスの停止</li>
                    <li>不可抗力（災害等）</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-1">
                    <li>利用制限の超過</li>
                    <li>安全性確保のための一時停止</li>
                    <li>規約違反による制限</li>
                    <li>ブラウザ・端末の非対応</li>
                    <li>法的要請による停止</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">6. 保護者の監督責任</h2>
              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-warning-yellow">
                <h3 className="text-lg font-semibold text-text-main mb-3">
                  👨‍👩‍👧‍👦 保護者様へのお願い
                </h3>
                <ul className="list-disc list-inside space-y-2 text-text-main">
                  <li>お子様の利用状況を定期的に確認してください</li>
                  <li>AIの回答内容について、お子様と一緒に検証してください</li>
                  <li>不適切な内容や間違った情報を見つけた場合は、適切に指導してください</li>
                  <li>学習の主体はお子様自身であることを理解させてください</li>
                  <li>依存的な利用にならないよう、適度な利用時間を設定してください</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">7. 緊急時・危険な内容への対応</h2>
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-text-main mb-3">
                  🚨 緊急時の対応について
                </h3>
                <div className="space-y-4 text-text-main">
                  <p>
                    お子様から自傷・自殺・いじめ等の危険な相談があった場合：
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>AIは適切な相談窓口の案内を行います</li>
                    <li>保護者様には自動的に緊急通知をお送りします</li>
                    <li>必要に応じて専門機関との連携を検討します</li>
                    <li>ただし、AIは専門的なカウンセリングを提供できません</li>
                  </ul>
                  <div className="mt-4 p-4 bg-white rounded border">
                    <p className="font-semibold">緊急時連絡先：</p>
                    <p>チャイルドライン：<strong>0120-99-7777</strong></p>
                    <p>いのちの電話：<strong>0570-783-556</strong></p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">8. 損害・責任の制限</h2>
              <div className="space-y-4 text-text-main">
                <p>以下の損害について、当社は責任を負いません：</p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ul className="list-disc list-inside space-y-2">
                    <li>AI回答の内容に起因する直接的・間接的損害</li>
                    <li>学習成果が期待通りでなかったことによる損害</li>
                    <li>サービス停止・遅延による機会損失</li>
                    <li>第三者との紛争による損害</li>
                    <li>その他本サービス利用に関連する一切の損害</li>
                  </ul>
                </div>
                <p className="text-sm text-text-sub mt-4">
                  ただし、当社の故意または重大な過失による場合を除きます。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">9. 継続的改善への取り組み</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-text-main leading-relaxed mb-4">
                  当社では、AI技術の向上とサービス品質の改善に継続的に取り組んでいます：
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-main">
                  <li>定期的なAIモデルの更新・改善</li>
                  <li>不適切な回答の検出・修正システムの強化</li>
                  <li>ユーザーフィードバックの積極的な活用</li>
                  <li>安全性ガイドラインの定期的な見直し</li>
                  <li>外部専門家による監修・助言の取得</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">10. お問い合わせ</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-text-main mb-4">
                  AI利用に関するご質問・ご相談は下記までお気軽にお問い合わせください：
                </p>
                <div className="space-y-2 text-text-main">
                  <p>
                    <strong>技術サポート：</strong>
                    <a href="mailto:ai-support@i-manabee.com" className="text-honey-yellow hover:underline">
                      ai-support@i-manabee.com
                    </a>
                  </p>
                  <p>
                    <strong>一般お問い合わせ：</strong>
                    <a href="mailto:support@i-manabee.com" className="text-honey-yellow hover:underline">
                      support@i-manabee.com
                    </a>
                  </p>
                  <p className="text-text-sub text-sm mt-3">
                    24時間以内（営業日）にお返事いたします。
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              href="/coppa"
              className="text-honey-yellow hover:text-honey-yellow/80 font-medium"
            >
              ← COPPA対応
            </Link>
            <Link
              href="/contact"
              className="text-honey-yellow hover:text-honey-yellow/80 font-medium"
            >
              お問い合わせ →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}