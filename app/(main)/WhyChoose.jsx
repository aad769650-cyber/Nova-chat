// components/landing/WhyChooseUs.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Users,
  FileSearch,
  Code2,
  Mic,
  Smartphone,
} from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const STATS = [
  { id: "users", value: 100, suffix: "K+", label: "Active Users" },
  { id: "uptime", value: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
  { id: "models", value: 50, suffix: "+", label: "AI Models" },
  { id: "conversations", value: 1, suffix: "M+", label: "Conversations Daily" },
];

const FEATURES = [
  {
    id: "fast",
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-second responses, even on the most demanding requests.",
    gradient: "from-blue-500 to-cyan-400",
    hex: "#3B82F6",
  },
  {
    id: "secure",
    icon: ShieldCheck,
    title: "Secure & Private",
    description: "Your conversations are encrypted end-to-end, always.",
    gradient: "from-emerald-400 to-cyan-400",
    hex: "#34D399",
  },
  {
    id: "models",
    icon: Cpu,
    title: "Multiple AI Models",
    description: "Switch between leading models instantly, mid-conversation.",
    gradient: "from-purple-500 to-indigo-400",
    hex: "#8B5CF6",
  },
  {
    id: "collab",
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work alongside your team with live cursors and shared chats.",
    gradient: "from-pink-500 to-rose-400",
    hex: "#EC4899",
  },
  {
    id: "analysis",
    icon: FileSearch,
    title: "File & Image Analysis",
    description: "Upload documents or images and get instant, deep insight.",
    gradient: "from-amber-400 to-orange-500",
    hex: "#F59E0B",
  },
  {
    id: "code",
    icon: Code2,
    title: "AI Code Assistant",
    description: "Inline suggestions and reviews across every major language.",
    gradient: "from-cyan-400 to-blue-500",
    hex: "#22D3EE",
  },
  {
    id: "voice",
    icon: Mic,
    title: "Voice Conversations",
    description: "Speak naturally and get fluid, real-time spoken responses.",
    gradient: "from-indigo-500 to-purple-400",
    hex: "#6366F1",
  },
  {
    id: "cross-platform",
    icon: Smartphone,
    title: "Cross Platform Access",
    description: "Pick up exactly where you left off — desktop, web, or mobile.",
    gradient: "from-blue-500 to-purple-500",
    hex: "#3B82F6",
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

function FloatingBubble({ className, delay, reduceMotion }) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        "absolute rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl",
        className
      )}
      animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
      transition={reduceMotion ? undefined : { duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

// ---------------------------------------------------------------------------
// Animated counter
// ---------------------------------------------------------------------------

function AnimatedCounter({ value, suffix = "", decimals = 0, reduceMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    let raf;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Left panel — sticky stats
// ---------------------------------------------------------------------------

function StatCard({ stat, reduceMotion, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-2xl"
      />
      <p className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
        <AnimatedCounter
          value={stat.value}
          suffix={stat.suffix}
          decimals={stat.decimals ?? 0}
          reduceMotion={reduceMotion}
        />
      </p>
      <p className="relative mt-1 text-xs text-neutral-400 sm:text-sm">{stat.label}</p>
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
        <span className="text-xs font-medium text-neutral-200">Why Choose Us</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl"
      >
        Why{" "}
        <motion.span
          className="bg-[length:200%_auto] bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, #3B82F6, #8B5CF6, #22D3EE, #3B82F6)",
          }}
          animate={reduceMotion ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "linear" }}
        >
          Thousands Choose
        </motion.span>{" "}
        Our AI Platform Every Day
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-5 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg"
      >
        Built for people who expect their tools to keep up — fast, secure,
        and flexible enough to handle whatever the day throws at it.
      </motion.p>

      <div className="mt-9 grid grid-cols-2 gap-4">
        {STATS.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} reduceMotion={reduceMotion} index={i} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Right panel — timeline feature stack
// ---------------------------------------------------------------------------

function FeatureCard({ feature, index, reduceMotion, onInView }) {
  const Icon = feature.icon;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (inView) onInView(index);
  }, [inView, index, onInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 28 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative pl-14 sm:pl-16"
    >
      {/* Connector node */}
      <span className="absolute left-0 top-6 flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">
        <motion.span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 rounded-full border-2 transition-colors duration-500",
            inView ? "border-transparent" : "border-white/15"
          )}
          style={inView ? { background: `linear-gradient(135deg, ${feature.hex}, transparent)` } : undefined}
        />
        <motion.span
          aria-hidden="true"
          className="relative h-2 w-2 rounded-full bg-white"
          animate={inView && !reduceMotion ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.6 }}
        />
      </span>

      <motion.div
        whileHover={
          reduceMotion
            ? undefined
            : { y: -6, scale: 1.015, transition: { type: "spring", stiffness: 300, damping: 22 } }
        }
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/30 backdrop-blur-xl transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06] sm:p-7"
      >
        {/* Animated border glow on hover */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-px rounded-3xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60 bg-gradient-to-br",
            feature.gradient
          )}
          style={{ zIndex: -1 }}
        />

        <div className="flex items-start gap-4">
          <motion.span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
              feature.gradient
            )}
            whileHover={reduceMotion ? undefined : { rotate: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <Icon className="h-5.5 w-5.5 text-white" />
          </motion.span>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">
              {feature.description}
            </p>

            <motion.span
              aria-hidden="true"
              className={cn("mt-4 block h-[2px] rounded-full bg-gradient-to-r", feature.gradient)}
              initial={{ width: "24px" }}
              whileHover={reduceMotion ? undefined : { width: "72px" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TimelineSpine({ progress }) {
  return (
    <div
      aria-hidden="true"
      className="absolute left-[18px] top-2 bottom-2 w-px bg-white/10 sm:left-5"
    >
      <motion.div
        className="absolute inset-x-0 top-0 w-px origin-top bg-gradient-to-b from-blue-400 via-purple-400 to-cyan-300"
        style={{ scaleY: progress, height: "100%" }}
      />
    </div>
  );
}

function RightPanel({ reduceMotion }) {
  const containerRef = useRef(null);
  const [litCount, setLitCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.4"],
  });
  const spineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const handleInView = (index) => {
    setLitCount((prev) => Math.max(prev, index + 1));
  };

  return (
    <div ref={containerRef} className="relative">
      <TimelineSpine progress={spineProgress} />

      <div className="space-y-7">
        {FEATURES.map((feature, i) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            index={i}
            reduceMotion={reduceMotion}
            onInView={handleInView}
          />
        ))}
      </div>

      <span className="sr-only" role="status">
        {litCount} of {FEATURES.length} reasons revealed
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export — Why Choose Us Section
// ---------------------------------------------------------------------------

export default function WhyChooseSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="why-choose-us"
      aria-label="Why Choose Us"
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
        <GlowOrb className="right-[-12%] top-[30%] h-[460px] w-[460px]" color="#8B5CF6" reduceMotion={reduceMotion} />
        <GlowOrb className="bottom-[-10%] left-[25%] h-[380px] w-[380px]" color="#22D3EE" reduceMotion={reduceMotion} />
        <Particles reduceMotion={reduceMotion} />

        <FloatingBubble className="left-[8%] top-[18%] h-16 w-16" delay={0} reduceMotion={reduceMotion} />
        <FloatingBubble className="right-[10%] top-[45%] h-24 w-24" delay={1.5} reduceMotion={reduceMotion} />
        <FloatingBubble className="left-[14%] bottom-[12%] h-12 w-12" delay={2.5} reduceMotion={reduceMotion} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <LeftPanel reduceMotion={reduceMotion} />
          <RightPanel reduceMotion={reduceMotion} />
        </div>
      </div>
    </section>
  );
}