import * as admin from "firebase-admin";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2";
import {ContactEmailService} from "./services/contactEmailService";

// Firebase Admin SDKの初期化
admin.initializeApp();

// グローバルオプションの設定（リージョンなど）
setGlobalOptions({
  region: "asia-northeast1",
});

// LINE認証関数
export {lineAuth} from "./auth/lineAuth";

// 問い合わせメール送信関数
export const sendContactEmail = onCall(async (request) => {
  const {data} = request;
  // 入力値の検証
  const {name, email, message} = data;

  if (!name || !email || !message) {
    throw new HttpsError(
      "invalid-argument",
      "必須項目が入力されていません。"
    );
  }

  // メールアドレスの簡易検証
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new HttpsError(
      "invalid-argument",
      "有効なメールアドレスを入力してください。"
    );
  }

  try {
    const emailService = new ContactEmailService();
    await emailService.sendContactEmail({name, email, message});

    return {
      success: true,
      message: "お問い合わせを受け付けました。",
    };
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw new HttpsError(
      "internal",
      "メール送信中にエラーが発生しました。"
    );
  }
});
