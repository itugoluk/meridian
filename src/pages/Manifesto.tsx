import { MarketingNav } from "../components/MarketingNav";
import { Footer } from "../components/Footer";

export default function Manifesto() {
  return (
    <div className="min-h-[100dvh] bg-white dark:bg-ink-950">
      <MarketingNav />
      <article className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
        <div className="text-[11px] font-mono uppercase tracking-widest text-accent">/ Manifesto</div>
        <h1 className="display mt-3 text-5xl md:text-6xl">College advice is broken.</h1>
        <div className="prose mt-10 space-y-6 text-[17px] leading-relaxed text-ink-700 dark:text-ink-300">
          <p>The market for telling a 17-year-old where to apply has two shapes: a $40,000 per-cycle private counselor, or a Reddit thread written by someone who applied once and got in.</p>
          <p>Both are bad in opposite ways. The first prices out 95% of families. The second dispenses mythology recycled from people whose advice survives only because they got lucky.</p>
          <p>We started Meridian because the middle is empty. Software that absorbs your context &mdash; your school system, your country, your interests, your budget &mdash; and turns it into a real plan. Not affirmations. Not vague "build your brand" platitudes. A list, a calendar, an essay scaffold, in that order.</p>
          <p className="font-display text-2xl font-bold leading-snug tracking-extra-tight text-ink-950 dark:text-white">
            "If you can't pay $40,000 for advice, you should still get a real plan."
          </p>
          <p>So the free tier is genuinely useful. Three matches, full majors, full timeline, first essay. That's enough for most students to finish their list and start drafting. Pro is for unlimited iterations, vetted human counselors, and the moments where software cannot replace a person who has read 14,000 applications.</p>
          <p>We don't take a cut of your counselor sessions. We don't sell your data. We don't trade affiliate links with universities. The business model is simple: charge people who want depth, give the floor away.</p>
          <p>If we do this right, the experience of applying to college becomes less of a closed-door ritual and more of an open process. That's the goal. Everything else is product.</p>
          <p className="border-t border-ink-200 pt-6 text-[14px] text-ink-500 dark:border-ink-800 dark:text-ink-500">
            &mdash; Meridian Planning, S.L. · Spring 2026
          </p>
        </div>
      </article>
      <Footer />
    </div>
  );
}
