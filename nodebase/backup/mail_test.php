<?php
// エラー表示
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 設定
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// テストメール送信
$to = "asamiii25252@gmail.com";  // あなたのメールアドレス
$subject = "テストメール from nodebase.jp";
$message = "これはテストメールです。\n自動返信機能のテストをしています。";
$headers = "From: noreply@nodebase.jp\r\n";
$headers .= "Reply-To: info@nodebase.jp\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// 送信
$result = mb_send_mail($to, $subject, $message, $headers);

// 結果表示
if ($result) {
    echo "メール送信成功！送信先: " . $to . "\n";
    echo "From: noreply@nodebase.jp\n";
} else {
    echo "メール送信失敗\n";
}

// mail()関数の設定を確認
echo "\n--- Mail Configuration ---\n";
echo "sendmail_path: " . ini_get('sendmail_path') . "\n";
echo "SMTP: " . ini_get('SMTP') . "\n";
?>
