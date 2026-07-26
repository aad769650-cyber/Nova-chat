// components/landing/HeroSection.jsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Play,
  Users,
  Gauge,
  Zap,
  Code2,
  Mic,
  ImageIcon,
  FileText,
  TrendingUp,
  BellRing,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const TRUST_ITEMS = [
  { icon: Users, label: "10K+ Users" },
  { icon: Gauge, label: "99.9% Uptime" },
  { icon: Zap, label: "Lightning Fast" },
];

const FLOATING_AVATARS = [
  "https://placehold.co/40x40/3B82F6/FFFFFF?text=A",
  "https://placehold.co/40x40/8B5CF6/FFFFFF?text=M",
  "https://placehold.co/40x40/22D3EE/0A0A0C?text=J",
  "https://placehold.co/40x40/F472B6/FFFFFF?text=R",
];

const AI_ANSWER_LINES = [
  "Revenue is up 42% quarter-over-quarter",
  "New signups crossed 10,000 this month",
  "Churn is down to 1.8%",
];

const WAVEFORM_BARS = [0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.3, 0.7, 0.45];

const ANALYTICS_BARS = [0.3, 0.55, 0.4, 0.75, 0.9, 0.6];

// ---------------------------------------------------------------------------
// Small internal building blocks
// ---------------------------------------------------------------------------

function GlowOrb({ className, color, x, y, reduceMotion }) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn("absolute rounded-full blur-3xl", className)}
      style={{ backgroundColor: color, x, y }}
      animate={
        reduceMotion
          ? undefined
          : { scale: [1, 1.12, 1], opacity: [0.35, 0.5, 0.35] }
      }
      transition={
        reduceMotion
          ? undefined
          : { duration: 10, repeat: Infinity, ease: "easeInOut" }
      }
    />
  );
}

function Particles({ reduceMotion }) {
  const particles = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 6 + 6,
      delay: Math.random() * 4,
    }))
  ).current;

  if (reduceMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/40"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.6, 0.15] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// RippleButton now renders as a real, navigable <Link> (via shadcn's asChild
// pattern) instead of a plain <button>, so it's clickable and routes somewhere.
function RippleButton({ children, className, href = "#", ariaLabel, ...props }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [
      ...prev,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
  }, []);

  return (
    <Button
      asChild
      className={cn("group relative overflow-hidden", className)}
      {...props}
    >
      <Link href={href} onClick={handleClick} aria-label={ariaLabel}>
        {children}
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-white/30"
            style={{ left: r.x, top: r.y, width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 18, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onAnimationComplete={() =>
              setRipples((prev) => prev.filter((p) => p.id !== r.id))
            }
          />
        ))}
      </Link>
    </Button>
  );
}

function FloatingCard({ children, className, delay = 0, floatY = 10, reduceMotion }) {
  return (
    <motion.div
      className={cn(
        "absolute rounded-2xl border border-white/10 bg-white/[0.05] p-3 shadow-2xl shadow-black/40 backdrop-blur-xl",
        className
      )}
      initial={{ opacity: 0, scale: 0.85, y: 24 }}
      animate={
        reduceMotion
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 1, scale: 1, y: [0, -floatY, 0] }
      }
      transition={
        reduceMotion
          ? { duration: 0.6, delay }
          : {
              opacity: { duration: 0.6, delay },
              scale: { duration: 0.6, delay },
              y: { duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay },
            }
      }
      whileHover={reduceMotion ? undefined : { scale: 1.05, y: -6 }}
    >
      {children}
    </motion.div>
  );
}

function CodeSnippetCard({ reduceMotion }) {
  return (
    <FloatingCard
      className="left-[0%] top-[6%] w-[190px] sm:w-[210px]"
      delay={0.2}
      floatY={8}
      reduceMotion={reduceMotion}
    >
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
        <Code2 className="h-3.5 w-3.5 text-blue-400" />
        response.jsx
      </div>
      <div className="space-y-1 font-mono text-[10px] leading-relaxed">
        <p className="text-purple-300">const <span className="text-neutral-200">reply</span> =</p>
        <p className="text-neutral-400">
          await <span className="text-cyan-300">ai.chat</span>(prompt)
        </p>
        <p className="text-emerald-300">// 214ms · streamed</p>
      </div>
    </FloatingCard>
  );
}

