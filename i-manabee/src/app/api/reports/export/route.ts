import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { WeeklyReportGenerator } from '@/lib/reports/generator';
import { ReportExporter, type ExportType } from '@/lib/reports/exporters';
import { getUsageTracker } from '@/lib/usage/tracker';
import type { Usage } from '@/types/usage';

/**
 * レポートエクスポートAPI
 * POST /api/reports/export
 */
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;

    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json(
        { error: '認証トークンが無効です' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    // リクエストボディ
    const body = await request.json();
    const { type, startDate, endDate } = body as {
      type: ExportType;
      startDate: string;
      endDate: string;
    };

    // バリデーション
    if (!type || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'type, startDate, endDateは必須です' },
        { status: 400 }
      );
    }

    if (!['summary', 'detailed', 'full'].includes(type)) {
      return NextResponse.json(
        { error: 'typeはsummary, detailed, fullのいずれかです' },
        { status: 400 }
      );
    }

    // 日付変換
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: '日付フォーマットが無効です' },
        { status: 400 }
      );
    }

    if (start > end) {
      return NextResponse.json(
        { error: '開始日は終了日より前である必要があります' },
        { status: 400 }
      );
    }

    // エクスポートタイプ別処理
    let csvContent: string;

    switch (type) {
      case 'summary':
        csvContent = await generateSummaryCSV(userId, start, end);
        break;

      case 'detailed':
        csvContent = await generateDetailedCSV(userId, start, end);
        break;

      case 'full':
        // 90日以内のチェック
        const daysDiff = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 90) {
          return NextResponse.json(
            { error: '完全データは90日以内のみエクスポート可能です' },
            { status: 400 }
          );
        }
        csvContent = await generateFullCSV(userId, start, end);
        break;

      default:
        return NextResponse.json(
          { error: '無効なエクスポートタイプです' },
          { status: 400 }
        );
    }

    // CSVレスポンス
    const blob = ReportExporter.createCSVBlob(csvContent);
    const filename = ReportExporter.generateFilename(
      type,
      startDate.replace(/\//g, '-'),
      endDate.replace(/\//g, '-')
    );

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv;charset=utf-8;',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'エクスポート処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * サマリーCSV生成（月次統計ベース）
 */
async function generateSummaryCSV(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<string> {
  // WeeklyReportGeneratorを使用してデータ取得
  const reportData = await WeeklyReportGenerator.generateWeeklyReport(
    userId,
    startDate,
    endDate
  );

  return ReportExporter.generateSummaryCSV(reportData);
}

/**
 * 詳細CSV生成（日次データベース）
 */
async function generateDetailedCSV(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<string> {
  const tracker = getUsageTracker();

  // 日付範囲のusageデータ取得
  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];

  const usageHistory = await tracker.getUsageHistory(userId, start, end);

  // 子ども名のマッピング取得
  const childrenQuery = query(
    collection(db, 'child_profiles'),
    where('parentId', '==', userId)
  );
  const childrenSnapshot = await getDocs(childrenQuery);

  const childrenNames: Record<string, string> = {};
  childrenSnapshot.docs.forEach(doc => {
    const data = doc.data();
    childrenNames[doc.id] = data.nickname || data.name || '不明';
  });

  return ReportExporter.generateDetailedCSV(usageHistory, childrenNames);
}

/**
 * 完全データCSV生成（全メッセージ）
 */
async function generateFullCSV(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<string> {
  // chat_messagesから取得
  const messagesQuery = query(
    collection(db, 'chat_messages'),
    where('userId', '==', userId),
    where('timestamp', '>=', startDate.toISOString()),
    where('timestamp', '<=', endDate.toISOString()),
    orderBy('timestamp', 'asc')
  );

  const messagesSnapshot = await getDocs(messagesQuery);

  // 子ども名のマッピング取得
  const childrenQuery = query(
    collection(db, 'child_profiles'),
    where('parentId', '==', userId)
  );
  const childrenSnapshot = await getDocs(childrenQuery);

  const childrenNames: Record<string, string> = {};
  childrenSnapshot.docs.forEach(doc => {
    const data = doc.data();
    childrenNames[doc.id] = data.nickname || data.name || '不明';
  });

  // メッセージデータ整形
  const messages = messagesSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      timestamp: data.timestamp || data.createdAt?.toDate?.()?.toISOString() || '',
      childName: childrenNames[data.childId] || '不明',
      role: data.role as 'user' | 'assistant',
      content: data.content || '',
      subject: data.subject,
      model: data.model,
      tokens: data.tokens,
      safetyFlag: data.safetyFlag || 'safe',
    };
  });

  return ReportExporter.generateFullCSV(messages);
}
