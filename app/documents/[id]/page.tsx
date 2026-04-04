import { notFound, redirect } from "next/navigation";
import DocumentDetailView from "@/app/documents/_components/DocumentDetailView";
import { createClient } from "@/lib/supabase/server";
import { explainDocumentMock } from "@/lib/vaylo/document-explainer";
import { getDocumentTextPreview } from "@/lib/vaylo/document-text";
import {
  DOCUMENTS_BUCKET,
  getDocumentById,
} from "@/lib/vaylo/documents";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DocumentDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let doc = null;

  try {
    doc = await getDocumentById(supabase, user.id, id);
  } catch (e) {
    console.error("[DOCUMENT LOAD ERROR]", e);
    notFound();
  }

  if (!doc) {
    notFound();
  }

  let preview: {
    supported: boolean;
    previewText: string | null;
    message: string;
    messageKey: "previewNotSupported" | "previewLoadFailed" | "previewLoaded";
  } = {
    supported: false,
    previewText: null,
    message: "Preview not loaded",
    messageKey: "previewLoadFailed",
  };

  try {
    preview = await getDocumentTextPreview({
      supabase,
      bucket: DOCUMENTS_BUCKET,
      filePath: doc.file_path,
      mimeType: doc.mime_type,
    });
  } catch (e) {
    console.error("[DOCUMENT PREVIEW ERROR]", e);
  }

  const mockExplanation = explainDocumentMock({
    fileName: doc.file_name,
    mimeType: doc.mime_type,
    extractedText: preview.previewText,
  });

  let signed = null;
  let signErr = null;

  try {
    const result = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(doc.file_path, 3600);

    signed = result.data;
    signErr = result.error;
  } catch (e) {
    console.error("[SIGNED URL ERROR]", e);
    signErr = e;
  }

  const downloadHref = !signErr && signed?.signedUrl ? signed.signedUrl : null;

  return (
    <DocumentDetailView
      doc={{
        id: doc.id,
        file_name: doc.file_name,
        mime_type: doc.mime_type,
        created_at: doc.created_at,
      }}
      preview={preview}
      downloadHref={downloadHref}
      explanation={{
        summary: mockExplanation.summary,
        urgency: mockExplanation.urgency,
        category: mockExplanation.category,
        suggestedActions: mockExplanation.suggestedActions,
      }}
    />
  );
}
