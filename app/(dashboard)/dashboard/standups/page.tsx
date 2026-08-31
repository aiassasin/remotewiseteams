import { Video } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Standups" };

export default function StandupsPage() {
  return (
    <PlaceholderPage
      title="Standups"
      description="Async updates from your freelance team."
      icon={Video}
      emptyTitle="No standups yet"
      emptyBody="When freelancers post a daily update, it will land in this feed."
    />
  );
}
