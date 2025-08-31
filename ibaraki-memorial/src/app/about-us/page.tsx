import styles from "../../styles/AboutUs.module.css";
import CTA from "@/components/CTA";

export default function AboutUsPage() {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>私たちについて</h1>

      <div className={styles.section}>
        <h2>神宮寺について</h2>
        <p>
          神宮寺は、茨城県土浦市にある真言宗の歴史ある寺院です。地域に根差した法要や年中行事を通じて、信仰と暮らしを結ぶ役割を担ってきました。
          現代社会のニーズに合わせ、家族の負担を軽減する「リース型永代供養墓」の提供にも取り組んでいます。
        </p>
        <p><strong>住所：</strong>茨城県土浦市藤沢1535</p>
        <p><strong>電話：</strong>029-862-2224</p>
        <div className={styles.mapWrapper}>
          <iframe
            src="https://www.google.com/maps?q=茨城県土浦市藤沢1535&output=embed"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div className={styles.section}>
        <h2>有限会社カツミ石材について</h2>
        <p>
          有限会社カツミ石材は、茨城県桜川市に拠点を構える石材専門の会社です。長年にわたり、墓石の設計・施工・文字彫刻まで一貫して手がけてきました。
          お客様一人ひとりに寄り添い、末永く安心してご利用いただける品質とサポートを大切にしています。
        </p>
        <p><strong>住所：</strong>茨城県桜川市大国玉233</p>
        <p><strong>電話：</strong>029-658-6662</p>
        <div className={styles.mapWrapper}>
          <iframe
            src="https://www.google.com/maps?q=茨城県桜川市大国玉233&output=embed"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <CTA />
    </section>
    
  );
}
