// ================================
//  グローバル変数と定数
// ================================
let currentUser = null;
let currentProfile = null;
let profiles = [];
let studyStats = {};

// 年齢グループの定義
const AGE_GROUPS = {
    YOUNG: { min: 6, max: 8, label: '6-8歳' },
    MIDDLE: { min: 9, max: 12, label: '9-12歳' },
    TEEN: { min: 13, max: 18, label: '13歳以上' }
};

// ルーム設定
const ROOMS = {
    young: [
        { id: 'math', icon: '🔢', name: 'さんすう', description: 'たのしくけいさん' },
        { id: 'english', icon: '🌍', name: 'えいご', description: 'ABCからはじめよう' },
        { id: 'japanese', icon: '📖', name: 'こくご', description: 'ひらがな・かんじ' },
        { id: 'science', icon: '🔬', name: 'りか', description: 'ふしぎをみつけよう' },
        { id: 'social', icon: '🗺️', name: 'しゃかい', description: 'せかいをしろう' },
        { id: 'counseling', icon: '💭', name: 'そうだん', description: 'なやみをきいて' },
        { id: 'homework', icon: '📝', name: 'しゅくだい', description: 'いっしょにがんばろう' },
        { id: 'chat', icon: '💬', name: 'おはなし', description: 'なんでもはなそう' }
    ],
    middle: [
        { id: 'math', icon: '📐', name: '算数・数学', description: '計算と図形' },
        { id: 'english', icon: '🌍', name: '英語', description: '読み書き会話' },
        { id: 'japanese', icon: '📖', name: '国語', description: '読解と作文' },
        { id: 'science', icon: '🔬', name: '理科', description: '実験と観察' },
        { id: 'social', icon: '🗺️', name: '社会', description: '歴史と地理' },
        { id: 'counseling', icon: '💭', name: '悩み相談', description: '困ったときに' },
        { id: 'homework', icon: '📝', name: '宿題ヘルプ', description: '分からない問題' },
        { id: 'chat', icon: '💬', name: 'フリートーク', description: '自由な会話' }
    ],
    teen: [
        { id: 'math', icon: '📊', name: '数学', description: '高度な数学' },
        { id: 'english', icon: '🌍', name: '英語', description: '実践的英語' },
        { id: 'japanese', icon: '📖', name: '国語', description: '論理的文章' },
        { id: 'science', icon: '🔬', name: '理科', description: '専門的内容' },
        { id: 'social', icon: '🗺️', name: '社会', description: '現代社会理解' },
        { id: 'counseling', icon: '💭', name: '相談室', description: '進路や悩み', badge: 'Private' },
        { id: 'study', icon: '📚', name: '学習計画', description: '効率的学習法' },
        { id: 'career', icon: '🎯', name: 'キャリア', description: '将来について' }
    ]
};

// ================================
//  初期化処理
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    try {
        // Firebase認証確認
        await checkAuthentication();
        
        // プロファイルデータ読み込み
        await loadProfiles();
        
        // UIの初期表示
        showProfileSelector();
        
        // 日付制限の設定
        setDateLimits();
        
    } catch (error) {
        console.error('初期化エラー:', error);
        alert('アプリの起動に失敗しました。ログインし直してください。');
        window.location.href = 'index.html';
    }
}

function setDateLimits() {
    const birthdateInput = document.getElementById('child-birthdate');
    if (birthdateInput) {
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        const maxDate = new Date(today.getFullYear() - 6, today.getMonth(), today.getDate());
        
        birthdateInput.max = maxDate.toISOString().split('T')[0];
        birthdateInput.min = minDate.toISOString().split('T')[0];
    }
}

// ================================
//  イベントリスナー設定
// ================================
function setupEventListeners() {
    // PINコード入力の自動フォーカス
    const pinInputs = document.querySelectorAll('.pin-digit');
    pinInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            
            if (value) {
                e.target.classList.add('filled');
                if (index < pinInputs.length - 1) {
                    pinInputs[index + 1].focus();
                }
            } else {
                e.target.classList.remove('filled');
            }
            
            checkPINComplete();
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                pinInputs[index - 1].focus();
            }
        });
    });
}

function checkPINComplete() {
    const pinInputs = document.querySelectorAll('.pin-digit');
    const allFilled = Array.from(pinInputs).every(input => input.value);
    document.querySelector('.submit-pin-btn').disabled = !allFilled;
}

// ================================
//  認証関連
// ================================
async function checkAuthentication() {
    return new Promise((resolve) => {
        if (typeof firebase === 'undefined') {
            // Firebase未設定の場合はダミーデータで動作
            console.log('Firebaseが設定されていません。デモモードで動作します。');
            currentUser = { email: 'demo@example.com', uid: 'demo-user' };
            resolve();
            return;
        }
        
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                resolve();
            } else {
                window.location.href = 'index.html';
            }
        });
    });
}

