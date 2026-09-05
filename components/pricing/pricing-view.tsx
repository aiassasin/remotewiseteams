"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FeeCalculator } from "@/components/pricing/fee-calculator";
import { PricingNav } from "@/components/pricing/pricing-nav";
import { WhyRemoteWise } from "@/components/pricing/why-remotewise";
import { SiteFooter } from "@/components/legal/site-footer";
import { useT } from "@/components/i18n/language-provider";
import type { MessageKey } from "@/lib/i18n";
import {
  PLATFORM_TAKE_PERCENT,
  SERVICE_FEE_PERCENT,
  SHIELD_FEE_PERCENT,
} from "@/lib/pricing";

type Audience = "freelancer" | "company";

const TAKE = {
  take: PLATFORM_TAKE_PERCENT,
  service: SERVICE_FEE_PERCENT,
  shield: SHIELD_FEE_PERCENT,
};

export function PricingView() {
  const t = useT();
  const [audience, setAudience] = useState<Audience>("freelancer");

  return (
    <div className="min-h-screen bg-page">
      <PricingNav />

      <main id="main" className="rw-aurora w-full px-6 py-12 sm:py-16 lg:px-10">
        <section className="max-w-3xl">
          <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-primary-text">
            {t("pricing.kicker")}
          </p>
          <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.15] tracking-[-0.6px] text-ink sm:text-[44px]">
            {t("pricing.hero")}
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-[16px] leading-relaxed text-ink-secondary">
            {t("pricing.subhead")}
          </p>
        </section>

        <div
          className="mt-8 inline-flex rounded-control border border-border bg-card p-1"
          role="tablist"
          aria-label={t("pricing.audienceAria")}
        >
          <AudienceTab
            selected={audience === "freelancer"}
            onSelect={() => setAudience("freelancer")}
          >
            {t("pricing.tabFreelancers")}
          </AudienceTab>
          <AudienceTab selected={audience === "company"} onSelect={() => setAudience("company")}>
            {t("pricing.tabCompanies")}
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

        <WhyRemoteWise />
        <PricingFaq />
      </main>

      <SiteFooter />
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
  const t = useT();
  return (
    <section className="mt-8 grid gap-4 lg:grid-cols-3">
      <article className="rounded-card border border-primary bg-card p-6 lg:col-span-2">
        <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-primary-text">
          {t("pricing.lightEntrepreneur")}
        </p>
        <h2 className="mt-2 font-display text-[28px] font-semibold text-ink">
          {t("pricing.allIn", TAKE)}
        </h2>
        <p className="mt-2 font-sans text-body text-ink-secondary">{t("pricing.lightBody", TAKE)}</p>
        <ul className="mt-6 space-y-3 font-sans text-[14px] text-ink">
          <li>{t("pricing.feat1")}</li>
          <li>{t("pricing.feat2")}</li>
          <li>{t("pricing.feat3")}</li>
          <li>{t("pricing.feat4")}</li>
          <li>{t("pricing.feat5")}</li>
        </ul>
        <div className="mt-8">
          <Button asChild>
            <Link href="/signup?role=freelancer">{t("pricing.startInvoicing")}</Link>
          </Button>
        </div>
      </article>
      <article className="rounded-card border border-border bg-card p-6">
        <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
          {t("pricing.whenIncorporate")}
        </p>
        <h2 className="mt-2 font-display text-section text-ink">{t("pricing.businessPath")}</h2>
        <p className="mt-2 font-sans text-body text-ink-secondary">{t("pricing.businessBody")}</p>
        <p className="mt-6 font-sans text-small text-ink-muted">{t("pricing.debtNote")}</p>
      </article>
    </section>
  );
}

const FREE_ITEMS: MessageKey[] = ["pricing.free1", "pricing.free2", "pricing.free3", "pricing.free4"];
const GROWTH_ITEMS: MessageKey[] = [
  "pricing.growth1",
  "pricing.growth2",
  "pricing.growth3",
  "pricing.growth4",
];
const SCALE_ITEMS: MessageKey[] = ["pricing.scale1", "pricing.scale2", "pricing.scale3", "pricing.scale4"];

function CompanyPanel() {
  const t = useT();
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      <PlanCard
        name={t("pricing.planFree")}
        price="$0"
        cadence={t("pricing.forever")}
        pitch={t("pricing.freePitch")}
        cta={t("pricing.freeCta")}
        href="/signup"
        featured
        items={FREE_ITEMS.map((key) => t(key))}
      />
      <PlanCard
        name={t("pricing.planGrowth")}
        price="$49"
        cadence={t("pricing.perMonth")}
        pitch={t("pricing.growthPitch")}
        cta={t("pricing.growthCta")}
        href="/signup"
        items={GROWTH_ITEMS.map((key) => t(key))}
      />
      <PlanCard
        name={t("pricing.planScale")}
        price="$149"
        cadence={t("pricing.perMonth")}
        pitch={t("pricing.scalePitch")}
        cta={t("pricing.scaleCta")}
        href="/signup"
        items={SCALE_ITEMS.map((key) => t(key))}
      />
      <p className="md:col-span-3 font-sans text-small text-ink-secondary">
        {t("pricing.companyProcessingNote", TAKE)}
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
  const t = useT();
  return (
    <article
      className={`flex flex-col rounded-card border bg-card p-6 ${
        featured ? "border-primary" : "border-border"
      }`}
    >
      {featured ? (
        <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-primary-text">
          {t("pricing.startHere")}
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

function PricingFaq() {
  const t = useT();
  const items = [
    { q: t("pricing.faq1q"), a: t("pricing.faq1a"), open: true },
    { q: t("pricing.faq2q"), a: t("pricing.faq2a") },
    { q: t("pricing.faq3q"), a: t("pricing.faq3a", TAKE) },
    { q: t("pricing.faq4q"), a: t("pricing.faq4a") },
    { q: t("pricing.faq5q"), a: t("pricing.faq5a", TAKE) },
    { q: t("pricing.faq6q"), a: t("pricing.faq6a") },
  ];

  return (
    <section className="mt-16 mb-8" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="rw-section-title">
        {t("pricing.faqTitle")}
      </h2>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="rounded-card border border-border bg-card px-5 py-4"
            open={item.open}
          >
            <summary className="cursor-pointer font-display text-card text-ink">{item.q}</summary>
            <p className="mt-3 font-sans text-[14px] leading-relaxed text-ink-secondary">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
