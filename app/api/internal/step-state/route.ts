import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserState } from "@/lib/vaylo/state/get-user-state";
import { getUserStepState } from "@/lib/vaylo/steps/get-user-step-state";
import { compareStatus } from "@/lib/vaylo/steps/status-precedence";
import type { UserStepStatus } from "@/lib/vaylo/steps/types";

export const runtime = "nodejs";

function hasInternalDebugSecret(req: NextRequest): boolean {
  const expected = process.env.VAYLO_INTERNAL_DEBUG_SECRET ?? "";
  const provided = req.headers.get("x-internal-debug-secret") ?? "";
  return expected.length > 0 && provided === expected;
}

export async function GET(req: NextRequest) {
  const allow =
    process.env.NODE_ENV === "development" ||
    ((process.env.I18N_STEP_STATE_DEBUG === "1" ||
      process.env.VAYLO_STEP_STATE_DEBUG === "1") &&
      hasInternalDebugSecret(req));
  if (!allow) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userState = await getUserState({ supabase, userId: user.id });
  const stepState = await getUserStepState({ supabase, userId: user.id, userState });

  const { data: persistedRows } = await supabase
    .from("user_step_state")
    .select("step_id, status, source, action_id, document_id, updated_at")
    .eq("user_id", user.id);

  const persistedByStep = new Map(
    (persistedRows ?? []).map((r) => {
      const row = r as {
        step_id: string;
        status: string;
        source: string;
        action_id: string | null;
        document_id: string | null;
        updated_at: string;
      };
      return [row.step_id, row] as const;
    }),
  );

  const reconciliation: Array<{
    stepId: string;
    resolvedStatus: string;
    persistedStatus: string | null;
    persistedSource: string | null;
    comparePersistedToResolved: number;
    inferredFromResolver: boolean;
  }> = [];

  for (const [stepId, resolved] of Object.entries(stepState.steps)) {
    const p = persistedByStep.get(stepId);
    reconciliation.push({
      stepId,
      resolvedStatus: resolved.status,
      persistedStatus: p?.status ?? null,
      persistedSource: p?.source ?? null,
      comparePersistedToResolved: p
        ? compareStatus(p.status as UserStepStatus, resolved.status)
        : 0,
      inferredFromResolver:
        !p ||
        compareStatus(resolved.status, p.status as UserStepStatus) > 0,
    });
  }

  return NextResponse.json({
    stepState,
    persistedRowCount: persistedByStep.size,
    persistedRows: persistedRows ?? [],
    reconciliation,
  });
}

