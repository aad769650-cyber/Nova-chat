import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { MOCK_CHATS, AI_DUMMY_RESPONSES } from "../constants/mockData";

const ChatContext = createContext(null);

let idCounter = 1000;
const nextId = () => `id_${Date.now()}_${idCounter++}`;

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(MOCK_CHATS);
  const [typingChatId, setTypingChatId] = useState(null);

  const getChat = useCallback((chatId) => chats.find((c) => c.id === chatId), [chats]);

  const createChat = useCallback((firstMessageText) => {
    const id = nextId();
    const title = firstMessageText ? firstMessageText.slice(0, 40) : "New Conversation";
    const newChat = {
      id,
      title,
      lastMessage: "",
      updatedAt: Date.now(),
      pinned: false,
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    return id;
  }, []);

  const sendMessage = useCallback((chatId, text) => {
    const userMessage = {
      id: nextId(),
      role: "user",
      text,
      timestamp: Date.now(),
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [...c.messages, userMessage],
              lastMessage: text,
              updatedAt: Date.now(),
              title: c.messages.length === 0 ? text.slice(0, 40) : c.title,
            }
          : c
      )
    );

    setTypingChatId(chatId);

    const delay = 1100 + Math.random() * 900;
    setTimeout(() => {
      const responseText = AI_DUMMY_RESPONSES[Math.floor(Math.random() * AI_DUMMY_RESPONSES.length)];
      const aiMessage = {
        id: nextId(),
        role: "ai",
        text: responseText,
        timestamp: Date.now(),
      };
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: [...c.messages, aiMessage],
                lastMessage: responseText,
                updatedAt: Date.now(),
              }
            : c
        )
      );
      setTypingChatId(null);
    }, delay);
  }, []);

  const deleteChat = useCallback((chatId) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
  }, []);

  const togglePinChat = useCallback((chatId) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, pinned: !c.pinned } : c)));
  }, []);

  const sortedChats = useMemo(
    () => [...chats].sort((a, b) => (b.pinned - a.pinned) || (b.updatedAt - a.updatedAt)),
    [chats]
  );

  const value = useMemo(
    () => ({
      chats: sortedChats,
      getChat,
      createChat,
      sendMessage,
      deleteChat,
      togglePinChat,
      typingChatId,
    }),
    [sortedChats, getChat, createChat, sendMessage, deleteChat, togglePinChat, typingChatId]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}
