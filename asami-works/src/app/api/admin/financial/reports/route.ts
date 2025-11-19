import { NextRequest, NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase-admin';
import { EXPENSE_CATEGORY_LABELS } from '@/types/invoice';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fiscalYear = searchParams.get('fiscalYear') || new Date().getFullYear().toString();

    const yearStart = new Date(`${fiscalYear}-01-01`);
    const yearEnd = new Date(`${fiscalYear}-12-31T23:59:59`);

    // 請求書を取得
    const invoicesSnapshot = await db
      .collection('invoices')
      .where('issueDate', '>=', Timestamp.fromDate(yearStart))
      .where('issueDate', '<=', Timestamp.fromDate(yearEnd))
      .get();

    // 経費を取得
    const expensesSnapshot = await db
      .collection('expenses')
      .where('date', '>=', Timestamp.fromDate(yearStart))
      .where('date', '<=', Timestamp.fromDate(yearEnd))
      .get();

    const invoices = invoicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const expenses = expensesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 売上集計
    const totalRevenue = invoices.reduce((sum, inv: any) => sum + (inv.totalAmount || 0), 0);
    const paidRevenue = invoices
      .filter((inv: any) => inv.status === 'paid')
      .reduce((sum, inv: any) => sum + (inv.totalAmount || 0), 0);
    const unpaidRevenue = invoices
      .filter((inv: any) => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv: any) => sum + (inv.totalAmount || 0), 0);

    // 経費集計
    const totalExpenses = expenses.reduce((sum, exp: any) => sum + (exp.amount || 0), 0);
    const deductibleExpenses = expenses.reduce((sum, exp: any) => {
      return sum + (exp.deductibleAmount || (exp.taxDeductible ? exp.amount : 0) || 0);
    }, 0);

    // カテゴリ別経費
    const expensesByCategory: Record<string, number> = {};
    expenses.forEach((exp: any) => {
      const category = exp.category || 'other';
      const amount = exp.deductibleAmount || (exp.taxDeductible ? exp.amount : 0) || 0;
      expensesByCategory[category] = (expensesByCategory[category] || 0) + amount;
    });

    // カテゴリ別経費（ラベル付き）
    const byCategoryWithLabels = Object.entries(expensesByCategory)
      .map(([category, amount]) => ({
        category,
        label: EXPENSE_CATEGORY_LABELS[category as keyof typeof EXPENSE_CATEGORY_LABELS] || category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);

    // 月次データ
    const monthlyData = [];
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

      monthlyData.push({
        month,
        revenue: monthRevenue,
        expenses: monthExpenses,
        profit: monthRevenue - monthExpenses,
      });
    }

    // 利益計算
    const operatingProfit = totalRevenue - deductibleExpenses;
    const profitMargin = totalRevenue > 0 ? (operatingProfit / totalRevenue) * 100 : 0;

    return NextResponse.json({
      summary: {
        revenue: {
          total: totalRevenue,
          paid: paidRevenue,
          unpaid: unpaidRevenue,
        },
        expenses: {
          total: totalExpenses,
          deductible: deductibleExpenses,
          byCategory: expensesByCategory,
          byCategoryWithLabels,
        },
        profit: {
          operating: operatingProfit,
          margin: profitMargin,
        },
        counts: {
          invoices: invoices.length,
          expenses: expenses.length,
        },
      },
      monthlyData,
    });
  } catch (error) {
    console.error('Error fetching financial report:', error);
    return NextResponse.json(
      { error: 'レポートの取得に失敗しました' },
      { status: 500 }
    );
  }
}
