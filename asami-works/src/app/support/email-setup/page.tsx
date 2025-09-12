'use client';

import { useState } from 'react';
import styles from './EmailSetup.module.css';

type ServerType = 'sakura' | 'xserver' | 'lolipop' | 'conoha' | 'firebase' | 'other';
type DeviceType = 'iphone' | 'android' | 'outlook-win' | 'outlook-mac' | 'thunderbird' | 'mac-mail' | 'gmail';

interface ServerConfig {
  name: string;
  needsInitialDomain?: boolean;
  needsServerNumber?: boolean;
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
  notes?: string;
}

const serverConfigs: Record<ServerType, ServerConfig> = {
  sakura: {
    name: 'さくらインターネット',
    needsInitialDomain: true,
    imap: {
      server: '{initialDomain}',
      port: 993,
      security: 'SSL/TLS'
    },
    smtp: {
      server: '{initialDomain}',
      port: 587,
      security: 'STARTTLS'
    },
    notes: '初期ドメイン（○○.sakura.ne.jp）を使用します'
  },
  xserver: {
    name: 'エックスサーバー',
    needsServerNumber: true,
    imap: {
      server: 'sv{serverNumber}.xserver.jp',
      port: 993,
      security: 'SSL/TLS'
    },
    smtp: {
      server: 'sv{serverNumber}.xserver.jp',
      port: 465,
      security: 'SSL/TLS'
    },
    notes: 'サーバー番号は契約時のメールに記載されています'
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
  firebase: {
    name: 'Firebase Hosting',
    imap: {
      server: 'mail.{domain}',
      port: 993,
      security: 'SSL/TLS'
    },
    smtp: {
      server: 'mail.{domain}',
      port: 587,
      security: 'STARTTLS'
    },
    notes: 'Firebase Hostingをご利用の場合、メールサービスは別途ご契約のメールプロバイダーの設定を使用します'
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

// デバイスごとの文言設定
const deviceTerminology: Record<DeviceType, {
  displayName: string;
  serverLabel: string;
  imapLabel: string;
  smtpLabel: string;
  portLabel: string;
  securityLabel: string;
}> = {
  'iphone': {
    displayName: 'iPhone / iPad',
    serverLabel: 'ホスト名',
    imapLabel: '受信メールサーバ',
    smtpLabel: '送信メールサーバ',
    portLabel: 'ポート',
    securityLabel: 'SSLを使用'
  },
  'android': {
    displayName: 'Android (Gmail アプリ)',
    serverLabel: 'サーバー',
    imapLabel: '受信サーバー',
    smtpLabel: '送信サーバー',
    portLabel: 'ポート',
    securityLabel: 'セキュリティの種類'
  },
  'outlook-win': {
    displayName: 'Outlook (Windows)',
    serverLabel: 'サーバー',
    imapLabel: '受信メール サーバー',
    smtpLabel: '送信メール サーバー',
    portLabel: 'ポート',
    securityLabel: '暗号化方法'
  },
  'outlook-mac': {
    displayName: 'Outlook (Mac)',
    serverLabel: 'サーバー',
    imapLabel: '受信メール サーバー',
    smtpLabel: '送信メール サーバー',
    portLabel: 'ポート',
    securityLabel: '暗号化方法'
  },
  'thunderbird': {
    displayName: 'Thunderbird',
    serverLabel: 'サーバー',
    imapLabel: '受信サーバー',
    smtpLabel: '送信サーバー',
    portLabel: 'ポート番号',
    securityLabel: '接続の保護'
  },
  'mac-mail': {
    displayName: 'Mac メール',
    serverLabel: 'ホスト名',
    imapLabel: '受信用メールサーバ',
    smtpLabel: '送信用メールサーバ',
    portLabel: 'ポート',
    securityLabel: '認証'
  },
  'gmail': {
    displayName: 'Gmail (ブラウザ)',
    serverLabel: 'サーバー',
    imapLabel: '受信メールサーバー',
    smtpLabel: '送信メールサーバー',
    portLabel: 'ポート',
    securityLabel: 'セキュリティ'
  }
};

export default function EmailSetupPage() {
  const [urlInput, setUrlInput] = useState('');
  const [serverType, setServerType] = useState<ServerType>('sakura');
  const [deviceType, setDeviceType] = useState<DeviceType | ''>('');
  const [showConfig, setShowConfig] = useState(false);
  const [initialDomain, setInitialDomain] = useState('');
  const [serverNumber, setServerNumber] = useState('');
  const [showProtocolModal, setShowProtocolModal] = useState(false);

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
    
    // さくらインターネットの場合、初期ドメインの入力をチェック
    if (serverType === 'sakura' && !initialDomain) {
      alert('さくらインターネットの初期ドメインを入力してください。');
      return;
    }
    
    // エックスサーバーの場合、サーバー番号の入力をチェック
    if (serverType === 'xserver' && !serverNumber) {
      alert('エックスサーバーのサーバー番号を入力してください。');
      return;
    }
    
    setShowConfig(true);
  };

  const domain = extractDomain(urlInput);
  const config = serverConfigs[serverType];
  const terminology = deviceType ? deviceTerminology[deviceType] : null;

  // サーバー名を実際の値に変換
  const getActualServerName = (template: string): string => {
    if (serverType === 'sakura') {
      return template.replace('{initialDomain}', initialDomain);
    } else if (serverType === 'xserver') {
      return template.replace('{serverNumber}', serverNumber);
    }
    return template.replace('{domain}', domain);
  };

  const getDeviceSpecificInstructions = () => {
    if (!terminology) return null;
    
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
              <li>
                <strong>{terminology.imapLabel}</strong>
                <ul>
                  <li>{terminology.serverLabel}: {getActualServerName(config.imap.server)}</li>
                  <li>ユーザ名: メールアドレス全体</li>
                  <li>パスワード: 別途お送りしたパスワード</li>
                </ul>
              </li>
              <li>
                <strong>{terminology.smtpLabel}</strong>
                <ul>
                  <li>{terminology.serverLabel}: {getActualServerName(config.smtp.server)}</li>
                  <li>ユーザ名: メールアドレス全体</li>
                  <li>パスワード: 別途お送りしたパスワード</li>
                </ul>
              </li>
              <li>「保存」をタップして完了</li>
            </ol>
            <div className={styles.notice}>
              <p>※ 詳細設定で{terminology.portLabel}の設定が必要な場合があります</p>
            </div>
          </div>
        );
      case 'android':
        return (
          <div className={styles.instructions}>
            <h4>Android (Gmail アプリ)での設定手順</h4>
            <ol>
              <li>「Gmail」アプリを開く</li>
              <li>メニュー（三本線）→「設定」→「アカウントを追加」をタップ</li>
              <li>「その他」を選択</li>
              <li>メールアドレスを入力して「手動設定」を選択</li>
              <li>「個人用（IMAP）」を選択</li>
              <li>パスワードを入力</li>
              <li>
                <strong>{terminology.imapLabel}の設定</strong>
                <ul>
                  <li>ユーザー名: メールアドレス全体</li>
                  <li>パスワード: 別途お送りしたパスワード</li>
                  <li>{terminology.serverLabel}: {getActualServerName(config.imap.server)}</li>
                  <li>{terminology.portLabel}: {config.imap.port}</li>
                  <li>{terminology.securityLabel}: {config.imap.security}</li>
                </ul>
              </li>
              <li>
                <strong>{terminology.smtpLabel}の設定</strong>
                <ul>
                  <li>ログインが必要: オン</li>
                  <li>ユーザー名: メールアドレス全体</li>
                  <li>パスワード: 別途お送りしたパスワード</li>
                  <li>{terminology.serverLabel}: {getActualServerName(config.smtp.server)}</li>
                  <li>{terminology.portLabel}: {config.smtp.port}</li>
                  <li>{terminology.securityLabel}: {config.smtp.security}</li>
                </ul>
              </li>
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
              <li>
                <strong>{terminology.imapLabel}</strong>
                <ul>
                  <li>{terminology.serverLabel}: {getActualServerName(config.imap.server)}</li>
                  <li>{terminology.portLabel}: {config.imap.port}</li>
                  <li>{terminology.securityLabel}: {config.imap.security}</li>
                </ul>
              </li>
              <li>
                <strong>{terminology.smtpLabel}</strong>
                <ul>
                  <li>{terminology.serverLabel}: {getActualServerName(config.smtp.server)}</li>
                  <li>{terminology.portLabel}: {config.smtp.port}</li>
                  <li>{terminology.securityLabel}: {config.smtp.security}</li>
                </ul>
              </li>
              <li>パスワードを入力して「接続」をクリック</li>
            </ol>
          </div>
        );
      case 'thunderbird':
        return (
          <div className={styles.instructions}>
            <h4>Thunderbirdでの設定手順</h4>
            <ol>
              <li>Thunderbirdを起動</li>
              <li>「新しいアカウントを作成する」または「メール」を選択</li>
              <li>「既存のメールアドレスを使用」を選択</li>
              <li>
                アカウント情報を入力：
                <ul>
                  <li>あなたのお名前: お名前</li>
                  <li>メールアドレス: 別途お送りしたメールアドレス</li>
                  <li>パスワード: 別途お送りしたパスワード</li>
                </ul>
              </li>
              <li>「手動設定」をクリック</li>
              <li>
                <strong>{terminology.imapLabel}</strong>
                <ul>
                  <li>プロトコル: IMAP</li>
                  <li>{terminology.serverLabel}: {getActualServerName(config.imap.server)}</li>
                  <li>{terminology.portLabel}: {config.imap.port}</li>
                  <li>{terminology.securityLabel}: {config.imap.security}</li>
                  <li>認証方式: 通常のパスワード認証</li>
                </ul>
              </li>
              <li>
                <strong>{terminology.smtpLabel}</strong>
                <ul>
                  <li>{terminology.serverLabel}: {getActualServerName(config.smtp.server)}</li>
                  <li>{terminology.portLabel}: {config.smtp.port}</li>
                  <li>{terminology.securityLabel}: {config.smtp.security}</li>
                  <li>認証方式: 通常のパスワード認証</li>
                </ul>
              </li>
              <li>「完了」をクリック</li>
            </ol>
          </div>
        );
      case 'mac-mail':
        return (
          <div className={styles.instructions}>
            <h4>Mac メールでの設定手順</h4>
            <ol>
              <li>メールアプリを起動</li>
              <li>「メール」→「環境設定」→「アカウント」を選択</li>
              <li>左下の「+」ボタンをクリック</li>
              <li>「その他のメールアカウント」を選択して「続ける」</li>
              <li>
                アカウント情報を入力：
                <ul>
                  <li>名前: お名前</li>
                  <li>メールアドレス: 別途お送りしたメールアドレス</li>
                  <li>パスワード: 別途お送りしたパスワード</li>
                </ul>
              </li>
              <li>「サインイン」をクリック</li>
              <li>
                <strong>{terminology.imapLabel}</strong>
                <ul>
                  <li>アカウントの種類: IMAP</li>
                  <li>{terminology.serverLabel}: {getActualServerName(config.imap.server)}</li>
                  <li>ユーザ名: メールアドレス全体</li>
                  <li>パスワード: 別途お送りしたパスワード</li>
                </ul>
              </li>
              <li>
                <strong>{terminology.smtpLabel}</strong>
                <ul>
                  <li>{terminology.serverLabel}: {getActualServerName(config.smtp.server)}</li>
                  <li>ユーザ名: メールアドレス全体</li>
                  <li>パスワード: 別途お送りしたパスワード</li>
                </ul>
              </li>
              <li>「サインイン」をクリックして完了</li>
            </ol>
          </div>
        );
      case 'gmail':
        return (
          <div className={styles.instructions}>
            <h4>Gmail (ブラウザ版)での設定手順</h4>
            <ol>
              <li>Gmailにログイン</li>
              <li>右上の歯車アイコン →「すべての設定を表示」</li>
              <li>「アカウントとインポート」タブを選択</li>
              <li>「他のアカウントのメールを確認」の「メールアカウントを追加する」をクリック</li>
              <li>メールアドレスを入力して「次へ」</li>
              <li>「他のアカウントからメールを読み込む（POP3）」を選択</li>
              <li>
                以下の情報を入力：
                <ul>
                  <li>ユーザー名: メールアドレス全体</li>
                  <li>パスワード: 別途お送りしたパスワード</li>
                  <li>POPサーバー: {getActualServerName(config.imap.server)}</li>
                  <li>ポート: 995</li>
                  <li>「メールの取得にセキュリティで保護された接続（SSL）を使用する」にチェック</li>
                </ul>
              </li>
              <li>送信設定も行う場合は、指示に従って{terminology.smtpLabel}の設定を行う</li>
            </ol>
            <div className={styles.notice}>
              <p>※ Gmail（ブラウザ版）ではIMAPよりPOP3での設定が一般的です</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // IMAP/POPモーダルコンポーネント
  const ProtocolModal = () => {
    if (!showProtocolModal) return null;

    return (
      <div className={styles.modalOverlay} onClick={() => setShowProtocolModal(false)}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button 
            className={styles.modalClose} 
            onClick={() => setShowProtocolModal(false)}
            aria-label="閉じる"
          >
            ×
          </button>
          <h3>IMAPとPOPの違い</h3>
          
          <div className={styles.protocolSection}>
            <h4>IMAP（推奨）</h4>
            <p>
              Internet Message Access Protocolの略称で、メールサーバー上のメールを直接管理する方式です。
            </p>
            <div className={styles.protocolFeatures}>
              <strong>特徴：</strong>
              <ul>
                <li>複数のデバイスで同じメールボックスを同期</li>
                <li>メールはサーバー上に保存される</li>
                <li>フォルダ分けや既読状態が全デバイスで共有</li>
                <li>サーバー容量の範囲内でメールを保存</li>
              </ul>
            </div>
            <div className={styles.protocolUsage}>
              <strong>こんな方におすすめ：</strong>
              <p>スマートフォンとPCなど、複数のデバイスでメールを確認したい方</p>
            </div>
          </div>

          <div className={styles.protocolSection}>
            <h4>POP（POP3）</h4>
            <p>
              Post Office Protocol version 3の略称で、メールをサーバーからダウンロードして管理する方式です。
            </p>
            <div className={styles.protocolFeatures}>
              <strong>特徴：</strong>
              <ul>
                <li>メールを端末にダウンロードして保存</li>
                <li>ダウンロード後、サーバーから削除可能</li>
                <li>オフラインでもメールを閲覧可能</li>
                <li>端末の容量に依存</li>
              </ul>
            </div>
            <div className={styles.protocolUsage}>
              <strong>こんな方におすすめ：</strong>
              <p>1台のデバイスのみでメールを管理したい方、サーバー容量を節約したい方</p>
            </div>
          </div>

          <div className={styles.protocolRecommendation}>
            <p><strong>現在は複数デバイスでの利用が一般的なため、IMAPの使用を推奨しています。</strong></p>
          </div>
        </div>
      </div>
    );
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
        <h3>ご用意いただくもの</h3>
        <ul>
          <li>別途お送りしたメールアドレス</li>
          <li>別途お送りしたパスワード</li>
          <li>設定するデバイス（PC/スマートフォン）</li>
          <li>サーバー固有の情報（サーバーによって異なります）
            <ul>
              <li>さくらインターネット：初期ドメイン（○○.sakura.ne.jp）</li>
              <li>エックスサーバー：サーバー番号（sv○○○○）</li>
              <li>その他：通常は不要</li>
            </ul>
          </li>
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
            <option value="firebase">Firebase Hosting</option>
            <option value="other">その他</option>
          </select>
        </div>

        {/* さくらインターネットの場合、初期ドメイン入力欄を表示 */}
        {serverType === 'sakura' && (
          <div className={styles.formGroup}>
            <label>
              2-1. さくらの初期ドメイン
              <span className={styles.required}>必須</span>
            </label>
            <input
              type="text"
              value={initialDomain}
              onChange={(e) => setInitialDomain(e.target.value)}
              placeholder="例：username.sakura.ne.jp"
              className={styles.input}
            />
            <small>※ 契約時に提供された初期ドメインを入力してください</small>
          </div>
        )}

        {/* エックスサーバーの場合、サーバー番号入力欄を表示 */}
        {serverType === 'xserver' && (
          <div className={styles.formGroup}>
            <label>
              2-1. サーバー番号
              <span className={styles.required}>必須</span>
            </label>
            <input
              type="text"
              value={serverNumber}
              onChange={(e) => setServerNumber(e.target.value)}
              placeholder="例：12345"
              className={styles.input}
            />
            <small>※ sv○○○○.xserver.jp の数字部分のみ入力（例：sv12345なら「12345」）</small>
          </div>
        )}

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
            <option value="android">Android (Gmail アプリ)</option>
            <option value="outlook-win">Outlook (Windows)</option>
            <option value="outlook-mac">Outlook (Mac)</option>
            <option value="thunderbird">Thunderbird</option>
            <option value="mac-mail">Mac メール</option>
            <option value="gmail">Gmail (ブラウザ版)</option>
          </select>
        </div>

        <button 
          className={styles.submitButton}
          onClick={handleShowConfig}
        >
          設定情報を表示する
        </button>
      </div>

      {showConfig && terminology && (
        <>
          <div className={styles.configSection}>
            <h3>{terminology.displayName}用の設定情報</h3>
            
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
              <h4>
                {terminology.imapLabel}（IMAP）
                <button 
                  className={styles.helpButton}
                  onClick={() => setShowProtocolModal(true)}
                  aria-label="IMAPとPOPの説明を表示"
                >
                  ?
                </button>
              </h4>
              <div className={styles.configGrid}>
                <div className={styles.configRow}>
                  <span className={styles.configLabel}>{terminology.serverLabel}：</span>
                  <span className={styles.configValue}>
                    {getActualServerName(config.imap.server)}
                  </span>
                </div>
                <div className={styles.configRow}>
                  <span className={styles.configLabel}>{terminology.portLabel}：</span>
                  <span className={styles.configValue}>{config.imap.port}</span>
                </div>
                <div className={styles.configRow}>
                  <span className={styles.configLabel}>{terminology.securityLabel}：</span>
                  <span className={styles.configValue}>{config.imap.security}</span>
                </div>
              </div>
            </div>

            <div className={styles.serverConfig}>
              <h4>{terminology.smtpLabel}（SMTP）</h4>
              <div className={styles.configGrid}>
                <div className={styles.configRow}>
                  <span className={styles.configLabel}>{terminology.serverLabel}：</span>
                  <span className={styles.configValue}>
                    {getActualServerName(config.smtp.server)}
                  </span>
                </div>
                <div className={styles.configRow}>
                  <span className={styles.configLabel}>{terminology.portLabel}：</span>
                  <span className={styles.configValue}>{config.smtp.port}</span>
                </div>
                <div className={styles.configRow}>
                  <span className={styles.configLabel}>{terminology.securityLabel}：</span>
                  <span className={styles.configValue}>{config.smtp.security}</span>
                </div>
              </div>
            </div>

            {config.notes && (
              <div className={styles.notice}>
                <p>※ {config.notes}</p>
              </div>
            )}

            <div className={styles.notice}>
              <p>※ パスワードは安全のため、このページには表示されません。</p>
              <p>別途お送りした情報をご確認ください。</p>
              <p>※ ユーザー名にはメールアドレス全体を入力してください。</p>
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
        <div className={styles.troubleshooting}>
          <h4>よくあるトラブル</h4>
          <ul>
            <li>パスワードエラー：大文字小文字、記号を正確に入力してください</li>
            <li>接続エラー：セキュリティソフトのメール保護機能を一時的に無効にしてみてください</li>
            <li>送信エラー：SMTPの認証設定を確認してください</li>
          </ul>
        </div>
      </div>

      <ProtocolModal />
    </div>
  );
}