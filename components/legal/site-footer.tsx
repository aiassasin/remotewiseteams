"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useT } from "@/components/i18n/language-provider";

const LINK_KEYS = [
  { href: "/pricing", key: "footer.pricing" as const },
  { href: "/privacy", key: "footer.privacy" as const },
  { href: "/terms", key: "footer.terms" as const },
  { href: "/invoicing-terms", key: "footer.invoicingTerms" as const },
  { href: "/cookies", key: "footer.cookies" as const },
];

function LinkedInLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
    </svg>
  );
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

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
          <p className="font-sans text-small text-[#374151] dark:text-[#F3F4F6]">
            RemoteWise Teams, RW Teams Oy, Finland
          </p>
          {!compact ? (
            <p className="mt-1 max-w-xl font-sans text-small text-ink-muted">{t("footer.feesPublic")}</p>
          ) : null}
          <div className="mt-2 flex items-center gap-3">
            <a
              href="https://linkedin.com/company/remotewise"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#374151] hover:text-ink dark:text-white dark:hover:text-white"
            >
              <LinkedInLogo className="h-4 w-4" />
            </a>
            <a
              href="https://x.com/remotewise"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-[#374151] hover:text-ink dark:text-white dark:hover:text-white"
            >
              <XLogo className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com/remotewise"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-[#374151] hover:text-ink dark:text-white dark:hover:text-white"
            >
              <FacebookLogo className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com/remotewise"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#374151] hover:text-ink dark:text-white dark:hover:text-white"
            >
              <InstagramLogo className="h-4 w-4" />
            </a>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label={t("common.legal")}>
          <LanguageSwitcher />
          {LINK_KEYS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[13px] font-medium text-[#E5C94A] hover:text-[#C9A227]"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
