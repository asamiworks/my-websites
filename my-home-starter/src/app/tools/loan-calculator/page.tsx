'use client';

import { useState } from 'react';
import { HowTo, FAQPage } from '@/components/seo/StructuredData';
import styles from './LoanCalculator.module.css';

interface LoanCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  yearlyPayments: Array<{
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export default function LoanCalculatorPage() {
  // 入力値の状態管理
  const [loanAmount, setLoanAmount] = useState<number>(3000); // 万円
  const [years, setYears] = useState<number>(35);
  const [interestRate, setInterestRate] = useState<number>(0.5);
  const [bonusPayment, setBonusPayment] = useState<number>(0); // 万円
  const [bonusMonths, setBonusMonths] = useState<number>(2); // 年2回
  
  // 計算結果
  const [result, setResult] = useState<LoanCalculation | null>(null);
  
  // ローン計算関数
  const calculateLoan = () => {
    const principal = loanAmount * 10000; // 円に変換
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = years * 12;
    const bonusPerPayment = bonusPayment * 10000;
    const bonusTotal = bonusPerPayment * bonusMonths * years;
    const adjustedPrincipal = principal - bonusTotal;
    
    // 月々の返済額（元利均等）
    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = adjustedPrincipal / totalMonths;
    } else {
      monthlyPayment = adjustedPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) 
        / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }
    
    // 年度別返済計画
    const yearlyPayments = [];
    let remainingBalance = principal;
    
    for (let year = 1; year <= years; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        const monthInterest = remainingBalance * monthlyRate;
        const monthPrincipal = monthlyPayment - monthInterest;
        
        yearlyPrincipal += monthPrincipal;
        yearlyInterest += monthInterest;
        remainingBalance -= monthPrincipal;
      }
      
      // ボーナス払い分を加算
      if (bonusPerPayment > 0) {
        const bonusYearlyTotal = bonusPerPayment * bonusMonths;
        yearlyPrincipal += bonusYearlyTotal;
        remainingBalance -= bonusYearlyTotal;
      }
      
      yearlyPayments.push({
        year,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        balance: Math.max(0, Math.round(remainingBalance)),
      });
    }
    
    const totalPayment = (monthlyPayment * totalMonths) + bonusTotal;
    const totalInterest = totalPayment - principal;
    
    setResult({
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      yearlyPayments,
    });
  };
  
  // FAQ用データ
  const faqItems = [
    {
      question: '変動金利と固定金利、どちらを選ぶべきですか？',
      answer: '変動金利は現在低金利ですが、将来上昇するリスクがあります。固定金利は金利が変わらない安心感がありますが、変動金利より高めです。返済期間や家計の余裕度に応じて選択しましょう。',
    },
    {
      question: 'ボーナス払いは活用すべきですか？',
      answer: 'ボーナス払いを活用すると月々の返済額を抑えられますが、ボーナスが減った場合のリスクもあります。安定したボーナスが見込める場合は、無理のない範囲で活用することをおすすめします。',
    },
    {
      question: '繰上返済はした方がいいですか？',
      answer: '繰上返済をすると総返済額を減らせます。特に返済初期は利息の割合が高いため、効果的です。ただし、手元資金とのバランスを考慮することが大切です。',
    },
  ];
  
  return (
    <div className={styles.container}>
      {/* 構造化データ */}
      <HowTo
        name="住宅ローンシミュレーション"
        description="借入額、返済期間、金利を入力して、月々の返済額と総返済額を計算します"
        steps={[
          { name: '借入額を入力', text: '希望の借入額を万円単位で入力します' },
          { name: '返済期間を選択', text: '返済期間を年単位で選択します（最長35年）' },
          { name: '金利を入力', text: '適用金利を入力します（変動金利または固定金利）' },
          { name: '計算実行', text: '「計算する」ボタンをクリックして結果を確認します' },
        ]}
      />
      <FAQPage mainEntity={faqItems} />
      
      <h1 className={styles.title}>住宅ローン計算機</h1>
      <p className={styles.description}>
        借入額、返済期間、金利を入力して、月々の返済額や総返済額をシミュレーションできます。
      </p>
      
      <div className={styles.calculator}>
        <div className={styles.inputSection}>
          <h2>ローン条件を入力</h2>
          
          <div className={styles.inputGroup}>
            <label>借入額</label>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                min="100"
                max="10000"
                step="100"
              />
              <span className={styles.unit}>万円</span>
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label>返済期間</label>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                min="1"
                max="35"
                step="1"
              />
              <span className={styles.unit}>年</span>
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label>金利（年率）</label>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                min="0"
                max="10"
                step="0.1"
              />
              <span className={styles.unit}>%</span>
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label>ボーナス払い（1回あたり）</label>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                value={bonusPayment}
                onChange={(e) => setBonusPayment(Number(e.target.value))}
                min="0"
                max="500"
                step="10"
              />
              <span className={styles.unit}>万円</span>
            </div>
          </div>
          
          <button onClick={calculateLoan} className={styles.calculateButton}>
            計算する
          </button>
        </div>
        
        {result && (
          <div className={styles.resultSection}>
            <h2>計算結果</h2>
            
            <div className={styles.resultSummary}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>月々の返済額</span>
                <span className={styles.resultValue}>
                  {result.monthlyPayment.toLocaleString()}円
                </span>
              </div>
              
              {bonusPayment > 0 && (
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>ボーナス払い（年{bonusMonths}回）</span>
                  <span className={styles.resultValue}>
                    {(bonusPayment * 10000).toLocaleString()}円/回
                  </span>
                </div>
              )}
              
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>総返済額</span>
                <span className={styles.resultValue}>
                  {result.totalPayment.toLocaleString()}円
                </span>
              </div>
              
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>総利息額</span>
                <span className={styles.resultValue}>
                  {result.totalInterest.toLocaleString()}円
                </span>
              </div>
            </div>
            
            <div className={styles.yearlyBreakdown}>
              <h3>年度別返済計画（最初の10年）</h3>
              <table className={styles.breakdownTable}>
                <thead>
                  <tr>
                    <th>年度</th>
                    <th>元金</th>
                    <th>利息</th>
                    <th>残高</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyPayments.slice(0, 10).map((year) => (
                    <tr key={year.year}>
                      <td>{year.year}年目</td>
                      <td>{year.principal.toLocaleString()}円</td>
                      <td>{year.interest.toLocaleString()}円</td>
                      <td>{year.balance.toLocaleString()}円</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.faqSection}>
        <h2>よくある質問</h2>
        {faqItems.map((item, index) => (
          <div key={index} className={styles.faqItem}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
      </div>
      
      <div className={styles.ctaSection}>
        <h2>総予算シミュレーションで適切な借入額を知る</h2>
        <p>
          土地代、建築費、諸費用をすべて含めた総予算から、適切な借入額を算出します。
        </p>
        <a href="/start-home-building" className={styles.ctaButton}>
          総予算シミュレーションを始める
        </a>
      </div>
    </div>
  );
}