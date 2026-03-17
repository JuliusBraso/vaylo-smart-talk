export type FamilyStatus = "single" | "family" | "children";
export type EmploymentType = "employee" | "freelancer" | "job_seeker";
export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type Goal = "bureaucracy" | "job" | "orientation";

export interface DNAInputs {
  family_status: FamilyStatus;
  employment_type: EmploymentType;
  language_level: LanguageLevel;
  goals: Goal[];
}

/**
 * Canonical Vaylo DNA v1.0 JSON shape stored in public.profiles.dna.
 * We allow additional fields for forward compatibility.
 */
export interface ProfileDNA {
  version: "1.0";
  inputs: DNAInputs;
  scores: Record<string, number>;
  segments: string[] | Record<string, unknown>;
  priority: string[];
  [key: string]: unknown;
}

