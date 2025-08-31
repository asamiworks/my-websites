"use client";

import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.copyright}>株式会社足立電機 ©2025 All Rights Reserved.</p>
        <p className={styles.credit}>
          Website by{" "}
          <a 
            href="https://asami-works.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.creditLink}
          >
            AsamiWorks
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;