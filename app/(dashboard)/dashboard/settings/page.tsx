import { getCurrentWorkspace } from "@/lib/auth/session";
import { loadSettings } from "@/lib/settings-server";
import { SettingsView } from "@/components/settings/settings-view";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const current = await getCurrentWorkspace();
  let initial = null;
  if (current) {
    try {
      initial = await loadSettings(
        current.user.id,
        current.user.email,
        current.user.fullName,
        current.workspace.id,
      );
    } catch {
      initial = null;
    }
  }

  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-card border border-border bg-card" />}>
      <SettingsView initial={initial} />
    </Suspense>
  );
}
