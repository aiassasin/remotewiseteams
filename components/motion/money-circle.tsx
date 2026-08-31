"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

const DURATION_MS = 800;

export function MoneyCircle({
  keep,
  fees,
  label,
  formattedKeep,
  size = 168,
  className,
}: {
  keep: number;
  fees: number;
  label: string;
  formattedKeep: string;
  size?: number;
  className?: string;
}) {
  const gid = useId().replaceAll(":", "");
  const total = Math.max(keep + fees, 0.01);
  const keepRatio = Math.min(Math.max(keep / total, 0), 1);
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - (1 - t) ** 3;
      setProgress(eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [keep, fees, formattedKeep]);

  const keepLen = circ * keepRatio * progress;
  const feeLen = circ * (1 - keepRatio) * progress;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 128 128" className="-rotate-90">
          <defs>
            <linearGradient id={`${gid}-green`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#10B981" />
              <stop offset="1" stopColor="#34D399" />
            </linearGradient>
            <linearGradient id={`${gid}-violet`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#6D28D9" />
              <stop offset="1" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
          <circle cx="64" cy="64" r={radius} stroke="rgb(var(--rw-border))" strokeWidth="10" fill="none" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={`url(#${gid}-green)`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${keepLen} ${circ}`}
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={`url(#${gid}-violet)`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${feeLen} ${circ}`}
            strokeDashoffset={-keepLen}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.08em] text-ink-muted">
            {label}
          </p>
          <p className="mt-1 font-display text-[18px] font-semibold leading-tight text-ink" aria-live="polite">
            {formattedKeep}
          </p>
        </div>
      </div>
      <p className="mt-2 font-sans text-small text-ink-muted">
        <span className="text-success">Green</span> you keep · <span className="text-violet">Violet</span> fees
      </p>
    </div>
  );
}
