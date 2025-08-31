// src/app/area/[prefecture]/[city]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Organization, BreadcrumbList, Service } from '../../../../components/seo/StructuredData';
import { budgetRanges } from '../../../../utils/areaData';
import { fetchLandPriceData, fetchLandPriceHistory } from '../../../../utils/landPriceService';
import { loadAllMunicipalitiesForBuild } from '../../../../utils/staticPageGenerator';
import { getLandSize } from '../../../../utils/landSizeConfig';
import LandPriceChart from '../../../../components/LandPriceChart';
import CompanyFilter from '../../../../components/CompanyFilter';
import styles from './AreaPage.module.css';

interface PageProps {
  params: Promise<{
    prefecture: string;
    city: string;
  }>;
  searchParams: Promise<{
    budget?: string;
  }>;
}

// CompanyPriceRange型を追加
interface CompanyPriceRange {
  minPrice?: number;
  maxPrice?: number;
  note?: string;
}

// APIレスポンスに合わせた型定義
interface CompanyData {
  id: string;
  name: string;
  nameKana: string | null;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  isVerified: boolean;
  isPremium: boolean;
  distance: number;
  nearestLocation: {
    type: string;
    prefecture: string;
    city: string;
    address?: string;
  };
  serviceAreaInfo: {
    coverage: string;
    remarks: string;
  };
  basicInfo: {
    establishedYear?: number;
    capital?: number;
    employees?: number;
    phoneNumber?: string;
  };
  companyPriceRange?: CompanyPriceRange;
}

interface PRCompany {
  id: string;
  companyName: string;
  description: string;
  imageUrl?: string;
  contactInfo?: string;
  displayOrder: number;
}

interface CompaniesResponse {
  companies: CompanyData[];
  total: number;
  location: {
    prefecture: string;
    city: string;
    coordinates: { lat: number; lng: number } | null;
  };
}

// メタデータ生成
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { prefecture, city } = await params;
  const { budget: budgetSlug = 'all' } = await searchParams;
  
  const municipalities = await loadAllMunicipalitiesForBuild();
  const municipalityData = municipalities.find(
    m => m.prefectureSlug === prefecture && m.citySlug === city
  );
  
  if (!municipalityData) {
    return { title: 'ページが見つかりません' };
  }
  
  const title = `${municipalityData.city}で注文住宅を建てる｜相場と住宅会社｜マイホームスターター`;
  const description = `${municipalityData.prefecture}${municipalityData.city}の注文住宅相場と、施工可能な住宅会社を厳選してご提案。土地込みの総予算シミュレーションも無料。`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'ja_JP',
      siteName: 'マイホームスターター',
    },
    alternates: {
      canonical: `/area/${prefecture}/${city}${budgetSlug !== 'all' ? `?budget=${budgetSlug}` : ''}`,
    },
  };
}

// 静的ページ生成のためのパラメータ
export async function generateStaticParams() {
  const municipalities = await loadAllMunicipalitiesForBuild();
  
  const uniqueParams = new Map<string, { prefecture: string; city: string }>();
  
  municipalities.forEach(({ prefectureSlug, citySlug }) => {
    const key = `${prefectureSlug}-${citySlug}`;
    if (!uniqueParams.has(key)) {
      uniqueParams.set(key, {
        prefecture: prefectureSlug,
        city: citySlug,
      });
    }
  });
  
  return Array.from(uniqueParams.values());
}

// 住宅会社データを取得する関数
async function fetchAreaCompanies(prefecture: string, city: string): Promise<CompaniesResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const encodedPrefecture = encodeURIComponent(prefecture);
    const encodedCity = encodeURIComponent(city);
    const url = `${baseUrl}/area/${encodedPrefecture}/${encodedCity}/companies`;
    
    const response = await fetch(url, { 
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch companies:', response.status, response.statusText);
      return { companies: [], total: 0, location: { prefecture, city, coordinates: null } };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return { companies: [], total: 0, location: { prefecture, city, coordinates: null } };
  }
}

