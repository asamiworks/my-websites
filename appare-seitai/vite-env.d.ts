/// <reference types="vite/client" />

// Viteが既に画像ファイルやCSSモジュールの型定義を提供しているため、
// 重複する定義は削除します

// 環境変数の型定義
interface ImportMetaEnv {
    // ここに環境変数の型を追加
    // 例: readonly VITE_API_URL: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }