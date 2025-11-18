import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // 請求書を取得して存在確認
    const invoiceRef = db.collection('invoices').doc(id);
    const invoiceDoc = await invoiceRef.get();

    if (!invoiceDoc.exists) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // 請求書を削除
    await invoiceRef.delete();

    return NextResponse.json({
      success: true,
      message: '請求書を削除しました'
    });

  } catch (error: any) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: error.message || '請求書の削除に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // 請求書を取得
    const invoiceRef = db.collection('invoices').doc(id);
    const invoiceDoc = await invoiceRef.get();

    if (!invoiceDoc.exists) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoiceDoc.id,
        ...invoiceDoc.data()
      }
    });

  } catch (error: any) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: error.message || '請求書の取得に失敗しました' },
      { status: 500 }
    );
  }
}
