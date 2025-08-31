const { https } = require('firebase-functions/v2');
const path = require('path');
const fs = require('fs');

// 環境変数ファイルを読み込む（優先順位: .env.local > .env）
const envLocalPath = path.join(__dirname, '.env.local');
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envLocalPath)) {
  console.log('Loading .env.local');
  require('dotenv').config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  console.log('Loading .env');
  require('dotenv').config({ path: envPath });
}

// Next.jsアプリの初期化
const next = require('next');
const app = next({
  dev: false,
  conf: { distDir: '.next' }
});

const handle = app.getRequestHandler();

// メインのCloud Function
exports.nextjsApp = https.onRequest(
  {
    timeoutSeconds: 300,
    memory: '2GiB',
    region: 'asia-northeast1',
    maxInstances: 10
  },
  async (req, res) => {
    try {
      await app.prepare();
      await handle(req, res);
    } catch (error) {
      console.error('Error serving Next.js app:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);