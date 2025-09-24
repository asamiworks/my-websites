'use client';

import React from 'react';
import Link from 'next/link';

export default function SctPage() {
  return (
    <div className="min-h-screen bg-bg-cream">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-main mb-2">特定商取引法に基づく表記</h1>
            <p className="text-text-sub">最終更新日: 2025年9月25日</p>
          </div>

          <div className="space-y-8">
            <section>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4">
                <div className="font-semibold text-text-main">事業者名</div>
                <div className="md:col-span-2 text-text-main">AsamiWorks（アサミワークス）</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b py-4">
                <div className="font-semibold text-text-main">代表者名</div>
                <div className="md:col-span-2 text-text-main">浅見洋輔</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b py-4">
                <div className="font-semibold text-text-main">所在地</div>
                <div className="md:col-span-2 text-text-main">
                  〒[郵便番号]<br />
                  [都道府県市区町村番地]<br />
                  <span className="text-sm text-text-sub">
                    ※正確な住所は登記後に更新いたします
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b py-4">
                <div className="font-semibold text-text-main">電話番号</div>
                <div className="md:col-span-2 text-text-main">
                  [専用番号取得予定]<br />
                  <span className="text-sm text-text-sub">
                    現在はメールでのお問い合わせのみ対応しております
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b py-4">
                <div className="font-semibold text-text-main">メールアドレス</div>
                <div className="md:col-span-2 text-text-main">
                  <a href="mailto:support@i-manabee.com" className="text-honey-yellow hover:underline">
                    support@i-manabee.com
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b py-4">
                <div className="font-semibold text-text-main">ウェブサイトURL</div>
                <div className="md:col-span-2 text-text-main">
                  <a href="https://i-manabee.com" className="text-honey-yellow hover:underline">
                    https://i-manabee.com
                  </a>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-6">販売価格</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-text-main mb-4">無料プラン</h3>
                  <p className="text-text-main">料金：0円</p>
                  <p className="text-text-sub text-sm mt-2">
                    利用制限あり（5回/期、1,000トークン/期）
                  </p>
                </div>

                <div className="bg-kids-blue/10 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-text-main mb-4">まなびーキッズ</h3>
                  <p className="text-text-main">料金：480円（税込）/ 月</p>
                  <p className="text-text-sub text-sm mt-2">
                    小学3年生まで対象、4,000トークン/期
                  </p>
                </div>

                <div className="bg-friends-purple/10 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-text-main mb-4">まなびーフレンズ</h3>
                  <p className="text-text-main">料金：880円（税込）/ 月</p>
                  <p className="text-text-sub text-sm mt-2">
                    3人まで利用可能、8,000トークン/期（家族共有）
                  </p>
                </div>

                <div className="bg-premium-gold/10 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-text-main mb-4">まなびープレミアム</h3>
                  <p className="text-text-main">料金：1,540円（税込）/ 月</p>
                  <p className="text-text-sub text-sm mt-2">
                    5人まで利用可能、無制限利用、優先サポート
                  </p>
                </div>
              </div>
              <p className="text-text-sub text-sm mt-4">
                ※価格は予告なく変更される場合があります。変更時は30日前に通知いたします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">支払方法</h2>
              <ul className="list-disc list-inside space-y-2 text-text-main">
                <li>クレジットカード（Visa、MasterCard、JCB、American Express、Diners）</li>
                <li>決済処理：Stripe Inc.を利用</li>
                <li>支払方法：前払い（月額課金制）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">支払時期</h2>
              <ul className="list-disc list-inside space-y-2 text-text-main">
                <li>初回：プラン申込時に即時決済</li>
                <li>継続：毎月同日に自動課金</li>
                <li>日割り計算は行いません</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">サービス提供時期</h2>
              <p className="text-text-main">
                決済完了確認後、即座にサービスをご利用いただけます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">返金・キャンセル</h2>
              <div className="space-y-4 text-text-main">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">7日間返金保証</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>初回登録から7日以内であれば全額返金</li>
                    <li>理由を問わず返金いたします</li>
                    <li>返金処理は5-10営業日以内</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">月途中での解約</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>解約後も月末まで利用可能</li>
                    <li>日割り返金は行いません</li>
                    <li>次回課金は自動停止</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">引き渡し時期</h2>
              <p className="text-text-main">
                本サービスはデジタルサービスのため、決済完了と同時にサービス提供開始となります。
                物理的な商品の配送はありません。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">申込みの撤回・契約解除</h2>
              <div className="space-y-4 text-text-main">
                <p>以下の場合、当社は契約を解除する場合があります：</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>利用規約への重大な違反</li>
                  <li>支払いの遅延・不履行</li>
                  <li>虚偽の情報による登録</li>
                  <li>反社会的勢力との関係が判明した場合</li>
                </ul>
                <p className="mt-4">
                  お客様からの解約申請は、アカウント設定画面またはメールにて受け付けております。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">注意事項</h2>
              <ul className="list-disc list-inside space-y-2 text-text-main">
                <li>本サービスは6-18歳のお子様向けの教育支援サービスです</li>
                <li>保護者の監督のもとでご利用ください</li>
                <li>AIの回答は参考情報であり、正確性を保証するものではありません</li>
                <li>システムメンテナンスにより一時的にサービス停止する場合があります</li>
                <li>お使いの端末・ブラウザによっては正常に動作しない場合があります</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">お問い合わせ</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-text-main mb-2">
                  本表記に関するお問い合わせは下記までご連絡ください：
                </p>
                <p className="text-text-main">
                  メール：<a href="mailto:support@i-manabee.com" className="text-honey-yellow hover:underline">support@i-manabee.com</a>
                </p>
                <p className="text-text-main">
                  営業時間：平日 9:00-18:00（土日祝日除く）
                </p>
                <p className="text-text-sub text-sm mt-2">
                  ※お返事まで2-3営業日お時間をいただく場合があります
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              href="/privacy"
              className="text-honey-yellow hover:text-honey-yellow/80 font-medium"
            >
              ← プライバシーポリシー
            </Link>
            <Link
              href="/coppa"
              className="text-honey-yellow hover:text-honey-yellow/80 font-medium"
            >
              COPPA対応 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}