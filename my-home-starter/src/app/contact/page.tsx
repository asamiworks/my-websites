"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "@/utils/firebaseConfig";
import styles from "./ContactPage.module.css";

type InquiryType = "company" | "individual";

interface FormData {
  inquiryType: InquiryType;
  name: string;
  email: string;
  phone: string;
  categories: string[];
  message: string;
}

const COMPANY_CATEGORIES = [
  "有料会員プランについて",
  "当サイトの掲載内容について申立て",
  "その他"
];

const INDIVIDUAL_CATEGORIES = [
  "住宅会社探しについて",
  "土地探しについて",
  "家づくりの進め方について",
  "その他"
];

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    inquiryType: "individual",
    name: "",
    email: "",
    phone: "",
    categories: [],
    message: ""
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleInquiryTypeChange = (type: InquiryType) => {
    setFormData(prev => ({
      ...prev,
      inquiryType: type,
      categories: [] // 問い合わせタイプを変更したらカテゴリーをリセット
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = formData.inquiryType === "company" ? "会社名を入力してください" : "お名前を入力してください";
    }
    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "電話番号を入力してください";
    } else if (!/^[0-9-()]+$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "有効な電話番号を入力してください";
    }
    if (formData.categories.length === 0) {
      newErrors.categories = "お問い合わせ内容を選択してください";
    }
    if (!formData.message.trim()) {
      newErrors.message = "メッセージを入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsConfirming(true);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Firebase Functionsを初期化
      const functions = getFunctions(app, 'asia-northeast1');
      const sendContactEmail = httpsCallable(functions, 'sendContactEmail');

      // メッセージを整形
      const formattedMessage = `
【お問い合わせ種別】${formData.inquiryType === "company" ? "住宅会社" : "個人のお客様"}
【お名前${formData.inquiryType === "company" ? "（会社名）" : ""}】${formData.name}
【電話番号】${formData.phone}
【お問い合わせ内容】${formData.categories.join("、")}

【メッセージ】
${formData.message}
      `.trim();

      // Firebase Functionsを呼び出し
      const result = await sendContactEmail({
        name: formData.name,
        email: formData.email,
        message: formattedMessage
      });

      // 成功時の処理
      if (result.data) {
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/");
        }, 5000);
      }
    } catch (error: any) {
      console.error("エラーが発生しました:", error);
      
      // エラーメッセージの表示
      let errorMessage = "メール送信に失敗しました。";
      if (error.code === 'functions/invalid-argument') {
        errorMessage = error.message || "入力内容に問題があります。";
      } else if (error.code === 'functions/internal') {
        errorMessage = "サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。";
      }
      
      alert(errorMessage);
      setIsConfirming(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.title}>送信が完了しました</h1>
          <p className={styles.description}>
            お問い合わせいただきありがとうございます。<br />
            2営業日以内に担当者よりご連絡させていただきます。
          </p>
          <p className={styles.redirectNote}>5秒後にトップページへリダイレクトされます。</p>
        </div>
      </div>
    );
  }

  if (isConfirming) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>入力内容の確認</h1>
        <p className={styles.subtitle}>以下の内容で送信します。よろしいですか？</p>
        
        <div className={styles.confirmBox}>
          <div className={styles.confirmItem}>
            <strong>お問い合わせ種別:</strong>
            <span>{formData.inquiryType === "company" ? "住宅会社" : "個人のお客様"}</span>
          </div>
          <div className={styles.confirmItem}>
            <strong>{formData.inquiryType === "company" ? "会社名:" : "お名前:"}</strong>
            <span>{formData.name}</span>
          </div>
          <div className={styles.confirmItem}>
            <strong>メールアドレス:</strong>
            <span>{formData.email}</span>
          </div>
          <div className={styles.confirmItem}>
            <strong>電話番号:</strong>
            <span>{formData.phone}</span>
          </div>
          <div className={styles.confirmItem}>
            <strong>お問い合わせ内容:</strong>
            <span>{formData.categories.join("、")}</span>
          </div>
          <div className={styles.confirmItem}>
            <strong>メッセージ:</strong>
            <div className={styles.messagePreview}>{formData.message}</div>
          </div>
        </div>
        
        <div className={styles.buttonGroup}>
          <button 
            className={styles.submitButton} 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "送信中..." : "送信する"}
          </button>
          <button 
            className={styles.backButton} 
            onClick={() => setIsConfirming(false)}
            disabled={isSubmitting}
          >
            修正する
          </button>
        </div>
      </div>
    );
  }

  const categories = formData.inquiryType === "company" ? COMPANY_CATEGORIES : INDIVIDUAL_CATEGORIES;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>お問い合わせ</h1>
      <p className={styles.subtitle}>
        ご質問・ご要望がございましたら、下記フォームよりお気軽にお問い合わせください。
      </p>

      <form onSubmit={handleConfirm} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>お問い合わせ種別 <span className={styles.required}>必須</span></label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="inquiryType"
                value="individual"
                checked={formData.inquiryType === "individual"}
                onChange={() => handleInquiryTypeChange("individual")}
                className={styles.radioInput}
              />
              <span>家づくりを検討している方</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="inquiryType"
                value="company"
                checked={formData.inquiryType === "company"}
                onChange={() => handleInquiryTypeChange("company")}
                className={styles.radioInput}
              />
              <span>住宅会社の方</span>
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            {formData.inquiryType === "company" ? "会社名" : "お名前"} 
            <span className={styles.required}>必須</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder={formData.inquiryType === "company" ? "株式会社マイホーム" : "山田 太郎"}
            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            メールアドレス <span className={styles.required}>必須</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>
            電話番号 <span className={styles.required}>必須</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="03-1234-5678"
            className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            お問い合わせ内容 <span className={styles.required}>必須</span>
            <span className={styles.hint}>（複数選択可）</span>
          </label>
          <div className={styles.checkboxGroup}>
            {categories.map((category) => (
              <label key={category} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className={styles.checkboxInput}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
          {errors.categories && <span className={styles.errorMessage}>{errors.categories}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            メッセージ <span className={styles.required}>必須</span>
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="お問い合わせ内容を詳しくご記入ください"
            className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
            value={formData.message}
            onChange={handleChange}
            rows={6}
          />
          {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            入力内容を確認する
          </button>
        </div>
      </form>
    </div>
  );
}