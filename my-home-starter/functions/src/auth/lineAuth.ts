// functions/src/auth/lineAuth.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const lineAuth = functions.https.onRequest(async (req, res) => {
  // CORSヘッダーを設定
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONSリクエストの処理
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const {lineUserId, displayName, pictureUrl} = req.body;

    if (!lineUserId) {
      res.status(400).json({error: "Missing lineUserId"});
      return;
    }

    // Firebase ユーザーを作成または取得
    const uid = `line:${lineUserId}`;

    try {
      // 既存のユーザーを取得
      await admin.auth().getUser(uid);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        // 新規ユーザーを作成
        await admin.auth().createUser({
          uid: uid,
          displayName: displayName || "LINE User",
          photoURL: pictureUrl,
        });
      } else {
        throw error;
      }
    }

    // カスタムトークンを生成
    const customToken = await admin.auth().createCustomToken(uid, {
      provider: "line",
      lineUserId: lineUserId,
    });

    res.status(200).json({customToken});
  } catch (error) {
    console.error("LINE Auth Error:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});
