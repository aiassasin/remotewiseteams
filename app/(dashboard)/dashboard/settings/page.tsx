import { PlaceholderPage } from "@/components/layout/placeholder-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Workspace, billing, and team preferences."
      icon="settings"
      emptyTitle="Tune the workspace."
      emptyBody="Profile, appearance, members, and billing land here next. For now, use the sun/moon toggle in the top bar."
    />
  );
}
