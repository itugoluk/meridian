import { Moon, Sun } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";

export function ThemeToggle() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative inline-flex h-8 w-14 items-center rounded-full border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 transition-colors"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={`absolute top-0.5 grid h-7 w-7 place-items-center rounded-full bg-ink-950 text-white dark:bg-white dark:text-ink-950 ${isDark ? "right-0.5" : "left-0.5"}`}
      >
        {isDark ? <Moon size={13} weight="fill" /> : <Sun size={13} weight="fill" />}
      </motion.span>
    </button>
  );
}
