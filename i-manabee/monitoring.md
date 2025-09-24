# i-manabee モニタリング・ログ設定

## 概要

本番環境でのシステム監視、ログ管理、パフォーマンス監視の設定について説明します。

## 1. システム監視

### Vercel Analytics 設定

```bash
# Vercel Analytics のインストール
npm install @vercel/analytics @vercel/speed-insights
```

```typescript
// src/app/layout.tsx に追加
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Firebase Performance Monitoring

```typescript
// src/lib/firebase/performance.ts
import { getPerformance, trace, connectPerformanceEmulator } from 'firebase/performance';
import { app } from './config';

let performance: any = null;

if (typeof window !== 'undefined') {
  performance = getPerformance(app);

  // 開発環境では Performance Emulator に接続
  if (process.env.NODE_ENV === 'development' && !performance._delegate._initialized) {
    connectPerformanceEmulator(performance, 'localhost', 9090);
  }
}

// パフォーマンストレース
export function createTrace(name: string) {
  if (!performance) return null;
  return trace(performance, name);
}

// カスタムメトリクス
export function recordMetric(traceName: string, metricName: string, value: number) {
  if (!performance) return;

  const customTrace = trace(performance, traceName);
  customTrace.putMetric(metricName, value);
}

// AI応答時間の測定
export async function measureAIResponse<T>(
  operation: () => Promise<T>,
  childAge?: number
): Promise<T> {
  const traceInstance = createTrace('ai_response_time');
  traceInstance?.start();

  if (childAge) {
    traceInstance?.putAttribute('child_age_group',
      childAge <= 12 ? 'junior' : childAge <= 15 ? 'middle' : 'senior'
    );
  }

  try {
    const result = await operation();
    traceInstance?.putAttribute('status', 'success');
    return result;
  } catch (error) {
    traceInstance?.putAttribute('status', 'error');
    throw error;
  } finally {
    traceInstance?.stop();
  }
}

export { performance };
```

## 2. ログ管理システム

### 構造化ログ設定

```typescript
// src/lib/logging/logger.ts
import { adminDb } from '@/lib/firebase/admin';

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  timestamp: Date;
  context: {
    userId?: string;
    childId?: string;
    sessionId?: string;
    requestId?: string;
    userAgent?: string;
    ipAddress?: string;
    route?: string;
    method?: string;
  };
  metadata?: Record<string, any>;
  tags?: string[];
}

export class Logger {
  private static instance: Logger;
  private logQueue: LogEntry[] = [];
  private batchSize = 50;
  private flushInterval = 5000; // 5秒
  private timer: NodeJS.Timeout;

  private constructor() {
    // 定期的にログをフラッシュ
    this.timer = setInterval(() => {
      this.flush();
    }, this.flushInterval);

    // プロセス終了時にログをフラッシュ
    process.on('exit', () => this.flush());
    process.on('SIGINT', () => {
      this.flush();
      process.exit(0);
    });
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // ログレベル別メソッド
  debug(message: string, context?: any, metadata?: any) {
    this.log('debug', message, context, metadata);
  }

  info(message: string, context?: any, metadata?: any) {
    this.log('info', message, context, metadata);
  }

  warn(message: string, context?: any, metadata?: any) {
    this.log('warn', message, context, metadata);
  }

  error(message: string, context?: any, metadata?: any) {
    this.log('error', message, context, metadata);
  }

  fatal(message: string, context?: any, metadata?: any) {
    this.log('fatal', message, context, metadata);
    // Fatalログは即座にフラッシュ
    this.flush();
  }

  private log(level: LogEntry['level'], message: string, context?: any, metadata?: any) {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: context || {},
      metadata,
      tags: this.generateTags(level, context)
    };

    this.logQueue.push(logEntry);

    // 緊急ログまたはキューが満杯の場合は即座にフラッシュ
    if (level === 'fatal' || level === 'error' || this.logQueue.length >= this.batchSize) {
      this.flush();
    }

    // コンソールにも出力（開発環境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level.toUpperCase()}] ${message}`, context, metadata);
    }
  }

  private generateTags(level: string, context?: any): string[] {
    const tags = [level];

    if (context?.childId) tags.push('child_session');
    if (context?.userId) tags.push('user_action');
    if (context?.route?.includes('/api/')) tags.push('api_call');
    if (context?.route?.includes('/chat')) tags.push('chat_interaction');

    return tags;
  }

  private async flush() {
    if (this.logQueue.length === 0) return;

    const logsToFlush = [...this.logQueue];
    this.logQueue = [];

    try {
      // Firebase Firestoreにバッチ書き込み
      const batch = adminDb.batch();

      logsToFlush.forEach(logEntry => {
        const docRef = adminDb.collection('application_logs').doc();
        batch.set(docRef, {
          ...logEntry,
          id: docRef.id
        });
      });

      await batch.commit();

      // 外部ログサービスにも送信（本番環境）
      if (process.env.NODE_ENV === 'production') {
        await this.sendToExternalService(logsToFlush);
      }

    } catch (error) {
      console.error('Log flush failed:', error);
      // 失敗したログを再キューに追加
      this.logQueue.unshift(...logsToFlush);
    }
  }

  private async sendToExternalService(logs: LogEntry[]) {
    // 外部ログサービス（例：Datadog、CloudWatch、Splunk等）への送信
    try {
      const logData = logs.map(log => ({
        timestamp: log.timestamp.toISOString(),
        level: log.level,
        message: log.message,
        service: 'i-manabee',
        environment: process.env.NODE_ENV,
        ...log.context,
        ...log.metadata,
        tags: log.tags?.join(',')
      }));

      // 実際の実装では使用するサービスのAPIを呼び出し
      console.log('Sending logs to external service:', logData.length, 'entries');

    } catch (error) {
      console.error('External log service failed:', error);
    }
  }

  destroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.flush();
  }
}

