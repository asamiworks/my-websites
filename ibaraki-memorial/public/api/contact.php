<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// エラーハンドラーを設定（エラーをJSONで返す）
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'サーバーエラーが発生しました'
    ]);
    exit;
});

// 例外ハンドラーも設定
set_exception_handler(function($exception) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'サーバーエラーが発生しました'
    ]);
    exit;
});

// POSTメソッドでない場合はエラー
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// JSONデータを取得
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// JSONデコードエラーチェック
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'success' => false,
        'message' => 'JSONデータの解析に失敗しました'
    ]);
    exit;
}

// データのバリデーション
if (!$data || !isset($data['name']) || !isset($data['email']) || !isset($data['options']) || !isset($data['phonePreference'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => '必須項目が入力されていません'
    ]);
    exit;
}

// 見学希望日のバリデーション
if (in_array('見学をしたい', $data['options'])) {
    // visitDatesとvisitTimesの両方が必要
    if (!isset($data['visitDates']) || !isset($data['visitTimes']) || 
        !is_array($data['visitDates']) || !is_array($data['visitTimes'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => '見学希望日時を選択してください'
        ]);
        exit;
    }
    
    // 有効な日付と時間のペアが少なくとも1つあるかチェック
    $hasValidPair = false;
    for ($i = 0; $i < count($data['visitDates']); $i++) {
        if (!empty($data['visitDates'][$i]) && !empty($data['visitTimes'][$i])) {
            $hasValidPair = true;
            break;
        }
    }
    if (!$hasValidPair) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => '見学希望日時を少なくとも1つ選択してください（日付と時間の両方が必要です）'
        ]);
        exit;
    }
}

// 電話番号のバリデーション（電話連絡を希望する場合のみ）
if ($data['phonePreference'] === 'yes' && (!isset($data['phoneNumber']) || empty($data['phoneNumber']))) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '電話番号を入力してください'
    ]);
    exit;
}

// 電話可能時間帯のバリデーション（電話連絡を希望する場合のみ）
if ($data['phonePreference'] === 'yes' && (!isset($data['phoneTimeSlots']) || !is_array($data['phoneTimeSlots']) || empty($data['phoneTimeSlots']))) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '電話可能時間帯を選択してください'
    ]);
    exit;
}

// データのサニタイズ
$name = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$options = array_map(function($option) {
    return htmlspecialchars($option, ENT_QUOTES, 'UTF-8');
}, $data['options']);
$message = isset($data['message']) ? htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8') : '';
$phonePreference = htmlspecialchars($data['phonePreference'], ENT_QUOTES, 'UTF-8');

// 電話番号のサニタイズ
$phoneNumber = isset($data['phoneNumber']) ? htmlspecialchars($data['phoneNumber'], ENT_QUOTES, 'UTF-8') : '';

// visitDatesとvisitTimesのサニタイズ
$visitDates = isset($data['visitDates']) && is_array($data['visitDates']) ? array_map(function($date) {
    return htmlspecialchars($date, ENT_QUOTES, 'UTF-8');
}, $data['visitDates']) : [];

$visitTimes = isset($data['visitTimes']) && is_array($data['visitTimes']) ? array_map(function($time) {
    return htmlspecialchars($time, ENT_QUOTES, 'UTF-8');
}, $data['visitTimes']) : [];

$phoneTimeSlots = isset($data['phoneTimeSlots']) && is_array($data['phoneTimeSlots']) ? array_map(function($slot) {
    return htmlspecialchars($slot, ENT_QUOTES, 'UTF-8');
}, $data['phoneTimeSlots']) : [];

// メールアドレスのバリデーション
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '正しいメールアドレスを入力してください'
    ]);
    exit;
}

// 管理者メールアドレス
$admin_email = 'info@ibaraki-memorial.com';
$from_email = 'info@ibaraki-memorial.com';
$site_name = '茨城メモリアルパーク';

// 日本語設定
mb_language('Japanese');
mb_internal_encoding('UTF-8');

// 日本時間に設定
date_default_timezone_set('Asia/Tokyo');

$datetime = date('Y年m月d日 H:i');

// 曜日の日本語変換用配列
$weekdays = [
    'Sun' => '日',
    'Mon' => '月',
    'Tue' => '火',
    'Wed' => '水',
    'Thu' => '木',
    'Fri' => '金',
    'Sat' => '土'
];

// 管理者向けメール
$admin_subject = "【{$site_name}】お問い合わせがありました";
$admin_body = <<<EOD
{$site_name}にお問い合わせがありました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

受信日時: {$datetime}

【お名前】
{$name}

【メールアドレス】
{$email}

【ご希望内容】
EOD;

foreach ($options as $option) {
    $admin_body .= "\n・{$option}";
}

// 見学希望日時を追加
if (in_array('見学をしたい', $options) && !empty($visitDates)) {
    $admin_body .= "\n\n【見学希望日時】";
    $dateIndex = 1;
    for ($i = 0; $i < count($visitDates); $i++) {
        if (!empty($visitDates[$i]) && !empty($visitTimes[$i])) {
            try {
                // 日付と時間を結合
                $datetime_str = $visitDates[$i] . ' ' . $visitTimes[$i];
                $dateObj = new DateTime($datetime_str);
                $weekday = $weekdays[$dateObj->format('D')];
                $formatted = $dateObj->format('Y年m月d日（' . $weekday . '） H:i');
                $admin_body .= "\n第{$dateIndex}希望: {$formatted}";
                $dateIndex++;
            } catch (Exception $e) {
                // 日付パースエラー
                $admin_body .= "\n第{$dateIndex}希望: {$visitDates[$i]} {$visitTimes[$i]}";
                $dateIndex++;
            }
        }
    }
}

