// API設定
export const apiConfig = {
    // e-Stat API（総務省統計局）
    estat: {
      baseUrl: 'https://api.e-stat.go.jp/rest/3.0/app',
      apiKey: process.env.ESTAT_API_KEY || '',
      endpoints: {
        getStatsList: '/json/getStatsList',      // 統計表情報取得
        getMetaInfo: '/json/getMetaInfo',        // メタ情報取得
        getStatsData: '/json/getStatsData',      // 統計データ取得
      },
      // よく使う統計表ID
      statsIds: {
        population: '0003448233',                // 人口統計
        households: '0003448234',                // 世帯統計
        schools: '0003142956',                   // 学校基本調査
      }
    },
    
    // 国土交通省 土地総合情報システムAPI
    landPrice: {
      baseUrl: 'https://www.land.mlit.go.jp/webland/api',
      endpoints: {
        prefectures: '/CitySearch',              // 都道府県一覧
        cities: '/CitySearch',                   // 市区町村一覧
        tradeList: '/TradeListSearch',           // 取引情報
        appraisalList: '/AppraisalSearch',       // 地価公示・地価調査
      }
    },
    
    // 共通設定
    common: {
      timeout: 30000,                            // タイムアウト（30秒）
      retryCount: 3,                             // リトライ回数
      retryDelay: 1000,                          // リトライ間隔（1秒）
    }
  } as const;