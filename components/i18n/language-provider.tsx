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
  CONTRACT_LANGUAGES,
  detectAppLanguage,
  LANGUAGE_LABELS,
  type ContractLanguage,
} from "@/lib/contracts/i18n";

export const APP_LANGUAGE_KEY = "rw-language";

type LanguageContextValue = {
  language: ContractLanguage;
  setLanguage: (next: ContractLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readLanguage(): ContractLanguage {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(APP_LANGUAGE_KEY);
    if (stored && (CONTRACT_LANGUAGES as readonly string[]).includes(stored)) {
      return stored as ContractLanguage;
    }
  } catch {
    return detectAppLanguage();
  }
  return detectAppLanguage();
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<ContractLanguage>("en");

  useEffect(() => {
    const initial = readLanguage();
    setLanguageState(initial);
    document.documentElement.lang = initial;
  }, []);

  const setLanguage = useCallback((next: ContractLanguage) => {
    setLanguageState(next);
    document.documentElement.lang = next;
    try {
      window.localStorage.setItem(APP_LANGUAGE_KEY, next);
    } catch {
      /* private mode */
    }
  }, []);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useAppLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en" as ContractLanguage,
      setLanguage: (_next: ContractLanguage) => undefined,
    };
  }
  return context;
}

export { LANGUAGE_LABELS, CONTRACT_LANGUAGES };
