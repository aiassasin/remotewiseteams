"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { CONTRACT_LANGUAGES, LANGUAGE_LABELS } from "@/lib/contracts/i18n";
import {
  APP_LANGUAGE_COOKIE,
  APP_LANGUAGE_STORAGE_KEY,
  detectAppLanguage,
  isAppLanguage,
  normalizeAppLanguage,
  translate,
  type AppLanguage,
  type MessageKey,
  type TranslateVars,
} from "@/lib/i18n";
import {
  formatDate,
  formatDateTime,
  formatMoney,
  formatMoneyExact,
  formatNumber,
  localeTag,
} from "@/lib/format";

export const APP_LANGUAGE_KEY = APP_LANGUAGE_STORAGE_KEY;

export type TranslateFn = (key: MessageKey, vars?: TranslateVars) => string;

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (next: AppLanguage) => void;
  t: TranslateFn;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

type ClientStore = {
  language: AppLanguage;
  bootstrapped: boolean;
  listeners: Set<() => void>;
};

function clientStore(): ClientStore | null {
  if (typeof window === "undefined") return null;
  const root = window as Window & { __rwLanguageStore?: ClientStore };
  if (!root.__rwLanguageStore) {
    root.__rwLanguageStore = {
      language: "en",
      bootstrapped: false,
      listeners: new Set(),
    };
  }
  return root.__rwLanguageStore;
}

function emitLanguage(next: AppLanguage) {
  const store = clientStore();
  if (!store) return;
  store.language = next;
  store.bootstrapped = true;
  store.listeners.forEach((listener) => listener());
}

function subscribeLanguage(listener: () => void) {
  const store = clientStore();
  if (!store) return () => undefined;
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
}

function getLanguageSnapshot(): AppLanguage {
  return clientStore()?.language ?? "en";
}

function readStoredRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(APP_LANGUAGE_STORAGE_KEY);
    if (stored) return stored;
  } catch {
    return null;
  }
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${APP_LANGUAGE_COOKIE}=`))
    ?.split("=")[1];
  return cookie ?? null;
}

/**
 * Reads the persisted UI language. Leftover `de` / `fr` values become English.
 */
function readLanguage(): AppLanguage | null {
  const raw = readStoredRaw();
  if (!raw) return null;
  return normalizeAppLanguage(raw);
}

function persistLocal(next: AppLanguage) {
  try {
    window.localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, next);
  } catch {
    /* private mode */
  }
}

function persistCookie(next: AppLanguage) {
  try {
    document.cookie = `${APP_LANGUAGE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
  } catch {
    /* private mode */
  }
}

function persistRemote(next: AppLanguage) {
  void fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language: next }),
  }).catch(() => undefined);
}

function applyLanguage(next: AppLanguage) {
  persistLocal(next);
  persistCookie(next);
  emitLanguage(next);
  if (typeof document !== "undefined") {
    document.documentElement.lang = next;
  }
}

export function LanguageProvider({
  children,
  initialLanguage = "en",
}: {
  children: ReactNode;
  initialLanguage?: AppLanguage;
}) {
  const start = isAppLanguage(initialLanguage) ? initialLanguage : "en";
  const store = clientStore();
  if (store && !store.bootstrapped) {
    store.language = start;
    store.bootstrapped = true;
  }

  const language = useSyncExternalStore(subscribeLanguage, getLanguageSnapshot, () => start);

  useEffect(() => {
    const stored = readLanguage();
    const initial = stored ?? (isAppLanguage(start) ? start : detectAppLanguage());
    applyLanguage(initial);

    let cancelled = false;
    fetch("/api/settings")
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { settings?: { language?: string } };
      })
      .then((json) => {
        if (cancelled) return;
        const serverLang = json?.settings?.language;
        const local = readLanguage();
        if (local) {
          if (local !== serverLang) persistRemote(local);
          return;
        }
        if (isAppLanguage(serverLang)) {
          applyLanguage(serverLang);
          persistRemote(serverLang);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [start]);

  const setLanguage = useCallback((next: AppLanguage) => {
    applyLanguage(next);
    persistRemote(next);
  }, []);

  const t = useCallback<TranslateFn>(
    (key, vars) => translate(language, key, vars),
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
  return (
    <LanguageContext.Provider value={value}>
      <div className="contents" data-app-lang={language} lang={language}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useAppLanguage() {
  const context = useContext(LanguageContext);
  const language = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    () => context?.language ?? "en",
  );
  const setLanguage = context?.setLanguage ?? ((next: AppLanguage) => {
    applyLanguage(next);
    persistRemote(next);
  });
  const t = useCallback<TranslateFn>(
    (key, vars) => translate(language, key, vars),
    [language],
  );
  return { language, setLanguage, t };
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
