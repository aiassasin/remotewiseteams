"use client";

import { PageTransition } from "@/components/motion/page-transition";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useT } from "@/components/i18n/language-provider";

export function FreelancerDashboardClient() {
  const t = useT();
  return (
    <PageTransition>
      <h1 className="rw-page-title">{t("freelancer.title")}</h1>
      <p className="mt-2 font-sans text-body text-ink-secondary">{t("freelancer.description")}</p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/freelancer/invoices/new">{t("freelancer.createInvoice")}</Link>
        </Button>
      </div>
      <div className="mt-8">
        <EmptyState
          icon="contracts"
          title={t("freelancer.noContractsTitle")}
          description={t("freelancer.noContractsBody")}
        />
      </div>
    </PageTransition>
  );
}
