import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lightbulb, ListBullets, NotePencil, Plus, Sparkle, Trash, Lock } from "@phosphor-icons/react";
import { useStore, type EssayDraft } from "../store/useStore";

const PROMPTS = [
  "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it.",
  "The lessons we take from obstacles we encounter can be fundamental to later success.",
  "Reflect on a time when you questioned or challenged a belief or idea.",
  "Describe a problem you've solved or would like to solve.",
  "Discuss an accomplishment that sparked personal growth.",
];

const STAGES = ["brainstorm", "outline", "draft"] as const;
type Stage = (typeof STAGES)[number];

const PLACEHOLDER: Record<Stage, string> = {
  brainstorm: "Dump everything that comes to mind. Memories, moments, contradictions in your story. We'll cut later.",
  outline: "Three to five beats. Setup → tension → turn → reflection.",
  draft: "First full pass. Aim for the word target. Don't edit as you go.",
};

const TIPS: Record<Stage, string[]> = {
  brainstorm: [
    "Specificity beats grandiosity. A 200-word memory wins over a 600-word manifesto.",
    "Write five different opening sentences. Pick the one that feels most physically true.",
    "What's the one thing you'd be embarrassed to leave out? Start there.",
  ],
  outline: [
    "The strongest essays turn at 60% — give yourself room.",
    "Reflection is not 'I learned X.' It's evidence that you have changed.",
    "Cut anything that could appear on someone else's application.",
  ],
  draft: [
    "Read it aloud. If you stumble, the reader will too.",
    "Replace every adjective with a verb if you can.",
    "Cut your first paragraph. Try the second as the opener.",
  ],
};

const FREE_LIMIT = 1;

