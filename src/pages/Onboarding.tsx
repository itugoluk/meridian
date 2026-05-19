import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { useStore, type Profile } from "../store/useStore";
import { useCurrentAccount } from "../store/useAuth";

const SYSTEMS: Profile["system"][] = ["IB", "American", "A-Level", "GCSE", "Bachillerato", "Abitur"];
const GPA_LABELS: Record<Profile["system"], { hint: string; max: number; placeholder: string }> = {
  IB: { hint: "Predicted IB score out of 45", max: 45, placeholder: "e.g. 38" },
  American: { hint: "Unweighted GPA out of 4.0", max: 4.0, placeholder: "e.g. 3.85" },
  "A-Level": { hint: "Sum of A-Level grades (A*=4, A=3 ... · max 12 for 3 subjects)", max: 12, placeholder: "e.g. 11" },
  GCSE: { hint: "Average GCSE grade (out of 9)", max: 9, placeholder: "e.g. 7.5" },
  Bachillerato: { hint: "Bachillerato average (out of 10)", max: 10, placeholder: "e.g. 8.4" },
  Abitur: { hint: "German Abitur (1.0 best, 4.0 minimum)", max: 4.0, placeholder: "e.g. 1.8" },
};

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Netherlands", "Spain", "Singapore", "Australia",
  "Germany", "Switzerland", "France", "Ireland", "Italy", "Hong Kong", "Japan", "China",
  "United Arab Emirates", "Sweden", "Denmark", "Norway", "Belgium", "Austria", "South Korea",
  "India", "Taiwan", "Lebanon", "Saudi Arabia", "Israel",
];

const CLASS_SUGGESTIONS = [
  "Mathematics", "Computer Science", "Physics", "Chemistry", "Biology",
  "Economics", "History", "English", "Literature", "Geography",
  "Psychology", "Business", "Art", "Music", "Design Tech", "TOK",
  "Languages", "Media Studies", "Film", "Statistics",
];

const INTEREST_OPTIONS = [
  "technology", "ai", "coding", "math", "data", "finance", "business",
  "policy", "government", "international", "history", "writing", "reading",
  "literature", "art", "design", "film", "music", "sports", "science",
  "research", "medicine", "health", "psychology", "ethics", "environment",
];

const VIBE_OPTIONS = [
  "urban", "suburban", "rural", "small", "midsize", "large",
  "research", "liberal-arts", "tech", "humanities", "arts", "preprofessional",
];

const EXTRACURRICULAR_SUGGESTIONS = [
  "Debate team captain", "School newspaper editor", "Football varsity",
  "Model UN", "Robotics club", "Theater production lead", "Volunteer tutor",
  "Independent research", "Founded student org", "Coding portfolio",
];

const STEPS = ["Profile", "Academics", "Targets"];

