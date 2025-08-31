// scripts/updateAddressesWithGeocoding.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Google Geocoding APIを使用（無料枠：月40,000リクエスト）
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

interface GeocodeResult {
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

// 電話番号から住所を推定（会社名と組み合わせて検索）
async function getAddressFromPhone(companyName: string, phone: string): Promise<{
  address: string;
  prefecture: string;
  city: string;
  lat: number;
  lng: number;
} | null> {
  try {
    // 電話番号から地域を推定
    const areaCode = phone.replace(/[^\d]/g, '').substring(0, 4);
    const regionHint = getRegionFromAreaCode(areaCode);
    
    // Google Places APIで検索
    const searchQuery = `${companyName} ${regionHint}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&region=jp&language=ja&key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result: GeocodeResult = data.results[0];
      
      // 住所コンポーネントから都道府県と市区町村を抽出
      let prefecture = '';
      let city = '';
      
      for (const component of result.address_components) {
        if (component.types.includes('administrative_area_level_1')) {
          prefecture = component.long_name;
        }
        if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
          city = component.long_name;
        }
      }
      
      return {
        address: result.formatted_address,
        prefecture,
        city,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// 市外局番から地域を推定
function getRegionFromAreaCode(areaCode: string): string {
  const areaCodes: { [key: string]: string } = {
    // 茨城県
    '0299': '茨城県',
    '0298': '茨城県つくば市',
    '0297': '茨城県',
    '0296': '茨城県',
    '0295': '茨城県',
    '0294': '茨城県日立市',
    '0293': '茨城県',
    '0291': '茨城県',
    '0280': '茨城県',
    '029': '茨城県水戸市',
    // 他の都道府県も追加可能
    '03': '東京都',
    '06': '大阪府',
    '052': '愛知県名古屋市',
    // ... 続く
  };
  
  // 最長一致で検索
  for (let i = 4; i >= 2; i--) {
    const prefix = areaCode.substring(0, i);
    if (areaCodes[prefix]) {
      return areaCodes[prefix];
    }
  }
  
  return '日本';
}

// 代替案2: URLから会社情報を取得（スクレイピング）
async function getAddressFromWebsite(url: string): Promise<{
  address: string | null;
  phone: string | null;
} | null> {
  try {
    // Puppeteerを使ったスクレイピング（別途実装必要）
    // ここでは簡易的な実装例
    console.log(`URLから情報取得: ${url}`);
    // 実際の実装では会社概要ページを解析
    return null;
  } catch (error) {
    console.error('Website scraping error:', error);
    return null;
  }
}

// 代替案3: 既知の住所データベースから推定
async function estimateAddressFromServiceArea(companyName: string, serviceAreas: string[]): Promise<{
  prefecture: string;
  city: string;
  estimatedAddress: string;
} | null> {
  // サービスエリアの中心地を本社所在地と推定
  if (serviceAreas.length === 1) {
    // 単一県で営業している場合、その県の県庁所在地と推定
    const prefecture = serviceAreas[0];
    const capitalCities: { [key: string]: string } = {
      '茨城県': '水戸市',
      '東京都': '千代田区',
      '神奈川県': '横浜市',
      // ... 続く
    };
    
    const city = capitalCities[prefecture] || '';
    return {
      prefecture,
      city,
      estimatedAddress: `${prefecture}${city}`
    };
  }
  
  return null;
}

// メイン処理
async function updateCompanyAddresses() {
  console.log('代替方法での住所更新を開始します...');
  
  try {
    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { gBizData: { equals: null } },
          { gBizData: { path: ['address'], equals: null } }
        ]
      },
      include: {
        serviceAreas: true
      }
    });
    
    console.log(`処理対象: ${companies.length}社`);
    
    for (const company of companies) {
      let addressInfo = null;
      
      // 方法1: 電話番号から推定
      if (company.website && company.website.includes('tel:')) {
        const phoneMatch = company.website.match(/tel:([\d-]+)/);
        if (phoneMatch) {
          addressInfo = await getAddressFromPhone(company.name, phoneMatch[1]);
        }
      }
      
      // 方法2: サービスエリアから推定
      if (!addressInfo && company.serviceAreas.length > 0) {
        const areas = company.serviceAreas.map(sa => sa.prefecture);
        const estimated = await estimateAddressFromServiceArea(company.name, areas);
        if (estimated) {
          addressInfo = {
            address: estimated.estimatedAddress,
            prefecture: estimated.prefecture,
            city: estimated.city,
            lat: 0,
            lng: 0,
            isEstimated: true
          };
        }
      }
      
      if (addressInfo) {
        await prisma.company.update({
          where: { id: company.id },
          data: {
            gBizData: {
              ...addressInfo,
              source: 'alternative',
              lastUpdated: new Date().toISOString()
            },
            gBizLastUpdated: new Date()
          }
        });
        
        console.log(`✓ ${company.name}: ${addressInfo.address}${addressInfo.isEstimated ? ' (推定)' : ''}`);
      }
      
      // API制限対策
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 即座に使える簡易版：都道府県の中心座標を使用
async function setDefaultCoordinates() {
  const prefectureCoordinates: { [key: string]: { lat: number; lng: number; capital: string } } = {
    '茨城県': { lat: 36.3418, lng: 140.4468, capital: '水戸市' },
    '東京都': { lat: 35.6762, lng: 139.6503, capital: '新宿区' },
    '神奈川県': { lat: 35.4478, lng: 139.6425, capital: '横浜市' },
    '千葉県': { lat: 35.6050, lng: 140.1233, capital: '千葉市' },
    '埼玉県': { lat: 35.8570, lng: 139.6489, capital: 'さいたま市' },
    '栃木県': { lat: 36.5658, lng: 139.8836, capital: '宇都宮市' },
    '群馬県': { lat: 36.3906, lng: 139.0604, capital: '前橋市' },
    // ... 全都道府県分
  };
  
  try {
    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { gBizData: { equals: null } },
          { gBizData: { path: ['coordinates'], equals: null } }
        ]
      },
      include: {
        serviceAreas: true
      }
    });
    
    console.log(`座標設定対象: ${companies.length}社`);
    
    for (const company of companies) {
      if (company.serviceAreas.length > 0) {
        const mainPrefecture = company.serviceAreas[0].prefecture;
        const coords = prefectureCoordinates[mainPrefecture];
        
        if (coords) {
          await prisma.company.update({
            where: { id: company.id },
            data: {
              gBizData: {
                coordinates: {
                  lat: coords.lat,
                  lng: coords.lng
                },
                estimatedLocation: {
                  prefecture: mainPrefecture,
                  city: coords.capital,
                  method: 'prefecture_center'
                },
                lastUpdated: new Date().toISOString()
              }
            }
          });
          
          console.log(`✓ ${company.name}: ${mainPrefecture} (県庁所在地の座標を使用)`);
        }
      }
    }
    
    console.log('完了: 都道府県中心座標の設定');
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 実行
const args = process.argv.slice(2);

if (args.includes('--simple')) {
  // 簡易版：都道府県の中心座標を使用
  setDefaultCoordinates();
} else if (args.includes('--geocode')) {
  // Google Geocoding APIを使用
  updateCompanyAddresses();
} else {
  console.log('使用方法:');
  console.log('  --simple   : 都道府県の中心座標を使用（即座に実行可能）');
  console.log('  --geocode  : Google Geocoding APIを使用（要APIキー）');
}