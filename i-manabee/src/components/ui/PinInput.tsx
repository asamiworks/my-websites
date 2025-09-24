import React, { useState, useRef, useEffect } from 'react';

export interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export const PinInput: React.FC<PinInputProps> = ({
  value,
  onChange,
  length = 4,
  disabled = false,
  error = false,
  placeholder = '•',
  autoFocus = false,
  className = ''
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 値を配列に変換
  const values = value.split('').concat(Array(length - value.length).fill(''));

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
      setActiveIndex(index);
    }
  };

  const handleInputChange = (index: number, inputValue: string) => {
    if (disabled) return;

    // 数字以外を除去
    const numericValue = inputValue.replace(/[^0-9]/g, '');

    if (numericValue.length > 1) {
      // 複数文字が入力された場合（ペーストなど）
      const chars = numericValue.slice(0, length).split('');
      const newValues = [...values];

      chars.forEach((char, charIndex) => {
        if (index + charIndex < length) {
          newValues[index + charIndex] = char;
        }
      });

      const newValue = newValues.join('').slice(0, length);
      onChange(newValue);

      // 次の空のフィールドまたは最後のフィールドにフォーカス
      const nextIndex = Math.min(index + chars.length, length - 1);
      setTimeout(() => focusInput(nextIndex), 0);
    } else if (numericValue.length === 1) {
      // 単一文字の入力
      const newValues = [...values];
      newValues[index] = numericValue;
      const newValue = newValues.join('').replace(/undefined/g, '');
      onChange(newValue);

      // 次のフィールドにフォーカス
      if (index < length - 1) {
        setTimeout(() => focusInput(index + 1), 0);
      }
    } else {
      // 削除
      const newValues = [...values];
      newValues[index] = '';
      const newValue = newValues.join('').replace(/undefined/g, '');
      onChange(newValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Backspace':
        e.preventDefault();
        if (values[index]) {
          // 現在のフィールドに値がある場合は削除
          handleInputChange(index, '');
        } else if (index > 0) {
          // 現在のフィールドが空で、前のフィールドがある場合は前のフィールドに移動して削除
          focusInput(index - 1);
          handleInputChange(index - 1, '');
        }
        break;

      case 'Delete':
        e.preventDefault();
        handleInputChange(index, '');
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) {
          focusInput(index - 1);
        }
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (index < length - 1) {
          focusInput(index + 1);
        }
        break;

      case 'Home':
        e.preventDefault();
        focusInput(0);
        break;

      case 'End':
        e.preventDefault();
        focusInput(length - 1);
        break;

      default:
        // 数字以外の文字を無効にする
        if (!/^[0-9]$/.test(e.key) && !['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
          e.preventDefault();
        }
        break;
    }
  };

  const handleFocus = (index: number) => {
    setActiveIndex(index);
  };

  const handleBlur = () => {
    setActiveIndex(-1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const numericData = pasteData.replace(/[^0-9]/g, '').slice(0, length);
    onChange(numericData);

    // 最後の入力フィールドまたは次の空フィールドにフォーカス
    const nextIndex = Math.min(numericData.length, length - 1);
    setTimeout(() => focusInput(nextIndex), 0);
  };

  return (
    <div className={`flex space-x-3 ${className}`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={values[index] || ''}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          onPaste={handlePaste}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-12 h-12 text-center text-xl font-bold rounded-lg border-2
            transition-all duration-200
            ${error
              ? 'border-error-red focus:border-error-red focus:ring-2 focus:ring-error-red focus:ring-opacity-20'
              : activeIndex === index
                ? 'border-honey-yellow focus:border-honey-yellow focus:ring-2 focus:ring-honey-yellow focus:ring-opacity-20'
                : 'border-gray-300 hover:border-gray-400 focus:border-honey-yellow focus:ring-2 focus:ring-honey-yellow focus:ring-opacity-20'
            }
            ${disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-text-main'
            }
            focus:outline-none
          `}
          aria-label={`PIN digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default PinInput;