import { google } from 'googleapis';

// 型定義
interface ContactData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  timestamp?: string;
  userAgent?: string;
  ip?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  message: string;
  error?: string;
}

/**
 * 環境変数を取得（Firebase Functions v2対応）
 */
function getEnvVar(key: string): string {
  // 環境変数から直接取得
  return process.env[key] || '';
}

/**
 * 日本語件名をBase64エンコードする関数
 */
function encodeSubject(subject: string): string {
  const encoded = Buffer.from(subject, 'utf8').toString('base64');
  return `=?UTF-8?B?${encoded}?=`;
}

/**
 * Gmail APIを使用してメール送信
 */
async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<EmailResult> {
  try {
    // 環境変数を取得
    const serviceAccountEmail = getEnvVar('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    const privateKey = getEnvVar('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n');
    const gmailUser = getEnvVar('GMAIL_USER');
    
    if (!serviceAccountEmail || !privateKey || !gmailUser) {
      console.error('Gmail configuration is missing:', {
        hasServiceAccount: !!serviceAccountEmail,
        hasPrivateKey: !!privateKey,
        hasGmailUser: !!gmailUser
      });
      throw new Error('Gmail configuration is missing');
    }
    
    // 1. JWT認証設定
    const jwtClient = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
      subject: gmailUser
    });
    
    await jwtClient.authorize();

    // 2. Gmail APIクライアント作成
    const gmail = google.gmail({ version: 'v1', auth: jwtClient });

    // 3. メールコンテンツ作成
    const from = gmailUser;
    const encodedSubject = encodeSubject(subject);
    
    const messageParts = [
      `From: "AsamiWorks" <${from}>`,
      `To: ${to}`,
      `Subject: ${encodedSubject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      html
    ];

    const message = messageParts.join('\r\n');
    const encodedMessage = Buffer.from(message, 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // 4. メール送信
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('Email sent successfully:', {
      to,
      messageId: result.data.id
    });

    return {
      success: true,
      messageId: result.data.id || undefined,
      message: 'メール送信成功'
    };

  } catch (error) {
    console.error('Gmail送信エラー:', error);
    return {
      success: false,
      error: (error as Error).message,
      message: 'メール送信失敗'
    };
  }
}

/**
 * 問い合わせ自動返信メール送信
 */
export async function sendAutoReply(contactData: ContactData): Promise<EmailResult> {
  const { name, email, company, message } = contactData;
  
  const subject = '【AsamiWorks】お問い合わせありがとうございます';
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
    お問い合わせありがとうございます
  </h2>
  
  <p>${name} 様</p>
  
  <p>この度は、AsamiWorksにお問い合わせいただき、誠にありがとうございます。<br>
  以下の内容でお問い合わせを承りました。</p>
  
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <h3 style="color: #333; margin-top: 0;">お問い合わせ内容</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; width: 100px;">お名前:</td>
        <td style="padding: 8px 0;">${name}</td>
      </tr>
      ${company ? `
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">会社名:</td>
        <td style="padding: 8px 0;">${company}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">メール:</td>
        <td style="padding: 8px 0;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">内容:</td>
        <td style="padding: 8px 0; white-space: pre-wrap;">${message}</td>
      </tr>
    </table>
  </div>
  
  <p>2営業日以内にご返信させていただきます。</p>
  
  <hr style="border: 1px solid #eee; margin: 30px 0;">
  
  <div style="color: #666; font-size: 14px;">
    <p><strong>AsamiWorks</strong><br>
    Email: info@asami-works.com<br>
    Web: https://asami-works.com</p>
    
    <p style="font-size: 12px;">
    このメールは自動送信されています。
    </p>
  </div>
</div>
  `;

  return await sendEmail({ to: email, subject, html });
}

/**
 * 管理者通知メール送信
 */
export async function sendAdminNotification(contactData: ContactData): Promise<EmailResult> {
  const { name, email, company, message } = contactData;
  const adminEmail = getEnvVar('ADMIN_EMAIL');
  
  if (!adminEmail) {
    console.error('Admin email is not configured');
    throw new Error('Admin email is not configured');
  }
  
  const subject = '【新規問い合わせ】AsamiWorksサイトより';
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #dc3545;">新規問い合わせが届きました</h2>
  
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; width: 100px;">お名前:</td>
        <td style="padding: 8px 0;">${name}</td>
      </tr>
      ${company ? `
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">会社名:</td>
        <td style="padding: 8px 0;">${company}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">メール:</td>
        <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">内容:</td>
        <td style="padding: 8px 0; white-space: pre-wrap;">${message}</td>
      </tr>
    </table>
  </div>
  
  <p style="color: #666;">速やかに対応してください。</p>
</div>
  `;

  return await sendEmail({ to: adminEmail, subject, html });
}