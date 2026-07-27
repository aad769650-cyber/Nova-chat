// src/context/ChatContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getJSON, setJSON } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/keys";
import { INITIAL_CHATS } from "../data/mockChats";
import { generateMockReply } from "../utils/mockAi";

const ChatContext = createContext(null);

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function makeId(suffix) {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${suffix}`;
}

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [typingChatId, setTypingChatId] = useState(null);

  // ---- Load persisted chats once on launch ----
  useEffect(() => {
    (async () => {
      const stored = await getJSON(STORAGE_KEYS.CHATS, null);
      setChats(stored && stored.length > 0 ? stored : INITIAL_CHATS);
      setLoaded(true);
    })();
  }, []);

  // ---- Persist on every change, after the initial load completes ----
  useEffect(() => {
    if (!loaded) return;
    setJSON(STORAGE_KEYS.CHATS, chats);
  }, [chats, loaded]);

  const createChat = useCallback(() => {
    const id = makeId("chat");
    const chat = { id, title: "New chat", messages: [], updatedAt: Date.now() };
    setChats((prev) => [chat, ...prev]);
    return id;
  }, []);

  const deleteChat = useCallback((id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearChat = useCallback((id) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, messages: [] } : c)));
  }, []);

  const sendMessage = useCallback((chatId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage = { id: makeId("u"), sender: "user", text: trimmed, time: nowLabel() };
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              title: c.messages.length === 0 ? trimmed.slice(0, 40) : c.title,
              messages: [...c.messages, userMessage],
              updatedAt: Date.now(),
            }
          : c
      )
    );

    setTypingChatId(chatId);
    const delay = 700 + Math.random() * 900;
    setTimeout(() => {
      const reply = generateMockReply(trimmed);
      const aiMessage = { id: makeId("a"), sender: "ai", text: reply, time: nowLabel() };
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, messages: [...c.messages, aiMessage], updatedAt: Date.now() } : c
        )
      );
      setTypingChatId((curr) => (curr === chatId ? null : curr));
    }, delay);
  }, []);

  const getChat = useCallback((chatId) => chats.find((c) => c.id === chatId), [chats]);

  return (
    <ChatContext.Provider
      value={{ chats, loaded, typingChatId, createChat, deleteChat, clearChat, sendMessage, getChat }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChats must be used within a ChatProvider");
  return ctx;
}
