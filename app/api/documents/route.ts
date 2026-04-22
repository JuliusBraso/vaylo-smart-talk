import { Buffer } from "node:buffer";
import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
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
    console.error("[documents API ERROR]", err);
    const message =
      err instanceof Error ? err.message : "Failed to list documents";
    return NextResponse.json({ error: message }, { status: 500 });
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
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  try {
    const document = await addDocument(
      supabase,
      user.id,
      path,
      file.name,
      file.type || null,
    );

    // Phase 3.7: durable enqueue. Upload must succeed even if worker is delayed.
    try {
      const job = await enqueueDocumentIntelligenceJob({
        supabase,
        userId: user.id,
        documentId: document.id,
      });
      console.info("[documents intelligence enqueue]", {
        documentId: document.id,
        jobId: job?.id ?? null,
        status: job?.status ?? null,
      });
    } catch (err) {
      console.error("[documents intelligence enqueue]", err);
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
    console.error("[documents API ERROR]", err);
    // Core metadata insert failed; clean up storage.
    try {
      await supabase.storage.from(DOCUMENTS_BUCKET).remove([path]);
    } catch (cleanupErr) {
      console.error("[documents POST postprocess ERROR]", cleanupErr);
    }
    const message = err instanceof Error ? err.message : "Failed to save metadata";
    return NextResponse.json({ error: message }, { status: 500 });
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
    const status = (e as Error & { status?: number }).status;
    if (status === 404) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const message = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
