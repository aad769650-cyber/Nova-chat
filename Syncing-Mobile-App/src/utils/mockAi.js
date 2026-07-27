// src/utils/mockAi.js
// Deterministic, keyword-based mock AI reply generator. Swap this for a real
// model/API call — every call site only expects a Promise/string back.
export function generateMockReply(prompt) {
  const trimmed = prompt.trim();
  if (!trimmed) return "I didn't catch that — could you rephrase it?";

  const lower = trimmed.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi")) {
    return "Hey there! I'm your NovaChat assistant. What are we working on today?";
  }
  if (lower.includes("summarize")) {
    return `Here's a summary: ${trimmed.slice(0, 80)}… (mock reply — connect a real model to replace this).`;
  }
  if (lower.includes("code") || lower.includes("bug")) {
    return "Break it into small functions, test each one, then wire them together. Paste the code for more specific help once a real model is connected.";
  }
  if (lower.includes("email")) {
    return "Here's a draft structure: a friendly opener, the ask stated clearly, then a specific next step. Share the details and I can tailor it further.";
  }
  if (lower.includes("thank")) {
    return "You're welcome! Let me know what's next.";
  }
  return `You said: "${trimmed}". This is a mock reply from NovaChat — plug in a real AI provider whenever you're ready.`;
}
