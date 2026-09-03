import { TermsOfService } from "@/components/legal/terms-of-service";
import { legalMetadata } from "@/components/legal/legal-meta";

export const metadata = legalMetadata(
  "Terms of service",
  "Tri-party terms between RemoteWise, freelancers, and companies.",
);

export default function TermsPage() {
  return <TermsOfService />;
}
