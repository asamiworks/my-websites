# 🎨 i-manabee デザインシステム

最終更新: 2025-10-07  
Version: 2.0.0

---

## 📚 前提ドキュメント

このドキュメントは以下を詳細化したものです：
- [完全仕様書](../i-manabee完全仕様書.md) - 「UI/UXデザインシステム」セクション

**参照先**: すべてのフェーズドキュメント

---

## 🐝 ブランドアイデンティティ

### キャラクター: まなびー先生

**コンセプト**: 勉強が大好きで、子どもたちを優しく見守る蜂の先生

**性格**:
- 友達のような親しみやすさ
- 敬語を使わない（フランクな話し方）
- 温かく励ます
- 間違いを否定しない
- 子どもの好奇心を引き出す

**ビジュアル**:
- ハートを持った蜂 🐝❤️
- ロゴ: `i ❤️ 🐝`
- 黄色/オレンジ系の温かみのあるデザイン
- 丸みのあるフォルム

**トーン&マナー**:
❌ 悪い例: 「分かりましたか？頑張ってください。」
✅ 良い例: 「いいね！次はこれにチャレンジしてみよう！」
❌ 悪い例: 「それは間違っています。」
✅ 良い例: 「おしい！もう一回考えてみよう！」
❌ 悪い例: 「この問題を解いてください。」
✅ 良い例: 「一緒に考えてみよう！」

---

## 🌈 カラーパレット

