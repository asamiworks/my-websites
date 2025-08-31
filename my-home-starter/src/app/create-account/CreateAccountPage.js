"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../utils/firebaseConfig";
import styles from "./CreateAccountPage.module.css";

export default function CreateAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    try {
      setError("");
      setSuccess("");

      // Firebaseでユーザー作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 確認メール送信
      await sendEmailVerification(user);

      setSuccess("アカウントが作成されました！確認メールを送信しましたので、メールを確認してください。");
    } catch (error) {
      setError("アカウント作成に失敗しました: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>アカウント作成</h1>
      <div className={styles.form}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="パスワード確認"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
        />
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <button onClick={handleCreateAccount} className={styles.button}>
          アカウントを作成
        </button>
      </div>
    </div>
  );
}
