// src/services/integratedAreaService.tsの86行目付近に追加
const apiData = await fetchLandPriceData(prefecture, city);
console.log(`=== APIデータ確認 (${prefecture} ${city}) ===`);
console.log('apiData:', apiData);
console.log('pricePerSquareMeter:', apiData?.pricePerSquareMeter);
console.log('pricePerTsubo:', apiData?.pricePerTsubo);
