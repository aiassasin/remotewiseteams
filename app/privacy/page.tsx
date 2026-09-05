import { PrivacyPolicy } from "@/components/legal/privacy-policy";
import { legalMetadata } from "@/components/legal/legal-meta";

export const metadata = legalMetadata(
  "Privacy policy",
  "How RemoteWise Teams processes personal data under the GDPR and Finnish data protection law.",
);

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
