"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useT, useFormat } from "@/components/i18n/language-provider";
import type { StoredContract } from "@/lib/store";

export default function ContractsListPage() {
  const t = useT();
  const format = useFormat();
  const [contracts, setContracts] = useState<StoredContract[]>([]);

  useEffect(() => {
    fetch("/api/contracts")
      .then((res) => res.json())
      .then((data: { contracts: StoredContract[] }) => setContracts(data.contracts ?? []));
  }, []);

  const signed = contracts.filter((row) => row.status === "signed").length;
  const awaiting = contracts.filter((row) => row.status === "sent").length;
  const expired = contracts.filter((row) => row.status === "expired").length;

  return (
    <PageTransition>
      <PageHeader
        title={t("contracts.title")}
        description={t("contracts.description")}
        actions={
          <Button asChild>
            <Link href="/dashboard/contracts/new">{t("contracts.newContract")}</Link>
          </Button>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: t("contracts.totalContracts"), value: contracts.length },
          { label: t("contracts.signedThisMonth"), value: signed },
          { label: t("contracts.awaitingSignature"), value: awaiting },
          { label: t("contracts.expired"), value: expired },
        ].map((metric) => (
          <div key={metric.label} className="rw-card">
            <p className="font-sans text-small uppercase tracking-[0.05em] text-ink-muted">
              {metric.label}
            </p>
            <p className="mt-2 font-display text-[24px] font-semibold text-ink">{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-card border border-border bg-card">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-border">
              {[t("contracts.contractCol"), t("common.status"), t("contracts.sentCol"), t("contracts.signedCol"), ""].map(
                (heading) => (
                  <th
                    key={heading || "a"}
                    className="px-4 py-3 font-sans text-small uppercase tracking-[0.05em] text-ink-muted"
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {contracts.map((row) => (
              <tr key={row.id} className="hover:bg-page">
                <td className="px-4 py-3">
                  <Link href={`/dashboard/contracts/${row.id}`} className="font-sans text-[14px] font-medium text-ink">
                    {row.title}
                  </Link>
                  <p className="font-sans text-small text-ink-muted">{row.type}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge status={row.status}>{row.status}</Badge>
                </td>
                <td className="px-4 py-3 font-sans text-[13px] text-ink-secondary">
                  {row.sentAt ? format.date(row.sentAt) : "—"}
                </td>
                <td className="px-4 py-3 font-sans text-[13px] text-ink-secondary">
                  {row.signedAt ? format.date(row.signedAt) : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/dashboard/contracts/${row.id}`} className="font-sans text-[13px] text-primary">
                    {t("common.view")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageTransition>
  );
}
