import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, EnvelopeSimple, MapPin, PaperPlaneTilt } from "@phosphor-icons/react";
import { MarketingNav } from "../components/MarketingNav";
import { Footer } from "../components/Footer";

const TOPICS = [
  "General question",
  "Pricing & billing",
  "Counselor partnerships",
  "Press & media",
  "Bug report",
  "Feature request",
];

export default function Contact() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSent(true);
  };

  const canSubmit = name.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && message.trim().length > 5;

  return (
    <div className="min-h-[100dvh] bg-white dark:bg-ink-950">
      <MarketingNav />

      <section className="mx-auto max-w-[1400px] px-6 pb-24 pt-16 lg:px-12 lg:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left — editorial intro */}
          <div className="lg:col-span-5">
            <div className="text-[11px] font-mono uppercase tracking-widest text-accent">/ Contact</div>
            <h1 className="display mt-3 text-5xl md:text-6xl">Get in touch.</h1>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ink-600 dark:text-ink-400">
              We read every message. For account or billing questions, mention the email you signed up with. For counselor partnerships, send a one-line bio and your admit-rate record.
            </p>

            <div className="mt-12 space-y-6">
              <ContactDetail
                icon={EnvelopeSimple}
                label="Email"
                value="hello@meridian.app"
                hint="Replies within two business days."
              />
              <ContactDetail
                icon={MapPin}
                label="Based in"
                value="Madrid · Singapore"
                hint="Remote team across UTC-5 to UTC+8."
              />
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-ink-200/70 bg-white p-8 dark:border-ink-800/70 dark:bg-ink-900 md:p-10">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 140, damping: 20 }}
                    className="py-12 text-center"
                  >
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-white">
                      <CheckCircle size={22} weight="fill" />
                    </div>
                    <h2 className="font-display mt-5 text-3xl font-bold tracking-extra-tight">Message received.</h2>
                    <p className="mx-auto mt-3 max-w-md text-[14.5px] text-ink-600 dark:text-ink-400">
                      We'll get back to {email} within two business days. If it's urgent, mention "urgent" in a follow-up.
                    </p>
                    <button
                      onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
                      className="mt-7 inline-flex h-10 items-center rounded-full border border-ink-200 px-4 text-[13px] font-medium dark:border-ink-800"
                    >
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={(e) => { e.preventDefault(); if (canSubmit) submit(); }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="text-[11.5px] font-medium uppercase tracking-wider text-ink-500">Topic</label>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {TOPICS.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTopic(t)}
                            className={`rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                              topic === t
                                ? "border-ink-950 bg-ink-950 text-white dark:border-white dark:bg-white dark:text-ink-950"
                                : "border-ink-200 text-ink-700 hover:border-ink-400 dark:border-ink-800 dark:text-ink-300"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11.5px] font-medium uppercase tracking-wider text-ink-500">Name</label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="input"
                          autoComplete="name"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11.5px] font-medium uppercase tracking-wider text-ink-500">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@school.edu"
                          className="input"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11.5px] font-medium uppercase tracking-wider text-ink-500">Message</label>
                      <textarea
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="What's on your mind?"
                        className="textarea"
                      />
                      <span className="self-end text-[11px] font-mono text-ink-500">{message.length} chars</span>
                    </div>

                    <button
                      type="submit"
                      disabled={!canSubmit || submitting}
                      className="inline-flex h-12 items-center gap-2 rounded-full bg-ink-950 px-6 text-[14.5px] font-medium text-white transition-transform hover:-translate-y-px disabled:pointer-events-none disabled:opacity-50 dark:bg-white dark:text-ink-950"
                    >
                      {submitting ? (
                        <span className="h-3 w-3 animate-breathe rounded-full bg-current opacity-60" />
                      ) : (
                        <>
                          Send message <PaperPlaneTilt size={14} weight="duotone" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContactDetail({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ size?: number; weight?: "duotone" | "regular" | "bold" | "fill" }>;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="border-t border-ink-200/70 pt-5 dark:border-ink-800/70">
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-ink-500">
        <Icon size={11} weight="duotone" /> {label}
      </div>
      <div className="mt-1.5 font-display text-xl font-bold tracking-extra-tight">{value}</div>
      {hint && <div className="mt-1 text-[12.5px] text-ink-500">{hint}</div>}
    </div>
  );
}
