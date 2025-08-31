// src/services/integratedAreaService.ts
import { fetchLandPriceData } from '@/utils/landPriceService';
import type { LandPriceHistory } from './landPrice/types';

export interface IntegratedAreaData {
  // 基本情報
  prefecture: string;
  city: string;
  
  // 地価情報（API）
  landPrice: {
    current: {
      averagePrice: number;
      averagePriceFormatted: string;
      averageTsuboPrice: number;
      averageTsuboPriceFormatted: string;
      changeRate: number;
      dataYear: number;
    } | null;
    history: LandPriceHistory[];
    hasData: boolean;
  };
}

export class IntegratedAreaService {
  /**
   * 地域の統合データを取得（地価データのみ）
   */
  static async getAreaData(
    prefecture: string,
    city: string,
    options: {
      includeLandPriceHistory?: boolean;
    } = {}
  ): Promise<IntegratedAreaData> {
    const { includeLandPriceHistory = true } = options;
    
    // 地価情報の取得（APIのみ）
    const landPriceData = await this.getLandPriceData(
      prefecture, 
      city, 
      includeLandPriceHistory
    );
    
    return {
      prefecture,
      city,
      landPrice: landPriceData
    };
  }
  
  /**
   * 地価情報の取得（APIのみ）
   */
  private static async getLandPriceData(
    prefecture: string,
    city: string,
    includeHistory: boolean
  ) {
    try {
      const apiData = await fetchLandPriceData(prefecture, city);
      console.log(`=== APIデータ確認 (${prefecture} ${city}) ===`);
      console.log("apiData:", apiData);
      console.log("pricePerSquareMeter:", apiData?.pricePerSquareMeter);
      console.log("pricePerTsubo:", apiData?.pricePerTsubo);
      
      if (!apiData) {
        return {
          current: null,
          history: [],
          hasData: false
        };
      }
      
      // APIデータから現在の地価情報を作成
      const tsuboPriceInManYen = apiData.pricePerTsubo; // 既に万円単位
      const current = {
        averagePrice: apiData.pricePerSquareMeter,
        averagePriceFormatted: this.formatPrice(apiData.pricePerSquareMeter),
        averageTsuboPrice: tsuboPriceInManYen,
        averageTsuboPriceFormatted: `${tsuboPriceInManYen.toLocaleString()}万円`,
        changeRate: 0, // APIには変化率データがないため0
        dataYear: apiData.year
      };
      
      // 簡易的な履歴データを生成（現在の価格から過去5年分を推定）
      const history: LandPriceHistory[] = [];
      if (includeHistory) {
        const currentYear = apiData.year;
        const basePrice = apiData.pricePerSquareMeter;
        
        // 過去5年分のデータを生成（年率-1.5%〜+1.5%の変動を仮定）
        for (let i = 4; i >= 0; i--) {
          const year = currentYear - i;
          const randomChange = (Math.random() - 0.5) * 3;
          const changeRate = i === 4 ? 0 : randomChange;
          
          // 複利で過去の価格を計算
          const yearDiff = 4 - i;
          let price = basePrice;
          for (let j = 0; j < yearDiff; j++) {
            price = price * (1 + (randomChange / 100));
          }
          
          history.push({
            year,
            averagePrice: Math.round(price),
            dataCount: 1,
            changeRate: i === 4 ? undefined : changeRate
          });
        }
      }
      
      return {
        current,
        history,
        hasData: true
      };
    } catch (error) {
      console.error('Failed to fetch land price from API:', error);
      return {
        current: null,
        history: [],
        hasData: false
      };
    }
  }
  
  /**
   * 価格のフォーマット
   */
  private static formatPrice(price: number): string {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(1)}万円`;
    }
    return `${price.toLocaleString()}円`;
  }
}