# Google Drive API セットアップガイド

請求書PDFの自動アップロード機能を使用するには、Google Drive APIの設定が必要です。

## 1. Google Cloud Consoleでサービスアカウントを作成

### 1.1 Google Cloud Projectの作成
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）

### 1.2 Google Drive APIの有効化
1. 左メニューから「APIとサービス」→「ライブラリ」を選択
2. "Google Drive API"を検索
3. 「有効にする」をクリック

### 1.3 サービスアカウントの作成
1. 左メニューから「APIとサービス」→「認証情報」を選択
2. 「認証情報を作成」→「サービスアカウント」を選択
3. サービスアカウント名を入力（例：`invoice-pdf-uploader`）
4. 「作成して続行」をクリック
5. ロールは設定不要（スキップ）
6. 「完了」をクリック

### 1.4 サービスアカウントキーの作成
1. 作成したサービスアカウントをクリック
2. 「キー」タブを選択
3. 「鍵を追加」→「新しい鍵を作成」を選択
4. キーのタイプは「JSON」を選択
5. 「作成」をクリック
6. JSONファイルがダウンロードされます（**このファイルは安全に保管してください**）

## 2. Google Driveフォルダの設定

### 2.1 保存先フォルダの作成
1. [Google Drive](https://drive.google.com/)にアクセス
2. 請求書PDF保存用のフォルダを作成（例：「請求書PDF」）
3. フォルダのURLをコピー
   - フォルダを開いた時のURLの形式：`https://drive.google.com/drive/folders/FOLDER_ID`
   - `FOLDER_ID`の部分をコピー（例：`1asd9c8BJyv8HP_5PBnKBumHL_UFbMscC`）

### 2.2 サービスアカウントに共有権限を付与
1. 作成したフォルダを右クリック→「共有」を選択
2. サービスアカウントのメールアドレスを入力
   - 形式：`service-account-name@project-id.iam.gserviceaccount.com`
   - サービスアカウントの「詳細」ページで確認できます
3. 権限を「編集者」に設定
4. 「送信」をクリック

## 3. 環境変数の設定

### 3.1 .env.localファイルの作成
プロジェクトのルートディレクトリに`.env.local`ファイルを作成（既に存在する場合は編集）

### 3.2 環境変数の追加

```bash
# Google Drive API設定
GOOGLE_DRIVE_FOLDER_ID=1asd9c8BJyv8HP_5PBnKBumHL_UFbMscC
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project.iam.gserviceaccount.com","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com"}
```

**重要な注意事項：**

1. **GOOGLE_DRIVE_FOLDER_ID**
   - Google Driveフォルダの共有URLから取得したIDを設定
   - 例：`1asd9c8BJyv8HP_5PBnKBumHL_UFbMscC`

2. **GOOGLE_SERVICE_ACCOUNT_CREDENTIALS**
   - ダウンロードしたJSONファイルの内容を**1行**にして設定
   - 改行を削除して、JSON全体を文字列として設定
   - JSONファイルの内容をそのままコピー&ペーストしてください
   - **注意：** `private_key`の中の`\n`はそのまま保持してください

### 3.3 JSONファイルから環境変数への変換方法

ダウンロードしたJSONファイル（例：`service-account-key.json`）を開き、内容をそのままコピーして環境変数に設定します。

**方法1：手動でコピー**
```bash
# JSONファイルの内容を確認
cat service-account-key.json

# 出力されたJSON全体をコピーして、.env.localに貼り付け
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account",...}
```

**方法2：コマンドで設定（Linux/Mac）**
```bash
# JSONファイルの内容を改行削除して1行にする
echo "GOOGLE_SERVICE_ACCOUNT_CREDENTIALS=$(cat service-account-key.json | tr -d '\n')" >> .env.local
```

### 3.4 .gitignoreの確認
`.env.local`ファイルが`.gitignore`に含まれていることを確認してください：

```gitignore
# 環境変数
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 4. 動作確認

### 4.1 開発サーバーの再起動
環境変数を追加したら、開発サーバーを再起動します：

```bash
npm run dev
```

### 4.2 PDF生成のテスト
1. 管理画面にログイン：`http://localhost:3000/admin/login`
2. 請求書管理ページにアクセス
3. 任意の請求書の「📄 PDF生成」ボタンをクリック
4. 成功すると、Google DriveのURLがクリップボードにコピーされます
5. Google Driveのフォルダを確認し、PDFが保存されているか確認

## 5. フォルダ構造

PDFは以下の構造で自動保存されます：

```
請求書PDF/
├── 2025年11月/
│   ├── 202511_株式会社テスト.pdf
│   └── 202511_山田太郎.pdf
├── 2025年12月/
│   ├── 202512_株式会社テスト.pdf
│   └── 202512_山田太郎.pdf
└── 2026年01月/
    └── 202601_株式会社テスト.pdf
```

- 年月フォルダは自動作成されます
- ファイル名形式：`YYYYMM_クライアント名.pdf`
- 同名ファイルが存在する場合は上書きされます

## 6. トラブルシューティング

### エラー：`GOOGLE_SERVICE_ACCOUNT_CREDENTIALS environment variable is not set`
- `.env.local`ファイルに環境変数が正しく設定されているか確認
- 開発サーバーを再起動

### エラー：`Error: invalid_grant`
- サービスアカウントのJSONキーが正しくコピーされているか確認
- JSONの形式が壊れていないか確認（特に`private_key`の改行）

### PDFは生成されるがGoogle Driveにアップロードされない
- サービスアカウントにフォルダの共有権限が付与されているか確認
- `GOOGLE_DRIVE_FOLDER_ID`が正しいか確認
- Google Drive APIが有効化されているか確認

### 権限エラー：`insufficient permissions`
- Google Driveフォルダの共有設定で、サービスアカウントのメールアドレスに「編集者」権限が付与されているか確認

## 7. セキュリティに関する注意事項

1. **サービスアカウントキーの管理**
   - JSONキーファイルは絶対にGitにコミットしない
   - `.env.local`は`.gitignore`に含める
   - キーが漏洩した場合は、直ちにGoogle Cloud Consoleで削除して再作成

2. **本番環境での設定**
   - 本番環境では、環境変数を安全な方法で設定（Vercel、Firebase、AWS等のシークレット管理機能を使用）
   - 絶対にコードに直接ハードコードしない

3. **最小権限の原則**
   - サービスアカウントには必要最小限の権限のみを付与
   - Google Drive APIのみを使用し、他のAPIは有効化しない
