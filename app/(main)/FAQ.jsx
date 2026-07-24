"use client";

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoAddOutline, IoSparklesOutline } from "react-icons/io5";
import {
  FaCode,
  FaClock,
  FaBriefcase,
  FaPlug,
  FaRocket,
  FaTools,
  FaEnvelopeOpenText,
  FaLayerGroup,
} from "react-icons/fa";

/* ------------------------------------------------------------------ */
/*  FAQ data — edit / extend freely                                    */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    icon: FaLayerGroup,
    question: "What services do you offer as a Full Stack Developer?",
    answer:
      "I build end-to-end web applications — from responsive front-ends and REST/GraphQL APIs to database design and deployment. This covers custom web apps, admin dashboards, SaaS MVPs, landing pages, and ongoing feature development for existing products.",
  },
  {
    icon: FaCode,
    question: "Which technologies and tools do you work with?",
    answer:
      "My core stack is the MERN stack (MongoDB, Express.js, React, Node.js) alongside Next.js for production-grade apps. I also work with Tailwind CSS, TypeScript, Prisma, PostgreSQL/MySQL, and Supabase, and integrate third-party services as needed.",
  },
  {
    icon: FaClock,
    question: "How long does a typical project take to complete?",
    answer:
      "Timelines depend on scope. A landing page or simple site usually takes 3–7 days, while a full-stack application with authentication, dashboards, and APIs can take 3–6 weeks. I always share a clear milestone-based timeline before starting.",
  },
  {
    icon: FaBriefcase,
    question: "Are you currently available for freelance work?",
    answer:
      "Yes — I'm currently accepting new freelance projects and long-term collaborations. I typically take on a limited number of projects at a time to make sure each one gets focused attention and timely delivery.",
  },
  {
    icon: FaPlug,
    question: "Can you integrate third-party APIs and services?",
    answer:
      "Absolutely. I've integrated payment gateways, authentication providers, email services, cloud storage, mapping APIs, and various REST/GraphQL third-party APIs, with proper error handling, rate-limiting, and secure key management.",
  },
  {
    icon: FaRocket,
    question: "How do you handle deployment and hosting?",
    answer:
      "I deploy front-ends on Vercel or Netlify and back-ends on platforms like Render, Railway, or a VPS, with CI/CD pipelines where useful. I also configure environment variables, custom domains, SSL, and database hosting (MongoDB Atlas, Supabase, or PlanetScale).",
  },
  {
    icon: FaTools,
    question: "Do you provide maintenance and support after launch?",
    answer:
      "Yes. Every project includes a post-launch support window for fixes, and I offer ongoing maintenance packages for ​bug fixes, security updates, performance monitoring, and new feature additions as your product grows.",
  },
  {
    icon: FaEnvelopeOpenText,
    question: "What's the best way to start working together?",
    answer:
      "Reach out through the contact form or email with a short project brief. We'll hop on a quick call to discuss goals, scope, and budget, and I'll follow up with a proposal and timeline before any work begins.",
  },
];

/* ------------------------------------------------------------------ */
/*  Single accordion item                                              */
/* ------------------------------------------------------------------ */

function FAQItem({ faq, isOpen, onToggle, index }) {
  const panelId = useId();
  const Icon = faq.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "group relative overflow-hidden rounded-2xl border transition-all duration-400",
        "backdrop-blur-xl shadow-lg",
        isOpen
          ? "border-transparent bg-white/[0.06] shadow-[0_8px_40px_rgba(99,102,241,0.18)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)]",
      ].join(" ")}
    >
      {/* gradient border glow when active */}
      {isOpen && (
        <motion.div
          layoutId="active-faq-border"
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            padding: 1,
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.6), rgba(217,70,239,0.4), rgba(99,102,241,0.6))",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Question button (trigger) */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="relative flex w-full items-center gap-4 px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:px-6 sm:py-6"
      >
        {/* icon badge */}
        <span
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
            isOpen
              ? "bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              : "bg-white/5 text-indigo-300 group-hover:bg-white/10 group-hover:text-indigo-200",
          ].join(" ")}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>

        <span
          className={[
            "flex-1 text-sm font-medium leading-snug transition-colors duration-300 sm:text-base",
            isOpen ? "text-white" : "text-white/80 group-hover:text-white",
          ].join(" ")}
        >
          {faq.question}
        </span>

        {/* expand / collapse icon */}
        <motion.span
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
            isOpen
              ? "border-indigo-400/40 bg-indigo-500/10 text-indigo-300"
              : "border-white/10 bg-white/5 text-white/50 group-hover:text-white/80",
          ].join(" ")}
          aria-hidden="true"
        >
          <IoAddOutline className="h-4 w-4" />
        </motion.span>
      </button>

      {/* Answer panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            id={panelId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 pl-[4.25rem] pr-6 sm:px-6 sm:pl-[4.75rem] sm:pr-8">
              <p className="text-sm leading-relaxed text-white/60 sm:text-[15px]">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ Section                                                        */
/* ------------------------------------------------------------------ */

export default function FAQSection() {
  // Only one FAQ open at a time — store the open index (or null)
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="relative w-full overflow-hidden bg-[#0a0a0f] py-24 sm:py-32"
    >
      {/* ---------------------------------------------------------- */}
      {/* Decorative blurred background circles                      */}
      {/* ---------------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(99,102,241,0.35) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[100px]" />
        <div className="absolute -left-24 bottom-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* ---------------------------------------------------------- */}
        {/* Section header                                              */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-indigo-300">
            <IoSparklesOutline className="h-3.5 w-3.5" aria-hidden="true" />
            Got Questions?
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
            Everything you need to know about working with me, from tech
            stack to timelines and support after launch.
          </p>
        </motion.div>

        {/* ---------------------------------------------------------- */}
        {/* Accordion list                                              */}
        {/* ---------------------------------------------------------- */}
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Bottom CTA note                                             */}
        {/* ---------------------------------------------------------- */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center text-sm text-white/40"
        >
          Still have questions?{" "}
          <a
            href="#contact"
            className="font-medium text-indigo-300 underline-offset-4 transition-colors hover:text-indigo-200 hover:underline"
          >
            Let's talk
          </a>
        </motion.p>
      </div>
    </section>
  );
}