"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <div className={styles.headerWrapper}> {/* ← 背景用：幅100% */}
  <header className={styles.header}>     {/* ← 中身用：幅1200px */}
    <div className={styles.left}>
      <Link href="/">
        <Image
          src="/images/logo.png"
          alt="茨城メモリアルパーク ロゴ"
          width={240}
          height={60}
        />
      </Link>
    </div>

    <div className={styles.infoAndButton}>
      <div className={styles.contactInfo}>
        神宮寺 029-862-2224 ／（有）カツミ石材 090-3068-5360<br />
        電話受付日時/土日 9:00〜12:00
      </div>
      <Link href="/form" className={styles.contactButton}>
        お問い合わせ
      </Link>
    </div>
  </header>
</div>

  );
}


