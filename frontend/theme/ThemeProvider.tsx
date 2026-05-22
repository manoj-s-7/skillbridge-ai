/**
 * MUI Theme Provider — wraps the app with dark theme.
 * Fixed: removed localStorage read on first render to prevent MUI hydration mismatch.
 * The AppBar/Paper CSS custom properties are injected by Emotion during hydration,
 * and a localStorage read that changes state causes a server/client tree mismatch.
 */
"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "./theme";

interface ThemeContextValue {
  mode: "dark" | "light";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start dark (matches SSR). Load saved preference after mount.
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("sb-theme") as "dark" | "light" | null;
      if (stored) setMode(stored);
    } catch {
      // localStorage unavailable (e.g. SSR contexts) — stay dark
    }
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try { localStorage.setItem("sb-theme", next); } catch { /* ignore */ }
      return next;
    });
  };

  const theme = useMemo(() => (mode === "dark" ? darkTheme : lightTheme), [mode]);

  // Render children immediately (don't gate on mounted) to avoid layout flash.
  // The theme starts as dark (same as SSR), so no mismatch on first render.
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
