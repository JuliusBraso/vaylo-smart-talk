import type { Database } from "../../../../supabase/database.types";

type PublicEnums = Database["public"]["Enums"];
type PublicTables = Database["public"]["Tables"];

export type KnowledgeHandlingMode = PublicEnums["knowledge_handling_mode"];
export type KnowledgeSourceClass = PublicEnums["knowledge_source_class"];
export type KnowledgeSourceEvidenceEligibility =
  PublicEnums["knowledge_source_evidence_eligibility"];
export type KnowledgeAuthorityLevel = PublicEnums["knowledge_authority_level"];
export type KnowledgeSourceAuthorizationState =
  PublicEnums["knowledge_source_authorization_state"];
export type KnowledgeAccessReviewStatus =
  PublicEnums["knowledge_access_review_status"];
export type KnowledgeSourceActiveStatus =
  PublicEnums["knowledge_source_active_status"];
export type KnowledgeSourceTrustStatus =
  PublicEnums["knowledge_source_trust_status"];
export type KnowledgeFreshnessClass = PublicEnums["knowledge_freshness_class"];
export type KnowledgeStaleBehavior = PublicEnums["knowledge_stale_behavior"];
export type KnowledgeRetrievalMethod = PublicEnums["knowledge_retrieval_method"];
export type KnowledgeSourceChangeClassification =
  PublicEnums["knowledge_source_change_classification"];
export type KnowledgeAcquisitionResult =
  PublicEnums["knowledge_acquisition_result"];
export type KnowledgeInformationClass =
  PublicEnums["knowledge_information_class"];
export type KnowledgeRequiredContextKey =
  PublicEnums["knowledge_required_context_key"];

export type KnowledgeSourceAuthorizationTransitionRow =
  PublicTables["knowledge_source_authorization_transitions"]["Row"];
export type KnowledgeSourceAuthorizationTransitionInsert =
  PublicTables["knowledge_source_authorization_transitions"]["Insert"];
export type KnowledgeSourceRegistryHistoryRow =
  PublicTables["knowledge_source_registry_history"]["Row"];
export type KnowledgeSourceHandlingPolicyRow =
  PublicTables["knowledge_source_handling_policies"]["Row"];
export type KnowledgeSourceHandlingPolicyInsert =
  PublicTables["knowledge_source_handling_policies"]["Insert"];
export type KnowledgeSourceHandlingPolicyUpdate =
  PublicTables["knowledge_source_handling_policies"]["Update"];
export type KnowledgeSourceAcquisitionAttemptRow =
  PublicTables["knowledge_source_acquisition_attempts"]["Row"];
export type KnowledgeSourceAcquisitionAttemptInsert =
  PublicTables["knowledge_source_acquisition_attempts"]["Insert"];

export type KnowledgeSourceRow = PublicTables["knowledge_sources"]["Row"];
export type KnowledgeSourceVersionRow =
  PublicTables["knowledge_source_versions"]["Row"];
export type KnowledgeRetrievalMetadataRow =
  PublicTables["knowledge_retrieval_metadata"]["Row"];
