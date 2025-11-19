import { NextRequest, NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fiscalYear = searchParams.get('fiscalYear');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query: FirebaseFirestore.Query = db.collection('expenses');

    // 年度フィルター
    if (fiscalYear) {
      const yearStart = new Date(`${fiscalYear}-01-01`);
      const yearEnd = new Date(`${fiscalYear}-12-31T23:59:59`);
      query = query
        .where('date', '>=', Timestamp.fromDate(yearStart))
        .where('date', '<=', Timestamp.fromDate(yearEnd));
    }

    // カテゴリフィルター
    if (category) {
      query = query.where('category', '==', category);
    }

    // 日付範囲フィルター
    if (startDate && !fiscalYear) {
      query = query.where('date', '>=', Timestamp.fromDate(new Date(startDate)));
    }
    if (endDate && !fiscalYear) {
      query = query.where('date', '<=', Timestamp.fromDate(new Date(endDate + 'T23:59:59')));
    }

    const snapshot = await query.orderBy('date', 'desc').get();

    const expenses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: '経費の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await db.collection('expenses').add(expenseData);

    return NextResponse.json({
      id: docRef.id,
      ...expenseData,
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: '経費の作成に失敗しました' },
      { status: 500 }
    );
  }
}
