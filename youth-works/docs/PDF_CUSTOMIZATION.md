# 請求書PDF カスタマイズガイド

このドキュメントでは、請求書PDFのデザインをカスタマイズする方法について説明します。

## 目次

1. [設定ファイル](#設定ファイル)
2. [デザインのカスタマイズ](#デザインのカスタマイズ)
3. [テンプレートの構造](#テンプレートの構造)
4. [カラーテーマの変更](#カラーテーマの変更)
5. [フォントサイズの調整](#フォントサイズの調整)

---

## 現在のデザイン

**ミニマル・洗練デザイン（日本語完全対応）**

- **デザインコンセプト**: タイポグラフィで魅せる、余白を活かしたクリーンなレイアウト
- **配色**: 黒 (#000000) + ネイビーアクセント (#2c3e50)
- **フォント**: Noto Sans JP（Google Fonts、日本語完全対応）
  - フォントファイル: `public/fonts/NotoSansJP-Variable.ttf` (9.2MB)
  - 可変フォント（Variable Font）により、複数のウェイトを1ファイルで対応
- **言語**: 日本語（日本人クライアント向け）
- **ファイル名形式**: `{発行日}_{クライアント名}.pdf`
  - 例: `2025-11-01_株式会社足立電気.pdf`
  - 発行日は `YYYY-MM-DD` 形式
  - 日付順にソートしやすい構造
- **特徴**:
  - 色は1-2色のみ（ミニマル）
  - 大胆なタイポグラフィ（合計金額: 32pt）
  - 細い罫線 (0.5pt) で洗練された印象
  - 適切な余白とスペーシング（1ページに最適化）
  - 日本語ラベル（請求書、請求先、請求元、振込先情報など）
  - 文字化けなし（Noto Sans JP埋め込み）

---

## 設定ファイル

請求書PDFのデザイン設定は `src/lib/pdf/pdfConfig.ts` で管理されています。

### ファイル構造

```typescript
export const pdfConfig = {
  colors: { ... },      // カラーパレット
  fonts: { ... },       // フォント設定
  layout: { ... },      // レイアウト設定
};
```

---

## デザインのカスタマイズ

### 1. カラーパレットの変更

`pdfConfig.colors` で色を変更できます：

```typescript
colors: {
  // メインカラー
  black: '#000000',            // 純黒
  darkGray: '#1a1a1a',         // ダークグレー（メインテキスト）

  // アクセントカラー
  accent: '#2c3e50',           // ネイビー（ポイント使用）

  // グレースケール
  gray: '#666666',             // ミディアムグレー（補助テキスト）
  lightGray: '#cccccc',        // ライトグレー（罫線）
  veryLightGray: '#f5f5f5',    // 背景用（最小限）

  // 固定色
  white: '#ffffff',
}
```

#### カラーテーマの例

**現在: ミニマル（黒 + ネイビー）**
- Primary: ブラック (#000000)
- Accent: ネイビー (#2c3e50)
- 適用箇所: 合計金額のみアクセントカラー

**モダングリーン**
- Accent: #059669 (エメラルドグリーン)
- 落ち着いた印象を与えます

**エレガントパープル**
- Accent: #7c3aed (バイオレット)
- 高級感を演出します

### 2. フォントサイズの調整

`pdfConfig.fonts.sizes` でフォントサイズを調整できます：

```typescript
fonts: {
  main: 'Helvetica',           // サンセリフ
  bold: 'Helvetica-Bold',
  sizes: {
    xlarge: 32,                // 大きな数字（合計金額）
    large: 20,                 // タイトル
    heading: 12,               // 見出し
    body: 9,                   // 本文
    small: 8,                  // 小さいテキスト
    tiny: 7,                   // 最小テキスト
  },
}
```

**注意**: フォントサイズを大きくしすぎると、1ページに収まらなくなる可能性があります。

### 3. レイアウト設定

`pdfConfig.layout` でレイアウトを調整できます：

```typescript
layout: {
  pageMargin: 40,              // ページの余白（左右上下）
  sectionSpacing: 18,          // セクション間の余白
  lineHeight: 1.4,             // 行の高さ
  thinBorder: 0.5,             // 細い罫線
  mediumBorder: 1,             // 通常の罫線
}
```

---

## テンプレートの構造

請求書PDFは以下のセクションで構成されています：

### 1. ヘッダー (Header)
- タイトル「請求書」（日本語）
- サブタイトル「INVOICE」（英語）
- 細い下線

### 2. メタ情報 (Meta Section)
- 請求書番号
- 発行日
- 支払期限

### 3. 請求先・請求元情報 (Address Section)
- 請求先: クライアント名 + 敬称（法人=御中、個人=様）、郵便番号（〒付き）、住所
- 請求元: 会社名、郵便番号（〒付き）、住所、TEL、Email

### 4. 請求明細テーブル (Table)
- 項目（サイト名 + 月額/年間管理費）
- 数量
- 単価
- 金額
- サービス期間の表示（YYYY年MM月DD日 〜 YYYY年MM月DD日）

### 5. 合計セクション (Total Section)
- 小計
- 消費税（免税事業者） ← 設定により表示/非表示可能（デフォルト: 非表示）
- **合計金額** ← 32ptの大きなフォント、ネイビーカラー

### 6. 振込先情報
- 銀行名
- 支店名
- 口座種別
- 口座番号
- 口座名義

### 7. 備考 (Notes)
- 振込手数料の案内（固定表示）
- 追加の備考（invoice.notesフィールドがある場合）

### 8. フッター (Footer)
- お支払い期限の表示
- 発行元情報（会社名、メールアドレス） ← 中央揃え

---

## カラーテーマの変更

### 例: エレガントなグリーンテーマに変更

`src/lib/pdf/pdfConfig.ts` を編集：

```typescript
export const pdfConfig = {
  colors: {
    black: '#000000',
    darkGray: '#1a1a1a',
    accent: '#059669',           // エメラルドグリーンに変更
    gray: '#666666',
    lightGray: '#cccccc',
    veryLightGray: '#f5f5f5',
    white: '#ffffff',
  },
  // ... 他の設定は同じ
};
```

変更を保存すると、次回のPDF生成から新しい色が適用されます。

---

## フォントサイズの調整

### 大きめのフォントに変更（印刷用）

```typescript
fonts: {
  main: 'Helvetica',
  bold: 'Helvetica-Bold',
  sizes: {
    xlarge: 36,        // +4
    large: 24,         // +4
    heading: 14,       // +2
    body: 10,          // +1
    small: 9,          // +1
    tiny: 8,           // +1
  },
},
```

**注意**: フォントサイズを大きくすると、2ページになる可能性があります。その場合は `layout.sectionSpacing` や `layout.pageMargin` を調整してください。

### 小さめのフォント（情報量重視）

```typescript
fonts: {
  sizes: {
    xlarge: 28,        // -4
    large: 18,         // -2
    heading: 11,       // -1
    body: 8,           // -1
    small: 7,          // -1
    tiny: 6,           // -1
  },
},
```

---

## テスト方法

デザイン変更後、テストPDFを生成して確認します：

```bash
npm run test-pdf
```

生成されたPDFは以下の場所に保存されます（ファイル名形式: `{発行日}_{クライアント名}.pdf`）：
```
output/test/2025-11-01_まつ建トータルサポート.pdf
```

PDFのページ数を確認：
```bash
file output/test/2025-11-01_まつ建トータルサポート.pdf
# 出力: PDF document, version 1.3, 1 page(s)
```

その他のテストコマンド：
```bash
# 個人クライアント（福田 あすか 様）のテスト
npm run test-pdf-individual

# 2ヶ月分まとめて請求のテスト（株式会社足立電気）
npm run test-pdf-adachi
```

---

## 消費税表示設定

免税事業者の場合、消費税行を非表示にすることができます。

### 設定方法

`data/company.json` の `invoiceSettings.showTaxRow` を編集：

```json
{
  "invoiceSettings": {
    "closingDayType": "end_of_month",
    "issueDayType": "first_of_next_month",
    "dueDateType": "end_of_issue_month",
    "adjustDueDateForHolidays": true,
    "showTaxRow": false
  }
}
```

### 設定値

- **`false`**: 消費税行を非表示（免税事業者の場合） ← **デフォルト**
- **`true`**: 消費税行を表示（課税事業者になった場合）

### 表示例

**showTaxRow: false の場合:**
```
小計         ¥6,000
合計金額      ¥6,000  ← 消費税行なし
```

**showTaxRow: true の場合:**
```
小計                ¥6,000
消費税（免税事業者）  ¥0
合計金額            ¥6,000
```

---

## トラブルシューティング

### Q1: PDFが2ページになってしまう

**A**: フォントサイズを小さくするか、スペーシングを減らしてください。

```typescript
layout: {
  pageMargin: 35,        // 余白を減らす
  sectionSpacing: 15,    // スペーシングを減らす
}
```

または、各セクションの個別のマージンを調整してください（InvoiceTemplate.tsx）。

### Q2: 色が表示されない

**A**: カラーコードが正しいか確認してください。6桁の16進数カラーコード（例: #1e3a8a）を使用してください。

### Q3: 日本語が文字化けする

**A**: 現在は Noto Sans JP フォントを使用しており、日本語を完全にサポートしています。フォントファイルは `public/fonts/NotoSansJP-Variable.ttf` に配置されています（Google Fontsからダウンロード、9.2MB）。もし文字化けが発生する場合は、以下を確認してください：
- フォントファイルが存在するか
- @react-pdf/renderer のバージョンが v4.0.0以降であるか
- InvoiceTemplate.tsx でフォント登録が正しく行われているか

---

## ミニマルデザインの設計思想

現在のPDFデザインは、以下の原則に基づいています：

1. **色の制限**: 黒 + アクセントカラー1色のみ
2. **タイポグラフィ重視**: フォントサイズとウェイトで階層を表現
3. **余白の活用**: 適切なスペーシングで読みやすさを確保
4. **細い罫線**: 0.5ptの罫線で洗練された印象
5. **大胆なコントラスト**: 合計金額を32ptの大きなフォントで強調
6. **文字間隔**: 大文字ラベルに letter-spacing を適用

---

## まとめ

- **カラー変更**: `pdfConfig.colors` を編集
- **フォント調整**: `pdfConfig.fonts.sizes` を編集
- **レイアウト調整**: `pdfConfig.layout` を編集
- **細かい調整**: `InvoiceTemplate.tsx` の個別スタイルを編集
- **テスト**: `npm run test-pdf` で確認

変更は `src/lib/pdf/pdfConfig.ts` の1ファイルで管理されているため、簡単にカスタマイズできます。
