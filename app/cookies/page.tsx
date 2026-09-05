import { CookiePolicy } from "@/components/legal/cookie-policy";
import { legalMetadata } from "@/components/legal/legal-meta";

export const metadata = legalMetadata(
  "Cookie policy",
  "Which cookies RemoteWise uses and how to change your consent.",
);

export default function CookiesPage() {
  return <CookiePolicy />;
}
