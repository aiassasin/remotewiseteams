"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useT } from "@/components/i18n/language-provider";
import type { MessageKey } from "@/lib/i18n";

const SEGMENT_KEYS: Record<string, MessageKey> = {
  dashboard: "common.dashboard",
  overview: "nav.overview",
  freelancers: "nav.freelancers",
  contracts: "nav.contracts",
  invoices: "nav.invoices",
  payouts: "nav.payouts",
  standups: "nav.standups",
  settings: "nav.settings",
  help: "nav.help",
  new: "common.new",
  review: "common.review",
};

export function PageBackNav() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = parts.map((part, index) => ({
    href: `/${parts.slice(0, index + 1).join("/")}`,
    label: labelFor(part, t),
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
        aria-label={t("common.goBack")}
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <nav aria-label={t("common.breadcrumb")} className="min-w-0">
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

function labelFor(segment: string, t: ReturnType<typeof useT>) {
  const key = SEGMENT_KEYS[segment];
  if (key) return t(key);
  if (/^[0-9a-f-]{8,}$/i.test(segment)) return t("common.details");
  return segment.replaceAll("-", " ").replace(/^\w/, (char) => char.toUpperCase());
}
