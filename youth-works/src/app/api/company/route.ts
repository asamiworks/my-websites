import { NextRequest, NextResponse } from 'next/server';
import { CompanyService } from '@/lib/services/companyService';
import { ApiResponse, Company, CompanyFormData } from '@/lib/types';

const companyService = new CompanyService();

/**
 * GET /api/company - 会社情報を取得
 */
export async function GET() {
  try {
    const company = await companyService.get();

    const response: ApiResponse<Company | null> = {
      success: true,
      data: company,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: '会社情報の取得に失敗しました',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * PUT /api/company - 会社情報を更新
 */
export async function PUT(request: NextRequest) {
  try {
    const formData: CompanyFormData = await request.json();

    // バリデーション
    if (!formData.name || !formData.address) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '会社名と住所は必須です',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const company = await companyService.save(formData);

    const response: ApiResponse<Company> = {
      success: true,
      data: company,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: '会社情報の更新に失敗しました',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
