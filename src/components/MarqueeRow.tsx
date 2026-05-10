import { memo } from "react";

const SCHOOLS = [
  "Stanford", "Oxford", "MIT", "Cambridge", "Yale", "Imperial College", "ETH Zürich",
  "Princeton", "NUS", "LSE", "UC Berkeley", "Toronto", "TU Delft", "Penn", "TU München",
  "Columbia", "McGill", "UCL", "Harvard", "Duke", "UBC", "Melbourne", "Carnegie Mellon",
];

export const MarqueeRow = memo(function MarqueeRow() {
  const items = [...SCHOOLS, ...SCHOOLS];
  return (
    <div className="mask-fade-x overflow-hidden py-1">
      <div className="animate-marquee flex w-max gap-12 pr-12">
        {items.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="whitespace-nowrap font-display text-[28px] md:text-[34px] font-extrabold tracking-extra-tight text-ink-300 dark:text-ink-700"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
});
