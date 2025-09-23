// 科目別チャットルームの制御
let currentRoom = '';
let roomPrompt = '';
let messageCount = 0;

// ルーム設定
const roomConfigs = {
    math: {
        icon: '📐',
        title: '算数・数学ルーム',
        welcome: '計算や図形について、なんでも質問してね！',
        hints: ['分数の計算を教えて', '図形の面積の求め方', '九九を練習したい']
    },
    english: {
        icon: '🌍',
        title: '英語ルーム',
        welcome: '英語の勉強を一緒にしよう！',
        hints: ['Hello!の挨拶を教えて', '動物の英語名', '簡単な自己紹介']
    },
    japanese: {
        icon: '📖',
        title: '国語ルーム',
        welcome: '漢字や読み方、作文の練習をしよう！',
        hints: ['漢字の書き順', 'この文章の意味', '作文の書き方']
    },
    science: {
        icon: '🔬',
        title: '理科ルーム',
        welcome: '自然や実験について学ぼう！',
        hints: ['なぜ空は青いの？', '植物の育ち方', '磁石のしくみ']
    },
    social: {
        icon: '🗺️',
        title: '社会ルーム',
        welcome: '歴史や地理を楽しく学ぼう！',
        hints: ['都道府県を覚えたい', '歴史上の人物', '世界の国々']
    },
    counseling: {
        icon: '💭',
        title: '悩み相談ルーム',
        welcome: 'どんなことでも話してみてね。一緒に考えよう。',
        hints: ['友達のこと', '学校のこと', '家族のこと'],
        alert: true
    },
    homework: {
        icon: '📝',
        title: '宿題ヘルプルーム',
        welcome: '今日の宿題を一緒に頑張ろう！',
        hints: ['算数の宿題', '漢字ドリル', '音読の練習']
    },
    free: {
        icon: '💬',
        title: 'フリートークルーム',
        welcome: 'なんでも自由に話そう！',
        hints: ['今日あったこと', '好きなもの', '将来の夢']
    }
};

// ページ読み込み時
window.addEventListener('DOMContentLoaded', async () => {
    // Firebase初期化を待つ
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ルーム情報を取得
    currentRoom = localStorage.getItem('currentRoom') || 'math';
    roomPrompt = localStorage.getItem('roomPrompt') || '';
    
    // ルームを初期化
    initializeRoom();
    
    // イベントリスナー設定
    setupEventListeners();
    
    // 悩み相談ルームの場合は警告表示
    if (currentRoom === 'counseling') {
        document.getElementById('counseling-notice').style.display = 'block';
    }
});

// ルーム初期化
function initializeRoom() {
    const config = roomConfigs[currentRoom];
    if (!config) return;
    
    // ルーム情報を表示
    document.getElementById('room-title').textContent = config.title;
    document.getElementById('room-icon').textContent = config.icon;
    document.getElementById('welcome-title').textContent = config.title + 'へようこそ！';
    document.getElementById('welcome-message').textContent = config.welcome;
    
    // ヒントボタンを生成
    const hintContainer = document.getElementById('hint-buttons');
    hintContainer.innerHTML = '';
    config.hints.forEach(hint => {
        const btn = document.createElement('button');
        btn.className = 'hint-btn';
        btn.textContent = hint;
        btn.onclick = () => {
            document.getElementById('message-input').value = hint;
            document.getElementById('message-input').focus();
        };
        hintContainer.appendChild(btn);
    });
    
    // 使用回数を更新
    updateUsageCount();
}

// イベントリスナー設定
function setupEventListeners() {
    const input = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    
    // 送信ボタン
    sendBtn.addEventListener('click', sendMessage);
    
    // Enterキーで送信（Shift+Enterは改行）
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // 文字数カウント
    input.addEventListener('input', () => {
        const count = input.value.length;
        document.getElementById('char-count').textContent = `${count}/1000`;
        
        // 自動高さ調整
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
}

// メッセージ送信
async function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // ユーザーメッセージを表示
    addMessage(message, 'user');
    
    // 入力欄をクリア
    input.value = '';
    input.style.height = 'auto';
    document.getElementById('char-count').textContent = '0/1000';
    
    // ボタンを無効化
    document.getElementById('send-btn').disabled = true;
    
    // 思考中表示
    document.getElementById('thinking-indicator').style.display = 'flex';
    
    try {
        // API呼び出し
        const response = await fetch('/api/claude', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                userId: localStorage.getItem('userId') || 'test-user',
                age: localStorage.getItem('ageGroup') || '9-12',
                room: currentRoom,
                roomPrompt: roomPrompt,
                plan: 'premium'
            })
        });
        
        const data = await response.json();
        
        // AIの返答を表示
        addMessage(data.reply, 'ai');
        
        // 悩み相談の場合のアラート処理
        if (currentRoom === 'counseling' && data.alert) {
            console.log('保護者への通知が必要なメッセージを検出');
            // TODO: Firebase経由で保護者に通知
        }
        
        // 使用回数を更新
        messageCount++;
        updateUsageCount();
        
    } catch (error) {
        console.error('Error:', error);
        addMessage('申し訳ありません。エラーが発生しました。もう一度お試しください。', 'ai');
    } finally {
        // 思考中表示を隠す
        document.getElementById('thinking-indicator').style.display = 'none';
        // ボタンを有効化
        document.getElementById('send-btn').disabled = false;
        input.focus();
    }
}

// メッセージを画面に追加
function addMessage(text, sender) {
    const messagesContainer = document.getElementById('messages');
    
    // ウェルカムメッセージを削除
    const welcome = messagesContainer.querySelector('.room-welcome');
    if (welcome) {
        welcome.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    if (sender === 'user') {
        avatarDiv.textContent = '👤';
    } else {
        avatarDiv.textContent = roomConfigs[currentRoom].icon;
        avatarDiv.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // 改行を含むテキストを処理
    const paragraphs = text.split('\n').filter(p => p.trim());
    paragraphs.forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        contentDiv.appendChild(p);
    });
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // 最新メッセージまでスクロール
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 使用回数を更新
function updateUsageCount() {
    const roomUsage = JSON.parse(localStorage.getItem('roomUsage') || '{}');
    roomUsage[currentRoom] = (roomUsage[currentRoom] || 0) + 1;
    localStorage.setItem('roomUsage', JSON.stringify(roomUsage));
}

// ルーム選択画面に戻る
function backToRoomSelect() {
    window.location.href = 'chat-select.html';
}

// ルーム変更
function switchRoom() {
    window.location.href = 'chat-select.html';
}

// ログアウト
function logout() {
    if (confirm('ログアウトしますか？')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}