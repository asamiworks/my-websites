export interface Clinic {
  id: string
  area: string
  name: string
  googleMapUrl: string
  embedUrl: string
  address: string
  access: string
  category: 'ginza-shinbashi' | 'chiba' | 'kanagawa'
}

export const clinicsData: Clinic[] = [
  // 銀座・新橋エリア
  {
    id: 'ginza-art-clinic',
    area: '銀座',
    name: 'THE GINZA ART CLINIC',
    googleMapUrl: 'https://maps.app.goo.gl/9nZknSVfWh5o24Mh7',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6482.7572060731245!2d139.7565929!3d35.667678599999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b6c62939aa7%3A0x2e181f42082e1664!2sTHE%20GINZA%20ART%20CLINIC!5e0!3m2!1sja!2sjp!4v1754892393083!5m2!1sja!2sjp',
    address: '東京都中央区銀座7-4-12',
    access: '銀座駅 A2出口より徒歩3分',
    category: 'ginza-shinbashi',
  },
  {
    id: 'medical-body-clinic',
    area: '新橋',
    name: '医療ボディクリニック',
    googleMapUrl: 'https://maps.app.goo.gl/9fVdrGEpw2tDuRZN6',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.087671598411!2d139.76759500000003!3d35.6748432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bd5e09eeedb%3A0xebd6098dc530992!2z5Yy755mC44OA44Kk44Ko44OD44OI5bCC6ZaAIERyLuWMu-eZguODnOODh-OCo-OCr-ODquODi-ODg-OCrw!5e0!3m2!1sja!2sjp!4v1754892484698!5m2!1sja!2sjp',
    address: '東京都港区新橋2-5-14',
    access: '新橋駅より徒歩5分',
    category: 'ginza-shinbashi',
  },
  {
    id: 'medical-brow-ginza',
    area: '銀座',
    name: 'メディカルブロー銀座院',
    googleMapUrl: 'https://maps.app.goo.gl/q9GNirhGSMkr58W99',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.271406996577!2d139.760516!3d35.67031860000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b2adf2c97b1%3A0x4c7418d88129f286!2z44Oh44OH44Kj44Kr44Or44OW44Ot44O86YqA5bqn6Zmi!5e0!3m2!1sja!2sjp!4v1754892500264!5m2!1sja!2sjp',
    address: '東京都中央区銀座6-9-7',
    access: '銀座駅 A5出口より徒歩2分',
    category: 'ginza-shinbashi',
  },

  // 柏エリア
  {
    id: 'kashiwa-clinic',
    area: '柏',
    name: '柏院',
    googleMapUrl: 'https://maps.app.goo.gl/ZgDvEkuo6PZ269ZK6',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3233.474593807965!2d139.9710389!3d35.8618848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60189d635384689b%3A0x42daf8b376785178!2z44G544Oq44K544K544Kt44Oz44Kv44Oq44OL44OD44Kv!5e0!3m2!1sja!2sjp!4v1754892513657!5m2!1sja!2sjp',
    address: '千葉県柏市中央町',
    access: '柏駅より徒歩5分',
    category: 'chiba',
  },

  // 横浜エリア
  {
    id: 'medical-brow-yokohama',
    area: '横浜',
    name: 'メディカルブロー横浜院',
    googleMapUrl: 'https://maps.app.goo.gl/Wfj34wpfYa9LxKwn8',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.687949590585!2d139.6229756!3d35.4625191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60185d9bc1c787d5%3A0xa8c413349119f9e2!2z44Oh44OH44Kj44Kr44Or44OW44Ot44O85qiq5rWc6Zmi!5e0!3m2!1sja!2sjp!4v1754892530258!5m2!1sja!2sjp',
    address: '神奈川県横浜市西区',
    access: '横浜駅より徒歩3分',
    category: 'kanagawa',
  },
]

// エリア別にグループ化した提携院データ
export const clinicsByArea = {
  'ginza-shinbashi': clinicsData.filter(clinic => clinic.category === 'ginza-shinbashi'),
  'chiba': clinicsData.filter(clinic => clinic.category === 'chiba'),
  'kanagawa': clinicsData.filter(clinic => clinic.category === 'kanagawa'),
  'all': clinicsData,
}

// カテゴリー別の院数
export const clinicCounts = {
  all: clinicsData.length,
  'ginza-shinbashi': clinicsData.filter(c => c.category === 'ginza-shinbashi').length,
  'chiba': clinicsData.filter(c => c.category === 'chiba').length,
  'kanagawa': clinicsData.filter(c => c.category === 'kanagawa').length,
}

// 診療時間・予約に関する情報
export const clinicInfo = {
  reservation: '完全予約制',
  instagramMain: 'Instagram メインアカウント',
  instagramPara: '@asuka_artmake_para（パラメディカル情報）',
  contact: '公式LINE',
  contactUrl: 'https://lin.ee/bhodgys',
  note: '※各院の詳細な診療時間は、予約時にご確認ください',
}

// アクセスページのSEOテキスト
export const accessSeoContent = {
  'ginza-shinbashi': {
    title: '銀座・新橋エリアの医療アートメイク',
    description: '東京都心からアクセス良好。銀座・新橋エリアに3つの提携院をご用意しています。',
    features: [
      '銀座駅・新橋駅から徒歩5分以内',
      '複数の提携院から選択可能',
      '完全予約制で待ち時間なし',
    ],
  },
  'chiba': {
    title: '千葉県柏市の医療アートメイク',
    description: '千葉県北西部の方に便利な立地。柏駅から徒歩5分でアクセス良好です。',
    features: [
      '柏駅から徒歩5分',
      '千葉県北西部からアクセス良好',
      '完全予約制でプライバシー配慮',
    ],
  },
  'kanagawa': {
    title: '横浜の医療アートメイク',
    description: '神奈川県内からアクセス良好。横浜駅から徒歩3分の便利な立地です。',
    features: [
      '横浜駅から徒歩3分',
      '神奈川県全域からアクセス可能',
      '完全予約制で安心施術',
    ],
  },
}