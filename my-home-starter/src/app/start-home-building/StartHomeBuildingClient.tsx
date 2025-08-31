"use client";

import Link from "next/link";
import styles from "./StartHomeBuildingPage.module.css";

export default function StartHomeBuildingClient() {
  return (
    <div className={styles.container}>
      {/* ヒーローセクション */}
      <section className={styles.heroSection}>
        <h1 className={styles.title}>
          家づくりの総予算を<br />
          <span className={styles.highlight}>3分で無料診断</span>
        </h1>
        <p className={styles.subtitle}>
          展示場に行く前に必ず診断してください
        </p>
      </section>

      {/* 警告メッセージ */}
      <section className={styles.warningSection}>
        <div className={styles.warningBox}>
          <h2 className={styles.warningTitle}>⚠️ ご存知ですか？</h2>
          <p className={styles.warningText}>
            注文住宅で失敗する原因の<strong>第1位は「予算オーバー」</strong>です。
            営業マンの「大丈夫です」を信じて契約し、後悔する方が後を絶ちません。
          </p>
        </div>
      </section>

      {/* なぜ必要か */}
      <section className={styles.whySection}>
        <h2 className={styles.sectionTitle}>
          なぜ展示場の前に診断が必要？
        </h2>
        <div className={styles.reasonGrid}>
          <div className={styles.reasonCard}>
            <h3 className={styles.reasonTitle}>営業トークの罠</h3>
            <p className={styles.reasonText}>
              「月々〇万円なら大丈夫」「皆さんこれくらいです」
              という営業トークで、気づけば予算を100万円超過
            </p>
          </div>
          <div className={styles.reasonCard}>
            <h3 className={styles.reasonTitle}>隠れたコストの存在</h3>
            <p className={styles.reasonText}>
              地盤改良費、外構費、諸費用など、
              後から300万円以上追加になることも
            </p>
          </div>
          <div className={styles.reasonCard}>
            <h3 className={styles.reasonTitle}>感情的な判断</h3>
            <p className={styles.reasonText}>
              豪華な展示場で舞い上がり、
              冷静な予算判断ができなくなる
            </p>
          </div>
        </div>
      </section>

      {/* シミュレーターの特徴 */}
      <section className={styles.featureSection}>
        <h2 className={styles.sectionTitle}>
          営業経験者が作った<br />
          本当に使えるシミュレーター
        </h2>
        <div className={styles.featureList}>
          <div className={styles.featureItem}>
            <div className={styles.featureNumber}>01</div>
            <div className={styles.featureContent}>
              <h3>年収だけでなく生活費も考慮</h3>
              <p>子供の教育費、老後資金など、将来の支出も含めて計算</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureNumber}>02</div>
            <div className={styles.featureContent}>
              <h3>隠れたコストも全て算出</h3>
              <p>諸費用、外構、地盤改良など、見落としがちな費用も計算</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureNumber}>03</div>
            <div className={styles.featureContent}>
              <h3>営業電話は一切なし</h3>
              <p>個人情報の入力不要。安心して何度でも診断可能</p>
            </div>
          </div>
        </div>
      </section>

      {/* 診断の流れ */}
      <section className={styles.processSection}>
        <h2 className={styles.sectionTitle}>たった3分の簡単診断</h2>
        <div className={styles.stepGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h3>基本情報の入力</h3>
            <p>年収・貯蓄額など</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h3>生活費の確認</h3>
            <p>現在と将来の支出</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h3>診断結果</h3>
            <p>適正な総予算を表示</p>
          </div>
        </div>
      </section>

      {/* 実績・信頼性 */}
      <section className={styles.trustSection}>
        <div className={styles.trustContent}>
          <h2 className={styles.trustTitle}>
            注文住宅営業経験者が運営
          </h2>
          <p className={styles.trustText}>
            私たちは住宅営業として、予算オーバーで苦しむお客様を多く見てきました。
            「もっと早く正しい予算を知っていれば...」という後悔を無くしたい。
            その想いで、このシミュレーターを無料提供しています。
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>
          展示場で失敗する前に<br />
          まず適正予算を把握しましょう
        </h2>
        <p className={styles.ctaSubtext}>
          完全無料・営業電話なし・3分で診断完了
        </p>
        <Link href="/start-home-building/total-budget" className={styles.ctaButton}>
          今すぐ無料で総予算を診断する
        </Link>
        <p className={styles.ctaNote}>
          ※メールアドレスの入力も不要です
        </p>
      </section>
    </div>
  );
}