// React エラーバウンダリ コンポーネント
'use client';

import React, { Component, ReactNode } from 'react';
import { Card, Button, Alert } from '@/components/ui';
import { ErrorBoundaryHandler } from '@/lib/error/globalErrorHandler';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId?: string;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  isolate?: boolean; // エラーを分離するかどうか
  ageGroup?: 'junior' | 'middle' | 'senior';
}

interface ErrorFallbackProps {
  error: Error | null;
  errorId?: string;
  retry: () => void;
  retryCount: number;
  ageGroup: 'junior' | 'middle' | 'senior';
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // 次のレンダーでフォールバックUIを表示するための状態更新
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // エラー情報を更新
    this.setState({
      error,
      errorInfo,
      errorId: this.generateErrorId()
    });

    // グローバルエラーハンドラーに通知
    ErrorBoundaryHandler.logError(error, errorInfo, {
      userId: undefined, // TODO: 実際のuserIdを取得
      route: window.location.pathname,
      userAgent: navigator.userAgent
    });

    // カスタムエラーハンドラーがあれば実行
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 自動復旧試行（最大3回まで）
    if (this.state.retryCount < 3) {
      const retryTimeout = setTimeout(() => {
        this.handleRetry();
      }, this.getRetryDelay(this.state.retryCount));

      this.retryTimeouts.push(retryTimeout);
    }
  }

  componentWillUnmount() {
    // タイムアウトのクリーンアップ
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private generateErrorId(): string {
    return `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getRetryDelay(retryCount: number): number {
    // 指数バックオフ: 2秒, 4秒, 8秒
    return Math.min(2000 * Math.pow(2, retryCount), 8000);
  }

  private handleRetry = (): void => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  private handleManualRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: undefined,
      retryCount: 0
    });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          errorId={this.state.errorId}
          retry={this.handleManualRetry}
          retryCount={this.state.retryCount}
          ageGroup={this.props.ageGroup || 'middle'}
        />
      );
    }

    return this.props.children;
  }
}

// デフォルトのエラーフォールバックコンポーネント
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorId,
  retry,
  retryCount,
  ageGroup
}) => {
  const isJunior = ageGroup === 'junior';

  const getErrorMessage = () => {
    if (isJunior) {
      return 'あれれ？なにか変なことが起きちゃったみたい🐝';
    }
    return 'エラーが発生しました';
  };

  const getErrorDescription = () => {
    if (isJunior) {
      return 'まなびー先生がちょっと困っているよ。「もう一度試す」ボタンを押してみてね！';
    }
    return 'アプリケーションでエラーが発生しました。ページを再読み込みするか、「もう一度試す」ボタンをクリックしてください。';
  };

  const getRetryButtonText = () => {
    if (retryCount > 0) {
      return isJunior
        ? `もういちど試す (${retryCount + 1}回目)`
        : `もう一度試す (${retryCount + 1}回目)`;
    }
    return isJunior ? 'もういちど試す' : 'もう一度試す';
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 text-center">
        {/* エラーアイコン */}
        <div className="text-6xl mb-6">
          {isJunior ? '🐝' : '⚠️'}
        </div>

        {/* エラーメッセージ */}
        <h1 className="text-2xl font-bold text-text-main mb-4">
          {getErrorMessage()}
        </h1>

        <p className="text-text-sub mb-6">
          {getErrorDescription()}
        </p>

        {/* エラーID（サポート用） */}
        {errorId && !isJunior && (
          <div className="bg-gray-100 rounded-lg p-3 mb-6">
            <p className="text-xs text-text-sub">
              エラーID: <span className="font-mono">{errorId}</span>
            </p>
            <p className="text-xs text-text-sub mt-1">
              サポートにお問い合わせの際は、このIDをお伝えください
            </p>
          </div>
        )}

        {/* アクションボタン */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={retry}
            className={`
              ${isJunior
                ? 'bg-gradient-to-r from-kids-blue to-blue-500'
                : 'bg-gradient-to-r from-honey-yellow to-warning-yellow'
              }
            `}
          >
            {getRetryButtonText()}
          </Button>

          <Button
            variant="outline"
            fullWidth
            onClick={handleReload}
          >
            {isJunior ? 'ページをさいどくみ' : 'ページを再読み込み'}
          </Button>

          <Button
            variant="ghost"
            fullWidth
            onClick={handleGoHome}
            className="text-text-sub"
          >
            {isJunior ? 'ホームにもどる' : 'ホームに戻る'}
          </Button>
        </div>

        {/* 詳細エラー情報（開発環境のみ） */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-text-sub mb-2">
              開発者情報 (クリックして展開)
            </summary>
            <div className="bg-red-50 border border-red-200 rounded p-3 text-xs">
              <div className="font-mono text-red-700 whitespace-pre-wrap break-all">
                {error.name}: {error.message}
                {error.stack && (
                  <div className="mt-2 text-red-600">
                    {error.stack}
                  </div>
                )}
              </div>
            </div>
          </details>
        )}

        {/* 困った時のヘルプ */}
        {isJunior && (
          <div className="mt-6 p-3 bg-honey-yellow bg-opacity-10 rounded-lg">
            <p className="text-xs text-text-main">
              💡 うまくいかない時は、おうちの大人の人に手伝ってもらってね
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

// 特定コンポーネント用のエラーバウンダリ
interface ComponentErrorBoundaryProps extends ErrorBoundaryProps {
  componentName: string;
  showMinimalError?: boolean;
}

export const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = ({
  children,
  componentName,
  showMinimalError = false,
  ageGroup = 'middle',
  ...props
}) => {
  const MinimalFallback: React.FC<ErrorFallbackProps> = () => (
    <div className="p-4 border-2 border-dashed border-red-200 rounded-lg text-center">
      <div className="text-2xl mb-2">⚠️</div>
      <p className="text-sm text-text-sub">
        {ageGroup === 'junior'
          ? 'この部分でエラーが起きているよ'
          : `${componentName} でエラーが発生しました`
        }
      </p>
      {!showMinimalError && (
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-xs text-honey-yellow hover:underline"
        >
          ページを再読み込み
        </button>
      )}
    </div>
  );

  return (
    <ErrorBoundary
      {...props}
      fallback={showMinimalError ? MinimalFallback : undefined}
      ageGroup={ageGroup}
    >
      {children}
    </ErrorBoundary>
  );
};

// チャット専用エラーバウンダリ
export const ChatErrorBoundary: React.FC<Omit<ErrorBoundaryProps, 'fallback'>> = ({
  children,
  ageGroup = 'middle',
  ...props
}) => {
  const ChatFallback: React.FC<ErrorFallbackProps> = ({ retry }) => (
    <div className="flex items-center justify-center p-8">
      <Card className="p-6 text-center max-w-sm">
        <div className="text-4xl mb-4">🐝</div>
        <h3 className="font-bold text-text-main mb-2">
          {ageGroup === 'junior'
            ? 'チャットでエラーが起きちゃった'
            : 'チャットでエラーが発生しました'
          }
        </h3>
        <p className="text-sm text-text-sub mb-4">
          {ageGroup === 'junior'
            ? 'もう一度話しかけてみてね'
            : '再度お試しください'
          }
        </p>
        <Button
          variant="primary"
          onClick={retry}
          size="sm"
          className="bg-gradient-to-r from-honey-yellow to-warning-yellow"
        >
          {ageGroup === 'junior' ? 'もういちど' : 'もう一度試す'}
        </Button>
      </Card>
    </div>
  );

  return (
    <ErrorBoundary {...props} fallback={ChatFallback} ageGroup={ageGroup}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;