"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTransition } from "@/components/motion/page-transition";

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
    score <= 1 ? "Weak" : score === 2 ? "Okay" : score === 3 ? "Strong" : "Excellent";

  async function handleJoin(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Full name is required";
    if (password.length < 8) next.password = "Password must be at least 8 characters";
    if (password !== confirm) next.confirm = "Passwords do not match";
    if (!country) next.country = "Select a country";
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
        if (data.field) setErrors({ [data.field]: data.message ?? "Could not join" });
        else setErrors({ password: data.message ?? "Could not join workspace" });
        return;
      }
      router.push(data.redirect || "/onboarding/profile");
    } finally {
      setSubmitting(false);
    }
  }

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
      <PageTransition>
        <div className="w-full max-w-modal rounded-card border border-border bg-card p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-control bg-primary font-display text-[13px] font-semibold text-white">
              RW
            </div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-light font-display text-[16px] font-semibold text-primary-text">
              {(invite?.companyName || "NS").slice(0, 2).toUpperCase()}
            </div>
            <h1 className="mt-4 font-display text-section text-ink">
              {invite?.companyName || "Your client"} invited you to join their workspace
            </h1>
            <p className="mt-2 font-sans text-body text-ink-secondary">
              You&apos;ll be able to view contracts, submit invoices, and receive payments.
            </p>
          </div>

          {loading ? (
            <p className="text-center font-sans text-body text-ink-muted">Checking invite…</p>
          ) : !invite?.valid ? (
            <p className="text-center font-sans text-body text-danger">
              {invite?.used
                ? "This invite has already been used."
                : "This invite is invalid or has expired."}
            </p>
          ) : mode === "choose" ? (
            <div className="space-y-3">
              <Button variant="secondary" size="full" onClick={() => setMode("signin")}>
                I already have a RemoteWise account
              </Button>
              <Button size="full" onClick={() => setMode("create")}>
                Create my account
              </Button>
            </div>
          ) : mode === "signin" ? (
            <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
              <div>
                <Label htmlFor="signin-email">Email</Label>
                <Input id="signin-email" value={invite.email} readOnly />
              </div>
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <Input id="signin-password" type="password" placeholder="Your password" />
              </div>
              <Button size="full" type="submit">
                Sign in
              </Button>
              <Button variant="text" type="button" onClick={() => setMode("choose")}>
                Back
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleJoin} noValidate>
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(event) => setName(event.target.value)} invalid={Boolean(errors.name)} />
                {errors.name ? <p className="rw-field-error">{errors.name}</p> : null}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input id="email" value={invite.email} readOnly className="pr-10" />
                  <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
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
                <Label htmlFor="confirm">Confirm password</Label>
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
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country-search"
                  placeholder="Search countries"
                  value={countryQuery}
                  onChange={(event) => setCountryQuery(event.target.value)}
                />
                <select
                  id="country"
                  className="rw-input mt-2"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                >
                  <option value="">Select a country</option>
                  {filteredCountries.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.country ? <p className="rw-field-error">{errors.country}</p> : null}
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)} />
              </div>
              <Button type="submit" size="full" loading={submitting}>
                Join workspace
              </Button>
            </form>
          )}
        </div>
      </PageTransition>
    </div>
  );
}
