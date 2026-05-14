import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "@phosphor-icons/react";
import { SCHOOLS } from "../data/schools";

const ROTATION: { name: string; verdict: "Reach" | "Target" | "Likely"; fit: number; location: string }[] = [
  { name: "Princeton University", verdict: "Reach", fit: 71, location: "Princeton, NJ" },
  { name: "ETH Zürich", verdict: "Target", fit: 84, location: "Zürich, CH" },
  { name: "TU Delft", verdict: "Likely", fit: 91, location: "Delft, NL" },
  { name: "UC Berkeley", verdict: "Target", fit: 78, location: "Berkeley, CA" },
  { name: "NUS", verdict: "Target", fit: 82, location: "Singapore" },
  { name: "Imperial College", verdict: "Target", fit: 76, location: "London, UK" },
];

const verdictTint: Record<string, string> = {
  Reach: "bg-accent/10 text-accent border-accent/30",
  Target: "bg-ink-100 text-ink-900 border-ink-200 dark:bg-ink-800 dark:text-ink-100 dark:border-ink-700",
  Likely: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
};

export const HeroPanel = memo(function HeroPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2400);
    return () => clearInterval(id);
  }, []);

  const visible = [
    ROTATION[tick % ROTATION.length],
    ROTATION[(tick + 1) % ROTATION.length],
    ROTATION[(tick + 2) % ROTATION.length],
    ROTATION[(tick + 3) % ROTATION.length],
  ];

  return (
    <div className="relative aspect-[4/5] sm:aspect-[5/4] md:aspect-square overflow-hidden rounded-[2rem] border border-ink-200/70 dark:border-ink-800/70 bg-gradient-to-b from-ink-50 to-white dark:from-ink-900 dark:to-ink-950">
      {/* Background grid */}
      <svg className="absolute inset-0 h-full w-full text-ink-200/60 dark:text-ink-800/60" aria-hidden>
        <defs>
          <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M36 0H0V36" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Floating header chip */}
      <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-ink-200/70 bg-white/90 px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest text-ink-500 backdrop-blur dark:border-ink-800/70 dark:bg-ink-900/90 dark:text-ink-400">
        <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-emerald-500" />
        Live match · {SCHOOLS.length} schools
      </div>

      {/* Stack */}
      <div className="absolute inset-x-6 bottom-6 flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {visible.map((s, idx) => (
            <motion.div
              key={`${s.name}-${tick + idx}`}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: idx === 0 ? 1 : 0.95 - idx * 0.18, y: 0, scale: 1 - idx * 0.02 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 110, damping: 22 }}
              className="flex items-center justify-between gap-3 rounded-2xl border border-ink-200/70 bg-white/95 px-4 py-3 backdrop-blur-xl dark:border-ink-800/70 dark:bg-ink-900/90"
            >
              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold tracking-tight text-ink-900 dark:text-white">{s.name}</div>
                <div className="truncate text-[11px] font-mono uppercase tracking-widest text-ink-500">{s.location}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${verdictTint[s.verdict]}`}>
                  {s.verdict}
                </span>
                <span className="font-mono text-[14px] font-medium tabular-nums text-ink-900 dark:text-white">{s.fit}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top-right insight card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 120, damping: 18 }}
        className="absolute right-6 top-16 max-w-[230px] rounded-2xl border border-ink-200/70 bg-white p-4 shadow-soft dark:border-ink-800/70 dark:bg-ink-900"
      >
        <div className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-accent">
          <Check size={11} weight="bold" /> Portfolio balance
        </div>
        <div className="text-[13px] leading-snug text-ink-900 dark:text-white">
          You're <span className="font-semibold">three reach schools heavy</span> for your GPA tier. Suggest adding 2 likely matches.
        </div>
      </motion.div>
    </div>
  );
});
