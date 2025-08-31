// scripts/setAddressFromPhoneNumbers.ts
// 市外局番から住所と座標を推定して設定（修正版）

import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

// 市外局番データベース（088番号と0586を修正）
const areaCodeDatabase: { [key: string]: { prefecture: string; city: string; lat: number; lng: number } } = {
  // === 088番号の詳細な定義 ===
  // 高知県（088-0, 088-1, 088-7, 088-8, 088-9）
  '0880': { prefecture: '高知県', city: '宿毛市', lat: 32.9372, lng: 132.6997 },
  '0881': { prefecture: '高知県', city: '中村市', lat: 32.9834, lng: 132.9439 },
  '0887': { prefecture: '高知県', city: '室戸市', lat: 33.2897, lng: 134.1520 },
  '0888': { prefecture: '高知県', city: '南国市', lat: 33.5752, lng: 133.6412 },
  '0889': { prefecture: '高知県', city: '須崎市', lat: 33.4004, lng: 133.2826 },
  '088-0': { prefecture: '高知県', city: '高知市', lat: 33.5597, lng: 133.5311 },
  '088-1': { prefecture: '高知県', city: '高知市', lat: 33.5597, lng: 133.5311 },
  '088-7': { prefecture: '高知県', city: '高知市', lat: 33.5597, lng: 133.5311 },
  '088-8': { prefecture: '高知県', city: '高知市', lat: 33.5597, lng: 133.5311 },
  '088-9': { prefecture: '高知県', city: '高知市', lat: 33.5597, lng: 133.5311 },
  
  // 徳島県（088-2〜088-6）
  '088-2': { prefecture: '徳島県', city: '徳島市', lat: 34.0658, lng: 134.5593 },
  '088-3': { prefecture: '徳島県', city: '徳島市', lat: 34.0658, lng: 134.5593 },
  '088-4': { prefecture: '徳島県', city: '徳島市', lat: 34.0658, lng: 134.5593 },
  '088-5': { prefecture: '徳島県', city: '徳島市', lat: 34.0658, lng: 134.5593 },
  '088-6': { prefecture: '徳島県', city: '徳島市', lat: 34.0658, lng: 134.5593 },
  '0883': { prefecture: '徳島県', city: '三好市', lat: 34.0265, lng: 133.8070 },
  '0884': { prefecture: '徳島県', city: '阿南市', lat: 33.9223, lng: 134.6596 },
  '0885': { prefecture: '徳島県', city: '小松島市', lat: 34.0047, lng: 134.5907 },
  
  // === 055番号の詳細な定義 ===
  '055-9': { prefecture: '静岡県', city: '沼津市', lat: 35.0956, lng: 138.8636 },
  '055': { prefecture: '山梨県', city: '甲府市', lat: 35.6640, lng: 138.5685 },
  '0551': { prefecture: '山梨県', city: '北杜市', lat: 35.7769, lng: 138.4240 },
  '0552': { prefecture: '山梨県', city: '韮崎市', lat: 35.7085, lng: 138.4469 },
  '0553': { prefecture: '山梨県', city: '山梨市', lat: 35.6918, lng: 138.6835 },
  '0554': { prefecture: '山梨県', city: '大月市', lat: 35.6103, lng: 138.9404 },
  '0555': { prefecture: '山梨県', city: '富士吉田市', lat: 35.4878, lng: 138.8093 },
  '0556': { prefecture: '山梨県', city: '南アルプス市', lat: 35.6085, lng: 138.4640 },
  
  // === 04番号の詳細な定義 ===
  '04-2958': { prefecture: '埼玉県', city: '狭山市', lat: 35.8529, lng: 139.4121 },
  '04-2': { prefecture: '埼玉県', city: '所沢市', lat: 35.7990, lng: 139.4684 },
  '04-7': { prefecture: '千葉県', city: '柏市', lat: 35.8676, lng: 139.9758 },
  '04': { prefecture: '千葉県', city: '市川市', lat: 35.7220, lng: 139.9310 },
  '042': { prefecture: '東京都', city: '八王子市', lat: 35.6557, lng: 139.3389 },
  '0422': { prefecture: '東京都', city: '武蔵野市', lat: 35.7181, lng: 139.5667 },
  '0423': { prefecture: '東京都', city: '三鷹市', lat: 35.6833, lng: 139.5598 },
  '0424': { prefecture: '東京都', city: '調布市', lat: 35.6506, lng: 139.5408 },
  '0425': { prefecture: '東京都', city: '国分寺市', lat: 35.7109, lng: 139.4626 },
  '0426': { prefecture: '東京都', city: '小平市', lat: 35.7286, lng: 139.4774 },
  '0427': { prefecture: '東京都', city: '東村山市', lat: 35.7546, lng: 139.4684 },
  '0428': { prefecture: '東京都', city: '青梅市', lat: 35.7879, lng: 139.2758 },
  
  // 東京23区
  '03-3': { prefecture: '東京都', city: '千代田区', lat: 35.6938, lng: 139.7531 },
  '03-5': { prefecture: '東京都', city: '港区', lat: 35.6584, lng: 139.7516 },
  '03-6': { prefecture: '東京都', city: '新宿区', lat: 35.6938, lng: 139.7036 },
  '03': { prefecture: '東京都', city: '23区', lat: 35.6762, lng: 139.6503 },
  
  // 大阪
  '06-6': { prefecture: '大阪府', city: '大阪市', lat: 34.6937, lng: 135.5023 },
  '06-7': { prefecture: '大阪府', city: '大阪市', lat: 34.6937, lng: 135.5023 },
  '06': { prefecture: '大阪府', city: '大阪市', lat: 34.6937, lng: 135.5023 },
  '072': { prefecture: '大阪府', city: '堺市', lat: 34.5733, lng: 135.4830 },
  '0721': { prefecture: '大阪府', city: '富田林市', lat: 34.5000, lng: 135.5969 },
  '0722': { prefecture: '大阪府', city: '堺市', lat: 34.5733, lng: 135.4830 },
  '0723': { prefecture: '大阪府', city: '和泉市', lat: 34.4830, lng: 135.4232 },
  '0724': { prefecture: '大阪府', city: '岸和田市', lat: 34.4607, lng: 135.3712 },
  '0725': { prefecture: '大阪府', city: '泉大津市', lat: 34.5047, lng: 135.4104 },
  '0726': { prefecture: '大阪府', city: '豊中市', lat: 34.7815, lng: 135.4697 },
  '0727': { prefecture: '大阪府', city: '箕面市', lat: 34.8268, lng: 135.4703 },
  '0728': { prefecture: '大阪府', city: '東大阪市', lat: 34.6795, lng: 135.6009 },
  '0729': { prefecture: '大阪府', city: '八尾市', lat: 34.6267, lng: 135.6016 },
  
  // 愛知
  '052': { prefecture: '愛知県', city: '名古屋市', lat: 35.1802, lng: 136.9066 },
  '0532': { prefecture: '愛知県', city: '豊橋市', lat: 34.7691, lng: 137.3913 },
  '0533': { prefecture: '愛知県', city: '豊川市', lat: 34.8276, lng: 137.3757 },
  '0534': { prefecture: '愛知県', city: '田原市', lat: 34.6693, lng: 137.2641 },
  '0535': { prefecture: '愛知県', city: '蒲郡市', lat: 34.8269, lng: 137.2193 },
  '0536': { prefecture: '愛知県', city: '新城市', lat: 34.9001, lng: 137.4982 },
  '0561': { prefecture: '愛知県', city: '瀬戸市', lat: 35.2239, lng: 137.0849 },
  '0562': { prefecture: '愛知県', city: '大府市', lat: 35.0120, lng: 136.9632 },
  '0563': { prefecture: '愛知県', city: '刈谷市', lat: 34.9892, lng: 137.0018 },
  '0564': { prefecture: '愛知県', city: '岡崎市', lat: 34.9549, lng: 137.1742 },
  '0565': { prefecture: '愛知県', city: '豊田市', lat: 35.0827, lng: 137.1561 },
  '0566': { prefecture: '愛知県', city: '安城市', lat: 34.9586, lng: 137.0807 },
  '0567': { prefecture: '愛知県', city: '津島市', lat: 35.1772, lng: 136.7412 },
  '0568': { prefecture: '愛知県', city: '春日井市', lat: 35.2477, lng: 136.9721 },
  '0569': { prefecture: '愛知県', city: '半田市', lat: 34.8922, lng: 136.9373 },
  '0586': { prefecture: '愛知県', city: '一宮市', lat: 35.3039, lng: 136.8031 }, // 修正: 岐阜県→愛知県
  
  // 神奈川
  '045': { prefecture: '神奈川県', city: '横浜市', lat: 35.4437, lng: 139.6380 },
  '044': { prefecture: '神奈川県', city: '川崎市', lat: 35.5309, lng: 139.7028 },
  '046': { prefecture: '神奈川県', city: '厚木市', lat: 35.4396, lng: 139.3616 },
  '0463': { prefecture: '神奈川県', city: '平塚市', lat: 35.3355, lng: 139.3495 },
  '0465': { prefecture: '神奈川県', city: '小田原市', lat: 35.2644, lng: 139.1520 },
  '0466': { prefecture: '神奈川県', city: '藤沢市', lat: 35.3391, lng: 139.4910 },
  '0467': { prefecture: '神奈川県', city: '鎌倉市', lat: 35.3192, lng: 139.5466 },
  
  // 千葉
  '047': { prefecture: '千葉県', city: '船橋市', lat: 35.6947, lng: 139.9825 },
  '043': { prefecture: '千葉県', city: '千葉市', lat: 35.6073, lng: 140.1062 },
  '0436': { prefecture: '千葉県', city: '市原市', lat: 35.4980, lng: 140.1157 },
  '0438': { prefecture: '千葉県', city: '木更津市', lat: 35.3766, lng: 139.9169 },
  '0439': { prefecture: '千葉県', city: '君津市', lat: 35.3306, lng: 139.9019 },
  '0470': { prefecture: '千葉県', city: '館山市', lat: 34.9967, lng: 139.8699 },
  '0471': { prefecture: '千葉県', city: '松戸市', lat: 35.7879, lng: 139.9030 },
  '0473': { prefecture: '千葉県', city: '習志野市', lat: 35.6810, lng: 140.0270 },
  '0474': { prefecture: '千葉県', city: '市川市', lat: 35.7220, lng: 139.9310 },
  '0475': { prefecture: '千葉県', city: '東金市', lat: 35.5598, lng: 140.3665 },
  '0476': { prefecture: '千葉県', city: '成田市', lat: 35.7763, lng: 140.3183 },
  '0477': { prefecture: '千葉県', city: '佐倉市', lat: 35.7239, lng: 140.2228 },
  '0478': { prefecture: '千葉県', city: '香取市', lat: 35.8979, lng: 140.4996 },
  '0479': { prefecture: '千葉県', city: '銚子市', lat: 35.7346, lng: 140.8266 },
  
  // 埼玉
  '048': { prefecture: '埼玉県', city: 'さいたま市', lat: 35.8617, lng: 139.6455 },
  '049': { prefecture: '埼玉県', city: '川越市', lat: 35.9251, lng: 139.4857 },
  '0480': { prefecture: '埼玉県', city: '久喜市', lat: 36.0624, lng: 139.6670 },
  
  // 茨城
  '029': { prefecture: '茨城県', city: '水戸市', lat: 36.3418, lng: 140.4468 },
  '0280': { prefecture: '茨城県', city: '古河市', lat: 36.1789, lng: 139.7527 },
  '0291': { prefecture: '茨城県', city: '鉾田市', lat: 36.1592, lng: 140.5156 },
  '0293': { prefecture: '茨城県', city: '常陸太田市', lat: 36.5384, lng: 140.5267 },
  '0294': { prefecture: '茨城県', city: '日立市', lat: 36.5992, lng: 140.6513 },
  '0295': { prefecture: '茨城県', city: '常陸大宮市', lat: 36.5433, lng: 140.4108 },
  '0296': { prefecture: '茨城県', city: '筑西市', lat: 36.3070, lng: 139.9828 },
  '0297': { prefecture: '茨城県', city: '龍ケ崎市', lat: 35.9113, lng: 140.1813 },
  '0298': { prefecture: '茨城県', city: 'つくば市', lat: 36.0834, lng: 140.0767 },
  '0299': { prefecture: '茨城県', city: '鹿嶋市', lat: 35.9658, lng: 140.6447 },
  
  // 栃木
  '028': { prefecture: '栃木県', city: '宇都宮市', lat: 36.5551, lng: 139.8828 },
  '0282': { prefecture: '栃木県', city: '栃木市', lat: 36.3821, lng: 139.7297 },
  '0283': { prefecture: '栃木県', city: '佐野市', lat: 36.3143, lng: 139.5779 },
  '0284': { prefecture: '栃木県', city: '足利市', lat: 36.3413, lng: 139.4496 },
  '0285': { prefecture: '栃木県', city: '小山市', lat: 36.3143, lng: 139.8004 },
  '0286': { prefecture: '栃木県', city: '真岡市', lat: 36.4408, lng: 140.0129 },
  '0287': { prefecture: '栃木県', city: '大田原市', lat: 36.8713, lng: 140.0161 },
  '0288': { prefecture: '栃木県', city: '日光市', lat: 36.7199, lng: 139.6988 },
  '0289': { prefecture: '栃木県', city: '鹿沼市', lat: 36.5672, lng: 139.7452 },
  
  // 群馬
  '027': { prefecture: '群馬県', city: '前橋市', lat: 36.3906, lng: 139.0604 },
  '0270': { prefecture: '群馬県', city: '伊勢崎市', lat: 36.3113, lng: 139.1969 },
  '0274': { prefecture: '群馬県', city: '藤岡市', lat: 36.2517, lng: 139.0753 },
  '0276': { prefecture: '群馬県', city: '太田市', lat: 36.2914, lng: 139.3754 },
  '0277': { prefecture: '群馬県', city: '桐生市', lat: 36.4051, lng: 139.3307 },
  '0278': { prefecture: '群馬県', city: '沼田市', lat: 36.6467, lng: 139.0420 },
  '0279': { prefecture: '群馬県', city: '渋川市', lat: 36.4894, lng: 139.0061 },
  
  // 北海道
  '011': { prefecture: '北海道', city: '札幌市', lat: 43.0621, lng: 141.3544 },
  '0123': { prefecture: '北海道', city: '千歳市', lat: 42.8222, lng: 141.6522 },
  '0124': { prefecture: '北海道', city: '北広島市', lat: 42.9864, lng: 141.5644 },
  '0125': { prefecture: '北海道', city: '夕張市', lat: 43.0560, lng: 141.9739 },
  '0126': { prefecture: '北海道', city: '岩見沢市', lat: 43.1963, lng: 141.7757 },
  '0133': { prefecture: '北海道', city: '江別市', lat: 43.1038, lng: 141.5365 },
  '0134': { prefecture: '北海道', city: '小樽市', lat: 43.1907, lng: 140.9947 },
  '0135': { prefecture: '北海道', city: '余市町', lat: 43.1958, lng: 140.7852 },
  '0136': { prefecture: '北海道', city: '倶知安町', lat: 42.9014, lng: 140.7588 },
  '0137': { prefecture: '北海道', city: '長万部町', lat: 42.5139, lng: 140.3811 },
  '0138': { prefecture: '北海道', city: '函館市', lat: 41.7687, lng: 140.7289 },
  '0139': { prefecture: '北海道', city: '八雲町', lat: 42.2556, lng: 140.2656 },
  '0142': { prefecture: '北海道', city: '伊達市', lat: 42.4694, lng: 140.8681 },
  '0143': { prefecture: '北海道', city: '室蘭市', lat: 42.3153, lng: 140.9736 },
  '0144': { prefecture: '北海道', city: '苫小牧市', lat: 42.6341, lng: 141.6055 },
  '0145': { prefecture: '北海道', city: '厚真町', lat: 42.7243, lng: 141.8781 },
  '0146': { prefecture: '北海道', city: '新ひだか町', lat: 42.3417, lng: 142.3669 },
  '0152': { prefecture: '北海道', city: '網走市', lat: 44.0206, lng: 144.2735 },
  '0153': { prefecture: '北海道', city: '標津町', lat: 43.6614, lng: 145.1319 },
  '0154': { prefecture: '北海道', city: '釧路市', lat: 42.9849, lng: 144.3820 },
  '0155': { prefecture: '北海道', city: '帯広市', lat: 42.9240, lng: 143.1961 },
  '0156': { prefecture: '北海道', city: '本別町', lat: 43.1252, lng: 143.6104 },
  '0157': { prefecture: '北海道', city: '北見市', lat: 43.8038, lng: 143.8910 },
  '0158': { prefecture: '北海道', city: '紋別市', lat: 44.3563, lng: 143.3543 },
  '0162': { prefecture: '北海道', city: '稚内市', lat: 45.4155, lng: 141.6728 },
  '0163': { prefecture: '北海道', city: '天塩町', lat: 44.8875, lng: 141.7467 },
  '0164': { prefecture: '北海道', city: '留萌市', lat: 43.9408, lng: 141.6360 },
  '0165': { prefecture: '北海道', city: '士別市', lat: 44.1783, lng: 142.4000 },
  '0166': { prefecture: '北海道', city: '旭川市', lat: 43.7706, lng: 142.3650 },
  '0167': { prefecture: '北海道', city: '富良野市', lat: 43.3421, lng: 142.3831 },
  
  // 宮城
  '022': { prefecture: '宮城県', city: '仙台市', lat: 38.2688, lng: 140.8721 },
  '0220': { prefecture: '宮城県', city: '岩沼市', lat: 38.1044, lng: 140.8701 },
  '0223': { prefecture: '宮城県', city: '岩沼市', lat: 38.1044, lng: 140.8701 },
  '0224': { prefecture: '宮城県', city: '白石市', lat: 38.0019, lng: 140.6198 },
  '0225': { prefecture: '宮城県', city: '石巻市', lat: 38.4345, lng: 141.3029 },
  '0226': { prefecture: '宮城県', city: '気仙沼市', lat: 38.9080, lng: 141.5696 },
  '0228': { prefecture: '宮城県', city: '栗原市', lat: 38.7305, lng: 141.0218 },
  '0229': { prefecture: '宮城県', city: '大崎市', lat: 38.5763, lng: 140.9546 },
  
  // 福島
  '024': { prefecture: '福島県', city: '福島市', lat: 37.7609, lng: 140.4748 },
  '0240': { prefecture: '福島県', city: '相馬市', lat: 37.7963, lng: 140.9195 },
  '0241': { prefecture: '福島県', city: '会津若松市', lat: 37.4948, lng: 139.9298 },
  '0242': { prefecture: '福島県', city: '会津若松市', lat: 37.4948, lng: 139.9298 },
  '0243': { prefecture: '福島県', city: '二本松市', lat: 37.5849, lng: 140.4315 },
  '0244': { prefecture: '福島県', city: '南相馬市', lat: 37.6423, lng: 140.9576 },
  '0246': { prefecture: '福島県', city: 'いわき市', lat: 37.0505, lng: 140.8878 },
  '0247': { prefecture: '福島県', city: '須賀川市', lat: 37.2859, lng: 140.3721 },
  '0248': { prefecture: '福島県', city: '白河市', lat: 37.1260, lng: 140.2115 },
  '0249': { prefecture: '福島県', city: '郡山市', lat: 37.4003, lng: 140.3596 },
  
  // 静岡
  '053': { prefecture: '静岡県', city: '浜松市', lat: 34.7108, lng: 137.7261 },
  '054': { prefecture: '静岡県', city: '静岡市', lat: 34.9769, lng: 138.3831 },
  '0537': { prefecture: '静岡県', city: '掛川市', lat: 34.7692, lng: 138.0147 },
  '0538': { prefecture: '静岡県', city: '磐田市', lat: 34.7181, lng: 137.8506 },
  '0539': { prefecture: '静岡県', city: '袋井市', lat: 34.7505, lng: 137.9248 },
  '0544': { prefecture: '静岡県', city: '富士宮市', lat: 35.2214, lng: 138.6225 },
  '0545': { prefecture: '静岡県', city: '富士市', lat: 35.1613, lng: 138.6760 },
  '0547': { prefecture: '静岡県', city: '島田市', lat: 34.8363, lng: 138.1767 },
  '0548': { prefecture: '静岡県', city: '牧之原市', lat: 34.7401, lng: 138.2236 },
  '0550': { prefecture: '静岡県', city: '御殿場市', lat: 35.3085, lng: 138.9325 },
  '0557': { prefecture: '静岡県', city: '伊東市', lat: 34.9659, lng: 139.1019 },
  '0558': { prefecture: '静岡県', city: '下田市', lat: 34.6794, lng: 138.9452 },
  
  // 岐阜
  '058': { prefecture: '岐阜県', city: '岐阜市', lat: 35.4232, lng: 136.7606 },
  '0572': { prefecture: '岐阜県', city: '多治見市', lat: 35.3316, lng: 137.1313 },
  '0573': { prefecture: '岐阜県', city: '中津川市', lat: 35.4877, lng: 137.5033 },
  '0574': { prefecture: '岐阜県', city: '美濃加茂市', lat: 35.4394, lng: 137.0154 },
  '0575': { prefecture: '岐阜県', city: '関市', lat: 35.4902, lng: 136.9179 },
  '0576': { prefecture: '岐阜県', city: '下呂市', lat: 35.8035, lng: 137.2449 },
  '0577': { prefecture: '岐阜県', city: '高山市', lat: 36.1461, lng: 137.2521 },
  '0578': { prefecture: '岐阜県', city: '飛騨市', lat: 36.2384, lng: 137.1867 },
  '0581': { prefecture: '岐阜県', city: '山県市', lat: 35.5072, lng: 136.7817 },
  '0582': { prefecture: '岐阜県', city: '瑞穂市', lat: 35.4001, lng: 136.6911 },
  '0583': { prefecture: '岐阜県', city: '各務原市', lat: 35.3988, lng: 136.8486 },
  '0584': { prefecture: '岐阜県', city: '大垣市', lat: 35.3667, lng: 136.6178 },
  '0585': { prefecture: '岐阜県', city: '揖斐川町', lat: 35.4874, lng: 136.5691 },
  
  // 福岡
  '092': { prefecture: '福岡県', city: '福岡市', lat: 33.6064, lng: 130.4183 },
  '093': { prefecture: '福岡県', city: '北九州市', lat: 33.8835, lng: 130.8751 },
  '0940': { prefecture: '福岡県', city: '宗像市', lat: 33.8052, lng: 130.5389 },
  '0942': { prefecture: '福岡県', city: '久留米市', lat: 33.3195, lng: 130.5089 },
  '0943': { prefecture: '福岡県', city: 'うきは市', lat: 33.3472, lng: 130.7550 },
  '0944': { prefecture: '福岡県', city: '大牟田市', lat: 33.0301, lng: 130.4458 },
  '0946': { prefecture: '福岡県', city: '朝倉市', lat: 33.4232, lng: 130.6642 },
  '0947': { prefecture: '福岡県', city: '田川市', lat: 33.6384, lng: 130.8062 },
  '0948': { prefecture: '福岡県', city: '飯塚市', lat: 33.6458, lng: 130.6915 },
  '0949': { prefecture: '福岡県', city: '直方市', lat: 33.7444, lng: 130.7303 },
  '0930': { prefecture: '福岡県', city: '行橋市', lat: 33.7286, lng: 130.9833 },
  
  // 京都
  '075': { prefecture: '京都府', city: '京都市', lat: 35.0116, lng: 135.7681 },
  '0771': { prefecture: '京都府', city: '亀岡市', lat: 35.0136, lng: 135.5737 },
  '0772': { prefecture: '京都府', city: '宮津市', lat: 35.5355, lng: 135.1956 },
  '0773': { prefecture: '京都府', city: '福知山市', lat: 35.2968, lng: 135.1262 },
  '0774': { prefecture: '京都府', city: '宇治市', lat: 34.8845, lng: 135.7998 },
  
  // 兵庫
  '078': { prefecture: '兵庫県', city: '神戸市', lat: 34.6901, lng: 135.1955 },
  '0790': { prefecture: '兵庫県', city: '加西市', lat: 34.9270, lng: 134.8396 },
  '0791': { prefecture: '兵庫県', city: 'たつの市', lat: 34.8578, lng: 134.5458 },
  '0792': { prefecture: '兵庫県', city: '姫路市', lat: 34.8151, lng: 134.6852 },
  '0794': { prefecture: '兵庫県', city: '三木市', lat: 34.7970, lng: 134.9901 },
  '0795': { prefecture: '兵庫県', city: '西脇市', lat: 34.9927, lng: 134.9696 },
  '0796': { prefecture: '兵庫県', city: '豊岡市', lat: 35.5448, lng: 134.8203 },
  '0797': { prefecture: '兵庫県', city: '芦屋市', lat: 34.7270, lng: 135.3041 },
  '0798': { prefecture: '兵庫県', city: '西宮市', lat: 34.7376, lng: 135.3419 },
  '0799': { prefecture: '兵庫県', city: '洲本市', lat: 34.3432, lng: 134.8956 },
  '079': { prefecture: '兵庫県', city: '姫路市', lat: 34.8151, lng: 134.6852 },
  '072-7': { prefecture: '兵庫県', city: '宝塚市', lat: 34.7997, lng: 135.3609 },
  '072-8': { prefecture: '兵庫県', city: '伊丹市', lat: 34.7841, lng: 135.4009 },
  '072-9': { prefecture: '兵庫県', city: '川西市', lat: 34.8303, lng: 135.4170 },
  
  // 長野
  '026': { prefecture: '長野県', city: '長野市', lat: 36.6513, lng: 138.1810 },
  '0260': { prefecture: '長野県', city: '伊那市', lat: 35.8276, lng: 137.9537 },
  '0261': { prefecture: '長野県', city: '大町市', lat: 36.5030, lng: 137.8521 },
  '0262': { prefecture: '長野県', city: '須坂市', lat: 36.6510, lng: 138.3070 },
  '0263': { prefecture: '長野県', city: '松本市', lat: 36.2380, lng: 137.9720 },
  '0264': { prefecture: '長野県', city: '木曽町', lat: 35.8426, lng: 137.6907 },
  '0265': { prefecture: '長野県', city: '飯田市', lat: 35.5148, lng: 137.8215 },
  '0266': { prefecture: '長野県', city: '諏訪市', lat: 36.0391, lng: 138.1137 },
  '0267': { prefecture: '長野県', city: '佐久市', lat: 36.2491, lng: 138.4770 },
  '0268': { prefecture: '長野県', city: '上田市', lat: 36.4018, lng: 138.2487 },
  '0269': { prefecture: '長野県', city: '中野市', lat: 36.7419, lng: 138.3692 },
  
  // 新潟
  '025': { prefecture: '新潟県', city: '新潟市', lat: 37.9024, lng: 139.0236 },
  '0250': { prefecture: '新潟県', city: '五泉市', lat: 37.7427, lng: 139.1816 },
  '0254': { prefecture: '新潟県', city: '新発田市', lat: 37.9476, lng: 139.3280 },
  '0255': { prefecture: '新潟県', city: '妙高市', lat: 37.0264, lng: 138.2537 },
  '0256': { prefecture: '新潟県', city: '三条市', lat: 37.6356, lng: 138.9639 },
  '0257': { prefecture: '新潟県', city: '柏崎市', lat: 37.3718, lng: 138.5590 },
  '0258': { prefecture: '新潟県', city: '長岡市', lat: 37.4468, lng: 138.8514 },
  '0259': { prefecture: '新潟県', city: '佐渡市', lat: 38.0183, lng: 138.3682 },
  
  // 石川
  '076': { prefecture: '石川県', city: '金沢市', lat: 36.5611, lng: 136.6563 },
  '0761': { prefecture: '石川県', city: '小松市', lat: 36.4023, lng: 136.4525 },
  '0762': { prefecture: '石川県', city: '加賀市', lat: 36.3028, lng: 136.3149 },
  '0767': { prefecture: '石川県', city: '七尾市', lat: 37.0427, lng: 136.9625 },
  '0768': { prefecture: '石川県', city: '輪島市', lat: 37.3908, lng: 136.8991 },
  
  // 富山
  '076-4': { prefecture: '富山県', city: '富山市', lat: 36.6953, lng: 137.2114 },
  '0763': { prefecture: '富山県', city: '南砺市', lat: 36.5555, lng: 136.8774 },
  '0764': { prefecture: '富山県', city: '氷見市', lat: 36.8565, lng: 136.9875 },
  '0765': { prefecture: '富山県', city: '魚津市', lat: 36.8267, lng: 137.4089 },
  '0766': { prefecture: '富山県', city: '高岡市', lat: 36.7526, lng: 137.0285 },
  
  // 福井
  '0776': { prefecture: '福井県', city: '福井市', lat: 36.0652, lng: 136.2216 },
  '0770': { prefecture: '福井県', city: '敦賀市', lat: 35.6455, lng: 136.0556 },
  '0778': { prefecture: '福井県', city: '越前市', lat: 35.9041, lng: 136.1674 },
  '0779': { prefecture: '福井県', city: '大野市', lat: 35.9795, lng: 136.4873 },
  
  // 三重
  '059': { prefecture: '三重県', city: '津市', lat: 34.7185, lng: 136.5056 },
  '0593': { prefecture: '三重県', city: '四日市市', lat: 34.9652, lng: 136.6244 },
  '0594': { prefecture: '三重県', city: '桑名市', lat: 35.0623, lng: 136.6839 },
  '0595': { prefecture: '三重県', city: '伊賀市', lat: 34.7685, lng: 136.1299 },
  '0596': { prefecture: '三重県', city: '伊勢市', lat: 34.4876, lng: 136.7098 },
  '0597': { prefecture: '三重県', city: '尾鷲市', lat: 34.0707, lng: 136.1907 },
  '0598': { prefecture: '三重県', city: '松阪市', lat: 34.5780, lng: 136.5270 },
  '0599': { prefecture: '三重県', city: '鳥羽市', lat: 34.4810, lng: 136.8447 },
  
  // 滋賀
  '077': { prefecture: '滋賀県', city: '大津市', lat: 35.0045, lng: 135.8686 },
  '0740': { prefecture: '滋賀県', city: '高島市', lat: 35.3525, lng: 136.0359 },
  '0748': { prefecture: '滋賀県', city: '近江八幡市', lat: 35.1283, lng: 136.0982 },
  '0749': { prefecture: '滋賀県', city: '彦根市', lat: 35.2744, lng: 136.2596 },
  
  // 奈良
  '0742': { prefecture: '奈良県', city: '奈良市', lat: 34.6851, lng: 135.8048 },
  '0743': { prefecture: '奈良県', city: '生駒市', lat: 34.6919, lng: 135.7005 },
  '0744': { prefecture: '奈良県', city: '橿原市', lat: 34.5093, lng: 135.7928 },
  '0745': { prefecture: '奈良県', city: '大和高田市', lat: 34.5150, lng: 135.7363 },
  '0746': { prefecture: '奈良県', city: '吉野町', lat: 34.3928, lng: 135.8584 },
  '0747': { prefecture: '奈良県', city: '五條市', lat: 34.3521, lng: 135.6945 },
  
  // 和歌山
  '073': { prefecture: '和歌山県', city: '和歌山市', lat: 34.2261, lng: 135.1675 },
  '0734': { prefecture: '和歌山県', city: '海南市', lat: 34.1556, lng: 135.2093 },
  '0735': { prefecture: '和歌山県', city: '新宮市', lat: 33.7254, lng: 135.9958 },
  '0736': { prefecture: '和歌山県', city: '橋本市', lat: 34.3151, lng: 135.6044 },
  '0737': { prefecture: '和歌山県', city: '有田市', lat: 34.0830, lng: 135.1273 },
  '0738': { prefecture: '和歌山県', city: '御坊市', lat: 33.8914, lng: 135.1517 },
  '0739': { prefecture: '和歌山県', city: '田辺市', lat: 33.7294, lng: 135.3778 },
  
  // 岡山
  '086': { prefecture: '岡山県', city: '岡山市', lat: 34.6551, lng: 133.9195 },
  '0863': { prefecture: '岡山県', city: '玉野市', lat: 34.4919, lng: 133.9460 },
  '0864': { prefecture: '岡山県', city: '笠岡市', lat: 34.5070, lng: 133.5070 },
  '0865': { prefecture: '岡山県', city: '井原市', lat: 34.5971, lng: 133.4617 },
  '0866': { prefecture: '岡山県', city: '高梁市', lat: 34.7906, lng: 133.6168 },
  '0867': { prefecture: '岡山県', city: '新見市', lat: 34.9781, lng: 133.4706 },
  '0868': { prefecture: '岡山県', city: '津山市', lat: 35.0703, lng: 134.0044 },
  '0869': { prefecture: '岡山県', city: '瀬戸内市', lat: 34.6651, lng: 134.0925 },
  
  // 広島
  '082': { prefecture: '広島県', city: '広島市', lat: 34.3966, lng: 132.4596 },
  '0823': { prefecture: '広島県', city: '呉市', lat: 34.2493, lng: 132.5660 },
  '0824': { prefecture: '広島県', city: '三次市', lat: 34.8056, lng: 132.8520 },
  '0826': { prefecture: '広島県', city: '庄原市', lat: 34.8581, lng: 133.0167 },
  '0829': { prefecture: '広島県', city: '廿日市市', lat: 34.3485, lng: 132.3317 },
  '084': { prefecture: '広島県', city: '福山市', lat: 34.4858, lng: 133.3625 },
  '0845': { prefecture: '広島県', city: '因島市', lat: 34.3188, lng: 133.1800 },
  '0846': { prefecture: '広島県', city: '竹原市', lat: 34.3417, lng: 132.9068 },
  '0847': { prefecture: '広島県', city: '三原市', lat: 34.3966, lng: 133.0794 },
  '0848': { prefecture: '広島県', city: '尾道市', lat: 34.4085, lng: 133.2050 },
  '0849': { prefecture: '広島県', city: '府中市', lat: 34.5686, lng: 133.2361 },
  
  // 山口
  '083': { prefecture: '山口県', city: '下関市', lat: 33.9575, lng: 130.9408 },
  '0820': { prefecture: '山口県', city: '柳井市', lat: 33.9633, lng: 132.1015 },
  '0827': { prefecture: '山口県', city: '岩国市', lat: 34.1669, lng: 132.2201 },
  '0833': { prefecture: '山口県', city: '光市', lat: 33.9620, lng: 131.9424 },
  '0834': { prefecture: '山口県', city: '下松市', lat: 34.0152, lng: 131.8724 },
  '0835': { prefecture: '山口県', city: '防府市', lat: 34.0519, lng: 131.5638 },
  '0836': { prefecture: '山口県', city: '宇部市', lat: 33.9515, lng: 131.2468 },
  '0837': { prefecture: '山口県', city: '長門市', lat: 34.3713, lng: 131.1822 },
  '0838': { prefecture: '山口県', city: '萩市', lat: 34.4083, lng: 131.3992 },
  
  // 香川
  '087': { prefecture: '香川県', city: '高松市', lat: 34.3401, lng: 134.0434 },
  '0875': { prefecture: '香川県', city: '観音寺市', lat: 34.1277, lng: 133.6615 },
  '0877': { prefecture: '香川県', city: '丸亀市', lat: 34.2901, lng: 133.7973 },
  '0879': { prefecture: '香川県', city: 'さぬき市', lat: 34.3244, lng: 134.1722 },
  
  // 愛媛
  '089': { prefecture: '愛媛県', city: '松山市', lat: 33.8392, lng: 132.7658 },
  '0893': { prefecture: '愛媛県', city: '大洲市', lat: 33.5071, lng: 132.5451 },
  '0894': { prefecture: '愛媛県', city: '八幡浜市', lat: 33.4629, lng: 132.4228 },
  '0895': { prefecture: '愛媛県', city: '宇和島市', lat: 33.2274, lng: 132.5452 },
  '0896': { prefecture: '愛媛県', city: '西条市', lat: 33.9201, lng: 133.1828 },
  '0897': { prefecture: '愛媛県', city: '新居浜市', lat: 33.9603, lng: 133.2835 },
  '0898': { prefecture: '愛媛県', city: '今治市', lat: 34.0663, lng: 132.9979 },
  
  // 佐賀
  '095-2': { prefecture: '佐賀県', city: '佐賀市', lat: 33.2494, lng: 130.2988 },
  '0952': { prefecture: '佐賀県', city: '佐賀市', lat: 33.2494, lng: 130.2988 },
  '0954': { prefecture: '佐賀県', city: '武雄市', lat: 33.1935, lng: 130.0190 },
  '0955': { prefecture: '佐賀県', city: '唐津市', lat: 33.4504, lng: 129.9686 },
  
  // 長崎
  '095': { prefecture: '長崎県', city: '長崎市', lat: 32.7448, lng: 129.8737 },
  '0956': { prefecture: '長崎県', city: '佐世保市', lat: 33.1807, lng: 129.7150 },
  '0957': { prefecture: '長崎県', city: '大村市', lat: 32.9001, lng: 129.9586 },
  '0959': { prefecture: '長崎県', city: '平戸市', lat: 33.3605, lng: 129.5531 },
  
  // 熊本
  '096': { prefecture: '熊本県', city: '熊本市', lat: 32.7898, lng: 130.7417 },
  '0964': { prefecture: '熊本県', city: '宇土市', lat: 32.6871, lng: 130.6581 },
  '0965': { prefecture: '熊本県', city: '八代市', lat: 32.5057, lng: 130.6003 },
  '0966': { prefecture: '熊本県', city: '人吉市', lat: 32.2096, lng: 130.7641 },
  '0967': { prefecture: '熊本県', city: '阿蘇市', lat: 32.9516, lng: 131.1221 },
  '0968': { prefecture: '熊本県', city: '玉名市', lat: 32.9286, lng: 130.5592 },
  '0969': { prefecture: '熊本県', city: '天草市', lat: 32.4589, lng: 130.1923 },
  
  // 大分
  '097': { prefecture: '大分県', city: '大分市', lat: 33.2382, lng: 131.6126 },
  '0972': { prefecture: '大分県', city: '佐伯市', lat: 32.9595, lng: 131.9011 },
  '0973': { prefecture: '大分県', city: '日田市', lat: 33.3215, lng: 130.9410 },
  '0974': { prefecture: '大分県', city: '竹田市', lat: 32.9743, lng: 131.3991 },
  '0977': { prefecture: '大分県', city: '別府市', lat: 33.2846, lng: 131.4912 },
  '0978': { prefecture: '大分県', city: '中津市', lat: 33.5984, lng: 131.1877 },
  '0979': { prefecture: '大分県', city: '宇佐市', lat: 33.5346, lng: 131.3515 },
  
  // 宮崎
  '0982': { prefecture: '宮崎県', city: '延岡市', lat: 32.5815, lng: 131.6648 },
  '0983': { prefecture: '宮崎県', city: '日向市', lat: 32.4215, lng: 131.6243 },
  '0984': { prefecture: '宮崎県', city: '小林市', lat: 31.9973, lng: 130.9742 },
  '0985': { prefecture: '宮崎県', city: '宮崎市', lat: 31.9111, lng: 131.4239 },
  '0986': { prefecture: '宮崎県', city: '都城市', lat: 31.7199, lng: 131.0615 },
  '0987': { prefecture: '宮崎県', city: '日南市', lat: 31.5996, lng: 131.3790 },
  
  // 鹿児島
  '099': { prefecture: '鹿児島県', city: '鹿児島市', lat: 31.5602, lng: 130.5581 },
  '0993': { prefecture: '鹿児島県', city: '指宿市', lat: 31.2511, lng: 130.6331 },
  '0994': { prefecture: '鹿児島県', city: '鹿屋市', lat: 31.3783, lng: 130.8525 },
  '0995': { prefecture: '鹿児島県', city: '霧島市', lat: 31.7427, lng: 130.7626 },
  '0996': { prefecture: '鹿児島県', city: '薩摩川内市', lat: 31.8142, lng: 130.3042 },
  '0997': { prefecture: '鹿児島県', city: '奄美市', lat: 28.3769, lng: 129.4936 },
  
  // 沖縄
  '098': { prefecture: '沖縄県', city: '那覇市', lat: 26.2124, lng: 127.6809 },
  '0980': { prefecture: '沖縄県', city: '石垣市', lat: 24.3448, lng: 124.1572 },
  
  // 青森
  '017': { prefecture: '青森県', city: '青森市', lat: 40.8246, lng: 140.7406 },
  '0172': { prefecture: '青森県', city: '弘前市', lat: 40.6031, lng: 140.4641 },
  '0173': { prefecture: '青森県', city: '五所川原市', lat: 40.8082, lng: 140.4430 },
  '0174': { prefecture: '青森県', city: 'むつ市', lat: 41.2924, lng: 141.1836 },
  '0175': { prefecture: '青森県', city: 'むつ市', lat: 41.2924, lng: 141.1836 },
  '0176': { prefecture: '青森県', city: '十和田市', lat: 40.6127, lng: 141.2059 },
  '0178': { prefecture: '青森県', city: '八戸市', lat: 40.5124, lng: 141.4885 },
  '0179': { prefecture: '青森県', city: '三沢市', lat: 40.6831, lng: 141.3692 },
  
  // 岩手
  '019': { prefecture: '岩手県', city: '盛岡市', lat: 39.7036, lng: 141.1527 },
  '0191': { prefecture: '岩手県', city: '一関市', lat: 38.9341, lng: 141.1265 },
  '0192': { prefecture: '岩手県', city: '大船渡市', lat: 39.0816, lng: 141.7085 },
  '0193': { prefecture: '岩手県', city: '釜石市', lat: 39.2761, lng: 141.8840 },
  '0194': { prefecture: '岩手県', city: '遠野市', lat: 39.3290, lng: 141.5335 },
  '0195': { prefecture: '岩手県', city: '二戸市', lat: 40.2703, lng: 141.3056 },
  '0197': { prefecture: '岩手県', city: '奥州市', lat: 39.1447, lng: 141.1398 },
  '0198': { prefecture: '岩手県', city: '花巻市', lat: 39.3887, lng: 141.1133 },
  
  // 秋田
  '018': { prefecture: '秋田県', city: '秋田市', lat: 39.7186, lng: 140.1024 },
  '0182': { prefecture: '秋田県', city: '横手市', lat: 39.3099, lng: 140.5563 },
  '0183': { prefecture: '秋田県', city: '湯沢市', lat: 39.1649, lng: 140.4954 },
  '0184': { prefecture: '秋田県', city: 'にかほ市', lat: 39.2036, lng: 139.9083 },
  '0185': { prefecture: '秋田県', city: '能代市', lat: 40.2133, lng: 140.0258 },
  '0186': { prefecture: '秋田県', city: '大館市', lat: 40.2722, lng: 140.5547 },
  '0187': { prefecture: '秋田県', city: '大仙市', lat: 39.4533, lng: 140.4769 },
  
  // 山形
  '023': { prefecture: '山形県', city: '山形市', lat: 38.2405, lng: 140.3636 },
  '0233': { prefecture: '山形県', city: '新庄市', lat: 38.7648, lng: 140.3014 },
  '0234': { prefecture: '山形県', city: '酒田市', lat: 38.9146, lng: 139.8366 },
  '0235': { prefecture: '山形県', city: '鶴岡市', lat: 38.7276, lng: 139.8268 },
  '0236': { prefecture: '山形県', city: '東根市', lat: 38.4314, lng: 140.3914 },
  '0237': { prefecture: '山形県', city: '寒河江市', lat: 38.3809, lng: 140.2767 },
  '0238': { prefecture: '山形県', city: '米沢市', lat: 37.9221, lng: 140.1170 },
};

