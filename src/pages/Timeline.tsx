import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, CircleDashed, Clock, MapPin } from "@phosphor-icons/react";
import { useStore } from "../store/useStore";
import { buildTimeline } from "../lib/timeline";

const categoryTint: Record<string, string> = {
  Academic: "text-sky-700 bg-sky-50 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-900/40",
  Testing: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-900/40",
  Activities: "text-violet-700 bg-violet-50 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-900/40",
  Application: "text-accent bg-accent-soft/40 border-accent/30 dark:bg-accent/10",
  Finance: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-900/40",
};

export default function Timeline() {
  const profile = useStore((s) => s.profile);
  const timeline = useMemo(() => buildTimeline(profile), [profile]);

  if (!profile) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h2 className="display text-3xl">Tell us your grade and we'll build your timeline.</h2>
        <Link to="/onboarding" className="mt-6 inline-flex h-11 items-center rounded-full bg-ink-950 px-5 text-white dark:bg-white dark:text-ink-950">
          Start onboarding
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 lg:px-12 lg:py-14 max-w-[1400px] mx-auto pb-32 lg:pb-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-accent">Timeline</div>
          <h1 className="display mt-2 text-4xl md:text-5xl">Nine phases between freshman and matriculation.</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500 dark:text-ink-400">
            Calibrated to Grade {profile.grade}. Past phases are marked complete. The Active phase has your immediate focus; the rest are scaffolding.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-[12px] font-mono uppercase tracking-widest text-ink-600 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-400">
          <MapPin size={12} weight="duotone" /> {profile.location || "Location not set"}
        </div>
      </div>

      <div className="relative pl-6 md:pl-12">
        {/* Spine */}
        <div className="absolute left-2 md:left-4 top-2 bottom-2 w-px bg-ink-200 dark:bg-ink-800" />
        <div className="space-y-3">
          {timeline.map((phase, idx) => (
            <motion.section
              key={phase.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 110, damping: 22, delay: idx * 0.03 }}
              className="relative"
            >
              {/* Marker */}
              <div className="absolute -left-[18px] md:-left-[27px] top-7 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-ink-100 dark:border-ink-950 dark:bg-ink-800">
                {phase.status === "Past" ? (
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                ) : phase.status === "Active" ? (
                  <span className="h-3 w-3 animate-breathe rounded-full bg-accent" />
                ) : (
                  <CircleDashed size={14} weight="bold" className="text-ink-400" />
                )}
              </div>

              <div className={`rounded-3xl border p-7 transition-colors ${
                phase.status === "Active"
                  ? "border-accent/40 bg-accent-soft/30 dark:bg-accent/5 dark:border-accent/40"
                  : "border-ink-200/70 bg-white dark:border-ink-800/70 dark:bg-ink-900"
              }`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-ink-500">{phase.quarter}</div>
                    <h2 className="font-display mt-1.5 text-2xl font-bold tracking-extra-tight">{phase.title}</h2>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest ${
                    phase.status === "Active" ? "text-accent" : phase.status === "Past" ? "text-emerald-700 dark:text-emerald-400" : "text-ink-500"
                  }`}>
                    <Clock size={12} weight="duotone" /> {phase.status}
                  </div>
                </div>

                <ul className="mt-5 space-y-3">
                  {phase.items.map((it) => (
                    <li key={it.id} className="grid grid-cols-[auto_1fr] items-start gap-3">
                      <span className={`mt-0.5 inline-flex h-6 shrink-0 items-center rounded-full border px-2 text-[10px] font-mono uppercase tracking-widest ${categoryTint[it.category]}`}>
                        {it.category}
                      </span>
                      <div>
                        <div className="text-[14.5px] font-medium text-ink-950 dark:text-white">{it.label}</div>
                        <div className="mt-0.5 text-[13px] text-ink-600 dark:text-ink-400">{it.detail}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
