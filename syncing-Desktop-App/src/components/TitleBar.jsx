// src/components/TitleBar.jsx
import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { VscChromeMinimize, VscChromeMaximize, VscChromeRestore, VscChromeClose } from "react-icons/vsc";
import { HiSparkles } from "react-icons/hi2";

const appWindow = getCurrentWindow();

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    let unlisten;
    appWindow.isMaximized().then(setIsMaximized);
    appWindow.onResized(() => {
      appWindow.isMaximized().then(setIsMaximized);
    }).then((fn) => {
      unlisten = fn;
    });
    return () => unlisten?.();
  }, []);

  return (
    <div
      data-tauri-drag-region
      className="flex h-9 shrink-0 select-none items-center justify-between border-b border-white/10 bg-white/[0.03] pl-3 backdrop-blur-xl"
    >
      <div data-tauri-drag-region className="flex items-center gap-2 text-[12px] font-medium text-neutral-300">
        <span className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-cyan-400">
          <HiSparkles className="h-2.5 w-2.5 text-white" />
        </span>
        AI Workspace
      </div>
      <div className="flex h-full">
        <button
          type="button"
          aria-label="Minimize window"
          onClick={() => appWindow.minimize()}
          className="flex h-full w-11 items-center justify-center text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <VscChromeMinimize className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label={isMaximized ? "Restore window" : "Maximize window"}
          onClick={() => appWindow.toggleMaximize()}
          className="flex h-full w-11 items-center justify-center text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          {isMaximized ? <VscChromeRestore className="h-3.5 w-3.5" /> : <VscChromeMaximize className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          aria-label="Close window"
          onClick={() => appWindow.close()}
          className="flex h-full w-11 items-center justify-center text-neutral-400 transition-colors hover:bg-rose-500 hover:text-white"
        >
          <VscChromeClose className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
