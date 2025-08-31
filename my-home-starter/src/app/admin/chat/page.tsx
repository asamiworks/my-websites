
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Badge,
  TextField,
  Button,
} from "@mui/material";
import { auth, db, storage } from "../../../utils/firebaseConfig";
import {
  collection,
  query,
  where,
  addDoc,
  onSnapshot,
  orderBy,
  Timestamp,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { increment } from "firebase/firestore";

type User = {
  uid: string;
  displayName: string;
  email: string;
  unreadCount: number;
};

type Message = {
  id: string;
  text?: string;
  userId: string;
  createdAt: Timestamp;
  sender: string;
  fileUrl?: string;
  isRead: boolean;
};

const AdminChatPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 認証と管理者チェック
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }
      try {
        const idTokenResult = await user.getIdTokenResult();
        if (idTokenResult.claims?.admin) {
          setIsAdmin(true);
        } else {
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("認証情報の取得に失敗:", err);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // ユーザー一覧の取得（未読メッセージ数を含む）
  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsers = async () => {
      const usersRef = collection(db, "users");
      const unsubscribe = onSnapshot(usersRef, async (snapshot) => {
        const usersData: User[] = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const userId = doc.id;
            const unreadMessagesQuery = query(
              collection(db, "messages"),
              where("userId", "==", userId),
              where("isRead", "==", false)
            );
            const unreadMessagesSnapshot = await getDocs(unreadMessagesQuery);
            return {
              uid: userId,
              displayName: doc.data().displayName || "未設定",
              email: doc.data().email || "不明なメールアドレス",
              unreadCount: unreadMessagesSnapshot.size,
            };
          })
        );
        setUsers(usersData);
      });

      return () => unsubscribe();
    };

    fetchUsers();
  }, [isAdmin]);

  // 選択されたユーザーのメッセージを取得
  useEffect(() => {
    if (!selectedUser) return;

    const userMessagesQuery = query(
      collection(db, "messages"),
      where("userId", "==", selectedUser.uid),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(userMessagesQuery, async (snapshot) => {
      const messageList: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      setMessages(messageList);

      // 未読メッセージを既読にする
      const unreadMessages = messageList.filter(
        (msg) => msg.sender === "user" && !msg.isRead
      );
      unreadMessages.forEach(async (msg) => {
        const messageRef = doc(db, "messages", msg.id);
        await updateDoc(messageRef, { isRead: true });
      });

      // ユーザーリストの未読バッジを更新
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === selectedUser.uid ? { ...user, unreadCount: 0 } : user
        )
      );
    });

    return () => unsubscribe();
  }, [selectedUser]);

  // メッセージ送信
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return;
    if (!selectedUser) {
      console.error("送信先のユーザーが選択されていません。");
      return;
    }
  
    try {
      let fileUrl: string | null = null;
  
      if (file) {
        const fileRef = ref(storage, `chat_files/${encodeURIComponent(file.name)}`);
        const uploadResult = await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(uploadResult.ref);
      }
  
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        userId: selectedUser.uid,
        createdAt: Timestamp.now(),
        sender: "admin",
        fileUrl,
        isRead: false, // 🔹 送信時は未読
      });
  
      // 🔹 Firestore の `users` コレクションに未読メッセージ数をカウント
      const userRef = doc(db, "users", selectedUser.uid);
      await updateDoc(userRef, {
        unreadMessages: increment(1), // 🔹 未読メッセージ数を +1
      });
  
      setNewMessage("");
      setFile(null);
    } catch (error) {
      console.error("メッセージ送信エラー:", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        管理者チャットページ
      </Typography>
      <Box display="flex" gap={4}>
        <Box flex={1}>
          <Typography variant="h6">ユーザー一覧</Typography>
          <List>
            {users.map((user) => (
              <ListItem key={user.uid} onClick={() => setSelectedUser(user)} style={{ cursor: "pointer" }}>
                <Badge color="error" badgeContent={user.unreadCount > 0 ? user.unreadCount : null}>
                  <ListItemText primary={`名前: ${user.displayName}`} secondary={`メール: ${user.email}`} />
                </Badge>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box flex={2}>
          {selectedUser ? (
            <>
              <Typography variant="h6">{`${selectedUser.displayName} さんとのチャット`}</Typography>
              <List>
                {messages.map((message) => (
                  <ListItem key={message.id}>
                    <ListItemText primary={message.text} secondary={message.createdAt.toDate().toLocaleString()} />
                  </ListItem>
                ))}
              </List>
              <TextField fullWidth label="メッセージを入力" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
              <Button variant="contained" color="primary" onClick={handleSendMessage}>送信</Button>
            </>
          ) : (
            <Typography>ユーザーを選択してください。</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminChatPage;