import type { SupabaseClient } from "@supabase/supabase-js";
import type { Dict } from "@/lib/i18n";
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import type { GetUserStepStateResult } from "@/lib/vaylo/steps/types";
import { resolveKnowledgeDictString } from "@/lib/dashboard/resolve-knowledge-dict-string";

function humanizeStepId(id: string): string {
  return id.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export async function getDashboardHistoryActions(params: {
  supabase: SupabaseClient;
  stepState: GetUserStepStateResult;
  t: Dict;
  limit?: number;
}): Promise<DashboardAction[]> {
  const { supabase, stepState, t } = params;
  const limit = params.limit ?? 8;

  const candidates = Object.values(stepState.steps).filter((s) => {
    if (s.status === "verified" || s.status === "completed") return true;
    if (s.status === "not_applicable" && s.applicabilityReason === "already_satisfied") {
      return true;
    }
    return false;
  });

  // Explicitly exclude safe-skip criteria branching; history is about "done", not irrelevant paths.
  const filtered = candidates.filter((s) => s.applicabilityReason !== "criteria_not_met");

  const stepIds = [...new Set(filtered.map((s) => s.stepId))];
  const { data: rows, error } = await supabase
    .from("knowledge_steps")
    .select("id, topic_id, slug, title_key, description_key, sort_order")
    .in("id", stepIds);
  if (error) throw error;

  const metaById = new Map(
    (rows ?? []).map((r) => [
      String((r as { id?: unknown }).id ?? ""),
      r as {
        id: string;
        topic_id: string;
        slug: string;
        title_key: string;
        description_key: string | null;
        sort_order: number;
      },
    ]),
  );

  const sorted = [...filtered].sort((a, b) => {
    const aUpdated = a.evidence.persisted?.updatedAt ? Date.parse(a.evidence.persisted.updatedAt) : 0;
    const bUpdated = b.evidence.persisted?.updatedAt ? Date.parse(b.evidence.persisted.updatedAt) : 0;
    if (aUpdated !== bUpdated) return bUpdated - aUpdated;

    const am = metaById.get(a.stepId);
    const bm = metaById.get(b.stepId);
    const at = am?.topic_id ?? a.topicId;
    const bt = bm?.topic_id ?? b.topicId;
    if (at !== bt) return at.localeCompare(bt);
    const aso = typeof am?.sort_order === "number" ? am.sort_order : 999;
    const bso = typeof bm?.sort_order === "number" ? bm.sort_order : 999;
    if (aso !== bso) return aso - bso;
    return a.stepId.localeCompare(b.stepId);
  });

  const limited = sorted.slice(0, Math.max(0, Math.min(8, limit)));

  return limited.map((s) => {
    const meta = metaById.get(s.stepId);
    const stepTitle =
      (meta?.title_key ? resolveKnowledgeDictString(t, meta.title_key) : null) ??
      humanizeStepId(s.stepId);
    const stepHint =
      (meta?.description_key ? resolveKnowledgeDictString(t, meta.description_key) : null) ??
      null;

    return {
      id: `history:${s.stepId}`,
      title: stepTitle,
      description: "",
      reasons: [],
      href: "/dashboard",
      priority: "medium",
      cta: "",
      knowledgeStepId: s.stepId,
      stepDetails: { title: stepTitle, hint: stepHint },
      stepStatus: s.status,
      stepSource: s.source,
      isApplicable: s.isApplicable,
      ...(s.applicabilityReason ? { applicabilityReason: s.applicabilityReason } : {}),
      ...(s.evidence.blockedByStepIds?.length ? { blockedByStepIds: s.evidence.blockedByStepIds } : {}),
    } satisfies DashboardAction;
  });
}

