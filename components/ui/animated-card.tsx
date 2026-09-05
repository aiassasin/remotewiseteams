"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedCardProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  className?: string;
  children?: ReactNode;
};

/**
 * Card with a spring lift and navy shadow on hover.
 */
export function AnimatedCard({ className, children, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      className={cn(className)}
      whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(11, 26, 51, 0.14)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
