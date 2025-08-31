// src/utils/fetchUserDataFromFirebase.ts

import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const fetchUserDataFromFirebase = async (userId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log('ユーザーデータが見つかりません');
      return null;
    }
  } catch (error) {
    console.error('ユーザーデータ取得エラー:', error);
    return null;
  }
};