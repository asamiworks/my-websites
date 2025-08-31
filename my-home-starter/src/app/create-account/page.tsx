"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../utils/firebaseConfig";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { syncLocalStorageWithFirebase } from "../../utils/syncLocalStorageWithFirebase";
import LineAuthButton from "../../components/auth/LineAuthButton";
import styles from "./CreateAccountPage.module.css";
import { FirebaseError } from "firebase/app";

export default function CreateAccountPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const saveUserToFirestore = async (uid: string, name: string, email: string) => {
    try {
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      });
      console.log("Firestoreにユーザー情報を保存しました");
    } catch (error) {
      console.error("Firestoreへの保存エラー:", error);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        const userId = result.user.uid;
        console.log("Google認証成功:", userId);

        await saveUserToFirestore(userId, result.user.displayName || "No Name", result.user.email || "");

        try {
          await syncLocalStorageWithFirebase(userId);
        } catch (error) {
          console.error("ローカルストレージ同期エラー:", error);
        }

        router.push("/my-page");
      }
    } catch (error) {
      console.error("Google認証エラー:", error);
      setErrorMessage("Googleアカウント作成に失敗しました");
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
    }
  };

  const handleLineError = (error: Error) => {
    setErrorMessage("LINE認証に失敗しました。もう一度お試しください。");
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!nickname) {
      setErrorMessage("ニックネームを入力してください");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("有効なメールアドレスを入力してください");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("パスワードが一致しません");
      setLoading(false);
      return;
    }

    window.localStorage.setItem("emailForSignIn", email);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await updateProfile(userCredential.user, { displayName: nickname });
      await saveUserToFirestore(userId, nickname, email);

      await sendEmailVerification(userCredential.user);

      try {
        await syncLocalStorageWithFirebase(userId);
      } catch (error) {
        console.error("ローカルストレージ同期エラー:", error);
      }

      setSuccessMessage("確認メールを送信しました。メールを確認してください。");
      router.push("/check-email");
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("アカウント作成エラー:", error);
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage("このメールアドレスは既に登録されています");
        } else {
          setErrorMessage("アカウント作成に失敗しました");
        }
      } else {
        console.error("予期しないエラー:", error);
        setErrorMessage("予期しないエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>アカウント作成</h1>
      <button
        onClick={handleGoogleAuth}
        className={styles.button}
        disabled={loading}
      >
        {loading ? "作成中..." : "Googleでアカウント作成"}
      </button>

      <LineAuthButton 
        onSuccess={handleLineSuccess}
        onError={handleLineError}
      />

      <form onSubmit={handleEmailAuth} className={styles.form}>
        <input
          type="text"
          placeholder="名前（ニックネーム）"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className={styles.input}
        />
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
          placeholder="パスワードの確認"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
        />
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        <button
          type="submit"
          className={`${styles.button} ${loading ? styles.disabledButton : ""}`}
          disabled={loading || !nickname || !email || !password || !confirmPassword}
        >
          {loading ? "作成中..." : "アカウント作成"}
        </button>
      </form>

      <div className={styles.linkContainer}>
        <p>
          アカウントを所有している方は
          <a href="/login" className={styles.link}>
            こちら
          </a>
          からログインして下さい。
        </p>
      </div>
    </div>
  );
}
