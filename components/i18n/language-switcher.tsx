"use client";

import { CONTRACT_LANGUAGES, LANGUAGE_LABELS } from "@/lib/contracts/i18n";
import { useAppLanguage, useT } from "@/components/i18n/language-provider";

export function LanguageSwitcher({ inverted = false }: { inverted?: boolean }) {
  const { language, setLanguage } = useAppLanguage();
  const t = useT();
  const label = t("common.language");

  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">{label}</span>
      <select
        className={
          inverted
            ? "h-9 w-full rounded-control border border-white/20 bg-white/10 px-2 font-sans text-[13px] font-medium text-white"
            : "h-9 rounded-control border border-border bg-card px-2 font-sans text-[13px] font-medium text-ink transition-colors hover:border-primary"
        }
        value={language}
        aria-label={label}
        onChange={(event) => setLanguage(event.target.value as (typeof CONTRACT_LANGUAGES)[number])}
      >
        {CONTRACT_LANGUAGES.map((code) => (
          <option key={code} value={code}>
            {LANGUAGE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
