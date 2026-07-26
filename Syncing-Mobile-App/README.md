# AI Chat — Mobile (React Native + Expo)

A lightweight, production-quality **Android-first** MVP companion app for an AI chat platform.
Built with React Native, Expo, and Expo Router. No backend required — all data is mocked and
persisted locally with AsyncStorage.

## ✨ Features

- **Splash screen** with animated branding
- **Onboarding** — 3 swipeable slides with pagination dots
- **Login / Signup** — mock authentication, persisted locally
- **Home** — greeting, live search, quick actions grid, recent chats list, floating action button
- **Chat screen** — message bubbles, typing indicator animation, timestamps, auto-scroll,
  attachment button (UI), voice button (UI), prompt suggestions for empty chats
- **Profile** — avatar, editable name, email, usage stats, account menu, logout
- **Settings** — dark/light mode toggle, notifications, sound, language picker, privacy, about
- **About** — app info and links
- **Dark / Light mode** — persisted across app restarts
- Smooth animations throughout via **React Native Reanimated**

## 🧱 Tech Stack

- React Native + Expo (SDK 51)
- Expo Router (file-based navigation)
- React Native Paper (Material You-inspired components/theming)
- React Native Reanimated + Gesture Handler
- React Native SVG
- AsyncStorage (local persistence)
- @expo/vector-icons (Ionicons)

## 📁 Folder Structure

```
ai-chat-mobile/
├── app/                        # Expo Router screens (file-based routing)
│   ├── _layout.js              # Root layout: providers + stack navigator
│   ├── index.js                # Splash screen
│   ├── onboarding.js           # Onboarding slides
│   ├── about.js                # About screen
│   ├── chat/
│   │   └── [id].js             # Dynamic chat screen
│   ├── (auth)/
│   │   ├── _layout.js
│   │   ├── login.js
│   │   └── signup.js
│   └── (tabs)/
│       ├── _layout.js          # Bottom tab navigator
│       ├── home.js
│       ├── profile.js
│       └── settings.js
├── components/                 # Reusable UI components
│   ├── ChatBubble.js
│   ├── TypingIndicator.js
│   ├── ChatListItem.js
│   ├── PromptSuggestionCard.js
│   ├── QuickActionCard.js
│   └── PrimaryButton.js
├── context/                    # Global state (React Context)
│   ├── ThemeContext.js
│   ├── AuthContext.js
│   └── ChatContext.js
├── constants/
│   ├── theme.js                # Design tokens (colors, spacing, radius, fonts)
│   └── mockData.js             # Mock users, chats, prompts, onboarding content
├── utils/
│   └── formatTime.js
├── assets/                     # App icons & splash image
├── app.json
├── babel.config.js
├── metro.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app on your Android phone (for quick testing), or Android Studio for an emulator

### Install & Run

```bash
npm install
npx expo start
```

Then:
- Press `a` to open on a connected Android device/emulator, **or**
- Scan the QR code with the **Expo Go** app on your Android phone

### Build an Android APK/AAB (EAS Build)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

## 🔑 Notes

- Login/Signup are **mock flows** — any non-empty email/password will work.
- AI responses in the Chat screen are **dummy responses** selected at random after a short
  simulated "typing" delay — no network/backend calls are made.
- All state (auth session, theme, onboarding status) is persisted to the device via AsyncStorage,
  so the app remembers you between launches.
- Replace the placeholder icons in `/assets` with your own branding before publishing.

## 📄 License

MIT — free to use and modify for your project.
