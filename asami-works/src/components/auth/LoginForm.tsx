"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import GoogleAuthButton from './GoogleAuthButton';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    try {
      setLoading(true);
      await signInWithEmail(email, password);
      // モーダルはAuthModalでuserの変更を監視して自動的に閉じられる
    } catch (error) {
      // エラーはAuthContextで管理され、AuthModalで表示される
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <GoogleAuthButton />

      <div className={styles.divider}>
        <span>または</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="login-email" className={styles.label}>
            メールアドレス
          </label>
          <input
            id="login-email"
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
          <label htmlFor="login-password" className={styles.label}>
            パスワード
          </label>
          <input
            id="login-password"
            type="password"
            className={styles.input}
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            minLength={8}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || !email || !password}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </div>
  );
}