function VoiceWaveformCard({ reduceMotion }) {
  return (
    <FloatingCard
      className="bottom-[8%] left-[2%] w-[170px] sm:w-[190px]"
      delay={0.5}
      floatY={7}
      reduceMotion={reduceMotion}
    >
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
        <Mic className="h-3.5 w-3.5 text-cyan-300" />
        Voice input
      </div>
      <div className="flex h-8 items-end gap-[3px]">
        {WAVEFORM_BARS.map((h, i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-blue-500 to-cyan-300"
            style={{ height: `${h * 100}%` }}
            animate={reduceMotion ? undefined : { scaleY: [0.4, 1, 0.5, h] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 1.4 + i * 0.1, repeat: Infinity, ease: "easeInOut" }
            }
          />
        ))}
      </div>
    </FloatingCard>
  );
}

function ImageGenCard({ reduceMotion }) {
  return (
    <FloatingCard
      className="right-[-2%] top-[2%] w-[160px] sm:w-[180px]"
      delay={0.35}
      floatY={9}
      reduceMotion={reduceMotion}
    >
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
        <ImageIcon className="h-3.5 w-3.5 text-purple-300" />
        Generating image
      </div>
      <div className="relative overflow-hidden rounded-lg">
        <img
          src="https://placehold.co/180x110/1a1a24/8B5CF6?text=%20"
          alt="AI generated preview"
          className="h-16 w-full object-cover"
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={reduceMotion ? undefined : { x: ["-100%", "100%"] }}
          transition={
            reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "linear" }
          }
        />
      </div>
    </FloatingCard>
  );
}

function FileUploadCard({ reduceMotion }) {
  return (
    <FloatingCard
      className="bottom-[2%] right-[0%] w-[190px] sm:w-[210px]"
      delay={0.65}
      floatY={8}
      reduceMotion={reduceMotion}
    >
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
        <FileText className="h-3.5 w-3.5 text-blue-300" />
        quarterly-report.pdf
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-300"
          animate={reduceMotion ? { width: "70%" } : { width: ["10%", "95%", "10%"] }}
          transition={
            reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </div>
    </FloatingCard>
  );
}

function AnalyticsWidget({ reduceMotion }) {
  return (
    <FloatingCard
      className="right-[-6%] top-[42%] hidden w-[150px] xl:block"
      delay={0.8}
      floatY={6}
      reduceMotion={reduceMotion}
    >
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
        <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
        <span>+24% this week</span>
      </div>
      <div className="flex h-7 items-end gap-1">
        {ANALYTICS_BARS.map((h, i) => (
          <motion.span
            key={i}
            className="w-2 rounded-sm bg-gradient-to-t from-emerald-500/70 to-cyan-300/70"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: h }}
            style={{ height: "100%", transformOrigin: "bottom" }}
            transition={{ duration: 0.6, delay: 0.9 + i * 0.06 }}
          />
        ))}
      </div>
    </FloatingCard>
  );
}

function CollaboratorPresence({ reduceMotion }) {
  return (
    <motion.div
      className="absolute left-[44%] top-[26%] z-20 hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 backdrop-blur-xl xl:flex"
      initial={{ opacity: 0 }}
      animate={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, x: [0, 10, 0, -6, 0], y: [0, -6, 4, 0, 0] }
      }
      transition={
        reduceMotion
          ? { duration: 0.6, delay: 0.9 }
          : { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.9 }
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span className="text-[10px] font-medium text-neutral-300">Maya is typing…</span>
    </motion.div>
  );
}

function NotificationToast({ reduceMotion }) {
  return (
    <motion.div
      className="absolute left-[36%] top-[-3%] z-20 hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur-xl xl:flex"
      initial={{ opacity: 0, y: -8 }}
      animate={
        reduceMotion
          ? { opacity: 1, y: 0 }
          : { opacity: [0, 1, 1, 0], y: [-8, 0, 0, -8] }
      }
      transition={
        reduceMotion
          ? { duration: 0.6, delay: 1.1 }
          : { duration: 6, repeat: Infinity, ease: "easeInOut", times: [0, 0.15, 0.75, 1], delay: 1.1 }
      }
    >
      <BellRing className="h-3.5 w-3.5 text-cyan-300" />
      <span className="text-[10.5px] font-medium text-neutral-200">Response ready in 1.2s</span>
    </motion.div>
  );
}

