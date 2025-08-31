import React from 'react';
import styles from './SuccessStories.module.css';

const SuccessStories = () => {
  const stories = [
    {
      family: "ケース1: 東京都内で建てる",
      location: "東京都（多摩・23区外）",
      budget: "総額7,000-8,000万円",
      challenge: "都心部では予算が足りず、エリア選びに悩む",
      solution: "23区外や多摩エリアまで範囲を広げ、駅徒歩15分圏内で探す",
      result: "土地4,500万円＋建物3,000万円で、通勤1時間圏内に家を建てられる",
      company: "地域密着型工務店",
      period: "12-18ヶ月"
    },
    {
      family: "ケース2: 首都圏郊外で建てる", 
      location: "埼玉・千葉・神奈川",
      budget: "総額4,000-5,000万円",
      challenge: "都心へのアクセスと広さの両立",
      solution: "急行停車駅の周辺や、始発駅のあるエリアを検討",
      result: "土地2,200万円＋建物2,500万円で、庭付き4LDKの家を実現",
      company: "中堅ビルダー",
      period: "12-15ヶ月"
    },
    {
      family: "ケース3: 予算重視で建てる",
      location: "埼玉・千葉の郊外", 
      budget: "総額3,000-3,500万円",
      challenge: "限られた予算で一戸建てを諦めたくない",
      solution: "駅からバス便のエリアや、今後発展が期待される新興住宅地を検討",
      result: "土地1,200万円＋建物1,800万円で、必要十分な3LDKの新築住宅",
      company: "ローコストメーカー",
      period: "10-12ヶ月"
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            エリア別・予算別の家づくりパターン
          </h2>
          <p className={styles.subtitle}>
            首都圏での家づくりの現実的なプランをご紹介します
          </p>
        </div>
        
        <div className={styles.storiesContainer}>
          {stories.map((story, index) => (
            <div key={index} className={styles.storyCard}>
              <div className={styles.storyWrapper}>
                <div className={styles.storyInfo}>
                  <h3 className={styles.familyName}>{story.family}</h3>
                  <div className={styles.infoList}>
                    <p>エリア: {story.location}</p>
                    <p>予算帯: {story.budget}</p>
                    <p>工期目安: {story.period}</p>
                    <p>会社タイプ: {story.company}</p>
                  </div>
                </div>
                
                <div className={styles.storyContent}>
                  <div className={styles.challenge}>
                    <h4 className={styles.challengeTitle}>1. よくある課題</h4>
                    <p className={styles.challengeText}>{story.challenge}</p>
                  </div>
                  
                  <div className={styles.solution}>
                    <h4 className={styles.solutionTitle}>2. 解決のアプローチ</h4>
                    <p className={styles.solutionText}>{story.solution}</p>
                  </div>
                  
                  <div className={styles.result}>
                    <h4 className={styles.resultTitle}>3. こうなるケースが多い</h4>
                    <p className={styles.resultText}>{story.result}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.cta}>
          <p className={styles.ctaText}>
            あなたの家づくりの課題も、適切なアプローチで解決できるかもしれません
          </p>
          <a
            href="/start-home-building"
            className={styles.ctaButton}
          >
            無料診断を試してみる
          </a>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;