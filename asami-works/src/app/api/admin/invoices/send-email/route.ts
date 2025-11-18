import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { invoiceId } = await request.json();

    if (!invoiceId) {
      return NextResponse.json(
        { error: '請求書IDが必要です' },
        { status: 400 }
      );
    }

    // 請求書を取得
    const invoiceDoc = await db.collection('invoices').doc(invoiceId).get();
    if (!invoiceDoc.exists) {
      return NextResponse.json(
        { error: '請求書が見つかりません' },
        { status: 404 }
      );
    }

    const invoice = invoiceDoc.data();

    // クライアントを取得
    const clientDoc = await db.collection('clients').doc(invoice?.clientId).get();
    if (!clientDoc.exists) {
      return NextResponse.json(
        { error: 'クライアントが見つかりません' },
        { status: 404 }
      );
    }

    const client = clientDoc.data();

    // 認証設定済みかどうかをチェック
    if (!client?.authUid) {
      return NextResponse.json(
        { error: 'このクライアントは認証設定がされていないため、メール送信できません' },
        { status: 400 }
      );
    }

    // メールアドレスを取得
    const clientEmail = client.email;
    if (!clientEmail) {
      return NextResponse.json(
        { error: 'クライアントのメールアドレスが設定されていません' },
        { status: 400 }
      );
    }

    // 設定を取得
    const settingsDoc = await db.collection('settings').doc('admin').get();
    const settings = settingsDoc.exists ? settingsDoc.data() : {};

    const emailSettings = settings?.emailSettings || {
      invoiceSubject: '【AsamiWorks】請求書のご送付',
      invoiceBody: `{clientName} 様

いつもお世話になっております。
AsamiWorksです。

{billingMonth}分の請求書をお送りいたします。

■ 請求内容
請求書番号: {invoiceNumber}
お支払期限: {dueDate}

【内訳】
{itemsBreakdown}
-------------------
合計金額: {totalAmount}

請求書の詳細は、マイページよりご確認いただけます。
{mypageUrl}

ご不明な点がございましたら、お気軽にお問い合わせください。

---
AsamiWorks
Email: info@asami-works.com
Web: https://asami-works.com`,
    };

    // 日付をフォーマット
    const formatDate = (timestamp: any) => {
      if (!timestamp) return '-';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    };

    // 金額をフォーマット
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY'
      }).format(amount);
    };

    // 請求月を取得（発行日の前月）
    const issueDate = invoice?.issueDate?.toDate ? invoice.issueDate.toDate() : new Date(invoice?.issueDate);
    const billingDate = new Date(issueDate.getFullYear(), issueDate.getMonth() - 1, 1);
    const billingMonth = `${billingDate.getFullYear()}年${billingDate.getMonth() + 1}月`;

    // マイページURL
    const mypageUrl = `https://asami-works.com/mypage`;

    // 内訳テキストを生成
    const items = invoice?.items || [];
    const itemsBreakdown = items.map((item: any) => {
      const quantity = item.quantity || 1;
      const amount = item.amount || 0;
      if (quantity === 1) {
        return `・${item.description}: ${formatCurrency(amount)}`;
      } else {
        return `・${item.description} × ${quantity}: ${formatCurrency(amount * quantity)}`;
      }
    }).join('\n');

    // プレースホルダーを置換
    const subject = emailSettings.invoiceSubject
      .replace(/{clientName}/g, client.clientName)
      .replace(/{invoiceNumber}/g, invoice?.invoiceNumber)
      .replace(/{billingMonth}/g, billingMonth);

    let body = emailSettings.invoiceBody
      .replace(/{clientName}/g, client.clientName)
      .replace(/{invoiceNumber}/g, invoice?.invoiceNumber)
      .replace(/{totalAmount}/g, formatCurrency(invoice?.totalAmount))
      .replace(/{dueDate}/g, formatDate(invoice?.dueDate))
      .replace(/{billingMonth}/g, billingMonth)
      .replace(/{mypageUrl}/g, mypageUrl);

    // 内訳プレースホルダーがある場合は置換、ない場合は請求金額の後に挿入
    if (body.includes('{itemsBreakdown}')) {
      body = body.replace(/{itemsBreakdown}/g, itemsBreakdown);
    } else {
      // 請求金額の行を探して、その前に内訳を挿入
      const totalAmountLine = `請求金額: ${formatCurrency(invoice?.totalAmount)}`;
      if (body.includes(totalAmountLine)) {
        body = body.replace(
          totalAmountLine,
          `【内訳】\n${itemsBreakdown}\n-------------------\n合計金額: ${formatCurrency(invoice?.totalAmount)}`
        );
      } else {
        // 請求金額行が見つからない場合は、お支払期限の後に追加
        const dueDateLine = `お支払期限: ${formatDate(invoice?.dueDate)}`;
        if (body.includes(dueDateLine)) {
          body = body.replace(
            dueDateLine,
            `${dueDateLine}\n\n【内訳】\n${itemsBreakdown}\n-------------------\n合計金額: ${formatCurrency(invoice?.totalAmount)}`
          );
        }
      }
    }

    // Cloud Functions経由でメール送信（請求書専用）
    const cloudFunctionUrl = 'https://us-central1-asamiworks-679b3.cloudfunctions.net/sendInvoiceEmail';

    const response = await fetch(cloudFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: clientEmail,
        subject: subject,
        body: body,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Email send error:', errorText);
      throw new Error('メール送信に失敗しました');
    }

    // 請求書にメール送信日時を記録
    await db.collection('invoices').doc(invoiceId).update({
      emailSentAt: new Date().toISOString(),
      emailSentTo: clientEmail,
    });

    return NextResponse.json({
      success: true,
      message: `請求書を ${clientEmail} に送信しました`,
    });

  } catch (error: any) {
    console.error('Error sending invoice email:', error);
    return NextResponse.json(
      { error: error.message || 'メール送信に失敗しました' },
      { status: 500 }
    );
  }
}
