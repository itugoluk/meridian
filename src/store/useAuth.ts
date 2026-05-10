import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, EssayDraft, Application } from "./useStore";

export type AccountData = {
  email: string;
  passwordHash: string;
  name: string;
  createdAt: number;
  isPro: boolean;
  profile: Profile | null;
  savedSchoolIds: string[];
  essays: EssayDraft[];
  applications: Application[];
};

type AuthState = {
  accounts: Record<string, AccountData>;
  currentEmail: string | null;

  signUp: (email: string, password: string, name: string) => { ok: true } | { ok: false; error: string };
  signIn: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  signOut: () => void;
  updateAccount: (patch: Partial<AccountData>) => void;
  deleteAccount: () => void;
};

// Lightweight obfuscation only — explicitly not real security; a real backend would hash server-side.
function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

function normalize(email: string) {
  return email.trim().toLowerCase();
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accounts: {},
      currentEmail: null,

      signUp: (email, password, name) => {
        const key = normalize(email);
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(key)) return { ok: false, error: "Enter a valid email address." };
        if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
        if (!name.trim()) return { ok: false, error: "Name is required." };
        if (get().accounts[key]) return { ok: false, error: "An account with that email already exists." };

        const account: AccountData = {
          email: key,
          passwordHash: hash(password),
          name: name.trim(),
          createdAt: Date.now(),
          isPro: false,
          profile: null,
          savedSchoolIds: [],
          essays: [],
          applications: [],
        };
        set((s) => ({
          accounts: { ...s.accounts, [key]: account },
          currentEmail: key,
        }));
        return { ok: true };
      },

      signIn: (email, password) => {
        const key = normalize(email);
        const a = get().accounts[key];
        if (!a) return { ok: false, error: "No account found for that email." };
        if (a.passwordHash !== hash(password)) return { ok: false, error: "Incorrect password." };
        set({ currentEmail: key });
        return { ok: true };
      },

      signOut: () => set({ currentEmail: null }),

      updateAccount: (patch) => {
        const email = get().currentEmail;
        if (!email) return;
        set((s) => ({
          accounts: {
            ...s.accounts,
            [email]: { ...s.accounts[email], ...patch },
          },
        }));
      },

      deleteAccount: () => {
        const email = get().currentEmail;
        if (!email) return;
        set((s) => {
          const next = { ...s.accounts };
          delete next[email];
          return { accounts: next, currentEmail: null };
        });
      },
    }),
    {
      name: "meridian:auth:v1",
    }
  )
);

export function useCurrentAccount(): AccountData | null {
  const email = useAuth((s) => s.currentEmail);
  const accounts = useAuth((s) => s.accounts);
  return email ? accounts[email] ?? null : null;
}
