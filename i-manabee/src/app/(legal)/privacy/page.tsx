'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-cream">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-main mb-2">プライバシーポリシー</h1>
            <p className="text-text-sub">最終更新日: 2025年9月25日</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">1. 基本方針</h2>
              <p className="text-text-main leading-relaxed">
                AsamiWorks（以下「当社」）は、AI学習サービス「i-manabee（あいまなびー）」において、
                特に児童のプライバシー保護を最優先に考え、適切な個人情報の取扱いを行います。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">2. 収集する情報</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-main mb-2">保護者様の情報</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-text-main">
                    <li>メールアドレス</li>
                    <li>パスワード（暗号化保存）</li>
                    <li>お支払い情報（Stripe経由で処理）</li>
                    <li>ログイン履歴</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-main mb-2">お子様の情報</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-text-main">
                    <li>ニックネーム（本名は収集しません）</li>
                    <li>生年月（日は収集しません）</li>
                    <li>学習レベル設定</li>
                    <li>PINコード（暗号化保存）</li>
                    <li>チャット履歴</li>
                    <li>利用統計データ</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">3. COPPA（児童オンラインプライバシー保護）対応</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-text-main mb-3">13歳未満のお子様について</h3>
                <ul className="list-disc list-inside space-y-2 text-text-main">
                  <li>保護者様の明示的な同意を事前に取得</li>
                  <li>個人情報収集を最小限に制限</li>
                  <li>第三者への情報提供は原則禁止</li>
                  <li>保護者様によるデータ削除要求に対応</li>
                  <li>年1回の同意確認を実施</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">4. 情報の利用目的</h2>
              <ul className="list-disc list-inside space-y-2 text-text-main">
                <li>AI学習サービスの提供</li>
                <li>利用状況の分析・改善</li>
                <li>安全性の監視・確保</li>
                <li>保護者様への報告・通知</li>
                <li>カスタマーサポート</li>
                <li>料金決済処理</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">5. 情報の保護措置</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-main mb-2">技術的保護措置</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-text-main">
                    <li>AES-256による暗号化</li>
                    <li>Firebase Securityによる適切なアクセス制御</li>
                    <li>HTTPS通信の強制</li>
                    <li>定期的なセキュリティ監査</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-main mb-2">組織的保護措置</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-text-main">
                    <li>アクセス権限の最小化</li>
                    <li>データ処理ログの記録</li>
                    <li>従業員への教育・研修</li>
                    <li>インシデント対応体制の整備</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">6. 第三者への提供</h2>
              <div className="space-y-4 text-text-main">
                <p>当社は以下の場合を除き、個人情報を第三者に提供いたしません：</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>保護者様の明示的同意がある場合</li>
                  <li>法令に基づく場合</li>
                  <li>緊急時の安全確保のため必要な場合</li>
                  <li>サービス提供に必要な業務委託先（適切な管理下）</li>
                </ul>
                <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                  <p className="font-semibold">業務委託先について：</p>
                  <ul className="list-disc list-inside mt-2 ml-4">
                    <li>Google Firebase（データ保存）</li>
                    <li>OpenAI/Anthropic/Google（AI応答生成）</li>
                    <li>Stripe（決済処理）</li>
                    <li>SendGrid（メール送信）</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">7. データの保存期間</h2>
              <ul className="list-disc list-inside space-y-2 text-text-main">
                <li>アカウント削除時：30日後に完全削除</li>
                <li>チャット履歴：最大3年間保存</li>
                <li>安全ログ：5年間保存（法的要件）</li>
                <li>支払い記録：7年間保存（税法要件）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">8. お客様の権利</h2>
              <div className="space-y-4 text-text-main">
                <p>保護者様は以下の権利を行使できます：</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>個人情報の開示請求</li>
                  <li>個人情報の訂正・削除請求</li>
                  <li>個人情報処理の停止請求</li>
                  <li>データポータビリティ（データエクスポート）</li>
                  <li>同意の撤回</li>
                </ul>
                <p className="mt-4">
                  権利行使のご請求は
                  <a href="mailto:privacy@i-manabee.com" className="text-honey-yellow hover:underline">
                    privacy@i-manabee.com
                  </a>
                  までご連絡ください。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">9. Cookie・類似技術</h2>
              <div className="space-y-4 text-text-main">
                <p>当サービスでは以下の目的でCookieを使用します：</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>ログイン状態の維持</li>
                  <li>セキュリティの確保</li>
                  <li>サービスの改善</li>
                </ul>
                <p>
                  Cookieの利用を望まない場合は、ブラウザの設定で無効化できますが、
                  一部機能が制限される場合があります。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">10. プライバシーポリシーの変更</h2>
              <p className="text-text-main leading-relaxed">
                本ポリシーを変更する場合は、変更内容をサービス内及び当社ウェブサイトで
                30日前までに通知いたします。重要な変更については、保護者様に直接メールでご連絡いたします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">11. お問い合わせ</h2>
              <div className="bg-gray-50 p-6 rounded-lg text-text-main">
                <p className="font-semibold mb-2">個人情報保護責任者：浅見洋輔</p>
                <p>メール：<a href="mailto:privacy@i-manabee.com" className="text-honey-yellow hover:underline">privacy@i-manabee.com</a></p>
                <p>サポート：<a href="mailto:support@i-manabee.com" className="text-honey-yellow hover:underline">support@i-manabee.com</a></p>
              </div>
            </section>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              href="/terms"
              className="text-honey-yellow hover:text-honey-yellow/80 font-medium"
            >
              ← 利用規約
            </Link>
            <Link
              href="/sct"
              className="text-honey-yellow hover:text-honey-yellow/80 font-medium"
            >
              特定商取引法表記 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}