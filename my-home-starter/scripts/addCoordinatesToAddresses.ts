// scripts/addCoordinatesToAddresses.ts

import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

interface GeocodeResult {
  geometry: {
    coordinates: [number, number]; // [経度, 緯度]
    type: string;
  };
  type: string;
  properties: {
    addressCode: string;
    title: string;
  };
}

class CoordinateUpdater {
  private stats = {
    total: 0,
    updated: 0,
    failed: 0
  };

  /**
   * 国土地理院のジオコーディングAPIを使用して座標を取得
   */
  private async geocode(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const encodedAddress = encodeURIComponent(address);
      const url = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodedAddress}`;
      
      const response = await fetch(url);
      const data = await response.json() as GeocodeResult[];
      
      if (data && data.length > 0 && data[0].geometry) {
        const [lng, lat] = data[0].geometry.coordinates;
        return { lat, lng };
      }
      
      return null;
    } catch (error) {
      console.error('ジオコーディングエラー:', error);
      return null;
    }
  }

  async updateAll() {
    console.log('=== 住所から座標を取得開始（国土地理院API使用）===\n');
    const startTime = Date.now();

    try {
      // 住所はあるが座標がない企業を取得
      const companies = await prisma.company.findMany({
        where: {
          AND: [
            {
              gBizData: {
                path: ['address', 'prefecture'],
                not: undefined
              }
            },
            {
              NOT: {
                gBizData: {
                  path: ['address', 'lat'],
                  not: undefined
                }
              }
            }
          ]
        },
        select: {
          id: true,
          name: true,
          gBizData: true
        }
      });

      console.log(`対象企業数: ${companies.length}社\n`);
      this.stats.total = companies.length;

      // 1社ずつ処理（API制限を考慮）
      for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        
        try {
          const address = company.gBizData?.address;
          if (!address || !address.prefecture || !address.city) {
            this.stats.failed++;
            continue;
          }

          // 住所文字列を構築
          const fullAddress = `${address.prefecture}${address.city}${address.street || ''}`;
          
          // ジオコーディング
          const coords = await this.geocode(fullAddress);
          
          if (coords) {
            // 座標情報を追加
            const updatedGBizData = {
              ...company.gBizData,
              address: {
                ...address,
                lat: coords.lat,
                lng: coords.lng
              }
            };

            await prisma.company.update({
              where: { id: company.id },
              data: {
                gBizData: updatedGBizData,
                gBizLastUpdated: new Date()
              }
            });

            console.log(`✓ ${i + 1}/${companies.length}: ${company.name} - ${coords.lat}, ${coords.lng}`);
            this.stats.updated++;
          } else {
            console.log(`✗ ${i + 1}/${companies.length}: ${company.name} - 座標取得失敗`);
            this.stats.failed++;
          }

          // API制限対策（0.5秒待機）
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`エラー: ${company.name}`, error);
          this.stats.failed++;
        }

        // 進捗表示（10社ごと）
        if ((i + 1) % 10 === 0) {
          const elapsed = (Date.now() - startTime) / 1000;
          const rate = (i + 1) / elapsed;
          const remaining = (companies.length - (i + 1)) / rate;
          console.log(`\n進捗: ${i + 1}/${companies.length} (${Math.round((i + 1) / companies.length * 100)}%)`);
          console.log(`残り予想時間: ${Math.round(remaining / 60)}分`);
        }
      }

      this.printSummary(Date.now() - startTime);

    } catch (error) {
      console.error('エラー:', error);
    }
  }

  private printSummary(elapsedTime: number) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 座標取得完了:');
    console.log(`  - 総企業数: ${this.stats.total}`);
    console.log(`  - 更新成功: ${this.stats.updated} (${Math.round(this.stats.updated / this.stats.total * 100)}%)`);
    console.log(`  - 失敗: ${this.stats.failed}`);
    console.log(`  - 処理時間: ${Math.round(elapsedTime / 1000 / 60)}分`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

// 実行
async function main() {
  const updater = new CoordinateUpdater();
  await updater.updateAll();
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });