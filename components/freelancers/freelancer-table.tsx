"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Freelancer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { countryFlag } from "@/lib/flags";

export function FreelancerTable({
  rows,
  formatCurrency,
  initials,
}: {
  rows: Freelancer[];
  formatCurrency: (amount: number | null | undefined, currency?: string) => string;
  initials: (name: string) => string;
}) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-card border border-border bg-card">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            {["Freelancer", "Role", "Rate", "Status", "Contracts", "Payment", ""].map(
              (heading) => (
                <th
                  key={heading || "actions"}
                  className="px-4 py-3 font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id}
              tabIndex={0}
              onClick={() => router.push(`/dashboard/freelancers/${row.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  router.push(`/dashboard/freelancers/${row.id}`);
                }
              }}
              className={cn(
                "cursor-pointer border-b border-transparent transition-colors duration-100 last:border-0 hover:border-border hover:bg-page",
              )}
              style={{
                animationDelay: `${Math.min(index, 7) * 40}ms`,
              }}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {row.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.avatarUrl}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light font-sans text-small font-medium text-primary-text">
                      {initials(row.fullName)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-sans text-[14px] font-medium text-ink">
                      {countryFlag(row.country)} {row.fullName}
                    </p>
                    <p className="truncate font-sans text-small text-ink-muted">
                      {row.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 font-sans text-[13px] text-ink-secondary">
                {row.role ?? "—"}
              </td>
              <td className="px-4 py-3 font-sans text-[13px] font-medium text-ink">
                {formatCurrency(row.hourlyRate, row.currency)}
              </td>
              <td className="px-4 py-3">
                <Badge status={row.status}>{row.status}</Badge>
              </td>
              <td className="px-4 py-3 font-sans text-[13px] font-medium text-primary-text">
                {row.contractCount}
              </td>
              <td className="px-4 py-3 font-sans text-[13px]">
                {row.stripeOnboarded ? (
                  <span className="text-success-text">Connected</span>
                ) : (
                  <span className="text-warning-text">Not set up</span>
                )}
              </td>
              <td className="px-4 py-3 text-right" onClick={(event) => event.stopPropagation()}>
                <Link
                  href={`/dashboard/freelancers/${row.id}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-control text-ink-muted hover:bg-page hover:text-ink"
                  aria-label={`Open actions for ${row.fullName}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
