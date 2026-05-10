import { useEffect, useState } from "react";
import { X, Sparkle } from "@phosphor-icons/react";

const KEY = "meridian:beta-dismissed";

export function BetaBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {}
  }, []);

  if (!visible) return null;

  return (
    <div className="relative z-50 border-b border-ink-200/70 bg-ink-950 text-white dark:border-ink-800/70 dark:bg-white dark:text-ink-950">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-2 lg:px-12">
        <div className="flex min-w-0 items-center gap-2.5 text-[12.5px]">
          <Sparkle size={13} weight="fill" className="shrink-0 text-accent" />
          <span className="truncate">
            <span className="font-mono uppercase tracking-widest text-accent">Beta</span>
            <span className="ml-2 opacity-80">Meridian is in public beta. Data is stored locally in your browser; counselor scheduling is simulated. Pricing is illustrative.</span>
          </span>
        </div>
        <button
          onClick={() => { try { localStorage.setItem(KEY, "1"); } catch {} ; setVisible(false); }}
          aria-label="Dismiss beta banner"
          className="shrink-0 rounded-full p-1.5 opacity-70 transition-opacity hover:opacity-100"
        >
          <X size={13} weight="bold" />
        </button>
      </div>
    </div>
  );
}
