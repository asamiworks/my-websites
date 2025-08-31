import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// 市区町村データの型定義
export interface MunicipalityForBuild {
  code: string;
  prefecture: string;
  prefectureSlug: string;
  city: string;
  citySlug: string;
  cityKana?: string; // ふりがなを追加
}

// ひらがなをローマ字に変換
function hiraganaToRomaji(text: string): string {
  const kanaToRomaji: { [key: string]: string } = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n',
    'ー': '-',
    'っ': '', // 小さい「っ」は次の子音を重ねる処理が必要
  };

  let result = '';
  const chars = text.split('');
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (!char) continue; // charがundefinedの場合はスキップ
    
    const nextChar = chars[i + 1];
    
    // 小さい「っ」の処理
    if (char === 'っ' && nextChar && kanaToRomaji[nextChar]) {
      const nextRomaji = kanaToRomaji[nextChar];
      if (nextRomaji && nextRomaji[0]) {
        result += nextRomaji[0]; // 次の子音を重ねる
      }
    } else if (char in kanaToRomaji) {
      result += kanaToRomaji[char];
    } else {
      result += char;
    }
  }
  
  return result;
}

// 漢字からslugを生成（フォールバック用）
function kanjiToSlug(text: string): string {
  // よく使われる地名の漢字マッピング
  const kanjiMap: { [key: string]: string } = {
    // 区
    '中央': 'chuo', '北': 'kita', '東': 'higashi', '南': 'minami', '西': 'nishi',
    '白石': 'shiroishi', '豊平': 'toyohira', '厚別': 'atsubetsu', '手稲': 'teine',
    '清田': 'kiyota', '都島': 'miyakojima', '福島': 'fukushima', '此花': 'konohana',
    '港': 'minato', '大正': 'taisho', '天王寺': 'tennoji', '浪速': 'naniwa',
    '西淀川': 'nishiyodogawa', '東淀川': 'higashiyodogawa', '東成': 'higashinari',
    '生野': 'ikuno', '旭': 'asahi', '城東': 'joto', '阿倍野': 'abeno',
    '住吉': 'sumiyoshi', '東住吉': 'higashisumiyoshi', '西成': 'nishinari',
    '淀川': 'yodogawa', '鶴見': 'tsurumi', '住之江': 'suminoe', '平野': 'hirano',
    '北区': 'kita', '中央区': 'chuo', '西区': 'nishi', '東区': 'higashi', '南区': 'minami',
    // その他の一般的な地名
    '区': 'ku', '市': 'shi', '町': 'machi', '村': 'mura',
  };
  
  let result = text;
  
  // 漢字をマッピングに基づいて変換
  Object.entries(kanjiMap).forEach(([kanji, romaji]) => {
    result = result.replace(new RegExp(kanji, 'g'), romaji);
  });
  
  // 残った漢字や特殊文字を削除
  result = result
    .replace(/[一-龥]/g, '')
    .replace(/[ぁ-ん]/g, '')
    .replace(/[ァ-ン]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
    
  return result || 'city';
}

// ふりがなからslugを生成（改善版）
export function kanaToSlug(kana: string, cityName?: string): string {
  // ふりがながない場合は漢字から生成
  if (!kana && cityName) {
    return kanjiToSlug(cityName);
  }
  
  if (!kana) return '';
  
  // 特殊なケースの処理
  const specialCases: { [key: string]: string } = {
    'さっぽろし': 'sapporo',
    'さいたまし': 'saitama-city',
    'ちばし': 'chiba-city',
    'よこはまし': 'yokohama',
    'かわさきし': 'kawasaki',
    'きょうとし': 'kyoto-city',
    'おおさかし': 'osaka-city',
    'こうべし': 'kobe',
    'ひろしまし': 'hiroshima-city',
    'ふくおかし': 'fukuoka-city',
    // 茨城県の特殊なケース
    'りゅうがさきし': 'ryugasaki',
    'つくばみらいし': 'tsukubamirai',
    'かすみがうらし': 'kasumigaura',
  };
  
  // 正規化（市区町村を除去）
  const normalized = kana
    .replace(/し$/, '') // 市
    .replace(/く$/, '') // 区
    .replace(/まち$/, '') // 町
    .replace(/ちょう$/, '') // 町（別読み）
    .replace(/むら$/, '') // 村
    .replace(/そん$/, ''); // 村（別読み）
    
  // 特殊なケースをチェック
  if (specialCases[kana]) {
    return specialCases[kana];
  }
  
  // ひらがなをローマ字に変換
  const romaji = hiraganaToRomaji(normalized);
  
  // クリーンアップ
  return romaji
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

// 都道府県名をスラッグに変換
export function prefectureToSlug(prefecture: string): string {
  const slugMap: Record<string, string> = {
    '北海道': 'hokkaido',
    '青森県': 'aomori',
    '岩手県': 'iwate',
    '宮城県': 'miyagi',
    '秋田県': 'akita',
    '山形県': 'yamagata',
    '福島県': 'fukushima',
    '茨城県': 'ibaraki',
    '栃木県': 'tochigi',
    '群馬県': 'gunma',
    '埼玉県': 'saitama',
    '千葉県': 'chiba',
    '東京都': 'tokyo',
    '神奈川県': 'kanagawa',
    '新潟県': 'niigata',
    '富山県': 'toyama',
    '石川県': 'ishikawa',
    '福井県': 'fukui',
    '山梨県': 'yamanashi',
    '長野県': 'nagano',
    '岐阜県': 'gifu',
    '静岡県': 'shizuoka',
    '愛知県': 'aichi',
    '三重県': 'mie',
    '滋賀県': 'shiga',
    '京都府': 'kyoto',
    '大阪府': 'osaka',
    '兵庫県': 'hyogo',
    '奈良県': 'nara',
    '和歌山県': 'wakayama',
    '鳥取県': 'tottori',
    '島根県': 'shimane',
    '岡山県': 'okayama',
    '広島県': 'hiroshima',
    '山口県': 'yamaguchi',
    '徳島県': 'tokushima',
    '香川県': 'kagawa',
    '愛媛県': 'ehime',
    '高知県': 'kochi',
    '福岡県': 'fukuoka',
    '佐賀県': 'saga',
    '長崎県': 'nagasaki',
    '熊本県': 'kumamoto',
    '大分県': 'oita',
    '宮崎県': 'miyazaki',
    '鹿児島県': 'kagoshima',
    '沖縄県': 'okinawa',
  };
  
  return slugMap[prefecture] || prefecture.toLowerCase();
}

// CSVから全市区町村データを読み込む（ビルド時用）
export async function loadAllMunicipalitiesForBuild(): Promise<MunicipalityForBuild[]> {
  try {
    const csvPath = path.join(process.cwd(), 'public', 'municipalities.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    
    const municipalities: MunicipalityForBuild[] = [];
    const processedSlugs = new Set<string>(); // 重複チェック用
    
    records.forEach((record: any) => {
      const code = record['標準地域コード'];
      const prefecture = record['都道府県'];
      const district = record['政令市･郡･支庁･振興局等'] || '';
      const districtKana = record['政令市･郡･支庁･振興局等（ふりがな）'] || '';
      const city = record['市区町村'] || '';
      const cityKana = record['市区町村（ふりがな）'] || '';
      
      if (!code || !prefecture) return;
      
      // 市区町村名とふりがなの決定
      let cityName = '';
      let cityKanaName = '';
      
      if (city && district) {
        // 政令指定都市の区（例：大阪市北区）
        cityName = `${district}${city}`;
        cityKanaName = cityKana || city; // 区のふりがなを優先
      } else if (city) {
        // 通常の市町村
        cityName = city;
        cityKanaName = cityKana;
      } else if (district && code.length === 5) {
        // 政令指定都市本体（例：大阪市）
        cityName = district;
        cityKanaName = districtKana;
      } else {
        return;
      }
      
      // 東京特別区部のスキップ
      if (cityName === '特別区部') return;
      
      const prefectureSlug = prefectureToSlug(prefecture);
      let citySlug = kanaToSlug(cityKanaName, cityName);
      
      // slugの重複チェックと解決
      let slugKey = `${prefectureSlug}-${citySlug}`;
      let counter = 1;
      while (processedSlugs.has(slugKey)) {
        citySlug = `${kanaToSlug(cityKanaName, cityName)}-${counter}`;
        slugKey = `${prefectureSlug}-${citySlug}`;
        counter++;
      }
      processedSlugs.add(slugKey);
      
      municipalities.push({
        code,
        prefecture,
        city: cityName,
        cityKana: cityKanaName,
        prefectureSlug,
        citySlug,
      });
    });
    
    return municipalities;
  } catch (error) {
    console.error('Failed to load municipalities for build:', error);
    return [];
  }
}

// ユニークな都道府県を取得
export async function getUniquePrefectures(): Promise<string[]> {
  const municipalities = await loadAllMunicipalitiesForBuild();
  const prefectures = new Set(municipalities.map(m => m.prefecture));
  return Array.from(prefectures).sort();
}

// 都道府県ごとの市区町村を取得
export async function getMunicipalitiesByPrefecture(prefecture: string): Promise<MunicipalityForBuild[]> {
  const municipalities = await loadAllMunicipalitiesForBuild();
  return municipalities.filter(m => m.prefecture === prefecture);
}

// スラッグから都道府県名を取得
export function getPrefectureFromSlug(slug: string): string | null {
  const slugMap: Record<string, string> = {
    'hokkaido': '北海道',
    'aomori': '青森県',
    'iwate': '岩手県',
    'miyagi': '宮城県',
    'akita': '秋田県',
    'yamagata': '山形県',
    'fukushima': '福島県',
    'ibaraki': '茨城県',
    'tochigi': '栃木県',
    'gunma': '群馬県',
    'saitama': '埼玉県',
    'chiba': '千葉県',
    'tokyo': '東京都',
    'kanagawa': '神奈川県',
    'niigata': '新潟県',
    'toyama': '富山県',
    'ishikawa': '石川県',
    'fukui': '福井県',
    'yamanashi': '山梨県',
    'nagano': '長野県',
    'gifu': '岐阜県',
    'shizuoka': '静岡県',
    'aichi': '愛知県',
    'mie': '三重県',
    'shiga': '滋賀県',
    'kyoto': '京都府',
    'osaka': '大阪府',
    'hyogo': '兵庫県',
    'nara': '奈良県',
    'wakayama': '和歌山県',
    'tottori': '鳥取県',
    'shimane': '島根県',
    'okayama': '岡山県',
    'hiroshima': '広島県',
    'yamaguchi': '山口県',
    'tokushima': '徳島県',
    'kagawa': '香川県',
    'ehime': '愛媛県',
    'kochi': '高知県',
    'fukuoka': '福岡県',
    'saga': '佐賀県',
    'nagasaki': '長崎県',
    'kumamoto': '熊本県',
    'oita': '大分県',
    'miyazaki': '宮崎県',
    'kagoshima': '鹿児島県',
    'okinawa': '沖縄県',
  };
  
  return slugMap[slug] || null;
}

// 統計情報を取得（デバッグ用）
export async function getStatistics() {
  const municipalities = await loadAllMunicipalitiesForBuild();
  const prefectures = await getUniquePrefectures();
  
  const stats = {
    totalMunicipalities: municipalities.length,
    totalPrefectures: prefectures.length,
    municipalitiesByPrefecture: {} as Record<string, number>,
  };
  
  for (const prefecture of prefectures) {
    const count = municipalities.filter(m => m.prefecture === prefecture).length;
    stats.municipalitiesByPrefecture[prefecture] = count;
  }
  
  return stats;
}