// 市外局番の正規化（ハイフンを除去）
function normalizeAreaCode(phone: string): string {
  return phone.replace(/[-\s　]/g, '');
}

// 電話番号から市外局番を抽出（改善版）
function extractAreaCode(phone: string): string | null {
  const normalized = normalizeAreaCode(phone);
  
  // 0120などの特殊番号は除外
  if (normalized.startsWith('0120') || normalized.startsWith('0800')) {
    return null;
  }
  
  // 携帯電話は除外
  if (/^0[789]0/.test(normalized)) {
    return null;
  }
  
  // 088番号の特別処理
  if (normalized.startsWith('088')) {
    // 4桁の088xをまずチェック
    const fourDigit = normalized.substring(0, 4);
    if (areaCodeDatabase[fourDigit]) {
      return fourDigit;
    }
    
    // 次に088-xパターンをチェック
    if (normalized.length >= 4) {
      const fourthDigit = normalized.charAt(3);
      const hyphenPattern = '088-' + fourthDigit;
      if (areaCodeDatabase[hyphenPattern]) {
        return hyphenPattern;
      }
    }
  }
  
  // 055番号の特別処理（055-9は静岡県沼津市）
  if (normalized.startsWith('055')) {
    if (normalized.length >= 4 && normalized.charAt(3) === '9') {
      return '055-9';
    }
  }
  
  // 04番号の特別処理
  if (normalized.startsWith('04')) {
    // 04-2958（狭山市）のような特殊ケース
    if (normalized.startsWith('042958')) {
      return '04-2958';
    }
    // 042xxx（東京都多摩地区）
    if (normalized.startsWith('042')) {
      return '042';
    }
    // 04-2（所沢市）
    if (normalized.charAt(2) === '2') {
      return '04-2';
    }
    // 04-7（柏市）
    if (normalized.charAt(2) === '7') {
      return '04-7';
    }
  }
  
  // より長い市外局番から順にチェック
  // 5桁チェック（特殊パターン）
  for (let len = 5; len >= 2; len--) {
    if (normalized.length >= len) {
      const prefix = normalized.substring(0, len);
      if (areaCodeDatabase[prefix]) {
        return prefix;
      }
    }
  }
  
  // ハイフン付きパターンのチェック（xx-x形式）
  if (normalized.length >= 3) {
    const hyphenPattern = normalized.substring(0, 2) + '-' + normalized.substring(2, 3);
    if (areaCodeDatabase[hyphenPattern]) {
      return hyphenPattern;
    }
  }
  
  // xxx-x形式のチェック
  if (normalized.length >= 4) {
    const hyphenPattern = normalized.substring(0, 3) + '-' + normalized.substring(3, 4);
    if (areaCodeDatabase[hyphenPattern]) {
      return hyphenPattern;
    }
  }
  
  return null;
}

