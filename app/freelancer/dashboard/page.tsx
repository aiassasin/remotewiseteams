import type { Metadata } from "next";
import { FreelancerDashboardClient } from "@/components/freelancer/freelancer-dashboard-client";

export const metadata: Metadata = { title: "Freelancer dashboard" };

export default function FreelancerDashboardPage() {
  return <FreelancerDashboardClient />;
}
