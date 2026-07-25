"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiArrowRight,
  FiArrowUp,
  FiSun,
  FiMoon,
  FiGlobe,
  FiChevronDown,
  FiCheck,
  FiShield,
  FiUsers,
  FiZap,
  FiMonitor,
} from "react-icons/fi";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaDiscord,
  FaYoutube,
  FaInstagram,
  FaApple,
  FaAndroid,
} from "react-icons/fa6";

/**
 * Footer.jsx
 * -------------------------------------------------------------------------
 * Closing section for the "Signal" AI product system — same language as
 * the auth surface: deep indigo field, periwinkle / aqua / coral triad,
 * Space Grotesk display + Inter body + JetBrains Mono for small data.
 * The footer is built as a destination, not an afterthought: a CTA band
 * that feels like its own hero, then a calm five-column archive, closed
 * with a status-bar-like bottom row.
 * -------------------------------------------------------------------------
 */

const PRODUCT_LINKS = ["Features", "AI Models", "Pricing", "Integrations", "API", "Updates", "Roadmap"];
const RESOURCE_LINKS = ["Documentation", "Blog", "Tutorials", "Community", "Help Center", "Developers", "Open Source"];
const COMPANY_LINKS = ["About", "Careers", "Partners", "Contact", "Privacy", "Terms", "Security"];

const SOCIALS = [
  { icon: FaGithub, label: "GitHub", href: "#" },
  { icon: FaLinkedin, label: "LinkedIn", href: "#" },
  { icon: FaXTwitter, label: "X / Twitter", href: "#" },
  { icon: FaDiscord, label: "Discord", href: "#" },
  { icon: FaYoutube, label: "YouTube", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FiMail, label: "Email", href: "mailto:hello@example.com" },
];

const DOWNLOAD_APPS = [
  { icon: FiGlobe, label: "Web" },
  { icon: FaAndroid, label: "Android" },
  { icon: FiMonitor, label: "Desktop" },
  { icon: FaApple, label: "iOS" },
];

const LANGUAGES = ["English", "Español", "Français", "Deutsch", "日本語"];

const TRUST_BADGES = ["SOC 2", "GDPR", "ISO 27001"];

const PARTICLES = Array.from({ length: 16 }).map((_, i) => ({
  id: i,
  size: 2 + ((i * 5) % 4),
  left: (i * 53) % 100,
  top: (i * 37) % 100,
  delay: (i % 8) * 0.5,
  duration: 7 + (i % 5),
}));