// 電話連絡希望を追加
$admin_body .= "\n\n【電話でのご連絡】\n";
$admin_body .= $phonePreference === 'yes' ? "希望する" : "希望しない（メールのみ）";

// 電話番号を追加（電話連絡を希望する場合）
if ($phonePreference === 'yes' && !empty($phoneNumber)) {
    $admin_body .= "\n\n【電話番号】\n{$phoneNumber}";
}

// 電話可能時間帯を追加
if ($phonePreference === 'yes' && !empty($phoneTimeSlots)) {
    $admin_body .= "\n\n【電話可能時間帯】";
    foreach ($phoneTimeSlots as $slot) {
        $admin_body .= "\n・{$slot}";
    }
}

$admin_body .= "\n\n【お問い合わせ内容】\n";
$admin_body .= $message ? $message : "（なし）";

$admin_body .= <<<EOD


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
このメールは{$site_name}のお問い合わせフォームから送信されました。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOD;

// ユーザー向け自動返信メール
$user_subject = "【{$site_name}】お問い合わせありがとうございます";
$user_body = <<<EOD
{$name} 様

この度は{$site_name}へお問い合わせいただき、
誠にありがとうございます。

以下の内容でお問い合わせを受け付けました。
2〜3営業日以内に担当者よりご連絡させていただきます。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【お名前】
{$name}

【メールアドレス】
{$email}

【ご希望内容】
EOD;

foreach ($options as $option) {
    $user_body .= "\n・{$option}";
}

// 見学希望日時を追加
if (in_array('見学をしたい', $options) && !empty($visitDates)) {
    $user_body .= "\n\n【見学希望日時】";
    $dateIndex = 1;
    for ($i = 0; $i < count($visitDates); $i++) {
        if (!empty($visitDates[$i]) && !empty($visitTimes[$i])) {
            try {
                // 日付と時間を結合
                $datetime_str = $visitDates[$i] . ' ' . $visitTimes[$i];
                $dateObj = new DateTime($datetime_str);
                $weekday = $weekdays[$dateObj->format('D')];
                $formatted = $dateObj->format('Y年m月d日（' . $weekday . '） H:i');
                $user_body .= "\n第{$dateIndex}希望: {$formatted}";
                $dateIndex++;
            } catch (Exception $e) {
                $user_body .= "\n第{$dateIndex}希望: {$visitDates[$i]} {$visitTimes[$i]}";
                $dateIndex++;
            }
        }
    }
}

// 電話連絡希望を追加
$user_body .= "\n\n【電話でのご連絡】\n";
$user_body .= $phonePreference === 'yes' ? "希望する" : "希望しない（メールのみ）";

// 電話番号を追加（電話連絡を希望する場合）
if ($phonePreference === 'yes' && !empty($phoneNumber)) {
    $user_body .= "\n\n【電話番号】\n{$phoneNumber}";
}

// 電話可能時間帯を追加
if ($phonePreference === 'yes' && !empty($phoneTimeSlots)) {
    $user_body .= "\n\n【電話可能時間帯】";
    foreach ($phoneTimeSlots as $slot) {
        $user_body .= "\n・{$slot}";
    }
}

$user_body .= "\n\n【お問い合わせ内容】\n";
$user_body .= $message ? $message : "（なし）";

$user_body .= <<<EOD


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせについて
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

お急ぎの場合は、お電話でもお問い合わせいただけます。

TEL: （有）カツミ石材 090-3068-5360
受付時間: 9:00〜17:00（年中無休）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ アクセス
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

茨城メモリアルパーク
〒300-4116 茨城県土浦市藤沢1535

常磐線 土浦駅から車で約15分
駐車場完備（無料）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

※このメールは送信専用メールアドレスから配信されています。
　このメールに返信されても、お返事することができません。
　お問い合わせは上記の電話番号までお願いいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{$site_name}
https://ibaraki-memorial.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOD;

// メールヘッダー（シンプルに）
$admin_headers = "From: {$from_email}\r\n";
$admin_headers .= "Reply-To: {$email}\r\n";

$user_headers = "From: {$from_email}\r\n";
$user_headers .= "Reply-To: {$admin_email}\r\n";

// Return-Path設定
$additional_params = "-f{$from_email}";

// mb_send_mailを使用（文字化け対策）
$admin_sent = false;
$user_sent = false;

if (function_exists('mb_send_mail')) {
    $admin_sent = @mb_send_mail($admin_email, $admin_subject, $admin_body, $admin_headers, $additional_params);
    $user_sent = @mb_send_mail($email, $user_subject, $user_body, $user_headers, $additional_params);
} else {
    // mb_send_mailが使えない場合はmail関数を使用
    $admin_subject_encoded = '=?UTF-8?B?' . base64_encode($admin_subject) . '?=';
    $user_subject_encoded = '=?UTF-8?B?' . base64_encode($user_subject) . '?=';
    
    $admin_headers_utf8 = $admin_headers . "Content-Type: text/plain; charset=UTF-8\r\n";
    $user_headers_utf8 = $user_headers . "Content-Type: text/plain; charset=UTF-8\r\n";
    
    $admin_sent = @mail($admin_email, $admin_subject_encoded, $admin_body, $admin_headers_utf8, $additional_params);
    $user_sent = @mail($email, $user_subject_encoded, $user_body, $user_headers_utf8, $additional_params);
}

// 結果を返す
if ($admin_sent && $user_sent) {
    echo json_encode([
        'success' => true,
        'message' => 'お問い合わせを受け付けました'
    ]);
} else if ($admin_sent && !$user_sent) {
    echo json_encode([
        'success' => true,
        'message' => 'お問い合わせを受け付けました（自動返信メールの送信に失敗しました）'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'メール送信に失敗しました'
    ]);
}
?>