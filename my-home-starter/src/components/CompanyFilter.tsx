'use client';

import { useState, useEffect } from 'react';
import styles from './CompanyFilter.module.css';

interface CompanyFilterProps {
  totalCount: number;
  premiumCount: number;
}

export default function CompanyFilter({ totalCount, premiumCount }: CompanyFilterProps) {
  const [showOnlyPremium, setShowOnlyPremium] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'distance' | 'price_low' | 'price_high'>('recommended');
  const [displayCount, setDisplayCount] = useState(totalCount);

  useEffect(() => {
    // フィルタリングとソートの実行
    const companyCards = document.querySelectorAll('[data-premium]');
    let visibleCount = 0;
    
    // カードの配列を作成
    const cards = Array.from(companyCards) as HTMLElement[];
    
    // フィルタリング
    cards.forEach(card => {
      const isPremium = card.getAttribute('data-premium') === 'true';
      if (showOnlyPremium && !isPremium) {
        card.style.display = 'none';
      } else {
        card.style.display = 'block';
        visibleCount++;
      }
    });
    
    // ソート
    const container = document.getElementById('company-list');
    if (!container) return;
    
    const sortedCards = cards
      .filter(card => card.style.display !== 'none')
      .sort((a, b) => {
        const aIsPremium = a.getAttribute('data-premium') === 'true';
        const bIsPremium = b.getAttribute('data-premium') === 'true';
        
        switch (sortBy) {
          case 'recommended':
            if (aIsPremium !== bIsPremium) return aIsPremium ? -1 : 1;
            return parseFloat(a.getAttribute('data-distance') || '9999') - 
                   parseFloat(b.getAttribute('data-distance') || '9999');
          
          case 'distance':
            return parseFloat(a.getAttribute('data-distance') || '9999') - 
                   parseFloat(b.getAttribute('data-distance') || '9999');
          
          case 'price_low':
            return parseFloat(a.getAttribute('data-min-price') || '999') - 
                   parseFloat(b.getAttribute('data-min-price') || '999');
          
          case 'price_high':
            return parseFloat(b.getAttribute('data-max-price') || '0') - 
                   parseFloat(a.getAttribute('data-max-price') || '0');
          
          default:
            return 0;
        }
      });
    
    // 並び替えた要素を再配置
    sortedCards.forEach(card => {
      container.appendChild(card);
    });
    
    setDisplayCount(visibleCount);
  }, [showOnlyPremium, sortBy, totalCount]);

  return (
    <div className={styles.filterContainer}>
      <h3 className={styles.title}>🔍 表示設定</h3>
      
      <div className={styles.filterGrid}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>表示する会社</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="display"
                checked={!showOnlyPremium}
                onChange={() => setShowOnlyPremium(false)}
              />
              すべて
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="display"
                checked={showOnlyPremium}
                onChange={() => setShowOnlyPremium(true)}
              />
              坪単価公開中
            </label>
          </div>
        </div>
        
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>並び順</label>
          <select 
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="recommended">おすすめ順</option>
            <option value="distance">距離が近い順</option>
            <option value="price_low">坪単価が安い順</option>
            <option value="price_high">坪単価が高い順</option>
          </select>
        </div>
      </div>
      
      <div className={styles.resultCount}>
        表示中: {displayCount}社
      </div>
      
      {/* 注意書きを追加 */}
      <div className={styles.notice}>
        <p className={styles.noticeText}>
          ※ 選択された地域から半径50km圏内の住宅会社を表示しています。<br />
          施工エリアについては各社へ直接お問い合わせください。
        </p>
      </div>
    </div>
  );
}