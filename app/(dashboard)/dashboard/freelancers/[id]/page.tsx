import { FreelancerProfileClient } from "@/components/freelancers/freelancer-profile-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Freelancer profile" };

export default function FreelancerProfilePage() {
  return <FreelancerProfileClient />;
}
