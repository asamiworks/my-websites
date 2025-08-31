// src/app/my-page/components/ChatWrapper.tsx

import React, { memo } from 'react';
import Chat from '../chat/Chat';
import styles from '../MyPage.module.css';

interface ChatWrapperProps {
  isChatOpen: boolean;
  isChatAllowed: boolean;
  openTermsModal: () => void;
  allowChat: () => void;
  onClose: () => void;
}

/**
 * チャットコンポーネントのラッパー
 * メモ化により、チャットの開閉状態が変わらない限り再レンダリングしない
 */
export const ChatWrapper = memo(({ 
  isChatOpen, 
  isChatAllowed, 
  openTermsModal, 
  allowChat, 
  onClose 
}: ChatWrapperProps) => {
  if (!isChatOpen) {
    return null;
  }

  return (
    <div className={`${styles.chatPopup} ${styles.fullScreen}`}>
      <Chat
        isChatAllowed={isChatAllowed}
        openTermsModal={openTermsModal}
        allowChat={allowChat}
        onClose={onClose}
      />
    </div>
  );
});

ChatWrapper.displayName = 'ChatWrapper';