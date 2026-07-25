// components/landing/PricingSection.jsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Check,
  X,
  Star,
  Users,
  Gauge,
  ShieldCheck,
  Rocket,
  Building2,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const PLANS = [
  {
    id: "free",
    name: "Free",
    tagline: "Perfect for beginners",
    icon: Sparkles,
    gradient: "from-neutral-500 to-neutral-400",
    monthly: 0,
    yearly: 0,
    cta: "Get Started",
    variant: "standard",
    features: [
      "Basic AI Chat",
      "3 AI Models",
      "100 Messages/day",
      "Community Support",
      "Standard Speed",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For power users who want it all",
    icon: Rocket,
    gradient: "from-blue-500 via-purple-500 to-cyan-400",
    monthly: 19,
    yearly: 15,
    cta: "Start Free Trial",
    variant: "featured",
    badge: "Most Popular",
    features: [
      "Unlimited AI Chat",
      "GPT-4.1, Claude 4, Gemini, DeepSeek",
      "Image Generation",
      "Voice Chat",
      "File Upload",
      "Priority Speed",
      "Chat History",
      "100 GB Storage",
    ],
  },
  {
    id: "team",
    name: "Team",
    tagline: "Built for teams that ship together",
    icon: Users,
    gradient: "from-purple-500 to-pink-400",
    monthly: 49,
    yearly: 39,
    cta: "Start Team Plan",
    variant: "standard",
    features: [
      "Everything in Pro",
      "Team Workspace",
      "Shared Chats",
      "Real-time Collaboration",
      "Team Analytics",
      "Admin Dashboard",
      "Permissions",
      "API Access",
      "Unlimited Storage",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Custom infrastructure at scale",
    icon: Building2,
    gradient: "from-cyan-400 to-blue-500",
    monthly: null,
    yearly: null,
    cta: "Contact Sales",
    variant: "standard",
    features: [
      "Dedicated Infrastructure",
      "SSO",
      "SLA",
      "Unlimited Users",
      "Custom AI Models",
      "White Label",
      "Security Compliance",
      "Dedicated Support",
    ],
  },
];

const COMPARISON_ROWS = [
  { label: "Messages", values: ["100/day", "Unlimited", "Unlimited", "Unlimited"] },
  { label: "Models", values: ["3 models", "All models", "All models", "Custom models"] },
  { label: "Image Generation", values: [false, true, true, true] },
  { label: "Voice", values: [false, true, true, true] },
  { label: "Storage", values: ["—", "100 GB", "Unlimited", "Unlimited"] },
  { label: "API", values: [false, false, true, true] },
  { label: "Collaboration", values: [false, false, true, true] },
  { label: "Priority Support", values: [false, true, true, "Dedicated"] },
  { label: "Security", values: ["Standard", "Standard", "Advanced", "Enterprise-grade"] },
];

const AVATARS = [
  "https://placehold.co/32x32/3B82F6/FFFFFF?text=A",
  "https://placehold.co/32x32/8B5CF6/FFFFFF?text=M",
  "https://placehold.co/32x32/22D3EE/0A0A0C?text=J",
  "https://placehold.co/32x32/F472B6/FFFFFF?text=R",
  "https://placehold.co/32x32/34D399/0A0A0C?text=K",
];

const FAQ_ITEMS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. There's no lock-in on any plan — cancel from your billing settings whenever you like, and you'll keep access until the end of your current billing period.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a full refund within 14 days of your first payment if you're not satisfied, no questions asked. Reach out to support and we'll process it right away.",
  },
  {
    q: "Can I switch plans later?",
    a: "Absolutely. You can upgrade or downgrade at any time, and we'll automatically prorate the difference on your next invoice.",
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
// Ripple button
// ---------------------------------------------------------------------------

function RippleButton({ children, className, onClick, ariaLabel, ...props }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      onClick?.(e);
    },
    [onClick]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={cn("group relative overflow-hidden", className)}
      {...props}
    >
      {children}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/30"
          style={{ left: r.x, top: r.y, width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 20, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onAnimationComplete={() => setRipples((prev) => prev.filter((p) => p.id !== r.id))}
        />
      ))}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Billing toggle
// ---------------------------------------------------------------------------

function BillingToggle({ billing, setBilling, reduceMotion }) {
  return (
    <div
      role="group"
      aria-label="Billing period"
      className="relative inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl"
    >
      {["monthly", "yearly"].map((period) => {
        const active = billing === period;
        return (
          <button
            key={period}
            type="button"
            onClick={() => setBilling(period)}
            aria-pressed={active}
            className={cn(
              "relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors sm:text-sm",
              active ? "text-black" : "text-neutral-400 hover:text-neutral-200"
            )}
          >
            {active && (
              <motion.span
                layoutId="billing-pill"
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-300"
                transition={
                  reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 34 }
                }
              />
            )}
            {period === "monthly" ? "Monthly" : "Yearly"}
            {period === "yearly" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                  active ? "bg-black/10 text-black" : "bg-emerald-400/15 text-emerald-300"
                )}
              >
                Save 20%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Animated price
// ---------------------------------------------------------------------------

function AnimatedPrice({ plan, billing }) {
  const isCustom = plan.monthly === null;
  const price = billing === "monthly" ? plan.monthly : plan.yearly;

  if (isCustom) {
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-white">Custom</span>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-lg font-semibold text-neutral-500">$</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${plan.id}-${billing}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          {price}
        </motion.span>
      </AnimatePresence>
      <span className="text-sm text-neutral-500">/mo</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gradient border wrapper (rotating ring for the featured plan)
// ---------------------------------------------------------------------------

function GradientBorderWrap({ children, animated, reduceMotion, className }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[28px] p-[1.5px]", className)}>
      {animated ? (
        <motion.div
          aria-hidden="true"
          className="absolute inset-[-40%]"
          style={{
            background:
              "conic-gradient(from 0deg, #3B82F6, #8B5CF6, #22D3EE, #3B82F6)",
          }}
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={
            reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: "linear" }
          }
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 rounded-[28px] bg-white/10" />
      )}
      <div className="relative h-full rounded-[26px] bg-[#0B0B0E]">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pricing card
// ---------------------------------------------------------------------------

function PricingCard({ plan, billing, reduceMotion }) {
  const Icon = plan.icon;
  const featured = plan.variant === "featured";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      whileHover={reduceMotion ? undefined : { y: -8 }}
      className={cn(
        "relative flex w-full shrink-0 snap-center flex-col",
        featured ? "lg:-mt-6 lg:mb-[-24px] lg:scale-[1.04]" : ""
      )}
      style={{ minWidth: 0 }}
    >
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="absolute -top-3.5 left-1/2 z-20 -translate-x-1/2"
        >
          <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-lg shadow-purple-500/30">
            <motion.span
              animate={reduceMotion ? undefined : { rotate: [0, 15, -15, 0] }}
              transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star className="h-3 w-3 fill-current" />
            </motion.span>
            {plan.badge}
          </span>
        </motion.div>
      )}

      <GradientBorderWrap animated={featured} reduceMotion={reduceMotion} className="h-full">
        <div
          className={cn(
            "flex h-full flex-col rounded-[26px] p-6 backdrop-blur-2xl sm:p-7",
            featured ? "bg-white/[0.06]" : "bg-white/[0.03]"
          )}
        >
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br",
              plan.gradient
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </span>

          <h3 className="mt-4 text-xl font-semibold text-white">{plan.name}</h3>
          <p className="mt-1 text-xs text-neutral-500">{plan.tagline}</p>

          <div className="mt-5">
            <AnimatedPrice plan={plan} billing={billing} />
          </div>

          <RippleButton
            ariaLabel={`${plan.cta} — ${plan.name} plan`}
            className={cn(
              "mt-6 flex h-11 w-full items-center justify-center gap-1.5 rounded-2xl text-sm font-semibold transition-transform active:scale-[0.98]",
              featured
                ? "bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white shadow-[0_0_35px_-8px_rgba(139,92,246,0.65)] hover:opacity-95"
                : "border border-white/15 bg-white/[0.04] text-neutral-100 hover:bg-white/[0.08]"
            )}
          >
            {plan.cta}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </RippleButton>

          <ul className="mt-7 flex-1 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13px] text-neutral-300">
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                    featured ? "bg-gradient-to-br from-blue-500 to-cyan-400" : "bg-white/10"
                  )}
                >
                  <Check className="h-2.5 w-2.5 text-white" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </GradientBorderWrap>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Comparison table
// ---------------------------------------------------------------------------

function ComparisonCell({ value }) {
  if (value === true) {
    return (
      <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15">
        <Check className="h-3 w-3 text-emerald-300" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-white/5">
        <X className="h-3 w-3 text-neutral-600" />
      </span>
    );
  }
  return <span className="text-xs text-neutral-300">{value}</span>;
}

function ComparisonTable() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-2xl sm:p-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">Plan feature comparison</caption>
          <thead>
            <tr>
              <th scope="col" className="p-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Feature
              </th>
              {PLANS.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  className="p-3 text-center text-xs font-semibold text-neutral-200"
                >
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <motion.tr
                key={row.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className={cn(i % 2 === 0 ? "bg-white/[0.015]" : "")}
              >
                <th scope="row" className="rounded-l-xl p-3 text-left text-[13px] font-medium text-neutral-300">
                  {row.label}
                </th>
                {row.values.map((v, j) => (
                  <td key={j} className={cn("p-3 text-center", j === row.values.length - 1 && "rounded-r-xl")}>
                    <ComparisonCell value={v} />
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Social proof
// ---------------------------------------------------------------------------

function SocialProof() {
  const stats = [
    { icon: Star, label: "4.9/5 Rating" },
    { icon: Users, label: "50,000+ Users" },
    { icon: Gauge, label: "99.9% Uptime" },
    { icon: ShieldCheck, label: "Trusted by Startups Worldwide" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-8 text-center backdrop-blur-2xl sm:flex-row sm:justify-between sm:text-left"
    >
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2.5">
          {AVATARS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden="true"
              className="h-8 w-8 rounded-full ring-2 ring-[#0A0A0C]"
              style={{ zIndex: AVATARS.length - i }}
            />
          ))}
        </div>
        <p className="text-sm text-neutral-400">
          Joined by teams at{" "}
          <span className="font-medium text-neutral-200">startups worldwide</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {stats.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
            <Icon className="h-3.5 w-3.5 text-neutral-500" />
            {label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// FAQ preview
// ---------------------------------------------------------------------------



// ---------------------------------------------------------------------------
// Main export — Pricing Section
// ---------------------------------------------------------------------------

export default function PricingSection() {
  const reduceMotion = useReducedMotion();
  const [billing, setBilling] = useState("monthly");

  return (
    <section
      id="pricing"
      aria-label="Pricing"
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
        <GlowOrb className="left-[-10%] top-[6%] h-[420px] w-[420px]" color="#3B82F6" reduceMotion={reduceMotion} />
        <GlowOrb className="right-[-12%] top-[26%] h-[460px] w-[460px]" color="#8B5CF6" reduceMotion={reduceMotion} />
        <GlowOrb className="bottom-[-10%] left-[30%] h-[380px] w-[380px]" color="#22D3EE" reduceMotion={reduceMotion} />
        <Particles reduceMotion={reduceMotion} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 backdrop-blur-xl"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            <span className="text-xs font-medium text-neutral-200">Transparent Pricing</span>
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
                backgroundImage: "linear-gradient(90deg, #3B82F6, #8B5CF6, #22D3EE, #3B82F6)",
              }}
              animate={reduceMotion ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "linear" }}
            >
              Perfect Plan
            </motion.span>{" "}
            for Your AI Journey
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-neutral-400 sm:text-lg"
          >
            Start free, upgrade when you need more. You can change or cancel
            your plan anytime — no long-term commitment required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex justify-center"
          >
            <BillingToggle billing={billing} setBilling={setBilling} reduceMotion={reduceMotion} />
          </motion.div>
        </div>

        {/* Pricing cards */}
        <div className="mt-16 lg:mt-20">
          <div
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="w-[85vw] max-w-[300px] shrink-0 snap-center lg:w-auto lg:max-w-none"
              >
                <PricingCard plan={plan} billing={billing} reduceMotion={reduceMotion} />
              </div>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <div className="mt-24">
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-center text-xl font-semibold text-white sm:text-2xl"
          >
            Compare every feature
          </motion.h3>
          <ComparisonTable />
        </div>

        {/* Social proof */}
        <div className="mt-16">
          <SocialProof />
        </div>

        {/* FAQ preview */}
      
      </div>
    </section>
  );
}