function ConnectorLines({ reduceMotion }) {
  const paths = [
    "M50,50 Q30,35 15,20",
    "M50,50 Q68,35 85,18",
    "M50,50 Q30,65 12,80",
    "M50,50 Q70,65 88,82",
  ];
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 hidden h-full w-full lg:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="connector-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="url(#connector-gradient)"
          strokeWidth="0.3"
          strokeDasharray="1.5 2.5"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={
            reduceMotion
              ? { opacity: 0.35 }
              : { opacity: 0.35, strokeDashoffset: [0, -20] }
          }
          transition={
            reduceMotion
              ? { duration: 0.6, delay: 0.4 + i * 0.1 }
              : {
                  opacity: { duration: 0.6, delay: 0.4 + i * 0.1 },
                  strokeDashoffset: { duration: 3, repeat: Infinity, ease: "linear" },
                }
          }
        />
      ))}
    </svg>
  );
}

function CentralChatCard({ tiltX, tiltY, reduceMotion }) {
  const [phase, setPhase] = useState("thinking");

  useEffect(() => {
    let thinkingTimeout;
    const cycle = () => {
      setPhase("thinking");
      thinkingTimeout = setTimeout(() => setPhase("answered"), 1600);
    };
    cycle();
    const interval = setInterval(cycle, 6200);
    return () => {
      clearTimeout(thinkingTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      className="relative z-30 w-[280px] rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:w-[320px] lg:w-[360px]"
      style={reduceMotion ? undefined : { rotateX: tiltY, rotateY: tiltX }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400">
          <Bot className="h-4 w-4 text-white" />
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-neutral-100">AI Assistant</span>
          <span className="text-[10px] text-neutral-400">Active now</span>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-white/10 px-3.5 py-2 text-[12.5px] text-neutral-100">
          Can you summarize our Q3 growth in 3 bullets?
        </div>
      </div>

      <div className="mt-3">
        <AnimatePresence mode="wait">
          {phase === "thinking" ? (
            <motion.div
              key="thinking"
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
              exit={{ opacity: 0 }}
              className="space-y-1.5 rounded-2xl rounded-tl-sm bg-gradient-to-br from-blue-500/15 to-purple-500/15 px-3.5 py-3 text-[12px] text-neutral-200"
            >
              {AI_ANSWER_LINES.map((line) => (
                <p key={line} className="flex gap-1.5">
                  <span className="text-cyan-300">•</span>
                  {line}
                </p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main export — Hero Section
// ---------------------------------------------------------------------------

export default function HeroSection({
  startChattingHref = "/chat",
  watchDemoHref = "/demo",
} = {}) {
  const reduceMotion = useReducedMotion();

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mvY, { stiffness: 60, damping: 20 });

  const satelliteX = springX;
  const satelliteY = springY;
  const blobX = useTransform(springX, (v) => v * -0.4);
  const blobY = useTransform(springY, (v) => v * -0.4);
  const tiltX = useTransform(springX, [-24, 24], [-5, 5]);
  const tiltY = useTransform(springY, [-24, 24], [5, -5]);

  const handleMouseMove = useCallback(
    (e) => {
      if (reduceMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width - 0.5) * 48;
      const py = ((e.clientY - rect.top) / rect.height - 0.5) * 48;
      mvX.set(px);
      mvY.set(py);
    },
    [mvX, mvY, reduceMotion]
  );

  const handleMouseLeave = useCallback(() => {
    mvX.set(0);
    mvY.set(0);
  }, [mvX, mvY]);

  return (
    <section
      className="relative isolate min-h-screen w-full overflow-hidden bg-[#0A0A0C] text-white"
      aria-label="Hero"
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
        <GlowOrb
          className="left-[-10%] top-[-10%] h-[420px] w-[420px]"
          color="#3B82F6"
          x={blobX}
          y={blobY}
          reduceMotion={reduceMotion}
        />
        <GlowOrb
          className="right-[-12%] top-[10%] h-[460px] w-[460px]"
          color="#8B5CF6"
          x={blobX}
          y={blobY}
          reduceMotion={reduceMotion}
        />
        <GlowOrb
          className="bottom-[-14%] left-[20%] h-[380px] w-[380px]"
          color="#22D3EE"
          x={blobX}
          y={blobY}
          reduceMotion={reduceMotion}
        />
        <Particles reduceMotion={reduceMotion} />
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-28 sm:px-8 lg:grid-cols-2 lg:gap-10 lg:py-32">
        {/* LEFT — content */}
        <div className="flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 backdrop-blur-xl"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            <span className="text-xs font-medium text-neutral-200">
              Next-Generation AI Workspace
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-[4.2rem]"
          >
            <span className="block text-neutral-50">The AI workspace</span>
            <span className="block">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
                that thinks as fast
              </span>
            </span>
            <span className="block text-neutral-50">as you do.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg"
          >
            Chat, code, generate, and create — all in one intelligent
            workspace built for people who move fast and expect more from
            their tools.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <RippleButton
              href={startChattingHref}
              ariaLabel="Start chatting"
              className="h-12  rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 px-6 text-sm font-semibold text-white shadow-[0_0_40px_-8px_rgba(139,92,246,0.6)] transition-transform hover:scale-[1.02] hover:shadow-[0_0_55px_-6px_rgba(139,92,246,0.75)] active:scale-[0.98]"
            >
              <span>Start Chatting</span>
            </RippleButton>

            <Button
              asChild
              variant="outline"
              className="h-12 rounded-2xl border-white/15 bg-white/[0.03] px-6 text-sm font-semibold text-neutral-100 backdrop-blur-xl transition-colors hover:bg-white/[0.08]"
            >
              <Link href={watchDemoHref} aria-label="Watch demo" className="flex gap-2">
                <Play className="mr-1.5 h-4 w-4" />
                Watch Demo
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            {TRUST_ITEMS.map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-neutral-500" />
                <span className="text-xs font-medium text-neutral-400">{label}</span>
                {i < TRUST_ITEMS.length - 1 && (
                  <span className="ml-4 hidden h-4 w-px bg-white/10 sm:block" />
                )}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex items-center gap-3"
          >
            <div className="flex -space-x-2.5">
              {FLOATING_AVATARS.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  aria-hidden="true"
                  className="h-8 w-8 rounded-full ring-2 ring-[#0A0A0C]"
                  style={{ zIndex: FLOATING_AVATARS.length - i }}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              2,400+ builders joined this week
            </div>
          </motion.div>
        </div>

        {/* RIGHT — floating AI workspace composition */}
        <div
          className="relative mx-auto h-[420px] w-full max-w-[480px] sm:h-[480px] lg:h-[620px] lg:max-w-none"
          style={{ perspective: 1200 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <ConnectorLines reduceMotion={reduceMotion} />

          <motion.div
            className="absolute inset-0 hidden lg:block"
            style={{ x: satelliteX, y: satelliteY }}
          >
            <CodeSnippetCard reduceMotion={reduceMotion} />
            <VoiceWaveformCard reduceMotion={reduceMotion} />
            <ImageGenCard reduceMotion={reduceMotion} />
            <FileUploadCard reduceMotion={reduceMotion} />
            <AnalyticsWidget reduceMotion={reduceMotion} />
            <CollaboratorPresence reduceMotion={reduceMotion} />
            <NotificationToast reduceMotion={reduceMotion} />
          </motion.div>

          {/* Reduced set for mobile/tablet — repositioned, still layered */}
          <div className="absolute inset-0 lg:hidden">
            <div className="absolute left-[2%] top-[4%] w-[140px] sm:w-[160px]">
              <CodeSnippetCard reduceMotion={reduceMotion} />
            </div>
            <div className="absolute bottom-[6%] right-[2%] w-[150px] sm:w-[170px]">
              <FileUploadCard reduceMotion={reduceMotion} />
            </div>
          </div>

          <div className="flex h-full w-full items-center justify-center">
            <CentralChatCard tiltX={tiltX} tiltY={tiltY} reduceMotion={reduceMotion} />
          </div>
        </div>
      </div>
    </section>
  );
}