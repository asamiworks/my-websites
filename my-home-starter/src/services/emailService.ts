import * as sgMail from '@sendgrid/mail';
import * as functions from 'firebase-functions';

// SendGrid APIキーの設定
const apiKey = functions.config().sendgrid?.api_key;
if (apiKey) {
  sgMail.setApiKey(apiKey);
} else {
  console.error('SendGrid API key not found in environment variables');
}

interface EmailData {
  to: string;
  userName: string;
  messagePreview: string;
  appUrl: string;
}

export const sendNotificationEmail = async (data: EmailData): Promise<void> => {
  const { to, userName, messagePreview, appUrl } = data;
  
  const fromEmail = functions.config().sendgrid?.from_email || 'noreply@example.com';

  const msg = {
    to,
    from: fromEmail,
    subject: '新着メッセージがあります - マイホームスターター',
    html: `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
          }
          .header {
            background-color: #f59e0b;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 30px 20px;
          }
          .message-preview {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #f59e0b;
          }
          .button {
            display: inline-block;
            background-color: #f59e0b;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #eee;
          }
          .footer a {
            color: #f59e0b;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>マイホームスターター</h1>
          </div>
          <div class="content">
            <p>${userName} 様</p>
            <p>住宅コンシェルジュから新しいメッセージが届いています。</p>
            
            <div class="message-preview">
              <p><strong>メッセージの一部：</strong></p>
              <p>${messagePreview}</p>
            </div>
            
            <p>メッセージの全文は、マイページからご確認ください。</p>
            
            <div style="text-align: center;">
              <a href="${appUrl}/my-page" class="button">マイページを開く</a>
            </div>
          </div>
          <div class="footer">
            <p>このメールは、マイホームスターターからの自動送信メールです。</p>
            <p>メール配信を停止したい場合は、<a href="${appUrl}/my-page#settings">マイページの設定</a>から変更できます。</p>
            <p>&copy; 2025 マイホームスターター. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
${userName} 様

住宅コンシェルジュから新しいメッセージが届いています。

メッセージの一部：
${messagePreview}

メッセージの全文は、マイページからご確認ください。
${appUrl}/my-page

このメールは、マイホームスターターからの自動送信メールです。
メール配信を停止したい場合は、マイページの設定から変更できます。
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error: any) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('SendGrid error response:', error.response.body);
    }
    throw error;
  }
};
