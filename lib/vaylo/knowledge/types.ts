/**
 * Row shapes for the relational knowledge layer (`010_knowledge_layer.sql`).
 * Column names match Postgres for direct mapping from Supabase `select('*')`.
 */

export type KnowledgeTopic = {
  id: string;
  slug: string;
  title_key: string;
  category: string;
  description_key: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type KnowledgeStep = {
  id: string;
  topic_id: string;
  slug: string;
  title_key: string;
  description_key: string | null;
  sort_order: number;
  is_critical: boolean;
  /** Optional alignment with dashboard / `user_progress` action ids. */
  action_id: string | null;
  is_active: boolean;
  created_at: string;
};

export type KnowledgeStepDependency = {
  step_id: string;
  depends_on_step_id: string;
};

export type DocumentType = {
  id: string;
  slug: string;
  title_key: string;
  description_key: string | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
};

export type DocumentTypeStepLinkType = "required" | "proof" | "supporting";

export type DocumentTypeStepLink = {
  document_type_id: string;
  step_id: string;
  link_type: DocumentTypeStepLinkType;
};

/** Step with outgoing dependency ids (step → prerequisites). */
export type KnowledgeStepWithDeps = KnowledgeStep & {
  depends_on_step_ids: string[];
};

/** Document type with all step links for that type. */
export type DocumentTypeWithLinks = DocumentType & {
  step_links: DocumentTypeStepLink[];
};

/** Topic with ordered steps, each with dependency ids. */
export type KnowledgeTopicWithSteps = KnowledgeTopic & {
  steps: KnowledgeStepWithDeps[];
};

/** Assembled read model for clients that need the MVP graph in one structure. */
export type KnowledgeGraph = {
  topics: KnowledgeTopicWithSteps[];
  document_types: DocumentTypeWithLinks[];
};
