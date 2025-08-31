// src/utils/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// Auth、Firestore、Storage、Functions のインスタンスを取得
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// リージョンを指定してFunctionsを初期化
export const functions = getFunctions(app, 'asia-northeast1');

// 開発環境でエミュレータに接続
if (process.env.NODE_ENV === 'development') {
  // 既に接続されているかチェック（HMRによる重複接続を防ぐ）
  if (typeof window !== 'undefined' && !(window as any).__FIREBASE_EMULATORS_CONNECTED__) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9100');
      connectFirestoreEmulator(db, 'localhost', 8084);
      connectStorageEmulator(storage, 'localhost', 9199);
      // localhostを使用（127.0.0.1ではなく）
      connectFunctionsEmulator(functions, 'localhost', 5001);
      
      (window as any).__FIREBASE_EMULATORS_CONNECTED__ = true;
      console.log('Firebase エミュレータに接続しました');
    } catch (error) {
      console.error('エミュレータ接続エラー:', error);
    }
  }
}

export { app };