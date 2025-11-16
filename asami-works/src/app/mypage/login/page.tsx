'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, updatePassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase-config';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import styles from './page.module.css';

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 初回パスワード変更用
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Firebase Authenticationでログイン
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Firestoreでクライアント情報を取得
      const clientsQuery = query(
        collection(db, 'clients'),
        where('authUid', '==', userCredential.user.uid)
      );
      const clientsSnapshot = await getDocs(clientsQuery);

      if (!clientsSnapshot.empty) {
        const clientData = clientsSnapshot.docs[0].data();
        const hasInitialPassword = clientData.hasInitialPassword || false;

        // 初回ログインの場合、パスワード変更フォームを表示
        if (hasInitialPassword) {
          setClientId(clientsSnapshot.docs[0].id);
          setShowPasswordChange(true);
          setLoading(false);
          return;
        }
      }

      // 通常のログイン：ダッシュボードにリダイレクト
      router.push('/mypage/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);

      // エラーメッセージを日本語化
      let errorMessage = 'ログインに失敗しました';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        errorMessage = 'メールアドレスまたはパスワードが正しくありません';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'このメールアドレスは登録されていません';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'ログイン試行回数が多すぎます。しばらく待ってから再試行してください';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'このアカウントは無効化されています';
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(false);

    // バリデーション
    if (newPassword.length < 8) {
      setPasswordChangeError('新しいパスワードは8文字以上にしてください');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeError('新しいパスワードが一致しません');
      return;
    }

    if (!auth.currentUser || !clientId) {
      setPasswordChangeError('ログイン情報が見つかりません');
      return;
    }

    setPasswordChangeLoading(true);

    try {
      console.log('[Login Password Change] Updating password (no re-auth needed)...');

      // ログイン直後なので再認証不要、直接パスワード更新
      await updatePassword(auth.currentUser, newPassword);

      console.log('[Login Password Change] Password updated successfully');

      // Firestoreの初期パスワードフラグをfalseに
      await updateDoc(doc(db, 'clients', clientId), {
        hasInitialPassword: false,
        updatedAt: new Date(),
      });

      setPasswordChangeSuccess(true);

      // 1.5秒後にダッシュボードにリダイレクト
      setTimeout(() => {
        router.push('/mypage/dashboard?firstLogin=true');
      }, 1500);
    } catch (error: any) {
      console.error('[Login Password Change] Error:', {
        code: error.code,
        message: error.message,
        fullError: error,
      });

      let errorMessage = 'パスワードの変更に失敗しました';
      if (error.code === 'auth/weak-password') {
        errorMessage = 'パスワードが弱すぎます。より複雑なパスワードを使用してください';
      } else if (error.code === 'auth/requires-recent-login' || error.code === 'auth/permission-denied') {
        errorMessage = 'セッションの有効期限が切れました。再度ログインしてください。';
        // 3秒後にページをリロードしてログインフォームに戻る
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        errorMessage = `パスワードの変更に失敗しました (${error.code || 'unknown'})`;
      }

      setPasswordChangeError(errorMessage);
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
      setTimeout(() => {
        setShowResetForm(false);
        setResetSent(false);
        setResetEmail('');
      }, 5000);
    } catch (err: any) {
      console.error('Password reset error:', err);

      let errorMessage = 'パスワードリセットに失敗しました';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'このメールアドレスは登録されていません';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = '無効なメールアドレスです';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Firestoreでクライアント情報を確認
      const clientsQuery = query(
        collection(db, 'clients'),
        where('email', '==', user.email)
      );
      const clientsSnapshot = await getDocs(clientsQuery);

      if (clientsSnapshot.empty) {
        // クライアント情報が見つからない場合
        setError('このGoogleアカウントは登録されていません。管理者にお問い合わせください。');
        await auth.signOut();
        return;
      }

      // クライアントドキュメントにGoogle Auth UIDを保存
      const clientDoc = clientsSnapshot.docs[0];
      const clientData = clientDoc.data();

      // authUidが未設定またはGoogle Auth UIDと異なる場合は更新
      if (!clientData.authUid || clientData.authUid !== user.uid) {
        await updateDoc(doc(db, 'clients', clientDoc.id), {
          authUid: user.uid,
          emailVerified: user.emailVerified,
          updatedAt: new Date()
        });
      }

      // Googleアカウントでログイン成功
      router.push('/mypage/dashboard');
    } catch (err: any) {
      console.error('Google sign-in error:', err);

      let errorMessage = 'Googleログインに失敗しました';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'ログインがキャンセルされました';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'ポップアップがブロックされました。ブラウザの設定を確認してください';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 初回パスワード変更フォーム
  if (showPasswordChange) {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <div className={styles.header}>
            <h1 className={styles.title}>パスワード変更</h1>
            <p className={styles.subtitle}>初回ログインのため、新しいパスワードを設定してください</p>
          </div>

          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fef3c7',
            borderLeft: '4px solid #f59e0b',
            marginBottom: '20px',
            borderRadius: '4px'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
              🔐 セキュリティのため、ログイン後すぐに新しいパスワードを設定してください。
            </p>
          </div>

          {passwordChangeSuccess ? (
            <div className={styles.success}>
              <p>パスワードを変更しました！</p>
              <p className={styles.successSubtext}>ダッシュボードに移動します...</p>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="newPassword" className={styles.label}>
                  新しいパスワード
                </label>
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                  required
                  minLength={8}
                  placeholder="8文字以上"
                  autoComplete="new-password"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  新しいパスワード（確認）
                </label>
                <input
                  id="confirmPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  required
                  minLength={8}
                  placeholder="確認のため再入力"
                  autoComplete="new-password"
                />
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="showNewPasswordLogin"
                    checked={showNewPassword}
                    onChange={(e) => setShowNewPassword(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label
                    htmlFor="showNewPasswordLogin"
                    style={{ fontSize: '14px', cursor: 'pointer', userSelect: 'none' }}
                  >
                    パスワードを表示
                  </label>
                </div>
              </div>

              {passwordChangeError && <div className={styles.error}>{passwordChangeError}</div>}

              <button
                type="submit"
                disabled={passwordChangeLoading}
                className={styles.submitButton}
              >
                {passwordChangeLoading ? '変更中...' : 'パスワードを変更'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (showResetForm) {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>パスワードリセット</h1>

          {resetSent ? (
            <div className={styles.success}>
              <p>パスワードリセット用のメールを送信しました。</p>
              <p className={styles.successSubtext}>メールをご確認ください。</p>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className={styles.form}>
              <p className={styles.description}>
                ご登録のメールアドレスにパスワードリセット用のリンクを送信します。
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="resetEmail" className={styles.label}>
                  メールアドレス
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className={styles.input}
                  required
                  placeholder="your@email.com"
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? '送信中...' : 'リセットメールを送信'}
              </button>

              <button
                type="button"
                onClick={() => setShowResetForm(false)}
                className={styles.backButton}
              >
                ログイン画面に戻る
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h1 className={styles.title}>マイページログイン</h1>
          <p className={styles.subtitle}>AsamiWorks クライアント専用</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              パスワード
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              placeholder="パスワードを入力"
              autoComplete="current-password"
            />
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label
                htmlFor="showPassword"
                style={{ fontSize: '14px', cursor: 'pointer', userSelect: 'none' }}
              >
                パスワードを表示
              </label>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>

          <button
            type="button"
            onClick={() => setShowResetForm(true)}
            className={styles.forgotPassword}
          >
            パスワードをお忘れの方
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>または</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={styles.googleButton}
        >
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'ログイン中...' : 'Googleアカウントでログイン'}
        </button>

        <div className={styles.footer}>
          <p>初めてご利用の方は、メールでお送りした初期パスワードをご使用ください。</p>
        </div>
      </div>
    </div>
  );
}
