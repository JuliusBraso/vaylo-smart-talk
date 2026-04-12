/**
 * Server-side read model: when to show proof confirmation UI for a document.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserDocumentRow } from "@/lib/vaylo/documents";
import { getCompletedActionIds } from "@/lib/vaylo/user-progress";
import { resolveProofSignals, type ProofSignal } from "@/lib/vaylo/knowledge/resolve-proof-signals";

export const PROOF_CONFIRM_CONFIDENCE_THRESHOLD = 0.65;

export type ProofSuggestionUiState = {
  eligible: boolean;
  signals: ProofSignal[];
  steps: DocumentProofStepSuggestion[];
};

export type DocumentProofStepSuggestion = {
  stepId: string;
  stepSlug: string;
  label: string;
  canRespond: boolean;
  state:
    | "available"
    | "already_confirmed"
    | "already_rejected"
    | "progress_done"
    | "profile_done";
};

export function proofStepLabelFromSlug(slug: string): string {
  return slug
    .split(/[_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function profileBoolean(
  profile: Record<string, unknown> | null,
  snakeKey: string,
): boolean | null {
  if (!profile) return null;
  const v = profile[snakeKey];
  return typeof v === "boolean" ? v : null;
}

export async function getProofSuggestionUiState(params: {
  supabase: SupabaseClient;
  userId: string;
  doc: UserDocumentRow;
}): Promise<ProofSuggestionUiState> {
  const { supabase, userId, doc } = params;

  const signals = doc.document_type_id
    ? await resolveProofSignals(supabase, doc.document_type_id)
    : [];

  const confOk =
    doc.classification_status === "completed" &&
    !!doc.document_type_id &&
    (doc.classification_confidence ?? 0) >= PROOF_CONFIRM_CONFIDENCE_THRESHOLD;

  if (!confOk || signals.length === 0) {
    return { eligible: false, signals, steps: [] };
  }

  const [{ data: verRows }, completedIds, { data: prof }] = await Promise.all([
    supabase
      .from("user_document_step_verifications")
      .select("step_id, status")
      .eq("user_id", userId)
      .eq("document_id", doc.id),
    getCompletedActionIds(supabase, userId),
    supabase
      .from("profiles")
      .select("has_steuer_id, has_health_insurance, has_address_registration")
      .eq("id", userId)
      .maybeSingle(),
  ]);

  const verificationByStep = new Map<string, "confirmed" | "rejected">();
  for (const r of verRows ?? []) {
    const row = r as { step_id: string; status: string };
    if (row.status === "confirmed" || row.status === "rejected") {
      verificationByStep.set(row.step_id, row.status);
    }
  }

  const profile = (prof ?? null) as Record<string, unknown> | null;

  const steps: DocumentProofStepSuggestion[] = signals.map((s) => {
    const v = verificationByStep.get(s.stepId);
    if (v === "confirmed") {
      return {
        stepId: s.stepId,
        stepSlug: s.stepSlug,
        label: proofStepLabelFromSlug(s.stepSlug),
        canRespond: false,
        state: "already_confirmed",
      };
    }
    if (v === "rejected") {
      return {
        stepId: s.stepId,
        stepSlug: s.stepSlug,
        label: proofStepLabelFromSlug(s.stepSlug),
        canRespond: false,
        state: "already_rejected",
      };
    }
    if (s.actionId && completedIds.has(s.actionId)) {
      return {
        stepId: s.stepId,
        stepSlug: s.stepSlug,
        label: proofStepLabelFromSlug(s.stepSlug),
        canRespond: false,
        state: "progress_done",
      };
    }
    if (s.profileFlagKey) {
      const val = profileBoolean(profile, s.profileFlagKey);
      if (val === true) {
        return {
          stepId: s.stepId,
          stepSlug: s.stepSlug,
          label: proofStepLabelFromSlug(s.stepSlug),
          canRespond: false,
          state: "profile_done",
        };
      }
    }

    return {
      stepId: s.stepId,
      stepSlug: s.stepSlug,
      label: proofStepLabelFromSlug(s.stepSlug),
      canRespond: true,
      state: "available",
    };
  });

  return { eligible: true, signals, steps };
}

