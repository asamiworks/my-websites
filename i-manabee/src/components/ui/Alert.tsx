'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  onDismiss?: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({
  variant = 'info',
  size = 'md',
  dismissible = false,
  onDismiss,
  title,
  className,
  children,
  ...props
}, ref) => {
  const baseStyles = 'rounded-lg border flex items-start transition-all duration-200';

  const variants = {
    success: 'bg-green-50 border-safe-green text-green-800 [&>svg]:text-safe-green',
    warning: 'bg-yellow-50 border-warning-yellow text-yellow-800 [&>svg]:text-warning-yellow',
    error: 'bg-red-50 border-error-red text-red-800 [&>svg]:text-error-red',
    info: 'bg-blue-50 border-info-blue text-blue-800 [&>svg]:text-info-blue'
  };

  const sizes = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg'
  };

  const icons = {
    success: (
      <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <div
      ref={ref}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      role="alert"
      {...props}
    >
      <div className="flex-shrink-0 mr-3">
        {icons[variant]}
      </div>

      <div className="flex-1">
        {title && (
          <h4 className="font-semibold mb-1">
            {title}
          </h4>
        )}
        <div>
          {children}
        </div>
      </div>

      {dismissible && onDismiss && (
        <div className="flex-shrink-0 ml-3">
          <button
            onClick={onDismiss}
            className="inline-flex text-current hover:opacity-75 focus:outline-none focus:opacity-75 transition-opacity"
            aria-label="閉じる"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
});

Alert.displayName = 'Alert';

// まなびー専用アラート
export const ManabeeAlert = React.forwardRef<HTMLDivElement, Omit<AlertProps, 'variant'>>(({
  className,
  children,
  title,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'bg-gradient-to-r from-bg-cream to-yellow-50',
        'border-2 border-honey-yellow rounded-xl',
        'p-4 flex items-start',
        'shadow-manabee-yellow',
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0 mr-3 text-honey-yellow animate-bee-flying">
        🐝
      </div>

      <div className="flex-1">
        {title && (
          <h4 className="font-semibold text-text-main mb-1">
            <span className="text-honey-yellow">まなびー先生より:</span> {title}
          </h4>
        )}
        <div className="text-text-main">
          {children}
        </div>
      </div>
    </div>
  );
});

ManabeeAlert.displayName = 'ManabeeAlert';

// 年齢グループ別アラート
export const JuniorAlert = React.forwardRef<HTMLDivElement, AlertProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <Alert
      ref={ref}
      className={clsx(
        'border-4 rounded-2xl text-lg font-medium',
        'shadow-lg transform hover:scale-105 transition-transform',
        className
      )}
      size="lg"
      {...props}
    >
      {children}
    </Alert>
  );
});

JuniorAlert.displayName = 'JuniorAlert';

export const MiddleAlert = React.forwardRef<HTMLDivElement, AlertProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <Alert
      ref={ref}
      className={clsx(
        'border-l-4 rounded-r-xl',
        'shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </Alert>
  );
});

MiddleAlert.displayName = 'MiddleAlert';

export const SeniorAlert = React.forwardRef<HTMLDivElement, AlertProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <Alert
      ref={ref}
      className={clsx(
        'rounded-lg shadow-sm',
        className
      )}
      size="sm"
      {...props}
    >
      {children}
    </Alert>
  );
});

SeniorAlert.displayName = 'SeniorAlert';

// 安全性アラート
export interface SafetyAlertProps extends Omit<AlertProps, 'variant'> {
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const SafetyAlert = React.forwardRef<HTMLDivElement, SafetyAlertProps>(({
  severity,
  className,
  children,
  ...props
}, ref) => {
  const severityConfig = {
    low: { variant: 'info' as const, icon: 'ℹ️', label: '注意' },
    medium: { variant: 'warning' as const, icon: '⚠️', label: '警告' },
    high: { variant: 'error' as const, icon: '⛔', label: '重要' },
    critical: { variant: 'error' as const, icon: '🚨', label: '緊急' }
  };

  const config = severityConfig[severity];

  return (
    <Alert
      ref={ref}
      variant={config.variant}
      className={clsx(
        'font-semibold',
        severity === 'critical' && 'animate-pulse border-4',
        className
      )}
      title={`${config.icon} ${config.label}`}
      {...props}
    >
      {children}
    </Alert>
  );
});

SafetyAlert.displayName = 'SafetyAlert';