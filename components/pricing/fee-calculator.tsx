"use client";

import { useEffect, useMemo, useState } from "react";
import { MoneyCircle } from "@/components/motion/money-circle";
import {
  DEFAULT_PRICING_CURRENCY,
  PAYOUT_OPTIONS,
  PLATFORM_TAKE_PERCENT,
  PRICING_CURRENCIES,
  SERVICE_FEE_PERCENT,
  SHIELD_FEE_PERCENT,
  calculateCompanyCharge,
  calculateFreelancerPayout,
  formatPricingMoney,
  formatTakePercent,
  type PayoutOption,
  type PricingCurrency,
} from "@/lib/pricing";
import { convertAmount, type FxRates } from "@/lib/fx-shared";

const PAYOUT_COPY: Record<PayoutOption, { label: string; hint: string }> = {
  standard: { label: "Standard payout", hint: "24 hours after the client pays. Free." },
  lightning: { label: "Lightning Pay", hint: "Instant. 1% of the invoice, €5 / $5 minimum." },
  financing: { label: "Invoice financing", hint: "Get paid before the client pays. 4% + €10." },
};

type FeeCalculatorProps = {
  side: "freelancer" | "company";
};

export function FeeCalculator({ side }: FeeCalculatorProps) {
  const [amountInput, setAmountInput] = useState("5000");
  const [currency, setCurrency] = useState<PricingCurrency>(DEFAULT_PRICING_CURRENCY);
  const [payout, setPayout] = useState<PayoutOption>("standard");
  const [fx, setFx] = useState<FxRates | null>(null);
  const [fxError, setFxError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/fx")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load FX rates");
        return (await response.json()) as FxRates;
      })
      .then((data) => {
        if (!cancelled) {
          setFx(data);
          setFxError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setFxError("Live FX is paused. Showing last known rates.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const amount = Number(amountInput.replaceAll(",", "").replaceAll(" ", ""));
  const freelancer = useMemo(
    () => calculateFreelancerPayout(Number.isFinite(amount) ? amount : 0, payout, currency),
    [amount, payout, currency],
  );
  const company = useMemo(
    () => calculateCompanyCharge(Number.isFinite(amount) ? amount : 0, currency),
    [amount, currency],
  );

  const keepLabel = formatPricingMoney(freelancer.youKeep, currency);
  const invoiceLabel = formatPricingMoney(freelancer.amount, currency);
  const eurKeep =
    fx && currency !== "EUR"
      ? formatPricingMoney(convertAmount(freelancer.youKeep, currency, "EUR", fx.rates), "EUR")
      : null;

  return (
    <section
      className="rounded-card border border-border bg-card p-6 sm:p-8"
      aria-labelledby="fee-calculator-heading"
    >
      <p className="rw-label">Live calculator</p>
      <h2 id="fee-calculator-heading" className="rw-section-title">
        {side === "freelancer"
          ? `Invoice ${invoiceLabel} → you keep ${keepLabel}`
          : `Pay ${invoiceLabel} → freelancer keeps ${keepLabel}`}
      </h2>
      <p className="mt-2 font-sans text-body text-ink-secondary">
        Fees apply to the VAT-exclusive amount. You see every line before you send. Total take rate is{" "}
        {PLATFORM_TAKE_PERCENT}% ({SERVICE_FEE_PERCENT}% service + {SHIELD_FEE_PERCENT}% Shield).
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label htmlFor="invoice-amount" className="rw-label">
              Invoice amount
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="invoice-amount"
                className="rw-input"
                inputMode="decimal"
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value.replace(/[^\d.,]/g, ""))}
                aria-describedby="invoice-amount-hint"
              />
              <select
                id="invoice-currency"
                className="rw-input w-[108px] shrink-0"
                value={currency}
                onChange={(event) => setCurrency(event.target.value as PricingCurrency)}
                aria-label="Currency"
              >
                {PRICING_CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
            <p id="invoice-amount-hint" className="mt-1.5 font-sans text-small text-ink-muted">
              EUR default. Live FX from frankfurter.app
              {fx ? ` (${fx.date})` : ""}.
              {fxError ? ` ${fxError}` : ""}
            </p>
            {fx && currency !== "EUR" ? (
              <p className="mt-1 font-sans text-small text-ink-secondary">
                1 EUR = {fx.rates[currency].toFixed(4)} {currency}
                {eurKeep ? ` · you keep ≈ ${eurKeep}` : ""}
              </p>
            ) : null}
          </div>

          {side === "freelancer" ? (
            <fieldset>
              <legend className="rw-label">When you get paid</legend>
              <div className="space-y-2">
                {PAYOUT_OPTIONS.map((option) => {
                  const copy = PAYOUT_COPY[option];
                  const selected = payout === option;
                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer gap-3 rounded-control border px-3 py-3 ${
                        selected ? "border-primary bg-primary-light" : "border-border bg-card"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payout-option"
                        className="mt-1"
                        checked={selected}
                        onChange={() => setPayout(option)}
                      />
                      <span>
                        <span className="block font-sans text-[14px] font-medium text-ink">{copy.label}</span>
                        <span className="mt-0.5 block font-sans text-small text-ink-secondary">{copy.hint}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : (
            <p className="rounded-control bg-page px-3 py-3 font-sans text-[14px] text-ink-secondary">
              Companies pay a 1.5% processing fee on top of the invoice. That fee is not taken from the
              freelancer.
            </p>
          )}
        </div>

        <div className="rounded-card border border-border bg-page p-5">
          <MoneyCircle
            keep={freelancer.youKeep}
            fees={freelancer.totalFees}
            label="You receive"
            formattedKeep={keepLabel}
          />
          <p className="mt-2 text-center font-sans text-small text-ink-secondary">
            After {formatPricingMoney(freelancer.totalFees, currency)} in fees
            {payout === "standard" ? ` (${formatTakePercent(freelancer.takeRate)})` : null}.
          </p>

          <dl className="mt-6 space-y-2 font-sans text-[14px]">
            <Row label="Invoice" value={formatPricingMoney(freelancer.amount, currency)} />
            <Row
              label={`Service fee (${SERVICE_FEE_PERCENT}%)`}
              value={`− ${formatPricingMoney(freelancer.serviceFee, currency)}`}
            />
            <Row
              label={`RemoteWise Shield (${SHIELD_FEE_PERCENT}%)`}
              value={`− ${formatPricingMoney(freelancer.shieldFee, currency)}`}
            />
            {freelancer.lightningFee > 0 ? (
              <Row
                label="Lightning Pay"
                value={`− ${formatPricingMoney(freelancer.lightningFee, currency)}`}
              />
            ) : null}
            {freelancer.financingFee > 0 ? (
              <Row
                label="Invoice financing"
                value={`− ${formatPricingMoney(freelancer.financingFee, currency)}`}
              />
            ) : null}
            {side === "company" ? (
              <Row
                label="Company processing (1.5%)"
                value={formatPricingMoney(company.processingFee, currency)}
                emphasize
              />
            ) : null}
          </dl>

          {side === "company" ? (
            <p className="mt-4 border-t border-border pt-4 font-sans text-[14px] text-ink">
              You pay {formatPricingMoney(company.companyPays, currency)}. The freelancer still keeps{" "}
              {keepLabel}.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-ink-secondary">{label}</dt>
      <dd className={emphasize ? "font-medium text-ink" : "font-mono text-mono text-ink"}>{value}</dd>
    </div>
  );
}
