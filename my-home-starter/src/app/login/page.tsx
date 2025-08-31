"use client";

import { useState, useEffect } from "react";
import { auth } from "../../utils/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  UserCredential,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { syncLocalStorageWithFirebase } from "../../utils/syncLocalStorageWithFirebase";
import LineAuthButton from "../../components/auth/LineAuthButton";
import styles from "./LoginPage.module.css";
import { FirebaseError } from "firebase/app";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState<string | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (lockoutTime && lockoutTime > Date.now()) {
      const interval = setInterval(() => {
        const timeLeft = lockoutTime - Date.now();
        if (timeLeft <= 0) {
          setLockoutTime(null);
          setLockoutRemaining(null);
          setLoginAttempts(0); // リセット
          clearInterval(interval);
        } else {
          const minutes = Math.floor(timeLeft / 60000);
          const seconds = Math.floor((timeLeft % 60000) / 1000);
          setLockoutRemaining(`${minutes}分${seconds}秒`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleLogin = async (loginFunction: () => Promise<UserCredential>) => {
    if (lockoutTime && Date.now() < lockoutTime) {
      setErrorMessage("操作が制限されています。しばらく待って再試行してください。");
      return;
    }
  
    setLoading(true);
    resetMessages();
    
    try {
      const userCredential = await loginFunction();
      const user = userCredential.user;
  
      if (user) {
        try {
          await syncLocalStorageWithFirebase(user.uid);
          router.push("/my-page");
        } catch (syncError) {
          console.error("同期エラー:", syncError);
          // 同期に失敗してもログインは続行
          router.push("/my-page");
        }
      }
    } catch (error) {
      // キャンセルの場合は試行回数を増やさない
      const isUserCancelled = error instanceof FirebaseError && 
        (error.code === "auth/popup-closed-by-user" || 
         error.code === "auth/cancelled-popup-request");
      
      if (!isUserCancelled) {
        // ログイン失敗時の試行回数を増加
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= 4) {
          const lockoutDuration = 5 * 60 * 1000; // 5分
          setLockoutTime(Date.now() + lockoutDuration);
          setErrorMessage("ログイン試行が多すぎます。5分後に再試行してください。");
        } else {
          if (error instanceof FirebaseError) {
            switch (error.code) {
              case "auth/user-not-found":
                setErrorMessage("入力されたメールアドレスは登録されていません。");
                break;
              case "auth/wrong-password":
              case "auth/invalid-credential":
                setErrorMessage("メールアドレスまたはパスワードが間違っています。");
                break;
              case "auth/invalid-email":
                setErrorMessage("有効なメールアドレスを入力してください。");
                break;
              case "auth/too-many-requests":
                setErrorMessage("ログイン試行が多すぎます。しばらく待ってから再試行してください。");
                break;
              case "auth/popup-closed-by-user":
                // ユーザーがポップアップを閉じた場合はエラーメッセージを表示しない
                console.log("ログインがキャンセルされました。");
                break;
              case "auth/cancelled-popup-request":
                // 複数のポップアップリクエストがキャンセルされた場合
                console.log("ログインがキャンセルされました。");
                break;
              default:
                setErrorMessage(`ログインに失敗しました: ${error.code}`);
            }
          } else {
            // エラーメッセージにキャンセルが含まれる場合は表示しない
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (!errorMessage.includes("popup") && !errorMessage.includes("cancel")) {
              setErrorMessage("予期しないエラーが発生しました。");
            }
          }
        }
      }
    } finally {
      // finally句で確実にloadingをfalseに
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const handleEmailPasswordLogin = async (): Promise<UserCredential> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (!user.emailVerified) {
        alert("メールアドレスが確認されていません。メールをご確認いただき、認証を完了してください。");
        await auth.signOut();
        throw new Error("メールアドレスが確認されていません。");
      }
  
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setErrorMessage("パスワードをリセットするには、メールアドレスを入力してください。");
      return;
    }
    setLoading(true);
    resetMessages();
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("パスワードリセット用のメールを送信しました。メールをご確認ください。");
    } catch (error) {
      console.error("パスワードリセットエラー:", error);
      setErrorMessage("パスワードリセットに失敗しました。正しいメールアドレスを入力してください。");
    } finally {
      setLoading(false);
    }
  };

  const handleLineSuccess = async (user: any) => {
    try {
      await syncLocalStorageWithFirebase(user.uid);
      router.push("/my-page");
    } catch (error) {
      console.error("LINE認証後の処理エラー:", error);
      // 同期に失敗してもページ遷移は実行
      router.push("/my-page");
    }
  };

  const handleLineError = (error: Error) => {
    setErrorMessage("LINE認証に失敗しました。もう一度お試しください。");
  };

  // ロックアウト状態の判定
  const isLockedOut = lockoutTime !== null && Date.now() < lockoutTime;

  return (
    <div className={styles.container}>
      <h1>ログイン</h1>

      <button
        onClick={() => handleLogin(handleGoogleLogin)}
        className={`${styles.button} ${loading || isLockedOut ? styles.disabledButton : ""}`}
        disabled={loading || isLockedOut}
      >
        {loading ? "ログイン中..." : "Googleでログイン"}
      </button>

      <LineAuthButton 
        onSuccess={handleLineSuccess}
        onError={handleLineError}
        disabled={loading || isLockedOut}
      />

      <h2>メールアドレスとパスワードでログイン</h2>
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
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      {lockoutRemaining && <p className={styles.error}>ロック解除まで: {lockoutRemaining}</p>}

      <button
        onClick={() => handleLogin(handleEmailPasswordLogin)}
        className={`${styles.button} ${loading || !email || !password || isLockedOut ? styles.disabledButton : ""}`}
        disabled={loading || !email || !password || isLockedOut}
      >
        {loading ? "ログイン中..." : "ログイン"}
      </button>

      <div className={styles.resetPasswordLink}>
        <p>
          パスワードを忘れた方は、
          <button
            onClick={() => setShowResetPassword(true)}
            className={styles.linkButton}
          >
            こちら
          </button>
          をクリックしてください。
        </p>
      </div>

      {showResetPassword && (
        <div className={styles.resetPasswordContainer}>
          <h3>パスワードリセット</h3>
          <p>登録したメールアドレスを入力してください。</p>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <button
            onClick={handlePasswordReset}
            className={`${styles.button} ${loading || !email ? styles.disabledButton : ""}`}
            disabled={loading || !email}
          >
            {loading ? "送信中..." : "リセットメールを送信"}
          </button>
        </div>
      )}

      <div className={styles.createAccountLink}>
        <p>
          アカウントをお持ちでない方は、
          <a href="/create-account" className={styles.link}>こちら</a>
          から作成してください。
        </p>
      </div>
    </div>
  );
}