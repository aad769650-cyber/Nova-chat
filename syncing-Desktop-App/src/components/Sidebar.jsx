// src/components/Sidebar.jsx
import { motion } from "framer-motion";
import { FiSearch, FiPlus, FiTrash2, FiSettings, FiUser, FiMessageSquare } from "react-icons/fi";

export default function Sidebar({
  chats,
  activeChatId,
  view,
  searchQuery,
  searchInputRef,
  onSearchChange,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenSettings,
  onOpenProfile,
}) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-white/[0.02]">
      {/* New chat */}
      <div className="p-3">
        <motion.button
          type="button"
          onClick={onNewChat}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-3 py-2.5 text-[13px] font-medium text-white shadow-md shadow-violet-500/20"
        >
          <FiPlus className="h-4 w-4" /> New Chat
          <span className="ml-auto rounded-md bg-white/20 px-1.5 py-0.5 text-[10px]">⌘N</span>
        </motion.button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <FiSearch className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chats…"
            aria-label="Search chats"
            className="min-w-0 flex-1 bg-transparent text-[12.5px] text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Recent chats */}
      <div className="flex-1 overflow-y-auto thin-scrollbar px-2 pb-2">
        <p className="px-2 pb-1.5 pt-1 text-[10.5px] font-semibold uppercase tracking-wider text-neutral-500">
          Recent
        </p>
        {chats.length === 0 ? (
          <p className="px-2 py-4 text-center text-[12px] text-neutral-500">No chats found.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {chats.map((chat) => {
              const lastMessage = chat.messages[chat.messages.length - 1];
              const isActive = chat.id === activeChatId && view === "chat";
              return (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-2 rounded-xl px-2.5 py-2 transition-colors ${
                    isActive ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectChat(chat.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none"
                  >
                    <FiMessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-violet-300" : "text-neutral-500"}`} />
                    <span className="flex min-w-0 flex-col">
                      <span className={`line-clamp-1 text-[12.5px] font-medium ${isActive ? "text-white" : "text-neutral-300"}`}>
                        {chat.title}
                      </span>
                      <span className="line-clamp-1 text-[11px] text-neutral-500">
                        {lastMessage ? lastMessage.text : "No messages yet"}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${chat.title}`}
                    onClick={() => onDeleteChat(chat.id)}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-neutral-500 opacity-0 transition-opacity hover:bg-rose-500/10 hover:text-rose-300 focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <FiTrash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="flex items-center gap-1 border-t border-white/10 p-2">
        <button
          type="button"
          onClick={onOpenProfile}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[12px] font-medium transition-colors ${
            view === "profile" ? "bg-white/[0.08] text-white" : "text-neutral-400 hover:bg-white/[0.05] hover:text-white"
          }`}
        >
          <FiUser className="h-3.5 w-3.5" /> Profile
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[12px] font-medium transition-colors ${
            view === "settings" ? "bg-white/[0.08] text-white" : "text-neutral-400 hover:bg-white/[0.05] hover:text-white"
          }`}
        >
          <FiSettings className="h-3.5 w-3.5" /> Settings
        </button>
      </div>
    </aside>
  );
}
