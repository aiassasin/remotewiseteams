import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-sans text-[14px] font-semibold transition-[transform,opacity,border-color,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-70 focus-visible:outline-none focus-visible:shadow-focus",
  {
    variants: {
      variant: {
        primary: "rw-cta hover:-translate-y-px active:translate-y-0",
        soft: "rw-cta-soft hover:-translate-y-px active:translate-y-0",
        softHoverNavy: "rw-cta-soft rw-cta-soft-navy hover:-translate-y-px active:translate-y-0",
        softHoverOrange: "rw-cta-soft rw-cta-soft-orange hover:-translate-y-px active:translate-y-0",
        gold: "rw-cta-gold hover:-translate-y-px active:translate-y-0",
        secondary:
          "border border-border bg-card text-ink hover:border-primary hover:text-primary hover:-translate-y-px active:translate-y-0",
        ghost: "bg-transparent text-ink-secondary hover:bg-page hover:text-primary",
        attention:
          "bg-warning text-white hover:bg-[#c2410c] hover:-translate-y-px active:translate-y-0",
        danger:
          "bg-danger text-white hover:bg-[#b91c1c] hover:-translate-y-px active:translate-y-0",
        text: "bg-transparent px-0 font-medium text-primary shadow-none hover:text-primary-hover",
      },
      size: {
        default: "px-[18px] py-[10px]",
        sm: "px-3.5 py-2 text-[13px]",
        lg: "px-6 py-3",
        icon: "h-9 w-9 p-0",
        full: "w-full px-[18px] py-[10px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || loading}
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
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
