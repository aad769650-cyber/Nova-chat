// src/components/Profile.jsx
import { useState, useEffect } from "react";
import { FiHardDrive, FiMessageSquare } from "react-icons/fi";
import { getStorageUsage } from "../lib/api.js";

const STORAGE_CAP_BYTES = 50 * 1024 * 1024; // 50 MB — cosmetic cap for the usage bar

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function Profile({ chats }) {
  const [name, setName] = useState("Ada Lovelace");
  const [email, setEmail] = useState("ada@aiworkspace.app");
  const [usageBytes, setUsageBytes] = useState(0);

  useEffect(() => {
    getStorageUsage()
      .then(setUsageBytes)
      .catch(() => setUsageBytes(0));
  }, [chats]);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  const usagePercent = Math.min(100, (usageBytes / STORAGE_CAP_BYTES) * 100);
  const totalMessages = chats.reduce((sum, c) => sum + c.messages.length, 0);

  return (
    <div className="thin-scrollbar h-full overflow-y-auto px-8 py-8">
      <h1 className="mb-6 text-lg font-semibold text-white">Profile</h1>

      <div className="max-w-md space-y-5">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-lg font-semibold text-white shadow-lg shadow-violet-500/20">
            {initials}
          </span>
          <div className="flex flex-col gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Display name"
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[13px] font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[12px] text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5">
          <div className="mb-2 flex items-center gap-2">
            <FiMessageSquare className="h-4 w-4 text-neutral-400" />
            <p className="text-[13px] font-medium text-neutral-100">Activity</p>
          </div>
          <p className="text-[12px] text-neutral-400">
            {chats.length} chat{chats.length === 1 ? "" : "s"} · {totalMessages} message
            {totalMessages === 1 ? "" : "s"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiHardDrive className="h-4 w-4 text-neutral-400" />
              <p className="text-[13px] font-medium text-neutral-100">Storage used</p>
            </div>
            <span className="text-[11.5px] text-neutral-500">
              {formatBytes(usageBytes)} / {formatBytes(STORAGE_CAP_BYTES)}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
