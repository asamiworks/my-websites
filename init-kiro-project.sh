#!/bin/bash

# Kiroプロジェクト初期化スクリプト
# 使用方法: ./init-kiro-project.sh [プロジェクト名]

set -e

# プロジェクト名の確認
if [ $# -eq 0 ]; then
    echo "使用方法: $0 <プロジェクト名>"
    echo "例: $0 new-website"
    exit 1
fi

PROJECT_NAME="$1"
PROJECT_DIR="./$PROJECT_NAME"

# プロジェクトディレクトリの存在確認
if [ ! -d "$PROJECT_DIR" ]; then
    echo "エラー: プロジェクトディレクトリ '$PROJECT_DIR' が見つかりません"
    exit 1
fi

echo "🚀 Kiroプロジェクトを初期化します: $PROJECT_NAME"

# .kiroディレクトリの作成
mkdir -p "$PROJECT_DIR/.kiro"

# テンプレートファイルのコピー
echo "📝 仕様書テンプレートをコピー中..."
cp .kiro-templates/requirements.md "$PROJECT_DIR/.kiro/"
cp .kiro-templates/design.md "$PROJECT_DIR/.kiro/"
cp .kiro-templates/tasks.md "$PROJECT_DIR/.kiro/"

# プロジェクト固有の設定ファイル作成
echo "⚙️ プロジェクト設定を作成中..."
cat > "$PROJECT_DIR/.kiro/settings/mcp.json" << EOF
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": ["path/to/mcp-server-filesystem"],
      "env": {}
    }
  }
}
EOF

# steering ディレクトリの作成
mkdir -p "$PROJECT_DIR/.kiro/steering"

# 基本的なsteering ファイルの作成
cat > "$PROJECT_DIR/.kiro/steering/coding-standards.md" << EOF
# コーディング標準

## TypeScript/JavaScript
- ESLint + Prettier使用
- 関数はアロー関数を優先
- exportは名前付きexportを優先
- インターフェース名は"I"プレフィックスなし

## React
- 関数コンポーネントを使用
- カスタムフックでロジック分離
- propsの型定義を明確に記述

## CSS/Styling
- Tailwind CSSを使用
- ユーティリティファーストアプローチ
- レスポンシブデザイン必須

## ファイル命名
- コンポーネント: PascalCase (Button.tsx)
- その他: kebab-case (user-profile.ts)
- ディレクトリ: kebab-case
EOF

echo "✅ Kiroプロジェクトの初期化が完了しました！"
echo ""
echo "次のステップ:"
echo "1. cd $PROJECT_NAME"
echo "2. ~/.local/bin/kiro-enhanced を実行してKiroを起動"
echo "3. プロジェクトを開く"
echo "4. .kiro/requirements.md を編集してプロジェクト要件を定義"
echo "5. Kiroの「Generate Spec」機能を使用して開発を開始"