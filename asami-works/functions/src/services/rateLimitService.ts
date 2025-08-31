import * as admin from 'firebase-admin';

interface RateLimitEntry {
  count: number;
  firstRequest: admin.firestore.Timestamp;
  lastRequest: admin.firestore.Timestamp;
  blocked?: boolean;
}

export class RateLimitService {
  private db = admin.firestore();
  
  async checkRateLimit(
    identifier: string,
    limitType: 'email' | 'api',
    maxRequests: number,
    windowMinutes: number
  ): Promise<{ allowed: boolean; remainingRequests: number }> {
    const doc = this.db.doc(`rateLimits/${limitType}/${identifier}`);
    
    return await this.db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(doc);
      const now = admin.firestore.Timestamp.now();
      
      if (!snapshot.exists) {
        // 初回リクエスト
        transaction.set(doc, {
          count: 1,
          firstRequest: now,
          lastRequest: now
        } as RateLimitEntry);
        
        return { allowed: true, remainingRequests: maxRequests - 1 };
      }
      
      const data = snapshot.data() as RateLimitEntry;
      
      // ブロックされているかチェック
      if (data.blocked) {
        return { allowed: false, remainingRequests: 0 };
      }
      
      // 時間窓のチェック
      const windowStart = new Date(now.toMillis() - windowMinutes * 60 * 1000);
      const firstRequestTime = data.firstRequest.toDate();
      
      if (firstRequestTime < windowStart) {
        // 新しい時間窓の開始
        transaction.update(doc, {
          count: 1,
          firstRequest: now,
          lastRequest: now
        });
        
        return { allowed: true, remainingRequests: maxRequests - 1 };
      }
      
      // 現在の時間窓内
      if (data.count >= maxRequests) {
        // 不審なアクティビティの検出
        if (data.count > maxRequests * 2) {
          transaction.update(doc, { blocked: true });
          await this.logSuspiciousActivity(identifier, limitType);
        }
        
        return { allowed: false, remainingRequests: 0 };
      }
      
      // カウントを増やす
      transaction.update(doc, {
        count: data.count + 1,
        lastRequest: now
      });
      
      return { allowed: true, remainingRequests: maxRequests - data.count - 1 };
    });
  }
  
  private async logSuspiciousActivity(identifier: string, limitType: string) {
    await this.db.collection('securityLogs').add({
      type: 'RATE_LIMIT_ABUSE',
      identifier,
      limitType,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      action: 'BLOCKED'
    });
  }
}