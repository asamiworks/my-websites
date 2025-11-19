import { NextRequest, NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase-admin';

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

    const invoices = invoicesSnapshot.docs.map(doc => doc.data());
    const expenses = expensesSnapshot.docs.map(doc => doc.data());

    // 売上計算
    const totalRevenue = invoices.reduce((sum, inv: any) => sum + (inv.totalAmount || 0), 0);

    // 経費計算
    const totalExpenses = expenses.reduce((sum, exp: any) => {
      return sum + (exp.deductibleAmount || (exp.taxDeductible ? exp.amount : 0) || 0);
    }, 0);

    // カテゴリ別経費
    const expensesByCategory: Record<string, number> = {};
    expenses.forEach((exp: any) => {
      const category = exp.category || 'other';
      const amount = exp.deductibleAmount || (exp.taxDeductible ? exp.amount : 0) || 0;
      expensesByCategory[category] = (expensesByCategory[category] || 0) + amount;
    });

    // 事業所得
    const businessIncome = totalRevenue - totalExpenses;

    // 青色申告特別控除（65万円）
    const blueReturnDeduction = Math.min(650000, Math.max(0, businessIncome));

    // 課税所得
    const taxableIncome = Math.max(0, businessIncome - blueReturnDeduction);

    // 源泉徴収税額（報酬の10.21%と仮定）
    const withholdingTax = Math.round(totalRevenue * 0.1021);

    // 所得税計算（累進課税）
    let estimatedIncomeTax = 0;
    if (taxableIncome <= 1950000) {
      estimatedIncomeTax = taxableIncome * 0.05;
    } else if (taxableIncome <= 3300000) {
      estimatedIncomeTax = taxableIncome * 0.1 - 97500;
    } else if (taxableIncome <= 6950000) {
      estimatedIncomeTax = taxableIncome * 0.2 - 427500;
    } else if (taxableIncome <= 9000000) {
      estimatedIncomeTax = taxableIncome * 0.23 - 636000;
    } else if (taxableIncome <= 18000000) {
      estimatedIncomeTax = taxableIncome * 0.33 - 1536000;
    } else if (taxableIncome <= 40000000) {
      estimatedIncomeTax = taxableIncome * 0.4 - 2796000;
    } else {
      estimatedIncomeTax = taxableIncome * 0.45 - 4796000;
    }
    estimatedIncomeTax = Math.round(Math.max(0, estimatedIncomeTax));

    // 復興特別所得税（所得税の2.1%）
    const reconstructionTax = Math.round(estimatedIncomeTax * 0.021);
    estimatedIncomeTax += reconstructionTax;

    // 住民税（課税所得の10%）
    const estimatedResidentTax = Math.round(taxableIncome * 0.1);

    // 事業税（(事業所得 - 290万円) × 5%）
    const businessTaxBase = Math.max(0, businessIncome - 2900000);
    const estimatedBusinessTax = Math.round(businessTaxBase * 0.05);

    // 税額合計
    const totalEstimatedTax = estimatedIncomeTax + estimatedResidentTax + estimatedBusinessTax;

    // 税引後手取り
    const netIncomeAfterTax = businessIncome - totalEstimatedTax;

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalExpenses,
        businessIncome,
        netIncomeAfterTax,
      },
      invoiceCount: invoices.length,
      expenseCount: expenses.length,
      revenue: totalRevenue,
      expenses: {
        total: totalExpenses,
        byCategory: expensesByCategory,
      },
      income: {
        business: businessIncome,
        blueReturnDeduction,
        taxable: taxableIncome,
      },
      tax: {
        withholdingTax,
        estimatedIncomeTax,
        estimatedResidentTax,
        estimatedBusinessTax,
        totalEstimatedTax,
      },
    });
  } catch (error) {
    console.error('Error fetching tax return data:', error);
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    );
  }
}
