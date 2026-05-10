import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowsClockwise, Briefcase, ChartLineUp, GraduationCap } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { recommendMajors, formatUsd } from "../lib/recommend";

export default function Majors() {
  const profile = useStore((s) => s.profile);
  const isPro = useStore((s) => s.isPro);
  const [active, setActive] = useState<string | null>(null);

  const majors = useMemo(() => (profile ? recommendMajors(profile) : []), [profile]);
  const visible = isPro ? majors : majors.slice(0, 6);
  const activeMajor = majors.find((m) => m.major.id === active) ?? majors[0];

  if (!profile) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h2 className="display text-3xl">Profile required to recommend majors.</h2>
        <Link to="/onboarding" className="mt-6 inline-flex h-11 items-center rounded-full bg-ink-950 px-5 text-white dark:bg-white dark:text-ink-950">
          Start onboarding
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 lg:px-12 lg:py-14 max-w-[1400px] mx-auto pb-32 lg:pb-20">
      <div className="mb-10">
        <div className="text-[11px] font-mono uppercase tracking-widest text-accent">Major Explorer</div>
        <h1 className="display mt-2 text-4xl md:text-5xl">Fit-scored majors across {majors.length} disciplines.</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500 dark:text-ink-400">
          Cross-referenced with your interests, classes you're already taking, and the shape of your extracurricular portfolio. Click any major for minor pairings, growth outlook, and starting-salary medians.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Major list */}
        <div className="lg:col-span-5 rounded-3xl border border-ink-200/70 dark:border-ink-800/70 overflow-hidden">
          {visible.map((m, i) => {
            const isActive = activeMajor.major.id === m.major.id;
            return (
              <motion.button
                key={m.major.id}
                layout
                onClick={() => setActive(m.major.id)}
                className={`flex w-full items-center justify-between border-b border-ink-200/70 px-6 py-4 text-left transition-colors last:border-b-0 dark:border-ink-800/70 ${
                  isActive ? "bg-ink-50 dark:bg-ink-900" : "hover:bg-ink-50/60 dark:hover:bg-ink-900/40"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-mono text-[12px] tabular-nums text-ink-400 w-6">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <div className="truncate font-display text-[16px] font-bold tracking-extra-tight">{m.major.name}</div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-ink-500">{m.major.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden md:block h-1 w-16 rounded-full bg-ink-100 dark:bg-ink-800">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${m.fit}%` }} />
                  </div>
                  <span className="font-mono text-[15px] tabular-nums font-medium">{m.fit}</span>
                </div>
              </motion.button>
            );
          })}
          {!isPro && majors.length > visible.length && (
            <div className="border-t border-ink-200/70 bg-ink-50 px-6 py-5 text-center dark:border-ink-800/70 dark:bg-ink-900">
              <p className="text-[13px] text-ink-500">{majors.length - visible.length} more majors hidden on Free.</p>
              <Link to="/pricing" className="mt-2 inline-flex h-9 items-center rounded-full bg-ink-950 px-4 text-[12.5px] font-medium text-white dark:bg-white dark:text-ink-950">
                Unlock with Pro
              </Link>
            </div>
          )}
        </div>

        {/* Major detail */}
        <motion.div
          layout
          key={activeMajor.major.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 22 }}
          className="lg:col-span-7 rounded-3xl border border-ink-200/70 bg-white p-8 dark:border-ink-800/70 dark:bg-ink-900"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-ink-500">{activeMajor.major.category}</div>
              <h2 className="display mt-2 text-3xl md:text-4xl">{activeMajor.major.name}</h2>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-500">Fit</div>
              <div className="font-display text-5xl font-extrabold tabular-nums tracking-extra-tight text-accent">{activeMajor.fit}</div>
            </div>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-ink-700 dark:text-ink-300">{activeMajor.major.description}</p>

          <div className="mt-7 grid grid-cols-3 gap-6 border-t border-ink-200/70 pt-6 dark:border-ink-800/70">
            <Detail icon={Briefcase} label="Median start" value={formatUsd(activeMajor.major.medianStartingSalary)} />
            <Detail icon={ChartLineUp} label="Outlook" value={activeMajor.major.growthOutlook} />
            <Detail icon={GraduationCap} label="Strong classes" value={activeMajor.major.relatedClasses.length.toString()} />
          </div>

          {activeMajor.reasons.length > 0 && (
            <div className="mt-7">
              <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">Why this fits you</div>
              <ul className="mt-3 space-y-2">
                {activeMajor.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-ink-700 dark:text-ink-300">
                    <ArrowsClockwise size={14} weight="duotone" className="mt-0.5 shrink-0 text-accent" />{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-7 border-t border-ink-200/70 pt-6 dark:border-ink-800/70">
            <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">Pairs well with</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {activeMajor.major.pairsWellWith.map((p) => (
                <span key={p} className="rounded-full border border-ink-200 px-2.5 py-0.5 text-[12px] text-ink-700 dark:border-ink-800 dark:text-ink-300">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; weight?: "duotone" | "regular" | "bold" | "fill" }>; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-ink-500">
        <Icon size={11} weight="duotone" /> {label}
      </div>
      <div className="mt-1.5 font-mono text-[18px] tabular-nums font-medium">{value}</div>
    </div>
  );
}
