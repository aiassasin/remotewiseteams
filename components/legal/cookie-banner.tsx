"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "rw_cookie_consent";

type Consent = "necessary" | "all";

function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${COOKIE_KEY}=`));
  const value = match?.split("=")[1];
  if (value === "necessary" || value === "all") return value;
  try {
    const stored = window.localStorage.getItem(COOKIE_KEY);
    if (stored === "necessary" || stored === "all") return stored;
  } catch {
    return null;
  }
  return null;
}

function writeConsent(value: Consent) {
  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `${COOKIE_KEY}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  try {
    window.localStorage.setItem(COOKIE_KEY, value);
  } catch {
    /* private mode */
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() === null);
  }, []);

  if (!visible) return null;

  function choose(value: Consent) {
    writeConsent(value);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-body"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-lift sm:p-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 id="cookie-banner-title" className="font-display text-card text-ink">
            Cookies
          </h2>
          <p id="cookie-banner-body" className="mt-1 max-w-2xl font-sans text-[13px] leading-relaxed text-ink-secondary">
            We use necessary cookies to keep you signed in. Analytics cookies are optional. Read the{" "}
            <Link href="/cookies" className="font-medium text-primary underline-offset-2 hover:underline">
              cookie policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => choose("necessary")}>
            Necessary only
          </Button>
          <Button onClick={() => choose("all")}>Accept all</Button>
        </div>
      </div>
    </div>
  );
}
