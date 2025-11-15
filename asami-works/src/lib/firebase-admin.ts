import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  try {
    // 環境変数からサービスアカウントキーのJSONを取得
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
    }
    // ローカル開発: firebase-admin-key.jsonファイルを使用
    else {
      const serviceAccountPath = join(process.cwd(), 'firebase-admin-key.json');
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    console.error('Please download service account key from Firebase Console and save it as firebase-admin-key.json');
    throw error;
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
export const Timestamp = admin.firestore.Timestamp;
export default admin;
