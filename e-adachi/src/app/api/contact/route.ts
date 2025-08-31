import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// 型を付けておくとエラーが出にくい
type FormData = {
  name: string;
  email: string;
  message: string;
};

export async function POST(req: Request) {
  const { name, email, message }: FormData = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "全ての項目を入力してください。" }, { status: 400 });
  }

  // さくらインターネット SMTP 設定
  const transporter = nodemailer.createTransport({
    host: "whitesnake6.sakura.ne.jp",
    port: 587,
    secure: false,
    auth: {
      user: "info@jh-ad.jp",
      pass: "adachi5112",
    },
  });

  try {
    // --- 管理者（自社）宛て ---
    await transporter.sendMail({
      from: `"HPからのお問合せ" <info@jh-ad.jp>`,
      to: "info@jh-ad.jp",
      subject: "【HP】お問合せがありました",
      text: `
【お名前】 ${name}
【メールアドレス】 ${email}
【お問い合わせ内容】
${message}
      `,
    });

    // --- 問い合わせ者（ユーザー）宛て 自動返信 ---
    await transporter.sendMail({
      from: `"株式会社足立電機" <info@jh-ad.jp>`,
      to: email,
      subject: "【自動返信】お問合せありがとうございます",
      text: `
${name} 様

この度は、株式会社足立電機にお問い合わせいただきありがとうございます。
以下の内容でお問合せを受け付けいたしました。

-----------------------------------
【お名前】 ${name}
【メールアドレス】 ${email}
【お問い合わせ内容】
${message}
-----------------------------------

※このメールは送信専用です。
後日、担当者より別途ご連絡いたしますので今しばらくお待ちください。

──────────────────────
株式会社足立電機
〒301-0847 茨城県龍ケ崎市松ヶ丘4丁目4番1号
TEL: 0297-63-0600
MAIL: info@jh-ad.jp
──────────────────────
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "メール送信に失敗しました。" }, { status: 500 });
  }
}
