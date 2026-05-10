import { Link } from "react-router-dom";
import { ArrowRight, Sparkle } from "@phosphor-icons/react";

export function BetaBanner() {
  return (
    <div className="relative z-50 border-b border-ink-200/70 bg-ink-50 text-ink-700 dark:border-ink-800/70 dark:bg-ink-900 dark:text-ink-300">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-2 lg:px-12">
        <div className="flex min-w-0 items-center gap-2.5 text-[12.5px]">
          <Sparkle size={12} weight="fill" className="shrink-0 text-accent" />
          <span className="truncate">
            <span className="font-mono uppercase tracking-widest text-accent">Beta</span>
            <span className="ml-2 opacity-90">Meridian is in public beta. Data is stored locally; counselor scheduling and pricing are illustrative.</span>
          </span>
        </div>
        <Link
          to="/contact"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink-300 bg-white px-3 py-1 text-[12px] font-medium text-ink-900 transition-all hover:-translate-y-px hover:border-ink-950 dark:border-ink-700 dark:bg-ink-950 dark:text-white dark:hover:border-white"
        >
          Contact us
          <ArrowRight size={11} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
