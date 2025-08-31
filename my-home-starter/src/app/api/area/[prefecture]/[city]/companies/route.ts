// src/app/api/area/[prefecture]/[city]/companies/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { GBizINFOService } from '@/services/gbizinfo.service';

// Prismaの型を手動で定義（型エラーを回避）
interface DbCompany {
  id: string;
  corporateNumber: string;
  name: string;
  nameKana: string | null;
  description: string | null;
  establishedDate: Date | null;
  capital: bigint | null;
  employees: number | null;
  website: string | null;
  gBizLastUpdated: Date | null;
  gBizData: any;
  logoUrl: string | null;
  coverImageUrl: string | null;
  isVerified: boolean;
  isPremium: boolean;
  serviceAreas: DbServiceArea[];
  priceRanges: DbPriceRange[];
  specialties: DbSpecialty[];
}

interface DbServiceArea {
  id: string;
  companyId: string;
  prefecture: string;
  city: string | null;
  coverage: string;
  remarks: string | null;
}

interface DbPriceRange {
  id: string;
  companyId: string;
  productName: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number | null;
  includeItems: string[];
  remarks: string | null;
}

interface DbSpecialty {
  id: string;
  companyId: string;
  category: string;
  value: string;
}

interface DbPRSection {
  id: string;
  prefecture: string;
  city: string;
  companyId: string | null;
  companyName: string;
  description: string;
  imageUrl: string | null;
  contactInfo: string | null;
  displayOrder: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// APIレスポンス用の型定義
type CompanyData = {
  id: string;
  corporateNumber: string | null;
  name: string;
  nameKana: string | null;
  address: string;
  tel: string;
  website: string | null;
  isPremium: boolean;
  priceRange: {
    min: number;
    max: number;
  } | null;
  specialties: string[];
  serviceAreas: string[];
  dataSource: 'gbiz' | 'database';
};

type PRCompanyData = {
  id: string;
  companyName: string;
  description: string;
  imageUrl: string | null;
  contactInfo: string | null;
  displayOrder: number;
};

// スラッグ→都道府県名変換マップ
const prefectureSlugMap: Record<string, string> = {
  'hokkaido': '北海道',
  'aomori': '青森県',
  'iwate': '岩手県',
  'miyagi': '宮城県',
  'akita': '秋田県',
  'yamagata': '山形県',
  'fukushima': '福島県',
  'ibaraki': '茨城県',
  'tochigi': '栃木県',
  'gunma': '群馬県',
  'saitama': '埼玉県',
  'chiba': '千葉県',
  'tokyo': '東京都',
  'kanagawa': '神奈川県',
  'niigata': '新潟県',
  'toyama': '富山県',
  'ishikawa': '石川県',
  'fukui': '福井県',
  'yamanashi': '山梨県',
  'nagano': '長野県',
  'gifu': '岐阜県',
  'shizuoka': '静岡県',
  'aichi': '愛知県',
  'mie': '三重県',
  'shiga': '滋賀県',
  'kyoto': '京都府',
  'osaka': '大阪府',
  'hyogo': '兵庫県',
  'nara': '奈良県',
  'wakayama': '和歌山県',
  'tottori': '鳥取県',
  'shimane': '島根県',
  'okayama': '岡山県',
  'hiroshima': '広島県',
  'yamaguchi': '山口県',
  'tokushima': '徳島県',
  'kagawa': '香川県',
  'ehime': '愛媛県',
  'kochi': '高知県',
  'fukuoka': '福岡県',
  'saga': '佐賀県',
  'nagasaki': '長崎県',
  'kumamoto': '熊本県',
  'oita': '大分県',
  'miyazaki': '宮崎県',
  'kagoshima': '鹿児島県',
  'okinawa': '沖縄県',
};

// スラッグから都道府県名を取得
function getPrefectureName(slug: string): string | null {
  return prefectureSlugMap[slug] || null;
}

// スラッグから市区町村名を取得（簡易実装）
function getCityName(slug: string): string {
  // ハイフンを除去して返す
  return slug.replace(/-/g, '');
}

export async function GET(
  request: NextRequest,
  { params }: { params: { prefecture: string; city: string } }
) {
  try {
    const { prefecture: prefectureSlug, city: citySlug } = params;
    
    // スラッグから日本語名に変換
    const prefectureName = getPrefectureName(prefectureSlug);
    const cityName = getCityName(citySlug);
    
    if (!prefectureName) {
      return NextResponse.json(
        { error: '無効な都道府県パラメータです' },
        { status: 400 }
      );
    }

    // 1. PR枠データを取得
    const prSections = await prisma.pRSection.findMany({
      where: {
        prefecture: prefectureName,
        city: cityName,
        isActive: true,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } }
        ]
      },
      orderBy: { displayOrder: 'asc' },
      take: 3,
    }) as DbPRSection[];

    const prCompanies: PRCompanyData[] = prSections.map((pr: DbPRSection): PRCompanyData => ({
      id: pr.id,
      companyName: pr.companyName,
      description: pr.description,
      imageUrl: pr.imageUrl,
      contactInfo: pr.contactInfo,
      displayOrder: pr.displayOrder,
    }));

    // 2. データベースから有料会員を取得
    const dbCompanies = await prisma.company.findMany({
      where: {
        isPremium: true,
        serviceAreas: {
          some: {
            prefecture: prefectureName,
            OR: [
              { city: cityName },
              { city: null }, // 都道府県全体対応
            ]
          }
        }
      },
      include: {
        serviceAreas: true,
        priceRanges: true,
        specialties: true,
      },
      take: 10,
    }) as unknown as DbCompany[];

    // データベースの会社情報を整形
    const premiumCompanies: CompanyData[] = dbCompanies.map((company: DbCompany): CompanyData => {
      const firstPriceRange: DbPriceRange | null = company.priceRanges.length > 0 ? company.priceRanges[0] : null;
      
      return {
        id: company.id,
        corporateNumber: company.corporateNumber,
        name: company.name,
        nameKana: company.nameKana,
        address: '', // TODO: ServiceAreaから構築
        tel: '', // TODO: 電話番号フィールドを追加
        website: company.website,
        isPremium: true,
        priceRange: firstPriceRange ? {
          min: firstPriceRange.minPrice,
          max: firstPriceRange.maxPrice,
        } : null,
        specialties: company.specialties.map((s: DbSpecialty): string => s.value),
        serviceAreas: company.serviceAreas.map((area: DbServiceArea): string => 
          `${area.prefecture}${area.city || ''}`
        ),
        dataSource: 'database' as const,
      };
    });

    // 3. gbiz APIから追加の会社情報を取得（オプション）
    let gbizCompanies: CompanyData[] = [];
    
    const apiToken = process.env.GBIZINFO_API_TOKEN;
    if (apiToken) {
      try {
        const gbizService = new GBizINFOService(apiToken);
        
        const searchResult = await gbizService.searchCorporations({
          prefecture: prefectureName,
          city: cityName,
          business_item: '建設',
          limit: '20',
        });

        interface GBizCompany {
          corporate_number: string;
          name: string;
          name_en?: string;
          location?: string;
          company_url?: string;
          business_summary?: string;
        }

        if (searchResult && searchResult['hojin-infos']) {
          const housingKeywords = [
            '住宅', '建築', 'ハウス', 'ホーム', '工務店',
            '建設', '施工', '注文住宅', '戸建'
          ];

          const filteredCompanies = searchResult['hojin-infos']
            .filter((company: GBizCompany): boolean => {
              const name: string = company.name || '';
              const summary: string = company.business_summary || '';
              return housingKeywords.some((keyword: string): boolean => 
                name.includes(keyword) || summary.includes(keyword)
              );
            })
            .slice(0, 10);

          gbizCompanies = filteredCompanies.map((company: GBizCompany): CompanyData => ({
            id: company.corporate_number,
            corporateNumber: company.corporate_number,
            name: company.name,
            nameKana: company.name_en || null,
            address: company.location || '',
            tel: '',
            website: company.company_url || null,
            isPremium: false,
            priceRange: null,
            specialties: [],
            serviceAreas: [],
            dataSource: 'gbiz' as const,
          }));
        }
      } catch (error) {
        console.error('gbiz API error:', error);
      }
    }

    // 4. 重複を除いて統合
    const existingCorpNumbers = new Set<string | null>(
      premiumCompanies
        .filter((c: CompanyData): boolean => c.corporateNumber !== null)
        .map((c: CompanyData): string | null => c.corporateNumber)
    );

    const nonDuplicateGbizCompanies = gbizCompanies.filter(
      (company: CompanyData): boolean => !existingCorpNumbers.has(company.corporateNumber)
    );

    const allCompanies: CompanyData[] = [...premiumCompanies, ...nonDuplicateGbizCompanies];

    // 5. レスポンスを返す
    return NextResponse.json({
      prefecture: prefectureName,
      city: cityName,
      prCompanies,
      companies: allCompanies,
      total: allCompanies.length,
    });

  } catch (error) {
    console.error('Error in companies API:', error);
    return NextResponse.json(
      { error: '住宅会社の取得に失敗しました' },
      { status: 500 }
    );
  }
}