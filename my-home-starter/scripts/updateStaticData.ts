// scripts/updateStaticData.ts
import { fetchLatestLandPriceData } from './dataSources/landPrice';
import { fetchLatestPopulationData } from './dataSources/estat';

async function updateStaticData() {
  // 定期的に最新データを取得してJSONファイルを更新
  const landPriceData = await fetchLatestLandPriceData();
  const populationData = await fetchLatestPopulationData();
  
  // データをファイルに保存
  await fs.writeFile('./src/data/landPrice.json', JSON.stringify(landPriceData));
  await fs.writeFile('./src/data/population.json', JSON.stringify(populationData));
}