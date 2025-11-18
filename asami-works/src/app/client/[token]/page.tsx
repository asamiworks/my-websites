'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function DeprecatedTokenPage() {
  const router = useRouter();

  useEffect(() => {
    // 5秒後に自動的にログインページへリダイレクト
    const timer = setTimeout(() => {
      router.push('/client/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.deprecationContainer}>
      <div className={styles.deprecationCard}>
        <div className={styles.iconContainer}>
          <span className={styles.icon}>⚠️</span>
        </div>

        <h1 className={styles.deprecationTitle}>
          マイページのアクセス方法が変更されました
        </h1>

        <div className={styles.deprecationContent}>
          <p className={styles.deprecationText}>
            セキュリティ向上のため、マイページへのアクセス方法が変更されました。
          </p>

          <div className={styles.infoBox}>
            <h2 className={styles.infoTitle}>新しいアクセス方法</h2>
            <ul className={styles.infoList}>
              <li>メールアドレスとパスワードでログインが必要です</li>
              <li>ログイン情報はメールで送信されています</li>
              <li>メールが届いていない場合は、管理者にお問い合わせください</li>
            </ul>
          </div>

          <p className={styles.redirectNote}>
            5秒後に自動的にログインページへ移動します...
          </p>

          <button
            className={styles.loginButton}
            onClick={() => router.push('/client/login')}
          >
            今すぐログインページへ移動
          </button>
        </div>

        <div className={styles.contactInfo}>
          <p className={styles.contactText}>
            ご不明な点がございましたら、
            <a href="mailto:admin@asami-works.com" className={styles.contactLink}>
              admin@asami-works.com
            </a>
            までお問い合わせください。
          </p>
        </div>
      </div>
    </div>
  );
}
