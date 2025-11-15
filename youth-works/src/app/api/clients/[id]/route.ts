import { NextRequest, NextResponse } from 'next/server';
import { ClientService } from '@/lib/services/clientService';
import { ClientFormData, ApiResponse, Client } from '@/lib/types';

const clientService = new ClientService();

/**
 * GET /api/clients/:id - クライアント詳細を取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientService.getById(id);

    if (!client) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'クライアントが見つかりません',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Client> = {
      success: true,
      data: client,
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
 * PUT /api/clients/:id - クライアント情報を更新
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData: Partial<ClientFormData> = await request.json();

    const client = await clientService.update(id, formData);

    if (!client) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'クライアントが見つかりません',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Client> = {
      success: true,
      data: client,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'クライアント情報の更新に失敗しました',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * DELETE /api/clients/:id - クライアントを削除
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // 論理削除（非アクティブ化）
    const client = await clientService.deactivate(id);

    if (!client) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'クライアントが見つかりません',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: 'クライアントの削除に失敗しました',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
