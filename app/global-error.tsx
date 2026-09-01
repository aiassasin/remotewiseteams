"use client";

import { useEffect } from "react";

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

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 px-6 py-16 font-sans text-slate-900">
        <main className="mx-auto max-w-md text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">RemoteWise</p>
          <h1 className="mt-3 text-2xl font-semibold">The page could not load.</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            We logged the error. Try again. If it keeps happening, email support — we reply within 24 hours.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
