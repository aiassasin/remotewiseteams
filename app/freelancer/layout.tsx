import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentFreelancer, getSessionUser } from "@/lib/auth/session";
import { FreelancerShell } from "@/components/layout/freelancer-shell";

export const dynamic = "force-dynamic";

export default async function FreelancerLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const freelancer = await getCurrentFreelancer();
  if (!freelancer) redirect("/signup");

  return <FreelancerShell>{children}</FreelancerShell>;
}
