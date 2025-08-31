"use client";

import styles from "./subsidy.module.css";
import Link from "next/link";

export default function SubsidyPage() {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>補助金を活用したホームページ制作で、成果を最大化</h1>

      <p className={styles.text}>
        補助金制度を利用して、<strong>成果につながるホームページ制作</strong>を実現しませんか？
        AsamiWorksでは、<strong>集客や売上に直結する設計</strong>を前提に、
        小規模事業者・中小企業のためのサイト構築をサポートしています。
      </p>

      <div className={styles.block}>
        <h2 className={styles.subtitle}>補助金を活用したホームページ制作が選ばれる理由</h2>
        <ul className={styles.points}>
          <li>企業の<strong>信頼性・実績</strong>を効果的に伝えられる</li>
          <li>検索エンジン経由の<strong>新規顧客獲得</strong>が期待できる</li>
          <li>問い合わせ・資料請求・予約などの<strong>導線設計</strong>が可能</li>
          <li>採用や取引先への<strong>印象アップ</strong>にもつながる</li>
        </ul>
        <p className={styles.note}>
          ホームページは、もはや「費用」ではなく<strong>将来への投資</strong>です。
        </p>
      </div>

      <div className={styles.block}>
        <h2 className={styles.subtitle}>AsamiWorksが補助金対応のWeb制作に強い理由</h2>
        <ul className={styles.points}>
          <li>専門用語を使わず、<strong>初心者にもわかりやすく説明</strong></li>
          <li>小規模事業者・個人事業主に合わせた<strong>費用対効果重視の提案</strong></li>
          <li>補助金申請に<strong>通りやすい構成・表現</strong>を意識した設計</li>
          <li>ご相談〜構成提案までは<strong>完全無料</strong></li>
        </ul>
      </div>

      <div className={styles.ctaBox}>
        <h3 className={styles.ctaTitle}>補助金を使って、ホームページを制作しませんか？</h3>
        <p className={styles.ctaText}>
          制作だけでなく、<strong>補助金に関するご相談</strong>も承っています。
          まずは無料相談、または簡易見積もりをご利用ください。
        </p>
        <Link href="/estimate" className={styles.ctaButton}>
          簡易お見積もりに進む
        </Link>
      </div>
    </section>
  );
}
