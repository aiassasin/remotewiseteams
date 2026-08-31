import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PricingNav } from "@/components/pricing/pricing-nav";
import { SiteFooter } from "@/components/legal/site-footer";

export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-page">
      <PricingNav />
      <main className="mx-auto w-full max-w-3xl px-6 py-12 lg:px-10">
        <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-primary-text">
          Legal
        </p>
        <h1 className="mt-3 rw-page-title">{title}</h1>
        <p className="mt-2 font-sans text-small text-ink-muted">Last updated {updated}</p>
        <div className="legal-prose mt-8 space-y-6 font-sans text-[15px] leading-relaxed text-ink-secondary">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export const LEGAL_UPDATED = "1 September 2026";

export function legalMetadata(title: string, description: string): Metadata {
  return { title, description };
}

export function LegalH2({ children }: { children: ReactNode }) {
  return <h2 className="font-display text-section text-ink">{children}</h2>;
}
