"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTransition } from "@/components/motion/page-transition";
import { AuthShell } from "@/components/auth/auth-shell";
import { useT } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";

const SUCCESS_HOLD_MS = 320;

export function LoginForm() {
  const t = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard/overview";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    let succeeded = false;
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
      succeeded = true;
      setSignedIn(true);
      await new Promise((resolve) => window.setTimeout(resolve, SUCCESS_HOLD_MS));
      router.push(data.redirect || next);
      router.refresh();
    } finally {
      if (!succeeded) setSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <PageTransition>
        <div
          data-testid="login-frame"
          className={cn("rw-login-frame rounded-card border p-8", signedIn && "rw-login-frame-success")}
        >
          <div className="mb-6 text-center">
            <div className="rw-logo-badge mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-control font-display text-[13px] font-semibold text-white">
              RW
            </div>
            <h1 className="rw-login-heading font-display text-section">{t("auth.welcomeBack")}</h1>
            <p className="rw-login-lede mt-2 font-sans text-body">{t("auth.signInHint")}</p>
          </div>
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 border-l-4 border-royal-yellow rounded">
              <p className="text-sm text-dark-gray dark:text-gray-300">
                🛡️ RemoteWise Oy (in formation) · Helsinki
                <br />
                All contracts comply with Finnish tax, GDPR, and e‑invoicing regulations.
              </p>
            </div>
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
            <AnimatedButton type="submit" size="full" loading={submitting} className="rw-login-submit">
              {submitting ? t("auth.signingIn") : t("auth.signIn")}
            </AnimatedButton>
            <p className="text-xs text-muted-gray text-center mt-6">
              Secured with EU‑standard encryption.
              <br />
              Verkkolasku (EN 16931) compliant · 6‑year data retention per Finnish law.
            </p>
          </form>
          <p className="rw-login-foot mt-6 text-center font-sans text-[14px]">
            {t("auth.newHere")}{" "}
            <Link href="/signup" className="rw-login-foot-link font-medium">
              {t("auth.createWorkspace")}
            </Link>
          </p>
        </div>
      </PageTransition>
    </AuthShell>
  );
}
