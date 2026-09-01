"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { MoneyCircle } from "@/components/motion/money-circle";
import { formatPricingMoney, type PricingCurrency } from "@/lib/pricing";
import { canCancelInvoice, type InvoiceRecord } from "@/lib/invoices";

export function InvoiceList({
  invoices,
  role,
  createHref,
}: {
  invoices: InvoiceRecord[];
  role: "company" | "freelancer";
  createHref?: string;
}) {
  const [rows, setRows] = useState(invoices);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const totals = useMemo(() => {
    const open = rows.filter((row) => row.status !== "cancelled");
    const keep = open.reduce((sum, row) => sum + row.youKeep, 0);
    const fees = open.reduce((sum, row) => sum + row.serviceFee + row.shieldFee, 0);
    return { keep, fees };
  }, [rows]);

  async function patchRow(id: string, invoice: InvoiceRecord) {
    setRows((current) => current.map((row) => (row.id === id ? invoice : row)));
  }

  async function postAction(id: string, path: string, body?: object) {
    setBusyId(id);
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = (await response.json()) as {
      invoice?: InvoiceRecord;
      url?: string;
      message?: string;
      youKeep?: number;
    };
    setBusyId(null);
    if (!response.ok) {
      toast.error(json.message || "That action did not complete");
      return;
    }
    if (json.url) {
      window.location.assign(json.url);
      return;
    }
    if (json.invoice) await patchRow(id, json.invoice);
    else if (json.youKeep !== undefined) {
      setRows((current) =>
        current.map((row) =>
          row.id === id ? { ...row, status: "paid_out", youKeep: json.youKeep ?? row.youKeep } : row,
        ),
      );
    }
    toast.success("Done.");
  }

  if (!rows.length) {
    return (
      <div className="rw-card">
        <EmptyState
          icon="invoices"
          title="No invoices yet."
          description={
            role === "freelancer"
              ? "When you land your first client, create one in 60 seconds. Address and bank details fill from your profile."
              : "When you land billed work against a contract, it appears here."
          }
          actionLabel={createHref ? "Create invoice" : undefined}
          actionHref={createHref}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <MoneyCircle
          keep={totals.keep}
          fees={totals.fees}
          label="You receive"
          formattedKeep={formatPricingMoney(totals.keep, "EUR")}
          size={140}
        />
        {createHref ? (
          <Button asChild>
            <Link href={createHref}>New invoice</Link>
          </Button>
        ) : null}
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-card border border-border bg-card p-4">
            <InvoiceCard
              row={row}
              role={role}
              busy={busyId === row.id}
              onCancel={() => setCancelId(row.id)}
              onAction={postAction}
            />
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-card border border-border bg-card md:block">
        <table className="min-w-[720px] w-full text-left">
          <thead>
            <tr className="border-b border-border">
              {["Invoice", "Client", "Amount", "You keep", "Status", ""].map((head) => (
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
            {rows.map((row) => {
              const currency = (row.currency as PricingCurrency) || "EUR";
              return (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-mono text-ink">{row.invoiceNumber}</td>
                  <td className="px-4 py-3 font-sans text-[14px] text-ink">{row.clientName || "—"}</td>
                  <td className="px-4 py-3 font-sans text-[14px] text-ink">
                    {formatPricingMoney(row.amount, currency)}
                  </td>
                  <td className="px-4 py-3 font-sans text-[14px] text-ink">
                    {formatPricingMoney(row.youKeep, currency)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={row.status}>{row.status.replaceAll("_", " ")}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <InvoiceActions
                      row={row}
                      role={role}
                      busy={busyId === row.id}
                      onCancel={() => setCancelId(row.id)}
                      onAction={postAction}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={Boolean(cancelId)} onOpenChange={(open) => !open && setCancelId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this invoice?</DialogTitle>
            <DialogDescription>
              The company is notified and an audit event is stored. You can only cancel while the
              invoice is draft or sent.
            </DialogDescription>
          </DialogHeader>
          <label className="rw-label" htmlFor="cancel-reason">
            Reason
          </label>
          <textarea
            id="cancel-reason"
            className="rw-input min-h-[88px]"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setCancelId(null)}>
              Keep invoice
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!cancelId) return;
                const response = await fetch(`/api/invoices/${cancelId}/cancel`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ reason }),
                });
                const json = (await response.json()) as { invoice?: InvoiceRecord; message?: string };
                if (!response.ok || !json.invoice) {
                  toast.error(json.message || "Could not cancel");
                  return;
                }
                setRows((current) =>
                  current.map((row) => (row.id === json.invoice?.id ? json.invoice : row)),
                );
                setCancelId(null);
                setReason("");
                toast.success("Invoice cancelled. The company was notified.");
              }}
            >
              Cancel invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InvoiceCard({
  row,
  role,
  busy,
  onCancel,
  onAction,
}: {
  row: InvoiceRecord;
  role: "company" | "freelancer";
  busy: boolean;
  onCancel: () => void;
  onAction: (id: string, path: string, body?: object) => void;
}) {
  const currency = (row.currency as PricingCurrency) || "EUR";
  return (
    <>
      <p className="font-mono text-mono text-ink">{row.invoiceNumber}</p>
      <p className="mt-1 font-sans text-[14px] text-ink">{row.clientName || "Client"}</p>
      <p className="mt-1 font-sans text-[14px] text-ink">{formatPricingMoney(row.amount, currency)}</p>
      <p className="font-sans text-small text-ink-secondary">
        You keep {formatPricingMoney(row.youKeep, currency)}
      </p>
      <Badge className="mt-2" status={row.status}>
        {row.status.replaceAll("_", " ")}
      </Badge>
      <div className="mt-3">
        <InvoiceActions row={row} role={role} busy={busy} onCancel={onCancel} onAction={onAction} />
      </div>
    </>
  );
}

function InvoiceActions({
  row,
  role,
  busy,
  onCancel,
  onAction,
}: {
  row: InvoiceRecord;
  role: "company" | "freelancer";
  busy: boolean;
  onCancel: () => void;
  onAction: (id: string, path: string, body?: object) => void;
}) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {role === "freelancer" && row.status === "draft" ? (
        <Button size="sm" loading={busy} onClick={() => onAction(row.id, `/api/invoices/${row.id}/send`)}>
          Send
        </Button>
      ) : null}
      {role === "company" &&
      ["sent", "pending", "approved"].includes(row.status) ? (
        <Button size="sm" loading={busy} onClick={() => onAction(row.id, `/api/invoices/${row.id}/pay`)}>
          Pay by card
        </Button>
      ) : null}
      {role === "freelancer" && row.status === "paid" ? (
        <>
          <Button
            size="sm"
            variant="secondary"
            loading={busy}
            onClick={() => onAction(row.id, `/api/invoices/${row.id}/payout`, { speed: "standard" })}
          >
            Standard 24h
          </Button>
          <Button
            size="sm"
            loading={busy}
            onClick={() => onAction(row.id, `/api/invoices/${row.id}/payout`, { speed: "lightning" })}
          >
            Lightning 1%
          </Button>
        </>
      ) : null}
      {role === "freelancer" && canCancelInvoice(row.status) ? (
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      ) : null}
    </div>
  );
}
