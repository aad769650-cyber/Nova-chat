// src/components/MessageBubble.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCopy, FiCheck } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard unavailable — silently ignore for this MVP */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`group flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && (
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400">
          <HiSparkles className="h-3.5 w-3.5 text-white" />
        </span>
      )}
      <div className={`flex max-w-[75%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`relative rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
            isUser
              ? "rounded-tr-md bg-gradient-to-br from-violet-500 to-cyan-400 text-white"
              : "rounded-tl-md border border-white/[0.06] bg-white/[0.04] text-neutral-200"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
          <button
            type="button"
            aria-label="Copy message"
            onClick={handleCopy}
            className={`absolute -top-2.5 ${
              isUser ? "-left-2.5" : "-right-2.5"
            } flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-neutral-900 text-neutral-400 opacity-0 shadow-md transition-opacity hover:text-white group-hover:opacity-100`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span key="check" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}>
                  <FiCheck className="h-3 w-3 text-emerald-400" />
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}>
                  <FiCopy className="h-3 w-3" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
        <span className="px-1 text-[10.5px] text-neutral-500">{message.time}</span>
      </div>
    </motion.div>
  );
}
