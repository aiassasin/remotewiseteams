import { getCurrentWorkspace } from "@/lib/auth/session";
import { loadOverview } from "@/lib/overview-server";
import { OverviewClient } from "@/components/overview/overview-client";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const current = await getCurrentWorkspace();
  if (!current) redirect("/login");
  try {
    const data = await loadOverview(current.workspace.id);
    return <OverviewClient data={data} />;
  } catch (error) {
    return (
      <OverviewClient
        data={null}
        error={error instanceof Error ? error.message : "Could not load overview"}
      />
    );
  }
}
