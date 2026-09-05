"use client";

import { useEffect } from "react";
import { EmptyState } from "@/components/empty-state";
import { captureException } from "@/lib/observability";
import { useT } from "@/components/i18n/language-provider";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-6">
      <EmptyState
        icon="help"
        title={t("errors.slippedTitle")}
        description={t("errors.slippedBody")}
        actionLabel={t("errors.tryAgain")}
        onAction={reset}
      />
    </div>
  );
}
