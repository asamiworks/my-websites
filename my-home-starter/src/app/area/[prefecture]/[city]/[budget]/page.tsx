// src/app/area/[prefecture]/[city]/[budget]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { budgetRanges } from '../../../../../utils/areaData';
import { fetchLandPrice } from '../../../../../utils/landPriceService';
import { loadAllMunicipalitiesForBuild } from '../../../../../utils/staticPageGenerator';
import styles from "./BudgetPage.module.css";

interface PageProps {
  params: Promise<{
    prefecture: string;
    city: string;
    budget: string;
  }>;
}

// メタデータ生成
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { prefecture, city, budget } = await params;
  
  // ビルド時にCSVから市区町村データを取得
  const municipalities = await loadAllMunicipalitiesForBuild();
  const municipalityData = municipalities.find(
    m => m.prefectureSlug === prefecture && m.citySlug === city
  );
  
  if (!municipalityData) {
    return { title: 'ページが見つかりません' };
  }
  
  const budgetRange = budgetRanges.find(b => b.slug === budget);
  if (!budgetRange) {
    return { title: 'ページが見つかりません' };
  }
  
  const title = `${municipalityData.city}で${budgetRange.label}の注文住宅を建てる｜相場と住宅会社｜マイホームスターター`;
  const description = `${municipalityData.prefecture}${municipalityData.city}の注文住宅相場と${budgetRange.label}の予算で建てられる住宅会社を3-5社厳選してご提案。土地込みの総予算シミュレーションも無料。`;
  
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
      canonical: `https://myhomestarter.com/area/${prefecture}/${city}/${budget}`,
    },
  };
}

// 静的ページ生成のパラメータ
export async function generateStaticParams() {
  const municipalities = await loadAllMunicipalitiesForBuild();
  
  const params = [];
  
  // 各市区町村に対して、各予算レンジのページを生成
  for (const municipality of municipalities) {
    for (const budgetRange of budgetRanges) {
      params.push({
        prefecture: municipality.prefectureSlug,
        city: municipality.citySlug,
        budget: budgetRange.slug,
      });
    }
  }
  
  return params;
}

export default async function BudgetAreaPage({ params }: PageProps) {
  const { prefecture, city, budget } = await params;
  
  // CSVから市区町村データを取得
  const municipalities = await loadAllMunicipalitiesForBuild();
  const municipalityData = municipalities.find(
    m => m.prefectureSlug === prefecture && m.citySlug === city
  );
  
  if (!municipalityData) {
    notFound();
  }
  
  const budgetRange = budgetRanges.find(b => b.slug === budget);
  if (!budgetRange) {
    notFound();
  }
  
  // 坪単価を取得
  const pricePerTsubo = await fetchLandPrice(municipalityData.prefecture, municipalityData.city);
  
  // コンテンツ生成
  const landSize = 40; // 平均的な土地面積（坪）
  const landCost = pricePerTsubo * landSize / 10000; // 万円単位
  const buildingBudget = (budgetRange.min + budgetRange.max) / 2 - landCost;
  
  return (
    <>
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: `${municipalityData.city}で${budgetRange.label}の注文住宅を建てる`,
            description: `${municipalityData.prefecture}${municipalityData.city}の注文住宅相場と${budgetRange.label}の予算で建てられる住宅会社を紹介`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'ホーム',
                  item: 'https://myhomestarter.com'
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'エリアから探す',
                  item: 'https://myhomestarter.com/area'
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: municipalityData.prefecture,
                  item: `https://myhomestarter.com/area/${prefecture}`
                },
                {
                  '@type': 'ListItem',
                  position: 4,
                  name: municipalityData.city,
                  item: `https://myhomestarter.com/area/${prefecture}/${city}`
                },
                {
                  '@type': 'ListItem',
                  position: 5,
                  name: budgetRange.label,
                  item: `https://myhomestarter.com/area/${prefecture}/${city}/${budget}`
                }
              ]
            }
          }),
        }}
      />
      
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {municipalityData.city}で{budgetRange.label}の注文住宅を建てる
          </h1>
          <p className={styles.lead}>
            {municipalityData.prefecture}{municipalityData.city}で{budgetRange.label}の予算で注文住宅を検討されている方へ。
            土地相場や建築費用、おすすめの住宅会社まで、必要な情報をすべてまとめました。
          </p>
        </header>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{municipalityData.city}の土地相場</h2>
          <p className={styles.text}>
            {municipalityData.city}の土地相場は坪単価約{pricePerTsubo.toLocaleString()}万円です。
            40坪の土地なら約{Math.round(landCost).toLocaleString()}万円が目安となります。
          </p>
        </section>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{budgetRange.label}の予算での建築プラン</h2>
          <p className={styles.text}>
            総予算{budgetRange.label}の場合、土地代を除いた建物予算は約{Math.round(buildingBudget).toLocaleString()}万円となります。
            この予算では、以下のような住宅が実現可能です：
          </p>
          <ul className={styles.list}>
            {buildingBudget >= 2500 && <li>高性能な断熱・気密性能</li>}
            {buildingBudget >= 2000 && <li>充実した設備仕様</li>}
            {buildingBudget >= 1500 && <li>こだわりの間取り設計</li>}
            <li>基本的な住宅性能の確保</li>
          </ul>
        </section>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>おすすめの住宅会社</h2>
          <p className={styles.text}>
            {municipalityData.city}で{budgetRange.label}の予算に対応できる住宅会社をご紹介します。
            各社の特徴や施工事例を比較して、あなたに最適な会社を見つけましょう。
          </p>
          <div className={styles.cta}>
            <a href="/matcher" className={styles.ctaButton}>
              無料で住宅会社を探す
            </a>
          </div>
        </section>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{municipalityData.city}の地域情報</h2>
          <p className={styles.text}>
            {municipalityData.city}は{municipalityData.prefecture}に位置し、
            住環境として以下のような特徴があります：
          </p>
          <ul className={styles.list}>
            <li>交通アクセス：主要駅や高速道路へのアクセス情報</li>
            <li>教育環境：学校や教育施設の充実度</li>
            <li>生活利便性：商業施設や医療機関の状況</li>
            <li>自然環境：公園や緑地の整備状況</li>
          </ul>
        </section>
      </div>
    </>
  );
}