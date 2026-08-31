import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        backgroundColor: "#F8FAFC",
        backgroundImage: "radial-gradient(rgba(226, 232, 240, 0.5) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      <div className="w-full max-w-modal">{children}</div>
    </div>
  );
}
