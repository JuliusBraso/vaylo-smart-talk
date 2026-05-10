import { Buffer } from "node:buffer";
import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import {
  createRequestId,
  internalErrorResponse,
  logRouteError,
  toErrorLike,
} from "@/lib/api/safe-error-response";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createClient } from "@/lib/supabase/server";
import {
  addDocument,
  buildDocumentStoragePath,
  deleteDocument,
  DOCUMENTS_BUCKET,
  getDocuments,
} from "@/lib/vaylo/documents";
import { enqueueDocumentIntelligenceJob } from "@/lib/vaylo/documents/document-intelligence-jobs";
import { runDocumentIntelligenceWorkerOnce } from "@/lib/vaylo/documents/process-document-intelligence-job";

export const runtime = "nodejs";

const MAX_BYTES = 52_428_800; // 50 MiB
const MAX_DOCUMENTS_PER_USER = 20;
const MAX_UPLOADS_PER_HOUR = 10;

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await getDocuments(supabase, user.id);
    return NextResponse.json({ documents });
  } catch (err) {
    const requestId = createRequestId();
    logRouteError("[documents API GET]", requestId, err);
    return internalErrorResponse({ requestId, status: 500, debugError: err });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing or empty file" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const oneHourAgoIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  {
    const { count: totalCount, error: totalErr } = await supabase
      .from("user_documents")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (totalErr) {
      const requestId = createRequestId();
      logRouteError("[documents API POST quota total count]", requestId, totalErr);
      return internalErrorResponse({ requestId, status: 500, debugError: totalErr });
    }
    if ((totalCount ?? 0) >= MAX_DOCUMENTS_PER_USER) {
      return NextResponse.json(
        { ok: false, error: "document_quota_exceeded" },
        { status: 429 },
      );
    }
  }

  {
    const { count: recentCount, error: recentErr } = await supabase
      .from("user_documents")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", oneHourAgoIso);

    if (recentErr) {
      const requestId = createRequestId();
      logRouteError("[documents API POST quota hourly count]", requestId, recentErr);
      return internalErrorResponse({ requestId, status: 500, debugError: recentErr });
    }
    if ((recentCount ?? 0) >= MAX_UPLOADS_PER_HOUR) {
      return NextResponse.json(
        { ok: false, error: "upload_rate_limited" },
        { status: 429 },
      );
    }
  }

  const path = buildDocumentStoragePath(user.id, file.name);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error: upErr } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(path, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (upErr) {
    const requestId = createRequestId();
    logRouteError("[documents API POST storage upload]", requestId, upErr);
    return internalErrorResponse({ requestId, status: 500, debugError: upErr });
  }

  try {
    const document = await addDocument(
      supabase,
      user.id,
      path,
      file.name,
      file.type || null,
    );

    // Durable enqueue (service role). Route remains auth-gated by current user.
    try {
      const enqueueClient = createServiceRoleClient();
      if (!enqueueClient) {
        throw new Error("service_role_not_configured");
      }
      await enqueueDocumentIntelligenceJob({
        supabase: enqueueClient,
        userId: user.id,
        documentId: document.id,
      });
    } catch (err) {
      const requestId = createRequestId();
      logRouteError("[documents intelligence enqueue]", requestId, err);
      // Consistent failure semantics: if enqueue fails, rollback uploaded doc.
      try {
        await deleteDocument(supabase, user.id, document.id);
      } catch (rollbackErr) {
        logRouteError("[documents intelligence enqueue rollback]", requestId, rollbackErr);
      }
      if (process.env.NODE_ENV !== "production") {
        const e = toErrorLike(err);
        return NextResponse.json(
          {
            ok: false,
            error: "document_intelligence_enqueue_failed",
            requestId,
            debug: {
              code: e.code ?? null,
              message: e.message ?? null,
              details: e.details ?? null,
              hint: e.hint ?? null,
            },
          },
          { status: 500 },
        );
      }
      return NextResponse.json(
        {
          ok: false,
          error: "document_intelligence_enqueue_failed",
          requestId,
        },
        { status: 500 },
      );
    }

    // Best-effort worker kick; job row remains the durable source of truth.
    try {
      after(() => {
        void runDocumentIntelligenceWorkerOnce();
      });
    } catch {
      void runDocumentIntelligenceWorkerOnce();
    }

    return NextResponse.json({ document });
  } catch (err) {
    const requestId = createRequestId();
    logRouteError("[documents API POST]", requestId, err);
    // Core metadata insert failed; clean up storage.
    try {
      await supabase.storage.from(DOCUMENTS_BUCKET).remove([path]);
    } catch (cleanupErr) {
      logRouteError("[documents API POST cleanup]", requestId, cleanupErr);
    }
    return internalErrorResponse({ requestId, status: 500, debugError: err });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id")?.trim() ?? "";
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await deleteDocument(supabase, user.id, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const requestId = createRequestId();
    const status = (e as Error & { status?: number }).status;
    if (status === 404) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    logRouteError("[documents API DELETE]", requestId, e);
    return internalErrorResponse({ requestId, status: 500, debugError: e });
  }
}
