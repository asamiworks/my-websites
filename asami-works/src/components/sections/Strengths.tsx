"use client";

import styles from "./Strengths.module.css";

export default function Strengths() {
  const strengths = [
    {
      title: "ビジネスを深く理解したオリジナルデザイン",
      description: "お客様のビジネスモデル、ターゲット層、競合状況を徹底的に分析。単なる見た目の美しさではなく、ビジネス成果に直結するオリジナルデザインを提供します。"
    },
    {
      title: "補助金活用で最大66.7%の費用削減",
      description: "小規模事業者持続化補助金の申請要件を熟知。申請書類の作成サポートから採択後のフォローまで、費用負担を最小限に抑えながら高品質なサイトを実現します。"
    },
    {
      title: "地域密着型の手厚いサポート体制",
      description: "茨城・千葉エリアに特化し、対面での打ち合わせが可能。お客様との継続的なコミュニケーションを通じて、ビジネスの成長に合わせたサイト運用をサポートします。"
    },
    {
      title: "最新技術とSEO対策の標準実装",
      description: "モバイルファースト設計、高速表示、内部SEO最適化を標準装備。公開後も継続的な改善提案により、検索上位表示と集客力向上を実現します。"
    },
    {
      title: "制作後の運用・改善まで完全サポート",
      description: "サイト公開がゴールではありません。アクセス解析、A/Bテスト、コンテンツ更新など、継続的な改善施策で成果を最大化。月額サポートプランで安心の運用体制を構築します。"
    },
    {
      title: "豊富な実績と高い顧客満足度",
      description: "地域の中小企業様を中心に多数の制作実績。お客様の声を大切にし、期待を超える成果を追求。紹介・リピート率の高さが信頼の証です。"
    }
  ];

  return (
    <section id="strengths" className={styles.strengths}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          AsamiWorksが選ばれる<span className={styles.highlight}>6つの理由</span>
        </h2>
        <p className={styles.subtitle}>
          単なるホームページ制作ではなく、お客様のビジネス成長をサポートするパートナーとして
        </p>
        
        <div className={styles.strengthsGrid}>
          {strengths.map((strength, index) => (
            <div key={index} className={styles.strengthCard}>
              <div className={styles.numberWrapper}>
                <span className={styles.number}>{(index + 1).toString().padStart(2, '0')}</span>
              </div>
              <h3 className={styles.strengthTitle}>{strength.title}</h3>
              <p className={styles.strengthDescription}>{strength.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctaWrapper}>
          <p className={styles.ctaText}>
            まずは無料相談から。お客様のご要望をじっくりお聞かせください。
          </p>
        </div>
      </div>
    </section>
  );
}