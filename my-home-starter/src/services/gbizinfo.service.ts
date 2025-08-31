// src/services/gbizinfo.service.ts
import axios, { AxiosInstance } from 'axios';

// gBizINFO APIのレスポンス型定義
export interface GBizINFOBasicInfo {
  'hojin-infos': Array<{
    corporate_number: string;
    name: string;
    name_en?: string;
    location?: string;
    capital_stock?: string;
    employee_number?: string;
    business_summary?: string;
    company_url?: string;
    date_of_establishment?: string;
    representative_name?: string;
    business_items?: string[];
    update_date?: string;
    status?: string;
  }>;
}

export interface GBizINFOSubsidyInfo {
  'hojin-infos': Array<{
    corporate_number: string;
    subsidies?: Array<{
      date_of_approval: string;
      title: string;
      amount: string;
      target: string;
      government_department: string;
      note?: string;
      joint_signatures?: string[];
    }>;
  }>;
}

export interface GBizINFOProcurementInfo {
  'hojin-infos': Array<{
    corporate_number: string;
    procurements?: Array<{
      date_of_order: string;
      title: string;
      amount: string;
      government_department: string;
      joint_signatures?: string[];
    }>;
  }>;
}

export interface GBizINFOPatentInfo {
  'hojin-infos': Array<{
    corporate_number: string;
    patents?: Array<{
      application_date: string;
      application_number: string;
      patent_type: string;
      title: string;
    }>;
  }>;
}

export interface GBizINFOFinanceInfo {
  'hojin-infos': Array<{
    corporate_number: string;
    finance?: {
      accounting_standards?: string;
      fiscal_year_cover_page?: string;
      major_shareholders?: Array<{
        name_major_shareholders?: string;
        shareholding_ratio?: string;
      }>;
      management_analysis?: Array<{
        period?: string;
        net_sales?: string;
        net_income?: string;
        capital_stock_summary_of_business_results?: string;
        net_assets?: string;
        total_assets?: string;
        equity_to_asset_ratio?: string;
        rate_of_return_on_equity?: string;
      }>;
    };
  }>;
}

export interface GBizINFOWorkplaceInfo {
  'hojin-infos': Array<{
    corporate_number: string;
    workplace_info?: {
      base_infos?: {
        average_continuous_service_years?: string;
        average_continuous_service_years_male?: string;
        average_continuous_service_years_female?: string;
        average_age?: string;
        month_average_predetermined_overtime_hours?: string;
      };
      women_activity_infos?: Array<{
        female_share_of_manager?: string;
        gender_total_of_manager?: string;
        female_share_of_officers?: string;
      }>;
    };
  }>;
}

// 検索パラメータの型定義
export interface GBizINFOSearchParams {
  name?: string;
  corporate_type?: string;
  prefecture?: string;
  city?: string;
  capital_stock_from?: string;
  capital_stock_to?: string;
  employee_number_from?: string;
  employee_number_to?: string;
  founded_year?: string;
  sales_area?: string;
  business_item?: string;
  update_from?: string;
  update_to?: string;
  page?: string;
  limit?: string;
}

// エラーレスポンスの型定義
export interface GBizINFOError {
  errors: Array<{
    item: string;
    messages: string[];
  }>;
}

export class GBizINFOService {
  private api: AxiosInstance;
  private baseURL = 'https://info.gbiz.go.jp/hojin/v1/hojin';

  constructor(apiToken: string) {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Accept': 'application/json',
        'X-hojinInfo-api-token': apiToken,
      },
      timeout: 30000, // 30秒タイムアウト
    });
  }

  /**
   * 法人検索
   */
  async searchCorporations(params: GBizINFOSearchParams) {
    try {
      const response = await this.api.get('/', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 法人番号から基本情報を取得
   */
  async getBasicInfo(corporateNumber: string): Promise<GBizINFOBasicInfo> {
    try {
      const response = await this.api.get(`/${corporateNumber}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 補助金情報を取得
   */
  async getSubsidyInfo(corporateNumber: string): Promise<GBizINFOSubsidyInfo> {
    try {
      const response = await this.api.get(`/${corporateNumber}/subsidy`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 調達情報を取得
   */
  async getProcurementInfo(corporateNumber: string): Promise<GBizINFOProcurementInfo> {
    try {
      const response = await this.api.get(`/${corporateNumber}/procurement`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 特許情報を取得
   */
  async getPatentInfo(corporateNumber: string): Promise<GBizINFOPatentInfo> {
    try {
      const response = await this.api.get(`/${corporateNumber}/patent`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 財務情報を取得
   */
  async getFinanceInfo(corporateNumber: string): Promise<GBizINFOFinanceInfo> {
    try {
      const response = await this.api.get(`/${corporateNumber}/finance`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 職場情報を取得
   */
  async getWorkplaceInfo(corporateNumber: string): Promise<GBizINFOWorkplaceInfo> {
    try {
      const response = await this.api.get(`/${corporateNumber}/workplace`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * エラーハンドリング
   */
  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // サーバーからのエラーレスポンス
        console.error('API Error Response:', error.response.data);
        throw new Error(`gBizINFO API Error: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // リクエストは送信されたがレスポンスなし
        console.error('No response from server');
        throw new Error('gBizINFO API: No response from server');
      }
    }
    // その他のエラー
    console.error('Unexpected error:', error);
    throw new Error('Unexpected error occurred');
  }
}