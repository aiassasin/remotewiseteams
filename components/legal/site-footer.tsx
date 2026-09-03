"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { FINLAND_COMPLIANCE } from "@/lib/compliance/finland";
import { useT } from "@/components/i18n/language-provider";

const LINK_KEYS = [
  { href: "/pricing", key: "footer.pricing" as const },
  { href: "/privacy", key: "footer.privacy" as const },
  { href: "/terms", key: "footer.terms" as const },
  { href: "/invoicing-terms", key: "footer.invoicingTerms" as const },
  { href: "/cookies", key: "footer.cookies" as const },
];

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const t = useT();

  return (
    <footer className="border-t border-border bg-card">
      <div
        className={`mx-auto flex w-full flex-col gap-3 px-6 py-6 lg:px-10 ${
          compact ? "sm:flex-row sm:items-center sm:justify-between" : "sm:flex-row sm:items-start sm:justify-between"
        }`}
      >
        <div>
          <p className="font-sans text-small text-ink-muted">
            {FINLAND_COMPLIANCE.operatorName} · {FINLAND_COMPLIANCE.legalEntityName} · {t("common.finland")}
          </p>
          {!compact ? (
            <p className="mt-1 max-w-xl font-sans text-small text-ink-muted">{t("footer.feesPublic")}</p>
          ) : null}
        </div>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label={t("common.legal")}>
          <LanguageSwitcher />
          {LINK_KEYS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[13px] font-medium text-primary hover:text-primary-hover"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
