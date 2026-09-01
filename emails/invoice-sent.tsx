import { Text } from "@react-email/components";
import { EmailShell } from "@/emails/shell";

export type InvoiceSentEmailProps = {
  freelancerName: string;
  companyName: string;
  invoiceNumber: string;
  amount: string;
  dueDate: string;
  invoiceUrl: string;
};

export function InvoiceSentEmail({
  freelancerName,
  companyName,
  invoiceNumber,
  amount,
  dueDate,
  invoiceUrl,
}: InvoiceSentEmailProps) {
  return (
    <EmailShell
      preview={`${invoiceNumber} is ready to pay`}
      eyebrow={companyName}
      heading={`${invoiceNumber} is on its way`}
      actionLabel="Open invoice"
      actionUrl={invoiceUrl}
    >
      <Text style={{ margin: "16px 0 0", color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
        {freelancerName} sent {invoiceNumber} for {amount}. Pay through RemoteWise so Shield and payouts stay attached.
      </Text>
      <Text style={{ margin: "12px 0 0", color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
        Due {dueDate}. Card payments add 1.5% processing on top of the invoice — that fee is not taken from the freelancer.
      </Text>
    </EmailShell>
  );
}

InvoiceSentEmail.PreviewProps = {
  freelancerName: "Ahmed Hassan",
  companyName: "Northstar Studio",
  invoiceNumber: "INV-ABC",
  amount: "€2,400.00",
  dueDate: "15 Sep 2026",
  invoiceUrl: "http://localhost:3000/dashboard/invoices",
} satisfies InvoiceSentEmailProps;
