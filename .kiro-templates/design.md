# 技術設計仕様書

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **コンポーネント**: Headless UI / Radix UI
- **フォーム**: React Hook Form + Zod
- **状態管理**: Zustand / React Query

### バックエンド
- **API**: Next.js API Routes / tRPC
- **データベース**: Prisma + PostgreSQL
- **認証**: NextAuth.js
- **ファイルストレージ**: AWS S3 / Cloudinary

### インフラ・デプロイ
- **ホスティング**: Vercel / AWS
- **データベース**: PlanetScale / Supabase
- **CDN**: Cloudflare
- **監視**: Sentry

### 開発環境
- **パッケージマネージャー**: pnpm
- **リンター**: ESLint + Prettier
- **テスト**: Jest + Testing Library
- **CI/CD**: GitHub Actions

## プロジェクト構造

```
src/
├── app/              # App Router pages
├── components/       # Reusable components
│   ├── ui/          # Basic UI components
│   └── features/    # Feature-specific components
├── lib/             # Utility functions
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── styles/          # Global styles
└── utils/           # Helper functions
```

## データベース設計
<!-- プロジェクト固有のデータベーススキーマ -->

## API設計
<!-- エンドポイント一覧とレスポンス形式 -->

## セキュリティ設計
- JWT認証
- CSRF保護
- SQL injection対策
- XSS対策
- CORS設定

## パフォーマンス設計
- 画像最適化（next/image）
- 動的インポート
- Code splitting
- キャッシュ戦略