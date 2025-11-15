# 日本語フォント設定ガイド

## 必要なフォントファイル

以下のNoto Sans JPフォントファイルをこのディレクトリに配置してください：

### 1. Noto Sans JP Regular
- ファイル名: `NotoSansJP-Regular.ttf`
- URL: https://fonts.google.com/noto/specimen/Noto+Sans+JP
- 用途: 通常のテキスト表示

### 2. Noto Sans JP Bold
- ファイル名: `NotoSansJP-Bold.ttf`
- URL: https://fonts.google.com/noto/specimen/Noto+Sans+JP
- 用途: 太字テキスト（請求金額、ヘッダーなど）

## ダウンロード手順

1. Google Fontsにアクセス
2. Noto Sans JPを検索
3. 「Download family」をクリック
4. ZIPファイルを展開
5. 以下のファイルをこのディレクトリにコピー：
   - `NotoSansJP-Regular.ttf`
   - `NotoSansJP-Bold.ttf`

## フォールバック

フォントファイルが見つからない場合、以下のフォールバック順序で表示されます：
1. Noto Sans JP (指定フォント)
2. Hiragino Sans (macOS)
3. Yu Gothic (Windows)
4. Meiryo (Windows)
5. sans-serif (システムデフォルト)

## ライセンス

Noto Sans JPはSIL Open Font Licenseの下で提供されており、商用利用が可能です。