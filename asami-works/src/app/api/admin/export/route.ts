import { NextRequest, NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase-admin';
import { EXPENSE_CATEGORY_LABELS } from '@/types/invoice';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const fiscalYear = searchParams.get('fiscalYear') || new Date().getFullYear().toString();

    const yearStart = new Date(`${fiscalYear}-01-01`);
    const yearEnd = new Date(`${fiscalYear}-12-31T23:59:59`);

    let csvContent = '';

    if (type === 'expenses') {
      // 経費エクスポート
      const snapshot = await db
        .collection('expenses')
        .where('date', '>=', Timestamp.fromDate(yearStart))
        .where('date', '<=', Timestamp.fromDate(yearEnd))
        .orderBy('date', 'asc')
        .get();

      const expenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // CSVヘッダー
      csvContent = '日付,カテゴリ,摘要,支払先,金額,経費計上額,按分率,支払方法,メモ\n';

      // CSVデータ
      expenses.forEach((exp: any) => {
        const date = exp.date?.toDate?.() || new Date(exp.date);
        const dateStr = date.toISOString().split('T')[0];
        const category = EXPENSE_CATEGORY_LABELS[exp.category as keyof typeof EXPENSE_CATEGORY_LABELS] || exp.category;
        const deductible = exp.deductibleAmount || (exp.taxDeductible ? exp.amount : 0);
        const paymentMethodLabels: Record<string, string> = {
          cash: '現金',
          card: 'カード',
          bank_transfer: '振込',
          other: 'その他',
        };
        const paymentMethod = paymentMethodLabels[exp.paymentMethod] || exp.paymentMethod;

        csvContent += `${dateStr},"${category}","${exp.description || ''}","${exp.vendor || ''}",${exp.amount},${deductible},${exp.homeUseRatio || 100}%,"${paymentMethod}","${exp.memo || ''}"\n`;
      });
    } else if (type === 'financial') {
      // 財務レポートエクスポート
      const invoicesSnapshot = await db
        .collection('invoices')
        .where('issueDate', '>=', Timestamp.fromDate(yearStart))
        .where('issueDate', '<=', Timestamp.fromDate(yearEnd))
        .get();

      const expensesSnapshot = await db
        .collection('expenses')
        .where('date', '>=', Timestamp.fromDate(yearStart))
        .where('date', '<=', Timestamp.fromDate(yearEnd))
        .get();

      const invoices = invoicesSnapshot.docs.map(doc => doc.data());
      const expenses = expensesSnapshot.docs.map(doc => doc.data());

      // 月次サマリー
      csvContent = '月,売上,経費,利益\n';

      for (let month = 1; month <= 12; month++) {
        const monthStart = new Date(parseInt(fiscalYear), month - 1, 1);
        const monthEnd = new Date(parseInt(fiscalYear), month, 0, 23, 59, 59);

        const monthRevenue = invoices
          .filter((inv: any) => {
            const date = inv.issueDate?.toDate?.() || new Date(inv.issueDate);
            return date >= monthStart && date <= monthEnd;
          })
          .reduce((sum, inv: any) => sum + (inv.totalAmount || 0), 0);

        const monthExpenses = expenses
          .filter((exp: any) => {
            const date = exp.date?.toDate?.() || new Date(exp.date);
            return date >= monthStart && date <= monthEnd;
          })
          .reduce((sum, exp: any) => sum + (exp.deductibleAmount || (exp.taxDeductible ? exp.amount : 0) || 0), 0);

        csvContent += `${month}月,${monthRevenue},${monthExpenses},${monthRevenue - monthExpenses}\n`;
      }

      // 合計行
      const totalRevenue = invoices.reduce((sum, inv: any) => sum + (inv.totalAmount || 0), 0);
      const totalExpenses = expenses.reduce((sum, exp: any) => sum + (exp.deductibleAmount || (exp.taxDeductible ? exp.amount : 0) || 0), 0);
      csvContent += `合計,${totalRevenue},${totalExpenses},${totalRevenue - totalExpenses}\n`;
    } else {
      return NextResponse.json(
        { error: '無効なエクスポートタイプです' },
        { status: 400 }
      );
    }

    // BOM付きUTF-8でCSVを返す
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;

    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${type}_${fiscalYear}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'エクスポートに失敗しました' },
      { status: 500 }
    );
  }
}
