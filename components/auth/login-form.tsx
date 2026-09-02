"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTransition } from "@/components/motion/page-transition";
import { AuthShell } from "@/components/auth/auth-shell";
import { useT } from "@/components/i18n/language-provider";

export function LoginForm() {
  const t = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard/overview";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as {
        redirect?: string;
        message?: string;
        field?: string;
      };
      if (!response.ok) {
        setErrors({ [data.field || "password"]: data.message || t("auth.signInFailed") });
        return;
      }
      router.push(data.redirect || next);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <PageTransition>
        <div className="rounded-card border border-border bg-card p-8">
          <div className="mb-6 text-center">
            <div className="rw-logo-badge mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-control font-display text-[13px] font-semibold text-white">
              RW
            </div>
            <h1 className="font-display text-section text-ink">{t("auth.welcomeBack")}</h1>
            <p className="mt-2 font-sans text-body text-ink-secondary">{t("auth.signInHint")}</p>
          </div>
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <Label htmlFor="email">{t("common.email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                invalid={Boolean(errors.email)}
                onChange={(event) => setEmail(event.target.value)}
              />
              {errors.email ? <p className="rw-field-error">{errors.email}</p> : null}
            </div>
            <div>
              <Label htmlFor="password">{t("common.password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                invalid={Boolean(errors.password)}
                onChange={(event) => setPassword(event.target.value)}
              />
              {errors.password ? <p className="rw-field-error">{errors.password}</p> : null}
            </div>
            <Button type="submit" size="full" loading={submitting}>
              {submitting ? t("auth.signingIn") : t("auth.signIn")}
            </Button>
          </form>
          <p className="mt-6 text-center font-sans text-[14px] text-ink-secondary">
            {t("auth.newHere")}{" "}
            <Link href="/signup" className="font-medium text-primary hover:text-primary-hover">
              {t("auth.createWorkspace")}
            </Link>
          </p>
        </div>
      </PageTransition>
    </AuthShell>
  );
}
