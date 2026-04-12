/** Stored `user_documents.classification_status` values. */
export type DocumentClassificationStatus =
  | "pending"
  | "completed"
  | "unknown"
  | "failed";

/** Normalized classifier output (before persistence). */
export type DocumentClassificationResult = {
  status: "completed" | "unknown" | "failed";
  documentTypeId: string | null;
  confidence: number | null;
  method: string | null;
  extractedMetadata: {
    sender?: string | null;
    documentDate?: string | null;
    summary?: string | null;
  } | null;
  /** Debug / audit notes (e.g. weak match, truncated text). */
  notes?: string[];
};

/** JSON shape for `user_documents.extracted_metadata` (Phase 1 MVP). */
export type DocumentExtractedMetadataJson = {
  sender?: string | null;
  documentDate?: string | null;
  summary?: string | null;
};

/** One step linked to a document type, with parent topic and link role. */
export type DocumentKnowledgeStepLink = {
  link_type: "required" | "proof" | "supporting";
  step: {
    id: string;
    slug: string;
    title_key: string;
    action_id: string | null;
  };
  topic: {
    id: string;
    slug: string;
    title_key: string;
  };
};

/** Resolved knowledge graph slice for a classified document type. */
export type DocumentKnowledgeLinks = {
  document_type_id: string;
  document_type_slug: string;
  document_type_title_key: string;
  step_links: DocumentKnowledgeStepLink[];
};
