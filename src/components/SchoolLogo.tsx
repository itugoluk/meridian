import { useState } from "react";

type Props = {
  website?: string;
  name: string;
  acronym?: string;
  logoUrl?: string;
  size?: number;
  className?: string;
};

const CONNECTORS = new Set([
  "of", "and", "the", "at", "in", "on", "for", "de", "del", "della", "du", "y",
]);

function deriveAcronym(name: string): string {
  let n = name.replace(/^(The|Université|Universidad|Università|Universität|École|Universita)\s+/i, "");
  const words = n.split(/[\s\-,—–]+/).filter(Boolean);
  const sig = words.filter((w) => /^[A-Z]/.test(w) && !CONNECTORS.has(w.toLowerCase()));
  if (sig.length === 0) return n.slice(0, 4).toUpperCase();
  if (sig.length === 1) return sig[0].slice(0, 4).toUpperCase();
  const initials = sig.slice(0, 4).map((w) => w[0]).join("");
  return initials.toUpperCase();
}

export function SchoolLogo({ website, name, acronym, logoUrl, size = 32, className = "" }: Props) {
  const [errored, setErrored] = useState(false);
  const imageSrc = logoUrl ?? (website ? `https://icons.duckduckgo.com/ip3/${website}.ico` : null);
  const showFallback = !imageSrc || errored;

  if (showFallback) {
    const label = acronym ?? deriveAcronym(name);
    const fontSize = label.length >= 4 ? 9 : label.length === 3 ? 11 : 13;
    return (
      <div
        style={{ width: size, height: size }}
        className={`grid shrink-0 place-items-center rounded-md border border-ink-200 bg-white font-mono font-semibold uppercase tracking-tight text-ink-700 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-300 ${className}`}
      >
        <span style={{ fontSize }}>{label}</span>
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`grid shrink-0 place-items-center overflow-hidden rounded-md border border-ink-200 bg-white dark:border-ink-800 dark:bg-white ${className}`}
    >
      <img
        src={imageSrc!}
        alt=""
        width={size - 6}
        height={size - 6}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setErrored(true)}
        style={{ maxWidth: size - 6, maxHeight: size - 6 }}
        className="object-contain"
      />
    </div>
  );
}
