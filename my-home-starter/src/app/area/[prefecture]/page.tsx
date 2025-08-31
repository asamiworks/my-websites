import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Organization, BreadcrumbList } from '@/components/seo/StructuredData';
import { 
  loadAllMunicipalitiesForBuild, 
  getMunicipalitiesByPrefecture,
  getPrefectureFromSlug,
  MunicipalityForBuild 
} from '@/utils/staticPageGenerator';
import styles from './PrefecturePage.module.css';

interface PageProps {
  params: {
    prefecture: string;
  };
}

// 地域グループ定義
interface RegionGroup {
  name: string;
  keywords: string[];
}

// 茨城県の地域グループ
const IBARAKI_REGIONS: RegionGroup[] = [
  { name: '県央地域', keywords: ['水戸', 'ひたちなか', '那珂', '笠間', '小美玉', '茨城町', '大洗', '城里', '東海'] },
  { name: '県北地域', keywords: ['日立', '常陸太田', '常陸大宮', '高萩', '北茨城', '大子'] },
  { name: '県南地域', keywords: ['つくば', '土浦', '牛久', '龍ケ崎', '取手', '守谷', '稲敷', 'かすみがうら', 'つくばみらい', '阿見', '河内', '利根', '美浦'] },
  { name: '県西地域', keywords: ['古河', '筑西', '結城', '下妻', '常総', '坂東', '桜川', '八千代', '五霞', '境'] },
  { name: '鹿行地域', keywords: ['鹿嶋', '潮来', '神栖', '行方', '鉾田'] },
];

// 市区町村を地域ごとにグループ化
function groupCitiesByRegion(cities: MunicipalityForBuild[], prefectureName: string): Record<string, MunicipalityForBuild[]> {
  if (prefectureName === '茨城県') {
    const grouped: Record<string, MunicipalityForBuild[]> = {};
    
    IBARAKI_REGIONS.forEach(region => {
      grouped[region.name] = cities.filter(city => 
        region.keywords.some(keyword => city.city.includes(keyword))
      );
    });
    
    // 未分類の市区町村を「その他」に
    const classifiedCities = new Set(Object.values(grouped).flat().map(c => c.city));
    const unclassified = cities.filter(city => !classifiedCities.has(city.city));
    if (unclassified.length > 0) {
      grouped['その他'] = unclassified;
    }
    
    return grouped;
  }
  
  // 他の都道府県は簡易的にグループ化（市区町村数に応じて調整）
  const citiesPerGroup = Math.ceil(cities.length / 4);
  const grouped: Record<string, MunicipalityForBuild[]> = {};
  
  if (cities.length <= 10) {
    grouped['全域'] = cities;
  } else {
    grouped['北部エリア'] = cities.slice(0, citiesPerGroup);
    grouped['中部エリア'] = cities.slice(citiesPerGroup, citiesPerGroup * 2);
    grouped['南部エリア'] = cities.slice(citiesPerGroup * 2, citiesPerGroup * 3);
    const remaining = cities.slice(citiesPerGroup * 3);
    if (remaining.length > 0) {
      grouped['その他エリア'] = remaining;
    }
  }
  
  return grouped;
}

// 都道府県の説明文を取得
function getPrefectureDescription(prefectureName: string): string {
  const descriptions: Record<string, string> = {
    '茨城県': '茨城県は首都圏へのアクセスも良く、自然豊かな環境で注文住宅を建てるのに適した地域です。土地価格も比較的手頃で、広い敷地を確保しやすいのが特徴です。',
    '東京都': '東京都は日本の首都として、最先端の都市機能と伝統が共存する地域です。利便性の高さと多様な住環境が魅力です。',
    '神奈川県': '神奈川県は都心へのアクセスと自然環境のバランスが取れた地域です。横浜・湘南エリアは特に人気が高く、多様なライフスタイルに対応できます。',
    '千葉県': '千葉県は東京へのアクセスの良さと、海・山の自然を楽しめる環境が魅力です。幅広い価格帯の住宅地があります。',
    '埼玉県': '埼玉県は都心への通勤圏内でありながら、落ち着いた住環境を提供します。教育環境も充実しており、子育て世代に人気のエリアです。',
  };
  
  return descriptions[prefectureName] || `${prefectureName}で理想の注文住宅を建てましょう。各市区町村の詳細情報をご覧いただけます。`;
}

// 都道府県スラッグのリストを取得
async function getAllPrefectureSlugs(): Promise<string[]> {
  const municipalities = await loadAllMunicipalitiesForBuild();
  const uniqueSlugs = new Set(municipalities.map(m => m.prefectureSlug));
  return Array.from(uniqueSlugs);
}

