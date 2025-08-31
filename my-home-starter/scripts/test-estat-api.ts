// scripts/test-estat-api.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

interface EstatApiListResponse {
  GET_STATS_LIST: {
    RESULT: {
      STATUS: number;
      ERROR_MSG?: string;
    };
    DATALIST_INF: {
      LIST_INF: Array<{
        '@id': string;
        STAT_NAME: {
          '@code': string;
          '$': string;
        };
        GOV_ORG: {
          '@code': string;
          '$': string;
        };
        STATISTICS_NAME: string;
        TITLE: {
          '@no'?: string;
          '$': string;
        };
        CYCLE: string;
        SURVEY_DATE: string;
        OPEN_DATE: string;
        SMALL_AREA: string;
      }>;
    };
  };
}

interface EstatApiMetaResponse {
  GET_META_INFO: {
    RESULT: {
      STATUS: number;
      ERROR_MSG?: string;
    };
    METADATA_INF: {
      TABLE_INF: {
        '@id': string;
        STAT_NAME: {
          '@code': string;
          '$': string;
        };
        GOV_ORG: {
          '@code': string;
          '$': string;
        };
        STATISTICS_NAME: string;
        TITLE: string;
        CYCLE: string;
        SURVEY_DATE: string;
        OPEN_DATE: string;
        SMALL_AREA: string;
        COLLECT_AREA: string;
        MAIN_CATEGORY: {
          '@code': string;
          '$': string;
        };
        SUB_CATEGORY: {
          '@code': string;
          '$': string;
        };
        OVERALL_TOTAL_NUMBER: string;
        UPDATED_DATE: string;
      };
      CLASS_INF: {
        CLASS_OBJ: Array<{
          '@id': string;
          '@name': string;
          CLASS: Array<{
            '@code': string;
            '@name': string;
            '@level': string;
            '@unit'?: string;
          }>;
        }>;
      };
    };
  };
}

async function searchStatsTables(keyword: string) {
  const appId = process.env.ESTAT_API_KEY;
  if (!appId) {
    console.error('ESTAT_API_KEY is not set');
    return;
  }

  const url = `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsList?appId=${appId}&searchWord=${encodeURIComponent(keyword)}&limit=20`;

  try {
    const response = await fetch(url);
    const data: EstatApiListResponse = await response.json();
    
    if (data.GET_STATS_LIST.RESULT.STATUS !== 0) {
      console.error('Error:', data.GET_STATS_LIST.RESULT.ERROR_MSG);
      return;
    }

    const tables = data.GET_STATS_LIST.DATALIST_INF?.LIST_INF || [];
    console.log(`\nFound ${tables.length} tables for keyword "${keyword}":\n`);
    
    tables.forEach(table => {
      console.log(`ID: ${table['@id']}`);
      console.log(`Title: ${table.TITLE.$}`);
      console.log(`Survey: ${table.STATISTICS_NAME}`);
      console.log(`Date: ${table.SURVEY_DATE}`);
      console.log(`Small Area: ${table.SMALL_AREA}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Failed to search tables:', error);
  }
}

async function getTableMetadata(statsDataId: string) {
  const appId = process.env.ESTAT_API_KEY;
  if (!appId) {
    console.error('ESTAT_API_KEY is not set');
    return;
  }

  const url = `https://api.e-stat.go.jp/rest/3.0/app/json/getMetaInfo?appId=${appId}&statsDataId=${statsDataId}`;

  try {
    const response = await fetch(url);
    const data: EstatApiMetaResponse = await response.json();
    
    if (data.GET_META_INFO.RESULT.STATUS !== 0) {
      console.error('Error:', data.GET_META_INFO.RESULT.ERROR_MSG);
      return;
    }

    const tableInfo = data.GET_META_INFO.METADATA_INF.TABLE_INF;
    const classInfo = data.GET_META_INFO.METADATA_INF.CLASS_INF.CLASS_OBJ;

    console.log('\n=== Table Information ===');
    console.log(`ID: ${tableInfo['@id']}`);
    console.log(`Title: ${tableInfo.TITLE}`);
    console.log(`Survey: ${tableInfo.STATISTICS_NAME}`);
    console.log(`Date: ${tableInfo.SURVEY_DATE}`);
    console.log(`Small Area: ${tableInfo.SMALL_AREA}`);
    console.log(`Collect Area: ${tableInfo.COLLECT_AREA}`);

    console.log('\n=== Class Information ===');
    classInfo.forEach(cls => {
      console.log(`\nClass: ${cls['@name']} (${cls['@id']})`);
      if (cls.CLASS && cls.CLASS.length > 0) {
        console.log('Available codes:');
        cls.CLASS.slice(0, 10).forEach(item => {
          console.log(`  - ${item['@code']}: ${item['@name']} (level: ${item['@level']})`);
        });
        if (cls.CLASS.length > 10) {
          console.log(`  ... and ${cls.CLASS.length - 10} more`);
        }
      }
    });
  } catch (error) {
    console.error('Failed to get metadata:', error);
  }
}

async function testAreaCode(cityName: string, cityCode: string) {
  const appId = process.env.ESTAT_API_KEY;
  if (!appId) {
    console.error('ESTAT_API_KEY is not set');
    return;
  }

  console.log(`\n=== Testing ${cityName} (${cityCode}) ===`);

  // Test with different statistics tables
  const tables = [
    { id: '0000010101', name: '人口推計' },
    { id: '0003412175', name: '国勢調査 人口等基本集計' },
    { id: '0003412176', name: '国勢調査 人口等基本集計（市区町村）' }
  ];

  for (const table of tables) {
    console.log(`\nTesting with ${table.name} (${table.id})...`);
    const url = `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData?appId=${appId}&statsDataId=${table.id}&cdArea=${cityCode}&limit=5`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.GET_STATS_DATA.RESULT.STATUS !== 0) {
        console.error(`  ✗ Error: ${data.GET_STATS_DATA.RESULT.ERROR_MSG}`);
      } else {
        const values = data.GET_STATS_DATA.STATISTICAL_DATA?.DATA_INF?.VALUE;
        if (values && values.length > 0) {
          console.log(`  ✓ Data found! First value: ${values[0].$}`);
        } else {
          console.log(`  ✗ No data found`);
        }
      }
    } catch (error) {
      console.error(`  ✗ Failed:`, error);
    }
  }
}

async function main() {
  console.log('=== e-Stat API Test Script ===\n');

  // 1. Search for municipal population tables (国勢調査)
  console.log('1. Searching for municipal population statistics (国勢調査)...');
  await searchStatsTables('国勢調査 市区町村');
  
  // 2. Search for resident registry tables (住民基本台帳)
  console.log('\n2. Searching for resident registry statistics...');
  await searchStatsTables('住民基本台帳 市区町村');

  // 3. Search for school statistics
  console.log('\n3. Searching for school statistics...');
  await searchStatsTables('学校基本調査 市区町村');

  // 4. Check metadata for specific tables
  console.log('\n4. Checking metadata for table 0003448237 (current one)...');
  await getTableMetadata('0003448237');

  // 5. Test with different statistics table (国勢調査)
  console.log('\n5. Testing with census data (table: 0003410379)...');
  await getTableMetadata('0003410379');

  // 6. Test area codes with different table
  console.log('\n6. Testing area codes with population estimates...');
  await testAreaCode('水戸市', '08201');
  await testAreaCode('千代田区', '13101');
  await testAreaCode('つくば市', '08220');
}

main().catch(console.error);