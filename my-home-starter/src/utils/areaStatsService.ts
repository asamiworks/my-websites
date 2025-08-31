// src/utils/areaStatsService.ts
import { cache } from 'react';

// 型定義
export interface AreaStats {
  population: number;
  populationChange: number;
  households: number;
  schools: {
    elementary: number;
    junior: number;
  };
  lastUpdated: string;
}

interface EstatApiResponse {
  GET_STATS_DATA: {
    RESULT: {
      STATUS: number;
      ERROR_MSG?: string;
    };
    STATISTICAL_DATA: {
      DATA_INF: {
        VALUE: Array<{
          '@tab': string;
          '@cat01': string;
          '@area': string;
          '@time': string;
          '@unit': string;
          '$': string;
        }>;
      };
    };
  };
}

interface CityCode {
  code: string;
  prefecture: string;
  city: string;
}

// 市区町村名から地域コードへの変換マップ（主要都市のみ抜粋）
const CITY_CODES: CityCode[] = [
  // 茨城県
  { code: '08201', prefecture: '茨城県', city: '水戸市' },
  { code: '08202', prefecture: '茨城県', city: '日立市' },
  { code: '08203', prefecture: '茨城県', city: '土浦市' },
  { code: '08204', prefecture: '茨城県', city: '古河市' },
  { code: '08205', prefecture: '茨城県', city: '石岡市' },
  { code: '08207', prefecture: '茨城県', city: '結城市' },
  { code: '08208', prefecture: '茨城県', city: '龍ケ崎市' },
  { code: '08210', prefecture: '茨城県', city: '下妻市' },
  { code: '08211', prefecture: '茨城県', city: '常総市' },
  { code: '08212', prefecture: '茨城県', city: '常陸太田市' },
  { code: '08214', prefecture: '茨城県', city: '高萩市' },
  { code: '08215', prefecture: '茨城県', city: '北茨城市' },
  { code: '08216', prefecture: '茨城県', city: '笠間市' },
  { code: '08217', prefecture: '茨城県', city: '取手市' },
  { code: '08219', prefecture: '茨城県', city: '牛久市' },
  { code: '08220', prefecture: '茨城県', city: 'つくば市' },
  { code: '08221', prefecture: '茨城県', city: 'ひたちなか市' },
  { code: '08222', prefecture: '茨城県', city: '鹿嶋市' },
  { code: '08223', prefecture: '茨城県', city: '潮来市' },
  { code: '08224', prefecture: '茨城県', city: '守谷市' },
  { code: '08225', prefecture: '茨城県', city: '常陸大宮市' },
  { code: '08226', prefecture: '茨城県', city: '那珂市' },
  { code: '08227', prefecture: '茨城県', city: '筑西市' },
  { code: '08228', prefecture: '茨城県', city: '坂東市' },
  { code: '08229', prefecture: '茨城県', city: '稲敷市' },
  { code: '08230', prefecture: '茨城県', city: 'かすみがうら市' },
  { code: '08231', prefecture: '茨城県', city: '桜川市' },
  { code: '08232', prefecture: '茨城県', city: '神栖市' },
  { code: '08233', prefecture: '茨城県', city: '行方市' },
  { code: '08234', prefecture: '茨城県', city: '鉾田市' },
  { code: '08235', prefecture: '茨城県', city: 'つくばみらい市' },
  { code: '08236', prefecture: '茨城県', city: '小美玉市' },
  
  // 東京都（区部）
  { code: '13101', prefecture: '東京都', city: '千代田区' },
  { code: '13102', prefecture: '東京都', city: '中央区' },
  { code: '13103', prefecture: '東京都', city: '港区' },
  { code: '13104', prefecture: '東京都', city: '新宿区' },
  { code: '13105', prefecture: '東京都', city: '文京区' },
  { code: '13106', prefecture: '東京都', city: '台東区' },
  { code: '13107', prefecture: '東京都', city: '墨田区' },
  { code: '13108', prefecture: '東京都', city: '江東区' },
  { code: '13109', prefecture: '東京都', city: '品川区' },
  { code: '13110', prefecture: '東京都', city: '目黒区' },
  { code: '13111', prefecture: '東京都', city: '大田区' },
  { code: '13112', prefecture: '東京都', city: '世田谷区' },
  { code: '13113', prefecture: '東京都', city: '渋谷区' },
  { code: '13114', prefecture: '東京都', city: '中野区' },
  { code: '13115', prefecture: '東京都', city: '杉並区' },
  { code: '13116', prefecture: '東京都', city: '豊島区' },
  { code: '13117', prefecture: '東京都', city: '北区' },
  { code: '13118', prefecture: '東京都', city: '荒川区' },
  { code: '13119', prefecture: '東京都', city: '板橋区' },
  { code: '13120', prefecture: '東京都', city: '練馬区' },
  { code: '13121', prefecture: '東京都', city: '足立区' },
  { code: '13122', prefecture: '東京都', city: '葛飾区' },
  { code: '13123', prefecture: '東京都', city: '江戸川区' },
  
  // 大阪府（主要市）
  { code: '27100', prefecture: '大阪府', city: '大阪市' },
  { code: '27140', prefecture: '大阪府', city: '堺市' },
  
  // 神奈川県（主要市）
  { code: '14100', prefecture: '神奈川県', city: '横浜市' },
  { code: '14130', prefecture: '神奈川県', city: '川崎市' },
  { code: '14150', prefecture: '神奈川県', city: '相模原市' },
  
  // 愛知県（主要市）
  { code: '23100', prefecture: '愛知県', city: '名古屋市' },
  
  // 北海道（主要市）
  { code: '01100', prefecture: '北海道', city: '札幌市' },
  
  // 福岡県（主要市）
  { code: '40100', prefecture: '福岡県', city: '福岡市' },
  { code: '40130', prefecture: '福岡県', city: '北九州市' },
  
  // 宮城県（主要市）
  { code: '04100', prefecture: '宮城県', city: '仙台市' },
  
  // 広島県（主要市）
  { code: '34100', prefecture: '広島県', city: '広島市' },
  
  // 京都府（主要市）
  { code: '26100', prefecture: '京都府', city: '京都市' },
];

