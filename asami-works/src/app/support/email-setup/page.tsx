'use client';

import { useState } from 'react';
import styles from './EmailSetup.module.css';

type ServerType = 'sakura' | 'xserver' | 'lolipop' | 'conoha' | 'other';
type DeviceType = 'iphone' | 'android' | 'outlook-win' | 'outlook-mac' | 'thunderbird' | 'mac-mail' | 'gmail';

interface ServerConfig {
  name: string;
  imap: {
    server: string;
    port: number;
    security: string;
  };
  smtp: {
    server: string;
    port: number;
    security: string;
  };
}

const serverConfigs: Record<ServerType, ServerConfig> = {
  sakura: {
    name: 'さくらインターネット',
    imap: {
      server: '{domain}',
      port: 993,
      security: 'SSL/TLS'
    },
    smtp: {
      server: '{domain}',
      port: 587,
      security: 'STARTTLS'
    }
  },
  xserver: {
    name: 'エックスサーバー',
    imap: {
      server: 'sv{number}.xserver.jp',
      port: 993,
      security: 'SSL/TLS'
    },
    smtp: {
      server: 'sv{number}.xserver.jp',
      port: 465,
      security: 'SSL/TLS'
    }
  },
  lolipop: {
    name: 'ロリポップ',
    imap: {
      server: 'imap.lolipop.jp',
      port: 993,
      security: 'SSL/TLS'
    },
    smtp: {
      server: 'smtp.lolipop.jp',
      port: 465,
      security: 'SSL/TLS'
    }
  },
  conoha: {
    name: 'ConoHa WING',
    imap: {
      server: 'mail.{domain}',
      port: 993,
      security: 'SSL/TLS'
    },
    smtp: {
      server: 'mail.{domain}',
      port: 587,
      security: 'STARTTLS'
    }
  },
  other: {
    name: 'その他',
    imap: {
      server: 'mail.{domain}',
      port: 993,
      security: 'SSL/TLS'
    },
    smtp: {
      server: 'mail.{domain}',
      port: 587,
      security: 'STARTTLS'
    }
  }
};

const deviceInstructions: Record<DeviceType, string> = {
  'iphone': 'iPhone / iPad',
  'android': 'Android',
  'outlook-win': 'Outlook (Windows)',
  'outlook-mac': 'Outlook (Mac)',
  'thunderbird': 'Thunderbird',
  'mac-mail': 'Macメール',
  'gmail': 'Gmail'
};

