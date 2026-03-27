import type { Profile } from "@/lib/profile";

export type UserContext = {
  hasSteuerId?: boolean;
  hasChildren?: boolean;
  hasHealthInsurance?: boolean;
  hasBankAccount?: boolean;
  registeredArbeitsagentur?: boolean;
  hasCv?: boolean;
  jobSearchUrgency?: "relaxed" | "urgent";
  childrenSchoolAge?: boolean;
  employmentType?: "employee" | "freelancer" | "job_seeker";
  completedSteps?: string[];
};

function isBoolean(x: unknown): x is boolean {
  return typeof x === "boolean";
}

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((v) => typeof v === "string");
}

/**
 * Map existing profile/DNA fields to a tiny assistant context.
 * This is intentionally conservative: when fields are missing we keep them as `undefined`,
 * so context overrides won't trigger and behavior stays keyword+DNA-based.
 */
export function getUserContextFromProfile(profile: unknown): UserContext {
  if (!profile || typeof profile !== "object") return {};

  const p = profile as Record<string, unknown>;

  const ctx: UserContext = {};

  // Explicit flags (if you add them to `profiles` later).
  if (isBoolean(p.has_steuer_id)) ctx.hasSteuerId = p.has_steuer_id;
  if (isBoolean(p.has_children)) ctx.hasChildren = p.has_children;
  if (isBoolean(p.has_health_insurance)) ctx.hasHealthInsurance = p.has_health_insurance;
  if (isBoolean(p.has_bank_account)) ctx.hasBankAccount = p.has_bank_account;
  if (isBoolean(p.registered_arbeitsagentur))
    ctx.registeredArbeitsagentur = p.registered_arbeitsagentur;
  if (isBoolean(p.has_cv)) ctx.hasCv = p.has_cv;
  if (isBoolean(p.children_school_age)) ctx.childrenSchoolAge = p.children_school_age;
  if (p.job_search_urgency === "relaxed" || p.job_search_urgency === "urgent") {
    ctx.jobSearchUrgency = p.job_search_urgency;
  }
  if (isStringArray(p.completedSteps)) ctx.completedSteps = p.completedSteps;

  // Derive employment type from existing profile fields.
  if (
    p.employment_type === "employee" ||
    p.employment_type === "freelancer" ||
    p.employment_type === "job_seeker"
  ) {
    ctx.employmentType = p.employment_type;
  }

  // Derive children state from existing `family_status` only when it's positive.
  // (We avoid setting `hasChildren=false` unless it is explicitly provided,
  // to keep overrides conservative.)
  if (p.family_status === "children") {
    ctx.hasChildren = true;
  }

  // If profile carries a `dna.inputs` wrapper, we can also infer from that.
  const dnaInputs = (p as Partial<Profile>).dna?.inputs;
  if (dnaInputs?.family_status === "children") {
    ctx.hasChildren = true;
  }

  return ctx;
}

