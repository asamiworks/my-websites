"use strict";
const __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  let desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {enumerable: true, get: function() {
      return m[k];
    }};
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", {enumerable: true, value: v});
}) : function(o, v) {
  o["default"] = v;
});
const __importStar = (this && this.__importStar) || function(mod) {
  if (mod && mod.__esModule) return mod;
  const result = {};
  if (mod != null) for (const k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
const __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.onMessageCreated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const emailService_1 = require("../services/emailService");
exports.onMessageCreated = functions.firestore
  .document("messages/{messageId}")
  .onCreate((snapshot, _context) => __awaiter(void 0, void 0, void 0, function* () {
    const messageData = snapshot.data();
    // 管理者からのメッセージのみ処理
    if (messageData.sender !== "admin") {
      return null;
    }
    try {
      // ユーザー情報を取得
      const userDoc = yield admin
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
      const authUser = yield admin.auth().getUser(messageData.userId);
      const userEmail = authUser.email;
      if (!userEmail) {
        console.error("User email not found:", messageData.userId);
        return null;
      }
      // メール送信
      yield (0, emailService_1.sendNotificationEmail)({
        to: userEmail,
        userName: (userData === null || userData === void 0 ? void 0 : userData.nickname) || "会員様",
        messagePreview: messageData.text.substring(0, 100) + "...",
        appUrl: process.env.APP_URL || "https://your-app-url.com",
      });
      console.log("Notification email sent to:", userEmail);
      return null;
    } catch (error) {
      console.error("Error sending notification:", error);
      return null;
    }
  }));
