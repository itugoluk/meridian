import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, BookOpen, Calendar, CaretRight, ChartLineUp,
  Compass, GraduationCap, PaperPlaneTilt, Plus, SquaresFour, Sparkle,
} from "@phosphor-icons/react";
import { useStore } from "../store/useStore";
import { recommendSchools, recommendMajors, distributionFor, formatUsd } from "../lib/recommend";
import { buildTimeline } from "../lib/timeline";
import { Tutorial } from "../components/Tutorial";

export default function Dashboard() {
  const profile = useStore((s) => s.profile);
  const isPro = useStore((s) => s.isPro);
  const essays = useStore((s) => s.essays);
  const tutorialSeen = useStore((s) => s.tutorialSeen);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  useEffect(() => {
    if (profile && !tutorialSeen) {
      const t = setTimeout(() => setTutorialOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, [profile, tutorialSeen]);

  const matches = useMemo(() => (profile ? recommendSchools(profile) : []), [profile]);
  const majors = useMemo(() => (profile ? recommendMajors(profile) : []), [profile]);
  const distribution = useMemo(() => distributionFor(matches), [matches]);
  const timeline = useMemo(() => buildTimeline(profile), [profile]);
  const activePhase = timeline.find((p) => p.status === "Active") ?? timeline[0];

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h2 className="display text-4xl">Set up your profile first.</h2>
        <p className="mt-4 text-ink-500">A three-minute onboarding unlocks every panel below.</p>
        <Link to="/onboarding" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink-950 px-6 text-white dark:bg-white dark:text-ink-950">
          Start onboarding <ArrowRight size={15} weight="bold" />
        </Link>
      </div>
    );
  }

  const firstName = profile.name.split(" ")[0];
  const topThree = matches.slice(0, 3);

  return (
    <div className="px-6 py-10 lg:px-12 lg:py-14 max-w-[1400px] mx-auto pb-32 lg:pb-14">
      <Tutorial open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      {/* Header */}
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-accent">{greeting()} </div>
          <h1 className="display mt-2 text-4xl md:text-5xl">{firstName}, your plan is live.</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-500 dark:text-ink-400">
            {profile.system} student, Grade {profile.grade}, targeting {profile.targetCountries.slice(0, 2).join(" & ")}{profile.targetCountries.length > 2 ? ` + ${profile.targetCountries.length - 2} more` : ""}.
          </p>
        </div>
        <Link to="/app/profile" className="text-[13px] font-medium text-ink-600 hover:text-ink-950 dark:text-ink-400 dark:hover:text-white">
          Edit profile →
        </Link>
      </div>

      {/* Bento — 6 col asymmetric */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[minmax(0,_auto)]">
        {/* Distribution — wide hero card */}
        <BentoCard className="md:col-span-4" kicker="Portfolio balance" to="/app/matches" linkLabel="View all matches">
          <div className="grid grid-cols-3 gap-6">
            <Distribution label="Reach" count={distribution.reach} color="bg-accent" />
            <Distribution label="Target" count={distribution.target} color="bg-ink-950 dark:bg-white" />
            <Distribution label="Likely" count={distribution.likely} color="bg-emerald-500" />
          </div>
          <div className="mt-7 text-[13px] leading-relaxed text-ink-600 dark:text-ink-400">
            {balanceAdvice(distribution)}
          </div>
        </BentoCard>

        {/* Top match */}
        <BentoCard className="md:col-span-2 md:row-span-2" kicker="Top match" to="/app/matches" linkLabel="See all">
          {topThree[0] && (
            <div className="flex h-full flex-col">
              <div className="flex-1">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-500">{topThree[0].school.country}</div>
                <h3 className="font-display mt-2 text-[24px] font-bold leading-tight tracking-extra-tight">{topThree[0].school.name}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-600 dark:text-ink-400">{topThree[0].school.blurb}</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-ink-200/70 pt-5 dark:border-ink-800/70">
                <Mini label="Fit score" value={`${topThree[0].fit}`} />
                <Mini label="Verdict" value={topThree[0].verdict} />
                <Mini label="Intl admit" value={`${topThree[0].school.intlAcceptance.toFixed(1)}%`} />
                <Mini label="Net cost" value={formatUsd(topThree[0].netCost)} />
              </div>
            </div>
          )}
        </BentoCard>

        {/* Next major */}
        <BentoCard className="md:col-span-2" kicker="Major recommendation" to="/app/majors" linkLabel="Explore">
          {majors[0] && (
            <>
              <h3 className="font-display text-2xl font-bold tracking-extra-tight">{majors[0].major.name}</h3>
              <div className="mt-1 text-[12px] font-mono uppercase tracking-widest text-ink-500">{majors[0].major.category} · {majors[0].major.growthOutlook} growth</div>
              <div className="mt-5 flex items-baseline justify-between">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-ink-500">Fit</div>
                  <div className="font-mono text-3xl tabular-nums">{majors[0].fit}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-ink-500">Median start</div>
                  <div className="font-mono text-[16px] tabular-nums">{formatUsd(majors[0].major.medianStartingSalary)}</div>
                </div>
              </div>
            </>
          )}
        </BentoCard>

        {/* Timeline — Active phase */}
        <BentoCard className="md:col-span-2" kicker="Active timeline" to="/app/timeline" linkLabel="Open">
          <div className="text-[12px] font-mono uppercase tracking-widest text-ink-500">{activePhase.quarter}</div>
          <h3 className="font-display mt-2 text-xl font-bold tracking-extra-tight">{activePhase.title}</h3>
          <ul className="mt-4 space-y-2">
            {activePhase.items.slice(0, 3).map((it) => (
              <li key={it.id} className="flex items-start gap-2.5 text-[13px] text-ink-700 dark:text-ink-300">
                <CaretRight size={12} weight="bold" className="mt-1 shrink-0 text-accent" /> {it.label}
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* Essays */}
        <BentoCard className="md:col-span-3" kicker="Essay workshop" to="/app/essays" linkLabel="Open">
          {essays.length === 0 ? (
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-ink-100 dark:bg-ink-800">
                  <PaperPlaneTilt size={16} weight="duotone" />
                </div>
                <div>
                  <div className="text-[14px] font-medium text-ink-900 dark:text-white">Start your personal statement</div>
                  <div className="text-[12px] text-ink-500">Brainstorm in under 10 minutes.</div>
                </div>
              </div>
              <Link
                to="/app/essays"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-white dark:bg-white dark:text-ink-950"
              >
                <Plus size={13} weight="bold" /> New essay
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {essays.slice(0, 3).map((e) => (
                <div key={e.id} className="flex items-center justify-between border-b border-ink-200/70 pb-3 last:border-b-0 last:pb-0 dark:border-ink-800/70">
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-medium">{e.prompt || "Untitled essay"}</div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-ink-500">
                      {wordCount(e.draft)} / {e.wordTarget} words
                    </div>
                  </div>
                  <Link to="/app/essays" className="rounded-full p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800">
                    <ArrowUpRight size={14} weight="bold" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </BentoCard>

        {/* Pro CTA or counselor preview */}
        <BentoCard className="md:col-span-3" kicker={isPro ? "Counselors" : "Unlock more"} to={isPro ? "/app/counselors" : "/pricing"} linkLabel={isPro ? "Book a session" : "View plans"}>
          {isPro ? (
            <>
              <h3 className="font-display text-2xl font-bold tracking-extra-tight">Need a human eye?</h3>
              <p className="mt-2 text-[14px] text-ink-500 dark:text-ink-400">Five vetted counselors with verified admit records. Average session: 50 minutes.</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent dark:bg-accent/10">
                <Sparkle size={10} weight="fill" /> Pro
              </div>
              <h3 className="font-display mt-3 text-2xl font-bold tracking-extra-tight">Unlimited matches, essays, & counselor scheduling.</h3>
              <p className="mt-2 text-[13.5px] text-ink-500 dark:text-ink-400">$14/month. Cancel anytime, no commission games.</p>
            </>
          )}
        </BentoCard>

        {/* Quick links rail */}
        <div className="md:col-span-6 grid grid-cols-2 gap-3 md:grid-cols-4 mt-2">
          <QuickLink to="/app/matches" icon={SquaresFour} label="Matches" />
          <QuickLink to="/app/majors" icon={Compass} label="Majors" />
          <QuickLink to="/app/timeline" icon={Calendar} label="Timeline" />
          <QuickLink to="/app/counselors" icon={GraduationCap} label="Counselors" pro={!isPro} />
        </div>
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Late night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function balanceAdvice(d: { reach: number; target: number; likely: number }) {
  if (d.likely === 0) return "You have no Likely schools. Add at least two so you always have a viable path forward.";
  if (d.likely < 3) return `Only ${d.likely} Likely school${d.likely === 1 ? "" : "s"}. Apply to a couple more so your safety net is real.`;
  if (d.reach > d.target + d.likely) return "Your list leans heavy on Reach schools. Consider balancing with one or two more Targets.";
  if (d.target > d.reach * 3) return "Your list reads as conservative. Adding a Reach you'd genuinely attend is worth the risk.";
  return "Distribution looks balanced. A typical safe spread is roughly 3 Reach, 4 Target, 3 Likely.";
}

function wordCount(s: string) {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

function BentoCard({
  className = "",
  kicker,
  to,
  linkLabel,
  children,
}: {
  className?: string;
  kicker: string;
  to: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 110, damping: 22 }}
      className={`group relative flex flex-col rounded-3xl border border-ink-200/70 bg-white p-7 transition-colors hover:bg-ink-50/40 dark:border-ink-800/70 dark:bg-ink-900 dark:hover:bg-ink-900/70 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-mono uppercase tracking-widest text-ink-500">{kicker}</div>
        <Link to={to} className="text-[12px] font-mono uppercase tracking-widest text-ink-500 transition-colors hover:text-ink-950 dark:hover:text-white">
          {linkLabel} →
        </Link>
      </div>
      <div className="mt-5 flex-1">{children}</div>
    </motion.article>
  );
}

function Distribution({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl font-extrabold tabular-nums tracking-extra-tight">{count}</span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink-500">{label}</span>
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-ink-100 dark:bg-ink-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, count * 12)}%` }} />
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-500">{label}</div>
      <div className="font-mono text-[14px] tabular-nums font-medium text-ink-950 dark:text-white">{value}</div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label, pro }: { to: string; icon: React.ComponentType<{ size?: number; weight?: "duotone" | "regular" | "bold" | "fill" }>; label: string; pro?: boolean }) {
  return (
    <Link
      to={to}
      className="group relative flex items-center justify-between rounded-2xl border border-ink-200/70 bg-white p-4 transition-colors hover:bg-ink-50 dark:border-ink-800/70 dark:bg-ink-900 dark:hover:bg-ink-900/70"
    >
      <div className="flex items-center gap-3">
        <Icon size={16} weight="duotone" />
        <span className="text-[14px] font-medium">{label}</span>
      </div>
      {pro ? (
        <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent">Pro</span>
      ) : (
        <ArrowUpRight size={14} weight="bold" className="text-ink-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}

// Suppress unused (icon used implicitly via dashboard tiles)
void BookOpen; void ChartLineUp;
