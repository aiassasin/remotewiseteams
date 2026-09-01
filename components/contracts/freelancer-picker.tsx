"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IsoIcon } from "@/components/icons/iso-icon";
import { Button } from "@/components/ui/button";
import type { Freelancer } from "@/lib/types";

export function FreelancerPicker({
  freelancers,
  value,
  label,
  emptyLabel,
  inviteLabel,
  onChange,
}: {
  freelancers: Freelancer[];
  value: string;
  label: string;
  emptyLabel: string;
  inviteLabel: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = freelancers.find((row) => row.id === value);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  if (!freelancers.length) {
    return (
      <div className="rounded-card border border-dashed border-border bg-page p-4">
        <p className="font-sans text-[14px] text-ink">{emptyLabel}</p>
        <Button asChild size="sm" className="mt-3">
          <Link href="/dashboard/freelancers" id="invite-freelancer">
            {inviteLabel}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={rootRef}>
      <p className="rw-label" id="freelancer-label">
        {label}
      </p>
      <button
        type="button"
        id="freelancer"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="freelancer-label"
        className="rw-input flex items-center gap-3 text-left"
        onClick={() => setOpen((current) => !current)}
      >
        {selected ? (
          <>
            <Avatar name={selected.fullName} url={selected.avatarUrl} />
            <span className="min-w-0">
              <span className="block truncate font-medium text-ink">{selected.fullName}</span>
              <span className="block truncate text-ink-muted">{selected.email}</span>
            </span>
          </>
        ) : (
          <span className="text-ink-muted">{label}</span>
        )}
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-card border border-border bg-card p-1 shadow-lift"
        >
          {freelancers.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                role="option"
                aria-selected={row.id === value}
                className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left hover:bg-page"
                onClick={() => {
                  onChange(row.id);
                  setOpen(false);
                }}
              >
                <Avatar name={row.fullName} url={row.avatarUrl} />
                <span className="min-w-0">
                  <span className="block truncate font-sans text-[14px] font-medium text-ink">{row.fullName}</span>
                  <span className="block truncate font-sans text-[12px] text-ink-muted">{row.email}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Avatar({ name, url }: { name: string; url: string | null }) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light">
      <IsoIcon name="freelancers" size={20} />
      <span className="sr-only">{name}</span>
    </span>
  );
}
