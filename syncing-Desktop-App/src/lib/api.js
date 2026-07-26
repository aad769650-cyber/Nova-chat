// src/lib/api.js
//
// Thin wrapper around every Tauri command + plugin call the UI needs.
// Keeping all `invoke(...)` calls in one place means the React components
// never talk to Tauri directly — swap the mock Rust backend for a real one
// without touching a single component.

import { invoke } from "@tauri-apps/api/core";
import { save as saveDialog, open as openDialog } from "@tauri-apps/plugin-dialog";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";

/** Ask the Rust backend for a (mock) AI reply to a prompt. */
export async function getAiResponse(prompt) {
  return invoke("get_ai_response", { prompt });
}

/** Persist the full chat list to disk via Rust (JSON string in, nothing out). */
export async function saveChatHistory(chats) {
  return invoke("save_chat_history", { chats: JSON.stringify(chats) });
}

/** Load the chat list Rust previously saved. Returns [] if nothing exists yet. */
export async function loadChatHistory() {
  const raw = await invoke("load_chat_history");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/** How many bytes the app has written to its local data directory. */
export async function getStorageUsage() {
  return invoke("get_storage_usage");
}

/** Read an arbitrary local file by path through the Rust `read_local_file` command. */
export async function readLocalFileViaRust(path) {
  return invoke("read_local_file", { path });
}

/** Native "Open File" dialog handled entirely in Rust, returns the chosen path or null. */
export async function pickFileViaRust() {
  return invoke("pick_file");
}

/** Native save-file dialog + write, used by "Export Chat". Returns the saved path or null. */
export async function exportChatToFile(chat) {
  const suggested = `${chat.title.replace(/\s+/g, "-").toLowerCase()}.txt`;
  const path = await saveDialog({
    defaultPath: suggested,
    filters: [{ name: "Text file", extensions: ["txt"] }],
  });
  if (!path) return null;

  const content = chat.messages
    .map((m) => `[${m.sender === "user" ? "You" : "AI"} · ${m.time}]\n${m.text}`)
    .join("\n\n");
  await writeTextFile(path, content);
  return path;
}

/** Native "Open Local File" flow, reads the selected file's text content back into the app. */
export async function openLocalFile() {
  const path = await openDialog({
    multiple: false,
    filters: [{ name: "Text / Markdown / JSON", extensions: ["txt", "md", "json"] }],
  });
  if (!path) return null;
  const content = await readTextFile(path);
  return { path, content };
}

/** Fires a real desktop notification, requesting permission the first time it's needed. */
export async function notifyDesktop(title, body) {
  let granted = await isPermissionGranted();
  if (!granted) {
    const permission = await requestPermission();
    granted = permission === "granted";
  }
  if (granted) sendNotification({ title, body });
}

export { readTextFile };
