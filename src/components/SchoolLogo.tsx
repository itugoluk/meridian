import { useState } from "react";

type Props = {
  website?: string;
  name: string;
  size?: number;
  className?: string;
};

function monogramFor(name: string): string {
  const stripped = name
    .replace(/^(The|University of|Universidad de|Universidad|Université|Università|Universität)\s+/i, "")
    .replace(/\s+(University|College|Institute of Technology|Institute|School|Polytechnique)$/i, "");
  const tokens = stripped.split(/[\s\-]+/).filter(Boolean);
  if (tokens.length >= 2) return (tokens[0][0] + tokens[1][0]).toUpperCase();
  const first = tokens[0] ?? name;
  return first.slice(0, 2).toUpperCase();
}

export function SchoolLogo({ website, name, size = 32, className = "" }: Props) {
  const [errored, setErrored] = useState(false);
  const showFallback = !website || errored;

  if (showFallback) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`grid shrink-0 place-items-center rounded-md border border-ink-200 bg-white text-[10px] font-mono font-semibold text-ink-700 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-300 ${className}`}
      >
        {monogramFor(name)}
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`grid shrink-0 place-items-center overflow-hidden rounded-md border border-ink-200 bg-white dark:border-ink-800 dark:bg-white ${className}`}
    >
      <img
        src={`https://www.google.com/s2/favicons?domain=${website}&sz=128`}
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