// キャッシュ
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7日間
const statsCache = new Map<string, { data: AreaStats; timestamp: number }>();

// モックデータ（フォールバック用）
const FALLBACK_DATA: Record<string, AreaStats> = {
  '水戸市': {
    population: 269186,
    populationChange: -0.3,
    households: 122334,
    schools: {
      elementary: 32,
      junior: 16
    },
    lastUpdated: '2025-01-01'
  },
  '千代田区': {
    population: 67289,
    populationChange: 2.1,
    households: 37421,
    schools: {
      elementary: 8,
      junior: 3
    },
    lastUpdated: '2025-01-01'
  },
  '大阪市': {
    population: 2754742,
    populationChange: 0.3,
    households: 1461907,
    schools: {
      elementary: 287,
      junior: 130
    },
    lastUpdated: '2025-01-01'
  },
  '横浜市': {
    population: 3777491,
    populationChange: 0.2,
    households: 1761855,
    schools: {
      elementary: 341,
      junior: 145
    },
    lastUpdated: '2025-01-01'
  },
  '名古屋市': {
    population: 2332176,
    populationChange: 0.5,
    households: 1125139,
    schools: {
      elementary: 261,
      junior: 110
    },
    lastUpdated: '2025-01-01'
  },
  '札幌市': {
    population: 1973432,
    populationChange: 0.1,
    households: 1062489,
    schools: {
      elementary: 203,
      junior: 97
    },
    lastUpdated: '2025-01-01'
  },
  '福岡市': {
    population: 1612392,
    populationChange: 1.2,
    households: 826842,
    schools: {
      elementary: 144,
      junior: 69
    },
    lastUpdated: '2025-01-01'
  },
  '仙台市': {
    population: 1097196,
    populationChange: 0.3,
    households: 527841,
    schools: {
      elementary: 120,
      junior: 64
    },
    lastUpdated: '2025-01-01'
  },
  '広島市': {
    population: 1199252,
    populationChange: -0.1,
    households: 571893,
    schools: {
      elementary: 142,
      junior: 64
    },
    lastUpdated: '2025-01-01'
  },
  '京都市': {
    population: 1463723,
    populationChange: -0.5,
    households: 725736,
    schools: {
      elementary: 166,
      junior: 73
    },
    lastUpdated: '2025-01-01'
  }
};

// 市区町村名から地域コードを取得
function getCityCode(cityName: string): string | null {
  const city = CITY_CODES.find(c => c.city === cityName);
  return city?.code || null;
}

