import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーションバー */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                ローカル請求書システム
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                ダッシュボード
              </Link>
              <Link
                href="/clients"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                クライアント管理
              </Link>
              <Link
                href="/invoices"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                請求書管理
              </Link>
              <Link
                href="/settings"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100"
              >
                設定
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            システム設定
          </h2>
          <p className="text-gray-600">
            会社情報やシステムの設定を管理します
          </p>
        </div>

        {/* 設定メニュー */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/settings/company"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              会社情報
            </h3>
            <p className="text-gray-600 text-sm">
              会社名、住所、銀行口座情報などの設定
            </p>
          </Link>

          <Link
            href="/settings/system"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              システム設定
            </h3>
            <p className="text-gray-600 text-sm">
              自動実行、ログレベル、バックアップなどの設定
            </p>
          </Link>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              データ管理
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              バックアップ・復旧・データエクスポート
            </p>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                バックアップ作成
              </button>
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium">
                データエクスポート
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              システム情報
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">バージョン</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">データベース</span>
                <span className="font-medium">JSONファイル</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">環境</span>
                <span className="font-medium">ローカル</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
