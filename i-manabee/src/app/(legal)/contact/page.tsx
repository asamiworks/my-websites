'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    priority: 'normal'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement actual form submission
    // For now, simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
        priority: 'normal'
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-bg-cream">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-main mb-2">お問い合わせ</h1>
            <p className="text-text-sub">
              ご質問やご要望がございましたら、お気軽にお問い合わせください。
              24時間以内（営業日）にご返信いたします。
            </p>
          </div>

          {/* Quick Contact Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-2xl mb-2">📧</div>
              <h3 className="font-semibold text-text-main mb-2">メールサポート</h3>
              <p className="text-sm text-text-sub mb-2">一般的なお問い合わせ</p>
              <a
                href="mailto:support@i-manabee.com"
                className="text-honey-yellow hover:underline text-sm"
              >
                support@i-manabee.com
              </a>
            </div>

            <div className="bg-red-50 p-6 rounded-lg text-center">
              <div className="text-2xl mb-2">🚨</div>
              <h3 className="font-semibold text-text-main mb-2">緊急時連絡</h3>
              <p className="text-sm text-text-sub mb-2">お子様の安全に関わる場合</p>
              <a
                href="mailto:emergency@i-manabee.com"
                className="text-error-red hover:underline text-sm"
              >
                emergency@i-manabee.com
              </a>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold text-text-main mb-2">プライバシー</h3>
              <p className="text-sm text-text-sub mb-2">個人情報・COPPA関連</p>
              <a
                href="mailto:privacy@i-manabee.com"
                className="text-friends-purple hover:underline text-sm"
              >
                privacy@i-manabee.com
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-text-main mb-6">お問い合わせフォーム</h2>

            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <p className="text-green-800">
                  ✅ お問い合わせありがとうございます。24時間以内にご返信いたします。
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-main mb-2">
                    お名前 <span className="text-error-red">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-yellow focus:border-transparent"
                    placeholder="田中太郎"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-main mb-2">
                    メールアドレス <span className="text-error-red">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-yellow focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-text-main mb-2">
                    お問い合わせ種別 <span className="text-error-red">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-yellow focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    <option value="technical">技術的な問題</option>
                    <option value="account">アカウント・料金</option>
                    <option value="safety">安全性・子どもの利用</option>
                    <option value="feature">機能の要望</option>
                    <option value="privacy">プライバシー・COPPA</option>
                    <option value="business">法人・事業者向け</option>
                    <option value="other">その他</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-text-main mb-2">
                    優先度
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-yellow focus:border-transparent"
                  >
                    <option value="low">低（1週間以内）</option>
                    <option value="normal">通常（24時間以内）</option>
                    <option value="high">高（12時間以内）</option>
                    <option value="urgent">緊急（即時対応）</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-main mb-2">
                  件名 <span className="text-error-red">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-yellow focus:border-transparent"
                  placeholder="お問い合わせの件名をご記入ください"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-main mb-2">
                  お問い合わせ内容 <span className="text-error-red">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-yellow focus:border-transparent"
                  placeholder="具体的なお問い合わせ内容をご記入ください。&#10;&#10;※可能であれば以下もお知らせください：&#10;- お子様の年齢・学年&#10;- 使用している端末・ブラウザ&#10;- エラーが発生する場合は、その詳細"
                />
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-text-main mb-2">📝 お問い合わせ前にご確認ください</h3>
                <ul className="text-sm text-text-sub space-y-1 ml-4">
                  <li>• よくある質問（FAQ）で解決しないかご確認ください</li>
                  <li>• 技術的な問題の場合は、ブラウザの更新や再ログインをお試しください</li>
                  <li>• 緊急時（お子様の安全に関わる問題）は専用メールをご利用ください</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-honey-yellow hover:bg-honey-yellow/90 text-white'
                }`}
              >
                {isSubmitting ? '送信中...' : 'お問い合わせを送信'}
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-semibold text-text-main mb-6">よくある質問</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-text-main mb-2">Q: パスワードを忘れました</h3>
                <p className="text-sm text-text-sub">
                  A: ログイン画面の「パスワードを忘れた方」リンクから、
                  パスワードリセットのメールをお送りします。
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-text-main mb-2">Q: 子どものPINコードを忘れました</h3>
                <p className="text-text-sub text-sm">
                  A: 保護者アカウントの「子どもプロファイル」設定から、
                  PINコードの再設定が可能です。
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-text-main mb-2">Q: 利用制限に達しました</h3>
                <p className="text-text-sub text-sm">
                  A: 無料プランの場合は6時・18時にリセットされます。
                  有料プランへのアップグレードもご検討ください。
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-text-main mb-2">Q: AIの回答が不適切でした</h3>
                <p className="text-text-sub text-sm">
                  A: 該当メッセージのスクリーンショットと共に、
                  緊急度に応じて適切な連絡先へご報告ください。
                </p>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="border-t pt-6 mt-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-text-main mb-3">📞 サポート対応時間</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-text-main">
                <div>
                  <p><strong>平日：</strong> 9:00-18:00</p>
                  <p><strong>土日祝：</strong> 対応なし</p>
                </div>
                <div>
                  <p><strong>緊急時：</strong> 24時間対応</p>
                  <p><strong>システム障害：</strong> 随時対応</p>
                </div>
              </div>
              <p className="text-xs text-text-sub mt-3">
                ※緊急時とは、お子様の安全に直接関わる問題を指します
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              href="/ai-disclaimer"
              className="text-honey-yellow hover:text-honey-yellow/80 font-medium"
            >
              ← AI免責事項
            </Link>
            <Link
              href="/"
              className="text-honey-yellow hover:text-honey-yellow/80 font-medium"
            >
              ホームに戻る →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}