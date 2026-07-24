// components/landing/AIModelsSection.jsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Bot,
  Cpu,
  Brain,
  Layers,
  Feather,
  Rocket,
  Globe,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const MODELS = [
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    icon: Sparkles,
    gradient: "from-blue-500 to-cyan-400",
    hex: "#3B82F6",
    description: "Balanced generalist for everyday work.",
    bestFor: "Everyday tasks & writing",
    speed: 4,
    intelligence: 88,
    context: "128K",
    price: "$$",
    responseTime: "0.9s",
    status: "online",
    stats: { speed: 82, reasoning: 85, coding: 80, writing: 92, vision: 76 },
  },
  {
    id: "claude-4",
    name: "Claude 4",
    icon: Bot,
    gradient: "from-purple-500 to-indigo-400",
    hex: "#8B5CF6",
    description: "Careful, deep reasoning with long context.",
    bestFor: "Analysis & long documents",
    speed: 3,
    intelligence: 94,
    context: "500K",
    price: "$$$",
    responseTime: "1.2s",
    status: "online",
    stats: { speed: 70, reasoning: 96, coding: 90, writing: 95, vision: 80 },
  },
  {
    id: "gemini-2.5",
    name: "Gemini 2.5 Pro",
    icon: Cpu,
    gradient: "from-cyan-400 to-blue-500",
    hex: "#22D3EE",
    description: "Natively multimodal across text, image, and video.",
    bestFor: "Vision & multimodal tasks",
    speed: 4,
    intelligence: 90,
    context: "1M",
    price: "$$",
    responseTime: "1.0s",
    status: "online",
    stats: { speed: 78, reasoning: 88, coding: 82, writing: 84, vision: 96 },
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    icon: Brain,
    gradient: "from-emerald-400 to-cyan-400",
    hex: "#34D399",
    description: "Open reasoning model tuned for math & logic.",
    bestFor: "Math, logic & research",
    speed: 3,
    intelligence: 91,
    context: "128K",
    price: "$",
    responseTime: "1.4s",
    status: "online",
    stats: { speed: 65, reasoning: 93, coding: 88, writing: 74, vision: 55 },
  },
  {
    id: "llama-3.3",
    name: "Llama 3.3",
    icon: Layers,
    gradient: "from-amber-400 to-orange-500",
    hex: "#F59E0B",
    description: "Open-weight model built for customization.",
    bestFor: "Fine-tuning & self-hosting",
    speed: 4,
    intelligence: 83,
    context: "128K",
    price: "Free",
    responseTime: "0.8s",
    status: "online",
    stats: { speed: 84, reasoning: 78, coding: 75, writing: 80, vision: 50 },
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    icon: Feather,
    gradient: "from-pink-500 to-rose-400",
    hex: "#EC4899",
    description: "Lightweight and fast for low-latency apps.",
    bestFor: "Low-latency production apps",
    speed: 5,
    intelligence: 80,
    context: "32K",
    price: "$",
    responseTime: "0.5s",
    status: "online",
    stats: { speed: 95, reasoning: 76, coding: 79, writing: 78, vision: 40 },
  },
  {
    id: "grok",
    name: "Grok",
    icon: Rocket,
    gradient: "from-red-500 to-pink-500",
    hex: "#EF4444",
    description: "Fast, opinionated, and tied to real-time knowledge.",
    bestFor: "Current events & trends",
    speed: 4,
    intelligence: 82,
    context: "100K",
    price: "$$",
    responseTime: "0.9s",
    status: "syncing",
    stats: { speed: 80, reasoning: 79, coding: 72, writing: 83, vision: 60 },
  },
  {
    id: "qwen",
    name: "Qwen",
    icon: Globe,
    gradient: "from-indigo-500 to-purple-400",
    hex: "#6366F1",
    description: "Strong multilingual understanding and generation.",
    bestFor: "Multilingual & translation",
    speed: 4,
    intelligence: 85,
    context: "32K",
    price: "Free",
    responseTime: "0.9s",
    status: "online",
    stats: { speed: 79, reasoning: 82, coding: 77, writing: 86, vision: 58 },
  },
];

const ORBIT_RADIUS_PERCENT = 40;

const ORBIT_POSITIONS = MODELS.map((_, i) => {
  const angle = (i / MODELS.length) * Math.PI * 2 - Math.PI / 2;
  return {
    left: 50 + ORBIT_RADIUS_PERCENT * Math.cos(angle),
    top: 50 + ORBIT_RADIUS_PERCENT * Math.sin(angle),
  };
});

// ---------------------------------------------------------------------------
// Background helpers (self-contained for this section)
// ---------------------------------------------------------------------------

function GlowOrb({ className, color, reduceMotion }) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn("absolute rounded-full blur-3xl", className)}
      style={{ backgroundColor: color }}
      animate={
        reduceMotion
          ? undefined
          : { scale: [1, 1.1, 1], opacity: [0.3, 0.45, 0.3] }
      }
      transition={
        reduceMotion
          ? undefined
          : { duration: 11, repeat: Infinity, ease: "easeInOut" }
      }
    />
  );
}

