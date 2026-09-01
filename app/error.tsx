"use client";

import { useEffect } from "react";
import { EmptyState } from "@/components/empty-state";
import { captureException } from "@/lib/observability";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-6">
      <EmptyState
        icon="help"
        title="Something slipped."
        description="We logged it. Try again in a moment. If it repeats, write to Help & Support — we reply within 24 hours."
        actionLabel="Try again"
        onAction={reset}
      />
    </div>
  );
}
