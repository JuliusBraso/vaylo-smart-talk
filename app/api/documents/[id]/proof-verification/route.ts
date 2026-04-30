import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { applyDocumentStepProofDecision } from "@/lib/vaylo/documents/confirm-step-proof";
import { writeStepTransition } from "@/lib/vaylo/steps/write-step-transition";

type Ctx = { params: Promise<{ id: string }> };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
    case "internal_error":
      return 500;
    default:
      return 500;
  }
}

export async function POST(req: NextRequest, context: Ctx) {
  const { id: documentId } = await context.params;
  if (!UUID_RE.test(documentId)) {
    return NextResponse.json({ error: "Invalid documentId" }, { status: 400 });
  }
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

  // Durable step-state reflection (audit/progress/profile still canonical in RPC).
  if (decision === "confirm") {
    try {
      const { data: stepRow } = await supabase
        .from("knowledge_steps")
        .select("action_id")
        .eq("id", stepId)
        .maybeSingle();
      const catalogActionId =
        stepRow && typeof (stepRow as { action_id?: unknown }).action_id === "string"
          ? (stepRow as { action_id: string }).action_id
          : null;

      void writeStepTransition({
        supabase,
        userId: user.id,
        stepId,
        nextStatus: "verified",
        source: "proof",
        actionId: catalogActionId,
        documentId,
        notes: { bridge: "proof_confirm_rpc" },
      }).catch(() => {
        /* non-fatal */
      });
    } catch {
      // Non-fatal: proof RPC already applied canonical writes (audit/progress/profile).
    }
  }

  return NextResponse.json({ ok: true });
}
