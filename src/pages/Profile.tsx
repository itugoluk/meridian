import { Link } from "react-router-dom";
import { Sparkle, Warning } from "@phosphor-icons/react";
import { useStore } from "../store/useStore";

export default function Profile() {
  const profile = useStore((s) => s.profile);
  const isPro = useStore((s) => s.isPro);
  const reset = useStore((s) => s.reset);
  const downgrade = useStore((s) => s.downgrade);

  if (!profile) {
    return (
      <div className="px-6 py-32 text-center">
        <h2 className="display text-3xl">No profile yet.</h2>
        <Link to="/onboarding" className="mt-6 inline-flex h-11 items-center rounded-full bg-ink-950 px-5 text-white dark:bg-white dark:text-ink-950">Start onboarding</Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 lg:px-12 lg:py-14 max-w-[1400px] mx-auto pb-32 lg:pb-20">
      <div className="mb-10">
        <div className="text-[11px] font-mono uppercase tracking-widest text-accent">Profile</div>
        <h1 className="display mt-2 text-4xl md:text-5xl">{profile.name}</h1>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-ink-200 px-3 py-1 text-[12px] font-mono uppercase tracking-widest text-ink-600 dark:border-ink-800 dark:text-ink-400">
          {isPro ? <><Sparkle size={11} weight="fill" className="text-accent" /> Meridian Pro</> : "Free plan"}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Grade" value={`Grade ${profile.grade}`} />
        <Field label="School system" value={profile.system} />
        <Field label="Location" value={profile.location || "—"} />
        <Field label="Grade average" value={profile.gpa.toString()} />
        <Field label="Classes" value={profile.classes.join(", ") || "—"} />
        <Field label="Target countries" value={profile.targetCountries.join(", ") || "—"} />
        <Field label="Interests" value={profile.interests.join(", ") || "—"} />
        <Field label="Extracurriculars" value={profile.extracurriculars.join(", ") || "—"} />
        <Field label="Campus vibe" value={profile.vibePreferences.join(", ") || "—"} />
        <Field label="Annual budget" value={profile.budgetUsd ? `$${profile.budgetUsd.toLocaleString()}` : "—"} />
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link to="/onboarding" className="inline-flex h-11 items-center rounded-full bg-ink-950 px-5 text-[14px] font-medium text-white dark:bg-white dark:text-ink-950">
          Re-run onboarding
        </Link>
        {isPro && (
          <button onClick={downgrade} className="inline-flex h-11 items-center rounded-full border border-ink-200 px-5 text-[14px] font-medium dark:border-ink-800">
            Downgrade to Free
          </button>
        )}
      </div>

      <div className="mt-12 rounded-2xl border border-accent/30 bg-accent-soft/20 p-5 dark:bg-accent/5">
        <div className="flex items-start gap-3">
          <Warning size={18} weight="duotone" className="mt-0.5 shrink-0 text-accent" />
          <div className="flex-1">
            <div className="text-[14px] font-medium text-ink-900 dark:text-white">Reset everything</div>
            <p className="mt-1 text-[13px] text-ink-600 dark:text-ink-400">Wipes profile, saved schools, essays, and plan. Cannot be undone.</p>
            <button onClick={reset} className="mt-3 inline-flex h-9 items-center rounded-full bg-accent px-4 text-[12.5px] font-medium text-white">
              Wipe local data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white p-5 dark:border-ink-800/70 dark:bg-ink-900">
      <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
      <div className="mt-1.5 text-[15px] capitalize">{value}</div>
    </div>
  );
}
