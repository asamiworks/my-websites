"use client";

import Link from "next/link";
import styles from "../styles/CTA.module.css";
import { useEffect, useState } from "react";

export default function CTA({ floating = false }: { floating?: boolean }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!floating) return;

    const target = document.getElementById("cta-anchor");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHidden(entry.isIntersecting); // CTAが見えてたら「非表示状態にする」
      },
      { threshold: 0.1 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [floating]);

  return (
    <section
      id={!floating ? "cta-anchor" : undefined}
      className={`${styles.cta} ${floating ? styles.floatingCta : ""} ${hidden ? styles.hide : ""}`}
    >
      {!floating && (
        <>
          <h2 className={styles.title}>ご相談・お問い合わせはこちらから</h2>
          <p className={styles.text}>
            ご家族やご自身のご供養について、どんなことでもお気軽にご相談ください。
          </p>
        </>
      )}
      <Link href="/form" className={styles.button}>
        お問い合わせフォームへ
      </Link>
    </section>
  );
}