export default function EmailSetupPage() {
  const [urlInput, setUrlInput] = useState('');
  const [serverType, setServerType] = useState<ServerType>('sakura');
  const [deviceType, setDeviceType] = useState<DeviceType | ''>('');
  const [showConfig, setShowConfig] = useState(false);

  // URLからドメインを抽出する関数
  const extractDomain = (input: string): string => {
    let domain = input.trim();
    
    // プロトコルを除去
    domain = domain.replace(/^https?:\/\//, '');
    
    // wwwを除去
    domain = domain.replace(/^www\./, '');
    
    // パスを除去
    domain = domain.split('/')[0];
    
    // ポート番号を除去
    domain = domain.split(':')[0];
    
    return domain;
  };

  const handleShowConfig = () => {
    if (!urlInput || !deviceType) {
      alert('すべての項目を入力してください。');
      return;
    }
    setShowConfig(true);
  };

  const domain = extractDomain(urlInput);
  const config = serverConfigs[serverType];

  // サーバー名にドメインを適用
  const getServerName = (template: string): string => {
    if (serverType === 'sakura') {
      // さくらの場合は初期ドメインを使用することが多い
      return template.replace('{domain}', domain);
    } else if (serverType === 'xserver') {
      // エックスサーバーの場合はサーバー番号が必要
      return template;
    }
    return template.replace('{domain}', domain);
  };

  const getDeviceSpecificInstructions = () => {
    switch(deviceType) {
      case 'iphone':
        return (
          <div className={styles.instructions}>
            <h4>iPhone/iPadでの設定手順</h4>
            <ol>
              <li>「設定」アプリを開く</li>
              <li>「メール」→「アカウント」→「アカウントを追加」をタップ</li>
              <li>「その他」→「メールアカウントを追加」を選択</li>
              <li>
                以下の情報を入力：
                <ul>
                  <li>名前: お名前</li>
                  <li>メール: 別途お送りしたメールアドレス</li>
                  <li>パスワード: 別途お送りしたパスワード</li>
                  <li>説明: 任意（例：仕事用）</li>
                </ul>
              </li>
              <li>「次へ」をタップ後、「IMAP」を選択</li>
              <li>下記のサーバー情報を入力</li>
              <li>「保存」をタップして完了</li>
            </ol>
          </div>
        );
      case 'android':
        return (
          <div className={styles.instructions}>
            <h4>Androidでの設定手順</h4>
            <ol>
              <li>「Gmail」アプリを開く</li>
              <li>メニュー → 「設定」 → 「アカウントを追加」をタップ</li>
              <li>「その他」を選択</li>
              <li>メールアドレスを入力して「手動設定」を選択</li>
              <li>「個人用（IMAP）」を選択</li>
              <li>パスワードを入力</li>
              <li>下記のサーバー情報を入力</li>
              <li>「次へ」をタップして完了</li>
            </ol>
          </div>
        );
      case 'outlook-win':
      case 'outlook-mac':
        return (
          <div className={styles.instructions}>
            <h4>Outlookでの設定手順</h4>
            <ol>
              <li>Outlookを起動</li>
              <li>「ファイル」→「アカウントの追加」を選択</li>
              <li>メールアドレスを入力</li>
              <li>「詳細オプション」→「自分で自分のアカウントを手動で設定」にチェック</li>
              <li>「接続」をクリック</li>
              <li>「IMAP」を選択</li>
              <li>下記のサーバー情報を入力</li>
              <li>パスワードを入力して「接続」をクリック</li>
            </ol>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>メール設定マニュアル</h1>
        <p className={styles.subtitle}>
          お客様のメール設定に必要な情報をご案内いたします
        </p>
      </div>

      <div className={styles.requirements}>
        <h3>📋 ご用意いただくもの</h3>
        <ul>
          <li>別途お送りしたメールアドレス</li>
          <li>別途お送りしたパスワード</li>
          <li>設定するデバイス（PC/スマートフォン）</li>
        </ul>
      </div>

      <div className={styles.form}>
        <h3>設定情報の確認</h3>
        
        <div className={styles.formGroup}>
          <label>
            1. サイトURL または ドメイン
            <span className={styles.required}>必須</span>
          </label>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="例：https://example.com または example.com"
            className={styles.input}
          />
          <small>※どちらの形式でも入力可能です</small>
        </div>

        <div className={styles.formGroup}>
          <label>
            2. ご利用のサーバー
            <span className={styles.required}>必須</span>
          </label>
          <select
            value={serverType}
            onChange={(e) => setServerType(e.target.value as ServerType)}
            className={styles.select}
          >
            <option value="sakura">さくらインターネット</option>
            <option value="xserver">エックスサーバー</option>
            <option value="lolipop">ロリポップ</option>
            <option value="conoha">ConoHa WING</option>
            <option value="other">その他</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>
            3. 設定するデバイス・メールソフト
            <span className={styles.required}>必須</span>
          </label>
          <select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value as DeviceType)}
            className={styles.select}
          >
            <option value="">選択してください</option>
            <option value="iphone">iPhone / iPad</option>
            <option value="android">Android</option>
            <option value="outlook-win">Outlook (Windows)</option>
            <option value="outlook-mac">Outlook (Mac)</option>
            <option value="thunderbird">Thunderbird</option>
            <option value="mac-mail">Macメール</option>
            <option value="gmail">Gmail</option>
          </select>
        </div>

        <button 
          className={styles.submitButton}
          onClick={handleShowConfig}
        >
          設定情報を表示する
        </button>
      </div>

      {showConfig && (
        <>
          <div className={styles.configSection}>
            <h3>📧 お客様専用の設定情報</h3>
            
            <div className={styles.configBox}>
              <div className={styles.configItem}>
                <span className={styles.label}>メールアドレス：</span>
                <span className={styles.value}>別途お送りしたメールアドレス</span>
              </div>
              <div className={styles.configItem}>
                <span className={styles.label}>パスワード：</span>
                <span className={styles.value}>別途お送りしたパスワード</span>
              </div>
            </div>

            <div className={styles.serverConfig}>
              <h4>受信サーバー（IMAP）</h4>
              <div className={styles.configGrid}>
                <div className={styles.configRow}>
                  <span className={styles.configLabel}>サーバー名：</span>
                  <span className={styles.configValue}>
                    {getServerName(config.imap.server)}
                  </span>
                </div>
                <div className={styles.configRow}>
                  <span className={styles.configLabel}>ポート番号：</span>
                  <span className={styles.configValue}>{config.imap.port}</span>
                </div>
                <div className={styles.configRow}>
                  <span className={styles.configLabel}>セキュリティ：</span>
                  <span className={styles.configValue}>{config.imap.security}</span>
                </div>
              </div>
            </div>

            <div className={styles.serverConfig}>
              <h4>送信サーバー（SMTP）</h4>
              <div className={styles.configGrid}>
                <div className={styles.configRow}>
                  <span className={styles.configLabel}>サーバー名：</span>
                  <span className={styles.configValue}>
                    {getServerName(config.smtp.server)}
                  </span>
                </div>
                <div className={styles.configRow}>
                  <span className={styles.configLabel}>ポート番号：</span>
                  <span className={styles.configValue}>{config.smtp.port}</span>
                </div>
                <div className={styles.configRow}>
                  <span className={styles.configLabel}>セキュリティ：</span>
                  <span className={styles.configValue}>{config.smtp.security}</span>
                </div>
              </div>
            </div>

            <div className={styles.notice}>
              <p>※ パスワードは安全のため、このページには表示されません。</p>
              <p>別途お送りした情報をご確認ください。</p>
            </div>
          </div>

          {getDeviceSpecificInstructions()}
        </>
      )}

      <div className={styles.support}>
        <h3>お困りの場合</h3>
        <div className={styles.supportButtons}>
          <a href="/form?type=support" className={styles.supportButton}>
            設定サポートを依頼
          </a>
        </div>
      </div>
    </div>
  );
}