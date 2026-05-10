import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, CheckCircle, Globe, MapPin, Star, VideoCamera } from "@phosphor-icons/react";
import { useStore } from "../store/useStore";
import { COUNSELORS, type Counselor } from "../data/counselors";
import { ProLock } from "../components/ProLock";

function indefiniteArticle(word: string) {
  if (!word) return "a ";
  return /^[aeiouAEIOU]/.test(word) ? "an " : "a ";
}

function nextDays(n: number) {
  const days = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 1; i <= n; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

const SLOT_TIMES = ["09:30", "11:00", "14:00", "16:30", "18:00"];

export default function Counselors() {
  const isPro = useStore((s) => s.isPro);
  const profile = useStore((s) => s.profile);
  const [selected, setSelected] = useState<Counselor | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const days = useMemo(() => nextDays(8), []);

  if (!isPro) {
    return (
      <div className="px-6 py-14 lg:px-12 max-w-[1400px] mx-auto pb-32 lg:pb-20">
        <div className="mb-8">
          <div className="text-[11px] font-mono uppercase tracking-widest text-accent">Counselors</div>
          <h1 className="display mt-2 text-4xl md:text-5xl">Humans for the moments software can't replace.</h1>
        </div>
        <ProLock
          title="Counselor scheduling is a Pro feature"
          description="Five vetted counselors with verified admit-rate records. Real availability, real video calls, no commission games. Available on the Pro plan."
        />
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {COUNSELORS.slice(0, 4).map((c) => (
            <PreviewCard key={c.id} counselor={c} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 lg:px-12 lg:py-14 max-w-[1400px] mx-auto pb-32 lg:pb-20">
      <div className="mb-10">
        <div className="text-[11px] font-mono uppercase tracking-widest text-accent">Counselors</div>
        <h1 className="display mt-2 text-4xl md:text-5xl">Book a 50-minute session.</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500 dark:text-ink-400">
          All five counselors have read at least one application from {indefiniteArticle(profile?.system ?? "your")}{profile?.system ?? "your"}-system student in the past year.
        </p>
      </div>

      {!selected ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {COUNSELORS.map((c) => (
            <CounselorCard key={c.id} counselor={c} onClick={() => setSelected(c)} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <button onClick={() => { setSelected(null); setDay(null); setSlot(null); setConfirmed(false); }} className="mb-4 text-[12px] font-mono uppercase tracking-widest text-ink-500 hover:text-ink-950 dark:hover:text-white">← All counselors</button>
            <Profile counselor={selected} />
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!confirmed ? (
                <motion.div
                  key="booking"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-3xl border border-ink-200/70 bg-white p-7 dark:border-ink-800/70 dark:bg-ink-900"
                >
                  <h3 className="font-display text-2xl font-bold tracking-extra-tight">Choose a date</h3>
                  <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-8">
                    {days.map((d) => {
                      const active = day?.toDateString() === d.toDateString();
                      return (
                        <button
                          key={d.toISOString()}
                          onClick={() => { setDay(d); setSlot(null); }}
                          className={`flex flex-col items-center rounded-2xl border py-3 transition-colors ${
                            active ? "border-ink-950 bg-ink-950 text-white dark:border-white dark:bg-white dark:text-ink-950" : "border-ink-200 hover:border-ink-400 dark:border-ink-800"
                          }`}
                        >
                          <span className="text-[10px] font-mono uppercase tracking-widest opacity-70">
                            {d.toLocaleDateString(undefined, { weekday: "short" })}
                          </span>
                          <span className="font-display mt-0.5 text-xl font-bold tabular-nums">{d.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {day && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <h4 className="font-display mt-7 text-xl font-bold tracking-extra-tight">Pick a time</h4>
                        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                          {SLOT_TIMES.map((t) => (
                            <button
                              key={t}
                              onClick={() => setSlot(t)}
                              className={`rounded-full border py-2 text-[13px] font-mono tabular-nums transition-colors ${
                                slot === t ? "border-ink-950 bg-ink-950 text-white dark:border-white dark:bg-white dark:text-ink-950" : "border-ink-200 hover:border-ink-400 dark:border-ink-800"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {day && slot && (
                    <div className="mt-8 flex flex-col gap-3 border-t border-ink-200/70 pt-7 dark:border-ink-800/70 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-[14px] text-ink-700 dark:text-ink-300">
                        <span className="font-medium">{day.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</span> at <span className="font-mono tabular-nums font-medium">{slot}</span>
                      </div>
                      <button
                        onClick={() => setConfirmed(true)}
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[14px] font-medium text-white"
                      >
                        Confirm booking <CalendarCheck size={14} weight="bold" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl border border-ink-200/70 bg-white p-10 text-center dark:border-ink-800/70 dark:bg-ink-900"
                >
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-white">
                    <CheckCircle size={22} weight="fill" />
                  </div>
                  <h3 className="font-display mt-5 text-3xl font-bold tracking-extra-tight">Session booked.</h3>
                  <p className="mt-3 text-[15px] text-ink-600 dark:text-ink-400">
                    {selected.name} will join via video on {day!.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} at <span className="font-mono">{slot}</span>. A calendar invite is on its way.
                  </p>
                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <button className="inline-flex h-11 items-center gap-2 rounded-full bg-ink-950 px-5 text-[14px] font-medium text-white dark:bg-white dark:text-ink-950">
                      <VideoCamera size={14} weight="duotone" /> Add to calendar
                    </button>
                    <button onClick={() => { setSelected(null); setDay(null); setSlot(null); setConfirmed(false); }} className="text-[13px] text-ink-500 hover:text-ink-950 dark:hover:text-white">
                      Book another →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

function CounselorCard({ counselor, onClick }: { counselor: Counselor; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col rounded-3xl border border-ink-200/70 bg-white p-7 text-left transition-colors hover:border-ink-400 dark:border-ink-800/70 dark:bg-ink-900 dark:hover:border-ink-600"
    >
      <div className="flex items-start gap-4">
        <Avatar seed={counselor.avatarSeed} name={counselor.name} />
        <div className="min-w-0 flex-1">
          <div className="font-display text-xl font-bold tracking-extra-tight">{counselor.name}</div>
          <div className="mt-0.5 text-[12px] font-mono uppercase tracking-widest text-ink-500">{counselor.title}</div>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-extrabold tabular-nums tracking-extra-tight">${counselor.hourlyRate}</div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">/ hour</div>
        </div>
      </div>
      <p className="mt-5 text-[14px] leading-relaxed text-ink-600 dark:text-ink-400">{counselor.bio}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {counselor.focus.map((f) => (
          <span key={f} className="rounded-full border border-ink-200 px-2.5 py-0.5 text-[11.5px] text-ink-700 dark:border-ink-800 dark:text-ink-300">{f}</span>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-4 border-t border-ink-200/70 pt-4 text-[11px] font-mono uppercase tracking-widest text-ink-500 dark:border-ink-800/70">
        <span className="inline-flex items-center gap-1.5"><Star size={11} weight="fill" className="text-accent" /> {counselor.yearsExperience}y experience</span>
        <span className="inline-flex items-center gap-1.5"><Globe size={11} weight="duotone" /> {counselor.languages.length} languages</span>
      </div>
    </button>
  );
}

function PreviewCard({ counselor }: { counselor: Counselor }) {
  return (
    <div className="rounded-3xl border border-ink-200/70 bg-white p-6 opacity-70 dark:border-ink-800/70 dark:bg-ink-900">
      <div className="flex items-center gap-3">
        <Avatar seed={counselor.avatarSeed} name={counselor.name} size={44} />
        <div className="min-w-0">
          <div className="truncate font-display text-[16px] font-bold tracking-extra-tight">{counselor.name}</div>
          <div className="truncate text-[11px] font-mono uppercase tracking-widest text-ink-500">{counselor.title}</div>
        </div>
      </div>
    </div>
  );
}

function Profile({ counselor }: { counselor: Counselor }) {
  return (
    <div className="rounded-3xl border border-ink-200/70 bg-white p-7 dark:border-ink-800/70 dark:bg-ink-900">
      <div className="flex items-start gap-4">
        <Avatar seed={counselor.avatarSeed} name={counselor.name} size={56} />
        <div>
          <div className="font-display text-2xl font-bold tracking-extra-tight">{counselor.name}</div>
          <div className="text-[12px] font-mono uppercase tracking-widest text-ink-500">{counselor.title}</div>
        </div>
      </div>
      <p className="mt-5 text-[14.5px] leading-relaxed text-ink-700 dark:text-ink-300">{counselor.bio}</p>
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-ink-200/70 pt-5 dark:border-ink-800/70">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">Track record</div>
          <div className="mt-1 text-[13.5px]">{counselor.acceptanceRecord}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">Rate</div>
          <div className="mt-1 font-mono text-[18px] tabular-nums font-medium">${counselor.hourlyRate} / hr</div>
        </div>
        <div className="col-span-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">Focus</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {counselor.focus.map((f) => (
              <span key={f} className="rounded-full border border-ink-200 px-2.5 py-0.5 text-[11.5px] dark:border-ink-800">{f}</span>
            ))}
          </div>
        </div>
        <div className="col-span-2 flex items-center gap-4 text-[11px] font-mono uppercase tracking-widest text-ink-500">
          <span className="inline-flex items-center gap-1.5"><MapPin size={11} weight="duotone" /> Video sessions</span>
          <span className="inline-flex items-center gap-1.5"><Globe size={11} weight="duotone" /> {counselor.languages.join(" · ")}</span>
        </div>
      </div>
    </div>
  );
}

function Avatar({ seed, name, size = 48 }: { seed: string; name: string; size?: number }) {
  const initials = name.split(/\s+/).map((s) => s[0]).slice(0, 2).join("");
  const hue = Math.abs([...seed].reduce((a, c) => a + c.charCodeAt(0), 0)) % 360;
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue} 55% 30%), hsl(${(hue + 40) % 360} 60% 18%))`,
        fontSize: size * 0.32,
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

// Keep imports referenced (used by other tiles, intentionally available)
void Link;
