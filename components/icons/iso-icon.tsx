"use client";

import { useId } from "react";

export const ISO_ICON_NAMES = [
  "overview",
  "freelancers",
  "invoices",
  "contracts",
  "standups",
  "settings",
  "invite",
  "send-contract",
  "export-csv",
  "payouts",
  "shield",
  "clock",
  "globe",
  "support",
  "tip",
  "promise",
  "create-invoice",
  "client-pay",
  "coverage",
  "choose-payout",
  "help",
  "checklist",
  "nda",
  "msa",
  "sow",
  "ica",
  "scratch",
] as const;

export type IsoIconName = (typeof ISO_ICON_NAMES)[number];

const PALETTES: Record<IsoIconName, { a: string; b: string; c: string }> = {
  overview: { a: "#0B1A33", b: "#2563EB", c: "#06B6D4" },
  freelancers: { a: "#2563EB", b: "#06B6D4", c: "#10B981" },
  invoices: { a: "#10B981", b: "#06B6D4", c: "#2563EB" },
  contracts: { a: "#2563EB", b: "#0B1A33", c: "#818CF8" },
  standups: { a: "#06B6D4", b: "#2563EB", c: "#0B1A33" },
  settings: { a: "#64748B", b: "#2563EB", c: "#06B6D4" },
  invite: { a: "#0B1A33", b: "#10B981", c: "#06B6D4" },
  "send-contract": { a: "#2563EB", b: "#06B6D4", c: "#10B981" },
  "export-csv": { a: "#0EA5E9", b: "#2563EB", c: "#10B981" },
  payouts: { a: "#10B981", b: "#059669", c: "#06B6D4" },
  shield: { a: "#10B981", b: "#2563EB", c: "#06B6D4" },
  clock: { a: "#06B6D4", b: "#2563EB", c: "#10B981" },
  globe: { a: "#2563EB", b: "#06B6D4", c: "#0B1A33" },
  support: { a: "#0B1A33", b: "#2563EB", c: "#10B981" },
  tip: { a: "#F59E0B", b: "#2563EB", c: "#06B6D4" },
  promise: { a: "#10B981", b: "#059669", c: "#2563EB" },
  "create-invoice": { a: "#2563EB", b: "#06B6D4", c: "#10B981" },
  "client-pay": { a: "#10B981", b: "#06B6D4", c: "#2563EB" },
  coverage: { a: "#0B1A33", b: "#10B981", c: "#2563EB" },
  "choose-payout": { a: "#06B6D4", b: "#10B981", c: "#2563EB" },
  help: { a: "#2563EB", b: "#0B1A33", c: "#06B6D4" },
  checklist: { a: "#10B981", b: "#2563EB", c: "#06B6D4" },
  nda: { a: "#10B981", b: "#2563EB", c: "#06B6D4" },
  msa: { a: "#2563EB", b: "#0B1A33", c: "#818CF8" },
  sow: { a: "#06B6D4", b: "#2563EB", c: "#10B981" },
  ica: { a: "#2563EB", b: "#06B6D4", c: "#10B981" },
  scratch: { a: "#F59E0B", b: "#2563EB", c: "#06B6D4" },
};

export function IsoIcon({
  name,
  size = 28,
  title,
}: {
  name: IsoIconName;
  size?: number;
  title?: string;
}) {
  const rawId = useId().replaceAll(":", "");
  const palette = PALETTES[name];
  const gid = `${rawId}-${name}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={`${gid}-top`} x1="8" y1="8" x2="40" y2="20">
          <stop stopColor={palette.a} />
          <stop offset="1" stopColor={palette.b} />
        </linearGradient>
        <linearGradient id={`${gid}-left`} x1="8" y1="18" x2="24" y2="44">
          <stop stopColor={palette.b} />
          <stop offset="1" stopColor={palette.c} />
        </linearGradient>
        <linearGradient id={`${gid}-right`} x1="24" y1="18" x2="40" y2="44">
          <stop stopColor={palette.c} />
          <stop offset="1" stopColor={palette.a} />
        </linearGradient>
        <filter id={`${gid}-shadow`} x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.2" floodColor={palette.a} floodOpacity="0.28" />
        </filter>
      </defs>
      <g filter={`url(#${gid}-shadow)`}>
        <path d="M24 6L42 16V32L24 42L6 32V16L24 6Z" fill={`url(#${gid}-top)`} />
        <path d="M24 22L42 16V32L24 42V22Z" fill={`url(#${gid}-right)`} opacity="0.92" />
        <path d="M24 22L6 16V32L24 42V22Z" fill={`url(#${gid}-left)`} opacity="0.88" />
        <path d="M24 6L42 16L24 22L6 16L24 6Z" fill="white" opacity="0.22" />
        <Glyph name={name} />
      </g>
    </svg>
  );
}

