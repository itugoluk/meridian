import { Lock } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export function ProLock({ title, description }: { title: string; description?: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-ink-200/70 dark:border-ink-800/70 bg-white dark:bg-ink-900 p-10">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink-950 text-white dark:bg-white dark:text-ink-950">
          <Lock size={18} weight="bold" />
        </div>
        <div className="flex-1">
          <div className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft/40 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-accent dark:bg-accent/10">
            Pro feature
          </div>
          <h3 className="font-display text-2xl font-bold tracking-extra-tight">{title}</h3>
          {description && <p className="mt-2 max-w-prose text-[15px] text-ink-500 dark:text-ink-400">{description}</p>}
          <Link
            to="/pricing"
            className="mt-5 inline-flex h-10 items-center rounded-full bg-ink-950 px-4 text-sm font-medium text-white transition-transform hover:-translate-y-px active:scale-[0.98] dark:bg-white dark:text-ink-950"
          >
            See pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
