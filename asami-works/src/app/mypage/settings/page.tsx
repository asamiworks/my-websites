'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase-config';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import styles from './page.module.css';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  const [currentEmail, setCurrentEmail] = useState('');
  const [wasInitialPassword, setWasInitialPassword] = useState(false);

  // パスワード変更
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // メールアドレス変更
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/mypage/login');
        return;
      }

      setCurrentEmail(user.email || '');

      // クライアントIDを取得
      const clientsQuery = query(
        collection(db, 'clients'),
        where('authUid', '==', user.uid)
      );
      const clientsSnapshot = await getDocs(clientsQuery);

      if (!clientsSnapshot.empty) {
        const clientData = clientsSnapshot.docs[0].data();
        setClientId(clientsSnapshot.docs[0].id);
        setWasInitialPassword(clientData.hasInitialPassword || false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    // バリデーション
    if (newPassword.length < 8) {
      setPasswordError('新しいパスワードは8文字以上にしてください');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('新しいパスワードが一致しません');
      return;
    }

    // 初回パスワード変更ではない場合、現在のパスワードが必要
    if (!wasInitialPassword && !currentPassword) {
      setPasswordError('現在のパスワードを入力してください');
      return;
    }

    if (!auth.currentUser || !currentEmail) {
      setPasswordError('ログインしてください');
      return;
    }

    setPasswordLoading(true);

    try {
      console.log('[Password Change] Starting password change...', {
        isInitialPassword: wasInitialPassword,
        email: currentEmail,
      });

      // 初回パスワード変更の場合は再認証をスキップ
      // （既にログインできているので、初期パスワードは正しいと判断）
      if (!wasInitialPassword) {
        // 通常のパスワード変更：再認証が必要
        const trimmedPassword = currentPassword.trim();

        console.log('[Password Change] Re-authenticating...', {
          passwordLength: trimmedPassword.length,
          hadWhitespace: currentPassword !== trimmedPassword,
        });

        const credential = EmailAuthProvider.credential(currentEmail, trimmedPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);

        console.log('[Password Change] Re-authentication successful');
      } else {
        console.log('[Password Change] Skipping re-authentication (initial password change)');
      }

      // パスワード更新
      await updatePassword(auth.currentUser, newPassword);

      console.log('[Password Change] Password updated successfully');

      // Firestoreの初期パスワードフラグをfalseに
      if (clientId && wasInitialPassword) {
        await updateDoc(doc(db, 'clients', clientId), {
          hasInitialPassword: false,
          updatedAt: new Date(),
        });
      }

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // 初回パスワード変更の場合はダッシュボードにリダイレクト
      if (wasInitialPassword) {
        setTimeout(() => {
          router.push('/mypage/dashboard?firstLogin=true');
        }, 1500);
      } else {
        // 通常のパスワード変更の場合は3秒後にフラグをリセット
        setTimeout(() => setPasswordSuccess(false), 3000);
      }
    } catch (error: any) {
      console.error('[Password Change] Error:', {
        code: error.code,
        message: error.message,
        fullError: error,
      });

      let errorMessage = 'パスワードの変更に失敗しました';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = '現在のパスワードが正しくありません';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'パスワードが弱すぎます。より複雑なパスワードを使用してください';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'セキュリティのため、再度ログインしてください';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'メールアドレスが無効です';
      } else {
        errorMessage = `パスワードの変更に失敗しました (${error.code || 'unknown'})`;
      }

      setPasswordError(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(false);

    // バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError('有効なメールアドレスを入力してください');
      return;
    }

    if (newEmail === currentEmail) {
      setEmailError('新しいメールアドレスが現在と同じです');
      return;
    }

    if (!auth.currentUser || !currentEmail) {
      setEmailError('ログインしてください');
      return;
    }

    setEmailLoading(true);

    try {
      // 再認証
      const credential = EmailAuthProvider.credential(currentEmail, emailPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // メールアドレス更新
      await updateEmail(auth.currentUser, newEmail);

      // Firestoreも更新
      if (clientId) {
        await updateDoc(doc(db, 'clients', clientId), {
          email: newEmail,
          emailVerified: false,
          updatedAt: new Date(),
        });
      }

      setEmailSuccess(true);
      setCurrentEmail(newEmail);
      setNewEmail('');
      setEmailPassword('');

      // 3秒後にログアウトして再ログインを促す
      setTimeout(async () => {
        alert('メールアドレスを変更しました。セキュリティのため、再度ログインしてください。');
        await signOut(auth);
        router.push('/mypage/login');
      }, 3000);
    } catch (error: any) {
      console.error('Email change error:', error);

      let errorMessage = 'メールアドレスの変更に失敗しました';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'パスワードが正しくありません';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'このメールアドレスは既に使用されています';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '無効なメールアドレスです';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'セキュリティのため、再度ログインしてください';
      }

      setEmailError(errorMessage);
    } finally {
      setEmailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>アカウント設定</h1>
          <p className={styles.subtitle}>パスワードとメールアドレスの変更</p>
        </div>
        <button onClick={() => router.back()} className={styles.backButton}>
          ← 戻る
        </button>
      </header>

      <div className={styles.content}>
        {/* パスワード変更 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>パスワード変更</h2>
          <div className={styles.card}>
            {wasInitialPassword && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fef3c7',
                borderLeft: '4px solid #f59e0b',
                marginBottom: '20px',
                borderRadius: '4px'
              }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
                  🔐 初回ログインです。セキュリティのため、新しいパスワードを設定してください。
                </p>
              </div>
            )}
            <form onSubmit={handlePasswordChange}>
              {/* 初回パスワード変更の場合は現在のパスワードフィールドを非表示 */}
              {!wasInitialPassword && (
                <div className={styles.formGroup}>
                  <label htmlFor="currentPassword" className={styles.label}>
                    現在のパスワード
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={styles.input}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      {showCurrentPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="newPassword" className={styles.label}>
                  新しいパスワード
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.input}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    {showNewPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <p className={styles.hint}>8文字以上で入力してください</p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  新しいパスワード（確認）
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="confirmPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {passwordError && (
                <div className={styles.error}>{passwordError}</div>
              )}

              {passwordSuccess && (
                <div className={styles.success}>
                  パスワードを変更しました！
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className={styles.submitButton}
              >
                {passwordLoading ? '変更中...' : 'パスワードを変更'}
              </button>
            </form>
          </div>
        </section>

        {/* メールアドレス変更 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>メールアドレス変更</h2>
          <div className={styles.card}>
            <div className={styles.currentInfo}>
              <span className={styles.currentLabel}>現在のメールアドレス:</span>
              <span className={styles.currentValue}>{currentEmail}</span>
            </div>

            <form onSubmit={handleEmailChange}>
              <div className={styles.formGroup}>
                <label htmlFor="newEmail" className={styles.label}>
                  新しいメールアドレス
                </label>
                <input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className={styles.input}
                  required
                  autoComplete="email"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="emailPassword" className={styles.label}>
                  現在のパスワード（確認のため）
                </label>
                <input
                  id="emailPassword"
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  className={styles.input}
                  required
                  autoComplete="current-password"
                />
              </div>

              {emailError && (
                <div className={styles.error}>{emailError}</div>
              )}

              {emailSuccess && (
                <div className={styles.success}>
                  メールアドレスを変更しました！再ログインしてください。
                </div>
              )}

              <button
                type="submit"
                disabled={emailLoading}
                className={styles.submitButton}
              >
                {emailLoading ? '変更中...' : 'メールアドレスを変更'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
