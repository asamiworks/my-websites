'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg-cream">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-main mb-2">利用規約</h1>
            <p className="text-text-sub">最終更新日: 2025年9月25日</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">第1条（本規約の適用）</h2>
              <p className="text-text-main leading-relaxed">
                本規約は、AsamiWorks（以下「当社」）が提供するAI学習サービス「i-manabee（あいまなびー）」（以下「本サービス」）の利用に関し、
                ユーザー（保護者及び子ども）と当社との間の権利義務関係を定めるものです。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">第2条（サービス概要）</h2>
              <div className="space-y-4 text-text-main leading-relaxed">
                <p>本サービスは、6歳から18歳の子どもを対象としたAI学習支援サービスです。</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>AIとのチャット形式による学習サポート</li>
                  <li>年齢に応じた学習コンテンツの提供</li>
                  <li>安全性を重視した児童向け設計</li>
                  <li>保護者による利用状況の監視</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">第3条（利用資格）</h2>
              <div className="space-y-4 text-text-main leading-relaxed">
                <p>本サービスの利用には以下の条件を満たす必要があります：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>保護者が20歳以上であること</li>
                  <li>子どもが6歳以上18歳以下であること</li>
                  <li>保護者の同意のもとで利用すること</li>
                  <li>13歳未満の子どもの場合、COPPA準拠の特別な同意手続きが必要</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">第4条（アカウント管理）</h2>
              <div className="space-y-4 text-text-main leading-relaxed">
                <p>ユーザーは以下の義務を負います：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>正確な情報での登録</li>
                  <li>パスワード及びPINコードの適切な管理</li>
                  <li>第三者による不正使用の防止</li>
                  <li>アカウント情報変更時の速やかな更新</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">第5条（利用制限・禁止事項）</h2>
              <div className="space-y-4 text-text-main leading-relaxed">
                <p>ユーザーは以下の行為を禁止されます：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>不適切なコンテンツの投稿</li>
                  <li>他者の権利を侵害する行為</li>
                  <li>システムの脆弱性を悪用する行為</li>
                  <li>商用目的での利用</li>
                  <li>法令に違反する行為</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">第6条（料金・支払い）</h2>
              <div className="space-y-4 text-text-main leading-relaxed">
                <p>有料プランについては以下の通りです：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>月額料金制（前払い）</li>
                  <li>クレジットカードでの自動決済</li>
                  <li>初回登録から7日以内の全額返金保証</li>
                  <li>料金変更の30日前予告</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">第7条（プライバシー保護）</h2>
              <div className="space-y-4 text-text-main leading-relaxed">
                <p>当社は、特に児童のプライバシー保護に配慮します：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>個人情報の暗号化保存</li>
                  <li>第三者との情報共有の制限</li>
                  <li>COPPA（児童オンラインプライバシー保護法）の遵守</li>
                  <li>データの最小限収集原則</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">第8条（AI利用に関する免責）</h2>
              <div className="space-y-4 text-text-main leading-relaxed">
                <p>AIの回答について以下の点をご理解ください：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>AIの回答は参考情報であり、正確性を保証しません</li>
                  <li>学習成果には個人差があり、成績向上を約束しません</li>
                  <li>医療・法律等の専門的助言は提供しません</li>
                  <li>保護者の監督下での利用を前提とします</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">第9条（サービス変更・終了）</h2>
              <p className="text-text-main leading-relaxed">
                当社は、30日前の予告により本サービスの変更または終了を行うことができます。
                サービス終了時は、データエクスポート機能を提供いたします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">第10条（準拠法・裁判管轄）</h2>
              <p className="text-text-main leading-relaxed">
                本規約は日本国法に準拠し、本サービスに関する一切の紛争については、
                東京地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-text-sub text-sm">
                本規約に関するお問い合わせ：
                <a href="mailto:support@i-manabee.com" className="text-honey-yellow hover:underline">
                  support@i-manabee.com
                </a>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              href="/"
              className="text-honey-yellow hover:text-honey-yellow/80 font-medium"
            >
              ← ホームに戻る
            </Link>
            <Link
              href="/privacy"
              className="text-honey-yellow hover:text-honey-yellow/80 font-medium"
            >
              プライバシーポリシー →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}