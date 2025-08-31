'use client';

import { useMemo } from 'react';
import styles from './LandPriceChart.module.css';

interface PricePoint {
  year: number;
  price: number;  // 円単位の価格
  change: number;
}

interface LandPriceChartProps {
  data: PricePoint[];
  additionalInfo?: string[];
}

export default function LandPriceChart({ data, additionalInfo }: LandPriceChartProps) {
  // データが空の場合は何も表示しない
  if (!data || data.length === 0) {
    return null;
  }

  // 円を万円に変換する関数
  const toManYen = (price: number) => Math.round(price / 10000);

  const { minPrice, maxPrice, svgWidth, svgHeight, padding } = useMemo(() => {
    // 万円単位に変換
    const pricesInManYen = data.map(d => toManYen(d.price));
    const min = Math.min(...pricesInManYen);
    const max = Math.max(...pricesInManYen);
    const priceRange = max - min;
    const paddingValue = priceRange * 0.1;
    
    return {
      minPrice: Math.floor(min - paddingValue),
      maxPrice: Math.ceil(max + paddingValue),
      svgWidth: 700,
      svgHeight: 320,
      padding: { top: 30, right: 100, bottom: 60, left: 40 }
    };
  }, [data]);

  const latestData = data[data.length - 1]!;
  
  // グラフの描画エリアのサイズ
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // X座標を計算
  const getXPosition = (index: number) => {
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  // Y座標を計算（万円単位の価格を使用）
  const getYPosition = (priceInManYen: number) => {
    const ratio = (priceInManYen - minPrice) / (maxPrice - minPrice);
    return padding.top + chartHeight - (ratio * chartHeight);
  };

  // パスデータを生成
  const pathData = data
    .map((point, index) => {
      const x = getXPosition(index);
      const y = getYPosition(toManYen(point.price));
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Y軸のガイドライン
  const yAxisSteps = 5;
  const priceStep = (maxPrice - minPrice) / (yAxisSteps - 1);
  const yAxisGuides = Array.from({ length: yAxisSteps }, (_, i) => {
    const price = minPrice + priceStep * i;
    const y = getYPosition(price);
    return { price: Math.round(price), y };
  }).reverse();

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>地価推移（過去5年間）</h3>
      
      <div className={styles.contentWrapper}>
        <div className={styles.chartSection}>
          <div className={styles.chartWrapper}>
            <svg 
              width={svgWidth} 
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className={styles.svg}
            >
              {/* グリッドライン */}
              {yAxisGuides.map((guide, index) => (
                <line
                  key={index}
                  x1={padding.left}
                  y1={guide.y}
                  x2={svgWidth - padding.right}
                  y2={guide.y}
                  className={styles.gridLine}
                />
              ))}
              
              {/* X軸ライン */}
              <line
                x1={padding.left}
                y1={svgHeight - padding.bottom}
                x2={svgWidth - padding.right}
                y2={svgHeight - padding.bottom}
                className={styles.axisLine}
              />
              
              {/* 価格ライン */}
              <path
                d={pathData}
                fill="none"
                className={styles.priceLine}
              />
              
              {/* データポイント */}
              {data.map((point, index) => {
                const x = getXPosition(index);
                const priceInManYen = toManYen(point.price);
                const y = getYPosition(priceInManYen);
                return (
                  <g key={point.year}>
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      className={styles.dataPoint}
                    />
                    <text
                      x={x}
                      y={y - 10}
                      className={styles.dataLabel}
                      textAnchor="middle"
                    >
                      {priceInManYen.toLocaleString()}
                    </text>
                  </g>
                );
              })}
              
              {/* Y軸ラベル */}
              {yAxisGuides.map((guide, index) => (
                <text
                  key={index}
                  x={svgWidth - padding.right + 10}
                  y={guide.y + 5}
                  className={styles.yLabel}
                  textAnchor="start"
                >
                  {guide.price.toLocaleString()}万円
                </text>
              ))}
              
              {/* X軸ラベル */}
              {data.map((point, index) => (
                <text
                  key={point.year}
                  x={getXPosition(index)}
                  y={svgHeight - padding.bottom + 20}
                  className={styles.xLabel}
                  textAnchor="middle"
                >
                  {point.year}
                </text>
              ))}
            </svg>
          </div>
          
          {/* 最新の変化率 */}
          <div 
            className={styles.latestChange}
            data-positive={latestData.change > 0}
          >
            前年比: {latestData.change > 0 ? '+' : ''}{latestData.change.toFixed(1)}%
          </div>
        </div>
        
        {/* 参考情報 */}
        {additionalInfo && additionalInfo.length > 0 && (
          <div className={styles.additionalInfo}>
            <h4>📍 参考情報</h4>
            <ul>
              {additionalInfo.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
            <p className={styles.disclaimer}>
              ※将来の地価は様々な要因により変動する可能性があります
            </p>
          </div>
        )}
      </div>
    </div>
  );
}