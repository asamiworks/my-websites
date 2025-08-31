'use client';

import React, { useState } from 'react';
import styles from './FrequentQuestions.module.css';

const FrequentQuestions = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "家づくりで最も多い失敗は何ですか？",
      answer: "統計的に最も多い失敗は「予算オーバー」で、全体の67%が経験しています。平均して当初予算の23%超過するケースが多く、主な原因は諸費用の見落とし（登記費用、ローン手数料、引越し費用など）とオプション追加による費用増加です。次に多いのが「間取りの後悔」（54%）、「住宅会社選びの失敗」（41%）となっています。これらは事前の計画と専門家のアドバイスで防ぐことができます。",
      category: "失敗・後悔"
    },
    {
      question: "住宅会社は何社くらい比較すべきですか？",
      answer: "最低でも3社、理想的には5社程度の比較検討をお勧めします。1社だけで決めた方の41%が後悔しているというデータがあります。比較する際は、価格だけでなく、設計力、施工品質、アフターサービス、担当者との相性など総合的に判断することが重要です。大手ハウスメーカー、中堅ビルダー、地域工務店それぞれから1社ずつは検討すると、各社の特徴がよく分かります。",
      category: "住宅会社選び"
    },
    {
      question: "家づくりの総費用の内訳を教えてください",
      answer: "一般的な内訳は、建築工事費が70%（本体工事費60%、付帯工事費10%）、諸費用が10%（登記、ローン手数料、保険など）、外構工事費が8%、予備費が12%です。例えば総予算3,500万円の場合、建築工事費2,450万円、諸費用350万円、外構工事費280万円、予備費420万円となります。土地から購入する場合は、土地代と建物代の理想的な比率は4:6程度です。",
      category: "予算・費用"
    },
    {
      question: "マイホームスターターを利用するメリットは？",
      answer: "最大のメリットは、完全無料で専門家のサポートが受けられることです。注文住宅の営業経験を持つ運営者が、業界の裏側まで知る立場から中立的なアドバイスを提供します。具体的には、1)予算計画のシミュレーション、2)失敗しない家づくりの進め方アドバイス、3)住宅会社選びのポイント解説、4)間取りや仕様の注意点、5)契約時の確認事項などをサポートします。",
      category: "サービス内容"
    },
    {
      question: "土地探しで注意すべきポイントは？",
      answer: "重要なチェックポイントは、1)建ぺい率・容積率の確認（希望の広さの家が建てられるか）、2)ハザードマップの確認（洪水・土砂災害リスク）、3)地盤の状態（改良工事で100〜200万円かかる場合も）、4)インフラ状況（上下水道、ガスの引き込み）、5)周辺環境（朝昼夜、平日休日で現地確認）、6)将来の開発計画（市役所で確認）です。これらを見落とすと後で大きな追加費用が発生する可能性があります。",
      category: "土地選び"
    },
    {
      question: "住宅ローンはいくらまで借りられますか？",
      answer: "一般的に年収の7〜8倍まで借りることができますが、安全な返済計画としては年収の5〜6倍、返済負担率25%以内（年収の25%以内の年間返済額）をお勧めします。例えば年収600万円の場合、借入可能額は4,200〜4,800万円ですが、安全圏は3,000〜3,600万円です。変動金利を選ぶ場合は、将来の金利上昇リスクも考慮し、さらに余裕を持った計画が必要です。",
      category: "資金計画"
    },
    {
      question: "工期はどのくらいかかりますか？",
      answer: "着工から完成までの標準的な工期は、木造住宅で4〜5ヶ月、鉄骨住宅で5〜6ヶ月です。ただし、これは順調に進んだ場合で、天候不良や仕様変更により1〜2ヶ月延びることも珍しくありません。また、着工前の準備期間（土地探し、設計、確認申請など）を含めると、計画開始から入居まで12〜18ヶ月が一般的です。余裕を持ったスケジュールを立てることが重要です。",
      category: "スケジュール"
    },
    {
      question: "なぜ無料でサービスを提供できるのですか？",
      answer: "将来的には、相性の良い住宅会社とお客様をマッチングすることで、住宅会社から紹介料をいただいて運営する予定です。事前にお客様のご要望を詳しくヒアリングし、最適な会社をご紹介することで、住宅会社にとっては成約率の高いお客様をご紹介できるようになります。これにより住宅会社は営業の人件費や広告費を大幅に削減できるため、その分を紹介料として当サイトにお支払いいただく仕組みです。重要なのは、この紹介料は施主様の工事費に上乗せされることは一切ないということです。むしろ、効率的な集客により住宅会社の経費が削減される分、お客様により良い条件をご提示できる場合もあります。",
      category: "サービス内容"
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            失敗しない家づくりQ&A
          </h2>
          <p className={styles.subtitle}>
            家づくりの疑問に、具体的な数字とデータでお答えします
          </p>
        </div>
        
        {/* カテゴリータブ */}
        <div className={styles.categoryTabs}>
          {categories.map((category, index) => (
            <span
              key={index}
              className={styles.categoryTab}
            >
              {category}
            </span>
          ))}
        </div>
        
        {/* FAQ */}
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => toggleAccordion(index)}
              >
                <div className={styles.questionContent}>
                  <h3 className={styles.questionText}>{faq.question}</h3>
                  <span className={styles.categoryLabel}>{faq.category}</span>
                </div>
                <span className={`${styles.toggleIcon} ${openIndex === index ? styles.open : ''}`}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className={styles.faqAnswer}>
                  <p className={styles.answerText}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>
            さらに詳しく知りたい方は、無料相談をご利用ください
          </p>
          <a
            href="/Housing-concierge"
            className={styles.ctaButton}
          >
            住宅コンシェルジュに質問する
          </a>
        </div>
      </div>
    </section>
  );
};

export default FrequentQuestions;