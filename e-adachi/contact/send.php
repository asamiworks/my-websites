<?php
// 文字エンコーディングの設定
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// POSTデータの受け取り
$company = isset($_POST['company']) ? $_POST['company'] : '';
$name = isset($_POST['name']) ? $_POST['name'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : '';
$inquiry_type = isset($_POST['inquiry_type']) ? $_POST['inquiry_type'] : '';
$message = isset($_POST['message']) ? $_POST['message'] : '';

// 入力値の検証
$errors = [];
if (empty($company)) $errors[] = "会社名が入力されていません。";
if (empty($name)) $errors[] = "お名前が入力されていません。";
if (empty($email)) $errors[] = "メールアドレスが入力されていません。";
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "正しいメールアドレスを入力してください。";
if (empty($message)) $errors[] = "お問い合わせ内容が入力されていません。";

// エラーがある場合は処理を中止
if (!empty($errors)) {
    ?>
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>入力エラー | 株式会社足立電機</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <div class="container">
            <div class="card">
                <h1>入力エラー</h1>
                <div class="error-message">
                    <p>以下の項目をご確認ください：</p>
                    <ul>
                        <?php foreach ($errors as $error): ?>
                            <li><?php echo htmlspecialchars($error); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <div class="button-group">
                    <a href="form.html" class="button">入力画面に戻る</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// 管理者宛メールの設定
$admin_email = "info@jh-ad.jp"; // 管理者のメールアドレス
$from_email = "info@jh-ad.jp"; // 送信元メールアドレス
$admin_subject = "【株式会社足立電機】お問い合わせがありました";

// 管理者宛メール本文
$admin_body = "株式会社足立電機のWebサイトから、以下のお問い合わせがありました。\n\n";
$admin_body .= "----------------------------------------\n";
$admin_body .= "【会社名】\n" . $company . "\n\n";
$admin_body .= "【お名前】\n" . $name . "\n\n";
$admin_body .= "【メールアドレス】\n" . $email . "\n\n";
if (!empty($phone)) {
    $admin_body .= "【電話番号】\n" . $phone . "\n\n";
}
if (!empty($inquiry_type)) {
    $admin_body .= "【お問い合わせ種別】\n" . $inquiry_type . "\n\n";
}
$admin_body .= "【お問い合わせ内容】\n" . $message . "\n";
$admin_body .= "----------------------------------------\n";
$admin_body .= "\n送信日時: " . date('Y年m月d日 H:i:s');

// 自動返信メールの設定
$reply_subject = "【株式会社足立電機】お問い合わせありがとうございます";

// 自動返信メール本文
$reply_body = $name . " 様\n\n";
$reply_body .= "この度は、株式会社足立電機へお問い合わせいただき、誠にありがとうございます。\n";
$reply_body .= "以下の内容でお問い合わせを受け付けました。\n\n";
$reply_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$reply_body .= "【会社名】\n" . $company . "\n\n";
$reply_body .= "【お名前】\n" . $name . "\n\n";
$reply_body .= "【メールアドレス】\n" . $email . "\n\n";
if (!empty($phone)) {
    $reply_body .= "【電話番号】\n" . $phone . "\n\n";
}
if (!empty($inquiry_type)) {
    $reply_body .= "【お問い合わせ種別】\n" . $inquiry_type . "\n\n";
}
$reply_body .= "【お問い合わせ内容】\n" . $message . "\n";
$reply_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$reply_body .= "内容を確認の上、担当者より折り返しご連絡させていただきます。\n";
$reply_body .= "今しばらくお待ちくださいますようお願い申し上げます。\n\n";
$reply_body .= "※このメールは自動送信されています。\n";
$reply_body .= "────────────────────────────────\n";
$reply_body .= "株式会社足立電機\n";
$reply_body .= "〒301-0853 茨城県龍ケ崎市松ヶ丘4丁目4番1号\n";
$reply_body .= "URL: https://jh-ad.jp/\n";
$reply_body .= "────────────────────────────────\n";

// メールヘッダー（シンプルに）
$admin_headers = "From: {$from_email}\r\n";
$admin_headers .= "Reply-To: {$email}\r\n";

$reply_headers = "From: {$from_email}\r\n";
$reply_headers .= "Reply-To: {$admin_email}\r\n";

// Return-Path設定
$additional_params = "-f{$from_email}";

// mb_send_mailを使用（文字化け対策）
$admin_result = mb_send_mail($admin_email, $admin_subject, $admin_body, $admin_headers, $additional_params);
$reply_result = mb_send_mail($email, $reply_subject, $reply_body, $reply_headers, $additional_params);

// 送信結果の確認
if ($admin_result && $reply_result) {
    // 成功時はサンクスページへリダイレクト
    header("Location: thanks.html");
    exit;
} else {
    // エラー時の処理
    ?>
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>送信エラー | 株式会社足立電機</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <div class="container">
            <div class="card">
                <h1>送信エラー</h1>
                <div class="error-message">
                    <p>申し訳ございません。メールの送信に失敗しました。</p>
                    <p>恐れ入りますが、時間をおいて再度お試しください。</p>
                    <?php if (!$admin_result): ?>
                        <p><small>（管理者へのメール送信に失敗しました）</small></p>
                    <?php endif; ?>
                    <?php if (!$reply_result): ?>
                        <p><small>（自動返信メールの送信に失敗しました）</small></p>
                    <?php endif; ?>
                </div>
                <div class="button-group">
                    <a href="form.html" class="button">入力画面に戻る</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}
?>