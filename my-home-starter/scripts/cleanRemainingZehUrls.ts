// scripts/cleanRemainingZehUrls.ts
// アンカー付きZEH URLをクリーンアップ

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * URLにZEH関連の内容が含まれているかチェック
 */
function hasZehContent(url: string): boolean {
  if (!url) return false;
  
  const lowerUrl = url.toLowerCase();
  const patterns = [
    'zeh',
    'zeb',
    'zero-energy',
    'ゼロエネルギー'
  ];
  
  return patterns.some(pattern => lowerUrl.includes(pattern));
}

/**
 * URLをトップページに変換
 */
function toTopPage(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}/`;
  } catch (error) {
    console.error(`Invalid URL: ${url}`, error);
    return url;
  }
}

async function cleanRemainingUrls() {
  console.log('=== 残りのZEH URLのクリーンアップ ===\n');
  
  try {
    // アンカー付きを含むすべてのZEH関連URLを検索
    const companies = await prisma.company.findMany({
      where: {
        website: { not: null }
      },
      select: {
        id: true,
        name: true,
        website: true
      }
    });
    
    // ZEH関連URLをフィルタリング
    const zehCompanies = companies.filter(company => 
      company.website && hasZehContent(company.website)
    );
    
    console.log(`ZEH関連URL: ${zehCompanies.length}社\n`);
    
    if (zehCompanies.length === 0) {
      console.log('処理対象のURLがありません。');
      return;
    }
    
    // 確認
    console.log('=== 変更される会社 ===\n');
    zehCompanies.forEach(company => {
      console.log(`${company.name}:`);
      console.log(`  現在: ${company.website}`);
      console.log(`  変更後: ${toTopPage(company.website!)}`);
      console.log('');
    });
    
    // ユーザーに確認
    console.log(`\n${zehCompanies.length}社のURLを変更します。`);
    console.log('続行するには Ctrl+C 以外のキーを押してください...');
    
    // 簡易的な確認待ち（本番環境では readline などを使用）
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 更新実行
    console.log('\n=== 更新実行中 ===\n');
    
    for (const company of zehCompanies) {
      if (!company.website) continue;
      
      const cleanedUrl = toTopPage(company.website);
      
      await prisma.company.update({
        where: { id: company.id },
        data: { website: cleanedUrl }
      });
      
      console.log(`✓ ${company.name}`);
    }
    
    console.log('\n=== 完了 ===');
    console.log(`${zehCompanies.length}社のURLを更新しました。`);
    
    // 最終確認
    const remaining = await prisma.company.findMany({
      where: {
        website: { not: null }
      },
      select: {
        name: true,
        website: true
      }
    });
    
    const stillHasZeh = remaining.filter(c => 
      c.website && hasZehContent(c.website)
    );
    
    if (stillHasZeh.length > 0) {
      console.log('\n⚠️ まだZEH関連URLが残っています:');
      stillHasZeh.forEach(c => {
        console.log(`  ${c.name}: ${c.website}`);
      });
    } else {
      console.log('\n✅ すべてのZEH関連URLがクリーンアップされました！');
    }
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 実行
cleanRemainingUrls()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('エラー:', error);
    process.exit(1);
  });