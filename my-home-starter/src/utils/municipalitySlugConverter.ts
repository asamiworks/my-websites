// src/utils/municipalitySlugConverter.ts
// 市区町村のスラッグと日本語名の相互変換

// 茨城県の市区町村マップ（44市町村）
export const ibarakiMunicipalityMap: Record<string, string> = {
    // 市（32市）
    'mito-shi': '水戸市',
    'hitachi-shi': '日立市',
    'tsuchiura-shi': '土浦市',
    'koga-shi': '古河市',
    'ishioka-shi': '石岡市',
    'yuki-shi': '結城市',
    'ryugasaki-shi': '龍ケ崎市',
    'shimotsuma-shi': '下妻市',
    'joso-shi': '常総市',
    'hitachiota-shi': '常陸太田市',
    'takahagi-shi': '高萩市',
    'kitaibaraki-shi': '北茨城市',
    'kasama-shi': '笠間市',
    'toride-shi': '取手市',
    'ushiku-shi': '牛久市',
    'tsukuba-shi': 'つくば市',
    'hitachinaka-shi': 'ひたちなか市',
    'kashima-shi': '鹿嶋市',
    'itako-shi': '潮来市',
    'moriya-shi': '守谷市',
    'hitachiomiya-shi': '常陸大宮市',
    'naka-shi': '那珂市',
    'chikusei-shi': '筑西市',
    'bando-shi': '坂東市',
    'inashiki-shi': '稲敷市',
    'kasumigaura-shi': 'かすみがうら市',
    'sakuragawa-shi': '桜川市',
    'kamisu-shi': '神栖市',
    'namegata-shi': '行方市',
    'hokota-shi': '鉾田市',
    'tsukubamirai-shi': 'つくばみらい市',
    'omitama-shi': '小美玉市',
    
    // 町（10町）
    'ibaraki-machi': '茨城町',
    'oarai-machi': '大洗町',
    'shirosato-machi': '城里町',
    'tokai-mura': '東海村',
    'daigo-machi': '大子町',
    'miho-mura': '美浦村',
    'ami-machi': '阿見町',
    'kawachi-machi': '河内町',
    'yachiyo-machi': '八千代町',
    'goka-machi': '五霞町',
    'sakai-machi': '境町',
    'tone-machi': '利根町',
  };
  
  // 全都道府県の市区町村マップ（主要都市のみ。実際は全市区町村を含める）
  export const municipalitySlugMap: Record<string, Record<string, string>> = {
    'ibaraki': ibarakiMunicipalityMap,
    
    // 東京都の例
    'tokyo': {
      'chiyoda-ku': '千代田区',
      'chuo-ku': '中央区',
      'minato-ku': '港区',
      'shinjuku-ku': '新宿区',
      'bunkyo-ku': '文京区',
      'taito-ku': '台東区',
      'sumida-ku': '墨田区',
      'koto-ku': '江東区',
      'shinagawa-ku': '品川区',
      'meguro-ku': '目黒区',
      'ota-ku': '大田区',
      'setagaya-ku': '世田谷区',
      'shibuya-ku': '渋谷区',
      'nakano-ku': '中野区',
      'suginami-ku': '杉並区',
      'toshima-ku': '豊島区',
      'kita-ku': '北区',
      'arakawa-ku': '荒川区',
      'itabashi-ku': '板橋区',
      'nerima-ku': '練馬区',
      'adachi-ku': '足立区',
      'katsushika-ku': '葛飾区',
      'edogawa-ku': '江戸川区',
      // 市部
      'hachioji-shi': '八王子市',
      'tachikawa-shi': '立川市',
      'musashino-shi': '武蔵野市',
      'mitaka-shi': '三鷹市',
      'ome-shi': '青梅市',
      'fuchu-shi': '府中市',
      'akishima-shi': '昭島市',
      'chofu-shi': '調布市',
      'machida-shi': '町田市',
      'koganei-shi': '小金井市',
      'kodaira-shi': '小平市',
      'hino-shi': '日野市',
      'higashimurayama-shi': '東村山市',
      'kokubunji-shi': '国分寺市',
      'kunitachi-shi': '国立市',
      'fussa-shi': '福生市',
      'komae-shi': '狛江市',
      'higashiyamato-shi': '東大和市',
      'kiyose-shi': '清瀬市',
      'higashikurume-shi': '東久留米市',
      'musashimurayama-shi': '武蔵村山市',
      'tama-shi': '多摩市',
      'inagi-shi': '稲城市',
      'hamura-shi': '羽村市',
      'akiruno-shi': 'あきる野市',
      'nishitokyo-shi': '西東京市',
    },
    
    // 他の都道府県も同様に追加
  };
  
  // スラッグから市区町村名を取得
  export function getMunicipalityName(prefectureSlug: string, citySlug: string): string | null {
    const prefectureMap = municipalitySlugMap[prefectureSlug];
    if (!prefectureMap) {
      // フォールバック：ハイフンをスペースに変換
      return citySlug.replace(/-/g, ' ');
    }
    
    return prefectureMap[citySlug] || null;
  }
  
  // 市区町村名からスラッグを生成
  export function createMunicipalitySlug(cityName: string): string {
    // 基本的な変換ルール
    return cityName
      .toLowerCase()
      .replace(/市|町|村|区/g, match => {
        const suffixMap: Record<string, string> = {
          '市': '-shi',
          '町': '-machi',
          '村': '-mura',
          '区': '-ku'
        };
        return suffixMap[match] || '';
      })
      .replace(/[ヶケ]/g, 'ga') // ケ崎 → gasaki
      .replace(/ヵ/g, 'ka')
      .replace(/ッ/g, 'tsu')
      .replace(/ー/g, '')
      .replace(/[ぁ-ん]/g, char => {
        // ひらがなをローマ字に変換（簡易版）
        const hiraganaToRomaji: Record<string, string> = {
          'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
          'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
          'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
          'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
          'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
          'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
          'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
          'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
          'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
          'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
          'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
          'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
          'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
          'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
          'わ': 'wa', 'を': 'wo', 'ん': 'n',
        };
        return hiraganaToRomaji[char] || char;
      });
  }
  
  // 茨城県の全市区町村リスト（座標付き）
  export const ibarakiMunicipalitiesWithCoordinates: Array<{
    slug: string;
    name: string;
    lat: number;
    lng: number;
  }> = [
    // 市
    { slug: 'mito-shi', name: '水戸市', lat: 36.3659, lng: 140.4713 },
    { slug: 'hitachi-shi', name: '日立市', lat: 36.5992, lng: 140.6513 },
    { slug: 'tsuchiura-shi', name: '土浦市', lat: 36.0781, lng: 140.1951 },
    { slug: 'koga-shi', name: '古河市', lat: 36.1789, lng: 139.7527 },
    { slug: 'ishioka-shi', name: '石岡市', lat: 36.1906, lng: 140.2856 },
    { slug: 'yuki-shi', name: '結城市', lat: 36.3050, lng: 139.8767 },
    { slug: 'ryugasaki-shi', name: '龍ケ崎市', lat: 35.9113, lng: 140.1813 },
    { slug: 'shimotsuma-shi', name: '下妻市', lat: 36.1847, lng: 139.9672 },
    { slug: 'joso-shi', name: '常総市', lat: 36.0233, lng: 139.9933 },
    { slug: 'hitachiota-shi', name: '常陸太田市', lat: 36.5384, lng: 140.5267 },
    { slug: 'takahagi-shi', name: '高萩市', lat: 36.7161, lng: 140.7161 },
    { slug: 'kitaibaraki-shi', name: '北茨城市', lat: 36.8019, lng: 140.7508 },
    { slug: 'kasama-shi', name: '笠間市', lat: 36.3460, lng: 140.3040 },
    { slug: 'toride-shi', name: '取手市', lat: 35.9117, lng: 140.0511 },
    { slug: 'ushiku-shi', name: '牛久市', lat: 35.9795, lng: 140.1494 },
    { slug: 'tsukuba-shi', name: 'つくば市', lat: 36.0834, lng: 140.0767 },
    { slug: 'hitachinaka-shi', name: 'ひたちなか市', lat: 36.3966, lng: 140.5346 },
    { slug: 'kashima-shi', name: '鹿嶋市', lat: 35.9658, lng: 140.6447 },
    { slug: 'itako-shi', name: '潮来市', lat: 35.9472, lng: 140.5547 },
    { slug: 'moriya-shi', name: '守谷市', lat: 35.9514, lng: 139.9753 },
    { slug: 'hitachiomiya-shi', name: '常陸大宮市', lat: 36.5433, lng: 140.4108 },
    { slug: 'naka-shi', name: '那珂市', lat: 36.4567, lng: 140.4870 },
    { slug: 'chikusei-shi', name: '筑西市', lat: 36.3070, lng: 139.9828 },
    { slug: 'bando-shi', name: '坂東市', lat: 36.0486, lng: 139.8889 },
    { slug: 'inashiki-shi', name: '稲敷市', lat: 35.9564, lng: 140.3236 },
    { slug: 'kasumigaura-shi', name: 'かすみがうら市', lat: 36.1514, lng: 140.2356 },
    { slug: 'sakuragawa-shi', name: '桜川市', lat: 36.3270, lng: 140.0905 },
    { slug: 'kamisu-shi', name: '神栖市', lat: 35.8900, lng: 140.6644 },
    { slug: 'namegata-shi', name: '行方市', lat: 36.0147, lng: 140.4870 },
    { slug: 'hokota-shi', name: '鉾田市', lat: 36.1592, lng: 140.5156 },
    { slug: 'tsukubamirai-shi', name: 'つくばみらい市', lat: 35.9633, lng: 140.0372 },
    { slug: 'omitama-shi', name: '小美玉市', lat: 36.2408, lng: 140.3511 },
    
    // 町村
    { slug: 'ibaraki-machi', name: '茨城町', lat: 36.2869, lng: 140.4246 },
    { slug: 'oarai-machi', name: '大洗町', lat: 36.3133, lng: 140.5747 },
    { slug: 'shirosato-machi', name: '城里町', lat: 36.4797, lng: 140.3761 },
    { slug: 'tokai-mura', name: '東海村', lat: 36.4733, lng: 140.5678 },
    { slug: 'daigo-machi', name: '大子町', lat: 36.7654, lng: 140.3570 },
    { slug: 'miho-mura', name: '美浦村', lat: 36.0083, lng: 140.3008 },
    { slug: 'ami-machi', name: '阿見町', lat: 36.0308, lng: 140.2150 },
    { slug: 'kawachi-machi', name: '河内町', lat: 35.8833, lng: 140.2456 },
    { slug: 'yachiyo-machi', name: '八千代町', lat: 36.1817, lng: 139.8897 },
    { slug: 'goka-machi', name: '五霞町', lat: 36.1147, lng: 139.7456 },
    { slug: 'sakai-machi', name: '境町', lat: 36.1089, lng: 139.7956 },
    { slug: 'tone-machi', name: '利根町', lat: 35.8556, lng: 140.1439 },
  ];