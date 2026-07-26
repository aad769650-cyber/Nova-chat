// Mock data used across the app. No backend integration required for the MVP.

export const MOCK_USER = {
  id: "u1",
  name: "Ayesha Khan",
  email: "ayesha.khan@example.com",
  avatar: "https://i.pravatar.cc/300?img=47",
  plan: "Free Plan",
  stats: {
    totalChats: 24,
    messagesSent: 312,
    daysActive: 18,
  },
};

export const PROMPT_SUGGESTIONS = [
  { id: "p1", icon: "bulb-outline", label: "Give me ideas", prompt: "Give me 5 creative ideas for my weekend project." },
  { id: "p2", icon: "code-slash-outline", label: "Write code", prompt: "Write a function to reverse a string in JavaScript." },
  { id: "p3", icon: "document-text-outline", label: "Summarize text", prompt: "Summarize the key points of this article for me." },
  { id: "p4", icon: "airplane-outline", label: "Plan a trip", prompt: "Help me plan a 3-day trip to Lahore." },
  { id: "p5", icon: "restaurant-outline", label: "Suggest a recipe", prompt: "Suggest a quick and healthy dinner recipe." },
  { id: "p6", icon: "fitness-outline", label: "Workout plan", prompt: "Create a simple 20-minute home workout plan." },
];

export const QUICK_ACTIONS = [
  { id: "q1", icon: "chatbubbles-outline", label: "New Chat" },
  { id: "q2", icon: "image-outline", label: "Generate Image" },
  { id: "q3", icon: "document-attach-outline", label: "Analyze File" },
  { id: "q4", icon: "language-outline", label: "Translate" },
];

const now = Date.now();

export const MOCK_CHATS = [
  {
    id: "c1",
    title: "Trip planning to Lahore",
    lastMessage: "Here's a 3-day itinerary covering Badshahi Mosque, Food Street...",
    updatedAt: now - 1000 * 60 * 12,
    pinned: true,
    messages: [
      { id: "m1", role: "user", text: "Help me plan a 3-day trip to Lahore.", timestamp: now - 1000 * 60 * 20 },
      {
        id: "m2",
        role: "ai",
        text: "Great choice! Here's a 3-day itinerary covering Badshahi Mosque, Food Street, Lahore Fort, and Shalimar Gardens. Day 1 focuses on the historic Walled City, Day 2 on museums and gardens, and Day 3 on local markets and cuisine.",
        timestamp: now - 1000 * 60 * 19,
      },
      { id: "m3", role: "user", text: "Can you add a food recommendation for each day?", timestamp: now - 1000 * 60 * 13 },
      {
        id: "m4",
        role: "ai",
        text: "Here's a 3-day itinerary covering Badshahi Mosque, Food Street, and more — with food stops: Day 1 try Phajja Siri Paye, Day 2 visit Cooco's Den for rooftop dining, Day 3 end at Butt Karahi.",
        timestamp: now - 1000 * 60 * 12,
      },
    ],
  },
  {
    id: "c2",
    title: "React Native debugging",
    lastMessage: "Try clearing the Metro cache using expo start -c",
    updatedAt: now - 1000 * 60 * 60 * 3,
    pinned: false,
    messages: [
      { id: "m1", role: "user", text: "My app crashes on Android but works fine on iOS.", timestamp: now - 1000 * 60 * 60 * 3 - 300000 },
      {
        id: "m2",
        role: "ai",
        text: "That's often caused by stale build caches. Try clearing the Metro cache using expo start -c and rebuilding the Android app.",
        timestamp: now - 1000 * 60 * 60 * 3,
      },
    ],
  },
  {
    id: "c3",
    title: "Healthy dinner ideas",
    lastMessage: "Try a quinoa salad with grilled chicken and lemon dressing.",
    updatedAt: now - 1000 * 60 * 60 * 24,
    pinned: false,
    messages: [
      { id: "m1", role: "user", text: "Suggest a quick and healthy dinner recipe.", timestamp: now - 1000 * 60 * 60 * 24 - 60000 },
      {
        id: "m2",
        role: "ai",
        text: "Try a quinoa salad with grilled chicken and lemon dressing. It takes about 20 minutes and is packed with protein and fiber.",
        timestamp: now - 1000 * 60 * 60 * 24,
      },
    ],
  },
  {
    id: "c4",
    title: "JavaScript string reversal",
    lastMessage: "const reverse = str => str.split('').reverse().join('');",
    updatedAt: now - 1000 * 60 * 60 * 48,
    pinned: false,
    messages: [
      { id: "m1", role: "user", text: "Write a function to reverse a string in JavaScript.", timestamp: now - 1000 * 60 * 60 * 48 - 60000 },
      {
        id: "m2",
        role: "ai",
        text: "const reverse = str => str.split('').reverse().join(''); — this splits the string into characters, reverses the array, then joins it back together.",
        timestamp: now - 1000 * 60 * 60 * 48,
      },
    ],
  },
];

export const AI_DUMMY_RESPONSES = [
  "That's a great question! Based on what you're describing, here's how I'd approach it step by step.",
  "Sure, I can help with that. Let me break it down into a few clear points for you.",
  "Interesting! Here's a quick summary along with a couple of suggestions you might find useful.",
  "Got it. Here's a well-structured answer based on your request.",
  "Here's what I found — let me know if you'd like me to go deeper into any part of this.",
  "I've put together a clear explanation below. Feel free to ask a follow-up if anything's unclear.",
  "Absolutely — here's a practical way to think about this problem.",
  "Nice one! Here's my take, along with a few next steps you could consider.",
];

export const ONBOARDING_SLIDES = [
  {
    id: "s1",
    title: "Meet Your AI Companion",
    description: "Chat naturally, get instant answers, and explore ideas with a powerful AI assistant in your pocket.",
    icon: "sparkles",
  },
  {
    id: "s2",
    title: "Smart & Personalized",
    description: "Your conversations are organized, searchable, and always picked up right where you left off.",
    icon: "chatbubble-ellipses",
  },
  {
    id: "s3",
    title: "Private & Secure",
    description: "Your data stays yours. Manage your profile and preferences with full control, anytime.",
    icon: "shield-checkmark",
  },
];
