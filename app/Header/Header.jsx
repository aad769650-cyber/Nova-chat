// components/chat/Header.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
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
// Dummy data — swap these for real data from your app
// ---------------------------------------------------------------------------

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

const CONNECTION_CONFIG = {
  online: { label: "Online", dot: "bg-emerald-500", ring: "bg-emerald-500/30" },
  syncing: { label: "Syncing", dot: "bg-amber-500", ring: "bg-amber-500/30" },
  offline: { label: "Offline", dot: "bg-neutral-400", ring: "bg-neutral-400/20" },
};

// ---------------------------------------------------------------------------
// Sub-components (internal — not exported)
// ---------------------------------------------------------------------------

function ConnectionStatus({ status }) {
  const cfg = CONNECTION_CONFIG[status] ?? CONNECTION_CONFIG.online;
  return (
    <div className="hidden items-center gap-1.5 sm:flex" aria-live="polite">
      <span className="relative flex h-2 w-2">
        {status !== "offline" && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              cfg.ring
            )}
          />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", cfg.dot)} />
      </span>
      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {cfg.label}
      </span>
    </div>
  );
}

function ConversationTitle({ title, status }) {
  return (
    <div className="flex min-w-0 flex-col justify-center">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 shrink-0 text-neutral-400 dark:text-neutral-500" />
        <h1 className="truncate text-sm font-semibold text-neutral-900 dark:text-white sm:text-[15px]">
          {title}
        </h1>
      </div>
      <div className="pl-6">
        <ConnectionStatus status={status} />
      </div>
    </div>
  );
}

function ModelSelector({ model, setModel }) {
  const current = AI_MODELS.find((m) => m.id === model) ?? AI_MODELS[0];
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="hidden h-9 items-center gap-2 rounded-xl border-neutral-200 bg-white/60 px-3 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10 md:flex"
            >
              <CurrentIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              {current.name}
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Switch AI model</TooltipContent>
      </Tooltip>

      <DropdownMenuContent
        align="start"
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
  );
}

function SearchTrigger({ open, setOpen }) {
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
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

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search conversations..." />
        <CommandList>
          <CommandEmpty>No conversations found.</CommandEmpty>
          <CommandGroup heading="Recent">
            {DUMMY_CONVERSATIONS.map((c) => (
              <CommandItem key={c} onSelect={() => setOpen(false)}>
                <MessageSquare className="mr-2 h-4 w-4 text-neutral-400" />
                {c}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

function NewChatButton({ onNewChat }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onNewChat}
          className="hidden h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-3 text-sm font-medium text-white shadow-sm shadow-blue-600/20 transition-transform hover:opacity-95 active:scale-[0.97] sm:px-4 md:inline-flex"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Start a new conversation</TooltipContent>
    </Tooltip>
  );
}

function ShareButton({ onShare }) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
    } catch {
      // Clipboard may be unavailable — UI still confirms intent below
    }
    setCopied(true);
    onShare?.();
    setTimeout(() => setCopied(false), 1600);
  }, [onShare]);

  return (
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
  );
}

function NotificationsButton() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(DUMMY_NOTIFICATIONS.length);

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
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
              <div
                key={n.id}
                className="flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
              >
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {n.title}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{n.desc}</span>
                <span className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                  {n.time}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === "dark";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
          className="h-9 w-9 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? "moon" : "sun"}
              initial={{ scale: 0.5, opacity: 0, rotate: -60 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 60 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </motion.span>
          </AnimatePresence>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{isDark ? "Switch to light" : "Switch to dark"}</TooltipContent>
    </Tooltip>
  );
}

function ProfileMenu({ user }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="ml-1 rounded-full transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:ring-offset-neutral-950"
        >
          <Avatar className="h-8 w-8 border border-neutral-200 dark:border-white/10">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
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
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-neutral-900 dark:text-white">
              {user.name}
            </span>
            <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
              {user.email}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <Settings className="h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <CreditCard className="h-4 w-4" /> Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600 dark:text-red-400">
          <LogOut className="h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileActionsMenu({ model, setModel, onNewChat, onShare }) {
  return (
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
        <DropdownMenuItem onClick={onNewChat} className="gap-2">
          <Plus className="h-4 w-4" /> New chat
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShare} className="gap-2">
          <Share2 className="h-4 w-4" /> Share conversation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// Header — the exported component
// ---------------------------------------------------------------------------

export default function Header({
  title = "Untitled conversation",
  connectionStatus = "online",
  user = {
    name: "Ada Lovelace",
    email: "ada@lumen.ai",
    avatarUrl: "https://placehold.co/64x64",
  },
  defaultModel = "claude-4",
  onModelChange,
  onNewChat,
  onShare,
  className,
}) {
  const [model, setModel] = useState(defaultModel);
  const [theme, setTheme] = useState("light");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleModelChange = (id) => {
    setModel(id);
    onModelChange?.(id);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={cn(
          "sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/70",
          className
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6">
          <ConversationTitle title={title} status={connectionStatus} />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ModelSelector model={model} setModel={handleModelChange} />
            <SearchTrigger open={searchOpen} setOpen={setSearchOpen} />
            <NewChatButton onNewChat={onNewChat} />

            <Separator
              orientation="vertical"
              className="mx-1 hidden h-6 bg-neutral-200 dark:bg-white/10 lg:block"
            />

            <ShareButton onShare={onShare} />
            <NotificationsButton />
            <ThemeToggle theme={theme} setTheme={setTheme} />

            <MobileActionsMenu
              model={model}
              setModel={handleModelChange}
              onNewChat={onNewChat}
              onShare={onShare}
            />

            <ProfileMenu user={user} />
          </div>
        </div>
      </motion.header>
    </TooltipProvider>
  );
}