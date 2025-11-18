import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase-admin';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Firebase Authトークンを検証
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decodedToken;

    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      console.error('[Receipt API] Token verification failed');
      return NextResponse.json(
        { error: '認証トークンが無効です' },
        { status: 401 }
      );
    }

    const authUid = decodedToken.uid;

    // authUidからクライアント情報を取得
    const clientsSnapshot = await db.collection('clients')
      .where('authUid', '==', authUid)
      .limit(1)
      .get();

    if (clientsSnapshot.empty) {
      return NextResponse.json(
        { error: 'クライアント情報が見つかりません' },
        { status: 404 }
      );
    }

    const clientId = clientsSnapshot.docs[0].id;

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

    const invoice = invoiceDoc.data();

    // 請求書が現在のクライアントのものか確認
    if (invoice?.clientId !== clientId) {
      return NextResponse.json(
        { error: 'この請求書にアクセスする権限がありません' },
        { status: 403 }
      );
    }

    // 支払い済みチェック
    if (invoice?.status !== 'paid') {
      return NextResponse.json(
        { error: '領収書は支払い済みの請求書のみ生成できます' },
        { status: 400 }
      );
    }

    // 既に領収書が生成されている場合は既存のURLを返す
    if (invoice.receiptUrl) {
      return NextResponse.json({
        success: true,
        receiptUrl: invoice.receiptUrl,
        message: '領収書は既に生成されています'
      });
    }

    // Firebase Functionsの領収書生成エンドポイントを呼び出し
    const functionsUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-asamiworks-679b3.cloudfunctions.net';
    const response = await fetch(`${functionsUrl}/generateReceiptPDF`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ADMIN_SECRET_KEY || 'dev-secret-key'}`
      },
      body: JSON.stringify({ invoiceId: id })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate receipt PDF');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      receiptUrl: data.receiptUrl,
      message: '領収書PDFを生成しました'
    });

  } catch (error: any) {
    console.error('Error generating receipt:', error);
    return NextResponse.json(
      { error: error.message || '領収書生成に失敗しました' },
      { status: 500 }
    );
  }
}
