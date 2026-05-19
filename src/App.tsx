import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { BetaBanner } from "./components/BetaBanner";
import { useStore } from "./store/useStore";
import { useAuth } from "./store/useAuth";
import { useAccountSync } from "./store/syncAccount";

const Landing = lazy(() => import("./pages/Landing"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Manifesto = lazy(() => import("./pages/Manifesto"));
const CounselorsPublic = lazy(() => import("./pages/CounselorsPublic"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Matches = lazy(() => import("./pages/Matches"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
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

function RequireAuth({ children }: { children: React.ReactNode }) {
  const email = useAuth((s) => s.currentEmail);
  const location = useLocation();
  if (!email) {
    return <Navigate to={`/auth?mode=signin&next=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return <>{children}</>;
}

function AppRoot() {
  useAccountSync();
  return (
    <>
      <BetaBanner />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/counselors-public" element={<CounselorsPublic />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
          <Route path="/app" element={<RequireAuth><AppShell /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="matches" element={<Matches />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="majors" element={<Majors />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="essays" element={<Essays />} />
            <Route path="counselors" element={<Counselors />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeSync />
      <AppRoot />
    </BrowserRouter>
  );
}
