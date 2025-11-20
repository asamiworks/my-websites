'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Client } from '@/types/invoice';
import CardRegistrationForm from '@/components/mypage/CardRegistrationForm';
import styles from './page.module.css';

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [currentEmail, setCurrentEmail] = useState('');
  const [wasInitialPassword, setWasInitialPassword] = useState(false);

  // カード関連
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDeleteLoading, setCardDeleteLoading] = useState(false);

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
        router.push('/client/login');
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
        const clientData = {
          id: clientsSnapshot.docs[0].id,
          ...clientsSnapshot.docs[0].data()
        } as Client;
        setClientId(clientsSnapshot.docs[0].id);
        setClient(clientData);
        setWasInitialPassword(clientData.hasInitialPassword || false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // registerCardパラメータがある場合はカードフォームを表示
  useEffect(() => {
    if (!loading && searchParams.get('registerCard') === 'true') {
      setShowCardForm(true);
    }
  }, [loading, searchParams]);

  const handleCardRegistrationSuccess = async () => {
    setShowCardForm(false);
    // クライアント情報を再読み込み
    if (auth.currentUser) {
      const clientsQuery = query(
        collection(db, 'clients'),
        where('authUid', '==', auth.currentUser.uid)
      );
      const clientsSnapshot = await getDocs(clientsQuery);
      if (!clientsSnapshot.empty) {
        const clientData = {
          id: clientsSnapshot.docs[0].id,
          ...clientsSnapshot.docs[0].data()
        } as Client;
        setClient(clientData);
      }
    }
  };

  const handleDeleteCard = async () => {
    if (!client || !clientId) return;

    const confirmed = confirm(
      `登録済みのカード情報を削除しますか？\n\n${client.cardBrand?.toUpperCase() || 'カード'} **** ${client.cardLast4 || '****'}\n\n削除すると、今後の請求書は自動決済されなくなります。`
    );

    if (!confirmed) return;

    setCardDeleteLoading(true);

    try {
      const response = await fetch('/api/stripe/delete-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'カード情報の削除に失敗しました');
      }

      alert('カード情報を削除しました');

      // クライアント情報を再読み込み
      if (auth.currentUser) {
        const clientsQuery = query(
          collection(db, 'clients'),
          where('authUid', '==', auth.currentUser.uid)
        );
        const clientsSnapshot = await getDocs(clientsQuery);
        if (!clientsSnapshot.empty) {
          const clientData = {
            id: clientsSnapshot.docs[0].id,
            ...clientsSnapshot.docs[0].data()
          } as Client;
          setClient(clientData);
        }
      }
    } catch (error: any) {
      console.error('Error deleting card:', error);
      alert(error.message || 'カード情報の削除に失敗しました');
    } finally {
      setCardDeleteLoading(false);
    }
  };

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
      // 初回パスワード変更の場合は再認証をスキップ
      // （既にログインできているので、初期パスワードは正しいと判断）
      if (!wasInitialPassword) {
        // 通常のパスワード変更：再認証が必要
        const trimmedPassword = currentPassword.trim();
        const credential = EmailAuthProvider.credential(currentEmail, trimmedPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      // パスワード更新
      await updatePassword(auth.currentUser, newPassword);

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
          router.push('/client/dashboard?firstLogin=true');
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

      // requires-recent-login または permission-denied の場合は再ログインが必要
      if (error.code === 'auth/requires-recent-login' || error.code === 'auth/permission-denied') {
        alert('セキュリティのため、再度ログインしてください。');
        await signOut(auth);
        router.push('/client/login?reason=session-expired');
        return;
      }

      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = '現在のパスワードが正しくありません';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'パスワードが弱すぎます。より複雑なパスワードを使用してください';
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
        router.push('/client/login');
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
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={styles.input}
                    required
                    autoComplete="current-password"
                  />
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      id="showCurrentPassword"
                      checked={showCurrentPassword}
                      onChange={(e) => setShowCurrentPassword(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <label
                      htmlFor="showCurrentPassword"
                      style={{ fontSize: '14px', cursor: 'pointer', userSelect: 'none' }}
                    >
                      パスワードを表示
                    </label>
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
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
                  autoComplete="new-password"
                />
                <p className={styles.hint}>8文字以上で入力してください</p>
              </div>

              <div className={styles.formGroup}>
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
                  autoComplete="new-password"
                />
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="showNewPassword"
                    checked={showNewPassword}
                    onChange={(e) => setShowNewPassword(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label
                    htmlFor="showNewPassword"
                    style={{ fontSize: '14px', cursor: 'pointer', userSelect: 'none' }}
                  >
                    新しいパスワードを表示
                  </label>
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

        {/* クレジットカード設定 */}
        {client && client.paymentMethod === 'credit_card' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>クレジットカード設定</h2>
            <div className={styles.card}>
              {!showCardForm && client.stripePaymentMethodId ? (
                <div>
                  <div className={styles.currentInfo}>
                    <span className={styles.currentLabel}>登録済みカード:</span>
                    <span className={styles.currentValue}>
                      {client.cardBrand?.toUpperCase() || 'カード'} **** {client.cardLast4 || '****'}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                    ✓ 請求書が発行されると自動的に決済されます
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      className={styles.submitButton}
                      onClick={() => setShowCardForm(true)}
                    >
                      カードを変更
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={handleDeleteCard}
                      disabled={cardDeleteLoading}
                    >
                      {cardDeleteLoading ? '削除中...' : 'カードを削除'}
                    </button>
                  </div>
                </div>
              ) : !showCardForm ? (
                <div>
                  <p style={{ marginBottom: '12px', color: '#666' }}>
                    クレジットカードが未登録です
                  </p>
                  <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
                    カードを登録すると、請求書が発行された際に自動的に決済されます
                  </p>
                  <button
                    className={styles.submitButton}
                    onClick={() => setShowCardForm(true)}
                  >
                    クレジットカードを登録
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setShowCardForm(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      padding: '8px 0',
                      marginBottom: '16px',
                      fontSize: '14px'
                    }}
                  >
                    ← 戻る
                  </button>
                  <CardRegistrationForm
                    clientId={client.id!}
                    onSuccess={handleCardRegistrationSuccess}
                  />
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className={styles.container}><div className={styles.loading}>読み込み中...</div></div>}>
      <SettingsContent />
    </Suspense>
  );
}
