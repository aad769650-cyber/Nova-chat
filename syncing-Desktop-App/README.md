# AI Workspace

A lightweight desktop AI chat assistant, built with **Tauri v2 (Rust)** for the shell and
**React + Vite + Tailwind + Framer Motion** for the UI. Ships with a mock AI backend so the
whole app runs today — swap `get_ai_response` in `src-tauri/src/main.rs` for a real model/API
call whenever you're ready.

## Features

- Custom borderless title bar with real minimize / maximize / close window controls
- Sidebar: search, new chat, recent chats, delete chat, navigation to Settings/Profile
- Chat screen: user + AI bubbles, typing indicator, per-message copy, timestamps, auto-scroll
- Clear chat, export chat to a `.txt` file (native save dialog), open a local file into the
  composer (native open dialog), drag-and-drop a file straight onto the chat window
- Desktop notifications when a reply arrives
- Settings: theme toggle, language selector, notifications toggle, About
- Profile: avatar/name/email, live activity stats, real on-disk storage usage bar
- Keyboard shortcuts: `Ctrl/Cmd+N` new chat, `Ctrl/Cmd+K` focus search, `Ctrl/Cmd+,` open settings
- Chat history is persisted to disk by the Rust backend and reloaded on launch

## Project structure

```
ai-workspace/
├── src/                        # React frontend
│   ├── main.jsx
│   ├── App.jsx                 # top-level shell: view routing, persistence, shortcuts
│   ├── index.css
│   ├── lib/
│   │   └── api.js              # every invoke()/plugin call, in one place
│   └── components/
│       ├── TitleBar.jsx
│       ├── Sidebar.jsx
│       ├── ChatWindow.jsx
│       ├── MessageBubble.jsx
│       ├── Settings.jsx
│       └── Profile.jsx
├── src-tauri/                  # Rust backend
│   ├── src/main.rs             # every Tauri command lives here
│   ├── capabilities/default.json
│   ├── Cargo.toml
│   ├── build.rs
│   └── tauri.conf.json
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 1. Prerequisites

### Rust (all platforms)
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# Windows: download & run https://win.rustup.rs instead
rustc --version
cargo --version
```

### Node.js
Install Node.js 18+ from https://nodejs.org, then verify:
```bash
node --version
npm --version
```

### Tauri CLI
```bash
npm install --save-dev @tauri-apps/cli@latest
```
(already listed in `package.json` — this runs automatically with `npm install`).

### OS system dependencies

**Linux (Debian/Ubuntu):**
```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

**macOS:**
```bash
xcode-select --install
```

**Windows:**
Install the [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
and [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) (WebView2 ships with
Windows 10/11 by default on most machines).

## 2. Install project dependencies

```bash
cd ai-workspace
npm install
```

## 3. Generate app icons (required once, before bundling)

The config references icon files under `src-tauri/icons/` that aren't included here. Generate
them from any single square PNG (ideally 1024x1024):

```bash
npx tauri icon path/to/your-logo.png
```

This is only required before **building** an installer — `tauri dev` runs fine without it.

## 4. Run locally (dev mode, hot reload)

```bash
npm run tauri dev
```

This starts the Vite dev server and opens the native window automatically.

## 5. Build a production executable

```bash
npm run tauri build
```

The compiled app and installers are written to:
```
src-tauri/target/release/
src-tauri/target/release/bundle/
```

## 6. Package a Windows installer specifically

Run the build **on Windows** (or via a Windows CI runner — Tauri does not cross-compile
installers from Linux/macOS to Windows):

```bash
npm run tauri build -- --target x86_64-pc-windows-msvc
```

This produces both an **MSI** and an **NSIS** installer under:
```
src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi/
src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/
```

## Notes

- Chat history is saved as JSON to your OS's app-data directory (via Tauri's `app_data_dir()`),
  written by the `save_chat_history` / `load_chat_history` Rust commands.
- `get_ai_response` in `src-tauri/src/main.rs` returns deterministic mock text — this is the one
  function to replace when you wire up a real model or API.
- If `tauri dev` reports a missing permission, add the specific permission identifier it names to
  `src-tauri/capabilities/default.json` — Tauri v2's permission system is intentionally explicit.
