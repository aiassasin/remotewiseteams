"use client";

import { useT } from "@/components/i18n/language-provider";

export function SkipToContent() {
  const t = useT();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-card focus:px-3 focus:py-2 focus:text-ink focus:shadow-focus"
    >
      {t("common.skipToContent")}
    </a>
  );
}
