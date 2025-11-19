import { NextRequest, NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase-admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      date,
      category,
      amount,
      description,
      vendor,
      receiptUrl,
      taxDeductible,
      homeUseRatio,
      paymentMethod,
      memo,
      tags,
    } = body;

    // バリデーション
    if (!date || !category || !amount || !description) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    // 経費計上額を計算
    const deductibleAmount = taxDeductible
      ? Math.round(amount * (homeUseRatio || 100) / 100)
      : 0;

    const expenseData = {
      date: Timestamp.fromDate(new Date(date)),
      category,
      amount,
      description,
      vendor: vendor || null,
      receiptUrl: receiptUrl || null,
      taxDeductible,
      homeUseRatio: homeUseRatio || 100,
      deductibleAmount,
      paymentMethod: paymentMethod || 'cash',
      memo: memo || null,
      tags: tags || [],
      updatedAt: Timestamp.now(),
    };

    await db.collection('expenses').doc(id).update(expenseData);

    return NextResponse.json({
      id,
      ...expenseData,
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { error: '経費の更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.collection('expenses').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: '経費の削除に失敗しました' },
      { status: 500 }
    );
  }
}
