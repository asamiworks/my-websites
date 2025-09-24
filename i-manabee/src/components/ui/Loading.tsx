'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bee';
  text?: string;
  overlay?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  overlay = false,
  className
}) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Spinner Component
  const Spinner = () => (
    <svg
      className={clsx(sizes[size], 'animate-spin text-honey-yellow')}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Dots Component
  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            'bg-honey-yellow rounded-full animate-pulse',
            size === 'xs' && 'w-1 h-1',
            size === 'sm' && 'w-1.5 h-1.5',
            size === 'md' && 'w-2 h-2',
            size === 'lg' && 'w-3 h-3',
            size === 'xl' && 'w-4 h-4'
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  // Pulse Component
  const Pulse = () => (
    <div
      className={clsx(
        'bg-honey-yellow rounded-full animate-pulse',
        sizes[size]
      )}
    />
  );

  // Bee Component - まなびー専用
  const Bee = () => (
    <div className={clsx('text-honey-yellow animate-bee-flying', textSizes[size])}>
      🐝
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <Dots />;
      case 'pulse':
        return <Pulse />;
      case 'bee':
        return <Bee />;
      default:
        return <Spinner />;
    }
  };

  const content = (
    <div className={clsx('flex flex-col items-center justify-center', className)}>
      {renderLoader()}
      {text && (
        <p className={clsx('mt-3 text-text-sub text-center', textSizes[size])}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 bg-white bg-opacity-90 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

// Full Page Loading
export const FullPageLoading: React.FC<{
  text?: string;
  variant?: LoadingProps['variant'];
}> = ({
  text = 'まなびー先生が準備中です...',
  variant = 'bee'
}) => {
  return (
    <div className="min-h-screen bg-bg-cream flex items-center justify-center">
      <div className="text-center">
        <Loading
          size="xl"
          variant={variant}
          text={text}
          className="mb-8"
        />
      </div>
    </div>
  );
};

// Card Loading Skeleton
export const CardSkeleton: React.FC<{
  count?: number;
  className?: string;
}> = ({
  count = 1,
  className
}) => {
  return (
    <div className={clsx('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-300 rounded-full w-12 h-12"></div>
            <div className="flex-1 space-y-2">
              <div className="bg-gray-300 h-4 rounded w-3/4"></div>
              <div className="bg-gray-300 h-3 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="bg-gray-300 h-3 rounded w-full"></div>
            <div className="bg-gray-300 h-3 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Message Loading (チャット用)
export const MessageLoading: React.FC<{
  isBot?: boolean;
}> = ({ isBot = true }) => {
  return (
    <div className={clsx(
      'flex items-start space-x-3 animate-fade-in',
      isBot ? 'justify-start' : 'justify-end'
    )}>
      {isBot && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-honey-yellow rounded-full flex items-center justify-center text-white animate-bee-flying">
            🐝
          </div>
        </div>
      )}

      <div className={clsx(
        'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
        isBot ? 'bg-gray-100' : 'bg-honey-yellow text-white'
      )}>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={clsx(
                  'w-2 h-2 rounded-full animate-bounce',
                  isBot ? 'bg-gray-400' : 'bg-white'
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
          <span className={clsx(
            'text-sm ml-2',
            isBot ? 'text-gray-600' : 'text-white'
          )}>
            {isBot ? 'まなびー先生が考えています...' : '送信中...'}
          </span>
        </div>
      </div>

      {!isBot && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

// Age-specific Loading variants
export const JuniorLoading: React.FC<Omit<LoadingProps, 'variant'>> = ({
  text = 'ちょっと待ってね！🌟',
  ...props
}) => {
  return (
    <Loading
      {...props}
      variant="bee"
      text={text}
      className="p-8 bg-gradient-to-br from-bg-cream to-yellow-50 rounded-3xl shadow-lg"
    />
  );
};

export const MiddleLoading: React.FC<Omit<LoadingProps, 'variant'>> = ({
  text = '読み込み中...',
  ...props
}) => {
  return (
    <Loading
      {...props}
      variant="spinner"
      text={text}
      className="p-6 bg-white rounded-xl shadow-md"
    />
  );
};

export const SeniorLoading: React.FC<Omit<LoadingProps, 'variant'>> = ({
  text = 'Loading...',
  ...props
}) => {
  return (
    <Loading
      {...props}
      variant="dots"
      text={text}
      className="p-4 bg-white rounded-lg shadow-sm"
    />
  );
};