import * as functions from 'firebase-functions';
const cors = require('cors');
import { sendAutoReply, sendAdminNotification } from './lib/gmail-sender';
import * as dotenv from 'dotenv';

// .envファイルから環境変数を読み込む
dotenv.config();

// CORS設定
const corsHandler = cors({ 
  origin: [
    'https://asami-works.com',
    'https://asamiworks-679b3.web.app',
    'https://asamiworks-679b3.firebaseapp.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// 簡易的なレート制限用のメモリストア
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// IPアドレス取得
const getClientIp = (req: any): string => {
  const forwarded = req.headers['x-forwarded-for'] as string;
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] as string || req.ip || 'unknown';
};

// シンプルなレート制限チェック
const checkRateLimit = (ip: string, limit: number = 5, windowMinutes: number = 60): boolean => {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  
  const record = rateLimitStore.get(ip);
  
  if (!record || record.resetTime < now) {
    // 新しいウィンドウ
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    console.warn(`Rate limit exceeded for IP: ${ip}, count: ${record.count}, limit: ${limit}`);
    return false;
  }
  
  record.count++;
  rateLimitStore.set(ip, record); // 更新したレコードを保存
  return true;
};

// セキュリティヘッダーを追加
const addSecurityHeaders = (res: any) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
};

// 型定義
interface ContactRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}

interface FormRequest {
  name: string;
  email: string;
  tel: string;
  company?: string;
  budget: string;
  deadline: string;
  inquiryType?: string;  // 追加
  other?: string;        // 追加
  message: string;
}

/**
 * お問い合わせフォーム処理
 */
export const contact = functions.https.onRequest((request, response) => {
  // セキュリティヘッダーを追加
  addSecurityHeaders(response);
  
  corsHandler(request, response, async () => {
    // OPTIONSリクエストに対応
    if (request.method === 'OPTIONS') {
      response.status(200).send();
      return;
    }

    // POSTメソッドのみ許可
    if (request.method !== 'POST') {
      response.status(405).send('Method Not Allowed');
      return;
    }

    // レート制限チェック
    const clientIp = getClientIp(request);
    if (!checkRateLimit(clientIp, 3, 60)) { // 1時間に3回まで
      console.error(`Rate limit exceeded - IP: ${clientIp}, Endpoint: /contact`);
      const record = rateLimitStore.get(clientIp);
      const remainingMinutes = record ? Math.ceil((record.resetTime - Date.now()) / 1000 / 60) : 60;
      response.status(429).json({
        success: false,
        message: `送信回数の上限（1時間に3回）に達しました。約${remainingMinutes}分後に再度お試しください。`
      });
      return;
    }

    try {
      const body: ContactRequest = request.body;
      const { name, email, company, phone, message } = body;

      // ログ記録
      const record = rateLimitStore.get(clientIp);
      console.log(`Contact form submission - IP: ${clientIp}, Email: ${email?.substring(0, 3)}***, Count: ${record?.count || 1}/3`);

      // バリデーション
      if (!name || !email || !message) {
        response.status(400).json({
          success: false,
          message: '必須項目が入力されていません'
        });
        return;
      }

      // メールアドレスの基本的なバリデーション
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        response.status(400).json({
          success: false,
          message: 'メールアドレスの形式が正しくありません'
        });
        return;
      }

      // Gmail送信処理
      const contactData = {
        name,
        email,
        company,
        phone,
        message,
        userAgent: request.headers['user-agent'] || '',
        ip: clientIp
      };

      // 自動返信メール送信
      const autoReplyResult = await sendAutoReply(contactData);
      
      // 管理者通知メール送信
      const adminNotificationResult = await sendAdminNotification(contactData);

      if (autoReplyResult.success && adminNotificationResult.success) {
        console.log(`Contact form processed successfully - IP: ${clientIp}`);
        response.json({
          success: true,
          message: 'お問い合わせを受け付けました。自動返信メールをご確認ください。'
        });
      } else {
        throw new Error('メール送信に失敗しました');
      }

    } catch (error) {
      console.error('Contact form error:', error, `IP: ${clientIp}`);
      response.status(500).json({
        success: false,
        message: 'エラーが発生しました。しばらく経ってから再度お試しください。'
      });
    }
  });
});

/**
 * 一般フォーム処理
 */
