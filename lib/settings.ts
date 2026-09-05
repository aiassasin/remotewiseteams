import type { AppLanguage } from "@/lib/i18n";
import type { ThemePreference } from "@/lib/theme";

export const SETTINGS_TABS = [
  "profile",
  "language",
  "appearance",
  "company",
  "members",
  "notifications",
  "billing",
  "security",
  "privacy",
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number];

export function isSettingsTab(value: string | null | undefined): value is SettingsTab {
  return Boolean(value && (SETTINGS_TABS as readonly string[]).includes(value));
}

export type ProfilePayload = {
  fullName: string;
  headline: string;
  avatarUrl: string | null;
  email: string;
};

export type CompanyPayload = {
  name: string;
  logoUrl: string | null;
  plan: string;
  yTunnus: string;
  vatId: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
};

export type MemberPayload = {
  id: string;
  userId: string;
  role: "owner" | "admin" | "member";
  email: string;
  fullName: string;
};

export type NotificationPayload = {
  invoicePaid: boolean;
  contractSigned: boolean;
  payoutSent: boolean;
  weeklyDigest: boolean;
  productUpdates: boolean;
};

export type SettingsPayload = {
  tab: SettingsTab;
  theme: ThemePreference;
  language: AppLanguage;
  profile: ProfilePayload;
  company: CompanyPayload | null;
  members: MemberPayload[];
  notifications: NotificationPayload;
  canManageCompany: boolean;
};
