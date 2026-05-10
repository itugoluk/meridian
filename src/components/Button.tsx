import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-ink-950 text-white hover:bg-ink-900 dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100 active:scale-[0.98]",
  secondary:
    "bg-ink-100 text-ink-900 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-100 dark:hover:bg-ink-700 active:scale-[0.98]",
  ghost:
    "text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-900 active:scale-[0.98]",
  outline:
    "border border-ink-200 dark:border-ink-800 text-ink-900 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-900 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-[15px] gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", size = "md", ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium tracking-tight transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 dark:focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-ink-950",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    />
  );
});