### プライマリーカラー
```css
:root {
  /* Primary Colors */
  --honey-yellow: #FFB300;      /* メインカラー */
  --honey-yellow-light: #FFC947;
  --honey-yellow-dark: #FF8F00;
  
  --heart-pink: #FF6B6B;        /* アクセントカラー */
  --heart-pink-light: #FF8787;
  --heart-pink-dark: #FF5252;
  
  --safe-green: #4CAF50;        /* 安全・成功 */
  --safe-green-light: #81C784;
  --safe-green-dark: #388E3C;
}
プランカラー
css:root {
  /* Plan Colors */
  --free-gray: #9E9E9E;
  --kids-blue: #2196F3;
  --friends-purple: #9C27B0;
  --premium-gold: #FFB300;
}
システムカラー
css:root {
  /* System Colors */
  --error-red: #FF5252;
  --warning-yellow: #FFC107;
  --info-blue: #2196F3;
  --success-green: #4CAF50;
  
  /* Background */
  --bg-cream: #FFF8E1;          /* ページ背景 */
  --bg-white: #FFFFFF;
  --bg-gray-50: #FAFAFA;
  --bg-gray-100: #F5F5F5;
  
  /* Text */
  --text-main: #212121;         /* メインテキスト */
  --text-sub: #757575;          /* サブテキスト */
  --text-disabled: #BDBDBD;
  --text-inverse: #FFFFFF;
  
  /* Border */
  --border-light: #E0E0E0;
  --border-medium: #BDBDBD;
  --border-dark: #757575;
}
シャドウ
css:root {
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.16);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.19);
  --shadow-xl: 0 15px 30px rgba(0, 0, 0, 0.25);
  
  /* Shadow (colored) */
  --shadow-honey: 0 4px 12px rgba(255, 179, 0, 0.3);
  --shadow-pink: 0 4px 12px rgba(255, 107, 107, 0.3);
}
カラー使用例
tsx// ボタン
<button className="bg-honey-yellow hover:bg-honey-yellow-dark">
  送信
</button>

// アラート
<div className="bg-error-red text-white">
  エラーメッセージ
</div>

// プランカード
<div className="border-2 border-premium-gold">
  まなびープレミアム
</div>

🔤 タイポグラフィ
フォントファミリー
css:root {
  /* Font Family */
  --font-primary: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 
                  'Segoe UI', 'Roboto', sans-serif;
  --font-display: 'M PLUS Rounded 1c', 'Noto Sans JP', sans-serif;
  --font-code: 'Fira Code', 'Courier New', monospace;
}
使い分け:

--font-primary: 本文、通常のUI
--font-display: 見出し、まなびー先生の吹き出し
--font-code: プログラミング教科のコード表示

フォントサイズ
css:root {
  /* Font Size */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
}
年齢グループ別フォントサイズ
typescript// 年齢グループによって基本サイズを調整
const fontSizeByAge = {
  junior: {
    base: 'text-lg',      // 18px（大きめ）
    large: 'text-2xl',    // 24px
  },
  middle: {
    base: 'text-base',    // 16px（標準）
    large: 'text-xl',     // 20px
  },
  senior: {
    base: 'text-base',    // 16px
    large: 'text-lg',     // 18px
  }
};
行間・字間
css:root {
  /* Line Height */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  --leading-loose: 2;
  
  /* Letter Spacing */
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
}

📐 レイアウト
グリッドシステム
css/* Container */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {  /* sm */
  .container { max-width: 640px; }
}

@media (min-width: 768px) {  /* md */
  .container { max-width: 768px; }
}

@media (min-width: 1024px) { /* lg */
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) { /* xl */
  .container { max-width: 1200px; }
}
Spacing Scale
css:root {
  /* Spacing */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
レスポンシブブレークポイント
typescriptconst breakpoints = {
  sm: '640px',   // タブレット（縦）
  md: '768px',   // タブレット（横）
  lg: '1024px',  // デスクトップ
  xl: '1280px',  // 大画面デスクトップ
};

🧩 コンポーネント
Button（ボタン）
Variants
tsx// Primary - メインアクション
<button className="btn-primary">
  送信する
</button>

// Secondary - サブアクション
<button className="btn-secondary">
  キャンセル
</button>

// Outline - 枠線のみ
<button className="btn-outline">
  詳細を見る
</button>

// Ghost - 背景なし
<button className="btn-ghost">
  スキップ
</button>

// Danger - 危険なアクション
<button className="btn-danger">
  削除する
</button>
CSS実装
css/* Base Button */
.btn {
  @apply inline-flex items-center justify-center
         px-6 py-3 rounded-lg
         font-medium text-base
         transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Primary */
.btn-primary {
  @apply btn
         bg-honey-yellow text-white
         hover:bg-honey-yellow-dark
         focus:ring-honey-yellow
         shadow-honey;
}

/* Secondary */
.btn-secondary {
  @apply btn
         bg-gray-200 text-gray-800
         hover:bg-gray-300
         focus:ring-gray-400;
}

/* Outline */
.btn-outline {
  @apply btn
         border-2 border-honey-yellow text-honey-yellow
         hover:bg-honey-yellow hover:text-white
         focus:ring-honey-yellow;
}

/* Ghost */
.btn-ghost {
  @apply btn
         text-honey-yellow
         hover:bg-honey-yellow hover:bg-opacity-10
         focus:ring-honey-yellow;
}

/* Danger */
.btn-danger {
  @apply btn
         bg-error-red text-white
         hover:bg-red-700
         focus:ring-error-red;
}
Sizes
tsx// Small
<button className="btn-primary btn-sm">小さい</button>

// Default
<button className="btn-primary">標準</button>

// Large
<button className="btn-primary btn-lg">大きい</button>
css.btn-sm {
  @apply px-4 py-2 text-sm;
}

.btn-lg {
  @apply px-8 py-4 text-lg;
}

Card（カード）
tsx<div className="card">
  <div className="card-header">
    <h3 className="card-title">タイトル</h3>
  </div>
  <div className="card-body">
    <p>内容</p>
  </div>
  <div className="card-footer">
    <button className="btn-primary">アクション</button>
  </div>
</div>
css.card {
  @apply bg-white rounded-lg shadow-md
         overflow-hidden;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-200;
}

.card-title {
  @apply text-xl font-bold text-gray-800;
}

.card-body {
  @apply px-6 py-4;
}

.card-footer {
  @apply px-6 py-4 border-t border-gray-200
         bg-gray-50;
}

Input（入力フィールド）
tsx<div className="form-group">
  <label className="form-label" htmlFor="email">
    メールアドレス
  </label>
  <input
    id="email"
    type="email"
    className="form-input"
    placeholder="example@email.com"
  />
  <p className="form-hint">
    登録時のメールアドレスを入力してください
  </p>
</div>

{/* エラー状態 */}
<div className="form-group">
  <label className="form-label" htmlFor="password">
    パスワード
  </label>
  <input
    id="password"
    type="password"
    className="form-input form-input-error"
  />
  <p className="form-error">
    パスワードは8文字以上で入力してください
  </p>
</div>
css.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.form-input {
  @apply w-full px-4 py-2
         border border-gray-300 rounded-lg
         focus:outline-none focus:ring-2 focus:ring-honey-yellow focus:border-transparent
         transition-colors;
}

.form-input-error {
  @apply border-error-red focus:ring-error-red;
}

.form-hint {
  @apply mt-1 text-sm text-gray-500;
}

.form-error {
  @apply mt-1 text-sm text-error-red;
}

Modal（モーダル）
tsx<div className="modal-overlay">
  <div className="modal">
    <div className="modal-header">
      <h3 className="modal-title">確認</h3>
      <button className="modal-close">×</button>
    </div>
    <div className="modal-body">
      <p>本当に削除しますか？</p>
    </div>
    <div className="modal-footer">
      <button className="btn-secondary">キャンセル</button>
      <button className="btn-danger">削除</button>
    </div>
  </div>
</div>
css.modal-overlay {
  @apply fixed inset-0 z-50
         bg-black bg-opacity-50
         flex items-center justify-center
         p-4;
}

.modal {
  @apply bg-white rounded-lg shadow-xl
         max-w-lg w-full
         max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply flex items-center justify-between
         px-6 py-4 border-b border-gray-200;
}

.modal-title {
  @apply text-xl font-bold text-gray-800;
}

.modal-close {
  @apply text-gray-400 hover:text-gray-600
         text-2xl font-bold
         w-8 h-8 flex items-center justify-center;
}

.modal-body {
  @apply px-6 py-4;
}

.modal-footer {
  @apply px-6 py-4 border-t border-gray-200
         bg-gray-50
         flex justify-end gap-3;
}

Alert（アラート）
tsx{/* Success */}
<div className="alert alert-success">
  <span className="alert-icon">✓</span>
  <span className="alert-message">保存しました！</span>
</div>

{/* Error */}
<div className="alert alert-error">
  <span className="alert-icon">✕</span>
  <span className="alert-message">エラーが発生しました</span>
</div>

{/* Warning */}
<div className="alert alert-warning">
  <span className="alert-icon">⚠</span>
  <span className="alert-message">注意してください</span>
</div>

{/* Info */}
<div className="alert alert-info">
  <span className="alert-icon">ℹ</span>
  <span className="alert-message">お知らせがあります</span>
</div>
css.alert {
  @apply flex items-center gap-3
         px-4 py-3 rounded-lg
         text-sm font-medium;
}

.alert-success {
  @apply bg-green-50 text-green-800 border border-green-200;
}

.alert-error {
  @apply bg-red-50 text-red-800 border border-red-200;
}

.alert-warning {
  @apply bg-yellow-50 text-yellow-800 border border-yellow-200;
}

.alert-info {
  @apply bg-blue-50 text-blue-800 border border-blue-200;
}

.alert-icon {
  @apply text-lg;
}

💬 メッセージ候補UI（新規）
デザイン仕様
tsx<div className="suggestion-container">
  <p className="suggestion-label">
    💡 こんなことが聞けるよ！
  </p>
  
  <div className="suggestion-scroll">
    <button className="suggestion-card">
      🔢 たしざんのやりかたをおしえて！
    </button>
    <button className="suggestion-card suggestion-dynamic">
      📊 分数の足し算を練習したい
      <span className="suggestion-badge">おすすめ</span>
    </button>
    <button className="suggestion-card">
      ⏰ とけいのよみかたがわからないよ
    </button>
    <button className="suggestion-card">
      📐 さんかくとしかくのちがいは？
    </button>
  </div>
</div>
CSS実装
css/* Container */
.suggestion-container {
  @apply mb-4;
}

.suggestion-label {
  @apply text-sm font-medium text-gray-600 mb-2
         flex items-center gap-1;
}

/* Scroll Area */
.suggestion-scroll {
  @apply flex gap-3 overflow-x-auto pb-2
         scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent;
}

/* Card */
.suggestion-card {
  @apply flex-shrink-0
         min-w-[200px] max-w-[280px]
         px-4 py-3
         bg-white border-2 border-gray-200 rounded-lg
         text-left text-sm
         transition-all duration-200
         hover:border-honey-yellow hover:shadow-md
         active:scale-95;
}

/* Dynamic (Rule-based) */
.suggestion-dynamic {
  @apply border-honey-yellow bg-honey-yellow bg-opacity-5
         relative;
}

/* Badge */
.suggestion-badge {
  @apply absolute top-1 right-1
         px-2 py-0.5
         bg-honey-yellow text-white text-xs font-bold rounded-full;
}

/* First Message Emphasis */
.suggestion-card:first-child {
  @apply ml-0;
}

/* Mobile Optimization */
@media (max-width: 640px) {
  .suggestion-card {
    @apply min-w-[180px] max-w-[240px]
           px-3 py-2 text-xs;
  }
}
年齢別スタイル調整
typescriptconst suggestionStyleByAge = {
  junior: {
    card: 'suggestion-card text-base px-5 py-4', // 大きめ
    emoji: 'text-2xl',
  },
  middle: {
    card: 'suggestion-card text-sm px-4 py-3',   // 標準
    emoji: 'text-xl',
  },
  senior: {
    card: 'suggestion-card text-sm px-4 py-3',   // 標準
    emoji: 'text-lg',
  }
};
配置位置
┌─────────────────────────────────┐
│  Chat Header                    │
├─────────────────────────────────┤
│                                 │
│  Message List                   │
│  (スクロール可能)                │
│                                 │
├─────────────────────────────────┤
│  💡 Suggestion Label            │
│  [Card] [Card] [Card] [Card]→  │ ← 横スクロール
├─────────────────────────────────┤
│  Message Input      [送信]      │
└─────────────────────────────────┘

🎭 アニメーション
トランジション定義
css:root {
  /* Transition Duration */
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
  
  /* Easing */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
まなびー先生のアニメーション
css/* 蜂の飛行アニメーション */
@keyframes bee-flying {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(10px, -5px) rotate(5deg);
  }
  50% {
    transform: translate(-10px, 5px) rotate(-5deg);
  }
  75% {
    transform: translate(5px, -10px) rotate(3deg);
  }
}

.manabee-icon {
  animation: bee-flying 2s infinite ease-in-out;
}

/* タイピング中のアニメーション */
@keyframes typing {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.typing-indicator {
  animation: typing 1.5s infinite;
}
ページ遷移
css/* Fade In */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.page-transition {
  animation: fade-in 300ms ease-out;
}

/* Slide Up */
@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-up {
  animation: slide-up 300ms ease-out;
}

📱 レスポンシブ設計
Mobile First Approach
常にモバイルから設計し、大きな画面に拡張していく。
css/* Base (Mobile) */
.card {
  @apply p-4;
}

/* Tablet */
@media (min-width: 768px) {
  .card {
    @apply p-6;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .card {
    @apply p-8;
  }
}
タッチターゲット
css/* タップ可能な要素は最低44x44px */
.btn {
  @apply min-h-[44px] min-w-[44px];
}

♿ アクセシビリティ
カラーコントラスト
すべてのテキストはWCAG AA基準（4.5:1）を満たす：
css/* ✅ Good */
.text-on-white {
  @apply text-gray-800;  /* Contrast: 12.63:1 */
}

/* ❌ Bad */
.text-on-white-bad {
  @apply text-gray-400;  /* Contrast: 2.85:1 - NG */
}
フォーカス表示
css/* すべてのインタラクティブ要素にフォーカスリングを表示 */
.focusable {
  @apply focus:outline-none focus:ring-2 focus:ring-honey-yellow focus:ring-offset-2;
}
スクリーンリーダー対応
tsx{/* 視覚的に隠すが、スクリーンリーダーには読ませる */}
<span className="sr-only">
  ログイン画面に移動
</span>

<button aria-label="メニューを開く">
  ☰
</button>
css.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
  clip: rect(0, 0, 0, 0);
}

🎨 実装例
ログインフォーム
tsx<div className="container max-w-md mx-auto py-12">
  <div className="card">
    <div className="card-header text-center">
      <div className="manabee-icon text-6xl mb-4">🐝</div>
      <h1 className="card-title">まなびーにログイン</h1>
    </div>
    
    <div className="card-body">
      <form>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="example@email.com"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
          />
        </div>
        
        <button type="submit" className="btn-primary w-full">
          ログイン
        </button>
      </form>
    </div>
    
    <div className="card-footer text-center text-sm">
      <a href="/signup" className="text-honey-yellow hover:underline">
        アカウントを作成
      </a>
    </div>
  </div>
</div>

📦 コンポーネントライブラリ
推奨: shadcn/ui
既に使用中のshadcn/uiを継続使用。カスタマイズして「まなびー」スタイルに。
bash# インストール済み
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
カスタマイズ方法
tsx// components/ui/button.tsx を編集
const buttonVariants = cva(
  "base-styles...",
  {
    variants: {
      variant: {
        default: "bg-honey-yellow hover:bg-honey-yellow-dark", // カスタム
        // ...
      }
    }
  }
);

🔄 次のステップ

TYPE_REFERENCE.md で型定義を確認
MESSAGE_TEMPLATES.md でメッセージ候補の詳細を確認
phases/PHASE2-1_AUTH.md で実装開始


最終更新: 2025-10-07
管理者: AsamiWorks