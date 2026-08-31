"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  overview: "Overview",
  freelancers: "Freelancers",
  contracts: "Contracts",
  invoices: "Invoices",
  payouts: "Payouts",
  standups: "Standups",
  settings: "Settings",
  new: "New",
  review: "Review",
};

function labelFor(segment: string) {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  if (/^[0-9a-f-]{8,}$/i.test(segment)) return "Details";
  return segment.replaceAll("-", " ").replace(/^\w/, (char) => char.toUpperCase());
}

export function PageBackNav() {
  const pathname = usePathname();
  const router = useRouter();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = parts.map((part, index) => ({
    href: `/${parts.slice(0, index + 1).join("/")}`,
    label: labelFor(part),
  }));

  const parentHref =
    crumbs.length > 1 ? crumbs[crumbs.length - 2].href : "/dashboard/overview";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <button
        type="button"
        onClick={() => {
          if (typeof document !== "undefined" && document.referrer.includes(window.location.host)) {
            router.back();
            return;
          }
          router.push(parentHref);
        }}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-border bg-card text-ink hover:border-border-hover"
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex min-w-0 flex-wrap items-center gap-1.5 font-sans text-[13px]">
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex min-w-0 items-center gap-1.5">
                {index > 0 ? <span className="text-ink-muted">/</span> : null}
                {last ? (
                  <span className="truncate font-medium text-ink">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="truncate text-ink-muted hover:text-cyan">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
