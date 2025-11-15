import { NextRequest, NextResponse } from 'next/server';
import { ClientService } from '@/lib/services/clientService';
import { ClientFormData, ApiResponse, Client } from '@/lib/types';

const clientService = new ClientService();

/**
 * GET /api/clients - クライアント一覧を取得
 */
export async function GET() {
  try {
    const clients = await clientService.getAll();

    const response: ApiResponse<Client[]> = {
      success: true,
      data: clients,
      meta: {
        total: clients.length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'クライアント情報の取得に失敗しました',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * POST /api/clients - 新規クライアントを作成
 */
export async function POST(request: NextRequest) {
  try {
    const formData: ClientFormData = await request.json();

    // バリデーション
    if (!formData.clientName || !formData.siteName) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'クライアント名とサイト名は必須です',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const client = await clientService.create(formData);

    const response: ApiResponse<Client> = {
      success: true,
      data: client,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'クライアントの作成に失敗しました',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
