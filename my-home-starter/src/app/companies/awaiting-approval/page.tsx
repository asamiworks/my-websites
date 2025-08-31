"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next.jsのルーター
import { onSnapshot, doc } from "firebase/firestore"; // Firestoreのリアルタイムリスナー
import { auth, db } from "../../../utils/firebaseConfig"; // Firebase設定ファイルをインポート
import { Box, Typography, Button } from "@mui/material"; // UI用のMaterial-UIコンポーネント

const AwaitingApprovalPage = () => {
  const [status, setStatus] = useState<"awaiting" | "approved" | "rejected" | "error">("awaiting"); // ステータス管理
  const [error, setError] = useState<string | null>(null); // エラーメッセージ
  const router = useRouter(); // Next.jsのルーター

  useEffect(() => {
    // Firestoreのリアルタイムリスナーで審査状態を監視
    const monitorApprovalStatus = async () => {
      try {
        const user = auth.currentUser;

        // ユーザーがログインしているかを確認
        if (!user) {
          setError("ログイン状態を確認できませんでした。再度ログインしてください。");
          return;
        }

        // 該当ユーザーの Firestore ドキュメントを監視
        const companyDocRef = doc(db, "companies", user.uid);
        const unsubscribe = onSnapshot(
          companyDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              console.log("現在の審査ステータス:", data?.approvalStatus);

              // ステータスに応じて状態を変更
              if (data?.approvalStatus === "approved") {
                router.push("/companies/company-mypage"); // マイページへのリダイレクト
              } else if (data?.approvalStatus === "rejected") {
                setStatus("rejected"); // 却下ステータスに変更
              }
            }
          },
          (err) => {
            console.error("リアルタイムリスナーエラー:", err);
            setError("ステータスの監視中にエラーが発生しました。");
            setStatus("error");
          }
        );

        // クリーンアップ関数
        return () => unsubscribe();
      } catch (err) {
        console.error("ステータスの確認中にエラーが発生しました:", err);
        setError("ステータスの確認中にエラーが発生しました。");
        setStatus("error");
      }
      return;
    };

    monitorApprovalStatus();
  }, [router]);

  // 状態に応じて表示内容を切り替え
  if (status === "rejected") {
    return (
      <Box textAlign="center" p={3}>
        <Typography variant="h5" color="error" gutterBottom>
          審査結果
        </Typography>
        <Typography>
          誠に申し訳ありませんが、今回の審査を通過することができませんでした。
          <br />
          内容をご確認の上、再申請をご検討ください。
          <br />
          詳細についてご不明点がございましたら、お問い合わせください。
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/")}
          sx={{ mt: 3 }}
        >
          トップページへ戻る
        </Button>
      </Box>
    );
  }

  if (status === "error") {
    return (
      <Box textAlign="center" p={3}>
        <Typography variant="h5" color="error" gutterBottom>
          エラー
        </Typography>
        <Typography>{error}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/")}
          sx={{ mt: 3 }}
        >
          トップページへ戻る
        </Button>
      </Box>
    );
  }

  // 審査待ちの画面
  return (
    <Box textAlign="center" p={3}>
      <Typography variant="h4" gutterBottom>
        審査待ち
      </Typography>
      <Typography>
        現在、審査中です。審査が通過後に企業ページへログインすることができます。
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
        sx={{ mt: 3 }}
      >
        トップページへ戻る
      </Button>
    </Box>
  );
};

export default AwaitingApprovalPage;
