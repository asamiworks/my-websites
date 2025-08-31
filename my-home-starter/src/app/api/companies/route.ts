import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

interface CompanySearchRequest {
  prefecture?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  houseTypes?: string[];
  structures?: string[];
  features?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'recent';
}

// Prismaの型を独自に定義
interface CompanyWhereInput {
  serviceAreas?: {
    some?: {
      prefecture?: string;
      city?: string;
    };
  };
  priceRanges?: {
    some?: {
      maxPrice?: { gte?: number };
      minPrice?: { lte?: number };
    };
  };
  specialties?: {
    some?: {
      category?: string;
      value?: { in?: string[] } | string;
    };
  };
  AND?: any[];
}

interface CompanyOrderByInput {
  name?: 'asc' | 'desc';
  nameKana?: 'asc' | 'desc';
  updatedAt?: 'asc' | 'desc';
}

// 型定義
interface ServiceArea {
  id: string;
  companyId: string;
  prefecture: string;
  city: string | null;
  coverage: string;
  remarks: string | null;
}

interface PriceRange {
  id: string;
  companyId: string;
  productName: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number | null;
  includeItems: string[];
  remarks: string | null;
}

interface Specialty {
  id: string;
  companyId: string;
  category: string;
  value: string;
}

interface Review {
  overallRating: number;
}

interface CompanyWithRelations {
  id: string;
  corporateNumber: string;
  name: string;
  nameKana: string | null;
  description: string | null;
  logoUrl: string | null;
  isVerified: boolean;
  isPremium: boolean;
  serviceAreas: ServiceArea[];
  priceRanges: PriceRange[];
  specialties: Specialty[];
  reviews: Review[];
  _count: {
    reviews: number;
    projects: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // クエリパラメータから検索条件を取得
    const prefecture = searchParams.get('prefecture') || undefined;
    const city = searchParams.get('city') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const sortBy = searchParams.get('sortBy') as CompanySearchRequest['sortBy'] || 'name';

    // where条件を構築
    const where: CompanyWhereInput = {};

    // エリアでの絞り込み
    if (prefecture || city) {
      where.serviceAreas = {
        some: {
          ...(prefecture && { prefecture }),
          ...(city && { city }),
        },
      };
    }

    // ソート条件
    let orderBy: CompanyOrderByInput = {};
    switch (sortBy) {
      case 'name':
        orderBy = { nameKana: 'asc' };
        break;
      case 'recent':
        orderBy = { updatedAt: 'desc' };
        break;
      case 'price':
        // 価格でのソートは複雑なので、後処理で対応
        orderBy = { name: 'asc' };
        break;
      case 'rating':
        // レビュー評価でのソートも後処理で対応
        orderBy = { name: 'asc' };
        break;
    }

    // データ取得
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: where as any,
        orderBy: orderBy as any,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          serviceAreas: true,
          priceRanges: true,
          specialties: true,
          reviews: {
            select: {
              overallRating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              projects: true,
            },
          },
        },
      }),
      prisma.company.count({ where: where as any }),
    ]);

    // レスポンスデータの整形（型安全に修正）
    const formattedCompanies = (companies as CompanyWithRelations[]).map((company) => {
      // 平均評価の計算
      const avgRating =
        company.reviews.length > 0
          ? company.reviews.reduce((sum: number, r: Review) => sum + r.overallRating, 0) /
            company.reviews.length
          : 0;

      // 価格帯の取得
      const priceRange = company.priceRanges[0];

      return {
        id: company.id,
        corporateNumber: company.corporateNumber,
        name: company.name,
        nameKana: company.nameKana,
        description: company.description,
        logoUrl: company.logoUrl,
        isVerified: company.isVerified,
        isPremium: company.isPremium,
        serviceAreas: company.serviceAreas.map((area: ServiceArea) => ({
          prefecture: area.prefecture,
          city: area.city,
        })),
        priceRange: priceRange
          ? {
              min: priceRange.minPrice,
              max: priceRange.maxPrice,
              avg: priceRange.avgPrice,
            }
          : null,
        specialties: company.specialties.map((s: Specialty) => ({
          category: s.category,
          value: s.value,
        })),
        rating: {
          average: Math.round(avgRating * 10) / 10,
          count: company._count.reviews,
        },
        projectCount: company._count.projects,
      };
    });

    // ソート処理（価格、評価の場合）
    interface FormattedCompany {
      id: string;
      priceRange: { min: number; max: number; avg: number | null } | null;
      rating: { average: number; count: number };
      [key: string]: unknown;
    }

    if (sortBy === 'price') {
      formattedCompanies.sort((a: FormattedCompany, b: FormattedCompany) => {
        const priceA = a.priceRange?.min || Infinity;
        const priceB = b.priceRange?.min || Infinity;
        return priceA - priceB;
      });
    } else if (sortBy === 'rating') {
      formattedCompanies.sort((a: FormattedCompany, b: FormattedCompany) => b.rating.average - a.rating.average);
    }

    return NextResponse.json({
      companies: formattedCompanies,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('会社情報の取得エラー:', error);
    return NextResponse.json(
      { error: '会社情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 会社情報の詳細検索（POST）
export async function POST(request: NextRequest) {
  try {
    const body: CompanySearchRequest = await request.json();
    const {
      prefecture,
      city,
      minPrice,
      maxPrice,
      houseTypes = [],
      structures = [],
      features = [],
      page = 1,
      pageSize = 20,
    } = body;

    // 複雑な検索条件の構築
    const where: CompanyWhereInput = {
      AND: [
        // エリア条件
        ...(prefecture || city
          ? [
              {
                serviceAreas: {
                  some: {
                    ...(prefecture && { prefecture }),
                    ...(city && { city }),
                  },
                },
              },
            ]
          : []),
        // 価格帯条件
        ...(minPrice !== undefined || maxPrice !== undefined
          ? [
              {
                priceRanges: {
                  some: {
                    ...(minPrice !== undefined && { maxPrice: { gte: minPrice } }),
                    ...(maxPrice !== undefined && { minPrice: { lte: maxPrice } }),
                  },
                },
              },
            ]
          : []),
        // 住宅タイプ条件
        ...(houseTypes.length > 0
          ? [
              {
                specialties: {
                  some: {
                    category: 'HOUSE_TYPE',
                    value: { in: houseTypes },
                  },
                },
              },
            ]
          : []),
        // 構造条件
        ...(structures.length > 0
          ? [
              {
                specialties: {
                  some: {
                    category: 'STRUCTURE',
                    value: { in: structures },
                  },
                },
              },
            ]
          : []),
        // 特徴条件
        ...(features.length > 0
          ? [
              {
                specialties: {
                  some: {
                    category: 'FEATURE',
                    value: { in: features },
                  },
                },
              },
            ]
          : []),
      ],
    };

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: where as any,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          serviceAreas: true,
          priceRanges: true,
          specialties: true,
          reviews: true,
          projects: {
            take: 3,
            include: {
              images: {
                take: 1,
              },
            },
          },
        },
      }),
      prisma.company.count({ where: where as any }),
    ]);

    return NextResponse.json({
      companies,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      searchCriteria: {
        prefecture,
        city,
        minPrice,
        maxPrice,
        houseTypes,
        structures,
        features,
      },
    });
  } catch (error) {
    console.error('会社検索エラー:', error);
    return NextResponse.json(
      { error: '会社検索に失敗しました' },
      { status: 500 }
    );
  }
}