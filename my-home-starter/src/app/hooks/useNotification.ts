// src/hooks/useNotification.ts

import { useState, useEffect, useCallback } from 'react';
import { playNotificationSound as playSound } from '../../utils/notificationSound';

interface NotificationSettings {
  soundEnabled: boolean;
  emailEnabled: boolean;
}

export const useNotification = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    soundEnabled: false, // デフォルトはOFF
    emailEnabled: true,  // デフォルトはON
  });

  // ローカルストレージから設定を読み込み
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse notification settings:', error);
      }
    }
  }, []);

  // 設定を保存
  const saveSettings = useCallback((newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  }, []);

  // 音声通知を再生
  const playNotificationSound = useCallback(() => {
    if (settings.soundEnabled) {
      playSound();
    }
  }, [settings.soundEnabled]);

  // 音声通知のON/OFF切り替え
  const toggleSoundNotification = useCallback(() => {
    const newSettings = {
      ...settings,
      soundEnabled: !settings.soundEnabled,
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  // メール通知のON/OFF切り替え
  const toggleEmailNotification = useCallback(() => {
    const newSettings = {
      ...settings,
      emailEnabled: !settings.emailEnabled,
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  return {
    isNotificationEnabled: settings.soundEnabled,
    isEmailEnabled: settings.emailEnabled,
    playNotificationSound,
    toggleSoundNotification,
    toggleEmailNotification,
    notificationSettings: settings,
  };
};