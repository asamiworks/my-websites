"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/FloatingContact.module.css";

export default function FloatingContact() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const target = document.getElementById("cta-anchor"); // CTAセクションのアンカー

    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShow(!entry.isIntersecting); // CTAが見えてたら非表示
      },
      { rootMargin: "0px", threshold: 0.1 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  if (!show) return null;

  return (
    <div className={styles.floating}>
      <Link href="/form" className={styles.button}>
        お問い合わせ
      </Link>
    </div>
  );
}