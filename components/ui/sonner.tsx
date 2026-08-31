"use client";

import * as React from "react";
import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/components/theme/theme-provider";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  const { resolved } = useTheme();
  return (
    <Sonner
      theme={resolved}
      position="top-right"
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "group rounded-[12px] border border-border bg-card font-sans text-[14px] text-ink shadow-none",
          title: "font-medium text-ink",
          description: "text-ink-secondary",
          success: "border-success-light",
          error: "border-danger-light",
        },
      }}
      {...props}
    />
  );
}
