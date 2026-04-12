import type { SupabaseClient } from "@supabase/supabase-js";
import { getProfileDNA } from "@/lib/dna/get-profile-dna";
import type { ProfileDNA } from "@/lib/dna/types";
import { getUserBehaviorSignals } from "@/lib/dashboard/get-user-behavior-signals";
import type { LiveSituation } from "@/lib/vaylo/live-situation";
import { getLiveSituationFromProfile } from "@/lib/vaylo/live-situation";
import {
  isBankAccountCriticalGap,
  isHealthInsuranceMissing,
} from "@/lib/dashboard/reality-gates";
import type { UserState, UserStateProfileFlags } from "./types";

/** Mirrors `employmentTypeForScoring` in `get-dashboard-actions.ts` (live overrides DNA). */
function employmentTypeForDerived(
  liveSituation: LiveSituation,
  dna: ProfileDNA,
): "employee" | "freelancer" | "job_seeker" {
  return (
    liveSituation.employmentType ?? dna.inputs.employment_type
  ) as "employee" | "freelancer" | "job_seeker";
}

/**
 * Conservative blockers aligned with `collectCriticalBlockers` in `get-dashboard-actions.ts`.
 * Internal read model only — dashboard UI still uses the existing engine.
 */
function buildDerivedBlockers(
  liveSituation: LiveSituation,
  dna: ProfileDNA | null,
): string[] {
  if (!dna) return [];

  const emp = employmentTypeForDerived(liveSituation, dna);
  const blockers: string[] = [];

  if (isHealthInsuranceMissing(liveSituation)) {
    blockers.push("missing_health_insurance");
  }
  if (emp === "freelancer" && liveSituation.hasSteuerId === false) {
    blockers.push("missing_steuer_id");
  }
  if (isBankAccountCriticalGap(liveSituation)) {
    blockers.push("missing_bank_account");
  }
  if (emp === "job_seeker" && liveSituation.registeredArbeitsagentur === false) {
    blockers.push("missing_arbeitsagentur_registration");
  }

  const missingCv =
    liveSituation.hasCv === false || liveSituation.hasCV === false;
  if (emp === "job_seeker" && missingCv) {
    blockers.push("missing_cv_job_seeker");
    if (liveSituation.jobSearchUrgency === "urgent") {
      blockers.push("missing_cv_with_urgent_job_search");
    }
  }

  return blockers;
}

/** Columns needed for live situation + scalar drift checks; keep in sync with `getLiveSituationFromProfile`. */
const PROFILE_COLUMNS_FOR_USER_STATE =
  "has_steuer_id, has_health_insurance, has_address_registration, has_bank_account, registered_arbeitsagentur, has_children, children_school_age, has_cv, job_search_urgency, employment_type, family_status, language_level, goals";

function profileRowToFlags(
  profile: Record<string, unknown> | null | undefined,
): UserStateProfileFlags {
  if (!profile) return {};
  const p = profile;
  return {
    hasSteuerId: typeof p.has_steuer_id === "boolean" ? p.has_steuer_id : null,
    hasHealthInsurance:
      typeof p.has_health_insurance === "boolean" ? p.has_health_insurance : null,
    hasAddressRegistration:
      typeof p.has_address_registration === "boolean"
        ? p.has_address_registration
        : null,
    hasBankAccount: typeof p.has_bank_account === "boolean" ? p.has_bank_account : null,
    registeredArbeitsagentur:
      typeof p.registered_arbeitsagentur === "boolean"
        ? p.registered_arbeitsagentur
        : null,
    hasChildren: typeof p.has_children === "boolean" ? p.has_children : null,
    childrenSchoolAge:
      typeof p.children_school_age === "boolean" ? p.children_school_age : null,
    hasCv: typeof p.has_cv === "boolean" ? p.has_cv : null,
    jobSearchUrgency:
      p.job_search_urgency === "relaxed" || p.job_search_urgency === "urgent"
        ? p.job_search_urgency
        : typeof p.job_search_urgency === "string"
          ? p.job_search_urgency
          : null,
  };
}

function parseGoalsFromProfile(raw: unknown): string[] | null {
  if (raw == null) return null;
  if (Array.isArray(raw)) {
    return raw.filter((g): g is string => typeof g === "string");
  }
  return null;
}

function goalsEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