export default function Essays() {
  const isPro = useStore((s) => s.isPro);
  const essays = useStore((s) => s.essays);
  const addEssay = useStore((s) => s.addEssay);
  const updateEssay = useStore((s) => s.updateEssay);
  const removeEssay = useStore((s) => s.removeEssay);

  const [activeId, setActiveId] = useState<string | null>(essays[0]?.id ?? null);
  const [stage, setStage] = useState<Stage>("brainstorm");

  const active = useMemo(() => essays.find((e) => e.id === activeId) ?? null, [essays, activeId]);

  useEffect(() => {
    if (!activeId && essays[0]) setActiveId(essays[0].id);
  }, [essays, activeId]);

  const canCreate = isPro || essays.length < FREE_LIMIT;

  const create = (prompt: string) => {
    const e: EssayDraft = {
      id: `essay-${Date.now()}`,
      prompt,
      brainstorm: "",
      outline: "",
      draft: "",
      wordTarget: 650,
      updatedAt: Date.now(),
    };
    addEssay(e);
    setActiveId(e.id);
    setStage("brainstorm");
  };

  return (
    <div className="px-6 py-10 lg:px-12 lg:py-14 max-w-[1400px] mx-auto pb-32 lg:pb-20">
      <div className="mb-10">
        <div className="text-[11px] font-mono uppercase tracking-widest text-accent">Essay Workshop</div>
        <h1 className="display mt-2 text-4xl md:text-5xl">From blank page to first draft, three stages.</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500 dark:text-ink-400">
          Brainstorm → outline → draft. Each stage shows you what good looks like at that point in the process. Free tier includes one essay; Pro is unlimited with revision passes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Essay list */}
        <aside className="lg:col-span-3 space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-500">Your essays · {essays.length}/{isPro ? "∞" : FREE_LIMIT}</div>

          {essays.length === 0 && (
            <div className="rounded-2xl border border-dashed border-ink-300 p-5 text-center dark:border-ink-700">
              <p className="text-[13px] text-ink-500">No essays yet. Start with a Common App prompt below.</p>
            </div>
          )}

          {essays.map((e) => (
            <button
              key={e.id}
              onClick={() => setActiveId(e.id)}
              className={`group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                activeId === e.id
                  ? "border-ink-950 bg-ink-50 dark:border-white dark:bg-ink-900"
                  : "border-ink-200/70 bg-white hover:border-ink-300 dark:border-ink-800/70 dark:bg-ink-900 dark:hover:border-ink-700"
              }`}
            >
              <NotePencil size={15} weight="duotone" className="mt-0.5 shrink-0 text-ink-400" />
              <div className="min-w-0 flex-1">
                <div className="line-clamp-2 text-[13px] font-medium leading-snug">
                  {e.prompt || "Untitled"}
                </div>
                <div className="mt-1.5 text-[10px] font-mono uppercase tracking-widest text-ink-500">
                  {wordCount(e.draft)} / {e.wordTarget} w
                </div>
              </div>
              <button
                onClick={(ev) => { ev.stopPropagation(); removeEssay(e.id); if (activeId === e.id) setActiveId(null); }}
                className="opacity-0 transition-opacity group-hover:opacity-100 text-ink-400 hover:text-accent"
                aria-label="Delete essay"
              >
                <Trash size={13} weight="duotone" />
              </button>
            </button>
          ))}

          {/* New essay */}
          <div className="rounded-2xl border border-ink-200/70 bg-white p-4 dark:border-ink-800/70 dark:bg-ink-900">
            <div className="mb-2 text-[10px] font-mono uppercase tracking-widest text-ink-500">Start from a Common App prompt</div>
            {PROMPTS.slice(0, 3).map((p) => (
              <button
                key={p}
                disabled={!canCreate}
                onClick={() => create(p)}
                className="group mb-1.5 block w-full rounded-xl px-3 py-2 text-left text-[12.5px] leading-snug text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-50 disabled:pointer-events-none dark:text-ink-300 dark:hover:bg-ink-800/60"
              >
                <span className="line-clamp-2">{p}</span>
              </button>
            ))}
            {!canCreate && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-accent/5 px-3 py-2 text-[12px] text-accent">
                <Lock size={12} weight="bold" /> Pro lets you draft unlimited essays.
              </div>
            )}
            <button
              disabled={!canCreate}
              onClick={() => create("Custom prompt")}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-3.5 py-1.5 text-[12px] font-medium text-white disabled:opacity-50 dark:bg-white dark:text-ink-950"
            >
              <Plus size={11} weight="bold" /> Blank essay
            </button>
          </div>
        </aside>

        {/* Editor */}
        <div className="lg:col-span-9">
          {!active ? (
            <EmptyState canCreate={canCreate} onPick={create} prompts={PROMPTS} />
          ) : (
            <div className="rounded-3xl border border-ink-200/70 bg-white dark:border-ink-800/70 dark:bg-ink-900 overflow-hidden">
              <div className="border-b border-ink-200/70 px-7 py-5 dark:border-ink-800/70">
                <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">Prompt</div>
                <p className="mt-1.5 text-[15px] leading-relaxed">{active.prompt}</p>
              </div>

              {/* Stages */}
              <div className="flex items-center justify-between border-b border-ink-200/70 bg-ink-50/60 px-7 py-3 dark:border-ink-800/70 dark:bg-ink-950/40">
                <div className="inline-flex gap-1 rounded-full border border-ink-200 bg-white p-1 dark:border-ink-800 dark:bg-ink-900">
                  {STAGES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStage(s)}
                      className={`rounded-full px-4 py-1.5 text-[12.5px] font-medium capitalize transition-colors ${
                        stage === s ? "bg-ink-950 text-white dark:bg-white dark:text-ink-950" : "text-ink-600 hover:text-ink-950 dark:text-ink-400 dark:hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-ink-500">
                  <span>Words: {wordCount(active.draft)} / {active.wordTarget}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
                {/* Editor area */}
                <div className="border-b border-ink-200/70 p-7 lg:border-b-0 lg:border-r dark:border-ink-800/70">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={stage}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <textarea
                        rows={stage === "draft" ? 18 : 10}
                        value={active[stage]}
                        onChange={(e) => updateEssay(active.id, { [stage]: e.target.value })}
                        placeholder={PLACEHOLDER[stage]}
                        className="textarea"
                      />
                      <div className="mt-3 flex items-center justify-between text-[12px] text-ink-500">
                        <span>Autosaved · last edit {formatTime(active.updatedAt)}</span>
                        {stage !== "draft" && (
                          <button
                            onClick={() => setStage(STAGES[STAGES.indexOf(stage) + 1])}
                            className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-3.5 py-1.5 text-[12px] font-medium text-white dark:bg-white dark:text-ink-950"
                          >
                            Next stage <ArrowRight size={11} weight="bold" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Side: tips */}
                <div className="p-7">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-accent">
                    <Lightbulb size={11} weight="duotone" className="inline mr-1" /> Stage tips
                  </div>
                  <ul className="mt-3 space-y-3 text-[13px] leading-relaxed text-ink-700 dark:text-ink-300">
                    {TIPS[stage].map((t, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-1.5 inline-block h-1 w-1 rounded-full bg-accent" />
                        {t}
                      </li>
                    ))}
                  </ul>

                  {isPro ? (
                    <button className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-[12.5px] font-medium text-white">
                      <Sparkle size={12} weight="fill" /> Get a revision pass
                    </button>
                  ) : (
                    <Link
                      to="/pricing"
                      className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-[12.5px] font-medium dark:border-ink-800 dark:bg-ink-900"
                    >
                      <Lock size={11} weight="bold" /> Revision passes are Pro
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ canCreate, onPick, prompts }: { canCreate: boolean; onPick: (p: string) => void; prompts: string[] }) {
  return (
    <div className="rounded-3xl border border-dashed border-ink-300 p-12 text-center dark:border-ink-700">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ink-100 dark:bg-ink-800">
        <ListBullets size={18} weight="duotone" />
      </div>
      <h3 className="font-display mt-5 text-3xl font-bold tracking-extra-tight">Pick a prompt to start.</h3>
      <p className="mx-auto mt-2 max-w-md text-[14px] text-ink-500">Choose from a Common App prompt or write your own. You'll move through brainstorm, outline, and draft.</p>
      <div className="mx-auto mt-7 max-w-xl space-y-2 text-left">
        {prompts.map((p) => (
          <button
            key={p}
            disabled={!canCreate}
            onClick={() => onPick(p)}
            className="block w-full rounded-2xl border border-ink-200/70 bg-white p-4 text-[13.5px] leading-snug text-ink-700 transition-colors hover:border-ink-400 disabled:opacity-50 disabled:pointer-events-none dark:border-ink-800/70 dark:bg-ink-900 dark:text-ink-300"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function wordCount(s: string) {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

function formatTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return new Date(ts).toLocaleString();
}
