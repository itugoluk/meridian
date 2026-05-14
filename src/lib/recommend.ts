import { SCHOOLS, type School } from "../data/schools";
import { MAJORS, type Major } from "../data/majors";
import type { Profile } from "../store/useStore";

export type Verdict = "Reach" | "Target" | "Likely";

export type SchoolMatch = {
  school: School;
  fit: number;            // 0–100, qualitative fit (interests, country, vibe, budget, GPA)
  admitProbability: number; // 0–100, estimated chance of admission
  verdict: Verdict;
  strengths: string[];    // positive factors
  limitations: string[];  // honest tradeoffs the student should weigh
  netCost: number;
};

// Multiplier on raw intl-acceptance rate based on how far the student sits
// from the school's median admit GPA. Positive gap = student is below median.
function gpaMultiplier(gpaGap: number): number {
  if (gpaGap <= -0.3) return 1.4;
  if (gpaGap <= 0) return 1.1 + (-gpaGap / 0.3) * 0.3;
  if (gpaGap <= 0.2) return 1.1 - (gpaGap / 0.2) * 0.25;
  if (gpaGap <= 0.4) return 0.85 - ((gpaGap - 0.2) / 0.2) * 0.35;
  if (gpaGap <= 0.6) return 0.5 - ((gpaGap - 0.4) / 0.2) * 0.25;
  if (gpaGap <= 0.8) return 0.25 - ((gpaGap - 0.6) / 0.2) * 0.15;
  return 0.1;
}

const GPA_BY_SYSTEM: Record<Profile["system"], (val: number) => number> = {
  // Calibrated against real conversion tables, not linear ratios.
  IB: (v) => {
    if (v >= 40) return Math.min(4.0, 3.85 + (v - 40) * 0.03);
    if (v >= 36) return 3.65 + (v - 36) * 0.05;
    if (v >= 30) return 3.2 + (v - 30) * 0.075;
    return Math.max(0, 2.4 + (v - 24) * 0.13);
  },
  American: (v) => v,
  "A-Level": (v) => {
    // 12 = 3 A*, 9 = 3 A, 6 = 3 B
    if (v >= 12) return 4.0;
    if (v >= 9) return 3.7 + (v - 9) * 0.1;
    if (v >= 6) return 3.2 + (v - 6) * 0.167;
    return Math.max(0, 2.5 + (v - 3) * 0.233);
  },
  GCSE: (v) => {
    if (v >= 8) return 3.8 + (v - 8) * 0.2;
    if (v >= 6) return 3.4 + (v - 6) * 0.2;
    return Math.max(0, 2.5 + (v - 4) * 0.45);
  },
  Bachillerato: (v) => {
    if (v >= 9) return 3.85 + (v - 9) * 0.15;
    if (v >= 7) return 3.4 + (v - 7) * 0.225;
    return Math.max(0, 2.5 + (v - 5) * 0.45);
  },
  Abitur: (v) => {
    // 1.0 best, 4.0 minimum pass
    if (v <= 1.5) return 4.0 - (v - 1.0) * 0.2;
    if (v <= 2.5) return 3.9 - (v - 1.5) * 0.3;
    if (v <= 3.5) return 3.6 - (v - 2.5) * 0.4;
    return Math.max(2.0, 3.2 - (v - 3.5) * 0.5);
  },
};

export function normalizeGpa(gpa: number, system: Profile["system"]): number {
  const fn = GPA_BY_SYSTEM[system] ?? GPA_BY_SYSTEM.American;
  return Math.max(0, Math.min(4.0, fn(gpa)));
}

// Map shorthand interest tags to keywords that appear in school strength names
const INTEREST_KEYWORDS: Record<string, string[]> = {
  technology: ["computer", "engineering", "informatics", "robotics", "computing", "industrial design"],
  ai: ["computer", "informatics", "data", "robotics", "mathematics"],
  coding: ["computer", "informatics", "computing"],
  math: ["mathematic", "statistics", "physics"],
  data: ["data", "statistics", "computer", "informatics"],
  finance: ["business", "econom", "commerce", "accounting", "finance"],
  business: ["business", "commerce", "management", "marketing", "econom"],
  policy: ["political", "public", "international", "law", "polic"],
  government: ["political", "public", "law"],
  international: ["international", "language", "global"],
  history: ["history", "classics", "political"],
  writing: ["english", "literature", "journalism", "philosophy", "communications"],
  reading: ["english", "literature", "philosophy"],
  literature: ["english", "literature"],
  art: ["art", "drama", "film", "music", "design", "architecture"],
  design: ["design", "architecture", "industrial"],
  film: ["film", "drama", "media"],
  music: ["music", "drama"],
  sports: ["sport", "kinesiology"],
  science: ["biol", "chemistry", "physics", "natural", "environ"],
  research: ["research"],
  medicine: ["medic", "biol", "nursing", "health"],
  health: ["health", "nursing", "medic", "biol", "psych"],
  psychology: ["psych", "neuro"],
  ethics: ["philosophy", "political", "law"],
  environment: ["environ", "forestry", "natural"],
};

