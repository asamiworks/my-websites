"use client";

import styles from "./HousingConcierge.module.css";
import Link from "next/link";

const HousingConciergeClient = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>注文住宅で失敗しない家づくりアドバイス</h1>
        <p className={styles.subtitle}>
          営業経験者だから知っている「家づくりの落とし穴」を回避。
          総予算シミュレータで、展示場に行く前に適正予算を無料診断。
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>こんな失敗、していませんか？</h2>
        <div className={styles.problemGrid}>
          <div className={styles.problemCard}>
            <h3 className={styles.problemTitle}>営業トークに流される</h3>
            <p className={styles.problemText}>
              「今だけ特別価格」「あと1棟」という言葉に焦って契約。冷静な判断ができずに後悔
            </p>
          </div>
          <div className={styles.problemCard}>
            <h3 className={styles.problemTitle}>予算オーバーが止まらない</h3>
            <p className={styles.problemText}>
              「せっかくだから」の積み重ねで、気づけば当初予算を大幅超過。月々の支払いが苦しい
            </p>
          </div>
          <div className={styles.problemCard}>
            <h3 className={styles.problemTitle}>土地選びで失敗</h3>
            <p className={styles.problemText}>
              建築制限や地盤の問題を見落とし、追加費用が発生。理想の家が建てられない
            </p>
          </div>
          <div className={styles.problemCard}>
            <h3 className={styles.problemTitle}>会社選びを間違える</h3>
            <p className={styles.problemText}>
              表面的な印象で決めてしまい、施工品質や対応に不満。建築中のトラブルが絶えない
            </p>
          </div>
        </div>
      </section>

      <section className={styles.featureSection}>
        <h2 className={styles.sectionTitle}>営業経験者が教える「失敗しない」4つのポイント</h2>
        <p className={styles.leadText}>
          住宅営業の裏側を知る私たちだからこそ、本当に必要なアドバイスができます。
        </p>
        
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>1. まず総予算を正確に把握</h3>
            <p className={styles.featureText}>
              年収だけでなく、生活費や将来の支出を考慮した「本当の適正予算」を診断。営業マンが言わない現実的な数字をお伝えします。
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>2. 営業トークの真実を見抜く</h3>
            <p className={styles.featureText}>
              「今だけ」は本当か？「特別価格」の裏側は？契約を急がせる手法の真実を解説。冷静な判断をサポートします。
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>3. 隠れたコストを事前に把握</h3>
            <p className={styles.featureText}>
              地盤改良、外構、諸費用...見積もりに含まれない費用を洗い出し。予算オーバーを未然に防ぎます。
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>4. 会社選びの本質を理解</h3>
            <p className={styles.featureText}>
              大手・工務店・ローコストの本当の違いとは？あなたの優先順位に合った選び方を指南します。
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>無料診断で失敗を防ぐ4ステップ</h2>
        <div className={styles.stepContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>総予算シミュレータで診断</h3>
              <p className={styles.stepText}>
                5分の簡単入力で、無理のない予算を算出。展示場に行く前に知るべき数字
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>診断結果と改善アドバイス</h3>
              <p className={styles.stepText}>
                予算内で実現可能な家づくりプランを提案。優先順位の付け方もアドバイス
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>失敗しない計画づくり</h3>
              <p className={styles.stepText}>
                土地選びのチェックポイント、会社選びの基準など、具体的な行動指針を提供
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>継続的なサポート</h3>
              <p className={styles.stepText}>
                契約前の見積もりチェックなど、各段階で必要なアドバイスを継続提供
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.whyFreeSection}>
        <h2 className={styles.sectionTitle}>なぜ無料？営業電話なし？</h2>
        <div className={styles.whyFreeContent}>
          <p className={styles.text}>
            住宅営業時代、知識不足で失敗する方を多く見てきました。
            「もっと早く正しい情報を知っていれば...」という後悔の声を減らしたい。
          </p>
          <p className={styles.text}>
            将来的には有料コンサルティングも検討していますが、まずは多くの方に
            「失敗しない家づくりの知識」を届けることを優先しています。
            営業電話は一切ありません。安心してご利用ください。
          </p>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>展示場に行く前に、まず無料診断を</h2>
        <p className={styles.ctaText}>
          総予算シミュレータで適正予算を把握。失敗しない家づくりの第一歩を踏み出しましょう。
          もちろん営業電話は一切ありません。
        </p>
        <Link href="/start-home-building" className={styles.ctaButton}>
          今すぐ無料診断を始める（5分）
        </Link>
      </section>
    </div>
  );
};

export default HousingConciergeClient;