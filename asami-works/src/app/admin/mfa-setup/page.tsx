'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import styles from './page.module.css';

const ADMIN_EMAIL = 'admin@asami-works.com';

export default function MfaSetupPage() {
  const { user, loading: authLoading, isMfaEnabled, enrollMfa, verifyMfaEnrollment } = useAuth();
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'start' | 'scan' | 'verify' | 'complete'>('start');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
      return;
    }

    if (!authLoading && user && user.email !== ADMIN_EMAIL) {
      router.push('/');
      return;
    }

    // 既にMFAが有効な場合
    if (!authLoading && user && isMfaEnabled()) {
      setStep('complete');
    }
  }, [user, authLoading, router, isMfaEnabled]);

  const handleStartEnrollment = async () => {
    try {
      setLoading(true);
      setError(null);

      const { qrCodeUrl, secret } = await enrollMfa('TOTP Device');
      setQrCodeUrl(qrCodeUrl);
      setSecret(secret);
      setStep('scan');
    } catch (err: any) {
      console.error('Enrollment error:', err);
      setError('二段階認証の設定開始に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      setError('6桁の認証コードを入力してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await verifyMfaEnrollment(verificationCode, secret);
      setStep('complete');
    } catch (err: any) {
      console.error('Verification error:', err);
      setError('認証コードが正しくありません');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className={styles.pageWrapper}>
        <AdminNav />
        <div className={styles.container}>
          <div className={styles.loading}>読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <AdminNav />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>二段階認証設定</h1>
          <p className={styles.subtitle}>
            セキュリティを強化するため、Google Authenticatorなどの認証アプリを使用します
          </p>
        </div>

        <div className={styles.content}>
          {/* ステップ1: 開始 */}
          {step === 'start' && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>二段階認証の設定を開始</h2>
              <p className={styles.cardDescription}>
                アカウントのセキュリティを強化するため、二段階認証を設定することを推奨します。
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🔒</span>
                  <span>不正ログインを防止</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>📱</span>
                  <span>認証アプリで6桁コードを生成</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✅</span>
                  <span>Stripe決済導入に必要</span>
                </div>
              </div>
              <button
                className={styles.primaryButton}
                onClick={handleStartEnrollment}
                disabled={loading}
              >
                {loading ? '設定中...' : '設定を開始'}
              </button>
            </div>
          )}

          {/* ステップ2: QRコードスキャン */}
          {step === 'scan' && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>認証アプリでQRコードをスキャン</h2>
              <div className={styles.qrCodeSection}>
                <div className={styles.qrCodeContainer}>
                  <img src={qrCodeUrl} alt="QR Code" className={styles.qrCode} />
                </div>
                <div className={styles.instructions}>
                  <h3>手順:</h3>
                  <ol className={styles.stepsList}>
                    <li>Google Authenticatorまたは他の認証アプリを開く</li>
                    <li>「+」ボタンをタップして「QRコードをスキャン」を選択</li>
                    <li>上記のQRコードをスキャン</li>
                    <li>アプリに表示される6桁のコードを入力</li>
                  </ol>
                  {secret && (
                    <div className={styles.secretKey}>
                      <p>
                        <strong>手動入力用キー:</strong>
                      </p>
                      <code>{secret}</code>
                    </div>
                  )}
                </div>
              </div>
              <button
                className={styles.primaryButton}
                onClick={() => setStep('verify')}
              >
                次へ
              </button>
            </div>
          )}

          {/* ステップ3: 検証コード入力 */}
          {step === 'verify' && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>認証コードを入力</h2>
              <p className={styles.cardDescription}>
                認証アプリに表示されている6桁のコードを入力してください
              </p>

              {error && <div className={styles.error}>{error}</div>}

              <form onSubmit={handleVerifyCode} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="code" className={styles.label}>
                    6桁の認証コード
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={styles.input}
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="off"
                  />
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => setStep('scan')}
                    disabled={loading}
                  >
                    戻る
                  </button>
                  <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={loading || verificationCode.length !== 6}
                  >
                    {loading ? '検証中...' : '検証'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ステップ4: 完了 */}
          {step === 'complete' && (
            <div className={styles.card}>
              <div className={styles.successIcon}>✅</div>
              <h2 className={styles.cardTitle}>二段階認証が有効になりました</h2>
              <p className={styles.cardDescription}>
                アカウントのセキュリティが強化されました。次回ログイン時から認証コードが必要になります。
              </p>
              <button
                className={styles.primaryButton}
                onClick={() => router.push('/admin/clients')}
              >
                管理画面に戻る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
