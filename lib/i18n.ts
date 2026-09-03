import type { ContractLanguage } from "@/lib/contracts/i18n";
import de from "@/locales/de.json";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import fi from "@/locales/fi.json";
import fr from "@/locales/fr.json";

export type AppLanguage = ContractLanguage;
export type Messages = typeof en;
export type MessageKey = DotPaths<Messages>;
export type TranslateVars = Record<string, string | number>;

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
  de: de as Messages,
  fr: fr as Messages,
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
