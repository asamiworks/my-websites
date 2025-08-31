import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

interface RouteParams {
  params: {
    id: string;
  };
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

interface ReviewImage {
  id: string;
  reviewId: string;
  url: string;
  caption: string | null;
}

interface Review {
  id: string;
  companyId: string;
  userId: string | null;
  contractYear: number;
  completionYear: number | null;
  prefecture: string;
  city: string | null;
  totalPrice: number | null;
  pricePerTsubo: number | null;
  houseSize: number | null;
  overallRating: number;
  priceRating: number | null;
  qualityRating: number | null;
  serviceRating: number | null;
  title: string;
  content: string;
  pros: string | null;
  cons: string | null;
  images: ReviewImage[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  caption: string | null;
  order: number;
}

interface Project {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  prefecture: string;
  city: string | null;
  houseType: string;
  structure: string;
  size: number | null;
  priceRange: string | null;
  images: ProjectImage[];
  createdAt: Date;
}

interface Company {
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
  gBizData: unknown | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  isVerified: boolean;
  isPremium: boolean;
  serviceAreas: ServiceArea[];
  priceRanges: PriceRange[];
  specialties: Specialty[];
  reviews: Review[];
  projects: Project[];
  _count: {
    reviews: number;
    projects: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// 会社詳細の取得
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        serviceAreas: true,
        priceRanges: {
          orderBy: { minPrice: 'asc' },
        },
        specialties: {
          orderBy: { category: 'asc' },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            images: true,
          },
        },
        projects: {
          orderBy: { createdAt: 'desc' },
          take: 6,
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
            projects: true,
          },
        },
      },
    }) as Company | null;

    if (!company) {
      return NextResponse.json(
        { error: '会社が見つかりません' },
        { status: 404 }
      );
    }

    // レビューの統計情報を計算
    const reviewStats = await prisma.review.aggregate({
      where: { companyId: id },
      _avg: {
        overallRating: true,
        priceRating: true,
        qualityRating: true,
        serviceRating: true,
      },
      _count: true,
    });

    // 特徴をカテゴリ別に整理
    const specialtiesByCategory = company.specialties.reduce<Record<string, string[]>>((acc, specialty: Specialty) => {
      const category = specialty.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category]!.push(specialty.value); // Non-null assertion: 上の条件で初期化済み
      return acc;
    }, {});

    // レスポンスデータの整形
    const response = {
      id: company.id,
      corporateNumber: company.corporateNumber,
      name: company.name,
      nameKana: company.nameKana,
      description: company.description,
      establishedDate: company.establishedDate,
      capital: company.capital ? Number(company.capital) : null,
      employees: company.employees,
      website: company.website,
      logoUrl: company.logoUrl,
      coverImageUrl: company.coverImageUrl,
      isVerified: company.isVerified,
      isPremium: company.isPremium,
      
      // サービスエリア
      serviceAreas: company.serviceAreas.map((area: ServiceArea) => ({
        prefecture: area.prefecture,
        city: area.city,
        coverage: area.coverage,
        remarks: area.remarks,
      })),
      
      // 価格帯
      priceRanges: company.priceRanges.map((range: PriceRange) => ({
        productName: range.productName,
        minPrice: range.minPrice,
        maxPrice: range.maxPrice,
        avgPrice: range.avgPrice,
        includeItems: range.includeItems,
        remarks: range.remarks,
      })),
      
      // 特徴（カテゴリ別）
      specialties: {
        houseTypes: specialtiesByCategory['HOUSE_TYPE'] || [],
        structures: specialtiesByCategory['STRUCTURE'] || [],
        features: specialtiesByCategory['FEATURE'] || [],
      },
      
      // レビュー統計
      reviewStats: {
        count: reviewStats._count,
        ratings: {
          overall: Math.round((reviewStats._avg.overallRating || 0) * 10) / 10,
          price: Math.round((reviewStats._avg.priceRating || 0) * 10) / 10,
          quality: Math.round((reviewStats._avg.qualityRating || 0) * 10) / 10,
          service: Math.round((reviewStats._avg.serviceRating || 0) * 10) / 10,
        },
      },
      
      // 最新レビュー
      recentReviews: company.reviews.map((review: Review) => ({
        id: review.id,
        title: review.title,
        content: review.content,
        contractYear: review.contractYear,
        completionYear: review.completionYear,
        prefecture: review.prefecture,
        city: review.city,
        totalPrice: review.totalPrice,
        houseSize: review.houseSize,
        overallRating: review.overallRating,
        pros: review.pros,
        cons: review.cons,
        images: review.images.map((img: ReviewImage) => ({
          url: img.url,
          caption: img.caption,
        })),
        createdAt: review.createdAt,
      })),
      
      // 施工事例
      projects: company.projects.map((project: Project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        prefecture: project.prefecture,
        city: project.city,
        houseType: project.houseType,
        structure: project.structure,
        size: project.size,
        priceRange: project.priceRange,
        images: project.images.map((img: ProjectImage) => ({
          url: img.url,
          caption: img.caption,
        })),
      })),
      
      // カウント情報
      counts: {
        reviews: company._count.reviews,
        projects: company._count.projects,
      },
      
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('会社詳細の取得エラー:', error);
    return NextResponse.json(
      { error: '会社詳細の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 会社情報の更新（管理者のみ）
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // TODO: 管理者認証の実装
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { id } = params;
    const updateData = await request.json();

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      company: updatedCompany,
    });
  } catch (error) {
    console.error('会社情報の更新エラー:', error);
    return NextResponse.json(
      { error: '会社情報の更新に失敗しました' },
      { status: 500 }
    );
  }
}

// 会社の削除（管理者のみ）
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    // TODO: 管理者認証の実装
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { id } = params;

    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '会社情報を削除しました',
    });
  } catch (error) {
    console.error('会社情報の削除エラー:', error);
    return NextResponse.json(
      { error: '会社情報の削除に失敗しました' },
      { status: 500 }
    );
  }
}