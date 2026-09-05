import { InvoicingTerms } from "@/components/legal/invoicing-terms";
import { legalMetadata } from "@/components/legal/legal-meta";

export const metadata = legalMetadata(
  "Invoicing terms",
  "Cancellation, disputes, refunds, late payments, and debt collection for RemoteWise invoices.",
);

export default function InvoicingTermsPage() {
  return <InvoicingTerms />;
}
