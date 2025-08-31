// src/app/auth/line/callback/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/utils/firebaseConfig";
import { signInWithCustomToken } from "firebase/auth";
import { syncLocalStorageWithFirebase } from "@/utils/syncLocalStorageWithFirebase";

function LineCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // searchParamsがnullの場合は早期リターン
    if (!searchParams) return;

    const handleCallback = async () => {
      const token = searchParams.get("token");
      const userId = searchParams.get("userId");
      const errorParam = searchParams.get("error");

      // エラーがある場合
      if (errorParam) {
        setError("LINE認証に失敗しました");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
        return;
      }

      if (!token || !userId) {
        setError("認証情報が不正です");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
        return;
      }

      try {
        // Firebaseにカスタムトークンでログイン
        const userCredential = await signInWithCustomToken(auth, token);
        const user = userCredential.user;

        if (user) {
          // LocalStorageとFirebaseの同期
          try {
            await syncLocalStorageWithFirebase(user.uid);
          } catch (syncError) {
            console.error("同期エラー:", syncError);
            // 同期に失敗してもログインは続行
          }

          // マイページへリダイレクト
          router.push("/my-page");
        }
      } catch (error) {
        console.error("Firebase認証エラー:", error);
        setError("ログインに失敗しました");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px"
    }}>
      {error ? (
        <>
          <h1 style={{ color: "#ff0000", marginBottom: "20px" }}>エラー</h1>
          <p>{error}</p>
          <p style={{ marginTop: "10px", color: "#666" }}>ログインページへ戻ります...</p>
        </>
      ) : (
        <>
          <h1 style={{ marginBottom: "20px" }}>LINE認証中...</h1>
          <div style={{
            border: "3px solid #f3f3f3",
            borderTop: "3px solid #00B900",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ marginTop: "20px", color: "#666" }}>しばらくお待ちください</p>
        </>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Suspenseでラップしてexport
export default function LineCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh"
      }}>
        <p>Loading...</p>
      </div>
    }>
      <LineCallbackContent />
    </Suspense>
  );
}