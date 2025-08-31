"use client";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseConfig";
import { useUserData } from "../../hooks/useUserData";
import styles from "./MyPage.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect,  useMemo } from "react";
import { RecommendedCompaniesSection } from './components/RecommendedCompaniesSection';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

// カスタムバーシェイプ（金額のみ表示）
const CustomBar = (props: any) => {
  const { fill, x, y, width, height, payload } = props;
  const cornerRadius = 4;
  
  // 画面幅に応じてフォントサイズを調整
  const fontSize = width < 60 ? "12" : "14";
  
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
      {/* 金額のみ表示 */}
      {width > 40 && (
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

// 改善された諸経費計算関数（境界値で不利にならないように）
const calculateMiscCosts = (totalBudget: number): number => {
  // 基本的な諸経費率
  let rate = 0.08; // デフォルト8%
  
  if (totalBudget <= 3000) {
    rate = 0.10;
  } else if (totalBudget <= 5000) {
    // 3000万円を超える部分は徐々に率を下げる
    // 3000万円時点で10%、5000万円時点で8%になるよう線形補間
    const excess = totalBudget - 3000;
    const rateReduction = (excess / 2000) * 0.02;
    rate = 0.10 - rateReduction;
  } else {
    // 5000万円を超える部分はさらに率を下げる
    // 5000万円時点で8%、1億円時点で6%になるよう線形補間
    const excess = totalBudget - 5000;
    const rateReduction = Math.min(excess / 5000 * 0.02, 0.02);
    rate = 0.08 - rateReduction;
  }
  
  return Math.floor(totalBudget * rate);
};

// 家づくりタイプの判定関数
const getHouseTypeFromDiagnosis = (q1: number, q2: number): string => {
  if (q1 === 1 && q2 === 1) return "高性能住宅タイプ";
  if (q1 === 2 && q2 === 2) return "コスパ重視タイプ";
  if (q1 === 3 && q2 === 3) return "デザイン重視タイプ";
  if (q1 === 4 && q2 === 4) return "機能性重視タイプ";
  
  const average = (q1 + q2) / 2;
  if (average <= 1.5) return "品質重視タイプ";
  if (average <= 2.5) return "バランス重視タイプ";
  if (average <= 3.5) return "個性重視タイプ";
  return "実用性重視タイプ";
};

const MyPage = () => {
  const router = useRouter();
  const { userData, loading, error } = useUserData();
  
  const COLORS = ['#f59e0b', '#6b7280', '#d97706', '#3b82f6'];

  // 自動ログアウト処理
  const handleLogout = useCallback(async () => {
    try {
      localStorage.clear();
      await signOut(auth);
      router.push("/login");
      console.log("ログアウト成功");
    } catch (error) {
      console.error("ログアウト中にエラーが発生しました:", error);
    }
  }, [router]);

  // 認証チェック
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 15分間の非アクティブでログアウト
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleLogout();
        console.log("自動ログアウトが実行されました");
      }, 15 * 60 * 1000);
    };

    const events = ['mousemove', 'keypress'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [handleLogout]);

  // ローカルストレージから詳細な部屋情報を取得（detailedRoomDataがFirebaseにない場合の暫定対応）
  const getDetailedRoomData = useCallback(() => {
    // まずuserDataから取得を試みる
    if (userData?.detailedRoomData) {
      return userData.detailedRoomData;
    }
    
    // なければローカルストレージから取得
    const savedDetailedData = localStorage.getItem('detailedRoomData');
    if (savedDetailedData) {
      try {
        return JSON.parse(savedDetailedData);
      } catch (e) {
        console.error('Failed to parse saved room data:', e);
        return null;
      }
    }
    return null;
  }, [userData]);

  // 間取りタイプを計算
  const calculateLayoutType = useCallback(() => {
    const detailedData = getDetailedRoomData();
    if (!detailedData) {
      return "";
    }

    const ldkCount = detailedData.ldkRooms?.length || 0;
    const japaneseCount = detailedData.japaneseRooms?.length || 0;
    const masterCount = detailedData.masterBedrooms?.length || 0;
    const westernCount = detailedData.westernRooms?.length || 0;
    
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
  }, [getDetailedRoomData]);

  // 編集ページへ遷移（マイページからの編集であることを明示）
  const handleEdit = (step: string) => {
    router.push(`/start-home-building/${step}?from=mypage`);
  };

  // 数値のフォーマット
  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString();
  };

  // 予算計算 - userDataがない場合のデフォルト値を設定
  const totalBudget = userData?.totalBudget || 0;
  const landBudget = userData?.landBudget || 0;
  const miscBudget = useMemo(() => calculateMiscCosts(totalBudget), [totalBudget]);
  const buildingBudget = Math.floor(totalBudget - miscBudget - landBudget);

  // 家づくりタイプを取得
  const houseType = useMemo(() => {
    if (!userData?.houseTypeDiagnosis) return "";
    const { q1, q2 } = userData.houseTypeDiagnosis;
    return getHouseTypeFromDiagnosis(q1 || 0, q2 || 0);
  }, [userData]);

  // 棒グラフ用データ
  const chartData = useMemo(() => {
    if (!userData) return [];
    
    const data = [
      {
        name: "建物予算",
        value: buildingBudget,
        percentage: totalBudget > 0 ? Math.round((buildingBudget / totalBudget) * 100) : 0
      },
      {
        name: "諸経費",
        value: miscBudget,
        percentage: totalBudget > 0 ? Math.round((miscBudget / totalBudget) * 100) : 0
      }
    ];

    if (userData.ownershipStatus === "購入する" && landBudget > 0) {
      data.push({
        name: "土地代",
        value: landBudget,
        percentage: totalBudget > 0 ? Math.round((landBudget / totalBudget) * 100) : 0
      });
    }

    return data;
  }, [userData, totalBudget, buildingBudget, miscBudget, landBudget]);

  // 棒グラフ用データ（積み上げ形式）
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
  }, [chartData, COLORS]);

  // 条件付きレンダリング前にすべてのHooksを呼び出し終える
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>データを読み込んでいます...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>ユーザーデータが見つかりません</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>マイページ</h1>

      <div className={styles.welcome}>
        <p>こんにちは、{userData.nickname} さん！</p>
      </div>

      {/* TOPページへ戻るボタン */}
      <Link href="/" className={styles.topPageButton}>
        TOPページへ
      </Link>

      {/* ログアウトボタン */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        ログアウト
      </button>

      {/* 家づくりの総予算（棒グラフ） */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>家づくりの総予算</h2>
          <button
            type="button"
            onClick={() => handleEdit('total-budget')}
            className={styles.editButton}
          >
            編集
          </button>
        </div>
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
                    margin={{ top: 20, right: 10, bottom: 60, left: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      hide 
                    />
                    <YAxis 
                      domain={[0, totalBudget]}
                      tickFormatter={(value) => {
                        const roundedValue = Math.round(value);
                        if (roundedValue >= 10000) {
                          return `${(roundedValue / 10000).toFixed(1)}億`;
                        }
                        return roundedValue.toLocaleString();
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
              
              {/* グラフ下部の凡例 */}
              <div className={styles.chartLegend}>
                <div className={styles.legendWrapper}>
                  {chartData.map((item, index) => (
                    <div key={index} className={styles.legendItem}>
                      <span 
                        className={styles.legendColor}
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className={styles.legendLabel}>{item.name}</span>
                      <span className={styles.legendPercentage}>{item.percentage}%</span>
                    </div>
                  ))}
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
                  {formatNumber(totalBudget)}万円
                </div>
              </div>
              
              {/* 入力データのサブ情報 */}
              <div style={{ 
                marginTop: '12px', 
                paddingTop: '12px', 
                borderTop: '1px solid #e5e7eb',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                {userData.annualIncome > 0 && (
                  <div>世帯年収: {Math.floor(userData.annualIncome).toLocaleString()}万円</div>
                )}
                {userData.downPayment > 0 && (
                  <div>頭金: {Math.floor(userData.downPayment).toLocaleString()}万円</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 間取りの詳細 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>間取りの詳細</h2>
          <button
            type="button"
            onClick={() => handleEdit('house-size')}
            className={styles.editButton}
          >
            編集
          </button>
        </div>
        
        <div className={styles.mainItem}>
          <span className={styles.mainValue}>{userData.houseSizeData?.totalFloorArea || 0}</span>
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
              {userData.houseSizeData?.floors === 1 ? '平屋' : `${userData.houseSizeData?.floors || 2}階建て`}
            </span>
          </div>
          
          {/* 部屋の詳細情報 */}
          {(() => {
            const detailedData = getDetailedRoomData();
            if (!detailedData) {
              // 詳細データがない場合は従来の表示
              return (
                <div className={styles.subItem}>
                  <span className={styles.subLabel}>LDK：</span>
                  <span className={styles.subValue}>{userData.houseSizeData?.ldkSize || 16}畳</span>
                </div>
              );
            }

            // 部屋情報を集計
            const rooms = [];
            
            // LDK
            if (detailedData.ldkRooms?.length > 0) {
              detailedData.ldkRooms.forEach((room: any, index: number) => {
                rooms.push({
                  type: detailedData.ldkRooms.length > 1 ? `LDK${index + 1}` : 'LDK',
                  size: room.size
                });
              });
            }
            
            // 主寝室
            if (detailedData.masterBedrooms?.length > 0) {
              detailedData.masterBedrooms.forEach((room: any, index: number) => {
                rooms.push({
                  type: detailedData.masterBedrooms.length > 1 ? `主寝室${index + 1}` : '主寝室',
                  size: room.size
                });
              });
            }
            
            // 洋室
            if (detailedData.westernRooms?.length > 0) {
              detailedData.westernRooms.forEach((room: any, index: number) => {
                rooms.push({
                  type: `洋室${index + 1}`,
                  size: room.size
                });
              });
            }
            
            // 和室
            if (detailedData.japaneseRooms?.length > 0) {
              detailedData.japaneseRooms.forEach((room: any, index: number) => {
                rooms.push({
                  type: `和室${index + 1}`,
                  size: room.size
                });
              });
            }
            
            // その他の部屋
            const otherRoomCount = detailedData.otherRooms?.length || 0;
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

      {/* 建築予定地 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>建築予定地</h2>
          <button
            type="button"
            onClick={() => handleEdit('building-location')}
            className={styles.editButton}
          >
            編集
          </button>
        </div>
        <p>
          {userData.buildingLocation.prefecture} {userData.buildingLocation.city}
        </p>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
          土地：{userData.ownershipStatus}
        </p>
        {userData.ownershipStatus === "購入する" && userData.landBudget > 0 && (
          <p style={{ marginTop: '8px' }}>
            土地予算: {Math.floor(userData.landBudget).toLocaleString()} 万円
          </p>
        )}
      </div>

      {/* 家づくりタイプ */}
      <div className={styles.section}>
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
        <div className={styles.typeResult}>
          {houseType}
        </div>
      </div>

      {/* おすすめ住宅会社 */}
      {buildingBudget > 0 && userData.buildingLocation.prefecture && (
        <RecommendedCompaniesSection
          buildingBudget={buildingBudget}
          prefecture={userData.buildingLocation.prefecture}
          city={userData.buildingLocation.city}
          totalFloorArea={userData.houseSizeData.totalFloorArea}
        />
      )}
    </div>
  );
};

export default MyPage;