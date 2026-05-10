import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { useStore } from "./store/useStore";

const Landing = lazy(() => import("./pages/Landing"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Manifesto = lazy(() => import("./pages/Manifesto"));
const CounselorsPublic = lazy(() => import("./pages/CounselorsPublic"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Matches = lazy(() => import("./pages/Matches"));
const Majors = lazy(() => import("./pages/Majors"));
const Timeline = lazy(() => import("./pages/Timeline"));
const Essays = lazy(() => import("./pages/Essays"));
const Counselors = lazy(() => import("./pages/Counselors"));
const Profile = lazy(() => import("./pages/Profile"));

function ThemeSync() {
  const theme = useStore((s) => s.theme);
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);
  return null;
}

function Fallback() {
  return (
    <div className="grid min-h-[100dvh] place-items-center">
      <div className="h-6 w-6 animate-breathe rounded-full bg-ink-300 dark:bg-ink-700" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeSync />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/counselors-public" element={<CounselorsPublic />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="matches" element={<Matches />} />
            <Route path="majors" element={<Majors />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="essays" element={<Essays />} />
            <Route path="counselors" element={<Counselors />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
