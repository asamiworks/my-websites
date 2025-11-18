/**
 * PDF請求書・領収書のデザイン設定
 * ミニマル・洗練されたデザイン
 */

export const pdfConfig = {
  // ミニマルカラーパレット（黒 + アクセントカラー1色）
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
  },

  // フォント設定
  fonts: {
    japanese: 'IPAex Mincho',    // 日本語明朝体
    latin: 'Helvetica',          // 英数字用（Arialに類似）
    sizes: {
      xlarge: 32,                // 大きな数字（合計金額）
      large: 20,                 // タイトル
      heading: 12,               // 見出し
      body: 9,                   // 本文
      small: 8,                  // 小さいテキスト
      tiny: 7,                   // 最小テキスト
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },

  // ミニマルレイアウト設定
  layout: {
    pageMargin: 35,              // 余白
    sectionSpacing: 15,          // セクション間の余白
    lineHeight: 1.3,             // 読みやすい行間
    thinBorder: 0.5,             // 細い罫線
    mediumBorder: 1,             // 通常の罫線
  },
};

export type PdfConfig = typeof pdfConfig;
