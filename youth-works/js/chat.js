// メッセージ送信の部分に、ローディング表示を追加
async function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // ユーザーメッセージを表示
    addMessage(message, 'user');
    
    // 入力欄をクリア
    input.value = '';
    
    // 送信ボタンを無効化
    document.getElementById('send-btn').disabled = true;
    
    // ⭐ ローディング表示を追加
    showTypingIndicator();
    
    try {
        // AIからの返答を取得
        const response = await fetch('/api/claude', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                userId: localStorage.getItem('userId'),
                age: ageGroup
            })
        });
        
        const data = await response.json();
        
        // ⭐ ローディング非表示
        hideTypingIndicator();
        
        // AIの返答を表示
        addMessage(data.reply, 'ai');
        
        // 残り回数表示（あれば）
        if (data.remaining !== undefined) {
            updateRemainingCount(data.remaining);
        }
        
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        addMessage('ごめんね、エラーが起きちゃった。もう一度試してみて！', 'ai');
    } finally {
        document.getElementById('send-btn').disabled = false;
    }
}

// ⭐ 新しい関数を追加（ファイルの最後に）
function showTypingIndicator() {
    const messagesContainer = document.getElementById('messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message ai-message typing';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function updateRemainingCount(count) {
    // ヘッダーに残り回数を表示（無料プランの場合）
    const headerRight = document.querySelector('.header-right');
    let counterEl = document.getElementById('usage-counter');
    
    if (!counterEl) {
        counterEl = document.createElement('span');
        counterEl.id = 'usage-counter';
        counterEl.style.marginRight = '10px';
        headerRight.insertBefore(counterEl, headerRight.firstChild);
    }
    
    counterEl.textContent = `今日の残り: ${count}回`;
    counterEl.style.color = count <= 2 ? '#ff6b6b' : '#666';
}