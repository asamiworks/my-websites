// src/utils/areaCodeMapper.ts

// 都道府県名からコードへのマッピング
const PREFECTURE_MAP = new Map<string, string>([
    ['北海道', '01'],
    ['青森県', '02'],
    ['岩手県', '03'],
    ['宮城県', '04'],
    ['秋田県', '05'],
    ['山形県', '06'],
    ['福島県', '07'],
    ['茨城県', '08'],
    ['栃木県', '09'],
    ['群馬県', '10'],
    ['埼玉県', '11'],
    ['千葉県', '12'],
    ['東京都', '13'],
    ['神奈川県', '14'],
    ['新潟県', '15'],
    ['富山県', '16'],
    ['石川県', '17'],
    ['福井県', '18'],
    ['山梨県', '19'],
    ['長野県', '20'],
    ['岐阜県', '21'],
    ['静岡県', '22'],
    ['愛知県', '23'],
    ['三重県', '24'],
    ['滋賀県', '25'],
    ['京都府', '26'],
    ['大阪府', '27'],
    ['兵庫県', '28'],
    ['奈良県', '29'],
    ['和歌山県', '30'],
    ['鳥取県', '31'],
    ['島根県', '32'],
    ['岡山県', '33'],
    ['広島県', '34'],
    ['山口県', '35'],
    ['徳島県', '36'],
    ['香川県', '37'],
    ['愛媛県', '38'],
    ['高知県', '39'],
    ['福岡県', '40'],
    ['佐賀県', '41'],
    ['長崎県', '42'],
    ['熊本県', '43'],
    ['大分県', '44'],
    ['宮崎県', '45'],
    ['鹿児島県', '46'],
    ['沖縄県', '47']
  ]);
  
  // 市区町村コードマッピング
  const CITY_MAPS: Record<string, Map<string, string>> = {
    '東京都': new Map([
      ['千代田区', '101'],
      ['中央区', '102'],
      ['港区', '103'],
      ['新宿区', '104'],
      ['文京区', '105'],
      ['台東区', '106'],
      ['墨田区', '107'],
      ['江東区', '108'],
      ['品川区', '109'],
      ['目黒区', '110'],
      ['大田区', '111'],
      ['世田谷区', '112'],
      ['渋谷区', '113'],
      ['中野区', '114'],
      ['杉並区', '115'],
      ['豊島区', '116'],
      ['北区', '117'],
      ['荒川区', '118'],
      ['板橋区', '119'],
      ['練馬区', '120'],
      ['足立区', '121'],
      ['葛飾区', '122'],
      ['江戸川区', '123'],
      ['八王子市', '201'],
      ['立川市', '202'],
      ['武蔵野市', '203'],
      ['三鷹市', '204'],
      ['青梅市', '205'],
      ['府中市', '206'],
      ['昭島市', '207'],
      ['調布市', '208'],
      ['町田市', '209'],
      ['小金井市', '210'],
      ['小平市', '211'],
      ['日野市', '212'],
      ['東村山市', '213'],
      ['国分寺市', '214'],
      ['国立市', '215'],
      ['福生市', '218'],
      ['狛江市', '219'],
      ['東大和市', '220'],
      ['清瀬市', '221'],
      ['東久留米市', '222'],
      ['武蔵村山市', '223'],
      ['多摩市', '224'],
      ['稲城市', '225'],
      ['羽村市', '227'],
      ['あきる野市', '228'],
      ['西東京市', '229']
    ]),
    '大阪府': new Map([
      ['大阪市北区', '127'],
      ['大阪市都島区', '128'],
      ['大阪市福島区', '103'],
      ['大阪市此花区', '104'],
      ['大阪市西区', '106'],
      ['大阪市港区', '107'],
      ['大阪市大正区', '108'],
      ['大阪市天王寺区', '109'],
      ['大阪市浪速区', '111'],
      ['大阪市西淀川区', '113'],
      ['大阪市東淀川区', '114'],
      ['大阪市東成区', '115'],
      ['大阪市生野区', '116'],
      ['大阪市旭区', '117'],
      ['大阪市城東区', '118'],
      ['大阪市阿倍野区', '119'],
      ['大阪市住吉区', '120'],
      ['大阪市東住吉区', '121'],
      ['大阪市西成区', '122'],
      ['大阪市淀川区', '123'],
      ['大阪市鶴見区', '124'],
      ['大阪市住之江区', '125'],
      ['大阪市平野区', '126'],
      ['大阪市中央区', '128'],
      ['堺市', '140'],
      ['豊中市', '203'],
      ['吹田市', '205'],
      ['高槻市', '207'],
      ['枚方市', '210']
    ])
  };
  
  /**
   * 都道府県名から都道府県コードを取得
   */
  export function getPrefectureCode(name: string): string | undefined {
    return PREFECTURE_MAP.get(name);
  }
  
  /**
   * 市区町村名から市区町村コードを取得
   */
  export function getCityCode(prefectureName: string, cityName: string): string | undefined {
    const cityMap = CITY_MAPS[prefectureName];
    return cityMap?.get(cityName);
  }
  
  /**
   * e-Stat用の地域コード（5桁）を生成
   */
  export function getAreaCode(prefectureName: string, cityName: string): string | undefined {
    const prefCode = getPrefectureCode(prefectureName);
    const cityCode = getCityCode(prefectureName, cityName);
    
    if (prefCode && cityCode) {
      return `${prefCode}${cityCode}`;
    }
    
    return undefined;
  }
  
  /**
   * 都道府県コードから都道府県名を取得（逆引き）
   */
  export function getPrefectureName(code: string): string | undefined {
    for (const [name, prefCode] of PREFECTURE_MAP.entries()) {
      if (prefCode === code) {
        return name;
      }
    }
    return undefined;
  }
  
  /**
   * すべての都道府県を取得
   */
  export function getAllPrefectures(): Array<{ code: string; name: string }> {
    return Array.from(PREFECTURE_MAP.entries()).map(([name, code]) => ({
      code,
      name
    }));
  }
  
  /**
   * 指定された都道府県のすべての市区町村を取得
   */
  export function getCitiesForPrefecture(prefectureName: string): Array<{ code: string; name: string }> | undefined {
    const cityMap = CITY_MAPS[prefectureName];
    if (!cityMap) return undefined;
    
    return Array.from(cityMap.entries()).map(([name, code]) => ({
      code,
      name
    }));
  }