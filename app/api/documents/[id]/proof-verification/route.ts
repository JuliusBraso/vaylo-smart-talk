import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { applyDocumentStepProofDecision } from "@/lib/vaylo/documents/confirm-step-proof";
import { getUserStepState } from "@/lib/vaylo/steps/get-user-step-state";
import { syncUserStepState } from "@/lib/vaylo/steps/sync-user-step-state";

type Ctx = { params: Promise<{ id: string }> };

function statusForError(code: string | undefined): number {
  switch (code) {
    case "document_not_found":
      return 404;
    case "already_responded":
      return 409;
    case "classification_not_eligible":
    case "not_a_proof_step_for_document":
      return 400;
    case "unauthorized":
      return 401;
    default:
      return 400;
  }
}

export async function POST(req: NextRequest, context: Ctx) {
  const { id: documentId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { stepId?: unknown; decision?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const stepId = typeof body.stepId === "string" ? body.stepId.trim() : "";
  const decision =
    body.decision === "confirm" || body.decision === "reject"
      ? body.decision
      : null;

  if (!stepId || !decision) {
    return NextResponse.json(
      { error: "stepId and decision (confirm|reject) required" },
      { status: 400 },
    );
  }

  const result = await applyDocumentStepProofDecision({
    supabase,
    documentId,
    stepId,
    decision,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "failed" },
      { status: statusForError(result.error) },
    );
  }

  // Best-effort: ensure proof-confirmed steps become durable `verified` state.
  // Does not change RPC contract; relies on resolver + service-role sync.
  if (decision === "confirm") {
    try {
      const stepState = await getUserStepState({ supabase, userId: user.id });
      void syncUserStepState({ userId: user.id, resolvedSteps: stepState.steps });
    } catch {
      // Non-fatal: proof RPC already applied canonical writes (audit/progress/profile).
    }
  }

  return NextResponse.json({ ok: true });
}
