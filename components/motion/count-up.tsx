"use client";

import { useEffect, useState } from "react";

export function CountUp({
  value,
  prefix = "",
  className,
}: {
  value: number;
  prefix?: string;
  className?: string;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const duration = 700;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setShown(from + (value - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const display = Number.isInteger(value) ? Math.round(shown).toString() : shown.toFixed(0);
  return (
    <span className={className}>
      {prefix}
      {display}
    </span>
  );
}
