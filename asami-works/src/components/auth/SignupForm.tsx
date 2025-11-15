"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import GoogleAuthButton from './GoogleAuthButton';
import styles from './SignupForm.module.css';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUpWithEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    if (password.length < 8) {
      return;
    }

    try {
      setLoading(true);
      await signUpWithEmail(email, password, name, phone);
      setSuccess(true);
      // フォームをリセット
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      // エラーはAuthContextで管理され、AuthModalで表示される
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successMessage}>
        <h3>アカウント作成完了</h3>
        <p>
          認証メールを送信しました。メールに記載されたリンクをクリックして、メールアドレスを認証してください。
        </p>
      </div>
    );
  }

  return (
    <div>
      <GoogleAuthButton />

      <div className={styles.divider}>
        <span>または</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="signup-name" className={styles.label}>
            お名前 <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            id="signup-name"
            type="text"
            className={styles.input}
            placeholder="山田 太郎"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="signup-email" className={styles.label}>
            メールアドレス <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            id="signup-email"
            type="email"
            className={styles.input}
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="signup-phone" className={styles.label}>
            電話番号
          </label>
          <input
            id="signup-phone"
            type="tel"
            className={styles.input}
            placeholder="090-1234-5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="signup-password" className={styles.label}>
            パスワード <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            id="signup-password"
            type="password"
            className={styles.input}
            placeholder="8文字以上"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
          />
          <span className={styles.helperText}>8文字以上で設定してください</span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="signup-confirm-password" className={styles.label}>
            パスワード（確認） <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            id="signup-confirm-password"
            type="password"
            className={styles.input}
            placeholder="パスワードを再入力"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
          />
          {password && confirmPassword && password !== confirmPassword && (
            <span className={styles.helperText} style={{ color: '#dc2626' }}>
              パスワードが一致しません
            </span>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={
            loading ||
            !name ||
            !email ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword ||
            password.length < 8
          }
        >
          {loading ? 'アカウント作成中...' : 'アカウント作成'}
        </button>
      </form>
    </div>
  );
}
