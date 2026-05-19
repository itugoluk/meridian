import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BookmarkSimple, Compass, Trash } from "@phosphor-icons/react";
import { useStore } from "../store/useStore";
import { recommendSchools, formatUsd, type Verdict } from "../lib/recommend";
import { SchoolLogo } from "../components/SchoolLogo";

const verdictTint: Record<Verdict, string> = {
  Reach: "bg-accent/10 text-accent border-accent/30",
  Target: "border-ink-200 bg-ink-50 text-ink-900 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-100",
  Likely: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
};

export default function Portfolio() {
  const profile = useStore((s) => s.profile);
  const saved = useStore((s) => s.savedSchoolIds);
  const toggle = useStore((s) => s.toggleSavedSchool);

  const { matches } = useMemo(
    () => profile ? recommendSchools(profile) : { matches: [], floorApplied: false, lowGpa: false },
    [profile]
  );

  const portfolio = useMemo(
    () => saved.map((id) => matches.find((m) => m.school.id === id)).filter((m): m is NonNullable<typeof m> => Boolean(m)),
    [saved, matches]
  );

  const distribution = useMemo(() => ({
    reach: portfolio.filter((m) => m.verdict === "Reach").length,
    target: portfolio.filter((m) => m.verdict === "Target").length,
    likely: portfolio.filter((m) => m.verdict === "Likely").length,
  }), [portfolio]);

  const avgOdds = portfolio.length
    ? Math.round(portfolio.reduce((sum, m) => sum + m.admitProbability, 0) / portfolio.length)
    : 0;
  const totalNetCost = portfolio.reduce((sum, m) => sum + m.netCost, 0);

  if (!profile) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h2 className="display text-3xl">Set up your profile to start your portfolio.</h2>
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
          <div className="text-[11px] font-mono uppercase tracking-widest text-accent">Portfolio</div>
          <h1 className="display mt-2 text-4xl md:text-5xl">
            {portfolio.length === 0 ? "Your application list starts here." : `${portfolio.length} ${portfolio.length === 1 ? "school" : "schools"} on your list.`}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500 dark:text-ink-400">
            Bookmark schools from College Match to build a working list. We'll surface a healthy Reach / Target / Likely balance and warn you if the portfolio drifts too far in any direction.
          </p>
        </div>
      </div>

      {portfolio.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Summary */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <SummaryCard label="Reach" value={distribution.reach.toString()} tint="text-accent" />
            <SummaryCard label="Target" value={distribution.target.toString()} />
            <SummaryCard label="Likely" value={distribution.likely.toString()} tint="text-emerald-600 dark:text-emerald-400" />
            <SummaryCard label="Avg odds" value={`${avgOdds}%`} />
          </div>

          {/* Balance hint */}
          <BalanceHint reach={distribution.reach} target={distribution.target} likely={distribution.likely} />

          {/* List */}
          <div className="mt-6 rounded-3xl border border-ink-200/70 bg-white dark:border-ink-800/70 dark:bg-ink-900 overflow-hidden">
            {portfolio.map((m, i) => (
              <div key={m.school.id} className="border-b border-ink-200/70 last:border-b-0 dark:border-ink-800/70">
                <div className="flex items-center justify-between gap-4 px-7 py-5">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="font-mono text-[14px] tabular-nums text-ink-400 w-8">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <SchoolLogo website={m.school.website} name={m.school.name} acronym={m.school.acronym} logoUrl={m.school.logoUrl} size={36} />
                    <div className="min-w-0">
                      <div className="truncate font-display text-[19px] font-bold tracking-extra-tight">{m.school.name}</div>
                      <div className="truncate text-[12px] font-mono uppercase tracking-widest text-ink-500">
                        {m.school.city} · {m.school.country}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 md:gap-6">
                    <span className={`hidden md:inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${verdictTint[m.verdict]}`}>
                      {m.verdict}
                    </span>
                    <div className="text-right">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-500">Odds</div>
                      <div className="font-mono text-[18px] tabular-nums font-medium">{m.admitProbability}%</div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-500">Net cost</div>
                      <div className="font-mono text-[14px] tabular-nums">{formatUsd(m.netCost)}</div>
                    </div>
                    {m.school.website && (
                      <a
                        href={`https://www.${m.school.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-500 transition-colors hover:border-ink-400 dark:border-ink-800"
                        aria-label={`Visit ${m.school.website}`}
                      >
                        <ArrowUpRight size={13} weight="bold" />
                      </a>
                    )}
                    <button
                      onClick={() => toggle(m.school.id)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-500 transition-colors hover:border-accent hover:text-accent dark:border-ink-800"
                      aria-label="Remove from portfolio"
                    >
                      <Trash size={13} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 px-1 text-[13px] text-ink-500">
            <span>Total estimated annual net cost across portfolio: <span className="font-mono font-medium text-ink-900 dark:text-white">{formatUsd(totalNetCost)}</span></span>
            <Link to="/app/matches" className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
              Add more from College Match <ArrowRight size={12} weight="bold" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, tint }: { label: string; value: string; tint?: string }) {
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white px-5 py-4 dark:border-ink-800/70 dark:bg-ink-900">
      <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
      <div className={`mt-1 font-display text-3xl font-bold tracking-extra-tight ${tint ?? ""}`}>{value}</div>
    </div>
  );
}

function BalanceHint({ reach, target, likely }: { reach: number; target: number; likely: number }) {
  const total = reach + target + likely;
  if (total < 4) {
    return (
      <div className="rounded-2xl border border-ink-200/70 bg-ink-50/40 px-5 py-4 text-[14px] text-ink-700 dark:border-ink-800/70 dark:bg-ink-900/30 dark:text-ink-300">
        Build to at least 6–10 schools before locking in a balance. A typical applicant ends with 2–3 Reaches, 3–4 Targets, and 2–3 Likelies.
      </div>
    );
  }
  if (likely === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-[14px] text-amber-900 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-300">
        No safeties yet. Add 2–3 Likely schools so you have realistic admits to fall back on.
      </div>
    );
  }
  if (reach > target + likely) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-[14px] text-amber-900 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-300">
        Reach-heavy. Suggest balancing with 1–2 more Target or Likely additions.
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-5 py-4 text-[14px] text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
      Healthy balance across Reach, Target, and Likely. Add or trim as your priorities sharpen.
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-ink-300 bg-ink-50/40 px-8 py-16 text-center dark:border-ink-700 dark:bg-ink-900/30">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ink-950 text-white dark:bg-white dark:text-ink-950">
        <BookmarkSimple size={18} weight="bold" />
      </div>
      <h3 className="font-display mt-5 text-2xl font-bold tracking-extra-tight">Your portfolio is empty.</h3>
      <p className="mt-2 max-w-md mx-auto text-[14.5px] text-ink-500 dark:text-ink-400">
        Bookmark schools from College Match to start your application list. We'll track your Reach / Target / Likely balance, average admit odds, and total net cost.
      </p>
      <Link
        to="/app/matches"
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink-950 px-5 text-[14px] font-medium text-white dark:bg-white dark:text-ink-950"
      >
        <Compass size={14} weight="duotone" />
        Browse College Match
      </Link>
    </div>
  );
}
