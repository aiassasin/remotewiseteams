import { pageMeta } from "@/lib/seo";
import { SignupWizard } from "@/components/auth/signup-wizard";

export const metadata = pageMeta("Create workspace", "Create a RemoteWise Teams workspace.");

export default function SignupPage() {
  return <SignupWizard />;
}
