"use client";

import React from 'react';
import styles from './MembershipSelection.module.css';

interface MembershipSelectionProps {
  isOpen: boolean;
  onSelectMember: () => void;
  onSelectGuest: () => void;
}

export default function MembershipSelection({
  isOpen,
  onSelectMember,
  onSelectGuest,
}: MembershipSelectionProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>チャットを開始</h2>
          <p className={styles.subtitle}>ご相談方法をお選びください</p>
        </div>

        <div className={styles.body}>
          <div className={styles.buttonContainer}>
            <button className={styles.optionButton} onClick={onSelectMember}>
              <h3 className={styles.optionTitle}>
                <span className={styles.optionIcon}>👤</span>
                会員としてログイン
              </h3>
              <p className={styles.optionDescription}>
                アカウントをお持ちの方はこちら
              </p>
              <ul className={styles.benefits}>
                <li>チャット履歴を180日間保存</li>
                <li>いつでも過去の相談を確認可能</li>
                <li>複数の相談を管理</li>
              </ul>
            </button>

            <button className={styles.optionButton} onClick={onSelectGuest}>
              <h3 className={styles.optionTitle}>
                <span className={styles.optionIcon}>💬</span>
                ゲストとして相談
              </h3>
              <p className={styles.optionDescription}>
                アカウント不要で今すぐ相談できます
              </p>
              <ul className={styles.benefits}>
                <li>すぐに相談を開始</li>
                <li>後からアカウント作成可能</li>
              </ul>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
