// src/components/Settings.jsx
import { motion } from "framer-motion";
import { FiSun, FiMoon, FiGlobe, FiBell, FiInfo } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese"];

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
        checked ? "bg-gradient-to-r from-violet-500 to-cyan-400" : "bg-white/10"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${checked ? "left-5" : "left-0.5"}`}
      />
    </button>
  );
}

export default function Settings({
  theme,
  setTheme,
  language,
  setLanguage,
  notificationsEnabled,
  setNotificationsEnabled,
}) {
  return (
    <div className="thin-scrollbar h-full overflow-y-auto px-8 py-8">
      <h1 className="mb-6 text-lg font-semibold text-white">Settings</h1>

      <div className="max-w-md space-y-3">
        {/* Theme */}
        <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <FiMoon className="h-4 w-4 text-neutral-400" /> : <FiSun className="h-4 w-4 text-amber-300" />}
            <div>
              <p className="text-[13px] font-medium text-neutral-100">Theme</p>
              <p className="text-[11.5px] text-neutral-500">Switch between dark and light mode</p>
            </div>
          </div>
          <ToggleSwitch
            checked={theme === "dark"}
            onChange={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            label="Toggle theme"
          />
        </div>

        {/* Language */}
        <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5">
          <div className="flex items-center gap-3">
            <FiGlobe className="h-4 w-4 text-neutral-400" />
            <div>
              <p className="text-[13px] font-medium text-neutral-100">Language</p>
              <p className="text-[11.5px] text-neutral-500">Interface language</p>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Select language"
            className="rounded-lg border border-white/[0.08] bg-white/[0.05] px-2.5 py-1.5 text-[12.5px] text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="bg-neutral-900">
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5">
          <div className="flex items-center gap-3">
            <FiBell className="h-4 w-4 text-neutral-400" />
            <div>
              <p className="text-[13px] font-medium text-neutral-100">Desktop notifications</p>
              <p className="text-[11.5px] text-neutral-500">Get notified when a reply is ready</p>
            </div>
          </div>
          <ToggleSwitch
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled((v) => !v)}
            label="Toggle notifications"
          />
        </div>

        {/* About */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4">
          <div className="mb-2 flex items-center gap-2">
            <FiInfo className="h-4 w-4 text-neutral-400" />
            <p className="text-[13px] font-medium text-neutral-100">About</p>
          </div>
          <div className="flex items-center gap-2 text-[12.5px] text-neutral-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-cyan-400">
              <HiSparkles className="h-3 w-3 text-white" />
            </span>
            AI Workspace v0.1.0
          </div>
          <p className="mt-2 text-[11.5px] leading-relaxed text-neutral-500">
            Built with Tauri, Rust, and React. This MVP ships with a mock AI backend — connect a real
            provider in <code className="rounded bg-white/10 px-1">src-tauri/src/main.rs</code> whenever
            you're ready.
          </p>
        </div>
      </div>
    </div>
  );
}
