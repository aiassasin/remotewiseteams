import { LegalH2, LegalShell, LEGAL_UPDATED, legalMetadata } from "@/components/legal/legal-shell";
import { FINLAND_COMPLIANCE } from "@/lib/compliance/finland";
import { PLATFORM_TAKE_PERCENT } from "@/lib/pricing";

export const metadata = legalMetadata(
  "Invoicing terms",
  "Cancellation, disputes, refunds, late payments, and debt collection for RemoteWise invoices.",
);

export default function InvoicingTermsPage() {
  return (
    <LegalShell title="Invoicing terms" updated={LEGAL_UPDATED}>
      <p>
        These invoicing terms sit under the Terms of service. They apply to every invoice created on
        RemoteWise. {FINLAND_COMPLIANCE.vatNote}
      </p>
      <LegalH2>1. Creating an invoice</LegalH2>
      <p>
        Creating a draft is free. Fees ({PLATFORM_TAKE_PERCENT}% service + Shield on the
        VAT-exclusive amount, plus any Lightning or financing add-on you choose) are calculated
        before send and stored on the invoice. The sender profile (address, tax residency, VAT ID,
        bank, default client) is saved once and reused.
      </p>
      <LegalH2>2. Statuses</LegalH2>
      <p>
        Draft → Sent → Paid → Payout processing → Paid out. An invoice may also fail or be cancelled.
        Standard payout is 24 hours after client payment and is free.
      </p>
      <LegalH2>3. Cancellation</LegalH2>
      <p>
        The freelancer may cancel an invoice while it is in draft or sent status. Cancellation
        requires confirmation, writes an audit event, and notifies the company workspace. After the
        client has paid, cancellation is not available; use a refund or credit as in section 5.
      </p>
      <LegalH2>4. Disputes</LegalH2>
      <p>
        A company may dispute a sent invoice within 14 days of receipt by writing to
        billing@remotewise.dev with the invoice number and grounds. We freeze payout on a disputed
        unpaid invoice until the parties agree or 30 days pass. We are not an arbitral tribunal for
        the underlying services — we pause money movement and share the paper trail.
      </p>
      <LegalH2>5. Refunds</LegalH2>
      <p>
        If a paid invoice is reversed by the payment provider or both parties agree a refund,
        RemoteWise returns the client’s principal minus non-recoverable card fees. Shield already
        issued for that invoice is voided. The freelancer must repay any payout already received on
        that invoice.
      </p>
      <LegalH2>6. Late payments</LegalH2>
      <p>
        Unless the invoice states otherwise, payment is due 14 days after send. We may send reminders
        at day 7 and day 14 past due. Finnish late-payment interest may apply to B2B invoices under
        the Interest Act (633/1982) when the payer is established in Finland.
      </p>
      <LegalH2>7. Debt collection</LegalH2>
      <p>
        Undisputed overdue amounts may be placed with a licensed collection partner. Collection is
        optional and charged only on success, at 8% of the recovered amount, disclosed before we
        place the file. We do not sell debt.
      </p>
      <LegalH2>8. Payout promise</LegalH2>
      <p>
        If a standard payout is late because of a RemoteWise systems fault after the client’s funds
        have cleared, we cover reasonable documented delay costs up to the Shield fee on that
        invoice. Payment-provider or bank holidays are not a RemoteWise fault.
      </p>
    </LegalShell>
  );
}