function strengthMatchScore(strength: string, interests: string[]): number {
  const s = strength.toLowerCase();
  let score = 0;
  for (const i of interests) {
    const il = i.toLowerCase();
    if (s.includes(il)) { score += 1; continue; }
    const kws = INTEREST_KEYWORDS[il] ?? [];
    if (kws.some((k) => s.includes(k))) score += 1;
  }
  return score;
}

function countSchoolInterestMatches(strengths: string[], interests: string[]): number {
  return strengths.reduce((acc, s) => acc + (strengthMatchScore(s, interests) > 0 ? 1 : 0), 0);
}

function overlap<T extends string>(a: T[], b: T[]) {
  const setB = new Set(b.map((x) => x.toLowerCase()));
  return a.filter((x) => setB.has(x.toLowerCase())).length;
}

export function scoreSchool(profile: Profile, school: School): SchoolMatch {
  const strengths: string[] = [];
  const limitations: string[] = [];
  let fit = 50;

  const studentGpa = normalizeGpa(profile.gpa, profile.system);
  const gpaGap = school.median.gpa - studentGpa;

  // 1. GPA alignment — drives fit and shows up in strengths/limitations.
  if (gpaGap <= -0.1) {
    fit += 18;
    strengths.push(`Your grades exceed the median admit profile (${school.median.gpa.toFixed(2)}).`);
  } else if (gpaGap <= 0.1) {
    fit += 8;
    strengths.push(`Your grades sit inside the typical admit range.`);
  } else if (gpaGap <= 0.25) {
    fit -= 6;
    limitations.push(`Grades are ${gpaGap.toFixed(2)} GPA below median (${school.median.gpa.toFixed(2)}) — strong essays will matter.`);
  } else {
    const penalty = Math.max(-22, -6 + (-gpaGap) * 20);
    fit += penalty;
    limitations.push(`Grades are ${gpaGap.toFixed(2)} GPA below the median admit (${school.median.gpa.toFixed(2)}); treat this as a stretch on academics alone.`);
  }

  // 2. Country alignment.
  if (profile.targetCountries.includes(school.country)) {
    fit += 14;
    strengths.push(`Located in ${school.country}, which you flagged as a target.`);
  } else if (profile.targetCountries.length > 0) {
    fit -= 6;
    limitations.push(`${school.country} isn't on your target list (${profile.targetCountries.slice(0, 3).join(", ")}); applying here means committing to a country you didn't shortlist.`);
  }

  // 3. Interest / strength overlap.
  const interestMatches = countSchoolInterestMatches(school.strengths, profile.interests);
  if (interestMatches >= 3) {
    fit += 22;
    strengths.push(`${interestMatches} of this school's strengths line up with your interests.`);
  } else if (interestMatches === 2) {
    fit += 16;
    strengths.push(`Two of this school's strengths match your interests directly.`);
  } else if (interestMatches === 1) {
    fit += 9;
    strengths.push(`One flagship area aligns with your interests.`);
  } else if (profile.interests.length > 0) {
    fit -= 12;
    limitations.push(`Flagship areas (${school.strengths.slice(0, 3).join(", ")}) don't map to your stated interests (${profile.interests.slice(0, 3).join(", ")}).`);
  }

  // 4. School-system acceptance.
  if (!school.systemsAccepted.includes(profile.system)) {
    fit -= 14;
    limitations.push(`${profile.system} applications are uncommon here.`);
  } else if (school.preferredSystem === profile.system) {
    fit += 5;
    strengths.push(`${profile.system} is the system this school most commonly admits from.`);
  }

  // 5. Vibe.
  const vibeMatches = overlap(school.vibe as string[], profile.vibePreferences);
  fit += Math.min(8, vibeMatches * 3);
  if (vibeMatches >= 2) {
    strengths.push(`Campus character (${(school.vibe as string[]).slice(0, 3).join(", ")}) matches your vibe preferences.`);
  }

  // 6. Budget.
  if (profile.budgetUsd && profile.budgetUsd < school.stickerUsd) {
    if (school.netCostUsd <= profile.budgetUsd) {
      fit += 10;
      strengths.push(`Net cost (${formatUsd(school.netCostUsd)}) fits inside your stated budget.`);
    } else {
      fit -= 8;
      limitations.push(`Net cost (${formatUsd(school.netCostUsd)}) sits above your budget (${formatUsd(profile.budgetUsd)}).`);
    }
  }

  fit = Math.max(2, Math.min(98, fit));

  // Admit probability — the headline number used to gate the verdict.
  const intl = school.intlAcceptance;
  const admitProbability = Math.max(2, Math.min(95, intl * gpaMultiplier(gpaGap)));

  // Surface acceptance-rate context as a strength or limitation.
  if (intl >= 70) {
    strengths.push(`Highly accessible — ${intl.toFixed(0)}% of international applicants are admitted here.`);
  } else if (intl >= 40 && intl < 70) {
    strengths.push(`Moderate selectivity — about ${intl.toFixed(0)}% of international applicants get in.`);
  } else if (intl < 15) {
    limitations.push(`Very selective: only ${intl.toFixed(1)}% of international applicants are admitted.`);
  } else if (intl < 25) {
    limitations.push(`Selective for international applicants (${intl.toFixed(1)}% admit rate).`);
  }

  // Verdict from admit probability, not raw fit.
  let verdict: Verdict;
  if (admitProbability >= 55) verdict = "Likely";
  else if (admitProbability >= 22) verdict = "Target";
  else verdict = "Reach";

  return {
    school,
    fit: Math.round(fit),
    admitProbability: Math.round(admitProbability),
    verdict,
    strengths: strengths.slice(0, 6),
    limitations: limitations.slice(0, 6),
    netCost: school.netCostUsd,
  };
}

