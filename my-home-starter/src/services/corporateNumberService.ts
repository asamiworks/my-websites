// src/services/corporateNumberService.ts

import axios from 'axios';

// 国税庁法人番号公表サイトAPI
const HOUJIN_BANGOU_API = 'https://api.houjin-bangou.nta.go.jp';

export interface CorporateInfo {
  corporateNumber: string;
  name: string;
  nameKana?: string;
  address: string;
  prefecture: string;
  city: string;
  postalCode?: string;
  updateDate: string;
}

export interface HoujinBangouResponse {
  lastUpdateDate: string;
  count: number;
  divideNumber: number;
  divideSize: number;
  corporations: Array<{
    sequenceNumber: number;
    corporateNumber: string;
    process: string;
    correct: string;
    updateDate: string;
    changeDate: string;
    name: string;
    nameImageId: string | null;
    kind: string;
    prefectureName: string;
    cityName: string;
    streetNumber: string;
    addressImageId: string | null;
    prefectureCode: string;
    cityCode: string;
    postCode: string;
    addressOutside: string | null;
    addressOutsideImageId: string | null;
    closeDate: string | null;
    closeCause: string | null;
    successorCorporateNumber: string | null;
    changeCause: string | null;
    assignmentDate: string;
    latest: number;
    enName: string | null;
    enPrefectureName: string | null;
    enCityName: string | null;
    enAddressOutside: string | null;
    furigana: string | null;
    hihyoji: number;
  }>;
}

export class CorporateNumberService {
  private apiVersion = '4';
  private appId: string;

  constructor(appId?: string) {
    // 環境変数からアプリケーションIDを取得
    this.appId = appId || process.env.HOUJIN_BANGOU_APP_ID || '';
  }

  /**
   * 会社名から法人番号を検索
   */
  async searchByName(companyName: string, prefecture?: string): Promise<CorporateInfo[]> {
    try {
      // 会社名の正規化（株式会社、有限会社などの法人格を考慮）
      const normalizedName = this.normalizeCompanyName(companyName);
      
      const params: Record<string, string> = {
        name: normalizedName,
        type: '12', // JIS X 0401 都道府県コード + JIS X 0402 市区町村コード
        mode: '2',  // 前方一致検索
      };

      if (this.appId) {
        params.id = this.appId;
      }

      const response = await axios.get<HoujinBangouResponse>(
        `${HOUJIN_BANGOU_API}/v${this.apiVersion}/name`,
        { params }
      );

      if (!response.data.corporations || response.data.corporations.length === 0) {
        return [];
      }

      // 結果をCorporateInfo型に変換
      const results = response.data.corporations.map(corp => ({
        corporateNumber: corp.corporateNumber,
        name: corp.name,
        nameKana: corp.furigana || undefined,
        address: `${corp.prefectureName}${corp.cityName}${corp.streetNumber}`,
        prefecture: corp.prefectureName,
        city: corp.cityName,
        postalCode: corp.postCode,
        updateDate: corp.updateDate
      }));

      // 都道府県でフィルタリング（指定されている場合）
      if (prefecture) {
        return results.filter(corp => corp.prefecture === prefecture);
      }

      return results;
    } catch (error) {
      console.error('法人番号の検索に失敗しました:', error);
      return [];
    }
  }

  /**
   * 法人番号から詳細情報を取得
   */
  async getByNumber(corporateNumber: string): Promise<CorporateInfo | null> {
    try {
      const params: Record<string, string> = {
        number: corporateNumber,
        type: '12',
      };

      if (this.appId) {
        params.id = this.appId;
      }

      const response = await axios.get<HoujinBangouResponse>(
        `${HOUJIN_BANGOU_API}/v${this.apiVersion}/num`,
        { params }
      );

      if (!response.data.corporations || response.data.corporations.length === 0) {
        return null;
      }

      const corp = response.data.corporations[0];
      return {
        corporateNumber: corp.corporateNumber,
        name: corp.name,
        nameKana: corp.furigana || undefined,
        address: `${corp.prefectureName}${corp.cityName}${corp.streetNumber}`,
        prefecture: corp.prefectureName,
        city: corp.cityName,
        postalCode: corp.postCode,
        updateDate: corp.updateDate
      };
    } catch (error) {
      console.error('法人情報の取得に失敗しました:', error);
      return null;
    }
  }

  /**
   * 会社名を正規化（検索用）
   */
  private normalizeCompanyName(name: string): string {
    // 法人格の表記ゆれを統一
    let normalized = name
      .replace(/株式会社/g, '')
      .replace(/\(株\)/g, '')
      .replace(/（株）/g, '')
      .replace(/有限会社/g, '')
      .replace(/\(有\)/g, '')
      .replace(/（有）/g, '')
      .replace(/合同会社/g, '')
      .replace(/\(同\)/g, '')
      .replace(/（同）/g, '')
      .trim();

    // スペースを除去
    normalized = normalized.replace(/\s+/g, '');

    return normalized;
  }

  /**
   * 複数の会社名から法人番号を一括検索
   */
  async searchBatch(
    companyNames: Array<{ name: string; prefecture?: string }>
  ): Promise<Map<string, CorporateInfo>> {
    const results = new Map<string, CorporateInfo>();

    // APIレート制限を考慮して、順次処理
    for (const company of companyNames) {
      try {
        const corporateInfos = await this.searchByName(company.name, company.prefecture);
        
        if (corporateInfos.length > 0) {
          // 最も可能性の高い結果を選択（同じ都道府県を優先）
          const bestMatch = corporateInfos.find(info => 
            info.prefecture === company.prefecture
          ) || corporateInfos[0];
          
          results.set(company.name, bestMatch);
        }

        // レート制限対策（1秒待機）
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`法人番号検索エラー (${company.name}):`, error);
      }
    }

    return results;
  }
}

/**
 * 使用例
 */
export async function enrichCompanyWithCorporateNumber(
  companyName: string,
  prefecture: string
): Promise<string | null> {
  const service = new CorporateNumberService();
  const results = await service.searchByName(companyName, prefecture);
  
  if (results.length > 0) {
    // 完全一致を優先
    const exactMatch = results.find(
      corp => corp.name === companyName
    );
    
    if (exactMatch) {
      return exactMatch.corporateNumber;
    }
    
    // 部分一致でも可
    return results[0].corporateNumber;
  }
  
  return null;
}