function Glyph({ name }: { name: IsoIconName }) {
  switch (name) {
    case "overview":
      return (
        <g fill="white" opacity="0.95">
          <rect x="16" y="18" width="4" height="10" rx="1" />
          <rect x="22" y="15" width="4" height="13" rx="1" />
          <rect x="28" y="20" width="4" height="8" rx="1" />
        </g>
      );
    case "freelancers":
    case "invite":
    case "ica":
      return (
        <g fill="white">
          <circle cx="24" cy="18" r="3.2" />
          <path d="M17 30c1.2-4 4-6 7-6s5.8 2 7 6" />
        </g>
      );
    case "invoices":
      return (
        <g stroke="white" strokeWidth="1.8" fill="none">
          <rect x="17" y="14" width="14" height="18" rx="2" />
          <path d="M20 19h8M20 23h8M20 27h5" />
        </g>
      );
    case "contracts":
    case "send-contract":
    case "msa":
      return (
        <g stroke="white" strokeWidth="1.8" fill="none">
          <path d="M18 15h9l5 5v13H18V15Z" />
          <path d="M27 15v5h5" />
        </g>
      );
    case "standups":
      return (
        <g fill="white">
          <rect x="15" y="17" width="18" height="12" rx="2" />
          <path d="M22 29h4l2 4h-8l2-4Z" />
        </g>
      );
    case "settings":
      return (
        <g stroke="white" strokeWidth="1.8" fill="none">
          <circle cx="24" cy="24" r="4" />
          <path d="M24 14v3M24 31v3M14 24h3M31 24h3M17 17l2 2M29 29l2 2M17 31l2-2M29 19l2-2" />
        </g>
      );
    case "export-csv":
      return (
        <g stroke="white" strokeWidth="1.8" fill="none">
          <path d="M24 14v14" />
          <path d="M18 22l6 6 6-6" />
          <path d="M16 32h16" />
        </g>
      );
    case "payouts":
    case "choose-payout":
      return (
        <g fill="white">
          <circle cx="24" cy="23" r="8" opacity="0.25" />
          <text x="24" y="27" textAnchor="middle" fontSize="11" fontWeight="700">
            $
          </text>
        </g>
      );
    case "shield":
    case "coverage":
    case "promise":
    case "nda":
      return (
        <g stroke="white" strokeWidth="1.8" fill="none">
          <path d="M24 14l10 4v8c0 6-4.5 10-10 12-5.5-2-10-6-10-12v-8l10-4Z" />
        </g>
      );
    case "clock":
      return (
        <g stroke="white" strokeWidth="1.8" fill="none">
          <circle cx="24" cy="24" r="8" />
          <path d="M24 20v5l3 2" />
        </g>
      );
    case "globe":
      return (
        <g stroke="white" strokeWidth="1.8" fill="none">
          <circle cx="24" cy="24" r="8" />
          <path d="M16 24h16M24 16c2.5 2.8 2.5 13.2 0 16M24 16c-2.5 2.8-2.5 13.2 0 16" />
        </g>
      );
    case "support":
    case "help":
      return (
        <g stroke="white" strokeWidth="1.8" fill="none">
          <circle cx="24" cy="24" r="8" />
          <path d="M21 21c0-2 1.4-3.2 3-3.2 1.6 0 3 1 3 2.8 0 2-3 2.2-3 4" />
          <circle cx="24" cy="29" r="0.8" fill="white" />
        </g>
      );
    case "tip":
      return (
        <g stroke="white" strokeWidth="1.8" fill="none">
          <path d="M24 14c4 0 7 3 7 7 0 2.6-1.4 4.2-3 5.4V29h-8v-2.6C18.4 25.2 17 23.6 17 21c0-4 3-7 7-7Z" />
          <path d="M21 32h6" />
        </g>
      );
    case "create-invoice":
    case "scratch":
      return (
        <g stroke="white" strokeWidth="1.8" fill="none">
          <rect x="17" y="14" width="14" height="18" rx="2" />
          <path d="M24 20v8M20 24h8" />
        </g>
      );
    case "client-pay":
      return (
        <g stroke="white" strokeWidth="1.8" fill="none">
          <rect x="15" y="18" width="18" height="12" rx="2" />
          <path d="M15 22h18" />
        </g>
      );
    case "checklist":
    case "sow":
      return (
        <g stroke="white" strokeWidth="1.8" fill="none">
          <rect x="16" y="14" width="16" height="20" rx="2" />
          <path d="M20 22l2 2 5-5" />
        </g>
      );
    default:
      return null;
  }
}
