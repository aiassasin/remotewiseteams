import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Workspace, billing, and team preferences."
      icon={Settings}
      emptyTitle="Workspace settings"
      emptyBody="Company profile, members, and billing will live here."
    />
  );
}
