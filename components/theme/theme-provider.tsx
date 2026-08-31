"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  resolveDarkClass,
  themeStorageKey,
  type ThemePreference,
} from "@/lib/theme";

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: "light" | "dark";
  setPreference: (next: ThemePreference) => void;
  setUserId: (userId: string | null) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readPreference(userId: string | null): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(themeStorageKey(userId));
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
    const fallback = window.localStorage.getItem(themeStorageKey());
    if (fallback === "light" || fallback === "dark" || fallback === "system") return fallback;
  } catch {
    return "system";
  }
  return "system";
}

function applyClass(preference: ThemePreference) {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", resolveDarkClass(preference, systemDark));
}

export function ThemeProvider({
  children,
  userId = null,
}: {
  children: ReactNode;
  userId?: string | null;
}) {
  const [scopedUserId, setScopedUserId] = useState<string | null>(userId);
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const initial = readPreference(scopedUserId);
    setPreferenceState(initial);
    applyClass(initial);
    setResolved(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, [scopedUserId]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      applyClass(preference);
      setResolved(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [preference]);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      setPreferenceState(next);
      applyClass(next);
      setResolved(document.documentElement.classList.contains("dark") ? "dark" : "light");
      try {
        window.localStorage.setItem(themeStorageKey(scopedUserId), next);
      } catch {
        /* private mode */
      }
    },
    [scopedUserId],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolved,
      setPreference,
      setUserId: setScopedUserId,
    }),
    [preference, resolved, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
