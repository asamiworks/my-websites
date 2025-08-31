import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAdUWrBjTl__ONufwpBEdpMeqtR6kQlWSw",
  authDomain: "asamiworks-679b3.firebaseapp.com",
  projectId: "asamiworks-679b3",
  storageBucket: "asamiworks-679b3.firebasestorage.app",
  messagingSenderId: "557648295053",
  appId: "YOUR_FIREBASE_APP_ID" // Firebase Consoleから取得
};

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
