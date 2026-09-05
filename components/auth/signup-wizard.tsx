"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTransition } from "@/components/motion/page-transition";
import { AuthShell } from "@/components/auth/auth-shell";
import { RwLogo } from "@/components/brand/rw-logo";
import { EMAIL_PATTERN } from "@/lib/utils";
import { WORKSPACE_ACCENTS } from "@/lib/workspace-accents";
import { useT } from "@/components/i18n/language-provider";

const EMPTY = {
  fullName: "",
  email: "",
  password: "",
  companyName: "",
  accentColor: "#2563EB",
};

export function SignupWizard() {
  const t = useT();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function update(key: keyof typeof EMPTY, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  }

  function validateStep1() {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = t("auth.enterFullName");
    if (!form.email.trim()) next.email = t("auth.enterWorkEmail");
    else if (!EMAIL_PATTERN.test(form.email.trim())) next.email = t("auth.emailInvalid");
    if (form.password.length < 8) next.password = t("auth.passwordMin");
    return next;
  }

  function goToWorkspace(event: React.FormEvent) {
    event.preventDefault();
    const next = validateStep1();
    setErrors(next);
    if (Object.keys(next).length) return;
    if (!form.companyName.trim()) {
      const guessed = t("auth.studioGuess", { name: form.fullName.trim().split(" ")[0] || t("common.you") });
      setForm((current) => ({ ...current, companyName: guessed }));
    }
    setStep(2);
  }

  async function createWorkspace(event: React.FormEvent) {
    event.preventDefault();
    if (!form.companyName.trim()) {
      setErrors({ companyName: t("auth.workspaceRequired") });
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          companyName: form.companyName.trim(),
          accentColor: form.accentColor,
        }),
      });
      const data = (await response.json()) as {
        redirect?: string;
        message?: string;
        field?: string;
      };
      if (!response.ok) {
        const field = data.field || "companyName";
        setErrors({ [field]: data.message || t("auth.createFailed") });
        if (field === "email" || field === "password" || field === "fullName") {
          setStep(1);
        }
        return;
      }
      router.push(data.redirect || "/dashboard/overview");
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
            <div className="mx-auto mb-4 flex justify-center">
              <RwLogo href="/" wordmark={false} size={40} />
            </div>
            <h1 className="font-display text-section text-ink">{t("auth.createTitle")}</h1>
            <p className="mt-2 font-sans text-body text-ink-secondary">{t("auth.createHint")}</p>
          </div>

          <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
            {t("auth.stepOf", {
              step,
              total: 2,
              label: step === 1 ? t("auth.yourAccount") : t("auth.yourWorkspace"),
            })}
          </p>
          <div className="mt-3 h-1 overflow-hidden rounded-pill bg-border">
            <motion.div
              className="h-1 bg-primary"
              animate={{ width: `${(step / 2) * 100}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>

          {step === 1 ? (
            <form className="mt-6 space-y-4" onSubmit={goToWorkspace} noValidate>
              <div>
                <Label htmlFor="fullName">{t("auth.fullName")}</Label>
                <Input
                  id="fullName"
                  autoComplete="name"
                  value={form.fullName}
                  invalid={Boolean(errors.fullName)}
                  onChange={(event) => update("fullName", event.target.value)}
                />
                {errors.fullName ? <p className="rw-field-error">{errors.fullName}</p> : null}
              </div>
              <div>
                <Label htmlFor="email">{t("auth.workEmail")}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  invalid={Boolean(errors.email)}
                  onChange={(event) => update("email", event.target.value)}
                />
                {errors.email ? <p className="rw-field-error">{errors.email}</p> : null}
              </div>
              <div>
                <Label htmlFor="password">{t("common.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  invalid={Boolean(errors.password)}
                  onChange={(event) => update("password", event.target.value)}
                />
                {errors.password ? <p className="rw-field-error">{errors.password}</p> : null}
              </div>
              <Button type="submit" size="full">
                {t("auth.continueWorkspace")}
              </Button>
            </form>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={createWorkspace} noValidate>
              <div>
                <Label htmlFor="companyName">{t("auth.workspaceName")}</Label>
                <Input
                  id="companyName"
                  placeholder={t("auth.workspacePlaceholder")}
                  value={form.companyName}
                  invalid={Boolean(errors.companyName)}
                  onChange={(event) => update("companyName", event.target.value)}
                />
                {errors.companyName ? <p className="rw-field-error">{errors.companyName}</p> : null}
              </div>
              <div>
                <p className="rw-label">{t("auth.accentColor")}</p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("auth.accentColor")}>
                  {WORKSPACE_ACCENTS.map((accent) => {
                    const selected = form.accentColor === accent.value;
                    return (
                      <button
                        key={accent.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={accent.label}
                        onClick={() => update("accentColor", accent.value)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
                        style={{
                          backgroundColor: accent.value,
                          boxShadow: selected ? "0 0 0 3px #EEF2FF" : undefined,
                          outline: selected ? "2px solid #2563EB" : "none",
                          outlineOffset: 2,
                        }}
                      />
                    );
                  })}
                </div>
                {errors.accentColor ? <p className="rw-field-error">{errors.accentColor}</p> : null}
              </div>
              <Button type="submit" size="full" loading={submitting}>
                {submitting ? t("auth.creating") : t("auth.createCta")}
              </Button>
              <Button variant="text" type="button" onClick={() => setStep(1)}>
                {t("common.back")}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center font-sans text-[14px] text-ink-secondary">
            {t("auth.alreadyHave")}{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
              {t("auth.signIn")}
            </Link>
          </p>
        </div>
      </PageTransition>
    </AuthShell>
  );
}
