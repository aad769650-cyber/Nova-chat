// components/chat/Header.jsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Share2,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Settings,
  CreditCard,
  LogOut,
  Check,
  Sparkles,
  Bot,
  Cpu,
  Zap,
  MessageSquare,
  MoreHorizontal,
  PenSquare,
  Puzzle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Everything below is hardcoded — this component takes NO props. Swap the
// constants for real data (or wire up a fetch/store) when you plug it in.
// Every item that behaves like navigation (new chat, search results,
// notifications, settings, billing, log out, canvas, extensions) routes to
// the placeholder path "/thatlink" — point those at your real routes when
// they exist.
// ---------------------------------------------------------------------------

const PLACEHOLDER_HREF = "/thatlink";

const BRAND_NAME = "NovaChat";
const HEADER_TITLE = "Untitled conversation";
const CONNECTION_STATUS = "online"; // "online" | "syncing" | "offline"
const CURRENT_USER = {
  name: "Ada Lovelace",
  email: "ada@lumen.ai",
  avatarUrl: "https://placehold.co/64x64",
};
const DEFAULT_MODEL = "claude-4";

const AI_MODELS = [
  { id: "gpt-4.1", name: "GPT-4.1", description: "OpenAI · Balanced & fast", icon: Sparkles },
  { id: "claude-4", name: "Claude 4", description: "Anthropic · Deep reasoning", icon: Bot },
  { id: "gemini-2.5", name: "Gemini 2.5", description: "Google · Multimodal", icon: Cpu },
  { id: "deepseek", name: "DeepSeek", description: "DeepSeek · Open weight", icon: Zap },
];

const DUMMY_CONVERSATIONS = [
  "Roadmap for Q3 launch",
  "Refactor auth middleware",
  "Ideas for onboarding flow",
  "Weekly report summary",
  "Debugging websocket drops",
];

const DUMMY_NOTIFICATIONS = [
  { id: 1, title: "New model available", desc: "Claude 4 is now live in your workspace.", time: "2m ago" },
  { id: 2, title: "Usage at 80%", desc: "You're approaching your monthly limit.", time: "1h ago" },
  { id: 3, title: "Chat shared", desc: "Your conversation was viewed 3 times.", time: "5h ago" },
];

// Canvas is a single, high-intent destination (the live-editing surface),
// so it gets a direct button rather than a dropdown.
const CANVAS_LABEL = "Canvas";
const CANVAS_HREF = "/htmlCanvas";

// Extensions are multiple discrete integrations, so they live in a menu,
// but the whole entry point still resolves to one browsing destination.
const EXTENSIONS_HREF = "/extension";
const DUMMY_EXTENSIONS = [
  { id: "figma", name: "Figma", desc: "Import frames and comment on designs", enabled: true },
  { id: "github", name: "GitHub", desc: "Open PRs and browse repos in chat", enabled: true },
  { id: "notion", name: "Notion", desc: "Pull pages into context automatically", enabled: false },
  { id: "linear", name: "Linear", desc: "Create and track issues", enabled: false },
];

const CONNECTION_CONFIG = {
  online: { label: "Online", dot: "bg-emerald-500", ring: "bg-emerald-500/30" },
  syncing: { label: "Syncing", dot: "bg-amber-500", ring: "bg-amber-500/30" },
  offline: { label: "Offline", dot: "bg-neutral-400", ring: "bg-neutral-400/20" },
};

