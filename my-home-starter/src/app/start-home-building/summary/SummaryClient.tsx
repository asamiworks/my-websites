"use client";

import { useEffect, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSimulator } from "../../../contexts/SimulatorContext";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../contexts/ToastContext";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import styles from "./SummaryPage.module.css";

// 家づくりタイプ別の基準坪単価（基準：30坪）
const BASE_UNIT_PRICES: { [key: string]: number } = {
  "コスパ重視タイプ": 50,
  "バランス重視タイプ": 65,
  "品質重視タイプ": 70,
  "高性能住宅タイプ": 85,
  "デザイン重視タイプ": 75,
  "個性重視タイプ": 70,
  "機能性重視タイプ": 70,
  "実用性重視タイプ": 60,
};

// 地域係数
const REGION_MULTIPLIERS: { [key: string]: number } = {
  "東京都": 1.3,
  "神奈川県": 1.2,
  "大阪府": 1.15,
  "愛知県": 1.1,
  "埼玉県": 1.1,
  "千葉県": 1.1,
  "福岡県": 1.05,
};

// 建物規模係数
const getSizeMultiplier = (size: number): number => {
  if (size <= 20) return 1.2;
  if (size <= 25) return 1.1;
  if (size <= 30) return 1.0;
  if (size <= 35) return 0.95;
  if (size <= 40) return 0.9;
  return 0.85;
};

// 諸経費の計算（総予算の約7-10%）
const calculateMiscCosts = (totalBudget: number): number => {
  return Math.round(totalBudget * 0.08);
};

// カスタムバーシェイプ（積み上げ棒グラフ風）
const CustomBar = (props: any) => {
  const { fill, x, y, width, height, payload } = props;
  const cornerRadius = 4;
  
  // 画面幅に応じてフォントサイズを調整
  const fontSize = width < 60 ? "12" : "14";
  const smallFontSize = width < 60 ? "10" : "12";
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={cornerRadius}
        ry={cornerRadius}
      />
      {/* ラベル表示（幅が狭い場合は金額のみ表示） */}
      {width > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2}
            fill="white"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fontSize}
            fontWeight="bold"
          >
            {`${payload.value.toLocaleString()}万円`}
          </text>
          {width > 60 && (
            <text
              x={x + width / 2}
              y={y + height / 2 + 20}
              fill="white"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={smallFontSize}
            >
              {`(${payload.percentage}%)`}
            </text>
          )}
        </>
      )}
    </g>
  );
};

// Custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{data.name}</p>
        <p className={styles.tooltipValue}>{`${data.value.toLocaleString()}万円`}</p>
        <p className={styles.tooltipPercent}>{`全体の${data.percentage}%`}</p>
      </div>
    );
  }
  return null;
};

