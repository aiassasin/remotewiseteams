"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List, Search } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { InviteFreelancerModal } from "@/components/freelancers/invite-freelancer-modal";
import { FreelancerCardGrid } from "@/components/freelancers/freelancer-card-grid";
import { FreelancerTable } from "@/components/freelancers/freelancer-table";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IsoIcon } from "@/components/icons/iso-icon";
import { formatCurrency, initials } from "@/lib/utils";
import type { Freelancer, InviteFreelancerInput } from "@/lib/types";
import { useT } from "@/components/i18n/language-provider";

type ViewMode = "table" | "cards";
type StatusFilter = "all" | "active" | "invited" | "inactive";
type SortKey = "name" | "createdAt" | "rate" | "status";

function exportCsv(rows: Freelancer[], header: string[]) {
  const lines = rows.map((row) =>
    [
      row.fullName,
      row.email,
      row.role ?? "",
      row.hourlyRate ?? "",
      row.currency,
      row.status,
      row.country ?? "",
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "freelancers.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function FreelancersPageClient({
  initialFreelancers,
}: {
  initialFreelancers: Freelancer[];
}) {
  const t = useT();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [freelancers, setFreelancers] = useState(initialFreelancers);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [country, setCountry] = useState("all");
  const [view, setView] = useState<ViewMode>("table");
  const [sort, setSort] = useState<SortKey>("name");

  const countries = useMemo(() => {
    const values = new Set(
      freelancers.map((row) => row.country).filter((value): value is string => Boolean(value)),
    );
    return Array.from(values).sort();
  }, [freelancers]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = freelancers.filter((row) => {
      const matchesQuery =
        !needle ||
        row.fullName.toLowerCase().includes(needle) ||
        row.email.toLowerCase().includes(needle);
      const matchesStatus = status === "all" || row.status === status;
      const matchesCountry = country === "all" || row.country === country;
      return matchesQuery && matchesStatus && matchesCountry;
    });

    return rows.toSorted((a, b) => {
      if (sort === "name") return a.fullName.localeCompare(b.fullName);
      if (sort === "createdAt") return b.createdAt.localeCompare(a.createdAt);
      if (sort === "rate") return (b.hourlyRate ?? -1) - (a.hourlyRate ?? -1);
      return a.status.localeCompare(b.status);
    });
  }, [country, freelancers, query, sort, status]);

  function handleInvited(payload: InviteFreelancerInput & { inviteId?: string }) {
    const next: Freelancer = {
      id: payload.inviteId || crypto.randomUUID(),
      fullName: payload.name,
      email: payload.email,
      role: payload.role ?? null,
      hourlyRate: payload.rate ?? null,
      currency: payload.currency,
      status: "invited",
      country: null,
      avatarUrl: null,
      stripeOnboarded: false,
      contractCount: 0,
      invoiceCount: 0,
      createdAt: new Date().toISOString(),
    };
    setFreelancers((current) => [next, ...current]);
  }

  const empty = freelancers.length === 0;

  return (
    <PageTransition>
      <PageHeader
        title={t("freelancers.title")}
        description={t("freelancers.description")}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                exportCsv(filtered, [
                  t("freelancers.csvName"),
                  t("freelancers.csvEmail"),
                  t("freelancers.csvRole"),
                  t("freelancers.csvRate"),
                  t("freelancers.csvCurrency"),
                  t("freelancers.csvStatus"),
                  t("freelancers.csvCountry"),
                ])
              }
              disabled={empty}
            >
              <IsoIcon name="export-csv" size={20} />
              {t("freelancers.exportCsv")}
            </Button>
            <Button onClick={() => setInviteOpen(true)}>
              <IsoIcon name="invite" size={20} />
              {t("freelancers.invite")}
            </Button>
          </>
        }
      />

      {!empty ? (
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-[280px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("freelancers.searchPlaceholder")}
                className="pl-9"
                aria-label={t("freelancers.searchAria")}
              />
            </div>
            <select
              className="rw-input w-full sm:w-[160px]"
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
              aria-label={t("freelancers.filterStatus")}
            >
              <option value="all">{t("common.all")}</option>
              <option value="active">{t("status.active")}</option>
              <option value="invited">{t("status.invited")}</option>
              <option value="inactive">{t("status.inactive")}</option>
            </select>
            <select
              className="rw-input w-full sm:w-[180px]"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              aria-label={t("freelancers.filterCountry")}
            >
              <option value="all">{t("freelancers.allCountries")}</option>
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden rounded-control border border-border bg-card p-0.5 md:flex">
              <button
                type="button"
                aria-label={t("freelancers.tableView")}
                aria-pressed={view === "table"}
                onClick={() => setView("table")}
                className={`rounded-[6px] p-2 ${view === "table" ? "bg-primary-light text-primary-text" : "text-ink-muted hover:text-ink"}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={t("freelancers.cardView")}
                aria-pressed={view === "cards"}
                onClick={() => setView("cards")}
                className={`rounded-[6px] p-2 ${view === "cards" ? "bg-primary-light text-primary-text" : "text-ink-muted hover:text-ink"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
            <select
              className="rw-input w-[160px]"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              aria-label={t("freelancers.sortBy")}
            >
              <option value="name">{t("freelancers.sortName")}</option>
              <option value="createdAt">{t("freelancers.sortDate")}</option>
              <option value="rate">{t("freelancers.sortRate")}</option>
              <option value="status">{t("freelancers.sortStatus")}</option>
            </select>
          </div>
        </div>
      ) : null}

      {empty ? (
        <div className="rw-card">
          <EmptyState
            icon="invite"
            title={t("freelancers.emptyTitle")}
            description={t("freelancers.emptyBody")}
            actionLabel={t("freelancers.inviteFirst")}
            onAction={() => setInviteOpen(true)}
          />
        </div>
      ) : (
        <>
          <div className="md:hidden">
            <FreelancerCardGrid
              rows={filtered}
              formatCurrency={formatCurrency}
              initials={initials}
            />
          </div>
          <div className="hidden md:block">
            {view === "table" ? (
              <FreelancerTable
                rows={filtered}
                formatCurrency={formatCurrency}
                initials={initials}
              />
            ) : (
              <FreelancerCardGrid
                rows={filtered}
                formatCurrency={formatCurrency}
                initials={initials}
              />
            )}
          </div>
        </>
      )}

      {!empty && filtered.length === 0 ? (
        <p className="mt-8 text-center font-sans text-body text-ink-slate">
          {t("freelancers.noMatch")}
        </p>
      ) : null}

      <InviteFreelancerModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvited={handleInvited}
      />
    </PageTransition>
  );
}
