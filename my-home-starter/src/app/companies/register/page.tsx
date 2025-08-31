"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../utils/firebaseConfig";

type FormDataType = {
  companyName: string;
  companyType: "株式会社（前株）" | "株式会社（後株）" | "有限会社（前有）" | "有限会社（後有）" | "合同会社（前合）" | "合同会社（後合）";
  representativeName: string;
  department: string;
  email: string;
  phone: string;
};

const RegisterCompanyPage = () => {
  const [formData, setFormData] = useState<FormDataType>({
    companyName: "",
    companyType: "株式会社（前株）", // デフォルト選択
    representativeName: "",
    department: "",
    email: "",
    phone: "",
  });

  const [fullCompanyName, setFullCompanyName] = useState(""); // フル企業名の状態

  const [errors, setErrors] = useState({
    companyName: "",
    representativeName: "",
    department: "",
    email: "",
    phone: "",
  });

  const router = useRouter();

  // フル企業名を更新
  useEffect(() => {
    const companyTypeMap: { [key in FormDataType["companyType"]]: string } = {
      "株式会社（前株）": `株式会社 ${formData.companyName}`,
      "株式会社（後株）": `${formData.companyName} 株式会社`,
      "有限会社（前有）": `有限会社 ${formData.companyName}`,
      "有限会社（後有）": `${formData.companyName} 有限会社`,
      "合同会社（前合）": `合同会社 ${formData.companyName}`,
      "合同会社（後合）": `${formData.companyName} 合同会社`,
    };

    setFullCompanyName(companyTypeMap[formData.companyType] || formData.companyName);
  }, [formData.companyName, formData.companyType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value } as FormDataType);
    setErrors({ ...errors, [name]: "" }); // 入力変更時に該当エラーをクリア
  };

  const validateForm = () => {
    const newErrors = { companyName: "", representativeName: "", department: "", email: "", phone: "" };
    let isValid = true;

    if (!formData.companyName.trim()) {
      newErrors.companyName = "企業名を入力してください。";
      isValid = false;
    }

    if (!formData.representativeName.trim()) {
      newErrors.representativeName = "担当者名を入力してください。";
      isValid = false;
    }

    if (!formData.department.trim()) {
      newErrors.department = "配属部署を入力してください。";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "正しいメールアドレスを入力してください。";
      isValid = false;
    }

    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "10桁または11桁の数字（ハイフンなし）を入力してください。";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "companies", user.uid);

      try {
        await setDoc(userDocRef, {
          ...formData,
          fullCompanyName,
          approvalStatus: "awaitingApproval",
        });
        router.push("/companies/awaiting-approval");
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
      <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>会社情報登録</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label>企業名:</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            required
            style={{ display: "block", width: "100%", padding: "8px", margin: "10px 0" }}
          />
          {errors.companyName && <p style={{ color: "red" }}>{errors.companyName}</p>}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>企業形態:</label>
          <select
            name="companyType"
            value={formData.companyType}
            onChange={handleInputChange}
            style={{ display: "block", width: "100%", padding: "8px", margin: "10px 0" }}
          >
            <option value="株式会社（前株）">株式会社（前株）</option>
            <option value="株式会社（後株）">株式会社（後株）</option>
            <option value="有限会社（前有）">有限会社（前有）</option>
            <option value="有限会社（後有）">有限会社（後有）</option>
            <option value="合同会社（前合）">合同会社（前合）</option>
            <option value="合同会社（後合）">合同会社（後合）</option>
          </select>
        </div>

        <p style={{ marginBottom: "20px", fontWeight: "bold" }}>フル企業名: {fullCompanyName || "未入力"}</p>

        <div style={{ marginBottom: "20px" }}>
          <label>担当者名:</label>
          <input
            type="text"
            name="representativeName"
            value={formData.representativeName}
            onChange={handleInputChange}
            required
            style={{ display: "block", width: "100%", padding: "8px", margin: "10px 0" }}
          />
          {errors.representativeName && <p style={{ color: "red" }}>{errors.representativeName}</p>}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>配属部署:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
            style={{ display: "block", width: "100%", padding: "8px", margin: "10px 0" }}
          />
          {errors.department && <p style={{ color: "red" }}>{errors.department}</p>}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>メールアドレス:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{ display: "block", width: "100%", padding: "8px", margin: "10px 0" }}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>電話番号（ハイフンなし）:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            style={{ display: "block", width: "100%", padding: "8px", margin: "10px 0" }}
          />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
        </div>

        <button type="submit" style={{ display: "block", width: "100%", padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          登録
        </button>
      </form>
    </div>
  );
};

export default RegisterCompanyPage;
