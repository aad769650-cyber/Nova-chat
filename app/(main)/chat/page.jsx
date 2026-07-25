// components/chat/ChatWorkspace.jsx
"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  PiRobot,
  PiSparkle,
  PiPaperclip,
  PiMicrophone,
  PiArrowUp,
  PiCopy,
  PiCheck,
  PiThumbsUp,
  PiThumbsUpFill,
  PiArrowClockwise,
  PiCaretDown,
  PiX,
  PiStopFill,
  PiFileText,
  PiImage,
  PiCode,
  PiLightbulb,
} from "react-icons/pi";

// Runs before paint on the client (avoids a visible resize flash),
// falls back to a normal effect during SSR so it never warns.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SUGGESTIONS = [
  {
    icon: PiLightbulb,
    title: "Explain a concept",
    subtitle: "Break down quantum computing simply",
    prompt: "Explain quantum computing like I'm smart but new to it.",
  },
  {
    icon: PiCode,
    title: "Write some code",
    subtitle: "Debounce function in JavaScript",
    prompt: "Write a debounce function in JavaScript with comments.",
  },
  {
    icon: PiImage,
    title: "Brainstorm ideas",
    subtitle: "Names for a productivity app",
    prompt: "Brainstorm 10 creative names for a productivity app.",
  },
  {
    icon: PiFileText,
    title: "Summarize something",
    subtitle: "Turn notes into a clean recap",
    prompt: "Summarize the key points of a 20-minute meeting into 5 bullets.",
  },
];

