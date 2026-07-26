// src-tauri/src/main.rs
//
// All backend logic for AI Workspace lives here. There is no real AI model —
// `get_ai_response` returns deterministic mock replies so the desktop shell
// can be wired up and shipped today, then swapped for a real model/API call
// later without touching the frontend contract.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;

/// Where chat history is persisted: `<app_data_dir>/chat_history.json`.
fn history_file_path(data_dir: &PathBuf) -> PathBuf {
    data_dir.join("chat_history.json")
}

/// Mock AI backend. Swap this out for a real model/HTTP call — the frontend
/// only cares that it gets a `String` back.
#[tauri::command]
fn get_ai_response(prompt: String) -> String {
    let trimmed = prompt.trim();
    if trimmed.is_empty() {
        return "I didn't catch that — could you rephrase it?".to_string();
    }

    let lower = trimmed.to_lowercase();
    if lower.contains("hello") || lower.contains("hi ") || lower == "hi" {
        "Hey there! I'm your AI Workspace assistant. What are we working on today?".to_string()
    } else if lower.contains("summarize") {
        let preview: String = trimmed.chars().take(90).collect();
        format!("Here's a summary: {preview}… (mock reply — connect a real model to replace this).")
    } else if lower.contains("code") || lower.contains("bug") {
        "Break it into small functions, write one test per function, then wire them together. Paste the code and I can be more specific once a real model is connected.".to_string()
    } else if lower.contains("thank") {
        "You're welcome! Let me know what's next.".to_string()
    } else {
        format!("You said: \"{trimmed}\". This is a mock reply from the Rust backend — plug in a real AI provider whenever you're ready.")
    }
}

/// Overwrites the on-disk chat history with the JSON the frontend sends.
#[tauri::command]
fn save_chat_history(app_handle: tauri::AppHandle, chats: String) -> Result<(), String> {
    let dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    fs::write(history_file_path(&dir), chats).map_err(|e| e.to_string())
}

/// Reads back whatever `save_chat_history` last wrote. `None` if it has never run.
#[tauri::command]
fn load_chat_history(app_handle: tauri::AppHandle) -> Result<Option<String>, String> {
    let dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let path = history_file_path(&dir);
    if !path.exists() {
        return Ok(None);
    }
    fs::read_to_string(path).map(Some).map_err(|e| e.to_string())
}

/// Total bytes the app has written to its local data directory (used by the
/// Profile screen's storage-usage bar).
#[tauri::command]
fn get_storage_usage(app_handle: tauri::AppHandle) -> Result<u64, String> {
    let dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    if !dir.exists() {
        return Ok(0);
    }
    let mut total: u64 = 0;
    for entry in fs::read_dir(&dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        if let Ok(meta) = entry.metadata() {
            total += meta.len();
        }
    }
    Ok(total)
}

/// Reads an arbitrary local file by absolute path (used by "Open Local File"
/// when a path is already known, e.g. from a drag-and-drop event).
#[tauri::command]
fn read_local_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

/// Opens the native "pick a file" dialog from the Rust side and returns the
/// chosen path (or `None` if the user cancelled).
#[tauri::command]
fn pick_file(app_handle: tauri::AppHandle) -> Option<String> {
    app_handle
        .dialog()
        .file()
        .blocking_pick_file()
        .map(|file_path| file_path.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_ai_response,
            save_chat_history,
            load_chat_history,
            get_storage_usage,
            read_local_file,
            pick_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running the AI Workspace application");
}
