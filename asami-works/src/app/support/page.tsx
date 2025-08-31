// src/app/support/page.tsx

import Link from 'next/link';
import styles from './Support.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'サポート | クライアント様専用ページ',
  description: 'サイト運営に関するマニュアルやサポート情報をご提供しています。メール設定、トラブルシューティング、各種お問い合わせはこちらから。',
  robots: {
    index: false,
    follow: false,
  },
};

interface SupportItem {
  title: string;
  description: string;
  link: string;
  icon: string;
  available: boolean;
}

const supportItems: SupportItem[] = [
  {
    title: 'メール設定マニュアル',
    description: 'メールアカウントの設定方法を、お使いのデバイスに合わせて詳しくご案内します。',
    link: '/support/email-setup',
    icon: '📧',
    available: true,
  },
  {
    title: 'サイト更新依頼',
    description: 'Webサイトの更新・修正のご依頼はこちらから。',
    link: '/form?type=support',
    icon: '✏️',
    available: true,
  },
  {
    title: 'トラブルシューティング',
    description: 'サイトやメールに関するトラブルの解決方法をご案内します。',
    link: '#',
    icon: '🔧',
    available: false,
  },
  {
    title: '操作マニュアル',
    description: 'WordPress等の管理画面の操作方法を解説します。',
    link: '#',
    icon: '📖',
    available: false,
  },
  {
    title: '契約・請求情報',
    description: 'ご契約内容や請求に関する情報を確認できます。',
    link: '#',
    icon: '💳',
    available: false,
  },
  {
    title: 'よくあるご質問',
    description: 'お客様からよくいただくご質問と回答集です。',
    link: '#',
    icon: '❓',
    available: false,
  },
];

export default function SupportPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>サポート</h1>
        <p className={styles.subtitle}>
          お客様のサイト運営をサポートする各種情報をご用意しています
        </p>
      </div>

      <div className={styles.grid}>
        {supportItems.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardIcon}>{item.icon}</div>
            <h2 className={styles.cardTitle}>{item.title}</h2>
            <p className={styles.cardDescription}>{item.description}</p>
            {item.available ? (
              <Link href={item.link} className={styles.cardLink}>
                詳しく見る →
              </Link>
            ) : (
              <span className={styles.comingSoon}>準備中</span>
            )}
          </div>
        ))}
      </div>

      <div className={styles.contactSection}>
        <h2>お問い合わせ</h2>
        <p>
          上記以外のご質問やご要望がございましたら、<br />
          お気軽にお問い合わせください。
        </p>
        <Link href="/contact" className={styles.contactButton}>
          お問い合わせフォームへ
        </Link>
      </div>

      <div className={styles.emergencySection}>
        <div className={styles.emergencyContent}>
          <h3>緊急時のご連絡</h3>
          <p>
            サイトが表示されない、メールが使えないなど、<br />
            緊急を要する場合は以下までご連絡ください。
          </p>
          <div className={styles.emergencyInfo}>
            <p>
              <strong>メール：</strong>
              <a href="mailto:info@asami-works.com">info@asami-works.com</a>
            </p>
            <p className={styles.note}>
              ※営業時間：平日 9:00-18:00<br />
              ※緊急時は営業時間外でも可能な限り対応いたします
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}