function Particles({ reduceMotion }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
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
// Model card
// ---------------------------------------------------------------------------

function SpeedDots({ speed }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Speed ${speed} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 w-1 rounded-full",
            i < speed ? "bg-neutral-200" : "bg-white/15"
          )}
        />
      ))}
    </div>
  );
}

function ModelCard({ model, active, onSelect, onHoverChange, style, variant }) {
  const Icon = model.icon;
  const isOrbit = variant === "orbit";

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(model.id)}
      onMouseEnter={() => onHoverChange?.(model.id)}
      onMouseLeave={() => onHoverChange?.(null)}
      onFocus={() => onHoverChange?.(model.id)}
      onBlur={() => onHoverChange?.(null)}
      aria-pressed={active}
      aria-label={`Select ${model.name} — ${model.bestFor}`}
      style={style}
      className={cn(
        "group relative flex flex-col items-center rounded-2xl border text-left backdrop-blur-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        isOrbit ? "w-[110px] p-2.5 sm:w-[124px] sm:p-3" : "w-[230px] shrink-0 snap-center p-4",
        active
          ? "border-white/25 bg-white/[0.09] shadow-xl shadow-black/40"
          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
      )}
      whileHover={{ scale: 1.06, y: -4 }}
      whileTap={{ scale: 0.96 }}
      animate={isOrbit ? { y: [0, -6, 0] } : undefined}
      transition={
        isOrbit
          ? { y: { duration: 4.5 + (model.speed % 3), repeat: Infinity, ease: "easeInOut" } }
          : { type: "spring", stiffness: 320, damping: 24 }
      }
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute -inset-px rounded-2xl opacity-70 blur-[6px]"
          style={{
            background: `linear-gradient(135deg, ${model.hex}55, transparent 70%)`,
          }}
        />
      )}

      <span className="relative flex flex-col items-center">
        <span
          className={cn(
            "flex items-center justify-center rounded-xl bg-gradient-to-br",
            model.gradient,
            isOrbit ? "h-8 w-8" : "h-10 w-10"
          )}
        >
          <Icon className={cn("text-white", isOrbit ? "h-4 w-4" : "h-5 w-5")} />
        </span>

        <span className={cn("mt-1.5 font-semibold text-white", isOrbit ? "text-[11px]" : "text-sm")}>
          {model.name}
        </span>

        <span className="mt-0.5 flex items-center gap-1 text-[10px] text-neutral-400">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              model.status === "online"
                ? "bg-emerald-400"
                : model.status === "syncing"
                ? "bg-amber-400"
                : "bg-neutral-500"
            )}
          />
          {model.status === "online" ? "Online" : model.status === "syncing" ? "Syncing" : "Offline"}
        </span>

        {!isOrbit && (
          <>
            <p className="mt-2.5 text-center text-[11.5px] leading-snug text-neutral-400">
              {model.description}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <SpeedDots speed={model.speed} />
              <span className="text-[10px] text-neutral-500">Speed</span>
            </div>
            <div className="mt-3 flex w-full items-center justify-between border-t border-white/10 pt-2.5 text-[10px] text-neutral-500">
              <span>{model.context} context</span>
              <span className="font-medium text-neutral-300">{model.price}</span>
            </div>
          </>
        )}
      </span>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// AI Hub (orbit center)
// ---------------------------------------------------------------------------

