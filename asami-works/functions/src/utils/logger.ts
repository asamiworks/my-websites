import * as functions from 'firebase-functions';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY'
}

export interface LogContext {
  userId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  duration?: number;
  error?: any;
  metadata?: Record<string, any>;
}

export class StructuredLogger {
  private static instance: StructuredLogger;
  
  static getInstance(): StructuredLogger {
    if (!this.instance) {
      this.instance = new StructuredLogger();
    }
    return this.instance;
  }
  
  log(level: LogLevel, message: string, context?: LogContext) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
      // 環境情報
      environment: process.env.FUNCTIONS_EMULATOR ? 'emulator' : 'production',
      region: process.env.FUNCTION_REGION || 'unknown'
    };
    
    // セキュリティ関連のログは別途保存
    if (level === LogLevel.SECURITY) {
      this.saveSecurityLog(logEntry);
    }
    
    // Firebase Functions のログレベルに応じて出力
    switch (level) {
      case LogLevel.DEBUG:
        functions.logger.debug(message, logEntry);
        break;
      case LogLevel.INFO:
        functions.logger.info(message, logEntry);
        break;
      case LogLevel.WARN:
        functions.logger.warn(message, logEntry);
        break;
      case LogLevel.ERROR:
      case LogLevel.SECURITY:
        functions.logger.error(message, logEntry);
        break;
    }
  }
  
  private async saveSecurityLog(logEntry: any) {
    try {
      const admin = await import('firebase-admin');
      await admin.firestore().collection('securityLogs').add({
        ...logEntry,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      functions.logger.error('Failed to save security log', error);
    }
  }
  
  // 便利なメソッド
  info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, context);
  }
  
  warn(message: string, context?: LogContext) {
    this.log(LogLevel.WARN, message, context);
  }
  
  error(message: string, context?: LogContext) {
    this.log(LogLevel.ERROR, message, context);
  }
  
  security(message: string, context?: LogContext) {
    this.log(LogLevel.SECURITY, message, context);
  }
}

export const logger = StructuredLogger.getInstance();