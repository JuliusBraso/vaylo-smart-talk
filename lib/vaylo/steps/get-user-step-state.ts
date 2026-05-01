import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserState } from "@/lib/vaylo/state/types";
import {
  computeRealityModel,
  type RealityModel,
} from "@/lib/vaylo/state/compute-reality-model";
import { chooseStrongerStatus } from "./status-precedence";
import { evaluateGroupedDependencies } from "./dependency-groups";
import {
  type GetUserStepStateResult,
  type ResolvedUserStepState,
  type UserStepSource,
  type UserStepStatus,
  type UserStepStateRow,
} from "./types";

type KnowledgeStepRow = {
  id: string;
  topic_id: string;
  slug: string;
  action_id: string | null;
  eligibility_criteria: unknown | null;
};

type DependencyEdgeRow = { step_id: string; depends_on_step_id: string; dependency_group: string | null };

type ProgressRow = { action_id: string };

type VerificationRow = { step_id: string; status: string; document_id?: string | null };

let hasLoggedDependencyGroupFallbackInfo = false;

function sourceForDerivedStatus(s: UserStepStatus, opts: { proof: boolean; legacyProgress: boolean }): UserStepSource {
  if (s === "verified" && opts.proof) return "proof";
  if (s === "completed" && opts.legacyProgress) return "legacy_progress";
  return "system";
}

function parsePersistedRow(row: unknown): UserStepStateRow | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const status = typeof r.status === "string" ? (r.status as UserStepStatus) : null;
  const source = typeof r.source === "string" ? (r.source as UserStepSource) : null;
  if (!status || !source) return null;
  return {
    id: String(r.id ?? ""),
    user_id: String(r.user_id ?? ""),
    step_id: String(r.step_id ?? ""),
    status,
    source,
    action_id: typeof r.action_id === "string" ? r.action_id : null,
    document_id: typeof r.document_id === "string" ? r.document_id : null,
    notes: r.notes ?? null,
    created_at: String(r.created_at ?? ""),
    updated_at: String(r.updated_at ?? ""),
  };
}

function isStepAlreadySatisfiedByReality(
  step: Pick<KnowledgeStepRow, "id" | "slug" | "action_id">,
  realityModel: RealityModel,
): boolean {
  const keys = [step.id, step.slug, step.action_id]
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.toLowerCase().replace(/_/g, "-"));

  const matches = (patterns: readonly string[]) =>
    keys.some((value) => patterns.some((pattern) => value === pattern || value.includes(pattern)));

  const healthPatterns = [
    "health-submit-membership",
    "health-insurance",
    "critical-health",
    "insurance",
  ] as const;
  const bankPatterns = [
    "bank-account-open",
    "bank-account",
    "critical-bank",
  ] as const;
  const steuerPatterns = [
    "steuer-id-received",
    "steuer-id",
    "tax-id",
    "steuer",
    "tax",
  ] as const;
  const anmeldungPatterns = [
    "anmeldung",
    "address-registration",
    "registration",
  ] as const;

  if (realityModel.hasHealthInsurance && matches(healthPatterns)) return true;
  if (realityModel.hasBankAccount && matches(bankPatterns)) return true;
  if (realityModel.hasSteuerId && matches(steuerPatterns)) return true;
  if (realityModel.hasAnmeldung && matches(anmeldungPatterns)) return true;
  return false;
}

