"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactEmailService = void 0;
// functions/src/services/contactEmailService.ts
const googleapis_1 = require("googleapis");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
class ContactEmailService {
    constructor() {
        // サービスアカウントを使用した認証
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: "./service-account-key.json",
            scopes: ["https://www.googleapis.com/auth/gmail.send"],
            clientOptions: {
                subject: functions.config().gmail.sender_email, // 送信元メールアドレス
            },
        });
        this.gmail = googleapis_1.google.gmail({ version: "v1", auth });
    }
    /**
     * 問い合わせメールを送信
     */
    async sendContactEmail(data) {
        const { name, email, message } = data;
        const timestamp = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        try {
            // 管理者への通知メール
            await this.sendEmail(functions.config().gmail.admin_email || functions.config().gmail.sender_email, `【お問い合わせ】${name}様より`, this.createAdminEmailHtml(name, email, message, timestamp), this.createAdminEmailText(name, email, message, timestamp));
            // ユーザーへの自動返信メール
            await this.sendEmail(email, "お問い合わせありがとうございます - マイホームスターター", this.createUserEmailHtml(name, message, timestamp), this.createUserEmailText(name, message, timestamp));
            // Firestoreに問い合わせ履歴を保存
            await admin.firestore().collection("inquiries").add({
                name,
                email,
                message,
                status: "sent",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        catch (error) {
            console.error("Error sending contact email:", error);
            // エラーログをFirestoreに保存
            await admin.firestore().collection("inquiries").add({
                name,
                email,
                message,
                status: "failed",
                error: error instanceof Error ? error.message : "Unknown error",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            throw error;
        }
    }
    /**
     * Gmail APIを使用してメールを送信
     */
    async sendEmail(to, subject, htmlBody, textBody) {
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
        const from = `マイホームスターター <${functions.config().gmail.sender_email}>`;
        const messageParts = [
            `From: ${from}`,
            `To: ${to}`,
            `Subject: ${utf8Subject}`,
            "MIME-Version: 1.0",
            "Content-Type: multipart/alternative; boundary=\"boundary\"",
            "",
            "--boundary",
            "Content-Type: text/plain; charset=utf-8",
            "Content-Transfer-Encoding: base64",
            "",
            Buffer.from(textBody).toString("base64"),
            "",
            "--boundary",
            "Content-Type: text/html; charset=utf-8",
            "Content-Transfer-Encoding: base64",
            "",
            Buffer.from(htmlBody).toString("base64"),
            "",
            "--boundary--",
        ];
        const message = messageParts.join("\n");
        // Base64エンコード（URLセーフ）
        const encodedMessage = Buffer.from(message)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
        await this.gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage,
            },
        });
    }
    /**
     * 管理者向けメールのHTML本文を生成
     */
    createAdminEmailHtml(name, email, message, timestamp) {
        return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #4F46E5;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 30px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .info-table th {
      background-color: #f3f4f6;
      padding: 10px;
      text-align: left;
      border: 1px solid #e5e7eb;
      width: 30%;
    }
    .info-table td {
      padding: 10px;
      border: 1px solid #e5e7eb;
    }
    .message-box {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
      border: 1px solid #e5e7eb;
    }
    .footer {
      background-color: #f3f4f6;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>新規お問い合わせ</h1>
    </div>
    <div class="content">
      <p>以下の内容でお問い合わせを受け付けました。</p>
      
      <table class="info-table">
        <tr>
          <th>受信日時</th>
          <td>${timestamp}</td>
        </tr>
        <tr>
          <th>お名前</th>
          <td>${this.escapeHtml(name)}</td>
        </tr>
        <tr>
          <th>メールアドレス</th>
          <td><a href="mailto:${email}">${this.escapeHtml(email)}</a></td>
        </tr>
      </table>

      <h3>お問い合わせ内容</h3>
      <div class="message-box">
        <pre style="white-space: pre-wrap; word-wrap: break-word; font-family: inherit;">${this.escapeHtml(message)}</pre>
      </div>
    </div>
    <div class="footer">
      <p>このメールはマイホームスターターのお問い合わせフォームから自動送信されました。</p>
    </div>
  </div>
</body>
</html>
    `;
    }
    /**
     * 管理者向けメールのテキスト本文を生成
     */
    createAdminEmailText(name, email, message, timestamp) {
        return `
新規お問い合わせを受け付けました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせ情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

受信日時: ${timestamp}
お名前: ${name}
メールアドレス: ${email}

■ お問い合わせ内容
────────────────────────────────
${message}
────────────────────────────────

このメールはマイホームスターターのお問い合わせフォームから自動送信されました。
    `;
    }
    /**
     * ユーザー向け自動返信メールのHTML本文を生成
     */
    createUserEmailHtml(name, message, timestamp) {
        return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.8;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #4F46E5;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .content {
      padding: 40px 30px;
    }
    .message-box {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
      border-left: 4px solid #4F46E5;
    }
    .footer {
      background-color: #f3f4f6;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
    }
    .footer a {
      color: #4F46E5;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>お問い合わせありがとうございます</h1>
    </div>
    <div class="content">
      <p>${this.escapeHtml(name)} 様</p>
      
      <p>この度は、マイホームスターターへお問い合わせいただき、誠にありがとうございます。</p>
      <p>以下の内容でお問い合わせを受け付けました。</p>
      
      <div class="message-box">
        <p><strong>受信日時:</strong> ${timestamp}</p>
        <p><strong>お問い合わせ内容:</strong></p>
        <pre style="white-space: pre-wrap; word-wrap: break-word; font-family: inherit; margin: 10px 0 0 0;">${this.escapeHtml(message)}</pre>
      </div>
      
      <p>担当者より2営業日以内にご連絡させていただきます。<br>
      今しばらくお待ちくださいませ。</p>
      
      <p style="margin-top: 30px;">
        今後ともマイホームスターターをよろしくお願いいたします。
      </p>
    </div>
    <div class="footer">
      <p>
        <strong>マイホームスターター</strong><br>
        <a href="https://my-home-starter.com">https://my-home-starter.com</a>
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="font-size: 12px;">
        このメールは自動送信されています。<br>
        このメールに返信されても、お返事できませんのでご了承ください。
      </p>
    </div>
  </div>
</body>
</html>
    `;
    }
    /**
     * ユーザー向け自動返信メールのテキスト本文を生成
     */
    createUserEmailText(name, message, timestamp) {
        return `
${name} 様

この度は、マイホームスターターへお問い合わせいただき、誠にありがとうございます。

以下の内容でお問い合わせを受け付けました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
受信日時: ${timestamp}

お問い合わせ内容:
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

担当者より2営業日以内にご連絡させていただきます。
今しばらくお待ちくださいませ。

今後ともマイホームスターターをよろしくお願いいたします。

────────────────────────────────
マイホームスターター
https://my-home-starter.com
────────────────────────────────

※このメールは自動送信されています。
　このメールに返信されても、お返事できませんのでご了承ください。
    `;
    }
    /**
     * HTMLエスケープ処理
     */
    escapeHtml(text) {
        const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#39;",
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
}
exports.ContactEmailService = ContactEmailService;
//# sourceMappingURL=contactEmailService.js.map