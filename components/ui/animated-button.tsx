"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonProps } from "@/components/ui/button";

type AnimatedButtonProps = Omit<
  ButtonProps,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
>;

/**
 * Button with spring hover/tap scale. Styles match shadcn `Button` via `buttonVariants`.
 * `asChild` stays a non-motion Slot so composed links keep working; native submit uses `motion.button`.
 */
const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = cn(buttonVariants({ variant, size }), className);
    const isDisabled = disabled || loading;

    if (asChild) {
      return (
        <Slot className={classes} ref={ref} {...props}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spinner" aria-hidden />
              {children}
            </>
          ) : (
            children
          )}
        </Slot>
      );
    }

    return (
      <motion.button
        className={classes}
        ref={ref}
        disabled={isDisabled}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spinner" aria-hidden />
            {children}
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  },
);
AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
export type { AnimatedButtonProps };
