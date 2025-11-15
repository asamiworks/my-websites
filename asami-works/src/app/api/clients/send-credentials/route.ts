import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, clientName, mypageUrl, password } = body;

    // バリデーション
    if (!email || !clientName || !mypageUrl || !password) {
      return NextResponse.json(
        { error: '必須パラメータが不足しています' },
        { status: 400 }
      );
    }

    // Firebase Cloud FunctionのchatInquiry関数を呼び出してメール送信
    // (既存のGmail送信機能を再利用)
    const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
    マイページのログイン情報
  </h2>

  <p>${clientName} 様</p>

  <p>AsamiWorksマイページへのログイン情報をお送りします。<br>
  以下の情報を使用してログインしてください。</p>

  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <h3 style="color: #333; margin-top: 0;">ログイン情報</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; width: 150px;">マイページURL:</td>
        <td style="padding: 8px 0;"><a href="${mypageUrl}">${mypageUrl}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">メールアドレス:</td>
        <td style="padding: 8px 0;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">初期パスワード:</td>
        <td style="padding: 8px 0; font-family: monospace; background-color: #fff; padding: 8px; border-radius: 3px;">${password}</td>
      </tr>
    </table>
  </div>

  <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
    <p style="margin: 0; font-weight: bold; color: #856404;">⚠️ セキュリティ上の注意</p>
    <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #856404;">
      <li>初回ログイン後、必ずパスワードを変更してください</li>
      <li>このメールは転送せず、安全に保管してください</li>
      <li>パスワードは第三者に教えないでください</li>
    </ul>
  </div>

  <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>

  <hr style="border: 1px solid #eee; margin: 30px 0;">

  <div style="color: #666; font-size: 14px;">
    <p><strong>AsamiWorks</strong><br>
    Email: info@asami-works.com<br>
    Web: https://asami-works.com</p>
  </div>
</div>
    `;

    // Cloud Functions経由でメール送信
    const cloudFunctionUrl = 'https://us-central1-asamiworks-679b3.cloudfunctions.net/contact';

    const response = await fetch(cloudFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: clientName,
        email,
        company: 'AsamiWorks Client',
        message: `マイページログイン情報\n\nURL: ${mypageUrl}\nEmail: ${email}\nPassword: ${password}`,
      }),
    });

    if (!response.ok) {
      throw new Error('メール送信に失敗しました');
    }

    return NextResponse.json({
      success: true,
      message: 'ログイン情報をメールで送信しました',
    });

  } catch (error: any) {
    console.error('Error sending credentials:', error);
    return NextResponse.json(
      { error: error.message || 'メール送信に失敗しました' },
      { status: 500 }
    );
  }
}
