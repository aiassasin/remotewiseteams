import type { Metadata } from "next";
import { SignupWizard } from "@/components/auth/signup-wizard";

export const metadata: Metadata = {
  title: "Create workspace",
};

export default function SignupPage() {
  return <SignupWizard />;
}