// メタデータ生成
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const prefectureName = getPrefectureFromSlug(params.prefecture);
  
  if (!prefectureName) {
    return { title: 'ページが見つかりません' };
  }
  
  return {
    title: `${prefectureName}の注文住宅｜市区町村から探す｜マイホームスターター`,
    description: `${prefectureName}で注文住宅を建てるなら。市区町村別の詳細情報と、あなたの予算に合った住宅会社をご紹介します。`,
    openGraph: {
      title: `${prefectureName}の注文住宅｜マイホームスターター`,
      description: `${prefectureName}で理想の注文住宅を。市区町村別の情報をご覧いただけます。`,
      type: 'website',
      locale: 'ja_JP',
      siteName: 'マイホームスターター',
    },
    alternates: {
      canonical: `/area/${params.prefecture}`,
    },
  };
}

// 静的パラメータ生成
export async function generateStaticParams() {
  const prefectureSlugs = await getAllPrefectureSlugs();
  return prefectureSlugs.map(slug => ({
    prefecture: slug,
  }));
}

// メインページコンポーネント
export default async function PrefecturePage({ params }: PageProps) {
  const prefectureName = getPrefectureFromSlug(params.prefecture);
  
  if (!prefectureName) {
    notFound();
  }
  
  // 市区町村データ取得
  const cities = await getMunicipalitiesByPrefecture(prefectureName);
  
  if (cities.length === 0) {
    notFound();
  }
  
  // エリアごとにグループ分け
  const groupedCities = groupCitiesByRegion(cities, prefectureName);
  
  // 説明文を取得
  const description = getPrefectureDescription(prefectureName);
  
  // パンくずリスト用データ
  const breadcrumbItems = [
    { name: 'ホーム', url: '/' },
    { name: 'エリアから探す', url: '/area' },
    { name: prefectureName, url: `/area/${params.prefecture}` },
  ];
  
  return (
    <>
      {/* 構造化データ */}
      <Organization
        name="マイホームスターター"
        url="https://myhomestarter.com"
        description="注文住宅の総予算シミュレーションと最適な住宅会社マッチング"
      />
      <BreadcrumbList items={breadcrumbItems} />
      
      <div className={styles.container}>
        {/* パンくずリスト */}
        <nav className={styles.breadcrumb}>
          <Link href="/">ホーム</Link>
          <span>&gt;</span>
          <Link href="/area">エリアから探す</Link>
          <span>&gt;</span>
          <span>{prefectureName}</span>
        </nav>
        
        {/* ヘッダー */}
        <header className={styles.header}>
          <h1>{prefectureName}の注文住宅</h1>
          <p className={styles.description}>{description}</p>
        </header>
        
        {/* 市区町村一覧 */}
        <section className={styles.citiesSection}>
          <h2>
            <span className={styles.icon}>🏘️</span>
            市区町村から探す
          </h2>
          
          <p className={styles.cityCount}>
            {prefectureName}には{cities.length}の市区町村があります
          </p>
          
          {Object.entries(groupedCities).map(([region, regionCities]) => (
            regionCities.length > 0 && (
              <div key={region} className={styles.regionGroup}>
                <h3>{region} <span className={styles.regionCount}>({regionCities.length})</span></h3>
                <div className={styles.citiesGrid}>
                  {regionCities.map((city) => (
                    <Link
                      key={`${city.prefectureSlug}-${city.citySlug}`}
                      href={`/area/${params.prefecture}/${city.citySlug}`}
                      className={styles.cityCard}
                    >
                      <span className={styles.cityName}>{city.city}</span>
                      <span className={styles.arrow}>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          ))}
        </section>
        
        {/* CTAセクション */}
        <section className={styles.cta}>
          <h2>
            <span className={styles.icon}>🎯</span>
            {prefectureName}で理想の住宅会社を見つける
          </h2>
          <p>
            総予算シミュレータで、土地代・建物代・諸費用をまとめて計算。
            <br />
            あなたの予算に合った住宅会社を3-5社厳選してご提案します。
          </p>
          <Link href="/start-home-building" className={styles.ctaButton}>
            無料で総予算シミュレーション
          </Link>
        </section>
        
        {/* SEO用コンテンツ */}
        <section className={styles.seoContent}>
          <h2>{prefectureName}で注文住宅を建てる際のポイント</h2>
          <div className={styles.seoGrid}>
            <div className={styles.seoCard}>
              <h3>市区町村別の特徴を知る</h3>
              <p>
                {prefectureName}内でも市区町村によって土地価格や住環境は大きく異なります。
                各エリアの特徴を理解して、ライフスタイルに合った場所を選びましょう。
              </p>
            </div>
            <div className={styles.seoCard}>
              <h3>地元の住宅会社を探す</h3>
              <p>
                地域に根ざした工務店は、その土地の気候や風土を熟知しています。
                地元の実績豊富な住宅会社を選ぶことで、快適な住まいづくりが可能です。
              </p>
            </div>
            <div className={styles.seoCard}>
              <h3>総予算で計画を立てる</h3>
              <p>
                土地代、建物代、諸費用すべてを含めた総予算で計画を立てることが重要です。
                無料シミュレーターで、実際に住めるまでの総費用を確認しましょう。
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}