export const RECOMMENDATION_CAP = 150;
export const LIKELY_FLOOR = 3;

// Below this normalized GPA, the student sits under most school medians and
// deserves a visible disclaimer about the realism of the matching.
const LOW_GPA_THRESHOLD = 3.35;

export function recommendSchools(profile: Profile): {
  matches: SchoolMatch[];
  floorApplied: boolean;
  lowGpa: boolean;
} {
  const ranked = SCHOOLS
    .map((s) => scoreSchool(profile, s))
    .sort((a, b) => b.fit - a.fit)
    .slice(0, RECOMMENDATION_CAP);

  const studentGpa = normalizeGpa(profile.gpa, profile.system);
  const lowGpa = studentGpa < LOW_GPA_THRESHOLD;
  const likelyCount = ranked.filter((m) => m.verdict === "Likely").length;
  let floorApplied = false;

  if (likelyCount < LIKELY_FLOOR) {
    floorApplied = true;
    const promotable = ranked
      .filter((m) => m.verdict !== "Likely" && m.school.intlAcceptance >= 40)
      .sort((a, b) => {
        const gapA = a.school.median.gpa - studentGpa;
        const gapB = b.school.median.gpa - studentGpa;
        if (Math.abs(gapA - gapB) > 0.05) return gapA - gapB;
        return b.school.intlAcceptance - a.school.intlAcceptance;
      });
    const needed = LIKELY_FLOOR - likelyCount;
    for (const m of promotable.slice(0, needed)) m.verdict = "Likely";
  }

  return { matches: ranked, floorApplied, lowGpa };
}

export type MajorMatch = {
  major: Major;
  fit: number;
  reasons: string[];
};

export function recommendMajors(profile: Profile): MajorMatch[] {
  return MAJORS.map((m) => {
    const reasons: string[] = [];
    let fit = 40;

    const interestHits = overlap(m.interests, profile.interests);
    fit += interestHits * 12;
    if (interestHits >= 2) reasons.push(`Maps to ${interestHits} of your stated interests.`);

    const classHits = overlap(m.relatedClasses, profile.classes);
    fit += classHits * 8;
    if (classHits >= 1) reasons.push(`Builds on ${classHits} class${classHits > 1 ? "es" : ""} you're already taking.`);

    if (profile.extracurriculars.some((e) => m.interests.some((i) => e.toLowerCase().includes(i)))) {
      fit += 6;
      reasons.push(`Your extracurricular portfolio supports this direction.`);
    }

    fit = Math.max(8, Math.min(98, fit));
    return { major: m, fit: Math.round(fit), reasons: reasons.slice(0, 3) };
  }).sort((a, b) => b.fit - a.fit);
}

export function distributionFor(matches: SchoolMatch[]) {
  const reach = matches.filter((m) => m.verdict === "Reach").length;
  const target = matches.filter((m) => m.verdict === "Target").length;
  const likely = matches.filter((m) => m.verdict === "Likely").length;
  return { reach, target, likely, total: matches.length };
}

export function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
