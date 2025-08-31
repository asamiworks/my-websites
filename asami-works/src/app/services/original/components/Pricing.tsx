"use client";

import { useState } from "react";
import styles from "./Pricing.module.css";

export default function Pricing() {
  const [showAllOptions, setShowAllOptions] = useState(false);

  const options = [
    {
      name: "ページ追加",
      price: "＋11,000円〜／1ページ",
      detail: "構成に応じてページを柔軟に追加できます。",
    },
    {
      name: "お問い合わせフォーム設置",
      price: "＋33,000円",
      detail: "自動返信付きの問い合わせフォームを設置します。※LPプラン向け",
    },
    {
      name: "ライティング代行（ブログ記事）",
      price: "＋22,000円／記事",
      detail: "SEO対策を考慮したブログ記事作成（約2,000文字）。",
    },
    {
      name: "SEO技術対策",
      price: "＋88,000円",
      detail: "サイト構造最適化、表示速度改善、メタタグ設定、構造化データ実装。",
    },
    {
      name: "Google Analytics・サーチコンソール設定",
      price: "＋22,000円",
      detail: "アクセス解析ツールの初期設定と使い方レクチャー。※月額サポート加入の場合は無料",
    },
    {
      name: "セキュリティ強化対策",
      price: "＋33,000円",
      detail: "フォームのセキュリティ強化、不正アクセス対策。",
    },
    {
      name: "広告出稿サポート",
      price: "＋33,000円〜",
      detail: "Google・SNS広告の初期設定代行。※別途広告費が必要です。",
    },
    {
      name: "多言語対応（1言語あたり）",
      price: "111,000円＋22,000円/ページ",
      detail: "言語切替機能の実装と各ページの英語版作成。",
    },
    {
      name: "Instagram連携・埋め込み",
      price: "＋66,000円",
      detail: "Instagram投稿の自動表示機能。",
    },
    {
      name: "WordPress導入",
      price: "＋110,000円",
      detail: "手軽にブログ機能を追加。情報発信にも最適。※月額サポートプラン加入必須",
    },
    {
      name: "マイページ機能 & 管理者ページ",
      price: "＋330,000円〜",
      detail: "会員限定コンテンツや顧客管理機能を追加。※月額サポートプラン加入必須（月額費用＋5,500円〜）",
    },
    {
      name: "チャット機能（マイページ実装に限る）",
      price: "＋495,000円〜",
      detail: "管理者とユーザーのチャット機能。通知あり。※月額サポートプラン加入必須（月額費用＋3,300円〜）",
    },
    {
      name: "メールマガジン配信システム",
      price: "＋55,000円〜",
      detail: "顧客向けメール配信機能。※月額サポートプラン加入必須（月額費用＋8,800円〜）",
    },
    {
      name: "予約システム導入",
      price: "＋220,000円〜",
      detail: "オンライン予約機能の実装。※月額サポートプラン加入必須（月額費用＋5,500円〜）",
    },
    {
      name: "動画制作",
      price: "別途お見積もり",
      detail: "会社紹介動画やサービス紹介動画の制作。",
    },
    {
      name: "ロゴ・チラシ制作との連携",
      price: "別途お見積もり",
      detail: "印刷物制作パートナーと連携可能。",
    },
  ];

  return (
    <section id="pricing" className={styles.pricing}>
      <h2 className={styles.sectionTitle}>オプション</h2>
      <div
        className={`${styles.optionsWrapper} ${
          showAllOptions ? styles.optionsWrapperOpen : ""
        }`}
      >
        <table className={styles.cmsTable}>
          <thead>
            <tr>
              <th>内容</th>
              <th>追加費用（税込）</th>
              <th>詳細</th>
            </tr>
          </thead>
          <tbody>
            {options.map((opt, index) => (
              <tr key={index}>
                <td>{opt.name}</td>
                <td className={styles.priceCell}>{opt.price}</td>
                <td>{opt.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!showAllOptions && <div className={styles.gradientOverlay} />}
      </div>

      <button className={styles.showMoreBtn} onClick={() => setShowAllOptions(!showAllOptions)}>
        {showAllOptions ? "閉じる" : "続きを見る"}
      </button>

      {/* オプション活用事例 */}
      <div className={styles.exampleSection}>
        <h3 className={styles.subheading}>オプション活用事例</h3>
        <p className={styles.exampleSubtitle}>各プランに最適なオプション選択例</p>
        
        <div className={styles.exampleGrid}>
          <div className={styles.exampleCard}>
            <div className={styles.exampleHeader}>
              <h3 className={styles.exampleTitle}>LP向けプラン活用例</h3>
              <p className={styles.exampleTarget}>広告運用で成果を最大化したい企業様向け</p>
            </div>
            <div className={styles.exampleContent}>
              <p className={styles.exampleDescription}>
                広告からの流入を確実に成果につなげる、
                効果測定可能なLPを構築。
              </p>
              <div className={styles.exampleBreakdown}>
                <p className={styles.breakdownTitle}>プラン内訳：</p>
                <ul className={styles.breakdownList}>
                  <li>ランディングページ制作: 220,000円</li>
                  <li>お問い合わせフォーム設置: 33,000円</li>
                  <li>Google Analytics設定: 22,000円</li>
                  <li>広告出稿サポート: 33,000円</li>
                </ul>
                <p className={styles.exampleTotal}>
                  <span>合計</span>
                  <span className={styles.totalPrice}>308,000円</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className={styles.exampleCard}>
            <div className={styles.exampleHeader}>
              <h3 className={styles.exampleTitle}>コーポレートサイトプラン活用例</h3>
              <p className={styles.exampleTarget}>企業の信頼性を高めたい成長企業様向け</p>
            </div>
            <div className={styles.exampleContent}>
              <p className={styles.exampleDescription}>
                SEO対策と動画を活用し、
                企業の魅力を最大限に伝えるサイトを構築。
              </p>
              <div className={styles.exampleBreakdown}>
                <p className={styles.breakdownTitle}>プラン内訳：</p>
                <ul className={styles.breakdownList}>
                  <li>コーポレートサイト制作: 385,000円</li>
                  <li>ページ追加（採用ページ2P）: 22,000円</li>
                  <li>SEO技術対策: 88,000円</li>
                  <li>セキュリティ強化対策: 33,000円</li>
                  <li>動画制作: 別途お見積もり</li>
                </ul>
                <p className={styles.exampleTotal}>
                  <span>合計</span>
                  <span className={styles.totalPrice}>528,000円〜</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className={styles.exampleCard}>
            <div className={styles.exampleHeader}>
              <h3 className={styles.exampleTitle}>補助金活用プラン活用例</h3>
              <p className={styles.exampleTarget}>補助金を最大限活用したい中小企業様向け</p>
            </div>
            <div className={styles.exampleContent}>
              <p className={styles.exampleDescription}>
                補助金の範囲内で高機能なサイトを実現。
                会員機能やメール配信で顧客との関係を強化。
              </p>
              <div className={styles.exampleBreakdown}>
                <p className={styles.breakdownTitle}>プラン内訳：</p>
                <ul className={styles.breakdownList}>
                  <li>小規模事業者持続化補助金対応サイト: 770,000円</li>
                  <li>WordPress導入: 110,000円</li>
                  <li>マイページ機能: 330,000円</li>
                  <li>メールマガジン配信: 55,000円</li>
                  <li>SEO技術対策: 88,000円</li>
                </ul>
                <p className={styles.monthlyNote}>※月額サポートプラン加入必須（プレミアム）</p>
                
                  
                  <p className={styles.subsidyNote}>補助金適用後：実質853,000円〜</p>
                 
                <p className={styles.exampleTotal}>
                <span>合計</span><span className={styles.totalPrice}>1,353,000円</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 追加料金 */}
      <div className={styles.additionalFee}>
        <h3 className={styles.subheading}>追加料金</h3>
        <table className={styles.cmsTable}>
          <tbody>
            <tr>
              <td>公開後の軽微修正対応</td>
              <td className={styles.priceCell}>＋11,000円／1回</td>
              <td>月額サポート未加入時、または規定回数超過時に対応。</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 月額保守プラン（初年度） */}
      <h3 className={styles.subheading}>月額サポートプラン（初年度）</h3>
      <p className={styles.note}>
        ※小規模事業者持続化補助金対応型サイトでは初年度プレミアムプラン加入が必須です。
        <br />
        ※月額費用が発生するオプションをご利用の場合は、月額サポートプラン加入が必須となります。
        <br />
        ※サポートプランに加入できるのはAsamiWorksで制作されたサイトのみです。
        <br />
        ※月額サポートプランにはドメイン・サーバー管理費が含まれます（ドメインはお客様名義で取得）。
        <br />
        ※月額料金は制作費の2〜3%程度を目安に設定しています。
      </p>
      <table className={styles.cmsTable}>
        <thead>
          <tr>
            <th>プラン名</th>
            <th>月額料金（税込）</th>
            <th>内容</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>スタンダード</td>
            <td>制作費の2% or 8,800円<br /><span className={styles.note}>※高い方（上限27,500円）</span></td>
            <td>月2回までの軽微修正、ドメイン・サーバー管理</td>
          </tr>
          <tr>
            <td>ビジネス</td>
            <td>制作費の2.5% or 16,500円<br /><span className={styles.note}>※高い方（上限38,500円）</span></td>
            <td>月4回まで修正、SEO簡易診断、更新サポート、ドメイン・サーバー管理</td>
          </tr>
          <tr>
            <td>プレミアム</td>
            <td>制作費の3% or 27,500円<br /><span className={styles.note}>※高い方（上限48,400円）</span></td>
            <td>修正無制限、解析レポート、改善提案、ドメイン・サーバー管理含む</td>
          </tr>
        </tbody>
      </table>

      {/* 2年目以降 */}
      <h3 className={styles.subheading}>2年目以降のサポートプラン</h3>
      <table className={styles.cmsTable}>
        <thead>
          <tr>
            <th>プラン名</th>
            <th>月額料金（税込）</th>
            <th>内容</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>スタンダード</td>
            <td>制作費の1% or 6,600円<br /><span className={styles.note}>※高い方（上限16,500円）</span></td>
            <td>月1回の修正、稼働チェック、ドメイン・サーバー管理</td>
          </tr>
          <tr>
            <td>ビジネス</td>
            <td>制作費の1.5% or 8,800円<br /><span className={styles.note}>※高い方（上限22,000円）</span></td>
            <td>月2回までの修正、SEOチェック、ドメイン・サーバー管理</td>
          </tr>
          <tr>
            <td>プレミアム</td>
            <td>制作費の2% or 13,200円<br /><span className={styles.note}>※高い方（上限33,000円）</span></td>
            <td>月4回までの修正、SEOチェック・改善サポート、ドメイン・サーバー管理</td>
          </tr>
        </tbody>
      </table>

      {/* 大規模サイトに関する注意書き */}
      <div style={{
        margin: "24px 0",
        padding: "16px 20px",
        background: "#fff9e6",
        borderRadius: "8px",
        border: "1px solid #ffd966"
      }}>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
          <strong>⚠️ 大規模サイトをご検討の場合</strong><br />
          月間100万PV以上、データベース容量50GB以上、または特殊なサーバー要件がある場合は、
          別途サーバー費用が必要となる場合があります。詳細はお問い合わせください。
        </p>
      </div>

      {/* 解約ポリシー */}
      <h3 className={styles.subheading}>保守契約の解約・お支払いについて</h3>
      <ul className={styles.optionsList}>
        <li>保守契約はいつでも解約可能ですが、初年度のみ1年契約となります。</li>
        <li>
          初年度は1年契約。<br />
          支払いは月払い or 一括（1ヶ月分割引）を選択可。
        </li>
        <li>
          2年目以降は1ヶ月更新制。<br />
          解約時は未使用分を日割りで返金。
        </li>
        <li>
          解約後もサイトは公開可能ですが、修正・更新対応は有償対応です。
        </li>
      </ul>
    </section>
  );
}