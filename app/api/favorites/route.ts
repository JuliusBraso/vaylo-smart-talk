import { NextRequest, NextResponse } from "next/server";
import {
  createRequestId,
  internalErrorResponse,
  logRouteError,
} from "@/lib/api/safe-error-response";
import { createClient } from "@/lib/supabase/server";
import { addFavorite, getFavorites, removeFavorite } from "@/lib/vaylo/favorites";

const PHRASE_ID_MAX_LEN = 160;
const PHRASE_ID_PATTERN = /^[a-zA-Z0-9:_-]+$/;

function parseValidatedPhraseId(
  raw: unknown
): { ok: true; phraseId: string } | { ok: false } {
  if (typeof raw !== "string") {
    return { ok: false };
  }
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > PHRASE_ID_MAX_LEN) {
    return { ok: false };
  }
  if (!PHRASE_ID_PATTERN.test(trimmed)) {
    return { ok: false };
  }
  return { ok: true, phraseId: trimmed };
}

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
  const parsed = parseValidatedPhraseId(body.phraseId);
  if (!parsed.ok) {
    return NextResponse.json({ error: "Invalid phraseId" }, { status: 400 });
  }

  const ok = await addFavorite(userId, parsed.phraseId);
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
  const parsed = parseValidatedPhraseId(body.phraseId);
  if (!parsed.ok) {
    return NextResponse.json({ error: "Invalid phraseId" }, { status: 400 });
  }

  const ok = await removeFavorite(userId, parsed.phraseId);
  if (!ok) {
    const requestId = createRequestId();
    logRouteError("[favorites DELETE]", requestId, "could_not_remove_favorite");
    return internalErrorResponse({ requestId, status: 500 });
  }

  return NextResponse.json({ ok: true });
}

