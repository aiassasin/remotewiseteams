import { StandupsPageClient } from "@/components/layout/standups-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Standups" };

export default function StandupsPage() {
  return <StandupsPageClient />;
}
