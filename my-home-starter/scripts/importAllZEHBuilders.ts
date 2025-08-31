// scripts/importAllZEHBuilders.ts

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { CorporateNumberService } from '../src/services/corporateNumberService';

const prisma = new PrismaClient();

// 都道府県マッピング
const PREFECTURE_MAP: Record<string, string> = {
  '01_hokkaido': '北海道',
  '02_aomori': '青森県',
  '03_iwate': '岩手県',
  '04_miyagi': '宮城県',
  '05_akita': '秋田県',
  '06_yamagata': '山形県',
  '07_fukushima': '福島県',
  '08_ibaraki': '茨城県',
  '09_tochigi': '栃木県',
  '10_gunma': '群馬県',
  '11_saitama': '埼玉県',
  '12_chiba': '千葉県',
  '13_tokyo': '東京都',
  '14_kanagawa': '神奈川県',
  '15_niigata': '新潟県',
  '16_toyama': '富山県',
  '17_ishikawa': '石川県',
  '18_fukui': '福井県',
  '19_yamanashi': '山梨県',
  '20_nagano': '長野県',
  '21_gifu': '岐阜県',
  '22_shizuoka': '静岡県',
  '23_aichi': '愛知県',
  '24_mie': '三重県',
  '25_shiga': '滋賀県',
  '26_kyoto': '京都府',
  '27_osaka': '大阪府',
  '28_hyogo': '兵庫県',
  '29_nara': '奈良県',
  '30_wakayama': '和歌山県',
  '31_tottori': '鳥取県',
  '32_shimane': '島根県',
  '33_okayama': '岡山県',
  '34_hiroshima': '広島県',
  '35_yamaguchi': '山口県',
  '36_tokushima': '徳島県',
  '37_kagawa': '香川県',
  '38_ehime': '愛媛県',
  '39_kochi': '高知県',
  '40_fukuoka': '福岡県',
  '41_saga': '佐賀県',
  '42_nagasaki': '長崎県',
  '43_kumamoto': '熊本県',
  '44_oita': '大分県',
  '45_miyazaki': '宮崎県',
  '46_kagoshima': '鹿児島県',
  '47_okinawa': '沖縄県'
};

// CSV列名のバリエーション（SIIサイトの出力形式に応じて調整）
interface ZEHBuilderCSV {
  [key: string]: string; // 動的なキー名に対応
}

// 統計情報
interface ImportStats {
  totalFiles: number;
  processedFiles: number;
  totalRecords: number;
  newCompanies: number;
  updatedCompanies: number;
  errors: number;
  skipped: number;
  prefectureStats: Record<string, {
    records: number;
    newCompanies: number;
    updatedCompanies: number;
  }>;
}

class ZEHBuildersAllImporter {
  private corporateNumberService: CorporateNumberService;
  private stats: ImportStats = {
    totalFiles: 47,
    processedFiles: 0,
    totalRecords: 0,
    newCompanies: 0,
    updatedCompanies: 0,
    errors: 0,
    skipped: 0,
    prefectureStats: {}
  };
  private companyCache = new Map<string, string>(); // 会社名 -> 会社ID のキャッシュ
  private skipCorporateNumberSearch = false; // 法人番号検索をスキップするオプション

  constructor(skipCorporateNumberSearch = false) {
    this.corporateNumberService = new CorporateNumberService();
    this.skipCorporateNumberSearch = skipCorporateNumberSearch;
  }

