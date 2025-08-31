import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../utils/firebaseConfig';
import styles from './RecommendedCompaniesSection.module.css';

interface RecommendedCompaniesSectionProps {
  buildingBudget: number;
  prefecture: string;
  city: string;
  totalFloorArea: number;
}

interface Company {
  id: string;
  name: string;
  minBudget: number;
  maxBudget: number;
  areas: string[];
  isPremium: boolean;
}

export const RecommendedCompaniesSection: React.FC<RecommendedCompaniesSectionProps> = ({
  buildingBudget,
  prefecture,
  city,
  totalFloorArea
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  
  // LINE URLは環境変数から取得
  const LINE_URL = process.env.NEXT_PUBLIC_LINE_URL || "https://lin.ee/YOUR_LINE_ID";

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // 有料会員の住宅会社を取得
        const companiesRef = collection(db, 'companies');
        const q = query(
          companiesRef,
          where('isPremium', '==', true),
          where('areas', 'array-contains', prefecture),
          where('minBudget', '<=', buildingBudget),
          where('maxBudget', '>=', buildingBudget)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedCompanies: Company[] = [];
        
        querySnapshot.forEach((doc) => {
          fetchedCompanies.push({
            id: doc.id,
            ...doc.data()
          } as Company);
        });
        
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [buildingBudget, prefecture]);

  // LINE CTAコンポーネント
  const LineCTA = () => (
    <div className={styles.container}>
      <h2 className={styles.title}>おすすめ住宅会社を見つける</h2>
      
      {/* 条件サマリー */}
      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>あなたの条件</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>建物予算：</span>
            <span className={styles.summaryValue}>{buildingBudget.toLocaleString()}万円</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>建築エリア：</span>
            <span className={styles.summaryValue}>{prefecture}{city}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>延床面積：</span>
            <span className={styles.summaryValue}>{totalFloorArea}坪</span>
          </div>
        </div>
      </div>

      {/* LINE CTA */}
      <div className={styles.lineCta}>
        <div className={styles.lineHeader}>
          <svg className={styles.lineIcon} viewBox="0 0 24 24" fill="none">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" fill="currentColor"/>
          </svg>
          <h3 className={styles.lineTitle}>住宅会社のご紹介は公式LINEで！</h3>
        </div>
        
        <p className={styles.lineDescription}>
          あなたの条件に合った住宅会社を<br />
          完全無料でご紹介いたします<br />
          ✓
        </p>
        
        <div className={styles.lineFeatures}>
          <div className={styles.lineFeature}>
            <span className={styles.checkmark}>✓</span>
            <span>予算に合った会社を厳選</span>
          </div>
          <div className={styles.lineFeature}>
            <span className={styles.checkmark}>✓</span>
            <span>エリア対応可能な会社のみ</span>
          </div>
          <div className={styles.lineFeature}>
            <span className={styles.checkmark}>✓</span>
            <span>相談・紹介は完全無料</span>
          </div>
        </div>

        <a 
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.lineButton}
        >
          <svg className={styles.lineButtonIcon} viewBox="0 0 24 24" fill="none">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" fill="currentColor"/>
          </svg>
          LINEで無料相談する
        </a>
        
        <p className={styles.lineNote}>
          通常2営業日以内にご返信いたします
        </p>
      </div>

      {/* ご相談の流れ */}
      <div className={styles.flow}>
        <h3 className={styles.flowTitle}>ご相談の流れ</h3>
        <div className={styles.flowSteps}>
          <div className={styles.flowStep}>
            <div className={styles.flowNumber}>1</div>
            <h4 className={styles.flowStepTitle}>LINE友だち追加</h4>
            <p className={styles.flowStepDesc}>上記ボタンから友だち追加</p>
          </div>
          <div className={styles.flowStep}>
            <div className={styles.flowNumber}>2</div>
            <h4 className={styles.flowStepTitle}>詳細をヒアリング</h4>
            <p className={styles.flowStepDesc}>ご希望の詳細を確認</p>
          </div>
          <div className={styles.flowStep}>
            <div className={styles.flowNumber}>3</div>
            <h4 className={styles.flowStepTitle}>住宅会社をご紹介</h4>
            <p className={styles.flowStepDesc}>条件に合った会社を厳選</p>
          </div>
        </div>
      </div>
    </div>
  );

  // ローディング中
  if (loading) {
    return (
      <div className={styles.container}>
        <p>住宅会社を検索中...</p>
      </div>
    );
  }

  // 有料会員が3社未満の場合
  if (companies.length < 3) {
    return <LineCTA />;
  }

  // 有料会員が3社以上の場合
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>おすすめ住宅会社</h2>
      <div className={styles.companiesList}>
        {companies.slice(0, 3).map((company) => (
          <div key={company.id} className={styles.companyCard}>
            <h3>{company.name}</h3>
            <p>予算: {company.minBudget.toLocaleString()}万円〜{company.maxBudget.toLocaleString()}万円</p>
          </div>
        ))}
      </div>
      
      {/* 有料会員が15社未満の場合はLINE CTAも表示 */}
      {companies.length < 15 && (
        <>
          <h2 className={styles.title} style={{ marginTop: '3rem' }}>
            他にもおすすめの住宅会社があります
          </h2>
          <LineCTA />
        </>
      )}
    </div>
  );
};