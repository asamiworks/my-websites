"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../../utils/firebaseConfig";
import { Typography, Box, Button, CircularProgress, Alert } from "@mui/material";

// 企業データ型の定義
type Company = {
  id: string;
  companyName: string;
  fullCompanyName: string;
  email: string;
  phone: string;
  department: string;
  representativeName: string;
  approvalStatus: string;
};

const AdminApproval = () => {
  const router = useRouter();
  const [pendingCompanies, setPendingCompanies] = useState<Company[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 認証と管理者チェック
  useEffect(() => {
    console.log("✅ 承認待ちページを読み込み中...");

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.log("❌ ユーザーが未ログイン、ログインページへリダイレクト");
        router.push("/admin/login");
        return;
      }

      try {
        const idTokenResult = await user.getIdTokenResult();
        console.log("🆔 取得したカスタムクレーム:", idTokenResult.claims);

        if (idTokenResult.claims?.admin) {
          console.log("✅ 管理者権限あり");
          setIsAdmin(true);
        } else {
          console.log("🚫 管理者権限なし、リダイレクト");
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("⚠️ 認証情報の取得に失敗:", err);
        setError("認証情報の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Firestoreから承認待ちの企業を取得
  useEffect(() => {
    if (!isAdmin) return;

    const companiesRef = collection(db, "companies");
    const q = query(companiesRef, where("approvalStatus", "==", "awaitingApproval"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const companies = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          companyName: doc.data().companyName || "",
          fullCompanyName: doc.data().fullCompanyName || "",
          email: doc.data().email || "",
          phone: doc.data().phone || "",
          department: doc.data().department || "",
          representativeName: doc.data().representativeName || "",
          approvalStatus: doc.data().approvalStatus || "",
        })) as Company[];

        setPendingCompanies(companies);
        setIsLoading(false);
      },
      (err) => {
        console.error("リアルタイムデータ取得中にエラー:", err);
        setError("データを取得できませんでした。");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // 企業を承認
  const approveCompany = async (id: string) => {
    try {
      const companyRef = doc(db, "companies", id);
      await updateDoc(companyRef, { approvalStatus: "approved" });
    } catch (err) {
      console.error("承認処理エラー:", err);
      setError("承認処理中にエラーが発生しました。");
    }
  };

  // 企業を却下
  const rejectCompany = async (id: string) => {
    try {
      const companyRef = doc(db, "companies", id);
      await updateDoc(companyRef, { approvalStatus: "rejected" });
    } catch (err) {
      console.error("却下処理エラー:", err);
      setError("却下処理中にエラーが発生しました。");
    }
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography ml={2}>読み込み中...</Typography>
      </Box>
    );
  }

  // エラーの表示
  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // 企業リストの表示
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        承認待ち企業
      </Typography>
      {pendingCompanies.length > 0 ? (
        pendingCompanies.map((company) => (
          <Box
            key={company.id}
            p={2}
            mb={2}
            border={1}
            borderRadius={4}
            borderColor="grey.300"
          >
            <Typography variant="h6">企業名: {company.companyName}</Typography>
            <Typography>フル企業名: {company.fullCompanyName}</Typography>
            <Typography>担当者名: {company.representativeName}</Typography>
            <Typography>配属部署: {company.department}</Typography>
            <Typography>Email: {company.email}</Typography>
            <Typography>電話番号: {company.phone}</Typography>
            <Typography>現在のステータス: {company.approvalStatus}</Typography>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => approveCompany(company.id)}
                sx={{ mr: 2 }}
              >
                承認
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => rejectCompany(company.id)}
              >
                却下
              </Button>
            </Box>
          </Box>
        ))
      ) : (
        <Typography>現在、承認待ちの企業はありません。</Typography>
      )}
    </Box>
  );
};

export default AdminApproval;
