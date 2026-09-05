export const SERVICE_FEE_RATE = 0.035;
export const SHIELD_FEE_RATE = 0.02;
export const PLATFORM_TAKE_RATE = SERVICE_FEE_RATE + SHIELD_FEE_RATE;
export const SERVICE_FEE_PERCENT = 3.5;
export const SHIELD_FEE_PERCENT = 2;
export const PLATFORM_TAKE_PERCENT = 5.5;
export const LIGHTNING_FEE_RATE = 0.01;
export const LIGHTNING_FEE_MIN = 5;
export const FINANCING_FEE_RATE = 0.04;
export const FINANCING_FLAT_FEE = 10;
export const COMPANY_PROCESSING_RATE = 0.015;

export const PRICING_CURRENCIES = ["EUR", "USD", "GBP", "RUB", "CNY"] as const;
export type PricingCurrency = (typeof PRICING_CURRENCIES)[number];

export const DEFAULT_PRICING_CURRENCY: PricingCurrency = "EUR";

export const PAYOUT_OPTIONS = ["standard", "lightning", "financing"] as const;
export type PayoutOption = (typeof PAYOUT_OPTIONS)[number];

export type FreelancerFeeBreakdown = {
  amount: number;
  currency: PricingCurrency;
  serviceFee: number;
  shieldFee: number;
  lightningFee: number;
  financingFee: number;
  totalFees: number;
  youKeep: number;
  takeRate: number;
  keepRatio: number;
  feeRatio: number;
};

export type CompanyChargeBreakdown = {
  amount: number;
  currency: PricingCurrency;
  processingFee: number;
  companyPays: number;
};

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function lightningFeeFor(amount: number) {
  if (amount <= 0) return 0;
  return roundMoney(Math.max(amount * LIGHTNING_FEE_RATE, LIGHTNING_FEE_MIN));
}

export function financingFeeFor(amount: number) {
  if (amount <= 0) return 0;
  return roundMoney(amount * FINANCING_FEE_RATE + FINANCING_FLAT_FEE);
}

export function calculateFreelancerPayout(
  amount: number,
  payout: PayoutOption,
  currency: PricingCurrency = DEFAULT_PRICING_CURRENCY,
): FreelancerFeeBreakdown {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? roundMoney(amount) : 0;
  const serviceFee = roundMoney(safeAmount * SERVICE_FEE_RATE);
  const shieldFee = roundMoney(safeAmount * SHIELD_FEE_RATE);
  const lightningFee = payout === "lightning" ? lightningFeeFor(safeAmount) : 0;
  const financingFee = payout === "financing" ? financingFeeFor(safeAmount) : 0;
  const totalFees = roundMoney(serviceFee + shieldFee + lightningFee + financingFee);
  const youKeep = roundMoney(Math.max(safeAmount - totalFees, 0));
  const takeRate = safeAmount > 0 ? totalFees / safeAmount : PLATFORM_TAKE_RATE;

  return {
    amount: safeAmount,
    currency,
    serviceFee,
    shieldFee,
    lightningFee,
    financingFee,
    totalFees,
    youKeep,
    takeRate,
    keepRatio: safeAmount > 0 ? youKeep / safeAmount : 1 - PLATFORM_TAKE_RATE,
    feeRatio: safeAmount > 0 ? totalFees / safeAmount : PLATFORM_TAKE_RATE,
  };
}

export function calculateCompanyCharge(
  amount: number,
  currency: PricingCurrency = DEFAULT_PRICING_CURRENCY,
): CompanyChargeBreakdown {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? roundMoney(amount) : 0;
  const processingFee = roundMoney(safeAmount * COMPANY_PROCESSING_RATE);
  return {
    amount: safeAmount,
    currency,
    processingFee,
    companyPays: roundMoney(safeAmount + processingFee),
  };
}

export function formatPricingMoney(
  amount: number,
  currency: PricingCurrency,
  locale: string = "en-GB",
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function formatTakePercent(rate: number) {
  return `${(rate * 100).toFixed(1).replace(/\.0$/, "")}%`;
}
