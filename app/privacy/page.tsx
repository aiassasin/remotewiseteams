import { LegalH2, LegalShell, LEGAL_UPDATED, legalMetadata } from "@/components/legal/legal-shell";
import { FINLAND_COMPLIANCE } from "@/lib/compliance/finland";

export const metadata = legalMetadata(
  "Privacy policy",
  "How RemoteWise Teams processes personal data under the GDPR and Finnish data protection law.",
);

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy policy" updated={LEGAL_UPDATED}>
      <p>
        This policy explains how {FINLAND_COMPLIANCE.operatorName} (“RemoteWise”, “we”, “us”) processes
        personal data when you use remotewise teams: the company workspace, the freelancer portal, our
        public website, and related invoicing services. We process data in accordance with the EU
        General Data Protection Regulation (GDPR) and the Finnish Data Protection Act (1050/2018).
      </p>
      <LegalH2>1. Controller</LegalH2>
      <p>
        The controller is {FINLAND_COMPLIANCE.legalEntityName}, established in {FINLAND_COMPLIANCE.country}.
        Contact: privacy@remotewise.dev. Our supervisory authority is the{" "}
        {FINLAND_COMPLIANCE.supervisoryAuthority} ({FINLAND_COMPLIANCE.supervisoryUrl}).
      </p>
      <LegalH2>2. What we collect</LegalH2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Account data: name, email, password hash (handled by Supabase Auth), headline, avatar.</li>
        <li>Company data: workspace name, logo, Y-tunnus, VAT ID, address, plan.</li>
        <li>
          Freelancer profile: country, tax residency, address, VAT ID, bank IBAN/name, saved clients.
        </li>
        <li>Transactional data: contracts, invoices, line items, payout elections, fee ledger.</li>
        <li>Usage data: login timestamps, settings tab, theme preference, cookie consent.</li>
        <li>Support tickets you send us (name, email, message).</li>
      </ul>
      <LegalH2>3. Purposes and legal bases</LegalH2>
      <p>
        We process account and invoicing data to perform the contract with you (GDPR Art. 6(1)(b)):
        creating invoices, collecting payment, paying you out, and issuing Shield certificates. We
        process tax identifiers and addresses to meet bookkeeping and AML-adjacent record duties
        (Art. 6(1)(c)). We process product emails and optional analytics only with consent or
        legitimate interest in running a secure service (Art. 6(1)(a) and (f)), and you can object.
      </p>
      <LegalH2>4. Recipients</LegalH2>
      <p>
        We share data with: (a) the other party on a contract or invoice (company ↔ freelancer);
        (b) infrastructure processors — currently Supabase (auth, database, storage) and, when
        configured, Resend (email) and Stripe (payments); (c) a future insurance partner for Shield
        certificates; (d) authorities when law requires. We do not sell personal data.
      </p>
      <LegalH2>5. International transfers</LegalH2>
      <p>
        Processors may store data in the EEA or in third countries. Where data leaves the EEA we use
        the European Commission’s Standard Contractual Clauses and supplementary measures.
      </p>
      <LegalH2>6. Retention</LegalH2>
      <p>
        Invoices, fee records, and identity data needed for bookkeeping are kept for{" "}
        {FINLAND_COMPLIANCE.dataRetentionMonths} months (six Finnish accounting years) unless a longer
        period is required. Support tickets are kept for 24 months. Auth sessions expire according to
        the identity provider. You may request erasure of data that is not legally retained.
      </p>
      <LegalH2>7. Your rights</LegalH2>
      <p>
        You have the right to access, rectify, erase, restrict, object, and port your data, and to
        withdraw consent. Use Settings → Data & privacy, or email privacy@remotewise.dev. You may
        lodge a complaint with the {FINLAND_COMPLIANCE.supervisoryAuthority}.
      </p>
      <LegalH2>8. Cookies</LegalH2>
      <p>
        Necessary cookies keep you signed in. Optional analytics cookies are used only after you
        choose “Accept all”. Details are in the Cookie policy. Policy version{" "}
        {FINLAND_COMPLIANCE.cookiePolicyVersion}.
      </p>
      <LegalH2>9. Children</LegalH2>
      <p>The service is for adults acting as businesses or independent contractors. We do not onboard minors.</p>
    </LegalShell>
  );
}