export default function Header() {
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [theme, setTheme] = useState("light");
  const [searchOpen, setSearchOpen] = useState(false);
  const [unread, setUnread] = useState(DUMMY_NOTIFICATIONS.length);
  const [notifOpen, setNotifOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const modelHoverTimeout = useRef(null);

  // Opens on hover with a short delay (so a passing cursor doesn't trigger
  // it) and stays fully controllable by click as well.
  const openModelMenuOnHover = useCallback(() => {
    clearTimeout(modelHoverTimeout.current);
    modelHoverTimeout.current = setTimeout(() => setModelMenuOpen(true), 120);
  }, []);
  const closeModelMenuOnLeave = useCallback(() => {
    clearTimeout(modelHoverTimeout.current);
    modelHoverTimeout.current = setTimeout(() => setModelMenuOpen(false), 150);
  }, []);

  const connCfg = CONNECTION_CONFIG[CONNECTION_STATUS] ?? CONNECTION_CONFIG.online;
  const currentModel = AI_MODELS.find((m) => m.id === model) ?? AI_MODELS[0];
  const CurrentModelIcon = currentModel.icon;
  const initials = CURRENT_USER.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  const activeExtensions = DUMMY_EXTENSIONS.filter((e) => e.enabled).length;

  // ⌘K / Ctrl+K opens the search dialog
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Reflect theme choice on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => () => clearTimeout(modelHoverTimeout.current), []);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
    } catch {
      // Clipboard may be unavailable — UI still confirms intent below
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/70"
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6">
          {/* ---------------- Brand ---------------- */}
          <Link
            href={PLACEHOLDER_HREF}
            className="flex shrink-0 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:ring-offset-neutral-950"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-sm shadow-blue-600/30">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="hidden text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-white sm:inline">
              {BRAND_NAME}
            </span>
          </Link>

          <Separator orientation="vertical" className="h-6 shrink-0 bg-neutral-200 dark:bg-white/10" />

          {/* ---------------- Title + connection status ---------------- */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <MessageSquare className="hidden h-4 w-4 shrink-0 text-neutral-400 dark:text-neutral-500 sm:block" />
            <h1 className="truncate text-sm font-medium text-neutral-700 dark:text-neutral-200 sm:text-[15px]">
              {HEADER_TITLE}
            </h1>
            <div className="hidden shrink-0 items-center gap-1.5 sm:flex" aria-live="polite">
              <span className="relative flex h-2 w-2">
                {CONNECTION_STATUS !== "offline" && (
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                      connCfg.ring
                    )}
                  />
                )}
                <span className={cn("relative inline-flex h-2 w-2 rounded-full", connCfg.dot)} />
              </span>
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {connCfg.label}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* ---------------- Model selector (click or hover) ---------------- */}
            <DropdownMenu open={modelMenuOpen} onOpenChange={setModelMenuOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      onMouseEnter={openModelMenuOnHover}
                      onMouseLeave={closeModelMenuOnLeave}
                      className="hidden h-9 items-center gap-2 rounded-xl border-neutral-200 bg-white/60 px-3 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10 md:flex"
                    >
                      <CurrentModelIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      {currentModel.name}
                      <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Switch AI model</TooltipContent>
              </Tooltip>

              <DropdownMenuContent
                align="start"
                onMouseEnter={openModelMenuOnHover}
                onMouseLeave={closeModelMenuOnLeave}
                className="w-64 rounded-xl border-neutral-200 dark:border-white/10 dark:bg-neutral-900"
              >
                <DropdownMenuLabel className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                  Model
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {AI_MODELS.map((m) => {
                  const active = m.id === model;
                  return (
                    <DropdownMenuItem
                      key={m.id}
                      onClick={() => setModel(m.id)}
                      className="flex items-center gap-3 rounded-lg py-2"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                        <m.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </span>
                      <span className="flex flex-1 flex-col">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {m.name}
                        </span>
                        <span className="text-xs text-neutral-400">{m.description}</span>
                      </span>
                      {active && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ---------------- Search ---------------- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search conversations"
                  className="h-9 w-9 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="flex items-center gap-1.5">
                Search
                <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1 text-[10px] font-medium text-neutral-500 dark:border-white/10 dark:bg-white/10 dark:text-neutral-300">
                  ⌘K
                </kbd>
              </TooltipContent>
            </Tooltip>

            <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
              <CommandInput placeholder="Search conversations..." />
              <CommandList>
                <CommandEmpty>No conversations found.</CommandEmpty>
                <CommandGroup heading="Recent">
                  {DUMMY_CONVERSATIONS.map((c) => (
                    <CommandItem key={c} asChild onSelect={() => setSearchOpen(false)}>
                      <Link href={PLACEHOLDER_HREF} className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4 text-neutral-400" />
                        {c}
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </CommandDialog>

            {/* ---------------- Canvas ---------------- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  className="hidden h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white lg:inline-flex"
                >
                  <Link href={CANVAS_HREF}>
                    <PenSquare className="h-4 w-4" />
                    {CANVAS_LABEL}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Open canvas for this chat</TooltipContent>
            </Tooltip>

            {/* ---------------- Extensions ---------------- */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Extensions"
                      className="relative hidden h-9 w-9 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white md:flex"
                    >
                      <Puzzle className="h-4 w-4" />
                      {activeExtensions > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-950" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Extensions</TooltipContent>
              </Tooltip>

              <DropdownMenuContent
                align="end"
                className="w-72 rounded-xl border-neutral-200 p-0 dark:border-white/10 dark:bg-neutral-900"
              >
                <div className="flex items-center justify-between px-3 pb-1 pt-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Extensions
                  </span>
                  <span className="text-[11px] font-medium text-neutral-400">
                    {activeExtensions} connected
                  </span>
                </div>
                <DropdownMenuSeparator />
                {DUMMY_EXTENSIONS.map((ext) => (
                  <DropdownMenuItem key={ext.id} asChild className="rounded-lg py-2">
                    <Link href={EXTENSIONS_HREF} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {ext.name[0]}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {ext.name}
                        </span>
                        <span className="truncate text-xs text-neutral-400">{ext.desc}</span>
                      </span>
                      {ext.enabled ? (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      ) : (
                        <span className="shrink-0 text-[11px] font-medium text-neutral-400">Add</span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Link href={EXTENSIONS_HREF} className="flex items-center justify-between">
                    Browse all extensions
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ---------------- New chat ---------------- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  className="hidden h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-3 text-sm font-medium text-white shadow-sm shadow-blue-600/20 transition-transform hover:opacity-95 active:scale-[0.97] sm:px-4 md:inline-flex"
                >
                  <Link href={PLACEHOLDER_HREF}>
                    <Plus className="h-4 w-4" />
                    New Chat
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Start a new conversation</TooltipContent>
            </Tooltip>

            <Separator
              orientation="vertical"
              className="mx-1 hidden h-6 bg-neutral-200 dark:bg-white/10 lg:block"
            />

            {/* ---------------- Share ---------------- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  aria-label="Share conversation"
                  className="hidden h-9 w-9 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white lg:flex"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                      >
                        <Check className="h-4 w-4 text-emerald-500" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="share"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                      >
                        <Share2 className="h-4 w-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{copied ? "Link copied" : "Share conversation"}</TooltipContent>
            </Tooltip>

            {/* ---------------- Notifications ---------------- */}
            <Popover
              open={notifOpen}
              onOpenChange={(v) => {
                setNotifOpen(v);
                if (v) setUnread(0);
              }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Notifications"
                      className="relative h-9 w-9 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                      <Bell className="h-4 w-4" />
                      {unread > 0 && (
                        <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-0 text-[10px] font-semibold text-white">
                          {unread}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Notifications</TooltipContent>
              </Tooltip>

              <PopoverContent
                align="end"
                className="w-80 rounded-xl border-neutral-200 p-0 dark:border-white/10 dark:bg-neutral-900"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-white/10">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Notifications
                  </span>
                  <button
                    type="button"
                    onClick={() => setUnread(0)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Mark all read
                  </button>
                </div>
                <ScrollArea className="h-64">
                  <div className="flex flex-col divide-y divide-neutral-100 dark:divide-white/10">
                    {DUMMY_NOTIFICATIONS.map((n) => (
                      <Link
                        key={n.id}
                        href={PLACEHOLDER_HREF}
                        className="flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
                      >
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {n.title}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{n.desc}</span>
                        <span className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                          {n.time}
                        </span>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {/* ---------------- Theme toggle ---------------- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                  aria-label="Toggle theme"
                  className="h-9 w-9 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={theme === "dark" ? "moon" : "sun"}
                      initial={{ scale: 0.5, opacity: 0, rotate: -60 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.5, opacity: 0, rotate: 60 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {theme === "dark" ? "Switch to light" : "Switch to dark"}
              </TooltipContent>
            </Tooltip>

            {/* ---------------- Mobile actions ---------------- */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="More actions"
                  className="h-9 w-9 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white md:hidden"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 rounded-xl border-neutral-200 dark:border-white/10 dark:bg-neutral-900"
              >
                <DropdownMenuLabel className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                  Model
                </DropdownMenuLabel>
                {AI_MODELS.map((m) => (
                  <DropdownMenuItem key={m.id} onClick={() => setModel(m.id)} className="gap-2">
                    <m.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    {m.name}
                    {model === m.id && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="gap-2">
                  <Link href={PLACEHOLDER_HREF}>
                    <Plus className="h-4 w-4" /> New chat
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2">
                  <Link href={CANVAS_HREF}>
                    <PenSquare className="h-4 w-4" /> Canvas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2">
                  <Link href={EXTENSIONS_HREF}>
                    <Puzzle className="h-4 w-4" /> Extensions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare} className="gap-2">
                  <Share2 className="h-4 w-4" /> Share conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ---------------- Profile menu ---------------- */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Account menu"
                  className="ml-1 rounded-full transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:ring-offset-neutral-950"
                >
                  <Avatar className="h-8 w-8 border border-neutral-200 dark:border-white/10">
                    <AvatarImage src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-semibold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-60 rounded-xl border-neutral-200 dark:border-white/10 dark:bg-neutral-900"
              >
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-semibold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                      {CURRENT_USER.name}
                    </span>
                    <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                      {CURRENT_USER.email}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="gap-2">
                  <Link href={PLACEHOLDER_HREF}>
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2">
                  <Link href={PLACEHOLDER_HREF}>
                    <CreditCard className="h-4 w-4" /> Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="gap-2 text-red-600 focus:text-red-600 dark:text-red-400">
                  <Link href={PLACEHOLDER_HREF}>
                    <LogOut className="h-4 w-4" /> Log out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>
    </TooltipProvider>
  );
}