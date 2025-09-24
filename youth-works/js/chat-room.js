// ================================
//  グローバル変数と定数
// ================================
let currentRoom = null;
let currentProfile = null;
let messages = [];
let isTyping = false;
let recognition = null;
let messageCount = 0;
let lastMessageTime = null;

// AI設定
const AI_AVATARS = {
    math: '🎓',
    english: '🌏',
    japanese: '📚',
    science: '🔬',
    social: '🗺️',
    counseling: '💝',
    homework: '✏️',
    chat: '💫',
    study: '📊',
    career: '🎯'
};

// クイック質問（年齢別）
const QUICK_QUESTIONS = {
    young: {
        math: ['1+1は？', '10まで数えて', '大きい小さいを教えて'],
        english: ['Hello の意味は？', 'A B C を教えて', '色の英語は？'],
        japanese: ['ひらがなを教えて', '「あ」の書き方', '絵本を読みたい'],
        science: ['虹はなぜできる？', '雲って何？', '動物について教えて'],
        social: ['日本の首都は？', '世界の国を教えて', '地図の見方'],
        counseling: ['友達と仲良くするには', '勉強が楽しくない', '緊張する時'],
        homework: ['宿題がわからない', '計算を手伝って', '作文の書き方'],
        chat: ['今日の天気は？', '面白い話して', 'なぞなぞ出して']
    },
    middle: {
        math: ['分数の計算方法', '図形の面積', '速さの公式'],
        english: ['過去形の作り方', '英単語の覚え方', '自己紹介の英文'],
        japanese: ['漢字の覚え方', '作文のコツ', '読書感想文'],
        science: ['光合成について', '電気回路', '水の循環'],
        social: ['都道府県について', '歴史の覚え方', '地理の勉強法'],
        counseling: ['友達関係の悩み', 'テストが心配', '将来の夢'],
        homework: ['算数の文章問題', '理科の実験', '調べ学習'],
        chat: ['最近のニュース', 'おすすめの本', '勉強法']
    },
    teen: {
        math: ['二次方程式', '確率統計', '微分積分の基礎'],
        english: ['英作文のコツ', 'リスニング対策', '長文読解'],
        japanese: ['小論文の書き方', '古文の勉強法', '現代文読解'],
        science: ['化学反応式', '物理の公式', '生物の暗記法'],
        social: ['歴史の流れ', '政治経済', '地理の要点'],
        counseling: ['進路相談', '勉強のモチベーション', '人間関係'],
        study: ['効率的な暗記法', '時間管理', 'テスト対策'],
        career: ['大学選び', '将来の職業', '資格について']
    }
};

// メッセージテンプレート（年齢別）
const WELCOME_MESSAGES = {
    young: {
        title: 'いっしょに べんきょうしよう！',
        subtitle: 'わからないことは なんでも きいてね'
    },
    middle: {
        title: '一緒に勉強しよう！',
        subtitle: '分からないことは何でも質問してください'
    },
    teen: {
        title: '学習サポートを開始します',
        subtitle: '質問や相談をお待ちしています'
    }
};

// ================================
//  初期化処理
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initializeChat();
    setupEventListeners();
    setupVoiceRecognition();
});

async function initializeChat() {
    try {
        // ルーム情報を取得
        const roomData = localStorage.getItem('selectedRoom');
        if (!roomData) {
            alert('ルーム情報がありません');
            window.location.href = 'chat-select.html';
            return;
        }
        
        const data = JSON.parse(roomData);
        currentRoom = data;
        currentProfile = data.profile;
        
        // UI初期化
        initializeUI();
        
        // メッセージ履歴を読み込み
        loadMessageHistory();
        
        // プレミアム表示
        const isPremium = checkPremiumStatus();
        if (isPremium) {
            document.getElementById('premium-indicator').style.display = 'flex';
        }
        
    } catch (error) {
        console.error('初期化エラー:', error);
        showError('アプリの起動に失敗しました');
    }
}

function initializeUI() {
    // ヘッダー情報
    document.getElementById('room-icon').textContent = currentRoom.icon;
    document.getElementById('room-name').textContent = currentRoom.name;
    document.getElementById('user-avatar-small').textContent = currentProfile.avatar;
    document.getElementById('user-name-small').textContent = currentProfile.nickname;
    
    // AIアバター
    const aiAvatar = AI_AVATARS[currentRoom.id] || '🤖';
    document.getElementById('ai-avatar').textContent = aiAvatar;
    
    // ウェルカムメッセージ
    const welcomeMsg = WELCOME_MESSAGES[currentRoom.ageGroup];
    document.getElementById('welcome-text').textContent = welcomeMsg.title;
    document.getElementById('welcome-subtitle').textContent = welcomeMsg.subtitle;
    
    // クイック質問を表示
    displayQuickQuestions();
    
    // 年齢別クラス
    document.body.className = '';
    if (currentRoom.age >= 6 && currentRoom.age <= 8) {
        document.body.classList.add('age-6-8');
    } else if (currentRoom.age >= 13) {
        document.body.classList.add('age-13-plus');
    }
}

