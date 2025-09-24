// アラート通知API
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { checkAPIRateLimit } from '@/lib/security/rateLimit';

interface Alert {
  alerts: string[];
  health?: any;
  timestamp: number;
  severity?: 'warning' | 'critical';
  source?: string;
}

interface NotificationChannel {
  type: 'email' | 'webhook' | 'sms';
  endpoint: string;
  enabled: boolean;
  conditions: {
    severities: Array<'warning' | 'critical'>;
    sources?: string[];
  };
}

// 通知チャンネルの設定
const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  {
    type: 'webhook',
    endpoint: process.env.SLACK_WEBHOOK_URL || '',
    enabled: !!process.env.SLACK_WEBHOOK_URL,
    conditions: {
      severities: ['warning', 'critical']
    }
  },
  {
    type: 'email',
    endpoint: process.env.ADMIN_EMAIL || '',
    enabled: !!process.env.ADMIN_EMAIL,
    conditions: {
      severities: ['critical']
    }
  }
];

export async function POST(request: NextRequest) {
  try {
    // レート制限チェック（アラート用の緩い制限）
    const rateLimitResult = await checkAPIRateLimit(request, 'admin');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const alertData: Alert = await request.json();

    if (!alertData.alerts || !Array.isArray(alertData.alerts)) {
      return NextResponse.json(
        { error: 'Invalid alert data' },
        { status: 400 }
      );
    }

    // アラートの重要度を判定
    const severity = determineSeverity(alertData.alerts);
    const enrichedAlert = {
      ...alertData,
      severity,
      source: 'health-check',
      id: generateAlertId()
    };

    // Firestoreにアラートを保存
    await saveAlert(enrichedAlert);

    // 通知の送信
    const notificationResults = await sendNotifications(enrichedAlert);

    // 重複アラートの抑制チェック
    const isDuplicate = await checkDuplicateAlert(enrichedAlert);

    console.log('Alert processed:', {
      alertId: enrichedAlert.id,
      severity,
      alertsCount: alertData.alerts.length,
      notificationsSent: notificationResults.filter(r => r.success).length,
      isDuplicate
    });

    return NextResponse.json({
      success: true,
      alertId: enrichedAlert.id,
      severity,
      notificationsSent: notificationResults.filter(r => r.success).length,
      isDuplicate
    });

  } catch (error) {
    console.error('Failed to process alert:', error);

    return NextResponse.json(
      { error: 'Failed to process alert' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // レート制限チェック
    const rateLimitResult = await checkAPIRateLimit(request, 'admin');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '50');

    // 時間範囲の計算
    const now = new Date();
    let startTime: Date;

    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
        startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Firestoreからアラートを取得
    let query = db.collection('alerts')
      .where('timestamp', '>=', startTime.getTime())
      .orderBy('timestamp', 'desc')
      .limit(limit);

    if (severity) {
      query = query.where('severity', '==', severity);
    }

    const snapshot = await query.get();
    const alerts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 統計情報の計算
    const stats = calculateAlertStats(alerts);

    return NextResponse.json({
      alerts,
      stats,
      timeRange,
      totalCount: alerts.length
    });

  } catch (error) {
    console.error('Failed to retrieve alerts:', error);

    return NextResponse.json(
      { error: 'Failed to retrieve alerts' },
      { status: 500 }
    );
  }
}

// アラートIDの生成
function generateAlertId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// アラートの重要度を判定
function determineSeverity(alerts: string[]): 'warning' | 'critical' {
  const criticalKeywords = [
    'システム全体が異常',
    '連続でシステムが異常',
    'データベース',
    '認証',
    'unhealthy',
    'メモリ使用率が90%'
  ];

  const hasCritical = alerts.some(alert =>
    criticalKeywords.some(keyword =>
      alert.toLowerCase().includes(keyword.toLowerCase())
    )
  );

  return hasCritical ? 'critical' : 'warning';
}

// アラートをFirestoreに保存
async function saveAlert(alert: any): Promise<void> {
  try {
    const alertRef = db.collection('alerts').doc(alert.id);
    await alertRef.set({
      ...alert,
      createdAt: new Date(alert.timestamp),
      serverTimestamp: new Date()
    });
  } catch (error) {
    console.error('Failed to save alert:', error);
    throw error;
  }
}

// 通知の送信
async function sendNotifications(alert: any): Promise<Array<{ channel: string; success: boolean; error?: string }>> {
  const results: Array<{ channel: string; success: boolean; error?: string }> = [];

  for (const channel of NOTIFICATION_CHANNELS) {
    if (!channel.enabled) continue;

    // 条件チェック
    if (!channel.conditions.severities.includes(alert.severity)) continue;
    if (channel.conditions.sources && !channel.conditions.sources.includes(alert.source)) continue;

    try {
      switch (channel.type) {
        case 'webhook':
          await sendWebhookNotification(channel.endpoint, alert);
          results.push({ channel: `webhook-${channel.endpoint}`, success: true });
          break;

        case 'email':
          await sendEmailNotification(channel.endpoint, alert);
          results.push({ channel: `email-${channel.endpoint}`, success: true });
          break;

        case 'sms':
          await sendSMSNotification(channel.endpoint, alert);
          results.push({ channel: `sms-${channel.endpoint}`, success: true });
          break;

        default:
          results.push({
            channel: `${channel.type}-${channel.endpoint}`,
            success: false,
            error: 'Unknown channel type'
          });
      }
    } catch (error) {
      results.push({
        channel: `${channel.type}-${channel.endpoint}`,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return results;
}

// Webhook通知の送信
async function sendWebhookNotification(webhookUrl: string, alert: any): Promise<void> {
  const payload = {
    text: `🚨 i-manabee Alert`,
    attachments: [
      {
        color: alert.severity === 'critical' ? 'danger' : 'warning',
        title: `${alert.severity.toUpperCase()} Alert`,
        fields: [
          {
            title: 'Alerts',
            value: alert.alerts.join('\n'),
            short: false
          },
          {
            title: 'Timestamp',
            value: new Date(alert.timestamp).toLocaleString('ja-JP'),
            short: true
          },
          {
            title: 'Alert ID',
            value: alert.id,
            short: true
          }
        ]
      }
    ]
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
  }
}

// Email通知の送信
async function sendEmailNotification(email: string, alert: any): Promise<void> {
  // TODO: 実際のメール送信サービス（SendGrid、SES等）との統合
  console.log(`Sending email notification to ${email}:`, alert.alerts.join(', '));

  // 現在はログ出力のみ
  // 実装時は以下のようなAPIコールになる
  /*
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: email,
      subject: `[i-manabee] ${alert.severity.toUpperCase()} Alert`,
      text: alert.alerts.join('\n'),
      html: generateEmailHTML(alert)
    })
  });
  */
}

// SMS通知の送信
async function sendSMSNotification(phoneNumber: string, alert: any): Promise<void> {
  // TODO: 実際のSMS送信サービス（Twilio等）との統合
  console.log(`Sending SMS notification to ${phoneNumber}:`, alert.alerts[0]);

  // 現在はログ出力のみ
  // 実装時は以下のようなAPIコールになる
  /*
  const response = await fetch('/api/send-sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: phoneNumber,
      message: `[i-manabee] ${alert.severity.toUpperCase()}: ${alert.alerts[0]}`
    })
  });
  */
}

// 重複アラートのチェック
async function checkDuplicateAlert(alert: any): Promise<boolean> {
  try {
    // 過去1時間以内の類似アラートをチェック
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    const snapshot = await db.collection('alerts')
      .where('timestamp', '>=', oneHourAgo)
      .where('source', '==', alert.source)
      .where('severity', '==', alert.severity)
      .limit(10)
      .get();

    // 同じアラート内容があるかチェック
    const existingAlerts = snapshot.docs.map(doc => doc.data());
    return existingAlerts.some(existing =>
      JSON.stringify(existing.alerts?.sort()) === JSON.stringify(alert.alerts?.sort())
    );
  } catch (error) {
    console.error('Failed to check duplicate alert:', error);
    return false;
  }
}

// アラート統計の計算
function calculateAlertStats(alerts: any[]): any {
  if (alerts.length === 0) return {};

  const now = Date.now();
  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    byHour: {} as Record<string, number>,
    topAlertTypes: {} as Record<string, number>,
    avgResponseTime: 0
  };

  // 時間別統計
  alerts.forEach(alert => {
    const hour = new Date(alert.timestamp).getHours();
    stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;

    // アラートタイプ別統計
    alert.alerts?.forEach((alertMessage: string) => {
      const type = extractAlertType(alertMessage);
      stats.topAlertTypes[type] = (stats.topAlertTypes[type] || 0) + 1;
    });
  });

  return stats;
}

// アラートタイプの抽出
function extractAlertType(alertMessage: string): string {
  if (alertMessage.includes('データベース')) return 'database';
  if (alertMessage.includes('認証')) return 'authentication';
  if (alertMessage.includes('API')) return 'api';
  if (alertMessage.includes('メモリ')) return 'memory';
  if (alertMessage.includes('CPU')) return 'cpu';
  if (alertMessage.includes('ネットワーク')) return 'network';
  if (alertMessage.includes('システム全体')) return 'system';
  return 'other';
}