function classNames(...c) {
  return c.filter(Boolean).join(" ");
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [ripples, setRipples] = useState({});
  const rippleId = useRef(0);

  const spawnRipple = useCallback((key) => (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleId.current++;
    setRipples((r) => ({ ...r, [key]: [...(r[key] || []), { id, x, y }] }));
    setTimeout(() => {
      setRipples((r) => ({ ...r, [key]: (r[key] || []).filter((rp) => rp.id !== id) }));
    }, 650);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || subscribing) return;
    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 2200);
    }, 1100);
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative w-full overflow-hidden bg-[#0A0D18] text-[#F3F4FA] font-[var(--sf-body)]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        :root {
          --sf-display: 'Space Grotesk', ui-sans-serif, sans-serif;
          --sf-body: 'Inter', ui-sans-serif, sans-serif;
          --sf-mono: 'JetBrains Mono', ui-monospace, monospace;
        }
        .sf-display { font-family: var(--sf-display); }
        .sf-mono { font-family: var(--sf-mono); }

        @keyframes sf-grid-pan {
          0% { background-position: 0 0; }
          100% { background-position: 64px 64px; }
        }
        .sf-grid {
          background-image:
            linear-gradient(to right, rgba(124,143,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(124,143,255,0.06) 1px, transparent 1px);
          background-size: 64px 64px;
          animation: sf-grid-pan 30s linear infinite;
        }
        @keyframes sf-blob-1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(50px,-25px) scale(1.1); }
          66% { transform: translate(-30px,20px) scale(0.95); }
        }
        @keyframes sf-blob-2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-40px,25px) scale(1.12); }
        }
        .sf-blob-1 { animation: sf-blob-1 18s ease-in-out infinite; }
        .sf-blob-2 { animation: sf-blob-2 22s ease-in-out infinite; }

        @keyframes sf-float {
          0%, 100% { transform: translateY(0); opacity: .3; }
          50% { transform: translateY(-16px); opacity: .85; }
        }
        @keyframes sf-glow-pulse {
          0%, 100% { opacity: .55; }
          50% { opacity: 1; }
        }
        .sf-pulse-dot { animation: sf-glow-pulse 2.2s ease-in-out infinite; }

        .sf-underline {
          position: relative;
        }
        .sf-underline::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0%;
          height: 1px;
          background: linear-gradient(90deg, #9BAAFF, #5EEAD4);
          transition: width .25s ease;
        }
        .sf-underline:hover::after { width: 100%; }

        input:-webkit-autofill {
          -webkit-text-fill-color: #F3F4FA;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255,255,255,0.02) inset;
        }
      `}</style>

      {/* ================= CTA BAND ================= */}
      <div className="relative px-6 pt-24 pb-20 sm:pt-32 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 sf-grid pointer-events-none" />
        <div
          className="sf-blob-1 absolute top-0 left-1/4 w-[460px] h-[460px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,143,255,0.32) 0%, rgba(124,143,255,0) 70%)", filter: "blur(14px)" }}
        />
        <div
          className="sf-blob-2 absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(94,234,212,0.26) 0%, rgba(94,234,212,0) 70%)", filter: "blur(14px)" }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none mix-blend-overlay">
          <filter id="sfNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#sfNoise)" />
        </svg>
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
                animation: `sf-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12.5px] text-[#B7C2FF] backdrop-blur-xl">
            ✨ Ready to experience smarter AI?
          </span>
          <h2 className="sf-display mt-6 text-3xl sm:text-5xl font-semibold leading-[1.1] tracking-tight">
            Start building with the most
            <br className="hidden sm:block" />{" "}
            powerful{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9BAAFF] via-[#B7C2FF] to-[#5EEAD4]">
              AI workspace
            </span>{" "}
            today
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-[#AEB4CC] max-w-lg mx-auto">
            No setup fees, no long onboarding. Bring your team in and ship your
            first workflow before your coffee gets cold.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <RippleButton
              rippleKey="cta-primary"
              ripples={ripples}
              onRippleClick={spawnRipple}
              className="w-full sm:w-auto"
              style={{ background: "linear-gradient(90deg, #7C8FFF, #9BAAFF 45%, #5EEAD4)", color: "#0A0D18" }}
            >
              Start free <FiArrowRight size={15} />
            </RippleButton>
            <RippleButton
              rippleKey="cta-secondary"
              ripples={ripples}
              onRippleClick={spawnRipple}
              className="w-full sm:w-auto border border-white/15 bg-white/[0.03] text-[#F3F4FA] hover:bg-white/[0.06]"
              plain
            >
              Book a demo
            </RippleButton>
          </div>
        </motion.div>
      </div>

      {/* ================= MAIN FOOTER ================= */}
      <div className="relative border-t border-white/[0.07] px-6 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Column 1 — brand */}
          <div className="lg:col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C8FFF] to-[#5EEAD4] flex items-center justify-center shrink-0">
                <span className="sf-pulse-dot w-2 h-2 rounded-full bg-[#0A0D18]" />
              </div>
              <span className="sf-display text-lg font-semibold tracking-tight">Halo</span>
            </div>
            <p className="mt-4 text-[13.5px] leading-relaxed text-[#9AA0BC] max-w-[220px]">
              A quiet, always-listening AI workspace built for teams who ship.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6">
              <label htmlFor="sf-newsletter" className="sf-mono text-[11px] text-[#7B81A0] block mb-2">
                stay in the loop
              </label>
              <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-1 focus-within:border-[#7C8FFF] focus-within:shadow-[0_0_0_3px_rgba(124,143,255,0.18)] transition-all">
                <input
                  id="sf-newsletter"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent outline-none text-[13px] px-2.5 py-2 text-[#F3F4FA] placeholder:text-[#6D7290]"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="shrink-0 rounded-lg px-3 py-2 text-[12.5px] font-semibold flex items-center gap-1"
                  style={{ background: "linear-gradient(90deg, #7C8FFF, #5EEAD4)", color: "#0A0D18" }}
                  aria-label="Subscribe to newsletter"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {subscribing ? (
                      <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-3 h-3 rounded-full border-2 border-[#0A0D18]/30 border-t-[#0A0D18] animate-spin block" />
                    ) : subscribed ? (
                      <motion.span key="c" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                        <FiCheck size={14} />
                      </motion.span>
                    ) : (
                      <motion.span key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Subscribe
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </form>

            <div className="mt-6 flex items-center gap-2 text-[12.5px] text-[#9AA0BC]">
              <span className="relative flex h-2 w-2">
                <span className="sf-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#5EEAD4] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5EEAD4]" />
              </span>
              All systems operational
            </div>
          </div>

          <FooterColumn title="Product" links={PRODUCT_LINKS} />
          <FooterColumn title="Resources" links={RESOURCE_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />

          {/* Column 5 — social */}
          <div>
            <h3 className="sf-mono text-[11.5px] tracking-wide text-[#7B81A0] mb-4 uppercase">Follow us</h3>
            <div className="grid grid-cols-4 sm:grid-cols-3 gap-2.5">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -3, rotate: 8, borderColor: "rgba(124,143,255,0.5)" }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] text-[#B6BBD4] hover:text-[#F3F4FA] transition-colors"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* ============ EXTRA PREMIUM STRIP ============ */}
        <div className="max-w-6xl mx-auto mt-14 pt-10 border-t border-white/[0.06]">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Stat icon={<FiUsers size={13} className="text-[#9BAAFF]" />} label="online now" value="12,500+" />
              <Stat icon={<FiZap size={13} className="text-[#5EEAD4]" />} label="avg. response" value="1.2s" />
              <Stat icon={<FiShield size={13} className="text-[#FF9166]" />} label="platform" value="Operational" />
            </div>

            <div className="flex items-center gap-2">
              {TRUST_BADGES.map((b) => (
                <span
                  key={b}
                  className="sf-mono text-[10.5px] tracking-wide text-[#9AA0BC] border border-white/10 rounded-full px-2.5 py-1 bg-white/[0.02]"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <span className="sf-mono text-[11px] text-[#7B81A0] mr-1">get the app</span>
            {DOWNLOAD_APPS.map(({ icon: Icon, label }) => (
              <motion.button
                key={label}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-[#D7DAE8] hover:border-white/20 transition-colors"
              >
                <Icon size={13} /> {label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="relative border-t border-white/[0.07] px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5 text-[12.5px] text-[#8D93AE] text-center sm:text-left">
            <span>© {new Date().getFullYear()} Halo Labs, Inc.</span>
            <span className="hidden sm:inline text-[#3F4360]">•</span>
            <span>Made with ❤️ for AI developers</span>
          </div>

          <div className="flex items-center gap-5 text-[12.5px] text-[#8D93AE]">
            <a href="#" className="sf-underline hover:text-[#D7DAE8] transition-colors">Privacy</a>
            <a href="#" className="sf-underline hover:text-[#D7DAE8] transition-colors">Terms</a>
            <a href="#" className="sf-underline hover:text-[#D7DAE8] transition-colors">Cookies</a>
            <a href="#" className="sf-underline hover:text-[#D7DAE8] transition-colors">Status</a>
          </div>

          <div className="flex items-center gap-3">
            {/* language selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[12px] text-[#B6BBD4] hover:border-white/20 transition-colors"
              >
                <FiGlobe size={13} /> {language}
                <motion.span animate={{ rotate: langOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <FiChevronDown size={13} />
                </motion.span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    role="listbox"
                    className="absolute bottom-full mb-2 right-0 w-36 rounded-xl border border-white/10 bg-[#12162A]/95 backdrop-blur-xl p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.5)] z-20"
                  >
                    {LANGUAGES.map((l) => (
                      <li key={l}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={language === l}
                          onClick={() => {
                            setLanguage(l);
                            setLangOpen(false);
                          }}
                          className={classNames(
                            "w-full text-left px-2.5 py-1.5 rounded-lg text-[12.5px] flex items-center justify-between transition-colors",
                            language === l ? "text-[#F3F4FA] bg-white/[0.06]" : "text-[#9AA0BC] hover:bg-white/[0.04]"
                          )}
                        >
                          {l}
                          {language === l && <FiCheck size={12} className="text-[#5EEAD4]" />}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* theme toggle */}
            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              aria-label="Toggle theme"
              aria-pressed={isDark}
              className="relative w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] hover:border-white/20 flex items-center justify-center transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <FiMoon size={14} className="text-[#B6BBD4]" />
                  </motion.span>
                ) : (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <FiSun size={14} className="text-[#FFC98B]" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* back to top */}
            <motion.button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #7C8FFF, #5EEAD4)" }}
            >
              <FiArrowUp size={14} className="text-[#0A0D18]" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------------- */
/* Inline render helpers (kept local to this file, not exported).         */
/* ---------------------------------------------------------------------- */

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="sf-mono text-[11.5px] tracking-wide text-[#7B81A0] mb-4 uppercase">{title}</h3>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="sf-underline text-[13.5px] text-[#AEB4CC] hover:text-[#F3F4FA] transition-colors">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-7 h-7 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div className="leading-tight">
        <div className="sf-display text-[13.5px] font-semibold text-[#F3F4FA]">{value}</div>
        <div className="text-[10.5px] text-[#7B81A0]">{label}</div>
      </div>
    </div>
  );
}

function RippleButton({ children, rippleKey, ripples, onRippleClick, className, style, plain, ...props }) {
  const activeRipples = ripples[rippleKey] || [];
  return (
    <motion.button
      {...props}
      onClick={onRippleClick(rippleKey)}
      whileHover={plain ? { y: -2 } : { y: -2, boxShadow: "0 12px 30px rgba(124,143,255,0.35)" }}
      whileTap={{ scale: 0.97 }}
      className={classNames(
        "relative overflow-hidden rounded-xl px-6 py-3 text-[14.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors",
        className
      )}
      style={style}
    >
      {activeRipples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: r.x - 10, top: r.y - 10, width: 20, height: 20 }}
        />
      ))}
      {children}
    </motion.button>
  );
}