const SummaryClient = () => {
  const router = useRouter();
  const { data, isLoading } = useSimulator();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  // 詳細な部屋データをStateで管理（SSR対応）
  const [detailedRoomData, setDetailedRoomData] = useState<any>(null);

  // 詳細な部屋データをlocalStorageから読み込む（クライアントサイドのみ）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDetailedData = localStorage.getItem('detailedRoomData');
      if (savedDetailedData) {
        try {
          setDetailedRoomData(JSON.parse(savedDetailedData));
        } catch (e) {
          console.error('Failed to parse saved room data:', e);
        }
      }
    }
  }, []);

  // 必要なデータが揃っているかチェックし、不足している最初のページへリダイレクト
  useEffect(() => {
    if (!isLoading) {
      // totalBudgetがない場合は1ページ目へ
      if (!data?.totalBudget) {
        showToast("warning", "総予算の情報が不足しています。");
        router.push("/start-home-building/total-budget");
        return;
      }
      
      // houseSizeDataがない場合は2ページ目へ
      if (!data?.houseSizeData) {
        showToast("warning", "家の大きさの情報が不足しています。");
        router.push("/start-home-building/house-size");
        return;
      }
      
      // buildingLocationがない場合は3ページ目へ
      if (!data?.buildingLocation) {
        showToast("warning", "建築地の情報が不足しています。");
        router.push("/start-home-building/building-location");
        return;
      }
      
      // houseTypeDiagnosisがない場合は4ページ目へ
      if (!data?.houseTypeDiagnosis) {
        showToast("warning", "家づくりタイプ診断の情報が不足しています。");
        router.push("/start-home-building/house-type-diagnosis");
        return;
      }
    }
  }, [data, isLoading, router, showToast]);

  // 家づくりタイプ診断結果を再計算
  const getHouseTypeResult = useCallback((): string => {
    if (!data?.houseTypeDiagnosis) return "";
    
    const q1 = data.houseTypeDiagnosis.q1 || 0;
    const q2 = data.houseTypeDiagnosis.q2 || 0;
    
    if (q1 === 1 && q2 === 1) return "高性能住宅タイプ";
    if (q1 === 2 && q2 === 2) return "コスパ重視タイプ";
    if (q1 === 3 && q2 === 3) return "デザイン重視タイプ";
    if (q1 === 4 && q2 === 4) return "機能性重視タイプ";
    
    const average = (q1 + q2) / 2;
    if (average <= 1.5) return "品質重視タイプ";
    if (average <= 2.5) return "バランス重視タイプ";
    if (average <= 3.5) return "個性重視タイプ";
    return "実用性重視タイプ";
  }, [data]);

  // 間取りタイプを計算
  const calculateLayoutType = useCallback(() => {
    if (!detailedRoomData) {
      // 詳細データがない場合は簡易表示
      return "";
    }

    const ldkCount = detailedRoomData.ldkRooms?.length || 0;
    const japaneseCount = detailedRoomData.japaneseRooms?.length || 0;
    const masterCount = detailedRoomData.masterBedrooms?.length || 0;
    const westernCount = detailedRoomData.westernRooms?.length || 0;
    
    // 居室の数（和室、洋室、主寝室の合計）
    const roomCount = japaneseCount + westernCount + masterCount;
    
    if (ldkCount === 0) {
      return roomCount > 0 ? `${roomCount}R` : "";
    } else if (ldkCount === 1) {
      return `${roomCount}LDK`;
    } else if (ldkCount === 2) {
      return `${roomCount}LDK×2世帯`;
    } else if (ldkCount > 2) {
      return `${roomCount}LDK×${ldkCount}世帯`;
    }
    
    return "";
  }, [detailedRoomData]);

  // 予算計算
  const budgetCalculation = useMemo(() => {
    if (!data) return null;

    const totalBudget = data.totalBudget || 0;
    const miscCosts = calculateMiscCosts(totalBudget);
    const landCost = data.ownershipStatus === "購入する" ? (data.landBudget || 0) : 0;
    const buildingBudget = totalBudget - miscCosts - landCost;

    // 必要建物予算の計算
    const houseType = getHouseTypeResult();
    const baseUnitPrice = BASE_UNIT_PRICES[houseType] || 65;
    const regionMultiplier = REGION_MULTIPLIERS[data.buildingLocation?.prefecture || ""] || 1.0;
    const houseSize = data.houseSizeData?.totalFloorArea || 30;
    const sizeMultiplier = getSizeMultiplier(houseSize);
    
    const requiredUnitPrice = baseUnitPrice * regionMultiplier * sizeMultiplier;
    const requiredBuildingBudget = Math.round(houseSize * requiredUnitPrice);
    
    // アラート判定
    const isBudgetInsufficient = buildingBudget < requiredBuildingBudget * 0.9;
    const isBudgetExcellent = buildingBudget >= requiredBuildingBudget * 1.1;
    const actualUnitPrice = Math.round(buildingBudget / houseSize);

    return {
      totalBudget,
      miscCosts,
      landCost,
      buildingBudget,
      requiredBuildingBudget,
      requiredUnitPrice: Math.round(requiredUnitPrice),
      actualUnitPrice,
      isBudgetInsufficient,
      isBudgetExcellent,
      houseType,
      houseSize,
      prefecture: data.buildingLocation?.prefecture || ""
    };
  }, [data, getHouseTypeResult]);

  const COLORS = ['#f59e0b', '#6b7280', '#d97706'];

  // 円グラフ用データ
  const chartData = useMemo(() => {
    if (!budgetCalculation) return [];

    const { totalBudget, miscCosts, landCost, buildingBudget } = budgetCalculation;
    
    const data = [
      {
        name: "建物予算",
        value: buildingBudget,
        percentage: Math.round((buildingBudget / totalBudget) * 100)
      },
      {
        name: "諸経費",
        value: miscCosts,
        percentage: Math.round((miscCosts / totalBudget) * 100)
      }
    ];

    if (landCost > 0) {
      data.push({
        name: "土地代",
        value: landCost,
        percentage: Math.round((landCost / totalBudget) * 100)
      });
    }

    return data;
  }, [budgetCalculation]);

  // 棒グラフ用データ（積み上げ形式のため、累積値を計算）
  const barChartData = useMemo(() => {
    if (!chartData.length) return [];

    let cumulativeValue = 0;
    const stackedData = chartData.map((item, index) => {
      const startY = cumulativeValue;
      cumulativeValue += item.value;
      
      return {
        ...item,
        startY,
        endY: cumulativeValue,
        fill: COLORS[index % COLORS.length]
      };
    });

    return stackedData;
  }, [chartData]);

  // 数値のフォーマット
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // マイページへ遷移
  const handleGoToMyPage = () => {
    if (!isAuthenticated) {
      showToast("info", "住宅会社を探すにはログインが必要です");
      router.push("/login?from=simulator");
      return;
    }
    router.push("/my-page");
  };

  // 編集ページへ遷移（編集モードのクエリパラメータを追加）
  const handleEdit = (step: string) => {
    router.push(`/start-home-building/${step}?from=summary`);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>読み込み中...</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.title}>診断結果のまとめ</h1>
        <p className={styles.subtitle}>
          入力内容を確認して、住宅会社を探してみましょう
        </p>
      </header>

      {/* 進捗バー - 100% */}
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: "100%" }}></div>
      </div>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        <div className={styles.summaryContainer}>
          
          {/* 総予算 */}
          <section className={styles.summarySection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>総予算</h2>
              <button
                type="button"
                onClick={() => handleEdit('total-budget')}
                className={styles.editButton}
              >
                編集
              </button>
            </div>
            <div className={styles.summaryContent}>
              <div className={styles.mainItem}>
                <span className={styles.mainValue}>{formatNumber(data.totalBudget || 0)}</span>
                <span className={styles.mainUnit}>万円</span>
              </div>
              <div className={styles.subItems}>
                {data.annualIncome && (
                  <div className={styles.subItem}>
                    <span className={styles.subLabel}>世帯年収：</span>
                    <span className={styles.subValue}>{formatNumber(data.annualIncome)}万円</span>
                  </div>
                )}
                {data.downPayment !== undefined && (
                  <div className={styles.subItem}>
                    <span className={styles.subLabel}>頭金：</span>
                    <span className={styles.subValue}>{formatNumber(data.downPayment)}万円</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 予算内訳（棒グラフ） */}
          {budgetCalculation && (
            <section className={styles.budgetBreakdownSection}>
              <h2 className={styles.sectionTitle}>予算内訳</h2>
              <div className={styles.chartContainer}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '24px',
                  flexWrap: 'wrap'
                }}>
                  {/* 棒グラフ */}
                  <div style={{ 
                    flex: '1 1 350px',
                    minWidth: '280px'
                  }}>
                    <div style={{ height: '400px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={barChartData}
                          margin={{ top: 20, right: 10, bottom: 20, left: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis 
                            dataKey="name" 
                            hide 
                          />
                          <YAxis 
                            domain={[0, budgetCalculation.totalBudget]}
                            tickFormatter={(value) => {
                              if (value >= 10000) {
                                return `${(value / 10000).toFixed(1)}億`;
                              }
                              return value.toLocaleString();
                            }}
                            label={{ 
                              value: '予算（万円）', 
                              angle: -90, 
                              position: 'insideLeft',
                              offset: 10,
                              style: { textAnchor: 'middle', fontSize: '12px' }
                            }}
                            tick={{ fontSize: '12px' }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="value" shape={CustomBar}>
                            {barChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* 予算状況インジケーター */}
                    <div style={{
                      marginTop: '16px',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: budgetCalculation.isBudgetInsufficient 
                        ? '#fef2f2' 
                        : budgetCalculation.isBudgetExcellent 
                          ? '#f0f9ff' 
                          : '#f0fdf4',
                      border: `1px solid ${
                        budgetCalculation.isBudgetInsufficient 
                          ? '#fecaca' 
                          : budgetCalculation.isBudgetExcellent 
                            ? '#bae6fd' 
                            : '#bbf7d0'
                      }`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '20px' }}>
                        {budgetCalculation.isBudgetInsufficient 
                          ? '⚠️' 
                          : budgetCalculation.isBudgetExcellent 
                            ? '🌟' 
                            : '✅'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: 'bold',
                          color: budgetCalculation.isBudgetInsufficient 
                            ? '#dc2626' 
                            : budgetCalculation.isBudgetExcellent 
                              ? '#0284c7' 
                              : '#16a34a'
                        }}>
                          {budgetCalculation.isBudgetInsufficient 
                            ? '建物予算が不足気味です' 
                            : budgetCalculation.isBudgetExcellent
                              ? '予算に余裕があります！'
                              : '予算配分は適切です'}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: budgetCalculation.isBudgetInsufficient 
                            ? '#7f1d1d' 
                            : budgetCalculation.isBudgetExcellent 
                              ? '#075985' 
                              : '#14532d',
                          marginTop: '2px'
                        }}>
                          {budgetCalculation.isBudgetInsufficient 
                            ? `推奨坪単価${formatNumber(budgetCalculation.requiredUnitPrice)}万円に対し、${formatNumber(budgetCalculation.actualUnitPrice)}万円です`
                            : budgetCalculation.isBudgetExcellent
                              ? `坪単価${formatNumber(budgetCalculation.actualUnitPrice)}万円で、設備や仕様のグレードアップも検討できます`
                              : `坪単価${formatNumber(budgetCalculation.actualUnitPrice)}万円で、ご希望の仕様での建築が可能です`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 凡例（右側に配置） */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '16px',
                    padding: '20px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    flex: '0 1 280px',
                    minWidth: '250px'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                      内訳詳細
                    </h3>
                    {chartData.map((item, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span 
                          style={{ 
                            display: 'inline-block', 
                            width: '16px', 
                            height: '16px', 
                            backgroundColor: COLORS[index % COLORS.length], 
                            borderRadius: '4px',
                            flexShrink: 0
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', color: '#374151' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>
                            {formatNumber(item.value)}万円
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            ({item.percentage}%)
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ 
                      marginTop: '12px', 
                      paddingTop: '12px', 
                      borderTop: '1px solid #e5e7eb' 
                    }}>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        総予算
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>
                        {formatNumber(budgetCalculation.totalBudget)}万円
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 建物予算アラート */}
                {budgetCalculation.isBudgetInsufficient && (
                  <div className={styles.budgetAlert} style={{ marginTop: '24px' }}>
                    <div className={styles.alertIcon}>⚠️</div>
                    <div className={styles.alertContent}>
                      <h3 className={styles.alertTitle}>
                        建物予算が不足している可能性があります
                      </h3>
                      <p className={styles.alertDescription}>
                        {budgetCalculation.prefecture && `${budgetCalculation.prefecture}で`}
                        「{budgetCalculation.houseType}」の住宅を{budgetCalculation.houseSize}坪で建てる場合、
                        坪単価{formatNumber(budgetCalculation.requiredUnitPrice)}万円程度が目安となります。
                      </p>
                      <p className={styles.alertCalculation}>
                        現在の建物予算（{formatNumber(budgetCalculation.buildingBudget)}万円）では
                        坪単価{formatNumber(budgetCalculation.actualUnitPrice)}万円となり、
                        ご希望の仕様での建築が難しい可能性があります。
                      </p>
                      <div className={styles.alertActions}>
                        <button
                          type="button"
                          onClick={() => handleEdit('building-location')}
                          className={styles.alertButton}
                        >
                          建築地を見直す
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit('total-budget')}
                          className={styles.alertButton}
                        >
                          予算を見直す
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 家の大きさ */}
          <section className={styles.summarySection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>家の大きさ</h2>
              <button
                type="button"
                onClick={() => handleEdit('house-size')}
                className={styles.editButton}
              >
                編集
              </button>
            </div>
            <div className={styles.summaryContent}>
              <div className={styles.mainItem}>
                <span className={styles.mainValue}>{data.houseSizeData?.totalFloorArea || 0}</span>
                <span className={styles.mainUnit}>坪</span>
                {calculateLayoutType() && (
                  <span style={{ 
                    marginLeft: '12px', 
                    fontSize: '18px', 
                    color: '#6b7280',
                    fontWeight: 'normal'
                  }}>
                    （{calculateLayoutType()}）
                  </span>
                )}
              </div>
              <div className={styles.subItems}>
                <div className={styles.subItem}>
                  <span className={styles.subLabel}>階数：</span>
                  <span className={styles.subValue}>
                    {data.houseSizeData?.floors === 1 ? '平屋' : `${data.houseSizeData?.floors || 2}階建て`}
                  </span>
                </div>
                
                {/* 部屋の詳細情報 */}
                {(() => {
                  if (!detailedRoomData) {
                    // 詳細データがない場合は従来の表示
                    return (
                      <div className={styles.subItem}>
                        <span className={styles.subLabel}>LDK：</span>
                        <span className={styles.subValue}>{data.houseSizeData?.ldkSize || 16}畳</span>
                      </div>
                    );
                  }

                  // 部屋情報を集計
                  const rooms = [];
                  
                  // LDK
                  if (detailedRoomData.ldkRooms?.length > 0) {
                    detailedRoomData.ldkRooms.forEach((room: any, index: number) => {
                      rooms.push({
                        type: detailedRoomData.ldkRooms.length > 1 ? `LDK${index + 1}` : 'LDK',
                        size: room.size
                      });
                    });
                  }
                  
                  // 主寝室
                  if (detailedRoomData.masterBedrooms?.length > 0) {
                    detailedRoomData.masterBedrooms.forEach((room: any, index: number) => {
                      rooms.push({
                        type: detailedRoomData.masterBedrooms.length > 1 ? `主寝室${index + 1}` : '主寝室',
                        size: room.size
                      });
                    });
                  }
                  
                  // 洋室
                  if (detailedRoomData.westernRooms?.length > 0) {
                    detailedRoomData.westernRooms.forEach((room: any, index: number) => {
                      rooms.push({
                        type: `洋室${index + 1}`,
                        size: room.size
                      });
                    });
                  }
                  
                  // 和室
                  if (detailedRoomData.japaneseRooms?.length > 0) {
                    detailedRoomData.japaneseRooms.forEach((room: any, index: number) => {
                      rooms.push({
                        type: `和室${index + 1}`,
                        size: room.size
                      });
                    });
                  }
                  
                  // その他の部屋
                  const otherRoomCount = detailedRoomData.otherRooms?.length || 0;
                  if (otherRoomCount > 0) {
                    rooms.push({
                      type: 'その他',
                      size: `${otherRoomCount}部屋`
                    });
                  }

                  return (
                    <div className={styles.roomDetails}>
                      {rooms.map((room, index) => (
                        <div key={index} className={styles.subItem}>
                          <span className={styles.subLabel}>{room.type}：</span>
                          <span className={styles.subValue}>
                            {typeof room.size === 'number' ? `${room.size}畳` : room.size}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </section>

          {/* 建築地 */}
          <section className={styles.summarySection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>建築地</h2>
              <button
                type="button"
                onClick={() => handleEdit('building-location')}
                className={styles.editButton}
              >
                編集
              </button>
            </div>
            <div className={styles.summaryContent}>
              <div className={styles.locationInfo}>
                <div className={styles.locationMain}>
                  {data.buildingLocation?.prefecture || "未選択"} {data.buildingLocation?.city || ""}
                </div>
                <div className={styles.subItems}>
                  <div className={styles.subItem}>
                    <span className={styles.subLabel}>土地：</span>
                    <span className={styles.subValue}>{data.ownershipStatus || "未選択"}</span>
                  </div>
                  {data.ownershipStatus === "購入する" && data.landBudget !== undefined && (
                    <div className={styles.subItem}>
                      <span className={styles.subLabel}>土地予算：</span>
                      <span className={styles.subValue}>{formatNumber(data.landBudget)}万円</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 家づくりタイプ */}
          <section className={styles.summarySection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>家づくりタイプ</h2>
              <button
                type="button"
                onClick={() => handleEdit('house-type-diagnosis')}
                className={styles.editButton}
              >
                編集
              </button>
            </div>
            <div className={styles.summaryContent}>
              <div className={styles.typeResult}>
                {getHouseTypeResult()}
              </div>
            </div>
          </section>

          {/* CTA部分 */}
          <div className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>
              診断結果に基づいて<br />
              最適な住宅会社をご紹介します
            </h2>
            <p className={styles.ctaDescription}>
              あなたの予算・希望に合った住宅会社を探しましょう。
              無理のない家づくりを実現します。
            </p>
            
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleGoToMyPage}
                className={styles.startButton}
              >
                住宅会社を探す
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoToMyPage}
                className={styles.startButton}
              >
                ログインして住宅会社を探す
              </button>
            )}
          </div>

          {/* ナビゲーション */}
          <div className={styles.navigation}>
            <Link href="/start-home-building/house-type-diagnosis" className={styles.backButton}>
              戻る
            </Link>
            <Link href="/start-home-building" className={styles.restartButton}>
              最初からやり直す
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SummaryClient;