import { NextRequest, NextResponse } from 'next/server';
import { ClientService } from '@/lib/services/clientService';
import { ApiResponse, Client } from '@/lib/types';

const clientService = new ClientService();

/**
 * POST /api/clients/:id/change-fee - 管理費を変更
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { newFee, effectiveDate, reason } = await request.json();

    if (!newFee || !effectiveDate) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '新しい管理費と適用開始日は必須です',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const client = await clientService.changeFee(
      id,
      newFee,
      effectiveDate,
      reason
    );

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
        code: 'FEE_CHANGE_ERROR',
        message: '管理費の変更に失敗しました',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
