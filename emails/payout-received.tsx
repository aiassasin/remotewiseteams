import { Text } from "@react-email/components";
import { EmailShell } from "@/emails/shell";

export type PayoutReceivedEmailProps = {
  freelancerName: string;
  invoiceNumber: string;
  youKeep: string;
  speed: string;
};

export function PayoutReceivedEmail({
  freelancerName,
  invoiceNumber,
  youKeep,
  speed,
}: PayoutReceivedEmailProps) {
  return (
    <EmailShell preview={`${youKeep} is on the way`} eyebrow="Payout" heading="The transfer is moving">
      <Text style={{ margin: "16px 0 0", color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
        Hi {freelancerName}, {youKeep} from {invoiceNumber} is heading to your connected bank account ({speed}).
      </Text>
      <Text style={{ margin: "12px 0 0", color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
        Stripe sends the money. We reply within 24 hours if anything looks off.
      </Text>
    </EmailShell>
  );
}

PayoutReceivedEmail.PreviewProps = {
  freelancerName: "Ahmed Hassan",
  invoiceNumber: "INV-ABC",
  youKeep: "€2,268.00",
  speed: "standard 24h",
} satisfies PayoutReceivedEmailProps;
