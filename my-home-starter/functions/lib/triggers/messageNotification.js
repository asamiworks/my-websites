"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageCreated = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const emailService_1 = require("../services/emailService");
exports.onMessageCreated = functions.firestore
    .document("messages/{messageId}")
    .onCreate(async (snapshot, _context) => {
    const messageData = snapshot.data();
    // 管理者からのメッセージのみ処理
    if (messageData.sender !== "admin") {
        return null;
    }
    try {
        // ユーザー情報を取得
        const userDoc = await admin
            .firestore()
            .collection("users")
            .doc(messageData.userId)
            .get();
        if (!userDoc.exists) {
            console.error("User not found:", messageData.userId);
            return null;
        }
        const userData = userDoc.data();
        // メール配信停止設定を確認
        if ((userData === null || userData === void 0 ? void 0 : userData.emailNotificationEnabled) === false) {
            console.log("Email notifications disabled for user:", messageData.userId);
            return null;
        }
        // ユーザーのメールアドレスを取得
        const authUser = await admin.auth().getUser(messageData.userId);
        const userEmail = authUser.email;
        if (!userEmail) {
            console.error("User email not found:", messageData.userId);
            return null;
        }
        // メール送信
        await (0, emailService_1.sendNotificationEmail)({
            to: userEmail,
            userName: (userData === null || userData === void 0 ? void 0 : userData.nickname) || "会員様",
            messagePreview: messageData.text.substring(0, 100) + "...",
            appUrl: process.env.APP_URL || "https://your-app-url.com",
        });
        console.log("Notification email sent to:", userEmail);
        return null;
    }
    catch (error) {
        console.error("Error sending notification:", error);
        return null;
    }
});
//# sourceMappingURL=messageNotification.js.map