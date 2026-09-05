import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
  actionsClassName,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  actionsClassName?: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="rw-page-title">{title}</h1>
        {description ? (
          <p className="rw-page-lede mt-1 font-sans text-body text-ink-secondary">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className={cn("flex flex-wrap items-center gap-2", actionsClassName)}>{actions}</div>
      ) : null}
    </div>
  );
}
