import { Link, NavLink } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { useEffect } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useStore } from "../store/useStore";

export function MarketingNav() {
  const profile = useStore((s) => s.profile);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/60 bg-white/85 backdrop-blur-xl dark:border-ink-800/60 dark:bg-ink-950/85">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-12">
        <Link to="/" className="inline-flex"><Logo /></Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/pricing">Pricing</NavItem>
          <NavItem to="/manifesto">Manifesto</NavItem>
          <NavItem to="/counselors-public">For counselors</NavItem>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to={profile ? "/app" : "/onboarding"}
            className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-full bg-ink-950 px-4 text-[13px] font-medium text-white transition-transform hover:-translate-y-px dark:bg-white dark:text-ink-950"
          >
            <MagneticInline>{profile ? "Open app" : "Start free"}</MagneticInline>
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-1.5 text-[13px] font-medium transition-colors ${
          isActive ? "text-ink-950 dark:text-white" : "text-ink-500 hover:text-ink-900 dark:hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function MagneticInline({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const tx = useTransform(x, (v) => v * 0.25);
  useEffect(() => {
    const c = animate(x, [0, 0], { duration: 0 });
    return () => c.stop();
  }, [x]);
  return <motion.span style={{ x: tx }}>{children}</motion.span>;
}
