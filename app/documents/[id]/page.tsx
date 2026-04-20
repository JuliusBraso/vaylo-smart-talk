import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import DocumentDetailView from "@/app/documents/_components/DocumentDetailView";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";
import { getResolvedDict } from "@/lib/i18n/resolved-dict";
import { explainDocumentMock } from "@/lib/vaylo/document-explainer";
import { getDocumentTextPreview } from "@/lib/vaylo/document-text";
import { DOCUMENTS_BUCKET, getDocumentById } from "@/lib/vaylo/documents";
import { buildDocumentIntelligenceViewModel } from "@/lib/vaylo/documents/document-intelligence-explanation";
import { getDocumentKnowledgeLinks } from "@/lib/vaylo/documents/get-document-knowledge-links";
import { getProofSuggestionUiState } from "@/lib/vaylo/documents/get-proof-suggestion-ui-state";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DocumentDetailPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("wk_uiLang")?.value;
  const locale: Locale =
    cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
      ? (cookieLocale as Locale)
      : DEFAULT_LOCALE;
  const t = await getResolvedDict(locale);

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

  let knowledgeLinks = null;
  if (doc.document_type_id) {
    try {
      knowledgeLinks = await getDocumentKnowledgeLinks(
        supabase,
        doc.document_type_id,
      );
    } catch (e) {
      console.error("[documents detail intelligence ERROR]", e);
    }
  }

  // Intelligence panels must be best-effort: older DBs may lack knowledge tables/columns.
  let documentIntelligence: {
    sectionTitle: string;
    sectionSubtitle: string;
    lines: string[];
  } | null = null;
  try {
    const intelligenceVm = buildDocumentIntelligenceViewModel({
      doc,
      knowledge: knowledgeLinks,
      t,
    });
    documentIntelligence = {
      sectionTitle: t.documents.intelligenceSectionTitle,
      sectionSubtitle: t.documents.intelligenceSectionSubtitle,
      lines: intelligenceVm.lines,
    };
  } catch (e) {
    console.error("[documents detail intelligence ERROR]", e);
    documentIntelligence = null;
  }

  let proofUi = null;
  try {
    const proofState = await getProofSuggestionUiState({
      supabase,
      userId: user.id,
      doc,
    });
    proofUi =
      proofState.signals.length > 0 ? proofState : null;
  } catch (e) {
    console.error("[DOCUMENT PROOF UI]", e);
  }

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
      documentIntelligence={documentIntelligence}
      proofUi={proofUi}
    />
  );
}
