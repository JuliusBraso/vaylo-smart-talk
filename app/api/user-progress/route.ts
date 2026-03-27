import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { markActionCompleted } from "@/lib/vaylo/user-progress";

async function getAuthedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * POST body: { actionId: string }
 * Marks the given dashboard action_id as completed for the current user.
 */
export async function POST(req: NextRequest) {
  const userId = await getAuthedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { actionId?: unknown };
  const actionId = typeof body.actionId === "string" ? body.actionId.trim() : "";
  if (!actionId) {
    return NextResponse.json({ error: "Invalid actionId" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await markActionCompleted(supabase, userId, actionId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (process.env.NEXT_PUBLIC_VAYLO_DEBUG === "1") {
    console.log("[Vaylo][progress]", { event: "action_completed", actionId });
  }

  return NextResponse.json({ ok: true });
}
