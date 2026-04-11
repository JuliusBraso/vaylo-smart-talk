/**
 * Legacy standalone DNA scorer (not wired into onboarding or `profiles.dna` writes).
 * Canonical production DNA: `calculateVayloDNA` in `lib/vaylo/dna-engine.ts` + `getProfileDNA`.
 * Safe to remove only after confirming no imports/usages; see `ARCHITECTURE_NOTES.md`.
 */
export type FamilyStatus = "single" | "family" | "children";
export type EmploymentType = "employee" | "freelancer" | "job_seeker";
export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type Goal = "bureaucracy" | "job" | "orientation";

export type DNAInputs = {
  family_status: FamilyStatus;
  employment_type: EmploymentType;
  language_level: LanguageLevel;
  goals: Goal[];
};

export type UserDNScores = {
  BN: number;
  JP: number;
  IS: number;
  CL: number;
};

export type PriorityKey = "bureaucracy" | "job" | "orientation" | "family_admin";

export type UserDNA = {
  version: "1.0";
  inputs: DNAInputs;
  scores: UserDNScores;
  segments: string[];
  priority: PriorityKey[];
  risk_flags: string[];
};

function clampScore(value: number): number {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

function dedupeGoals(goals: Goal[]): Goal[] {
  return Array.from(new Set(goals));
}

export function computeUserDNA(rawInputs: DNAInputs): UserDNA {
  const inputs: DNAInputs = {
    ...rawInputs,
    goals: dedupeGoals(rawInputs.goals),
  };

  const { family_status, employment_type, language_level, goals } = inputs;

  const hasBureaucracyGoal = goals.includes("bureaucracy");
  const hasJobGoal = goals.includes("job");
  const hasOrientationGoal = goals.includes("orientation");

  const langBNMap: Record<LanguageLevel, number> = {
    A1: 30,
    A2: 25,
    B1: 15,
    B2: 8,
    C1: 0,
  };

  const famBNMap: Record<FamilyStatus, number> = {
    single: 0,
    family: 10,
    children: 15,
  };

  const empJPMap: Record<EmploymentType, number> = {
    employee: 10,
    freelancer: 35,
    job_seeker: 60,
  };

  const langJPMap: Record<LanguageLevel, number> = {
    A1: 10,
    A2: 8,
    B1: 5,
    B2: 2,
    C1: 0,
  };

  const langISMap: Record<LanguageLevel, number> = {
    A1: 25,
    A2: 20,
    B1: 10,
    B2: 5,
    C1: 0,
  };

  const famISMap: Record<FamilyStatus, number> = {
    single: 5,
    family: 8,
    children: 12,
  };

  const famCLMap: Record<FamilyStatus, number> = {
    single: 10,
    family: 30,
    children: 45,
  };

  const empCLMap: Record<EmploymentType, number> = {
    employee: 10,
    freelancer: 25,
    job_seeker: 20,
  };

  const BNBase = hasBureaucracyGoal ? 60 : 0;
  const BN = clampScore(BNBase + langBNMap[language_level] + famBNMap[family_status]);

  const JPBaseGoal = hasJobGoal ? 25 : 0;
  const JP = clampScore(empJPMap[employment_type] + JPBaseGoal + langJPMap[language_level]);

  const ISBase = hasOrientationGoal ? 55 : 0;
  const IS = clampScore(ISBase + langISMap[language_level] + famISMap[family_status]);

  const CL = clampScore(famCLMap[family_status] + empCLMap[employment_type]);

  const scores: UserDNScores = { BN, JP, IS, CL };

  const segments: string[] = [];

  if (BN >= 70) segments.push("Bureaucracy-heavy");
  if (JP >= 70) segments.push("Job-urgent");
  if (IS >= 65) segments.push("Needs-orientation");
  if (CL >= 70) segments.push("High-complexity");

  const languageSensitive = language_level === "A1" || language_level === "A2";
  if (languageSensitive) segments.push("Language-sensitive");

  if (JP >= 70 && languageSensitive) {
    segments.push("Archetype: Fast-track-job (simple language)");
  }

  if (BN >= 70 && CL >= 70) {
    segments.push("Archetype: Family paperwork management");
  }

  if (IS >= 65 && family_status === "single") {
    segments.push("Archetype: Germany starter pack");
  }

  const risk_flags: string[] = [];

  if (languageSensitive) {
    risk_flags.push("risk_low_language");
  }

  if (employment_type === "job_seeker" && languageSensitive) {
    risk_flags.push("risk_employability_gap");
  }

  if (family_status === "children" && hasBureaucracyGoal) {
    risk_flags.push("risk_time_pressure");
  }

  if (employment_type === "freelancer" && hasBureaucracyGoal) {
    risk_flags.push("risk_tax_admin_overload");
  }

  const priorities: { key: PriorityKey; weight: number }[] = [
    { key: "bureaucracy", weight: BN },
    { key: "job", weight: JP },
    { key: "orientation", weight: IS },
    {
      key: "family_admin",
      weight: family_status !== "single" ? CL : 0,
    },
  ];

  priorities.sort((a, b) => b.weight - a.weight);

  const priority: PriorityKey[] = [];
  for (const p of priorities) {
    if (p.weight <= 0) continue;
    if (!priority.includes(p.key)) priority.push(p.key);
  }

  return {
    version: "1.0",
    inputs,
    scores,
    segments,
    priority,
    risk_flags,
  };
}

