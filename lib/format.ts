import type { AppLanguage } from "@/lib/i18n";

export const LOCALE_TAGS: Record<AppLanguage, string> = {
  en: "en-GB",
  fi: "fi-FI",
  sv: "sv-SE",
  es: "es-ES",
  ar: "ar",
};

/** Western digits on invoices and money — expected in a Finnish EUR product. */
const NUMBERING: Intl.NumberFormatOptions = { numberingSystem: "latn" };

export function localeTag(language: AppLanguage | string): string {
  if (language in LOCALE_TAGS) return LOCALE_TAGS[language as AppLanguage];
  return LOCALE_TAGS.en;
}

export function formatMoney(
  amount: number | null | undefined,
  currency: string = "EUR",
  language: AppLanguage | string = "en",
): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "—";
  }
  try {
    return new Intl.NumberFormat(localeTag(language), {
      ...NUMBERING,
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function formatMoneyExact(
  amount: number,
  currency: string,
  language: AppLanguage | string = "en",
): string {
  try {
    return new Intl.NumberFormat(localeTag(language), {
      ...NUMBERING,
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function formatDate(
  value: string | number | Date | null | undefined,
  language: AppLanguage | string = "en",
): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(localeTag(language), {
    numberingSystem: "latn",
    dateStyle: "medium",
  }).format(date);
}

export function formatDateTime(
  value: string | number | Date | null | undefined,
  language: AppLanguage | string = "en",
): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(localeTag(language), {
    numberingSystem: "latn",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatNumber(
  value: number,
  language: AppLanguage | string = "en",
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(localeTag(language), { ...NUMBERING, ...options }).format(value);
}
