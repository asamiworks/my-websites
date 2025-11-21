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

  // カテゴリに応じたクラス名を取得する関数
  const getCategoryClass = (category: string): string => {
    // アプリ関連（緑）
    if (["費用", "開発期間", "対応機種"].includes(category)) {
      return "app";
    }
    // WEB関連（オレンジ）
    else if (["AIO概要", "必要性", "SEO対策", "分析設定"].includes(category)) {
      return "web";
    }
    // サイト関連（青：デフォルト）
    else {
      return "site"; // 料金、選び方、補助金、制作期間、セキュリティ、CMS対応、スマホ対応、保守運用、機能など
    }
  };

  const faqs: FAQItem[] = [
    {
      question: "茨城県でホームページ制作の相場はいくらですか？",
      answer: "茨城県でのホームページ制作の相場は、ランディングページで15万円〜30万円、コーポレートサイトで30万円〜100万円程度です。AsamiWorksでは、ランディングページ120,000円〜、コーポレートサイト600,000円〜、補助金対応サイト700,000円〜で提供しています。小規模事業者持続化補助金を活用すると最大66.7%（上限50万円）の費用削減が可能です。",
      category: "料金",
      schema: {
        "@type": "Question",
        "name": "茨城県でホームページ制作の相場はいくらですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "茨城県でのホームページ制作の相場は、ランディングページで15万円〜30万円、コーポレートサイトで30万円〜100万円程度です。AsamiWorksでは、ランディングページ120,000円〜、コーポレートサイト600,000円〜で提供しています。"
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
      answer: "小規模事業者持続化補助金（一般型・補助率2/3）を活用した場合の実質負担額は、例えば、補助金対応サイト（税込770,000円）で上限50万円の補助を受けた場合：実質270,000円となります。",
      category: "補助金",
      schema: {
        "@type": "Question",
        "name": "補助金を使った場合の実質負担額はいくらになりますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "小規模事業者持続化補助金を活用した場合、制作費の2/3が補助されます（Webサイト関連費は補助金額の1/4が上限）。例えば税込77万円のサイト制作で上限50万円の補助を受けた場合、実質27万円の負担となります。"
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
      question: "SSL証明書やセキュリティ対策は含まれていますか？",
      answer: "はい、すべてのプランにSSL証明書（https化）の設定が標準で含まれています。また、基本的なセキュリティ対策として、不正アクセス防止、スパム対策、定期的なバックアップ、セキュリティアップデートの実施も行います。さらに高度なセキュリティが必要な場合は、WAF（Webアプリケーションファイアウォール）の導入やセキュリティ診断も別途対応可能です。",
      category: "セキュリティ",
      schema: {
        "@type": "Question",
        "name": "SSL証明書やセキュリティ対策は含まれていますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、すべてのプランにSSL証明書（https化）の設定が標準で含まれています。不正アクセス防止、スパム対策、定期的なバックアップなども行います。"
        }
      }
    },
    {
      question: "WordPressは使えますか？",
      answer: "はい、WordPressを使用したホームページ制作に対応しています（補助金対応サイトプランに標準で含まれています）。WordPressを使用することで、お客様自身でブログやお知らせの更新が可能になります。初期設定、テーマのカスタマイズ、プラグインの導入、基本的な操作マニュアルの提供まで含まれています。",
      category: "CMS対応",
      schema: {
        "@type": "Question",
        "name": "WordPressは使えますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、WordPressを使用したホームページ制作に対応しています。お客様自身でブログやお知らせの更新が可能になります。"
        }
      }
    },
    {
      question: "スマホ対応（レスポンシブデザイン）は標準ですか？",
      answer: "はい、すべてのプランでスマートフォン・タブレット対応（レスポンシブデザイン）が標準で含まれています。現在、ホームページへのアクセスの約8割がスマートフォンからと言われており、スマホ対応は必須です。PC・タブレット・スマートフォンのあらゆるデバイスで最適な表示と操作性を提供します。Google のモバイルフレンドリーテストにも完全対応しています。",
      category: "スマホ対応",
      schema: {
        "@type": "Question",
        "name": "スマホ対応（レスポンシブデザイン）は標準ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、すべてのプランでスマートフォン・タブレット対応（レスポンシブデザイン）が標準で含まれています。"
        }
      }
    },
    {
      question: "Webサイト保守管理費はかかりますか？",
      answer: "はい、Webサイトの継続的な運用にはドメイン維持・サーバー管理などの保守管理費が必要です。基本プランは月額5,000円〜で、ドメイン更新、サーバー管理、定期的なバックアップ、セキュリティアップデートなどが含まれます。WordPressを導入されている場合は、WordPress本体・プラグインの自動更新も含まれるため、管理費が若干高くなります。お客様のニーズに合わせたプランをご提案します。",
      category: "保守運用",
      schema: {
        "@type": "Question",
        "name": "Webサイト保守管理費はかかりますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、月額5,000円〜で、ドメイン維持、サーバー管理、バックアップ、セキュリティアップデートなどが含まれます。WordPress導入の場合は自動更新も含まれます。"
        }
      }
    },
    {
      question: "ダークモード対応はできますか？",
      answer: "はい、ダークモード対応も可能です。ユーザーのデバイス設定に応じて自動的にライトモード・ダークモードを切り替える実装や、サイト内でモード切り替えボタンを設置する実装など、ご要望に応じて対応いたします。2025年のトレンドとして、目に優しく、バッテリー消費も抑えられるダークモードは、ユーザー体験向上に効果的です。",
      category: "機能",
      schema: {
        "@type": "Question",
        "name": "ダークモード対応はできますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、ダークモード対応も可能です。デバイス設定に応じた自動切り替えや、サイト内での手動切り替えなど、ご要望に応じて実装します。"
        }
      }
    },
    // WEBアプリ開発関連のQ&Aを追加
    {
      question: "WEBアプリ開発の費用はどのくらいですか？",
      answer: "WEBアプリ開発の費用は、システムの規模や必要な機能によって大きく異なるため、要見積りとなります。要件定義から設計、開発、テスト、導入サポートまでを含めた総合的なお見積りをご提示いたします。まずは無料相談で、業務内容をお聞かせいただき、概算費用をご提案させていただきます。",
      category: "費用",
      schema: {
        "@type": "Question",
        "name": "WEBアプリ開発の費用はどのくらいですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "システムの規模や必要な機能によって異なるため、要見積りとなります。要件定義から設計、開発、テスト、導入サポートまでを含めた総合的なお見積りをご提示いたします。"
        }
      }
    },
    {
      question: "WEBアプリの開発期間はどのくらいですか？",
      answer: "システムの規模によりますが、小規模なシステムで1〜2ヶ月、中規模で2〜4ヶ月程度です。要件定義から設計、開発、テスト、導入までの期間を含みます。緊急の場合はご相談ください。",
      category: "開発期間",
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
      category: "対応機種",
      schema: {
        "@type": "Question",
        "name": "WEBアプリはスマホでも使えますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、レスポンシブ対応により、PC・タブレット・スマートフォンのすべてで快適に利用できます。"
        }
      }
    },
    // AIO（AI検索最適化）関連のQ&A
    {
      question: "AIO（AI検索最適化）とは何ですか？",
      answer: "AIO（AI Optimization）とは、ChatGPTやPerplexity、Google AIなどのAI検索エンジンに対してWebサイトの情報を正確に伝えるための最適化技術です。構造化データの実装、セマンティックなHTML、明確なコンテンツ構造により、AI検索の回答に貴社の情報が引用される可能性が高まります。従来のSEO対策だけでは不十分な時代に、AI検索からの流入を確保するための重要な施策です。",
      category: "AIO概要",
      schema: {
        "@type": "Question",
        "name": "AIO（AI検索最適化）とは何ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AIO（AI Optimization）とは、ChatGPTやPerplexity、Google AIなどのAI検索エンジンに対してWebサイトの情報を正確に伝えるための最適化技術です。構造化データの実装やセマンティックなHTMLにより、AI検索の回答に貴社の情報が引用される可能性が高まります。"
        }
      }
    },
    {
      question: "なぜAIO対策が必要なのですか？",
      answer: "現在、多くのユーザーがChatGPTやPerplexityなどのAI検索を利用して情報を探しています。従来のGoogle検索だけでなく、AI検索エンジンに対しても最適化されていないと、潜在顧客に見つけてもらえない可能性があります。AIO対策により、AIが貴社の情報を正確に理解し、ユーザーの質問に対する回答として貴社のサービスを推薦してくれるようになります。AI時代の新しい流入経路を確保することで、競合との差別化を図ることができます。",
      category: "必要性",
      schema: {
        "@type": "Question",
        "name": "なぜAIO対策が必要なのですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "多くのユーザーがChatGPTやPerplexityなどのAI検索を利用している現在、AI検索エンジンに対しても最適化されていないと、潜在顧客に見つけてもらえない可能性があります。AIO対策により、AI時代の新しい流入経路を確保できます。"
        }
      }
    },
    {
      question: "SEO対策は具体的に何をしてくれますか？",
      answer: "AsamiWorksのSEO対策には、タイトルタグ・メタディスクリプションの最適化、見出しタグ（H1〜H6）の適切な構造化、画像のalt属性設定、内部リンクの最適化、サイトマップ生成、ページ速度の最適化、モバイルフレンドリー対応が含まれます。また、構造化データ（Schema.org）の実装により、検索エンジンとAI検索エンジンの両方に対して、貴社の情報を正確に伝えることができます。",
      category: "SEO対策",
      schema: {
        "@type": "Question",
        "name": "SEO対策は具体的に何をしてくれますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "タイトルタグ・メタディスクリプションの最適化、見出しタグの構造化、画像のalt属性設定、内部リンクの最適化、サイトマップ生成、ページ速度の最適化、構造化データの実装などを行います。"
        }
      }
    },
    {
      question: "Google Analyticsの設定はしてもらえますか？",
      answer: "はい、Google Analytics（GA4）の初期設定に対応しています（補助金対応サイトプランには標準で含まれています）。アクセス数、ユーザー属性、流入経路、人気ページなどの基本的な分析が可能になります。必要に応じて、コンバージョン測定の設定やカスタムレポートの作成もサポートいたします。データに基づいた改善提案も定期的に行うことができます。",
      category: "分析設定",
      schema: {
        "@type": "Question",
        "name": "Google Analyticsの設定はしてもらえますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、Google Analytics（GA4）の初期設定に対応しています。アクセス数、ユーザー属性、流入経路などの基本的な分析が可能になります。"
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
          ホームページ制作・WEBアプリ開発・AIO対策に関する費用、補助金、納期などのご質問にお答えします
        </p>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => {
            const categoryClass = getCategoryClass(faq.category);
            const categoryClassName = `category${categoryClass.charAt(0).toUpperCase() + categoryClass.slice(1)}`;
            const faqItemClassName = `faqItem${categoryClass.charAt(0).toUpperCase() + categoryClass.slice(1)}`;
            return (
              <div
                key={index}
                className={`${styles.faqItem} ${styles[faqItemClassName]} ${openIndex === index ? styles.open : ""}`}
                itemScope
                itemType="https://schema.org/Question"
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className={`${styles.category} ${styles[categoryClassName]}`}>{faq.category}</span>
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
            );
          })}
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