  /**
   * 全都道府県のCSVファイルをインポート
   */
  async importAll() {
    console.log('=== 全国ZEHビルダーデータ一括インポート開始 ===\n');
    const startTime = Date.now();

    const dataDir = path.join(process.cwd(), 'data', 'zeh');
    
    try {
      // CSVファイル一覧を取得
      const files = await fs.readdir(dataDir);
      const csvFiles = files.filter(f => f.endsWith('.csv')).sort();
      
      console.log(`CSVファイル数: ${csvFiles.length}\n`);

      // 各ファイルを処理
      for (const file of csvFiles) {
        const prefectureKey = file.replace('.csv', '');
        const prefecture = PREFECTURE_MAP[prefectureKey];
        
        if (!prefecture) {
          console.warn(`⚠️  不明なファイル: ${file}`);
          continue;
        }

        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📍 ${prefecture} (${file})`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        await this.importPrefectureFile(dataDir, file, prefecture);
        
        this.stats.processedFiles++;
        console.log(`✅ ${prefecture} 完了 (${this.stats.processedFiles}/${this.stats.totalFiles})`);
      }

      const endTime = Date.now();
      this.printFinalSummary(endTime - startTime);

    } catch (error) {
      console.error('エラー:', error);
      throw error;
    }
  }

  /**
   * 1つの都道府県ファイルを処理
   */
  private async importPrefectureFile(dataDir: string, filename: string, prefecture: string) {
    const filepath = path.join(dataDir, filename);
    
    // 都道府県別統計を初期化
    this.stats.prefectureStats[prefecture] = {
      records: 0,
      newCompanies: 0,
      updatedCompanies: 0
    };

    try {
      const csvContent = await fs.readFile(filepath, 'utf-8');
      const records: ZEHBuilderCSV[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        relax_quotes: true,
        relax_column_count: true
      });

      console.log(`レコード数: ${records.length}`);
      this.stats.prefectureStats[prefecture].records = records.length;

      // バッチ処理
      const batchSize = 20; // 大量データのため、バッチサイズを増やす
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        await this.processBatch(batch, prefecture);
        
        // 進捗表示
        if ((i + batchSize) % 100 === 0 || i + batchSize >= records.length) {
          const progress = Math.min(i + batchSize, records.length);
          process.stdout.write(`\r処理中: ${progress}/${records.length}`);
        }
      }
      process.stdout.write('\n');

    } catch (error) {
      console.error(`❌ ${prefecture} のインポートエラー:`, error);
      this.stats.errors++;
    }
  }

  /**
   * バッチ処理
   */
  private async processBatch(records: ZEHBuilderCSV[], prefecture: string) {
    for (const record of records) {
      try {
        this.stats.totalRecords++;
        
        // 会社データを処理
        const processedData = this.parseRecord(record, prefecture);
        if (!processedData) {
          this.stats.skipped++;
          continue;
        }

        // データベースに保存
        const result = await this.saveToDatabase(processedData, prefecture);
        
        if (result === 'new') {
          this.stats.newCompanies++;
          this.stats.prefectureStats[prefecture].newCompanies++;
        } else if (result === 'updated') {
          this.stats.updatedCompanies++;
          this.stats.prefectureStats[prefecture].updatedCompanies++;
        }

      } catch (error) {
        this.stats.errors++;
        console.error(`処理エラー:`, error);
        // 最初のエラーの詳細を表示
        if (this.stats.errors === 1) {
          console.error('エラー詳細:', error);
          console.error('処理中のレコード:', record);
        }
      }
    }
  }

  /**
   * CSVレコードをパース
   */
  private parseRecord(record: ZEHBuilderCSV, prefecture: string): any {
    // CSVのヘッダー名を正規化（全角スペースや表記ゆれに対応）
    const getValue = (keys: string[]): string => {
      for (const key of keys) {
        if (record[key]) return record[key];
      }
      return '';
    };

    const companyName = getValue(['登録名称（屋号）', '事業者名', '会社名', '企業名', '法人名']);
    if (!companyName) return null;

    // ZEH実績を取得（新しいフォーマット対応）
    const zehPerformance = [];
    const years = ['2020', '2021', '2022', '2023', '2024'];
    
    for (const year of years) {
      const columnName = `ZEH普及実績[${year}年度]（新築戸建住宅）`;
      const value = record[columnName];
      
      if (value && value !== '-' && value !== '－' && value !== '' && value !== null) {
        const percentage = parseFloat(String(value).replace(/[%％]/g, '').trim());
        if (!isNaN(percentage)) {
          zehPerformance.push({ year: parseInt(year), percentage });
        }
      }
    }

    // 対応可能エリアをパース（セミコロン区切り）
    const areaValue = getValue(['対応可能エリア']);
    const targetPrefectures = areaValue 
      ? areaValue.split(/[;；]/).map(pref => pref.trim()).filter(Boolean)
      : [];
    
    // 現在処理中の新築注文住宅も対応エリアに含める
    if (!targetPrefectures.includes(prefecture)) {
      targetPrefectures.push(prefecture);
    }

    return {
      registrationNumber: getValue(['登録番号', '登録No.', '登録ID']) || `${new Date().getTime()}`,
      name: companyName.trim(),
      nameKana: getValue(['事業者名（カナ）', '会社名カナ', 'フリガナ']),
      postalCode: getValue(['郵便番号', '〒']),
      prefecture: prefecture, // CSVには住所がないので、ファイル名から取得した都道府県を使用
      city: '', // 市区町村情報なし
      address: '', // 住所情報なし
      phoneNumber: getValue(['電話番号', 'TEL', '連絡先']),
      website: getValue(['ホームページ', 'HP', 'URL', 'WEBサイト']),
      businessTypes: [getValue(['ZEHビルダー/プランナーZEH普及対象', '種別', '業態', '事業タイプ']) || '新築注文戸建住宅'],
      targetPrefectures: targetPrefectures,
      zehPerformance
    };
  }

  /**
   * データベースに保存
   */
  private async saveToDatabase(data: any, prefecture: string): Promise<'new' | 'updated' | 'error'> {
    try {
      // キャッシュから会社を検索
      let companyId = this.companyCache.get(data.name);
      
      if (!companyId) {
        // データベースから検索
        const existingCompany = await prisma.company.findFirst({
          where: { name: data.name }
        });
        
        if (existingCompany) {
          companyId = existingCompany.id;
          this.companyCache.set(data.name, companyId);
        }
      }

      if (companyId) {
        // 既存会社を更新
        await this.updateCompany(companyId, data);
        return 'updated';
      } else {
        // 新規作成
        const newCompany = await this.createCompany(data);
        this.companyCache.set(data.name, newCompany.id);
        return 'new';
      }

    } catch (error) {
      console.error(`保存エラー (${data.name}):`, error);
      // 最初のエラーの詳細を表示
      if (this.stats.errors === 0) {
        console.error('保存データ:', JSON.stringify(data, null, 2));
      }
      return 'error';
    }
  }

  /**
   * 新規会社作成
   */
  private async createCompany(data: any) {
    // 法人番号を取得（オプション）
    let corporateNumber = `ZEH_${data.registrationNumber || Date.now()}`;
    
    if (!this.skipCorporateNumberSearch && data.name && data.prefecture) {
      try {
        const corpResults = await this.corporateNumberService.searchByName(
          data.name,
          data.prefecture
        );
        if (corpResults.length > 0) {
          corporateNumber = corpResults[0].corporateNumber;
        }
      } catch (error) {
        // エラーは無視して続行
      }
    }

    const company = await prisma.company.create({
      data: {
        corporateNumber,
        name: data.name,
        nameKana: data.nameKana,
        website: this.normalizeUrl(data.website),
        isVerified: true,
        gBizData: {
          source: 'ZEH_BUILDER',
          importDate: new Date().toISOString(),
          zehRegistration: {
            registrationNumber: data.registrationNumber,
            businessTypes: data.businessTypes,
            performance: data.zehPerformance,
            lastUpdated: new Date().toISOString()
          },
          contact: {
            postalCode: data.postalCode,
            prefecture: data.prefecture,
            city: data.city,
            address: data.address,
            phoneNumber: data.phoneNumber
          }
        }
      }
    });

    // サービスエリアを作成（本社所在地）
    await prisma.serviceArea.create({
      data: {
        companyId: company.id,
        prefecture: data.prefecture,
        city: data.city,
        coverage: 'FULL',
        remarks: 'ZEHビルダー登録（本社所在地）'
      }
    });

    return company;
  }

  /**
   * 既存会社更新
   */
  private async updateCompany(companyId: string, data: any) {
    const existingCompany = await prisma.company.findUnique({
      where: { id: companyId },
      include: { serviceAreas: true }
    });

    if (!existingCompany) return;

    // gBizDataを更新
    const updatedGBizData = {
      ...(existingCompany.gBizData as any || {}),
      zehRegistration: {
        ...(existingCompany.gBizData as any)?.zehRegistration || {},
        [data.prefecture]: {
          registrationNumber: data.registrationNumber,
          businessTypes: data.businessTypes,
          performance: data.zehPerformance,
          lastUpdated: new Date().toISOString()
        }
      }
    };

    await prisma.company.update({
      where: { id: companyId },
      data: {
        isVerified: true,
        gBizData: updatedGBizData,
        gBizLastUpdated: new Date()
      }
    });

    // サービスエリアを追加（既存でなければ）
    const hasArea = existingCompany.serviceAreas.some(
      area => area.prefecture === data.prefecture
    );

    if (!hasArea) {
      await prisma.serviceArea.create({
        data: {
          companyId,
          prefecture: data.prefecture,
          city: data.city,
          coverage: 'PARTIAL',
          remarks: 'ZEHビルダー登録エリア'
        }
      });
    }
  }

  // ユーティリティメソッド
  private normalizeUrl(url: string): string | undefined {
    if (!url || url === '-' || url === '－') return undefined;
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
    return url;
  }

  private parseBusinessTypes(value: string): string[] {
    if (!value) return ['新築注文住宅'];
    
    const types = value.split(/[、,・]/).map(t => t.trim()).filter(Boolean);
    return types.length > 0 ? types : ['新築注文住宅'];
  }

  /**
   * 最終サマリーを表示
   */
  private printFinalSummary(elapsedTime: number) {
    console.log('\n\n');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║          全国ZEHビルダーインポート完了サマリー          ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log(`\n📊 全体統計:`);
    console.log(`  - 処理ファイル数: ${this.stats.processedFiles}/${this.stats.totalFiles}`);
    console.log(`  - 総レコード数: ${this.stats.totalRecords.toLocaleString()}`);
    console.log(`  - 新規登録: ${this.stats.newCompanies.toLocaleString()}社`);
    console.log(`  - 更新: ${this.stats.updatedCompanies.toLocaleString()}社`);
    console.log(`  - スキップ: ${this.stats.skipped.toLocaleString()}件`);
    console.log(`  - エラー: ${this.stats.errors.toLocaleString()}件`);
    console.log(`  - 処理時間: ${Math.round(elapsedTime / 1000 / 60)}分${Math.round((elapsedTime / 1000) % 60)}秒`);

    console.log(`\n📍 都道府県別上位10:`);
    const sortedPrefectures = Object.entries(this.stats.prefectureStats)
      .sort((a, b) => b[1].records - a[1].records)
      .slice(0, 10);

    sortedPrefectures.forEach(([pref, stats], index) => {
      console.log(`  ${index + 1}. ${pref}: ${stats.records}件 (新規${stats.newCompanies}/更新${stats.updatedCompanies})`);
    });

    console.log('\n✅ インポート処理が完了しました！');
  }
}

/**
 * メイン処理
 */
async function main() {
  // コマンドライン引数
  const args = process.argv.slice(2);
  const skipCorporateNumber = args.includes('--skip-corp-number');
  
  if (skipCorporateNumber) {
    console.log('⚠️  法人番号検索をスキップします（高速モード）\n');
  }

  const importer = new ZEHBuildersAllImporter(skipCorporateNumber);
  
  try {
    await importer.importAll();
  } catch (error) {
    console.error('インポートエラー:', error);
    process.exit(1);
  }
}

// 実行
main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });