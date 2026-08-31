import { LegalH2, LegalShell, LEGAL_UPDATED, legalMetadata } from "@/components/legal/legal-shell";
import { FINLAND_COMPLIANCE } from "@/lib/compliance/finland";

export const metadata = legalMetadata(
  "Cookie policy",
  "Which cookies RemoteWise uses and how to change your consent.",
);

export default function CookiesPage() {
  return (
    <LegalShell title="Cookie policy" updated={LEGAL_UPDATED}>
      <p>
        This policy describes cookies and similar storage used on RemoteWise, in line with the ePrivacy
        Directive as implemented in Finland and GDPR. Version {FINLAND_COMPLIANCE.cookiePolicyVersion}.
      </p>
      <LegalH2>1. What we store</LegalH2>
      <div className="overflow-x-auto rounded-card border border-border">
        <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-border bg-page">
              <th className="px-3 py-2 text-ink">Name</th>
              <th className="px-3 py-2 text-ink">Purpose</th>
              <th className="px-3 py-2 text-ink">Type</th>
              <th className="px-3 py-2 text-ink">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-3 py-2">sb-*-auth-token</td>
              <td className="px-3 py-2">Sign-in session (Supabase)</td>
              <td className="px-3 py-2">Necessary</td>
              <td className="px-3 py-2">Session / refresh</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2">rw_cookie_consent</td>
              <td className="px-3 py-2">Stores your cookie choice</td>
              <td className="px-3 py-2">Necessary</td>
              <td className="px-3 py-2">180 days</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2">rw-theme</td>
              <td className="px-3 py-2">Light / dark / system preference</td>
              <td className="px-3 py-2">Necessary (preference)</td>
              <td className="px-3 py-2">Local</td>
            </tr>
            <tr>
              <td className="px-3 py-2">analytics (if accepted)</td>
              <td className="px-3 py-2">Product usage in aggregate — not sold</td>
              <td className="px-3 py-2">Optional</td>
              <td className="px-3 py-2">13 months</td>
            </tr>
          </tbody>
        </table>
      </div>
      <LegalH2>2. Consent</LegalH2>
      <p>
        Necessary cookies load without consent because the service cannot sign you in without them.
        Optional analytics load only after you press “Accept all” on the banner. “Necessary only”
        rejects analytics. You can change your mind by clearing site data and reloading, then using
        the banner again.
      </p>
      <LegalH2>3. Third parties</LegalH2>
      <p>
        Auth cookies are set in first-party context via our domain. We do not currently load
        advertising pixels. If we add a measurement tool, it will appear in this table before it
        ships.
      </p>
      <LegalH2>4. Contact</LegalH2>
      <p>
        Questions: privacy@remotewise.dev. Supervisory authority: {FINLAND_COMPLIANCE.supervisoryAuthority}.
      </p>
    </LegalShell>
  );
}
