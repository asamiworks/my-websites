import React from 'react';
import styles from './StepByStepGuide.module.css';

const StepByStepGuide = () => {
  const steps = [
    {
      phase: "準備期",
      duration: "1-3ヶ月",
      title: "情報収集と予算設定",
      tasks: [
        { task: "家族の要望をまとめる", detail: "必須条件と希望条件を分ける" },
        { task: "総予算の上限を決める", detail: "年収の6〜8倍+自己資金" },
        { task: "エリアと土地の条件を整理", detail: "通勤・通学、建ぺい率・容積率なども考慮" }
      ],
      warning: "この段階を急ぐと後で大きな変更が必要になる可能性",
      isSupported: true,
      difficulty: "情報収集と計算が複雑で、多くの方がここで挫折してしまいます"
    },
    {
      phase: "計画期",
      duration: "3-6ヶ月",
      title: "最適な住宅会社のマッチング",
      tasks: [
        { task: "あなたの要望を詳しくヒアリング", detail: "予算・エリア・こだわりを整理" },
        { task: "相性の良い住宅会社を3社厳選", detail: "実績・強み・価格帯から最適な会社を選定" },
        { task: "各社との面談をサポート", detail: "比較検討しやすいようアドバイス" }
      ],
      warning: "住宅会社選びは家づくりの成功を左右する最重要ポイント",
      isSupported: true
    },
    {
      phase: "設計期",
      duration: "2-4ヶ月",
      title: "間取りと仕様の決定",
      tasks: [
        { task: "間取りを決める", detail: "生活動線を重視した設計" },
        { task: "設備・仕様を選ぶ", detail: "メンテナンスコストも考慮" },
        { task: "見積もりを精査", detail: "不明な項目は必ず確認" }
      ],
      warning: "変更は早めに。着工後の変更は高額になる",
      isSupported: false
    },
    {
      phase: "建築期",
      duration: "4-6ヶ月",
      title: "着工から完成まで",
      tasks: [
        { task: "地鎮祭・着工", detail: "近隣への挨拶も忘れずに" },
        { task: "定期的な現場確認", detail: "写真で記録を残す" },
        { task: "完成検査", detail: "第三者検査の活用も検討" }
      ],
      warning: "工期の遅れは珍しくない。余裕を持った計画を",
      isSupported: false
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            失敗しない家づくりの完全ロードマップ
          </h2>
          <p className={styles.subtitle}>
            平均的な家づくり期間は12〜18ヶ月。当サイトが前半をサポートし、最適な住宅会社へ引き継ぎます。
          </p>
        </div>

        {/* 当サイトのサポート範囲説明 */}
        <div className={styles.supportInfo}>
          <div className={styles.supportInfoContent}>
            <div className={styles.supportBadge}>当サイトのサポート範囲</div>
            <p className={styles.supportText}>
              当サイトでは、家づくりの「準備期」と「計画期」を徹底サポート。
              <br />
              まずは家づくり総予算シミュレータで、あなたの適正予算を確認しましょう。
            </p>
          </div>
        </div>
        
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={index} className={`${styles.stepWrapper} ${!step.isSupported ? styles.stepWrapperDisabled : ''}`}>
              {index < steps.length - 1 && (
                <div className={`${styles.connector} ${!step.isSupported ? styles.connectorDisabled : ''}`}></div>
              )}
              
              <div className={styles.stepContent}>
                <div className={`${styles.stepNumber} ${!step.isSupported ? styles.stepNumberDisabled : ''}`}>
                  {index + 1}
                </div>
                
                <div className={`${styles.stepCard} ${!step.isSupported ? styles.stepCardDisabled : ''}`}>
                  {step.isSupported && (
                    <div className={styles.supportedBadge}>サポート対象</div>
                  )}
                  {!step.isSupported && (
                    <div className={styles.companySupportBadge}>紹介した住宅会社が実施</div>
                  )}
                  
                  <div className={styles.stepHeader}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <span className={styles.duration}>
                      期間: {step.duration}
                    </span>
                  </div>
                  
                  <div className={styles.phase}>{step.phase}</div>
                  
                  <div className={styles.taskList}>
                    {step.tasks.map((item, idx) => (
                      <div key={idx} className={styles.task}>
                        <span className={styles.taskCheck}>✓</span>
                        <div>
                          <span className={styles.taskName}>{item.task}</span>
                          <span className={styles.taskDetail}>- {item.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={styles.warning}>
                    <p className={styles.warningText}>
                      <span className={styles.warningLabel}>注意：</span>{step.warning}
                    </p>
                  </div>
                  
                  {step.difficulty && (
                    <div className={styles.difficultyBox}>
                      <p className={styles.difficultyText}>{step.difficulty}</p>
                      <a href="/start-home-building" className={styles.simulatorLink}>
                        → 家づくり総予算シミュレータで簡単に計算
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 住宅会社への引き継ぎ説明 */}
        <div className={styles.transitionInfo}>
          <h3 className={styles.transitionTitle}>安心の引き継ぎ体制</h3>
          <p className={styles.transitionText}>
            当サイトで準備期・計画期をサポートした後は、あなたに最適な住宅会社へスムーズに引き継ぎます。
            設計期・建築期は、ご紹介した住宅会社が責任を持って対応いたします。
          </p>
        </div>
        
        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>
            まずは総予算シミュレータで、あなたの適正予算を確認してみましょう
          </p>
          <a
            href="/start-home-building"
            className={styles.ctaButton}
          >
            無料で総予算をシミュレーション
          </a>
        </div>
      </div>
    </section>
  );
};

export default StepByStepGuide;