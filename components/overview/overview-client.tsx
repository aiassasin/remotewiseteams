"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { IsoIcon, type IsoIconName } from "@/components/icons/iso-icon";
import { EmptyState } from "@/components/empty-state";
import { useAppLanguage, useFormat, useT, type TranslateFn } from "@/components/i18n/language-provider";
import { localeTag } from "@/lib/format";
import { statusMessageKey } from "@/lib/i18n";
import type { OverviewData } from "@/lib/overview";
import { cn } from "@/lib/utils";

const PIE_COLORS = ["#059669", "#2563EB", "#0B1A33", "#EA580C", "#64748B", "#DC2626"];

const CHECK_KEYS = ["invite", "contract", "invoice", "payout"] as const;

type CheckKey = (typeof CHECK_KEYS)[number];

type MetricCard = {
  label: string;
  value: number;
  icon: IsoIconName;
  money?: boolean;
};

type ActivityItem = OverviewData["activity"][number];

export function OverviewClient({ data, error }: { data: OverviewData | null; error?: string | null }) {
  const t = useT();
  const { language } = useAppLanguage();
  const format = useFormat();

  if (error) {
    return (
      <PageTransition>
        <div className="rw-overview">
          <PageHeader title={t("overview.title")} />
          <div className="rw-overview-card rw-overview-panel">
            <EmptyState icon="overview" title={t("overview.loadError")} description={error} />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!data) {
    return (
      <PageTransition>
        <div className="rw-overview grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rw-overview-card h-28 animate-pulse" />
          ))}
        </div>
      </PageTransition>
    );
  }

  const done = CHECK_KEYS.filter((key) => data.checklist[key]).length;
  const progress = Math.round((done / CHECK_KEYS.length) * 100);

  const monthly = data.monthly.map((row) => ({
    ...row,
    month: formatMonthLabel(row.month, language),
  }));

  const statusSlices = data.statusSlices.map((slice) => {
    const key = statusMessageKey(slice.name);
    return { ...slice, name: key ? t(key) : slice.name };
  });

  const checkSteps = [
    { key: "invite" as const, label: t("overview.checkInvite") },
    { key: "contract" as const, label: t("overview.checkContract") },
    { key: "invoice" as const, label: t("overview.checkInvoice") },
    { key: "payout" as const, label: t("overview.checkPayout") },
  ];

  const metrics: MetricCard[] = [
    { label: t("overview.activeFreelancers"), value: data.freelancerCount, icon: "freelancers" },
    { label: t("overview.pendingInvoices"), value: data.pendingInvoices, icon: "invoices" },
    { label: t("overview.paidThisMonth"), value: data.paidThisMonth, icon: "payouts", money: true },
    { label: t("overview.contractsSigned"), value: data.contractsSigned, icon: "contracts" },
  ];

  const actions: { href: string; label: string; icon: IsoIconName }[] = [
    { href: "/dashboard/contracts/new", label: t("overview.sendContract"), icon: "send-contract" },
    { href: "/dashboard/freelancers", label: t("overview.inviteFreelancer"), icon: "invite" },
    { href: "/dashboard/invoices", label: t("overview.reviewInvoices"), icon: "invoices" },
    { href: "/dashboard/help", label: t("overview.help"), icon: "help" },
  ];

  return (
    <PageTransition>
      <div className="rw-overview">
        <header className="rw-overview-hero">
          <PageHeader
            className="mb-0"
            title={t("overview.title")}
            description={t("overview.description")}
            actionsClassName="w-full sm:w-auto"
            actions={
              <>
                <Button asChild variant="gold" className="min-h-11 w-full sm:w-auto">
                  <Link href="/dashboard/contracts/new" className="inline-flex items-center justify-center gap-2">
                    <IsoIcon name="send-contract" size={22} />
                    {t("overview.sendContract")}
                  </Link>
                </Button>
                <Button asChild variant="softHoverOrange" className="min-h-11 w-full sm:w-auto">
                  <Link href="/dashboard/freelancers" className="inline-flex items-center justify-center gap-2">
                    <IsoIcon name="invite" size={22} />
                    {t("overview.inviteFreelancer")}
                  </Link>
                </Button>
              </>
            }
          />
        </header>

        <OnboardingCard
          progress={progress}
          steps={checkSteps}
          checklist={data.checklist}
          t={t}
        />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <OverviewMetric
              key={`${metric.label}-${language}`}
              metric={metric}
              formatMoney={(amount) => format.moneyExact(amount, "EUR")}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <section className="rw-overview-card rw-overview-panel">
            <h2 className="font-display text-card">{t("overview.monthlyPayouts")}</h2>
            {monthly.every((row) => row.amount === 0) ? (
              <EmptyState
                icon="payouts"
                title={t("overview.noPayoutsTitle")}
                description={t("overview.noPayoutsBody")}
                className="py-10"
              />
            ) : (
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly}>
                    <XAxis dataKey="month" stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
          <section className="rw-overview-card rw-overview-panel">
            <h2 className="font-display text-card">{t("overview.invoiceStatus")}</h2>
            {statusSlices.length === 0 ? (
              <EmptyState
                icon="invoices"
                title={t("overview.noInvoicesTitle")}
                description={t("overview.noInvoicesBody")}
                className="py-10"
              />
            ) : (
              <div className="mt-4 flex h-56 flex-col gap-3 sm:flex-row sm:items-center">
                <div className="h-44 min-w-0 flex-1 sm:h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusSlices} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72}>
                        {statusSlices.map((slice, index) => (
                          <Cell key={slice.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="shrink-0 space-y-1.5 sm:w-36">
                  {statusSlices.map((slice, index) => (
                    <li key={slice.name} className="flex items-center gap-2 font-sans text-[13px] text-[#374151]">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        aria-hidden
                      />
                      <span className="truncate">{slice.name}</span>
                      <span className="ml-auto tabular-nums text-[#4B5563]">{slice.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="rw-overview-card rw-overview-panel">
            <h2 className="font-display text-card">{t("overview.activity")}</h2>
            {data.activity.length === 0 ? (
              <p className="mt-3 text-sm text-[#374151] dark:text-[#F3F4F6]">{t("overview.activityEmpty")}</p>
            ) : (
              <ul className="mt-4">
                {data.activity.map((item) => (
                  <OverviewActivityRow key={item.id} item={item} t={t} dateLabel={format.date(item.createdAt)} />
                ))}
              </ul>
            )}
          </section>
          <section className="rw-overview-card rw-overview-panel">
            <h2 className="font-display text-card">{t("overview.quickActions")}</h2>
            <ul className="mt-3 space-y-0.5">
              {actions.map((action) => (
                <li key={action.href}>
                  <Link href={action.href} className="rw-overview-action">
                    <IsoIcon name={action.icon} size={28} />
                    <span className="font-sans text-[14px] font-medium text-[#374151] dark:text-[#F3F4F6]">{action.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

function OnboardingCard({
  progress,
  steps,
  checklist,
  t,
}: {
  progress: number;
  steps: { key: CheckKey; label: string }[];
  checklist: OverviewData["checklist"];
  t: TranslateFn;
}) {
  return (
    <section
      className={cn("rw-overview-onboarding border-l-4 border-royal-yellow")}
      aria-labelledby="overview-onboarding-title"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <IsoIcon name="checklist" size={40} title={t("overview.getStarted")} />
          <div>
            <h2 id="overview-onboarding-title" className="font-display text-card text-white">
              {t("overview.firstPayoutTitle")}
            </h2>
            <p className="mt-0.5 font-sans text-small text-white/80">{t("overview.firstPayoutHint")}</p>
          </div>
        </div>
        <p className="shrink-0 font-sans text-small font-medium text-deep-navy dark:text-white" aria-hidden>
          {progress}%
        </p>
      </div>
      <div
        className="mt-4 h-2 overflow-hidden rounded-pill bg-deep-navy dark:bg-gray-700"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label={t("overview.onboardingProgress", { percent: progress })}
      >
        <div className="h-full bg-royal-yellow transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <motion.div
        className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        role="list"
      >
        {steps.map((step) => {
          const complete = checklist[step.key];
          return (
            <motion.div
              key={step.key}
              className={cn("rw-overview-step", complete && "is-done text-royal-yellow")}
              role="listitem"
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <span
                className={cn(
                  "rw-overview-step-mark",
                  complete
                    ? "border-royal-yellow bg-royal-yellow text-[#0B1A33]"
                    : "border-muted-gray text-muted-gray",
                )}
                aria-hidden
              >
                {complete ? "✓" : ""}
              </span>
              <span>
                <span className="sr-only">{complete ? t("overview.stepDone") : t("overview.stepTodo")}. </span>
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

function OverviewMetric({
  metric,
  formatMoney,
}: {
  metric: MetricCard;
  formatMoney: (amount: number) => string;
}) {
  return (
    <AnimatedCard className="rw-overview-card rw-overview-metric">
      <div className="flex items-start justify-between gap-3">
        <p className="rw-overview-metric-label text-muted-gray dark:text-gray-300">{metric.label}</p>
        <IsoIcon name={metric.icon} size={28} />
      </div>
      <p className="rw-overview-metric-value text-deep-navy dark:text-white">
        <MetricCount value={metric.value} money={metric.money} formatMoney={formatMoney} />
      </p>
    </AnimatedCard>
  );
}

/**
 * Spring-animated metric figure. Hooks live here so the metric map stays hook-free.
 * Money strings use `format.moneyExact`; the numeric part is what the spring drives.
 */
function MetricCount({
  value,
  money,
  formatMoney,
}: {
  value: number;
  money?: boolean;
  formatMoney: (amount: number) => string;
}) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (latest) => {
    const rounded = Math.round(latest);
    return money ? formatMoney(rounded) : String(rounded);
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className="text-2xl font-bold text-deep-navy dark:text-white">
      {display}
    </motion.span>
  );
}

function OverviewActivityRow({
  item,
  t,
  dateLabel,
}: {
  item: ActivityItem;
  t: TranslateFn;
  dateLabel: string;
}) {
  const title =
    item.eventType === "invoice_paid"
      ? t("overview.activityPaid", { ref: item.title.replace(/\s+paid$/i, "") })
      : item.eventType === "invoice_cancelled"
        ? t("overview.activityCancelled", {
            ref: item.title.replace(/\s+was cancelled$/i, ""),
          })
        : item.title;
  const body =
    item.body && item.eventType === "invoice_paid" ? t("overview.activityPaidBody") : item.body;
  const inner = (
    <>
      <p className="font-sans text-[14px] font-medium text-[#0B1A33]">{title}</p>
      {body ? <p className="mt-0.5 font-sans text-small text-[#4B5563]">{body}</p> : null}
      {dateLabel !== "—" ? (
        <p className="mt-1 font-sans text-[12px] text-[#6B7280]">{dateLabel}</p>
      ) : null}
    </>
  );

  return (
    <li className="rw-overview-activity-item">
      {item.href ? (
        <Link href={item.href} className="block rounded-control hover:bg-[#F8F9FA]">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </li>
  );
}

function formatMonthLabel(value: string, language: string) {
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleString(localeTag(language), { month: "short" });
  }
  return value;
}
