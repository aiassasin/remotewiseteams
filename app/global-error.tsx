"use client";

import { useEffect } from "react";
import { detectAppLanguage } from "@/lib/contracts/i18n";
import { translate } from "@/lib/i18n";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const lang = typeof navigator !== "undefined" ? detectAppLanguage() : "en";
  const t = (key: Parameters<typeof translate>[1]) => translate(lang, key);

  return (
    <html lang={lang}>
      <body className="min-h-screen bg-slate-50 px-6 py-16 font-sans text-slate-900">
        <main className="mx-auto max-w-md text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">RemoteWise</p>
          <h1 className="mt-3 text-2xl font-semibold">{t("errors.pageLoadTitle")}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{t("errors.pageLoadBody")}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white"
          >
            {t("errors.tryAgain")}
          </button>
        </main>
      </body>
    </html>
  );
}
