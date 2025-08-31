// src/app/check-email/page.tsx

"use client";

import { useState, useEffect } from "react";
import { auth } from "../../utils/firebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./CheckEmail.module.css";

export default function CheckEmailPage() {
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 現在のユーザーのメールアドレスを取得
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email || "");
      
      // 既に認証済みの場合はマイページへリダイレクト
      if (user.emailVerified) {
        router.push("/my-page");
      }
    } else {
      // ログインしていない場合はログインページへ
      router.push("/login");
    }
  }, [router]);

  const handleResendEmail = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setResending(true);
    setMessage("");

    try {
      await sendEmailVerification(user);
      setMessage("確認メールを再送信しました。メールボックスをご確認ください。");
    } catch (error) {
      setMessage("メールの送信に失敗しました。しばらく待ってから再試行してください。");
    } finally {
      setResending(false);
    }
  };

  const checkVerificationStatus = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // ユーザー情報を再読み込み
      await user.reload();
      
      if (user.emailVerified) {
        router.push("/my-page");
      } else {
        setMessage("メールアドレスがまだ確認されていません。");
      }
    } catch (error) {
      setMessage("確認状態の取得に失敗しました。");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.emailIcon}>📧</div>
        <h1>メールアドレスの確認</h1>
        
        <p className={styles.description}>
          <strong>{email}</strong> に確認メールを送信しました。
        </p>
        
        <div className={styles.steps}>
          <h3>次のステップ：</h3>
          <ol>
            <li>メールボックスを確認してください</li>
            <li>メール内の確認リンクをクリックしてください</li>
            <li>認証完了後、下のボタンをクリックしてください</li>
          </ol>
        </div>

        {message && (
          <p className={message.includes("失敗") ? styles.error : styles.success}>
            {message}
          </p>
        )}

        <div className={styles.actions}>
          <button
            onClick={checkVerificationStatus}
            className={styles.primaryButton}
          >
            認証を確認してログイン
          </button>
          
          <button
            onClick={handleResendEmail}
            className={styles.secondaryButton}
            disabled={resending}
          >
            {resending ? "送信中..." : "確認メールを再送信"}
          </button>
        </div>

        <div className={styles.notes}>
          <p>メールが届かない場合：</p>
          <ul>
            <li>迷惑メールフォルダを確認してください</li>
            <li>info@ymy-home-starter.com からのメールを受信できるように設定してください</li>
            <li>数分待ってから再送信してください</li>
          </ul>
        </div>

        <div className={styles.footer}>
          <a href="/login" className={styles.link}>
            ログインページに戻る
          </a>
        </div>
      </div>
    </div>
  );
}