// シングルトンインスタンス
export const logger = Logger.getInstance();

// 使用例のヘルパー関数
export const logChatInteraction = (
  userId: string,
  childId: string,
  message: string,
  response: string,
  metadata: any
) => {
  logger.info('Chat interaction completed', {
    userId,
    childId,
    route: '/api/chat/send'
  }, {
    messageLength: message.length,
    responseLength: response.length,
    safetyScore: metadata.safetyScore,
    tokensUsed: metadata.tokens,
    model: metadata.model
  });
};

export const logSecurityEvent = (
  eventType: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  context: any,
  metadata?: any
) => {
  const logLevel = severity === 'critical' ? 'fatal' :
                   severity === 'high' ? 'error' :
                   severity === 'medium' ? 'warn' : 'info';

  logger[logLevel](`Security event: ${eventType}`, {
    ...context,
    tags: ['security', severity]
  }, metadata);
};

export const logPerformanceMetric = (
  operation: string,
  duration: number,
  context: any,
  metadata?: any
) => {
  logger.info(`Performance: ${operation}`, context, {
    duration_ms: duration,
    ...metadata
  });
};
```

## 3. アラート設定

### アラートルール設定

```typescript
// src/lib/monitoring/alerts.ts
export interface AlertRule {
  name: string;
  condition: string;
  threshold: number;
  duration: number; // 継続時間（秒）
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: ('email' | 'slack' | 'sms')[];
  enabled: boolean;
}

export const ALERT_RULES: AlertRule[] = [
  // システム稼働率
  {
    name: 'System Downtime',
    condition: 'availability < 0.99',
    threshold: 0.99,
    duration: 300, // 5分
    severity: 'critical',
    channels: ['email', 'slack', 'sms'],
    enabled: true
  },

  // API応答時間
  {
    name: 'High API Response Time',
    condition: 'avg(api_response_time) > 5000',
    threshold: 5000, // 5秒
    duration: 600, // 10分
    severity: 'high',
    channels: ['email', 'slack'],
    enabled: true
  },

  // エラー率
  {
    name: 'High Error Rate',
    condition: 'error_rate > 0.05',
    threshold: 0.05, // 5%
    duration: 300,
    severity: 'high',
    channels: ['email', 'slack'],
    enabled: true
  },

  // セキュリティ関連
  {
    name: 'Security Incident',
    condition: 'security_events > 0',
    threshold: 0,
    duration: 0, // 即座
    severity: 'critical',
    channels: ['email', 'slack', 'sms'],
    enabled: true
  },

  // OpenAI API制限
  {
    name: 'OpenAI Rate Limit',
    condition: 'openai_rate_limit_errors > 10',
    threshold: 10,
    duration: 300,
    severity: 'medium',
    channels: ['slack'],
    enabled: true
  },

  // 子どもの安全関連
  {
    name: 'Child Safety Alert',
    condition: 'emergency_alerts > 0',
    threshold: 0,
    duration: 0,
    severity: 'critical',
    channels: ['email', 'sms'],
    enabled: true
  },

  // リソース使用量
  {
    name: 'High Memory Usage',
    condition: 'memory_usage > 0.85',
    threshold: 0.85, // 85%
    duration: 900, // 15分
    severity: 'medium',
    channels: ['slack'],
    enabled: true
  },

  // データベース接続
  {
    name: 'Database Connection Issues',
    condition: 'db_connection_errors > 5',
    threshold: 5,
    duration: 300,
    severity: 'high',
    channels: ['email', 'slack'],
    enabled: true
  }
];

// アラート送信クラス
export class AlertManager {
  private static instance: AlertManager;

  static getInstance(): AlertManager {
    if (!AlertManager.instance) {
      AlertManager.instance = new AlertManager();
    }
    return AlertManager.instance;
  }

  async sendAlert(rule: AlertRule, currentValue: number, context: any) {
    const alertData = {
      ruleName: rule.name,
      severity: rule.severity,
      currentValue,
      threshold: rule.threshold,
      timestamp: new Date(),
      context
    };

    // 複数チャンネルに並行送信
    const notifications = rule.channels.map(channel => {
      switch (channel) {
        case 'email':
          return this.sendEmailAlert(alertData);
        case 'slack':
          return this.sendSlackAlert(alertData);
        case 'sms':
          return this.sendSMSAlert(alertData);
      }
    });

    try {
      await Promise.all(notifications);
    } catch (error) {
      console.error('Alert sending failed:', error);
    }

    // アラート履歴を記録
    await this.logAlert(alertData);
  }

