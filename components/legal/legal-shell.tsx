"use client";

import type { ReactNode } from "react";
import { PricingNav } from "@/components/pricing/pricing-nav";
import { SiteFooter } from "@/components/legal/site-footer";
import { useFormat, useT } from "@/components/i18n/language-provider";

export const LEGAL_UPDATED_ISO = "2026-09-01";

export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const t = useT();
  const format = useFormat();
  return (
    <div className="min-h-screen bg-page">
      <PricingNav />
      <main id="main" className="mx-auto w-full max-w-3xl px-6 py-12 lg:px-10">
        <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-primary-text">
          {t("footer.kicker")}
        </p>
        <h1 className="mt-3 rw-page-title">{title}</h1>
        <p className="mt-2 font-sans text-small text-ink-muted">
          {t("footer.lastUpdated", { date: format.date(LEGAL_UPDATED_ISO) })}
        </p>
        <p className="mt-3 rounded-control border border-border bg-page px-3 py-2 font-sans text-[13px] text-ink-secondary">
          {t("footer.disclaimer")}
        </p>
        <div className="legal-prose mt-8 space-y-6 font-sans text-[15px] leading-relaxed text-ink-secondary">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalH2({ children }: { children: ReactNode }) {
  return <h2 className="font-display text-section text-ink">{children}</h2>;
}
