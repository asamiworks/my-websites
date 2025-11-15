'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import styles from './page.module.css';

const ADMIN_EMAIL = 'admin@asami-works.com';

// ログインフォームコンポーネント（reCAPTCHAフックを使用）
function LoginForm() {
  const { user, signInWithGoogle, loading: authLoading, mfaResolver, verifyMfaLogin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [showMfaInput, setShowMfaInput] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    if (!authLoading && user) {
      // 既にログイン済みの場合
      if (user.email === ADMIN_EMAIL) {
        // ログイン通知を送信
        sendLoginNotification(user.email);
        router.push('/admin/clients');
      } else {
        // 管理者以外はサインアウト
        setError('管理者アカウントでログインしてください');
      }
    }

    // MFAが必要な場合
    if (mfaResolver) {
      setShowMfaInput(true);
      setLoading(false);
    }
  }, [user, authLoading, router, mfaResolver]);

  const sendLoginNotification = async (email: string) => {
    try {
      const loginTime = new Date().toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      await fetch('/api/send-login-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          loginTime,
          userAgent: navigator.userAgent,
        }),
      });
    } catch (err) {
      console.error('Failed to send login notification:', err);
      // エラーでもログインは継続
    }
  };

  const handleGoogleLogin = async () => {
    if (!executeRecaptcha) {
      setError('reCAPTCHAの読み込みに失敗しました');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // reCAPTCHAトークンを取得
      const token = await executeRecaptcha('login');

      // reCAPTCHAトークンをサーバーサイドで検証
      const verifyResponse = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        setError('セキュリティ検証に失敗しました');
        setLoading(false);
        return;
      }

      // reCAPTCHA検証成功後、Googleログイン
      await signInWithGoogle();

      // signInWithGoogle完了後、userはuseEffectで処理される
    } catch (err: any) {
      console.error('Login error:', err);
      // MFAが必要な場合は、setShowMfaInputがuseEffectで処理される
      if (err.code !== 'auth/multi-factor-auth-required') {
        setError('ログインに失敗しました');
        setLoading(false);
      }
    }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mfaCode || mfaCode.length !== 6) {
      setError('6桁の認証コードを入力してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await verifyMfaLogin(mfaCode);

      // MFA検証成功後、userはuseEffectで処理される
    } catch (err: any) {
      console.error('MFA verification error:', err);
      setError('認証コードが正しくありません');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <h1 className={styles.title}>
          {showMfaInput ? '二段階認証' : '管理者ログイン'}
        </h1>
        <p className={styles.subtitle}>
          {showMfaInput
            ? '認証アプリに表示されているコードを入力してください'
            : 'Googleアカウントでログインしてください'}
        </p>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {/* MFA入力フォーム */}
        {showMfaInput ? (
          <form onSubmit={handleMfaVerify} className={styles.mfaForm}>
            <input
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className={styles.mfaInput}
              placeholder="000000"
              maxLength={6}
              autoComplete="off"
              autoFocus
            />
            <button
              type="submit"
              className={styles.googleButton}
              disabled={loading || mfaCode.length !== 6}
            >
              {loading ? '検証中...' : '検証'}
            </button>
          </form>
        ) : (
          <button
            className={styles.googleButton}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
          <svg
            className={styles.googleIcon}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>
            {loading ? 'ログイン中...' : 'Googleでログイン'}
          </span>
        </button>
        )}
      </div>
    </div>
  );
}

// 外側のコンポーネント（GoogleReCaptchaProviderでラップ）
export default function AdminLoginPage() {
  const reCaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!reCaptchaSiteKey) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          reCAPTCHAの設定が完了していません
        </div>
      </div>
    );
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaSiteKey}>
      <LoginForm />
    </GoogleReCaptchaProvider>
  );
}
