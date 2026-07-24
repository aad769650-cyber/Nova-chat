"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  { label: "Home", href: "home" },
  { label: "About", href: "about" },
  { label: "Skills", href: "skills" },
  { label: "Projects", href: "projects" },
  { label: "Experience", href: "experience" },
  { label: "Contact", href: "contact" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/yourusername", icon: "GitHub" },
  { label: "LinkedIn", href: "https://linkedin.com/in/yourusername", icon: "Linkedin" },
  { label: "Twitter / X", href: "https://twitter.com/yourusername", icon: "Twitter" },
  { label: "Instagram", href: "https://instagram.com/yourusername", icon: "Instagram" },
  { label: "Email", href: "mailto:hello@mahar.dev", icon: "Mail" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const containerStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function Footer() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerStagger}
      className={cn(
        "relative mt-24 w-full border-t backdrop-blur-xl",
        "border-slate-200/70 bg-gradient-to-b from-white/70 to-slate-50/90",
        "dark:border-white/10 dark:from-[#0a0a0f]/70 dark:to-[#0a0a0f]/95"
      )}
    >
      {/* ambient gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-full max-w-3xl bg-gradient-to-r from-indigo-400/20 via-violet-400/20 to-indigo-400/20 blur-3xl dark:from-indigo-500/20 dark:via-violet-500/20 dark:to-indigo-500/20"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top CTA */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-6 rounded-2xl border border-slate-200/70 bg-white/60 p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:p-10"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Let&apos;s build something great together
          </h2>
          <p className="max-w-md text-sm text-slate-600 dark:text-white/60">
            Open to freelance projects, collaborations, and full-time
            opportunities. Let&apos;s talk about your next idea.
          </p>
          <Button
            onClick={() => scrollToSection("contact")}
            className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 text-sm font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-transform hover:scale-[1.03] hover:opacity-90 hover:shadow-[0_0_28px_rgba(99,102,241,0.5)]"
          >
            Let&apos;s Work Together
          </Button>
        </motion.div>

        {/* Main grid */}
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Mahar
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                .dev
              </span>
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-slate-600 dark:text-white/60">
              MERN stack developer crafting clean, performant web
              experiences—from concept to production.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeUp}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Quick Links
            </h3>
            <nav aria-label="Footer navigation" className="mt-4">
              <ul className="flex flex-col gap-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="group relative inline-flex w-fit items-center text-sm text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:text-white/60 dark:hover:text-white"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 group-hover:w-full dark:from-indigo-400 dark:to-violet-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Contact info */}
          <motion.div variants={fadeUp}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Contact
            </h3>
            <address className="mt-4 flex flex-col gap-3 text-sm not-italic text-slate-600 dark:text-white/60">
              <a
                href="mailto:hello@mahar.dev"
                className="inline-flex items-center gap-2 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:hover:text-white"
              >
                hello@mahar.dev
              </a>
              <a
                href="tel:+920000000000"
                className="inline-flex items-center gap-2 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:hover:text-white"
              >
                +92 000 0000000
              </a>
              <span className="inline-flex items-center gap-2">
                Rawalpindi, Pakistan
              </span>
            </address>
          </motion.div>

          {/* Social */}
          <motion.div variants={fadeUp}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Follow
            </h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/70 bg-white/60 text-slate-600 shadow-sm transition-colors hover:border-indigo-400/50 hover:text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.hr
          variants={fadeUp}
          className="mt-14 border-slate-200/70 dark:border-white/10"
        />

        {/* Bottom bar */}
        <motion.div
          variants={fadeUp}
          className="mt-6 flex flex-col items-center gap-4 text-sm text-slate-500 dark:text-white/50 sm:flex-row sm:justify-between"
        >
          <p>
            &copy; {new Date().getFullYear()} Mahar.dev. All rights reserved.
          </p>
          <p className="text-center">
            Built with Next.js, Tailwind CSS &amp; Framer Motion.
          </p>
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 px-3 py-1.5 text-slate-600 transition-colors hover:border-indigo-400/50 hover:text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:border-white/10 dark:text-white/60 dark:hover:text-white"
          >
            Back to top
          
          </button>
        </motion.div>
      </div>
    </motion.footer>
  );
}