export const form = functions.https.onRequest((request, response) => {
  // セキュリティヘッダーを追加
  addSecurityHeaders(response);
  
  corsHandler(request, response, async () => {
    // OPTIONSリクエストに対応
    if (request.method === 'OPTIONS') {
      response.status(200).send();
      return;
    }

    // POSTメソッドのみ許可
    if (request.method !== 'POST') {
      response.status(405).send('Method Not Allowed');
      return;
    }

    // レート制限チェック
    const clientIp = getClientIp(request);
    if (!checkRateLimit(clientIp, 3, 60)) { // 1時間に3回まで
      console.error(`Rate limit exceeded - IP: ${clientIp}, Endpoint: /form`);
      const record = rateLimitStore.get(clientIp);
      const remainingMinutes = record ? Math.ceil((record.resetTime - Date.now()) / 1000 / 60) : 60;
      response.status(429).json({
        success: false,
        message: `送信回数の上限（1時間に3回）に達しました。約${remainingMinutes}分後に再度お試しください。`
      });
      return;
    }

    try {
      const body: FormRequest = request.body;
      const { name, email, tel, company, inquiryType, message } = body;

      // ログ記録（inquiryTypeも記録）
      const record = rateLimitStore.get(clientIp);
      console.log(`Form submission - IP: ${clientIp}, Email: ${email?.substring(0, 3)}***, InquiryType: ${inquiryType}, Count: ${record?.count || 1}/3`);

      // バリデーション（messageのみ必須、他はクライアント側で構築済み）
      if (!name || !email || !message) {
        response.status(400).json({
          success: false,
          message: '必須項目が入力されていません'
        });
        return;
      }

      // メールアドレスの基本的なバリデーション
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        response.status(400).json({
          success: false,
          message: 'メールアドレスの形式が正しくありません'
        });
        return;
      }

      // Gmail送信処理
      // Note: messageにはクライアント側で構築された完全なメッセージが含まれている
      const contactData = {
        name,
        email,
        phone: tel || undefined,
        company: company || undefined,
        message: message, // クライアントで構築済みの完全なメッセージ
        userAgent: request.headers['user-agent'] || '',
        ip: clientIp
      };

      // 自動返信メール送信
      const autoReplyResult = await sendAutoReply(contactData);
      
      // 管理者通知メール送信
      const adminNotificationResult = await sendAdminNotification(contactData);

      if (autoReplyResult.success && adminNotificationResult.success) {
        console.log(`Form processed successfully - IP: ${clientIp}`);
        response.json({
          success: true,
          message: 'お問い合わせを受け付けました。自動返信メールをご確認ください。'
        });
      } else {
        throw new Error('メール送信に失敗しました');
      }

    } catch (error) {
      console.error('Form submission error:', error, `IP: ${clientIp}`);
      response.status(500).json({
        success: false,
        message: 'エラーが発生しました。しばらく経ってから再度お試しください。'
      });
    }
  });
});

/**
 * Instagram フィード取得
 */
export const instagram = functions.https.onRequest((request, response) => {
  // セキュリティヘッダーを追加
  addSecurityHeaders(response);
  
  corsHandler(request, response, async () => {
    // OPTIONSリクエストに対応
    if (request.method === 'OPTIONS') {
      response.status(200).send();
      return;
    }

    // GETメソッドのみ許可
    if (request.method !== 'GET') {
      response.status(405).send('Method Not Allowed');
      return;
    }

    const clientIp = getClientIp(request);
    
    // Instagram APIは緩いレート制限（1分に30回）
    if (!checkRateLimit(`instagram_${clientIp}`, 30, 1)) {
      // キャッシュ制御ヘッダーを追加
      response.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.set('Pragma', 'no-cache');
      response.set('Expires', '0');
      
      response.status(429).json({
        error: 'Too Many Requests',
        data: [],
        count: 0,
        timestamp: new Date().toISOString()
      });
      return;
    }

    try {
      console.log(`Instagram feed request - IP: ${clientIp}`);
      
      // 環境変数から取得
      const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
      const userId = process.env.INSTAGRAM_USER_ID;

      if (!accessToken || !userId) {
        // キャッシュ制御ヘッダーを追加
        response.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.set('Pragma', 'no-cache');
        response.set('Expires', '0');
        
        response.json({
          data: [],
          count: 0,
          message: 'Instagram configuration missing',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const axios = require('axios');

      const instagramResponse = await axios.get(
        `https://graph.instagram.com/v18.0/${userId}/media`,
        {
          params: {
            fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
            access_token: accessToken,
            limit: 9
          }
        }
      );

      const data = instagramResponse.data;

      if (!data || data.error) {
        console.error('Instagram API Error:', data.error);
        // キャッシュ制御ヘッダーを追加
        response.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.set('Pragma', 'no-cache');
        response.set('Expires', '0');
        
        response.json({
          data: [],
          count: 0,
          message: 'Failed to fetch Instagram data',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const mediaPosts = (data.data || []).filter(
        (post: any) => ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'].includes(post.media_type)
      );

      // キャッシュ制御ヘッダーを追加（成功時も）
      response.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.set('Pragma', 'no-cache');
      response.set('Expires', '0');
      
      response.json({
        data: mediaPosts.slice(0, 6),
        count: mediaPosts.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Instagram feed error:', error, `IP: ${clientIp}`);
      // キャッシュ制御ヘッダーを追加
      response.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.set('Pragma', 'no-cache');
      response.set('Expires', '0');
      
      response.status(500).json({
        error: 'Internal server error',
        data: [],
        count: 0,
        timestamp: new Date().toISOString()
      });
    }
  });
});
