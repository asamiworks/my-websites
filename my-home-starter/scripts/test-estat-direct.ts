// scripts/test-estat-direct.ts - 直接APIをテスト

import dotenv from 'dotenv';
import path from 'path';

// .env.localを読み込む
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testEstatAPI() {
  const apiKey = process.env.ESTAT_API_KEY;
  
  console.log('=== e-Stat API Direct Test ===');
  console.log(`API Key: ${apiKey ? 'SET' : 'NOT SET'}`);
  
  if (!apiKey) {
    console.error('ERROR: ESTAT_API_KEY is not set in .env.local');
    return;
  }
  
  console.log(`API Key Length: ${apiKey.length}`);
  console.log(`API Key Preview: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
  
  // 1. Basic API Test
  console.log('\n1. Testing basic API access...');
  try {
    const url = `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsList?appId=${apiKey}&limit=1`;
    console.log(`URL: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.GET_STATS_LIST?.RESULT?.STATUS === 0) {
      console.log('✅ API Access: SUCCESS');
      console.log(`Total stats available: ${data.GET_STATS_LIST?.DATALIST_INF?.NUMBER}`);
    } else {
      console.log('❌ API Access: FAILED');
      console.log(`Error: ${data.GET_STATS_LIST?.RESULT?.ERROR_MSG}`);
    }
  } catch (error) {
    console.log('❌ API Access: ERROR');
    console.error(error);
  }
  
  // 2. Search for population statistics
  console.log('\n2. Searching for population statistics...');
  try {
    const searchUrl = `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsList?appId=${apiKey}&searchWord=人口&statsCode=00200521&limit=3`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.GET_STATS_LIST?.DATALIST_INF?.TABLE_INF) {
      const tables = Array.isArray(data.GET_STATS_LIST.DATALIST_INF.TABLE_INF)
        ? data.GET_STATS_LIST.DATALIST_INF.TABLE_INF
        : [data.GET_STATS_LIST.DATALIST_INF.TABLE_INF];
      
      console.log('✅ Found statistics:');
      tables.forEach((table, i) => {
        console.log(`   ${i + 1}. ID: ${table['@id']}`);
        console.log(`      Title: ${table.TITLE?.$}`);
      });
      
      // Test with the first stat ID
      if (tables[0]) {
        console.log('\n3. Testing data retrieval...');
        const statsId = tables[0]['@id'];
        const dataUrl = `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData?appId=${apiKey}&statsDataId=${statsId}&limit=1`;
        
        const dataResponse = await fetch(dataUrl);
        const dataJson = await dataResponse.json();
        
        if (dataJson.GET_STATS_DATA?.RESULT?.STATUS === 0) {
          console.log('✅ Data retrieval: SUCCESS');
          
          // Test area filtering
          console.log('\n4. Testing area filtering (Tokyo: 13000)...');
          const tokyoUrl = `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData?appId=${apiKey}&statsDataId=${statsId}&cdArea=13000&limit=1`;
          const tokyoResponse = await fetch(tokyoUrl);
          const tokyoData = await tokyoResponse.json();
          
          if (tokyoData.GET_STATS_DATA?.RESULT?.STATUS === 0) {
            console.log('✅ Area filtering: SUCCESS');
          } else {
            console.log('❌ Area filtering: FAILED');
            console.log(`Error: ${tokyoData.GET_STATS_DATA?.RESULT?.ERROR_MSG}`);
          }
        } else {
          console.log('❌ Data retrieval: FAILED');
          console.log(`Error: ${dataJson.GET_STATS_DATA?.RESULT?.ERROR_MSG}`);
        }
      }
    } else {
      console.log('❌ No statistics found');
    }
  } catch (error) {
    console.log('❌ Search: ERROR');
    console.error(error);
  }
  
  console.log('\n=== Test Complete ===');
}

// 実行
testEstatAPI().catch(console.error);