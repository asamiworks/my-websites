# i-manabee 開発ログ

## 2025-09-24 (火曜日) - プロジェクト始動

### 🚀 実施内容
- ✅ **プロジェクト名決定**: YouthWorks → i-manabee（あいまなびー）
- ✅ **ブランディング確定**: 
  - キャラクター: まなびー先生（🐝）
  - カラー: ハニーイエロー (#FFB300) + ハートピンク (#FF6B6B)
- ✅ **プロジェクト構造作成**:
  - 79ファイル生成完了
  - ディレクトリ構成確定
  
PS C:\Users\洋輔\Documents\GitHub\my-websites\i-manabee> tree /F
フォルダー パスの一覧
ボリューム シリアル番号は 249A-9BE3 です
C:.

├─docs
│      DEVLOG.md(このログファイル)
│      PROJECT.md(他のファイルはこのファイルにデータがあります)

- ✅ **APIキー移行**: youth-worksから.env.local移行
- ✅ **仕様書更新**: v5.0.0として完全版作成

### 📋 主要な仕様変更（YouthWorksからの変更点）
1. **対象年齢拡大**: 6-12歳 → 6-18歳
2. **料金プラン刷新**:
   - お試し（未登録）: 2回のみ、広告あり
   - 無料（登録済み）: 3回/4時間
   - まなびープレミアム: 500円/月、3人まで
   - まなびーファミリー: 800円/月、5人まで
3. **複数子どもプロファイル機能追加**
4. **教科別AI最適配置戦略導入**

### 🛠 技術的決定事項
- **AI配置**:
  - 無料: GPT-3.5-turbo
  - 算数/理科: Gemini 1.5 Flash
  - 国語/社会/悩み相談: Claude 3 Haiku
  - 英語: GPT-4o mini
- **認証**: PINコード（4桁）による子ども切り替え
- **データ保持**: 無料21日間、有料無期限

### 📂 作成ファイル一覧
public/ (7 HTML, 5 CSS, 7 JS)
server/ (1 main, 4 routes, 2 middleware, 3 utils)
docs/ (PROJECT.md, DEVLOG.md)
config/ (package.json, .env.local, firebase.json等)

### 🎯 次回のタスク（優先度順）
1. [ ] **package.json完成とnpm install**
2. [ ] **基本サーバー実装** (server/index.js)
3. [ ] **ランディングページ** (index.html + manabee-theme.css)
4. [ ] **Firebase初期設定**
5. [ ] **簡易動作テスト環境構築**

### 💡 メモ・検討事項
- youth-worksはバックアップとして保持
- ドメイン i-manabee.com は未取得
- 広告表示（お試しユーザーのみ）の実装タイミング検討
- 音声入力（Web Speech API）のブラウザ対応確認必要
- まなびー先生のキャラクターデザイン作成必要

### 🐛 既知の課題
- なし（新規プロジェクトのため）

### 📊 進捗状況
- **全体進捗**: 5%
- **設計**: 100% ✅
- **実装**: 0% ⬜
- **テスト**: 0% ⬜
- **デプロイ準備**: 0% ⬜

---

## 開発環境メモ

### 起動方法
```bash
cd C:\Users\洋輔\Documents\GitHub\my-websites\i-manabee
npm install  # 初回のみ
npm run dev  # 開発サーバー起動
アクセスURL

ローカル: http://localhost:3000
本番: https://i-manabee.com (未デプロイ)

テストアカウント（予定）

お試し: アカウント不要
無料: free@test.com
プレミアム: premium@test.com
ファミリー: family@test.com

APIキー状況

✅ OpenAI: 設定済み（.env.local）
✅ Claude: 設定済み（.env.local）
⬜ Gemini: 未取得
⬜ Firebase: プロジェクト未作成
⬜ Stripe: 未設定

