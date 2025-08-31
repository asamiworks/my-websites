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

// エラーがある場合は入力画面に戻る
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
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>入力内容確認 | 株式会社足立電機</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .confirm-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
        }
        
        .confirm-table th,
        .confirm-table td {
            padding: 16px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .confirm-table th {
            width: 30%;
            font-weight: 600;
            color: #4a5568;
            background-color: #f7fafc;
        }
        
        .confirm-table td {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .button-group {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .button-secondary {
            background: #e2e8f0;
            color: #4a5568;
        }
        
        .button-secondary:hover {
            background: #cbd5e0;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
            .confirm-table th {
                width: 100%;
                display: block;
                border-bottom: none;
                padding-bottom: 4px;
            }
            
            .confirm-table td {
                display: block;
                padding-top: 4px;
                padding-bottom: 20px;
            }
            
            .button-group {
                flex-direction: column;
            }
            
            .button-group .button {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>入力内容確認</h1>
        <p class="subtitle">以下の内容で送信してよろしいですか？</p>
        
        <div class="card">
            <table class="confirm-table">
                <tr>
                    <th>会社名</th>
                    <td><?php echo htmlspecialchars($company); ?></td>
                </tr>
                <tr>
                    <th>お名前</th>
                    <td><?php echo htmlspecialchars($name); ?></td>
                </tr>
                <tr>
                    <th>メールアドレス</th>
                    <td><?php echo htmlspecialchars($email); ?></td>
                </tr>
                <?php if (!empty($phone)): ?>
                <tr>
                    <th>電話番号</th>
                    <td><?php echo htmlspecialchars($phone); ?></td>
                </tr>
                <?php endif; ?>
                <?php if (!empty($inquiry_type)): ?>
                <tr>
                    <th>お問い合わせ種別</th>
                    <td><?php echo htmlspecialchars($inquiry_type); ?></td>
                </tr>
                <?php endif; ?>
                <tr>
                    <th>お問い合わせ内容</th>
                    <td><?php echo nl2br(htmlspecialchars($message)); ?></td>
                </tr>
            </table>
            
            <form action="send.php" method="POST" style="display: inline;">
                <!-- 隠しフィールドで値を送信 -->
                <input type="hidden" name="company" value="<?php echo htmlspecialchars($company); ?>">
                <input type="hidden" name="name" value="<?php echo htmlspecialchars($name); ?>">
                <input type="hidden" name="email" value="<?php echo htmlspecialchars($email); ?>">
                <input type="hidden" name="phone" value="<?php echo htmlspecialchars($phone); ?>">
                <input type="hidden" name="inquiry_type" value="<?php echo htmlspecialchars($inquiry_type); ?>">
                <input type="hidden" name="message" value="<?php echo htmlspecialchars($message); ?>">
                
                <div class="button-group">
                    <button type="button" onclick="history.back()" class="button button-secondary">修正する</button>
                    <button type="submit" class="button">送信する</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>