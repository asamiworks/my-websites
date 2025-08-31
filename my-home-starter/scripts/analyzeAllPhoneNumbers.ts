import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const dataDir = 'data/zeh';
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.csv'));

let totalPhoneNumbers = 0;
let freeDialCount = 0;
let fixedCount = 0;
let mobileCount = 0;
const phoneTypes: Record<string, number> = {};
const prefectureStats: Record<string, any> = {};

// 各都道府県のCSVを処理
for (const file of files) {
  const csvPath = path.join(dataDir, file);
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });
  
  const phoneNumbers = records.map((r: any) => r['電話番号']).filter((p: string) => p);
  const prefName = file.replace(/^\d+_/, '').replace('.csv', '');
  
  prefectureStats[prefName] = {
    total: phoneNumbers.length,
    freeDial: 0,
    fixed: 0,
    mobile: 0
  };
  
  phoneNumbers.forEach((phone: string) => {
    totalPhoneNumbers++;
    const prefix = phone.substring(0, 4);
    phoneTypes[prefix] = (phoneTypes[prefix] || 0) + 1;
    
    if (phone.startsWith('0120')) {
      freeDialCount++;
      prefectureStats[prefName].freeDial++;
    } else if (/^0[1-9][0-9]/.test(phone) && !phone.startsWith('090') && !phone.startsWith('080') && !phone.startsWith('070')) {
      fixedCount++;
      prefectureStats[prefName].fixed++;
    } else if (/^0[789]0/.test(phone)) {
      mobileCount++;
      prefectureStats[prefName].mobile++;
    }
  });
}

console.log('📊 全国のZEH電話番号統計');
console.log('='.repeat(50));
console.log(`総数: ${totalPhoneNumbers.toLocaleString()}件`);
console.log(`\n0120（フリーダイヤル）: ${freeDialCount.toLocaleString()}件 (${(freeDialCount/totalPhoneNumbers*100).toFixed(1)}%)`);
console.log(`固定電話: ${fixedCount.toLocaleString()}件 (${(fixedCount/totalPhoneNumbers*100).toFixed(1)}%)`);
console.log(`携帯電話: ${mobileCount.toLocaleString()}件 (${(mobileCount/totalPhoneNumbers*100).toFixed(1)}%)`);
console.log(`その他: ${(totalPhoneNumbers - freeDialCount - fixedCount - mobileCount).toLocaleString()}件`);

console.log('\n📱 電話番号の種類（上位20）:');
Object.entries(phoneTypes)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 20)
  .forEach(([prefix, count]) => {
    const percentage = (count/totalPhoneNumbers*100).toFixed(1);
    console.log(`  ${prefix}: ${count.toLocaleString()}件 (${percentage}%)`);
  });

console.log('\n🗾 固定電話が多い都道府県（上位10）:');
Object.entries(prefectureStats)
  .filter(([, stats]) => stats.total > 0)
  .sort(([,a], [,b]) => (b.fixed/b.total) - (a.fixed/a.total))
  .slice(0, 10)
  .forEach(([pref, stats]) => {
    const percentage = (stats.fixed/stats.total*100).toFixed(1);
    console.log(`  ${pref}: ${stats.fixed}/${stats.total}件 (${percentage}%)`);
  });
