import { NextRequest, NextResponse } from 'next/server';
import { SafetyEmailNotifier } from '@/lib/notifications/email';
import { EnhancedSafetyDetector } from '@/lib/safety/detector';
import { doc, addDoc, collection, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'safety_alert':
        return await handleSafetyAlert(data);
      case 'weekly_report':
        return await handleWeeklyReport(data);
      default:
        return NextResponse.json(
          { error: 'Invalid notification type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 安全性アラート通知処理
 */
async function handleSafetyAlert(data: {
  message: string;
  childId: string;
  userId: string;
  previousMessages?: string[];
}) {
  try {
    const { message, childId, userId, previousMessages = [] } = data;

    // 安全性分析実行
    const analysis = EnhancedSafetyDetector.analyze(message, previousMessages);

    // INFO レベルの場合は通知せず、ログのみ
    if (analysis.level === 'info' && !analysis.needsImmediateAction) {
      return NextResponse.json({
        success: true,
        level: 'info',
        message: 'Analysis completed, no notification sent'
      });
    }

    // ユーザー情報とプロファイル取得
    const [userDoc, childDoc] = await Promise.all([
      getDoc(doc(db, 'users', userId)),
      getDoc(doc(db, 'children', childId))
    ]);

    if (!userDoc.exists() || !childDoc.exists()) {
      return NextResponse.json(
        { error: 'User or child not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const childData = childDoc.data();

    // 安全性ログ作成
    const safetyLog = EnhancedSafetyDetector.createSafetyLog(
      analysis,
      childId,
      userId,
      message
    );

    // Firestoreに保存
    const logRef = await addDoc(collection(db, 'safetyLogs'), {
      ...safetyLog,
      createdAt: new Date(),
    });

    // メール通知送信（WARNING以上のレベル）
    if (analysis.level === 'warning' || analysis.level === 'critical') {
      const notificationData = {
        childName: childData.name,
        parentName: userData.displayName || userData.email,
        parentEmail: userData.email,
        safetyLog: { ...safetyLog, id: logRef.id },
        analysis,
        emergencyContacts: analysis.level === 'critical' ? [
          {
            organization: 'いのちの電話',
            phone: '0570-783-556',
            website: 'https://www.inochinodenwa.org'
          },
          {
            organization: 'チャイルドライン',
            phone: '0120-99-7777',
            website: 'https://childline.or.jp'
          }
        ] : undefined
      };

      const emailSent = await SafetyEmailNotifier.sendSafetyAlert(notificationData);

      // 通知状態を更新
      if (emailSent) {
        await addDoc(collection(db, 'notifications'), {
          type: 'safety_alert',
          userId,
          childId,
          safetyLogId: logRef.id,
          sentAt: new Date(),
          email: userData.email,
          level: analysis.level,
        });
      }

      return NextResponse.json({
        success: true,
        level: analysis.level,
        confidence: analysis.confidence,
        emailSent,
        logId: logRef.id,
        recommendedResponse: analysis.recommendedResponse,
      });
    }

    return NextResponse.json({
      success: true,
      level: analysis.level,
      confidence: analysis.confidence,
      logId: logRef.id,
    });

  } catch (error) {
    console.error('Safety alert handling error:', error);
    return NextResponse.json(
      { error: 'Failed to process safety alert' },
      { status: 500 }
    );
  }
}

/**
 * 週次レポート通知処理
 */
async function handleWeeklyReport(data: {
  userId: string;
  weekStart: string;
  weekEnd: string;
}) {
  try {
    const { userId, weekStart, weekEnd } = data;

    // ユーザー情報取得
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // 週次データ集計（簡易版）
    const reportData = {
      weekStart,
      weekEnd,
      totalMessages: 45, // TODO: 実際のデータ集計
      safetyEvents: [], // TODO: 実際の安全性イベント取得
      learningTopics: ['算数: 分数の計算', '国語: 漢字練習', '理科: 植物の観察'],
      positiveInteractions: 42,
    };

    // 週次レポート送信
    const emailSent = await SafetyEmailNotifier.sendWeeklyReport(
      userData.email,
      userData.displayName || userData.email,
      '太郎', // TODO: 子どもの名前を動的に取得
      reportData
    );

    if (emailSent) {
      // 送信記録を保存
      await addDoc(collection(db, 'notifications'), {
        type: 'weekly_report',
        userId,
        sentAt: new Date(),
        email: userData.email,
        weekStart,
        weekEnd,
      });
    }

    return NextResponse.json({
      success: true,
      emailSent,
      reportData,
    });

  } catch (error) {
    console.error('Weekly report handling error:', error);
    return NextResponse.json(
      { error: 'Failed to send weekly report' },
      { status: 500 }
    );
  }
}