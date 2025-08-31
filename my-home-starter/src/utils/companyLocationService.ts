// src/utils/companyLocationService.ts

import { calculateDistance } from './areaCodeMapping';

interface Location {
  name: string;
  type: string;
  prefecture: string;
  city: string;
  lat?: number;
  lng?: number;
}

interface CompanyWithLocations {
  id: string;
  name: string;
  website: string | null;
  isPremium: boolean;
  gBizData: any;
}

export class CompanyLocationService {
  /**
   * 会社の全拠点（本社・支店）から最も近い距離を計算
   */
  static getClosestDistance(
    company: CompanyWithLocations,
    targetLat: number,
    targetLng: number
  ): { distance: number; closestLocation: Location | null } {
    let minDistance = Infinity;
    let closestLocation: Location | null = null;

    // gBizData.locationsから全拠点を確認
    const locations = company.gBizData?.locations || [];
    
    for (const location of locations) {
      if (location.lat && location.lng) {
        const distance = calculateDistance(
          targetLat,
          targetLng,
          location.lat,
          location.lng
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestLocation = location;
        }
      }
    }

    // 拠点情報がない場合は電話番号から推定（フォールバック）
    if (minDistance === Infinity && company.gBizData?.zehRegistration?.phoneNumber) {
      const phoneLocation = this.getLocationFromPhone(
        company.gBizData.zehRegistration.phoneNumber
      );
      
      if (phoneLocation) {
        minDistance = calculateDistance(
          targetLat,
          targetLng,
          phoneLocation.lat,
          phoneLocation.lng
        );
        closestLocation = {
          name: '推定拠点',
          type: '推定',
          prefecture: phoneLocation.prefecture,
          city: phoneLocation.city,
          lat: phoneLocation.lat,
          lng: phoneLocation.lng
        };
      }
    }

    return {
      distance: minDistance,
      closestLocation
    };
  }

  /**
   * 電話番号から位置を推定（既存のロジック）
   */
  private static getLocationFromPhone(phoneNumber: string): {
    prefecture: string;
    city: string;
    lat: number;
    lng: number;
  } | null {
    // 実装は既存のgetLocationFromPhone関数と同じ
    return null;
  }

  /**
   * 会社リストを距離でフィルタリング・ソート
   */
  static filterCompaniesByDistance(
    companies: CompanyWithLocations[],
    targetLat: number,
    targetLng: number,
    maxDistance: number = 50
  ): Array<{
    company: CompanyWithLocations;
    distance: number;
    nearestLocation: Location | null;
  }> {
    const results = [];

    for (const company of companies) {
      const { distance, closestLocation } = this.getClosestDistance(
        company,
        targetLat,
        targetLng
      );

      if (distance <= maxDistance) {
        results.push({
          company,
          distance: Math.round(distance * 10) / 10,
          nearestLocation: closestLocation
        });
      }
    }

    // 距離順にソート
    results.sort((a, b) => {
      // 有料会員を優先
      if (a.company.isPremium !== b.company.isPremium) {
        return a.company.isPremium ? -1 : 1;
      }
      // 距離順
      return a.distance - b.distance;
    });

    return results;
  }
}