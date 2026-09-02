"use client";

import { InvoiceList } from "@/components/invoices/invoice-list";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/i18n/language-provider";
import type { InvoiceRecord } from "@/lib/invoices";
import Link from "next/link";

export function InvoicesPageClient({
  invoices,
  error,
  role,
  createHref,
  descriptionKey,
}: {
  invoices: InvoiceRecord[];
  error: string | null;
  role: "company" | "freelancer";
  createHref?: string;
  descriptionKey: "invoices.description" | "invoices.freelancerDescription";
}) {
  const t = useT();

  return (
    <PageTransition>
      <PageHeader
        title={t("invoices.title")}
        description={t(descriptionKey)}
        actions={
          createHref ? (
            <Button asChild>
              <Link href={createHref}>{t("invoices.newInvoice")}</Link>
            </Button>
          ) : undefined
        }
      />
      {error ? (
        <div className="rw-card">
          <EmptyState icon="invoices" title={t("invoices.loadError")} description={error} />
        </div>
      ) : (
        <InvoiceList invoices={invoices} role={role} createHref={createHref} />
      )}
    </PageTransition>
  );
}
