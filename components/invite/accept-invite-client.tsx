"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTransition } from "@/components/motion/page-transition";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useT } from "@/components/i18n/language-provider";

type InviteState = {
  valid: boolean;
  expired?: boolean;
  used?: boolean;
  freelancerName: string;
  email: string;
  companyName: string;
};

function passwordScore(value: string) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

export function AcceptInviteClient({ token }: { token: string }) {
  const t = useT();
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "create" | "signin">("choose");
  const [invite, setInvite] = useState<InviteState | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [country, setCountry] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    fetch(`/api/invite/${token}/validate`)
      .then((res) => res.json())
      .then((data: InviteState) => {
        setInvite(data);
        setName(data.freelancerName || "");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const filteredCountries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((item) => item.name.toLowerCase().includes(q));
  }, [countryQuery]);

  const score = passwordScore(password);
  const strength =
    score <= 1
      ? t("invite.weak")
      : score === 2
        ? t("invite.okay")
        : score === 3
          ? t("invite.strong")
          : t("invite.excellent");

  async function handleJoin(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t("invite.nameRequired");
    if (password.length < 8) next.password = t("invite.passwordMin");
    if (password !== confirm) next.confirm = t("invite.passwordMismatch");
    if (!country) next.country = t("invite.countryRequired");
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/invite/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, country, timezone, name: name.trim() }),
      });
      const data = (await response.json()) as { redirect?: string; message?: string; field?: string };
      if (!response.ok) {
        if (data.field) setErrors({ [data.field]: data.message ?? t("invite.joinFailed") });
        else setErrors({ password: data.message ?? t("invite.joinWorkspaceFailed") });
        return;
      }
      router.push(data.redirect || "/onboarding/profile");
    } finally {
      setSubmitting(false);
    }
  }

  const company = invite?.companyName || t("invite.fallbackCompany");

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        backgroundColor: "#F8FAFC",
        backgroundImage:
          "radial-gradient(rgba(226, 232, 240, 0.5) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <PageTransition>
        <div className="w-full max-w-modal rounded-card border border-border bg-card p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-control bg-primary font-display text-[13px] font-semibold text-white">
              RW
            </div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-light font-display text-[16px] font-semibold text-primary-text">
              {company.slice(0, 2).toUpperCase()}
            </div>
            <h1 className="mt-4 font-display text-section text-ink">
              {t("invite.invitedYou", { company })}
            </h1>
            <p className="mt-2 font-sans text-body text-ink-secondary">{t("invite.body")}</p>
          </div>

          {loading ? (
            <p className="text-center font-sans text-body text-ink-muted">{t("invite.checking")}</p>
          ) : !invite?.valid ? (
            <p className="text-center font-sans text-body text-danger">
              {invite?.used ? t("invite.used") : t("invite.invalid")}
            </p>
          ) : mode === "choose" ? (
            <div className="space-y-3">
              <Button variant="secondary" size="full" onClick={() => setMode("signin")}>
                {t("invite.haveAccount")}
              </Button>
              <Button size="full" onClick={() => setMode("create")}>
                {t("invite.createAccount")}
              </Button>
            </div>
          ) : mode === "signin" ? (
            <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
              <div>
                <Label htmlFor="signin-email">{t("common.email")}</Label>
                <Input id="signin-email" value={invite.email} readOnly />
              </div>
              <div>
                <Label htmlFor="signin-password">{t("common.password")}</Label>
                <Input id="signin-password" type="password" placeholder={t("invite.yourPassword")} />
              </div>
              <Button size="full" type="submit">
                {t("common.signIn")}
              </Button>
              <Button variant="text" type="button" onClick={() => setMode("choose")}>
                {t("common.back")}
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleJoin} noValidate>
              <div>
                <Label htmlFor="name">{t("auth.fullName")}</Label>
                <Input id="name" value={name} onChange={(event) => setName(event.target.value)} invalid={Boolean(errors.name)} />
                {errors.name ? <p className="rw-field-error">{errors.name}</p> : null}
              </div>
              <div>
                <Label htmlFor="email">{t("common.email")}</Label>
                <div className="relative">
                  <Input id="email" value={invite.email} readOnly className="pr-10" />
                  <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
                </div>
              </div>
              <div>
                <Label htmlFor="password">{t("common.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  invalid={Boolean(errors.password)}
                />
                <div className="mt-2 h-1 overflow-hidden rounded-pill bg-page">
                  <div
                    className="h-full rounded-pill transition-all"
                    style={{
                      width: `${(score / 4) * 100}%`,
                      backgroundColor: score < 2 ? "#F43F5E" : score < 3 ? "#F59E0B" : "#10B981",
                    }}
                  />
                </div>
                <p className="mt-1 font-sans text-small text-ink-muted">{strength}</p>
                {errors.password ? <p className="rw-field-error">{errors.password}</p> : null}
              </div>
              <div>
                <Label htmlFor="confirm">{t("common.confirmPassword")}</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  invalid={Boolean(errors.confirm)}
                />
                {errors.confirm ? <p className="rw-field-error">{errors.confirm}</p> : null}
              </div>
              <div>
                <Label htmlFor="country">{t("invoices.country")}</Label>
                <Input
                  id="country-search"
                  placeholder={t("common.searchCountries")}
                  value={countryQuery}
                  onChange={(event) => setCountryQuery(event.target.value)}
                />
                <select
                  id="country"
                  className="rw-input mt-2"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                >
                  <option value="">{t("common.selectCountry")}</option>
                  {filteredCountries.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.country ? <p className="rw-field-error">{errors.country}</p> : null}
              </div>
              <div>
                <Label htmlFor="timezone">{t("common.timezone")}</Label>
                <Input id="timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)} />
              </div>
              <Button type="submit" size="full" loading={submitting}>
                {t("invite.join")}
              </Button>
            </form>
          )}
        </div>
      </PageTransition>
    </div>
  );
}
