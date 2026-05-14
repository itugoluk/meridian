import { SCHOOLS, type School } from "../data/schools";
import { MAJORS, type Major } from "../data/majors";
import type { Profile } from "../store/useStore";

export type Verdict = "Reach" | "Target" | "Likely";

export type SchoolMatch = {
  school: School;
  fit: number;          // 0–100
  verdict: Verdict;
  reasons: string[];
  netCost: number;
};

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
  const reasons: string[] = [];
  let fit = 50;

  // 1. GPA alignment (max ±25)
  const studentGpa = normalizeGpa(profile.gpa, profile.system);
  const gpaDelta = studentGpa - school.median.gpa;
  if (gpaDelta >= 0.05) {
    fit += 18;
    reasons.push(`Your grades exceed the median admit profile.`);
  } else if (gpaDelta >= -0.1) {
    fit += 8;
    reasons.push(`Your grades are within the typical admit range.`);
  } else {
    // Smooth gradient: -6 at delta=-0.1, steepening to -22 at delta≈-0.8
    const penalty = Math.max(-22, -6 + gpaDelta * 20);
    fit += penalty;
    if (gpaDelta >= -0.3) {
      reasons.push(`Grades slightly below median — strong essays will matter.`);
    } else {
      reasons.push(`Grades are well below the median; treat this as a reach.`);
    }
  }

  // 2. Country alignment (max +15)
  if (profile.targetCountries.includes(school.country)) {
    fit += 14;
    reasons.push(`Located in ${school.country}, which you flagged as a target.`);
  } else {
    fit -= 6;
    if (profile.targetCountries.length > 0) {
      reasons.push(`${school.country} isn't on your target list (${profile.targetCountries.slice(0, 3).join(", ")}); applying here means committing to a country you didn't shortlist.`);
    }
  }

  // 3. Interest / strength overlap (max +22, or a negative-fit explanation)
  const interestMatches = countSchoolInterestMatches(school.strengths, profile.interests);
  if (interestMatches >= 3) {
    fit += 22;
    reasons.push(`${interestMatches} of this school's strengths line up with your interests.`);
  } else if (interestMatches === 2) {
    fit += 16;
    reasons.push(`Two of this school's strengths match your interests directly.`);
  } else if (interestMatches === 1) {
    fit += 9;
    reasons.push(`One major strength aligns with your interests.`);
  } else if (profile.interests.length > 0) {
    fit -= 12;
    const topStrengths = school.strengths.slice(0, 3).join(", ");
    const topInterests = profile.interests.slice(0, 3).join(", ");
    reasons.push(`Academic focus is the problem: this school's flagship areas (${topStrengths}) don't map to your stated interests (${topInterests}).`);
  }

  // 4. School-system acceptance (gate)
  if (!school.systemsAccepted.includes(profile.system)) {
    fit -= 14;
    reasons.push(`Application from ${profile.system} candidates is uncommon here.`);
  } else if (school.preferredSystem === profile.system) {
    fit += 5;
    reasons.push(`${profile.system} is the system this school most commonly admits from.`);
  }

  // 5. Vibe match (max +8)
  const vibeMatches = overlap(school.vibe as string[], profile.vibePreferences);
  fit += Math.min(8, vibeMatches * 3);

  // 6. Aid alignment for budget-sensitive students (max +10)
  if (profile.budgetUsd && profile.budgetUsd < school.stickerUsd) {
    if (school.netCostUsd <= profile.budgetUsd) {
      fit += 10;
      reasons.push(`Net cost (${formatUsd(school.netCostUsd)}) fits inside your stated budget.`);
    } else {
      fit -= 8;
      reasons.push(`Net cost (${formatUsd(school.netCostUsd)}) sits above your budget.`);
    }
  }

  fit = Math.max(2, Math.min(98, fit));

  // Verdict — gates on selectivity first, then fit.
  const intl = school.intlAcceptance;
  let verdict: Verdict;
  if (intl < 8 || fit < 38) verdict = "Reach";
  // Schools accepting < 20 % of internationals are always a Reach.
  else if (intl < 20) verdict = "Reach";
  // Moderately selective: only Target unless very high fit.
  else if (intl < 35) verdict = fit >= 78 ? "Likely" : fit >= 55 ? "Target" : "Reach";
  // Open schools: Likely at reasonable fit.
  else if (intl >= 50 && fit >= 58) verdict = "Likely";
  else if (intl >= 35 && fit >= 68) verdict = "Likely";
  else verdict = "Target";

  return {
    school,
    fit: Math.round(fit),
    verdict,
    reasons: reasons.slice(0, 5),
    netCost: school.netCostUsd,
  };
}

export const RECOMMENDATION_CAP = 150;
export const LIKELY_FLOOR = 3;

export function recommendSchools(profile: Profile): { matches: SchoolMatch[]; floorApplied: boolean } {
  const ranked = SCHOOLS
    .map((s) => scoreSchool(profile, s))
    .sort((a, b) => b.fit - a.fit)
    .slice(0, RECOMMENDATION_CAP);

  const likelyCount = ranked.filter((m) => m.verdict === "Likely").length;
  let floorApplied = false;

  if (likelyCount < LIKELY_FLOOR) {
    floorApplied = true;
    // Promote the most accessible schools regardless of GPA comparison —
    // a student below every school's median still deserves realistic safeties.
    const promotable = ranked
      .filter((m) => m.verdict !== "Likely" && m.school.intlAcceptance >= 40)
      .sort((a, b) => b.school.intlAcceptance - a.school.intlAcceptance);
    const needed = LIKELY_FLOOR - likelyCount;
    for (const m of promotable.slice(0, needed)) m.verdict = "Likely";
  }

  return { matches: ranked, floorApplied };
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
