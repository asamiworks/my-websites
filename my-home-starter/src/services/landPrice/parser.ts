import type { 
    LandPriceData, 
    LandPriceHistory,
    AreaLandPriceStats 
  } from './types';
  
  export class LandPriceDataParser {
    /**
     * 地価データから統計情報を計算
     */
    static calculateStats(data: LandPriceData[]): {
      averagePrice: number;
      medianPrice: number;
      maxPrice: number;
      minPrice: number;
      dataPoints: number;
    } {
      if (data.length === 0) {
        return {
          averagePrice: 0,
          medianPrice: 0,
          maxPrice: 0,
          minPrice: 0,
          dataPoints: 0
        };
      }
  
      const prices = data.map(d => d.currentPrice).filter(p => p > 0);
      
      if (prices.length === 0) {
        return {
          averagePrice: 0,
          medianPrice: 0,
          maxPrice: 0,
          minPrice: 0,
          dataPoints: 0
        };
      }
      
      prices.sort((a, b) => a - b);
  
      const medianIndex = Math.floor(prices.length / 2);
      const medianPrice = medianIndex < prices.length ? (prices[medianIndex] ?? 0) : 0;
      
      return {
        averagePrice: Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length),
        medianPrice: medianPrice,
        maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
        minPrice: prices.length > 0 ? Math.min(...prices) : 0,
        dataPoints: prices.length
      };
    }
  
    /**
     * 年度別データから推移情報を生成
     */
    static createPriceHistory(yearlyData: Map<number, LandPriceData[]>): LandPriceHistory[] {
      const history: LandPriceHistory[] = [];
      const years = Array.from(yearlyData.keys()).sort((a, b) => a - b);
  
      years.forEach((year, index) => {
        const data = yearlyData.get(year);
        if (!data || data.length === 0) return; // データがない場合はスキップ
        
        const stats = this.calculateStats(data);
        
        const historyItem: LandPriceHistory = {
          year,
          averagePrice: stats.averagePrice,
          dataCount: stats.dataPoints
        };
  
        // 前年比を計算
        if (index > 0) {
          const previousYearIndex = index - 1;
          const previousYear = years[previousYearIndex];
          if (previousYear !== undefined) {
            const previousData = yearlyData.get(previousYear);
            if (previousData && previousData.length > 0) {
              const previousStats = this.calculateStats(previousData);
              
              if (previousStats.averagePrice > 0) {
                historyItem.changeRate = 
                  ((stats.averagePrice - previousStats.averagePrice) / previousStats.averagePrice) * 100;
              }
            }
          }
        }
  
        history.push(historyItem);
      });
  
      return history;
    }
  
    /**
     * 地域の地価統計を生成
     */
    static createAreaStats(
      prefectureCode: string,
      prefectureName: string,
      cityCode: string,
      cityName: string,
      yearlyData: Map<number, LandPriceData[]>
    ): AreaLandPriceStats {
      const years = Array.from(yearlyData.keys()).sort();
      let latestYear = new Date().getFullYear();
      
      if (years.length > 0) {
        const lastYearIndex = years.length - 1;
        const lastYear = years[lastYearIndex];
        if (lastYear !== undefined) {
          latestYear = lastYear;
        }
      }
      
      const latestData = yearlyData.get(latestYear) || [];
      const stats = this.calculateStats(latestData);
      const history = this.createPriceHistory(yearlyData);
  
      // 前年比の計算
      let yearOverYearChange = 0;
      if (history.length >= 2) {
        const latestIndex = history.length - 1;
        const previousIndex = history.length - 2;
        const latest = history[latestIndex];
        const previous = history[previousIndex];
        if (latest && previous && previous.averagePrice > 0) {
          yearOverYearChange = 
            ((latest.averagePrice - previous.averagePrice) / previous.averagePrice) * 100;
        }
      }
  
      // 5年前比の計算
      let fiveYearChange: number | undefined;
      if (history.length >= 6) {
        const latestIndex = history.length - 1;
        const fiveYearsAgoIndex = history.length - 6;
        const latest = history[latestIndex];
        const fiveYearsAgo = history[fiveYearsAgoIndex];
        if (latest && fiveYearsAgo && fiveYearsAgo.averagePrice > 0) {
          fiveYearChange = 
            ((latest.averagePrice - fiveYearsAgo.averagePrice) / fiveYearsAgo.averagePrice) * 100;
        }
      }
  
      return {
        prefectureCode,
        prefectureName,
        cityCode,
        cityName,
        latestYear,
        ...stats,
        history,
        yearOverYearChange,
        fiveYearChange,
        lastUpdated: new Date()
      };
    }
  
    /**
     * 坪単価への変換
     */
    static convertToTsubo(pricePerSqm: number): number {
      return Math.round(pricePerSqm * 3.30578); // 1坪 = 3.30578㎡
    }
  
    /**
     * 価格のフォーマット
     */
    static formatPrice(price: number): string {
      if (price >= 10000) {
        return `${(price / 10000).toFixed(1)}万円`;
      }
      return `${price.toLocaleString()}円`;
    }
  
    /**
     * 地価データのグループ化（用途別など）
     */
    static groupByLandUse(data: LandPriceData[]): Map<string, LandPriceData[]> {
      const grouped = new Map<string, LandPriceData[]>();
      
      data.forEach(item => {
        const use = item.landUse || 'その他';
        if (!grouped.has(use)) {
          grouped.set(use, []);
        }
        const group = grouped.get(use);
        if (group) {
          group.push(item);
        }
      });
      
      return grouped;
    }
  }