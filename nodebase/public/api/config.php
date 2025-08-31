<?php
/**
 * 問い合わせフォーム設定ファイル - さくらサーバー用
 * NodeBase Contact Form Configuration for Sakura Server
 */

// CORS設定（開発環境と本番環境の切り替え）
$allowed_origins = [
    'http://localhost:5173',  // 開発環境
    'http://localhost:3000',  // 開発環境（予備）
    'https://nodebase.jp',   // 本番環境（SSL）
    'https://www.nodebase.jp', // 本番環境（www付き）
    'http://nodebase.jp',    // 本番環境（非SSL - リダイレクト前）
    'http://www.nodebase.jp' // 本番環境（www付き、非SSL）
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // 本番環境のデフォルト
    header("Access-Control-Allow-Origin: https://nodebase.jp");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// ========== メール設定（さくらサーバー用） ==========
// 重要: さくらサーバーでは、実在するメールアドレスを使用する必要があります

// 管理者受信用（実際に受信するメールアドレス）
define('MAIL_TO', 'info@nodebase.jp');

// 送信元アドレス（さくらサーバーで作成したメールアドレスを使用）
// ※ noreply@nodebase.jp を事前にさくらのコントロールパネルで作成してください
define('MAIL_FROM', 'noreply@nodebase.jp');

// 送信者名
define('MAIL_FROM_NAME', 'NodeBase');

// メール件名
define('MAIL_ADMIN_SUBJECT', '【NodeBase】お問い合わせを受信しました');
define('MAIL_USER_SUBJECT', '【NodeBase】お問い合わせありがとうございます（自動返信）');

// ========== さくらサーバー判定 ==========
function is_sakura_server() {
    // さくらサーバーの特徴的な環境変数やパスで判定
    return (
        strpos($_SERVER['SERVER_SOFTWARE'] ?? '', 'Apache') !== false &&
        (strpos($_SERVER['DOCUMENT_ROOT'] ?? '', '/home/') !== false ||
         strpos($_SERVER['SCRIPT_FILENAME'] ?? '', '/home/') !== false)
    );
}

// ========== エラーレポート設定 ==========
// 本番環境判定（さくらサーバーまたは本番ドメイン）
$is_production = (
    is_sakura_server() ||
    $_SERVER['SERVER_NAME'] === 'nodebase.jp' || 
    $_SERVER['SERVER_NAME'] === 'www.nodebase.jp'
);

if ($is_production) {
    // 本番環境：エラー表示OFF
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    // さくらサーバーのエラーログパス（通常は自動設定される）
    // ini_set('error_log', '/home/[アカウント名]/log/php_error.log');
} else {
    // 開発環境：エラー表示ON
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

// ========== タイムゾーン設定 ==========
date_default_timezone_set('Asia/Tokyo');

// ========== 文字エンコーディング設定 ==========
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// さくらサーバー用の追加設定
if (is_sakura_server()) {
    // さくらサーバーでのメール送信に最適な設定
    ini_set('mbstring.encoding_translation', 'Off');
    ini_set('mbstring.detect_order', 'UTF-8,SJIS,EUC-JP,JIS,ASCII');
}

// ========== セキュリティ設定 ==========
define('MAX_NAME_LENGTH', 100);
define('MAX_EMAIL_LENGTH', 255);
define('MAX_PHONE_LENGTH', 20);
define('MAX_COMPANY_LENGTH', 100);
define('MAX_SUBJECT_LENGTH', 200);
define('MAX_MESSAGE_LENGTH', 3000);

// レート制限設定（同一IPからの送信制限）
// さくらサーバーの制限を考慮
define('RATE_LIMIT_MINUTES', 5);  // 5分間
define('RATE_LIMIT_COUNT', 3);    // 最大3回まで

// ========== ログファイルパス ==========
// さくらサーバー用のログディレクトリ設定
if (is_sakura_server()) {
    // さくらサーバーの場合：ホームディレクトリ配下に保存
    $log_dir = dirname(dirname(dirname(__FILE__))) . '/logs';
    if (!file_exists($log_dir)) {
        @mkdir($log_dir, 0755, true);
    }
    define('LOG_FILE', $log_dir . '/contact_log.txt');
} else {
    // 開発環境
    define('LOG_FILE', dirname(__FILE__) . '/contact_log.txt');
}

// ========== セッション設定（さくらサーバー用） ==========
// さくらサーバーでセッションディレクトリを明示的に設定
if (is_sakura_server()) {
    $session_dir = dirname(dirname(dirname(__FILE__))) . '/sessions';
    if (!file_exists($session_dir)) {
        @mkdir($session_dir, 0755, true);
    }
    ini_set('session.save_path', $session_dir);
}

// セッションのセキュリティ設定
ini_set('session.cookie_httponly', 1);
if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    ini_set('session.cookie_secure', 1);
}

/**
 * IPアドレス取得関数
 */
function get_client_ip() {
    // さくらサーバーでも正しくIPを取得
    $ip_keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    foreach ($ip_keys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            $ip_list = explode(',', $_SERVER[$key]);
            foreach ($ip_list as $ip) {
                $ip = trim($ip);
                // プライベートIPアドレスを除外
                if (filter_var($ip, FILTER_VALIDATE_IP, 
                    FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                    return $ip;
                }
            }
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/**
 * ログ記録関数
 */
function write_log($message, $type = 'INFO') {
    if (defined('LOG_FILE')) {
        $timestamp = date('Y-m-d H:i:s');
        $ip = get_client_ip();
        $log_message = "[$timestamp] [$type] [IP: $ip] $message" . PHP_EOL;
        
        // ログファイルのサイズチェック（10MB以上でローテーション）
        if (file_exists(LOG_FILE) && filesize(LOG_FILE) > 10485760) {
            $backup_file = LOG_FILE . '.' . date('Ymd_His');
            @rename(LOG_FILE, $backup_file);
        }
        
        @file_put_contents(LOG_FILE, $log_message, FILE_APPEND | LOCK_EX);
    }
}

/**
 * さくらサーバー環境チェック（デバッグ用）
 */
function check_sakura_environment() {
    $info = [
        'is_sakura' => is_sakura_server(),
        'php_version' => phpversion(),
        'sendmail_path' => ini_get('sendmail_path'),
        'smtp' => ini_get('SMTP'),
        'smtp_port' => ini_get('smtp_port'),
        'mail_function' => function_exists('mb_send_mail'),
        'mb_language' => mb_language(),
        'internal_encoding' => mb_internal_encoding()
    ];
    return $info;
}

// デバッグモード（必要に応じて有効化）
// $debug = check_sakura_environment();
// write_log('Environment: ' . json_encode($debug), 'DEBUG');
?>