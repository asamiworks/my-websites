'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(undefined);

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

export function DropdownMenuTrigger({ asChild, children, ...props }: DropdownMenuTriggerProps) {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuTrigger must be used within DropdownMenu');

  const { setOpen } = context;

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => setOpen(true),
      ...props,
    });
  }

  return (
    <button onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function DropdownMenuContent({
  children,
  className,
  align = 'start'
}: DropdownMenuContentProps) {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuContent must be used within DropdownMenu');

  const { open, setOpen } = context;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, setOpen]);

  if (!open) return null;

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  };

  return (
    <div
      ref={contentRef}
      className={cn(
        'absolute top-full z-50 mt-1 min-w-[8rem] rounded-md border border-gray-200 bg-white shadow-lg',
        'animate-in slide-in-from-top-2 duration-200',
        alignClasses[align],
        className
      )}
    >
      <div className="py-1">
        {children}
      </div>
    </div>
  );
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  disabled?: boolean;
}

export function DropdownMenuItem({
  children,
  className,
  disabled,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuItem must be used within DropdownMenu');

  const { setOpen } = context;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      onClick?.(event);
      setOpen(false);
    }
  };

  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center px-3 py-2 text-sm',
        'hover:bg-gray-100 focus:bg-gray-100',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps) {
  return <div className={cn('my-1 h-px bg-gray-200', className)} />;
}