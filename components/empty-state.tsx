"use client";

import Link from "next/link";
import { IsoIcon, type IsoIconName } from "@/components/icons/iso-icon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: {
  icon: IsoIconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-empty flex-col items-center px-6 py-[60px] text-center",
        className,
      )}
    >
      <IsoIcon name={icon} size={72} title={title} />
      <h2 className="mt-5 font-display text-[18px] font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <p className="mt-3 max-w-[320px] text-sm text-[#374151] dark:text-[#F3F4F6]">{description}</p>
      {actionLabel && actionHref ? (
        <Button className="mt-5" asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
