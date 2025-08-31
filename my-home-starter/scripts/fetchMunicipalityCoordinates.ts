// scripts/fetchMunicipalityCoordinates.ts
// 全国の市町村の中心座標を取得してデータベースに保存

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

interface Municipality {
  code: string;
  prefecture: string;
  district: string;
  city: string;
  lat?: number;
  lng?: number;
}

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

class MunicipalityCoordinateFetcher {
  private municipalities: Municipality[] = [];
  private stats = {
    total: 0,
    success: 0,
    failed: 0,
    skipped: 0
  };

  /**
   * CSVファイルから市町村データを読み込み
   */
  private async loadMunicipalities() {
    const csvPath = path.join(process.cwd(), 'public', 'municipalities.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    const records = parse(csvContent, {
      columns: false,
      skip_empty_lines: true,
      from_line: 2 // ヘッダーをスキップ
    });

    this.municipalities = records.map((record: string[]) => {
      const code = record[0]?.replace(/"/g, '') || '';
      const prefecture = record[1]?.replace(/"/g, '') || '';
      const district = record[2]?.replace(/"/g, '') || '';
      const city = record[4]?.replace(/"/g, '') || '';

      // 市町村名の決定
      let municipalityName = '';
      if (city && district && district.includes('市')) {
        // 政令指定都市の区（例：大阪市北区）
        municipalityName = `${district}${city}`;
      } else if (city) {
        // 通常の市町村
        municipalityName = city;
      } else if (district) {
        // 郡部の場合
        municipalityName = district;
      }

      return {
        code,
        prefecture,
        district,
        city: municipalityName
      };
    }).filter(m => m.prefecture && m.city);

    console.log(`読み込み完了: ${this.municipalities.length}件の市町村`);
  }

  /**
   * 国土地理院APIで座標を取得
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
      console.error(`ジオコーディングエラー (${address}):`, error);
      return null;
    }
  }

  /**
   * 座標データをJSON形式で保存
   */
  private async saveCoordinates() {
    const outputPath = path.join(process.cwd(), 'data', 'municipality-coordinates.json');
    const dirPath = path.dirname(outputPath);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const data = this.municipalities.filter(m => m.lat && m.lng);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`\n座標データを保存しました: ${outputPath}`);
    console.log(`保存件数: ${data.length}件`);
  }

  /**
   * 全市町村の座標を取得
   */
  async fetchAll() {
    console.log('=== 市町村座標取得開始 ===\n');
    const startTime = Date.now();

    await this.loadMunicipalities();
    this.stats.total = this.municipalities.length;

    // 既存の座標データがあれば読み込み
    const coordinatesPath = path.join(process.cwd(), 'data', 'municipality-coordinates.json');
    let existingData: Municipality[] = [];
    if (fs.existsSync(coordinatesPath)) {
      existingData = JSON.parse(fs.readFileSync(coordinatesPath, 'utf-8'));
      console.log(`既存データ: ${existingData.length}件`);
    }

    // 既存データをマップに変換
    const existingMap = new Map(
      existingData.map(m => [`${m.prefecture}${m.city}`, m])
    );

    for (let i = 0; i < this.municipalities.length; i++) {
      const municipality = this.municipalities[i];
      const key = `${municipality.prefecture}${municipality.city}`;

      // 既存データがあればスキップ
      if (existingMap.has(key)) {
        const existing = existingMap.get(key)!;
        municipality.lat = existing.lat;
        municipality.lng = existing.lng;
        this.stats.skipped++;
        console.log(`⏭ ${i + 1}/${this.stats.total}: ${key} - スキップ（既存データ）`);
        continue;
      }

      // 座標を取得
      const address = `${municipality.prefecture}${municipality.city}`;
      const coords = await this.geocode(address);

      if (coords) {
        municipality.lat = coords.lat;
        municipality.lng = coords.lng;
        this.stats.success++;
        console.log(`✓ ${i + 1}/${this.stats.total}: ${address} - ${coords.lat}, ${coords.lng}`);
      } else {
        this.stats.failed++;
        console.log(`✗ ${i + 1}/${this.stats.total}: ${address} - 取得失敗`);
      }

      // API制限対策（0.5秒待機）
      if (i < this.municipalities.length - 1 && !existingMap.has(key)) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // 100件ごとに中間保存
      if ((i + 1) % 100 === 0) {
        await this.saveCoordinates();
        console.log(`\n--- ${i + 1}件処理完了（中間保存） ---\n`);
      }
    }

    // 最終保存
    await this.saveCoordinates();

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log('\n=== 座標取得完了 ===');
    console.log(`処理時間: ${Math.floor(duration / 60)}分${duration % 60}秒`);
    console.log(`総数: ${this.stats.total}件`);
    console.log(`成功: ${this.stats.success}件`);
    console.log(`失敗: ${this.stats.failed}件`);
    console.log(`スキップ: ${this.stats.skipped}件`);
  }
}

// 実行
const fetcher = new MunicipalityCoordinateFetcher();
fetcher.fetchAll()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('エラー:', error);
    process.exit(1);
  });