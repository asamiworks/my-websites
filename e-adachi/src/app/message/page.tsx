"use client";

import styles from "./Message.module.css";

export default function MessagePage() {
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.pageTitle}>代表挨拶</h1>
        <div className={styles.titleDecoration}></div>
      </div>

      <section className={styles.messageSection}>
        <div className={styles.messageContent}>
          <div className={styles.quoteIcon}>&ldquo;</div>
          
          <div className={styles.messageBody}>
            <p className={styles.lead}>
              地域の明日を、確かな技術で支える
            </p>
            
            <p className={styles.paragraph}>
            平素より格別のご高配を賜り、誠にありがとうございます。
            </p>
            
            <p className={styles.paragraph}>
            当社は1940年の創業以来、地域に根ざした電気工事業として、お客様の暮らしと産業の基盤を支えてまいりました。
            </p>
            
            <p className={styles.paragraph}>
            創業者の信念である「誠実な仕事を通じて社会に貢献する」という想いを受け継ぎ、長年にわたり信頼と実績を積み重ねてまいりました。
            </p>
            
            <p className={styles.paragraph}>
            近年、エネルギーの多様化や技術の進化が急速に進む中で、私たちは従来の工事業務にとどまらず、省エネ設備の導入支援や再生可能エネルギーの提案など、新たな取り組みにも力を入れております。
            </p>
            
            <p className={styles.paragraph}>
            これからも「安全・確実・丁寧」をモットーに、地域社会の発展とお客様の安心に貢献してまいります。今後とも変わらぬご支援、ご愛顧を賜りますようお願い申し上げます。
            </p>
          </div>

          <div className={styles.signature}>
            <div className={styles.signatureTitle}>
              株式会社足立電機
            </div>
            <div className={styles.signatureName}>
              代表取締役
              <span className={styles.presidentName}>足立 顕徳</span>
            </div>
          </div>
        </div>
      </section>

      {/* 会社の歴史・実績セクション */}
      <section className={styles.historySection}>
        <h2 className={styles.historySectionTitle}>会社沿革</h2>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.year}>昭和15年1月</div>
            <div className={styles.event}>足立ラジオ店 設立</div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.year}>昭和47年8月</div>
            <div className={styles.event}>有限会社足立電機商会 設立</div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.year}>昭和53年7月</div>
            <div className={styles.event}>代表取締役 足立彬</div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.year}>平成16年2月</div>
            <div className={styles.event}>代表取締役 足立顕徳</div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.year}>平成18年4月</div>
            <div className={styles.event}>城ノ内事務所設立</div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.year}>平成23年8月</div>
            <div className={styles.event}>商号変更 株式会社足立電機</div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.year}>令和3年9月</div>
            <div className={styles.event}>本社移転</div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.year}>現在</div>
            <div className={styles.event}></div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className={styles.ctaSection}>
        <p className={styles.ctaText}>
          法人様向けの電気工事・設備工事に関するご相談はお気軽にお問い合わせください
        </p>
        <a 
          href="https://jh-ad.jp/contact/form.html" 
          className={styles.ctaButton}
          target="_blank" 
          rel="noopener noreferrer"
        >
          お問い合わせフォーム
        </a>
      </section>
    </main>
  );
}