// ================================
//  プロファイル管理
// ================================
async function loadProfiles() {
    // ローカルストレージから読み込み（デモ用）
    const savedProfiles = localStorage.getItem('childProfiles');
    
    if (savedProfiles) {
        profiles = JSON.parse(savedProfiles);
    } else {
        // デモ用のサンプルプロファイル
        profiles = [
            {
                id: 'profile-1',
                nickname: 'たろう',
                birthdate: '2015-06-15',
                avatar: '🦁',
                pin: '1234',
                stats: {
                    todayCount: 5,
                    streakDays: 3,
                    totalCount: 42
                }
            },
            {
                id: 'profile-2',
                nickname: 'はなこ',
                birthdate: '2017-03-22',
                avatar: '🐰',
                pin: '5678',
                stats: {
                    todayCount: 3,
                    streakDays: 1,
                    totalCount: 15
                }
            }
        ];
        
        localStorage.setItem('childProfiles', JSON.stringify(profiles));
    }
}

function saveProfiles() {
    localStorage.setItem('childProfiles', JSON.stringify(profiles));
}

// ================================
//  プロファイル選択画面
// ================================
function showProfileSelector() {
    document.getElementById('profile-selector').style.display = 'flex';
    document.getElementById('pin-input').style.display = 'none';
    document.getElementById('select-container').style.display = 'none';
    
    renderProfiles();
}

function renderProfiles() {
    const grid = document.getElementById('profile-grid');
    grid.innerHTML = '';
    
    profiles.forEach(profile => {
        const age = calculateAge(profile.birthdate);
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.onclick = () => selectProfile(profile);
        
        card.innerHTML = `
            <span class="profile-avatar">${profile.avatar}</span>
            <h3 class="profile-name">${profile.nickname}</h3>
            <span class="profile-age">${age}歳</span>
        `;
        
        grid.appendChild(card);
    });
}

