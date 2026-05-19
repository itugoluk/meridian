import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Profile = {
  name: string;
  age: number;
  grade: 9 | 10 | 11 | 12;
  location: string;
  system: "IB" | "American" | "A-Level" | "GCSE" | "Bachillerato" | "Abitur";
  gpa: number;
  classes: string[];
  targetCountries: string[];
  interests: string[];
  extracurriculars: string[];
  vibePreferences: string[];
  budgetUsd?: number;
  // Optional standardized-test scores. Use only the one the student has taken
  // (or neither for test-optional applicants). SAT range 400–1600, ACT 1–36.
  satScore?: number;
  actScore?: number;
};

export type EssayDraft = {
  id: string;
  prompt: string;
  schoolId?: string;
  brainstorm: string;
  outline: string;
  draft: string;
  wordTarget: number;
  updatedAt: number;
};

export type Application = {
  id: string;
  schoolId: string;
  status: "Researching" | "Drafting" | "Submitted" | "Decision";
  deadline: string;
};

type State = {
  hydrated: boolean;
  isPro: boolean;
  profile: Profile | null;
  savedSchoolIds: string[];
  essays: EssayDraft[];
  applications: Application[];
  theme: "light" | "dark";
  tutorialSeen: boolean;

  setProfile: (p: Profile) => void;
  patchProfile: (p: Partial<Profile>) => void;
  upgradeToPro: () => void;
  downgrade: () => void;
  toggleSavedSchool: (id: string) => void;
  addEssay: (e: EssayDraft) => void;
  updateEssay: (id: string, patch: Partial<EssayDraft>) => void;
  removeEssay: (id: string) => void;
  upsertApplication: (a: Application) => void;
  removeApplication: (id: string) => void;
  setTheme: (t: "light" | "dark") => void;
  setTutorialSeen: (v: boolean) => void;
  reset: () => void;
};

const STORAGE_KEY = "meridian:v1";

export const useStore = create<State>()(
  persist(
    (set) => ({
      hydrated: false,
      isPro: false,
      profile: null,
      savedSchoolIds: [],
      essays: [],
      applications: [],
      theme: (typeof window !== "undefined" && localStorage.getItem("meridian-theme") === "dark") ? "dark" : "light",
      tutorialSeen: false,

      setProfile: (p) => set({ profile: p }),
      patchProfile: (p) => set((s) => ({ profile: s.profile ? { ...s.profile, ...p } : null })),
      upgradeToPro: () => set({ isPro: true }),
      downgrade: () => set({ isPro: false }),
      toggleSavedSchool: (id) =>
        set((s) => ({
          savedSchoolIds: s.savedSchoolIds.includes(id)
            ? s.savedSchoolIds.filter((x) => x !== id)
            : [...s.savedSchoolIds, id],
        })),
      addEssay: (e) => set((s) => ({ essays: [e, ...s.essays] })),
      updateEssay: (id, patch) =>
        set((s) => ({ essays: s.essays.map((e) => (e.id === id ? { ...e, ...patch, updatedAt: Date.now() } : e)) })),
      removeEssay: (id) => set((s) => ({ essays: s.essays.filter((e) => e.id !== id) })),
      upsertApplication: (a) =>
        set((s) => {
          const idx = s.applications.findIndex((x) => x.id === a.id);
          if (idx === -1) return { applications: [...s.applications, a] };
          const next = [...s.applications];
          next[idx] = a;
          return { applications: next };
        }),
      removeApplication: (id) => set((s) => ({ applications: s.applications.filter((a) => a.id !== id) })),
      setTheme: (t) => {
        try {
          localStorage.setItem("meridian-theme", t);
          if (t === "dark") document.documentElement.classList.add("dark");
          else document.documentElement.classList.remove("dark");
        } catch {}
        set({ theme: t });
      },
      setTutorialSeen: (v) => set({ tutorialSeen: v }),
      reset: () =>
        set({
          isPro: false,
          profile: null,
          savedSchoolIds: [],
          essays: [],
          applications: [],
        }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({
        isPro: s.isPro,
        profile: s.profile,
        savedSchoolIds: s.savedSchoolIds,
        essays: s.essays,
        applications: s.applications,
        tutorialSeen: s.tutorialSeen,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
