"use client";

import React, { useState } from 'react';

const VerifyDocumentsPage = () => {
  const [formData, setFormData] = useState<{
    bankInfo: string;
    constructionLicense: File | null;
  }>({
    bankInfo: '',
    constructionLicense: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, constructionLicense: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // FirebaseまたはバックエンドAPIにデータを送信して審査申請
    console.log('Documents submitted:', formData);
  };

  return (
    <div>
      <h1>追加機能利用申請</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="bankInfo" placeholder="口座情報" value={formData.bankInfo} onChange={handleInputChange} required />
        <input type="file" name="constructionLicense" onChange={handleFileChange} required />
        <button type="submit">申請</button>
      </form>
    </div>
  );
};

export default VerifyDocumentsPage;
