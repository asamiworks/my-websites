import { fetchLandPrice as fetchLandPriceFromService } from '@/utils/landPriceService';

// 茨城県の市町村データ
export const ibarakiMunicipalities = [
  // 市（32市）
  { name: '水戸市', slug: 'mito', population: 270685 },
  { name: 'つくば市', slug: 'tsukuba', population: 241656 },
  { name: '日立市', slug: 'hitachi', population: 174000 },
  { name: '土浦市', slug: 'tsuchiura', population: 142000 },
  { name: '古河市', slug: 'koga', population: 140000 },
  { name: '取手市', slug: 'toride', population: 106000 },
  { name: '筑西市', slug: 'chikusei', population: 101000 },
  { name: 'ひたちなか市', slug: 'hitachinaka', population: 157000 },
  { name: '鹿嶋市', slug: 'kashima', population: 67000 },
  { name: '常総市', slug: 'joso', population: 61000 },
  { name: '笠間市', slug: 'kasama', population: 73000 },
  { name: '牛久市', slug: 'ushiku', population: 85000 },
  { name: '守谷市', slug: 'moriya', population: 69000 },
  { name: '那珂市', slug: 'naka', population: 54000 },
  { name: '坂東市', slug: 'bando', population: 52000 },
  { name: '石岡市', slug: 'ishioka', population: 72000 },
  { name: '結城市', slug: 'yuki', population: 50000 },
  { name: '龍ケ崎市', slug: 'ryugasaki', population: 76000 },
  { name: '下妻市', slug: 'shimotsuma', population: 42000 },
  { name: '常陸太田市', slug: 'hitachiota', population: 48000 },
  { name: '高萩市', slug: 'takahagi', population: 27000 },
  { name: '北茨城市', slug: 'kitaibaraki', population: 41000 },
  { name: '常陸大宮市', slug: 'hitachiomiya', population: 39000 },
  { name: '桜川市', slug: 'sakuragawa', population: 39000 },
  { name: '神栖市', slug: 'kamisu', population: 95000 },
  { name: '行方市', slug: 'namegata', population: 32000 },
  { name: '鉾田市', slug: 'hokota', population: 46000 },
  { name: 'つくばみらい市', slug: 'tsukubamirai', population: 51000 },
  { name: '小美玉市', slug: 'omitama', population: 48000 },
  { name: '稲敷市', slug: 'inashiki', population: 39000 },
  { name: 'かすみがうら市', slug: 'kasumigaura', population: 40000 },
  { name: '潮来市', slug: 'itako', population: 27000 },
  
  // 町（10町）
  { name: '茨城町', slug: 'ibaraki', population: 31000 },
  { name: '大洗町', slug: 'oarai', population: 15000 },
  { name: '城里町', slug: 'shirosato', population: 18000 },
  { name: '東海村', slug: 'tokai', population: 38000 },
  { name: '大子町', slug: 'daigo', population: 15000 },
  { name: '美浦村', slug: 'miho', population: 15000 },
  { name: '阿見町', slug: 'ami', population: 48000 },
  { name: '河内町', slug: 'kawachi', population: 8000 },
  { name: '八千代町', slug: 'yachiyo', population: 20000 },
  { name: '五霞町', slug: 'goka', population: 8000 },
  { name: '境町', slug: 'sakai', population: 24000 },
  { name: '利根町', slug: 'tone', population: 15000 },
];

// 予算レンジ
export const budgetRanges = [
  { 
    slug: 'under-2000',
    label: '2000万円以下',
    min: 0,
    max: 2000,
    description: '初めての住宅購入に最適な価格帯'
  },
  { 
    slug: '2000-3000',
    label: '2000万円〜3000万円',
    min: 2000,
    max: 3000,
    description: 'コストパフォーマンスに優れた価格帯'
  },
  { 
    slug: '3000-4000',
    label: '3000万円〜4000万円',
    min: 3000,
    max: 4000,
    description: '充実した設備と広さを両立できる価格帯'
  },
  { 
    slug: '4000-5000',
    label: '4000万円〜5000万円',
    min: 4000,
    max: 5000,
    description: 'こだわりの注文住宅を実現できる価格帯'
  },
  { 
    slug: 'over-5000',
    label: '5000万円以上',
    min: 5000,
    max: 999999,
    description: '理想の住まいを妥協なく追求できる価格帯'
  },
];

