import { Text } from "@react-email/components";
import { EmailShell } from "@/emails/shell";

export type InvoicePaidEmailProps = {
  freelancerName: string;
  invoiceNumber: string;
  amount: string;
  youKeep: string;
  payoutUrl: string;
};

export function InvoicePaidEmail({
  freelancerName,
  invoiceNumber,
  amount,
  youKeep,
  payoutUrl,
}: InvoicePaidEmailProps) {
  return (
    <EmailShell
      preview={`${invoiceNumber} is paid`}
      eyebrow="Payment received"
      heading={`${invoiceNumber} just landed`}
      actionLabel="Choose payout"
      actionUrl={payoutUrl}
    >
      <Text style={{ margin: "16px 0 0", color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
        Hi {freelancerName}, the client paid {amount}. Shield is attached. You keep {youKeep} after the 5.5% all-in fee.
      </Text>
      <Text style={{ margin: "12px 0 0", color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
        Standard payout is free within 24 hours. Lightning is 1% if you need it sooner.
      </Text>
    </EmailShell>
  );
}

InvoicePaidEmail.PreviewProps = {
  freelancerName: "Ahmed Hassan",
  invoiceNumber: "INV-ABC",
  amount: "€2,400.00",
  youKeep: "€2,268.00",
  payoutUrl: "http://localhost:3000/dashboard/payouts",
} satisfies InvoicePaidEmailProps;
