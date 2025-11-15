'use client';

import { useState } from 'react';
import styles from './StripeSetupButton.module.css';

interface StripeSetupButtonProps {
  clientId: string;
  clientName: string;
  disabled?: boolean;
}

export default function StripeSetupButton({ clientId, clientName, disabled }: StripeSetupButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetup = async () => {
    try {
      setLoading(true);
      setError(null);

      // Checkoutセッションを作成
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'セッション作成に失敗しました');
      }

      // Stripe決済ページにリダイレクト
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('決済URLが取得できませんでした');
      }
    } catch (err: any) {
      console.error('Stripe setup error:', err);
      setError(err.message || 'エラーが発生しました');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={handleSetup}
        disabled={disabled || loading}
      >
        {loading ? (
          <>
            <span className={styles.spinner}></span>
            処理中...
          </>
        ) : (
          <>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Stripe決済設定
          </>
        )}
      </button>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
