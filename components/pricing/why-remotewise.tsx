import { IsoIcon, type IsoIconName } from "@/components/icons/iso-icon";
import { PLATFORM_TAKE_PERCENT, SERVICE_FEE_PERCENT, SHIELD_FEE_PERCENT } from "@/lib/pricing";

export function WhyRemoteWise() {
  return (
    <section className="mt-16" aria-labelledby="why-remotewise-heading">
      <h2 id="why-remotewise-heading" className="rw-section-title">
        Why RemoteWise
      </h2>
      <p className="mt-2 max-w-2xl font-sans text-body text-ink-secondary">
        Lowest total fee in Finland, insurance on every invoice, and a free contractor OS for companies.
      </p>
      <HowWeWork />
      <WhyBetter />
      <SmartTips />
      <OurPromise />
    </section>
  );
}

function HowWeWork() {
  const steps: { icon: IsoIconName; title: string; body: string }[] = [
    {
      icon: "create-invoice",
      title: "Create the invoice",
      body: "Add the client, line items, and currency. Creating an invoice is free.",
    },
    {
      icon: "client-pay",
      title: "The client pays us",
      body: "Money lands with RemoteWise. We are the billing party, not you personally.",
    },
    {
      icon: "coverage",
      title: "Shield is issued",
      body: `We deduct ${PLATFORM_TAKE_PERCENT}% and attach a coverage certificate to that paid invoice.`,
    },
    {
      icon: "choose-payout",
      title: "You choose payout",
      body: "24 hours free, Lightning in minutes, or financing before the client pays.",
    },
  ];

  return (
    <div className="mt-10" aria-labelledby="how-we-work-heading">
      <h3 id="how-we-work-heading" className="font-display text-card text-ink">
        How we work
      </h3>
      <div className="relative mt-6">
        <div
          aria-hidden
          className="pointer-events-none absolute left-[12%] right-[12%] top-[26px] hidden h-[3px] rounded-full lg:block"
          style={{
            background: "linear-gradient(90deg, #6D28D9 0%, #4F46E5 50%, #06B6D4 100%)",
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
  const cards: { icon: IsoIconName; title: string; body: string }[] = [
    {
      icon: "payouts",
      title: "Lowest total fee in Finland",
      body: `${PLATFORM_TAKE_PERCENT}% all-in (${SERVICE_FEE_PERCENT}% service + ${SHIELD_FEE_PERCENT}% Shield). One number, insurance included, no surprise add-ons.`,
    },
    {
      icon: "shield",
      title: "Insurance built in",
      body: "Accident, liability, and legal-expense cover on every paid invoice. Certificate attached automatically.",
    },
    {
      icon: "clock",
      title: "24h free payout",
      body: "After the client pays, standard payout is free within 24 hours. Lightning is optional.",
    },
    {
      icon: "globe",
      title: "No company needed",
      body: "Light entrepreneur mode. Invoice as yourself. Register a Y-tunnus later if you want one.",
    },
    {
      icon: "freelancers",
      title: "Free contractor OS",
      body: "Companies invite unlimited freelancers, send contracts, and pay invoices at $0/month.",
    },
    {
      icon: "support",
      title: "Human support in 24h",
      body: "Finnish and English. A person replies within a working day — not a ticket black hole.",
    },
  ];

  return (
    <div className="mt-12" aria-labelledby="why-better-heading">
      <h3 id="why-better-heading" className="font-display text-card text-ink">
        Why we are better
      </h3>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <li key={card.title} className="rounded-card border border-border bg-card p-5">
            <IsoIcon name={card.icon} size={44} title={card.title} />
            <h4 className="mt-4 font-display text-card text-ink">{card.title}</h4>
            <p className="mt-2 font-sans text-[14px] leading-relaxed text-ink-secondary">{card.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SmartTips() {
  const freelancer = [
    "Invoice weekly, not monthly",
    "Attach the signed contract before starting work",
    "Save your tax residency and IBAN once — every invoice fills itself",
  ];
  const company = [
    "Collect the W-8/W-9 equivalent early",
    "Use milestones for projects over €2,000",
    "Pay through RemoteWise so Shield and reporting stay attached",
  ];

  return (
    <div className="mt-12" aria-labelledby="smart-tips-heading">
      <h3 id="smart-tips-heading" className="font-display text-card text-ink">
        Smart tips
      </h3>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TipColumn title="For freelancers" items={freelancer} />
        <TipColumn title="For companies" items={company} />
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
  const items = [
    "Transparent fees — every line visible before you send",
    "Payout on time or we cover the delay",
    "Cancel any invoice before it is paid",
    "Export your data anytime",
    "24h human support",
  ];

  return (
    <div className="mt-12" aria-labelledby="promise-heading">
      <h3 id="promise-heading" className="font-display text-card text-ink">
        Our promise to you
      </h3>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => (
          <li key={item} className="rounded-card border border-border bg-card p-4">
            <IsoIcon name="promise" size={32} title="Promise" />
            <p className="mt-3 font-sans text-[13px] leading-relaxed text-ink">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
