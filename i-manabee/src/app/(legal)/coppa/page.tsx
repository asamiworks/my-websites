'use client';

import React from 'react';
import Link from 'next/link';

export default function CoppaPage() {
  return (
    <div className="min-h-screen bg-bg-cream">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-main mb-2">
              児童プライバシー保護方針（COPPA対応）
            </h1>
            <p className="text-text-sub">最終更新日: 2025年9月25日</p>
          </div>

          <div className="space-y-8">
            <section className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-text-main mb-4">重要なお知らせ</h2>
              <p className="text-text-main leading-relaxed">
                i-manabee（あいまなびー）では、13歳未満のお子様の個人情報保護について、
                アメリカのCOPPA（Children's Online Privacy Protection Act：児童オンラインプライバシー保護法）に
                準拠した厳格な取り扱いを行っています。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">1. COPPAとは</h2>
              <p className="text-text-main leading-relaxed mb-4">
                COPPAは、13歳未満の児童から個人情報を収集するウェブサイトやオンラインサービスに対し、
                事前に保護者の同意を得ることを義務付けるアメリカの法律です。
                当サービスでは、この法律に準拠した運用を行っています。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">2. 13歳未満のお子様について</h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-text-main mb-3">特別な保護措置</h3>
                  <ul className="list-disc list-inside space-y-2 text-text-main">
                    <li>保護者様の明示的な同意を事前に取得</li>
                    <li>個人情報収集を法的に許可された最小限に制限</li>
                    <li>第三者への情報提供を原則禁止</li>
                    <li>保護者様によるデータ閲覧・削除権を保証</li>
                    <li>年1回の同意確認を実施</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">3. 保護者同意の手続き</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-honey-yellow text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-main mb-2">年齢確認</h3>
                    <p className="text-text-main">
                      お子様の生年月から年齢を自動判定し、13歳未満の場合は特別手続きに進みます。
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-honey-yellow text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-main mb-2">同意フォームの表示</h3>
                    <p className="text-text-main">
                      13歳未満のお子様向けの専用同意フォームを表示し、詳細な説明を提供します。
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-honey-yellow text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-main mb-2">メール確認</h3>
                    <p className="text-text-main">
                      保護者様のメールアドレスに確認メールを送信し、専用リンクからの同意確認を行います。
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-honey-yellow text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-main mb-2">同意記録の保存</h3>
                    <p className="text-text-main">
                      同意内容、日時、IPアドレス等を暗号化してセキュアに保存します。
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">4. 収集する情報の制限</h2>
              <div className="space-y-4">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-text-main mb-3">13歳未満のお子様の場合</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-text-main mb-2">✅ 収集する情報</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-text-main">
                        <li>ニックネーム（本名ではない）</li>
                        <li>生年月（日は含まず）</li>
                        <li>学習レベル設定</li>
                        <li>チャット内容（学習目的のみ）</li>
                        <li>利用時間・頻度</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-main mb-2">❌ 収集しない情報</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-text-main">
                        <li>本名・住所・電話番号</li>
                        <li>学校名・クラス</li>
                        <li>写真・動画・音声</li>
                        <li>位置情報</li>
                        <li>友人関係の情報</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">5. 保護者様の権利</h2>
              <div className="space-y-4 text-text-main">
                <p>保護者様は以下の権利をいつでも行使できます：</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-honey-yellow font-bold">👁️</span>
                      <div>
                        <h4 className="font-semibold">情報の閲覧</h4>
                        <p className="text-sm text-text-sub">
                          お子様に関して収集・保存されている情報の確認
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-honey-yellow font-bold">✏️</span>
                      <div>
                        <h4 className="font-semibold">情報の修正</h4>
                        <p className="text-sm text-text-sub">
                          不正確な情報の訂正要求
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-honey-yellow font-bold">🗑️</span>
                      <div>
                        <h4 className="font-semibold">情報の削除</h4>
                        <p className="text-sm text-text-sub">
                          お子様の個人情報の完全削除
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-honey-yellow font-bold">⏸️</span>
                      <div>
                        <h4 className="font-semibold">収集の停止</h4>
                        <p className="text-sm text-text-sub">
                          追加の情報収集を停止
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-honey-yellow font-bold">❌</span>
                      <div>
                        <h4 className="font-semibold">同意の撤回</h4>
                        <p className="text-sm text-text-sub">
                          いつでも同意を撤回可能
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-honey-yellow font-bold">📧</span>
                      <div>
                        <h4 className="font-semibold">通知の受信</h4>
                        <p className="text-sm text-text-sub">
                          重要な変更の事前通知
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">6. 安全性の確保</h2>
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-text-main mb-3">緊急時の対応</h3>
                <p className="text-text-main mb-4">
                  13歳未満のお子様が危険なキーワードを入力した場合の特別対応：
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-main">
                  <li>AIによる即座の共感的対応</li>
                  <li>適切な相談窓口情報の提供</li>
                  <li>保護者様への即時メール・SMS通知</li>
                  <li>24時間以内の保護者様への電話確認（重大な場合）</li>
                  <li>必要に応じて専門機関との連携</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">7. 年次同意確認</h2>
              <p className="text-text-main leading-relaxed mb-4">
                13歳未満のお子様については、年1回（お子様の誕生月）に保護者様の同意確認を行います。
                同意更新がない場合、アカウントは一時停止され、データは安全に保管されます。
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-text-main font-semibold">13歳の誕生日を迎えた場合</p>
                <p className="text-text-main text-sm mt-1">
                  お子様が13歳になった時点で、自動的に通常のプライバシーポリシーが適用されます。
                  保護者様には事前に通知し、設定変更のご希望を確認いたします。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">8. お問い合わせ・権利行使</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-text-main mb-3">COPPA関連のお問い合わせ窓口</h3>
                <div className="space-y-2 text-text-main">
                  <p>
                    <strong>児童プライバシー責任者：</strong>浅見洋輔
                  </p>
                  <p>
                    <strong>専用メール：</strong>
                    <a href="mailto:coppa@i-manabee.com" className="text-honey-yellow hover:underline">
                      coppa@i-manabee.com
                    </a>
                  </p>
                  <p>
                    <strong>緊急連絡先：</strong>
                    <a href="mailto:emergency@i-manabee.com" className="text-honey-yellow hover:underline">
                      emergency@i-manabee.com
                    </a>
                  </p>
                  <p className="text-text-sub text-sm mt-4">
                    権利行使のご請求には、保護者様の身元確認を行った上で、
                    2営業日以内に対応いたします。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">9. 法的準拠</h2>
              <p className="text-text-main leading-relaxed">
                本方針は、アメリカのCOPPA法、日本の個人情報保護法、その他関連する国際的な
                児童保護基準に準拠して策定されています。法的要件の変更に応じて、
                適宜更新を行います。
              </p>
            </section>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              href="/sct"
              className="text-honey-yellow hover:text-honey-yellow/80 font-medium"
            >
              ← 特定商取引法表記
            </Link>
            <Link
              href="/ai-disclaimer"
              className="text-honey-yellow hover:text-honey-yellow/80 font-medium"
            >
              AI免責事項 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}