import type { Metadata } from "next";
import { ProfileOnboarding } from "@/components/onboarding/profile-onboarding";

export const metadata: Metadata = { title: "Profile onboarding" };

export default function OnboardingProfilePage() {
  return <ProfileOnboarding />;
}
