import { NextRequest, NextResponse } from "next/server";
import {
  createRequestId,
  internalErrorResponse,
  logRouteError,
} from "@/lib/api/safe-error-response";
import { createClient } from "@/lib/supabase/server";
import { addFavorite, getFavorites, removeFavorite } from "@/lib/vaylo/favorites";

async function getAuthedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function GET() {
  const userId = await getAuthedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const phraseIds = await getFavorites(userId);
  return NextResponse.json({ phraseIds });
}

export async function POST(req: NextRequest) {
  const userId = await getAuthedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { phraseId?: unknown } = {};
  try {
    body = (await req.json()) as { phraseId?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const phraseId = typeof body.phraseId === "string" ? body.phraseId : "";
  if (!phraseId.trim()) {
    return NextResponse.json({ error: "Invalid phraseId" }, { status: 400 });
  }

  const ok = await addFavorite(userId, phraseId);
  if (!ok) {
    const requestId = createRequestId();
    logRouteError("[favorites POST]", requestId, "could_not_save_favorite");
    return internalErrorResponse({ requestId, status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const userId = await getAuthedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { phraseId?: unknown } = {};
  try {
    body = (await req.json()) as { phraseId?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const phraseId = typeof body.phraseId === "string" ? body.phraseId : "";
  if (!phraseId.trim()) {
    return NextResponse.json({ error: "Invalid phraseId" }, { status: 400 });
  }

  const ok = await removeFavorite(userId, phraseId);
  if (!ok) {
    const requestId = createRequestId();
    logRouteError("[favorites DELETE]", requestId, "could_not_remove_favorite");
    return internalErrorResponse({ requestId, status: 500 });
  }

  return NextResponse.json({ ok: true });
}

