'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...props
}, ref) => {
  const baseStyles = 'btn-base inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-manabee-primary text-white hover:bg-opacity-90 focus:ring-honey-yellow shadow-manabee-sm hover:shadow-manabee-md',
    secondary: 'bg-manabee-heart text-white hover:bg-opacity-90 focus:ring-heart-pink shadow-manabee-sm hover:shadow-manabee-md',
    outline: 'border-2 border-manabee-primary text-manabee-primary hover:bg-manabee-primary hover:text-white focus:ring-honey-yellow',
    ghost: 'text-manabee-primary hover:bg-manabee-primary hover:bg-opacity-10 focus:ring-honey-yellow',
    danger: 'bg-error-red text-white hover:bg-opacity-90 focus:ring-red-300 shadow-manabee-sm hover:shadow-manabee-md'
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm rounded-md gap-1',
    md: 'h-10 px-4 text-base rounded-lg gap-2',
    lg: 'h-12 px-6 text-lg rounded-xl gap-3'
  };

  return (
    <button
      ref={ref}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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
          読み込み中...
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

// 特殊用途のボタンコンポーネント
export const ManabeeButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      className={clsx(
        'bg-gradient-to-r from-honey-yellow to-warning-yellow',
        'text-white font-semibold',
        'shadow-manabee-yellow hover:shadow-lg',
        'transform hover:scale-105 active:scale-95',
        'transition-all duration-200',
        className
      )}
      {...props}
    >
      <span className="mr-1">🐝</span>
      {children}
    </Button>
  );
});

ManabeeButton.displayName = 'ManabeeButton';

// Age Group Specific Buttons
export const JuniorButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      size="lg"
      className={clsx(
        'bg-gradient-to-r from-honey-yellow to-warning-yellow',
        'text-white font-bold text-lg',
        'rounded-2xl shadow-lg hover:shadow-xl',
        'transform hover:scale-105 hover:-translate-y-1',
        'animate-pulse-slow',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

JuniorButton.displayName = 'JuniorButton';

export const MiddleButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      className={clsx(
        'bg-gradient-to-r from-kids-blue to-info-blue',
        'text-white font-semibold',
        'rounded-xl shadow-md hover:shadow-lg',
        'transform hover:scale-102',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

MiddleButton.displayName = 'MiddleButton';

export const SeniorButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      className={clsx(
        'bg-gradient-to-r from-friends-purple to-purple-700',
        'text-white font-medium',
        'rounded-lg shadow-sm hover:shadow-md',
        'transform hover:scale-101',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

SeniorButton.displayName = 'SeniorButton';