export default function Onboarding() {
  const navigate = useNavigate();
  const setProfile = useStore((s) => s.setProfile);
  const account = useCurrentAccount();
  const existingProfile = useStore.getState().profile;
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Profile>(existingProfile ?? {
    name: account?.name ?? "",
    age: 16,
    grade: 11,
    location: "",
    system: "IB",
    gpa: 36,
    classes: [],
    targetCountries: [],
    interests: [],
    extracurriculars: [],
    vibePreferences: [],
    budgetUsd: undefined,
  });

  const canNext =
    (step === 0 && draft.name && draft.location) ||
    (step === 1 && draft.classes.length > 0 && draft.gpa > 0) ||
    (step === 2 && draft.targetCountries.length > 0 && draft.interests.length > 0);

  const submit = () => {
    setProfile(draft);
    navigate("/app");
  };

  return (
    <div className="min-h-[100dvh] bg-white dark:bg-ink-950">
      <header className="flex items-center justify-between border-b border-ink-200/70 px-6 py-4 dark:border-ink-800/70 lg:px-12">
        <Link to="/"><Logo /></Link>
        <ThemeToggle />
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[320px_1fr]">
        {/* Step sidebar */}
        <aside className="border-b border-ink-200/70 px-6 py-10 dark:border-ink-800/70 lg:border-b-0 lg:border-r lg:px-10 lg:py-16">
          <div className="text-[11px] font-mono uppercase tracking-widest text-accent">Setup</div>
          <h1 className="display mt-3 text-3xl md:text-4xl">Tell us where you stand.</h1>
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-600 dark:text-ink-400">
            Takes three minutes. Everything you enter shapes the recommendations across matches, majors, timeline, and essays.
          </p>

          <ol className="mt-12 space-y-5">
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-center gap-3">
                <div
                  className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-mono font-semibold transition-colors ${
                    i < step ? "bg-accent text-white" : i === step ? "bg-ink-950 text-white dark:bg-white dark:text-ink-950" : "border border-ink-200 text-ink-400 dark:border-ink-800"
                  }`}
                >
                  {i < step ? <Check size={12} weight="bold" /> : String(i + 1).padStart(2, "0")}
                </div>
                <span className={`text-[14px] font-medium ${i === step ? "text-ink-950 dark:text-white" : "text-ink-500"}`}>{label}</span>
              </li>
            ))}
          </ol>
        </aside>

        {/* Form area */}
        <section className="px-6 py-10 lg:px-16 lg:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl"
            >
              {step === 0 && (
                <div className="space-y-7">
                  <Field label="Full name" hint="We'll use your first name in the app.">
                    <input
                      autoFocus
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      placeholder="e.g. Mireia Sastre-Heinrichs"
                      className="input"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-5">
                    <Field label="Age">
                      <input
                        type="number"
                        min={13}
                        max={20}
                        value={draft.age}
                        onChange={(e) => setDraft({ ...draft, age: parseInt(e.target.value) || 16 })}
                        className="input"
                      />
                    </Field>
                    <Field label="Grade">
                      <SegmentedControl
                        options={[{ v: 9, l: "9" }, { v: 10, l: "10" }, { v: 11, l: "11" }, { v: 12, l: "12" }]}
                        value={draft.grade}
                        onChange={(v) => setDraft({ ...draft, grade: v as Profile["grade"] })}
                      />
                    </Field>
                  </div>

                  <Field label="Where are you based?" hint="City and country helps us factor regional schools.">
                    <input
                      value={draft.location}
                      onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                      placeholder="e.g. Madrid, Spain"
                      className="input"
                    />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-7">
                  <Field label="School system">
                    <SegmentedControl
                      options={SYSTEMS.map((s) => ({ v: s, l: s }))}
                      value={draft.system}
                      onChange={(v) => setDraft({ ...draft, system: v as Profile["system"], gpa: 0 })}
                    />
                  </Field>

                  <Field label={`${draft.system} grade`} hint={GPA_LABELS[draft.system].hint}>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={GPA_LABELS[draft.system].max}
                      value={draft.gpa || ""}
                      onChange={(e) => setDraft({ ...draft, gpa: parseFloat(e.target.value) || 0 })}
                      placeholder={GPA_LABELS[draft.system].placeholder}
                      className="input"
                    />
                  </Field>

                  <Field label="Classes you're taking" hint="Tap to add. We use these to score major fit.">
                    <ChipGrid
                      options={CLASS_SUGGESTIONS}
                      values={draft.classes}
                      onChange={(v) => setDraft({ ...draft, classes: v })}
                    />
                  </Field>

                  <Field label="Extracurriculars" hint="Sustained activities count more than one-offs.">
                    <ChipGrid
                      options={EXTRACURRICULAR_SUGGESTIONS}
                      values={draft.extracurriculars}
                      onChange={(v) => setDraft({ ...draft, extracurriculars: v })}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-5">
                    <Field label="SAT score" hint="Optional · 400–1600. Leave blank if test-optional.">
                      <input
                        type="number"
                        min={400}
                        max={1600}
                        step={10}
                        value={draft.satScore ?? ""}
                        onChange={(e) => setDraft({ ...draft, satScore: e.target.value ? parseInt(e.target.value) : undefined })}
                        placeholder="e.g. 1420"
                        className="input"
                      />
                    </Field>
                    <Field label="ACT score" hint="Optional · 1–36. Use SAT or ACT, not both.">
                      <input
                        type="number"
                        min={1}
                        max={36}
                        value={draft.actScore ?? ""}
                        onChange={(e) => setDraft({ ...draft, actScore: e.target.value ? parseInt(e.target.value) : undefined })}
                        placeholder="e.g. 32"
                        className="input"
                      />
                    </Field>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-7">
                  <Field label="Countries you'd consider" hint="Pick any number.">
                    <ChipGrid
                      options={COUNTRIES}
                      values={draft.targetCountries}
                      onChange={(v) => setDraft({ ...draft, targetCountries: v })}
                    />
                  </Field>

                  <Field label="What pulls you in?" hint="Pick at least three. Mix academic and lifestyle.">
                    <ChipGrid
                      options={INTEREST_OPTIONS}
                      values={draft.interests}
                      onChange={(v) => setDraft({ ...draft, interests: v })}
                    />
                  </Field>

                  <Field label="Campus vibe" hint="Optional. Shapes the fit but not the gate.">
                    <ChipGrid
                      options={VIBE_OPTIONS}
                      values={draft.vibePreferences}
                      onChange={(v) => setDraft({ ...draft, vibePreferences: v })}
                    />
                  </Field>

                  <Field label="Annual budget" hint="Net cost ceiling (post-aid). Leave blank to skip.">
                    <input
                      type="number"
                      value={draft.budgetUsd ?? ""}
                      onChange={(e) => setDraft({ ...draft, budgetUsd: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="e.g. 30000"
                      className="input"
                    />
                  </Field>
                </div>
              )}

              {/* Nav */}
              <div className="mt-12 flex items-center justify-between border-t border-ink-200/70 pt-7 dark:border-ink-800/70">
                <button
                  onClick={() => (step === 0 ? navigate(-1) : setStep((s) => s - 1))}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-900"
                >
                  <ArrowLeft size={14} weight="bold" /> Back
                </button>

                {step < STEPS.length - 1 ? (
                  <button
                    disabled={!canNext}
                    onClick={() => setStep((s) => s + 1)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-5 py-2.5 text-[14px] font-medium text-white transition-transform hover:-translate-y-px disabled:opacity-40 disabled:pointer-events-none dark:bg-white dark:text-ink-950"
                  >
                    Continue <ArrowRight size={14} weight="bold" />
                  </button>
                ) : (
                  <button
                    disabled={!canNext}
                    onClick={submit}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-white transition-transform hover:-translate-y-px disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Generate my plan <ArrowRight size={14} weight="bold" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-medium uppercase tracking-wider text-ink-500">{label}</label>
      {children}
      {hint && <span className="text-[12px] text-ink-500">{hint}</span>}
    </div>
  );
}

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { v: T; l: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-full border border-ink-200 bg-ink-50 p-1 dark:border-ink-800 dark:bg-ink-900">
      {options.map((opt) => (
        <button
          key={String(opt.v)}
          type="button"
          onClick={() => onChange(opt.v)}
          className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
            value === opt.v
              ? "bg-ink-950 text-white dark:bg-white dark:text-ink-950"
              : "text-ink-600 hover:text-ink-950 dark:text-ink-400 dark:hover:text-white"
          }`}
        >
          {opt.l}
        </button>
      ))}
    </div>
  );
}

function ChipGrid({ options, values, onChange }: { options: string[]; values: string[]; onChange: (v: string[]) => void }) {
  const toggle = (o: string) =>
    onChange(values.includes(o) ? values.filter((v) => v !== o) : [...values, o]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = values.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium capitalize transition-all active:scale-[0.97] ${
              on
                ? "border-ink-950 bg-ink-950 text-white dark:border-white dark:bg-white dark:text-ink-950"
                : "border-ink-200 text-ink-700 hover:border-ink-400 dark:border-ink-800 dark:text-ink-300 dark:hover:border-ink-600"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
