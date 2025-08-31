"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSimulator } from "../../../contexts/SimulatorContext";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../contexts/ToastContext";
import { fetchLandPriceData } from "../../../utils/landPriceService";
import styles from "./BuildingLocationPage.module.css";

type Municipality = {
  code: string;
  prefecture: string;
  city: string;
};

const BuildingLocationClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, updateBuildingLocation, isLoading, setEditMode } = useSimulator();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  // 編集モードかどうかを判定
  const fromParam = searchParams?.get('from');
  const isEditMode = fromParam === 'summary' || fromParam === 'mypage';
  const isFromMyPage = fromParam === 'mypage';
  
  // フォーム状態
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [cities, setCities] = useState<Municipality[]>([]);
  const [selectedPrefecture, setSelectedPrefecture] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [ownershipStatus, setOwnershipStatus] = useState("");
  const [parkingCount, setParkingCount] = useState<number | null>(null);
  const [floorArea, setFloorArea] = useState<number | null>(null);
  const [floorNumber, setFloorNumber] = useState<number>(1);
  const [calculatedArea, setCalculatedArea] = useState<number | null>(null);
  const [ultimateAverage, setUltimateAverage] = useState<number | null>(null);
  const [landBudget, setLandBudget] = useState<number | null>(null);
  const [isNextButtonVisible, setIsNextButtonVisible] = useState<boolean>(false);
  const [isRecalculate, setIsRecalculate] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  // 計算完了フラグ（計算が完了したかどうかを追跡）
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  
  // 計算時の入力値を保存（変更検知用）
  const [calculatedInputs, setCalculatedInputs] = useState({
    prefecture: "",
    city: "",
    parkingCount: null as number | null,
    floorArea: null as number | null,
    floorNumber: 1,
  });

  // 編集モードの設定
  useEffect(() => {
    if (setEditMode) {
      setEditMode(isFromMyPage);
    }
  }, [isFromMyPage, setEditMode]);

  // CSVデータの読み込み
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/municipalities.csv");
        const data = await response.text();

        const lines = data.split("\n").slice(1); // ヘッダーをスキップ
        const parsedMunicipalities: Municipality[] = [];
        
        lines.forEach((line) => {
          if (!line.trim()) return;
          
          // CSVフォーマットに合わせて解析
          const parts = line.split(',').map(part => part.replace(/"/g, '').trim());
          
          if (parts.length >= 5 && parts[0] && parts[1]) {
            const code = parts[0];
            const prefecture = parts[1];
            const district = parts[2]; // 政令市・郡など
            const city = parts[4]; // 市区町村・区
            
            // 市区町村名の決定
            let cityName = '';
            
            if (city && district) {
              // 政令指定都市の区（例：札幌市中央区）
              cityName = `${district}${city}`;
            } else if (city) {
              // 通常の市町村
              cityName = city;
            } else if (district && code.length === 5) {
              // 政令指定都市本体（例：札幌市）
              cityName = district;
            } else {
              return;
            }
            
            parsedMunicipalities.push({
              code,
              prefecture,
              city: cityName,
            });
          }
        });

        setMunicipalities(parsedMunicipalities);
      } catch (error) {
        console.error("CSVの読み込みエラー:", error);
        showToast("error", "市区町村データの読み込みに失敗しました");
      }
    };

    fetchData();
  }, [showToast]);

  // 初期データの読み込み
  useEffect(() => {
    if (data && !isLoading) {
      // 家のサイズデータ
      if (data.houseSizeData) {
        setFloorArea(data.houseSizeData.totalFloorArea || null);
        setFloorNumber(data.houseSizeData.floors || 1);
      }

      // 建築地データ
      if (data.buildingLocation) {
        setSelectedPrefecture(data.buildingLocation.prefecture || "");
        setSelectedCity(data.buildingLocation.city || "");
      }
      if (data.ownershipStatus) {
        setOwnershipStatus(data.ownershipStatus);
        // 編集モードで所有済みの場合は次へボタンを有効化
        if (isEditMode && data.ownershipStatus === "所有済み") {
          setIsNextButtonVisible(true);
        }
      }
      if (data.parkingCount !== undefined) setParkingCount(data.parkingCount);
      if (data.landBudget !== undefined) {
        setLandBudget(data.landBudget);
        // 編集モードで土地購入かつ予算が設定されている場合
        if (isEditMode && data.ownershipStatus === "購入する" && data.landBudget > 0) {
          setIsNextButtonVisible(true);
          setHasCalculated(true);
          setIsRecalculate(true);
        }
      }
      
      // 計算結果の復元（マイページ編集の場合はFirebaseデータから、それ以外はlocalStorageから）
      if (isFromMyPage && data.calculatedArea && data.ultimateAverage) {
        setCalculatedArea(data.calculatedArea);
        setUltimateAverage(data.ultimateAverage);
      } else {
        const storedCalculatedArea = localStorage.getItem("calculatedArea");
        const storedUltimateAverage = localStorage.getItem("ultimateAverage");
        if (storedCalculatedArea) setCalculatedArea(Number(storedCalculatedArea));
        if (storedUltimateAverage) setUltimateAverage(Number(storedUltimateAverage));
      }
    }
  }, [data, isLoading, isEditMode, isFromMyPage]);

  // 都道府県が選択されたときの処理
  useEffect(() => {
    if (selectedPrefecture) {
      const filteredCities = municipalities.filter(
        (municipality) => municipality.prefecture === selectedPrefecture
      );
      setCities(filteredCities);
      
      // 都道府県が変更されたら市区町村をリセット
      if (!filteredCities.find(c => c.city === selectedCity)) {
        setSelectedCity("");
      }
    } else {
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedPrefecture, municipalities, selectedCity]);

  // 入力値の変更を検知して、計算済みの場合は次へボタンを無効化
  useEffect(() => {
    if (hasCalculated && ownershipStatus === "購入する") {
      // 計算時の値と現在の値を比較
      const inputsChanged = 
        selectedPrefecture !== calculatedInputs.prefecture ||
        selectedCity !== calculatedInputs.city ||
        parkingCount !== calculatedInputs.parkingCount ||
        floorArea !== calculatedInputs.floorArea ||
        floorNumber !== calculatedInputs.floorNumber;
      
      if (inputsChanged) {
        setIsNextButtonVisible(false);
        setIsRecalculate(false);
      }
    }
  }, [selectedPrefecture, selectedCity, parkingCount, floorArea, floorNumber, hasCalculated, calculatedInputs, ownershipStatus]);

  // 都道府県変更ハンドラー
  const handlePrefectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrefecture(e.target.value);
  };

  // 市区町村変更ハンドラー
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  // 土地所有状況の変更
  const handleOwnershipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setOwnershipStatus(value);
    
    if (value === "所有済み") {
      setLandBudget(0);
      setCalculatedArea(0);
      setUltimateAverage(0);
      setIsNextButtonVisible(true);
      setHasCalculated(false);
    } else {
      setLandBudget(null);
      setCalculatedArea(null);
      setUltimateAverage(null);
      setIsNextButtonVisible(false);
      setHasCalculated(false);
    }
    setIsRecalculate(false);
  };

  // 駐車場台数の変更
  const handleParkingCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    setParkingCount(value);
  };

  // 土地面積の計算（修正版）
  const calculateLandArea = async () => {
    if (!selectedPrefecture || !selectedCity) {
      showToast("warning", "都道府県と市区町村を選択してください");
      return;
    }

    if (!floorArea) {
      showToast("warning", "家のサイズが設定されていません");
      return;
    }

    setIsCalculating(true);

    try {
      // ローディング表示
      showToast("info", "土地相場データを取得中...");
      
      // 地域タイプの判定
      const areaType = getAreaType(selectedPrefecture, selectedCity);
      const areaParams = getAreaParameters(areaType);
      
      // 延床面積を坪から㎡に変換
      const floorAreaInM2 = floorArea * 3.3;
      
      // 建物に必要な敷地面積の計算（㎡）
      const buildingArea = (floorAreaInM2 / floorNumber) / areaParams.buildingCoverageRatio;
      
      // 駐車場面積の計算（㎡）
      const parkingArea = (parkingCount || 0) * areaParams.parkingAreaPerCar;
      
      // 庭・外構スペースの計算（㎡）
      const gardenArea = buildingArea * areaParams.gardenRatio;
      
      // 総面積の計算（㎡）
      const totalAreaInM2 = Math.ceil(buildingArea + parkingArea + gardenArea);
      
      setCalculatedArea(totalAreaInM2);
      
      // APIから最新の坪単価を取得
      const landPriceData = await fetchLandPriceData(selectedPrefecture, selectedCity);
      
      if (!landPriceData) {
        showToast("error", "地価データの取得に失敗しました");
        return;
      }
      
      // 坪単価を万円単位に変換
      const pricePerTsuboInManYen = landPriceData.pricePerTsubo;
      setUltimateAverage(pricePerTsuboInManYen);
      
      // 土地予算の計算（㎡→坪変換して計算）
      const tsubo = totalAreaInM2 / 3.3;
      const budget = Math.ceil(tsubo * pricePerTsuboInManYen);
      setLandBudget(budget);
      
      // データソースに応じたメッセージ表示
      if (isEditMode) {
        showToast("success", "建築地情報を更新しました");
      } else if (landPriceData.source === 'api') {
        showToast("success", `土地面積を計算しました（${landPriceData.year}年の地価公示データを使用）`);
      } else {
        showToast("info", "土地面積を計算しました（推定値を使用）");
      }
      
      // マイページ編集の場合は計算結果も保存用に準備
      if (isFromMyPage) {
        // updateBuildingLocationで一緒に保存される
      } else {
        // 通常フローはlocalStorageに保存
        localStorage.setItem("calculatedArea", totalAreaInM2.toString());
        localStorage.setItem("ultimateAverage", pricePerTsuboInManYen.toString());
        localStorage.setItem("areaType", areaType);
        localStorage.setItem("areaDescription", areaParams.description);
        localStorage.setItem("landPriceSource", landPriceData.source);
        localStorage.setItem("landPriceYear", landPriceData.year.toString());
      }
      
      // 計算完了時の入力値を保存
      setCalculatedInputs({
        prefecture: selectedPrefecture,
        city: selectedCity,
        parkingCount: parkingCount,
        floorArea: floorArea,
        floorNumber: floorNumber,
      });
      
      setIsNextButtonVisible(true);
      setIsRecalculate(true);
      setHasCalculated(true);
      
    } catch (error) {
      console.error("計算エラー:", error);
      showToast("error", "計算中にエラーが発生しました");
    } finally {
      setIsCalculating(false);
    }
  };

  // 次へ進む
  const handleNext = async () => {
    if (!selectedPrefecture || !selectedCity) {
      showToast("warning", "都道府県と市区町村を選択してください");
      return;
    }

    if (!ownershipStatus) {
      showToast("warning", "土地の所有状況を選択してください");
      return;
    }

    if (ownershipStatus === "購入する" && (!landBudget || landBudget === 0)) {
      showToast("warning", "まず土地面積を計算してください");
      return;
    }

    // データを保存（マイページ編集の場合は計算結果も含める）
    const updateData: any = {
      buildingLocation: {
        prefecture: selectedPrefecture,
        city: selectedCity,
      },
      ownershipStatus,
      landBudget: landBudget || 0,
      parkingCount: parkingCount || 0,
    };

    // マイページ編集の場合は計算結果も保存
    if (isFromMyPage && calculatedArea && ultimateAverage) {
      updateData.calculatedArea = calculatedArea;
      updateData.ultimateAverage = ultimateAverage;
    }

    await updateBuildingLocation(updateData);

    // 通常フローでは計算結果をlocalStorageに保存
    if (!isFromMyPage) {
      if (calculatedArea) localStorage.setItem("calculatedArea", calculatedArea.toString());
      if (ultimateAverage) localStorage.setItem("ultimateAverage", ultimateAverage.toString());
    }

    if (isFromMyPage) {
      // マイページからの編集の場合はマイページに戻る
      router.push("/my-page");
    } else if (isEditMode) {
      // サマリーからの編集の場合はサマリーページに戻る
      router.push("/start-home-building/summary");
    } else {
      // 通常モードの場合は次のページへ
      router.push("/start-home-building/house-type-diagnosis");
    }
  };

  // 戻るボタンの処理
  const handleBack = () => {
    if (isFromMyPage) {
      router.push("/my-page");
    } else if (isEditMode) {
      router.push("/start-home-building/summary");
    } else {
      router.push("/start-home-building/house-size");
    }
  };

  // 結果を保存（ログインページへ）
  const handleSaveResults = () => {
    router.push("/login?from=simulator");
  };

  // 地域タイプの判定
  const getAreaType = (prefecture: string, city: string): string => {
    // 大都市圏中心部
    const metroCoreAreas: Record<string, string[]> = {
      '東京都': ['千代田区', '中央区', '港区', '新宿区', '渋谷区', '品川区', '目黒区', '世田谷区', '文京区', '台東区', '墨田区', '江東区'],
      '大阪府': ['北区', '中央区', '西区', '福島区', '天王寺区', '浪速区', '阿倍野区'],
      '愛知県': ['中区', '東区', '中村区', '西区', '千種区']
    };
    
    // 大都市圏周辺部
    const metroSuburbAreas: Record<string, string[]> = {
      '東京都': ['練馬区', '板橋区', '足立区', '葛飾区', '江戸川区', '杉並区', '豊島区', '北区', '荒川区', '武蔵野市', '三鷹市', '調布市', '狛江市', '西東京市'],
      '神奈川県': ['横浜市', '川崎市', '鎌倉市', '藤沢市', '逗子市'],
      '千葉県': ['市川市', '船橋市', '浦安市', '習志野市', '松戸市', '柏市'],
      '埼玉県': ['さいたま市', '川口市', '所沢市', '越谷市', '戸田市', '朝霞市', '和光市'],
      '大阪府': ['豊中市', '吹田市', '茨木市', '高槻市', '枚方市', '守口市', '門真市'],
      '兵庫県': ['神戸市', '西宮市', '芦屋市', '尼崎市', '宝塚市'],
      '京都府': ['京都市']
    };
    
    // 地方中核都市
    const regionalCities = [
      '札幌市', '仙台市', '新潟市', '金沢市', '静岡市', '浜松市',
      '岡山市', '広島市', '松山市', '福岡市', '北九州市', '熊本市', '鹿児島市', '那覇市'
    ];
    
    // 判定ロジック
    if (metroCoreAreas[prefecture]?.some(area => city.includes(area))) {
      return 'metro-core';
    } else if (metroSuburbAreas[prefecture]?.some(area => city.includes(area))) {
      return 'metro-suburb';
    } else if (regionalCities.some(regionalCity => city.includes(regionalCity))) {
      return 'regional-city';
    } else if (['東京都', '神奈川県', '千葉県', '埼玉県', '大阪府', '兵庫県', '京都府', '愛知県'].includes(prefecture)) {
      return 'suburban';
    } else {
      return 'rural';
    }
  };

  // 地域タイプに応じたパラメータ取得
  const getAreaParameters = (areaType: string) => {
    switch (areaType) {
      case 'metro-core':
        return {
          buildingCoverageRatio: 0.6,
          parkingAreaPerCar: 15,
          gardenRatio: 0.1,
          description: '都心部',
          expectedRange: '45-50坪'
        };
      case 'metro-suburb':
        return {
          buildingCoverageRatio: 0.5,
          parkingAreaPerCar: 16,
          gardenRatio: 0.2,
          description: '都市近郊',
          expectedRange: '55-60坪'
        };
      case 'regional-city':
        return {
          buildingCoverageRatio: 0.5,
          parkingAreaPerCar: 18,
          gardenRatio: 0.3,
          description: '地方都市',
          expectedRange: '60-65坪'
        };
      case 'suburban':
        return {
          buildingCoverageRatio: 0.4,
          parkingAreaPerCar: 20,
          gardenRatio: 0.4,
          description: '郊外',
          expectedRange: '70-75坪'
        };
      default: // rural
        return {
          buildingCoverageRatio: 0.45,
          parkingAreaPerCar: 20,
          gardenRatio: 0.35,
          description: '地方',
          expectedRange: '65-70坪'
        };
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>読み込み中...</div>
      </div>
    );
  }

  // 都道府県の地理的順序を定義
  const prefectureOrder = [
    // 北海道・東北
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    // 関東
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    // 中部
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県',
    // 近畿
    '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
    // 中国・四国
    '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県',
    // 九州・沖縄
    '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];

  // municipalitiesに存在する都道府県のみをフィルタリング
  const availablePrefectures = new Set(municipalities.map((m) => m.prefecture));
  const uniquePrefectures = prefectureOrder.filter(pref => availablePrefectures.has(pref));

  // 地域説明の取得（表示用）
  const getAreaDescription = () => {
    if (isFromMyPage && data?.areaDescription) {
      return data.areaDescription;
    }
    return localStorage.getItem("areaDescription") || "標準";
  };

  const getLandPriceSource = () => {
    if (isFromMyPage && data?.landPriceSource) {
      return data.landPriceSource;
    }
    return localStorage.getItem("landPriceSource");
  };

  const getLandPriceYear = () => {
    if (isFromMyPage && data?.landPriceYear) {
      return data.landPriceYear;
    }
    return localStorage.getItem("landPriceYear");
  };

  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          {isEditMode ? "建築地を編集" : "建築地を選択"}
        </h1>
        <p className={styles.subtitle}>
          {isEditMode 
            ? "建築地情報を修正してください" 
            : "建築予定地の情報を入力してください"
          }
        </p>
      </header>

      {/* 進捗バー */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progress} 
          style={{ width: isEditMode ? "100%" : "60%" }}
        ></div>
      </div>

      {/* フォーム */}
      <main className={styles.main}>
        <div className={styles.formContainer}>
          {/* 都道府県選択 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>都道府県</label>
            <select
              value={selectedPrefecture}
              onChange={handlePrefectureChange}
              className={styles.select}
            >
              <option value="">選択してください</option>
              {uniquePrefectures.map((prefecture) => (
                <option key={prefecture} value={prefecture}>
                  {prefecture}
                </option>
              ))}
            </select>
          </div>

          {/* 市区町村選択 */}
          {selectedPrefecture && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>市区町村</label>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className={styles.select}
              >
                <option value="">選択してください</option>
                {cities.map((city) => (
                  <option key={city.code} value={city.city}>
                    {city.city}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 土地所有状況 */}
          {selectedCity && (
            <>
              <div className={styles.inputGroup}>
                <label className={styles.label}>土地の所有状況</label>
                <select
                  value={ownershipStatus}
                  onChange={handleOwnershipChange}
                  className={styles.select}
                >
                  <option value="">選択してください</option>
                  <option value="所有済み">所有済み</option>
                  <option value="購入する">購入する</option>
                </select>
              </div>

              {/* 土地購入の場合の追加フォーム */}
              {ownershipStatus === "購入する" && (
                <>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>駐車場の台数</label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="number"
                        value={parkingCount === null ? "" : parkingCount}
                        onChange={handleParkingCountChange}
                        className={styles.input}
                        placeholder="0"
                        min="0"
                        max="10"
                      />
                      <span className={styles.unit}>台</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={calculateLandArea}
                    className={`${styles.calculateButton} ${hasCalculated && !isRecalculate && !isNextButtonVisible ? styles.calculateButtonHighlight : ''}`}
                    disabled={isCalculating}
                  >
                    {isCalculating ? "計算中..." : 
                     isEditMode && isRecalculate ? "再計算する" :
                     hasCalculated && !isRecalculate && !isNextButtonVisible ? "再計算が必要です" :
                     isRecalculate ? "再計算する" : 
                     "土地面積を計算"}
                  </button>

                  {/* 計算結果 */}
                  {hasCalculated && calculatedArea !== null && ultimateAverage !== null && landBudget !== null && (
                    <div className={`${styles.resultContainer} ${hasCalculated && !isNextButtonVisible ? styles.outdated : ''}`}>
                      <h3 className={styles.resultTitle}>計算結果</h3>
                      
                      {/* 地域タイプ情報 */}
                      <div className={styles.resultItem}>
                        <span className={styles.resultLabel}>エリア特性：</span>
                        <span className={styles.resultValue}>
                          {getAreaDescription()}
                        </span>
                      </div>
                      
                      <div className={styles.resultItem}>
                        <span className={styles.resultLabel}>必要な土地面積：</span>
                        <span className={styles.resultValue}>
                          {calculatedArea}㎡（{Math.round(calculatedArea / 3.3)}坪）
                        </span>
                      </div>
                      <div className={styles.resultItem}>
                        <span className={styles.resultLabel}>平均坪単価：</span>
                        <span className={styles.resultValue}>
                          {ultimateAverage.toLocaleString()}万円/坪
                        </span>
                      </div>
                      <div className={styles.resultItem}>
                        <span className={styles.resultLabel}>土地予算：</span>
                        <span className={styles.resultValue}>
                          {landBudget.toLocaleString()}万円
                        </span>
                      </div>
                      <div className={styles.note}>
                        {getLandPriceSource() === 'api' 
                          ? `※ ${getLandPriceYear()}年の国土交通省地価公示データに基づいています`
                          : '※ 地価データが取得できなかったため、推定値を使用しています'
                        }
                      </div>
                      
                      {/* 保存ボタン（未認証時かつ非編集モード時のみ表示） */}
                      {!isAuthenticated && !isEditMode && (
                        <div className={styles.saveButtonContainer}>
                          <button
                            type="button"
                            onClick={handleSaveResults}
                            className={styles.saveButton}
                          >
                            結果を保存する
                          </button>
                          <p className={styles.saveNote}>
                            ※ ログインすると結果を保存できます
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ナビゲーション */}
          <div className={styles.navigation}>
            <button
              type="button"
              onClick={handleBack}
              className={styles.backButton}
            >
              {isEditMode ? "キャンセル" : "戻る"}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={styles.nextButton}
              disabled={!isNextButtonVisible}
            >
              {isFromMyPage ? "保存してマイページに戻る" : 
               isEditMode ? "保存してサマリーに戻る" : "次へ進む"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuildingLocationClient;