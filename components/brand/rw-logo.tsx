import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND_NAME } from "@/lib/brand";

/**
 * Gold-on-navy seal: a paid, signed contract. Used as the RemoteWise mark.
 */
export function RwMark({
  size = 32,
  className,
  inverted = false,
}: {
  size?: number;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="8" fill={inverted ? "#152A4A" : "#0B1A33"} />
      {inverted ? (
        <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="7.25" stroke="#FADA5E" strokeWidth="1.5" fill="none" />
      ) : null}
      <circle cx="16" cy="16.2" r="9.4" fill="#FADA5E" />
      <path
        d="M11.1 16.35 14.35 19.5 21.15 12.7"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * RemoteWise wordmark. The brand name stays Latin in every language, including Arabic.
 */
export function RwLogo({
  href = "/pricing",
  wordmark = true,
  inverted = false,
  className,
  size = 32,
}: {
  href?: string;
  wordmark?: boolean;
  inverted?: boolean;
  className?: string;
  size?: number;
}) {
  const mark = (
    <span className={cn("flex items-center gap-2", className)}>
      <span className={cn("inline-flex overflow-hidden rounded-[8px]", !inverted && "shadow-cta")}>
        <RwMark size={size} inverted={inverted} />
      </span>
      {wordmark ? (
        <span
          dir="ltr"
          lang="en"
          className={cn(
            "font-display text-[16px] font-semibold tracking-tight",
            inverted ? "text-white" : "text-ink",
          )}
        >
          {BRAND_NAME}
        </span>
      ) : null}
    </span>
  );

  if (!href) return mark;
  return (
    <Link href={href} className="inline-flex" aria-label={BRAND_NAME}>
      {mark}
    </Link>
  );
}
