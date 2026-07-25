"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiGithub,
  FiUsers,
  FiActivity,
  FiShield,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  AreaChart,
  Area,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  Radar,
  BarChart,
  Bar,
} from "recharts";
import { useRouter } from "next/navigation";

/**
 * AuthForm.jsx
 * -------------------------------------------------------------------------
 * A single, self-contained authentication surface for an AI chat product.
 *
 * Design language: "Signal" — the product is presented as a living,
 * always-listening system. Every decorative chart reads as a faint pulse
 * of activity (a heartbeat, a waveform, a radar sweep) rather than as a
 * dashboard. The palette avoids both the common "warm cream + terracotta"
 * and "near-black + acid neon" AI-generated defaults in favor of a deep
 * indigo field with a periwinkle / coral / aqua triad.
 * -------------------------------------------------------------------------
 */

const SPARK_A = [
  { v: 4 }, { v: 7 }, { v: 5 }, { v: 9 }, { v: 6 }, { v: 11 }, { v: 8 }, { v: 13 }, { v: 10 }, { v: 15 },
];
const SPARK_B = [
  { v: 12 }, { v: 9 }, { v: 14 }, { v: 8 }, { v: 16 }, { v: 10 }, { v: 18 }, { v: 12 }, { v: 20 }, { v: 15 },
];
const BAR_PULSE = [
  { v: 3 }, { v: 8 }, { v: 5 }, { v: 12 }, { v: 7 }, { v: 14 }, { v: 6 }, { v: 10 }, { v: 4 }, { v: 9 },
];
const RADAR_FIELD = [
  { axis: "a", v: 80 }, { axis: "b", v: 62 }, { axis: "c", v: 90 }, { axis: "d", v: 55 },
  { axis: "e", v: 74 }, { axis: "f", v: 68 },
];
const RING_DATA = [{ name: "confidence", value: 92, fill: "url(#ringGradient)" }];

const PARTICLES = Array.from({ length: 22 }).map((_, i) => ({
  id: i,
  size: 2 + ((i * 7) % 5),
  left: (i * 47) % 100,
  top: (i * 31) % 100,
  delay: (i % 10) * 0.4,
  duration: 6 + (i % 6),
}));

function classNames(...c) {
  return c.filter(Boolean).join(" ");
}

export default function AuthForm() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ripples, setRipples] = useState([]);
  const rippleId = useRef(0);
