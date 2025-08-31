"use client";

import React, { useState, useEffect } from "react";
import { getDoc, doc, updateDoc, DocumentData } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../utils/firebaseConfig";
import { TextField, Button, CircularProgress, Typography, Box } from "@mui/material";

const CompanyMyPage = () => {
  const [companyData, setCompanyData] = useState<DocumentData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankInfo, setBankInfo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCompanyData(user.uid);
      } else {
        setError("ログインしていません。再度ログインしてください。");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCompanyData = async (uid: string) => {
    try {
      const docRef = doc(db, "companies", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCompanyData(docSnap.data());
        setError(null);
      } else {
        setError("企業情報が見つかりませんでした。");
      }
    } catch (err) {
      console.error("データ取得エラー:", err); // eslint-disable-line no-console
      setError("データの取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankInfoSubmit = async () => {
    if (companyData) {
      setIsSubmitting(true);
      try {
        const docRef = doc(db, "companies", auth.currentUser!.uid);
        await updateDoc(docRef, { bankInfo });
        setCompanyData((prev) => ({ ...prev, bankInfo }));
        alert("引き落とし口座が登録されました");
      } catch (error) {
        console.error("口座情報登録エラー:", error); // eslint-disable-line no-console
        setError("口座情報の登録に失敗しました。もう一度お試しください。");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleLicenseConfirm = async () => {
    if (companyData) {
      setIsSubmitting(true);
      try {
        const docRef = doc(db, "companies", auth.currentUser!.uid);
        await updateDoc(docRef, { constructionLicense: "confirmed" });
        setCompanyData((prev) => ({ ...prev, constructionLicense: "confirmed" }));
        alert("建設業許可証が確認されました");
      } catch (error) {
        console.error("許可証確認エラー:", error); // eslint-disable-line no-console
        setError("建設業許可証の確認に失敗しました。");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const retryFetch = () => {
    setError(null);
    setIsLoading(true);
    if (auth.currentUser) {
      fetchCompanyData(auth.currentUser.uid);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button variant="contained" color="primary" onClick={retryFetch} sx={{ mt: 2 }}>
          再試行
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        企業専用マイページ
      </Typography>
      <Typography variant="body1">
        ステータス: {companyData?.approvalStatus || "未登録"}
      </Typography>

      {!companyData?.bankInfo && (
        <Box mt={3}>
          <Typography variant="h6">引き落とし口座登録</Typography>
          <TextField
            label="口座情報"
            variant="outlined"
            fullWidth
            value={bankInfo}
            onChange={(e) => setBankInfo(e.target.value)}
            disabled={isSubmitting}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleBankInfoSubmit}
            disabled={isSubmitting || !bankInfo}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? "登録中..." : "登録"}
          </Button>
        </Box>
      )}

      {companyData?.constructionLicense !== "confirmed" && (
        <Box mt={3}>
          <Typography variant="h6">建設業許可証の確認</Typography>
          <Typography>
            許可証の登録が必要です。管理者にお問い合わせください。
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLicenseConfirm}
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? "確認中..." : "許可証を確認済みにする"}
          </Button>
        </Box>
      )}

      {companyData?.bankInfo && companyData?.constructionLicense === "confirmed" && (
        <Box mt={3}>
          <Typography variant="h6">個人情報の購入</Typography>
          <Typography>
            必要な要件がすべて満たされています。個人情報の購入機能が開放されました。
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => alert("個人情報の購入ページへ移動")}
            sx={{ mt: 2 }}
          >
            個人情報を購入する
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CompanyMyPage;
