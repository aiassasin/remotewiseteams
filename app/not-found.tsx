"use client";

import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { SiteFooter } from "@/components/legal/site-footer";
import { RwLogo } from "@/components/brand/rw-logo";
import { useT } from "@/components/i18n/language-provider";

export default function NotFound() {
  const t = useT();
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <header className="flex h-14 items-center px-6">
        <RwLogo href="/" />
      </header>
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-lg">
          <EmptyState
            icon="help"
            title={t("errors.notFoundTitle")}
            description={t("errors.notFoundBody")}
            actionLabel={t("errors.goPricing")}
            actionHref="/pricing"
          />
          <p className="mt-4 text-center font-sans text-small text-ink-muted">
            {t("errors.preferHuman")}{" "}
            <Link href="/dashboard/help" className="text-primary underline-offset-2 hover:underline">
              {t("nav.help")}
            </Link>
            . {t("errors.reply24h")}
          </p>
        </div>
      </main>
      <SiteFooter compact />
    </div>
  );
}
