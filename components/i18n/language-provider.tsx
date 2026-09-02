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
import { translate, type MessageKey, type TranslateVars } from "@/lib/i18n";

export const APP_LANGUAGE_KEY = "rw-language";

export type TranslateFn = (key: MessageKey, vars?: TranslateVars) => string;

type LanguageContextValue = {
  language: ContractLanguage;
  setLanguage: (next: ContractLanguage) => void;
  t: TranslateFn;
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

  const t = useCallback<TranslateFn>(
    (key, vars) => translate(language, key, vars),
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

const FALLBACK: LanguageContextValue = {
  language: "en",
  setLanguage: (_next: ContractLanguage) => undefined,
  t: (key, vars) => translate("en", key, vars),
};

export function useAppLanguage() {
  return useContext(LanguageContext) ?? FALLBACK;
}

/** Re-renders when the app language changes. */
export function useT(): TranslateFn {
  return useAppLanguage().t;
}

export { LANGUAGE_LABELS, CONTRACT_LANGUAGES };
