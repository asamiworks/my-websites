// src/app/companies/page.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  CompanyBasicInfo, 
  CompanyPremiumInfo, 
  CompanySearchFilters,
  CompanySortOption,
  CompanyType,
  Specialty
} from '@/types/company';
import styles from './CompanySearch.module.css';

// 仮のデータ（実際はAPIから取得）
const MOCK_COMPANIES: (CompanyBasicInfo | CompanyPremiumInfo)[] = [
  {
    id: '1',
    name: '○○工務店',
    nameKana: 'マルマルコウムテン',
    establishedYear: 1985,
    capital: 3000,
    employees: 45,
    address: {
      prefecture: '東京都',
      city: '世田谷区',
      street: '○○1-2-3',
      postalCode: '158-0000'
    },
    tel: '03-0000-0000',
    website: 'https://example.com',
    licenses: {
      constructionLicense: '東京都知事許可（般-3）第00000号'
    },
    serviceAreas: ['東京都', '神奈川県', '埼玉県'],
    companyType: '工務店',
    specialties: ['注文住宅', '自然素材', '高気密高断熱'],
    createdAt: new Date(),
    updatedAt: new Date(),
    isVerified: true,
    dataSource: 'public'
  }
];

// 都道府県リスト
const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

const COMPANY_TYPES: CompanyType[] = [
  'ハウスメーカー', '工務店', '設計事務所', 
  'ローコスト住宅', '輸入住宅', 'リフォーム会社'
];

const SPECIALTIES: Specialty[] = [
  '注文住宅', '建売住宅', '二世帯住宅', '平屋', '3階建て',
  'ZEH住宅', '高気密高断熱', '自然素材', 'デザイン住宅', 
  'ローコスト住宅', '狭小住宅', '店舗併用住宅', '賃貸併用住宅'
];

export default function CompanySearchPage() {
  const [companies, setCompanies] = useState<(CompanyBasicInfo | CompanyPremiumInfo)[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<CompanySearchFilters>({});
  const [sortOption, setSortOption] = useState<CompanySortOption>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // 会社データの取得
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      // const response = await fetch('/api/companies', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ filters, sortOption, searchQuery })
      // });
      // const data = await response.json();
      // setCompanies(data.companies);
      
      // 仮実装
      setCompanies(MOCK_COMPANIES);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, sortOption, searchQuery]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // フィルターの更新
  const updateFilter = (key: keyof CompanySearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // プレミアム会社かどうかの判定
  const isPremium = (company: CompanyBasicInfo | CompanyPremiumInfo): company is CompanyPremiumInfo => {
    return 'isPremium' in company && company.isPremium === true;
  };

  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <div className={styles.header}>
        <h1 className={styles.title}>住宅会社を探す</h1>
        <p className={styles.subtitle}>
          あなたの理想の家づくりをサポートする住宅会社を見つけましょう
        </p>
      </div>

      {/* 検索バー */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="会社名・地域名で検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button 
            onClick={fetchCompanies}
            className={styles.searchButton}
          >
            検索
          </button>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={styles.filterToggle}
        >
          {showFilters ? '絞り込みを閉じる' : '絞り込み検索'}
        </button>
      </div>

      {/* フィルター */}
      {showFilters && (
        <div className={styles.filterSection}>
          {/* エリア選択 */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>エリア</label>
            <select
              value={filters.prefecture || ''}
              onChange={(e) => updateFilter('prefecture', e.target.value || undefined)}
              className={styles.filterSelect}
            >
              <option value="">都道府県を選択</option>
              {PREFECTURES.map(pref => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
          </div>

          {/* 会社タイプ */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>会社タイプ</label>
            <div className={styles.checkboxGroup}>
              {COMPANY_TYPES.map(type => (
                <label key={type} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.companyTypes?.includes(type) || false}
                    onChange={(e) => {
                      const types = filters.companyTypes || [];
                      if (e.target.checked) {
                        updateFilter('companyTypes', [...types, type]);
                      } else {
                        updateFilter('companyTypes', types.filter(t => t !== type));
                      }
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* 得意分野 */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>得意分野</label>
            <div className={styles.checkboxGroup}>
              {SPECIALTIES.map(specialty => (
                <label key={specialty} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.specialties?.includes(specialty) || false}
                    onChange={(e) => {
                      const specialties = filters.specialties || [];
                      if (e.target.checked) {
                        updateFilter('specialties', [...specialties, specialty]);
                      } else {
                        updateFilter('specialties', specialties.filter(s => s !== specialty));
                      }
                    }}
                  />
                  {specialty}
                </label>
              ))}
            </div>
          </div>

          {/* 価格帯 */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>坪単価</label>
            <div className={styles.priceRange}>
              <input
                type="number"
                placeholder="下限"
                value={filters.priceRange?.min || ''}
                onChange={(e) => updateFilter('priceRange', {
                  ...filters.priceRange,
                  min: e.target.value ? Number(e.target.value) : undefined
                })}
                className={styles.priceInput}
              />
              <span>〜</span>
              <input
                type="number"
                placeholder="上限"
                value={filters.priceRange?.max || ''}
                onChange={(e) => updateFilter('priceRange', {
                  ...filters.priceRange,
                  max: e.target.value ? Number(e.target.value) : undefined
                })}
                className={styles.priceInput}
              />
              <span>万円</span>
            </div>
          </div>
        </div>
      )}

      {/* ソート */}
      <div className={styles.sortSection}>
        <span className={styles.resultCount}>
          {companies.length}件の住宅会社が見つかりました
        </span>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as CompanySortOption)}
          className={styles.sortSelect}
        >
          <option value="recommended">おすすめ順</option>
          <option value="name">名前順</option>
          <option value="established">設立年順</option>
          <option value="updated">更新日順</option>
        </select>
      </div>

      {/* 会社一覧 */}
      <div className={styles.companyList}>
        {loading ? (
          <div className={styles.loading}>読み込み中...</div>
        ) : companies.length === 0 ? (
          <div className={styles.noResults}>
            条件に合う住宅会社が見つかりませんでした
          </div>
        ) : (
          companies.map(company => (
            <div 
              key={company.id} 
              className={`${styles.companyCard} ${isPremium(company) ? styles.premiumCard : ''}`}
            >
              {isPremium(company) && (
                <div className={styles.premiumBadge}>プレミアム</div>
              )}
              
              <div className={styles.companyHeader}>
                <h2 className={styles.companyName}>{company.name}</h2>
                <span className={styles.companyType}>{company.companyType}</span>
              </div>

              {isPremium(company) && company.pr?.catchphrase && (
                <p className={styles.catchphrase}>{company.pr.catchphrase}</p>
              )}

              <div className={styles.companyInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>所在地:</span>
                  <span>{company.address.prefecture}{company.address.city}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>対応エリア:</span>
                  <span>{company.serviceAreas.join('、')}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>得意分野:</span>
                  <div className={styles.specialtyTags}>
                    {company.specialties.map(specialty => (
                      <span key={specialty} className={styles.specialtyTag}>
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {isPremium(company) && company.pr?.description && (
                <p className={styles.description}>{company.pr.description}</p>
              )}

              <div className={styles.companyActions}>
                <a 
                  href={`/companies/${company.id}`}
                  className={styles.detailButton}
                >
                  詳細を見る
                </a>
                {company.website && (
                  <a 
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.websiteButton}
                  >
                    公式サイト
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ページネーション（後で実装） */}
      <div className={styles.pagination}>
        {/* TODO: ページネーション実装 */}
      </div>
    </div>
  );
}