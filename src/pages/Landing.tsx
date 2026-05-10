import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Calendar, CheckCircle, Compass, GraduationCap,
  PaperPlaneTilt, SquaresFour, Sparkle, ChartLineUp,
} from "@phosphor-icons/react";
import { MarketingNav } from "../components/MarketingNav";
import { Footer } from "../components/Footer";
import { MarqueeRow } from "../components/MarqueeRow";
import { HeroPanel } from "../components/HeroPanel";

export default function Landing() {
  return (
    <div className="min-h-[100dvh] bg-white text-ink-950 dark:bg-ink-950 dark:text-ink-100">
      <MarketingNav />

      {/* HERO — asymmetric 7/5 split */}
      <section className="relative">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 pb-20 pt-16 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:pt-24">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-ink-200 px-3 py-1.5 text-[12px] font-mono uppercase tracking-widest text-ink-600 dark:border-ink-800 dark:text-ink-400"
            >
              <Sparkle size={12} weight="fill" className="text-accent" /> 2026 application cycle is open
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="display text-[44px] sm:text-[56px] md:text-[72px] lg:text-[84px]"
            >
              Plot the route from <em className="not-italic font-normal italic text-ink-500">where you are</em> to the campus you'll actually thrive on.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-600 dark:text-ink-400"
            >
              Meridian is a planner built for high schoolers navigating university, majors, and the four years it takes to get there. Personalized recommendations across IB, American, A-Level, and Bachillerato systems &mdash; without the noise of college Reddit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/auth?mode=signup"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-ink-950 px-6 text-[15px] font-medium text-white transition-transform hover:-translate-y-px active:scale-[0.98] dark:bg-white dark:text-ink-950"
              >
                Start your plan <ArrowRight size={15} weight="bold" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-ink-200 px-5 text-[15px] font-medium text-ink-900 transition-colors hover:bg-ink-50 dark:border-ink-800 dark:text-ink-100 dark:hover:bg-ink-900"
              >
                See pricing <ArrowUpRight size={15} weight="bold" />
              </Link>
              <span className="text-[13px] text-ink-500">Free forever for core matching.</span>
            </motion.div>

            {/* Inline stats — no boxes */}
            <div className="mt-14 grid grid-cols-3 gap-y-4 border-t border-ink-200/70 pt-7 dark:border-ink-800/70">
              <Stat n="38" label="Schools indexed" />
              <Stat n="6" label="School systems" />
              <Stat n="9" label="Countries" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroPanel />
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] border-y border-ink-200/70 px-6 py-7 dark:border-ink-800/70 lg:px-12">
          <div className="mb-4 flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-ink-500">
            <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" /> Helping students apply to <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
          </div>
          <MarqueeRow />
        </div>
      </section>

      {/* FEATURES — asymmetric bento, no 3-equal cards */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
        <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="text-[11px] font-mono uppercase tracking-widest text-accent">/ 01 — Services</div>
            <h2 className="display mt-3 text-4xl md:text-5xl">Everything between freshman year and your first dorm move-in.</h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[16px] leading-relaxed text-ink-600 dark:text-ink-400">
              Six purpose-built tools that share one profile. Edit your interests, and your matches, majors, timeline, and essay angles update in lockstep. No more juggling spreadsheets and forum threads.
            </p>
          </div>
        </div>

        {/* Bento: 1 wide + 2 tall, then 2 split */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
          <FeatureCard
            className="md:col-span-4 md:row-span-2"
            icon={SquaresFour}
            kicker="Core"
            title="College Match"
            description="Weighted recommendations across 38 universities in 9 countries. Reach / Target / Likely tiering, transparent reasoning, and a portfolio-balance audit. Free for the first three matches."
          >
            <MatchPreview />
          </FeatureCard>

          <FeatureCard
            className="md:col-span-2"
            icon={Compass}
            kicker="Core"
            title="Major Explorer"
            description="Tag your interests and courses, see the fit-scored majors that fit. Includes minor pairings and starting-salary medians."
          />

          <FeatureCard
            className="md:col-span-2"
            icon={Calendar}
            kicker="Core"
            title="Timeline"
            description="A grade-by-grade application calendar adjusted to your year. Pulls deadlines from your saved schools."
          />

          <FeatureCard
            className="md:col-span-3"
            icon={PaperPlaneTilt}
            kicker="Workshop"
            title="Essay drafts that don't sound like ChatGPT"
            description="Brainstorm → outline → draft, with structural critique at each step. One slot free, unlimited on Pro."
          />

          <FeatureCard
            className="md:col-span-3"
            icon={GraduationCap}
            kicker="Pro"
            pro
            title="Book counselors who've been on the admit side"
            description="Five vetted counselors with declared admit-rate records. Real availability, real video calls, no commission games."
          />
        </div>
      </section>

      {/* DIFFERENTIATOR — split scroll */}
      <section className="border-t border-ink-200/70 dark:border-ink-800/70">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-12 lg:gap-16 lg:px-12">
          <div className="lg:col-span-4">
            <div className="text-[11px] font-mono uppercase tracking-widest text-accent">/ 02 — Why this exists</div>
            <h2 className="display mt-3 text-4xl md:text-5xl">College advice is broken in two opposite directions.</h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="space-y-5 text-[16px] leading-relaxed text-ink-700 dark:text-ink-300">
              <p>On one end: $40,000-per-cycle private counselors that price out 95% of families.</p>
              <p>On the other: free forums dispensing recycled mythology, written by people who applied once and won the lottery.</p>
              <p className="text-ink-950 dark:text-white">
                Meridian is the middle: structured, opinionated software that absorbs your context and walks you through every decision. Pro adds humans &mdash; counselors with verified records &mdash; for the moments software cannot replace.
              </p>
              <ul className="space-y-2.5 pt-3">
                <Bullet>Personalized to IB, American, A-Level, Bachillerato, Abitur, and GCSE grading.</Bullet>
                <Bullet>Net-cost-first ranking, not sticker-price theater.</Bullet>
                <Bullet>International student acceptance modeled separately from overall rates.</Bullet>
                <Bullet>Your data stays on your device unless you opt in to share with a counselor.</Bullet>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING TEASE */}
      <section className="border-t border-ink-200/70 dark:border-ink-800/70">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="text-[11px] font-mono uppercase tracking-widest text-accent">/ 03 — Pricing</div>
              <h2 className="display mt-3 text-4xl md:text-5xl">Free for matching. Pay for depth.</h2>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-600 dark:text-ink-400">
                The free tier handles the first 90% of the process. Pro unlocks unlimited applications, counselor sessions, scholarship search, and side-by-side compare.
              </p>
              <Link
                to="/pricing"
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-ink-950 px-6 text-[15px] font-medium text-white transition-transform hover:-translate-y-px dark:bg-white dark:text-ink-950"
              >
                Compare plans <ArrowRight size={15} weight="bold" />
              </Link>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MiniPlan
                tier="Free"
                price="0"
                bullets={["3 school matches", "Major recommendations", "Timeline planner", "1 essay workshop"]}
              />
              <MiniPlan
                tier="Pro"
                price="14"
                period="/month"
                highlighted
                bullets={["Unlimited matches & compare", "Unlimited essays + revisions", "Counselor scheduling", "Scholarship finder", "Net-cost simulator"]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA — asymmetric */}
      <section className="border-t border-ink-200/70 dark:border-ink-800/70">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-24 lg:grid-cols-12 lg:gap-16 lg:px-12">
          <div className="lg:col-span-8">
            <h2 className="display text-4xl md:text-6xl">
              Three minutes to a list. <span className="text-ink-400">Four years to use it.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:flex lg:items-end lg:justify-end">
            <Link
              to="/auth?mode=signup"
              className="inline-flex h-14 items-center gap-2 rounded-full bg-ink-950 px-7 text-[16px] font-medium text-white transition-transform hover:-translate-y-px dark:bg-white dark:text-ink-950"
            >
              Build your plan <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl md:text-4xl font-extrabold tracking-extra-tight">{n}</div>
      <div className="mt-1 text-[12px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle size={18} weight="duotone" className="mt-0.5 shrink-0 text-accent" />
      <span>{children}</span>
    </li>
  );
}