function calculateAge(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// ================================
//  PIN認証
// ================================
function selectProfile(profile) {
    currentProfile = profile;
    
    // PIN入力画面を表示
    document.getElementById('profile-selector').style.display = 'none';
    document.getElementById('pin-input').style.display = 'flex';
    
    // プロファイル情報を表示
    document.getElementById('selected-avatar').textContent = profile.avatar;
    document.getElementById('selected-name').textContent = profile.nickname;
    
    // PIN入力をリセット
    document.querySelectorAll('.pin-digit').forEach(input => {
        input.value = '';
        input.classList.remove('filled');
    });
    document.querySelector('.pin-digit').focus();
    document.getElementById('pin-error').style.display = 'none';
}

function verifyPIN() {
    const pinInputs = document.querySelectorAll('.pin-digit');
    const enteredPIN = Array.from(pinInputs).map(input => input.value).join('');
    
    if (enteredPIN === currentProfile.pin) {
        // 成功
        showMainScreen();
    } else {
        // エラー表示
        document.getElementById('pin-error').style.display = 'block';
        
        // 入力をリセット
        pinInputs.forEach(input => {
            input.value = '';
            input.classList.remove('filled');
        });
        pinInputs[0].focus();
        
        // エラーメッセージを3秒後に非表示
        setTimeout(() => {
            document.getElementById('pin-error').style.display = 'none';
        }, 3000);
    }
}

function backToProfiles() {
    showProfileSelector();
}

// ================================
//  メイン画面
// ================================
function showMainScreen() {
    document.getElementById('pin-input').style.display = 'none';
    document.getElementById('select-container').style.display = 'block';
    
    // ユーザー情報を表示
    const age = calculateAge(currentProfile.birthdate);
    const ageGroup = getAgeGroup(age);
    
    document.getElementById('user-avatar').textContent = currentProfile.avatar;
    document.getElementById('user-nickname').textContent = currentProfile.nickname;
    document.getElementById('age-display').textContent = `${age}歳`;
    
    // 年齢に応じたクラスを追加
    document.body.className = '';
    if (age >= 6 && age <= 8) {
        document.body.classList.add('age-6-8');
    } else if (age >= 13) {
        document.body.classList.add('age-13-plus');
    }
    
    // ルームを表示
    renderRooms(ageGroup);
    
    // 統計を表示
    updateStats();
    
    // 目標進捗を更新
    updateGoalProgress();
}

function getAgeGroup(age) {
    if (age >= 6 && age <= 8) return 'young';
    if (age >= 9 && age <= 12) return 'middle';
    return 'teen';
}

function renderRooms(ageGroup) {
    const grid = document.getElementById('room-grid');
    grid.innerHTML = '';
    
    const rooms = ROOMS[ageGroup] || ROOMS.middle;
    
    rooms.forEach(room => {
        const card = document.createElement('div');
        card.className = 'room-card';
        card.onclick = () => enterRoom(room);
        
        let badgeHTML = '';
        if (room.badge) {
            badgeHTML = `<span class="room-badge">${room.badge}</span>`;
        }
        
        card.innerHTML = `
            ${badgeHTML}
            <span class="room-icon">${room.icon}</span>
            <h4 class="room-name">${room.name}</h4>
            <p class="room-description">${room.description}</p>
        `;
        
        grid.appendChild(card);
    });
}

function updateStats() {
    const stats = currentProfile.stats || {
        todayCount: 0,
        streakDays: 0,
        totalCount: 0
    };
    
    document.getElementById('today-count').textContent = `${stats.todayCount}回`;
    document.getElementById('streak-count').textContent = `${stats.streakDays}日`;
    document.getElementById('total-count').textContent = `${stats.totalCount}回`;
}

function updateGoalProgress() {
    const roomsVisited = currentProfile.roomsVisitedToday || 0;
    const goalTarget = 3;
    const progress = Math.min((roomsVisited / goalTarget) * 100, 100);
    
    document.getElementById('goal-progress').style.width = `${progress}%`;
    document.getElementById('goal-count').textContent = `${roomsVisited}/${goalTarget}`;
    
    if (roomsVisited >= goalTarget) {
        document.getElementById('goal-text').textContent = '目標達成！すごい！🎉';
    }
}

// ================================
//  ルーム遷移
// ================================
function enterRoom(room) {
    // 選択したルーム情報を保存
    const roomData = {
        ...room,
        profile: currentProfile,
        age: calculateAge(currentProfile.birthdate),
        ageGroup: getAgeGroup(calculateAge(currentProfile.birthdate))
    };
    
    localStorage.setItem('selectedRoom', JSON.stringify(roomData));
    
    // 統計を更新
    updateRoomVisit(room.id);
    
    // チャットルームへ遷移
    window.location.href = 'chat-room.html';
}

function updateRoomVisit(roomId) {
    // 訪問記録を更新
    if (!currentProfile.roomsVisitedToday) {
        currentProfile.roomsVisitedToday = 0;
    }
    currentProfile.roomsVisitedToday++;
    
    // 統計を更新
    currentProfile.stats = currentProfile.stats || {};
    currentProfile.stats.todayCount = (currentProfile.stats.todayCount || 0) + 1;
    currentProfile.stats.totalCount = (currentProfile.stats.totalCount || 0) + 1;
    
    // 保存
    const profileIndex = profiles.findIndex(p => p.id === currentProfile.id);
    if (profileIndex !== -1) {
        profiles[profileIndex] = currentProfile;
        saveProfiles();
    }
}

// ================================
//  ユーザー切り替え
// ================================
function switchUser() {
    if (confirm('別のユーザーに切り替えますか？')) {
        currentProfile = null;
        showProfileSelector();
    }
}

// ================================
//  プロファイル追加
// ================================
function showAddProfileModal() {
    document.getElementById('add-profile-modal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

async function addNewProfile(event) {
    event.preventDefault();
    
    const nickname = document.getElementById('child-nickname').value;
    const birthdate = document.getElementById('child-birthdate').value;
    const avatar = document.querySelector('input[name="avatar"]:checked').value;
    const pin = document.getElementById('child-pin').value;
    
    // 年齢確認
    const age = calculateAge(birthdate);
    if (age < 6 || age > 18) {
        alert('対象年齢は6歳から18歳までです');
        return;
    }
    
    // 新しいプロファイルを作成
    const newProfile = {
        id: `profile-${Date.now()}`,
        nickname,
        birthdate,
        avatar,
        pin,
        stats: {
            todayCount: 0,
            streakDays: 0,
            totalCount: 0
        },
        createdAt: new Date().toISOString()
    };
    
    // 保存
    profiles.push(newProfile);
    saveProfiles();
    
    // モーダルを閉じて更新
    closeModal('add-profile-modal');
    renderProfiles();
    
    // フォームリセット
    document.getElementById('add-profile-form').reset();
    
    alert(`${nickname}さんのプロファイルを追加しました！`);
}

// ================================
//  保護者設定
// ================================
function openParentSettings() {
    // PIN入力などの認証を追加
    const parentPIN = prompt('保護者用PINコードを入力してください');
    
    // デモ用: PINは "0000"
    if (parentPIN === '0000') {
        alert('保護者設定画面は現在開発中です');
        // TODO: 保護者設定画面を実装
    } else if (parentPIN !== null) {
        alert('PINコードが正しくありません');
    }
}

// ================================
//  その他の機能
// ================================
function showHistory() {
    alert('学習履歴機能は現在開発中です');
    // TODO: 履歴画面の実装
}

function showRewards() {
    alert('ごほうび機能は現在開発中です');
    // TODO: 報酬システムの実装
}

function showSettings() {
    alert('設定画面は現在開発中です');
    // TODO: 設定画面の実装
}

function showRooms() {
    // ホームタブをアクティブに
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
}

// ================================
//  ログアウト
// ================================
function logout() {
    if (confirm('ログアウトしますか？')) {
        localStorage.clear();
        if (firebase && firebase.auth) {
            firebase.auth().signOut();
        }
        window.location.href = 'index.html';
    }
}