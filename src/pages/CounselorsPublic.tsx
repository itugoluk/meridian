import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { MarketingNav } from "../components/MarketingNav";
import { Footer } from "../components/Footer";
import { COUNSELORS } from "../data/counselors";

export default function CounselorsPublic() {
  return (
    <div className="min-h-[100dvh] bg-white dark:bg-ink-950">
      <MarketingNav />

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="text-[11px] font-mono uppercase tracking-widest text-accent">/ Counselors</div>
            <h1 className="display mt-3 text-5xl md:text-6xl">Five advisors. All have read applications from the admit side.</h1>
          </div>
          <div className="lg:col-span-5 lg:flex lg:items-end">
            <p className="text-[16px] leading-relaxed text-ink-600 dark:text-ink-400">
              Pro members can book directly from the app. Each counselor publishes their admit-rate track record openly. No commissions, no kickbacks &mdash; you pay them, we don't take a cut.
            </p>
          </div>
        </div>

        <div className="mt-14 space-y-1 rounded-3xl border border-ink-200/70 bg-white p-1 dark:border-ink-800/70 dark:bg-ink-900">
          {COUNSELORS.map((c) => (
            <div key={c.id} className="grid grid-cols-1 gap-6 rounded-2xl px-7 py-7 transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-900/60 md:grid-cols-12 md:items-center">
              <div className="md:col-span-4">
                <div className="font-display text-2xl font-bold tracking-extra-tight">{c.name}</div>
                <div className="mt-1 text-[12px] font-mono uppercase tracking-widest text-ink-500">{c.title}</div>
              </div>
              <div className="md:col-span-6 text-[14.5px] leading-relaxed text-ink-700 dark:text-ink-300">{c.bio}</div>
              <div className="md:col-span-2 text-right">
                <div className="font-display text-3xl font-extrabold tabular-nums tracking-extra-tight">${c.hourlyRate}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">/ hour</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <Link to="/pricing" className="inline-flex h-12 items-center gap-2 rounded-full bg-ink-950 px-6 text-[15px] font-medium text-white dark:bg-white dark:text-ink-950">
            Upgrade to Pro to book <ArrowRight size={15} weight="bold" />
          </Link>
          <span className="text-[14px] text-ink-500">All sessions are 50 minutes, conducted over video.</span>
        </div>
      </section>

      <Footer />
    </div>
  );
}
