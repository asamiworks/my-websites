"use client";

import { useState } from "react";
import styles from "./LineAuthButton.module.css";

interface LineAuthButtonProps {
  onSuccess?: (user: any) => void;
  onError?: (error: Error) => void;
  disabled?: boolean; // 追加
}

export default function LineAuthButton({onError, disabled }: LineAuthButtonProps) {
  const [loading] = useState(false);

  const handleLineLogin = () => {
    if (disabled) return; // 無効時は処理しない

    const channelId = process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID;
    
    if (!channelId) {
      console.error("LINE Login Channel IDが設定されていません");
      if (onError) {
        onError(new Error("LINE設定エラー"));
      }
      return;
    }
    
    // 現在のホストに基づいてredirect_uriを動的に生成
    const currentHost = window.location.origin;
    const redirectUri = `${currentHost}/api/auth/line/callback`;
    
    const state = Math.random().toString(36).substring(7);
    const nonce = Math.random().toString(36).substring(7);

    // LocalStorageに state を保存（CSRF対策）
    localStorage.setItem("line_auth_state", state);

    const authUrl = `https://access.line.me/oauth2/v2.1/authorize?` +
      `response_type=code&` +
      `client_id=${channelId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}&` +
      `scope=profile%20openid&` +
      `nonce=${nonce}`;

    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleLineLogin}
      className={`${styles.lineButton} ${disabled ? styles.disabledButton : ""}`}
      disabled={loading || disabled}
    >
      {loading ? "処理中..." : "LINEでログイン"}
    </button>
  );
}
