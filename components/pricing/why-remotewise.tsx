"use client";

import { IsoIcon, type IsoIconName } from "@/components/icons/iso-icon";
import { useT } from "@/components/i18n/language-provider";
import type { MessageKey } from "@/lib/i18n";
import { PLATFORM_TAKE_PERCENT, SERVICE_FEE_PERCENT, SHIELD_FEE_PERCENT } from "@/lib/pricing";

const TAKE = {
  take: PLATFORM_TAKE_PERCENT,
  service: SERVICE_FEE_PERCENT,
  shield: SHIELD_FEE_PERCENT,
};

export function WhyRemoteWise() {
  const t = useT();
  return (
    <section className="mt-16" aria-labelledby="why-remotewise-heading">
      <h2 id="why-remotewise-heading" className="rw-section-title">
        {t("pricing.whyTitle")}
      </h2>
      <p className="mt-2 max-w-2xl font-sans text-body text-ink-secondary">{t("pricing.whySub")}</p>
      <HowWeWork />
      <WhyBetter />
      <SmartTips />
      <OurPromise />
    </section>
  );
}

function HowWeWork() {
  const t = useT();
  const steps: { icon: IsoIconName; title: string; body: string }[] = [
    { icon: "create-invoice", title: t("pricing.how1title"), body: t("pricing.how1body") },
    { icon: "client-pay", title: t("pricing.how2title"), body: t("pricing.how2body") },
    { icon: "coverage", title: t("pricing.how3title"), body: t("pricing.how3body", TAKE) },
    { icon: "choose-payout", title: t("pricing.how4title"), body: t("pricing.how4body") },
  ];

  return (
    <div className="mt-10" aria-labelledby="how-we-work-heading">
      <h3 id="how-we-work-heading" className="font-display text-card text-ink">
        {t("pricing.howTitle")}
      </h3>
      <div className="relative mt-6">
        <div
          aria-hidden
          className="pointer-events-none absolute left-[12%] right-[12%] top-[26px] hidden h-[3px] rounded-full lg:block"
          style={{
            background: "linear-gradient(90deg, #0B1A33 0%, #2563EB 70%, #059669 100%)",
          }}
        />
        <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.title} className="rounded-card border border-border bg-card p-5">
              <IsoIcon name={step.icon} size={52} title={step.title} />
              <h4 className="mt-4 font-display text-card text-ink">{step.title}</h4>
              <p className="mt-2 font-sans text-[14px] leading-relaxed text-ink-secondary">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function WhyBetter() {
  const t = useT();
  const cards: { icon: IsoIconName; titleKey: MessageKey; bodyKey: MessageKey }[] = [
    { icon: "payouts", titleKey: "pricing.better1title", bodyKey: "pricing.better1body" },
    { icon: "shield", titleKey: "pricing.better2title", bodyKey: "pricing.better2body" },
    { icon: "clock", titleKey: "pricing.better3title", bodyKey: "pricing.better3body" },
    { icon: "globe", titleKey: "pricing.better4title", bodyKey: "pricing.better4body" },
    { icon: "freelancers", titleKey: "pricing.better5title", bodyKey: "pricing.better5body" },
    { icon: "support", titleKey: "pricing.better6title", bodyKey: "pricing.better6body" },
  ];

  return (
    <div className="mt-12" aria-labelledby="why-better-heading">
      <h3 id="why-better-heading" className="font-display text-card text-ink">
        {t("pricing.betterTitle")}
      </h3>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const title = t(card.titleKey);
          const body = t(card.bodyKey, TAKE);
          return (
            <li key={card.titleKey} className="rounded-card border border-border bg-card p-5">
              <IsoIcon name={card.icon} size={44} title={title} />
              <h4 className="mt-4 font-display text-card text-ink">{title}</h4>
              <p className="mt-2 font-sans text-[14px] leading-relaxed text-ink-secondary">{body}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SmartTips() {
  const t = useT();
  const freelancer = [t("pricing.tipF1"), t("pricing.tipF2"), t("pricing.tipF3")];
  const company = [t("pricing.tipC1"), t("pricing.tipC2"), t("pricing.tipC3")];

  return (
    <div className="mt-12" aria-labelledby="smart-tips-heading">
      <h3 id="smart-tips-heading" className="font-display text-card text-ink">
        {t("pricing.tipsTitle")}
      </h3>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TipColumn title={t("pricing.tipsFreelancers")} items={freelancer} />
        <TipColumn title={t("pricing.tipsCompanies")} items={company} />
      </div>
    </div>
  );
}

function TipColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-card border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <IsoIcon name="tip" size={36} title={title} />
        <h4 className="font-display text-card text-ink">{title}</h4>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="font-sans text-[14px] leading-relaxed text-ink-secondary">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OurPromise() {
  const t = useT();
  const items = [
    t("pricing.promise1"),
    t("pricing.promise2"),
    t("pricing.promise3"),
    t("pricing.promise4"),
    t("pricing.promise5"),
  ];

  return (
    <div className="mt-12" aria-labelledby="promise-heading">
      <h3 id="promise-heading" className="font-display text-card text-ink">
        {t("pricing.promiseTitle")}
      </h3>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => (
          <li key={item} className="rounded-card border border-border bg-card p-4">
            <IsoIcon name="promise" size={32} title={t("pricing.promiseAria")} />
            <p className="mt-3 font-sans text-[13px] leading-relaxed text-ink">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
