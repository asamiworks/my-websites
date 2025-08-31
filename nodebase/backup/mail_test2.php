<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

mb_language("Japanese");
mb_internal_encoding("UTF-8");

// 複数の宛先でテスト
$tests = [
    "asamiii25252@gmail.com",
    "info@nodebase.jp"  // 自分のドメイン宛
];

foreach ($tests as $to) {
    $subject = "テスト " . date('Y-m-d H:i:s');
    $message = "送信時刻: " . date('Y-m-d H:i:s') . "\n送信元: noreply@nodebase.jp";
    $headers = "From: info@nodebase.jp\r\n";  // info から送信してみる
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    $result = mb_send_mail($to, $subject, $message, $headers);
    echo $to . ": " . ($result ? "送信成功" : "送信失敗") . "\n";
}
?>
