import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import * as dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

// 環境変数から設定を取得
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// 必須の環境変数が設定されているかチェック
const requiredEnvVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN', 
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID'
];

// 開発環境でのデバッグ用チェック
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Error: ${varName} is not set in environment variables`);
  }
});

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUser: any = null;

// 匿名認証を初期化
export const initAuth = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUser = user;
        resolve(user);
      } else {
        try {
          const result = await signInAnonymously(auth);
          currentUser = result.user;
          resolve(result.user);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
};

// 認証トークンを取得
export const getAuthToken = async () => {
  if (!currentUser) {
    await initAuth();
  }
  return currentUser.getIdToken();
};