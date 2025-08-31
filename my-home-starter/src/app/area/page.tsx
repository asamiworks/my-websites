import { Metadata } from 'next';
import Link from 'next/link';
import styles from './AreaTopPage.module.css';

export const metadata: Metadata = {
  title: 'エリアから探す｜全国の注文住宅｜マイホームスターター',
  description: '全国47都道府県の注文住宅情報。地域別の土地相場と住宅会社をご紹介。',
};

// 地域グループデータ（北海道から順番に）
const regionGroups = [
  {
    name: '北海道',
    prefectures: ['北海道']
  },
  {
    name: '東北',
    prefectures: ['青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県']
  },
  {
    name: '関東',
    prefectures: ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県']
  },
  {
    name: '中部',
    prefectures: ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県']
  },
  {
    name: '関西',
    prefectures: ['三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県']
  },
  {
    name: '中国',
    prefectures: ['鳥取県', '島根県', '岡山県', '広島県', '山口県']
  },
  {
    name: '四国',
    prefectures: ['徳島県', '香川県', '愛媛県', '高知県']
  },
  {
    name: '九州・沖縄',
    prefectures: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県']
  }
];

// 都道府県名をスラッグに変換（簡易版）
function prefectureToSlug(prefecture: string): string {
  const map: { [key: string]: string } = {
    '北海道': 'hokkaido', '青森県': 'aomori', '岩手県': 'iwate', '宮城県': 'miyagi',
    '秋田県': 'akita', '山形県': 'yamagata', '福島県': 'fukushima', '茨城県': 'ibaraki',
    '栃木県': 'tochigi', '群馬県': 'gunma', '埼玉県': 'saitama', '千葉県': 'chiba',
    '東京都': 'tokyo', '神奈川県': 'kanagawa', '新潟県': 'niigata', '富山県': 'toyama',
    '石川県': 'ishikawa', '福井県': 'fukui', '山梨県': 'yamanashi', '長野県': 'nagano',
    '岐阜県': 'gifu', '静岡県': 'shizuoka', '愛知県': 'aichi', '三重県': 'mie',
    '滋賀県': 'shiga', '京都府': 'kyoto', '大阪府': 'osaka', '兵庫県': 'hyogo',
    '奈良県': 'nara', '和歌山県': 'wakayama', '鳥取県': 'tottori', '島根県': 'shimane',
    '岡山県': 'okayama', '広島県': 'hiroshima', '山口県': 'yamaguchi', '徳島県': 'tokushima',
    '香川県': 'kagawa', '愛媛県': 'ehime', '高知県': 'kochi', '福岡県': 'fukuoka',
    '佐賀県': 'saga', '長崎県': 'nagasaki', '熊本県': 'kumamoto', '大分県': 'oita',
    '宮崎県': 'miyazaki', '鹿児島県': 'kagoshima', '沖縄県': 'okinawa'
  };
  return map[prefecture] || prefecture;
}

export default function AreaTopPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>エリアから探す</h1>
      <p className={styles.description}>
        お住まいを建てたいエリアを選択してください。
        地域ごとの土地相場や住宅会社情報をご覧いただけます。
      </p>
      
      <div className={styles.regions}>
        {regionGroups.map((region) => (
          <section key={region.name} className={styles.region}>
            <h2 className={styles.regionTitle}>{region.name}</h2>
            <div className={styles.prefectureGrid}>
              {region.prefectures.map((prefectureName) => (
                <Link
                  key={prefectureName}
                  href={`/area/${prefectureToSlug(prefectureName)}`}
                  className={styles.prefectureLink}
                >
                  {prefectureName}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}