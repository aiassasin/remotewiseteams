import { createServerSupabaseClient } from "@/lib/supabase/server";
import { listRosterFreelancers } from "@/lib/invite-persistence";
import { listInvoices } from "@/lib/invoices-server";
import type { OverviewData } from "@/lib/overview";

export async function loadOverview(companyId: string): Promise<OverviewData> {
  const supabase = createServerSupabaseClient();
  const [freelancers, invoices, { data: contracts }, { data: activity }] = await Promise.all([
    listRosterFreelancers(companyId),
    listInvoices({ companyId }).catch(() => []),
    supabase.from("contracts").select("id, status").eq("company_id", companyId),
    supabase
      .from("activity_events")
      .select("id, event_type, title, body, created_at, href")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const paidThisMonth = invoices
    .filter((row) => ["paid", "paid_out", "payout_processing"].includes(row.status))
    .filter((row) => row.createdAt.startsWith(monthKey))
    .reduce((sum, row) => sum + row.amount, 0);

  const months: { month: string; amount: number }[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const amount = invoices
      .filter((row) => ["paid", "paid_out", "payout_processing"].includes(row.status))
      .filter((row) => row.createdAt.startsWith(key))
      .reduce((sum, row) => sum + row.youKeep, 0);
    months.push({ month: key, amount });
  }

  const counts = new Map<string, number>();
  for (const row of invoices) {
    counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  }
  const statusSlices = Array.from(counts.entries()).map(([name, value]) => ({ name, value }));

  const signed = (contracts ?? []).filter((row) => row.status === "signed").length;
  const payouts = invoices.filter((row) => row.status === "paid_out" || row.status === "payout_processing");

  return {
    freelancerCount: freelancers.length,
    pendingInvoices: invoices.filter((row) => row.status === "sent" || row.status === "pending").length,
    paidThisMonth,
    contractsSigned: signed,
    monthly: months,
    statusSlices,
    activity: (activity ?? []).map((row) => ({
      id: row.id as string,
      title: row.title as string,
      body: (row.body as string | null) ?? null,
      createdAt: row.created_at as string,
      href: (row.href as string | null) ?? null,
      eventType: (row.event_type as string) || "",
    })),
    checklist: {
      invite: freelancers.length > 0,
      contract: signed > 0 || (contracts ?? []).length > 0,
      invoice: invoices.length > 0,
      payout: payouts.length > 0,
    },
  };
}
