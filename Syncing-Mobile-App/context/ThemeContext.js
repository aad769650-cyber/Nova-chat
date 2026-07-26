import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightColors, darkColors } from "../constants/theme";

const THEME_STORAGE_KEY = "@ai_chat_theme_mode";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = Appearance.getColorScheme();
  const [themeMode, setThemeMode] = useState(systemScheme === "dark" ? "dark" : "light");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved === "dark" || saved === "light") {
          setThemeMode(saved);
        }
      } catch (e) {
        // ignore, fall back to system default
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (e) {
      // ignore persistence errors
    }
  };

  const setTheme = async (mode) => {
    setThemeMode(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      // ignore persistence errors
    }
  };

  const colors = useMemo(() => (themeMode === "dark" ? darkColors : lightColors), [themeMode]);

  const value = useMemo(
    () => ({
      themeMode,
      colors,
      isDark: themeMode === "dark",
      toggleTheme,
      setTheme,
      isLoaded,
    }),
    [themeMode, colors, isLoaded]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within a ThemeProvider");
  return ctx;
}
