// Central design tokens for the app.
// Inspired by ChatGPT / Claude / Material You premium-minimal aesthetics.

export const PRIMARY = "#6C5CE7";
export const PRIMARY_DARK = "#5849C2";
export const ACCENT = "#00CEC9";

export const lightColors = {
  mode: "light",
  primary: PRIMARY,
  primaryDark: PRIMARY_DARK,
  accent: ACCENT,
  background: "#F7F7FB",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F0F7",
  card: "#FFFFFF",
  text: "#1A1A2E",
  textSecondary: "#6B6B80",
  textMuted: "#9A9AAE",
  border: "#E7E7F0",
  bubbleUser: "#6C5CE7",
  bubbleUserText: "#FFFFFF",
  bubbleAI: "#FFFFFF",
  bubbleAIText: "#1A1A2E",
  inputBackground: "#FFFFFF",
  danger: "#FF5C5C",
  success: "#00B894",
  statusBar: "dark",
  tabBarBackground: "#FFFFFF",
  shadow: "rgba(30, 30, 60, 0.08)",
  gradientStart: "#7C6BF2",
  gradientEnd: "#6C5CE7",
  overlay: "rgba(0,0,0,0.4)",
};

export const darkColors = {
  mode: "dark",
  primary: "#8B7CF6",
  primaryDark: PRIMARY,
  accent: "#26D9D4",
  background: "#0F0F17",
  surface: "#1A1A26",
  surfaceAlt: "#20202E",
  card: "#1E1E2C",
  text: "#F2F2F7",
  textSecondary: "#A6A6BF",
  textMuted: "#75758C",
  border: "#2A2A3A",
  bubbleUser: "#8B7CF6",
  bubbleUserText: "#FFFFFF",
  bubbleAI: "#1E1E2C",
  bubbleAIText: "#F2F2F7",
  inputBackground: "#1E1E2C",
  danger: "#FF6B6B",
  success: "#2ECC9A",
  statusBar: "light",
  tabBarBackground: "#15151F",
  shadow: "rgba(0, 0, 0, 0.4)",
  gradientStart: "#8B7CF6",
  gradientEnd: "#5849C2",
  overlay: "rgba(0,0,0,0.6)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
};

export const getPaperTheme = (colors, MD3LightTheme, MD3DarkTheme) => {
  const base = colors.mode === "dark" ? MD3DarkTheme : MD3LightTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      surface: colors.surface,
      onSurface: colors.text,
      outline: colors.border,
      error: colors.danger,
    },
  };
};
