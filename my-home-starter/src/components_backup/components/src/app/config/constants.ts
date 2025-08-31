// src/app/config/constants.ts

// 実績データ（将来的には環境変数やDBから取得）
export const ACHIEVEMENTS = {
    totalUsers: 10, // 実際の数値に更新
    satisfactionRate: 100, // パーセント
    partnerCompanies: 12, // 提携企業数
    successStories: 5, // 成功事例数
  };
  
  // 失敗率データ（国土交通省などの統計から）
  export const FAILURE_STATS = {
    budgetOverrun: {
      percentage: 67,
      averageExcess: 23, // %
    },
    layoutRegret: {
      percentage: 54,
    },
    companySelection: {
      percentage: 41,
    },
  };
  
  // 予算内訳の目安
  export const BUDGET_BREAKDOWN = {
    construction: 70, // %
    miscellaneous: 10,
    exterior: 8,
    reserve: 12,
  };
  
  // サービスの特徴
  export const SERVICE_FEATURES = {
    consultationTime: 5, // 分
    fee: 0, // 円
    responseTime: 24, // 時間以内
  };
  
  // 使用例：
  // import { ACHIEVEMENTS } from '@/app/config/constants';
  // <span>{ACHIEVEMENTS.totalUsers}組の成功実績</span>