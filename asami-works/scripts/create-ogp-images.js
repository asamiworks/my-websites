// scripts/create-ogp-images.js
// このスクリプトを実行してOGP画像を生成します
// 必要なパッケージ: npm install puppeteer

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const htmlTemplate = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1200, height=630">
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 1200px;
            height: 630px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .container {
            width: 90%;
            text-align: center;
            color: white;
        }
        .logo {
            font-size: 80px;
            font-weight: 800;
            margin-bottom: 20px;
            text-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
        .tagline {
            font-size: 40px;
            font-weight: 600;
            margin-bottom: 40px;
            opacity: 0.95;
        }
        .features {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 60px;
        }
        .feature {
            background: rgba(255, 255, 255, 0.15);
            padding: 20px 30px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        .feature-text {
            font-size: 24px;
            font-weight: 500;
        }
        .decoration {
            position: absolute;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            filter: blur(50px);
        }
        .decoration-1 {
            top: -150px;
            left: -150px;
        }
        .decoration-2 {
            bottom: -150px;
            right: -150px;
        }
    </style>
</head>
<body>
    <div class="decoration decoration-1"></div>
    <div class="decoration decoration-2"></div>
    <div class="container">
        <h1 class="logo">AsamiWorks</h1>
        <p class="tagline">補助金対応ホームページ制作</p>
        <div class="features">
            <div class="feature">
                <div class="feature-text">最大66.7%補助</div>
            </div>
            <div class="feature">
                <div class="feature-text">茨城・千葉対応</div>
            </div>
            <div class="feature">
                <div class="feature-text">SEO対策込み</div>
            </div>
        </div>
    </div>
</body>
</html>
`;

async function createOGPImages() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // ビューポートを設定
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2, // 高解像度
  });
  
  // HTMLを読み込む
  await page.setContent(htmlTemplate);
  
  // publicディレクトリに保存
  const publicDir = path.join(__dirname, '../public');
  
  // og-image.jpg として保存
  await page.screenshot({
    path: path.join(publicDir, 'og-image.jpg'),
    type: 'jpeg',
    quality: 90,
  });
  
  // twitter-card.jpg として保存
  await page.screenshot({
    path: path.join(publicDir, 'twitter-card.jpg'),
    type: 'jpeg',
    quality: 90,
  });
  
  await browser.close();
  
  console.log('OGP画像を生成しました:');
  console.log('- public/og-image.jpg');
  console.log('- public/twitter-card.jpg');
}

createOGPImages().catch(console.error);