function displayQuickQuestions() {
    const chips = document.getElementById('suggestion-chips');
    chips.innerHTML = '';
    
    const questions = QUICK_QUESTIONS[currentRoom.ageGroup][currentRoom.id] || [];
    
    questions.forEach(question => {
        const chip = document.createElement('button');
        chip.className = 'chip';
        chip.textContent = question;
        chip.onclick = () => {
            document.getElementById('message-input').value = question;
            sendMessage();
        };
        chips.appendChild(chip);
    });
}

// ================================
//  イベントリスナー
// ================================
function setupEventListeners() {
    const input = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    
    // 入力監視
    input.addEventListener('input', (e) => {
        const length = e.target.value.length;
        document.getElementById('char-count').textContent = length;
        
        // 送信ボタンの有効/無効
        sendBtn.disabled = length === 0;
        
        // 自動リサイズ
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
        
        // ヒント表示（長時間入力がない場合）
        clearTimeout(window.hintTimeout);
        if (length > 0 && length < 10) {
            window.hintTimeout = setTimeout(() => {
                showHint();
            }, 10000);
        }
    });
    
    // Enterキーで送信
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) {
                sendMessage();
            }
        }
    });
    
    // メニュークリック外で閉じる
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-button') && !e.target.closest('.dropdown-menu')) {
            document.getElementById('dropdown-menu').style.display = 'none';
        }
        if (!e.target.closest('.assistant-btn') && !e.target.closest('.assistant-menu')) {
            document.getElementById('assistant-menu').style.display = 'none';
        }
    });
}

// ================================
//  メッセージ送信
// ================================
async function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // ユーザーメッセージを追加
    addMessage('user', message);
    
    // 入力をクリア
    input.value = '';
    input.style.height = 'auto';
    document.getElementById('char-count').textContent = '0';
    document.getElementById('send-btn').disabled = true;
    
    // ウェルカムメッセージを非表示
    if (messages.length === 1) {
        document.getElementById('welcome-message').style.display = 'none';
    }
    
    // タイピング表示
    showTypingIndicator();
    
    // 悩み相談の場合、深刻度をチェック
    if (currentRoom.id === 'counseling') {
        checkCounselingContent(message);
    }
    
    // API呼び出し（デモではタイムアウトで代替）
    setTimeout(() => {
        const response = generateAIResponse(message);
        hideTypingIndicator();
        addMessage('ai', response);
        
        // フローティングアシスタントを表示（5回目以降）
        messageCount++;
        if (messageCount >= 5) {
            document.getElementById('floating-assistant').style.display = 'block';
        }
    }, 1500 + Math.random() * 1000);
}

function addMessage(type, text) {
    const messagesList = document.getElementById('messages-list');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (type === 'user') {
        avatar.textContent = currentProfile.avatar;
    } else {
        avatar.textContent = AI_AVATARS[currentRoom.id] || '🤖';
    }
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const messageText = document.createElement('p');
    messageText.className = 'message-text';
    messageText.textContent = text;
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    content.appendChild(messageText);
    content.appendChild(time);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    messagesList.appendChild(messageDiv);
    
    // スクロール
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
    
    // メッセージを保存
    messages.push({
        type,
        text,
        timestamp: new Date().toISOString()
    });
    
    saveMessageHistory();
}

function showTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'flex';
    document.getElementById('typing-indicator').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
    });
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'none';
}

