"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmail = exports.lineAuth = void 0;
const admin = require("firebase-admin");
const https_1 = require("firebase-functions/v2/https");
const v2_1 = require("firebase-functions/v2");
const contactEmailService_1 = require("./services/contactEmailService");
// Firebase Admin SDKの初期化
admin.initializeApp();
// グローバルオプションの設定（リージョンなど）
(0, v2_1.setGlobalOptions)({
    region: "asia-northeast1",
});
// LINE認証関数
var lineAuth_1 = require("./auth/lineAuth");
Object.defineProperty(exports, "lineAuth", { enumerable: true, get: function () { return lineAuth_1.lineAuth; } });
// 問い合わせメール送信関数
exports.sendContactEmail = (0, https_1.onCall)(async (request) => {
    const { data } = request;
    // 入力値の検証
    const { name, email, message } = data;
    if (!name || !email || !message) {
        throw new https_1.HttpsError("invalid-argument", "必須項目が入力されていません。");
    }
    // メールアドレスの簡易検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new https_1.HttpsError("invalid-argument", "有効なメールアドレスを入力してください。");
    }
    try {
        const emailService = new contactEmailService_1.ContactEmailService();
        await emailService.sendContactEmail({ name, email, message });
        return {
            success: true,
            message: "お問い合わせを受け付けました。",
        };
    }
    catch (error) {
        console.error("Error sending contact email:", error);
        throw new https_1.HttpsError("internal", "メール送信中にエラーが発生しました。");
    }
});
//# sourceMappingURL=index.js.map