// src/utils/gbizinfoService.ts

import axios from 'axios';

// gBizINFO APIのベースURL
const GBIZ_API_BASE = 'https://info.gbiz.go.jp/api/v1';

// APIトークン（環境変数に保存）
const API_TOKEN = process.env.GBIZ_API_TOKEN;

// 会社タイプの定義
export type CompanyType = 'ハウスメーカー' | '工務店' | '設計事務所';

// 内部フォーマットの型定義
export interface CompanyBasicInfo {
  name: string;
  nameKana: string;
  establishedYear?: number;
  capital?: number;
  employees?: number;
  address: {
    prefecture: string;
    city: string;
    street: string;
    postalCode: string;
  };
  licenses: {
    constructionLicense: string;
    takkenLicense?: string;
  };
  companyType: CompanyType;
  dataSource: 'api' | 'manual';
}

// 企業情報の型定義
export interface GBizCompany {
  corporate_number: string;
  name: string;
  name_kana?: string;
  postal_code?: string;
  location?: string;
  status?: string;
  date_of_establishment?: string;
  capital_stock?: number;
  employee_number?: number;
  business_summary?: string;
  // 認定・許可情報
  certifications?: {
    // 建設業許可
    construction_license?: {
      license_number: string;
      license_type: string;
      expiry_date: string;
      construction_types: string[];
    }[];
    // 宅建業免許
    real_estate_license?: {
      license_number: string;
      expiry_date: string;
    };
  };
}

// 検索パラメータ
export interface GBizSearchParams {
  keyword?: string;          // キーワード検索
  prefecture?: string;       // 都道府県
  city?: string;            // 市区町村
  business_type?: string;    // 業種
  min_capital?: number;      // 最低資本金
  max_capital?: number;      // 最高資本金
  min_employees?: number;    // 最低従業員数
  max_employees?: number;    // 最高従業員数
  page?: number;            // ページ番号
  per_page?: number;        // 1ページあたりの件数
}

// 建設業種コード（注文住宅に関連するもの）
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const _CONSTRUCTION_TYPES = {
//   '土木工事業': '01',
//   '建築工事業': '02',  // 主にこれ
//   '大工工事業': '03',  // これも重要
//   '左官工事業': '04',
//   '屋根工事業': '08',
//   '電気工事業': '09',
//   '管工事業': '10',
//   '内装仕上工事業': '27',
//   '建具工事業': '28'
// };

class GBizInfoService {
  // 企業検索
  async searchCompanies(params: GBizSearchParams): Promise<{
    companies: GBizCompany[];
    total: number;
    page: number;
    per_page: number;
  }> {
    try {
      const response = await axios.get(`${GBIZ_API_BASE}/corporations`, {
        headers: {
          'X-API-TOKEN': API_TOKEN
        },
        params: {
          keyword: params.keyword,
          prefecture: params.prefecture,
          city: params.city,
          business_type: '建設業',
          capital_stock_from: params.min_capital,
          capital_stock_to: params.max_capital,
          employee_number_from: params.min_employees,
          employee_number_to: params.max_employees,
          page: params.page || 1,
          per_page: params.per_page || 20
        }
      });

      return {
        companies: response.data.results,
        total: response.data.total_count,
        page: response.data.current_page,
        per_page: response.data.per_page
      };
    } catch (error) {
      console.error('gBizINFO API Error:', error);
      throw error;
    }
  }

  // 企業詳細情報取得
  async getCompanyDetail(corporateNumber: string): Promise<GBizCompany> {
    try {
      const response = await axios.get(
        `${GBIZ_API_BASE}/corporation/${corporateNumber}`,
        {
          headers: {
            'X-API-TOKEN': API_TOKEN
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('gBizINFO API Error:', error);
      throw error;
    }
  }

  // 建設業許可を持つ企業のみフィルタリング
  filterConstructionCompanies(companies: GBizCompany[]): GBizCompany[] {
    return companies.filter(company => {
      // 建設業許可を持っているか確認
      const hasConstructionLicense = company.certifications?.construction_license?.some(
        license => {
          // 建築工事業または大工工事業の許可を持っているか
          return license.construction_types.some(type => 
            type.includes('建築工事業') || type.includes('大工工事業')
          );
        }
      );

      return hasConstructionLicense;
    });
  }

  // gBizINFOデータを内部フォーマットに変換
  convertToInternalFormat(gbizCompany: GBizCompany): Partial<CompanyBasicInfo> {
    // 住所を都道府県と市区町村に分割
    const [prefecture, ...cityParts] = gbizCompany.location?.split(/(?=市|区|町|村)/) || [];
    const city = cityParts.join('');

    return {
      name: gbizCompany.name,
      nameKana: gbizCompany.name_kana || '',
      establishedYear: gbizCompany.date_of_establishment 
        ? new Date(gbizCompany.date_of_establishment).getFullYear() 
        : undefined,
      capital: gbizCompany.capital_stock 
        ? Math.round(gbizCompany.capital_stock / 10000) // 円を万円に変換
        : undefined,
      employees: gbizCompany.employee_number,
      address: {
        prefecture: prefecture || '',
        city: city || '',
        street: '', // gBizINFOには詳細住所がない
        postalCode: gbizCompany.postal_code || ''
      },
      licenses: {
        constructionLicense: gbizCompany.certifications?.construction_license?.[0]?.license_number || '',
        takkenLicense: gbizCompany.certifications?.real_estate_license?.license_number
      },
      companyType: this.determineCompanyType(gbizCompany),
      dataSource: 'api' as const
    };
  }

  // 会社タイプを推定
  private determineCompanyType(company: GBizCompany): CompanyType {
    const name = company.name.toLowerCase();
    const capital = company.capital_stock || 0;
    const employees = company.employee_number || 0;

    // 名称から判断
    if (name.includes('ハウス') || name.includes('ホーム')) {
      if (capital > 100000000 || employees > 100) { // 1億円以上または100人以上
        return 'ハウスメーカー';
      }
    }
    
    if (name.includes('工務店')) {
      return '工務店';
    }
    
    if (name.includes('設計') || name.includes('建築士')) {
      return '設計事務所';
    }

    // 規模から判断
    if (capital > 50000000 || employees > 50) { // 5千万円以上または50人以上
      return 'ハウスメーカー';
    }

    return '工務店'; // デフォルト
  }
}

// 法人番号APIも併用する場合の追加サービス
class HoujinBangouService {
  private readonly API_BASE = 'https://api.houjin-bangou.nta.go.jp/4';
  
  async searchByName(name: string, prefecture?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        name: name,
        type: '12', // JSON形式
        mode: '2'   // 部分一致
      });

      if (prefecture) {
        params.append('address', prefecture);
      }

      const response = await axios.get(`${this.API_BASE}/name?${params.toString()}`);
      return response.data.results || [];
    } catch (error) {
      console.error('法人番号API Error:', error);
      return [];
    }
  }

  async getByNumber(corporateNumber: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.API_BASE}/num?id=${corporateNumber}&type=12`
      );
      return response.data.results?.[0];
    } catch (error) {
      console.error('法人番号API Error:', error);
      return null;
    }
  }
}

export const gbizInfoService = new GBizInfoService();
export const houjinBangouService = new HoujinBangouService();