function buildDerivedWarnings(params: {
  dna: ProfileDNA | null;
  profile: Record<string, unknown> | null | undefined;
}): string[] {
  const { dna, profile } = params;
  const warnings: string[] = [];

  if (!dna) {
    warnings.push("missing_dna");
    return warnings;
  }

  const empScalar =
    typeof profile?.employment_type === "string" ? profile.employment_type : null;
  if (empScalar && empScalar !== dna.inputs.employment_type) {
    warnings.push("employment_scalar_dna_mismatch");
  }

  const famScalar =
    typeof profile?.family_status === "string" ? profile.family_status : null;
  if (famScalar && famScalar !== dna.inputs.family_status) {
    warnings.push("family_status_scalar_dna_mismatch");
  }

  const langScalar =
    typeof profile?.language_level === "string" ? profile.language_level : null;
  if (langScalar && langScalar !== dna.inputs.language_level) {
    warnings.push("language_level_scalar_dna_mismatch");
  }

  const goalsScalar = parseGoalsFromProfile(profile?.goals);
  const goalsDna = dna.inputs.goals.map(String);
  if (goalsScalar && goalsScalar.length > 0 && !goalsEqual(goalsScalar, goalsDna)) {
    warnings.push("goals_scalar_dna_mismatch");
  }

  if (dna && profile == null) {
    warnings.push("profile_context_missing_for_dna");
  }

  return warnings;
}

/**
 * Single entry point for consolidated user state used by dashboard and future decision layers.
 */
export async function getUserState(params: {
  supabase: SupabaseClient;
  userId: string;
  dna?: ProfileDNA | null;
  profileRow?: Record<string, unknown> | null;
}): Promise<UserState> {
  const { supabase, userId } = params;

  const dna =
    params.dna !== undefined ? params.dna : await getProfileDNA(supabase, userId);

  let profile: Record<string, unknown> | null = null;
  if (params.profileRow !== undefined) {
    profile = params.profileRow;
  } else {
    const { data } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS_FOR_USER_STATE)
      .eq("id", userId)
      .maybeSingle();
    profile = (data as Record<string, unknown> | null) ?? null;
  }

  const liveSituation = getLiveSituationFromProfile(profile);
  const behavior = await getUserBehaviorSignals(supabase, userId);

  const completedActionIds = Array.from(behavior.completedActionIds);
  const repeatedClickActionIds = Array.from(behavior.repeatedClickActionIds);
  const timeDecayBoost: Record<string, number> = {};
  for (const [k, v] of behavior.timeDecayBoost) {
    timeDecayBoost[k] = v;
  }

  // --- Documents summary (lightweight; no extracted_text) ---
  // Future: map verified document types into proof-of-truth reality signals.
  // Example: anmeldung_confirmation -> hasAnmeldung = true
  // TODO: when `document_type` (or similar) is added to `user_documents`, select it here and
  //       populate `recentDocumentTypes` with semantic types instead of/in addition to mime_type.
  let documentsTotal = 0;
  let recentDocumentTypes: string[] = [];
  {
    const { count, error: countErr } = await supabase
      .from("user_documents")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (!countErr && typeof count === "number") {
      documentsTotal = count;
    }

    const { data: recentRows } = await supabase
      .from("user_documents")
      .select("mime_type")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (recentRows && recentRows.length > 0) {
      const types: string[] = [];
      for (const row of recentRows as Array<{ mime_type?: unknown }>) {
        if (typeof row.mime_type === "string" && row.mime_type.length > 0) {
          types.push(row.mime_type);
        }
      }
      recentDocumentTypes = types;
    }
  }

  const identityFromDna = dna?.inputs;

  const canonicalEmploymentType =
    liveSituation.employmentType ?? identityFromDna?.employment_type ?? null;

  const warnings = buildDerivedWarnings({
    dna,
    profile,
  });

  const blockers =
    dna != null ? buildDerivedBlockers(liveSituation, dna) : [];

  const userState: UserState = {
    identity: {
      dna,
      familyStatus: identityFromDna?.family_status ?? null,
      employmentType: identityFromDna?.employment_type ?? null,
      languageLevel: identityFromDna?.language_level ?? null,
      goals: identityFromDna?.goals?.map(String),
    },
    reality: {
      liveSituation,
      profileFlags: profileRowToFlags(profile),
      documents: {
        total: documentsTotal,
        recentDocumentTypes,
        hasDocuments: documentsTotal > 0,
      },
    },
    progress: {
      completedActionIds,
    },
    behavior: {
      repeatedClickActionIds,
      timeDecayBoost,
    },
    derived: {
      canonicalEmploymentType,
      blockers,
      warnings,
    },
  };

  return userState;
}
