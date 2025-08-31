// scripts/cleanZehUrls.ts
// ZEHページのURLをトップページURLに変換

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * URLからZEH関連のパスを削除してトップページURLに変換
 */
function cleanZehUrl(url: string): string {
  if (!url) return url;
  
  try {
    const urlObj = new URL(url);
    
    // ZEH関連のパターン
    const zehPatterns = [
      /zeh/i,
      /zero-energy-house/i,
      /ゼロエネルギー/i,
      /ZEH/,
      /zeb/i  // ZEBも含める
    ];
    
    // パス、クエリ、ハッシュのいずれかにZEH関連が含まれているかチェック
    const hasZehContent = zehPatterns.some(pattern => 
      pattern.test(urlObj.pathname) || 
      pattern.test(urlObj.search) || 
      pattern.test(urlObj.hash) ||  // アンカーもチェック
      pattern.test(decodeURIComponent(urlObj.pathname)) ||
      pattern.test(decodeURIComponent(urlObj.hash))
    );
    
    if (hasZehContent) {
      // プロトコル + ホスト名 + / でトップページURLを構築
      return `${urlObj.protocol}//${urlObj.host}/`;
    }
    
    // ZEH関連でない場合は元のURLを返す
    return url;
  } catch (error) {
    // URLパースエラーの場合は元のURLを返す
    console.error(`Invalid URL: ${url}`, error);
    return url;
  }
}

async function updateZehUrls() {
  console.log('=== ZEH URLのクリーンアップ開始 ===\n');
  
  try {
    // ZEHを含むURLを持つ会社を取得
    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { website: { contains: 'zeh' } },
          { website: { contains: 'ZEH' } },
          { website: { contains: 'zero-energy-house' } }
        ]
      },
      select: {
        id: true,
        name: true,
        website: true
      }
    });
    
    console.log(`対象会社数: ${companies.length}社\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const company of companies) {
      if (!company.website) continue;
      
      const cleanedUrl = cleanZehUrl(company.website);
      
      if (cleanedUrl !== company.website) {
        console.log(`更新: ${company.name}`);
        console.log(`  変更前: ${company.website}`);
        console.log(`  変更後: ${cleanedUrl}`);
        
        // データベースを更新
        await prisma.company.update({
          where: { id: company.id },
          data: { website: cleanedUrl }
        });
        
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
    
    console.log('\n=== 完了 ===');
    console.log(`更新: ${updatedCount}件`);
    console.log(`スキップ: ${skippedCount}件`);
    
    // 更新後の確認
    if (updatedCount > 0) {
      console.log('\n=== 更新後の確認 ===');
      const updatedCompanies = await prisma.company.findMany({
        where: {
          OR: [
            { website: { contains: 'zeh' } },
            { website: { contains: 'ZEH' } }
          ]
        },
        select: {
          name: true,
          website: true
        },
        take: 10
      });
      
      if (updatedCompanies.length > 0) {
        console.log('\nまだZEHを含むURL:');
        updatedCompanies.forEach(c => {
          console.log(`${c.name}: ${c.website}`);
        });
      } else {
        console.log('\nすべてのZEH URLがクリーンアップされました！');
      }
    }
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// ドライラン（実際には更新しない）
async function dryRun() {
  console.log('=== ドライラン（変更内容の確認のみ）===\n');
  
  const companies = await prisma.company.findMany({
    where: {
      OR: [
        { website: { contains: 'zeh' } },
        { website: { contains: 'ZEH' } },
        { website: { contains: 'zero-energy-house' } }
      ]
    },
    select: {
      name: true,
      website: true
    }
  });
  
  console.log(`対象会社数: ${companies.length}社\n`);
  
  let changeCount = 0;
  const examples: { name: string; before: string; after: string }[] = [];
  
  for (const company of companies) {
    if (!company.website) continue;
    
    const cleanedUrl = cleanZehUrl(company.website);
    
    if (cleanedUrl !== company.website) {
      changeCount++;
      
      // 最初の10件を例として表示
      if (examples.length < 10) {
        examples.push({
          name: company.name,
          before: company.website,
          after: cleanedUrl
        });
      }
    }
  }
  
  // 変更例を表示
  console.log('=== 変更例（最大10件）===\n');
  examples.forEach(example => {
    console.log(`${example.name}:`);
    console.log(`  現在: ${example.before}`);
    console.log(`  変更後: ${example.after}`);
    console.log('');
  });
  
  console.log(`変更対象: ${changeCount}件`);
  
  // 変更後のドメイン一覧を表示
  console.log('\n=== 変更後のドメイン一覧 ===');
  const domains = new Set<string>();
  companies.forEach(company => {
    if (company.website) {
      const cleanedUrl = cleanZehUrl(company.website);
      if (cleanedUrl !== company.website) {
        try {
          const url = new URL(cleanedUrl);
          domains.add(url.host);
        } catch (e) {
          // ignore
        }
      }
    }
  });
  
  console.log(`変更される会社のドメイン数: ${domains.size}`);
  
  await prisma.$disconnect();
}

// コマンドライン引数をチェック
const args = process.argv.slice(2);

if (args[0] === '--dry-run') {
  // ドライラン
  dryRun()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('エラー:', error);
      process.exit(1);
    });
} else if (args[0] === '--execute') {
  // 実行
  updateZehUrls()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('エラー:', error);
      process.exit(1);
    });
} else {
  // 使い方を表示
  console.log('使い方:');
  console.log('  npx tsx scripts/cleanZehUrls.ts --dry-run   # 変更内容を確認（実行しない）');
  console.log('  npx tsx scripts/cleanZehUrls.ts --execute   # 実際に更新を実行');
  process.exit(0);
}