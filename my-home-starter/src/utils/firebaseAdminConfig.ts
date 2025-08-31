import * as admin from "firebase-admin";

const firebaseAdminApp =
  admin.apps.length > 0
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });

export const authAdmin = firebaseAdminApp.auth();
export const dbAdmin = firebaseAdminApp.firestore();
export default firebaseAdminApp;
