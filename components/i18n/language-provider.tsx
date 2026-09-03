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
import { isAppLanguage, translate, type MessageKey, type TranslateVars } from "@/lib/i18n";
import {
  formatDate,
  formatDateTime,
  formatMoney,
  formatMoneyExact,
  formatNumber,
  localeTag,
} from "@/lib/format";

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
    if (isAppLanguage(stored)) return stored;
  } catch {
    return detectAppLanguage();
  }
  return detectAppLanguage();
}

function persistLocal(next: ContractLanguage) {
  try {
    window.localStorage.setItem(APP_LANGUAGE_KEY, next);
  } catch {
    /* private mode */
  }
}

function persistRemote(next: ContractLanguage) {
  void fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language: next }),
  }).catch(() => undefined);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<ContractLanguage>("en");

  useEffect(() => {
    const initial = readLanguage();
    setLanguageState(initial);
    document.documentElement.lang = initial;

    let cancelled = false;
    fetch("/api/settings")
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { settings?: { language?: string } };
      })
      .then((json) => {
        if (cancelled) return;
        const serverLang = json?.settings?.language;
        let stored: string | null = null;
        try {
          stored = window.localStorage.getItem(APP_LANGUAGE_KEY);
        } catch {
          stored = null;
        }
        if (isAppLanguage(stored)) {
          if (stored !== serverLang) persistRemote(stored);
          return;
        }
        if (isAppLanguage(serverLang)) {
          setLanguageState(serverLang);
          document.documentElement.lang = serverLang;
          persistLocal(serverLang);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const setLanguage = useCallback((next: ContractLanguage) => {
    setLanguageState(next);
    document.documentElement.lang = next;
    persistLocal(next);
    persistRemote(next);
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

export function useFormat() {
  const { language } = useAppLanguage();
  return useMemo(
    () => ({
      locale: localeTag(language),
      money: (amount: number | null | undefined, currency = "EUR") =>
        formatMoney(amount, currency, language),
      moneyExact: (amount: number, currency: string) => formatMoneyExact(amount, currency, language),
      date: (value: string | number | Date | null | undefined) => formatDate(value, language),
      dateTime: (value: string | number | Date | null | undefined) => formatDateTime(value, language),
      number: (value: number, options?: Intl.NumberFormatOptions) =>
        formatNumber(value, language, options),
    }),
    [language],
  );
}

export { LANGUAGE_LABELS, CONTRACT_LANGUAGES };
