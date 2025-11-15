"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { db } from "@/lib/firebase-config";
import { doc, getDoc, updateDoc, collection, query, where, orderBy, limit, getDocs, deleteDoc } from "firebase/firestore";
import { updateProfile, updateEmail, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import styles from "./page.module.css";

interface UserProfile {
  displayName: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export default function MyPage() {
  const { user, signOut } = useAuth();
  const { loadChat, createNewChat, chats: contextChats, loadChats } = useChat();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    email: "",
    phone: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    displayName: "",
    email: "",
    phone: ""
  });

  // パスワード変更フォーム
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // メールアドレス変更フォーム
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({
    newEmail: "",
    password: ""
  });

  // アカウント削除確認
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // チャット履歴
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatHistory | null>(null);
  const [showChatDetail, setShowChatDetail] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  // チャット続行用
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const loadProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const profileData = {
            displayName: data.displayName || user.displayName || "",
            email: user.email || "",
            phone: data.phone || "",
            createdAt: data.createdAt?.toDate().toLocaleDateString("ja-JP") || ""
          };
          setProfile(profileData);
          setEditedProfile(profileData);
        } else {
          setProfile({
            displayName: user.displayName || "",
            email: user.email || "",
            phone: ""
          });
          setEditedProfile({
            displayName: user.displayName || "",
            email: user.email || "",
            phone: ""
          });
        }
      } catch (error) {
        console.error("プロフィール読み込みエラー:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, router]);

  // ChatContextからチャット履歴を取得
  useEffect(() => {
    if (!user) return;

    // ChatContextのchatsをChatHistory形式に変換
    const histories: ChatHistory[] = contextChats.map((chat) => ({
      id: chat.id,
      title: chat.title || "無題のチャット",
      messages: chat.messages || [],
      createdAt: chat.createdAt?.toDate() || new Date(),
      updatedAt: chat.updatedAt?.toDate() || new Date()
    }));

    setChatHistories(histories);
  }, [user, contextChats]);

  const handleProfileUpdate = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Firebase Authのdisplaynameを更新
      if (editedProfile.displayName !== profile.displayName) {
        await updateProfile(user, {
          displayName: editedProfile.displayName
        });
      }

      // Firestoreのユーザードキュメントを更新
      await updateDoc(doc(db, "users", user.uid), {
        displayName: editedProfile.displayName,
        phone: editedProfile.phone || ""
      });

      setProfile(editedProfile);
      setEditMode(false);
      alert("プロフィールを更新しました");
    } catch (error) {
      console.error("プロフィール更新エラー:", error);
      alert("プロフィールの更新に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user || !user.email) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("新しいパスワードが一致しません");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("パスワードは8文字以上で入力してください");
      return;
    }

    try {
      setLoading(true);

      // 再認証
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // パスワード更新
      await updatePassword(user, passwordData.newPassword);

      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
      alert("パスワードを変更しました");
    } catch (error: any) {
      console.error("パスワード変更エラー:", error);
      if (error.code === "auth/wrong-password") {
        alert("現在のパスワードが間違っています");
      } else {
        alert("パスワードの変更に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async () => {
    if (!user || !user.email) return;

    try {
      setLoading(true);

      // 再認証
      const credential = EmailAuthProvider.credential(user.email, emailData.password);
      await reauthenticateWithCredential(user, credential);

      // メールアドレス更新
      await updateEmail(user, emailData.newEmail);

      // Firestoreも更新
      await updateDoc(doc(db, "users", user.uid), {
        email: emailData.newEmail
      });

      setProfile({ ...profile, email: emailData.newEmail });
      setEditedProfile({ ...editedProfile, email: emailData.newEmail });
      setEmailData({ newEmail: "", password: "" });
      setShowEmailForm(false);
      alert("メールアドレスを変更しました。確認メールが送信されます。");
    } catch (error: any) {
      console.error("メールアドレス変更エラー:", error);
      if (error.code === "auth/wrong-password") {
        alert("パスワードが間違っています");
      } else if (error.code === "auth/email-already-in-use") {
        alert("このメールアドレスは既に使用されています");
      } else {
        alert("メールアドレスの変更に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    if (!user || !user.email) return;

    if (!window.confirm("本当にアカウントを削除しますか？この操作は取り消せません。")) {
      return;
    }

    try {
      setLoading(true);

      // 再認証
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, credential);

      // アカウント削除
      await deleteUser(user);

      alert("アカウントを削除しました");
      router.push("/");
    } catch (error: any) {
      console.error("アカウント削除エラー:", error);
      if (error.code === "auth/wrong-password") {
        alert("パスワードが間違っています");
      } else {
        alert("アカウントの削除に失敗しました");
      }
      setLoading(false);
    }
  };

  const handleChatDelete = async (chatId: string) => {
    if (!window.confirm("このチャット履歴を削除しますか？")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "chats", chatId));
      setChatHistories(chatHistories.filter(chat => chat.id !== chatId));
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
        setShowChatDetail(false);
      }
      alert("チャット履歴を削除しました");
    } catch (error) {
      console.error("チャット削除エラー:", error);
      alert("チャット履歴の削除に失敗しました");
    }
  };

  const handleChatView = (chat: ChatHistory) => {
    setSelectedChat(chat);
    setShowChatDetail(true);
  };

  const handleTitleEdit = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditedTitle(currentTitle);
  };

  const handleTitleSave = async (chatId: string) => {
    if (!editedTitle.trim()) {
      alert("タイトルを入力してください");
      return;
    }

    try {
      await updateDoc(doc(db, "chats", chatId), {
        title: editedTitle
      });

      // ローカルステートを更新
      setChatHistories(chatHistories.map(chat =>
        chat.id === chatId ? { ...chat, title: editedTitle } : chat
      ));

      if (selectedChat?.id === chatId) {
        setSelectedChat({ ...selectedChat, title: editedTitle });
      }

      setEditingChatId(null);
      setEditedTitle("");
      alert("タイトルを更新しました");
    } catch (error) {
      console.error("タイトル更新エラー:", error);
      alert("タイトルの更新に失敗しました");
    }
  };

  const handleTitleCancel = () => {
    setEditingChatId(null);
    setEditedTitle("");
  };

  const handleChatContinue = async (chat: ChatHistory) => {
    try {
      // ChatContextを使ってチャットを読み込む
      await loadChat(chat.id);

      // チャットウィジェットを開くためのイベントをトリガー
      if (typeof window !== 'undefined') {
        // カスタムイベントを発火してチャットウィジェットを開く
        window.dispatchEvent(new CustomEvent('openChatWidget'));
      }
    } catch (error) {
      console.error('チャット読み込みエラー:', error);
      alert('チャットの読み込みに失敗しました');
    }
  };

  const handleNewChat = async () => {
    try {
      // 新しいチャットを作成
      await createNewChat('新しいチャット');

      // チャットウィジェットを開くためのイベントをトリガー
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('openChatWidget'));
      }
    } catch (error) {
      console.error('新規チャット作成エラー:', error);
      alert('新規チャットの作成に失敗しました');
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !selectedChat || !user) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput
    };

    // UIを即座に更新
    const updatedMessages = [...selectedChat.messages, userMessage];
    setSelectedChat({
      ...selectedChat,
      messages: updatedMessages
    });
    setChatInput("");
    setIsChatLoading(true);

    try {
      // Claude APIにリクエスト
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.message
      };

      const finalMessages = [...updatedMessages, assistantMessage];

      // Firestoreを更新
      await updateDoc(doc(db, "chats", selectedChat.id), {
        messages: finalMessages,
        updatedAt: new Date()
      });

      // ローカルステートを更新
      setSelectedChat({
        ...selectedChat,
        messages: finalMessages,
        updatedAt: new Date()
      });

      // チャット履歴リストも更新
      setChatHistories(chatHistories.map(chat =>
        chat.id === selectedChat.id
          ? { ...chat, messages: finalMessages, updatedAt: new Date() }
          : chat
      ));
    } catch (error) {
      console.error('チャット送信エラー:', error);
      alert('メッセージの送信に失敗しました');
    } finally {
      setIsChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>マイページ</h1>

        {/* プロフィール表示・編集 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>プロフィール</h2>
            {!editMode && (
              <button
                className={styles.editButton}
                onClick={() => setEditMode(true)}
                disabled={loading}
              >
                編集
              </button>
            )}
          </div>

          {editMode ? (
            <div className={styles.editForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>お名前</label>
                <input
                  type="text"
                  className={styles.input}
                  value={editedProfile.displayName}
                  onChange={(e) => setEditedProfile({ ...editedProfile, displayName: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>メールアドレス</label>
                <input
                  type="email"
                  className={styles.input}
                  value={editedProfile.email}
                  disabled
                />
                <p className={styles.helpText}>メールアドレスの変更は下記の専用フォームから行ってください</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>電話番号</label>
                <input
                  type="tel"
                  className={styles.input}
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  placeholder="090-1234-5678"
                />
              </div>

              <div className={styles.buttonGroup}>
                <button
                  className={styles.saveButton}
                  onClick={handleProfileUpdate}
                  disabled={loading}
                >
                  保存
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setEditedProfile(profile);
                    setEditMode(false);
                  }}
                  disabled={loading}
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.profileDisplay}>
              <div className={styles.profileItem}>
                <span className={styles.profileLabel}>お名前</span>
                <span className={styles.profileValue}>{profile.displayName || "未設定"}</span>
              </div>
              <div className={styles.profileItem}>
                <span className={styles.profileLabel}>メールアドレス</span>
                <span className={styles.profileValue}>{profile.email}</span>
              </div>
              <div className={styles.profileItem}>
                <span className={styles.profileLabel}>電話番号</span>
                <span className={styles.profileValue}>{profile.phone || "未設定"}</span>
              </div>
              {profile.createdAt && (
                <div className={styles.profileItem}>
                  <span className={styles.profileLabel}>登録日</span>
                  <span className={styles.profileValue}>{profile.createdAt}</span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* メールアドレス変更 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>メールアドレス変更</h2>
          {!showEmailForm ? (
            <button
              className={styles.actionButton}
              onClick={() => setShowEmailForm(true)}
            >
              メールアドレスを変更する
            </button>
          ) : (
            <div className={styles.editForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>新しいメールアドレス</label>
                <input
                  type="email"
                  className={styles.input}
                  value={emailData.newEmail}
                  onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                  placeholder="new-email@example.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>現在のパスワード</label>
                <input
                  type="password"
                  className={styles.input}
                  value={emailData.password}
                  onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                />
              </div>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.saveButton}
                  onClick={handleEmailChange}
                  disabled={loading}
                >
                  変更
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setEmailData({ newEmail: "", password: "" });
                    setShowEmailForm(false);
                  }}
                  disabled={loading}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </section>

        {/* パスワード変更 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>パスワード変更</h2>
          {!showPasswordForm ? (
            <button
              className={styles.actionButton}
              onClick={() => setShowPasswordForm(true)}
            >
              パスワードを変更する
            </button>
          ) : (
            <div className={styles.editForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>現在のパスワード</label>
                <input
                  type="password"
                  className={styles.input}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>新しいパスワード</label>
                <input
                  type="password"
                  className={styles.input}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>新しいパスワード（確認）</label>
                <input
                  type="password"
                  className={styles.input}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.saveButton}
                  onClick={handlePasswordChange}
                  disabled={loading}
                >
                  変更
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setShowPasswordForm(false);
                  }}
                  disabled={loading}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </section>

        {/* チャット履歴 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>チャット履歴</h2>
            <button
              className={styles.actionButton}
              onClick={handleNewChat}
            >
              + 新規チャット
            </button>
          </div>
          {chatHistories.length === 0 ? (
            <p className={styles.emptyText}>チャット履歴がありません</p>
          ) : (
            <div className={styles.chatList}>
              {chatHistories.map((chat) => (
                <div key={chat.id} className={styles.chatItem}>
                  <div className={styles.chatItemHeader}>
                    {editingChatId === chat.id ? (
                      <div className={styles.titleEditForm}>
                        <input
                          type="text"
                          className={styles.titleInput}
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          placeholder="タイトルを入力"
                          autoFocus
                        />
                        <button
                          className={styles.titleSaveButton}
                          onClick={() => handleTitleSave(chat.id)}
                        >
                          保存
                        </button>
                        <button
                          className={styles.titleCancelButton}
                          onClick={handleTitleCancel}
                        >
                          キャンセル
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className={styles.chatTitle}>{chat.title}</h3>
                        <button
                          className={styles.titleEditButton}
                          onClick={() => handleTitleEdit(chat.id, chat.title)}
                          title="タイトルを編集"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                      </>
                    )}
                    <span className={styles.chatDate}>
                      {chat.updatedAt.toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  <p className={styles.chatPreview}>
                    {(() => {
                      // 最初のユーザーメッセージを探す
                      const firstUserMessage = chat.messages.find(msg => msg.role === 'user');
                      if (firstUserMessage) {
                        return firstUserMessage.content.substring(0, 100) + (firstUserMessage.content.length > 100 ? "..." : "");
                      }
                      // ユーザーメッセージがない場合は最初のメッセージ
                      if (chat.messages.length > 0) {
                        return chat.messages[0].content.substring(0, 100) + (chat.messages[0].content.length > 100 ? "..." : "");
                      }
                      return "メッセージなし";
                    })()}
                  </p>
                  <div className={styles.chatActions}>
                    <button
                      className={styles.chatContinueButton}
                      onClick={() => handleChatContinue(chat)}
                    >
                      続きから話す
                    </button>
                    <button
                      className={styles.chatViewButton}
                      onClick={() => handleChatView(chat)}
                    >
                      詳細を見る
                    </button>
                    <button
                      className={styles.chatDeleteButton}
                      onClick={() => handleChatDelete(chat.id)}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* アカウント削除 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>アカウント削除</h2>
          <p className={styles.dangerText}>
            アカウントを削除すると、すべてのデータが完全に削除されます。この操作は取り消せません。
          </p>
          {!showDeleteConfirm ? (
            <button
              className={styles.dangerButton}
              onClick={() => setShowDeleteConfirm(true)}
            >
              アカウントを削除する
            </button>
          ) : (
            <div className={styles.editForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>パスワードを入力して確認</label>
                <input
                  type="password"
                  className={styles.input}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="パスワードを入力"
                />
              </div>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.dangerButton}
                  onClick={handleAccountDelete}
                  disabled={loading}
                >
                  削除を実行
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setDeletePassword("");
                    setShowDeleteConfirm(false);
                  }}
                  disabled={loading}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* チャット詳細モーダル */}
      {showChatDetail && selectedChat && (
        <div className={styles.modal} onClick={() => setShowChatDetail(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedChat.title}</h2>
              <button
                className={styles.modalClose}
                onClick={() => setShowChatDetail(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.chatMessages}>
              {selectedChat.messages.map((message, index) => (
                <div
                  key={index}
                  className={`${styles.chatMessage} ${
                    message.role === 'user' ? styles.userMessage : styles.assistantMessage
                  }`}
                >
                  <div className={styles.messageRole}>
                    {message.role === 'user' ? 'あなた' : 'AI'}
                  </div>
                  <div className={styles.messageContent}>{message.content}</div>
                </div>
              ))}
              {isChatLoading && (
                <div className={styles.chatMessage}>
                  <div className={styles.messageRole}>AI</div>
                  <div className={`${styles.messageContent} ${styles.loadingMessage}`}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.chatInputArea}>
              <textarea
                className={styles.chatTextarea}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSend();
                  }
                }}
                placeholder="メッセージを入力..."
                rows={3}
                disabled={isChatLoading}
              />
              <button
                className={styles.chatSendButton}
                onClick={handleChatSend}
                disabled={isChatLoading || !chatInput.trim()}
              >
                送信
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
