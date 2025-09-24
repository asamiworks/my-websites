'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  size = 'md',
  hover = false,
  className,
  children,
  ...props
}, ref) => {
  const baseStyles = 'card-base bg-white rounded-lg transition-all duration-200';

  const variants = {
    default: 'border border-gray-200 shadow-manabee-sm',
    elevated: 'border-0 shadow-manabee-lg',
    outline: 'border-2 border-honey-yellow shadow-none',
    filled: 'border-0 bg-bg-cream shadow-manabee-sm'
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverStyles = hover ? 'hover:shadow-manabee-md hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div
      ref={ref}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Header Component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({
  title,
  description,
  action,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'flex items-start justify-between space-y-2 pb-4 border-b border-gray-200',
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-lg font-semibold text-text-main truncate">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-text-sub mt-1">
            {description}
          </p>
        )}
        {children}
      </div>
      {action && (
        <div className="flex-shrink-0 ml-4">
          {action}
        </div>
      )}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

// Card Body Component
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

// Card Footer Component
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'pt-4 border-t border-gray-200 flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

// Age-specific Card variants
export const JuniorCard = React.forwardRef<HTMLDivElement, CardProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <Card
      ref={ref}
      variant="elevated"
      className={clsx(
        'bg-gradient-to-br from-white to-bg-cream',
        'border-2 border-honey-yellow border-opacity-20',
        'shadow-manabee-yellow rounded-2xl',
        'transform hover:scale-105 transition-all duration-300',
        'sparkle-effect',
        className
      )}
      {...props}
    >
      <div className="relative">
        {children}
        <div className="absolute top-2 right-2 text-honey-yellow animate-bee-flying">
          🐝
        </div>
      </div>
    </Card>
  );
});

JuniorCard.displayName = 'JuniorCard';

export const MiddleCard = React.forwardRef<HTMLDivElement, CardProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <Card
      ref={ref}
      variant="default"
      className={clsx(
        'border-l-4 border-l-kids-blue',
        'shadow-manabee-blue rounded-xl',
        'hover:shadow-lg transition-all duration-250',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
});

MiddleCard.displayName = 'MiddleCard';

export const SeniorCard = React.forwardRef<HTMLDivElement, CardProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <Card
      ref={ref}
      variant="default"
      className={clsx(
        'border border-gray-300',
        'shadow-sm rounded-lg',
        'hover:shadow-md hover:border-friends-purple transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
});

SeniorCard.displayName = 'SeniorCard';

// Plan-specific Cards
export const PlanCard = React.forwardRef<HTMLDivElement, CardProps & {
  plan: 'free' | 'kids' | 'friends' | 'premium';
  popular?: boolean;
}>(({
  plan,
  popular = false,
  className,
  children,
  ...props
}, ref) => {
  const planColors = {
    free: 'border-free-gray bg-gray-50',
    kids: 'border-kids-blue bg-blue-50',
    friends: 'border-friends-purple bg-purple-50',
    premium: 'border-premium-gold bg-yellow-50'
  };

  return (
    <Card
      ref={ref}
      variant="outline"
      className={clsx(
        'relative',
        planColors[plan],
        popular && 'ring-2 ring-honey-yellow ring-opacity-50',
        className
      )}
      {...props}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-honey-yellow text-white px-3 py-1 rounded-full text-xs font-semibold">
            人気プラン ⭐
          </div>
        </div>
      )}
      {children}
    </Card>
  );
});

PlanCard.displayName = 'PlanCard';