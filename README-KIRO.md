# Kiro IDE マルチプロジェクト管理

このディレクトリは、複数のウェブサイトプロジェクトでKiro IDEを効率的に活用するための統合管理環境です。

## 🏗️ ディレクトリ構成

```
/home/asamiworks/my-websites/
├── .kiro-templates/          # 共通仕様書テンプレート
│   ├── requirements.md      # 要件仕様書テンプレート
│   ├── design.md           # 技術設計仕様書テンプレート
│   └── tasks.md            # タスク実装計画テンプレート
├── init-kiro-project.sh     # プロジェクト初期化スクリプト
├── kiro-linux-install/      # Kiroインストールスクリプト
├── asami-works/             # 既存プロジェクト
├── appare-seitai/           # 既存プロジェクト
└── [その他のプロジェクト]/
```

## 🚀 新しいプロジェクトでのKiro導入

### 1. プロジェクトディレクトリに移動
```bash
cd /home/asamiworks/my-websites/
```

### 2. 既存プロジェクトにKiroを導入
```bash
./init-kiro-project.sh asami-works
```

### 3. Kiroを起動
```bash
~/.local/bin/kiro-enhanced
```

### 4. プロジェクトを開いて仕様書を編集
- `.kiro/requirements.md` でプロジェクト要件を定義
- `.kiro/design.md` で技術設計を調整
- `.kiro/tasks.md` で実装計画を立案

## 📋 共通テンプレートの活用

### 要件仕様書 (requirements.md)
- レスポンシブデザイン対応
- SEO最適化
- アクセシビリティ対応
- パフォーマンス要件

### 技術設計 (design.md)
- Next.js + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Vercel デプロイ

### タスク計画 (tasks.md)
- 6つの開発フェーズ
- 段階的な実装計画
- テスト・デプロイ戦略

## ⚙️ 設定の管理

### グローバル設定
```bash
~/.kiro/settings/mcp.json    # 全プロジェクト共通設定
```

### プロジェクト固有設定
```bash
[プロジェクト]/.kiro/settings/mcp.json    # プロジェクト専用設定
```

## 🔧 Kiroコマンド

### 通常起動
```bash
~/.local/bin/kiro-enhanced
```

### サンドボックス無効（問題がある場合）
```bash
~/.local/bin/kiro --no-sandbox
```

## 💡 効率的な使用方法

1. **テンプレートをカスタマイズ**: プロジェクトの特性に合わせて `.kiro-templates/` 内のファイルを編集
2. **共通設定を活用**: よく使うMCPサーバーはグローバル設定に追加
3. **段階的開発**: タスクテンプレートの6フェーズに従って開発を進行
4. **継続的改善**: プロジェクト完了後はテンプレートにノウハウを反映

## 🆘 トラブルシューティング

### chrome-sandbox権限エラー
```bash
sudo chown root:root ~/.tarball-installations/kiro/chrome-sandbox
sudo chmod 4755 ~/.tarball-installations/kiro/chrome-sandbox
```

### Kiroが起動しない
```bash
~/.local/bin/kiro --no-sandbox
```

### 設定ファイルが見つからない
```bash
mkdir -p ~/.kiro/settings
mkdir -p [プロジェクト]/.kiro/settings
```

## 📚 参考資料

- [Kiro公式ドキュメント](https://kiro.dev/docs/)
- [Spec-driven Development ガイド](https://kiro.dev/docs/specs/)
- [MCP サーバー設定](https://kiro.dev/docs/mcp/)