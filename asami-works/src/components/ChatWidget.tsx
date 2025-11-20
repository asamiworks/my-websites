"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import styles from "./ChatWidget.module.css";
import MembershipSelection from "./auth/MembershipSelection";
import AuthModal from "./auth/AuthModal";
import ChatHistory from "./auth/ChatHistory";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface QuickReply {
  text: string;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const isMyPage = pathname?.startsWith('/mypage');
  const isClientPage = pathname?.startsWith('/client');
  const shouldHideWidget = isClientPage; // /client/* ページのみ非表示
  const { user } = useAuth();
  const { currentChat, createNewChat, loadChat, saveMessage, saveQuickReplies, saveFormStates } = useChat();

  const [isOpen, setIsOpen] = useState(false);
  const [showMembershipSelection, setShowMembershipSelection] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [googleOnlyMode, setGoogleOnlyMode] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "AIチャットサービスへようこそ。本日はどのようなことでお困りですか？"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "新規のお客様が増えない",
    "ホームページを改善したい",
    "業務が煩雑で時間が足りない",
    "競合に負けている気がする"
  ]);
  const [selectedReplies, setSelectedReplies] = useState<string[]>([]);
  const [collectBusinessInfo, setCollectBusinessInfo] = useState<string | null>(null);
  const [businessInfoData, setBusinessInfoData] = useState<Record<string, string>>({});
  const [collectInfo, setCollectInfo] = useState(false);
  const [contactInfoData, setContactInfoData] = useState<Record<string, string>>({});
  const [inquiryComplete, setInquiryComplete] = useState(false);
  const [previousChatId, setPreviousChatId] = useState<string | null>(null);
  const [typingMessage, setTypingMessage] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // チャット履歴から復元
  useEffect(() => {
    const restoreChatId = localStorage.getItem('restoreChatId');

    if (restoreChatId && user) {
      const restoreChat = async () => {
        try {
          // ChatContextを使ってチャットを読み込む
          await loadChat(restoreChatId);

          // チャットウィジェットを開く
          setIsOpen(true);

          // localStorageをクリア
          localStorage.removeItem('restoreChatId');
        } catch (error) {
          console.error('チャット復元エラー:', error);
        }
      };

      restoreChat();
    }
  }, [user, loadChat]);

  // カスタムイベントでチャットウィジェットを開く
  useEffect(() => {
    const handleOpenWidget = () => {
      setIsOpen(true);
    };

    window.addEventListener('openChatWidget', handleOpenWidget);

    return () => {
      window.removeEventListener('openChatWidget', handleOpenWidget);
    };
  }, []);

  // Simple markdown to HTML converter
  const formatMessage = (text: string) => {
    // Convert **bold** to <strong>bold</strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    return formatted;
  };

  // 業種別のフォームフィールドを取得
  const getBusinessInfoFields = (industry: string) => {
    switch (industry) {
      case '飲食店':
      case '飲食店・カフェ':
        return [
          { key: '目標', label: '目標（月の新規来店数を増やしたい場合）', placeholder: '例: 月10件の新規来店を増やしたい', unit: '', type: 'textarea' },
          { key: '席数', label: '席数', placeholder: '例: 20', unit: '席', type: 'text' },
          { key: '1日の来客数', label: '1日の来客数', placeholder: '例: 30', unit: '名', type: 'text' },
          { key: '客単価', label: '客単価', placeholder: '例: 1500', unit: '円', type: 'text' },
          { key: '定休日', label: '定休日（週何日）', placeholder: '例: 1', unit: '日', type: 'text' },
        ];
      case '建築・不動産':
        return [
          { key: '目標', label: '目標（月の成約件数を増やしたい場合）', placeholder: '例: 月1件の成約を増やしたい', unit: '', type: 'textarea' },
          { key: '1件あたりの利益額', label: '1件あたりの平均利益額', placeholder: '例: 400', unit: '万円', type: 'text' },
          { key: '月間成約件数', label: '現在の月間成約件数', placeholder: '例: 2', unit: '件', type: 'text' },
        ];
      case '美容室・サロン':
        return [
          { key: '目標', label: '目標（売上アップや新規顧客獲得など）', placeholder: '例: 月の新規顧客を15名増やしたい', unit: '', type: 'textarea' },
          { key: 'スタッフ数', label: 'スタッフ数', placeholder: '例: 3', unit: '名', type: 'text' },
          { key: '稼働率', label: '現在の稼働率', placeholder: '例: 70', unit: '%', type: 'text' },
        ];
      case '整体・治療院':
        return [
          { key: '目標', label: '目標（新規患者数や売上など）', placeholder: '例: 月20名の新規患者を獲得したい', unit: '', type: 'textarea' },
          { key: 'スタッフ数', label: 'スタッフ数', placeholder: '例: 2', unit: '名', type: 'text' },
          { key: '1日の施術可能数', label: '1日の施術可能数', placeholder: '例: 10', unit: '件', type: 'text' },
          { key: '施術単価', label: '平均施術単価', placeholder: '例: 5000', unit: '円', type: 'text' },
        ];
      case '士業（税理士・行政書士など）':
      case '士業':
        return [
          { key: '目標', label: '目標（問い合わせ数や成約件数など）', placeholder: '例: 月の問い合わせを10件増やしたい', unit: '', type: 'textarea' },
          { key: '月間問い合わせ数', label: '現在の月間問い合わせ数', placeholder: '例: 5', unit: '件', type: 'text' },
          { key: '成約率', label: '成約率', placeholder: '例: 30', unit: '%', type: 'text' },
        ];
      default:
        return [
          { key: '目標', label: '目標（売上や問い合わせ数など）', placeholder: '例: 月の売上を50万円増やしたい', unit: '', type: 'textarea' },
          { key: '月商', label: '現在の月商', placeholder: '例: 300', unit: '万円', type: 'text' },
          { key: 'Web投資経験', label: 'これまでのWeb投資経験', placeholder: '例: なし、または月3万円程度', unit: '', type: 'text' },
        ];
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, typingMessage]);

  // チャット開閉時のロジック
  useEffect(() => {
    if (isOpen && !user && !isGuestMode) {
      // 未ログイン & 非ゲストモードの場合、会員選択を表示
      setShowMembershipSelection(true);
    }
  }, [isOpen, user, isGuestMode]);

  // currentChatが変更されたらメッセージと選択肢を同期
  useEffect(() => {
    if (user && currentChat) {
      // チャットIDが実際に変更された時だけ状態を復元
      if (previousChatId !== currentChat.id) {
        // フォーム関連の状態を復元
        setSelectedReplies([]);
        setBusinessInfoData({});
        setContactInfoData({});
        setCollectBusinessInfo(currentChat.collectBusinessInfo || null);
        setCollectInfo(currentChat.collectInfo || false);
        setInquiryComplete(currentChat.inquiryComplete || false);
        setPreviousChatId(currentChat.id);

        // メッセージと選択肢を復元
        if (currentChat.messages && currentChat.messages.length > 0) {
          // 既存のチャット履歴を復元
          const chatMessages: Message[] = currentChat.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }));
          setMessages(chatMessages);

          // 選択肢も復元
          if (currentChat.quickReplies && currentChat.quickReplies.length > 0) {
            setQuickReplies(currentChat.quickReplies);
          } else {
            setQuickReplies([]);
          }
        } else {
          // currentChatがあるが、メッセージが空の場合
          // （ゲストチャットを保存した直後など）
          // 既存のメッセージと選択肢を維持し、初期状態に戻さない
          // 何もしない（現在の状態を保持）
        }
      }
    }
  }, [currentChat, user, previousChatId]);

  // ユーザーがログインした時、ゲストモードのチャットを保存
  useEffect(() => {
    const saveGuestChat = async () => {
      // ゲストモードからログインした場合、既存のメッセージを保存
      if (user && isGuestMode && messages.length > 0 && !currentChat) {
        try {
          // 新しいチャットを作成
          const newChatId = await createNewChat();

          // Chat objectを取得
          const newChat = await loadChat(newChatId);

          if (newChat) {
            // 各メッセージを保存
            for (const message of messages) {
              await saveMessage(message, newChat);
            }

            // フォーム状態も保存
            await saveFormStates(
              collectBusinessInfo,
              collectInfo,
              inquiryComplete,
              newChatId
            );
          }

          // ゲストモードを解除
          setIsGuestMode(false);

          console.log('Guest chat saved successfully');
        } catch (error) {
          console.error('Failed to save guest chat:', error);
        }
      }
    };

    saveGuestChat();
  }, [user, isGuestMode, messages, currentChat]);

  // 会員選択のハンドラー
  const handleSelectMember = () => {
    setShowMembershipSelection(false);
    setAuthModalTab('login');
    setShowAuthModal(true);
  };

  const handleSelectGuest = () => {
    setShowMembershipSelection(false);
    setIsGuestMode(true);
    // ゲストモードで新しいチャットを開始
    setMessages([
      {
        role: "assistant",
        content: "AIチャットサービスへようこそ。本日はどのようなことでお困りですか？"
      }
    ]);
  };

  // チャット履歴関連のハンドラー
  const handleSelectChat = async (chatId: string) => {
    try {
      await loadChat(chatId);
      setShowChatHistory(false);
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  };

  const handleNewChat = async () => {
    try {
      await createNewChat();
      setShowChatHistory(false);
      // 新しいチャット用にメッセージをリセット
      setMessages([
        {
          role: "assistant",
          content: "AIチャットサービスへようこそ。本日はどのようなことでお困りですか？"
        }
      ]);
      setQuickReplies([
        "新規のお客様が増えない",
        "ホームページを改善したい",
        "業務が煩雑で時間が足りない",
        "競合に負けている気がする"
      ]);
      setSelectedReplies([]);
      setCollectBusinessInfo(null);
      setBusinessInfoData({});
      setCollectInfo(false);
      setContactInfoData({});
      setInquiryComplete(false);
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  // Typewriter effect
  const typeMessage = async (text: string) => {
    setIsTyping(true);
    setTypingMessage("");

    for (let i = 0; i <= text.length; i++) {
      setTypingMessage(text.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, 20)); // 20ms per character
    }

    setIsTyping(false);
    return text;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setQuickReplies([]); // Clear quick replies when user sends a message
    setSelectedReplies([]); // Clear selected replies
    setIsLoading(true);

    // ゲストモードの場合、メッセージをlocalStorageに保存
    if (!user && isGuestMode) {
      localStorage.setItem('guestChatMessages', JSON.stringify(newMessages));
    }

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    // ログインユーザーの場合、チャットを作成（まだない場合）
    if (user && !currentChat) {
      try {
        await createNewChat();
      } catch (error) {
        console.error("Failed to create new chat:", error);
      }
    }

    try {
      // Filter out any messages with empty content before sending to API
      const messagesToSend = [...messages, userMessage]
        .filter(msg => msg.content && msg.content.trim().length > 0)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesToSend
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`Failed to get response: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Typewriter effect for AI response
      await typeMessage(data.reply);

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply
      };
      setMessages(prev => {
        const updatedMessages = [...prev, assistantMessage];
        // ゲストモードの場合、メッセージをlocalStorageに保存
        if (!user && isGuestMode) {
          localStorage.setItem('guestChatMessages', JSON.stringify(updatedMessages));
        }
        return updatedMessages;
      });
      setTypingMessage(""); // Clear typing message after adding to messages

      // ログインユーザーの場合、メッセージをFirestoreに保存
      let savedChatId: string | undefined;
      if (user && currentChat) {
        try {
          // ユーザーメッセージを保存
          savedChatId = await saveMessage(userMessage);

          // アシスタントメッセージを保存
          savedChatId = await saveMessage(assistantMessage);
        } catch (error) {
          console.error("Failed to save messages to Firestore:", error);
        }
      }

      // Update quick replies if provided
      if (data.suggestedReplies && data.suggestedReplies.length > 0) {
        setQuickReplies(data.suggestedReplies);
        // ログインユーザーの場合、選択肢もFirestoreに保存
        if (user && savedChatId) {
          try {
            await saveQuickReplies(data.suggestedReplies, savedChatId);
          } catch (error) {
            console.error("Failed to save quick replies to Firestore:", error);
          }
        }
      } else {
        setQuickReplies([]);
        // 選択肢がない場合も保存
        if (user && savedChatId) {
          try {
            await saveQuickReplies([], savedChatId);
          } catch (error) {
            console.error("Failed to clear quick replies in Firestore:", error);
          }
        }
      }

      // Update states based on API response
      let updatedCollectBusinessInfo = collectBusinessInfo;
      let updatedCollectInfo = collectInfo;
      let updatedInquiryComplete = inquiryComplete;

      if (data.collectBusinessInfo) {
        setCollectBusinessInfo(data.collectBusinessInfo);
        updatedCollectBusinessInfo = data.collectBusinessInfo;
      }

      if (data.collectInfo) {
        setCollectInfo(true);
        updatedCollectInfo = true;
        // collectInfo がtrueの場合はinquiryCompleteを無視（フォーム表示中）
      }

      if (data.inquiryComplete) {
        // 問い合わせ完了時はフォームを非表示にして完了メッセージを表示
        setCollectInfo(false);
        setInquiryComplete(true);
        updatedCollectInfo = false;
        updatedInquiryComplete = true;
        // ゲストモードでお問い合わせ完了時、アカウント作成を促す
        if (!user && isGuestMode) {
          setAuthModalTab('signup');
          // 少し待ってからモーダルを表示
          setTimeout(() => {
            setShowAuthModal(true);
          }, 2000);
        }
      }

      // ログインユーザーの場合、フォーム状態をFirestoreに保存
      if (user && savedChatId) {
        try {
          await saveFormStates(
            updatedCollectBusinessInfo,
            updatedCollectInfo,
            updatedInquiryComplete,
            savedChatId
          );
        } catch (error) {
          console.error("Failed to save form states to Firestore:", error);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "申し訳ございません。エラーが発生しました。もう一度お試しいただくか、お問い合わせフォームからご連絡ください。"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleQuickReply = (text: string) => {
    // 業種リスト
    const industries = [
      '飲食店・カフェ',
      '美容室・サロン',
      '整体・治療院',
      '士業（税理士・行政書士など）',
      '小売店・EC',
      '建築・不動産',
      'その他のサービス業',
      '製造業'
    ];

    // 業種選択かどうかをチェック
    const isIndustrySelection = quickReplies.some(reply => industries.includes(reply));

    // 単一選択の選択肢かどうかをチェック
    const isSingleChoice = (
      isIndustrySelection || // 業種選択は単一選択
      (quickReplies.length === 2 && (
        quickReplies.includes('この投資額で進めたい') ||
        quickReplies.includes('もう少し予算を抑えたい')
      )) ||
      (quickReplies.length === 3 && (
        quickReplies.includes('はい、次に進む') &&
        quickReplies.includes('いいえ、修正したい') &&
        quickReplies.includes('予算を抑えたい')
      ))
    );

    if (isSingleChoice) {
      // 単一選択モード: 即座に送信
      sendMessage(text);
    } else {
      // 複数選択モード: トグル選択
      setSelectedReplies(prev => {
        if (prev.includes(text)) {
          return prev.filter(item => item !== text);
        } else {
          return [...prev, text];
        }
      });
    }
  };

  const handleSendSelectedReplies = () => {
    if (selectedReplies.length === 0) return;
    const message = selectedReplies.join('、');
    sendMessage(message);
  };

  const handleBusinessInfoSubmit = () => {
    // フォームデータを整形してメッセージとして送信
    const formattedData = Object.entries(businessInfoData)
      .filter(([_, value]) => value.trim() !== '')
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    if (formattedData) {
      sendMessage(formattedData);
      setCollectBusinessInfo(null);
      setBusinessInfoData({});
    }
  };

  const handleContactInfoSubmit = async () => {
    // バリデーション: 必須フィールドの確認
    if (!contactInfoData['お名前'] || !contactInfoData['メールアドレス'] || !contactInfoData['電話番号']) {
      alert('全ての項目をご入力ください');
      return;
    }

    setIsLoading(true);

    try {
      if (user) {
        // 会員ユーザー: chatInquiry APIを呼び出してメール送信
        const { api } = await import('@/lib/api');

        const chatInquiryData = {
          name: contactInfoData['お名前'],
          email: contactInfoData['メールアドレス'],
          phone: contactInfoData['電話番号'],
          company: contactInfoData['会社名'] || '',
          businessType: collectBusinessInfo || '未指定',
          chatMessages: messages,
          userId: user.uid
        };

        const result = await api.chatInquiry(chatInquiryData);

        if (result.success) {
          // 成功メッセージを表示
          const successMessage: Message = {
            role: 'assistant',
            content: 'お問い合わせを受け付けました。ご入力いただいたメールアドレスに自動返信メールをお送りしましたので、ご確認ください。\n\n担当者より2営業日以内にご連絡いたします。'
          };
          setMessages(prev => [...prev, successMessage]);

          // チャットに保存
          if (currentChat) {
            await saveMessage(successMessage);
          }

          // フォームをクリア
          setContactInfoData({});
          setCollectInfo(false);
          setInquiryComplete(true);
        }
      } else {
        // ゲストユーザー: チャット内容をlocalStorageに保存して/formページに遷移
        const chatConversation = messages.map(msg => {
          const role = msg.role === 'user' ? 'あなた' : 'AI';
          return `${role}: ${msg.content}`;
        }).join('\n\n');

        localStorage.setItem('chatConversation', chatConversation);
        localStorage.setItem('chatBusinessType', collectBusinessInfo || '未指定');
        localStorage.setItem('chatContactName', contactInfoData['お名前']);
        localStorage.setItem('chatContactEmail', contactInfoData['メールアドレス']);
        localStorage.setItem('chatContactPhone', contactInfoData['電話番号']);
        localStorage.setItem('chatContactCompany', contactInfoData['会社名'] || '');

        // /formページに遷移
        window.location.href = '/form?from=chat';
      }
    } catch (error) {
      console.error('送信エラー:', error);
      alert(error instanceof Error ? error.message : '送信に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enterキーでの送信を無効化（改行のみ許可）
    // ボタンクリックでのみ送信可能
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Reset height to auto to get the correct scrollHeight
    e.target.style.height = 'auto';
    // Set height based on scrollHeight (content height)
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <>
      {/* Chat Button - チャット開くアイコンのみ表示（マイページ・クライアントページでは非表示） */}
      {!isOpen && !shouldHideWidget && (
        <button
          className={styles.chatButton}
          onClick={() => setIsOpen(true)}
          aria-label="チャットを開く"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`${styles.chatWindow} ${isFullscreen ? styles.chatWindowFullscreen : ''}`}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderInfo}>
              <h3 className={styles.chatTitle}>AsamiWorks AIチャット</h3>
              <p className={styles.chatSubtitle}>WEBのお悩みをサポートします</p>
            </div>
            <div className={styles.headerButtons}>
              {!user && isGuestMode && (
                <button
                  className={styles.loginButton}
                  onClick={() => {
                    setGoogleOnlyMode(true);
                    setShowAuthModal(true);
                  }}
                  aria-label="会話を保存"
                  title="Googleアカウントでログインして会話を保存"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
              )}
              {user && (
                <button
                  className={styles.fullscreenButton}
                  onClick={() => setShowChatHistory(!showChatHistory)}
                  aria-label="チャット履歴"
                  title="チャット履歴"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              )}
              <button
                className={styles.fullscreenButton}
                onClick={() => setIsFullscreen(!isFullscreen)}
                aria-label={isFullscreen ? "通常表示" : "全画面表示"}
                title={isFullscreen ? "通常表示" : "全画面表示"}
              >
                {isFullscreen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                )}
              </button>
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="チャットを閉じる"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat History Sidebar */}
          {showChatHistory && user && (
            <div style={{
              position: 'absolute',
              top: '60px',
              left: 0,
              bottom: 0,
              width: '300px',
              backgroundColor: 'white',
              borderRight: '1px solid #e5e7eb',
              zIndex: 10
            }}>
              <ChatHistory
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
              />
            </div>
          )}

          <div className={styles.chatMessages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.role === "user" ? styles.userMessage : styles.assistantMessage
                }`}
              >
                <div
                  className={styles.messageContent}
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
              </div>
            ))}
            {isTyping && typingMessage && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div
                  className={styles.messageContent}
                  dangerouslySetInnerHTML={{ __html: formatMessage(typingMessage) + '<span class="' + styles.cursor + '">▋</span>' }}
                />
              </div>
            )}
            {isLoading && !isTyping && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {quickReplies.length > 0 && !isLoading && !isTyping && (() => {
            // 業種リスト
            const industries = [
              '飲食店・カフェ',
              '美容室・サロン',
              '整体・治療院',
              '士業（税理士・行政書士など）',
              '小売店・EC',
              '建築・不動産',
              'その他のサービス業',
              '製造業'
            ];

            // 業種選択かどうかをチェック
            const isIndustrySelection = quickReplies.some(reply => industries.includes(reply));

            // 単一選択の選択肢かどうかをチェック
            const isSingleChoice = (
              isIndustrySelection || // 業種選択は単一選択
              (quickReplies.length === 2 && (
                quickReplies.includes('この投資額で進めたい') ||
                quickReplies.includes('もう少し予算を抑えたい')
              )) ||
              (quickReplies.length === 3 && (
                quickReplies.includes('はい、次に進む') &&
                quickReplies.includes('いいえ、修正したい') &&
                quickReplies.includes('予算を抑えたい')
              ))
            );

            return (
              <div className={styles.quickRepliesContainer}>
                <div className={styles.quickRepliesHeader}>
                  {!isSingleChoice && <p className={styles.quickRepliesNote}>※複数選択可能です</p>}
                  {isSingleChoice && <p className={styles.quickRepliesNote}>※1つお選びください</p>}
                  {!isSingleChoice && selectedReplies.length > 0 && (
                    <button
                      className={styles.sendRepliesButton}
                      onClick={handleSendSelectedReplies}
                      type="button"
                    >
                      送信 ({selectedReplies.length})
                    </button>
                  )}
                </div>
                <div className={styles.quickReplies}>
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      className={`${styles.quickReplyButton} ${selectedReplies.includes(reply) ? styles.quickReplyButtonSelected : ''}`}
                      onClick={() => handleQuickReply(reply)}
                      type="button"
                    >
                      {!isSingleChoice && selectedReplies.includes(reply) && <span className={styles.checkMark}>✓ </span>}
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Contact Info Form */}
          {collectInfo && !inquiryComplete && !isLoading && !isTyping && (
            <div className={styles.businessInfoFormContainer}>
              <div className={styles.businessInfoHeader}>
                <p className={styles.businessInfoNote}>※全ての項目をご入力ください</p>
              </div>
              <div className={styles.businessInfoForm}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>お名前</label>
                  <div className={styles.formInputGroup}>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="例: 山田太郎"
                      value={contactInfoData['お名前'] || ''}
                      onChange={(e) => setContactInfoData(prev => ({
                        ...prev,
                        'お名前': e.target.value
                      }))}
                    />
                  </div>
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>メールアドレス</label>
                  <div className={styles.formInputGroup}>
                    <input
                      type="email"
                      className={styles.formInput}
                      placeholder="例: example@email.com"
                      value={contactInfoData['メールアドレス'] || ''}
                      onChange={(e) => setContactInfoData(prev => ({
                        ...prev,
                        'メールアドレス': e.target.value
                      }))}
                    />
                  </div>
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>電話番号</label>
                  <div className={styles.formInputGroup}>
                    <input
                      type="tel"
                      className={styles.formInput}
                      placeholder="例: 090-1234-5678"
                      value={contactInfoData['電話番号'] || ''}
                      onChange={(e) => setContactInfoData(prev => ({
                        ...prev,
                        '電話番号': e.target.value
                      }))}
                    />
                  </div>
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>会社名（任意）</label>
                  <div className={styles.formInputGroup}>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="例: 株式会社サンプル"
                      value={contactInfoData['会社名'] || ''}
                      onChange={(e) => setContactInfoData(prev => ({
                        ...prev,
                        '会社名': e.target.value
                      }))}
                    />
                  </div>
                </div>
                <button
                  className={styles.submitBusinessInfoButton}
                  onClick={handleContactInfoSubmit}
                  type="button"
                  disabled={!contactInfoData['お名前']?.trim() || !contactInfoData['メールアドレス']?.trim() || !contactInfoData['電話番号']?.trim()}
                >
                  送信
                </button>
              </div>
            </div>
          )}

          {/* Business Info Form */}
          {collectBusinessInfo && !isLoading && !isTyping && (
            <div className={styles.businessInfoFormContainer}>
              <div className={styles.businessInfoHeader}>
                <p className={styles.businessInfoNote}>※わからない項目は空欄で構いません</p>
              </div>
              <div className={styles.businessInfoForm}>
                {getBusinessInfoFields(collectBusinessInfo).map((field, index) => (
                  <div key={index} className={styles.formField}>
                    <label className={styles.formLabel}>{field.label}</label>
                    <div className={styles.formInputGroup}>
                      {field.type === 'textarea' ? (
                        <textarea
                          className={styles.formTextarea}
                          placeholder={field.placeholder}
                          value={businessInfoData[field.key] || ''}
                          onChange={(e) => setBusinessInfoData(prev => ({
                            ...prev,
                            [field.key]: e.target.value
                          }))}
                          rows={2}
                        />
                      ) : (
                        <>
                          <input
                            type="text"
                            className={styles.formInput}
                            placeholder={field.placeholder}
                            value={businessInfoData[field.key] || ''}
                            onChange={(e) => setBusinessInfoData(prev => ({
                              ...prev,
                              [field.key]: e.target.value
                            }))}
                          />
                          {field.unit && <span className={styles.formUnit}>{field.unit}</span>}
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  className={styles.submitBusinessInfoButton}
                  onClick={handleBusinessInfoSubmit}
                  type="button"
                >
                  送信
                </button>
              </div>
            </div>
          )}

          {!collectInfo && (
            <form className={styles.chatInput} onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力してください"
                className={styles.inputField}
                rows={1}
                disabled={isLoading}
                style={{ minHeight: '40px', maxHeight: '120px', resize: 'none', overflow: 'auto' }}
              />
              <button
                type="submit"
                className={styles.sendButton}
                disabled={!input.trim() || isLoading}
                aria-label="送信"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Membership Selection Modal */}
      <MembershipSelection
        isOpen={showMembershipSelection}
        onSelectMember={handleSelectMember}
        onSelectGuest={handleSelectGuest}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setGoogleOnlyMode(false);
        }}
        defaultTab={authModalTab}
        googleOnly={googleOnlyMode}
      />
    </>
  );
}
