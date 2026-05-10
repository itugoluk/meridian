import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, EnvelopeSimple, Eye, EyeSlash, Lock, User, Warning } from "@phosphor-icons/react";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../store/useAuth";
import { useStore } from "../store/useStore";

type Mode = "signin" | "signup";

export default function Auth() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode: Mode = (params.get("mode") as Mode) === "signin" ? "signin" : "signup";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const signUp = useAuth((s) => s.signUp);
  const signIn = useAuth((s) => s.signIn);
  const profile = useStore((s) => s.profile);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setParams({ mode: next });
  };

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 250)); // pseudo-network for feedback weight
    const result = mode === "signup" ? signUp(email, password, name) : signIn(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    // After signup, go to onboarding; after signin, route based on whether profile exists.
    if (mode === "signup") navigate("/onboarding");
    else navigate(useAuth.getState().accounts[email.trim().toLowerCase()]?.profile || profile ? "/app" : "/onboarding");
  };

  return (
    <div className="min-h-[100dvh] bg-white dark:bg-ink-950">
      <header className="flex items-center justify-between border-b border-ink-200/70 px-6 py-4 dark:border-ink-800/70 lg:px-12">
        <Link to="/"><Logo /></Link>
        <ThemeToggle />
      </header>

      <div className="mx-auto grid min-h-[calc(100dvh-65px)] max-w-[1400px] grid-cols-1 lg:grid-cols-2">
        {/* Left — editorial copy */}
        <div className="hidden lg:flex flex-col justify-between border-r border-ink-200/70 px-12 py-16 dark:border-ink-800/70">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-accent">{mode === "signup" ? "/ New account" : "/ Welcome back"}</div>
            <h1 className="display mt-3 text-5xl">
              {mode === "signup" ? "Three minutes to a real plan." : "Pick up where you left off."}
            </h1>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-ink-600 dark:text-ink-400">
              {mode === "signup"
                ? "Your profile, school list, essays, and timeline live in one place — and stay private to you until you opt in to share with a counselor or parent."
                : "Your matches, essays, and timeline are saved to your account. Sign in to keep going."}
            </p>
          </div>
          <ul className="space-y-3 text-[13.5px] text-ink-700 dark:text-ink-300">
            <li className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              35 universities indexed across 9 countries
            </li>
            <li className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Calibrated for IB, American, A-Level, Bachillerato, Abitur, GCSE
            </li>
            <li className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Free tier covers the first 90% of the application
            </li>
          </ul>
        </div>

        {/* Right — form */}
        <div className="flex items-center justify-center px-6 py-14 lg:px-16">
          <div className="w-full max-w-sm">
            <h2 className="font-display text-3xl font-bold tracking-extra-tight md:text-4xl">
              {mode === "signup" ? "Create your account" : "Sign in"}
            </h2>
            <p className="mt-2 text-[14px] text-ink-500 dark:text-ink-400">
              {mode === "signup"
                ? "Already have an account?"
                : "New to Meridian?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(mode === "signup" ? "signin" : "signup")}
                className="font-medium text-ink-950 underline-offset-4 hover:underline dark:text-white"
              >
                {mode === "signup" ? "Sign in" : "Create one"}
              </button>
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); submit(); }}
              className="mt-8 space-y-4"
            >
              <AnimatePresence initial={false}>
                {mode === "signup" && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  >
                    <FormField label="Full name" icon={User}>
                      <input
                        autoFocus={mode === "signup"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mireia Sastre-Heinrichs"
                        className="input pl-10"
                        autoComplete="name"
                      />
                    </FormField>
                  </motion.div>
                )}
              </AnimatePresence>

              <FormField label="Email" icon={EnvelopeSimple}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  className="input pl-10"
                  autoComplete="email"
                  autoFocus={mode === "signin"}
                />
              </FormField>

              <FormField label="Password" icon={Lock}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
                  className="input pl-10 pr-11"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-3 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeSlash size={16} weight="duotone" /> : <Eye size={16} weight="duotone" />}
                </button>
              </FormField>

              {error && (
                <div className="flex items-start gap-2 rounded-2xl border border-accent/30 bg-accent-soft/30 px-3.5 py-2.5 text-[13px] text-accent dark:bg-accent/10">
                  <Warning size={15} weight="duotone" className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !email || !password || (mode === "signup" && !name)}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink-950 px-6 text-[15px] font-medium text-white transition-transform hover:-translate-y-px disabled:pointer-events-none disabled:opacity-50 dark:bg-white dark:text-ink-950"
              >
                {submitting ? (
                  <span className="h-3 w-3 animate-breathe rounded-full bg-current opacity-60" />
                ) : (
                  <>
                    {mode === "signup" ? "Create account" : "Sign in"}
                    <ArrowRight size={14} weight="bold" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-[12px] leading-relaxed text-ink-500">
              By continuing you agree to Meridian's beta terms. Accounts are stored locally in your browser during the beta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; weight?: "duotone" | "regular" | "bold" | "fill"; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11.5px] font-medium uppercase tracking-wider text-ink-500">{label}</label>
      <div className="relative">
        <Icon size={16} weight="duotone" className="absolute left-3.5 top-3.5 text-ink-400 pointer-events-none" />
        {children}
      </div>
    </div>
  );
}
