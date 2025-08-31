<?php
// test_noreply.php
$to = "asamiii25252@gmail.com";
$subject = "noreplyテスト " . date('H:i:s');
$message = "noreply@nodebase.jpからの送信テスト";
$headers = "From: NodeBase <noreply@nodebase.jp>\r\n";
$headers .= "Reply-To: info@nodebase.jp\r\n";

$result = mb_send_mail($to, $subject, $message, $headers, '-f noreply@nodebase.jp');
echo $result ? "送信成功" : "送信失敗";
?>
