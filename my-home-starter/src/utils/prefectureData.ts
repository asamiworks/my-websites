// 都道府県の特徴データ
export interface PrefectureFeature {
    name: string;
    description: string;
    averageLandPrice: number; // 万円/坪
    popularAreas: string[];
    characteristics: string[];
  }
  
  // 都道府県の特徴データ
  const prefectureFeatures: { [key: string]: PrefectureFeature } = {
    '北海道': {
      name: '北海道',
      description: '広大な土地と豊かな自然が魅力。土地価格が比較的安く、ゆとりある住まいづくりが可能。',
      averageLandPrice: 10,
      popularAreas: ['札幌市', '旭川市', '函館市'],
      characteristics: ['広い敷地', '寒冷地仕様', '雪対策必須'],
    },
    '青森県': {
      name: '青森県',
      description: '本州最北端の県。りんご栽培や豊かな海産物で有名。冬の寒さ対策が重要。',
      averageLandPrice: 8,
      popularAreas: ['青森市', '八戸市', '弘前市'],
      characteristics: ['寒冷地対応', '雪下ろし対策', '断熱性能重視'],
    },
    '岩手県': {
      name: '岩手県',
      description: '広大な面積を持つ県。盛岡市を中心に発展。自然豊かで子育て環境良好。',
      averageLandPrice: 12,
      popularAreas: ['盛岡市', '一関市', '奥州市'],
      characteristics: ['広い土地', '寒冷地仕様', '地震対策'],
    },
    '宮城県': {
      name: '宮城県',
      description: '東北の中心都市仙台を擁する。都市機能と自然のバランスが良い。',
      averageLandPrice: 25,
      popularAreas: ['仙台市', '石巻市', '大崎市'],
      characteristics: ['都市近郊', '地震対策必須', 'バランス型'],
    },
    '秋田県': {
      name: '秋田県',
      description: '美しい自然と伝統文化が息づく県。きりたんぽや稲庭うどんで有名。',
      averageLandPrice: 7,
      popularAreas: ['秋田市', '横手市', '大仙市'],
      characteristics: ['雪対策', '広い敷地', '伝統工法'],
    },
    '山形県': {
      name: '山形県',
      description: 'さくらんぼの生産量日本一。温泉地も多く、暮らしやすい環境。',
      averageLandPrice: 10,
      popularAreas: ['山形市', '鶴岡市', '酒田市'],
      characteristics: ['果樹園併設可', '温泉近く', '雪対策'],
    },
    '福島県': {
      name: '福島県',
      description: '東北の玄関口。会津・中通り・浜通りの3地域で特色が異なる。',
      averageLandPrice: 15,
      popularAreas: ['福島市', '郡山市', 'いわき市'],
      characteristics: ['地域差大', '温暖な浜通り', '歴史的街並み'],
    },
    '茨城県': {
      name: '茨城県',
      description: '首都圏へのアクセス良好。つくばエクスプレス沿線は特に人気。自然と都市機能のバランスが良い。',
      averageLandPrice: 20,
      popularAreas: ['つくば市', '水戸市', '土浦市'],
      characteristics: ['都心アクセス良好', '研究学園都市', '子育て環境充実'],
    },
    '栃木県': {
      name: '栃木県',
      description: '日光・那須などの観光地を擁する。宇都宮市を中心に発展。',
      averageLandPrice: 15,
      popularAreas: ['宇都宮市', '小山市', '栃木市'],
      characteristics: ['観光地近く', '温泉豊富', '自然環境良好'],
    },
    '群馬県': {
      name: '群馬県',
      description: '温泉地として有名。製造業も盛んで、働く場所も豊富。',
      averageLandPrice: 12,
      popularAreas: ['前橋市', '高崎市', '太田市'],
      characteristics: ['温泉近く', '交通の要衝', '製造業盛ん'],
    },
    '埼玉県': {
      name: '埼玉県',
      description: '東京へのアクセス抜群。ベッドタウンとして人気が高い。',
      averageLandPrice: 35,
      popularAreas: ['さいたま市', '川口市', '川越市'],
      characteristics: ['都心アクセス', 'ベッドタウン', '子育て支援充実'],
    },
    '千葉県': {
      name: '千葉県',
      description: '東京湾と太平洋に面し、海も山も楽しめる。成田空港もあり国際的。',
      averageLandPrice: 30,
      popularAreas: ['千葉市', '船橋市', '松戸市'],
      characteristics: ['海近く', '空港アクセス', 'レジャー充実'],
    },
    '東京都': {
      name: '東京都',
      description: '日本の首都。利便性は最高だが、土地価格も日本一高い。',
      averageLandPrice: 150,
      popularAreas: ['世田谷区', '練馬区', '八王子市'],
      characteristics: ['最高の利便性', '狭小地活用', '高層化'],
    },
    '神奈川県': {
      name: '神奈川県',
      description: '横浜・川崎・相模原の政令市を擁する。海も山も近い恵まれた環境。',
      averageLandPrice: 45,
      popularAreas: ['横浜市', '川崎市', '藤沢市'],
      characteristics: ['海近く', '都心アクセス', '国際都市'],
    },
    '新潟県': {
      name: '新潟県',
      description: '米どころとして有名。日本海側最大の都市新潟市を中心に発展。',
      averageLandPrice: 12,
      popularAreas: ['新潟市', '長岡市', '上越市'],
      characteristics: ['雪対策必須', '米どころ', '日本海側拠点'],
    },
    '富山県': {
      name: '富山県',
      description: '立山連峰と富山湾に囲まれた自然豊かな県。持ち家率日本一。',
      averageLandPrice: 10,
      popularAreas: ['富山市', '高岡市', '射水市'],
      characteristics: ['持ち家率高', '自然豊か', '雪対策'],
    },
    '石川県': {
      name: '石川県',
      description: '金沢を中心とした伝統文化が息づく県。北陸新幹線で東京へのアクセスも向上。',
      averageLandPrice: 15,
      popularAreas: ['金沢市', '白山市', '小松市'],
      characteristics: ['伝統文化', '新幹線アクセス', '観光都市'],
    },
    '福井県': {
      name: '福井県',
      description: '幸福度ランキング上位の県。教育水準も高く、子育て環境が良い。',
      averageLandPrice: 10,
      popularAreas: ['福井市', '坂井市', '越前市'],
      characteristics: ['幸福度高', '教育充実', '伝統産業'],
    },
    '山梨県': {
      name: '山梨県',
      description: '富士山の麓に位置し、果樹栽培が盛ん。東京へのアクセスも良好。',
      averageLandPrice: 12,
      popularAreas: ['甲府市', '甲斐市', '笛吹市'],
      characteristics: ['富士山ビュー', '果樹園', '温泉豊富'],
    },
    '長野県': {
      name: '長野県',
      description: '避暑地・別荘地として人気。自然豊かで、移住先としても注目。',
      averageLandPrice: 15,
      popularAreas: ['長野市', '松本市', '上田市'],
      characteristics: ['避暑地', '別荘地', 'アウトドア'],
    },
    '岐阜県': {
      name: '岐阜県',
      description: '飛騨高山など観光地も多い。名古屋へのアクセスも良好。',
      averageLandPrice: 12,
      popularAreas: ['岐阜市', '大垣市', '各務原市'],
      characteristics: ['歴史的街並み', '温泉地', '名古屋アクセス'],
    },
    '静岡県': {
      name: '静岡県',
      description: '富士山と海に恵まれた県。温暖な気候で暮らしやすい。',
      averageLandPrice: 20,
      popularAreas: ['静岡市', '浜松市', '沼津市'],
      characteristics: ['温暖な気候', '富士山ビュー', '海近く'],
    },
    '愛知県': {
      name: '愛知県',
      description: '日本の製造業の中心地。名古屋市を中心に経済力が高い。',
      averageLandPrice: 35,
      popularAreas: ['名古屋市', '豊田市', '岡崎市'],
      characteristics: ['製造業中心', '経済力高', '都市機能充実'],
    },
    '三重県': {
      name: '三重県',
      description: '伊勢神宮で有名。海の幸・山の幸に恵まれた豊かな県。',
      averageLandPrice: 15,
      popularAreas: ['四日市市', '津市', '鈴鹿市'],
      characteristics: ['伊勢神宮', '海の幸', '温暖な気候'],
    },
    '滋賀県': {
      name: '滋賀県',
      description: '琵琶湖を中心とした県。京都・大阪へのアクセスが良い。',
      averageLandPrice: 18,
      popularAreas: ['大津市', '草津市', '長浜市'],
      characteristics: ['琵琶湖ビュー', '京阪アクセス', '歴史的環境'],
    },
    '京都府': {
      name: '京都府',
      description: '日本の古都。歴史と文化の街で、観光都市としても有名。',
      averageLandPrice: 40,
      popularAreas: ['京都市', '宇治市', '亀岡市'],
      characteristics: ['歴史的街並み', '文化都市', '観光地'],
    },
    '大阪府': {
      name: '大阪府',
      description: '西日本の中心都市。商業・ビジネスの中心地として発展。',
      averageLandPrice: 55,
      popularAreas: ['大阪市', '堺市', '豊中市'],
      characteristics: ['商業都市', '交通便利', '都市機能充実'],
    },
    '兵庫県': {
      name: '兵庫県',
      description: '神戸を中心に、海と山の両方を楽しめる。国際都市としても発展。',
      averageLandPrice: 30,
      popularAreas: ['神戸市', '姫路市', '西宮市'],
      characteristics: ['港町', '国際都市', '海山近く'],
    },
    '奈良県': {
      name: '奈良県',
      description: '古都奈良を中心とした歴史ある県。大阪へのアクセスも良好。',
      averageLandPrice: 20,
      popularAreas: ['奈良市', '橿原市', '生駒市'],
      characteristics: ['歴史的環境', '大阪アクセス', '自然豊か'],
    },
    '和歌山県': {
      name: '和歌山県',
      description: '温暖な気候と豊かな自然。果樹栽培や漁業が盛ん。',
      averageLandPrice: 10,
      popularAreas: ['和歌山市', '田辺市', '橋本市'],
      characteristics: ['温暖な気候', '海の幸', '果樹栽培'],
    },
    '鳥取県': {
      name: '鳥取県',
      description: '日本一人口の少ない県。鳥取砂丘で有名。自然豊かで暮らしやすい。',
      averageLandPrice: 8,
      popularAreas: ['鳥取市', '米子市', '倉吉市'],
      characteristics: ['自然豊か', '砂丘観光', 'ゆったり生活'],
    },
    '島根県': {
      name: '島根県',
      description: '出雲大社で有名。日本海の幸に恵まれ、歴史と自然が調和。',
      averageLandPrice: 8,
      popularAreas: ['松江市', '出雲市', '浜田市'],
      characteristics: ['歴史的環境', '日本海の幸', '温泉地'],
    },
    '岡山県': {
      name: '岡山県',
      description: '晴れの国と呼ばれる温暖な気候。フルーツ王国としても有名。',
      averageLandPrice: 18,
      popularAreas: ['岡山市', '倉敷市', '津山市'],
      characteristics: ['温暖な気候', 'フルーツ王国', '災害少ない'],
    },
    '広島県': {
      name: '広島県',
      description: '中国地方の中心地。世界遺産も多く、経済・文化の拠点。',
      averageLandPrice: 25,
      popularAreas: ['広島市', '福山市', '呉市'],
      characteristics: ['経済都市', '世界遺産', '瀬戸内海'],
    },
    '山口県': {
      name: '山口県',
      description: '本州最西端の県。歴史的にも重要な地域で、海の幸が豊富。',
      averageLandPrice: 12,
      popularAreas: ['下関市', '山口市', '宇部市'],
      characteristics: ['歴史的地域', '海の幸', '本州最西端'],
    },
    '徳島県': {
      name: '徳島県',
      description: '阿波踊りで有名。四国の東部に位置し、自然豊かな環境。',
      averageLandPrice: 12,
      popularAreas: ['徳島市', '鳴門市', '阿南市'],
      characteristics: ['阿波踊り', '自然豊か', 'すだち生産'],
    },
    '香川県': {
      name: '香川県',
      description: '日本一小さい県。うどん県として有名で、瀬戸内海の恵み豊か。',
      averageLandPrice: 15,
      popularAreas: ['高松市', '丸亀市', '三豊市'],
      characteristics: ['うどん文化', 'コンパクト', '瀬戸内海'],
    },
    '愛媛県': {
      name: '愛媛県',
      description: 'みかんの生産量日本一。温暖な気候で、瀬戸内海と太平洋に面する。',
      averageLandPrice: 15,
      popularAreas: ['松山市', '今治市', '新居浜市'],
      characteristics: ['みかん王国', '温暖な気候', '道後温泉'],
    },
    '高知県': {
      name: '高知県',
      description: '坂本龍馬の出身地。太平洋に面し、豊かな自然と海の幸が魅力。',
      averageLandPrice: 12,
      popularAreas: ['高知市', '南国市', '四万十市'],
      characteristics: ['太平洋側', '自然豊か', 'カツオ名産'],
    },
    '福岡県': {
      name: '福岡県',
      description: '九州の玄関口。アジアに近く、経済・文化の中心地として発展。',
      averageLandPrice: 30,
      popularAreas: ['福岡市', '北九州市', '久留米市'],
      characteristics: ['アジア玄関口', '都市機能充実', 'グルメ都市'],
    },
    '佐賀県': {
      name: '佐賀県',
      description: '有田焼・伊万里焼で有名。福岡へのアクセスも良好。',
      averageLandPrice: 10,
      popularAreas: ['佐賀市', '唐津市', '鳥栖市'],
      characteristics: ['焼き物文化', '福岡アクセス', '温泉地'],
    },
    '長崎県': {
      name: '長崎県',
      description: '異国情緒あふれる港町。坂の多い地形が特徴的。',
      averageLandPrice: 15,
      popularAreas: ['長崎市', '佐世保市', '諫早市'],
      characteristics: ['異国情緒', '港町', '坂の街'],
    },
    '熊本県': {
      name: '熊本県',
      description: '熊本城と阿蘇山で有名。九州の中央に位置し、自然豊か。',
      averageLandPrice: 15,
      popularAreas: ['熊本市', '八代市', '天草市'],
      characteristics: ['阿蘇山', '温泉豊富', '地下水豊富'],
    },
    '大分県': {
      name: '大分県',
      description: '温泉県として有名。別府・湯布院など日本有数の温泉地を擁する。',
      averageLandPrice: 12,
      popularAreas: ['大分市', '別府市', '中津市'],
      characteristics: ['温泉王国', '自然豊か', '海の幸山の幸'],
    },
    '宮崎県': {
      name: '宮崎県',
      description: '温暖な気候で、南国ムード漂う。マンゴーや地鶏が有名。',
      averageLandPrice: 10,
      popularAreas: ['宮崎市', '都城市', '延岡市'],
      characteristics: ['南国気候', 'サーフィン', 'マンゴー生産'],
    },
    '鹿児島県': {
      name: '鹿児島県',
      description: '桜島と温泉の県。黒豚・焼酎など食文化も豊か。',
      averageLandPrice: 12,
      popularAreas: ['鹿児島市', '霧島市', '鹿屋市'],
      characteristics: ['桜島', '温泉豊富', '黒豚・焼酎'],
    },
    '沖縄県': {
      name: '沖縄県',
      description: '日本最南端の県。亜熱帯気候で、独自の文化と美しい海が魅力。',
      averageLandPrice: 25,
      popularAreas: ['那覇市', '沖縄市', 'うるま市'],
      characteristics: ['亜熱帯気候', '美しい海', '独自文化'],
    },
  };
  
  // 都道府県の特徴を取得
  export function getPrefectureFeatures(prefectureName: string): PrefectureFeature | undefined {
    return prefectureFeatures[prefectureName];
  }
  
  // 全都道府県の特徴を取得
  export function getAllPrefectureFeatures(): { [key: string]: PrefectureFeature } {
    return prefectureFeatures;
  }
  
  // 地方別に都道府県をグループ化
  export const regionGroups = [
    {
      name: '北海道・東北',
      prefectures: ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'],
    },
    {
      name: '関東',
      prefectures: ['東京都', '神奈川県', '埼玉県', '千葉県', '茨城県', '栃木県', '群馬県'],
    },
    {
      name: '中部',
      prefectures: ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県'],
    },
    {
      name: '近畿',
      prefectures: ['三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'],
    },
    {
      name: '中国・四国',
      prefectures: ['鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県'],
    },
    {
      name: '九州・沖縄',
      prefectures: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'],
    },
  ];