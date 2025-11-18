import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

// デフォルトのメール設定
const defaultEmailSettings = {
  invoiceSubject: '【AsamiWorks】請求書のご送付',
  invoiceBody: `{clientName} 様

いつもお世話になっております。
AsamiWorksです。

{billingMonth}分の請求書をお送りいたします。

■ 請求内容
請求書番号: {invoiceNumber}
請求金額: {totalAmount}
お支払期限: {dueDate}

請求書の詳細は、マイページよりご確認いただけます。
{mypageUrl}

ご不明な点がございましたら、お気軽にお問い合わせください。

---
AsamiWorks
Email: info@asami-works.com
Web: https://asami-works.com`,
};

// 設定を取得
export async function GET() {
  try {
    const settingsRef = db.collection('settings').doc('admin');
    const settingsDoc = await settingsRef.get();

    if (!settingsDoc.exists) {
      // デフォルト値を返す
      return NextResponse.json({
        bankInfo: {
          bankName: '',
          branchName: '',
          accountType: '',
          accountNumber: '',
          accountHolder: '',
        },
        invoiceSettings: {
          closingDayType: 'end_of_month',
          closingDay: undefined,
          issueDayType: 'first_of_next_month',
          issueDay: undefined,
          dueDateType: 'end_of_issue_month',
          dueDateDays: undefined,
          dueDateDay: undefined,
          adjustDueDateForHolidays: true,
          taxRate: 0,
        },
        businessSettings: {
          businessType: 'sole_proprietorship',
          taxFilingMethod: 'blue',
          blueReturnDeduction: 65,
          fiscalYearEnd: '03-31',
          incorporationDate: '',
          capitalStock: undefined,
          representativeName: '',
        },
        companyInfo: {
          name: 'AsamiWorks',
          postalCode: '532-0011',
          address: '大阪府大阪市淀川区西中島 5-6-13 新大阪御幸ビル 6F',
          phone: '06-4866-6758',
          email: 'info@asami-works.com',
        },
        emailSettings: defaultEmailSettings,
      });
    }

    const data = settingsDoc.data();
    return NextResponse.json({
      bankInfo: data?.bankInfo || {},
      invoiceSettings: data?.invoiceSettings || {},
      businessSettings: data?.businessSettings || {},
      companyInfo: data?.companyInfo || {
        name: 'AsamiWorks',
        postalCode: '532-0011',
        address: '大阪府大阪市淀川区西中島 5-6-13 新大阪御幸ビル 6F',
        phone: '06-4866-6758',
        email: 'info@asami-works.com',
      },
      emailSettings: data?.emailSettings || defaultEmailSettings,
    });
  } catch (error: any) {
    console.error('Error loading settings:', error);
    return NextResponse.json(
      { error: error.message || '設定の読み込みに失敗しました' },
      { status: 500 }
    );
  }
}

// 設定を保存
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bankInfo, invoiceSettings, businessSettings, companyInfo, emailSettings } = body;

    const settingsRef = db.collection('settings').doc('admin');

    await settingsRef.set(
      {
        bankInfo: bankInfo || {},
        invoiceSettings: invoiceSettings || {},
        businessSettings: businessSettings || {},
        companyInfo: companyInfo || {},
        emailSettings: emailSettings || defaultEmailSettings,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: '設定を保存しました',
    });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: error.message || '設定の保存に失敗しました' },
      { status: 500 }
    );
  }
}
