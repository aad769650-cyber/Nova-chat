// components/landing/FeatureDemo.jsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  MessageSquare,
  Cpu,
  Image as ImageIcon,
  FileText,
  Mic,
  Code2,
  UploadCloud,
  Users,
  Download,
  Play,
  CheckCircle2,
  Copy,
  RefreshCcw,
  Terminal,
  Bot,
  Wand2,
  Activity,
  ChevronRight,
} from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Feature registry
// ---------------------------------------------------------------------------

const FEATURES = [
  {
    id: "conversations",
    icon: MessageSquare,
    title: "Smart Conversations",
    description: "Natural, context-aware chat that remembers everything.",
  },
  {
    id: "models",
    icon: Cpu,
    title: "Multiple AI Models",
    description: "Switch models mid-conversation without losing context.",
  },
  {
    id: "image",
    icon: ImageIcon,
    title: "AI Image Generation",
    description: "Turn a prompt into production-ready visuals in seconds.",
  },
  {
    id: "document",
    icon: FileText,
    title: "AI Document Analysis",
    description: "Upload a file, get a summary and the key points instantly.",
  },
  {
    id: "voice",
    icon: Mic,
    title: "Voice Chat",
    description: "Speak naturally and see your words transcribed live.",
  },
  {
    id: "code",
    icon: Code2,
    title: "Code Assistant",
    description: "Inline suggestions, syntax highlighting, and a live terminal.",
  },
  {
    id: "upload",
    icon: UploadCloud,
    title: "File Upload",
    description: "Drag in files and track progress in real time.",
  },
  {
    id: "collab",
    icon: Users,
    title: "Real-time Collaboration",
    description: "See teammates' cursors and edits as they happen.",
  },
];

// ---------------------------------------------------------------------------
// Background helpers (self-contained for this section)
// ---------------------------------------------------------------------------