// ================================
//  AI応答生成（デモ用）
// ================================
function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    const ageGroup = currentRoom.ageGroup;
    
    // 簡単なパターンマッチング
    if (currentRoom.id === 'math') {
        if (lowerMessage.includes('1+1') || lowerMessage.includes('１＋１')) {
            return ageGroup === 'young' ? 
                '1+1は2だよ！りんご1こと、もう1こで、ぜんぶで2こになるね！🍎➕🍎＝🍎🍎' :
                '1+1は2です。基本的な足し算ですね。';
        }
        if (lowerMessage.includes('分数')) {
            return '分数は、1を等しく分けた時の一つ分を表します。例えば、1/2は「2つに分けた1つ分」という意味です。';
        }
    }
    
    if (currentRoom.id === 'english') {
        if (lowerMessage.includes('hello')) {
            return ageGroup === 'young' ?
                'Hello は「こんにちは」というあいさつだよ！😊 Hello! って元気に言ってみよう！' :
                'Helloは「こんにちは」という挨拶です。カジュアルな場面でよく使われます。';
        }
    }
    
    if (currentRoom.id === 'counseling') {
        if (lowerMessage.includes('友達') || lowerMessage.includes('ともだち')) {
            return ageGroup === 'young' ?
                'おともだちのことで こまっているんだね。どんなことが あったのか、ゆっくり はなしてみて。きっと いいほうほうが みつかるよ！' :
                '友達関係の悩みは誰にでもあります。どのような状況か、もう少し詳しく教えてもらえますか？一緒に解決策を考えましょう。';
        }
    }
    
    // デフォルト応答
    const defaultResponses = {
        young: [
            'なるほど！それについて もっと おしえてあげるね！',
            'いいしつもんだね！いっしょに かんがえてみよう！',
            'それは おもしろいね！もっと しりたいことは ある？'
        ],
        middle: [
            'いい質問ですね！それについて説明します。',
            'なるほど、その点について詳しく見ていきましょう。',
            '良い着眼点です！一緒に考えてみましょう。'
        ],
        teen: [
            'その質問について、詳しく解説します。',
            '良い観点ですね。段階的に説明していきます。',
            'それは重要なポイントです。詳しく見ていきましょう。'
        ]
    };
    
    const responses = defaultResponses[ageGroup] || defaultResponses.middle;
    return responses[Math.floor(Math.random() * responses.length)];
}

// ================================
//  悩み相談チェック
// ================================
function checkCounselingContent(message) {
    const seriousKeywords = [
        '死', 'しに', '消えたい', 'きえたい',
        'いじめ', 'イジメ', 'つらい', 'ツライ',
        '助けて', 'たすけて', '逃げたい', 'にげたい'
    ];
    
    const lowerMessage = message.toLowerCase();
    const containsSerious = seriousKeywords.some(keyword => 
        lowerMessage.includes(keyword)
    );
    
    if (containsSerious) {
        // 保護者通知モーダル表示
        setTimeout(() => {
            document.getElementById('parent-notification-modal').style.display = 'flex';
            
            // 実際のシステムではここで保護者にメール通知
            console.log('保護者への通知をトリガー');
        }, 2000);
    }
}

// ================================
//  音声入力
// ================================
function setupVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.continuous = false;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const input = document.getElementById('message-input');
            
            if (event.results[0].isFinal) {
                input.value = transcript;
                document.getElementById('char-count').textContent = transcript.length;
                document.getElementById('send-btn').disabled = false;
                document.getElementById('voice-btn').classList.remove('listening');
            } else {
                input.value = transcript + '...';
            }
        };
        
        recognition.onerror = (event) => {
            console.error('音声認識エラー:', event.error);
            document.getElementById('voice-btn').classList.remove('listening');
            
            if (event.error === 'no-speech') {
                showHint('マイクに向かって話してください');
            } else if (event.error === 'not-allowed') {
                showError('マイクの使用を許可してください');
            }
        };
        
        recognition.onend = () => {
            document.getElementById('voice-btn').classList.remove('listening');
        };
    }
}

function toggleVoiceInput() {
    if (!recognition) {
        showError('音声入力はこのブラウザではサポートされていません');
        return;
    }
    
    const voiceBtn = document.getElementById('voice-btn');
    
    if (voiceBtn.classList.contains('listening')) {
        recognition.stop();
        voiceBtn.classList.remove('listening');
    } else {
        recognition.start();
        voiceBtn.classList.add('listening');
        showHint('話し終わったら、もう一度ボタンを押してください');
    }
}

