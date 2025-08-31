import React from 'react';
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>プライバシーポリシー</h1>
      <p className={styles.intro}>
        「マイホームスターター」（以下「当サイト」）は、住宅コンシェルジュサービスを提供するにあたり、個人情報の保護を最重要事項として取り組んでいます。本プライバシーポリシーでは、当サイトをご利用いただくお客様の個人情報の取り扱いについて説明します。
      </p>

      <section className={styles.section}>
        <h2>1. 個人情報の取得について</h2>
        <p>
          当サイトは、以下の方法でお客様の個人情報を取得する場合があります。
        </p>
        <ul>
          <li>サービス利用時に入力いただいた情報（例：家づくり総予算シミュレーターでの入力情報）</li>
          <li>住宅会社や土地探しに関するヒアリング時に提供いただいた情報</li>
          <li>お問い合わせフォームやメールでのご連絡内容</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>2. 個人情報の利用目的</h2>
        <p>
          取得した個人情報は、以下の目的で利用します。
        </p>
        <ul>
          <li>ご予算内で理想の家づくりを進めてくれる住宅会社を紹介するため</li>
          <li>ご希望に基づく住宅会社や土地探しに関するご提案</li>
          <li>お客様のニーズに合ったサービスや情報の提供</li>
          <li>当サイトのサービス向上のための統計的分析</li>
          <li>必要に応じたご連絡やお知らせの送付</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>3. 個人情報の第三者提供について</h2>
        <p>
          当サイトは、以下の場合を除き、お客様の同意なく個人情報を第三者に提供することはありません。
        </p>
        <ul>
          <li>法令に基づく場合</li>
          <li>お客様が希望される住宅会社の紹介や土地探しのために必要な場合</li>
          <li>サービス提供のために業務委託先へ情報を開示する場合</li>
        </ul>
      </section>

      <footer className={styles.footer}>
        <p>お問い合わせは以下のリンクよりご連絡ください。</p>
        <a href="/contact" className={styles.contactLink}>
          お問い合わせページへ
        </a>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
