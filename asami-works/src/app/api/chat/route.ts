import { NextRequest, NextResponse } from 'next/server';

// Firebase Function URL
const CHAT_API_URL = process.env.CHAT_API_URL || 'https://us-central1-asamiworks-679b3.cloudfunctions.net/chatApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    // バリデーション
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Firebase Functionにリクエストを転送
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    // エラーレスポンスの処理
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Chat API request failed' },
        { status: response.status }
      );
    }

    // 成功レスポンスを返す
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Chat API proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

// OPTIONSリクエスト対応（CORS）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
