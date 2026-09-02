"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { MoneyCircle } from "@/components/motion/money-circle";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { useT } from "@/components/i18n/language-provider";
import { formatPricingMoney, type PricingCurrency } from "@/lib/pricing";
import type { InvoiceRecord } from "@/lib/invoices";

export function PayoutsPageClient({
  invoices,
  error,
  role,
}: {
  invoices: InvoiceRecord[];
  error: string | null;
  role: "company" | "freelancer";
}) {
  const t = useT();

  return (
    <PageTransition>
      <PageHeader title={t("payouts.title")} description={t("payouts.description")} />
      {error ? (
        <div className="rw-card">
          <EmptyState icon="payouts" title={t("payouts.loadError")} description={error} />
        </div>
      ) : (
        <PayoutsClient invoices={invoices} role={role} />
      )}
    </PageTransition>
  );
}

function PayoutsClient({
  invoices,
  role,
}: {
  invoices: InvoiceRecord[];
  role: "company" | "freelancer";
}) {
  const t = useT();
  const [rows, setRows] = useState(invoices);
  const [busyId, setBusyId] = useState<string | null>(null);
  const eligible = rows.filter((row) => row.status === "paid" || row.status === "paid_out");
  const totals = useMemo(() => {
    const keep = eligible.reduce((sum, row) => sum + row.youKeep, 0);
    const fees = eligible.reduce((sum, row) => sum + row.serviceFee + row.shieldFee, 0);
    return { keep, fees };
  }, [eligible]);

  async function payout(id: string, speed: "standard" | "lightning") {
    setBusyId(id);
    const response = await fetch(`/api/invoices/${id}/payout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ speed }),
    });
    const json = (await response.json()) as { message?: string; youKeep?: number };
    setBusyId(null);
    if (!response.ok) {
      toast.error(json.message || t("payouts.payoutFailed"));
      return;
    }
    setRows((current) =>
      current.map((row) =>
        row.id === id ? { ...row, status: "paid_out", youKeep: json.youKeep ?? row.youKeep } : row,
      ),
    );
    toast.success(speed === "lightning" ? t("payouts.lightningQueued") : t("payouts.standardQueued"));
  }

  if (!eligible.length) {
    return (
      <div className="rw-card">
        <EmptyState
          icon="payouts"
          title={t("payouts.emptyTitle")}
          description={role === "freelancer" ? t("payouts.emptyFreelancer") : t("payouts.emptyCompany")}
          actionLabel={t("payouts.openInvoices")}
          actionHref={role === "freelancer" ? "/freelancer/invoices" : "/dashboard/invoices"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MoneyCircle
        keep={totals.keep}
        fees={totals.fees}
        label={t("payouts.paidOutReady")}
        formattedKeep={formatPricingMoney(totals.keep, "EUR")}
        size={140}
      />
      <ul className="space-y-3 md:hidden">
        {eligible.map((row) => (
          <PayoutCard
            key={row.id}
            row={row}
            busy={busyId === row.id}
            canPayout={role === "freelancer"}
            onPayout={payout}
          />
        ))}
      </ul>
      <div className="hidden overflow-x-auto rounded-card border border-border bg-card md:block">
        <table className="min-w-[720px] w-full text-left">
          <thead>
            <tr className="border-b border-border">
              {[t("invoices.invoiceCol"), t("payouts.youKeep"), t("common.status"), ""].map((head) => (
                <th
                  key={head || "actions"}
                  className="px-4 py-3 font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {eligible.map((row) => {
              const currency = (row.currency as PricingCurrency) || "EUR";
              return (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-mono text-ink">{row.invoiceNumber}</td>
                  <td className="px-4 py-3 font-sans text-[14px] text-ink">
                    {formatPricingMoney(row.youKeep, currency)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={row.status}>{row.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.status === "paid" && role === "freelancer" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          loading={busyId === row.id}
                          onClick={() => payout(row.id, "standard")}
                        >
                          {t("invoices.standard24h")}
                        </Button>
                        <Button size="sm" loading={busyId === row.id} onClick={() => payout(row.id, "lightning")}>
                          {t("invoices.lightning")}
                        </Button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PayoutCard({
  row,
  busy,
  canPayout,
  onPayout,
}: {
  row: InvoiceRecord;
  busy: boolean;
  canPayout: boolean;
  onPayout: (id: string, speed: "standard" | "lightning") => void;
}) {
  const t = useT();
  const currency = (row.currency as PricingCurrency) || "EUR";
  return (
    <li className="rounded-card border border-border bg-card p-4">
      <p className="font-mono text-mono text-ink">{row.invoiceNumber}</p>
      <p className="mt-1 font-sans text-[14px] text-ink">{formatPricingMoney(row.youKeep, currency)}</p>
      <Badge className="mt-2" status={row.status}>
        {row.status}
      </Badge>
      {row.status === "paid" && canPayout ? (
        <div className="mt-3 flex flex-col gap-2">
          <Button size="sm" variant="secondary" loading={busy} onClick={() => onPayout(row.id, "standard")}>
            {t("invoices.standard24h")}
          </Button>
          <Button size="sm" loading={busy} onClick={() => onPayout(row.id, "lightning")}>
            {t("invoices.lightning")}
          </Button>
        </div>
      ) : null}
    </li>
  );
}
