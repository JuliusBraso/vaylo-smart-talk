/**
 * User-initiated proof confirmation / rejection (calls transactional Postgres RPCs).
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type ProofVerificationDecision = "confirm" | "reject";

type RpcResult = { ok?: boolean; error?: string };

function parseRpcPayload(data: unknown): RpcResult {
  if (!data || typeof data !== "object") return { ok: false, error: "invalid_response" };
  const o = data as Record<string, unknown>;
  const ok = o.ok === true;
  const err = typeof o.error === "string" ? o.error : undefined;
  return { ok, error: err };
}

export async function applyDocumentStepProofDecision(params: {
  supabase: SupabaseClient;
  documentId: string;
  stepId: string;
  decision: ProofVerificationDecision;
}): Promise<{ ok: boolean; error?: string }> {
  const { supabase, documentId, stepId, decision } = params;
  const fn =
    decision === "confirm"
      ? "confirm_document_step_proof"
      : "reject_document_step_proof";

  const { data, error } = await supabase.rpc(fn, {
    p_document_id: documentId,
    p_step_id: stepId,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[proof decision rpc]", {
        fn,
        documentId,
        stepId,
        code: (error as { code?: string }).code ?? null,
        message: error.message ?? null,
        details: (error as { details?: string | null }).details ?? null,
        hint: (error as { hint?: string | null }).hint ?? null,
      });
    }
    return { ok: false, error: "internal_error" };
  }

  const parsed = parseRpcPayload(data);
  if (!parsed.ok) {
    return { ok: false, error: parsed.error ?? "rpc_failed" };
  }
  return { ok: true };
}
