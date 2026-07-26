// src/App.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import TitleBar from "./components/TitleBar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import Settings from "./components/Settings.jsx";
import Profile from "./components/Profile.jsx";
import { loadChatHistory, saveChatHistory } from "./lib/api.js";

function createChat(title = "New chat") {
  return {
    id: crypto.randomUUID(),
    title,
    createdAt: Date.now(),
    messages: [],
  };
}

export default function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [view, setView] = useState("chat"); // "chat" | "settings" | "profile"
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("English");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const searchInputRef = useRef(null);

  // ---- Load persisted history once on launch ----
  useEffect(() => {
    (async () => {
      const stored = await loadChatHistory();
      if (stored && stored.length > 0) {
        setChats(stored);
        setActiveChatId(stored[0].id);
      } else {
        const first = createChat("Welcome chat");
        first.messages.push({
          id: crypto.randomUUID(),
          sender: "ai",
          text: "Welcome to AI Workspace! Ask me anything, drop a file in, or try Ctrl/Cmd+N for a new chat.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        setChats([first]);
        setActiveChatId(first.id);
      }
      setLoaded(true);
    })();
  }, []);

  // ---- Persist to disk (via Rust) whenever chats change, after initial load ----
  useEffect(() => {
    if (!loaded) return;
    const id = setTimeout(() => {
      saveChatHistory(chats).catch(() => {
        /* best-effort — a failed write shouldn't break the UI */
      });
    }, 300);
    return () => clearTimeout(id);
  }, [chats, loaded]);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  const handleNewChat = useCallback(() => {
    const chat = createChat();
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
    setView("chat");
  }, []);

  const handleSelectChat = useCallback((id) => {
    setActiveChatId(id);
    setView("chat");
  }, []);

  const handleDeleteChat = useCallback(
    (id) => {
      setChats((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (id === activeChatId) {
          setActiveChatId(next[0]?.id ?? null);
        }
        return next;
      });
    },
    [activeChatId]
  );

  const handleUpdateChat = useCallback((id, updater) => {
    setChats((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  }, []);

  // ---- Global keyboard shortcuts ----
  useEffect(() => {
    const onKeyDown = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleNewChat();
      } else if (e.key.toLowerCase() === "k") {
        e.preventDefault();
        setView("chat");
        searchInputRef.current?.focus();
      } else if (e.key === ",") {
        e.preventDefault();
        setView("settings");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNewChat]);

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden rounded-xl bg-[#0a0a0f] text-neutral-100">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          chats={filteredChats}
          activeChatId={activeChatId}
          view={view}
          searchQuery={searchQuery}
          searchInputRef={searchInputRef}
          onSearchChange={setSearchQuery}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onOpenSettings={() => setView("settings")}
          onOpenProfile={() => setView("profile")}
        />
        <main className="relative flex-1 overflow-hidden">
          {view === "chat" &&
            (activeChat ? (
              <ChatWindow
                key={activeChat.id}
                chat={activeChat}
                notificationsEnabled={notificationsEnabled}
                onUpdateChat={handleUpdateChat}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-500">
                <p className="text-sm">No chats yet.</p>
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/20"
                >
                  Start a new chat
                </button>
              </div>
            ))}
          {view === "settings" && (
            <Settings
              theme={theme}
              setTheme={setTheme}
              language={language}
              setLanguage={setLanguage}
              notificationsEnabled={notificationsEnabled}
              setNotificationsEnabled={setNotificationsEnabled}
            />
          )}
          {view === "profile" && <Profile chats={chats} />}
        </main>
      </div>
    </div>
  );
}
