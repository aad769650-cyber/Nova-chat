// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { getJSON, setJSON } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/keys";
import { lightTheme, darkTheme } from "../theme/paperThemes";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await getJSON(STORAGE_KEYS.THEME_MODE, "dark");
      setMode(stored);
      setReady(true);
    })();
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      setJSON(STORAGE_KEYS.THEME_MODE, next);
      return next;
    });
  }, []);

  const paperTheme = useMemo(() => (mode === "dark" ? darkTheme : lightTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, paperTheme, ready }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within a ThemeProvider");
  return ctx;
}
