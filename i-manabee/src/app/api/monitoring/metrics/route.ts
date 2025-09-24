// パフォーマンスメトリクス収集API
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { checkAPIRateLimit } from '@/lib/security/rateLimit';

interface PerformanceMetric {
  name: string;
  value: number;
  unit?: string;
  metadata?: Record<string, any>;
  timestamp: number;
  userId?: string;
  ageGroup?: 'junior' | 'middle' | 'senior';
}

export async function POST(request: NextRequest) {
  try {
    // レート制限チェック
    const rateLimitResult = await checkAPIRateLimit(request, 'general');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { metrics }: { metrics: PerformanceMetric[] } = body;

    if (!Array.isArray(metrics) || metrics.length === 0) {
      return NextResponse.json(
        { error: 'Invalid metrics data' },
        { status: 400 }
      );
    }

    // メトリクスの検証
    const validatedMetrics = metrics.filter(metric => {
      return (
        typeof metric.name === 'string' &&
        typeof metric.value === 'number' &&
        typeof metric.timestamp === 'number' &&
        !isNaN(metric.value) &&
        metric.timestamp > 0
      );
    });

    if (validatedMetrics.length === 0) {
      return NextResponse.json(
        { error: 'No valid metrics found' },
        { status: 400 }
      );
    }

    // Firestoreに保存（バッチ処理）
    const batch = db.batch();
    const collectionRef = db.collection('performance_metrics');

    validatedMetrics.forEach(metric => {
      const docRef = collectionRef.doc();
      batch.set(docRef, {
        ...metric,
        createdAt: new Date(metric.timestamp),
        serverTimestamp: new Date()
      });
    });

    await batch.commit();

    // 異常値のチェック（アラート条件）
    const alerts = checkMetricAlerts(validatedMetrics);

    // 統計情報の更新
    await updateMetricStatistics(validatedMetrics);

    console.log(`Stored ${validatedMetrics.length} performance metrics`, {
      totalReceived: metrics.length,
      totalValid: validatedMetrics.length,
      alertsCount: alerts.length
    });

    return NextResponse.json({
      success: true,
      stored: validatedMetrics.length,
      alerts: alerts.length,
      message: 'Metrics stored successfully'
    });

  } catch (error) {
    console.error('Failed to store performance metrics:', error);

    return NextResponse.json(
      { error: 'Failed to store metrics' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // レート制限チェック
    const rateLimitResult = await checkAPIRateLimit(request, 'general');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const metricName = searchParams.get('metric');
    const timeRange = searchParams.get('timeRange') || '1h';
    const limit = parseInt(searchParams.get('limit') || '100');

    // 時間範囲の計算
    const now = new Date();
    let startTime: Date;

    switch (timeRange) {
      case '5m':
        startTime = new Date(now.getTime() - 5 * 60 * 1000);
        break;
      case '15m':
        startTime = new Date(now.getTime() - 15 * 60 * 1000);
        break;
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
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
    }

    // Firestoreクエリの構築
    let query = db.collection('performance_metrics')
      .where('createdAt', '>=', startTime)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (metricName) {
      query = query.where('name', '==', metricName);
    }

    const snapshot = await query.get();
    const metrics = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 統計情報の計算
    const stats = calculateMetricStats(metrics);

    return NextResponse.json({
      metrics,
      stats,
      timeRange,
      totalCount: metrics.length
    });

  } catch (error) {
    console.error('Failed to retrieve performance metrics:', error);

    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    );
  }
}

// メトリクスアラートのチェック
function checkMetricAlerts(metrics: PerformanceMetric[]): Array<{
  metric: string;
  value: number;
  threshold: number;
  severity: 'warning' | 'critical';
}> {
  const alerts: Array<{
    metric: string;
    value: number;
    threshold: number;
    severity: 'warning' | 'critical';
  }> = [];

  // アラート閾値の定義
  const thresholds: Record<string, { warning: number; critical: number }> = {
    'page_load_time': { warning: 3000, critical: 5000 },
    'api_response_time': { warning: 2000, critical: 5000 },
    'largest_contentful_paint': { warning: 2500, critical: 4000 },
    'first_input_delay': { warning: 100, critical: 300 },
    'cumulative_layout_shift': { warning: 0.1, critical: 0.25 },
    'memory_usage_percent': { warning: 70, critical: 90 },
    'error_rate': { warning: 5, critical: 10 }
  };

  metrics.forEach(metric => {
    const threshold = thresholds[metric.name];
    if (!threshold) return;

    if (metric.value >= threshold.critical) {
      alerts.push({
        metric: metric.name,
        value: metric.value,
        threshold: threshold.critical,
        severity: 'critical'
      });
    } else if (metric.value >= threshold.warning) {
      alerts.push({
        metric: metric.name,
        value: metric.value,
        threshold: threshold.warning,
        severity: 'warning'
      });
    }
  });

  return alerts;
}

// 統計情報の更新
async function updateMetricStatistics(metrics: PerformanceMetric[]): Promise<void> {
  try {
    const now = new Date();
    const statsRef = db.collection('metric_statistics').doc('current');

    // 現在の統計を取得
    const currentStats = await statsRef.get();
    const stats = currentStats.exists ? currentStats.data() : {};

    // メトリクス別に統計を更新
    const metricGroups: Record<string, PerformanceMetric[]> = {};
    metrics.forEach(metric => {
      if (!metricGroups[metric.name]) {
        metricGroups[metric.name] = [];
      }
      metricGroups[metric.name].push(metric);
    });

    Object.entries(metricGroups).forEach(([metricName, metricList]) => {
      const values = metricList.map(m => m.value);
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      // 既存の統計と結合
      const existing = stats[metricName] || {
        count: 0,
        sum: 0,
        min: Infinity,
        max: -Infinity,
        avg: 0
      };

      stats[metricName] = {
        count: existing.count + values.length,
        sum: existing.sum + sum,
        min: Math.min(existing.min, min),
        max: Math.max(existing.max, max),
        avg: (existing.sum + sum) / (existing.count + values.length),
        lastUpdated: now
      };
    });

    await statsRef.set(stats, { merge: true });
  } catch (error) {
    console.error('Failed to update metric statistics:', error);
  }
}

// メトリクス統計の計算
function calculateMetricStats(metrics: any[]): Record<string, any> {
  if (metrics.length === 0) return {};

  const statsByMetric: Record<string, any> = {};

  // メトリクス名別にグループ化
  const grouped = metrics.reduce((acc, metric) => {
    if (!acc[metric.name]) {
      acc[metric.name] = [];
    }
    acc[metric.name].push(metric.value);
    return acc;
  }, {} as Record<string, number[]>);

  // 各メトリクスの統計を計算
  Object.entries(grouped).forEach(([name, values]) => {
    const sortedValues = values.sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);

    statsByMetric[name] = {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: sum / values.length,
      median: sortedValues[Math.floor(sortedValues.length / 2)],
      p95: sortedValues[Math.floor(sortedValues.length * 0.95)],
      p99: sortedValues[Math.floor(sortedValues.length * 0.99)]
    };
  });

  return statsByMetric;
}