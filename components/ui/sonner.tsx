"use client";

import * as React from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-right"
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "group rounded-[12px] border border-[#E2E8F0] bg-white font-sans text-[14px] text-[#0F172A] shadow-none",
          title: "font-medium text-[#0F172A]",
          description: "text-[#475569]",
          success: "border-[#ECFDF5]",
          error: "border-[#FFF1F2]",
        },
      }}
      {...props}
    />
  );
}
