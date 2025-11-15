"use client";

import { useState } from "react";
import styles from "./FAQ.module.css";

// 構造化データの型定義
interface SchemaAnswer {
  "@type": "Answer";
  text: string;
}


interface SchemaQuestion {
  "@type": "Question";
  name: string;
  acceptedAnswer: SchemaAnswer;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  schema: SchemaQuestion;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "茨城県でホームページ制作の相場はいくらですか？",
      answer: "茨城県でのホームページ制作の相場は、ランディングページで15万円〜30万円、コーポレートサイトで30万円〜100万円程度です。AsamiWorksでは、ランディングページ220,000円〜、コーポレートサイト385,000円〜、補助金対応サイト770,000円〜で提供しています。小規模事業者持続化補助金を活用すると最大66.7%（上限50万円）の費用削減が可能です。",
      category: "料金",
      schema: {
        "@type": "Question",
        "name": "茨城県でホームページ制作の相場はいくらですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "茨城県でのホームページ制作の相場は、ランディングページで15万円〜30万円、コーポレートサイトで30万円〜100万円程度です。AsamiWorksでは、ランディングページ220,000円〜、コーポレートサイト385,000円〜で提供しています。"
        }
      }
    },
    {
      question: "茨城県でホームページ制作会社を選ぶポイントは？",
      answer: "茨城県でホームページ制作会社を選ぶ際のポイントは、1) 地域密着でサポートが受けられるか、2) 小規模事業者持続化補助金などの活用実績があるか、3) SEO対策が標準で含まれているか、4) 制作後の保守サポートが充実しているか、5) 実績と評判が確認できるか、です。AsamiWorksは茨城県全域に対応し、これらすべての条件を満たしています。",
      category: "選び方",
      schema: {
        "@type": "Question",
        "name": "茨城県でホームページ制作会社を選ぶポイントは？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "茨城県でホームページ制作会社を選ぶ際のポイントは、1) 地域密着でサポートが受けられるか、2) 補助金の活用実績があるか、3) SEO対策が標準で含まれているか、4) 制作後の保守サポートが充実しているか、5) 実績と評判が確認できるか、です。"
        }
      }
    },
    {
      question: "小規模事業者持続化補助金でホームページ制作はできますか？",
      answer: "はい、小規模事業者持続化補助金を活用してホームページ制作が可能です。ウェブサイト関連費として、ホームページやECサイトの構築、更新、改修、運用に関する経費が補助対象となります。補助率は2/3（賃金引上げ枠等は3/4）で、ウェブサイト関連費は補助金交付申請額の1/4が上限です。例えば、補助金申請額200万円の場合、最大50万円までWebサイト制作費に充てることができます。",
      category: "補助金",
      schema: {
        "@type": "Question",
        "name": "小規模事業者持続化補助金でホームページ制作はできますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、小規模事業者持続化補助金を活用してホームページ制作が可能です。補助率は2/3（賃金引上げ枠等は3/4）で、ウェブサイト関連費は補助金交付申請額の1/4が上限です。"
        }
      }
    },
    {
      question: "補助金を使った場合の実質負担額はいくらになりますか？",
      answer: "小規模事業者持続化補助金（一般型・補助率2/3）を活用した場合の実質負担額は、例えば、補助金対応サイト（770,000円）で上限50万円の補助を受けた場合：実質270,000円となります。",
      category: "補助金",
      schema: {
        "@type": "Question",
        "name": "補助金を使った場合の実質負担額はいくらになりますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "小規模事業者持続化補助金を活用した場合、制作費の2/3が補助されるため、実質負担は1/3となります。例えば38.5万円のサイト制作なら実質12.8万円程度の負担です。"
        }
      }
    },
    {
      question: "ホームページ制作の納期はどのくらい？",
      answer: "ホームページ制作の標準納期は、ランディングページで2〜3週間、コーポレートサイトで1〜2ヶ月、複雑なシステムを含む場合は2〜3ヶ月程度です。AsamiWorksでは、最短3日での公開が可能です。ただし、補助金を活用する場合は申請・採択期間を含めて3〜4ヶ月の期間が必要です。",
      category: "制作期間",
      schema: {
        "@type": "Question",
        "name": "ホームページ制作の納期はどのくらい？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ホームページ制作の標準納期は、ランディングページで2〜3週間、コーポレートサイトで1〜2ヶ月程度です。最短3日での公開も可能です。"
        }
      }
    },
    {
      question: "初期費用を抑えてホームページを持つことは可能？",
      answer: "はい、可能です。AsamiWorksでは初期制作費が5.5万円でサイトを持つことができます。スタートアップや名刺代わりのサイトと持ちたい方におすすめのプランをご用意しております。",
      category: "料金",
      schema: {
        "@type": "Question",
        "name": "月初期費用を抑えてホームページを持つことは可能？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、可能です。AsamiWorksでは初期制作費が5.5万円でサイトを持つことができます。スタートアップや名刺代わりのサイトと持ちたい方におすすめのプランをご用意しております。"
        }
      }
    },
    // WEBアプリ開発関連のQ&Aを追加
    {
      question: "WEBアプリ開発の費用はどのくらいですか？",
      answer: "WEBアプリ開発の初期費用は60万円〜で、システムの規模や機能により異なります。要件定義から設計、開発、テスト、導入サポートまでを含みます。保守・運用サポートは別途お見積りとなります。まずは無料相談で概算費用をご提示いたします。",
      category: "WEBアプリ",
      schema: {
        "@type": "Question",
        "name": "WEBアプリ開発の費用はどのくらいですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "初期費用は60万円〜で、システムの規模や機能により異なります。要件定義から設計、開発、テスト、導入サポートまでを含みます。"
        }
      }
    },
    {
      question: "WEBアプリの開発期間はどのくらいですか？",
      answer: "システムの規模によりますが、小規模なシステムで1〜2ヶ月、中規模で2〜4ヶ月程度です。要件定義から設計、開発、テスト、導入までの期間を含みます。緊急の場合はご相談ください。",
      category: "WEBアプリ",
      schema: {
        "@type": "Question",
        "name": "WEBアプリの開発期間はどのくらいですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "小規模なシステムで1〜2ヶ月、中規模で2〜4ヶ月程度です。要件定義から導入までの期間を含みます。"
        }
      }
    },
    {
      question: "WEBアプリはスマホでも使えますか？",
      answer: "はい、レスポンシブ対応により、PC・タブレット・スマートフォンのすべてで快適に利用できます。あらゆるデバイスで最適な表示と操作性を提供します。",
      category: "WEBアプリ",
      schema: {
        "@type": "Question",
        "name": "WEBアプリはスマホでも使えますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、レスポンシブ対応により、PC・タブレット・スマートフォンのすべてで快適に利用できます。"
        }
      }
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection} id="faq" aria-label="よくある質問">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          よくある質問<span className={styles.subtitle}>FAQ</span>
        </h2>
        
        <p className={styles.sectionDescription}>
          ホームページ制作・WEBアプリ開発に関する費用、補助金、納期などのご質問にお答えします
        </p>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${openIndex === index ? styles.open : ""}`}
              itemScope
              itemType="https://schema.org/Question"
            >
              <button
                className={styles.faqQuestion}
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className={styles.category}>{faq.category}</span>
                <h3 itemProp="name">{faq.question}</h3>
                <span className={styles.icon} aria-hidden="true">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              
              <div
                id={`faq-answer-${index}`}
                className={styles.faqAnswer}
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div className={styles.answerContent}>
                  <p itemProp="text">{faq.answer}</p>
                </div>
              </div>

              {/* 個別の構造化データ */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(faq.schema)
                }}
              />
            </div>
          ))}
        </div>

        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>
            その他のご質問は、お気軽にお問い合わせください
          </p>
          <a href="/form" className={styles.ctaButton}>
            お問い合わせはこちら
          </a>
        </div>
      </div>

      {/* FAQPage構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => faq.schema)
          })
        }}
      />
    </section>
  );
}