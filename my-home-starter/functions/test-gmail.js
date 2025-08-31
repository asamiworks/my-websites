const { google } = require('googleapis');

async function testGmail() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './service-account-key.json',
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
      clientOptions: {
        subject: 'noreply@my-home-starter.com',
      },
    });

    const gmail = google.gmail({ version: 'v1', auth });
    
    // APIへの接続をテスト
    const client = await auth.getClient();
    console.log('認証成功！');
    console.log('Subject email:', 'noreply@my-home-starter.com');
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

testGmail();