// e-Stat APIから人口・世帯数データを取得
async function fetchPopulationData(cityCode: string): Promise<{ population: number; households: number } | null> {
  const appId = process.env.ESTAT_API_KEY;
  if (!appId) {
    console.error('ESTAT_API_KEY is not set');
    return null;
  }

  // 統計表ID: 国勢調査 人口等基本集計
  const statsDataId = '0003448237';
  const cdCat01 = '00710,00720'; // 総人口,世帯数
  
  const url = `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData?appId=${appId}&statsDataId=${statsDataId}&cdCat01=${cdCat01}&cdArea=${cityCode}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    const data: EstatApiResponse = await response.json();
    
    if (data.GET_STATS_DATA.RESULT.STATUS !== 0) {
      console.error('e-Stat API error:', data.GET_STATS_DATA.RESULT.ERROR_MSG);
      return null;
    }

    const values = data.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE;
    let population = 0;
    let households = 0;

    values.forEach(value => {
      const numValue = parseInt(value.$, 10);
      if (value['@cat01'] === '00710') {
        population = numValue;
      } else if (value['@cat01'] === '00720') {
        households = numValue;
      }
    });

    return { population, households };
  } catch (error) {
    console.error('Failed to fetch population data:', error);
    return null;
  }
}

// e-Stat APIから学校数データを取得
async function fetchSchoolData(cityCode: string): Promise<{ elementary: number; junior: number } | null> {
  const appId = process.env.ESTAT_API_KEY;
  if (!appId) {
    console.error('ESTAT_API_KEY is not set');
    return null;
  }

  // 統計表ID: 学校基本調査
  const statsDataId = '0003157002';
  const cdCat01 = '010,020'; // 小学校,中学校
  
  const url = `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData?appId=${appId}&statsDataId=${statsDataId}&cdCat01=${cdCat01}&cdArea=${cityCode}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    const data: EstatApiResponse = await response.json();
    
    if (data.GET_STATS_DATA.RESULT.STATUS !== 0) {
      console.error('e-Stat API error:', data.GET_STATS_DATA.RESULT.ERROR_MSG);
      return null;
    }

    const values = data.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE;
    let elementary = 0;
    let junior = 0;

    values.forEach(value => {
      const numValue = parseInt(value.$, 10);
      if (value['@cat01'] === '010') {
        elementary = numValue;
      } else if (value['@cat01'] === '020') {
        junior = numValue;
      }
    });

    return { elementary, junior };
  } catch (error) {
    console.error('Failed to fetch school data:', error);
    return null;
  }
}

// e-Stat APIから統計データを取得
async function fetchAreaStatsFromAPI(cityName: string): Promise<AreaStats | null> {
  const cityCode = getCityCode(cityName);
  if (!cityCode) {
    console.log(`City code not found for: ${cityName}`);
    return null;
  }

  try {
    // 並行してデータを取得
    const [populationData, schoolData] = await Promise.all([
      fetchPopulationData(cityCode),
      fetchSchoolData(cityCode)
    ]);

    if (!populationData || !schoolData) {
      return null;
    }

    // 人口変化率は前年データがないため0とする
    const stats: AreaStats = {
      population: populationData.population,
      populationChange: 0,
      households: populationData.households,
      schools: {
        elementary: schoolData.elementary,
        junior: schoolData.junior
      },
      lastUpdated: new Date().toISOString().split('T')[0] ?? '2025-01-01'
    };

    return stats;
  } catch (error) {
    console.error('Failed to fetch area stats from API:', error);
    return null;
  }
}

// メイン関数（キャッシュ付き）
export const fetchAreaStats = cache(async (city: string): Promise<AreaStats | null> => {
  // キャッシュチェック
  const cached = statsCache.get(city);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for ${city}`);
    return cached.data;
  }

  // APIから取得を試みる
  const apiData = await fetchAreaStatsFromAPI(city);
  if (apiData) {
    // キャッシュに保存
    statsCache.set(city, { data: apiData, timestamp: Date.now() });
    return apiData;
  }

  // APIが失敗した場合はフォールバックデータを使用
  const fallbackData = FALLBACK_DATA[city];
  if (fallbackData) {
    console.log(`Using fallback data for ${city}`);
    return fallbackData;
  }

  // どちらもない場合はデフォルト値を返す
  console.log(`No data available for ${city}, returning default values`);
  return {
    population: 0,
    populationChange: 0,
    households: 0,
    schools: {
      elementary: 0,
      junior: 0
    },
    lastUpdated: new Date().toISOString().split('T')[0] ?? '2025-01-01'
  };
});