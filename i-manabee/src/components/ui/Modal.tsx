'use client';

import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  className
}) => {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, closeOnEscape, onClose]);

  // モーダルが開いているときはボディのスクロールを無効にする
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-none mx-4'
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity animate-fade-in"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Center content */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal Content */}
        <div
          className={clsx(
            'relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 animate-slide-in-right',
            sizes[size],
            className
          )}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              {title && (
                <h3 className="text-lg font-semibold text-text-main" id="modal-title">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-4 bg-transparent hover:bg-gray-100 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-honey-yellow"
                  aria-label="閉じる"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Header Component
export interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  className
}) => {
  return (
    <div className={clsx('pb-4 border-b border-gray-200', className)}>
      {children}
    </div>
  );
};

// Modal Body Component
export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className
}) => {
  return (
    <div className={clsx('py-4', className)}>
      {children}
    </div>
  );
};

// Modal Footer Component
export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className
}) => {
  return (
    <div className={clsx('pt-4 border-t border-gray-200 flex items-center justify-end space-x-3', className)}>
      {children}
    </div>
  );
};

// Confirmation Modal
export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  variant = 'default',
  loading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
      showCloseButton={!loading}
    >
      <ModalBody>
        <p className="text-text-main">
          {message}
        </p>
      </ModalBody>

      <ModalFooter>
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// Age-specific Modals
export const JuniorModal: React.FC<ModalProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Modal
      {...props}
      className={clsx(
        'bg-gradient-to-br from-white to-bg-cream',
        'border-4 border-honey-yellow rounded-3xl',
        className
      )}
    >
      <div className="relative">
        {children}
        <div className="absolute top-2 right-2 text-2xl animate-bee-flying">
          🐝
        </div>
      </div>
    </Modal>
  );
};

export const MiddleModal: React.FC<ModalProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Modal
      {...props}
      className={clsx(
        'border-t-4 border-t-kids-blue rounded-xl',
        className
      )}
    >
      {children}
    </Modal>
  );
};

export const SeniorModal: React.FC<ModalProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Modal
      {...props}
      className={clsx(
        'border border-gray-300 rounded-lg',
        className
      )}
    >
      {children}
    </Modal>
  );
};

// Alert Modal
export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  buttonText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'OK'
}) => {
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };

  const colors = {
    success: 'text-safe-green',
    warning: 'text-warning-yellow',
    error: 'text-error-red',
    info: 'text-info-blue'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
    >
      <div className="text-center">
        <div className={clsx('text-6xl mb-4', colors[type])}>
          {icons[type]}
        </div>
        <h3 className="text-lg font-semibold text-text-main mb-2">
          {title}
        </h3>
        <p className="text-text-sub mb-6">
          {message}
        </p>
        <Button onClick={onClose} fullWidth>
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};