function GlowOrb({ className, color, reduceMotion }) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn("absolute rounded-full blur-3xl", className)}
      style={{ backgroundColor: color }}
      animate={reduceMotion ? undefined : { scale: [1, 1.1, 1], opacity: [0.28, 0.42, 0.28] }}
      transition={reduceMotion ? undefined : { duration: 11, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function Particles({ reduceMotion }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 6 + 6,
        delay: Math.random() * 4,
      })),
    []
  );
  if (reduceMotion) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/40"
          style={{ top: `${p.top}%`, left: `${p.left}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -16, 0], opacity: [0.15, 0.55, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Left nav
// ---------------------------------------------------------------------------

function FeatureNavItem({ feature, active, onSelect }) {
  const Icon = feature.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(feature.id)}
      aria-pressed={active}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        active
          ? "border-white/20 text-white"
          : "border-transparent text-neutral-400 hover:border-white/10 hover:text-neutral-200"
      )}
    >
      {active && (
        <motion.span
          layoutId="feature-active-bg"
          className="absolute inset-0 rounded-2xl border border-white/15 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-400/10"
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
        />
      )}

      <span
        className={cn(
          "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
          active
            ? "border-white/20 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400"
            : "border-white/10 bg-white/[0.04] group-hover:bg-white/[0.08]"
        )}
      >
        <Icon className={cn("h-4 w-4", active ? "text-white" : "text-neutral-400")} />
      </span>

      <span className="relative z-10 flex-1">
        <span className={cn("block text-sm font-semibold", active ? "text-white" : "text-neutral-200")}>
          {feature.title}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-neutral-500">
          {feature.description}
        </span>
      </span>

      <ChevronRight
        className={cn(
          "relative z-10 mt-1 h-3.5 w-3.5 shrink-0 transition-transform",
          active ? "translate-x-0 text-neutral-300" : "-translate-x-1 text-neutral-600 group-hover:translate-x-0"
        )}
      />
    </button>
  );
}

function MobileFeatureTabs({ features, activeId, onSelect }) {
  return (
    <div
      className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none" }}
      role="tablist"
      aria-label="Feature demo tabs"
    >
      {features.map((f) => {
        const Icon = f.icon;
        const active = f.id === activeId;
        return (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(f.id)}
            className={cn(
              "flex shrink-0 snap-center items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
              active
                ? "border-white/20 bg-white/[0.08] text-white"
                : "border-white/10 bg-white/[0.03] text-neutral-400"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {f.title}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Device frame shell
// ---------------------------------------------------------------------------

function DeviceFrame({ title, children }) {
  return (
    <div className="relative h-[460px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/50 backdrop-blur-2xl sm:h-[500px] lg:h-[540px]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-xs font-medium text-neutral-400">{title}</span>
      </div>
      <div className="relative h-[calc(100%-44px)] overflow-hidden p-5 sm:p-6">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. Smart Conversations preview
// ---------------------------------------------------------------------------

function ConversationsPreview() {
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    const t = setTimeout(() => setPhase("answered"), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-3 overflow-y-auto pr-1">
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-white/10 px-3.5 py-2 text-[13px] text-neutral-100">
            What's the fastest way to learn a new framework?
          </div>
        </div>

        <AnimatePresence mode="wait">
          {phase === "typing" ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-sm bg-gradient-to-br from-blue-500/15 to-purple-500/15 px-3.5 py-2.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-neutral-300"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="answered"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative w-fit max-w-[85%] space-y-1.5 rounded-2xl rounded-tl-sm bg-gradient-to-br from-blue-500/15 to-purple-500/15 px-3.5 py-3 text-[13px] leading-relaxed text-neutral-200"
            >
              <p>Build something small end-to-end instead of reading docs cover to cover:</p>
              <p>1. Ship a tiny real project · 2. Read source for patterns · 3. Rebuild it without looking.</p>

              <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[10px] text-neutral-300 hover:bg-white/15">
                  <Copy className="h-3 w-3" /> Copy
                </button>
                <button className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[10px] text-neutral-300 hover:bg-white/15">
                  <RefreshCcw className="h-3 w-3" /> Regenerate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["Explain simply", "Give an example", "Make it shorter"].map((p) => (
          <span
            key={p}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-neutral-400"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Multiple AI Models preview
// ---------------------------------------------------------------------------

const MODEL_OPTIONS = [
  { id: "gpt", label: "GPT-4.1", gradient: "from-blue-500 to-cyan-400" },
  { id: "claude", label: "Claude 4", gradient: "from-purple-500 to-indigo-400" },
  { id: "gemini", label: "Gemini 2.5", gradient: "from-cyan-400 to-blue-500" },
];

const MODEL_RESPONSES = {
  gpt: "Balanced and fast — great default for everyday writing and Q&A.",
  claude: "Slower, but noticeably deeper reasoning on long, nuanced questions.",
  gemini: "Natively understands images alongside text in the same thread.",
};

function ModelsPreview() {
  const [selected, setSelected] = useState("gpt");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
        {MODEL_OPTIONS.map((m) => {
          const active = m.id === selected;
          return (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={cn(
                "relative flex-1 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                active ? "text-black" : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              {active && (
                <motion.span
                  layoutId="model-preview-pill"
                  className={cn("absolute inset-0 rounded-xl bg-gradient-to-r", m.gradient)}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative z-10">{m.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br",
                  MODEL_OPTIONS.find((m) => m.id === selected).gradient
                )}
              >
                <Bot className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-xs font-semibold text-white">
                {MODEL_OPTIONS.find((m) => m.id === selected).label}
              </span>
              <span className="ml-auto rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                Switched in 180ms
              </span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-neutral-300">
              {MODEL_RESPONSES[selected]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. AI Image Generation preview
// ---------------------------------------------------------------------------

function ImageGenPreview() {
  const [generating, setGenerating] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setGenerating(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const images = [
    "https://placehold.co/200x200/1a1a24/3B82F6?text=%20",
    "https://placehold.co/200x200/1a1a24/8B5CF6?text=%20",
    "https://placehold.co/200x200/1a1a24/22D3EE?text=%20",
    "https://placehold.co/200x200/1a1a24/EC4899?text=%20",
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
        <Wand2 className="h-3.5 w-3.5 text-purple-300" />
        <span className="text-[12.5px] text-neutral-300">
          A bioluminescent forest at night, cinematic lighting
        </span>
      </div>

      <div className="mt-5 grid flex-1 grid-cols-2 gap-3">
        {images.map((src, i) => (
          <div
            key={src}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]"
          >
            <img src={src} alt="AI generated result" className="h-full w-full object-cover" />
            {generating && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                animate={{ x: ["-120%", "120%"] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: "linear", delay: i * 0.15 }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500">
          {generating ? "Generating 4 variations…" : "4 variations ready"}
        </span>
        <button
          disabled={generating}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-opacity",
            generating
              ? "cursor-not-allowed bg-white/5 text-neutral-600"
              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
          )}
        >
          <Download className="h-3.5 w-3.5" /> Download
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Document Analysis preview
// ---------------------------------------------------------------------------

function DocumentPreview() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15">
          <FileText className="h-4 w-4 text-red-300" />
        </span>
        <div>
          <p className="text-[12.5px] font-medium text-neutral-200">quarterly-report.pdf</p>
          <p className="text-[10.5px] text-neutral-500">24 pages · analyzed</p>
        </div>
        <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5"
      >
        <p className="text-[10.5px] font-medium uppercase tracking-wider text-neutral-500">
          AI Summary
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-300">
          Revenue grew 42% quarter-over-quarter, driven mainly by expansion
          in enterprise accounts and a drop in churn to 1.8%.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5"
      >
        <p className="text-[10.5px] font-medium uppercase tracking-wider text-neutral-500">
          Key Insights
        </p>
        <ul className="mt-1.5 space-y-1 text-[12px] text-neutral-400">
          <li>• Enterprise ARR up 58%</li>
          <li>• Support tickets down 21%</li>
          <li>• 3 new markets opened</li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-[12px] leading-relaxed text-neutral-500"
      >
        "...churn improved to{" "}
        <span className="rounded bg-cyan-400/20 px-1 text-cyan-200">1.8%, the lowest in company history</span>
        , largely due to..."
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. Voice Chat preview
// ---------------------------------------------------------------------------

const WAVEFORM_BARS = [0.3, 0.7, 0.5, 1, 0.4, 0.85, 0.35, 0.65, 0.5, 0.9, 0.3];
const TRANSCRIPT_WORDS =
  "Summarize the last three messages and turn them into a checklist".split(" ");

function VoicePreview({ reduceMotion }) {
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setWordCount(0);
    const interval = setInterval(() => {
      setWordCount((c) => (c < TRANSCRIPT_WORDS.length ? c + 1 : c));
    }, 220);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {!reduceMotion && (
          <motion.span
            className="absolute inset-0 rounded-full bg-cyan-400/20"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400">
          <Mic className="h-6 w-6 text-white" />
        </span>
      </div>

      <span className="text-xs font-medium text-neutral-400">Listening…</span>

      <div className="flex h-10 items-end gap-1">
        {WAVEFORM_BARS.map((h, i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-blue-500 to-cyan-300"
            style={{ height: `${h * 100}%` }}
            animate={reduceMotion ? undefined : { scaleY: [0.4, 1, 0.5, h] }}
            transition={
              reduceMotion ? undefined : { duration: 1.2 + i * 0.08, repeat: Infinity, ease: "easeInOut" }
            }
          />
        ))}
      </div>

      <p className="max-w-xs text-center text-[13px] leading-relaxed text-neutral-300">
        {TRANSCRIPT_WORDS.slice(0, wordCount).join(" ")}
        <motion.span
          className="ml-0.5 inline-block h-4 w-[2px] bg-cyan-300 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. Code Assistant preview
// ---------------------------------------------------------------------------

function CodePreview() {
  const [terminalLines, setTerminalLines] = useState([]);
  const fullTerminal = ["$ npm run build", "✓ compiled successfully", "✓ 0 type errors"];

  useEffect(() => {
    setTerminalLines([]);
    fullTerminal.forEach((line, i) => {
      setTimeout(() => setTerminalLines((prev) => [...prev, line]), 400 + i * 450);
    });
  }, []);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-3.5 font-mono text-[11.5px] leading-relaxed">
        <p>
          <span className="text-purple-300">function</span>{" "}
          <span className="text-cyan-300">debounce</span>
          <span className="text-neutral-300">(fn, delay) {"{"}</span>
        </p>
        <p className="pl-4 text-neutral-400">
          <span className="text-purple-300">let</span> timer;
        </p>
        <p className="pl-4 text-neutral-300">
          <span className="text-purple-300">return</span> (...args) {"=>"} {"{"}
        </p>
        <p className="pl-8 text-neutral-400">clearTimeout(timer);</p>
        <motion.p
          className="pl-8 text-neutral-600"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          timer = setTimeout(() {"=>"} fn(...args), delay);{" "}
          <span className="text-neutral-700">// AI suggestion</span>
        </motion.p>
        <p className="pl-4 text-neutral-300">{"};"}</p>
        <p className="text-neutral-300">{"}"}</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-[11px]">
        <div className="mb-1.5 flex items-center gap-1.5 text-neutral-500">
          <Terminal className="h-3 w-3" /> terminal
        </div>
        {terminalLines.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={i === 0 ? "text-neutral-300" : "text-emerald-400"}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 7. File Upload preview
// ---------------------------------------------------------------------------

function FileUploadPreview() {
  const files = [
    { name: "design-system.fig", size: "4.2 MB" },
    { name: "roadmap-q3.docx", size: "1.1 MB" },
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] text-center">
        <UploadCloud className="h-7 w-7 text-neutral-500" />
        <p className="text-[12.5px] text-neutral-400">Drag files here, or click to browse</p>
      </div>

      <div className="space-y-2.5">
        {files.map((f, i) => (
          <div key={f.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between text-[12px] text-neutral-300">
              <span className="font-medium">{f.name}</span>
              <span className="text-neutral-500">{f.size}</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.4 + i * 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 8. Real-time Collaboration preview
// ---------------------------------------------------------------------------

function CollaborationPreview({ reduceMotion }) {
  const activity = [
    "Maya edited the intro paragraph",
    "Sam added a new comment",
    "You resolved a thread",
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
        <div className="flex -space-x-2">
          {["M", "S", "R"].map((initial, i) => (
            <span
              key={initial}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0A0A0C] bg-gradient-to-br from-blue-500 to-purple-500 text-[10px] font-semibold text-white"
              style={{ zIndex: 3 - i }}
            >
              {initial}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> 3 online
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        <motion.div
          className="absolute left-6 top-8 flex items-center gap-1"
          animate={reduceMotion ? undefined : { x: [0, 40, 10, 0], y: [0, 20, 40, 0] }}
          transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="h-2 w-2 rounded-full bg-purple-400" />
          <span className="rounded-md bg-purple-400/20 px-1.5 py-0.5 text-[9px] text-purple-200">
            Maya
          </span>
        </motion.div>
        <motion.div
          className="absolute right-10 top-14 flex items-center gap-1"
          animate={reduceMotion ? undefined : { x: [0, -30, -5, 0], y: [0, -15, 10, 0] }}
          transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
          <span className="rounded-md bg-cyan-400/20 px-1.5 py-0.5 text-[9px] text-cyan-200">Sam</span>
        </motion.div>

        <div className="flex h-full items-center justify-center text-[11px] text-neutral-600">
          Shared document canvas
        </div>
      </div>

      <div className="space-y-2">
        {activity.map((a, i) => (
          <motion.div
            key={a}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i }}
            className="flex items-center gap-2 text-[11.5px] text-neutral-400"
          >
            <Activity className="h-3 w-3 text-neutral-600" />
            {a}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Preview registry + shared-motion variants
// ---------------------------------------------------------------------------

function getPreview(id, reduceMotion) {
  switch (id) {
    case "conversations":
      return <ConversationsPreview />;
    case "models":
      return <ModelsPreview />;
    case "image":
      return <ImageGenPreview />;
    case "document":
      return <DocumentPreview />;
    case "voice":
      return <VoicePreview reduceMotion={reduceMotion} />;
    case "code":
      return <CodePreview />;
    case "upload":
      return <FileUploadPreview />;
    case "collab":
      return <CollaborationPreview reduceMotion={reduceMotion} />;
    default:
      return null;
  }
}

const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction >= 0 ? 24 : -24, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (direction) => ({ opacity: 0, x: direction >= 0 ? -24 : 24, scale: 0.98 }),
};

// ---------------------------------------------------------------------------
// Main export — Feature Demo Section
// ---------------------------------------------------------------------------

export default function FeatureDemo() {
  const reduceMotion = useReducedMotion();
  const [[activeId, direction], setActiveState] = useState([FEATURES[0].id, 0]);

  const activeIndex = FEATURES.findIndex((f) => f.id === activeId);
  const activeFeature = FEATURES[activeIndex];

  const handleSelect = useCallback(
    (id) => {
      const newIndex = FEATURES.findIndex((f) => f.id === id);
      setActiveState(([currentId]) => {
        const currentIndex = FEATURES.findIndex((f) => f.id === currentId);
        return [id, newIndex > currentIndex ? 1 : -1];
      });
    },
    []
  );

  return (
    <section
      id="feature-demo"
      aria-label="Interactive Feature Demo"
      className="relative overflow-hidden bg-[#0A0A0C] py-28 text-white sm:py-32"
    >
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
        <GlowOrb className="left-[-10%] top-[10%] h-[420px] w-[420px]" color="#3B82F6" reduceMotion={reduceMotion} />
        <GlowOrb className="right-[-12%] top-[30%] h-[440px] w-[440px]" color="#8B5CF6" reduceMotion={reduceMotion} />
        <GlowOrb className="bottom-[-12%] left-[30%] h-[360px] w-[360px]" color="#22D3EE" reduceMotion={reduceMotion} />
        <Particles reduceMotion={reduceMotion} />
      </div>

      {/* Section header */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 backdrop-blur-xl"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
          <span className="text-xs font-medium text-neutral-200">Interactive Demo</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
        >
          Experience{" "}
          <motion.span
            className="bg-[length:200%_auto] bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #3B82F6, #8B5CF6, #22D3EE, #3B82F6)",
            }}
            animate={reduceMotion ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "linear" }}
          >
            AI
          </motion.span>{" "}
          Like Never Before
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg"
        >
          Every feature below is a real, working preview — not a screenshot.
          Click through and watch the interface respond.
        </motion.p>
      </div>

      {/* Main layout */}
      <div className="relative z-10 mx-auto mt-16 max-w-7xl px-6 sm:px-8">
        {/* Mobile tabs */}
        <div className="mb-6 lg:hidden">
          <MobileFeatureTabs features={FEATURES} activeId={activeId} onSelect={handleSelect} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr] lg:gap-10">
          {/* Left nav — desktop only */}
          <nav aria-label="Features" className="hidden flex-col gap-2 lg:flex">
            {FEATURES.map((f) => (
              <FeatureNavItem key={f.id} feature={f} active={f.id === activeId} onSelect={handleSelect} />
            ))}
          </nav>

          {/* Right preview */}
          <div className="relative">
            <DeviceFrame title={activeFeature.title}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeId}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="h-full"
                >
                  {getPreview(activeId, reduceMotion)}
                </motion.div>
              </AnimatePresence>
            </DeviceFrame>
          </div>
        </div>
      </div>
    </section>
  );
}