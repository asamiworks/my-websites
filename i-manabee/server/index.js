// i-manabee サーバー
// Copyright © 2025 AsamiWorks. All rights reserved.

require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const path = require('path');

// ルートのインポート
// const authRoutes = require('./routes/auth');
// const profileRoutes = require('./routes/profile');
// const chatRoutes = require('./routes/chat');
// const reportsRoutes = require('./routes/reports');
// const settingsRoutes = require('./routes/settings');
// const paymentRoutes = require('./routes/payment');
// const adminRoutes = require('./routes/admin');

// 定数の設定
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Expressアプリの初期化
const app = express();

// セキュリティヘッダーの設定
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                "https://apis.google.com",
                "https://www.gstatic.com",
                "https://www.googletagmanager.com",
                "https://pagead2.googlesyndication.com"
            ],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: [
                "'self'",
                "https://api.openai.com",
                "https://api.anthropic.com",
                "https://generativelanguage.googleapis.com",
                "https://api.stripe.com",
                "https://firebaseapp.com",
                "https://firebaseio.com"
            ]
        }
    }
}));

// CORS設定
const corsOptions = {
    origin: NODE_ENV === 'production' 
        ? ['https://i-manabee.com', 'https://www.i-manabee.com']
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ミドルウェア設定
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ロギング設定
if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// セッション設定
app.use(session({
    secret: process.env.SESSION_SECRET || 'manabee-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // 15分
        sameSite: 'strict'
    }
}));

// レート制限設定
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分
    max: 100, // 最大100リクエスト
    message: 'リクエストが多すぎます。しばらくしてからお試しください。',
    standardHeaders: true,
    legacyHeaders: false,
});

// APIレート制限（より厳しい制限）
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1分
    max: 20, // 最大20リクエスト
    message: 'APIリクエストが多すぎます。',
    skipSuccessfulRequests: false
});

app.use('/api/', apiLimiter);

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../public'), {
    maxAge: NODE_ENV === 'production' ? '1d' : 0,
    etag: true
}));

// APIルートの設定
// app.use('/api/auth', authRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/reports', reportsRoutes);
// app.use('/api/settings', settingsRoutes);
// app.use('/api/payment', paymentRoutes);
// app.use('/api/admin', adminRoutes);

// テスト用エンドポイント
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'i-manabee',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        message: 'まなびー先生は元気です！🐝'
    });
});

// テスト用AIエンドポイント（簡易版）
app.post('/api/test/chat', async (req, res) => {
    const { message, subject = '一般' } = req.body;
    
    try {
        // 簡易的なレスポンス（実際のAI接続前のテスト用）
        const response = {
            message: `こんにちは！まなびー先生だよ🐝 「${message}」について一緒に考えてみよう！`,
            subject: subject,
            timestamp: new Date().toISOString()
        };
        
        res.json(response);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'エラーが発生しました',
            message: 'まなびー先生がちょっと疲れちゃったみたい...🐝'
        });
    }
});

// SPA用のフォールバック
app.get('*', (req, res) => {
    // APIリクエストではない場合
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    } else {
        res.status(404).json({ error: 'APIエンドポイントが見つかりません' });
    }
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    // エラーレスポンス
    const statusCode = err.statusCode || 500;
    const message = NODE_ENV === 'production' 
        ? 'エラーが発生しました' 
        : err.message;
    
    res.status(statusCode).json({
        error: true,
        message: message,
        ...(NODE_ENV === 'development' && { stack: err.stack })
    });
});

// サーバー起動
const server = app.listen(PORT, () => {
    console.log(`
    🐝 =======================================
       i-manabee (まなびー) サーバー起動！
    =======================================
    
    環境: ${NODE_ENV}
    ポート: ${PORT}
    URL: http://localhost:${PORT}
    
    APIテスト:
    - ヘルスチェック: http://localhost:${PORT}/api/health
    - チャットテスト: POST http://localhost:${PORT}/api/test/chat
    
    まなびー先生が準備できました！🐝
    =======================================
    `);
});

// グレースフルシャットダウン
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;