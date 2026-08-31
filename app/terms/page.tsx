import { LegalH2, LegalShell, LEGAL_UPDATED, legalMetadata } from "@/components/legal/legal-shell";
import { FINLAND_COMPLIANCE } from "@/lib/compliance/finland";
import { PLATFORM_TAKE_PERCENT } from "@/lib/pricing";

export const metadata = legalMetadata(
  "Terms of service",
  "Tri-party terms between RemoteWise, freelancers, and companies.",
);

export default function TermsPage() {
  return (
    <LegalShell title="Terms of service" updated={LEGAL_UPDATED}>
      <p>
        These terms are a tri-party agreement between (1) {FINLAND_COMPLIANCE.legalEntityName}{" "}
        (“RemoteWise”, the platform), (2) the freelancer or light entrepreneur who invoices through
        the platform, and (3) the company that invites contractors or pays invoices. By creating an
        account you accept them. Governing law: {FINLAND_COMPLIANCE.governingLaw}.
      </p>
      <LegalH2>1. The service</LegalH2>
      <p>
        RemoteWise provides contractor management, e-signature contracts, invoicing, fee collection,
        payout routing, and (when issued) a Shield coverage certificate. The company workspace is
        free at the Free plan. Paid plans (Growth, Scale) add seats, analytics, and APIs as described
        on the pricing page. Light-entrepreneur invoicing is charged at {PLATFORM_TAKE_PERCENT}% of
        the VAT-exclusive invoice amount (service fee + Shield).
      </p>
      <LegalH2>2. Platform role</LegalH2>
      <p>
        RemoteWise is the billing entity for light-entrepreneur invoices. The freelancer is not
        required to hold a Finnish Y-tunnus to start. RemoteWise is not the freelancer’s employer,
        and is not a party to the underlying services contract except as billing agent and platform
        operator. {FINLAND_COMPLIANCE.taxWithholding}
      </p>
      <LegalH2>3. Freelancer obligations</LegalH2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Provide accurate identity, tax residency, and payout details.</li>
        <li>Only invoice work you are legally allowed to perform.</li>
        <li>Report payouts as income in your tax residency.</li>
        <li>Keep client information truthful on each invoice.</li>
        <li>Not use the platform for sanctioned, fraudulent, or illegal activity.</li>
      </ul>
      <LegalH2>4. Company obligations</LegalH2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Invite only people you intend to contract with.</li>
        <li>Pay invoices you accept through the platform when due.</li>
        <li>Not misclassify employees as contractors where local law forbids it.</li>
        <li>Keep workspace member access limited to people who need it.</li>
      </ul>
      <LegalH2>5. Fees</LegalH2>
      <p>
        Headline freelancer take rate, Shield, Lightning Pay, financing, and company processing fees
        are published on /pricing and shown line-by-line before an invoice is sent. Changing a fee
        for future invoices requires notice on the site. Fees already quoted on a sent invoice stay
        fixed for that invoice.
      </p>
      <LegalH2>6. Intellectual property</LegalH2>
      <p>
        You keep IP in your work product as agreed in your contract with the other party. RemoteWise
        keeps IP in the software, templates, and brand. You grant us a licence to host documents you
        upload solely to operate the service.
      </p>
      <LegalH2>7. Liability</LegalH2>
      <p>
        To the extent permitted by Finnish law, RemoteWise is not liable for indirect loss. Nothing
        excludes liability for intent, gross negligence, or death/personal injury. Consumer users in
        the EEA keep mandatory rights, including access to the {FINLAND_COMPLIANCE.consumerDisputes}{" "}
        and the EU ODR platform ({FINLAND_COMPLIANCE.euOdr}).
      </p>
      <LegalH2>8. Suspension and termination</LegalH2>
      <p>
        You may export and close your account in Settings. We may suspend access for fraud, unpaid
        platform fees, or legal risk. Surviving clauses: fees owed, IP, liability, governing law.
      </p>
      <LegalH2>9. Disputes</LegalH2>
      <p>
        First contact support@remotewise.dev (we reply within {FINLAND_COMPLIANCE.supportSlaHours}{" "}
        hours, FI + EN). Unresolved B2B disputes are submitted to the district courts of Finland.
        Consumers may use {FINLAND_COMPLIANCE.consumerDisputes}.
      </p>
    </LegalShell>
  );
}
