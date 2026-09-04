import { CONTRACT_LANGUAGES, type ContractLanguage } from "@/lib/contracts/i18n";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import fi from "@/locales/fi.json";
import sv from "@/locales/sv.json";

/** UI language switcher: English, Finnish, Swedish, Spanish. */
export const SWITCHER_LANGUAGES = ["en", "fi", "sv", "es"] as const;

export type AppLanguage = (typeof SWITCHER_LANGUAGES)[number];
export type Messages = typeof en;
export type MessageKey = DotPaths<Messages>;
export type TranslateVars = Record<string, string | number>;

export const SWITCHER_LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: "English",
  fi: "Suomi",
  sv: "Svenska",
  es: "Español",
};

/** @deprecated Use SWITCHER_LANGUAGES. Kept as an alias for call sites that import APP_LANGUAGES. */
export const APP_LANGUAGES = SWITCHER_LANGUAGES;
export const APP_LANGUAGE_STORAGE_KEY = "rw-language";
export const APP_LANGUAGE_COOKIE = "rw-language";

const LEGACY_UI_LANGUAGES = new Set(["de", "fr"]);

/**
 * Returns true when `value` is a switcher locale (en, fi, sv, es).
 * Stored `de` / `fr` are not accepted — use {@link normalizeAppLanguage}.
 */
export function isAppLanguage(value: unknown): value is AppLanguage {
  return typeof value === "string" && (SWITCHER_LANGUAGES as readonly string[]).includes(value);
}

/**
 * Maps leftover German/French UI prefs to English; otherwise returns a valid switcher locale.
 */
export function normalizeAppLanguage(value: unknown): AppLanguage {
  if (isAppLanguage(value)) return value;
  if (typeof value === "string" && LEGACY_UI_LANGUAGES.has(value)) return "en";
  return "en";
}

/**
 * Picks a UI language from the browser, ignoring de/fr (mapped to English).
 */
export function detectAppLanguage(): AppLanguage {
  if (typeof navigator === "undefined") return "en";
  const code = (navigator.language || "en").slice(0, 2).toLowerCase();
  return normalizeAppLanguage(code);
}

/**
 * Contract documents still use en/fi/de/fr/es. Swedish UI falls back to English templates.
 */
export function toContractLanguage(language: string): ContractLanguage {
  if ((CONTRACT_LANGUAGES as readonly string[]).includes(language)) {
    return language as ContractLanguage;
  }
  return "en";
}

type DotPaths<T, Prefix extends string = ""> = T extends string
  ? Prefix extends ""
    ? never
    : Prefix
  : {
      [K in keyof T & string]: DotPaths<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>;
    }[keyof T & string];

const CATALOG: Record<AppLanguage, Messages> = {
  en,
  fi: fi as Messages,
  sv: sv as Messages,
  es: es as Messages,
};

function lookup(messages: Messages, key: string): string | undefined {
  const parts = key.split(".");
  let current: unknown = messages;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = vars[name];
    return value === undefined ? match : String(value);
  });
}

export function getMessages(language: AppLanguage): Messages {
  return CATALOG[language] ?? CATALOG.en;
}

export function translate(language: AppLanguage, key: MessageKey, vars?: TranslateVars): string {
  const raw = lookup(getMessages(language), key) ?? lookup(CATALOG.en, key) ?? key;
  return interpolate(raw, vars);
}

export function hasMessage(language: AppLanguage, key: string): boolean {
  return Boolean(lookup(getMessages(language), key) ?? lookup(CATALOG.en, key));
}

export function statusMessageKey(status: string): MessageKey | null {
  const normalized = status.trim().toLowerCase().replaceAll(" ", "_");
  const key = `status.${normalized}`;
  return hasMessage("en", key) ? (key as MessageKey) : null;
}
