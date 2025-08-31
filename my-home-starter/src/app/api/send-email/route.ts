import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { name, email, message, recaptchaToken } = await request.json();

    // reCAPTCHAの検証
    if (recaptchaToken) {
      try {
        const recaptchaResponse = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify`,
          {},
          {
            params: {
              secret: process.env.RECAPTCHA_SECRET,
              response: recaptchaToken,
            },
          }
        );

        if (!recaptchaResponse.data.success || recaptchaResponse.data.score < 0.5) {
          return NextResponse.json(
            { success: false, error: "スパムが検出されました。" },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error("reCAPTCHA検証エラー:", error);
        return NextResponse.json(
          { success: false, error: "reCAPTCHA検証に失敗しました。" },
          { status: 500 }
        );
      }
    }

    // Firebase FunctionsのCallable関数を呼び出し
    const functionsUrl = process.env.FIREBASE_FUNCTIONS_URL || 
      `https://asia-northeast1-${process.env.FIREBASE_PROJECT_ID}.cloudfunctions.net`;
    
    const response = await axios.post(
      `${functionsUrl}/sendContactEmail`,
      {
        data: { name, email, message }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data.result?.success) {
      return NextResponse.json({ 
        success: true, 
        message: "メールが送信されました！" 
      });
    } else {
      throw new Error("メール送信に失敗しました");
    }
    
  } catch (error: any) {
    console.error("メール送信エラー:", error);
    
    // Firebase Functionsからのエラーメッセージを取得
    const errorMessage = error.response?.data?.error?.message || 
                        error.message || 
                        "メール送信に失敗しました。";
    
    const statusCode = error.response?.status || 500;
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}