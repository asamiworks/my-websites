"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../../utils/firebaseConfig";
import { Typography, Box, CircularProgress, Alert } from "@mui/material";

// 承認済み企業のデータ型
type ApprovedCompany = {
  id: string;
  companyName: string;
  fullCompanyName: string;
  email: string;
  phone: string;
  department: string;
  representativeName: string;
};

const AdminDashboard = () => {
  const router = useRouter();
  const [approvedCompanies, setApprovedCompanies] = useState<ApprovedCompany[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 認証と管理者チェック
  useEffect(() => {
    console.log("✅ ダッシュボードページを読み込み中...");

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

  // 承認済み企業データの取得（管理者のみ）
  useEffect(() => {
    if (!isAdmin) return;

    const fetchApprovedCompanies = async () => {
      try {
        const companiesRef = collection(db, "companies");
        const q = query(companiesRef, where("approvalStatus", "==", "approved"));
        const querySnapshot = await getDocs(q);

        const companies = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          companyName: doc.data().companyName || "",
          fullCompanyName: doc.data().fullCompanyName || "",
          email: doc.data().email || "",
          phone: doc.data().phone || "",
          department: doc.data().department || "",
          representativeName: doc.data().representativeName || "",
        })) as ApprovedCompany[];

        setApprovedCompanies(companies);
      } catch (err) {
        console.error("承認済み企業のデータ取得中にエラー:", err);
        setError("承認済み企業のデータを取得できませんでした。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedCompanies();
  }, [isAdmin]);

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

  // 承認済み企業一覧の表示
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        承認済み企業一覧
      </Typography>
      {approvedCompanies.length > 0 ? (
        approvedCompanies.map((company) => (
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
          </Box>
        ))
      ) : (
        <Typography>現在、承認済みの企業はありません。</Typography>
      )}
    </Box>
  );
};

export default AdminDashboard;
