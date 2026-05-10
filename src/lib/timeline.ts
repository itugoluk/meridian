import type { Profile } from "../store/useStore";

export type TimelinePhase = {
  id: string;
  quarter: string;        // "Spring · Grade 11"
  title: string;
  status: "Past" | "Active" | "Upcoming";
  items: TimelineItem[];
};

export type TimelineItem = {
  id: string;
  label: string;
  detail: string;
  category: "Academic" | "Testing" | "Activities" | "Application" | "Finance";
};

const BASE: Omit<TimelinePhase, "status">[] = [
  {
    id: "g9-fall",
    quarter: "Fall · Grade 9",
    title: "Build the floor",
    items: [
      { id: "g9f-1", label: "Choose challenging courses", detail: "Lock in the most demanding classes you can sustain — patterns set here.", category: "Academic" },
      { id: "g9f-2", label: "Try three extracurriculars", detail: "Cast wide; the goal is signal, not depth, in year one.", category: "Activities" },
    ],
  },
  {
    id: "g9-spring",
    quarter: "Spring · Grade 9",
    title: "Pattern grades",
    items: [
      { id: "g9s-1", label: "Hit a 3.7+ GPA target", detail: "Freshman GPA disproportionately shapes class rank trajectory.", category: "Academic" },
      { id: "g9s-2", label: "Find one summer commitment", detail: "Research, a job, a sustained project. Avoid pay-to-play camps.", category: "Activities" },
    ],
  },
  {
    id: "g10-fall",
    quarter: "Fall · Grade 10",
    title: "Specialize",
    items: [
      { id: "g10f-1", label: "Drop one activity, double down on two", detail: "Selective schools read depth as commitment, not range.", category: "Activities" },
      { id: "g10f-2", label: "Take PSAT 10 or pre-A2 diagnostics", detail: "Use it as a baseline, not a verdict.", category: "Testing" },
    ],
  },
  {
    id: "g10-spring",
    quarter: "Spring · Grade 10",
    title: "Lock leadership",
    items: [
      { id: "g10s-1", label: "Seek a leadership step in one activity", detail: "Captain, founder, lead — verifiable position with outcomes.", category: "Activities" },
      { id: "g10s-2", label: "Plan a sharper summer", detail: "Research, internship, or a self-directed project you can describe in 60 seconds.", category: "Activities" },
    ],
  },
  {
    id: "g11-fall",
    quarter: "Fall · Grade 11",
    title: "The deciding year",
    items: [
      { id: "g11f-1", label: "Take the PSAT for National Merit (US)", detail: "Junior PSAT is the qualifying year; one shot.", category: "Testing" },
      { id: "g11f-2", label: "Build initial school list", detail: "Aim for 12–18 schools across reach, target, likely.", category: "Application" },
      { id: "g11f-3", label: "Start meeting counselors", detail: "Book your first college counseling session now, not in senior year.", category: "Application" },
    ],
  },
  {
    id: "g11-spring",
    quarter: "Spring · Grade 11",
    title: "Standardized testing window",
    items: [
      { id: "g11s-1", label: "Sit SAT or ACT", detail: "Aim for one official sitting; superscoring lets you retest in summer.", category: "Testing" },
      { id: "g11s-2", label: "Visit your top 5 in person or virtually", detail: "Walk a campus; you'll know within ten minutes if the fit reads.", category: "Application" },
      { id: "g11s-3", label: "Begin brainstorming Common App essay", detail: "By June you want three viable topic angles drafted.", category: "Application" },
    ],
  },
  {
    id: "summer-12",
    quarter: "Summer before Grade 12",
    title: "The critical summer",
    items: [
      { id: "s12-1", label: "Finish Common App personal statement", detail: "Have a 650-word v3 by August 15. Supplements come after.", category: "Application" },
      { id: "s12-2", label: "Identify two recommenders", detail: "Teachers from junior year, ideally in different disciplines.", category: "Application" },
      { id: "s12-3", label: "Run a FAFSA / CSS Profile dry-run", detail: "Estimate financial aid before finalizing the list.", category: "Finance" },
    ],
  },
  {
    id: "g12-fall",
    quarter: "Fall · Grade 12",
    title: "Submission",
    items: [
      { id: "g12f-1", label: "Submit Early Decision / Early Action by Nov 1", detail: "ED gives a real bump at most selective schools — use it deliberately.", category: "Application" },
      { id: "g12f-2", label: "File FAFSA in October", detail: "FAFSA opens Oct 1; aid is often first-come at marginal schools.", category: "Finance" },
      { id: "g12f-3", label: "Polish supplements weekly", detail: "Treat 'Why Us' essays as research papers, not love letters.", category: "Application" },
    ],
  },
  {
    id: "g12-spring",
    quarter: "Spring · Grade 12",
    title: "Decision & landing",
    items: [
      { id: "g12s-1", label: "Compare offers side-by-side", detail: "Use net cost, not sticker price, as the primary lens.", category: "Finance" },
      { id: "g12s-2", label: "Commit by May 1", detail: "National decision day. Send deposit, withdraw from others.", category: "Application" },
      { id: "g12s-3", label: "Sketch first-semester plan", detail: "Pre-register; talk to current students about which intro courses to take or skip.", category: "Academic" },
    ],
  },
];

export function buildTimeline(profile: Profile | null): TimelinePhase[] {
  const grade = profile?.grade ?? 11;
  return BASE.map((p) => {
    const phaseGrade = Number(p.id.match(/g(\d+)/)?.[1] ?? 12);
    const isSummer = p.id.startsWith("summer");
    const isSpring = p.id.endsWith("spring");
    const status: TimelinePhase["status"] =
      phaseGrade < grade || (isSummer && grade >= 12) ? "Past"
        : phaseGrade === grade && !isSpring ? "Active"
        : phaseGrade === grade ? "Active"
        : "Upcoming";
    return { ...p, status };
  });
}