// ================================
//  フローティングアシスタント
// ================================
function toggleAssistant() {
    const menu = document.getElementById('assistant-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function closeAssistant() {
    document.getElementById('assistant-menu').style.display = 'none';
}

function getHint() {
    const hints = {
        math: '計算のステップを一つずつ確認してみましょう',
        english: '単語の意味から考えてみましょう',
        japanese: '文章の構造を分解してみましょう',
        science: '実験や観察から考えてみましょう',
        social: '地図や年表を使って整理してみましょう'
    };
    
    const hint = hints[currentRoom.id] || '質問を具体的にしてみましょう';
    showHint(hint);
    closeAssistant();
}

function simplifyAnswer() {
    addMessage('user', 'もっと簡単に説明してください');
    sendMessage();
    closeAssistant();
}

function getExample() {
    addMessage('user', '例を教えてください');
    sendMessage();
    closeAssistant();
}

function checkUnderstanding() {
    const questions = {
        young: '今のせつめいは わかったかな？',
        middle: '理解できましたか？',
        teen: '説明は理解できましたか？'
    };
    
    const question = questions[currentRoom.ageGroup] || questions.middle;
    addMessage('ai', question);
    closeAssistant();
}

// ================================
//  ユーティリティ関数
// ================================
function showHint(text) {
    const defaultHints = {
        math: '数字や記号を使って質問してみよう',
        english: '英語の単語や文について聞いてみよう',
        japanese: 'ひらがな、カタカナ、漢字について聞いてみよう',
        science: '実験や観察について聞いてみよう',
        social: '地理や歴史について聞いてみよう',
        counseling: '困っていることを話してみよう',
        homework: '宿題の問題を教えてね',
        chat: '何でも自由に話してみよう'
    };
    
    const hintText = text || defaultHints[currentRoom.id] || '質問を入力してみよう';
    
    document.getElementById('hint-text').textContent = hintText;
    document.getElementById('hint-bar').style.display = 'flex';
    
    setTimeout(() => {
        closeHint();
    }, 5000);
}

function closeHint() {
    document.getElementById('hint-bar').style.display = 'none';
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-modal').style.display = 'flex';
}

function closeErrorModal() {
    document.getElementById('error-modal').style.display = 'none';
}

function closeParentNotification() {
    document.getElementById('parent-notification-modal').style.display = 'none';
}

// ================================
//  メニュー機能
// ================================
function toggleMenu() {
    const menu = document.getElementById('dropdown-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function clearChat() {
    if (confirm('会話をすべて削除しますか？')) {
        document.getElementById('messages-list').innerHTML = '';
        document.getElementById('welcome-message').style.display = 'block';
        messages = [];
        messageCount = 0;
        saveMessageHistory();
        toggleMenu();
    }
}

function showHelp() {
    const helpMessages = {
        young: 'わからないことがあったら、なんでも きいてね！',
        middle: '使い方で困ったことがあれば、何でも質問してください',
        teen: 'ヘルプが必要な場合は、遠慮なく質問してください'
    };
    
    const message = helpMessages[currentRoom.ageGroup] || helpMessages.middle;
    alert(message);
    toggleMenu();
}

function reportIssue() {
    alert('問題の報告機能は現在開発中です');
    toggleMenu();
}

// ================================
//  クイックアクション
// ================================
function showExamples() {
    const examples = QUICK_QUESTIONS[currentRoom.ageGroup][currentRoom.id] || [];
    const example = examples[Math.floor(Math.random() * examples.length)];
    
    if (example) {
        document.getElementById('message-input').value = example;
        document.getElementById('char-count').textContent = example.length;
        document.getElementById('send-btn').disabled = false;
    }
}

function showFormula() {
    alert('計算機能は現在開発中です');
    // TODO: 計算機モーダルの実装
}

function insertImage() {
    alert('画像挿入機能は現在開発中です');
    // TODO: 画像アップロード機能の実装
}

// ================================
//  データ保存・読み込み
// ================================
function saveMessageHistory() {
    const historyKey = `chat_history_${currentProfile.id}_${currentRoom.id}`;
    const history = {
        messages: messages,
        lastAccessed: new Date().toISOString()
    };
    
    localStorage.setItem(historyKey, JSON.stringify(history));
}

function loadMessageHistory() {
    const historyKey = `chat_history_${currentProfile.id}_${currentRoom.id}`;
    const saved = localStorage.getItem(historyKey);
    
    if (saved) {
        const history = JSON.parse(saved);
        messages = history.messages || [];
        
        // 既存のメッセージを表示
        if (messages.length > 0) {
            document.getElementById('welcome-message').style.display = 'none';
            messages.forEach(msg => {
                addMessageToDOM(msg.type, msg.text);
            });
        }
    }
}

function addMessageToDOM(type, text) {
    const messagesList = document.getElementById('messages-list');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (type === 'user') {
        avatar.textContent = currentProfile.avatar;
    } else {
        avatar.textContent = AI_AVATARS[currentRoom.id] || '🤖';
    }
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const messageText = document.createElement('p');
    messageText.className = 'message-text';
    messageText.textContent = text;
    
    content.appendChild(messageText);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    messagesList.appendChild(messageDiv);
}

// ================================
//  その他の機能
// ================================
function goBack() {
    if (messages.length > 0) {
        if (confirm('会話の内容は保存されます。戻りますか？')) {
            window.location.href = 'chat-select.html';
        }
    } else {
        window.location.href = 'chat-select.html';
    }
}

function checkPremiumStatus() {
    // デモ用: プレミアムチェック
    const email = currentProfile.email || localStorage.getItem('userEmail');
    return email && email.includes('premium');
}