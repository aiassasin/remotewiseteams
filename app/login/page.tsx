import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = pageMeta("Sign in", "Sign in to RemoteWise Teams.");

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