export async function getUserStepState(params: {
  supabase: SupabaseClient;
  userId: string;
  userState?: UserState;
}): Promise<GetUserStepStateResult> {
  const { supabase, userId } = params;

  // A) Knowledge graph: active steps + dependency edges
  // Compatibility: older DBs may not have `dependency_group` yet.
  let depsRaw: unknown[] | null = null;
  try {
    const { data, error } = await supabase
      .from("knowledge_step_dependencies")
      .select("step_id, depends_on_step_id, dependency_group");
    if (error) throw error;
    depsRaw = data as unknown[] | null;
  } catch (err) {
    if (
      process.env.NODE_ENV === "development" &&
      !hasLoggedDependencyGroupFallbackInfo
    ) {
      hasLoggedDependencyGroupFallbackInfo = true;
      console.info(
        "[step-state] dependency_group unavailable; using legacy AND dependencies only",
      );
    }
    const { data, error } = await supabase
      .from("knowledge_step_dependencies")
      .select("step_id, depends_on_step_id");
    if (error) throw error;
    depsRaw = data as unknown[] | null;
  }

  // Compatibility: older DBs may not have `eligibility_criteria` yet.
  let stepsRaw: unknown[] | null = null;
  try {
    const { data, error } = await supabase
      .from("knowledge_steps")
      .select("id, topic_id, slug, action_id, eligibility_criteria")
      .eq("is_active", true);
    if (error) throw error;
    stepsRaw = data as unknown[] | null;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[step-state] eligibility_criteria unavailable, skipping eligibility rules");
    }
    const { data, error } = await supabase
      .from("knowledge_steps")
      .select("id, topic_id, slug, action_id")
      .eq("is_active", true);
    if (error) throw error;
    stepsRaw = data as unknown[] | null;
  }

  const steps: KnowledgeStepRow[] = (stepsRaw ?? [])
    .map((r) => {
      const o = r as Record<string, unknown>;
      return {
        id: String(o.id ?? ""),
        topic_id: String(o.topic_id ?? ""),
        slug: String(o.slug ?? ""),
        action_id: typeof o.action_id === "string" ? o.action_id : null,
        eligibility_criteria: o.eligibility_criteria ?? null,
      } satisfies KnowledgeStepRow;
    })
    .filter((s) => !!s.id && !!s.topic_id && !!s.slug);

  const dnaInputs = params.userState?.identity.dna?.inputs;

  function langRank(lvl: string): number {
    switch (lvl) {
      case "A1":
        return 1;
      case "A2":
        return 2;
      case "B1":
        return 3;
      case "B2":
        return 4;
      case "C1":
        return 5;
      default:
        return 0;
    }
  }

  function evaluateEligibility(
    criteria: unknown,
  ): {
    applicable: boolean;
    reason?: "criteria_not_met" | "missing_data" | "unknown" | "already_satisfied";
    realityCheck?: { flag: string; value: boolean; expected: boolean };
  } {
    if (criteria == null) return { applicable: true };
    if (typeof criteria !== "object" || Array.isArray(criteria)) {
      // Malformed rules: do not skip; treat as unknown -> keep blocked downstream.
      return { applicable: false, reason: "unknown" };
    }
    if (!dnaInputs) return { applicable: false, reason: "missing_data" };

    const ctx: Record<string, string | boolean | null> = {
      employment_type: dnaInputs.employment_type ?? null,
      family_status: dnaInputs.family_status ?? null,
      language_level: dnaInputs.language_level ?? null,
      has_anmeldung: realityModel.hasAnmeldung,
      has_health_insurance: realityModel.hasHealthInsurance,
      has_bank_account: realityModel.hasBankAccount,
      has_steuer_id: realityModel.hasSteuerId,
    };

    const c = criteria as Record<string, unknown>;

    for (const [field, raw] of Object.entries(c)) {
      const current = ctx[field] ?? null;
      // Criteria references a field we don't have -> cannot decide safely.
      if (current == null) return { applicable: false, reason: "missing_data" };

      // Back-compat: simple array means "in".
      if (Array.isArray(raw)) {
        const allowed = raw.filter((x) => typeof x === "string") as string[];
        if (typeof current !== "string") return { applicable: false, reason: "missing_data" };
        if (allowed.length > 0 && (!current || !allowed.includes(current))) {
          return { applicable: false, reason: "criteria_not_met" };
        }
        continue;
      }

      // Back-compat: scalar string equals.
      if (typeof raw === "string") {
        if (!current || current !== raw) return { applicable: false, reason: "criteria_not_met" };
        continue;
      }

      // V1: operator object.
      if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        const o = raw as Record<string, unknown>;
        if ("exists" in o) {
          const want = o.exists === true;
          const exists = current != null && String(current).length > 0;
          if (want !== exists) return { applicable: false, reason: "criteria_not_met" };
          continue;
        }
        if ("equals" in o) {
          const wantString = typeof o.equals === "string" ? o.equals : null;
          const wantBool = typeof o.equals === "boolean" ? o.equals : null;
          if (wantString == null && wantBool == null) return { applicable: false, reason: "unknown" };

          if (wantBool != null) {
            if (typeof current !== "boolean") return { applicable: false, reason: "missing_data" };
            if (current !== wantBool) {
              if (current === true && wantBool === false) {
                return {
                  applicable: false,
                  reason: "already_satisfied",
                  realityCheck: { flag: field, value: current, expected: wantBool },
                };
              }
              return { applicable: false, reason: "criteria_not_met" };
            }
            continue;
          }

          if (!wantString) return { applicable: false, reason: "unknown" };
          if (typeof current !== "string") return { applicable: false, reason: "missing_data" };
          if (!current || current !== wantString) return { applicable: false, reason: "criteria_not_met" };
          continue;
        }
        if ("in" in o) {
          const allowed = Array.isArray(o.in) ? (o.in.filter((x) => typeof x === "string") as string[]) : [];
          if (Array.isArray(o.in) && allowed.length === 0) return { applicable: false, reason: "unknown" };
        if (typeof current !== "string") return { applicable: false, reason: "missing_data" };
        if (allowed.length > 0 && (!current || !allowed.includes(current))) {
            return { applicable: false, reason: "criteria_not_met" };
          }
          continue;
        }
        // Unknown operator object: do not skip.
        return { applicable: false, reason: "unknown" };
      }
    }

    return { applicable: true };
  }

  const deps: DependencyEdgeRow[] = (depsRaw ?? [])
    .map((r) => {
      const o = r as Record<string, unknown>;
      return {
        step_id: String(o.step_id ?? ""),
        depends_on_step_id: String(o.depends_on_step_id ?? ""),
        dependency_group: typeof o.dependency_group === "string" ? o.dependency_group : null,
      } satisfies DependencyEdgeRow;
    })
    .filter((e) => !!e.step_id && !!e.depends_on_step_id);

  const depsByStep = new Map<string, DependencyEdgeRow[]>();
  for (const e of deps) {
    const prev = depsByStep.get(e.step_id) ?? [];
    prev.push(e);
    depsByStep.set(e.step_id, prev);
  }

  // B) Existing user progress (legacy action_id completion)
  const completedActionIds = params.userState
    ? new Set(params.userState.progress.completedActionIds)
    : (() => null)();

  let completedActionsSet: Set<string>;
  if (completedActionIds) {
    completedActionsSet = completedActionIds;
  } else {
    const { data: progRaw, error: progErr } = await supabase
      .from("user_progress")
      .select("action_id")
      .eq("user_id", userId)
      .eq("status", "completed");
    if (progErr) throw progErr;
    const rows = (progRaw ?? []) as ProgressRow[];
    completedActionsSet = new Set(rows.map((r) => r.action_id).filter(Boolean));
  }

  // C) Proof verification: confirmed rows for (user, step)
  const { data: verRaw, error: verErr } = await supabase
    .from("user_document_step_verifications")
    .select("step_id, status, document_id")
    .eq("user_id", userId)
    .eq("status", "confirmed");
  if (verErr) throw verErr;

  const verifiedByStep = new Map<string, string | null>();
  for (const r of (verRaw ?? []) as VerificationRow[]) {
    if (!r.step_id) continue;
    const docId = typeof r.document_id === "string" ? r.document_id : null;
    // Prefer the first seen document id; audit correctness does not depend on the chosen document.
    if (!verifiedByStep.has(r.step_id)) verifiedByStep.set(r.step_id, docId);
  }

  // D) Existing persisted user_step_state (conservative merge)
  const { data: persistedRaw, error: persistedErr } = await supabase
    .from("user_step_state")
    .select("id, user_id, step_id, status, source, action_id, document_id, notes, created_at, updated_at")
    .eq("user_id", userId);
  if (persistedErr) throw persistedErr;

  const persistedByStep = new Map<string, UserStepStateRow>();
  for (const r of persistedRaw ?? []) {
    const parsed = parsePersistedRow(r);
    if (!parsed || !parsed.step_id) continue;
    persistedByStep.set(parsed.step_id, parsed);
  }

  // Build strong completion set (proof + persisted terminal statuses) for reality reconciliation.
  const completedStepIds = new Set<string>();
  for (const stepId of verifiedByStep.keys()) {
    completedStepIds.add(stepId);
  }
  for (const row of persistedByStep.values()) {
    if (row.status === "completed" || row.status === "verified") {
      completedStepIds.add(row.step_id);
    }
  }

  // Single source of truth for user reality used by eligibility context in step engine.
  const reality = (params.userState?.reality ?? {}) as Record<string, unknown>;

  const profileFlags = reality.profileFlags as
    | {
        hasHealthInsurance?: boolean;
        hasBankAccount?: boolean;
        hasSteuerId?: boolean;
        hasAddressRegistration?: boolean;
      }
    | undefined;
  const realityModel = computeRealityModel({
    profile: {
      has_health_insurance:
        profileFlags?.hasHealthInsurance === true ||
        reality.has_health_insurance === true,
      has_bank_account:
        profileFlags?.hasBankAccount === true ||
        reality.has_bank_account === true,
      has_steuer_id:
        profileFlags?.hasSteuerId === true ||
        reality.has_steuer_id === true,
      has_address_registration:
        profileFlags?.hasAddressRegistration === true ||
        reality.has_address_registration === true,
    },
    stepState: { completedStepIds },
  });

  // Resolve per-step status
  const resolved: Record<string, ResolvedUserStepState> = {};

  // First pass: compute VERIFIED/COMPLETED baseline by truth sources, else dependency-based status
  for (const s of steps) {
    const depsForStep = [
      ...new Set((depsByStep.get(s.id) ?? []).map((e) => e.depends_on_step_id).filter(Boolean)),
    ].sort();
    const hasConfirmedProof = verifiedByStep.has(s.id);
    const hasLegacyCompletedAction = !!s.action_id && completedActionsSet.has(s.action_id);

    let status: UserStepStatus;
    if (hasConfirmedProof) {
      status = "verified";
    } else if (hasLegacyCompletedAction) {
      status = "completed";
    } else {
      status = "eligible"; // provisional; corrected below after we know dependency statuses
    }

    const persisted = persistedByStep.get(s.id);
    if (persisted) {
      status = chooseStrongerStatus(persisted.status, status);
    }

    const eligibility = evaluateEligibility(s.eligibility_criteria);
    const alreadySatisfiedByReality = isStepAlreadySatisfiedByReality(s, realityModel);
    const preserveTerminalOrActive =
      status === "verified" || status === "completed" || status === "in_progress";
    const forceAlreadySatisfied = alreadySatisfiedByReality && !preserveTerminalOrActive;
    if (process.env.NODE_ENV === "development" && s.eligibility_criteria != null) {
      console.info("[step-state] eligibility evaluated", {
        stepId: s.id,
        applicable: eligibility.applicable,
        criteria: s.eligibility_criteria,
      });
    }

    const finalStatus: UserStepStatus = forceAlreadySatisfied
      ? "not_applicable"
      : eligibility.applicable
        ? status
        : status === "verified" || status === "completed" || status === "in_progress"
          ? status
          : eligibility.reason === "criteria_not_met" || eligibility.reason === "already_satisfied"
            ? "not_applicable"
            : "blocked";

    if (process.env.NODE_ENV === "development") {
      console.info("[step-state] branching decision", {
        stepId: s.id,
        status: finalStatus,
        isApplicable: eligibility.applicable,
        reason: eligibility.reason,
      });
      if (eligibility.reason === "already_satisfied" && eligibility.realityCheck) {
        console.info("[step-state] reality-check", {
          stepId: s.id,
          flag: eligibility.realityCheck.flag,
          value: eligibility.realityCheck.value,
          result: "not_applicable",
        });
      }
    }

    resolved[s.id] = {
      stepId: s.id,
      topicId: s.topic_id,
      slug: s.slug,
      actionId: s.action_id,
      isApplicable: forceAlreadySatisfied ? false : eligibility.applicable,
      ...(forceAlreadySatisfied
        ? { applicabilityReason: "already_satisfied" as const }
        : eligibility.applicable
          ? {}
          : { applicabilityReason: eligibility.reason ?? "unknown" }),
      status: finalStatus,
      source: persisted?.source ?? sourceForDerivedStatus(status, { proof: hasConfirmedProof, legacyProgress: hasLegacyCompletedAction }),
      evidence: {
        hasConfirmedProof,
        hasLegacyCompletedAction,
        dependencyStepIds: depsForStep,
        blockedByStepIds: [],
        ...(forceAlreadySatisfied
          ? { eligibility: { applicable: false, reason: "already_satisfied" as const } }
          : eligibility.applicable
            ? {}
            : { eligibility: { applicable: false, reason: eligibility.reason ?? "unknown" } }),
        ...(persisted
          ? {
              persisted: {
                status: persisted.status,
                source: persisted.source,
                updatedAt: persisted.updated_at,
                notes: persisted.notes ?? null,
              },
            }
          : {}),
        documentId: hasConfirmedProof ? verifiedByStep.get(s.id) ?? null : persisted?.document_id ?? null,
      },
    };
  }

  // Second pass: dependency gating for non-completed/non-verified steps
  for (const step of Object.values(resolved)) {
    if (
      step.status === "verified" ||
      step.status === "completed" ||
      step.status === "in_progress" ||
      step.status === "not_applicable"
    ) {
      continue;
    }
    const depsForStep = step.evidence.dependencyStepIds;
    if (depsForStep.length === 0) {
      step.status = chooseStrongerStatus(step.status, "eligible");
      step.source = step.source ?? "system";
      continue;
    }

    const depEdgesForStep = depsByStep.get(step.stepId) ?? [];
    const grouped = evaluateGroupedDependencies({
      deps: depEdgesForStep.map((e) => ({
        stepId: e.step_id,
        dependsOnStepId: e.depends_on_step_id,
        dependencyGroup: e.dependency_group,
      })),
      resolvedByStepId: resolved,
    });

    step.evidence.blockedByStepIds = grouped.blockedByStepIds;
    if (Object.keys(grouped.blockedDependencyGroups).length > 0) {
      step.evidence.blockedDependencyGroups = grouped.blockedDependencyGroups;
      if (process.env.NODE_ENV === "development") {
        console.info("[step-state] dependency group evaluated", {
          stepId: step.stepId,
          unsatisfiedGroups: Object.entries(grouped.blockedDependencyGroups).map(([groupId, deps]) => ({
            groupId,
            deps,
          })),
        });
      }
    }

    if (grouped.blockedByStepIds.length === 0) {
      step.status = "eligible";
      step.source = step.source ?? "system";
    } else {
      step.status = "blocked";
      step.source = step.source ?? "system";
    }
  }

  const summary = {
    totalSteps: steps.length,
    blocked: 0,
    eligible: 0,
    in_progress: 0,
    completed: 0,
    verified: 0,
    not_applicable: 0,
  };
  for (const s of Object.values(resolved)) {
    summary[s.status] += 1;
  }

  return { steps: resolved, summary };
}

