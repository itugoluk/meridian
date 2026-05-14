import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Calendar, Compass, GraduationCap, PaperPlaneTilt,
  SquaresFour, X, House,
} from "@phosphor-icons/react";
import { useStore } from "../store/useStore";

type Step = {
  kicker: string;
  title: string;
  body: string;
  icon: React.ComponentType<{ size?: number; weight?: "duotone" | "fill" | "bold" | "regular" }>;
};

const STEPS: Step[] = [
  {
    kicker: "Welcome",
    title: "Your application, one workspace.",
    body: "Meridian turns your profile into a balanced college list, a quarter-by-quarter plan, and a place to draft every essay. Here's a 30-second tour.",
    icon: House,
  },
  {
    kicker: "Step 1 — Overview & College Match",
    title: "See your balanced list at a glance.",
    body: "The Overview shows your Reach, Target, and Likely distribution. College Match ranks every school by fit, cost, and admit odds — open any school to see why it landed where it did.",
    icon: SquaresFour,
  },
  {
    kicker: "Step 2 — Majors & Timeline",
    title: "Plan what to study, and when.",
    body: "Majors ranks fields by your interests, growth outlook, and starting salary. Timeline breaks the next 12+ months into clear quarterly milestones so nothing slips.",
    icon: Compass,
  },
  {
    kicker: "Step 3 — Essays & Counselors",
    title: "Write with structure, get human help when needed.",
    body: "Essays takes you from brainstorm to outline to draft with a live word counter. Counselors (Pro) lets you book vetted reviewers with verified admit records.",
    icon: PaperPlaneTilt,
  },
];

export function Tutorial({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [i, setI] = useState(0);
  const setTutorialSeen = useStore((s) => s.setTutorialSeen);

  useEffect(() => {
    if (open) setI(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") setI((x) => Math.max(0, x - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, i]);

  function close() {
    setTutorialSeen(true);
    onClose();
  }
  function next() {
    if (i < STEPS.length - 1) setI(i + 1);
    else close();
  }

  const step = STEPS[i];
  const Icon = step.icon;
  const isLast = i === STEPS.length - 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-ink-950/45 px-4 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-ink-200/70 bg-white shadow-soft dark:border-ink-800/70 dark:bg-ink-900"
          >
            <button
              onClick={close}
              aria-label="Close tutorial"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-950 dark:hover:bg-ink-800 dark:hover:text-white"
            >
              <X size={14} weight="bold" />
            </button>

            <div className="px-8 pt-9 pb-7">
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft/60 text-accent dark:bg-accent/15">
                <Icon size={22} weight="duotone" />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-accent">{step.kicker}</div>
              <h2 className="font-display mt-2 text-[26px] font-bold leading-tight tracking-extra-tight text-ink-950 dark:text-white">
                {step.title}
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600 dark:text-ink-400">
                {step.body}
              </p>

              {i === 1 && (
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <Tile icon={SquaresFour} label="College Match" hint="Ranked fit list" />
                  <Tile icon={House} label="Overview" hint="Daily snapshot" />
                </div>
              )}
              {i === 2 && (
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <Tile icon={Compass} label="Majors" hint="Fit + salary" />
                  <Tile icon={Calendar} label="Timeline" hint="Quarterly plan" />
                </div>
              )}
              {i === 3 && (
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <Tile icon={PaperPlaneTilt} label="Essays" hint="Brainstorm → draft" />
                  <Tile icon={GraduationCap} label="Counselors" hint="Pro: book a session" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-ink-200/70 bg-ink-50/60 px-6 py-4 dark:border-ink-800/70 dark:bg-ink-950/40">
              <div className="flex items-center gap-1.5">
                {STEPS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setI(idx)}
                    aria-label={`Go to step ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === i ? "w-6 bg-ink-950 dark:bg-white" : "w-1.5 bg-ink-300 dark:bg-ink-700"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                {!isLast && (
                  <button
                    onClick={close}
                    className="rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-950 dark:hover:text-white"
                  >
                    Skip
                  </button>
                )}
                <button
                  onClick={next}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink-950 px-4 text-[13px] font-medium text-white dark:bg-white dark:text-ink-950"
                >
                  {isLast ? "Get started" : "Next"}
                  <ArrowRight size={13} weight="bold" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Tile({ icon: Icon, label, hint }: { icon: Step["icon"]; label: string; hint: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink-200/70 bg-white px-3 py-2.5 dark:border-ink-800/70 dark:bg-ink-900">
      <div className="grid h-8 w-8 place-items-center rounded-xl bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200">
        <Icon size={14} weight="duotone" />
      </div>
      <div className="min-w-0">
        <div className="text-[12.5px] font-medium leading-tight text-ink-950 dark:text-white">{label}</div>
        <div className="text-[10.5px] text-ink-500">{hint}</div>
      </div>
    </div>
  );
}