  private async sendEmailAlert(alertData: any) {
    // メール送信の実装
    console.log('Sending email alert:', alertData);
  }

  private async sendSlackAlert(alertData: any) {
    // Slack通知の実装
    console.log('Sending Slack alert:', alertData);
  }

  private async sendSMSAlert(alertData: any) {
    // SMS送信の実装
    console.log('Sending SMS alert:', alertData);
  }

  private async logAlert(alertData: any) {
    await adminDb.collection('alert_history').add({
      ...alertData,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
  }
}
```

## 4. ダッシュボード設定

### カスタムダッシュボード

```typescript
// src/app/(admin)/monitoring/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { logger } from '@/lib/logging/logger';

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState({
    systemHealth: 'healthy',
    activeUsers: 0,
    activeSessions: 0,
    errorRate: 0,
    averageResponseTime: 0,
    aiRequestsPerHour: 0,
    securityAlerts: []
  });

  useEffect(() => {
    // メトリクスを定期的に更新
    const interval = setInterval(fetchMetrics, 30000);
    fetchMetrics(); // 初回実行

    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      logger.error('Failed to fetch metrics', { route: '/monitoring' }, { error });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">システム監視ダッシュボード</h1>

      {/* システム状態 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-600">システム状態</h3>
          <div className={`text-2xl font-bold ${
            metrics.systemHealth === 'healthy' ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.systemHealth === 'healthy' ? '正常' : '異常'}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-600">アクティブユーザー</h3>
          <div className="text-2xl font-bold text-blue-600">
            {metrics.activeUsers}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-600">アクティブセッション</h3>
          <div className="text-2xl font-bold text-green-600">
            {metrics.activeSessions}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-600">エラー率</h3>
          <div className={`text-2xl font-bold ${
            metrics.errorRate > 0.05 ? 'text-red-600' : 'text-green-600'
          }`}>
            {(metrics.errorRate * 100).toFixed(2)}%
          </div>
        </Card>
      </div>

      {/* パフォーマンス指標 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-600 mb-4">平均応答時間</h3>
          <div className={`text-3xl font-bold ${
            metrics.averageResponseTime > 5000 ? 'text-red-600' :
            metrics.averageResponseTime > 2000 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {metrics.averageResponseTime}ms
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-600 mb-4">AI リクエスト数/時</h3>
          <div className="text-3xl font-bold text-blue-600">
            {metrics.aiRequestsPerHour}
          </div>
        </Card>
      </div>

      {/* セキュリティアラート */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-600 mb-4">セキュリティアラート</h3>
        {metrics.securityAlerts.length === 0 ? (
          <div className="text-green-600 font-medium">アラートはありません</div>
        ) : (
          <div className="space-y-2">
            {metrics.securityAlerts.map((alert: any, index: number) => (
              <div key={index} className={`p-3 rounded ${
                alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                <div className="font-semibold">{alert.type}</div>
                <div className="text-sm">{alert.message}</div>
                <div className="text-xs opacity-75">
                  {new Date(alert.timestamp).toLocaleString('ja-JP')}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
```

## 5. ログ分析とレポート

### 週次・月次レポート

```typescript
// src/lib/monitoring/reports.ts
export class MonitoringReports {
  static async generateWeeklyReport(): Promise<any> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 各種メトリクスを集計
    const metrics = await Promise.all([
      this.getUserActivityMetrics(startDate, endDate),
      this.getSystemPerformanceMetrics(startDate, endDate),
      this.getSecurityMetrics(startDate, endDate),
      this.getErrorAnalysis(startDate, endDate)
    ]);

    return {
      period: { start: startDate, end: endDate },
      userActivity: metrics[0],
      systemPerformance: metrics[1],
      security: metrics[2],
      errors: metrics[3],
      generatedAt: new Date()
    };
  }

  private static async getUserActivityMetrics(start: Date, end: Date) {
    // ユーザー活動メトリクス
    return {
      totalUsers: 0,
      activeUsers: 0,
      newRegistrations: 0,
      totalSessions: 0,
      averageSessionDuration: 0,
      chatInteractions: 0
    };
  }

  private static async getSystemPerformanceMetrics(start: Date, end: Date) {
    // システムパフォーマンス
    return {
      uptime: 0,
      averageResponseTime: 0,
      peakResponseTime: 0,
      requestsPerDay: 0,
      errorRate: 0
    };
  }

  private static async getSecurityMetrics(start: Date, end: Date) {
    // セキュリティメトリクス
    return {
      securityIncidents: 0,
      blockedRequests: 0,
      failedLogins: 0,
      rateLimitViolations: 0
    };
  }

  private static async getErrorAnalysis(start: Date, end: Date) {
    // エラー分析
    return {
      totalErrors: 0,
      errorsByType: {},
      topErrors: [],
      resolvedErrors: 0
    };
  }
}
```

この監視設定により、i-manabeeの本番環境を適切に監視し、問題の早期発見と対応が可能になります。