// 地域の特徴データ
export const getAreaFeatures = (municipalitySlug: string) => {
  const features: Record<string, string[]> = {
    mito: ['県庁所在地', '教育環境充実', '商業施設豊富', '歴史的名所多数'],
    tsukuba: ['研究学園都市', 'TX沿線', '教育水準トップクラス', '最先端施設'],
    hitachi: ['工業都市', '海沿いエリア', '大手企業多数', '安定した雇用'],
    tsuchiura: ['霞ヶ浦に面する', '農業も盛ん', '東京通勤圏', '生活利便性高い'],
    koga: ['歴史ある城下町', '埼玉県隣接', '交通アクセス良好', '商業施設充実'],
    toride: ['利根川沿い', '常磐線沿線', '東京通勤圏', '閑静な住宅地'],
    chikusei: ['自然豊か', '農業地帯', '歴史的建造物', '子育て環境良好'],
    hitachinaka: ['海浜公園', '那珂湊漁港', '商業施設充実', '工業都市'],
    kashima: ['鹿島神宮', 'サッカーの街', '工業地帯', '海沿いエリア'],
    moriya: ['TX沿線', '急速発展中', '東京通勤圏', '商業施設充実'],
    ushiku: ['大仏で有名', '東京通勤圏', '住宅都市', '教育環境良好'],
  };
  
  return features[municipalitySlug] || ['自然豊か', '子育て環境良好', '地域コミュニティ活発'];
};

// APIから坪単価を取得する関数（エクスポート用）
export const fetchLandPrice = fetchLandPriceFromService;

// SEO用のコンテンツ生成関数（API対応版）
export const generateAreaContent = async (
  municipality: typeof ibarakiMunicipalities[0], 
  budgetRange: typeof budgetRanges[0]
) => {
  // APIから最新の坪単価を取得
  const pricePerTsubo = await fetchLandPrice('茨城県', municipality.name);
  
  const landSize = 40; // 平均的な土地面積（坪）
  const landCost = pricePerTsubo * landSize / 10000; // 万円単位
  const buildingBudget = (budgetRange.min + budgetRange.max) / 2 - landCost;
  
  return {
    title: `${municipality.name}で${budgetRange.label}の注文住宅を建てる｜相場と住宅会社｜マイホームスターター`,
    description: `茨城県${municipality.name}の注文住宅相場は坪単価${pricePerTsubo.toLocaleString()}万円。${budgetRange.label}の予算で建てられる住宅会社を3-5社厳選してご提案。土地込みの総予算シミュレーションも無料。`,
    h1: `${municipality.name}で${budgetRange.label}の注文住宅を建てる`,
    leadText: `${municipality.name}で${budgetRange.label}の予算で注文住宅を検討されている方へ。土地相場や建築費用、おすすめの住宅会社まで、必要な情報をすべてまとめました。`,
    pricePerTsubo, // 坪単価データも含める
    sections: {
      landPrice: {
        title: `${municipality.name}の土地相場`,
        content: `${municipality.name}の土地相場は坪単価約${pricePerTsubo.toLocaleString()}万円です。40坪の土地なら約${Math.round(landCost).toLocaleString()}万円が目安となります。`,
      },
      buildingCost: {
        title: `${budgetRange.label}で建てられる住宅`,
        content: `総予算${budgetRange.label}で、土地代を除いた建物予算は約${Math.round(buildingBudget).toLocaleString()}万円。この予算なら、${getBuildingFeatures(buildingBudget)}が実現可能です。`,
      },
      recommendedCompanies: {
        title: `${municipality.name}でおすすめの住宅会社`,
        content: `${municipality.name}で${budgetRange.label}の予算に対応できる住宅会社を厳選しました。各社の特徴や施工事例をご確認いただけます。`,
      },
    },
  };
};

// 建物予算に応じた特徴を返す関数
const getBuildingFeatures = (budget: number): string => {
  if (budget < 1500) {
    return 'シンプルで機能的な住まい';
  } else if (budget < 2000) {
    return '標準的な設備を備えた快適な住まい';
  } else if (budget < 2500) {
    return '充実した設備と理想の間取り';
  } else if (budget < 3000) {
    return 'こだわりの設備と高品質な仕上げ';
  } else {
    return '最高級の設備と完全自由設計';
  }
};