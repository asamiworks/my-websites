"use client";

import styles from "./AboutPage.module.css";
import Image from "next/image";
import Link from "next/link";

export default function AboutPageClient() {
  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>なぜ注文住宅で失敗する人が多いのか</h1>
        <p className={styles.subtitle}>
          住宅営業経験者が明かす、家づくりの真実と失敗を防ぐ方法
        </p>
      </div>

      <section className={styles.section}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/iezukuri-image.jpg"
            alt="注文住宅で失敗しない家づくりのイメージ"
            className={styles.image}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <h2 className={styles.subTitle}>家づくりの理想と現実のギャップ</h2>
        <p className={styles.text}>
          一生に一度の大きな買い物「マイホーム」。しかし、注文住宅営業を経験した私たちは、
          初めて家を建てる方と住宅営業マンの間に<span className={styles.highlight}>圧倒的な知識の差</span>がある現実に直面しました。
        </p>
        <p className={styles.text}>
          多くの方が「理想の家づくり」を追い求めるあまり、<strong>予算管理を後回し</strong>にしてしまい、
          結果として毎月の支出が増え、生活に負担がかかるケースが後を絶ちません。
        </p>
      </section>

      <section className={styles.insightSection}>
        <h2 className={styles.subTitle}>営業経験者だから見える「失敗の原因」</h2>
        <div className={styles.insightGrid}>
          <div className={styles.insightCard}>
            <h3 className={styles.insightTitle}>営業トークの真実</h3>
            <p className={styles.insightText}>
              「今だけ特別価格」「あと1棟で終了」「期間限定キャンペーン」これらは全て契約を急がせるための常套手段です
            </p>
          </div>
          <div className={styles.insightCard}>
            <h3 className={styles.insightTitle}>隠れたコストの存在</h3>
            <p className={styles.insightText}>
              初期見積もりには地盤改良費、外構費、諸費用が含まれていないことが多く、最終的に500万円以上増えることも
            </p>
          </div>
          <div className={styles.insightCard}>
            <h3 className={styles.insightTitle}>感情に訴える営業手法</h3>
            <p className={styles.insightText}>
              モデルハウスの豪華さ、営業マンの人柄で判断させ、冷静な比較検討をさせない仕組みが確立されています
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subTitle}>実際に起こる「家づくりの失敗」パターン</h2>
        <p className={styles.text}>
          住宅営業として働く中で、以下のような失敗を何度も目にしてきました：
        </p>
        <ul className={styles.problemList}>
          <li className={styles.problemItem}>
            <strong>知識不足による判断ミス</strong>
            <p>建築基準法、住宅ローン、土地の制限...初めての方には難しすぎる専門知識。結果、営業マンの言いなりに</p>
          </li>
          <li className={styles.problemItem}>
            <strong>「せっかくだから」の積み重ね</strong>
            <p>床暖房、太陽光、高級キッチン...気づけば予算を1000万円以上オーバー。月々の返済が家計を圧迫</p>
          </li>
          <li className={styles.problemItem}>
            <strong>展示場マジックにかかる</strong>
            <p>豪華なモデルハウスに心を奪われ、現実的な判断ができない。実際の家とのギャップに後悔</p>
          </li>
          <li className={styles.problemItem}>
            <strong>比較検討の不足</strong>
            <p>最初に行った会社で契約。後から「他にも良い会社があった」「もっと安くできた」と気づく</p>
          </li>
        </ul>
      </section>

      <section className={styles.missionSection}>
        <h2 className={styles.subTitle}>私たちが提供する「失敗しない」サポート</h2>
        <p className={styles.text}>
          このような失敗を防ぎたい。その想いから、マイホームスターターは
          <span className={styles.highlight}>「営業経験者だから提供できる本当のアドバイス」</span>をお届けします。
        </p>
        
        <div className={styles.serviceGrid}>
          <div className={styles.serviceCard}>
            <h3 className={styles.serviceTitle}>
              <span className={styles.serviceNumber}>01</span>
              総予算シミュレータ（無料）
            </h3>
            <p className={styles.serviceText}>
              展示場に行く前に必須！年収だけでなく、生活費や将来の支出を考慮した「本当の適正予算」を診断。
              営業マンが教えてくれない現実的な数字で、予算オーバーを防ぎます。
            </p>
          </div>
          <div className={styles.serviceCard}>
            <h3 className={styles.serviceTitle}>
              <span className={styles.serviceNumber}>02</span>
              営業トークの見抜き方
            </h3>
            <p className={styles.serviceText}>
              「今だけ」は嘘？「特別価格」の裏側は？契約を急がせる手法、感情に訴える営業トークの真実を解説。
              冷静な判断ができるよう、プロの視点でサポートします。
            </p>
          </div>
          <div className={styles.serviceCard}>
            <h3 className={styles.serviceTitle}>
              <span className={styles.serviceNumber}>03</span>
              失敗しない会社選び
            </h3>
            <p className={styles.serviceText}>
              大手ハウスメーカー、地域工務店、ローコスト住宅...それぞれの本当のメリット・デメリットを解説。
              あなたの優先順位に合った選び方を、営業目線ではなくお客様目線でアドバイスします。
            </p>
          </div>
        </div>
      </section>

      <section className={styles.founderSection}>
        <h2 className={styles.subTitle}>運営者からのメッセージ</h2>
        <div className={styles.founderContent}>
          <p className={styles.founderText}>
            私たちは注文住宅営業として、多くのお客様の家づくりに携わってきました。
            その中で痛感したのは、<strong>「情報格差が失敗を生む」</strong>という現実です。
          </p>
          <p className={styles.founderText}>
            営業成績も大切でしたが、それ以上に「お客様が本当に幸せになる家づくり」を
            実現したいという想いが日に日に強くなりました。
          </p>
          <p className={styles.founderText}>
            マイホームスターターは、営業側ではなく<strong>お客様側に立った情報提供</strong>を行います。
            展示場に行く前に、ぜひ一度無料診断をお試しください。
            失敗しない家づくりの第一歩を、一緒に踏み出しましょう。
          </p>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>展示場に行く前に、3分で適正予算を診断</h2>
        <p className={styles.ctaText}>
          営業マンに会う前に知っておくべき「本当の予算」を無料診断。
          失敗しない家づくりは、ここから始まります。
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/start-home-building" className={styles.primaryButton}>
            無料診断を始める（営業電話なし）
          </Link>
          <Link href="/Housing-concierge" className={styles.secondaryButton}>
            詳しいサービス内容を見る
          </Link>
        </div>
      </section>
    </div>
  );
}