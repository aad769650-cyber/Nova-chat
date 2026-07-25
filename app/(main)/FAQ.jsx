// components/landing/FAQSection.jsx
"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Search,
  ChevronDown,
  Cpu,
  FileText,
  ShieldCheck,
  RefreshCcw,
  Users,
  Smartphone,
  Gift,
  XCircle,
  Code2,
  Moon,
  Headphones,
  Clock,
  Heart,
  Gauge,
  MessageCircle,
  BookOpen,
} from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const CATEGORIES = ["All", "General", "Pricing", "Security", "AI Models", "Billing", "Technical"];

const FAQ_ITEMS = [
  {
    id: "models",
    category: "AI Models",
    icon: Cpu,
    gradient: "from-blue-500 to-cyan-400",
    question: "What AI models are available?",
    answer:
      "You get access to GPT-4.1, Claude 4, Gemini 2.5, DeepSeek R1, Llama 3.3, Mistral Large, Grok, and Qwen — all inside the same workspace, with no need to juggle separate accounts or tabs.",
  },
  {
    id: "switch-models",
    category: "AI Models",
    icon: RefreshCcw,
    gradient: "from-purple-500 to-indigo-400",
    question: "Can I switch between AI models?",
    answer:
      "Yes. You can switch models mid-conversation without losing context — the new model picks up the full thread instantly, so you can compare responses or hand off to a model that's better suited to the task.",
  },
  {
    id: "upload",
    category: "General",
    icon: FileText,
    gradient: "from-amber-400 to-orange-500",
    question: "Can I upload PDFs and images?",
    answer:
      "Absolutely. Drag in PDFs, images, spreadsheets, or code files and the AI will read, summarize, and answer questions about them directly in the conversation.",
  },
  {
    id: "security",
    category: "Security",
    icon: ShieldCheck,
    gradient: "from-emerald-400 to-cyan-400",
    question: "Is my data secure?",
    answer:
      "Every conversation is encrypted in transit and at rest. We never use your private conversations to train models, and enterprise plans add SSO, audit logs, and configurable data retention.",
  },
  {
    id: "collab",
    category: "General",
    icon: Users,
    gradient: "from-pink-500 to-rose-400",
    question: "Does the application support team collaboration?",
    answer:
      "Team and Enterprise plans include shared workspaces, live cursors, shared chat history, and permission controls — so your whole team can work in the same conversation in real time.",
  },
  {
    id: "mobile",
    category: "Technical",
    icon: Smartphone,
    gradient: "from-cyan-400 to-blue-500",
    question: "Can I use it on mobile devices?",
    answer:
      "Yes — the app works fully in a mobile browser and also ships as a native app for iOS and Android, with your history and settings synced automatically across every device.",
  },
  {
    id: "free-plan",
    category: "Pricing",
    icon: Gift,
    gradient: "from-blue-500 to-purple-500",
    question: "Is there a free plan?",
    answer:
      "Yes. The Free plan includes basic chat, 3 AI models, and 100 messages a day — no credit card required. You can upgrade any time you need more capability.",
  },
  {
    id: "cancel",
    category: "Billing",
    icon: XCircle,
    gradient: "from-red-500 to-pink-500",
    question: "Can I cancel anytime?",
    answer:
      "There's no lock-in on any plan. Cancel from your billing settings whenever you like and you'll retain access until the end of your current billing period.",
  },
  {
    id: "api",
    category: "Technical",
    icon: Code2,
    gradient: "from-indigo-500 to-purple-400",
    question: "Do you provide API access?",
    answer:
      "Team and Enterprise plans include full REST API access with usage-based rate limits, so you can bring the same models into your own products and internal tools.",
  },
  {
    id: "dark-mode",
    category: "General",
    icon: Moon,
    gradient: "from-purple-500 to-cyan-400",
    question: "Is dark mode supported?",
    answer:
      "Dark mode is the default experience, and a light theme is available as well — your preference is saved to your account and applied automatically across devices.",
  },
];

