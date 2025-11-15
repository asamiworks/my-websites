const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const app = express();

// ミドルウェア（文字化け対策含む）
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('.'));

// 使用回数管理（メモリ内で管理）
const userUsageMap = new Map();

// Claude API初期化（有料プラン用）
let anthropic = null;
if (process.env.CLAUDE_API_KEY) {
    try {
        const Anthropic = require('@anthropic-ai/sdk');
        anthropic = new Anthropic({
            apiKey: process.env.CLAUDE_API_KEY
        });
        console.log('✅ Claude API初期化成功（有料プラン用）');
    } catch (error) {
        console.log('⚠️ Claude API初期化エラー:', error.message);
    }
}

// OpenAI API初期化（無料プラン用）
let openai = null;
if (process.env.OPENAI_API_KEY) {
    try {
        const OpenAI = require('openai');
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        console.log('✅ OpenAI API初期化成功（無料プラン用）');
    } catch (error) {
        console.log('⚠️ OpenAI API初期化エラー:', error.message);
    }
}

// 使用回数チェック関数
function checkDailyUsage(userId, isPremium) {
    const today = new Date().toDateString();
    const key = `${userId}_${today}`;
    
    if (!userUsageMap.has(key)) {
        userUsageMap.set(key, 0);
    }
    
    const currentUsage = userUsageMap.get(key);
    const limit = isPremium ? 50 : 5;
    
    return {
        canUse: currentUsage < limit,
        remaining: Math.max(0, limit - currentUsage),
        usage: currentUsage,
        limit: limit
    };
}

// 使用回数更新関数
function updateUsage(userId) {
    const today = new Date().toDateString();
    const key = `${userId}_${today}`;
    const current = userUsageMap.get(key) || 0;
    userUsageMap.set(key, current + 1);
}

// 基本ルート
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 環境変数をクライアントに送信するエンドポイント
app.get('/api/config', (req, res) => {
    res.json({
        firebase: {
            apiKey: process.env.FIREBASE_API_KEY || 'not-set',
            authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'not-set',
            projectId: process.env.FIREBASE_PROJECT_ID || 'not-set',
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'not-set',
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'not-set',
            appId: process.env.FIREBASE_APP_ID || 'not-set'
        }
    });
});

