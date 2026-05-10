import { cn } from "../lib/cn";

export function Logo({ className, size = 22 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 1 V31" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 8 C 10 14, 22 18, 28 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="16" r="2.2" fill="currentColor" />
      </svg>
      <span className="font-display text-[17px] font-extrabold tracking-extra-tight">Meridian</span>
    </span>
  );
}