const STATS = [
  { icon: Headphones, value: "24/7", label: "Support" },
  { icon: Clock, value: "<2min", label: "Avg. Response Time" },
  { icon: Heart, value: "100K+", label: "Happy Users" },
  { icon: Gauge, value: "99.9%", label: "Uptime" },
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
// Left side — illustration built from gradient shapes only
// ---------------------------------------------------------------------------

function SupportIllustration({ reduceMotion }) {
  return (
    <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/25 via-purple-500/20 to-transparent blur-2xl"
        animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
        transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-6 rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl"
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/30"
        animate={reduceMotion ? undefined : { rotate: [0, 6, -6, 0] }}
        transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <MessageCircle className="h-9 w-9 text-white" />
      </motion.div>

      <motion.div
        className="absolute right-4 top-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl"
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={reduceMotion ? undefined : { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <ShieldCheck className="h-4.5 w-4.5 text-emerald-300" />
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl"
        animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
        transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <Sparkles className="h-4 w-4 text-cyan-300" />
      </motion.div>

      <motion.div
        className="absolute bottom-2 right-10 h-4 w-4 rounded-full bg-gradient-to-br from-purple-400 to-cyan-300"
        animate={reduceMotion ? undefined : { y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
        transition={reduceMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function StatCard({ stat, index }) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl"
      />
      <Icon className="relative h-4 w-4 text-neutral-500" />
      <p className="relative mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
        {stat.value}
      </p>
      <p className="relative mt-0.5 text-xs text-neutral-400">{stat.label}</p>
    </motion.div>
  );
}

function LeftPanel({ reduceMotion }) {
  return (
    <div className="lg:sticky lg:top-28">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 backdrop-blur-xl"
      >
        <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
        <span className="text-xs font-medium text-neutral-200">Frequently Asked Questions</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl"
      >
        Everything You{" "}
        <motion.span
          className="bg-[length:200%_auto] bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, #3B82F6, #8B5CF6, #22D3EE, #3B82F6)",
          }}
          animate={reduceMotion ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "linear" }}
        >
          Need to Know
        </motion.span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-5 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg"
      >
        Search, filter by topic, or just browse — everything you need to
        know about models, pricing, and security lives right here.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-10 hidden lg:block"
      >
        <SupportIllustration reduceMotion={reduceMotion} />
      </motion.div>

      <div className="mt-10 grid grid-cols-2 gap-4">
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Right side — search, category tabs, accordion
// ---------------------------------------------------------------------------

function SearchInput({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search questions..."
        aria-label="Search frequently asked questions"
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 backdrop-blur-xl transition-colors focus:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      />
    </div>
  );
}

function CategoryTabs({ active, onChange, reduceMotion }) {
  return (
    <div
      role="tablist"
      aria-label="FAQ categories"
      className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none" }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat)}
            className={cn(
              "relative shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors sm:text-sm",
              isActive ? "text-black" : "text-neutral-400 hover:text-neutral-200"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="faq-category-pill"
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-300"
                transition={
                  reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 34 }
                }
              />
            )}
            {cat}
          </button>
        );
      })}
    </div>
  );
}

function FaqAccordionItem({ item, isOpen, onToggle, reduceMotion }) {
  const Icon = item.icon;
  const panelId = `faq-panel-${item.id}`;
  const triggerId = `faq-trigger-${item.id}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-colors duration-300",
        isOpen ? "border-white/20 bg-white/[0.06]" : "border-white/10 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-50 bg-gradient-to-br",
          item.gradient
        )}
        style={{ zIndex: -1 }}
      />

      <h3>
        <button
          type="button"
          id={triggerId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center gap-3.5 px-4 py-4 text-left sm:px-5 sm:py-5"
        >
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
              item.gradient
            )}
          >
            <Icon className="h-4 w-4 text-white" />
          </span>

          <span className="flex-1 text-[14.5px] font-medium text-neutral-100 sm:text-[15px]">
            {item.question}
          </span>

          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="shrink-0 text-neutral-500"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-5 pl-[3.75rem] text-sm leading-relaxed text-neutral-400 sm:px-5 sm:pl-[4.25rem]">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center"
    >
      <Search className="h-6 w-6 text-neutral-600" />
      <p className="text-sm text-neutral-500">No questions match your search.</p>
    </motion.div>
  );
}

function RightPanel({ reduceMotion }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [openId, setOpenId] = useState(FAQ_ITEMS[0].id);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesSearch =
        !q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <SearchInput value={search} onChange={setSearch} />
        <CategoryTabs active={category} onChange={setCategory} reduceMotion={reduceMotion} />
      </motion.div>

      <div className="mt-6 space-y-3.5">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <EmptyState key="empty" />
          ) : (
            filtered.map((item) => (
              <FaqAccordionItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                reduceMotion={reduceMotion}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bottom CTA
// ---------------------------------------------------------------------------

function SupportCta() {
  const links = [
    { label: "Contact Support", icon: Headphones, primary: true },
    { label: "Join Discord Community", icon: Users, primary: false },
    { label: "Documentation", icon: BookOpen, primary: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55 }}
      className="relative mt-20 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-400/10 p-8 text-center backdrop-blur-2xl sm:p-12"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl"
      />

      <h3 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Still have questions?
      </h3>
      <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-400 sm:text-base">
        Our team is here around the clock. Reach out directly, browse the
        docs, or join the community for real-time help.
      </p>

      <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {links.map(({ label, icon: Icon, primary }) => (
          <motion.button
            key={label}
            type="button"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-colors sm:w-auto",
              primary
                ? "bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white shadow-[0_0_35px_-8px_rgba(139,92,246,0.65)] hover:opacity-95"
                : "border border-white/15 bg-white/[0.04] text-neutral-100 hover:bg-white/[0.08]"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main export — FAQ Section
// ---------------------------------------------------------------------------

export default function FAQ() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
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
        <GlowOrb className="left-[-10%] top-[8%] h-[420px] w-[420px]" color="#3B82F6" reduceMotion={reduceMotion} />
        <GlowOrb className="right-[-12%] top-[28%] h-[460px] w-[460px]" color="#8B5CF6" reduceMotion={reduceMotion} />
        <GlowOrb className="bottom-[-10%] left-[30%] h-[380px] w-[380px]" color="#22D3EE" reduceMotion={reduceMotion} />
        <Particles reduceMotion={reduceMotion} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <LeftPanel reduceMotion={reduceMotion} />
          <RightPanel reduceMotion={reduceMotion} />
        </div>

        <SupportCta />
      </div>
    </section>
  );
}