function AiHub({ model, reduceMotion }) {
  const Icon = model.icon;
  return (
    <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
      <div className="relative flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40">
        {!reduceMotion && (
          <>
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: `${model.hex}55` }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: `${model.hex}40` }}
              animate={{ scale: [1, 1.45, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </>
        )}

        <div className="relative flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] shadow-2xl shadow-black/50 backdrop-blur-2xl">
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br",
              model.gradient
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </span>
          <span className="text-[11px] font-semibold text-white">{model.name}</span>
          <span className="text-[9px] font-medium uppercase tracking-wider text-neutral-400">
            Routing live
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hover detail callout
// ---------------------------------------------------------------------------

function HoverDetail({ model }) {
  if (!model) return null;
  const Icon = model.icon;
  return (
    <motion.div
      key={model.id}
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="pointer-events-none absolute left-3 top-3 z-40 w-48 rounded-xl border border-white/10 bg-black/80 p-3 shadow-2xl backdrop-blur-xl sm:w-56"
    >
      <div className="flex items-center gap-2">
        <span className={cn("flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br", model.gradient)}>
          <Icon className="h-3.5 w-3.5 text-white" />
        </span>
        <span className="text-xs font-semibold text-white">{model.name}</span>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-neutral-400">{model.description}</p>
      <p className="mt-1.5 text-[10.5px] text-neutral-500">
        Best for <span className="text-neutral-300">{model.bestFor}</span>
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Radial intelligence gauge
// ---------------------------------------------------------------------------

function RadialScore({ value, hex }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
      <svg viewBox="0 0 48 48" className="h-14 w-14 -rotate-90">
        <circle cx="24" cy="24" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          stroke={hex}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute text-xs font-semibold text-white">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Comparison panel
// ---------------------------------------------------------------------------

function ComparisonPanel({ model }) {
  const metrics = [
    { label: "Speed", value: model.stats.speed },
    { label: "Reasoning", value: model.stats.reasoning },
    { label: "Coding", value: model.stats.coding },
    { label: "Writing", value: model.stats.writing },
    { label: "Vision", value: model.stats.vision },
  ];

  return (
    <div className="relative rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
            Comparing
          </p>
          <h3 className="mt-1 text-xl font-semibold text-white">{model.name}</h3>
          <p className="mt-1 text-xs text-neutral-400">{model.description}</p>
        </div>
        <RadialScore value={model.intelligence} hex={model.hex} />
      </div>

      <div className="space-y-3.5">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-neutral-400">
              <span>{m.label}</span>
              <span className="text-neutral-300">{m.value}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className={cn("h-full rounded-full bg-gradient-to-r", model.gradient)}
                animate={{ width: `${m.value}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-xs">
        <div>
          <p className="text-neutral-500">Context window</p>
          <p className="mt-0.5 font-medium text-white">{model.context}</p>
        </div>
        <div>
          <p className="text-neutral-500">Response time</p>
          <p className="mt-0.5 font-medium text-white">{model.responseTime}</p>
        </div>
        <div>
          <p className="text-neutral-500">Pricing</p>
          <p className="mt-0.5 font-medium text-white">{model.price}</p>
        </div>
        <div>
          <p className="text-neutral-500">Best for</p>
          <p className="mt-0.5 font-medium text-white">{model.bestFor}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export — AI Models Section
// ---------------------------------------------------------------------------

export default function AIModelsSection() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(MODELS[1].id);
  const [hoveredId, setHoveredId] = useState(null);

  const activeModel = MODELS.find((m) => m.id === activeId) ?? MODELS[0];
  const hoveredModel = MODELS.find((m) => m.id === hoveredId) ?? null;

  return (
    <section
      id="ai-models"
      aria-label="AI Models"
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
        <GlowOrb className="left-[-8%] top-[8%] h-[400px] w-[400px]" color="#8B5CF6" reduceMotion={reduceMotion} />
        <GlowOrb className="right-[-10%] top-[24%] h-[440px] w-[440px]" color="#22D3EE" reduceMotion={reduceMotion} />
        <GlowOrb className="bottom-[-10%] left-[35%] h-[360px] w-[360px]" color="#EC4899" reduceMotion={reduceMotion} />
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
          <span className="text-xs font-medium text-neutral-200">Multiple AI Models</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
        >
          Choose the{" "}
          <motion.span
            className="bg-[length:200%_auto] bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #3B82F6, #8B5CF6, #22D3EE, #3B82F6)",
            }}
            animate={reduceMotion ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "linear" }}
          >
            Best AI
          </motion.span>{" "}
          for Every Task
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg"
        >
          Switch instantly between the world&apos;s leading AI models — no
          new tabs, no lost context. One workspace, every model, routed to
          whatever the task needs.
        </motion.p>
      </div>

      {/* Main layout */}
      <div className="relative z-10 mx-auto mt-20 max-w-7xl px-6 sm:px-8">
        {/* Desktop: orbital hub */}
        <div className="hidden xl:grid xl:grid-cols-[1.15fr_0.85fr] xl:items-center xl:gap-14">
          <div className="relative mx-auto aspect-square w-full max-w-[620px]">
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {ORBIT_POSITIONS.map((pos, i) => {
                const m = MODELS[i];
                const active = m.id === activeId;
                return (
                  <motion.line
                    key={m.id}
                    x1="50"
                    y1="50"
                    x2={pos.left}
                    y2={pos.top}
                    stroke={active ? m.hex : "rgba(255,255,255,0.12)"}
                    strokeWidth={active ? 0.6 : 0.25}
                    animate={
                      active && !reduceMotion
                        ? { opacity: [0.4, 0.9, 0.4] }
                        : { opacity: active ? 0.7 : 0.3 }
                    }
                    transition={
                      active && !reduceMotion
                        ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.4 }
                    }
                  />
                );
              })}
            </svg>

            {ORBIT_POSITIONS.map((pos, i) => {
              const m = MODELS[i];
              return (
                <div
                  key={m.id}
                  className="absolute z-10"
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <ModelCard
                    model={m}
                    active={m.id === activeId}
                    onSelect={setActiveId}
                    onHoverChange={setHoveredId}
                    variant="orbit"
                  />
                </div>
              );
            })}

            <AiHub model={activeModel} reduceMotion={reduceMotion} />

            <AnimatePresence>
              {hoveredModel && <HoverDetail model={hoveredModel} />}
            </AnimatePresence>
          </div>

          <ComparisonPanel model={activeModel} />
        </div>

        {/* Tablet / mobile: swipeable row */}
        <div className="xl:hidden">
          <div
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
            role="list"
            aria-label="AI models"
          >
            {MODELS.map((m) => (
              <div key={m.id} role="listitem">
                <ModelCard
                  model={m}
                  active={m.id === activeId}
                  onSelect={setActiveId}
                  variant="row"
                />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <ComparisonPanel model={activeModel} />
          </div>
        </div>
      </div>
    </section>
  );
}