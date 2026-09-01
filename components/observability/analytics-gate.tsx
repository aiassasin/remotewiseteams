"use client";

import { useEffect } from "react";
import { posthogHost, posthogKey, readAnalyticsConsent } from "@/lib/observability";

export function AnalyticsGate() {
  useEffect(() => {
    const key = posthogKey();
    if (!key) return;
    if (readAnalyticsConsent() !== "all") return;

    let cancelled = false;
    void import("posthog-js")
      .then((mod) => {
        if (cancelled) return;
        const posthog = mod.default;
        if (posthog.__loaded) return;
        posthog.init(key, {
          api_host: posthogHost(),
          persistence: "localStorage+cookie",
          capture_pageview: true,
        });
      })
      .catch(() => {
        /* optional dependency */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
