"use client";

import { useEffect, useMemo, useState } from "react";
import { MoneyCircle } from "@/components/motion/money-circle";
import { useFormat, useT } from "@/components/i18n/language-provider";
import {
  DEFAULT_PRICING_CURRENCY,
  PAYOUT_OPTIONS,
  PLATFORM_TAKE_PERCENT,
  PRICING_CURRENCIES,
  SERVICE_FEE_PERCENT,
  SHIELD_FEE_PERCENT,
  calculateCompanyCharge,
  calculateFreelancerPayout,
  formatTakePercent,
  type PayoutOption,
  type PricingCurrency,
} from "@/lib/pricing";
import { convertAmount, type FxRates } from "@/lib/fx-shared";
import type { MessageKey } from "@/lib/i18n";

const PAYOUT_KEYS: Record<PayoutOption, { label: MessageKey; hint: MessageKey }> = {
  standard: { label: "pricing.standardLabel", hint: "pricing.standardHint" },
  lightning: { label: "pricing.lightningLabel", hint: "pricing.lightningHint" },
  financing: { label: "pricing.financingLabel", hint: "pricing.financingHint" },
};

type FeeCalculatorProps = {
  side: "freelancer" | "company";
};

export function FeeCalculator({ side }: FeeCalculatorProps) {
  const t = useT();
  const format = useFormat();
  const [amountInput, setAmountInput] = useState("5000");
  const [currency, setCurrency] = useState<PricingCurrency>(DEFAULT_PRICING_CURRENCY);
  const [payout, setPayout] = useState<PayoutOption>("standard");
  const [fx, setFx] = useState<FxRates | null>(null);
  const [fxError, setFxError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/fx")
      .then(async (response) => {
        if (!response.ok) throw new Error(t("pricing.fxLoadError"));
        return (await response.json()) as FxRates;
      })
      .then((data) => {
        if (!cancelled) {
          setFx(data);
          setFxError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setFxError(t("pricing.fxPaused"));
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  const amount = Number(amountInput.replaceAll(",", "").replaceAll(" ", ""));
  const freelancer = useMemo(
    () => calculateFreelancerPayout(Number.isFinite(amount) ? amount : 0, payout, currency),
    [amount, payout, currency],
  );
  const company = useMemo(
    () => calculateCompanyCharge(Number.isFinite(amount) ? amount : 0, currency),
    [amount, currency],
  );

  const keepLabel = format.moneyExact(freelancer.youKeep, currency);
  const invoiceLabel = format.moneyExact(freelancer.amount, currency);
  const eurKeep =
    fx && currency !== "EUR"
      ? format.moneyExact(convertAmount(freelancer.youKeep, currency, "EUR", fx.rates), "EUR")
      : null;

  return (
    <section
      className="rounded-card border border-border bg-card p-6 sm:p-8"
      aria-labelledby="fee-calculator-heading"
    >
      <p className="rw-label">{t("pricing.calcLive")}</p>
      <h2 id="fee-calculator-heading" className="rw-section-title">
        {side === "freelancer"
          ? t("pricing.calcFreelancer", { invoice: invoiceLabel, keep: keepLabel })
          : t("pricing.calcCompany", { invoice: invoiceLabel, keep: keepLabel })}
      </h2>
      <p className="mt-2 font-sans text-body text-ink-secondary">
        {t("pricing.calcHint", {
          take: PLATFORM_TAKE_PERCENT,
          service: SERVICE_FEE_PERCENT,
          shield: SHIELD_FEE_PERCENT,
        })}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label htmlFor="invoice-amount" className="rw-label">
              {t("pricing.invoiceAmount")}
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
                aria-label={t("common.currency")}
              >
                {PRICING_CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
            <p id="invoice-amount-hint" className="mt-1.5 font-sans text-small text-ink-muted">
              {t("pricing.fxHint")}
              {fx ? ` (${fx.date})` : ""}.
              {fxError ? ` ${fxError}` : ""}
            </p>
            {fx && currency !== "EUR" ? (
              <p className="mt-1 font-sans text-small text-ink-secondary">
                {t("pricing.fxRate", { rate: fx.rates[currency].toFixed(4), currency })}
                {eurKeep ? ` · ${t("pricing.youKeepApprox", { amount: eurKeep })}` : ""}
              </p>
            ) : null}
          </div>

          {side === "freelancer" ? (
            <fieldset>
              <legend className="rw-label">{t("pricing.whenPaid")}</legend>
              <div className="space-y-2">
                {PAYOUT_OPTIONS.map((option) => {
                  const copy = PAYOUT_KEYS[option];
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
                        <span className="block font-sans text-[14px] font-medium text-ink">
                          {t(copy.label)}
                        </span>
                        <span className="mt-0.5 block font-sans text-small text-ink-secondary">
                          {t(copy.hint)}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : (
            <p className="rounded-control bg-page px-3 py-3 font-sans text-[14px] text-ink-secondary">
              {t("pricing.companyFeeNote")}
            </p>
          )}
        </div>

        <div className="rounded-card border border-border bg-page p-5">
          <MoneyCircle
            keep={freelancer.youKeep}
            fees={freelancer.totalFees}
            label={t("pricing.youReceive")}
            formattedKeep={keepLabel}
          />
          <p className="mt-2 text-center font-sans text-small text-ink-secondary">
            {t("pricing.afterFees", { fees: format.moneyExact(freelancer.totalFees, currency) })}
            {payout === "standard" ? ` (${formatTakePercent(freelancer.takeRate)})` : null}.
          </p>

          <dl className="mt-6 space-y-2 font-sans text-[14px]">
            <Row label={t("pricing.rowInvoice")} value={format.moneyExact(freelancer.amount, currency)} />
            <Row
              label={t("pricing.rowService", { percent: SERVICE_FEE_PERCENT })}
              value={`− ${format.moneyExact(freelancer.serviceFee, currency)}`}
            />
            <Row
              label={t("pricing.rowShield", { percent: SHIELD_FEE_PERCENT })}
              value={`− ${format.moneyExact(freelancer.shieldFee, currency)}`}
            />
            {freelancer.lightningFee > 0 ? (
              <Row
                label={t("pricing.rowLightning")}
                value={`− ${format.moneyExact(freelancer.lightningFee, currency)}`}
              />
            ) : null}
            {freelancer.financingFee > 0 ? (
              <Row
                label={t("pricing.rowFinancing")}
                value={`− ${format.moneyExact(freelancer.financingFee, currency)}`}
              />
            ) : null}
            {side === "company" ? (
              <Row
                label={t("pricing.rowProcessing")}
                value={format.moneyExact(company.processingFee, currency)}
                emphasize
              />
            ) : null}
          </dl>

          {side === "company" ? (
            <p className="mt-4 border-t border-border pt-4 font-sans text-[14px] text-ink">
              {t("pricing.youPay", {
                amount: format.moneyExact(company.companyPays, currency),
                keep: keepLabel,
              })}
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