function FeatureCard({
  className = "",
  icon: Icon,
  kicker,
  title,
  description,
  children,
  pro,
}: {
  className?: string;
  icon: React.ComponentType<{ size?: number; weight?: "duotone" | "regular" | "bold" | "fill" }>;
  kicker: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  pro?: boolean;
}) {
  return (
    <article className={`group relative overflow-hidden rounded-3xl border border-ink-200/70 bg-white p-8 transition-colors hover:bg-ink-50/50 dark:border-ink-800/70 dark:bg-ink-900 dark:hover:bg-ink-900/70 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest">
          <Icon size={14} weight="duotone" />
          <span className={pro ? "text-accent" : "text-ink-500"}>{kicker}</span>
        </div>
        {pro && (
          <span className="rounded-full border border-accent/30 bg-accent-soft/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent dark:bg-accent/10">
            Pro
          </span>
        )}
      </div>
      <h3 className="font-display mt-6 text-[26px] font-bold tracking-extra-tight leading-tight">{title}</h3>
      <p className="mt-3 max-w-prose text-[14.5px] leading-relaxed text-ink-600 dark:text-ink-400">{description}</p>
      {children && <div className="mt-7">{children}</div>}
    </article>
  );
}

function MatchPreview() {
  const items = [
    { name: "UC Berkeley", verdict: "Target", fit: 78 },
    { name: "TU Delft", verdict: "Likely", fit: 91 },
    { name: "Princeton", verdict: "Reach", fit: 64 },
  ];
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-ink-50/60 p-2 dark:border-ink-800/70 dark:bg-ink-950/40">
      {items.map((i) => (
        <div key={i.name} className="flex items-center justify-between border-b border-ink-200/60 px-3 py-2.5 last:border-b-0 dark:border-ink-800/60">
          <div className="flex items-center gap-3">
            <ChartLineUp size={14} weight="duotone" className="text-ink-400" />
            <span className="text-[14px] font-medium">{i.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-500">{i.verdict}</span>
            <span className="font-mono text-[14px] tabular-nums font-medium">{i.fit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniPlan({ tier, price, period = "", bullets, highlighted = false }: { tier: string; price: string; period?: string; bullets: string[]; highlighted?: boolean }) {
  return (
    <div className={`rounded-3xl border p-7 ${highlighted ? "border-ink-950 bg-ink-950 text-white dark:border-white dark:bg-white dark:text-ink-950" : "border-ink-200 dark:border-ink-800"}`}>
      <div className="flex items-baseline justify-between">
        <span className={`text-[11px] font-mono uppercase tracking-widest ${highlighted ? "text-white/60 dark:text-ink-500" : "text-ink-500"}`}>{tier}</span>
        <div className="font-display text-3xl font-extrabold tracking-extra-tight">
          ${price}<span className="ml-0.5 text-[13px] font-mono font-medium opacity-60">{period}</span>
        </div>
      </div>
      <ul className="mt-6 space-y-2">
        {bullets.map((b) => (
          <li key={b} className={`flex items-start gap-2.5 text-[13.5px] leading-snug ${highlighted ? "text-white/85 dark:text-ink-900" : "text-ink-700 dark:text-ink-300"}`}>
            <CheckCircle size={15} weight="duotone" className="mt-0.5 shrink-0 opacity-80" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