const router=useRouter()
  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [touched, setTouched] = useState({});

  const updateField = (key) => (e) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const markTouched = (key) => () =>
    setTouched((t) => ({ ...t, [key]: true }));

  const validators = useMemo(
    () => ({
      name: (v) => v.trim().length >= 2,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      password: (v) => v.length >= 6,
      confirm: (v) => v.length > 0 && v === fields.password,
    }),
    [fields.password]
  );

  const fieldState = (key) => {
    if (!touched[key] || fields[key].length === 0) return "idle";
    return validators[key](fields[key]) ? "valid" : "invalid";
  };

  const spawnRipple = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleId.current++;
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => {
      setRipples((r) => r.filter((rp) => rp.id !== id));
    }, 650);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitted(false);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      router.push("/")
      setTimeout(() => setSubmitted(false), 1800);
    }, 1300);
  };

  const switchMode = (next) => {
    if (next === mode) return;
    setMode(next);
    setTouched({});
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0A0D18] text-[#F3F4FA] flex flex-col lg:flex-row font-[var(--af-body)]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        :root {
          --af-display: 'Space Grotesk', ui-sans-serif, sans-serif;
          --af-body: 'Inter', ui-sans-serif, sans-serif;
          --af-mono: 'JetBrains Mono', ui-monospace, monospace;
        }
        .af-display { font-family: var(--af-display); }
        .af-mono { font-family: var(--af-mono); }

        @keyframes af-grid-pan {
          0% { background-position: 0 0; }
          100% { background-position: 64px 64px; }
        }
        .af-grid {
          background-image:
            linear-gradient(to right, rgba(124,143,255,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(124,143,255,0.07) 1px, transparent 1px);
          background-size: 64px 64px;
          animation: af-grid-pan 26s linear infinite;
        }
        @keyframes af-blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.08); }
          66% { transform: translate(-25px, 25px) scale(0.94); }
        }
        @keyframes af-blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-45px, 30px) scale(1.12); }
        }
        .af-blob-1 { animation: af-blob-1 16s ease-in-out infinite; }
        .af-blob-2 { animation: af-blob-2 20s ease-in-out infinite; }

        @keyframes af-float {
          0%, 100% { transform: translateY(0); opacity: .35; }
          50% { transform: translateY(-18px); opacity: .9; }
        }
        @keyframes af-glow-pulse {
          0%, 100% { opacity: .55; filter: blur(0px); }
          50% { opacity: 1; filter: blur(0.5px); }
        }
        .af-signal-dot { animation: af-glow-pulse 2.4s ease-in-out infinite; }

        input:-webkit-autofill {
          -webkit-text-fill-color: #F3F4FA;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255,255,255,0.02) inset;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>

      {/* ================= LEFT — BRAND / SIGNAL PANEL ================= */}
      <div className="relative w-full lg:w-[45%] min-h-[420px] lg:min-h-screen flex flex-col justify-between overflow-hidden bg-[#0A0D18]">
        {/* background layers */}
        <div className="absolute inset-0 af-grid pointer-events-none" />
        <div
          className="af-blob-1 absolute -top-24 -left-16 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(124,143,255,0.35) 0%, rgba(124,143,255,0) 70%)",
            filter: "blur(10px)",
          }}
        />
        <div
          className="af-blob-2 absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,145,102,0.28) 0%, rgba(255,145,102,0) 70%)",
            filter: "blur(10px)",
          }}
        />
        {/* noise overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none mix-blend-overlay">
          <filter id="afNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#afNoise)" />
        </svg>

        {/* particles */}
        <div className="absolute inset-0 pointer-events-none">
          {PARTICLES.map((p) => (
            <span
              key={p.id}
              className="absolute rounded-full bg-[#9BAAFF]"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.left}%`,
                top: `${p.top}%`,
                animation: `af-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* faint orbital radar field, background layer */}
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] opacity-[0.18] pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={RADAR_FIELD} outerRadius="80%">
              <PolarGrid stroke="#7C8FFF" strokeOpacity={0.5} />
              <Radar dataKey="v" stroke="#5EEAD4" fill="#5EEAD4" fillOpacity={0.15} isAnimationActive />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* content */}
        <div className="relative z-10 flex flex-col justify-between h-full px-8 sm:px-12 py-10 lg:py-14">
          {/* logo mark with signature radial ring */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <div className="relative w-11 h-11 shrink-0">
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7C8FFF" />
                    <stop offset="100%" stopColor="#5EEAD4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="72%"
                    outerRadius="100%"
                    data={RING_DATA}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "rgba(255,255,255,0.06)" }} isAnimationActive />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-[3px] rounded-full bg-[#0A0D18] flex items-center justify-center">
                <span className="af-signal-dot w-2 h-2 rounded-full bg-[#5EEAD4] shadow-[0_0_10px_2px_rgba(94,234,212,0.8)]" />
              </div>
            </div>
            <span className="af-display text-lg font-semibold tracking-tight">Halo</span>
          </motion.div>

          {/* heading + description */}
          <div className="max-w-md mt-14 lg:mt-0">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="af-display text-4xl sm:text-5xl font-semibold leading-[1.08] tracking-tight"
            >
              Welcome to the
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9BAAFF] via-[#B7C2FF] to-[#5EEAD4]">
                future of AI
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
              className="mt-5 text-[15px] leading-relaxed text-[#AEB4CC] max-w-sm"
            >
              A single, quiet thread between you and a model that's always
              listening. No noise. No clutter. Just signal.
            </motion.p>

            {/* floating signal cards */}
            <div className="mt-10 flex flex-wrap gap-4">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                whileHover={{ y: -4 }}
                className="w-[168px] rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-center justify-between">
                  <span className="af-mono text-[11px] text-[#8D93AE]">latency</span>
                  <FiZap className="text-[#5EEAD4]" size={12} />
                </div>
                <div className="af-display text-lg mt-1">210ms</div>
                <div className="h-8 mt-1 -mx-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SPARK_A}>
                      <defs>
                        <linearGradient id="sparkA" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5EEAD4" stopOpacity={0.55} />
                          <stop offset="100%" stopColor="#5EEAD4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke="#5EEAD4" strokeWidth={1.5} fill="url(#sparkA)" isAnimationActive />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                whileHover={{ y: -4 }}
                className="w-[168px] rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] mt-6"
              >
                <div className="flex items-center justify-between">
                  <span className="af-mono text-[11px] text-[#8D93AE]">throughput</span>
                  <FiActivity className="text-[#FF9166]" size={12} />
                </div>
                <div className="af-display text-lg mt-1">1.8k/s</div>
                <div className="h-8 mt-1 -mx-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={BAR_PULSE}>
                      <Bar dataKey="v" radius={[2, 2, 0, 0]} fill="#FF9166" isAnimationActive />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                whileHover={{ y: -4 }}
                className="w-[168px] rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-center justify-between">
                  <span className="af-mono text-[11px] text-[#8D93AE]">sessions</span>
                  <FiUsers className="text-[#9BAAFF]" size={12} />
                </div>
                <div className="af-display text-lg mt-1">44,208</div>
                <div className="h-8 mt-1 -mx-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SPARK_B}>
                      <defs>
                        <linearGradient id="sparkB" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#9BAAFF" stopOpacity={0.55} />
                          <stop offset="100%" stopColor="#9BAAFF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke="#9BAAFF" strokeWidth={1.5} fill="url(#sparkB)" isAnimationActive />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>

          {/* trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-x-6 gap-y-2 mt-14 lg:mt-0"
          >
            <span className="flex items-center gap-1.5 text-xs text-[#9AA0BC]">
              <FiUsers size={13} className="text-[#7C8FFF]" /> 50K+ users
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#9AA0BC]">
              <FiActivity size={13} className="text-[#5EEAD4]" /> 99.9% uptime
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#9AA0BC]">
              <FiShield size={13} className="text-[#FF9166]" /> SOC2 secure
            </span>
          </motion.div>
        </div>
      </div>

      {/* ================= RIGHT — AUTH CARD ================= */}
      <div className="relative w-full lg:w-[55%] min-h-screen flex items-center justify-center px-6 py-12 sm:py-16 bg-[#0C0F1C]">
        <div
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,143,255,0.10), transparent 60%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[420px] rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-2xl p-7 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        >
          {/* toggle */}
          <div className="relative flex bg-white/[0.04] border border-white/10 rounded-full p-1 mb-8">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className="relative flex-1 py-2 text-sm font-medium rounded-full z-10 transition-colors"
                style={{ color: mode === m ? "#0A0D18" : "#B6BBD4" }}
              >
                {mode === m && (
                  <motion.span
                    layoutId="af-toggle-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9BAAFF] to-[#5EEAD4]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{m === "login" ? "Log in" : "Sign up"}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "login" ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "login" ? 16 : -16 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <h2 className="af-display text-2xl font-semibold tracking-tight">
                {mode === "login" ? "Good to see you again" : "Create your account"}
              </h2>
              <p className="text-sm text-[#9AA0BC] mt-1.5 mb-7">
                {mode === "login"
                  ? "Pick up right where your last thread left off."
                  : "Takes about a minute. No credit card needed."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {mode === "signup" && (
                  <FloatingInput
                    id="af-name"
                    label="Full name"
                    icon={<FiUser size={16} />}
                    value={fields.name}
                    onChange={updateField("name")}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => {
                      setFocusedField(null);
                      markTouched("name")();
                    }}
                    focused={focusedField === "name"}
                    state={fieldState("name")}
                    errorText="Enter at least 2 characters"
                    autoComplete="name"
                  />
                )}

                <FloatingInput
                  id="af-email"
                  label="Email address"
                  type="email"
                  icon={<FiMail size={16} />}
                  value={fields.email}
                  onChange={updateField("email")}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => {
                    setFocusedField(null);
                    markTouched("email")();
                  }}
                  focused={focusedField === "email"}
                  state={fieldState("email")}
                  errorText="Enter a valid email"
                  autoComplete="email"
                />

                <FloatingInput
                  id="af-password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  icon={<FiLock size={16} />}
                  value={fields.password}
                  onChange={updateField("password")}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => {
                    setFocusedField(null);
                    markTouched("password")();
                  }}
                  focused={focusedField === "password"}
                  state={fieldState("password")}
                  errorText="At least 6 characters"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  trailing={
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((s) => !s)}
                      className="text-[#8D93AE] hover:text-[#D7DAE8] transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  }
                />

                {mode === "signup" && (
                  <FloatingInput
                    id="af-confirm"
                    label="Confirm password"
                    type={showConfirm ? "text" : "password"}
                    icon={<FiLock size={16} />}
                    value={fields.confirm}
                    onChange={updateField("confirm")}
                    onFocus={() => setFocusedField("confirm")}
                    onBlur={() => {
                      setFocusedField(null);
                      markTouched("confirm")();
                    }}
                    focused={focusedField === "confirm"}
                    state={fieldState("confirm")}
                    errorText="Passwords don't match"
                    autoComplete="new-password"
                    trailing={
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirm((s) => !s)}
                        className="text-[#8D93AE] hover:text-[#D7DAE8] transition-colors"
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                      >
                        {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    }
                  />
                )}

                {mode === "login" ? (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-[13px] text-[#AEB4CC] cursor-pointer select-none">
                      <span
                        role="checkbox"
                        aria-checked={rememberMe}
                        tabIndex={0}
                        onClick={() => setRememberMe((r) => !r)}
                        onKeyDown={(e) => e.key === "Enter" && setRememberMe((r) => !r)}
                        className={classNames(
                          "w-4 h-4 rounded-[5px] border flex items-center justify-center transition-colors",
                          rememberMe
                            ? "bg-gradient-to-br from-[#9BAAFF] to-[#5EEAD4] border-transparent"
                            : "border-white/20 bg-white/[0.03]"
                        )}
                      >
                        {rememberMe && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            viewBox="0 0 12 12"
                            width="9"
                            height="9"
                          >
                            <path d="M2 6l2.5 2.5L10 3" stroke="#0A0D18" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        )}
                      </span>
                      Remember me
                    </label>
                    <a href="#" className="text-[13px] text-[#9BAAFF] hover:text-[#B7C2FF] transition-colors">
                      Forgot password?
                    </a>
                  </div>
                ) : (
                  <label className="flex items-start gap-2.5 text-[13px] text-[#AEB4CC] cursor-pointer select-none pt-1">
                    <span
                      role="checkbox"
                      aria-checked={agreeTerms}
                      tabIndex={0}
                      onClick={() => setAgreeTerms((a) => !a)}
                      onKeyDown={(e) => e.key === "Enter" && setAgreeTerms((a) => !a)}
                      className={classNames(
                        "mt-0.5 w-4 h-4 shrink-0 rounded-[5px] border flex items-center justify-center transition-colors",
                        agreeTerms
                          ? "bg-gradient-to-br from-[#9BAAFF] to-[#5EEAD4] border-transparent"
                          : "border-white/20 bg-white/[0.03]"
                      )}
                    >
                      {agreeTerms && (
                        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} viewBox="0 0 12 12" width="9" height="9">
                          <path d="M2 6l2.5 2.5L10 3" stroke="#0A0D18" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      )}
                    </span>
                    <span>
                      I agree to the{" "}
                      <a href="#" className="text-[#9BAAFF] hover:text-[#B7C2FF]">Terms</a> and{" "}
                      <a href="#" className="text-[#9BAAFF] hover:text-[#B7C2FF]">Privacy Policy</a>
                    </span>
                  </label>
                )}

                <SignalButton
                  type="submit"
                  disabled={mode === "signup" && !agreeTerms}
                  loading={isSubmitting}
                  success={submitted}
                  onRippleClick={spawnRipple}
                  ripples={ripples}
                >
                  {mode === "login" ? "Log in" : "Create account"}
                </SignalButton>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="h-px flex-1 bg-white/10" />
                <span className="af-mono text-[11px] text-[#7B81A0]">or continue with</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SocialButton icon={<FcGoogle size={18} />} label="Google" />
                <SocialButton icon={<FiGithub size={18} />} label="GitHub" />
              </div>

              <p className="text-center text-[13px] text-[#9AA0BC] mt-7">
                {mode === "login" ? (
                  <>
                    New here?{" "}
                    <button type="button" onClick={() => switchMode("signup")} className="text-[#9BAAFF] hover:text-[#B7C2FF] font-medium">
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button type="button" onClick={() => switchMode("login")} className="text-[#9BAAFF] hover:text-[#B7C2FF] font-medium">
                      Log in
                    </button>
                  </>
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* bottom links */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 text-[12px] text-[#6D7290]">
          <a href="#" className="hover:text-[#AEB4CC] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#AEB4CC] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#AEB4CC] transition-colors">Need help?</a>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Inline building blocks (kept in this file per the single-component     */
/* constraint — not exported, just local render helpers).                 */
/* ---------------------------------------------------------------------- */

function FloatingInput({
  id,
  label,
  type = "text",
  icon,
  value,
  onChange,
  onFocus,
  onBlur,
  focused,
  state,
  errorText,
  autoComplete,
  trailing,
}) {
  const isFloated = focused || value.length > 0;
  return (
    <div>
      <div
        className={classNames(
          "relative rounded-xl border bg-white/[0.03] transition-all duration-200",
          focused
            ? "border-[#7C8FFF] shadow-[0_0_0_3px_rgba(124,143,255,0.18)]"
            : state === "invalid"
            ? "border-[#FF6B6B]/60"
            : "border-white/10"
        )}
      >
        <div className="flex items-center gap-2.5 px-3.5 pt-5 pb-2">
          <span className={classNames("shrink-0 transition-colors", focused ? "text-[#9BAAFF]" : "text-[#7B81A0]")}>
            {icon}
          </span>
          <div className="relative flex-1">
            <label
              htmlFor={id}
              className={classNames(
                "absolute left-0 transition-all duration-200 pointer-events-none",
                isFloated ? "-top-[18px] text-[11px] text-[#8D93AE]" : "top-0 text-[14px] text-[#8D93AE]"
              )}
            >
              {label}
            </label>
            <input
              id={id}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              autoComplete={autoComplete}
              className="w-full bg-transparent outline-none text-[14px] text-[#F3F4FA] pt-1"
            />
          </div>
          {state === "valid" && <FiCheckCircle size={15} className="text-[#5EEAD4] shrink-0" />}
          {state === "invalid" && <FiAlertCircle size={15} className="text-[#FF6B6B] shrink-0" />}
          {trailing && <span className="shrink-0">{trailing}</span>}
        </div>
      </div>
      <AnimatePresence>
        {state === "invalid" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[11.5px] text-[#FF8A8A] mt-1.5 ml-1"
          >
            {errorText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function SignalButton({ children, disabled, loading, success, onRippleClick, ripples, ...props }) {
  return (
    <motion.button
      {...props}
      disabled={disabled || loading}
      onClick={(e) => {
        if (!disabled && !loading) onRippleClick(e);
      }}
      whileHover={!disabled ? { y: -2, boxShadow: "0 12px 30px rgba(124,143,255,0.35)" } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      className={classNames(
        "relative w-full overflow-hidden rounded-xl py-3 text-[14.5px] font-semibold mt-2 flex items-center justify-center gap-2 transition-opacity",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      )}
      style={{
        background: success
          ? "linear-gradient(90deg, #5EEAD4, #7C8FFF)"
          : "linear-gradient(90deg, #7C8FFF, #9BAAFF 45%, #5EEAD4)",
        color: "#0A0D18",
      }}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.45 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: r.x - 10, top: r.y - 10, width: 20, height: 20 }}
        />
      ))}
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-4 h-4 rounded-full border-2 border-[#0A0D18]/30 border-t-[#0A0D18] animate-spin"
          />
        ) : success ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <FiCheckCircle size={16} /> Done
          </motion.span>
        ) : (
          <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
            {children} <FiArrowRight size={15} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function SocialButton({ icon, label }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, borderColor: "rgba(255,255,255,0.22)" }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-[13.5px] font-medium text-[#D7DAE8] transition-colors"
    >
      {icon}
      {label}
    </motion.button>
  );
}