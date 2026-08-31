"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FeeCalculator } from "@/components/pricing/fee-calculator";
import { PricingNav } from "@/components/pricing/pricing-nav";

type Audience = "freelancer" | "company";

export function PricingView() {
  const [audience, setAudience] = useState<Audience>("freelancer");

  return (
    <div className="min-h-screen bg-page">
      <PricingNav />

      <main className="rw-aurora w-full px-6 py-12 sm:py-16 lg:px-10">
        <section className="max-w-3xl">
          <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-primary-text">
            Pricing
          </p>
          <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.15] tracking-[-0.6px] text-ink sm:text-[44px]">
            Invoice the world. Register a company when you are ready.
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-[16px] leading-relaxed text-ink-secondary">
            RemoteWise invoices on your behalf, collects payment, insures the work, and pays you
            out. You do not need a company to start. Companies manage contractors for free.
          </p>
        </section>

        <div
          className="mt-8 inline-flex rounded-control border border-border bg-card p-1"
          role="tablist"
          aria-label="Pricing audience"
        >
          <AudienceTab
            selected={audience === "freelancer"}
            onSelect={() => setAudience("freelancer")}
          >
            Freelancers
          </AudienceTab>
          <AudienceTab selected={audience === "company"} onSelect={() => setAudience("company")}>
            Companies
          </AudienceTab>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={audience}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {audience === "freelancer" ? <FreelancerPanel /> : <CompanyPanel />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8">
          <FeeCalculator side={audience} />
        </div>

        <HowItWorks />
        <ComparisonTable />
        <PricingFaq />
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex w-full flex-col gap-2 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p className="font-sans text-small text-ink-muted">
            Fees are public. No tax withholding in this phase — you report income in your country.
          </p>
          <Link href="/signup" className="font-sans text-[14px] font-medium text-primary">
            Create a workspace
          </Link>
        </div>
      </footer>
    </div>
  );
}

