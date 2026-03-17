import type {
  FamilyStatus,
  EmploymentType,
  LanguageLevel,
  Goal,
} from "@/lib/dna/types";

export interface VayloDNA {
  version: "1.0";
  updated_at: string;
  inputs: {
    family_status: FamilyStatus;
    employment_type: EmploymentType;
    language_level: LanguageLevel;
    goals: Goal[];
  };
  scores: {
    job_focus: number;
    bureaucracy_focus: number;
    family_priority: number;
    integration_speed: number;
    [key: string]: number;
  };
  segments: {
    is_newcomer: boolean;
    needs_visa_support: boolean;
    high_urgency: boolean;
    [key: string]: boolean;
  };
  tier: "starter" | "advanced" | "pro";
}

export type VayloDNAInputs = {
  family_status: FamilyStatus;
  employment_type: EmploymentType;
  language_level: LanguageLevel;
  goals: Goal[];
};

function clamp(value: number, min = 0, max = 100): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function languageScore(level: LanguageLevel): number {
  switch (level) {
    case "A1":
      return 10;
    case "A2":
      return 25;
    case "B1":
      return 50;
    case "B2":
      return 75;
    case "C1":
      return 90;
  }
}

export function calculateVayloDNA(inputsRaw: VayloDNAInputs): VayloDNA {
  const goals: Goal[] = Array.from(new Set(inputsRaw.goals));
  const inputs: VayloDNAInputs = { ...inputsRaw, goals };

  const { family_status, employment_type, language_level } = inputs;

  const langScore = languageScore(language_level);
  const langBelowB1 = language_level === "A1" || language_level === "A2";

  let jobFocus = inputs.goals.includes("job") ? 80 : 20;
  if (employment_type === "job_seeker") jobFocus += 10;
  if (employment_type === "employee") jobFocus -= 10;
  jobFocus = clamp(jobFocus);

  let bureaucracyFocus = inputs.goals.includes("bureaucracy") ? 90 : 35;
  if (langBelowB1) bureaucracyFocus += 15;
  if (family_status !== "single") bureaucracyFocus += 10;
  bureaucracyFocus = clamp(bureaucracyFocus);

  let familyPriority: number;
  if (family_status === "children") familyPriority = 100;
  else if (family_status === "family") familyPriority = 70;
  else familyPriority = 20;

  let integrationSpeed = langScore;
  if (inputs.goals.includes("orientation")) integrationSpeed += 10;
  if (inputs.goals.includes("bureaucracy") && langBelowB1) {
    integrationSpeed -= 10;
  }
  integrationSpeed = clamp(integrationSpeed);

  const highUrgency =
    inputs.goals.includes("job") && employment_type === "job_seeker";
  const needsVisaSupport =
    inputs.goals.includes("bureaucracy") && langBelowB1;

  const isNewcomer = false;

  const scores: VayloDNA["scores"] = {
    job_focus: jobFocus,
    bureaucracy_focus: bureaucracyFocus,
    family_priority: familyPriority,
    integration_speed: integrationSpeed,
  };

  const avgScore =
    (scores.job_focus +
      scores.bureaucracy_focus +
      scores.family_priority +
      scores.integration_speed) /
    4;

  let tier: VayloDNA["tier"] = "starter";
  if (
    highUrgency ||
    (scores.job_focus >= 80 && scores.bureaucracy_focus >= 80)
  ) {
    tier = "pro";
  } else if (avgScore >= 60) {
    tier = "advanced";
  }

  const updated_at = new Date().toISOString();

  return {
    version: "1.0",
    updated_at,
    inputs,
    scores,
    segments: {
      is_newcomer: isNewcomer,
      needs_visa_support: needsVisaSupport,
      high_urgency: highUrgency,
    },
    tier,
  };
}

