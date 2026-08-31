"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StoredContract } from "@/lib/store";

export default function ContractsListPage() {
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
        title="Contracts"
        description="Create, send, and track e-signed agreements."
        actions={
          <Button asChild>
            <Link href="/dashboard/contracts/new">New contract</Link>
          </Button>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "Total contracts", value: contracts.length },
          { label: "Signed this month", value: signed },
          { label: "Awaiting signature", value: awaiting },
          { label: "Expired", value: expired },
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
              {["Contract", "Status", "Sent", "Signed", ""].map((heading) => (
                <th key={heading || "a"} className="px-4 py-3 font-sans text-small uppercase tracking-[0.05em] text-ink-muted">
                  {heading}
                </th>
              ))}
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
                  {row.sentAt ? new Date(row.sentAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 font-sans text-[13px] text-ink-secondary">
                  {row.signedAt ? new Date(row.signedAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/dashboard/contracts/${row.id}`} className="font-sans text-[13px] text-primary">
                    View
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