function AudienceTab({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={`rounded-[6px] px-4 py-2 font-sans text-[14px] font-medium ${
        selected ? "rw-cta text-white" : "text-ink-secondary hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function FreelancerPanel() {
  return (
    <section className="mt-8 grid gap-4 lg:grid-cols-3">
      <article className="rounded-card border border-primary bg-card p-6 lg:col-span-2">
        <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-primary-text">
          Light entrepreneur
        </p>
        <h2 className="mt-2 font-display text-[28px] font-semibold text-ink">8.5% all-in</h2>
        <p className="mt-2 font-sans text-body text-ink-secondary">
          6% service fee plus 2.5% RemoteWise Shield. No monthly subscription to send invoices.
        </p>
        <ul className="mt-6 space-y-3 font-sans text-[14px] text-ink">
          <li>Invoice any client in USD or EUR. We are the billing entity.</li>
          <li>Shield covers accident, liability, and legal-expense on invoiced work.</li>
          <li>Standard payout in 24 hours after the client pays. Free.</li>
          <li>Lightning Pay: 1% (minimum $5) when you need the money now.</li>
          <li>Invoice financing: 4% + $10 if you want to be paid before the client pays.</li>
        </ul>
        <div className="mt-8">
          <Button asChild>
            <Link href="/signup?role=freelancer">Start invoicing</Link>
          </Button>
        </div>
      </article>
      <article className="rounded-card border border-border bg-card p-6">
        <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
          When you incorporate
        </p>
        <h2 className="mt-2 font-display text-section text-ink">Business path</h2>
        <p className="mt-2 font-sans text-body text-ink-secondary">
          $49 once, then $9.90/month for bookkeeping. Same product. Your own business ID when you
          want it.
        </p>
        <p className="mt-6 font-sans text-small text-ink-muted">
          Optional later: debt collection at 8% of recovered amounts, only if we collect.
        </p>
      </article>
    </section>
  );
}

function CompanyPanel() {
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      <PlanCard
        name="Free"
        price="$0"
        cadence="forever"
        pitch="The contractor OS. Unlimited people. Unlimited invoices."
        cta="Create a workspace"
        href="/signup"
        featured
        items={[
          "Unlimited freelancer invites",
          "Pay invoices by card or transfer",
          "Monthly spend dashboard",
          "Auto tax reporting when you pay through us",
        ]}
      />
      <PlanCard
        name="Growth"
        price="$49"
        cadence="/mo"
        pitch="Contracts, analytics, and seats when the roster grows."
        cta="Start free, upgrade later"
        href="/signup"
        items={[
          "E-signature contracts",
          "Advanced analytics",
          "Team seats",
          "Everything in Free",
        ]}
      />
      <PlanCard
        name="Scale"
        price="$149"
        cadence="/mo"
        pitch="Finance, API, and custom cover for operators."
        cta="Talk to us after you start"
        href="/signup"
        items={[
          "Group invoicing",
          "API access",
          "Priority support",
          "Custom insurance",
        ]}
      />
      <p className="md:col-span-3 font-sans text-small text-ink-secondary">
        Payment processing is 1.5% on top of the freelancer&apos;s 8.5%. We do not hide it inside
        the contractor&apos;s payout.
      </p>
    </section>
  );
}

function PlanCard({
  name,
  price,
  cadence,
  pitch,
  cta,
  href,
  items,
  featured = false,
}: {
  name: string;
  price: string;
  cadence: string;
  pitch: string;
  cta: string;
  href: string;
  items: string[];
  featured?: boolean;
}) {
  return (
    <article
      className={`flex flex-col rounded-card border bg-card p-6 ${
        featured ? "border-primary" : "border-border"
      }`}
    >
      {featured ? (
        <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-primary-text">
          Start here
        </p>
      ) : (
        <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
          {name}
        </p>
      )}
      <h2 className="mt-2 font-display text-section text-ink">{name}</h2>
      <p className="mt-2 font-display text-[28px] font-semibold text-ink">
        {price}
        <span className="ml-1 font-sans text-[14px] font-normal text-ink-secondary">{cadence}</span>
      </p>
      <p className="mt-2 font-sans text-body text-ink-secondary">{pitch}</p>
      <ul className="mt-6 flex-1 space-y-2 font-sans text-[14px] text-ink">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="mt-8">
        <Button asChild variant={featured ? "primary" : "secondary"} size="full">
          <Link href={href}>{cta}</Link>
        </Button>
      </div>
    </article>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Create the invoice",
      body: "Add the client, line items, and currency. Creating an invoice is free.",
    },
    {
      n: "2",
      title: "The client pays us",
      body: "Money lands with RemoteWise. We are the billing party, not you personally.",
    },
    {
      n: "3",
      title: "Shield is issued",
      body: "We deduct 8.5% and attach a coverage certificate to that paid invoice.",
    },
    {
      n: "4",
      title: "You choose payout",
      body: "24 hours free, Lightning in minutes, or financing before the client pays.",
    },
  ];

  return (
    <section className="mt-16" aria-labelledby="how-it-works-heading">
      <h2 id="how-it-works-heading" className="rw-section-title">
        How it works
      </h2>
      <p className="mt-2 max-w-2xl font-sans text-body text-ink-secondary">
        Same four steps in every country we support. Tax modules come later. The payout path does
        not change.
      </p>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <li key={step.n} className="rounded-card border border-border bg-card p-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light font-display text-[13px] font-semibold text-primary-text">
              {step.n}
            </span>
            <h3 className="mt-4 font-display text-card text-ink">{step.title}</h3>
            <p className="mt-2 font-sans text-[14px] leading-relaxed text-ink-secondary">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ComparisonTable() {
  const rows: { feature: string; values: string[] }[] = [
    {
      feature: "Invoice without a company",
      values: ["Yes", "Yes (FI)", "Yes (FI)", "No", "No"],
    },
    {
      feature: "Headline take rate",
      values: ["8.5%", "8% (5% + 3% Turva)", "6.5% (4% + 2.5%)", "Tools from $49/contractor/mo", "10% freelancer + 5% client"],
    },
    {
      feature: "Invoice creation",
      values: ["Free", "Free", "Free", "Paid plan", "Job must exist first"],
    },
    {
      feature: "Standard payout",
      values: ["24h, free", "After client pays", "24h, free", "Varies", "After client pays, minus fees"],
    },
    {
      feature: "Instant payout",
      values: ["1%, min $5", "€15 flat", "Not the default", "Add-on", "No"],
    },
    {
      feature: "Work insurance on the invoice",
      values: ["Shield 2.5%", "Turva 3%", "2.5%", "Not bundled this way", "No"],
    },
    {
      feature: "Company contractor OS",
      values: ["Free forever", "Paid extras", "Free tool", "Paid", "Marketplace only"],
    },
    {
      feature: "Geography (this phase)",
      values: ["USD + EUR, 40+ payout countries", "Finland", "Finland", "Global EOR/contractor", "Global marketplace"],
    },
    {
      feature: "Who files income tax",
      values: ["You, this phase", "Handled in FI", "Handled in FI", "Deel products vary", "You"],
    },
  ];

  const heads = ["RemoteWise", "UKKO.fi", "Laskuttamo", "Deel", "Upwork"];

  return (
    <section className="mt-16" aria-labelledby="compare-heading">
      <h2 id="compare-heading" className="rw-section-title">
        Honest comparison
      </h2>
      <p className="mt-2 max-w-2xl font-sans text-body text-ink-secondary">
        UKKO and Laskuttamo are Finland-native. Deel is contractor infrastructure, not
        light-entrepreneur invoicing. Upwork is a marketplace. We are the premium global invoice
        OS. We are not the cheapest.
      </p>
      <div className="mt-6 overflow-x-auto rounded-card border border-border bg-card">
        <table className="min-w-[860px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-page">
              <th className="px-4 py-3 font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
                Feature
              </th>
              {heads.map((head) => (
                <th
                  key={head}
                  className={`px-4 py-3 font-sans text-small font-medium ${
                    head === "RemoteWise" ? "text-primary-text" : "text-ink"
                  }`}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-b border-border last:border-b-0">
                <th className="px-4 py-3 font-sans text-[13px] font-medium text-ink">{row.feature}</th>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.feature}-${heads[index]}`}
                    className={`px-4 py-3 font-sans text-[13px] leading-relaxed ${
                      index === 0 ? "font-medium text-ink" : "text-ink-secondary"
                    }`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-sans text-small text-ink-muted">
        Competitor figures are public list prices as of 2026. Confirm on their sites before you
        decide. RemoteWise Phase 2 does not withhold tax.
      </p>
    </section>
  );
}

function PricingFaq() {
  const items = [
    {
      q: "Do I need to register a company?",
      a: "No. Light entrepreneur mode lets you invoice as yourself. RemoteWise is the billing entity. You report the payout as income in your country. When you want a business ID, the $49 path is there.",
    },
    {
      q: "When do I get paid?",
      a: "After the client pays, unless you buy invoice financing. Standard payout is 24 hours and free. Lightning Pay is 1% with a $5 minimum.",
    },
    {
      q: "What is RemoteWise Shield?",
      a: "Mandatory cover on invoiced work: accident, liability, and legal-expense. It is 2.5% of the VAT-exclusive amount. Every paid invoice gets a certificate.",
    },
    {
      q: "Who handles tax?",
      a: "You do, in this phase. We do not withhold. Country modules (US 1099, UK, Estonia, India, Philippines) land later without changing this fee model.",
    },
    {
      q: "Why not 4% like Laskuttamo?",
      a: "We chose complete over cheap. Shield, global payouts, and the company OS are in the 8.5%. The middle is where FREE.fi died. We will not sit there.",
    },
    {
      q: "What do companies pay?",
      a: "The contractor tool is free. Growth is $49/month. Scale is $149/month. Paying through RemoteWise adds 1.5% processing on the invoice amount. That 1.5% is not taken from the freelancer.",
    },
  ];

  return (
    <section className="mt-16 mb-8" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="rw-section-title">
        Questions we hear first
      </h2>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="rounded-card border border-border bg-card px-5 py-4"
            open={item.q.startsWith("Do I need")}
          >
            <summary className="cursor-pointer font-display text-card text-ink">{item.q}</summary>
            <p className="mt-3 font-sans text-[14px] leading-relaxed text-ink-secondary">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
