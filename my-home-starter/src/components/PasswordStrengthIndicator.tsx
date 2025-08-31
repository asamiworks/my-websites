// src/app/components/PasswordStrengthIndicator.tsx

import React, { useMemo } from 'react';
import styles from './PasswordStrengthIndicator.module.css';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  feedback: string[];
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const checkPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (!password) {
      return {
        score: 0,
        label: '',
        color: '',
        feedback: []
      };
    }

    // 長さチェック
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('8文字以上にしてください');
    }

    if (password.length >= 12) {
      score += 1;
    }

    // 大文字チェック
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('大文字を含めてください');
    }

    // 小文字チェック
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('小文字を含めてください');
    }

    // 数字チェック
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('数字を含めてください');
    }

    // 特殊文字チェック
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('特殊文字を含めることを推奨します');
    }

    // よくあるパスワードチェック
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score = Math.max(1, score - 2);
      feedback.push('より複雑なパスワードを使用してください');
    }

    // スコアに基づいてラベルと色を決定
    if (score <= 2) {
      return { score, label: '弱い', color: '#ff4444', feedback };
    } else if (score <= 4) {
      return { score, label: '普通', color: '#ffaa00', feedback: feedback.slice(0, 2) };
    } else {
      return { score, label: '強い', color: '#00aa00', feedback: [] };
    }
  };

  const strength = useMemo(() => checkPasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <div className={styles.container}>
      <div className={styles.strengthBar}>
        <div 
          className={styles.strengthFill}
          style={{
            width: `${(strength.score / 6) * 100}%`,
            backgroundColor: strength.color
          }}
        />
      </div>
      {strength.label && (
        <div className={styles.strengthLabel} style={{ color: strength.color }}>
          パスワード強度: {strength.label}
        </div>
      )}
      {strength.feedback.length > 0 && (
        <ul className={styles.feedback}>
          {strength.feedback.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};