const CANNED_RESPONSES = [
  "Here's a clean way to think about it: break the problem into the smallest piece that still matters, solve that piece well, then repeat. Most complexity disappears once you stop trying to solve everything at once.\n\nA few concrete next steps:\n1. Write down the single outcome you actually need.\n2. Cut anything that doesn't serve that outcome.\n3. Ship the smallest version, then iterate.",
  "That's a good question — the short answer is it depends on your constraints, but here's a solid default approach:\n\n• Start simple and measure before optimizing.\n• Prefer boring, well-understood tools over clever ones.\n• Leave yourself an easy way to change your mind later.\n\nWant me to go deeper on any of these?",
  "Sure, here's a straightforward implementation with explanations inline so it's easy to adapt:\n\n```js\nfunction debounce(fn, delay) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}\n```\n\nThis cancels any pending call whenever a new one comes in, so `fn` only runs once things go quiet for `delay` ms.",
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWorkspace() {
  const reduceMotion = useReducedMotion();

  // Each message carries its own lifecycle status:
  // user messages -> "done"
  // assistant messages -> "thinking" -> "streaming" -> "done"
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef(null);
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamIntervalRef = useRef(null);
  const scrollRafRef = useRef(null);
  const autoScrollingRef = useRef(false);
  const autoScrollTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const idCounterRef = useRef(0);
  const responseIndexRef = useRef(0);
  const pendingTimeoutsRef = useRef(new Set());

  const nextId = useCallback((prefix) => `${prefix}-${idCounterRef.current++}`, []);

  const trackTimeout = useCallback((timeoutId) => {
    pendingTimeoutsRef.current.add(timeoutId);
    return timeoutId;
  }, []);

  const clearTrackedTimeout = useCallback((timeoutId) => {
    clearTimeout(timeoutId);
    pendingTimeoutsRef.current.delete(timeoutId);
  }, []);

  // Cleanup everything in-flight on unmount — no state updates after this.
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      if (autoScrollTimeoutRef.current) clearTimeout(autoScrollTimeoutRef.current);
      pendingTimeoutsRef.current.forEach((t) => clearTimeout(t));
      pendingTimeoutsRef.current.clear();
    };
  }, []);

  // Auto-resize textarea — runs pre-paint so there's no visible collapse/snap.
  useIsoLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [input]);

  const isAnyThinking = messages.some((m) => m.status === "thinking");
  const isAnyStreaming = messages.some((m) => m.status === "streaming");
  const busy = isAnyThinking || isAnyStreaming;

  // Auto-scroll: instant while content is actively changing (streaming),
  // smooth for a deliberate send — avoids stacking smooth-scroll animations.
  useEffect(() => {
    if (showScrollButton) return;
    autoScrollingRef.current = true;
    bottomRef.current?.scrollIntoView({
      behavior: reduceMotion || busy ? "auto" : "smooth",
    });
    if (autoScrollTimeoutRef.current) clearTimeout(autoScrollTimeoutRef.current);
    autoScrollTimeoutRef.current = setTimeout(() => {
      autoScrollingRef.current = false;
    }, 300);
  }, [messages, showScrollButton, reduceMotion, busy]);

  const handleScroll = useCallback(() => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      if (autoScrollingRef.current) return;
      const el = scrollRef.current;
      if (!el) return;
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollButton(distanceFromBottom > 160);
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    autoScrollingRef.current = true;
    bottomRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    setShowScrollButton(false);
    if (autoScrollTimeoutRef.current) clearTimeout(autoScrollTimeoutRef.current);
    autoScrollTimeoutRef.current = setTimeout(() => {
      autoScrollingRef.current = false;
    }, 300);
  }, [reduceMotion]);

  const streamAssistantMessage = useCallback(
    (assistantId, fullText) => {
      let index = 0;
      const chunkSize = 3;

      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);

      streamIntervalRef.current = setInterval(() => {
        if (!isMountedRef.current) {
          clearInterval(streamIntervalRef.current);
          streamIntervalRef.current = null;
          return;
        }

        index += chunkSize;
        const partial = fullText.slice(0, index);
        const finished = index >= fullText.length;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: partial, status: finished ? "done" : "streaming" }
              : m
          )
        );

        if (finished) {
          clearInterval(streamIntervalRef.current);
          streamIntervalRef.current = null;
        }
      }, 18);
    },
    []
  );

  const stopStreaming = useCallback(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setMessages((prev) =>
      prev.map((m) => (m.status === "streaming" ? { ...m, status: "done" } : m))
    );
  }, []);

  const triggerAssistantResponse = useCallback(() => {
    const assistantId = nextId("a");
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date(), status: "thinking" },
    ]);

    const thinkingDelay = 900 + Math.random() * 500;
    const timeoutId = trackTimeout(
      setTimeout(() => {
        clearTrackedTimeout(timeoutId);
        if (!isMountedRef.current) return;

        const fullText = CANNED_RESPONSES[responseIndexRef.current % CANNED_RESPONSES.length];
        responseIndexRef.current += 1;

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, status: "streaming" } : m))
        );
        streamAssistantMessage(assistantId, fullText);
      }, thinkingDelay)
    );
  }, [nextId, trackTimeout, clearTrackedTimeout, streamAssistantMessage]);

  const handleSend = useCallback(
    (overrideText) => {
      const text = (overrideText ?? input).trim();
      if (!text && attachments.length === 0) return;
      if (busy) return;

      const userId = nextId("u");
      setMessages((prev) => [
        ...prev,
        {
          id: userId,
          role: "user",
          content: text,
          timestamp: new Date(),
          files: attachments,
          status: "done",
        },
      ]);

      setInput("");
      setAttachments([]);
      setShowScrollButton(false);
      triggerAssistantResponse();
    },
    [input, attachments, busy, nextId, triggerAssistantResponse]
  );

  const handleRegenerate = useCallback(
    (assistantId) => {
      if (busy) return;

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: "", status: "thinking" } : m))
      );

      const thinkingDelay = 700 + Math.random() * 400;
      const timeoutId = trackTimeout(
        setTimeout(() => {
          clearTrackedTimeout(timeoutId);
          if (!isMountedRef.current) return;

          const fullText = CANNED_RESPONSES[responseIndexRef.current % CANNED_RESPONSES.length];
          responseIndexRef.current += 1;

          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, status: "streaming" } : m))
          );
          streamAssistantMessage(assistantId, fullText);
        }, thinkingDelay)
      );
    },
    [busy, trackTimeout, clearTrackedTimeout, streamAssistantMessage]
  );

  const handleCopy = useCallback((id, content) => {
    navigator.clipboard?.writeText(content).catch(() => {});
    setCopiedId(id);
    setTimeout(() => {
      if (isMountedRef.current) setCopiedId((prev) => (prev === id ? null : prev));
    }, 1600);
  }, []);

  const handleLike = useCallback((id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
      if (e.key === "Escape") {
        setInput("");
      }
    },
    [handleSend]
  );

  const handleFileSelect = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
      setAttachments((prev) => [
        ...prev,
        ...files.map((f) => ({ id: nextId("file"), name: f.name, size: f.size })),
      ]);
      e.target.value = "";
    },
    [nextId]
  );

  const removeAttachment = useCallback((id) => {
    setAttachments((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const isEmpty = messages.length === 0;
  const canSend = (input.trim().length > 0 || attachments.length > 0) && !busy;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#0A0A0C] text-white">
      {/* Background layer */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
          animate={reduceMotion ? undefined : { scale: [1, 1.1, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={reduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"
          animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={reduceMotion ? undefined : { duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl"
          animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.18, 0.3, 0.18] }}
          transition={reduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Message area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative z-10 flex-1 overflow-y-auto scroll-smooth px-4 pb-6 pt-8 sm:px-6"
      >
        <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-8 py-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/30"
              >
                <PiRobot className="h-8 w-8 text-white" />
                {!reduceMotion && (
                  <motion.span
                    className="absolute inset-0 rounded-2xl border border-white/30"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  What's on your mind today?
                </h1>
                <p className="mt-2 text-sm text-neutral-400 sm:text-base">
                  Ask anything, paste some code, or drop in a file to get started.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {SUGGESTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.button
                      key={s.title}
                      type="button"
                      disabled={busy}
                      onClick={() => handleSend(s.prompt)}
                      whileHover={reduceMotion || busy ? undefined : { y: -3, scale: 1.01 }}
                      whileTap={busy ? undefined : { scale: 0.98 }}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                        <Icon className="h-4 w-4 text-cyan-300" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-neutral-100">{s.title}</span>
                        <span className="mt-0.5 block truncate text-xs text-neutral-500">{s.subtitle}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 pb-4">
              {messages.map((m) => {
                const isUser = m.role === "user";
                const isThinkingThis = m.status === "thinking";
                const isStreamingThis = m.status === "streaming";
                const isDoneAssistant = !isUser && m.status === "done";
                const isLiked = likedIds.has(m.id);
                const isCopied = copiedId === m.id;

                return (
                  <motion.div
                    key={m.id}
                    layout="position"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={`group flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isUser
                          ? "bg-gradient-to-br from-neutral-600 to-neutral-800 text-neutral-200"
                          : "bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 text-white"
                      }`}
                    >
                      {isUser ? "You" : <PiRobot className="h-4 w-4" />}
                    </span>

                    <div className={`flex max-w-[80%] flex-col ${isUser ? "items-end" : "items-start"}`}>
                      {isThinkingThis ? (
                        <div
                          role="status"
                          aria-live="polite"
                          className="flex items-center gap-1.5 rounded-3xl rounded-tl-lg border border-white/10 bg-white/[0.04] px-4 py-3.5 backdrop-blur-xl"
                        >
                          <span className="sr-only">Assistant is thinking…</span>
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="h-1.5 w-1.5 rounded-full bg-neutral-300"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div
                          className={
                            isUser
                              ? "rounded-3xl rounded-tr-lg bg-white/10 px-4 py-3 text-[14px] leading-relaxed text-neutral-100 shadow-lg shadow-black/20"
                              : "rounded-3xl rounded-tl-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] leading-relaxed text-neutral-200 shadow-xl shadow-black/30 backdrop-blur-xl"
                          }
                        >
                          {m.files && m.files.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-2">
                              {m.files.map((f) => (
                                <span
                                  key={f.id}
                                  className="flex items-center gap-1.5 rounded-lg bg-black/20 px-2 py-1 text-[11px] text-neutral-300"
                                >
                                  <PiFileText className="h-3 w-3" /> {f.name}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="whitespace-pre-wrap">
                            {m.content}
                            {isStreamingThis && (
                              <motion.span
                                className="ml-0.5 inline-block h-4 w-[2px] translate-y-[3px] bg-cyan-300 align-middle"
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                              />
                            )}
                          </div>
                        </div>
                      )}

                      <div
                        className={`mt-1.5 flex items-center gap-2 px-1 text-[11px] text-neutral-500 ${
                          isUser ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {!isThinkingThis && <span>{formatTime(m.timestamp)}</span>}

                        {isDoneAssistant && (
                          <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => handleCopy(m.id, m.content)}
                              aria-label="Copy message"
                              className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-white/10 hover:text-neutral-200"
                            >
                              {isCopied ? (
                                <PiCheck className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <PiCopy className="h-3 w-3" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleLike(m.id)}
                              aria-label="Like message"
                              aria-pressed={isLiked}
                              disabled={busy}
                              className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 ${
                                isLiked ? "text-cyan-300" : "text-neutral-500 hover:text-neutral-200"
                              }`}
                            >
                              {isLiked ? (
                                <PiThumbsUpFill className="h-3 w-3" />
                              ) : (
                                <PiThumbsUp className="h-3 w-3" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRegenerate(m.id)}
                              aria-label="Regenerate response"
                              disabled={busy}
                              className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-white/10 hover:text-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <PiArrowClockwise className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            type="button"
            onClick={scrollToBottom}
            aria-label="Scroll to latest message"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-32 left-1/2 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-neutral-200 shadow-xl backdrop-blur-xl hover:bg-white/15"
          >
            <PiCaretDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sticky input area */}
      <div className="relative z-10 border-t border-white/10 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/95 to-transparent px-4 pb-5 pt-4 sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          {attachments.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {attachments.map((f) => (
                <span
                  key={f.id}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-[11px] text-neutral-300"
                >
                  <PiFileText className="h-3 w-3 text-neutral-400" />
                  {f.name}
                  <button
                    type="button"
                    onClick={() => removeAttachment(f.id)}
                    aria-label={`Remove ${f.name}`}
                    className="ml-1 text-neutral-500 hover:text-neutral-200"
                  >
                    <PiX className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div
            className={`relative rounded-3xl border p-1.5 backdrop-blur-2xl transition-colors ${
              isFocused ? "border-transparent" : "border-white/10"
            }`}
          >
            <AnimatePresence>
              {isFocused && (
                <motion.span
                  key="focus-border"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400"
                  style={{ zIndex: 0 }}
                />
              )}
            </AnimatePresence>

            <div className="relative z-10 rounded-[22px] bg-[#0E0E12] px-2">
              <div className="flex items-end gap-2 py-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-hidden="true"
                  tabIndex={-1}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Attach file"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-100"
                >
                  <PiPaperclip className="h-4.5 w-4.5" />
                </button>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  rows={1}
                  placeholder="Message the assistant… (Shift + Enter for new line)"
                  aria-label="Message input"
                  className="max-h-[200px] min-h-[36px] flex-1 resize-none bg-transparent py-2 text-[14.5px] leading-relaxed text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setIsRecording((v) => !v)}
                  aria-label={isRecording ? "Stop recording" : "Start voice input"}
                  aria-pressed={isRecording}
                  className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isRecording
                      ? "bg-red-500/15 text-red-400"
                      : "text-neutral-400 hover:bg-white/10 hover:text-neutral-100"
                  }`}
                >
                  {isRecording && !reduceMotion && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-red-500/20"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <PiMicrophone className="relative h-4.5 w-4.5" />
                </button>

                <motion.button
                  type="button"
                  onClick={() => (isAnyStreaming ? stopStreaming() : handleSend())}
                  disabled={!canSend && !isAnyStreaming}
                  aria-label={isAnyStreaming ? "Stop generating" : "Send message"}
                  whileHover={(canSend || isAnyStreaming) && !reduceMotion ? { scale: 1.06 } : undefined}
                  whileTap={canSend || isAnyStreaming ? { scale: 0.94 } : undefined}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                    canSend || isAnyStreaming
                      ? "bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/30"
                      : "cursor-not-allowed bg-white/5 text-neutral-600"
                  }`}
                >
                  {isAnyStreaming ? <PiStopFill className="h-3.5 w-3.5" /> : <PiArrowUp className="h-4 w-4" />}
                </motion.button>
              </div>
            </div>
          </div>

          <p className="mt-2 flex items-center justify-center gap-1 text-center text-[11px] text-neutral-600">
            <PiSparkle className="h-3 w-3" />
            AI can make mistakes. Double-check important information.
          </p>
        </div>
      </div>
    </div>
  );
}