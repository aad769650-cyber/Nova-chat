// src/theme/paperThemes.js
// MD3 light/dark themes for React Native Paper, tuned to the NovaChat brand
// (violet -> cyan gradient) so Paper components match the custom-styled ones.
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const brandColors = {
  violet: "#8b5cf6",
  cyan: "#22d3ee",
  fuchsia: "#e879f9",
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: brandColors.violet,
    primaryContainer: "rgba(139,92,246,0.22)",
    secondary: brandColors.cyan,
    background: "#0a0a0f",
    surface: "#131320",
    surfaceVariant: "#1b1b29",
    onSurface: "#f4f4f5",
    onSurfaceVariant: "#9a9aa8",
    outline: "rgba(255,255,255,0.12)",
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brandColors.violet,
    primaryContainer: "rgba(139,92,246,0.14)",
    secondary: "#0891b2",
    background: "#f8f7ff",
    surface: "#ffffff",
    surfaceVariant: "#f1f0fa",
    onSurface: "#18181b",
    onSurfaceVariant: "#6b6b78",
    outline: "rgba(0,0,0,0.1)",
  },
};
