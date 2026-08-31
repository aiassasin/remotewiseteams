import { PlaceholderPage } from "@/components/layout/placeholder-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Standups" };

export default function StandupsPage() {
  return (
    <PlaceholderPage
      title="Standups"
      description="Async updates from your freelance team."
      icon="standups"
      emptyTitle="No standups yet."
      emptyBody="Ask a freelancer to post a daily update. It will land in this feed so you do not need another Slack channel."
    />
  );
}
