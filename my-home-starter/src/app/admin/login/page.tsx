"use client";

import React, { useState } from "react";
import { auth } from "../../../utils/firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { CircularProgress, Button, Box, Typography } from "@mui/material";

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();

    try {
      // Googleでログイン
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log("🆔 ログイン成功:", user);

      // 一定時間待機してからカスタムクレームを取得（Firebaseの同期を待つ）
      setTimeout(async () => {
        const refreshedUser = auth.currentUser;
        if (!refreshedUser) {
          setError("認証情報の取得に失敗しました。再試行してください。");
          return;
        }

        await refreshedUser.getIdToken(true);
        const idTokenResult = await refreshedUser.getIdTokenResult();

        console.log("カスタムクレーム:", idTokenResult.claims);

        if (idTokenResult.claims?.admin) {
          console.log("✅ 管理者権限あり");
          sessionStorage.setItem("isAdmin", "true");
          window.location.href = "/admin";
        } else {
          setError("管理者アカウントではありません");
          await auth.signOut();
        }
      }, 2000); // 2秒待機してからカスタムクレームを再取得
    } catch (error) {
      console.error("Googleログインエラー:", error);
      setError("ログインに失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" gap={2}>
      <Typography variant="h4">管理者ログイン</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {loading ? (
        <CircularProgress />
      ) : (
        <Button variant="contained" color="primary" onClick={handleGoogleLogin}>
          GOOGLEアカウントでログイン
        </Button>
      )}
    </Box>
  );
};

export default AdminLoginPage;
