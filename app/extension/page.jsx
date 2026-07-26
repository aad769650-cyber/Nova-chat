// extension/components/Popup.jsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSettings,
  FiCopy,
  FiCamera,
  FiExternalLink,
  FiClock,
  FiHelpCircle,
  FiShield,
  FiFileText,
  FiMessageSquare,
  FiEdit3,
  FiSend,
  FiCheck,
  FiBookmark,
  FiX,
  FiTrash2,
  FiPlusCircle,
} from "react-icons/fi";
import { HiSparkles, HiOutlineLanguage } from "react-icons/hi2";
import { BsCodeSlash } from "react-icons/bs";

// ---------------------------------------------------------------------------
// Everything below is hardcoded / in-memory — this component takes NO props.
// It is fully self-contained: every button and field actually works using
// React state (real clipboard writes, real send/history flow, real toggles).
// Nothing persists across a popup reload — wire chrome.storage.local (or your
// own backend) where noted if you need that.
// ---------------------------------------------------------------------------

const APP_NAME = "NovaChat";
const APP_VERSION = "v1.2.0";
const IS_ONLINE = true;

const SELECTED_TEXT_PREVIEW =
  "The mitochondria is the powerhouse of the cell — it converts nutrients into ATP through a process called cellular respiration.";

const QUICK_ACTIONS = [
  {
    id: "summarize",
    label: "Summarize",
    icon: FiFileText,
    gradient: "from-violet-500 to-fuchsia-500",
    template: "Summarize the following:\n\n",
  },
  {
    id: "explain",
    label: "Explain",
    icon: FiMessageSquare,
    gradient: "from-cyan-500 to-blue-500",
    template: "Explain the following in simple terms:\n\n",
  },
  {
    id: "rewrite",
    label: "Rewrite",
    icon: FiEdit3,
    gradient: "from-amber-500 to-orange-500",
    template: "Rewrite the following to be clearer and more concise:\n\n",
  },
  {
    id: "translate",
    label: "Translate",
    icon: HiOutlineLanguage,
    gradient: "from-emerald-500 to-teal-500",
    template: "Translate the following to Spanish:\n\n",
  },
  {
    id: "improve",
    label: "Improve Prompt",
    icon: HiSparkles,
    gradient: "from-pink-500 to-rose-500",
    template: "Improve this prompt so it gets a better AI response:\n\n",
  },
  {
    id: "code",
    label: "Generate Code",
    icon: BsCodeSlash,
    gradient: "from-indigo-500 to-violet-500",
    template: "Write code that does the following:\n\n",
  },
];

const PLACEHOLDER_PROMPTS = [
  "Ask NovaChat anything…",
  "Summarize what's on this page…",
  "Draft a reply to this email…",
  "Explain this code snippet…",
];

const INITIAL_HISTORY = [
  { id: 1, text: "Summarize this changelog into 3 bullet points for release notes", time: "2m ago" },
  { id: 2, text: "Explain the difference between useMemo and useCallback", time: "18m ago" },
  { id: 3, text: "Rewrite this email to sound more concise and friendly", time: "1h ago" },
  { id: 4, text: "Translate this product description to Spanish", time: "3h ago" },
  { id: 5, text: "Generate a regex to validate international phone numbers", time: "Yesterday" },
];

const WORKSPACE_URL = "https://app.novachat.ai";

const INFO_PANELS = {
  privacy: {
    title: "Privacy",
    body:
      "NovaChat only reads page content when you trigger an action — nothing is captured passively. Prompts and history stay on this device unless you explicitly send them.",
  },
  help: {
    title: "Help",
    body:
      "Type a prompt and hit send, or use Quick Actions to pre-fill common tasks. Capture a screenshot or grab selected page text to give NovaChat more context.",
  },
};

