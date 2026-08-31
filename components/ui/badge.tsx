import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const badgeStyles: Record<string, string> = {
  active: "bg-primary-light text-primary-text",
  invited: "bg-primary-light text-primary-text",
  signed: "bg-primary-light text-primary-text",
  paid: "bg-success-light text-success-text",
  connected: "bg-success-light text-success-text",
  pending: "bg-warning-light text-warning-text",
  overdue: "bg-danger-light text-danger-text",
  draft: "bg-page text-ink-secondary",
  inactive: "bg-page text-ink-secondary",
  cancelled: "bg-[#F1F5F9] text-ink-slate",
  expired: "bg-[#F1F5F9] text-ink-slate",
  sent: "bg-warning-light text-warning-text",
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
