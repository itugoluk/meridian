import { type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article";
  variant?: "plain" | "subtle" | "inset";
  pad?: "none" | "sm" | "md" | "lg";
};

const variants = {
  plain: "bg-white dark:bg-ink-950 border border-ink-200/70 dark:border-ink-800/70",
  subtle: "bg-ink-50 dark:bg-ink-900/40 border border-ink-200/60 dark:border-ink-800/60",
  inset: "bg-white dark:bg-ink-900",
};

const pads = {
  none: "p-0",
  sm: "p-5",
  md: "p-7",
  lg: "p-10",
};

export function Surface({ as: As = "div", variant = "plain", pad = "md", className, ...rest }: Props) {
  return (
    <As
      className={cn("rounded-3xl", variants[variant], pads[pad], className)}
      {...rest}
    />
  );
}