// ZEHデータから電話番号を取得
async function getPhoneNumberFromZEH(companyName: string): Promise<string | null> {
  try {
    // 全CSVファイルから該当する会社を検索
    const files = fs.readdirSync('data/zeh').filter(f => f.endsWith('.csv'));
    
    for (const file of files) {
      const csvPath = path.join('data/zeh', file);
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true
      });
      
      const record = records.find((r: any) => r['登録名称（屋号）'] === companyName);
      if (record && record['電話番号']) {
        return record['電話番号'];
      }
    }
    
    return null;
  } catch (error) {
    console.error('ZEHデータ読み込みエラー:', error);
    return null;
  }
}

// メイン処理
async function setAddressFromPhoneNumbers() {
  console.log('📞 市外局番から住所と座標を設定します...\n');
  
  try {
    // 住所が設定されていない会社を取得
    const companies = await prisma.company.findMany({
      where: {
        gBizData: {
          equals: Prisma.DbNull
        }
      }
    });
    
    console.log(`📊 処理対象: ${companies.length}社\n`);
    
    let successCount = 0;
    let phoneNotFound = 0;
    let areaCodeNotFound = 0;
    let mobileOrSpecial = 0;
    const byPrefecture: { [key: string]: number } = {};
    
    for (const company of companies) {
      // ZEHデータから電話番号を取得
      const phoneNumber = await getPhoneNumberFromZEH(company.name);
      
      if (!phoneNumber) {
        phoneNotFound++;
        continue;
      }
      
      // 市外局番を抽出
      const areaCode = extractAreaCode(phoneNumber);
      
      if (!areaCode) {
        if (/^0120|^0800|^0[789]0/.test(phoneNumber)) {
          mobileOrSpecial++;
        } else {
          areaCodeNotFound++;
          console.log(`⚠️  ${company.name}: 市外局番が見つかりません (${phoneNumber})`);
        }
        continue;
      }
      
      // 市外局番から住所情報を取得
      const locationInfo = areaCodeDatabase[areaCode];
      if (!locationInfo) {
        areaCodeNotFound++;
        console.log(`⚠️  ${company.name}: 市外局番 ${areaCode} の情報がありません`);
        continue;
      }
      
      // 都道府県別カウント
      byPrefecture[locationInfo.prefecture] = (byPrefecture[locationInfo.prefecture] || 0) + 1;
      
      // データベースを更新
      await prisma.company.update({
        where: { id: company.id },
        data: {
          gBizData: {
            phoneNumber: phoneNumber,
            areaCode: areaCode,
            address: `${locationInfo.prefecture}${locationInfo.city}`,
            prefecture: locationInfo.prefecture,
            city: locationInfo.city,
            coordinates: {
              lat: locationInfo.lat,
              lng: locationInfo.lng
            },
            source: 'area_code',
            method: 'phone_number_area_code',
            lastUpdated: new Date().toISOString()
          } as Prisma.InputJsonValue,
          gBizLastUpdated: new Date()
        }
      });
      
      successCount++;
      console.log(`✅ ${company.name}: ${phoneNumber} → ${locationInfo.prefecture}${locationInfo.city}`);
    }
    
    console.log('\n=== 処理完了 ===');
    console.log(`✅ 成功: ${successCount}社`);
    console.log(`❌ 電話番号なし: ${phoneNotFound}社`);
    console.log(`⚠️  市外局番不明: ${areaCodeNotFound}社`);
    console.log(`📱 携帯/特殊番号: ${mobileOrSpecial}社`);
    
    console.log('\n📍 都道府県別処理数:');
    Object.entries(byPrefecture)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([pref, count]) => {
        console.log(`   ${pref}: ${count}社`);
      });
    
    // 統計情報
    const totalWithAddress = await prisma.company.count({
      where: {
        gBizData: {
          not: Prisma.DbNull
        }
      }
    });
    
    console.log(`\n📊 総計: ${totalWithAddress}社に住所・座標情報あり`);
    
    console.log('\n💡 次のステップ:');
    console.log('1. 市区町村ページで会社が表示されることを確認');
    console.log('   npm run dev');
    console.log('   http://localhost:3000/area/ibaraki/mito-shi');
    console.log('\n2. 残りの会社には別の方法で住所を設定');
    console.log('   - サービスエリアベースの推定');
    console.log('   - 手動での住所入力');
    
  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 統計のみ表示
async function showStats() {
  const withAddress = await prisma.company.count({
    where: {
      gBizData: {
        not: Prisma.DbNull
      }
    }
  });
  
  const withoutAddress = await prisma.company.count({
    where: {
      gBizData: {
        equals: Prisma.DbNull
      }
    }
  });
  
  console.log('📊 現在の住所設定状況:');
  console.log(`   住所あり: ${withAddress}社`);
  console.log(`   住所なし: ${withoutAddress}社`);
}

// 既存のデータを確認して修正
async function checkAndFixExistingData() {
  console.log("📊 既存データの確認と修正...\n");
  
  // 088番号を持つ会社を確認
  const companies = await prisma.company.findMany({
    where: {
      gBizData: {
        path: ['phoneNumber'],
        string_starts_with: '088'
      }
    }
  });

  console.log(`088番号を持つ会社: ${companies.length}社\n`);
  
  let fixedCount = 0;
  
  for (const company of companies) {
    const gBizData = company.gBizData as any;
    const phone = gBizData.phoneNumber;
    const areaCode = extractAreaCode(phone);
    
    if (areaCode) {
      const locationInfo = areaCodeDatabase[areaCode];
      if (locationInfo && gBizData.prefecture !== locationInfo.prefecture) {
        console.log(`修正: ${company.name}`);
        console.log(`  電話: ${phone}`);
        console.log(`  市外局番: ${areaCode}`);
        console.log(`  ${gBizData.prefecture} → ${locationInfo.prefecture}\n`);
        
        await prisma.company.update({
          where: { id: company.id },
          data: {
            gBizData: {
              ...gBizData,
              prefecture: locationInfo.prefecture,
              city: locationInfo.city,
              areaCode: areaCode
            }
          }
        });
        
        fixedCount++;
      }
    }
  }
  
  console.log(`\n✅ 088番号の修正完了: ${fixedCount}社`);
  
  // 0586番号も確認
  const companiesWith0586 = await prisma.company.findMany({
    where: {
      gBizData: {
        path: ['phoneNumber'],
        string_starts_with: '0586'
      }
    }
  });
  
  let fixed0586Count = 0;
  console.log(`\n0586番号を持つ会社: ${companiesWith0586.length}社`);
  
  for (const company of companiesWith0586) {
    const gBizData = company.gBizData as any;
    if (gBizData.prefecture !== '愛知県') {
      console.log(`修正: ${company.name} - ${gBizData.prefecture} → 愛知県`);
      
      await prisma.company.update({
        where: { id: company.id },
        data: {
          gBizData: {
            ...gBizData,
            prefecture: '愛知県',
            city: '一宮市'
          }
        }
      });
      fixed0586Count++;
    }
  }
  
  console.log(`\n✅ 0586番号の修正完了: ${fixed0586Count}社`);
  console.log(`\n✅ 合計修正数: ${fixedCount + fixed0586Count}社`);
}

// 実行
const args = process.argv.slice(2);

if (args.includes('--stats')) {
  showStats().then(() => prisma.$disconnect());
} else if (args.includes('--fix')) {
  checkAndFixExistingData().then(() => prisma.$disconnect());
} else {
  setAddressFromPhoneNumbers();
}