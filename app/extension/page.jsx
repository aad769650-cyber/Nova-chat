"use client"

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiSparkles,
  HiOutlinePaperAirplane,
  HiOutlineDocumentText,
  HiOutlineLightBulb,
  HiOutlinePencil,
  HiOutlineTranslate,
  HiOutlineCodeBracket,
  HiOutlineCamera,
  HiOutlineBookmark,
  HiOutlineClipboardDocument,
  HiOutlineSquares2X2,
  HiOutlineCog6Tooth,
  HiOutlineShieldCheck,
  HiOutlineQuestionMarkCircle,
  HiOutlineClock,
  HiOutlineXMark,
  HiOutlineCheck,
} from "react-icons/hi2";

/**
 * Popup.jsx
 * Premium AI Chat Chrome Extension popup.
 * Single, self-contained React component — Tailwind CSS + Framer Motion + React Icons.
 */
export default function Popup() {
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [selectedTextVisible, setSelectedTextVisible] = useState(true);
  const textareaRef = useRef(null);

  const dummySelectedText =
    "\u201CThe transformer architecture relies on self-attention to weigh the relevance of each token against every other token in the sequence.\u201D";

  const recentHistory = [
    { id: 1, label: "Summarize quarterly report", time: "2m ago" },
    { id: 2, label: "Explain useEffect dependency array", time: "18m ago" },
    { id: 3, label: "Rewrite email to sound more formal", time: "1h ago" },
    { id: 4, label: "Translate paragraph to Japanese", time: "3h ago" },
    { id: 5, label: "Generate regex for email validation", time: "Yesterday" },
  ];

  const quickActions = [
    { id: "summarize", label: "Summarize", icon: HiOutlineDocumentText, from: "from-violet-500", to: "to-indigo-500" },
    { id: "explain", label: "Explain", icon: HiOutlineLightBulb, from: "from-amber-400", to: "to-orange-500" },
    { id: "rewrite", label: "Rewrite", icon: HiOutlinePencil, from: "from-emerald-400", to: "to-teal-500" },
    { id: "translate", label: "Translate", icon: HiOutlineTranslate, from: "from-sky-400", to: "to-blue-500" },
    { id: "improve", label: "Improve Prompt", icon: HiSparkles, from: "from-fuchsia-500", to: "to-purple-600" },
    { id: "code", label: "Generate Code", icon: HiOutlineCodeBracket, from: "from-rose-500", to: "to-pink-600" },
  ];

  const quickTools = [
    { id: "screenshot", label: "Capture Screenshot", icon: HiOutlineCamera },
    { id: "save", label: "Save Prompt", icon: HiOutlineBookmark },
    { id: "copy", label: "Copy Prompt", icon: HiOutlineClipboardDocument },
    { id: "workspace", label: "Open AI Workspace", icon: HiOutlineSquares2X2 },
    { id: "settings", label: "Settings", icon: HiOutlineCog6Tooth },
  ];

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 160);
    el.style.height = `${next}px`;
  }, [prompt]);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleSave = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  };

  return (
    <div
      className="relative w-[400px] max-h-[600px] overflow-y-auto overflow-x-hidden bg-[#0A0B10] text-slate-100 font-sans antialiased rounded-3xl border border-white/10 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.8)]"
      role="region"
      aria-label="AI Assistant popup"
    >
      {/* Animated mesh gradient / blurred lights background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <motion.div
          className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-violet-600/30 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, 15, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-32 -right-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl"
          animate={{ x: [0, -15, 0], y: [0, 20, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-0 left-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <div className="absolute inset-0 bg-[#0A0B10]/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-orange-400 blur-md"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 shadow-lg">
                <HiSparkles className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] font-semibold tracking-tight text-white">Nova AI</h1>
                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-slate-300 border border-white/10">
                  v2.4.1
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[11px] text-slate-400">Online</span>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.08, rotate: 8 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Open settings"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <HiOutlineCog6Tooth className="h-4 w-4" />
          </motion.button>
        </header>

        <main className="px-5 py-4 flex flex-col gap-5">
          {/* SELECTED TEXT PREVIEW */}
          <AnimatePresence>
            {selectedTextVisible && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-3.5 overflow-hidden"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-violet-400 to-orange-400" />
                <div className="flex items-start justify-between gap-2 pl-2">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-1">
                      Selected on page
                    </p>
                    <p className="text-[12.5px] leading-relaxed text-slate-200 line-clamp-3">
                      {dummySelectedText}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTextVisible(false)}
                    aria-label="Dismiss selected text"
                    className="shrink-0 rounded-lg p-1 text-slate-500 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                  >
                    <HiOutlineXMark className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PROMPT TEXTAREA */}
          <div className="relative group">
            <motion.div
              className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500/0 via-fuchsia-500/0 to-orange-400/0 group-focus-within:from-violet-500/60 group-focus-within:via-fuchsia-500/50 group-focus-within:to-orange-400/60 blur-[2px] transition-all duration-500"
            />
            <div className="relative rounded-2xl bg-white/[0.045] border border-white/10 group-focus-within:border-transparent backdrop-blur-xl overflow-hidden">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                aria-label="Ask Nova AI anything"
                placeholder="Ask Nova anything, or drop in a task…"
                className="w-full resize-none bg-transparent px-4 pt-3.5 pb-10 text-[13.5px] leading-relaxed text-slate-100 placeholder:text-slate-500 focus:outline-none max-h-40"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <span className="text-[10px] text-slate-500 tabular-nums">{prompt.length}/2000</span>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!prompt.trim()}
                  aria-label="Send prompt"
                  className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-orange-400 text-white shadow-md disabled:opacity-30 disabled:grayscale focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                >
                  <HiOutlinePaperAirplane className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <section aria-labelledby="quick-actions-heading">
            <h2
              id="quick-actions-heading"
              className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5"
            >
              Quick Actions
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={action.label}
                    className={`group relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-3 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400`}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${action.from} ${action.to} opacity-0 group-hover:opacity-15 transition-opacity duration-300`}
                    />
                    <div
                      className={`pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-br ${action.from} ${action.to} opacity-0 group-hover:opacity-25 blur-xl transition-opacity duration-300`}
                    />
                    <Icon className="relative h-4 w-4 text-slate-200" />
                    <span className="relative text-[10.5px] font-medium text-slate-300 text-center leading-tight">
                      {action.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* RECENT HISTORY */}
          <section aria-labelledby="history-heading">
            <div className="flex items-center justify-between mb-2.5">
              <h2
                id="history-heading"
                className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400"
              >
                Recent History
              </h2>
              <HiOutlineClock className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              {recentHistory.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 3 }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 text-left hover:bg-white/[0.07] hover:border-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  <span className="truncate text-[12.5px] text-slate-300">{item.label}</span>
                  <span className="shrink-0 text-[10px] text-slate-500">{item.time}</span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* QUICK TOOLS */}
          <section aria-labelledby="tools-heading">
            <h2
              id="tools-heading"
              className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5"
            >
              Quick Tools
            </h2>
            <div className="flex flex-col gap-1.5">
              {quickTools.map((tool) => {
                const Icon = tool.icon;
                const isCopy = tool.id === "copy";
                const isSave = tool.id === "save";
                return (
                  <motion.button
                    key={tool.id}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={isCopy ? handleCopy : isSave ? handleSave : undefined}
                    aria-label={tool.label}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 hover:bg-white/[0.07] hover:border-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                      {isCopy && copied ? (
                        <HiOutlineCheck className="h-3.5 w-3.5 text-emerald-400" />
                      ) : isSave && savedFlash ? (
                        <HiOutlineCheck className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Icon className="h-3.5 w-3.5 text-slate-300" />
                      )}
                    </div>
                    <span className="text-[12.5px] text-slate-300">
                      {isCopy && copied ? "Copied!" : isSave && savedFlash ? "Saved!" : tool.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>
        </main>

        {/* BOTTOM SECTION */}
        <footer className="px-5 py-3.5 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              aria-label="Privacy policy"
              className="flex items-center gap-1 text-[10.5px] text-slate-500 hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded"
            >
              <HiOutlineShieldCheck className="h-3 w-3" />
              Privacy
            </button>
            <button
              aria-label="Help and support"
              className="flex items-center gap-1 text-[10.5px] text-slate-500 hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded"
            >
              <HiOutlineQuestionMarkCircle className="h-3 w-3" />
              Help
            </button>
          </div>
          <p className="text-[10px] text-slate-600">
            Made with <span className="text-rose-400">♥</span> · v2.4.1
          </p>
        </footer>
      </div>
    </div>
  );
}