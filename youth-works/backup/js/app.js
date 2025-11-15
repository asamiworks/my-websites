// ログイン成功後の処理を修正
document.getElementById('login-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const ageGroup = document.getElementById('age-group').value;
    
    try {
        // テスト用：メールアドレスでプラン判定
        // premium@test.com → プレミアムプラン
        // その他 → 無料プラン
        let userPlan = 'free';
        if (email.includes('premium')) {
            userPlan = 'premium';
        }
        
        // ユーザー情報を保存
        localStorage.setItem('userId', 'test-user');
        localStorage.setItem('userPlan', userPlan);
        localStorage.setItem('ageGroup', ageGroup);
        
        // プランによって遷移先を変更
        if (userPlan === 'premium') {
            window.location.href = 'chat-select.html';
        } else {
            window.location.href = 'chat.html';
        }
    } catch (error) {
        alert('ログインに失敗しました: ' + error.message);
    }
});