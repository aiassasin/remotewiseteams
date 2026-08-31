"use client";

import { useMemo, useState } from "react";
import { Download, LayoutGrid, List, Search, Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { InviteFreelancerModal } from "@/components/freelancers/invite-freelancer-modal";
import { FreelancerCardGrid } from "@/components/freelancers/freelancer-card-grid";
import { FreelancerTable } from "@/components/freelancers/freelancer-table";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, initials } from "@/lib/utils";
import type { Freelancer, InviteFreelancerInput } from "@/lib/types";

type ViewMode = "table" | "cards";
type StatusFilter = "all" | "active" | "invited" | "inactive";
type SortKey = "name" | "createdAt" | "rate" | "status";

function exportCsv(rows: Freelancer[]) {
  const header = ["Name", "Email", "Role", "Rate", "Currency", "Status", "Country"];
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
        title="Freelancers"
        description="Invite talent, track status, and keep every contract in one roster."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => exportCsv(filtered)}
              disabled={empty}
            >
              <Download className="h-4 w-4" aria-hidden />
              Export CSV
            </Button>
            <Button onClick={() => setInviteOpen(true)}>
              Invite freelancer
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
                placeholder="Search by name or email..."
                className="pl-9"
                aria-label="Search freelancers"
              />
            </div>
            <select
              className="rw-input w-full sm:w-[160px]"
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
              aria-label="Filter by status"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              className="rw-input w-full sm:w-[180px]"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              aria-label="Filter by country"
            >
              <option value="all">All countries</option>
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-control border border-border bg-white p-0.5">
              <button
                type="button"
                aria-label="Table view"
                aria-pressed={view === "table"}
                onClick={() => setView("table")}
                className={`rounded-[6px] p-2 ${view === "table" ? "bg-primary-light text-primary-text" : "text-ink-muted hover:text-ink"}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Card view"
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
              aria-label="Sort by"
            >
              <option value="name">Sort by name</option>
              <option value="createdAt">Sort by date added</option>
              <option value="rate">Sort by rate</option>
              <option value="status">Sort by status</option>
            </select>
          </div>
        </div>
      ) : null}

      {empty ? (
        <div className="rw-card">
          <EmptyState
            icon={Users}
            title="No freelancers yet"
            description="Invite your first freelancer to send contracts, collect invoices, and pay them from one workspace."
            actionLabel="Invite your first freelancer"
            onAction={() => setInviteOpen(true)}
          />
        </div>
      ) : view === "table" ? (
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

      {!empty && filtered.length === 0 ? (
        <p className="mt-8 text-center font-sans text-body text-ink-slate">
          No freelancers match these filters.
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
