import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-10 [background-image:radial-gradient(rgb(var(--rw-border)_/_0.8)_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="w-full max-w-modal">{children}</div>
    </div>
  );
}
