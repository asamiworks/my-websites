import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  EmailAuthProvider,
  linkWithCredential,
  User,
} from "firebase/auth";
import { app } from "./firebaseConfig";

const auth = getAuth(app);

export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

export const createAccount = async (email: string, password: string): Promise<void> => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("アカウント作成エラー:", error);
    throw error;
  }
};

export const signInAnonymouslyForSimulator = async (): Promise<string> => {
  try {
    const result = await signInAnonymously(auth);
    return result.user.uid;
  } catch (error) {
    console.error("匿名ログインエラー:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("ログインエラー:", error);
    throw error;
  }
};

export const upgradeToPermanentAccount = async (email: string, password: string): Promise<string> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("現在のユーザーが見つかりません");
    }
    
    const credential = EmailAuthProvider.credential(email, password);
    const userCredential = await linkWithCredential(currentUser, credential);
    return userCredential.user.uid;
  } catch (error) {
    console.error("アカウントアップグレードエラー:", error);
    throw error;
  }
};

export { auth };