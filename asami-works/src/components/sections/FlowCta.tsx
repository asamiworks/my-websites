"use client";

import Link from "next/link";
import styles from "./FlowCta.module.css";

export default function FlowCta() {
  return (
    <section className={styles.ctaSection}>
      <h3 className={styles.ctaTitle}>WEBサイト制作会社をお探しの方へ</h3>
      <p className={styles.ctaText}>
        作りたいサイトの内容を答えるだけで、AsamiWorksで依頼した時の費用感がわかります。<br />
        ぜひ「簡易お見積もり」をご利用ください。
      </p>
      <Link href="/estimate" className={styles.ctaButton}>
        簡易お見積もりに進む
      </Link>
    </section>
  );
}
