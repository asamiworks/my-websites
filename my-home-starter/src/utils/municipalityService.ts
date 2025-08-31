// 市区町村データの型定義
export interface Municipality {
  code: string;
  prefecture: string;
  city: string;
}

// メモリキャッシュ
let municipalityCache: Municipality[] | null = null;

// CSVから全国の市区町村データを読み込む（クライアントサイド用）
export async function loadMunicipalities(): Promise<Municipality[]> {
  // ビルド時はエラーを避けるため空配列を返す
  if (typeof window === 'undefined') {
    return [];
  }

  // キャッシュがあればそれを返す
  if (municipalityCache) {
    return municipalityCache;
  }

  try {
    const response = await fetch('/municipalities.csv');
    const text = await response.text();
    
    const lines = text.split('\n').slice(1); // ヘッダーをスキップ
    const municipalities = lines
      .map(line => {
        // 空行をスキップ
        if (!line.trim()) return null;
        
        // CSVフォーマット: "標準地域コード","都道府県","政令市･郡･支庁･振興局等","政令市･郡･支庁･振興局等（ふりがな）","市区町村","市区町村（ふりがな）"
        const parts = line.split(',').map(part => part.replace(/"/g, '').trim());
        
        if (parts.length < 6) return null;
        
        const code = parts[0];
        const prefecture = parts[1];
        const district = parts[2];
        const city = parts[4];
        
        if (!code || !prefecture) return null;
        
        // 市区町村名の決定
        let cityName = '';
        if (city && district) {
          // 政令指定都市の区（例：大阪市北区）
          cityName = `${district}${city}`;
        } else if (city) {
          // 通常の市町村
          cityName = city;
        } else if (district) {
          // 政令指定都市本体（例：大阪市）
          cityName = district;
        } else {
          return null;
        }
        
        return { code, prefecture, city: cityName };
      })
      .filter((item): item is Municipality => item !== null);
    
    municipalityCache = municipalities;
    return municipalities;
  } catch (error) {
    console.error('Failed to load municipalities:', error);
    return [];
  }
}

// 都道府県と市区町村名から市区町村コードを取得
export async function getMunicipalityCode(prefecture: string, city: string): Promise<string | null> {
  const municipalities = await loadMunicipalities();
  const municipality = municipalities.find(
    m => m.prefecture === prefecture && m.city === city
  );
  return municipality ? municipality.code : null;
}

// 都道府県コードを取得（簡易実装）
export function getPrefectureCode(prefecture: string): string {
  const prefectureCodes: { [key: string]: string } = {
    '北海道': '01', '青森県': '02', '岩手県': '03', '宮城県': '04', '秋田県': '05',
    '山形県': '06', '福島県': '07', '茨城県': '08', '栃木県': '09', '群馬県': '10',
    '埼玉県': '11', '千葉県': '12', '東京都': '13', '神奈川県': '14', '新潟県': '15',
    '富山県': '16', '石川県': '17', '福井県': '18', '山梨県': '19', '長野県': '20',
    '岐阜県': '21', '静岡県': '22', '愛知県': '23', '三重県': '24', '滋賀県': '25',
    '京都府': '26', '大阪府': '27', '兵庫県': '28', '奈良県': '29', '和歌山県': '30',
    '鳥取県': '31', '島根県': '32', '岡山県': '33', '広島県': '34', '山口県': '35',
    '徳島県': '36', '香川県': '37', '愛媛県': '38', '高知県': '39', '福岡県': '40',
    '佐賀県': '41', '長崎県': '42', '熊本県': '43', '大分県': '44', '宮崎県': '45',
    '鹿児島県': '46', '沖縄県': '47'
  };
  return prefectureCodes[prefecture] || '00';
}

// 地区コードを取得（ダミー実装）
export function getDivisionCode(prefecture: string, city: string): string {
  // 実際の実装では適切な地区コードを返す必要がありますが、
  // ここではダミー値を返します
  return '00100';
}
