export const VAT_RATES = [25.5, 14, 10, 0] as const;
export type VatRate = (typeof VAT_RATES)[number];

export const DEFAULT_VAT_RATE: VatRate = 25.5;

export const VAT_RATE_LABELS: Record<VatRate, string> = {
  25.5: "25.5% general",
  14: "14% food / restaurants",
  10: "10% books / transport",
  0: "0% zero-rated",
};

export function isVatRate(value: unknown): value is VatRate {
  return VAT_RATES.includes(Number(value) as VatRate);
}

export function vatAmount(net: number, rate: VatRate, exempt: boolean) {
  if (exempt || net <= 0) return 0;
  return Math.round(net * (rate / 100) * 100) / 100;
}
