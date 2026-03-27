import type { Profile } from "@/lib/profile";

export type UserContext = {
  hasSteuerId?: boolean;
  hasChildren?: boolean;
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
  if (isBoolean(p.hasSteuerId)) ctx.hasSteuerId = p.hasSteuerId;
  if (isBoolean(p.hasChildren)) ctx.hasChildren = p.hasChildren;
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

