"use client";

import { motion } from "framer-motion";
import { IoRocketOutline, IoSparklesOutline } from "react-icons/io5";
import { BsCodeSlash, BsPhone } from "react-icons/bs";
import { MdSpeed, MdOutlineDesignServices } from "react-icons/md";
import { FaDatabase, FaArrowRight } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/*  Feature data — edit / extend freely                                 */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: BsCodeSlash,
    title: "Clean & Scalable Code",
    description:
      "Every project is built on maintainable, well-structured code that's easy to extend, test, and hand off — no shortcuts, no spaghetti.",
  },
  {
    icon: BsPhone,
    title: "Responsive Design",
    description:
      "Pixel-perfect layouts that adapt seamlessly across mobile, tablet, and desktop, so your product looks great on every screen.",
  },
  {
    icon: MdSpeed,
    title: "Performance Optimized",
    description:
      "Fast load times and smooth interactions through code-splitting, lazy loading, and best practices for Core Web Vitals.",
  },
  {
    icon: FaDatabase,
    title: "API & Database Integration",
    description:
      "Robust REST/GraphQL APIs and thoughtful database design with MongoDB, PostgreSQL, or MySQL — secure, scalable, and reliable.",
  },
  {
    icon: MdOutlineDesignServices,
    title: "Modern UI/UX",
    description:
      "Interfaces that feel intuitive and premium, blending clean visual design with thoughtful micro-interactions and accessibility.",
  },
  {
    icon: IoRocketOutline,
    title: "Fast Delivery & Communication",
    description:
      "Clear timelines, regular updates, and responsive communication throughout — so you always know where your project stands.",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                  */
/* ------------------------------------------------------------------ */

const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ------------------------------------------------------------------ */
/*  Single feature card                                                 */
/* ------------------------------------------------------------------ */

function FeatureCard({ feature }) {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-lg backdrop-blur-xl transition-colors duration-300 hover:border-transparent hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(99,102,241,0.2)] sm:p-8"
    >
      {/* animated gradient border glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          padding: 1,
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.7), rgba(217,70,239,0.35), rgba(99,102,241,0.7))",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        aria-hidden="true"
      />

      {/* soft inner glow on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-500/0 via-transparent to-fuchsia-500/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:from-indigo-500/10 group-hover:to-fuchsia-500/10 group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* icon container */}
      <div className="relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_8px_24px_rgba(99,102,241,0.35)] transition-transform duration-400 group-hover:-rotate-6 group-hover:scale-110">
        <Icon className="h-6 w-6 text-white" aria-hidden="true" />
      </div>

      <h3 className="relative text-lg font-semibold text-white sm:text-xl">
        {feature.title}
      </h3>

      <p className="relative mt-3 text-sm leading-relaxed text-white/55 sm:text-[15px]">
        {feature.description}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Why Choose Me Section                                              */
/* ------------------------------------------------------------------ */

export default function WhyChooseSection() {
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      id="why-choose-me"
      aria-labelledby="why-choose-heading"
      className="relative w-full overflow-hidden bg-[#0a0a0f] py-24 sm:py-32"
    >
      {/* ---------------------------------------------------------- */}
      {/* Decorative floating gradient blobs                          */}
      {/* ---------------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(99,102,241,0.35) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <motion.div
          className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-500/15 blur-[100px]"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-[100px]"
          animate={{ x: [0, -30, 0], y: [0, -25, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[100px]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------------------------------------------------------- */}
        {/* Section header                                              */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center sm:mb-20"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-indigo-300">
            <IoSparklesOutline className="h-3.5 w-3.5" aria-hidden="true" />
            Why Choose Me
          </span>

          <h2
            id="why-choose-heading"
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Built for{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              performance & scale
            </span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
            I combine clean engineering with thoughtful design to deliver
            products that look premium, run fast, and grow with your business.
          </p>
        </motion.div>

        {/* ---------------------------------------------------------- */}
        {/* Feature grid                                                */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerStagger}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>

        {/* ---------------------------------------------------------- */}
        {/* CTA button                                                  */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 flex justify-center sm:mt-20"
        >
          <button
            type="button"
            onClick={scrollToContact}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_45px_rgba(99,102,241,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]"
          >
            Let&apos;s Work Together
            <FaArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
}