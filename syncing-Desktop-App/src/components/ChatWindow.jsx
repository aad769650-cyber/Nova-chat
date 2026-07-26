// src/components/ChatWindow.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import {
  FiSend,
  FiTrash2,
  FiDownload,
  FiFolder,
  FiPaperclip,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import MessageBubble from "./MessageBubble.jsx";
import {
  getAiResponse,
  exportChatToFile,
  openLocalFile,
  notifyDesktop,
  readLocalFileViaRust,
} from "../lib/api.js";

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWindow({ chat, notificationsEnabled, onUpdateChat }) {
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto-resize the composer textarea.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft]);

  // Auto-scroll to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat.messages.length, isTyping]);

  // Native OS drag-and-drop — dropping a text file reads it and appends its
  // content to the composer instead of just showing a browser-level overlay.
  useEffect(() => {
    let unlisten;
    getCurrentWebview()
      .onDragDropEvent((event) => {
        if (event.payload.type === "over") {
          setIsDragActive(true);
        } else if (event.payload.type === "drop") {
          setIsDragActive(false);
          const path = event.payload.paths?.[0];
          if (!path) return;
          readLocalFileViaRust(path)
            .then((content) => {
              setDraft((prev) => (prev ? `${prev}\n\n${content}` : content));
              textareaRef.current?.focus();
            })
            .catch(() => {
              /* non-text file or read error — ignore for this MVP */
            });
        } else {
          setIsDragActive(false);
        }
      })
      .then((fn) => {
        unlisten = fn;
      });
    return () => unlisten?.();
  }, []);

  const appendMessage = useCallback(
    (message) => {
      onUpdateChat(chat.id, (c) => ({ ...c, messages: [...c.messages, message] }));
    },
    [chat.id, onUpdateChat]
  );

  const handleSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || isTyping) return;

    const userMessage = { id: crypto.randomUUID(), sender: "user", text, time: nowLabel() };
    appendMessage(userMessage);

    // First user message becomes the chat title, like most chat apps do.
    onUpdateChat(chat.id, (c) =>
      c.messages.length === 0 || (c.messages.length === 1 && c.title === "New chat")
        ? { ...c, title: text.slice(0, 40) }
        : c
    );

    setDraft("");
    setIsTyping(true);

    try {
      const reply = await getAiResponse(text);
      appendMessage({ id: crypto.randomUUID(), sender: "ai", text: reply, time: nowLabel() });
      if (notificationsEnabled) {
        notifyDesktop("AI Workspace", reply.slice(0, 80));
      }
    } finally {
      setIsTyping(false);
    }
  }, [draft, isTyping, appendMessage, chat.id, onUpdateChat, notificationsEnabled]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    onUpdateChat(chat.id, (c) => ({ ...c, messages: [] }));
  };

  const handleExport = async () => {
    await exportChatToFile(chat);
  };

  const handleOpenFile = async () => {
    const result = await openLocalFile();
    if (!result) return;
    setDraft((prev) => (prev ? `${prev}\n\n${result.content}` : result.content));
    textareaRef.current?.focus();
  };

  return (
    <div className="relative flex h-full flex-col">
      {/* Chat header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.02] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400">
            <HiSparkles className="h-3.5 w-3.5 text-white" />
          </span>
          <h2 className="line-clamp-1 text-[13.5px] font-semibold text-white">{chat.title}</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Open local file"
            onClick={handleOpenFile}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <FiFolder className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Export chat"
            onClick={handleExport}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <FiDownload className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Clear chat"
            onClick={handleClearChat}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="thin-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {chat.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-neutral-500">
            <HiSparkles className="h-6 w-6 text-neutral-600" />
            <p className="text-[13px]">Say hello, or drop a text file in to get started.</p>
          </div>
        ) : (
          chat.messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400">
                <HiSparkles className="h-3.5 w-3.5 text-white" />
              </span>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.04] px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-neutral-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-white/10 bg-white/[0.02] p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 focus-within:border-violet-400/50">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message AI Workspace… (drop a file, or Shift+Enter for a new line)"
            aria-label="Message input"
            className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-[13px] text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />
          <button
            type="button"
            aria-label="Attach local file"
            onClick={handleOpenFile}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <FiPaperclip className="h-4 w-4" />
          </button>
          <motion.button
            type="button"
            aria-label="Send message"
            onClick={handleSend}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!draft.trim() || isTyping}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-md shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <FiSend className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Drag overlay */}
      <AnimatePresence>
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center border-2 border-dashed border-violet-400/60 bg-violet-500/10 backdrop-blur-sm"
          >
            <p className="rounded-xl bg-neutral-900/90 px-4 py-2 text-[13px] font-medium text-white">
              Drop file to add it to your message
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
