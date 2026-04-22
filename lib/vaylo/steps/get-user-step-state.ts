import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserState } from "@/lib/vaylo/state/types";
import { chooseStrongerStatus } from "./status-precedence";
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

type DependencyEdgeRow = { step_id: string; depends_on_step_id: string };

type ProgressRow = { action_id: string };

type VerificationRow = { step_id: string; status: string; document_id?: string | null };

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

export async function getUserStepState(params: {
  supabase: SupabaseClient;
  userId: string;
  userState?: UserState;
}): Promise<GetUserStepStateResult> {
  const { supabase, userId } = params;

  // A) Knowledge graph: active steps + dependency edges
  const [{ data: stepsRaw, error: stepsErr }, { data: depsRaw, error: depsErr }] = await Promise.all([
    supabase
      .from("knowledge_steps")
      .select("id, topic_id, slug, action_id, eligibility_criteria")
      .eq("is_active", true),
    supabase.from("knowledge_step_dependencies").select("step_id, depends_on_step_id"),
  ]);

  if (stepsErr) throw stepsErr;
  if (depsErr) throw depsErr;

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

  function eligibilityApplies(criteria: unknown): boolean {
    if (!criteria || typeof criteria !== "object") return true;
    const c = criteria as Record<string, unknown>;
    if (!dnaInputs) {
      // No DNA/userState available: safest is to treat as applicable (do not hide steps).
      return true;
    }

    const emp = dnaInputs.employment_type;
    const fam = dnaInputs.family_status;
    const lang = dnaInputs.language_level;

    if (Array.isArray(c.employment_type)) {
      const allowed = c.employment_type.filter((x) => typeof x === "string") as string[];
      if (allowed.length > 0 && !allowed.includes(emp)) return false;
    }
    if (Array.isArray(c.family_status)) {
      const allowed = c.family_status.filter((x) => typeof x === "string") as string[];
      if (allowed.length > 0 && !allowed.includes(fam)) return false;
    }
    if (typeof c.requires_language_level_below === "string") {
      const max = langRank(c.requires_language_level_below);
      const cur = langRank(lang);
      if (max > 0 && cur >= max) return false;
    }

    return true;
  }

  const deps: DependencyEdgeRow[] = (depsRaw ?? [])
    .map((r) => {
      const o = r as Record<string, unknown>;
      return {
        step_id: String(o.step_id ?? ""),
        depends_on_step_id: String(o.depends_on_step_id ?? ""),
      } satisfies DependencyEdgeRow;
    })
    .filter((e) => !!e.step_id && !!e.depends_on_step_id);

  const depsByStep = new Map<string, string[]>();
  for (const e of deps) {
    const prev = depsByStep.get(e.step_id) ?? [];
    prev.push(e.depends_on_step_id);
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

  // Resolve per-step status
  const resolved: Record<string, ResolvedUserStepState> = {};

  // First pass: compute VERIFIED/COMPLETED baseline by truth sources, else dependency-based status
  for (const s of steps) {
    const depsForStep = [...new Set((depsByStep.get(s.id) ?? []).filter(Boolean))].sort();
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

    const eligibilityOk = eligibilityApplies(s.eligibility_criteria);

    resolved[s.id] = {
      stepId: s.id,
      topicId: s.topic_id,
      slug: s.slug,
      actionId: s.action_id,
      isApplicable: eligibilityOk,
      status: eligibilityOk ? status : chooseStrongerStatus(status, "blocked"),
      source: persisted?.source ?? sourceForDerivedStatus(status, { proof: hasConfirmedProof, legacyProgress: hasLegacyCompletedAction }),
      evidence: {
        hasConfirmedProof,
        hasLegacyCompletedAction,
        dependencyStepIds: depsForStep,
        blockedByStepIds: [],
        ...(eligibilityOk ? {} : { eligibility: { applicable: false } }),
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
      step.status === "in_progress"
    ) {
      continue;
    }
    const depsForStep = step.evidence.dependencyStepIds;
    if (depsForStep.length === 0) {
      step.status = chooseStrongerStatus(step.status, "eligible");
      step.source = step.source ?? "system";
      continue;
    }
    const blockedBy: string[] = [];
    for (const depId of depsForStep) {
      const dep = resolved[depId];
      if (!dep) {
        // Missing dependency row (inactive or unknown) is treated as blocked for safety.
        blockedBy.push(depId);
        continue;
      }
      if (dep.status !== "completed" && dep.status !== "verified") {
        blockedBy.push(depId);
      }
    }
    step.evidence.blockedByStepIds = blockedBy.sort();
    if (step.isApplicable === false) {
      // Eligibility failure forces blocked, but we still compute DAG blockers for consistency/inspection.
      step.status = "blocked";
      step.source = step.source ?? "system";
      continue;
    }

    if (blockedBy.length === 0) {
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
  };
  for (const s of Object.values(resolved)) {
    summary[s.status] += 1;
  }

  return { steps: resolved, summary };
}

