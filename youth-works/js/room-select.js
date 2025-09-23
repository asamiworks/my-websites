// ルーム選択画面の制御
let roomUsageData = {};

// ページ読み込み時
window.addEventListener('DOMContentLoaded', async () => {
    // Firebase初期化を待つ
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // プレミアムユーザーチェック（テスト時はコメントアウト）
    /*
    const userPlan = localStorage.getItem('userPlan') || 'free';
    if (userPlan !== 'premium') {
        alert('この機能はプレミアムプラン限定です');
        window.location.href = 'chat.html';
        return;
    }
    */
    
    // 使用回数を読み込み
    loadUsageStats();
});

// ルームに入る
function enterRoom(roomType) {
    // ルーム情報を保存
    localStorage.setItem('currentRoom', roomType);
    
    // ルームごとの特別な設定
    const roomSettings = {
        math: {
            name: '算数・数学',
            systemPrompt: '小学生の算数・数学の質問に答える先生として振る舞ってください。'
        },
        english: {
            name: '英語',
            systemPrompt: '小学生の英語学習を楽しくサポートする先生として振る舞ってください。'
        },
        japanese: {
            name: '国語',
            systemPrompt: '小学生の国語学習をサポートする先生として振る舞ってください。'
        },
        science: {
            name: '理科',
            systemPrompt: '小学生の理科の疑問に分かりやすく答える先生として振る舞ってください。'
        },
        social: {
            name: '社会',
            systemPrompt: '小学生の社会科学習をサポートする先生として振る舞ってください。'
        },
        counseling: {
            name: '悩み相談',
            systemPrompt: '小学生の悩みに優しく寄り添うカウンセラーとして振る舞ってください。',
            alert: true
        },
        homework: {
            name: '宿題ヘルプ',
            systemPrompt: '小学生の宿題を一緒に考える優しい先生として振る舞ってください。'
        },
        free: {
            name: 'フリートーク',
            systemPrompt: '小学生と楽しく会話する友達のような先生として振る舞ってください。'
        }
    };
    
    const setting = roomSettings[roomType];
    localStorage.setItem('roomName', setting.name);
    localStorage.setItem('roomPrompt', setting.systemPrompt);
    if (setting.alert) {
        localStorage.setItem('roomAlert', 'true');
    } else {
        localStorage.removeItem('roomAlert');
    }
    
    // チャットルームへ遷移
    window.location.href = 'chat-room.html';
}

// 使用統計を読み込み
function loadUsageStats() {
    // ローカルストレージから今日の使用回数を取得（仮実装）
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('usageDate');
    
    if (savedDate !== today) {
        // 新しい日なのでリセット
        localStorage.setItem('usageDate', today);
        roomUsageData = {
            math: 0,
            english: 0,
            japanese: 0,
            science: 0,
            social: 0,
            counseling: 0,
            homework: 0,
            free: 0
        };
        localStorage.setItem('roomUsage', JSON.stringify(roomUsageData));
    } else {
        // 保存されたデータを読み込み
        const saved = localStorage.getItem('roomUsage');
        roomUsageData = saved ? JSON.parse(saved) : {};
    }
    
    // UIに反映
    Object.keys(roomUsageData).forEach(room => {
        const element = document.getElementById(`${room}-count`);
        if (element) {
            element.textContent = `今日: ${roomUsageData[room] || 0}回`;
        }
    });
}

// 学習履歴を見る
function viewHistory() {
    alert('学習履歴機能は準備中です！');
}

// ログアウト
function logout() {
    if (confirm('ログアウトしますか？')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}