import { MetadataRoute } from 'next';
import { budgetRanges } from '@/utils/areaData';
import { loadAllMunicipalitiesForBuild, getUniquePrefectures, prefectureToSlug } from '@/utils/staticPageGenerator';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://myhomestarter.com';
  
  // 基本ページ
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/start-home-building`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/area`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];
  
  // 都道府県ページ（CSVから自動生成）
  const prefectures = await getUniquePrefectures();
  const prefecturePages = prefectures.map((prefecture) => ({
    url: `${baseUrl}/area/${prefectureToSlug(prefecture)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  // 市区町村ページ（CSVから自動生成）
  const municipalities = await loadAllMunicipalitiesForBuild();
  
  // ユニークな都道府県・市区町村の組み合わせ
  const uniqueMunicipalities = new Map<string, typeof municipalities[0]>();
  municipalities.forEach(m => {
    const key = `${m.prefectureSlug}-${m.citySlug}`;
    if (!uniqueMunicipalities.has(key)) {
      uniqueMunicipalities.set(key, m);
    }
  });
  
  const areaPages = Array.from(uniqueMunicipalities.values()).flatMap((municipality) => {
    // 各市町村の基本ページ
    const basePage = {
      url: `${baseUrl}/area/${municipality.prefectureSlug}/${municipality.citySlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
    
    // 各予算レンジのページ
    const budgetPages = budgetRanges.map(budget => ({
      url: `${baseUrl}/area/${municipality.prefectureSlug}/${municipality.citySlug}?budget=${budget.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
    
    return [basePage, ...budgetPages];
  });
  
  // 計算ツールページ
  const toolPages = [
    {
      url: `${baseUrl}/tools/loan-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/property-tax-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/expenses-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];
  
  // TODO: 会社詳細ページ（DBから取得）
  // const companyPages = companies.map(company => ({
  //   url: `${baseUrl}/companies/${company.id}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }));
  
  // TODO: 比較ページ（動的生成）
  // const comparePages = generateComparePageUrls().map(url => ({
  //   url: `${baseUrl}${url}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.6,
  // }));
  
  console.log(`Sitemap generated: ${prefecturePages.length} prefectures, ${areaPages.length} area pages`);
  
  return [...staticPages, ...prefecturePages, ...areaPages, ...toolPages];
}