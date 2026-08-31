import { PRICING_CURRENCIES, type PricingCurrency } from "@/lib/pricing";

export type FxRates = {
  base: "EUR";
  date: string;
  rates: Record<PricingCurrency, number>;
  source: "frankfurter" | "fallback";
  missing: PricingCurrency[];
};

export function convertAmount(
  amount: number,
  from: PricingCurrency,
  to: PricingCurrency,
  rates: Record<PricingCurrency, number>,
) {
  if (from === to) return amount;
  const inEur = from === "EUR" ? amount : amount / rates[from];
  return to === "EUR" ? inEur : inEur * rates[to];
}

export { PRICING_CURRENCIES };
