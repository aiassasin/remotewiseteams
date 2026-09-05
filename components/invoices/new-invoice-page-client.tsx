"use client";

import { InvoiceBuilder } from "@/components/invoices/invoice-builder";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { EmptyState } from "@/components/empty-state";
import { useT } from "@/components/i18n/language-provider";
import type { FreelancerBillingProfile } from "@/lib/invoices";

export function NewInvoicePageClient({ profile }: { profile: FreelancerBillingProfile | null }) {
  const t = useT();

  if (!profile) {
    return (
      <PageTransition>
        <PageHeader title={t("invoices.builderTitle")} />
        <div className="rw-card">
          <EmptyState
            icon="invoices"
            title={t("invoices.missingProfileTitle")}
            description={t("invoices.missingProfileBody")}
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageHeader title={t("invoices.builderTitle")} description={t("invoices.builderDescription")} />
      <InvoiceBuilder profile={profile} />
    </PageTransition>
  );
}
