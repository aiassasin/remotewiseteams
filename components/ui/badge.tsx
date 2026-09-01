import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const badgeStyles: Record<string, string> = {
  active: "bg-success-light text-success-text",
  approved: "bg-success-light text-success-text",
  invited: "bg-warning-light text-warning-text",
  signed: "bg-success-light text-success-text",
  paid: "bg-success-light text-success-text",
  connected: "bg-success-light text-success-text",
  pending: "bg-warning-light text-warning-text",
  overdue: "bg-danger-light text-danger-text",
  rejected: "bg-danger-light text-danger-text",
  draft: "bg-warning-light text-warning-text",
  inactive: "bg-page text-ink-slate",
  cancelled: "bg-page text-ink-slate",
  expired: "bg-page text-ink-slate",
  sent: "bg-warning-light text-warning-text",
  payout_processing: "bg-warning-light text-warning-text",
  paid_out: "bg-success-light text-success-text",
};

export type BadgeStatus = keyof typeof badgeStyles;

export function Badge({
  status,
  children,
  className,
}: {
  status: BadgeStatus | string;
  children: ReactNode;
  className?: string;
}) {
  const label =
    typeof children === "string"
      ? children.charAt(0).toUpperCase() + children.slice(1)
      : children;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-[10px] py-[3px] font-sans text-small font-medium",
        badgeStyles[status] ?? badgeStyles.draft,
        className,
      )}
    >
      {label}
    </span>
  );
}
