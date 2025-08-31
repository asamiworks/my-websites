"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../utils/firebaseConfig";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import styles from "./VerifyEmailPage.module.css";

export default function VerifyEmailPage() {
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("メール認証を確認中です...");
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      let email = null;

      // ローカルストレージからメールを取得
      try {
        email = window.localStorage.getItem("emailForSignIn");
      } catch (error) {
        console.error("ローカルストレージの読み取りエラー:", error);
      }

      if (!email) {
        setMessage("メールアドレスが見つかりません。ログインページにリダイレクトします...");
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      // メールリンクを検証
      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          await signInWithEmailLink(auth, email, window.location.href);
          setVerified(true);
          setMessage("メールアドレスが確認されました。3秒後にマイページにリダイレクトします...");

          // ローカルストレージをクリーンアップ
          window.localStorage.removeItem("emailForSignIn");

          // リダイレクト
          setTimeout(() => {
            router.push("/my-page");
          }, 3000);
        } catch (error) {
          console.error("認証エラー:", error);
          setMessage("認証に失敗しました。ログインページにリダイレクトします...");
          setTimeout(() => router.push("/login"), 3000);
        }
      } else {
        setMessage("無効なリンクです。ログインページにリダイレクトします...");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    verifyEmail();
  }, [router]);

  return (
    <div className={styles.container}>
      <h1>{message}</h1>
      {verified && <p className={styles.paragraph}>ログイン処理が完了しました。お待ちください...</p>
    }
    </div>
  );
}
