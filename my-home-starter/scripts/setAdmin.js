const admin = require("firebase-admin");

// サービスアカウントキーをロード（適切なパスに変更）
const serviceAccount = require("../server/firebaseServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setAdminClaim(uid, email) {
  if (email.endsWith("@my-home-starter.com")) {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`管理者権限を付与しました: ${email}`);
  } else {
    console.log(`管理者権限なし: ${email}`);
  }
}

// テスト用のUIDとメールアドレス
const userUid = "IZXRIDqsqBZ5oErEgpyHPbq86QZ2";  // 実際のUIDを入力
const userEmail = "info@my-home-starter.com";  // 実際のメールアドレスを入力

setAdminClaim(userUid, userEmail).catch(console.error);
