"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../utils/firebaseConfig";
import { Box, Button, Typography } from "@mui/material";

const AdminPage = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("✅ 管理者ページを読み込み中...");

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.log("❌ ユーザーが未ログイン");
        setError("ログインが必要です");
        setLoading(false);
        return;
      }

      try {
        const idTokenResult = await user.getIdTokenResult(true);
        console.log("🆔 取得したカスタムクレーム:", idTokenResult.claims);

        if (idTokenResult.claims?.admin) {
          console.log("✅ 管理者権限あり");
          setIsAdmin(true);
        } else {
          console.log("🚫 管理者権限なし");
          setError("管理者権限がありません");
        }
      } catch (error) {
        console.error("⚠️ 管理者チェックエラー:", error);
        setError("認証情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" gap={2}>
        <Typography variant="h4" color="error">{error}</Typography>
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" gap={2}>
        <Typography variant="h5" color="error">管理者権限がありません</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" gap={2}>
      <Button variant="contained" color="primary" onClick={() => router.push("/admin/approval")}>
        承認待ち一覧
      </Button>
      <Button variant="contained" color="secondary" onClick={() => router.push("/admin/dashboard")}>
        承認済み一覧（ダッシュボード）
      </Button>
      <Button variant="contained" color="info" onClick={() => router.push("/admin/chat")}>
        チャット管理
      </Button>
    </Box>
  );
};

export default AdminPage;
