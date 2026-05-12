import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, BookmarkSimple, CaretLeft, CaretRight, Funnel, Info, Lock } from "@phosphor-icons/react";
import { useStore } from "../store/useStore";
import { recommendSchools, formatUsd, type Verdict, distributionFor, RECOMMENDATION_CAP } from "../lib/recommend";
import { SchoolLogo } from "../components/SchoolLogo";

const VERDICTS: Verdict[] = ["Reach", "Target", "Likely"];

const verdictTint: Record<Verdict, string> = {
  Reach: "bg-accent/10 text-accent border-accent/30",
  Target: "border-ink-200 bg-ink-50 text-ink-900 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-100",
  Likely: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
};

const FREE_LIMIT = 3;
const PAGE_SIZE = 25;

export default function Matches() {
  const profile = useStore((s) => s.profile);
  const isPro = useStore((s) => s.isPro);
  const saved = useStore((s) => s.savedSchoolIds);
  const toggle = useStore((s) => s.toggleSavedSchool);
  const [filter, setFilter] = useState<"All" | Verdict>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const matches = useMemo(() => (profile ? recommendSchools(profile) : []), [profile]);
  const distribution = useMemo(() => distributionFor(matches), [matches]);

  const filtered = matches.filter((m) => filter === "All" || m.verdict === filter);

  useEffect(() => { setPage(0); }, [filter, isPro]);

  const pageCount = isPro ? Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)) : 1;
  const safePage = Math.min(page, pageCount - 1);
  const visible = isPro
    ? filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)
    : filtered.slice(0, FREE_LIMIT);
  const lockedCount = isPro ? 0 : Math.max(0, filtered.length - FREE_LIMIT);

  if (!profile) return <NoProfile />;

  return (
    <div className="px-6 py-10 lg:px-12 lg:py-14 max-w-[1400px] mx-auto pb-32 lg:pb-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-accent">College Match</div>
          <h1 className="display mt-2 text-4xl md:text-5xl">{matches.length} schools, ranked for you.</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-500 dark:text-ink-400">
            Each fit score weighs your grades, country preference, interest alignment, school-system acceptance, vibe, and budget. Expand any school for the reasoning. Shortlist capped at {RECOMMENDATION_CAP} schools to keep it actionable.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[12px] font-mono uppercase tracking-widest text-ink-500">
          <Funnel size={14} weight="duotone" />
          <span>{distribution.reach} R · {distribution.target} T · {distribution.likely} L</span>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-8 inline-flex gap-1 rounded-full border border-ink-200 bg-ink-50 p-1 dark:border-ink-800 dark:bg-ink-900">
        {["All", ...VERDICTS].map((v) => (
          <button
            key={v}
            onClick={() => setFilter(v as "All" | Verdict)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
              filter === v ? "bg-ink-950 text-white dark:bg-white dark:text-ink-950" : "text-ink-600 hover:text-ink-950 dark:text-ink-400 dark:hover:text-white"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Results — divided list, no card spam */}
      <div className="rounded-3xl border border-ink-200/70 bg-white dark:border-ink-800/70 dark:bg-ink-900 overflow-hidden">
        <AnimatePresence initial={false}>
          {visible.map((m) => {
            const open = openId === m.school.id;
            const isSaved = saved.includes(m.school.id);
            return (
              <motion.div
                layout
                key={m.school.id}
                transition={{ type: "spring", stiffness: 130, damping: 22 }}
                className="border-b border-ink-200/70 last:border-b-0 dark:border-ink-800/70"
              >
                <button
                  onClick={() => setOpenId(open ? null : m.school.id)}
                  className="flex w-full items-center justify-between gap-4 px-7 py-5 text-left transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-900/40"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="font-mono text-[14px] tabular-nums text-ink-400 w-8">
                      {String(matches.indexOf(m) + 1).padStart(2, "0")}
                    </span>
                    <SchoolLogo website={m.school.website} name={m.school.name} acronym={m.school.acronym} logoUrl={m.school.logoUrl} size={36} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-display text-[19px] font-bold tracking-extra-tight">{m.school.name}</span>
                        {m.school.ivyLeague && (
                          <span className="hidden md:inline-flex shrink-0 rounded-full border border-accent/40 bg-accent/10 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider text-accent">Ivy</span>
                        )}
                        {m.school.top100World && !m.school.ivyLeague && (
                          <span className="hidden md:inline-flex shrink-0 rounded-full border border-ink-300 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider text-ink-600 dark:border-ink-700 dark:text-ink-400">T100</span>
                        )}
                      </div>
                      <div className="truncate text-[12px] font-mono uppercase tracking-widest text-ink-500">
                        {m.school.city} · {m.school.country}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 md:gap-5">
                    <span className={`hidden md:inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${verdictTint[m.verdict]}`}>
                      {m.verdict}
                    </span>
                    <div className="text-right">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-500">Fit</div>
                      <div className="font-mono text-[18px] tabular-nums font-medium">{m.fit}</div>
                    </div>
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); toggle(m.school.id); }}
                      className={`hidden md:grid h-9 w-9 place-items-center rounded-full border transition-colors ${
                        isSaved ? "border-accent bg-accent text-white" : "border-ink-200 text-ink-500 hover:border-ink-400 dark:border-ink-800"
                      }`}
                    >
                      <BookmarkSimple size={13} weight={isSaved ? "fill" : "regular"} />
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 130, damping: 22 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-8 border-t border-ink-200/70 bg-ink-50/40 px-7 py-7 md:grid-cols-12 dark:border-ink-800/70 dark:bg-ink-950/40">
                        <div className="md:col-span-7">
                          <p className="text-[15px] leading-relaxed text-ink-700 dark:text-ink-300 whitespace-pre-line">{m.school.blurb}</p>
                          <div className="mt-6">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">{m.verdict === "Reach" && m.fit < 50 ? "Why this is a stretch" : "Why this fits you"}</div>
                            <ul className="mt-3 space-y-2">
                              {m.reasons.map((r, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-[14px] text-ink-700 dark:text-ink-300">
                                  <Info size={14} weight="duotone" className="mt-0.5 shrink-0 text-accent" />{r}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {m.school.website && (
                            <a
                              href={`https://www.${m.school.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline"
                            >
                              Visit {m.school.website} <ArrowUpRight size={13} weight="bold" />
                            </a>
                          )}
                        </div>
                        <div className="md:col-span-5 grid grid-cols-2 gap-x-6 gap-y-5">
                          <Stat label="Intl admit" value={`${m.school.intlAcceptance.toFixed(1)}%`} />
                          <Stat label="Overall admit" value={`${m.school.acceptance.toFixed(1)}%`} />
                          <Stat label="Median GPA (US)" value={m.school.median.gpa.toFixed(2)} />
                          <Stat label="Median SAT" value={m.school.median.sat.toString()} />
                          <Stat label="Sticker" value={formatUsd(m.school.stickerUsd)} />
                          <Stat label="Net (est.)" value={formatUsd(m.netCost)} highlight />
                          <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink-200/70 pt-5 dark:border-ink-800/70">
                            <Stat label="Test policy" value={m.school.testPolicy} />
                            <Stat label="RD deadline" value={m.school.appDeadline} />
                            <Stat label="Early option" value={m.school.earlyOption} />
                            <Stat label="Application" value={m.school.appPlatform} />
                            <Stat label="Intl undergrads" value={`${m.school.intlStudentPct}%`} />
                            <Stat label="Undergrad size" value={m.school.undergradSize.toLocaleString()} />
                            <div className="col-span-2">
                              <Stat label="Most common system" value={m.school.preferredSystem} />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">Strengths</div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {m.school.strengths.map((s) => (
                                <span key={s} className="rounded-full border border-ink-200 px-2.5 py-0.5 text-[11.5px] text-ink-700 dark:border-ink-800 dark:text-ink-300">{s}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {lockedCount > 0 && (
          <div className="relative">
            <div className="border-t border-ink-200/70 px-7 py-12 text-center dark:border-ink-800/70">
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-ink-950 text-white dark:bg-white dark:text-ink-950">
                <Lock size={16} weight="bold" />
              </div>
              <h3 className="font-display mt-5 text-2xl font-bold tracking-extra-tight">
                {lockedCount} more schools matched.
              </h3>
              <p className="mt-2 text-[14.5px] text-ink-500 dark:text-ink-400">
                Free tier shows your top {FREE_LIMIT}. Pro unlocks the full ranked list (up to {RECOMMENDATION_CAP} schools), side-by-side compare, and scholarship search.
              </p>
              <Link to="/pricing" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink-950 px-5 text-[14px] font-medium text-white dark:bg-white dark:text-ink-950">
                Upgrade to Pro · $14/mo
              </Link>
            </div>
          </div>
        )}
      </div>

      {isPro && pageCount > 1 && (
        <div className="mt-8 flex items-center justify-between gap-4 px-1">
          <div className="font-mono text-[12px] uppercase tracking-widest text-ink-500">
            Page {safePage + 1} of {pageCount} · {filtered.length} {filter === "All" ? "schools" : filter.toLowerCase()}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setOpenId(null); setPage(Math.max(0, safePage - 1)); }}
              disabled={safePage === 0}
              className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-30 disabled:hover:bg-transparent dark:border-ink-800 dark:text-ink-300 dark:hover:bg-ink-900"
              aria-label="Previous page"
            >
              <CaretLeft size={14} weight="bold" />
            </button>
            <button
              onClick={() => { setOpenId(null); setPage(Math.min(pageCount - 1, safePage + 1)); }}
              disabled={safePage >= pageCount - 1}
              className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-30 disabled:hover:bg-transparent dark:border-ink-800 dark:text-ink-300 dark:hover:bg-ink-900"
              aria-label="Next page"
            >
              <CaretRight size={14} weight="bold" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
      <div className={`font-mono tabular-nums ${highlight ? "text-[20px] font-bold text-accent" : "text-[15px] font-medium"}`}>{value}</div>
    </div>
  );
}

function NoProfile() {
  return (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h2 className="display text-3xl">Set up your profile to unlock matches.</h2>
      <Link to="/onboarding" className="mt-6 inline-flex h-11 items-center rounded-full bg-ink-950 px-5 text-white dark:bg-white dark:text-ink-950">
        Start onboarding
      </Link>
    </div>
  );
}
