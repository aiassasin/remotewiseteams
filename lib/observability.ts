type Consent = "necessary" | "all" | null;

export function readAnalyticsConsent(): Consent {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith("rw_cookie_consent="));
  const value = match?.split("=")[1];
  if (value === "necessary" || value === "all") return value;
  return null;
}

export function sentryDsn() {
  return process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() || process.env.SENTRY_DSN?.trim() || "";
}

export function posthogKey() {
  return process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() || "";
}

export function posthogHost() {
  return process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://eu.i.posthog.com";
}

export function captureException(error: unknown) {
  const dsn = sentryDsn();
  if (!dsn) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    return;
  }
  console.error(error);
}

export function trackEvent(name: string, properties?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  if (readAnalyticsConsent() !== "all") return;
  const key = posthogKey();
  if (!key) return;
  const w = window as Window & { posthog?: { capture: (event: string, props?: object) => void } };
  w.posthog?.capture(name, properties);
}
