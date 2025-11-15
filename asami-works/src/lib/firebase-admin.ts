import * as admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  try {
    // 環境変数からサービスアカウントキーのJSONを取得（Vercel本番環境用）
    const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();

    if (envKey && envKey.length > 0) {
      console.log('Using FIREBASE_SERVICE_ACCOUNT_KEY from environment variable');
      const serviceAccount = JSON.parse(envKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
      console.log('Firebase Admin initialized successfully with environment variable');
    }
    // ローカル開発: firebase-admin-key.jsonファイルを使用
    else {
      const serviceAccountPath = join(process.cwd(), 'firebase-admin-key.json');

      // ファイルが存在しない場合（Vercelビルド時など）はスキップ
      if (!existsSync(serviceAccountPath)) {
        console.warn('Firebase Admin key file not found and no environment variable set.');
        console.warn('This is expected during build time. Initialization will happen at runtime.');
        // ビルド時は初期化をスキップ（ランタイムで再度試行される）
      } else {
        console.log('Using firebase-admin-key.json from local file system');
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id
        });
        console.log('Firebase Admin initialized successfully with local file');
      }
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // ビルド時のエラーは警告に留める（ランタイムで再試行される）
    if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
      console.warn('Initialization failed, but this may be expected during build. Will retry at runtime.');
    } else {
      throw error;
    }
  }
}

// Lazy exports to avoid errors during build time
let _auth: admin.auth.Auth | null = null;
let _db: admin.firestore.Firestore | null = null;

export const auth = new Proxy({} as admin.auth.Auth, {
  get(target, prop) {
    if (!_auth) {
      _auth = admin.auth();
    }
    return (_auth as any)[prop];
  }
});

export const db = new Proxy({} as admin.firestore.Firestore, {
  get(target, prop) {
    if (!_db) {
      _db = admin.firestore();
    }
    return (_db as any)[prop];
  }
});

export const Timestamp = admin.firestore.Timestamp;
export default admin;
