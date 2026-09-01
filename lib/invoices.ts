export const INVOICE_STATUSES = [
  "draft",
  "sent",
  "pending",
  "approved",
  "paid",
  "payout_processing",
  "paid_out",
  "failed",
  "cancelled",
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export type InvoiceLine = {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
};

export type InvoiceRecord = {
  id: string;
  companyId: string;
  freelancerId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  notes: string;
  lineItems: InvoiceLine[];
  serviceFee: number;
  shieldFee: number;
  youKeep: number;
  dueDate: string | null;
  invoiceDate: string | null;
  paymentTerms: string;
  vatExempt: boolean;
  vatTotal: number;
  netTotal: number;
  sellerBusinessId: string;
  buyerBusinessId: string;
  createdAt: string;
  cancelledAt: string | null;
};

export type FreelancerBillingProfile = {
  id: string;
  companyId: string;
  fullName: string;
  email: string;
  taxResidency: string;
  vatId: string;
  addressLine1: string;
  addressCity: string;
  addressPostalCode: string;
  addressCountry: string;
  bankIban: string;
  bankName: string;
  defaultClientName: string;
  defaultClientEmail: string;
  defaultClientAddress: string;
};

export function canCancelInvoice(status: InvoiceStatus) {
  return status === "draft" || status === "sent";
}
