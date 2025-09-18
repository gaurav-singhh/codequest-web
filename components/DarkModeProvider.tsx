"use client";
import React, { useState, useEffect, createContext, useContext } from "react";

const DarkModeContext = createContext<{
  isDark: boolean;
  setIsDark: (v: boolean) => void;
} | undefined>(undefined);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  // Hydration fix: don't set initial value until client
  const [isDark, setIsDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // On mount, sync with localStorage or system preference
    const stored = localStorage.getItem("codequest-dark-mode");
    if (stored !== null) {
      setIsDark(stored === "true");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("codequest-dark-mode", String(isDark));
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark, hydrated]);
  if (!hydrated) return null;
  return (
    <DarkModeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error("useDarkMode must be used within DarkModeProvider");
  return ctx;
}
