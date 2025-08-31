// src/utils/syncLocalStorageWithFirebase.ts

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// ローカルストレージのキーの定義（すべてのキーを含む）
const SIMULATOR_KEYS = [
  'totalBudget',
  'annualIncome',
  'monthlyLoanRepayment',
  'downPayment',
  'spouseIncome',
  'spouseLoanRepayment',
  'houseSizeData',
  'ownershipStatus',
  'landBudget',
  'calculatedArea',
  'selectedPrefecture',
  'selectedCity',
  'q1',
  'q2',
  'pricePerTsubo',
  'detailedRoomData',  // 追加: 詳細な部屋情報
  'buildingLocation',  // 追加: 建築地情報
  'parkingCount',      // 追加: 駐車場の数
  'houseTypeDiagnosis' // 追加: 家づくりタイプ診断結果
];

export const syncLocalStorageWithFirebase = async (userId: string) => {
  try {
    console.log('ローカルストレージのデータをFirebaseに同期開始...');
    
    // ローカルストレージからデータを収集
    const localData: any = {};
    let hasData = false;

    SIMULATOR_KEYS.forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        try {
          // JSONとして解析を試みる
          localData[key] = JSON.parse(value);
          hasData = true;
        } catch {
          // JSON解析に失敗した場合は文字列として保存
          localData[key] = value;
          hasData = true;
        }
      }
    });

    if (!hasData) {
      console.log('同期するローカルデータがありません');
      return false;
    }

    // データ構造の変換処理
    // buildingLocationオブジェクトを構築（個別のキーから統合）
    if ((localData.selectedPrefecture || localData.selectedCity) && !localData.buildingLocation) {
      localData.buildingLocation = {
        prefecture: localData.selectedPrefecture || '',
        city: localData.selectedCity || ''
      };
      // 個別のキーは削除（オプション）
      delete localData.selectedPrefecture;
      delete localData.selectedCity;
    }

    // houseTypeDiagnosisオブジェクトを構築（個別のキーから統合）
    if ((localData.q1 !== undefined || localData.q2 !== undefined) && !localData.houseTypeDiagnosis) {
      localData.houseTypeDiagnosis = {
        q1: localData.q1 || 0,
        q2: localData.q2 || 0
      };
      // 個別のキーは削除（オプション）
      delete localData.q1;
      delete localData.q2;
    }

    // houseSizeDataの確認と変換
    if (localData.houseSizeData && typeof localData.houseSizeData === 'object') {
      // 数値型への変換を確実に
      localData.houseSizeData = {
        totalFloorArea: Number(localData.houseSizeData.totalFloorArea) || 0,
        floors: Number(localData.houseSizeData.floors) || 0,
        ldkSize: Number(localData.houseSizeData.ldkSize) || 0,
        ...localData.houseSizeData // その他のプロパティも保持
      };
    }

    // 数値型の確認と変換
    const numericFields = [
      'totalBudget',
      'annualIncome',
      'monthlyLoanRepayment',
      'downPayment',
      'spouseIncome',
      'spouseLoanRepayment',
      'landBudget',
      'calculatedArea',
      'pricePerTsubo',
      'parkingCount'
    ];

    numericFields.forEach(field => {
      if (localData[field] !== undefined && localData[field] !== null) {
        localData[field] = Number(localData[field]) || 0;
      }
    });

    // Firestoreの既存データを確認
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    let mergedData = { ...localData };
    
    if (userDoc.exists()) {
      // 既存データがある場合はマージ
      const existingData = userDoc.data();
      mergedData = {
        ...existingData,
        ...localData,
        // タイムスタンプを追加
        updatedAt: new Date(),
        lastSyncedAt: new Date()
      };
    } else {
      // 新規ユーザーの場合
      mergedData = {
        ...localData,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSyncedAt: new Date()
      };
    }

    // Firestoreに保存
    await setDoc(userDocRef, mergedData, { merge: true });
    
    console.log('データ同期が完了しました:', mergedData);
    
    // 同期完了後、ローカルストレージをクリア（オプション）
    // 必要に応じてコメントアウトを解除
    // SIMULATOR_KEYS.forEach(key => localStorage.removeItem(key));
    
    return true;
  } catch (error) {
    console.error('データ同期エラー:', error);
    throw error;
  }
};

// Firestoreからローカルストレージへの復元
export const restoreFromFirebase = async (userId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log('Firestoreにデータが見つかりません');
      return false;
    }

    const data = userDoc.data();
    
    // データをローカルストレージに復元
    SIMULATOR_KEYS.forEach(key => {
      if (data[key] !== undefined) {
        const value = typeof data[key] === 'object' 
          ? JSON.stringify(data[key]) 
          : String(data[key]);
        localStorage.setItem(key, value);
      }
    });

    // buildingLocationから個別のキーに展開（互換性のため）
    if (data.buildingLocation && typeof data.buildingLocation === 'object') {
      if (data.buildingLocation.prefecture) {
        localStorage.setItem('selectedPrefecture', data.buildingLocation.prefecture);
      }
      if (data.buildingLocation.city) {
        localStorage.setItem('selectedCity', data.buildingLocation.city);
      }
    }

    // houseTypeDiagnosisから個別のキーに展開（互換性のため）
    if (data.houseTypeDiagnosis && typeof data.houseTypeDiagnosis === 'object') {
      if (data.houseTypeDiagnosis.q1 !== undefined) {
        localStorage.setItem('q1', String(data.houseTypeDiagnosis.q1));
      }
      if (data.houseTypeDiagnosis.q2 !== undefined) {
        localStorage.setItem('q2', String(data.houseTypeDiagnosis.q2));
      }
    }
    
    console.log('Firestoreからデータを復元しました');
    return true;
  } catch (error) {
    console.error('データ復元エラー:', error);
    return false;
  }
};

// 特定のキーのみを同期する関数（部分更新用）
export const syncSpecificKeysToFirebase = async (userId: string, keys: string[]) => {
  try {
    const dataToSync: any = {};
    let hasData = false;

    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        try {
          dataToSync[key] = JSON.parse(value);
          hasData = true;
        } catch {
          dataToSync[key] = value;
          hasData = true;
        }
      }
    });

    if (!hasData) {
      console.log('同期するデータがありません');
      return false;
    }

    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      ...dataToSync,
      updatedAt: new Date(),
      lastPartialSyncedAt: new Date()
    }, { merge: true });

    console.log('部分同期が完了しました:', dataToSync);
    return true;
  } catch (error) {
    console.error('部分同期エラー:', error);
    return false;
  }
};