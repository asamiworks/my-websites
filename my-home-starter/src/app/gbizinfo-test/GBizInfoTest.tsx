'use client';

import React, { useState } from 'react';
import styles from './GBizInfoTest.module.css';

interface TestResult {
  loading: boolean;
  data: any;
  error: string | null;
}

export default function GBizInfoTestPage() {
  const [testResult, setTestResult] = useState<TestResult>({
    loading: false,
    data: null,
    error: null,
  });
  const [corporateNumber, setCorporateNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [testType, setTestType] = useState('basic');

  const runTest = async () => {
    setTestResult({ loading: true, data: null, error: null });

    try {
      let url = '/api/gbizinfo-test';
      const params = new URLSearchParams();

      if (corporateNumber) {
        params.append('corporate_number', corporateNumber);
        params.append('test_type', testType);
      } else if (companyName) {
        params.append('company_name', companyName);
      }

      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'APIテストに失敗しました');
      }

      setTestResult({ loading: false, data, error: null });
    } catch (error) {
      setTestResult({
        loading: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const runComplexSearch = async () => {
    setTestResult({ loading: true, data: null, error: null });

    try {
      const searchParams = {
        prefecture: '東京都',
        business_item: '建設',
        limit: '20',
        page: '1',
      };

      const response = await fetch('/api/gbizinfo-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'APIテストに失敗しました');
      }

      setTestResult({ loading: false, data, error: null });
    } catch (error) {
      setTestResult({
        loading: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>gBizINFO API テスト</h1>

      <div className={styles.testSection}>
        <h2>基本テスト</h2>
        
        <div className={styles.inputGroup}>
          <label>
            法人番号で検索:
            <input
              type="text"
              value={corporateNumber}
              onChange={(e) => setCorporateNumber(e.target.value)}
              placeholder="例: 4000012090001"
              className={styles.input}
            />
          </label>
        </div>

        <div className={styles.inputGroup}>
          <label>
            会社名で検索:
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="例: 積水ハウス"
              className={styles.input}
              disabled={!!corporateNumber}
            />
          </label>
        </div>

        <div className={styles.inputGroup}>
          <label>
            取得する情報:
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className={styles.select}
              disabled={!corporateNumber}
            >
              <option value="basic">基本情報</option>
              <option value="all">すべての情報</option>
              <option value="subsidy">補助金情報</option>
              <option value="procurement">調達情報</option>
              <option value="patent">特許情報</option>
              <option value="finance">財務情報</option>
              <option value="workplace">職場情報</option>
            </select>
          </label>
        </div>

        <button
          onClick={runTest}
          disabled={testResult.loading || (!corporateNumber && !companyName)}
          className={styles.button}
        >
          {testResult.loading ? 'テスト中...' : 'テスト実行'}
        </button>

        <button
          onClick={() => {
            setCorporateNumber('');
            setCompanyName('');
            runTest();
          }}
          disabled={testResult.loading}
          className={styles.button}
        >
          住宅関連企業でテスト
        </button>
      </div>

      <div className={styles.testSection}>
        <h2>複雑な検索テスト</h2>
        <p>東京都の建設業を検索</p>
        <button
          onClick={runComplexSearch}
          disabled={testResult.loading}
          className={styles.button}
        >
          検索実行
        </button>
      </div>

      {testResult.error && (
        <div className={styles.error}>
          <h3>エラー</h3>
          <pre>{testResult.error}</pre>
        </div>
      )}

      {testResult.data && (
        <div className={styles.result}>
          <h3>テスト結果</h3>
          <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
        </div>
      )}

      <div className={styles.sampleNumbers}>
        <h3>テスト用法人番号サンプル</h3>
        <ul>
          <li>経済産業省: 4000012090001</li>
          <li>トヨタ自動車: 1180301018771</li>
          <li>積水ハウス: 8120001059652</li>
          <li>大和ハウス工業: 8120001059917</li>
          <li>住友林業: 1010001008896</li>
          <li>パナソニックホームズ: 7120001117310</li>
          <li>三井ホーム: 8010401029720</li>
          <li>ミサワホーム: 4010001008848</li>
        </ul>
      </div>
    </div>
  );
}
