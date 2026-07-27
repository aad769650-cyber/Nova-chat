// src/data/mockChats.js
// Seed data used only on first launch, before any real chat exists on disk.
const nowLabel = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const INITIAL_CHATS = [
  {
    id: "chat-welcome",
    title: "Welcome to NovaChat",
    updatedAt: Date.now(),
    messages: [
      {
        id: "welcome-1",
        sender: "ai",
        text: "Welcome to NovaChat! Ask me anything, or tap a quick action on Home to get started.",
        time: nowLabel(),
      },
    ],
  },
];
