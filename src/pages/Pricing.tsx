import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "@phosphor-icons/react";
import { useStore } from "../store/useStore";
import { MarketingNav } from "../components/MarketingNav";
import { Footer } from "../components/Footer";

type Cycle = "month" | "year";

const FREE_FEATURES = [
  { f: "3 school matches", on: true },
  { f: "Full major recommendations", on: true },
  { f: "Timeline planner", on: true },
  { f: "1 essay workshop", on: true },
  { f: "Net-cost simulator", on: false },
  { f: "Unlimited matches & compare", on: false },
  { f: "Counselor scheduling", on: false },
  { f: "Scholarship finder", on: false },
  { f: "Interview prep bank", on: false },
  { f: "Parent / shared view", on: false },
];

const PRO_FEATURES = [
  { f: "Everything in Free", on: true },
  { f: "Unlimited school matches", on: true },
  { f: "Side-by-side school compare", on: true },
  { f: "Unlimited essays + 3 revision passes each", on: true },
  { f: "Net-cost simulator with aid modeling", on: true },
  { f: "Counselor scheduling (5 advisors)", on: true },
  { f: "Scholarship finder", on: true },
  { f: "Interview prep bank", on: true },
  { f: "Parent / shared view", on: true },
  { f: "Priority email support", on: true },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [cycle, setCycle] = useState<Cycle>("month");
  const isPro = useStore((s) => s.isPro);
  const upgrade = useStore((s) => s.upgradeToPro);
  const downgrade = useStore((s) => s.downgrade);

  const proPrice = cycle === "month" ? 14 : 99;
  const proPeriod = cycle === "month" ? "/month" : "/year";
  const savings = cycle === "year" ? "Save $69 vs. monthly" : "";

  const handleUpgrade = () => {
    upgrade();
    navigate("/app");
  };

  return (
    <div className="min-h-[100dvh] bg-white text-ink-950 dark:bg-ink-950 dark:text-ink-100">
      <MarketingNav />

      <section className="mx-auto max-w-[1400px] px-6 pb-16 pt-16 lg:px-12 lg:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="text-[11px] font-mono uppercase tracking-widest text-accent">Pricing</div>
            <h1 className="display mt-3 text-[44px] md:text-[64px]">
              Free for matching. <span className="text-ink-400">Pay for depth.</span>
            </h1>
          </div>
          <div className="lg:col-span-5 lg:flex lg:items-end">
            <p className="text-[17px] leading-relaxed text-ink-600 dark:text-ink-400">
              Most students can finish their college list, brainstorm essays, and build a timeline entirely on the free tier. Pro is for the moments where unlimited iterations and a real counselor make the difference.
            </p>
          </div>
        </div>

        <div className="mt-10 inline-flex items-center gap-1 rounded-full border border-ink-200 bg-ink-50 p-1 dark:border-ink-800 dark:bg-ink-900">
          <button
            onClick={() => setCycle("month")}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${cycle === "month" ? "bg-ink-950 text-white dark:bg-white dark:text-ink-950" : "text-ink-600 dark:text-ink-400"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setCycle("year")}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${cycle === "year" ? "bg-ink-950 text-white dark:bg-white dark:text-ink-950" : "text-ink-600 dark:text-ink-400"}`}
          >
            Annual
          </button>
          {cycle === "year" && (
            <span className="ml-2 mr-2 text-[11px] font-mono uppercase tracking-widest text-accent">{savings}</span>
          )}
        </div>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-12">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-ink-200/70 bg-white p-9 dark:border-ink-800/70 dark:bg-ink-900"
          >
            <div className="text-[11px] font-mono uppercase tracking-widest text-ink-500">Free</div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-6xl font-extrabold tracking-extra-tight">$0</span>
              <span className="font-mono text-[13px] uppercase tracking-widest text-ink-500">forever</span>
            </div>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600 dark:text-ink-400">
              Everything you need to build a viable list and your first essay. No card required.
            </p>
            {isPro ? (
              <button
                onClick={downgrade}
                className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-ink-200 px-6 text-[14.5px] font-medium dark:border-ink-800"
              >
                Downgrade to Free <ArrowRight size={14} weight="bold" />
              </button>
            ) : (
              <Link
                to="/onboarding"
                className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-ink-200 px-6 text-[14.5px] font-medium dark:border-ink-800"
              >
                Start free <ArrowRight size={14} weight="bold" />
              </Link>
            )}
            <ul className="mt-9 space-y-3">
              {FREE_FEATURES.map((it) => (
                <FeatureRow key={it.f} {...it} />
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="relative rounded-3xl border border-ink-950 bg-ink-950 p-9 text-white dark:border-white dark:bg-white dark:text-ink-950"
          >
            <span className="absolute -top-3 left-9 rounded-full bg-accent px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-white">
              Recommended
            </span>
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono uppercase tracking-widest text-white/60 dark:text-ink-500">Meridian Pro</div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-6xl font-extrabold tracking-extra-tight">${proPrice}</span>
              <span className="font-mono text-[13px] uppercase tracking-widest opacity-60">{proPeriod}</span>
            </div>
            <p className="mt-3 text-[14.5px] leading-relaxed opacity-80">
              Unlimited applications, counselor sessions, scholarships, and side-by-side compare. Cancel anytime.
            </p>
            {isPro ? (
              <div className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white/10 px-6 text-[14.5px] font-medium text-white/40 dark:bg-ink-950/10 dark:text-ink-950/40 cursor-default select-none">
                <Check size={14} weight="bold" />
                Already subscribed
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-[14.5px] font-medium text-white transition-transform hover:-translate-y-px"
              >
                {`Upgrade to Pro · $${proPrice}${proPeriod}`}
                <ArrowRight size={14} weight="bold" />
              </button>
            )}
            <ul className="mt-9 space-y-3">
              {PRO_FEATURES.map((it) => (
                <FeatureRow key={it.f} {...it} highlighted />
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Compare table */}
        <div className="mt-20">
          <div className="text-[11px] font-mono uppercase tracking-widest text-accent">/ Compare</div>
          <h2 className="display mt-3 text-3xl md:text-4xl">Side-by-side, feature by feature.</h2>
          <div className="mt-7 overflow-x-auto rounded-3xl border border-ink-200/70 dark:border-ink-800/70">
            <table className="w-full text-left text-[14px]">
              <thead className="border-b border-ink-200/70 bg-ink-50/60 dark:border-ink-800/70 dark:bg-ink-900">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-mono uppercase tracking-widest text-ink-500">Feature</th>
                  <th className="px-6 py-4 text-[11px] font-mono uppercase tracking-widest text-ink-500">Free</th>
                  <th className="px-6 py-4 text-[11px] font-mono uppercase tracking-widest text-accent">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200/70 dark:divide-ink-800/70">
                {[
                  ["School matches", "Top 3", "Unlimited"],
                  ["Major recommendations", "Full list", "Full list + alt pathways"],
                  ["Timeline planner", "Included", "Included + custom milestones"],
                  ["Essay workshop", "1 essay", "Unlimited"],
                  ["Essay revision passes", "—", "3 per essay"],
                  ["Counselor scheduling", "—", "5 vetted counselors"],
                  ["Side-by-side school compare", "—", "Up to 5 schools at once"],
                  ["Scholarship finder", "—", "Database of 2,400+ scholarships"],
                  ["Net-cost simulator", "—", "Per-school, with aid modeling"],
                  ["Parent / shared view", "—", "1 reviewer seat included"],
                ].map(([f, free, pro]) => (
                  <tr key={f}>
                    <td className="px-6 py-4 font-medium">{f}</td>
                    <td className="px-6 py-4 text-ink-600 dark:text-ink-400">{free}</td>
                    <td className="px-6 py-4">{pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="text-[11px] font-mono uppercase tracking-widest text-accent">/ Common questions</div>
            <h2 className="display mt-3 text-3xl md:text-4xl">If you've asked it, we've answered it.</h2>
          </div>
          <div className="lg:col-span-8 divide-y divide-ink-200/70 dark:divide-ink-800/70">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-6">
                <summary className="flex cursor-pointer items-center justify-between list-none">
                  <span className="font-display text-xl font-bold tracking-extra-tight">{item.q}</span>
                  <span className="font-mono text-[18px] text-ink-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600 dark:text-ink-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const FAQ = [
  { q: "Is the free plan really free?", a: "Yes. No card, no trial expiration. Free covers your top 3 school matches, the full major recommender, the timeline planner, and one essay workshop. Pro unlocks the rest." },
  { q: "Can I cancel Pro any time?", a: "Anytime. Cancellations stop renewal at the end of the billing cycle. You keep access to drafted essays and saved schools forever on Free." },
  { q: "How are counselor sessions billed?", a: "Pro includes scheduling and a 15% rate discount across all five counselors. Sessions themselves are billed separately by the counselor at their declared hourly rate." },
  { q: "What does Meridian know about me?", a: "Your profile lives in your browser by default. Sharing with a counselor or parent is opt-in and per-document. We never sell data." },
  { q: "Why a flat $14, not a per-application charge?", a: "Per-application pricing punishes the students who are most uncertain. A flat rate aligns our incentives with you exploring widely." },
];

function FeatureRow({ f, on, highlighted }: { f: string; on: boolean; highlighted?: boolean }) {
  return (
    <li className={`flex items-start gap-3 text-[14px] ${on ? "" : "opacity-50"}`}>
      {on ? (
        <Check size={16} weight="bold" className={highlighted ? "mt-0.5 text-accent" : "mt-0.5 text-accent"} />
      ) : (
        <X size={16} weight="bold" className="mt-0.5 opacity-60" />
      )}
      <span>{f}</span>
    </li>
  );
}