export default async function AreaPage({ params, searchParams }: PageProps) {
  const { prefecture, city } = await params;
  const { budget: budgetSlug = 'all' } = await searchParams;
  
  // CSVから市区町村データを取得
  const municipalities = await loadAllMunicipalitiesForBuild();
  const municipalityData = municipalities.find(
    m => m.prefectureSlug === prefecture && m.citySlug === city
  );
  
  if (!municipalityData) {
    notFound();
  }
  
  const budgetRange = budgetRanges.find(b => b.slug === budgetSlug) || 
    { slug: 'all', label: '全予算帯', min: 0, max: 999999, description: '' };
  
  // 地価データを取得
  const landPriceData = await fetchLandPriceData(municipalityData.prefecture, municipalityData.city);
  const pricePerTsubo = landPriceData 
    ? landPriceData.pricePerTsubo // 既に万円単位なので10000で割らない
    : 15; // デフォルト値
  
  // 住宅会社データを取得
  const companiesData = await fetchAreaCompanies(municipalityData.prefecture, municipalityData.city);
  const companies = companiesData.companies;
  
  // PR会社（後で実装）
  const prCompanies: PRCompany[] = [];
  
  // 地域に応じた土地面積を取得
  const landSize = getLandSize(municipalityData.prefecture, municipalityData.city);
  
  // 土地費用の計算
  const landCost = pricePerTsubo * landSize;
  //const buildingBudget = (budgetRange.min + budgetRange.max) / 2 - landCost;
  
  // 地価履歴データを取得（実データのみ）
  const priceHistory = await fetchLandPriceHistory(
    municipalityData.prefecture, 
    municipalityData.city
  );
  
  const content = {
    h1: `${municipalityData.city}で注文住宅を建てる`,
    leadText: `${municipalityData.city}で注文住宅を検討されている方へ。土地相場や建築費用、おすすめの住宅会社まで、必要な情報をすべてまとめました。`,
    pricePerTsubo,
    landSize,
    sections: {
      landPrice: {
        title: `${municipalityData.city}の土地相場`,
        content: `${municipalityData.city}の平均的な土地価格は坪単価${pricePerTsubo.toLocaleString()}万円です。${landSize}坪の土地なら約${Math.round(landCost).toLocaleString()}万円が必要となります。`,
      },
      buildingCost: {
        title: '建築費用の目安',
        content: `土地代と建物代を合わせた総予算を考慮して、理想の住まいづくりを計画しましょう。${municipalityData.city}で施工可能な住宅会社の中から、予算やこだわりに合った会社を見つけることが大切です。`,
      },
      recommendedCompanies: {
        title: `${municipalityData.city}で建築可能な住宅会社`,
        content: companies.length > 0 
          ? `${municipalityData.city}で施工可能な住宅会社を${companies.length}社ご紹介します。各社の特徴を比較して、理想の家づくりパートナーを見つけてください。`
          : `現在、${municipalityData.city}で施工可能な住宅会社の情報を準備中です。`,
      },
    },
  };

  // パンくずリスト用データ
  const breadcrumbItems = [
    { name: 'ホーム', url: '/' },
    { name: 'エリアから探す', url: '/area' },
    { name: municipalityData.prefecture, url: `/area/${prefecture}` },
    { name: municipalityData.city, url: `/area/${prefecture}/${city}` },
  ];

  if (budgetSlug !== 'all') {
    breadcrumbItems.push({
      name: budgetRange.label,
      url: `/area/${prefecture}/${city}?budget=${budgetSlug}`,
    });
  }

  return (
    <>
      {/* 構造化データ */}
      <Organization 
        name="マイホームスターター"
        url="https://myhomestarter.com"
        description="注文住宅を建てる方のための総合情報サイト"
      />
      <BreadcrumbList items={breadcrumbItems} />
      <Service
        name={`${municipalityData.city}の注文住宅相談サービス`}
        description={`${municipalityData.city}で注文住宅を建てる方向けの相談サービス。土地探しから住宅会社選びまでトータルサポート。`}
        provider={{
          name: "マイホームスターター",
          url: "https://myhomestarter.com"
        }}
        serviceType="住宅建築コンサルティング"
      />

      <main className={styles.container}>
        {/* ヘッダー */}
        <div className={styles.header}>
          <h1 className={styles.h1}>{content.h1}</h1>
          <p className={styles.leadText}>{content.leadText}</p>
          
          {/* 都道府県へ戻るリンク */}
          <div className={styles.backToPrefecture}>
            <a href={`/area/${prefecture}`} className={styles.backLink}>
              ← {municipalityData.prefecture}の他の市区町村を見る
            </a>
          </div>
        </div>

        {/* 土地相場セクション */}
        <section className={styles.section}>
          <h2>{content.sections.landPrice.title}</h2>
          <p>{content.sections.landPrice.content}</p>
          
          {/* 地価情報カード */}
          {landPriceData && (
            <div className={styles.priceInfoGrid}>
              <div className={styles.priceCard}>
                <h3>平均坪単価</h3>
                <p className={styles.priceValue}>
                  {pricePerTsubo.toLocaleString()}万円
                </p>
                <p className={styles.priceNote}>
                  ({landPriceData.year}年{landPriceData.source === 'api' ? '国土交通省データ' : '推定値'})
                </p>
              </div>
              <div className={styles.priceCard}>
                <h3>標準的な土地費用</h3>
                <p className={styles.priceValue}>
                  {Math.round(landCost).toLocaleString()}万円
                </p>
                <p className={styles.priceNote}>
                  ({landSize}坪の場合)
                </p>
              </div>
            </div>
          )}
          
          {/* 地価推移グラフ（実データがある場合のみ表示） */}
          {priceHistory && priceHistory.length > 0 && (
            <div className={styles.chartContainer}>
              <h3>地価推移（過去5年間）</h3>
              <LandPriceChart 
                data={priceHistory}
                additionalInfo={['※ 国土交通省の地価公示データに基づいています']}
              />
            </div>
          )}
        </section>

        {/* 建築費用セクション */}
        <section className={styles.section}>
          <h2>{content.sections.buildingCost.title}</h2>
          <p>{content.sections.buildingCost.content}</p>
        </section>
        
        {/* PR枠（あれば表示） */}
        {prCompanies.length > 0 && (
          <section className={styles.prSection}>
            <h2 className={styles.prTitle}>
              <span className={styles.prBadge}>PR</span>
              注目の住宅会社
            </h2>
            <div className={styles.prCompanyList}>
              {prCompanies.map((pr: PRCompany) => (
                <div key={pr.id} className={styles.prCompanyCard}>
                  {pr.imageUrl && (
                    <img 
                      src={pr.imageUrl} 
                      alt={pr.companyName}
                      className={styles.prCompanyImage}
                    />
                  )}
                  <div className={styles.prCompanyContent}>
                    <h3>{pr.companyName}</h3>
                    <p className={styles.prDescription}>{pr.description}</p>
                    {pr.contactInfo && (
                      <p className={styles.prContact}>
                        お問い合わせ: {pr.contactInfo}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* フィルター */}
        <CompanyFilter 
          totalCount={companies.length}
          premiumCount={companies.filter(c => c.isPremium).length}
        />
        
        {/* おすすめ住宅会社 */}
        <section className={styles.section}>
          <h2>{content.sections.recommendedCompanies.title}</h2>
          <p>{content.sections.recommendedCompanies.content}</p>
          
          {companies.length > 0 ? (
            <div className={styles.companyList} id="company-list">
              {companies.map((company: CompanyData) => (
                <div 
                  key={company.id} 
                  className={`${styles.companyCard} ${company.isPremium ? styles.premiumCard : ''}`}
                  data-premium={company.isPremium}
                  data-distance={company.distance}
                  data-min-price={company.companyPriceRange?.minPrice || 999}
                  data-max-price={company.companyPriceRange?.maxPrice || 0}
                >
                  {company.isPremium && (
                    <span className={styles.premiumBadge}>有料会員</span>
                  )}
                  
                  <h3>{company.name}</h3>
                  
                  {/* 距離情報 */}
                  {company.distance < 9999 && (
                    <p className={styles.distance}>
                      {company.nearestLocation.type}から約{company.distance}km
                    </p>
                  )}
                  
                  {/* 会社の所在地 */}
                  {company.nearestLocation.address && (
                    <p className={styles.address}>
                      所在地: {company.nearestLocation.address}
                    </p>
                  )}
                  
                  {/* 坪単価（有料会員のみ） */}
                  {company.isPremium && company.companyPriceRange ? (
                    <p className={styles.priceRange}>
                      坪単価: {company.companyPriceRange.minPrice}
                      {company.companyPriceRange.maxPrice ? `〜${company.companyPriceRange.maxPrice}` : '〜'}万円
                    </p>
                  ) : (
                    <p className={styles.priceRange}>坪単価: 要問合せ</p>
                  )}
                  
                  {/* 電話番号 */}
                  {company.basicInfo.phoneNumber && (
                    <p className={styles.tel}>
                      TEL: {company.basicInfo.phoneNumber}
                    </p>
                  )}
                  
                  {/* Webサイト */}
                  {company.website && (
                    <a 
                      href={(() => {
                        let url = company.website;
                        url = url.replace(/\/zeh\/?.*$/i, '');
                        if (!url.endsWith('/')) url += '/';
                        return url;
                      })()}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.websiteLink}
                    >
                      公式サイト
                    </a>
                  )}
                  
                  {/* 施工エリア情報 */}
                  <p className={styles.serviceAreaInfo}>
                    {company.serviceAreaInfo.remarks}
                  </p>
                  
                  {/* お問い合わせボタン（有料会員のみ） */}
                  {company.isPremium && (
                    <button className={styles.contactButton}>
                      お問い合わせ
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noCompanies}>
              現在、該当する住宅会社の情報がありません。
            </p>
          )}
        </section>
        
        {/* 都道府県へ戻るリンク（ページ下部） */}
        <div className={styles.bottomNavigation}>
          <a href={`/area/${prefecture}`} className={styles.bottomBackLink}>
           ← {municipalityData.prefecture}の他の市区町村を探す
          </a>
        </div>
      </main>
    </>
  );
}