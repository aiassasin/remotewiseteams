import Link from "next/link";
import { cn } from "@/lib/utils";

export function RwLogo({
  href = "/pricing",
  wordmark = true,
  inverted = false,
  className,
}: {
  href?: string;
  wordmark?: boolean;
  inverted?: boolean;
  className?: string;
}) {
  const mark = (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="rw-logo-badge flex h-8 w-8 items-center justify-center rounded-control font-display text-[12px] font-semibold text-white shadow-cta">
        RW
      </span>
      {wordmark ? (
        <span
          className={cn(
            "font-display text-[16px] font-semibold tracking-tight",
            inverted ? "text-white" : "text-ink",
          )}
        >
          RemoteWise
        </span>
      ) : null}
    </span>
  );

  if (!href) return mark;
  return (
    <Link href={href} className="inline-flex">
      {mark}
    </Link>
  );
}
