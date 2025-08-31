// scripts/setServiceAreasWithin50km.ts
// 各住宅会社の本社から半径50km圏内の市町村を施工エリアとして設定

import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface Municipality {
  code: string;
  prefecture: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
}

interface CompanyWithCoordinates {
  id: string;
  name: string;
  gBizData: any;
}

class ServiceAreaSetter {
  private municipalities: Municipality[] = [];
  private stats = {
    totalCompanies: 0,
    processedCompanies: 0,
    totalAreas: 0,
    newAreas: 0,
    existingAreas: 0,
    failedCompanies: 0
  };

  /**
   * Haversine公式を使用して2点間の距離を計算（km）
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // 地球の半径（km）
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * 市町村座標データを読み込み
   */
  private async loadMunicipalityCoordinates() {
    const filePath = path.join(process.cwd(), 'data', 'municipality-coordinates.json');
    
    if (!fs.existsSync(filePath)) {
      throw new Error('市町村座標データが見つかりません。先にfetchMunicipalityCoordinates.tsを実行してください。');
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    this.municipalities = data.filter((m: Municipality) => m.lat && m.lng);
    
    console.log(`市町村座標データ読み込み完了: ${this.municipalities.length}件`);
  }

  /**
   * 会社の座標を取得
   */
  private getCompanyCoordinates(company: CompanyWithCoordinates): { lat: number; lng: number } | null {
    // gBizData.coordinatesから座標を取得
    if (company.gBizData?.coordinates?.lat && company.gBizData?.coordinates?.lng) {
      return {
        lat: company.gBizData.coordinates.lat,
        lng: company.gBizData.coordinates.lng
      };
    }

    // 旧形式のデータ構造もチェック
    if (company.gBizData?.address?.lat && company.gBizData?.address?.lng) {
      return {
        lat: company.gBizData.address.lat,
        lng: company.gBizData.address.lng
      };
    }

    return null;
  }

  /**
   * 半径50km圏内の市町村を検索
   */
  private findMunicipalitiesWithinRadius(
    companyLat: number,
    companyLng: number,
    radiusKm: number = 50
  ): Municipality[] {
    return this.municipalities.filter(municipality => {
      const distance = this.calculateDistance(
        companyLat,
        companyLng,
        municipality.lat,
        municipality.lng
      );
      return distance <= radiusKm;
    });
  }

  /**
   * ServiceAreaの重複チェック
   */
  private async checkExistingServiceArea(
    companyId: string,
    prefecture: string,
    city: string
  ): Promise<boolean> {
    const existing = await prisma.serviceArea.findFirst({
      where: {
        companyId,
        prefecture,
        city
      }
    });
    return existing !== null;
  }

  /**
   * 全住宅会社の施工エリアを設定
   */
  async setAllServiceAreas() {
    console.log('=== 半径50km施工エリア設定開始 ===\n');
    const startTime = Date.now();

    // 市町村座標データを読み込み
    await this.loadMunicipalityCoordinates();

    // 座標情報を持つ全会社を取得
    const companies = await prisma.company.findMany({
      where: {
        OR: [
          {
            gBizData: {
              path: ['coordinates', 'lat'],
              not: Prisma.JsonNull
            }
          },
          {
            gBizData: {
              path: ['address', 'lat'],
              not: Prisma.JsonNull
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

    this.stats.totalCompanies = companies.length;
    console.log(`処理対象会社数: ${companies.length}社\n`);

    // 各会社について処理
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      const coords = this.getCompanyCoordinates(company);

      if (!coords) {
        console.log(`✗ ${i + 1}/${companies.length}: ${company.name} - 座標情報なし`);
        this.stats.failedCompanies++;
        continue;
      }

      // 半径50km圏内の市町村を検索
      const nearbyMunicipalities = this.findMunicipalitiesWithinRadius(
        coords.lat,
        coords.lng,
        50
      );

      console.log(`\n${i + 1}/${companies.length}: ${company.name}`);
      console.log(`  本社位置: ${coords.lat}, ${coords.lng}`);
      console.log(`  50km圏内の市町村数: ${nearbyMunicipalities.length}件`);

      let newCount = 0;
      let existingCount = 0;

      // 市町村ごとにServiceAreaを追加
      for (const municipality of nearbyMunicipalities) {
        // 重複チェック
        const exists = await this.checkExistingServiceArea(
          company.id,
          municipality.prefecture,
          municipality.city
        );

        if (exists) {
          existingCount++;
          continue;
        }

        // 新規追加
        await prisma.serviceArea.create({
          data: {
            companyId: company.id,
            prefecture: municipality.prefecture,
            city: municipality.city,
            coverage: 'FULL',
            remarks: '本社から半径50km圏内'
          }
        });

        newCount++;
        this.stats.newAreas++;
      }

      console.log(`  新規追加: ${newCount}件`);
      console.log(`  既存: ${existingCount}件`);

      this.stats.processedCompanies++;
      this.stats.totalAreas += nearbyMunicipalities.length;
      this.stats.existingAreas += existingCount;

      // 進捗表示（10社ごと）
      if ((i + 1) % 10 === 0) {
        const progress = Math.round(((i + 1) / companies.length) * 100);
        console.log(`\n--- 進捗: ${progress}% (${i + 1}/${companies.length}社) ---\n`);
      }
    }

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log('\n=== 施工エリア設定完了 ===');
    console.log(`処理時間: ${Math.floor(duration / 60)}分${duration % 60}秒`);
    console.log(`処理会社数: ${this.stats.processedCompanies}/${this.stats.totalCompanies}社`);
    console.log(`失敗: ${this.stats.failedCompanies}社`);
    console.log(`総施工エリア数: ${this.stats.totalAreas}件`);
    console.log(`新規追加: ${this.stats.newAreas}件`);
    console.log(`既存スキップ: ${this.stats.existingAreas}件`);

    // 最終的なServiceAreaの統計
    const totalServiceAreas = await prisma.serviceArea.count();
    const byRemarks = await prisma.serviceArea.groupBy({
      by: ['remarks'],
      _count: true
    });

    console.log('\n--- ServiceAreaテーブル統計 ---');
    console.log(`総レコード数: ${totalServiceAreas}件`);
    byRemarks.forEach(r => {
      console.log(`  ${r.remarks || '(備考なし)'}: ${r._count}件`);
    });
  }

  /**
   * 特定の会社の施工エリアを更新（デバッグ用）
   */
  async updateCompanyServiceArea(companyName: string) {
    await this.loadMunicipalityCoordinates();

    const company = await prisma.company.findFirst({
      where: { name: { contains: companyName } },
      select: {
        id: true,
        name: true,
        gBizData: true,
        serviceAreas: true
      }
    });

    if (!company) {
      console.log(`会社が見つかりません: ${companyName}`);
      return;
    }

    const coords = this.getCompanyCoordinates(company);
    if (!coords) {
      console.log(`座標情報がありません: ${company.name}`);
      return;
    }

    console.log(`\n${company.name}`);
    console.log(`本社位置: ${coords.lat}, ${coords.lng}`);
    console.log(`現在の施工エリア数: ${company.serviceAreas.length}件`);

    const nearbyMunicipalities = this.findMunicipalitiesWithinRadius(
      coords.lat,
      coords.lng,
      50
    );

    console.log(`50km圏内の市町村: ${nearbyMunicipalities.length}件`);
    
    // 都道府県ごとに集計
    const byPrefecture = nearbyMunicipalities.reduce((acc, m) => {
      acc[m.prefecture] = (acc[m.prefecture] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n都道府県別:');
    Object.entries(byPrefecture)
      .sort(([, a], [, b]) => b - a)
      .forEach(([pref, count]) => {
        console.log(`  ${pref}: ${count}市町村`);
      });
  }
}

// 実行
const setter = new ServiceAreaSetter();

// コマンドライン引数をチェック
const args = process.argv.slice(2);
if (args[0] === '--company' && args[1]) {
  // 特定の会社のみ処理（デバッグ用）
  setter.updateCompanyServiceArea(args[1])
    .then(() => process.exit(0))
    .catch(error => {
      console.error('エラー:', error);
      process.exit(1);
    });
} else {
  // 全会社を処理
  setter.setAllServiceAreas()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('エラー:', error);
      process.exit(1);
    });
}