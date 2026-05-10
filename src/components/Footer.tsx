import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-ink-200/60 dark:border-ink-800/60">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-10 px-6 py-16 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="col-span-2 lg:col-span-5">
          <Logo />
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-500 dark:text-ink-400">
            A planner for the four years between now and your first day of college. Built by people who have read the rejection letters.
          </p>
        </div>

        <FooterCol title="Product">
          <FooterLink to="/auth?mode=signup">Get started</FooterLink>
          <FooterLink to="/app">App</FooterLink>
          <FooterLink to="/pricing">Pricing</FooterLink>
        </FooterCol>

        <FooterCol title="Resources">
          <FooterLink to="/manifesto">Manifesto</FooterLink>
          <FooterLink to="/counselors-public">For counselors</FooterLink>
          <FooterLink to="/pricing">Compare plans</FooterLink>
        </FooterCol>

        <FooterCol title="Company">
          <FooterLink to="/manifesto">About</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
          <FooterLink to="/auth?mode=signin">Sign in</FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-ink-200/60 dark:border-ink-800/60">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-6 text-[12px] text-ink-500 dark:text-ink-500 sm:flex-row sm:justify-between lg:px-12">
          <span>Meridian Planning, S.L. · Madrid · Singapore</span>
          <span className="font-mono uppercase tracking-widest">v 0.4.2 · build 2026.05</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="col-span-1 lg:col-span-2">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-ink-400">{title}</div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-[14px] text-ink-700 hover:text-ink-950 dark:text-ink-300 dark:hover:text-white transition-colors">
      {children}
    </Link>
  );
}
