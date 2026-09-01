import Stripe from "stripe";

export function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY?.trim() || "";
}

export function getStripePublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || "";
}

export function isStripeConfigured() {
  return Boolean(getStripeSecretKey());
}

export function isStripeTestMode() {
  const key = getStripeSecretKey();
  return !key || key.startsWith("sk_test_") || key.startsWith("rk_test_");
}

export function getStripe(): Stripe | null {
  const key = getStripeSecretKey();
  if (!key) return null;
  return new Stripe(key);
}

export function toCents(amount: number) {
  return Math.round(amount * 100);
}

export function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
