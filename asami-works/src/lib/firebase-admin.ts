import * as admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// 初期化を遅延実行する関数
function ensureFirebaseInitialized() {
  if (admin.apps.length > 0) {
    return; // 既に初期化済み
  }

  console.log('[Firebase Admin] Initializing...');

  try {
    // 環境変数からサービスアカウントキーのJSONを取得（Vercel本番環境用）
    const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();

    console.log('[Firebase Admin] Environment check:', {
      hasEnvKey: !!envKey,
      envKeyLength: envKey?.length || 0,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    });

    if (envKey && envKey.length > 0) {
      console.log('[Firebase Admin] Using environment variable');
      const serviceAccount = JSON.parse(envKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
      console.log('[Firebase Admin] ✓ Initialized successfully with environment variable');
    }
    // ローカル開発: firebase-admin-key.jsonファイルを使用
    else {
      const serviceAccountPath = join(process.cwd(), 'firebase-admin-key.json');
      console.log('[Firebase Admin] Checking local file:', serviceAccountPath);

      if (!existsSync(serviceAccountPath)) {
        const errorMsg = 'Firebase Admin key not found. Environment variable FIREBASE_SERVICE_ACCOUNT_KEY is not set and local file does not exist.';
        console.error('[Firebase Admin] ✗', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('[Firebase Admin] Using local file');
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
      console.log('[Firebase Admin] ✓ Initialized successfully with local file');
    }
  } catch (error) {
    console.error('[Firebase Admin] ✗ Initialization failed:', error);
    throw error;
  }
}

// Lazy exports - 初回アクセス時に初期化を実行
let _auth: admin.auth.Auth | null = null;
let _db: admin.firestore.Firestore | null = null;

export const auth = new Proxy({} as admin.auth.Auth, {
  get(target, prop) {
    if (!_auth) {
      ensureFirebaseInitialized();
      _auth = admin.auth();
    }
    return (_auth as any)[prop];
  }
});

export const db = new Proxy({} as admin.firestore.Firestore, {
  get(target, prop) {
    if (!_db) {
      ensureFirebaseInitialized();
      _db = admin.firestore();
    }
    return (_db as any)[prop];
  }
});

export const Timestamp = admin.firestore.Timestamp;
export default admin;
