import { PRICING_CURRENCIES, type PricingCurrency } from "@/lib/pricing";
import { type FxRates } from "@/lib/fx-shared";

export type { FxRates } from "@/lib/fx-shared";
export { convertAmount } from "@/lib/fx-shared";

const FALLBACK_RATES: Record<PricingCurrency, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.86,
  RUB: 98,
  CNY: 7.85,
};

let cached: { at: number; value: FxRates } | null = null;
const CACHE_MS = 60 * 60 * 1000;

function completeRates(
  incoming: Partial<Record<string, number>>,
): { rates: Record<PricingCurrency, number>; missing: PricingCurrency[] } {
  const rates = { ...FALLBACK_RATES };
  const missing: PricingCurrency[] = [];
  for (const code of PRICING_CURRENCIES) {
    const value = incoming[code];
    if (code === "EUR") {
      rates.EUR = 1;
      continue;
    }
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      rates[code] = value;
    } else {
      missing.push(code);
    }
  }
  return { rates, missing };
}

export async function fetchFxRates(): Promise<FxRates> {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.value;

  const to = PRICING_CURRENCIES.filter((code) => code !== "EUR").join(",");
  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=EUR&to=${encodeURIComponent(to)}`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) throw new Error(`frankfurter ${response.status}`);
    const body = (await response.json()) as {
      date?: string;
      rates?: Record<string, number>;
    };
    const { rates, missing } = completeRates(body.rates ?? {});
    const value: FxRates = {
      base: "EUR",
      date: body.date || new Date().toISOString().slice(0, 10),
      rates,
      source: missing.length ? "fallback" : "frankfurter",
      missing,
    };
    cached = { at: Date.now(), value };
    return value;
  } catch {
    const value: FxRates = {
      base: "EUR",
      date: new Date().toISOString().slice(0, 10),
      rates: { ...FALLBACK_RATES },
      source: "fallback",
      missing: PRICING_CURRENCIES.filter((code) => code !== "EUR"),
    };
    cached = { at: Date.now(), value };
    return value;
  }
}
