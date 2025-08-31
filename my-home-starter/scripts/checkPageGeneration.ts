import { loadAllMunicipalitiesForBuild, getUniquePrefectures } from '../src/utils/staticPageGenerator';
import { budgetRanges } from '../src/utils/areaData';

async function checkPageGeneration() {
  try {
    // 全市区町村データを読み込む
    const municipalities = await loadAllMunicipalitiesForBuild();
    const prefectures = await getUniquePrefectures();
    
    console.log('=== プログラマティックSEO ページ生成統計 ===');
    console.log(`総市区町村数: ${municipalities.length}`);
    console.log(`都道府県数: ${prefectures.length}`);
    console.log(`予算レンジ数: ${budgetRanges.length}`);
    console.log(`\n生成されるページ数:`);
    console.log(`- 市区町村ページ（全予算）: ${municipalities.length}`);
    console.log(`- 予算別ページ: ${municipalities.length * budgetRanges.length}`);
    console.log(`合計: ${municipalities.length * (budgetRanges.length + 1)} ページ`);
    
    // 都道府県別の統計
    console.log('\n都道府県別市区町村数:');
    const municipalitiesByPrefecture: Record<string, number> = {};
    
    municipalities.forEach(m => {
      if (!municipalitiesByPrefecture[m.prefecture]) {
        municipalitiesByPrefecture[m.prefecture] = 0;
      }
      municipalitiesByPrefecture[m.prefecture]++;
    });
    
    Object.entries(municipalitiesByPrefecture)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([pref, count]) => {
        console.log(`${pref}: ${count}市区町村`);
      });
      
    // サンプルとして最初の10件のslugを表示
    console.log('\n生成されるURLパスの例（最初の10件）:');
    municipalities.slice(0, 10).forEach(m => {
      console.log(`/area/${m.prefectureSlug}/${m.citySlug}`);
    });
    
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

checkPageGeneration();
