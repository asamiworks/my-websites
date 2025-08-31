import { getMunicipalityCode, getPrefectureCode } from './municipalityService';

interface LandPriceData {
  pricePerSquareMeter: number;
  pricePerTsubo: number;
  year: number;
  municipality: string;
  source: 'api' | 'default';  // このプロパティを追加
}

// 坪単価を取得する統一関数
export async function fetchLandPriceData(
  prefecture: string, 
  city: string
): Promise<LandPriceData | null> {
  try {
    // 市区町村コードを動的に取得
    const municipalityCode = await getMunicipalityCode(prefecture, city);
    
    if (!municipalityCode) {
      console.warn(`Municipality code not found for: ${city} in ${prefecture}`);
      // デフォルト値を返す
      return getDefaultLandPrice(prefecture, city);
    }

    // 都道府県コードを取得（都道府県名から）
    const prefectureCode = getPrefectureCode(prefecture);

    // APIを呼び出し（cityパラメータを追加）
    const response = await fetch(
      `/api/getLandPrice?area=${prefectureCode}&city=${municipalityCode}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch land price data');
    }

    const data = await response.json();
    
    // APIレスポンスから坪単価を計算
    const pricePerSquareMeter = extractPricePerSquareMeter(data);
    const pricePerTsubo = Math.round(pricePerSquareMeter * 3.3 / 10000); // 万円/坪

    return {
      pricePerSquareMeter,
      pricePerTsubo,
      year: new Date().getFullYear() - 1,
      municipality: city,
      source: 'api'
    };
  } catch (error) {
    console.error('Error fetching land price:', error);
    // エラー時のフォールバック
    return getDefaultLandPrice(prefecture, city);
  }
}

// APIレスポンスから平米単価を抽出
function extractPricePerSquareMeter(apiData: any): number {
  try {
    // APIレスポンスが配列形式の場合
    if (Array.isArray(apiData)) {
      const validPrices = apiData
        .filter((item: any) => {
          // 国土交通省APIの実際のフィールド名を使用
          return item && 
                 item["1㎡当たりの価格"] && 
                 !isNaN(Number(item["1㎡当たりの価格"]));
        })
        .map((item: any) => {
          return Number(item["1㎡当たりの価格"]);
        });
      
      if (validPrices.length > 0) {
        // 平均値を計算
        const average = validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length;
        return Math.round(average);
      }
    }
    
    // オブジェクト形式でデータが含まれている場合
    if (apiData.data && Array.isArray(apiData.data)) {
      return extractPricePerSquareMeter(apiData.data);
    }
    
    // results配列が含まれている場合
    if (apiData.results && Array.isArray(apiData.results)) {
      return extractPricePerSquareMeter(apiData.results);
    }
  } catch (error) {
    console.error('Error extracting price from API data:', error);
  }

  // データが取得できない場合のデフォルト値
  return 15000; // 1.5万円/㎡
}

// デフォルトの坪単価を返す関数
function getDefaultLandPrice(prefecture: string, city: string): LandPriceData {
  // 都道府県別のデフォルト坪単価（万円）- 2024年実勢価格
  const defaultPrices: Record<string, number> = {
    // 関東
    '東京都': 170,      // 170.3万円
    '神奈川県': 70,     // 70.2万円
    '埼玉県': 46,       // 46.2万円
    '千葉県': 41,       // 40.6万円
    '茨城県': 11,       // 11.1万円
    '栃木県': 11,       // 11.4万円
    '群馬県': 12,       // 11.6万円
    
    // 関西
    '大阪府': 53,       // 52.7万円
    '京都府': 46,       // 46.1万円
    '兵庫県': 43,       // 43.1万円
    '滋賀県': 20,       // 20.4万円
    '奈良県': 21,       // 20.5万円
    '和歌山県': 13,     // 12.7万円
    
    // 中部
    '愛知県': 43,       // 42.6万円
    '静岡県': 40,       // 推定40-60万円
    '岐阜県': 20,       // 推定値
    '三重県': 15,       // 14.9万円
    '新潟県': 12,       // 12.3万円
    '富山県': 17,       // 16.7万円
    '石川県': 20,       // 19.5万円
    '福井県': 20,       // 推定値
    '山梨県': 9,        // 9.1万円
    '長野県': 10,       // 10.0万円
    
    // 北海道・東北
    '北海道': 16,       // 16.2万円
    '青森県': 7,        // 7.3万円
    '岩手県': 10,       // 10.1万円
    '宮城県': 39,       // 38.9万円
    '秋田県': 5,        // 5.4万円
    '山形県': 9,        // 8.5万円
    '福島県': 10,       // 9.8万円
    
    // 中国・四国
    '鳥取県': 10,       // 推定値
    '島根県': 8,        // 推定値
    '岡山県': 25,       // 推定値
    '広島県': 40,       // 推定値
    '山口県': 15,       // 推定値
    '徳島県': 20,       // 推定値
    '香川県': 15,       // 推定値
    '愛媛県': 18,       // 推定値
    '高知県': 18,       // 推定値
    
    // 九州・沖縄
    '福岡県': 35,       // 34.8万円
    '佐賀県': 9,        // 8.9万円
    '長崎県': 11,       // 10.6万円
    '熊本県': 19,       // 18.9万円
    '大分県': 15,       // 15.4万円
    '宮崎県': 11,       // 10.7万円
    '鹿児島県': 14,     // 14.4万円
    '沖縄県': 24,       // 23.7万円
  };

  // 主要都市の調整係数（全国版）- 実際の価格に基づいて調整
  const majorCityMultipliers: Record<string, Record<string, number>> = {
    // 北海道・東北
    '北海道': {
      '札幌市': 2.4,      // 38.3÷16.2=2.36
      '中央区': 4.6,      // 75.0÷16.2=4.63
      '旭川市': 0.28,     // 4.5÷16.2=0.28
      '函館市': 0.31,     // 5.1÷16.2=0.31
      '帯広市': 0.3,
      '釧路市': 0.25,     // 4.0÷16.2=0.25
    },
    '青森県': {
      '青森市': 1.9,      // 13.9÷7.3=1.90
      '八戸市': 1.3,      // 9.5÷7.3=1.30
      '弘前市': 1.1,      // 8.0÷7.3=1.10
    },
    '岩手県': {
      '盛岡市': 1.83,     // 18.5÷10.1=1.83
      '一関市': 0.84,     // 8.5÷10.1=0.84
      '奥州市': 0.85,
    },
    '宮城県': {
      '仙台市': 1.12,     // 43.5÷38.9=1.12
      '青葉区': 1.3,
      '名取市': 0.4,
      '多賀城市': 0.4,
      '石巻市': 0.31,     // 12.0÷38.9=0.31
      '大崎市': 0.39,     // 15.0÷38.9=0.39
    },
    '秋田県': {
      '秋田市': 2.22,     // 12.0÷5.4=2.22
      '横手市': 1.11,     // 6.0÷5.4=1.11
      '大仙市': 1.02,     // 5.5÷5.4=1.02
    },
    '山形県': {
      '山形市': 1.88,     // 16.0÷8.5=1.88
      '鶴岡市': 0.94,     // 8.0÷8.5=0.94
      '酒田市': 0.94,
      '米沢市': 1.06,     // 9.0÷8.5=1.06
    },
    '福島県': {
      '福島市': 1.84,     // 18.0÷9.8=1.84
      '郡山市': 1.68,     // 16.5÷9.8=1.68
      'いわき市': 1.22,    // 12.0÷9.8=1.22
    },
    
    // 関東
    '茨城県': {
      'つくば市': 2.42,    // 26.9÷11.1=2.42
      '水戸市': 1.56,     // 17.3÷11.1=1.56
      '守谷市': 4.05,     // 45.0÷11.1=4.05
      'ひたちなか市': 1.2,
      '土浦市': 1.1,
      '取手市': 1.2,
      '牛久市': 1.3,
      '日立市': 1.1,
    },
    '栃木県': {
      '宇都宮市': 2.48,   // 28.3÷11.4=2.48
      '小山市': 1.26,     // 14.4÷11.4=1.26
      '栃木市': 0.69,     // 7.9÷11.4=0.69
      '足利市': 0.7,
    },
    '群馬県': {
      '前橋市': 1.14,     // 13.2÷11.6=1.14
      '高崎市': 3.73,     // 43.3÷11.6=3.73
      '伊勢崎市': 1.0,
      '太田市': 1.0,      // 11.6÷11.6=1.0
    },
    '埼玉県': {
      'さいたま市': 2.28,  // 105.4÷46.2=2.28
      '浦和区': 2.5,
      '大宮区': 2.4,
      '川口市': 2.13,     // 98.5÷46.2=2.13
      '所沢市': 1.22,     // 56.2÷46.2=1.22
      '越谷市': 1.3,
      '川越市': 1.29,     // 59.5÷46.2=1.29
      '春日部市': 1.2,
      '戸田市': 1.5,
      '和光市': 1.4,
    },
    '千葉県': {
      '千葉市': 1.22,     // 49.6÷40.6=1.22
      '浦安市': 2.0,
      '市川市': 3.36,     // 136.3÷40.6=3.36
      '船橋市': 2.20,     // 89.4÷40.6=2.20
      '松戸市': 1.78,     // 72.4÷40.6=1.78
      '柏市': 1.3,
      '習志野市': 1.4,
      '流山市': 1.4,
      '八千代市': 1.3,
      '我孫子市': 1.2,
    },
    '東京都': {
      '千代田区': 6.37,    // 1085.3÷170.3=6.37
      '中央区': 4.85,      // 826.4÷170.3=4.85
      '港区': 4.27,        // 727.3÷170.3=4.27
      '新宿区': 2.5,
      '文京区': 2.3,
      '台東区': 2.2,
      '墨田区': 2.0,
      '江東区': 2.0,
      '品川区': 2.3,
      '目黒区': 2.4,
      '大田区': 1.9,
      '世田谷区': 2.2,
      '渋谷区': 2.8,
      '中野区': 1.9,
      '杉並区': 1.9,
      '豊島区': 2.1,
      '北区': 1.7,
      '荒川区': 1.7,
      '板橋区': 1.6,
      '練馬区': 1.7,
      '足立区': 1.4,
      '葛飾区': 1.4,
      '江戸川区': 1.5,
      '武蔵野市': 2.0,
      '三鷹市': 1.8,
      '調布市': 1.7,
      '府中市': 1.6,
      '小金井市': 1.7,
      '国分寺市': 1.6,
      '立川市': 0.68,     // 115.7÷170.3=0.68
      '八王子市': 0.39,   // 66.1÷170.3=0.39
      '町田市': 1.3,
    },
    '神奈川県': {
      '横浜市': 1.85,     // 130.1÷70.2=1.85
      '西区': 2.2,
      '中区': 2.1,
      '港北区': 1.9,
      '青葉区': 2.0,
      '川崎市': 2.19,     // 153.7÷70.2=2.19
      '中原区': 2.5,
      '武蔵小杉': 2.7,
      '相模原市': 0.85,   // 59.5÷70.2=0.85
      '藤沢市': 1.24,     // 86.9÷70.2=1.24
      '鎌倉市': 1.6,
      '茅ヶ崎市': 1.4,
      '厚木市': 1.2,
      '大和市': 1.3,
      '海老名市': 1.3,
    },
    
    // 中部
    '新潟県': {
      '新潟市': 1.22,     // 15.0÷12.3=1.22
      '中央区': 1.4,
      '長岡市': 1.22,     // 15.0÷12.3=1.22
      '上越市': 1.0,
    },
    '富山県': {
      '富山市': 1.37,     // 22.9÷16.7=1.37
      '高岡市': 1.0,
      '射水市': 1.0,
    },
    '石川県': {
      '金沢市': 1.2,      // 推定値
      '小松市': 0.9,
      '白山市': 0.9,
    },
    '福井県': {
      '福井市': 1.34,     // 26.8÷20=1.34
      '坂井市': 1.0,
      '越前市': 0.9,
    },
    '山梨県': {
      '甲府市': 2.05,     // 18.7÷9.1=2.05
      '甲斐市': 1.1,
      '南アルプス市': 1.1,
    },
    '長野県': {
      '長野市': 2.42,     // 24.2÷10.0=2.42
      '松本市': 2.19,     // 21.9÷10.0=2.19
      '上田市': 1.1,
      '飯田市': 1.0,
    },
    '岐阜県': {
      '岐阜市': 1.4,
      '大垣市': 1.2,
      '各務原市': 1.2,
      '多治見市': 1.1,
    },
    '静岡県': {
      '静岡市': 1.5,
      '葵区': 1.6,
      '浜松市': 1.25,     // 50÷40=1.25（推定）
      '沼津市': 1.2,
      '富士市': 1.2,
      '藤枝市': 1.1,
    },
    '愛知県': {
      '名古屋市': 2.33,   // 100÷43=2.33（推定）
      '中区': 3.0,
      '中村区': 2.7,
      '千種区': 2.5,
      '昭和区': 2.3,
      '瑞穂区': 2.2,
      '豊田市': 1.3,
      '岡崎市': 1.2,
      '一宮市': 1.2,
      '豊橋市': 1.2,
      '春日井市': 1.2,
      '安城市': 1.3,
      '刈谷市': 1.3,
    },
    
    // 近畿
    '三重県': {
      '津市': 1.13,       // 16.9÷15=1.13
      '四日市市': 1.50,   // 22.4÷15=1.50
      '鈴鹿市': 1.10,     // 16.5÷15=1.10
      '松阪市': 1.0,
    },
    '滋賀県': {
      '大津市': 1.63,     // 33.2÷20.4=1.63
      '草津市': 2.53,     // 51.7÷20.4=2.53
      '長浜市': 1.0,
      '近江八幡市': 1.1,
      '守山市': 1.66,     // 33.9÷20.4=1.66
    },
    '京都府': {
      '京都市': 2.0,      // 推定値
      '中京区': 2.60,     // 120÷46.1=2.60
      '下京区': 2.3,
      '左京区': 2.0,
      '右京区': 1.7,
      '伏見区': 1.6,
      '上京区': 3.08,     // 142.2÷46.1=3.08
      '宇治市': 0.89,     // 41.2÷46.1=0.89
      '長岡京市': 1.57,   // 72.2÷46.1=1.57
    },
    '大阪府': {
      '大阪市': 1.0,      // 52.7÷52.7=1.0
      '北区': 2.0,
      '中央区': 1.8,
      '西区': 1.7,
      '福島区': 2.56,     // 135÷52.7=2.56
      '天王寺区': 1.5,
      '阿倍野区': 1.4,
      '堺市': 0.73,       // 38.5÷52.7=0.73
      '豊中市': 1.48,     // 78.2÷52.7=1.48
      '吹田市': 1.6,
      '高槻市': 1.4,
      '枚方市': 1.3,
      '茨木市': 1.4,
      '箕面市': 1.5,
      '東大阪市': 0.80,   // 42.1÷52.7=0.80
    },
    '兵庫県': {
      '神戸市': 1.0,      // 43.1÷43.1=1.0
      '中央区': 4.25,     // 183.4÷43.1=4.25
      '東灘区': 2.0,
      '灘区': 1.8,
      '西宮市': 2.08,     // 89.6÷43.1=2.08
      '芦屋市': 3.19,     // 137.6÷43.1=3.19
      '尼崎市': 1.4,
      '明石市': 1.3,
      '姫路市': 0.73,     // 31.6÷43.1=0.73
      '加古川市': 1.2,
      '宝塚市': 1.5,
    },
    '奈良県': {
      '奈良市': 2.32,     // 47.6÷20.5=2.32
      '生駒市': 1.81,     // 37.2÷20.5=1.81
      '橿原市': 1.69,     // 34.6÷20.5=1.69
      '大和郡山市': 1.2,
    },
    '和歌山県': {
      '和歌山市': 2.13,   // 27.0÷12.7=2.13
      '海南市': 1.24,     // 15.7÷12.7=1.24
      '橋本市': 1.0,
      '田辺市': 1.64,     // 20.8÷12.7=1.64
    },
    
    // 中国・四国
    '鳥取県': {
      '鳥取市': 1.45,     // 14.5÷10=1.45
      '米子市': 1.05,     // 10.5÷10=1.05
      '倉吉市': 0.93,     // 9.3÷10=0.93
    },
    '島根県': {
      '松江市': 1.56,     // 12.5÷8=1.56
      '出雲市': 0.99,     // 7.9÷8=0.99
      '浜田市': 0.73,     // 5.8÷8=0.73
    },
    '岡山県': {
      '岡山市': 1.55,     // 38.8÷25=1.55
      '北区': 1.8,
      '倉敷市': 0.75,     // 18.8÷25=0.75
      '津山市': 0.45,     // 11.2÷25=0.45
    },
    '広島県': {
      '広島市': 2.57,     // 102.9÷40=2.57
      '中区': 3.0,
      '南区': 2.5,
      '西区': 2.3,
      '福山市': 0.60,     // 23.8÷40=0.60
      '呉市': 0.68,       // 27.1÷40=0.68
      '東広島市': 1.2,
    },
    '山口県': {
      '山口市': 1.21,     // 18.1÷15=1.21
      '下関市': 1.0,      // 15.0÷15=1.0
      '宇部市': 0.85,     // 12.8÷15=0.85
      '周南市': 1.1,
    },
    '徳島県': {
      '徳島市': 1.51,     // 30.1÷20=1.51
      '鳴門市': 0.91,     // 18.2÷20=0.91
      '阿南市': 0.83,     // 16.5÷20=0.83
    },
    '香川県': {
      '高松市': 1.30,     // 19.5÷15=1.30
      '丸亀市': 0.95,     // 14.3÷15=0.95
      '坂出市': 0.84,     // 12.6÷15=0.84
    },
    '愛媛県': {
      '松山市': 1.44,     // 25.9÷18=1.44
      '今治市': 0.50,     // 9.0÷18=0.50
      '新居浜市': 0.82,   // 14.7÷18=0.82
      '西条市': 1.0,
    },
    '高知県': {
      '高知市': 1.32,     // 23.7÷18=1.32
      '南国市': 1.02,     // 18.4÷18=1.02
      '四万十市': 0.67,   // 12.1÷18=0.67
    },
    
    // 九州・沖縄
    '福岡県': {
      '福岡市': 1.44,     // 50÷35=1.44（推定）
      '博多区': 1.6,
      '中央区': 1.8,
      '東区': 1.4,
      '南区': 1.3,
      '西区': 1.2,
      '北九州市': 0.64,   // 22.5÷35=0.64（推定）
      '久留米市': 0.57,   // 20÷35=0.57（推定）
      '春日市': 1.2,
      '大野城市': 1.2,
      '筑紫野市': 1.1,
    },
    '佐賀県': {
      '佐賀市': 1.22,     // 11÷9=1.22（推定）
      '唐津市': 1.0,      // 9÷9=1.0（推定）
      '鳥栖市': 2.00,     // 18.0÷9=2.00
    },
    '長崎県': {
      '長崎市': 1.82,     // 19.3÷10.6=1.82
      '佐世保市': 1.02,   // 10.8÷10.6=1.02
      '諫早市': 1.1,
      '大村市': 1.27,     // 13.5÷10.6=1.27（推定）
    },
    '熊本県': {
      '熊本市': 1.58,     // 30÷19=1.58（推定）
      '中央区': 1.8,
      '八代市': 0.71,     // 13.5÷19=0.71（推定）
      '天草市': 0.5,
      '玉名市': 0.47,     // 9÷19=0.47（推定）
    },
    '大分県': {
      '大分市': 1.58,     // 24.4÷15.4=1.58
      '別府市': 1.13,     // 17.4÷15.4=1.13
      '中津市': 0.91,     // 14÷15.4=0.91（推定）
    },
    '宮崎県': {
      '宮崎市': 1.64,     // 18÷11=1.64（推定）
      '都城市': 0.82,     // 9÷11=0.82（推定）
      '延岡市': 0.73,     // 8÷11=0.73（推定）
    },
    '鹿児島県': {
      '鹿児島市': 2.36,   // 33÷14=2.36（推定）
      '霧島市': 0.79,     // 11÷14=0.79（推定）
      '鹿屋市': 0.64,     // 9÷14=0.64（推定）
    },
    '沖縄県': {
      '那覇市': 1.89,     // 45÷24=1.89（推定）
      '浦添市': 1.4,
      '宜野湾市': 1.17,   // 28÷24=1.17（推定）
      '沖縄市': 0.96,     // 23÷24=0.96（推定）
      'うるま市': 0.92,    // 22÷24=0.92（推定）
    },
  };

  let basePrice = defaultPrices[prefecture] || 20;
  
  // 主要都市の場合は調整
  if (majorCityMultipliers[prefecture] && majorCityMultipliers[prefecture][city]) {
    basePrice = basePrice * majorCityMultipliers[prefecture][city];
  }

  const pricePerTsubo = Math.round(basePrice);
  const pricePerSquareMeter = Math.round(pricePerTsubo * 10000 / 3.3);

  return {
    pricePerSquareMeter,
    pricePerTsubo,
    year: new Date().getFullYear() - 1,
    municipality: city,
    source: 'default'
  };
}

// 坪単価のみを返すシンプルな関数（後方互換性のため）
export async function fetchLandPrice(prefecture: string, city: string): Promise<number> {
  const data = await fetchLandPriceData(prefecture, city);
  return data ? data.pricePerTsubo : 50;
}

// キャッシュ機能（オプション）
const priceCache = new Map<string, { data: LandPriceData; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1時間

export async function fetchLandPriceDataWithCache(
  prefecture: string,
  city: string
): Promise<LandPriceData | null> {
  const cacheKey = `${prefecture}-${city}`;
  const cached = priceCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetchLandPriceData(prefecture, city);
  
  if (data) {
    priceCache.set(cacheKey, { data, timestamp: Date.now() });
  }
  
  return data;
}

/**
 * 過去の地価データを取得する関数
 * @param prefecture 都道府県名
 * @param city 市区町村名
 * @param years 取得する年数（デフォルト: 5年）
 * @returns 地価履歴データの配列、またはnull
 */
export async function fetchLandPriceHistory(
  prefecture: string, 
  city: string,
  years: number = 5
): Promise<Array<{ year: number; price: number; change: number }> | null> {
  try {
    const currentYear = new Date().getFullYear();
    const municipalityCode = await getMunicipalityCode(prefecture, city);
    
    if (!municipalityCode) {
      console.warn(`Municipality code not found for: ${city} in ${prefecture}`);
      return null;
    }

    const prefectureCode = getPrefectureCode(prefecture);
    const promises = [];

    // 過去の年数分のデータを並列で取得
    for (let i = 0; i < years; i++) {
      const year = currentYear - i - 1; // 最新年から順に
      promises.push(
        fetch(`/api/getLandPrice?area=${prefectureCode}&city=${municipalityCode}&year=${year}`)
          .then(res => {
            if (!res.ok) {
              console.warn(`Failed to fetch data for year ${year}`);
              return null;
            }
            return res.json();
          })
          .then(data => ({
            year,
            data: data ? extractPricePerSquareMeter(data) : null
          }))
          .catch(error => {
            console.error(`Error fetching data for year ${year}:`, error);
            return { year, data: null };
          })
      );
    }

    const results = await Promise.all(promises);
    
    // 有効なデータのみフィルタリング
    const validResults = results.filter(r => r.data !== null && r.data > 0);

    if (validResults.length < 2) {
      console.warn('Not enough valid data points for price history');
      return null; // データが少なすぎる場合
    }

    // 年度順にソート（古い順）
    validResults.sort((a, b) => a.year - b.year);

    // 価格履歴データを生成
    const history: Array<{ year: number; price: number; change: number }> = [];
    
    for (let i = 0; i < validResults.length; i++) {
      const currentResult = validResults[i];
      const previousResult = i > 0 ? validResults[i - 1] : null;
      
      // currentResultが存在することを確認
      if (!currentResult || currentResult.data === null || currentResult.data === undefined) {
        continue;
      }
      
      let change = 0;
      
      // 前年のデータが存在する場合のみ変化率を計算
      if (previousResult && previousResult.data !== null && previousResult.data !== undefined) {
        const previousPrice = previousResult.data;
        const currentPrice = currentResult.data;
        change = ((currentPrice - previousPrice) / previousPrice) * 100;
      }
      
      history.push({
        year: currentResult.year,
        price: currentResult.data,
        change: Math.round(change * 10) / 10 // 小数点1位まで
      });
    }

    // 最新5年分のデータを返す（データが5年分に満たない場合はそのまま）
    return history.slice(-5);
    
  } catch (error) {
    console.error('Error fetching land price history:', error);
    return null;
  }
}

/**
 * 過去の地価データをキャッシュ付きで取得する関数
 * @param prefecture 都道府県名
 * @param city 市区町村名
 * @param years 取得する年数（デフォルト: 5年）
 * @returns 地価履歴データの配列、またはnull
 */
const historyCache = new Map<string, { data: Array<{ year: number; price: number; change: number }>; timestamp: number }>();
const HISTORY_CACHE_DURATION = 1000 * 60 * 60 * 24; // 24時間

export async function fetchLandPriceHistoryWithCache(
  prefecture: string,
  city: string,
  years: number = 5
): Promise<Array<{ year: number; price: number; change: number }> | null> {
  const cacheKey = `history-${prefecture}-${city}-${years}`;
  const cached = historyCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < HISTORY_CACHE_DURATION) {
    console.log('Returning cached price history data');
    return cached.data;
  }
  
  const data = await fetchLandPriceHistory(prefecture, city, years);
  
  if (data && data.length > 0) {
    historyCache.set(cacheKey, { data, timestamp: Date.now() });
  }
  
  return data;
}