export default function Popup() {
  const [prompt, setPrompt] = useState("");
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [activeAction, setActiveAction] = useState(null);
  const [copiedTool, setCopiedTool] = useState(null);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [savedCount, setSavedCount] = useState(0);
  const [sending, setSending] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [lastCapture, setLastCapture] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [infoPanel, setInfoPanel] = useState(null); // null | "privacy" | "help"
  const [autoSendOnEnter, setAutoSendOnEnter] = useState(true);
  const [soundOnSend, setSoundOnSend] = useState(false);
  const [toast, setToast] = useState(null); // { id, message }
  const textareaRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const nextHistoryId = useRef(INITIAL_HISTORY.length + 1);

  // Rotate placeholder copy while the field is empty and unfocused.
  useEffect(() => {
    if (prompt || focused) return;
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_PROMPTS.length);
    }, 2800);
    return () => clearInterval(id);
  }, [prompt, focused]);

  // Auto-resize the textarea to fit its content.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [prompt]);

  // Clean up any pending toast timeout on unmount.
  useEffect(() => () => clearTimeout(toastTimeoutRef.current), []);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimeoutRef.current);
    setToast({ id: Date.now(), message });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const focusTextarea = useCallback(() => {
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, []);

  // ---- Quick actions: pre-fill the prompt with a task template ----
  const handleQuickAction = useCallback(
    (action) => {
      setPrompt((prev) => (prev ? `${action.template}${prev}` : action.template));
      setActiveAction(action.id);
      focusTextarea();
      setTimeout(() => setActiveAction((curr) => (curr === action.id ? null : curr)), 600);
    },
    [focusTextarea]
  );

  // ---- Pull the dummy "selected page text" into the prompt ----
  const handleUseSelectedText = useCallback(() => {
    setPrompt((prev) => (prev ? `${prev}\n\n${SELECTED_TEXT_PREVIEW}` : SELECTED_TEXT_PREVIEW));
    focusTextarea();
    showToast("Selected text added to prompt");
  }, [focusTextarea, showToast]);

  // ---- Send: pushes the prompt into history and clears the field ----
  const handleSend = useCallback(() => {
    const trimmed = prompt.trim();
    if (!trimmed || sending) return;
    setSending(true);
    const entry = { id: nextHistoryId.current++, text: trimmed, time: "Just now" };
    setTimeout(() => {
      setHistory((prev) => [entry, ...prev].slice(0, 8));
      setPrompt("");
      setSending(false);
      showToast("Sent to NovaChat");
      if (soundOnSend && typeof window !== "undefined" && "AudioContext" in window) {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = 660;
          gain.gain.value = 0.05;
          osc.connect(gain).connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        } catch {
          // Audio isn't available in every host — sending still succeeds.
        }
      }
    }, 350);
  }, [prompt, sending, soundOnSend, showToast]);

  const handleTextareaKeyDown = useCallback(
    (e) => {
      if (autoSendOnEnter && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [autoSendOnEnter, handleSend]
  );

  // ---- Recent history: click to reload a past prompt ----
  const handleHistorySelect = useCallback(
    (item) => {
      setPrompt(item.text);
      focusTextarea();
    },
    [focusTextarea]
  );

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    showToast("History cleared");
  }, [showToast]);

  // ---- Per-row history actions: edit, delete, copy ----
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const handleStartEdit = useCallback((item) => {
    setEditingId(item.id);
    setEditingText(item.text);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingText("");
  }, []);

  const handleSaveEdit = useCallback(
    (id) => {
      const trimmed = editingText.trim();
      if (!trimmed) {
        showToast("Prompt can't be empty");
        return;
      }
      setHistory((prev) => prev.map((h) => (h.id === id ? { ...h, text: trimmed, time: "Edited just now" } : h)));
      setEditingId(null);
      setEditingText("");
      showToast("Prompt updated");
    },
    [editingText, showToast]
  );

  const handleDeleteHistoryItem = useCallback(
    (id) => {
      setHistory((prev) => prev.filter((h) => h.id !== id));
      showToast("Prompt deleted");
    },
    [showToast]
  );

  const handleCopyHistoryItem = useCallback(
    async (item) => {
      try {
        await navigator.clipboard?.writeText(item.text);
        showToast("Copied to clipboard");
      } catch {
        showToast("Couldn't access clipboard");
      }
    },
    [showToast]
  );

  // ---- Quick tools ----
  const handleCopyPrompt = useCallback(async () => {
    const textToCopy = prompt.trim() || SELECTED_TEXT_PREVIEW;
    try {
      await navigator.clipboard?.writeText(textToCopy);
      setCopiedTool("copy");
      showToast("Copied to clipboard");
    } catch {
      showToast("Couldn't access clipboard");
    }
    setTimeout(() => setCopiedTool((curr) => (curr === "copy" ? null : curr)), 1200);
  }, [prompt, showToast]);

  const handleSavePrompt = useCallback(() => {
    if (!prompt.trim()) {
      showToast("Nothing to save yet");
      return;
    }
    setSavedCount((c) => c + 1);
    setCopiedTool("save");
    showToast("Prompt saved");
    setTimeout(() => setCopiedTool((curr) => (curr === "save" ? null : curr)), 1200);
  }, [prompt, showToast]);

  const handleScreenshot = useCallback(() => {
    setCapturing(true);
    // Real extension environment: capture the visible tab via the Chrome API.
    if (typeof chrome !== "undefined" && chrome.tabs?.captureVisibleTab) {
      chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
        setCapturing(false);
        if (dataUrl) {
          setLastCapture(dataUrl);
          setCopiedTool("screenshot");
          showToast("Screenshot captured");
          setTimeout(() => setCopiedTool((curr) => (curr === "screenshot" ? null : curr)), 1200);
        } else {
          showToast("Couldn't capture the tab");
        }
      });
      return;
    }
    // Fallback outside the extension host, so the button still does something.
    setTimeout(() => {
      setCapturing(false);
      setLastCapture(null);
      setCopiedTool("screenshot");
      showToast("Screenshot captured (preview mode)");
      setTimeout(() => setCopiedTool((curr) => (curr === "screenshot" ? null : curr)), 1200);
    }, 700);
  }, [showToast]);

  const handleOpenWorkspace = useCallback(() => {
    window.open(WORKSPACE_URL, "_blank", "noopener,noreferrer");
  }, []);

  const quickTools = [
    { id: "screenshot", label: capturing ? "Capturing…" : "Capture", icon: FiCamera, onClick: handleScreenshot, disabled: capturing },
    { id: "save", label: "Save", icon: FiBookmark, onClick: handleSavePrompt },
    { id: "copy", label: "Copy", icon: FiCopy, onClick: handleCopyPrompt },
    { id: "workspace", label: "Workspace", icon: FiExternalLink, onClick: handleOpenWorkspace },
    { id: "settings", label: "Settings", icon: FiSettings, onClick: () => setSettingsOpen(true) },
  ];

  return (
    <div className="relative h-[600px] w-[400px] overflow-hidden rounded-3xl bg-[#0a0a0f] font-sans text-neutral-100 antialiased">
      {/* ---------------- Animated mesh background ---------------- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, -10, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-violet-600/30 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -25, 15, 0], y: [0, 20, -15, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 15, -20, 0], y: [0, -15, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>

      {/* ---------------- Scroll container ---------------- */}
      <div className="relative flex h-full flex-col overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
        {/* ---------------- Header ---------------- */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 blur-md"
                aria-hidden="true"
              />
              <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/30">
                <HiSparkles className="h-5 w-5 text-white" />
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-semibold tracking-tight text-white">{APP_NAME}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-neutral-300">
                  {APP_VERSION}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  {IS_ONLINE && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                      IS_ONLINE ? "bg-emerald-400" : "bg-neutral-500"
                    }`}
                  />
                </span>
                <span className="text-[11px] font-medium text-neutral-400">
                  {IS_ONLINE ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Open settings"
            onClick={() => setSettingsOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <FiSettings className="h-4 w-4" />
          </button>
        </motion.header>

        <div className="flex flex-col gap-5 px-5 py-5">
          {/* ---------------- Prompt textarea ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
            className="relative"
          >
            <motion.div
              animate={{
                boxShadow: focused
                  ? "0 0 0 1px rgba(167,139,250,0.6), 0 0 24px rgba(167,139,250,0.25)"
                  : "0 0 0 1px rgba(255,255,255,0.08), 0 0 0 rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl bg-white/[0.04] backdrop-blur-xl"
            >
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleTextareaKeyDown}
                rows={3}
                aria-label="Prompt input"
                placeholder={PLACEHOLDER_PROMPTS[placeholderIndex]}
                className="max-h-40 w-full resize-none bg-transparent px-4 py-3.5 text-[13.5px] leading-relaxed text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
              />
              <div className="flex items-center justify-between px-4 pb-3">
                <span className="text-[11px] text-neutral-500">
                  {prompt.length} characters
                  {autoSendOnEnter && <span className="ml-1.5 text-neutral-600">· Enter to send</span>}
                </span>
                <motion.button
                  type="button"
                  aria-label="Send prompt"
                  onClick={handleSend}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  disabled={!prompt.trim() || sending}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-md shadow-violet-500/30 transition-opacity disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {sending ? (
                      <motion.span
                        key="sending"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{ rotate: { repeat: Infinity, duration: 0.6, ease: "linear" } }}
                        className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white"
                      />
                    ) : (
                      <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <FiSend className="h-3.5 w-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* ---------------- Quick actions ---------------- */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            aria-label="Quick actions"
          >
            <h2 className="mb-2.5 px-0.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Quick Actions
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                const isActive = activeAction === action.id;
                return (
                  <motion.button
                    key={action.id}
                    type="button"
                    onClick={() => handleQuickAction(action)}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    aria-label={`Insert ${action.label} template`}
                    className="group relative flex flex-col items-center gap-1.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-2 py-3 text-center transition-colors hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                  >
                    <span
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${action.gradient} opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-25`}
                      aria-hidden="true"
                    />
                    <span
                      className={`relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} shadow-md`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isActive ? (
                          <motion.span
                            key="check"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                          >
                            <FiCheck className="h-4 w-4 text-white" />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="icon"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                          >
                            <Icon className="h-4 w-4 text-white" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span className="relative text-[11px] font-medium leading-tight text-neutral-300 group-hover:text-white">
                      {action.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          {/* ---------------- Selected text preview ---------------- */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            aria-label="Selected text from page"
          >
            <div className="mb-2.5 flex items-center justify-between px-0.5">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Selected Text
              </h2>
              <button
                type="button"
                onClick={handleUseSelectedText}
                className="flex items-center gap-1 text-[11px] font-medium text-violet-300 transition-colors hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <FiPlusCircle className="h-3 w-3" /> Use in prompt
              </button>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3.5">
              <div className="mb-2 flex items-center gap-1.5 text-violet-300">
                <FiFileText className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium">From current page</span>
              </div>
              <p className="line-clamp-3 text-[12.5px] leading-relaxed text-neutral-300">
                {SELECTED_TEXT_PREVIEW}
              </p>
            </div>
          </motion.section>

          {/* ---------------- Recent history ---------------- */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            aria-label="Recent history"
          >
            <div className="mb-2.5 flex items-center justify-between px-0.5">
              <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                <FiClock className="h-3 w-3" /> Recent
              </h2>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 transition-colors hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  <FiTrash2 className="h-3 w-3" /> Clear
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-center text-[12px] text-neutral-500">
                No history yet — sent prompts will show up here.
              </p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {history.map((item) => {
                  const isEditing = editingId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="group flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-white/[0.06] hover:bg-white/[0.04]"
                    >
                      {isEditing ? (
                        <>
                          <input
                            autoFocus
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(item.id);
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                            aria-label="Edit saved prompt"
                            className="min-w-0 flex-1 rounded-lg border border-violet-400/40 bg-white/[0.06] px-2 py-1.5 text-[12.5px] text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                          />
                          <button
                            type="button"
                            aria-label="Save changes"
                            onClick={() => handleSaveEdit(item.id)}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-emerald-400 hover:bg-emerald-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                          >
                            <FiCheck className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Cancel editing"
                            onClick={handleCancelEdit}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                          >
                            <FiX className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleHistorySelect(item)}
                            aria-label={`Reload prompt: ${item.text}`}
                            className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                          >
                            <span className="line-clamp-1 text-[12.5px] text-neutral-300">{item.text}</span>
                            <span className="shrink-0 text-[10.5px] text-neutral-500">{item.time}</span>
                          </button>

                          {/* Right-side row actions — appear on hover/focus, always reachable via keyboard */}
                          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                            <button
                              type="button"
                              aria-label="Edit prompt"
                              onClick={() => handleStartEdit(item)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                            >
                              <FiEdit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              aria-label="Copy prompt"
                              onClick={() => handleCopyHistoryItem(item)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                            >
                              <FiCopy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              aria-label="Delete prompt"
                              onClick={() => handleDeleteHistoryItem(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                            >
                              <FiTrash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>

          {/* ---------------- Quick tools ---------------- */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
            aria-label="Quick tools"
          >
            <h2 className="mb-2.5 px-0.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Quick Tools
            </h2>
            <div className="flex flex-wrap gap-2">
              {quickTools.map((tool) => {
                const Icon = tool.icon;
                const justDone = copiedTool === tool.id;
                return (
                  <motion.button
                    key={tool.id}
                    type="button"
                    onClick={tool.onClick}
                    disabled={tool.disabled}
                    whileHover={{ scale: tool.disabled ? 1 : 1.05 }}
                    whileTap={{ scale: tool.disabled ? 1 : 0.95 }}
                    aria-label={tool.label}
                    className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-[11.5px] font-medium text-neutral-300 transition-colors hover:bg-white/[0.08] hover:text-white disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {justDone ? (
                        <motion.span
                          key="done"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          className="flex items-center gap-1.5 text-emerald-400"
                        >
                          <FiCheck className="h-3.5 w-3.5" /> Done
                        </motion.span>
                      ) : (
                        <motion.span key="idle" className="flex items-center gap-1.5">
                          <Icon className="h-3.5 w-3.5" />
                          {tool.label}
                          {tool.id === "save" && savedCount > 0 && (
                            <span className="rounded-full bg-white/10 px-1.5 text-[10px] text-neutral-300">
                              {savedCount}
                            </span>
                          )}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
            {lastCapture && (
              <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                <img src={lastCapture} alt="Last screenshot capture" className="block w-full" />
              </div>
            )}
          </motion.section>
        </div>

        {/* ---------------- Bottom bar ---------------- */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-auto flex shrink-0 items-center justify-between border-t border-white/10 bg-white/[0.02] px-5 py-3 text-[11px] text-neutral-500"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setInfoPanel("privacy")}
              className="flex items-center gap-1 transition-colors hover:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <FiShield className="h-3 w-3" /> Privacy
            </button>
            <span className="text-neutral-700">•</span>
            <button
              type="button"
              onClick={() => setInfoPanel("help")}
              className="flex items-center gap-1 transition-colors hover:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <FiHelpCircle className="h-3 w-3" /> Help
            </button>
          </div>
          <span>
            {APP_VERSION} · Made with <span className="text-rose-400">❤</span>
          </span>
        </motion.footer>
      </div>

      {/* ---------------- Settings panel ---------------- */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-end bg-black/50 backdrop-blur-sm"
            onClick={() => setSettingsOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-3xl border-t border-white/10 bg-[#101018] p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Settings</h3>
                <button
                  type="button"
                  aria-label="Close settings"
                  onClick={() => setSettingsOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col divide-y divide-white/[0.06]">
                <div className="flex items-center justify-between gap-3 py-3">
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-medium text-neutral-100">Send on Enter</span>
                    <span className="text-[11px] text-neutral-500">
                      Enter sends your prompt, Shift+Enter adds a new line
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoSendOnEnter}
                    aria-label="Send on Enter"
                    onClick={() => setAutoSendOnEnter((v) => !v)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                      autoSendOnEnter ? "bg-gradient-to-r from-violet-500 to-cyan-400" : "bg-white/10"
                    }`}
                  >
                    <motion.span
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                        autoSendOnEnter ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3 py-3">
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-medium text-neutral-100">Sound on send</span>
                    <span className="text-[11px] text-neutral-500">
                      Play a soft chime when a prompt is sent
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundOnSend}
                    aria-label="Sound on send"
                    onClick={() => setSoundOnSend((v) => !v)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                      soundOnSend ? "bg-gradient-to-r from-violet-500 to-cyan-400" : "bg-white/10"
                    }`}
                  >
                    <motion.span
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                        soundOnSend ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleClearHistory();
                  setSettingsOpen(false);
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2.5 text-[12.5px] font-medium text-rose-300 transition-colors hover:bg-rose-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                <FiTrash2 className="h-3.5 w-3.5" /> Clear all history
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- Privacy / Help modal ---------------- */}
      <AnimatePresence>
        {infoPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
            onClick={() => setInfoPanel(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-2xl border border-white/10 bg-[#101018] p-5"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">{INFO_PANELS[infoPanel].title}</h3>
                <button
                  type="button"
                  aria-label={`Close ${INFO_PANELS[infoPanel].title}`}
                  onClick={() => setInfoPanel(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[12.5px] leading-relaxed text-neutral-300">{INFO_PANELS[infoPanel].body}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- Toast ---------------- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            transition={{ duration: 0.2 }}
            role="status"
            className="absolute bottom-16 left-1/2 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/90 px-4 py-2 text-[12px] font-medium text-white shadow-lg backdrop-blur-xl"
          >
            <FiCheck className="h-3.5 w-3.5 text-emerald-400" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}