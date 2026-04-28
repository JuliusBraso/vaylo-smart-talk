import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { markActionCompleted } from "@/lib/vaylo/user-progress";
import { recordStepStateAfterActionCompleted } from "@/lib/vaylo/steps/record-action-completion-step-state";

type ProgressApiError = Error & {
  code?: string;
  details?: string | null;
  hint?: string | null;
};

/**
 * POST body: { actionId: string }
 * Marks the given dashboard action_id as completed for the current user.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  const userId = user?.id ?? null;
  if (!userId) {
    console.error("[Vaylo][progress] Unauthorized", { userError });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { actionId?: unknown } = {};
  try {
    body = (await req.json()) as { actionId?: unknown };
  } catch (e) {
    console.error("[Vaylo][progress] Invalid JSON body", e);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const actionId = typeof body.actionId === "string" ? body.actionId.trim() : "";
  if (!actionId) {
    console.error("[Vaylo][progress] Missing/invalid actionId", {
      userId,
      actionId: body.actionId,
    });
    return NextResponse.json({ error: "Invalid actionId" }, { status: 400 });
  }

  const { error } = await markActionCompleted(supabase, userId, actionId);
  if (error) {
    const progressError = error as ProgressApiError;
    if (process.env.NODE_ENV !== "production") {
      console.error("[Vaylo][progress] markActionCompleted failed FULL", {
        userId,
        actionId,
        error: progressError,
        errorCode: progressError?.code ?? null,
        errorMessage: progressError?.message ?? null,
        errorDetails: progressError?.details ?? null,
        errorHint: progressError?.hint ?? null,
      });
    }
    return NextResponse.json(
      {
        error: "Failed to mark action completed",
        code: progressError?.code ?? null,
        message: progressError?.message ?? null,
        details: progressError?.details ?? null,
        hint: progressError?.hint ?? null,
      },
      { status: 500 }
    );
  }

  try {
    await recordStepStateAfterActionCompleted({
      supabase,
      userId,
      dashboardActionId: actionId,
    });
  } catch {
    // Non-fatal: `user_progress` is canonical for dashboard exclusion; step-state is additive.
  }

  if (process.env.NEXT_PUBLIC_VAYLO_DEBUG === "1") {
    console.log("[Vaylo][progress]", { event: "action_completed", actionId });
  }

  return NextResponse.json({ ok: true });
}
