import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkAddressDetail() {
  const companies = await prisma.company.findMany({
    where: {
      AND: [
        { address: { not: null } },
        { address: { not: '' } }
      ]
    },
    select: {
      address: true,
      phoneNumber: true,
      latitude: true,
      longitude: true
    }
  });

  const addressPatterns = {
    prefectureOnly: 0,
    cityLevel: 0,
    detailed: 0
  };

  const examples = {
    prefectureOnly: [],
    cityLevel: [],
    detailed: []
  };

  companies.forEach(c => {
    const addr = c.address || '';
    
    if (addr.includes('市') || addr.includes('町') || addr.includes('村') || addr.includes('区')) {
      addressPatterns.cityLevel++;
      if (examples.cityLevel.length < 5) {
        examples.cityLevel.push({
          address: addr,
          phone: c.phoneNumber,
          lat: c.latitude,
          lng: c.longitude
        });
      }
    } else if (addr.includes('県')) {
      addressPatterns.prefectureOnly++;
      if (examples.prefectureOnly.length < 5) {
        examples.prefectureOnly.push({
          address: addr,
          phone: c.phoneNumber,
          lat: c.latitude,
          lng: c.longitude
        });
      }
    } else {
      addressPatterns.detailed++;
      if (examples.detailed.length < 5) {
        examples.detailed.push({
          address: addr,
          phone: c.phoneNumber,
          lat: c.latitude,
          lng: c.longitude
        });
      }
    }
  });

  console.log('📊 住所の詳細度分析:');
  console.log(`   都道府県のみ: ${addressPatterns.prefectureOnly}社 (${(addressPatterns.prefectureOnly/companies.length*100).toFixed(1)}%)`);
  console.log(`   市区町村レベル: ${addressPatterns.cityLevel}社 (${(addressPatterns.cityLevel/companies.length*100).toFixed(1)}%)`);
  console.log(`   その他: ${addressPatterns.detailed}社`);
  console.log(`   合計: ${companies.length}社`);

  console.log('\n📍 都道府県のみの例:');
  examples.prefectureOnly.forEach(e => {
    console.log(`   住所: '${e.address}' (電話: ${e.phone}, 座標: ${e.lat},${e.lng})`);
  });

  console.log('\n📍 市区町村レベルの例:');
  examples.cityLevel.forEach(e => {
    console.log(`   住所: '${e.address}' (電話: ${e.phone}, 座標: ${e.lat},${e.lng})`);
  });

  await prisma.$disconnect();
}

checkAddressDetail();
