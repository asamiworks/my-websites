// src/app/area/[prefecture]/[city]/companies/route.ts
// 市町村レベルでの住宅会社フィルタリングに対応

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// gBizDataの型定義
interface GBizData {
  prefecture?: string;
  city?: string;
  address?: string | {
    lat?: number;
    lng?: number;
    [key: string]: any;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  establishedYear?: number;
  capital?: number;
  employees?: number;
  phoneNumber?: string;
  zehRegistration?: {
    phoneNumber?: string;
  };
  [key: string]: any; // その他のプロパティ
}

interface CompanyWithDistance {
  id: string;
  name: string;
  nameKana: string | null;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  isVerified: boolean;
  isPremium: boolean;
  gBizData: any;
  serviceAreas: any[];
  distance: number;
  nearestLocation: {
    type: string;
    prefecture: string;
    city: string;
    address?: string; // オプショナルプロパティとして定義
  };
}

/**
 * Haversine公式で2点間の距離を計算（km）
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // 地球の半径（km）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 市町村の中心座標を取得
 */
async function getMunicipalityCoordinates(prefecture: string, city: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // 市町村座標データから検索
    const fs = await import('fs/promises');
    const path = await import('path');
    const dataPath = path.join(process.cwd(), 'data', 'municipality-coordinates.json');
    
    try {
      const data = await fs.readFile(dataPath, 'utf-8');
      const municipalities = JSON.parse(data);
      const municipality = municipalities.find((m: any) => 
        m.prefecture === prefecture && m.city === city
      );

      if (municipality && municipality.lat && municipality.lng) {
        return {
          lat: municipality.lat,
          lng: municipality.lng
        };
      }
    } catch (fileError) {
      console.error('市町村座標データが見つかりません:', fileError);
    }

    return null;
  } catch (error) {
    console.error('座標取得エラー:', error);
    return null;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { prefecture: string; city: string } }
) {
  try {
    const { prefecture, city } = params;
    const decodedPrefecture = decodeURIComponent(prefecture);
    const decodedCity = decodeURIComponent(city);

    console.log(`リクエスト: ${decodedPrefecture} ${decodedCity}`);

    // 市町村の中心座標を取得
    const cityCoordinates = await getMunicipalityCoordinates(decodedPrefecture, decodedCity);
    
    // 該当する市町村の施工エリアを持つ会社を取得
    const companies = await prisma.company.findMany({
      where: {
        serviceAreas: {
          some: {
            prefecture: decodedPrefecture,
            city: decodedCity
          }
        }
      },
      include: {
        serviceAreas: {
          where: {
            prefecture: decodedPrefecture,
            city: decodedCity
          }
        }
      }
    });

    console.log(`該当会社数: ${companies.length}社`);

    // 各会社について距離を計算
    const companiesWithDistance: CompanyWithDistance[] = companies.map(company => {
      let distance = 9999; // デフォルト値
      let nearestLocation: {
        type: string;
        prefecture: string;
        city: string;
        address?: string;
      } = {
        type: '施工エリア',
        prefecture: decodedPrefecture,
        city: decodedCity
      };

      // 会社の座標が取得できる場合は距離を計算
      if (cityCoordinates && company.gBizData) {
        const gBizData = company.gBizData as GBizData;
        // coordinates または address に座標が入っている可能性がある
        const coords = gBizData.coordinates || 
                      (gBizData as any).address || 
                      gBizData;
        
        if (coords?.lat && coords?.lng) {
          distance = calculateDistance(
            cityCoordinates.lat,
            cityCoordinates.lng,
            coords.lat,
            coords.lng
          );

          // addressの取得（文字列またはオブジェクトの可能性）
          let addressStr = '';
          if (typeof gBizData.address === 'string') {
            addressStr = gBizData.address;
          } else if (typeof gBizData.address === 'object' && gBizData.address !== null) {
            // addressオブジェクトから住所文字列を構築する場合
            const addr = gBizData.address as any;
            addressStr = addr.fullAddress || addr.address || '';
          }

          nearestLocation = {
            type: '本社',
            prefecture: gBizData.prefecture || decodedPrefecture,
            city: gBizData.city || '',
            ...(addressStr ? { address: addressStr } : {})
          };
        }
      }

      return {
        ...company,
        distance: Math.round(distance * 10) / 10,
        nearestLocation
      };
    });

    // ソート（プレミアム会員優先、次に距離順）
    companiesWithDistance.sort((a, b) => {
      if (a.isPremium !== b.isPremium) {
        return a.isPremium ? -1 : 1;
      }
      return a.distance - b.distance;
    });

    // レスポンスデータの整形
    const responseData = {
      companies: companiesWithDistance.map(company => ({
        id: company.id,
        name: company.name,
        nameKana: company.nameKana,
        description: company.description,
        website: company.website,
        logoUrl: company.logoUrl,
        isVerified: company.isVerified,
        isPremium: company.isPremium,
        distance: company.distance,
        nearestLocation: company.nearestLocation,
        serviceAreaInfo: {
          coverage: company.serviceAreas[0]?.coverage || 'FULL',
          remarks: company.serviceAreas[0]?.remarks || ''
        },
        basicInfo: {
          establishedYear: (company.gBizData as GBizData)?.establishedYear,
          capital: (company.gBizData as GBizData)?.capital,
          employees: (company.gBizData as GBizData)?.employees,
          phoneNumber: (company.gBizData as GBizData)?.phoneNumber || (company.gBizData as GBizData)?.zehRegistration?.phoneNumber
        }
      })),
      total: companiesWithDistance.length,
      location: {
        prefecture: decodedPrefecture,
        city: decodedCity,
        coordinates: cityCoordinates
      }
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('エラー:', error);
    return NextResponse.json(
      { error: '会社情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}