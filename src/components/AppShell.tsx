import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, Calendar, Compass, GraduationCap, House, PaperPlaneTilt, SquaresFour, UserCircle, Sparkle } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { useStore } from "../store/useStore";
import { cn } from "../lib/cn";

const NAV = [
  { to: "/app", label: "Overview", icon: House, end: true },
  { to: "/app/matches", label: "College Match", icon: SquaresFour },
  { to: "/app/majors", label: "Majors", icon: Compass },
  { to: "/app/timeline", label: "Timeline", icon: Calendar },
  { to: "/app/essays", label: "Essays", icon: PaperPlaneTilt },
  { to: "/app/counselors", label: "Counselors", icon: GraduationCap, pro: true },
];

export function AppShell() {
  const profile = useStore((s) => s.profile);
  const isPro = useStore((s) => s.isPro);
  const location = useLocation();

  return (
    <div className="grid min-h-[100dvh] grid-cols-1 lg:grid-cols-[260px_1fr] bg-white dark:bg-ink-950">
      <aside className="hidden lg:flex flex-col border-r border-ink-200/70 dark:border-ink-800/70 px-6 py-7">
        <Link to="/" className="mb-9 inline-flex">
          <Logo />
        </Link>

        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV.map(({ to, label, icon: Icon, end, pro }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors",
                  isActive
                    ? "bg-ink-100 text-ink-950 dark:bg-ink-900 dark:text-white"
                    : "text-ink-500 hover:bg-ink-50 hover:text-ink-900 dark:hover:bg-ink-900/50 dark:hover:text-white"
                )
              }
            >
              <span className="flex items-center gap-3">
                <Icon size={17} weight="duotone" />
                {label}
              </span>
              {pro && !isPro && (
                <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  Pro
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 space-y-3">
          {!isPro && (
            <Link
              to="/pricing"
              className="block rounded-2xl border border-ink-200/70 bg-ink-50 p-4 transition-colors hover:bg-ink-100 dark:border-ink-800/70 dark:bg-ink-900 dark:hover:bg-ink-800/70"
            >
              <div className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                <Sparkle size={12} weight="fill" /> Meridian Pro
              </div>
              <div className="text-[13px] font-medium leading-snug text-ink-900 dark:text-white">
                Unlimited matches, essays, & counselor scheduling.
              </div>
              <div className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-medium text-ink-700 dark:text-ink-300">
                See plans <ArrowUpRight size={12} weight="bold" />
              </div>
            </Link>
          )}
          <Link to="/app/profile" className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-ink-50 dark:hover:bg-ink-900">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent/80 to-accent-deep text-[12px] font-semibold text-white">
              {profile ? profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("") : <UserCircle size={18} />}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-medium text-ink-900 dark:text-white">
                {profile?.name ?? "Guest"}
              </div>
              <div className="truncate text-[11px] text-ink-500 dark:text-ink-400">
                {isPro ? "Pro plan" : "Free plan"}
              </div>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-200/60 dark:border-ink-800/60 bg-white/85 dark:bg-ink-950/85 backdrop-blur-xl px-6 py-4 lg:px-12">
          <div className="lg:hidden"><Link to="/" className="inline-flex"><Logo /></Link></div>
          <div className="hidden lg:block">
            <Crumb path={location.pathname} />
          </div>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full border border-ink-200/70 bg-white/95 px-2 py-1.5 shadow-soft backdrop-blur-xl dark:border-ink-800/70 dark:bg-ink-900/95">
        <div className="flex items-center gap-0.5">
          {NAV.slice(0, 5).map(({ to, icon: Icon, end, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              aria-label={label}
              className={({ isActive }) =>
                cn(
                  "grid h-10 w-10 place-items-center rounded-full transition-colors",
                  isActive ? "bg-ink-950 text-white dark:bg-white dark:text-ink-950" : "text-ink-500"
                )
              }
            >
              <Icon size={18} weight="duotone" />
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

function Crumb({ path }: { path: string }) {
  const segments = path.split("/").filter(Boolean);
  if (segments.length <= 1) return <span className="text-[13px] font-mono uppercase tracking-widest text-ink-400">App / Overview</span>;
  const last = segments[segments.length - 1];
  const labels: Record<string, string> = {
    matches: "College Match",
    majors: "Major Explorer",
    timeline: "Timeline",
    essays: "Essay Workshop",
    counselors: "Counselors",
    profile: "Profile",
  };
  return (
    <span className="text-[13px] font-mono uppercase tracking-widest text-ink-400">
      App / {labels[last] ?? last}
    </span>
  );
}
