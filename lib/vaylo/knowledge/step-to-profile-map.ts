/**
 * Allowlisted `profiles` columns that may be set when a user confirms document proof.
 * Source of truth for which column applies to a step is `knowledge_steps.profile_flag_key`
 * (see migration `012_proof_signals_and_verifications.sql`). This list is used for
 * type-safe checks in TS only — do not hardcode step → profile mappings in UI.
 */
export const PROFILE_FLAG_COLUMNS = [
  "has_steuer_id",
  "has_health_insurance",
  "has_address_registration",
] as const;

export type ProfileFlagColumn = (typeof PROFILE_FLAG_COLUMNS)[number];

export function isProfileFlagColumn(value: string): value is ProfileFlagColumn {
  return (PROFILE_FLAG_COLUMNS as readonly string[]).includes(value);
}
