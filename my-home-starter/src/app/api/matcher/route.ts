import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

interface MatchRequest {
  prefecture: string;
  city?: string;
  budget: {
    min: number;
    max: number;
  };
  houseType?: string;
  structure?: string;
  features?: string[];
  priority?: 'price' | 'quality' | 'balanced';
  totalFloorArea?: number;
}

interface EstimatedPrice {
  min: number;
  max: number;
  average: number;
}

interface MatchedCompany {
  id: string;
  name: string;
  logoUrl?: string;
  matchScore: number;
  reasons: string[];
  estimatedPrice: EstimatedPrice | null; // nullを許可
  features: string[];
  isPremium: boolean; // 追加
}

// Prismaから取得する会社データの型を定義
interface CompanyWithRelations {
  id: string;
  name: string;
  logoUrl: string | null;
  isPremium: boolean; // 追加
  serviceAreas: Array<{
    id: string;
    companyId: string;
    prefecture: string;
    city: string | null;
    coverage: string;
    remarks: string | null;
  }>;
  priceRanges: Array<{
    id: string;
    companyId: string;
    productName: string;
    minPrice: number;
    maxPrice: number;
    avgPrice: number | null;
    includeItems: string[];
    remarks: string | null;
  }>;
  specialties: Array<{
    id: string;
    companyId: string;
    category: string;
    value: string;
  }>;
  reviews: Array<{
    overallRating: number;
    priceRating: number | null;
    qualityRating: number | null;
    serviceRating: number | null;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: MatchRequest = await request.json();
    const {
      prefecture,
      city,
      budget,
      houseType = '二階建て',
      structure = '木造',
      // features = [],
      priority = 'balanced',
      totalFloorArea = 35, // デフォルト35坪
    } = body;

    // 1. 対応エリアで絞り込み
    const companies = await prisma.company.findMany({
      where: {
        isPremium: true, // この行を追加
        serviceAreas: {
          some: {
            prefecture,
            ...(city ? { city } : {}),
          },
        },
      },
      include: {
        serviceAreas: true,
        priceRanges: true,
        specialties: true,
        reviews: {
          select: {
            overallRating: true,
            priceRating: true,
            qualityRating: true,
            serviceRating: true,
          },
        },
      },
    }) as CompanyWithRelations[];

    // 2. マッチングスコアの計算
    const matchedCompanies: MatchedCompany[] = companies
      .map((company: CompanyWithRelations): MatchedCompany | null => {
        let score = 0;
        const reasons: string[] = [];
        const companyFeatures: string[] = [];

        // 価格帯のマッチング（40点満点）
        const priceRange = company.priceRanges[0];
        if (!priceRange) {
          // 価格情報がない場合はスキップ
          return null;
        }

        const budgetPerTsubo = budget.max / totalFloorArea;
        const priceScore = calculatePriceScore(
          budgetPerTsubo,
          priceRange.minPrice,
          priceRange.maxPrice
        );
        score += priceScore * 40;

        if (priceScore > 0.7) {
          reasons.push('予算に適した価格帯');
        }

        // 想定価格の計算（有料会員のみ）
        let estimatedPrice: EstimatedPrice | null = null;
        if (company.isPremium) {
          const avgPrice = priceRange.avgPrice ?? ((priceRange.minPrice + priceRange.maxPrice) / 2);
          estimatedPrice = {
            min: Math.round(priceRange.minPrice * totalFloorArea),
            max: Math.round(priceRange.maxPrice * totalFloorArea),
            average: Math.round(avgPrice * totalFloorArea),
          };
        }

        // 特徴の抽出
        company.specialties.forEach((specialty) => {
          if (specialty.category === 'FEATURE') {
            companyFeatures.push(specialty.value);
          }
        });

        // 住宅タイプのマッチング（20点満点）
        const hasHouseType = company.specialties.some(
          (s) => s.category === 'HOUSE_TYPE' && s.value === houseType
        );
        if (hasHouseType) {
          score += 20;
          reasons.push(`${houseType}の実績豊富`);
        }

        // 構造のマッチング（20点満点）
        const hasStructure = company.specialties.some(
          (s) => s.category === 'STRUCTURE' && s.value === structure
        );
        if (hasStructure) {
          score += 20;
          reasons.push(`${structure}が得意`);
        }

        // レビュー評価（20点満点）
        if (company.reviews.length > 0) {
          const avgRating = company.reviews.reduce(
            (sum: number, review) => sum + review.overallRating,
            0
          ) / company.reviews.length;
          const ratingScore = (avgRating / 5) * 20;
          score += ratingScore;

          if (avgRating >= 4.0) {
            reasons.push('高評価の口コミ多数');
          }
        }

        // 優先度による調整
        if (priority === 'price' && priceScore > 0.8) {
          score += 10; // ボーナス点
          reasons.push('コストパフォーマンス重視');
        } else if (priority === 'quality' && company.reviews.length > 0) {
          const qualityRatings = company.reviews
            .map(r => r.qualityRating)
            .filter((rating): rating is number => rating !== null);
          
          if (qualityRatings.length > 0) {
            const avgQualityRating = qualityRatings.reduce((sum, rating) => sum + rating, 0) / qualityRatings.length;
            if (avgQualityRating >= 4.0) {
              score += 10;
              reasons.push('品質重視で高評価');
            }
          }
        }

        return {
          id: company.id,
          name: company.name,
          logoUrl: company.logoUrl ?? undefined,
          matchScore: Math.round(score),
          reasons,
          estimatedPrice,
          features: companyFeatures,
          isPremium: company.isPremium, // 追加
        };
      })
      .filter((company): company is MatchedCompany => company !== null)
      .sort((a: MatchedCompany, b: MatchedCompany) => b.matchScore - a.matchScore);

    return NextResponse.json({
      matches: matchedCompanies,
      total: matchedCompanies.length,
      searchCriteria: {
        prefecture,
        city,
        budget,
        houseType,
        structure,
      },
    });
  } catch (error) {
    console.error('マッチングエラー:', error);
    return NextResponse.json(
      { error: 'マッチング処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 価格スコアの計算（0-1の範囲）
function calculatePriceScore(
  budgetPerTsubo: number,
  minPrice: number,
  maxPrice: number
): number {
  // 入力値の検証
  if (minPrice <= 0 || maxPrice <= 0 || minPrice > maxPrice) {
    return 0;
  }

  if (budgetPerTsubo < minPrice) {
    // 予算が最小価格より低い場合
    const gap = minPrice - budgetPerTsubo;
    return Math.max(0, 1 - gap / minPrice);
  } else if (budgetPerTsubo > maxPrice) {
    // 予算が最大価格より高い場合（余裕がある）
    return 1.0; // 満点
  } else {
    // 予算が価格帯内の場合
    const range = maxPrice - minPrice;
    if (range === 0) {
      return 1.0; // minPrice === maxPriceの場合
    }
    const position = (budgetPerTsubo - minPrice) / range;
    // 価格帯の中央に近いほど高スコア
    return 0.8 + 0.2 * (1 - Math.abs(position - 0.5) * 2);
  }
}