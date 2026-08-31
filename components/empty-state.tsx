import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-empty flex-col items-center px-6 py-[60px] text-center",
        className,
      )}
    >
      <Icon className="h-12 w-12 text-border" strokeWidth={1.25} aria-hidden />
      <h2 className="mt-4 font-display text-[18px] font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <p className="mt-4 max-w-[320px] font-sans text-body text-ink-slate">
        {description}
      </p>
      {actionLabel && onAction ? (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