// メインAPIエンドポイント
app.post('/api/claude', async (req, res) => {
    const { message, userId = 'anonymous', age = '10', subject = 'general' } = req.body;
    
    // ユーザープランを判定
    const isPremium = userId && (
        userId.includes('premium') || 
        userId.includes('pro') || 
        userId.includes('paid')
    );
    
    console.log(`\n📨 メッセージ受信`);
    console.log(`   ユーザー: ${userId}`);
    console.log(`   プラン: ${isPremium ? '🌟 プレミアム' : '🆓 無料'}`);
    console.log(`   科目: ${subject}`);
    console.log(`   メッセージ: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    
    // 使用回数チェック
    const usage = checkDailyUsage(userId, isPremium);
    if (!usage.canUse) {
        console.log(`❌ 使用制限到達: ${userId} (${usage.usage}/${usage.limit})`);
        return res.status(429).json({
            error: '使用制限に達しました',
            reply: `今日の使用回数（${usage.limit}回）に達しました。${isPremium ? '' : 'プレミアムプランなら1日50回まで使えるよ！'}また明日話そうね！😊`,
            remaining: 0,
            limit: usage.limit
        });
    }
    
    // 科目別プロンプト
    const subjectPrompts = {
        math: '数学の問題は、式や図を使って段階的に説明してください。',
        japanese: '国語は言葉の成り立ちや使い方を分かりやすく教えてください。',
        english: '英語は楽しく学べるよう、簡単な例文と発音のヒントを添えてください。',
        science: '理科は身の回りの現象と結びつけて、実験のような楽しさを伝えてください。',
        social: '社会は物語のように興味深く、地図や年表をイメージしやすく説明してください。',
        programming: 'プログラミングはゲーム感覚で楽しく、小さなステップで教えてください。',
        art: '図工や美術は創造性を大切に、「正解はない」ことを伝えてください。',
        worry: '悩み相談では優しく寄り添い、前向きになれるよう励ましてください。深刻な内容の場合は大人に相談することも提案してください。',
        general: '楽しく学べるように工夫してください。'
    };
    
    // システムプロンプト
    const systemPrompt = `
    あなたは6〜12歳の子どもの学習をサポートする優しい先生です。
    子どもの年齢は${age}歳です。
    ${subjectPrompts[subject] || subjectPrompts.general}
    
    必ず以下のルールを守ってください：
    - ひらがなを多く使い、難しい漢字には必ずふりがなをつける
    - 答えをすぐに教えず、一緒に考えるようにヒントを段階的に出す
    - 必ず褒めて励ます（「すごい！」「いいね！」「がんばったね！」「その調子！」など）
    - 絵文字を適度に使って親しみやすく（😊 ✨ 🎉 💪 🌟 👍 🎯）
    - 短い文で区切って読みやすくする（1文は30文字以内が理想）
    - 子どもが理解しやすい例えを使う
    - 間違えても「大丈夫！」と励ます
    ${!isPremium ? '- 無料プランなので、回答は簡潔にまとめる（200文字程度）' : ''}
    `;

    try {
        let reply = "";
        let apiUsed = "";
        
        // プレミアムプラン → Claude API使用
        if (isPremium) {
            if (!anthropic) {
                throw new Error('Claude APIが設定されていません');
            }
            
            apiUsed = "Claude AI";
            console.log('🤖 Claude API使用中...');
            
            const completion = await anthropic.messages.create({
                model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
                max_tokens: parseInt(process.env.CLAUDE_MAX_TOKENS) || 500,
                temperature: 0.7,
                system: systemPrompt,
                messages: [{ role: 'user', content: message }]
            });
            reply = completion.content[0].text;
            
        // 無料プラン → OpenAI API使用
        } else {
            if (!openai) {
                throw new Error('OpenAI APIが設定されていません');
            }
            
            apiUsed = "OpenAI GPT-3.5";
            console.log('🤖 OpenAI API使用中...');
            
            const completion = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 300,
                temperature: 0.7
            });
            reply = completion.choices[0].message.content;
        }
        
        // 使用回数を更新
        updateUsage(userId);
        const newUsage = checkDailyUsage(userId, isPremium);
        
        console.log(`✅ 応答成功 (${apiUsed}) - 残り${newUsage.remaining}回`);
        
        // 成功レスポンス
        res.json({ 
            reply: reply,
            remaining: newUsage.remaining,
            limit: newUsage.limit,
            apiUsed: apiUsed,
            userId: userId,
            isPremium: isPremium
        });
        
    } catch (error) {
        console.error('❌ APIエラー:', error.message);
        
        // エラー詳細のログ
        if (error.status) {
            console.error(`   HTTPステータス: ${error.status}`);
        }
        if (error.code) {
            console.error(`   エラーコード: ${error.code}`);
        }
        
        // エラーレスポンス
        const errorMessages = {
            401: 'APIキーの設定を確認してください',
            429: 'APIの使用制限に達しました。少し待ってから再度お試しください',
            500: 'サーバーエラーが発生しました',
            default: 'エラーが発生しました'
        };
        
        const statusCode = error.status || 500;
        const errorMessage = errorMessages[statusCode] || errorMessages.default;
        
        res.status(statusCode).json({ 
            error: errorMessage,
            reply: 'ごめんね！😢 今ちょっと調子が悪いみたい。\n\nもう少し待ってから、もう一度話しかけてみてね！',
            remaining: checkDailyUsage(userId, isPremium).remaining
        });
    }
});

// ヘルスチェックエンドポイント
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        apis: {
            claude: anthropic ? '✅ Ready' : '❌ Not configured',
            openai: openai ? '✅ Ready' : '❌ Not configured'
        },
        timestamp: new Date().toISOString()
    });
});

// 統計情報エンドポイント（デバッグ用）
app.get('/api/stats', (req, res) => {
    const stats = {};
    const today = new Date().toDateString();
    
    for (const [key, value] of userUsageMap.entries()) {
        if (key.includes(today)) {
            stats[key] = value;
        }
    }
    
    res.json({
        date: today,
        users: stats,
        totalRequests: Object.values(stats).reduce((a, b) => a + b, 0)
    });
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║     🚀 YouthWorks Server Started      ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📝 無料プラン: OpenAI ${openai ? '✅' : '❌'}`);
    console.log(`📝 有料プラン: Claude ${anthropic ? '✅' : '❌'}`);
    console.log('─────────────────────────────────────────');
    console.log('📊 エンドポイント:');
    console.log('   POST /api/claude - チャット');
    console.log('   GET  /api/health - ヘルスチェック');
    console.log('   GET  /api/stats  - 統計情報');
    console.log('─────────────────────────────────────────\n');
    
    // 起動時の警告
    if (!anthropic || !openai) {
        console.warn('⚠️  警告: 一部のAPIが未設定です');
        if (!openai) console.warn('   → OpenAI API（無料プラン）が利用できません');
        if (!anthropic) console.warn('   → Claude API（有料プラン）が利用できません');
    }
});