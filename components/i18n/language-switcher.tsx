"use client";

import { SWITCHER_LANGUAGES, SWITCHER_LANGUAGE_LABELS, isAppLanguage } from "@/lib/i18n";
import { useAppLanguage, useT } from "@/components/i18n/language-provider";

export function LanguageSwitcher({ inverted = false }: { inverted?: boolean }) {
  const { language, setLanguage } = useAppLanguage();
  const t = useT();
  const label = t("common.language");
  const value = isAppLanguage(language) ? language : "en";

  return (
    <label className="flex shrink-0 items-center gap-2">
      <span className="sr-only">{label}</span>
      <select
        className={
          inverted
            ? "h-9 w-full min-w-[8.5rem] rounded-control border border-white/20 bg-white/10 px-2 font-sans text-[13px] font-medium text-white"
            : "h-9 min-w-[8.5rem] shrink-0 rounded-control border border-border bg-card px-2 font-sans text-[13px] font-medium text-ink transition-colors hover:border-primary"
        }
        value={value}
        aria-label={label}
        onChange={(event) => setLanguage(event.target.value as (typeof SWITCHER_LANGUAGES)[number])}
      >
        {SWITCHER_LANGUAGES.map((code) => (
          <option key={code} value={code}>
            {SWITCHER_LANGUAGE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
