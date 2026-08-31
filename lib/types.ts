export type Currency = "USD" | "EUR" | "GBP" | "SAR";

export type FreelancerStatus = "active" | "invited" | "inactive";

export type InviteFreelancerInput = {
  name: string;
  email: string;
  role?: string;
  rate?: number | null;
  currency: Currency;
  note?: string;
};

export type InviteFreelancerResponse = {
  inviteId: string;
  message: string;
};

export type Freelancer = {
  id: string;
  fullName: string;
  email: string;
  role: string | null;
  hourlyRate: number | null;
  currency: Currency;
  status: FreelancerStatus;
  country: string | null;
  avatarUrl: string | null;
  stripeOnboarded: boolean;
  contractCount: number;
  invoiceCount: number;
  createdAt: string;
};

export const CURRENCIES: Currency[] = ["USD", "EUR", "GBP", "SAR"];
