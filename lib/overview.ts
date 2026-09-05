export type OverviewData = {
  freelancerCount: number;
  pendingInvoices: number;
  paidThisMonth: number;
  contractsSigned: number;
  monthly: { month: string; amount: number }[];
  statusSlices: { name: string; value: number }[];
  activity: { id: string; title: string; body: string | null; createdAt: string; href: string | null; eventType: string }[];
  checklist: { invite: boolean; contract: boolean; invoice: boolean; payout: boolean };
};
