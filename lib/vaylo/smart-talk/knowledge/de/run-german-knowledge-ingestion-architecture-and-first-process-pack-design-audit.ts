/**
 * PHASE 9I — German Knowledge Ingestion Architecture and First Process Pack
 * Design Audit (Design and Audit Only)
 *
 * This file defines the complete ingestion architecture for verified German
 * bureaucratic knowledge and the first process-pack contract for
 * `anmeldung_ummeldung_abmeldung`, building on PHASE 9A-9H. It performs NO
 * dynamic execution: no network, no source download, no ingestion, no
 * database write, no remote database, no Docker, no Supabase, no model
 * call, no OCR, no embeddings, no retrieval activation, no runtime wiring.
 *
 * It only:
 *   1. Declares immutable, type-only contracts for the 24-stage ingestion
 *      lifecycle, the 8 source-acquisition classes, the 11 risk classes,
 *      the 17 required architecture decisions, and the complete first
 *      process-pack manifest (identity, variants, jurisdiction matrix,
 *      trigger model, user-context requirements, process-step model,
 *      required-document model, deadline model, authority-resolution
 *      model, outcome model, warning model, evidence-completeness gate,
 *      First Contact compatibility, multilingual design).
 *   2. Statically inspects `supabase/migrations/032_create_minimal_knowledge_schema.sql`
 *      as plain text (never imports/executes it) to dynamically derive the
 *      real `knowledge_*` table names and maps every ingestion/pack concept
 *      to those real tables — inventing zero tables.
 *   3. Reads the PHASE 9H audit file as plain text (never imports/executes
 *      it) to ground a conservative readiness boolean.
 *   4. Runs read-only `git` commands to confirm this phase created exactly
 *      one new file and modified no existing file.
 *   5. Runs a substantial set of pure, in-memory tamper cases against a
 *      deep-cloned "good" Result and confirms each mutation is rejected.
 *   6. Prints a structured JSON report when executed.
 *
 * Zero real German sources are fetched, zero rows are inserted, zero
 * remote/local databases are touched, zero runtime retrieval is enabled.
 */

import { execSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// ─── Source / chain constants ───────────────────────────────────────────────

const SOURCE_CLOSURE_COMMIT = "961807e";
const SOURCE_MIGRATION_VALIDATION_CHECK_ID = "9H";

const PHASE_9H_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-empty-schema-migration-validation-closure-audit.ts";
const MIGRATIONS_DIR_REL_PATH = "supabase/migrations";
const MIGRATION_FILE_NAME = "032_create_minimal_knowledge_schema.sql";
const MIGRATION_REL_PATH = `${MIGRATIONS_DIR_REL_PATH}/${MIGRATION_FILE_NAME}`;
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-knowledge-ingestion-architecture-and-first-process-pack-design-audit.ts";

const LAUNCH_LOCALES = ["de", "en", "sk", "cs", "pl", "hu"] as const;
const FUTURE_LOCALES = ["ro", "bg", "uk", "tr", "ru"] as const;

function runGitReadOnly(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf8", cwd: process.cwd(), timeout: 8000 }).trim();
  } catch {
    return "";
  }
}

function readFileText(relPath: string): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), relPath), "utf8").replace(/\r\n/g, "\n");
  } catch {
    return "";
  }
}

function fileExists(relPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), relPath));
  } catch {
    return false;
  }
}

function sha256Hex(text: string): string {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

// ============================================================================
// STATIC MIGRATION-032 INSPECTION (dynamic; never guessed/hardcoded)
// ============================================================================

function extractKnowledgeTableNames(sql: string): string[] {
  const re = /create table if not exists public\.(knowledge_[a-z0-9_]+)\s*\(/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) names.push(m[1]);
  return names;
}

function extractRlsEnabledTables(sql: string): string[] {
  const re = /alter table public\.(knowledge_[a-z0-9_]+) enable row level security;/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) names.push(m[1]);
  return names;
}

function migrationHasInsertStatements(sql: string): boolean {
  return /\binsert\s+into\b/i.test(sql);
}

function migrationHasAnonOrAuthenticatedPolicy(sql: string): boolean {
  return /\bcreate policy\b/i.test(sql);
}

// ============================================================================
// A. INGESTION LIFECYCLE — 24 deterministic stages
// ============================================================================

type LifecycleStageId =
  | "source_discovery_candidate"
  | "source_registration"
  | "source_trust_classification"
  | "source_retrieval"
  | "immutable_source_version_creation"
  | "content_fingerprinting"
  | "passage_segmentation"
  | "structured_extraction_candidate_generation"
  | "claim_process_step_candidate_creation"
  | "jurisdiction_binding"
  | "effective_date_binding"
  | "source_passage_citation_binding"
  | "conflict_detection"
  | "review_assignment"
  | "human_review"
  | "approval_or_rejection"
  | "publication_eligibility"
  | "translation_candidate_creation"
  | "translation_review"
  | "runtime_publication"
  | "change_monitoring"
  | "supersession"
  | "withdrawal_or_emergency_disable"
  | "audit_trace_retention";

interface LifecycleStageSpec {
  order: number;
  stage: LifecycleStageId;
  input: string;
  output: string;
  trustState: string;
  allowedAutomation: readonly string[];
  prohibitedAutomation: readonly string[];
  dbEntities: readonly string[];
  failureState: string;
  retryIdempotencyBehavior: string;
  auditEvidenceRequired: readonly string[];
}

const INGESTION_LIFECYCLE: readonly LifecycleStageSpec[] = [
  { order: 1, stage: "source_discovery_candidate",
    input: "monitoring signal or manual tip (URL, publisher name, topic)",
    output: "unregistered discovery candidate, held outside the canonical registry",
    trustState: "untrusted_candidate",
    allowedAutomation: ["automated crawling/monitoring for candidate URLs", "heuristic official-domain matching"],
    prohibitedAutomation: ["auto-registration as a knowledge_sources row", "auto-classification as high trust"],
    dbEntities: ["none_in_current_schema (pre-registry staging is outside knowledge_* tables)"],
    failureState: "candidate_discarded",
    retryIdempotencyBehavior: "dedupe by normalized canonical URL before any DB write is attempted",
    auditEvidenceRequired: ["discovery source", "discovery timestamp", "heuristic match reason"] },
  { order: 2, stage: "source_registration",
    input: "vetted discovery candidate + publisher/official-domain assertion",
    output: "knowledge_sources row (discovery_use_allowed=true, high_risk_use_allowed=false by default)",
    trustState: "registered_unclassified",
    allowedAutomation: ["structured field population from static page metadata"],
    prohibitedAutomation: ["auto-setting high_risk_use_allowed=true", "self-declared official_domain_verification_status='verified'"],
    dbEntities: ["knowledge_sources", "knowledge_publishers", "knowledge_jurisdictions", "knowledge_territorial_scopes"],
    failureState: "registration_rejected_missing_publisher_competence",
    retryIdempotencyBehavior: "unique per (publisher_id, canonical_url); re-registration of an unchanged source is a no-op",
    auditEvidenceRequired: ["publisher competence check result", "jurisdiction assignment rationale"] },
  { order: 3, stage: "source_trust_classification",
    input: "registered source",
    output: "source_type/source_purpose classification + supports_claim_types/blocked_claim_types arrays",
    trustState: "classified",
    allowedAutomation: ["rules-based classification from declared source_type/source_purpose"],
    prohibitedAutomation: ["automation alone setting high_risk_use_allowed=true"],
    dbEntities: ["knowledge_sources"],
    failureState: "classification_unresolved_discovery_only",
    retryIdempotencyBehavior: "re-classification overwrites only classification columns, never content identity",
    auditEvidenceRequired: ["classification rule fired", "reviewer sign-off for any high_risk_use_allowed=true"] },
  { order: 4, stage: "source_retrieval",
    input: "classified source + canonical_url",
    output: "raw retrieved content and HTTP metadata",
    trustState: "retrieved_unverified",
    allowedAutomation: ["queued HTTP GET honoring robots.txt", "redirect following within the official domain family"],
    prohibitedAutomation: ["bypassing authentication/access controls", "ignoring robots.txt disallow", "fetching non-official mirrors"],
    dbEntities: ["knowledge_sources (retrieval bookkeeping only)"],
    failureState: "retrieval_failed_retry_then_review_required",
    retryIdempotencyBehavior: "idempotency key = (source_id, content_hash); unchanged content yields zero new version rows",
    auditEvidenceRequired: ["retrieved_at timestamp", "HTTP status/redirect chain", "content hash"] },
  { order: 5, stage: "immutable_source_version_creation",
    input: "successfully retrieved and normalized content",
    output: "knowledge_source_versions row (immutable=true, review_status='unverified', locked_at=null)",
    trustState: "version_draft",
    allowedAutomation: ["automatic version_sequence increment", "automatic content_hash computation"],
    prohibitedAutomation: ["mutating a locked version's content/identity columns", "skipping version_sequence uniqueness"],
    dbEntities: ["knowledge_source_versions"],
    failureState: "version_creation_no_op_on_duplicate_hash",
    retryIdempotencyBehavior: "unique(source_id, version_sequence); identical content_hash for the same source is a no-op",
    auditEvidenceRequired: ["content_hash", "supersedes_version_id (if any)", "retrieved_at"] },
  { order: 6, stage: "content_fingerprinting",
    input: "normalized content",
    output: "content_hash (source version) and text_hash (per passage)",
    trustState: "fingerprinted",
    allowedAutomation: ["deterministic hashing of normalized content"],
    prohibitedAutomation: ["fingerprinting raw un-normalized bytes as canonical identity"],
    dbEntities: ["knowledge_source_versions.content_hash", "knowledge_source_passages.text_hash"],
    failureState: "hash_computation_failed_version_stays_draft",
    retryIdempotencyBehavior: "pure function of normalized content; identical content always yields identical hash",
    auditEvidenceRequired: ["hash algorithm/version", "normalization pipeline version"] },
  { order: 7, stage: "passage_segmentation",
    input: "normalized content of one source version",
    output: "knowledge_source_passages rows with stable passage_order and structural anchors",
    trustState: "segmented_unverified",
    allowedAutomation: ["deterministic structural segmentation (headings/paragraphs/articles)"],
    prohibitedAutomation: ["LLM-invented passage boundaries not traceable to source structure"],
    dbEntities: ["knowledge_source_passages"],
    failureState: "segmentation_failed_blocks_claim_linkage",
    retryIdempotencyBehavior: "unique(source_version_id, passage_order); re-segmentation replaces only its own version's passages",
    auditEvidenceRequired: ["segmentation method", "passage-order stability proof (structural anchors)"] },
  { order: 8, stage: "structured_extraction_candidate_generation",
    input: "segmented passages",
    output: "unreviewed structured extraction candidates (process/step/document/deadline shape hints)",
    trustState: "machine_prechecked_candidate_only",
    allowedAutomation: ["rules-based or LLM-assisted candidate extraction"],
    prohibitedAutomation: ["LLM candidate treated as an approved claim", "candidate skipping passage citation"],
    dbEntities: ["none_in_current_schema (candidates held pending human structuring before becoming knowledge_claims rows)"],
    failureState: "low_confidence_candidate_discarded",
    retryIdempotencyBehavior: "re-extraction deduplicated by (passage_id, candidate_type) before persistence",
    auditEvidenceRequired: ["extraction method (rule vs LLM)", "model identity+version if LLM used", "confidence score"] },
  { order: 9, stage: "claim_process_step_candidate_creation",
    input: "accepted extraction candidate with evidence links",
    output: "knowledge_claims row (review_status='unverified') and/or knowledge_process_steps row",
    trustState: "claim_candidate",
    allowedAutomation: ["populating claim_text_canonical/claim_type from the structured candidate"],
    prohibitedAutomation: ["auto-setting review_status beyond unverified/machine_prechecked", "auto-setting requires_citation=false"],
    dbEntities: ["knowledge_claims", "knowledge_process_steps", "knowledge_process_claim_links"],
    failureState: "candidate_rejected_missing_evidence",
    retryIdempotencyBehavior: "dedupe by (claim_text_canonical hash, jurisdiction_id, territorial_scope_id) before insert",
    auditEvidenceRequired: ["source of candidate", "reviewer queue assignment"] },
  { order: 10, stage: "jurisdiction_binding",
    input: "claim/step candidate + resolved jurisdiction context",
    output: "jurisdiction_id/territorial_scope_id set on the claim/step, never derived from locale",
    trustState: "jurisdiction_bound_unverified",
    allowedAutomation: ["structured resolution from the source's own declared jurisdiction/territorial scope"],
    prohibitedAutomation: ["deriving jurisdiction from UI locale or output language"],
    dbEntities: ["knowledge_jurisdictions", "knowledge_territorial_scopes", "knowledge_claims", "knowledge_processes"],
    failureState: "jurisdiction_unresolved_status_unresolved",
    retryIdempotencyBehavior: "idempotent per claim id; rebinding overwrites only binding columns",
    auditEvidenceRequired: ["jurisdiction source evidence", "explicit non-locale-derivation confirmation"] },
  { order: 11, stage: "effective_date_binding",
    input: "claim/step + source-version temporal metadata",
    output: "effective_from/effective_until set, or explicitly left null (unknown)",
    trustState: "temporally_bound_unverified",
    allowedAutomation: ["copying source_version effective_from/until when explicitly stated by the source"],
    prohibitedAutomation: ["treating retrieved_at/published_at as effective_from", "inventing a date the source does not state"],
    dbEntities: ["knowledge_claims", "knowledge_source_versions"],
    failureState: "effective_date_unknown_blocks_high_risk_use",
    retryIdempotencyBehavior: "idempotent per claim id",
    auditEvidenceRequired: ["temporal evidence passage", "distinction of publishedAt vs effectiveFrom recorded"] },
  { order: 12, stage: "source_passage_citation_binding",
    input: "claim + supporting passage(s)",
    output: "knowledge_claim_evidence_links and knowledge_citations rows",
    trustState: "cited_unverified",
    allowedAutomation: ["linking claim to passage with a support_status classification"],
    prohibitedAutomation: ["citation without passage_id", "citation without source_version_id", "source-level citation standing in for passage-level citation"],
    dbEntities: ["knowledge_claim_evidence_links", "knowledge_citations", "knowledge_source_passages"],
    failureState: "citation_binding_rejected_no_support",
    retryIdempotencyBehavior: "unique(claim_id, passage_id, evidence_role)",
    auditEvidenceRequired: ["support_status", "is_primary_evidence flag"] },
  { order: 13, stage: "conflict_detection",
    input: "new/changed claim compared to existing claims in the same jurisdiction/scope",
    output: "knowledge_conflicts row when overlap/contradiction is detected",
    trustState: "conflict_flagged_or_clear",
    allowedAutomation: ["structural overlap detection (same jurisdiction/topic/effective window)"],
    prohibitedAutomation: ["auto-resolving a conflict by silently choosing one source", "auto-clearing blocks_high_risk_use for a high-risk conflict"],
    dbEntities: ["knowledge_conflicts"],
    failureState: "conflict_unresolved_blocks_high_risk_use",
    retryIdempotencyBehavior: "conflict rows are append/status-update only; resolved conflicts remain queryable, never deleted",
    auditEvidenceRequired: ["conflicting entity ids", "severity classification"] },
  { order: 14, stage: "review_assignment",
    input: "claim/step/source-version pending review + risk_level",
    output: "review queue entry with required reviewer_type per risk_level",
    trustState: "review_pending",
    allowedAutomation: ["queue routing based on entity_type/risk_level"],
    prohibitedAutomation: ["auto-assigning 'machine' as the reviewer_type for a high-risk entity"],
    dbEntities: ["knowledge_review_records (initial review_required record)"],
    failureState: "assignment_stalled_escalated_after_due_date",
    retryIdempotencyBehavior: "idempotent re-assignment creates a new record only if state actually changed",
    auditEvidenceRequired: ["reviewer_type", "review_level", "review_due_at"] },
  { order: 15, stage: "human_review",
    input: "assigned review item + full evidence chain",
    output: "review outcome: approve, reject, or request-more-evidence",
    trustState: "human_reviewed_pending_decision",
    allowedAutomation: ["surfacing evidence chain, source diff, and prior version to the reviewer"],
    prohibitedAutomation: ["auto-approving on the reviewer's behalf", "auto-approving after a timeout"],
    dbEntities: ["knowledge_review_records"],
    failureState: "review_rejected_not_published",
    retryIdempotencyBehavior: "supersedes_review_record_id chains reviews; never overwrites a prior review record",
    auditEvidenceRequired: ["reviewer identity/role", "reason", "high_risk_use_approved rationale"] },
  { order: 16, stage: "approval_or_rejection",
    input: "completed human review",
    output: "review_status transitions to human_reviewed/expert_reviewed, or rejected",
    trustState: "approved_or_rejected",
    allowedAutomation: ["state-machine transition enforcement (valid transitions only)"],
    prohibitedAutomation: ["skipping expert_reviewed for a claim class that structurally requires it"],
    dbEntities: ["knowledge_claims", "knowledge_source_versions", "knowledge_review_records"],
    failureState: "invalid_transition_rejected",
    retryIdempotencyBehavior: "re-applying the same approval is a no-op",
    auditEvidenceRequired: ["prior state", "new state", "approver role"] },
  { order: 17, stage: "publication_eligibility",
    input: "approved claim/process/step + all upstream gates",
    output: "computed publication-eligible decision",
    trustState: "publication_eligible_or_blocked",
    allowedAutomation: ["deterministic eligibility computation from existing review/freshness/conflict/citation columns"],
    prohibitedAutomation: ["marking eligible while any upstream gate is unresolved"],
    dbEntities: ["knowledge_claims", "knowledge_processes", "knowledge_process_steps", "knowledge_retrieval_metadata"],
    failureState: "not_eligible_remains_unpublished",
    retryIdempotencyBehavior: "pure function of current state; recomputed on every upstream change",
    auditEvidenceRequired: ["eligibility checklist result per required gate"] },
  { order: 18, stage: "translation_candidate_creation",
    input: "publication-eligible German canonical unit",
    output: "knowledge_localized_terminology draft row per launch locale (term-level only; see schema gaps)",
    trustState: "translation_draft",
    allowedAutomation: ["machine-translation draft generation"],
    prohibitedAutomation: ["auto-publishing a machine translation", "translation widening/narrowing the German claim"],
    dbEntities: ["knowledge_terminology", "knowledge_localized_terminology"],
    failureState: "translation_generation_failed_german_fallback",
    retryIdempotencyBehavior: "unique(terminology_entry_id, output_locale)",
    auditEvidenceRequired: ["translation_status", "official_german_term_retained=true"] },
  { order: 19, stage: "translation_review",
    input: "translation draft",
    output: "review_status and warnings/urgency/uncertainty/blocked-action equivalence booleans set",
    trustState: "translation_reviewed_or_rejected",
    allowedAutomation: ["equivalence checklist surfaced to the reviewer"],
    prohibitedAutomation: ["auto-approving a machine translation without human review", "translation approval overriding the German canonical claim"],
    dbEntities: ["knowledge_localized_terminology"],
    failureState: "translation_rejected_german_fallback_with_warning",
    retryIdempotencyBehavior: "idempotent per (terminology_entry_id, output_locale)",
    auditEvidenceRequired: ["reviewer identity", "equivalence checklist result"] },
  { order: 20, stage: "runtime_publication",
    input: "publication-eligible German unit + reviewed translations where used",
    output: "entity becomes runtime-retrievable (retrieval_metadata flags flipped)",
    trustState: "published",
    allowedAutomation: ["flipping retrieval_metadata indexing flags once all gates pass"],
    prohibitedAutomation: ["any publication in this phase; vector-similarity-only authorization (schema-fixed false)"],
    dbEntities: ["knowledge_retrieval_metadata"],
    failureState: "publication_blocked_remains_in_review",
    retryIdempotencyBehavior: "idempotent per (entity_type, entity_id)",
    auditEvidenceRequired: ["all upstream gate evidence", "audit_event recording the publish action"] },
  { order: 21, stage: "change_monitoring",
    input: "published or previously ingested source",
    output: "knowledge_freshness_records row per check",
    trustState: "monitored",
    allowedAutomation: ["scheduled re-retrieval and content_hash comparison"],
    prohibitedAutomation: ["auto-clearing review_required for a detected substantive change"],
    dbEntities: ["knowledge_freshness_records"],
    failureState: "source_unavailable_recorded_not_deleted",
    retryIdempotencyBehavior: "append-only per check; next_check_due_at schedules the following check",
    auditEvidenceRequired: ["content_hash_matches", "change_status classification"] },
  { order: 22, stage: "supersession",
    input: "newly accepted source version or claim revision",
    output: "old version/claim marked superseded; new rows created; history preserved",
    trustState: "superseded_history_preserved",
    allowedAutomation: ["automatic supersession linkage once the new version is accepted"],
    prohibitedAutomation: ["deleting or mutating the superseded row's authoritative content"],
    dbEntities: ["knowledge_source_versions", "knowledge_claims"],
    failureState: "supersession_link_failed_flagged_for_manual_reconciliation",
    retryIdempotencyBehavior: "supersedes/superseded-by pair is set exactly once per version pair",
    auditEvidenceRequired: ["old version id", "new version id", "reason"] },
  { order: 23, stage: "withdrawal_or_emergency_disable",
    input: "urgent trust/legal/safety concern about a published entity",
    output: "entity excluded from runtime retrieval immediately, without deletion",
    trustState: "withdrawn_or_disabled",
    allowedAutomation: ["immediate retrieval_metadata flag flip pending manual status update"],
    prohibitedAutomation: ["silent deletion of the withdrawn entity or its history"],
    dbEntities: ["knowledge_retrieval_metadata", "knowledge_sources", "knowledge_claims", "knowledge_audit_events"],
    failureState: "emergency_disable_incomplete_escalated",
    retryIdempotencyBehavior: "idempotent; re-applying disable once already disabled is a no-op",
    auditEvidenceRequired: ["reason", "actor_type", "audit_event id"] },
  { order: 24, stage: "audit_trace_retention",
    input: "every prior lifecycle mutation",
    output: "knowledge_audit_events row (user_content_included fixed false)",
    trustState: "audited",
    allowedAutomation: ["automatic audit_event creation on every governed mutation"],
    prohibitedAutomation: ["omitting an audit_event for a governed mutation", "including Smart Talk user content in an audit_event"],
    dbEntities: ["knowledge_audit_events"],
    failureState: "audit_write_failed_governing_mutation_must_abort",
    retryIdempotencyBehavior: "append-only; never updated or deleted",
    auditEvidenceRequired: ["previous_state_hash", "new_state_hash", "actor_type"] },
];

// ============================================================================
// B. SOURCE ACQUISITION DESIGN — 8 classes, real content never fetched here
// ============================================================================

type SourceAcquisitionClassId =
  | "official_html_page" | "official_pdf" | "official_form" | "official_faq"
  | "official_service_portal" | "official_law_regulation_publication"
  | "official_administrative_instruction" | "official_authority_contact_metadata";

interface SourceAcquisitionClassSpec {
  classId: SourceAcquisitionClassId;
  acquisitionMethod: string;
  canonicalUrlHandling: string;
  redirectHandling: string;
  retrievalTimestampHandling: string;
  contentHashHandling: string;
  mimeValidation: string;
  languageDetection: string;
  normalization: string;
  duplicateDetection: string;
  versionChangeDetection: string;
  failedRetrievalBehavior: string;
  robotsAccessBoundary: string;
  archivalBoundary: string;
  manualReviewRequirement: string;
}

const SOURCE_ACQUISITION_CLASSES: readonly SourceAcquisitionClassSpec[] = [
  { classId: "official_html_page",
    acquisitionMethod: "queued HTTP GET to the registered canonical_url",
    canonicalUrlHandling: "normalized (scheme/host/path lowercased, tracking params stripped) before dedupe",
    redirectHandling: "follow only within the same official domain family; cross-domain redirect requires review",
    retrievalTimestampHandling: "retrieved_at recorded separately from any effective/publication date",
    contentHashHandling: "sha256 of the normalized (post-boilerplate-stripped) text",
    mimeValidation: "must be text/html; mismatch is a failed retrieval",
    languageDetection: "declared lang attribute cross-checked against detected language",
    normalization: "HTML -> structured text with heading/paragraph anchors preserved",
    duplicateDetection: "unchanged content_hash for the same source is a no-op",
    versionChangeDetection: "new content_hash triggers a new immutable source_version, never an overwrite",
    failedRetrievalBehavior: "retry with backoff, then flag review_required after max attempts",
    robotsAccessBoundary: "honors robots.txt disallow; never bypasses access controls",
    archivalBoundary: "archived snapshot kept only for the version already retrieved, never substituted for live re-verification",
    manualReviewRequirement: "any high-risk claim class requires human review regardless of source freshness" },
  { classId: "official_pdf",
    acquisitionMethod: "queued HTTP GET to the registered canonical_url",
    canonicalUrlHandling: "normalized as for HTML; PDF filename/version suffix recorded separately",
    redirectHandling: "follow only within the same official domain family",
    retrievalTimestampHandling: "retrieved_at recorded separately from the PDF's own metadata dates",
    contentHashHandling: "sha256 of the extracted normalized text, not the raw PDF bytes alone",
    mimeValidation: "must be application/pdf; mismatch is a failed retrieval",
    languageDetection: "detected from extracted text",
    normalization: "PDF text extraction with page/paragraph anchors preserved for stable passage boundaries",
    duplicateDetection: "unchanged extracted-text hash for the same source is a no-op",
    versionChangeDetection: "new extracted-text hash triggers a new immutable source_version",
    failedRetrievalBehavior: "retry with backoff; extraction failure flags review_required, never a guessed transcription",
    robotsAccessBoundary: "honors robots.txt disallow; never bypasses access controls",
    archivalBoundary: "archived copy retained per version, superseded copies never deleted",
    manualReviewRequirement: "form-adjacent PDFs feeding required-document claims require human review" },
  { classId: "official_form",
    acquisitionMethod: "queued retrieval of the official form document (PDF/HTML) plus its instructions page",
    canonicalUrlHandling: "form identifier + issuing authority recorded alongside the URL",
    redirectHandling: "follow only within the issuing authority's official domain",
    retrievalTimestampHandling: "retrieved_at separate from the form's own effective/revision date",
    contentHashHandling: "sha256 of extracted field/instruction text",
    mimeValidation: "PDF or HTML only",
    languageDetection: "detected from extracted text",
    normalization: "field-name/label extraction with source_passage anchors for each required field",
    duplicateDetection: "unchanged form-content hash is a no-op",
    versionChangeDetection: "new form revision triggers a new knowledge_forms/knowledge_source_versions pair",
    failedRetrievalBehavior: "retry with backoff; failure blocks any required-document claim depending on it",
    robotsAccessBoundary: "honors robots.txt disallow; never bypasses access controls",
    archivalBoundary: "prior form revisions retained, never overwritten",
    manualReviewRequirement: "always mandatory: a form alone never proves eligibility or a complete requirement list" },
  { classId: "official_faq",
    acquisitionMethod: "queued HTTP GET to the registered canonical_url",
    canonicalUrlHandling: "normalized as for HTML pages",
    redirectHandling: "follow only within the same official domain family",
    retrievalTimestampHandling: "retrieved_at separate from any stated last-updated date on the FAQ",
    contentHashHandling: "sha256 of normalized Q&A text",
    mimeValidation: "must be text/html",
    languageDetection: "declared lang cross-checked against detected language",
    normalization: "Q&A pair segmentation with stable anchors",
    duplicateDetection: "unchanged content_hash is a no-op",
    versionChangeDetection: "new content_hash triggers a new immutable source_version",
    failedRetrievalBehavior: "retry with backoff, then review_required",
    robotsAccessBoundary: "honors robots.txt disallow",
    archivalBoundary: "prior FAQ versions retained",
    manualReviewRequirement: "FAQ content may never alone support a legal_rule or deadline_rule claim" },
  { classId: "official_service_portal",
    acquisitionMethod: "queued retrieval of publicly accessible service-description pages only (no login-gated content)",
    canonicalUrlHandling: "normalized per page; portal-level identity recorded distinctly from individual service pages",
    redirectHandling: "follow only within the portal's own official domain",
    retrievalTimestampHandling: "retrieved_at recorded per page",
    contentHashHandling: "sha256 per page's normalized text",
    mimeValidation: "text/html expected",
    languageDetection: "declared lang cross-checked against detected language",
    normalization: "structural segmentation of service description, channel, and appointment sections",
    duplicateDetection: "unchanged content_hash per page is a no-op",
    versionChangeDetection: "per-page content_hash change triggers a new source_version for that page",
    failedRetrievalBehavior: "retry with backoff, then review_required",
    robotsAccessBoundary: "publicly accessible pages only; never authenticates or bypasses login gates",
    archivalBoundary: "prior portal-page versions retained",
    manualReviewRequirement: "submission-channel and appointment claims require human review before high-risk use" },
  { classId: "official_law_regulation_publication",
    acquisitionMethod: "queued retrieval from the official legislative/regulatory publication source",
    canonicalUrlHandling: "publication_identifier (e.g. official gazette reference) recorded alongside the URL",
    redirectHandling: "follow only within the official publication domain",
    retrievalTimestampHandling: "retrieved_at kept strictly separate from promulgated_at/effective_from",
    contentHashHandling: "sha256 of the normalized legal text",
    mimeValidation: "HTML or PDF depending on the publisher",
    languageDetection: "must be de for German legislative text",
    normalization: "article/paragraph/section-level segmentation with legal citation anchors",
    duplicateDetection: "unchanged content_hash is a no-op",
    versionChangeDetection: "any textual change creates a new immutable source_version, never an overwrite",
    failedRetrievalBehavior: "retry with backoff, then review_required; never guessed from a secondary summary",
    robotsAccessBoundary: "honors robots.txt disallow",
    archivalBoundary: "every promulgated version retained permanently for historical-date queries",
    manualReviewRequirement: "always mandatory: legal_rule claims require expert-level review" },
  { classId: "official_administrative_instruction",
    acquisitionMethod: "queued retrieval of publicly usable administrative instructions/circulars",
    canonicalUrlHandling: "instruction identifier recorded alongside the URL where the publisher provides one",
    redirectHandling: "follow only within the issuing authority's official domain",
    retrievalTimestampHandling: "retrieved_at kept separate from the instruction's own issuance date",
    contentHashHandling: "sha256 of normalized instruction text",
    mimeValidation: "HTML or PDF",
    languageDetection: "detected from extracted text",
    normalization: "section-level segmentation with anchors",
    duplicateDetection: "unchanged content_hash is a no-op",
    versionChangeDetection: "new content_hash triggers a new immutable source_version",
    failedRetrievalBehavior: "retry with backoff, then review_required",
    robotsAccessBoundary: "publicly usable instructions only; never bypasses internal/restricted-access systems",
    archivalBoundary: "prior instruction versions retained",
    manualReviewRequirement: "operationally relevant but never treated as legislation without review" },
  { classId: "official_authority_contact_metadata",
    acquisitionMethod: "queued retrieval of publicly published authority contact/service metadata pages",
    canonicalUrlHandling: "authority identifier recorded alongside the URL",
    redirectHandling: "follow only within the authority's official domain",
    retrievalTimestampHandling: "retrieved_at recorded; contact data has no independent effective-date concept unless the source states one",
    contentHashHandling: "sha256 of normalized contact/service text",
    mimeValidation: "text/html expected",
    languageDetection: "declared lang cross-checked against detected language",
    normalization: "structured extraction of address/contact-channel/service-area fields",
    duplicateDetection: "unchanged content_hash is a no-op",
    versionChangeDetection: "new content_hash triggers a new immutable source_version",
    failedRetrievalBehavior: "retry with backoff, then flag stale-contact-data review",
    robotsAccessBoundary: "honors robots.txt disallow",
    archivalBoundary: "prior contact-metadata versions retained to support stale-data detection",
    manualReviewRequirement: "authority competence itself is never inferred from contact metadata alone" },
];

// ============================================================================
// C. IDEMPOTENCY / DEDUPLICATION KEYS (per entity family; none invented
// beyond what migration 032's real unique constraints already support)
// ============================================================================

const IDEMPOTENCY_KEYS: readonly { entityFamily: string; dedupeKey: string }[] = [
  { entityFamily: "sources", dedupeKey: "(publisher_id, canonical_url) normalized" },
  { entityFamily: "source_versions", dedupeKey: "(source_id, version_sequence) unique; content_hash equality short-circuits new-version creation" },
  { entityFamily: "passages", dedupeKey: "(source_version_id, passage_order) unique" },
  { entityFamily: "claims", dedupeKey: "(claim_text_canonical hash, jurisdiction_id, territorial_scope_id) pre-insert dedupe" },
  { entityFamily: "process_definitions", dedupeKey: "(process_group_id, jurisdiction_id, territorial_scope_id) pre-insert dedupe" },
  { entityFamily: "process_steps", dedupeKey: "(process_id, step_order) unique" },
  { entityFamily: "required_document_candidates", dedupeKey: "(form_id, field_name) unique" },
  { entityFamily: "jurisdiction_bindings", dedupeKey: "idempotent per claim/process id (rebind overwrites only binding columns)" },
  { entityFamily: "citations", dedupeKey: "(claim_id, source_version_id, passage_id) via claim_evidence_links unique(claim_id, passage_id, evidence_role)" },
  { entityFamily: "translations", dedupeKey: "(terminology_entry_id, output_locale) unique" },
  { entityFamily: "review_records", dedupeKey: "append-only; superseding review chained via supersedes_review_record_id, never overwritten" },
  { entityFamily: "publication_records", dedupeKey: "idempotent per (entity_type, entity_id) in knowledge_retrieval_metadata" },
];

// ============================================================================
// D. CHANGE DETECTION CLASSES
// ============================================================================

type ChangeDetectionClass =
  | "formatting_only_change" | "navigation_layout_change" | "metadata_only_change"
  | "wording_change_without_factual_impact" | "factual_change" | "deadline_change"
  | "fee_change" | "required_document_change" | "jurisdiction_change"
  | "authority_or_contact_change" | "source_removal" | "source_becomes_unavailable";

const CHANGE_DETECTION_CLASSES: readonly ChangeDetectionClass[] = [
  "formatting_only_change", "navigation_layout_change", "metadata_only_change",
  "wording_change_without_factual_impact", "factual_change", "deadline_change",
  "fee_change", "required_document_change", "jurisdiction_change",
  "authority_or_contact_change", "source_removal", "source_becomes_unavailable",
];

const HIGH_IMPACT_CHANGE_CLASSES: readonly ChangeDetectionClass[] = [
  "factual_change", "deadline_change", "fee_change", "required_document_change",
  "jurisdiction_change", "authority_or_contact_change", "source_removal", "source_becomes_unavailable",
];

/** Every high-impact change must suspend publication eligibility until reviewed — never silently stay published. */
const HIGH_IMPACT_CHANGE_AUTO_SUSPENDS_PUBLICATION = true as const;

// ============================================================================
// E. RISK CLASSIFICATION — 11 classes
// ============================================================================

type RiskClassId =
  | "informational" | "procedural" | "document_requirement" | "deadline"
  | "financial_payment" | "sanction_consequence" | "eligibility"
  | "legal_status_effect" | "immigration_residence" | "health_insurance_coverage"
  | "cross_border_coordination";

interface RiskClassSpec {
  riskClass: RiskClassId;
  mandatoryHumanReview: boolean;
  enhancedEvidenceRequired: boolean;
}

const RISK_CLASSES: readonly RiskClassSpec[] = [
  { riskClass: "informational", mandatoryHumanReview: false, enhancedEvidenceRequired: false },
  { riskClass: "procedural", mandatoryHumanReview: true, enhancedEvidenceRequired: false },
  { riskClass: "document_requirement", mandatoryHumanReview: true, enhancedEvidenceRequired: true },
  { riskClass: "deadline", mandatoryHumanReview: true, enhancedEvidenceRequired: true },
  { riskClass: "financial_payment", mandatoryHumanReview: true, enhancedEvidenceRequired: true },
  { riskClass: "sanction_consequence", mandatoryHumanReview: true, enhancedEvidenceRequired: true },
  { riskClass: "eligibility", mandatoryHumanReview: true, enhancedEvidenceRequired: true },
  { riskClass: "legal_status_effect", mandatoryHumanReview: true, enhancedEvidenceRequired: true },
  { riskClass: "immigration_residence", mandatoryHumanReview: true, enhancedEvidenceRequired: true },
  { riskClass: "health_insurance_coverage", mandatoryHumanReview: true, enhancedEvidenceRequired: true },
  { riskClass: "cross_border_coordination", mandatoryHumanReview: true, enhancedEvidenceRequired: true },
];

const HIGH_RISK_CLASSES_REQUIRING_REVIEW: readonly RiskClassId[] = RISK_CLASSES
  .filter((r) => r.mandatoryHumanReview)
  .map((r) => r.riskClass);

// ============================================================================
// F. REQUIRED ARCHITECTURE DECISIONS (17)
// ============================================================================

interface ArchitectureDecision {
  decision: string;
  choice: string;
  justification: string;
}

const ARCHITECTURE_DECISIONS: readonly ArchitectureDecision[] = [
  { decision: "source retrieval: synchronous or queued", choice: "queued (async job)",
    justification: "avoids blocking, allows retry/backoff, respects rate limits toward official sites" },
  { decision: "is parsing deterministic", choice: "yes",
    justification: "HTML/PDF normalization and passage segmentation use deterministic structural rules, not model sampling" },
  { decision: "may LLM extraction be used", choice: "yes, candidate-generation only",
    justification: "LLM output produces unreviewed structured candidates; it never becomes a claim without human structuring and citation" },
  { decision: "LLM output trust level", choice: "machine_prechecked at most",
    justification: "cannot alone satisfy the citation/evidence gate; never eligible for human_reviewed/expert_reviewed status by itself" },
  { decision: "can publication ever be automatic", choice: "no, never",
    justification: "publication always requires an explicit human/expert review approval; mandatory for every high-risk class" },
  { decision: "how source versions are fingerprinted", choice: "sha256 of normalized content per version, retrieved_at kept separate",
    justification: "stable identity independent of superficial re-renders; retrieved_at is never conflated with effective_from" },
  { decision: "how passage boundaries are made stable", choice: "structural anchors (heading/section/article/paragraph identifiers) plus passage_order",
    justification: "survives cosmetic re-renders without relying on brittle byte offsets" },
  { decision: "how claims are superseded", choice: "new claim/version rows created; old rows marked superseded, never deleted",
    justification: "preserves append-only history required for historical-date queries and audit" },
  { decision: "how rollback differs from deletion", choice: "rollback = mark superseded/withdrawn plus a review record; deletion is never used for authoritative history",
    justification: "deletion would destroy provenance; supersession preserves it while removing current-use eligibility" },
  { decision: "how emergency suspension works", choice: "flip retrieval_metadata indexing flags and review/freshness status immediately; never delete",
    justification: "removes runtime visibility without destroying the audit trail or history" },
  { decision: "how German canonical records relate to translations", choice: "translations reference the German canonical unit id and can never be edited as independent truth",
    justification: "enforces the German-canonical-source principle structurally, not just by policy" },
  { decision: "how process-pack versions relate to source versions", choice: "each process/step links to specific claims pinned to specific source_version ids via knowledge_process_claim_links; pack version increments when that linkage changes materially",
    justification: "keeps the pack's structural version traceable to the exact evidentiary snapshot it was built from" },
  { decision: "how jurisdiction overlays are merged", choice: "knowledge_regional_overrides supplements a base rule; it never silently overwrites the base row",
    justification: "preserves the federal baseline while allowing Land/municipal/authority-specific overlays with explicit conflict tracking" },
  { decision: "how ingestion failures are retried", choice: "idempotent job keyed by (source canonical_url, content_hash) with backoff",
    justification: "prevents duplicate authoritative rows from repeated retries on unchanged content" },
  { decision: "how partially completed runs are contained", choice: "one DB transaction per source-version ingestion; anything not fully validated is rolled back",
    justification: "guarantees no partially-built claim graph is ever committed or published" },
  { decision: "how duplicate concurrent ingestion is prevented", choice: "unique(source_id, version_sequence) plus content-hash pre-check plus a per-source ingestion lock",
    justification: "prevents two concurrent jobs from creating two competing 'latest' versions of the same source" },
  { decision: "how provenance is preserved across transformations", choice: "every derived row carries source_version_id/passage_id back-references; every mutation writes a knowledge_audit_events row with before/after hashes",
    justification: "keeps every downstream artifact traceable to the exact source evidence it came from" },
];

// ============================================================================
// G. DATABASE MAPPING — every ingestion/pack concept mapped to the real
// migration-032 knowledge_* tables (33 tables; zero invented tables)
// ============================================================================

type DataKind = "canonical" | "derived" | "review" | "publication";

interface DbMappingEntry {
  table: string;
  concept: string;
  keyRelationship: string;
  dataKind: DataKind;
  lifecycleState: string;
  immutabilityExpectation: string;
  schemaSufficient: boolean;
}

const DB_TABLE_CONCEPT_MAP: readonly DbMappingEntry[] = [
  { table: "knowledge_trust_domains", concept: "trust-domain registry (eu/de/sk/cz/pl/hu)", keyRelationship: "referenced by publishers and trust_domain_links", dataKind: "canonical", lifecycleState: "active/superseded/unresolved", immutabilityExpectation: "append-oriented; code set is fixed by CHECK constraint", schemaSufficient: true },
  { table: "knowledge_jurisdictions", concept: "jurisdiction levels (federal/Land/municipality/etc.)", keyRelationship: "parent_jurisdiction_id self-reference; referenced by sources/claims/processes", dataKind: "canonical", lifecycleState: "active/superseded/unresolved", immutabilityExpectation: "mutable metadata, but historical rows never deleted (on delete restrict)", schemaSufficient: true },
  { table: "knowledge_territorial_scopes", concept: "reusable territorial scope (land/kreis/city/municipality/postal codes)", keyRelationship: "referenced by publishers/sources/authorities/claims/processes", dataKind: "canonical", lifecycleState: "active", immutabilityExpectation: "mutable, restrict-deleted", schemaSufficient: true },
  { table: "knowledge_publishers", concept: "official-source publisher competence registry", keyRelationship: "trust_domain_id + territorial_competence_id FKs", dataKind: "canonical", lifecycleState: "active", immutabilityExpectation: "mutable, restrict-deleted", schemaSufficient: true },
  { table: "knowledge_sources", concept: "registered source (source_discovery -> source_registration -> source_trust_classification)", keyRelationship: "publisher_id, jurisdiction_id, territorial_scope_id FKs", dataKind: "canonical", lifecycleState: "active/archived/superseded/unresolved", immutabilityExpectation: "mutable classification, restrict-deleted", schemaSufficient: true },
  { table: "knowledge_source_versions", concept: "immutable source-version history (source_retrieval -> version creation -> fingerprinting)", keyRelationship: "source_id FK; supersedes/superseded_by self-references", dataKind: "canonical", lifecycleState: "unverified -> human_reviewed -> locked", immutabilityExpectation: "content/identity columns locked once locked_at is set (enforced by trigger)", schemaSufficient: true },
  { table: "knowledge_source_passages", concept: "passage segmentation with stable ordering/anchors", keyRelationship: "source_version_id FK; unique(source_version_id, passage_order)", dataKind: "canonical", lifecycleState: "unverified -> reviewed", immutabilityExpectation: "mutable review columns, restrict-deleted", schemaSufficient: true },
  { table: "knowledge_authorities", concept: "authority registry", keyRelationship: "publisher_id, jurisdiction_id, territorial_scope_id FKs", dataKind: "canonical", lifecycleState: "active/reorganized/unresolved", immutabilityExpectation: "mutable, restrict-deleted", schemaSufficient: true },
  { table: "knowledge_authority_competences", concept: "authority-resolution model (subject/territorial/personal/procedural competence)", keyRelationship: "authority_id + competence_source_version_id + competence_passage_id FKs", dataKind: "canonical", lifecycleState: "unverified -> reviewed; conflict_status tracked", immutabilityExpectation: "mutable, restrict-deleted, effective-dated", schemaSufficient: true },
  { table: "knowledge_claims", concept: "canonical German claim (claim/process-step candidate creation onward)", keyRelationship: "jurisdiction_id, territorial_scope_id, authority_id FKs; claim_language fixed 'de'", dataKind: "canonical", lifecycleState: "unverified -> human_reviewed -> active/superseded/unresolved", immutabilityExpectation: "mutable review/status columns; text itself is not schema-locked (governance responsibility)", schemaSufficient: true },
  { table: "knowledge_claim_evidence_links", concept: "source-passage citation binding (support_status/jurisdiction/authority/effective-date match flags)", keyRelationship: "claim_id, source_version_id, passage_id FKs; unique(claim_id, passage_id, evidence_role)", dataKind: "derived", lifecycleState: "review_accepted true/false", immutabilityExpectation: "append-oriented", schemaSufficient: true },
  { table: "knowledge_citations", concept: "user-facing + internal audit citation (evidence-before-claim principle)", keyRelationship: "claim_id, source_id, source_version_id, passage_id, publisher_id, jurisdiction_id FKs, all required", dataKind: "publication", lifecycleState: "created once citation binding completes", immutabilityExpectation: "append-oriented", schemaSufficient: true },
  { table: "knowledge_responsible_actor_rules", concept: "responsible-actor resolution for process steps/evidence", keyRelationship: "referenced by process_steps and evidence_requirements", dataKind: "canonical", lifecycleState: "unverified -> reviewed; conflict_status tracked", immutabilityExpectation: "mutable, restrict-deleted", schemaSufficient: true },
  { table: "knowledge_processes", concept: "first process pack identity + variant container (process_group_id='anmeldung_ummeldung_abmeldung')", keyRelationship: "jurisdiction_id, territorial_scope_id FKs; orientation_only/full_legal_advice_excluded fixed true", dataKind: "canonical", lifecycleState: "unverified -> reviewed -> active/unresolved", immutabilityExpectation: "mutable, restrict-deleted", schemaSufficient: true },
  { table: "knowledge_forms", concept: "official-form acquisition class + required-document source", keyRelationship: "authority_id, jurisdiction_id, source_version_id FKs", dataKind: "canonical", lifecycleState: "unverified -> reviewed -> active/superseded/unresolved", immutabilityExpectation: "mutable, restrict-deleted", schemaSufficient: true },
  { table: "knowledge_deadline_rules", concept: "deadline model (trigger event, calculation basis, calendar/business-day rule, exact_calculation_allowed)", keyRelationship: "jurisdiction_id, authority_id, source_version_id, passage_id FKs", dataKind: "canonical", lifecycleState: "unverified -> reviewed; conflict_status tracked", immutabilityExpectation: "mutable, restrict-deleted, effective-dated", schemaSufficient: true },
  { table: "knowledge_fee_rules", concept: "financial/payment risk-class rule representation", keyRelationship: "jurisdiction_id, authority_id, source_version_id, passage_id FKs", dataKind: "canonical", lifecycleState: "unverified -> reviewed; conflict_status tracked", immutabilityExpectation: "mutable, restrict-deleted, effective-dated", schemaSufficient: true },
  { table: "knowledge_process_steps", concept: "process-step model (11 structural step types)", keyRelationship: "process_id, responsible_actor_rule_id FKs; optional authority/form/deadline/fee FKs; unique(process_id, step_order)", dataKind: "canonical", lifecycleState: "unverified -> reviewed", immutabilityExpectation: "mutable, restrict-deleted", schemaSufficient: true },
  { table: "knowledge_evidence_requirements", concept: "required-document/evidence model (institution-exchange vs user-submission distinction)", keyRelationship: "responsible_actor_rule_id FK; optional process/step FKs", dataKind: "canonical", lifecycleState: "unverified -> reviewed", immutabilityExpectation: "mutable, restrict-deleted", schemaSufficient: true },
  { table: "knowledge_form_requirements", concept: "per-field required-document conditionality", keyRelationship: "form_id, source_passage_id FKs; unique(form_id, field_name)", dataKind: "canonical", lifecycleState: "unverified -> reviewed", immutabilityExpectation: "mutable, restrict-deleted", schemaSufficient: true },
  { table: "knowledge_eligibility_rules", concept: "eligibility risk-class representation (final_determination_allowed fixed false)", keyRelationship: "process_id, jurisdiction_id, source_version_id, passage_id FKs", dataKind: "canonical", lifecycleState: "unverified -> reviewed; conflict_status tracked", immutabilityExpectation: "mutable, restrict-deleted, effective-dated", schemaSufficient: true },
  { table: "knowledge_process_claim_links", concept: "process-pack-version-to-source-version traceability", keyRelationship: "process_id, process_step_id, claim_id FKs; unique(process_id, process_step_id, claim_id, claim_role)", dataKind: "derived", lifecycleState: "created once a claim is bound to a step", immutabilityExpectation: "append-oriented", schemaSufficient: true },
  { table: "knowledge_regional_overrides", concept: "jurisdiction-overlay merge model (Bundesland/municipality/authority overlays, non-destructive)", keyRelationship: "bounded polymorphic base/override entity type+id; territorial_scope_id, source_version_id FKs", dataKind: "derived", lifecycleState: "unverified -> reviewed; conflict_status tracked", immutabilityExpectation: "append-oriented, effective-dated", schemaSufficient: true },
  { table: "knowledge_review_records", concept: "human-review boundary (review_assignment, human_review, approval_or_rejection)", keyRelationship: "polymorphic entity_type+entity_id; supersedes_review_record_id chain", dataKind: "review", lifecycleState: "append-only chain", immutabilityExpectation: "append-oriented (fail-closed RLS, no cascade delete; no dedicated trigger yet, see schema gaps)", schemaSufficient: true },
  { table: "knowledge_freshness_records", concept: "change-monitoring stage", keyRelationship: "polymorphic entity_type+entity_id", dataKind: "review", lifecycleState: "append-only per check", immutabilityExpectation: "append-oriented (fail-closed RLS, no cascade delete)", schemaSufficient: true },
  { table: "knowledge_conflicts", concept: "conflict-detection and conflict-preservation principle", keyRelationship: "entity_ids/source_version_ids/jurisdiction_ids/authority_ids arrays; review_record_id FK", dataKind: "review", lifecycleState: "open -> resolved/blocked, never deleted", immutabilityExpectation: "append-oriented (fail-closed RLS, no cascade delete)", schemaSufficient: true },
  { table: "knowledge_audit_events", concept: "audit-trace-retention stage (user_content_included fixed false)", keyRelationship: "polymorphic entity_type+entity_id; review_record_id FK", dataKind: "review", lifecycleState: "append-only", immutabilityExpectation: "append-oriented (fail-closed RLS, no cascade delete)", schemaSufficient: true },
  { table: "knowledge_terminology", concept: "canonical German terminology entries (translation-unit identity anchor)", keyRelationship: "source_version_id, passage_id FKs", dataKind: "canonical", lifecycleState: "unverified -> reviewed", immutabilityExpectation: "mutable, restrict-deleted", schemaSufficient: true },
  { table: "knowledge_localized_terminology", concept: "translation candidate/review stage (term-level only, launch locales de/en/sk/cs/pl/hu)", keyRelationship: "terminology_entry_id FK; unique(terminology_entry_id, output_locale)", dataKind: "derived", lifecycleState: "draft -> reviewed; official_german_term_retained fixed true", immutabilityExpectation: "mutable draft workflow, restrict-deleted", schemaSufficient: false },
  { table: "knowledge_trust_domain_links", concept: "trust-domain requirement binding per entity (cross-border evidence completeness)", keyRelationship: "polymorphic entity_type+entity_id; trust_domain_id FK; unique(entity_type, entity_id, trust_domain_id)", dataKind: "derived", lifecycleState: "static requirement links", immutabilityExpectation: "append-oriented, restrict-deleted", schemaSufficient: true },
  { table: "knowledge_cross_border_connectors", concept: "DE<->SK/CZ/PL/HU connector boundary (representable, inactive; activation_from_locale_allowed fixed false)", keyRelationship: "unique(origin_market, connected_country)", dataKind: "canonical", lifecycleState: "planned (no row inserted by this phase)", immutabilityExpectation: "restrict-deleted", schemaSufficient: true },
  { table: "knowledge_cross_border_processes", concept: "future familienkasse_kindergeld DE<->SK pilot structure (representable, inactive)", keyRelationship: "cross_border_connector_id, german_process_id, responsible_actor_rule_id FKs", dataKind: "canonical", lifecycleState: "not created in this phase", immutabilityExpectation: "restrict-deleted", schemaSufficient: true },
  { table: "knowledge_retrieval_metadata", concept: "publication-eligibility / runtime-publication gate flags (all filter-required flags schema-fixed true; vector-authoritative fixed false)", keyRelationship: "polymorphic entity_type+entity_id; unique(entity_type, entity_id)", dataKind: "publication", lifecycleState: "not indexed (full_text_indexed/vector_indexed both false by default)", immutabilityExpectation: "mutable indexing flags, restrict-deleted", schemaSufficient: false },
];

const EXPECTED_KNOWLEDGE_TABLE_COUNT = 33;

// ============================================================================
// H. SCHEMA GAPS (honestly recorded; migration 032 is NOT modified in this phase)
// ============================================================================

type GapSeverity = "low" | "medium" | "high";

interface SchemaGap {
  id: string;
  description: string;
  rationale: string;
  severity: GapSeverity;
  blocksFirstIngestionImplementation: boolean;
  proposedFutureMigrationBoundary: string;
}

const SCHEMA_GAPS: readonly SchemaGap[] = [
  { id: "no_dedicated_publication_state_column",
    description: "knowledge_claims/knowledge_processes/knowledge_process_steps lack an explicit publication_state column distinct from review_status+freshness_status+conflict_status",
    rationale: "publication eligibility is currently a computed combination, not a single auditable column; this is acceptable for design but ambiguous for a real automated eligibility gate",
    severity: "medium", blocksFirstIngestionImplementation: true,
    proposedFutureMigrationBoundary: "033_add_publication_state_and_indexes (additive, non-destructive)" },
  { id: "no_translation_unit_for_full_claim_or_step_text",
    description: "knowledge_localized_terminology only localizes canonical_german_term/definition_canonical (term-level); claim_text_canonical and process_steps.description_canonical have no localized counterpart table",
    rationale: "full-text multilingual presentation of a claim or step cannot yet be stored structurally; only glossary-level terminology is covered",
    severity: "medium", blocksFirstIngestionImplementation: true,
    proposedFutureMigrationBoundary: "034_add_claim_and_step_translations (additive, non-destructive)" },
  { id: "no_dedicated_withdrawn_or_emergency_disabled_status",
    description: "status enums on knowledge_sources ('active','archived','superseded','unresolved') and knowledge_claims/knowledge_processes ('active','superseded','unresolved') lack an explicit 'withdrawn'/'emergency_disabled' value",
    rationale: "emergency suspension must currently be expressed via freshness_status='review_required' combined with knowledge_retrieval_metadata indexing flags rather than one first-class status value",
    severity: "medium", blocksFirstIngestionImplementation: false,
    proposedFutureMigrationBoundary: "future migration adding an explicit withdrawal status where operational experience shows it is needed" },
  { id: "no_dedicated_source_discovery_staging_table",
    description: "there is no knowledge_* table for pre-registration discovery candidates (lifecycle stage 1)",
    rationale: "discovery candidates are intentionally kept outside the canonical registry until vetted; staging can live outside the database in the interim",
    severity: "low", blocksFirstIngestionImplementation: false,
    proposedFutureMigrationBoundary: "optional future staging table if discovery volume requires durable tracking" },
  { id: "no_generic_append_only_enforcement_trigger_beyond_source_versions",
    description: "knowledge_review_records, knowledge_freshness_records, knowledge_conflicts and knowledge_audit_events rely on fail-closed RLS and absence of cascade deletes rather than a dedicated append-only trigger (already documented as a residual debt inside migration 032 itself)",
    rationale: "this is an existing, honestly-labelled residual enforcement debt from PHASE 9G, not newly discovered here",
    severity: "low", blocksFirstIngestionImplementation: false,
    proposedFutureMigrationBoundary: "future generic append-only trigger migration" },
  { id: "no_change_classification_granularity_beyond_change_status_enum",
    description: "knowledge_freshness_records.change_status ('unchanged','updated','superseded','retracted','unverified') cannot natively distinguish the 12 change-detection classes this phase defines (formatting-only vs factual vs deadline vs fee vs document vs jurisdiction vs authority, etc.)",
    rationale: "finer classification can be recorded in the free-text notes column for now; structured columns are deferred",
    severity: "medium", blocksFirstIngestionImplementation: false,
    proposedFutureMigrationBoundary: "future migration adding a structured change_classification column" },
  { id: "no_confidence_score_on_authority_resolution",
    description: "knowledge_territorial_scopes and knowledge_authority_competences have no explicit numeric resolution-confidence column",
    rationale: "authority-resolution confidence can be tracked in review_status/notes for now; a dedicated column is a future refinement, not a blocker",
    severity: "low", blocksFirstIngestionImplementation: false,
    proposedFutureMigrationBoundary: "future migration adding a resolution_confidence column where operational experience shows it is needed" },
];

const BLOCKING_SCHEMA_GAPS: readonly SchemaGap[] = SCHEMA_GAPS.filter((g) => g.blocksFirstIngestionImplementation);
const BLOCKING_SCHEMA_GAP_COUNT = BLOCKING_SCHEMA_GAPS.length;

// ============================================================================
// I. FIRST PROCESS PACK CONTRACT — anmeldung_ummeldung_abmeldung
// ============================================================================

type ProcessPackLifecycleStatus =
  | "draft" | "evidence_incomplete" | "review_required" | "approved"
  | "publication_eligible" | "published" | "suspended" | "superseded" | "withdrawn";

const FIRST_PACK_IDENTITY = {
  canonicalProcessPackId: "anmeldung_ummeldung_abmeldung",
  processFamily: "residence_registration_lifecycle",
  canonicalGermanTitlePlaceholder:
    "Anmeldung, Ummeldung und Abmeldung des Wohnsitzes (Platzhalter — keine geprüften Inhalte)",
  lifecycleStatus: "draft" as ProcessPackLifecycleStatus,
  contractVersion: "9I.1.0",
  packVersion: "0.0.0-design-only",
  primaryCountry: "DE",
  canonicalSourceLanguage: "de",
  supportedPresentationLanguages: LAUNCH_LOCALES,
  ownerReviewerRoles: [
    "knowledge_owner", "legal_reviewer_de", "municipal_process_reviewer",
    "translation_reviewer", "expert_reviewer_high_risk",
  ] as const,
} as const;

type ProcessVariantId = "anmeldung" | "ummeldung" | "abmeldung";
const PROCESS_VARIANTS: readonly ProcessVariantId[] = ["anmeldung", "ummeldung", "abmeldung"];

type VariantApplicability = "applicable" | "not_applicable" | "uncertain_pending_context";
const VARIANT_APPLICABILITY_STATES: readonly VariantApplicability[] = [
  "applicable", "not_applicable", "uncertain_pending_context",
];
const VARIANT_SELECTION_EVIDENCE_INPUTS: readonly string[] = [
  "prior German municipality", "destination municipality", "move date",
  "residence-retention context", "household/family context",
];

type JurisdictionMatrixLayer =
  | "federal_baseline" | "bundesland_overlay" | "municipality_overlay" | "competent_authority_overlay";
const JURISDICTION_MATRIX_LAYERS: readonly JurisdictionMatrixLayer[] = [
  "federal_baseline", "bundesland_overlay", "municipality_overlay", "competent_authority_overlay",
];
const JURISDICTION_CONFLICT_PRECEDENCE_RULE =
  "Precedence is contextual per claim (see PHASE 9B); no fixed numeric rank. A municipality/authority overlay supplements the federal baseline within its own scope and never silently replaces it.";
const UNKNOWN_LOCAL_RULE_FALLBACK = "conservative_unknown_local_rule_state";
const JURISDICTION_FROM_LOCALE_PROHIBITED = true as const;

type TriggerCandidateCategory =
  | "moving_into_a_residence" | "moving_within_a_municipality" | "moving_to_another_municipality"
  | "leaving_germany" | "retaining_another_german_residence" | "secondary_residence_context"
  | "unclear_residence_context";
const TRIGGER_CANDIDATE_CATEGORIES: readonly TriggerCandidateCategory[] = [
  "moving_into_a_residence", "moving_within_a_municipality", "moving_to_another_municipality",
  "leaving_germany", "retaining_another_german_residence", "secondary_residence_context",
  "unclear_residence_context",
];
/** Trigger categories are structural candidates only — never a legal conclusion by themselves. */
const TRIGGER_CATEGORIES_ARE_LEGAL_CONCLUSIONS = false as const;

const MINIMUM_USER_CONTEXT_FIELDS: readonly string[] = [
  "currentResidenceCountry", "destinationCountry", "priorGermanMunicipality", "destinationMunicipality",
  "moveDate", "residenceRetentionContext", "primarySecondaryResidenceContext",
  "householdFamilyContext", "userUncertaintyFlags",
];
const CONTEXT_FIELDS_EXPLICITLY_NOT_REQUIRED: readonly string[] = [
  "full legal name", "identity document number", "nationality unless a reviewed claim later requires it", "biometric or health data",
];

type ProcessStepType =
  | "determine_applicable_variant" | "determine_competent_authority" | "determine_submission_channel"
  | "determine_appointment_requirement" | "determine_required_documents" | "determine_deadline"
  | "prepare_submission" | "submit" | "retain_evidence" | "monitor_confirmation" | "resolve_exception";
const PROCESS_STEP_TYPES: readonly ProcessStepType[] = [
  "determine_applicable_variant", "determine_competent_authority", "determine_submission_channel",
  "determine_appointment_requirement", "determine_required_documents", "determine_deadline",
  "prepare_submission", "submit", "retain_evidence", "monitor_confirmation", "resolve_exception",
];

const REQUIRED_DOCUMENT_MODEL_FIELDS: readonly string[] = [
  "requirementStatus", "conditionality", "sourceCitation", "jurisdiction", "effectiveDate",
  "originalOrCopyDistinction", "translationRequirementState", "substituteDocumentOptions",
  "unknownOrDisputedState", "mandatoryHumanReviewFlag",
];
type DocumentRequirementStatus = "required" | "conditional" | "optional" | "unknown" | "disputed";
const DOCUMENT_REQUIREMENT_STATUSES: readonly DocumentRequirementStatus[] = [
  "required", "conditional", "optional", "unknown", "disputed",
];

const DEADLINE_MODEL_FIELDS: readonly string[] = [
  "triggerEvent", "calculationBasis", "calendarOrBusinessDaySemantics", "inclusiveExclusiveBoundary",
  "timezone", "jurisdiction", "exception", "unknownDeadlineState", "conflictingDeadlineState",
  "sourceCitation", "reviewRequirement", "highRiskHandling",
];

const AUTHORITY_RESOLUTION_MODEL_FIELDS: readonly string[] = [
  "municipality", "postalCodeOrLocalityContext", "authorityType", "officeOrServiceLocation",
  "onlineOfflineChannel", "authoritativeResolverSource", "resolutionConfidence",
  "unresolvedFallback", "staleContactDataHandling",
];
/** Authority resolution must never be derived from UI locale. */
const AUTHORITY_RESOLUTION_FROM_LOCALE_PROHIBITED = true as const;

type ProcessOutcome =
  | "submitted" | "appointment_booked" | "confirmation_received" | "additional_information_requested"
  | "rejected" | "unresolved" | "redirected_to_another_authority" | "process_variant_changed"
  | "user_action_still_required";
const PROCESS_OUTCOMES: readonly ProcessOutcome[] = [
  "submitted", "appointment_booked", "confirmation_received", "additional_information_requested",
  "rejected", "unresolved", "redirected_to_another_authority", "process_variant_changed",
  "user_action_still_required",
];

type WarningType =
  | "deadline_uncertainty" | "missing_jurisdiction" | "conflicting_official_sources"
  | "unavailable_authority_information" | "missing_evidence" | "high_risk_consequence"
  | "source_older_than_review_threshold" | "translation_not_approved" | "local_rule_verification_required";
const WARNING_TYPES: readonly WarningType[] = [
  "deadline_uncertainty", "missing_jurisdiction", "conflicting_official_sources",
  "unavailable_authority_information", "missing_evidence", "high_risk_consequence",
  "source_older_than_review_threshold", "translation_not_approved", "local_rule_verification_required",
];

type PackUnitLifecycleState =
  | "draft" | "evidence_incomplete" | "review_required" | "approved" | "publication_eligible"
  | "published" | "suspended" | "superseded" | "withdrawn";
const PACK_UNIT_LIFECYCLE_STATES: readonly PackUnitLifecycleState[] = [
  "draft", "evidence_incomplete", "review_required", "approved", "publication_eligible",
  "published", "suspended", "superseded", "withdrawn",
];

const FIRST_CONTACT_COMPATIBILITY_RULES: readonly string[] = [
  "Normal Smart Talk Free Q&A may use this pack for first-step orientation without a standalone First Contact product mode.",
  "Assume zero prior bureaucratic experience — in presentation only.",
  "Simplify presentation only, never the underlying factual/governance core.",
  "Avoid patronizing language.",
  "Never hide uncertainty or warnings.",
  "Never choose a process variant without sufficient verified context.",
];
const STANDALONE_FIRST_CONTACT_MODE_REINTRODUCED = false as const;

const MULTILINGUAL_DESIGN_FIELDS: readonly string[] = [
  "germanCanonicalSource", "translationUnitIdentity", "translationStatus", "reviewerStatus",
  "fallbackBehavior", "untranslatedWarningBehavior", "terminologyGlossaryBinding", "noMachineTranslationAutoPublication",
];
const NO_MACHINE_TRANSLATION_AUTO_PUBLICATION = true as const;

// ============================================================================
// J. CROSS-BORDER BOUNDARY (representable, inactive; not implemented here)
// ============================================================================

const FIRST_CROSS_BORDER_PILOT = "familienkasse_kindergeld" as const;
const CROSS_BORDER_ACTIVATION_RULE =
  "The DE<->SK connector activates only from verified case context, never from interface locale alone.";
const DE_SK_CONNECTOR_IMPLEMENTED_THIS_PHASE = false as const;
const FIRST_PACK_ADDS_CROSS_BORDER_CLAIMS = false as const;

// ============================================================================
// K. MANDATORY SAFETY BOUNDARIES (all false, structurally enforced below)
// ============================================================================

const SAFETY_BOUNDARY_NAMES: readonly string[] = [
  "databaseWritePerformed", "remoteDatabaseUsed", "realSourceFetched", "realGovernmentContentStored",
  "realKnowledgeRecordInserted", "runtimeRetrievalEnabled", "smartTalkRuntimeModified",
  "publicRuntimeAuthorizedNow", "productionAuthorizedNow", "paidDocumentModeModified",
  "vayloDnaModified", "crossBorderConnectorActivated", "germanKnowledgePackPublished",
];

// ─── Result shape ───────────────────────────────────────────────────────────

interface Result {
  checkId: "9I";
  allPassed: boolean;

  architectureDesignOnly: boolean;
  sourceClosureCommit: string;
  sourceMigrationValidationCheckId: string;
  sourceMigrationValidationReady: boolean;

  createdFileCount: number;
  modifiedExistingFileCount: number;
  existingFileModified: boolean;
  onlyExpectedFilesChanged: boolean;
  newAuditFileCreated: boolean;

  targetMigrationInspected: boolean;
  migration032Modified: boolean;
  migrationChecksum: string;
  actualKnowledgeTableCountObservedFromMigration: number;
  expectedKnowledgeTableCount: number;
  rlsEnabledTableCountObservedFromMigration: number;
  migrationHasInsertStatements: boolean;
  migrationHasAnonOrAuthenticatedPolicy: boolean;

  schemaMappingComplete: boolean;
  schemaGapCount: number;
  blockingSchemaGapCount: number;

  ingestionLifecycleStageCount: number;
  sourceAcquisitionClassCount: number;
  riskClassCount: number;
  architectureDecisionCount: number;
  idempotencyKeyFamilyCount: number;
  changeDetectionClassCount: number;
  highImpactChangeClassCount: number;

  firstProcessPackId: string;
  firstProcessPackFamily: string;
  processVariantCount: number;
  jurisdictionLayerCount: number;
  triggerCandidateCategoryCount: number;
  minimumUserContextFieldCount: number;
  processStepTypeCount: number;
  requiredDocumentModelFieldCount: number;
  deadlineModelFieldCount: number;
  authorityResolutionModelFieldCount: number;
  processOutcomeCount: number;
  warningTypeCount: number;
  packUnitLifecycleStateCount: number;

  supportedLaunchLanguageCount: number;
  canonicalSourceLanguage: string;
  translationAutoPublicationAllowed: boolean;
  humanReviewRequiredForHighRiskClaims: boolean;
  localeUsedForJurisdiction: boolean;
  authorityResolutionUsesLocale: boolean;

  firstPackAddsCrossBorderClaims: boolean;
  firstCrossBorderPilotRecorded: string;
  deSkConnectorImplementedThisPhase: boolean;

  realSourceFetched: boolean;
  realGovernmentContentStored: boolean;
  databaseWritePerformed: boolean;
  remoteDatabaseUsed: boolean;
  realKnowledgeRecordInserted: boolean;
  runtimeRetrievalEnabled: boolean;
  crossBorderConnectorActivated: boolean;
  germanKnowledgePackPublished: boolean;
  standaloneFirstContactModeIntroduced: boolean;
  smartTalkRuntimeModified: boolean;
  paidDocumentModeModified: boolean;
  vayloDnaModified: boolean;
  dockerStarted: boolean;
  supabaseStarted: boolean;
  networkAccessPerformed: boolean;

  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;

  readyForFirstGermanProcessPackImplementationPlan: boolean;
  readyForRealGermanSourceIngestion: boolean;

  // Supplementary forbidden-claim flags — every one must remain false; each
  // tamper case flips exactly one (or a required field above).
  realSourceContentIncludedAccepted: boolean;
  actualNumericalLegalDeadlineInsertedAccepted: boolean;
  actualFeeInsertedAccepted: boolean;
  actualOfficeAddressInsertedAccepted: boolean;
  unsupportedMunicipalityRuleMarkedApprovedAccepted: boolean;
  sourceWithoutImmutableVersionAcceptedAccepted: boolean;
  claimWithoutPassageCitationAcceptedAccepted: boolean;
  citationWithoutSourceVersionAcceptedAccepted: boolean;
  translationTreatedAsCanonicalAccepted: boolean;
  machineTranslationAutoPublishedAccepted: boolean;
  changedSourceOverwritingPriorVersionAccepted: boolean;
  publicationWithoutHumanReviewForHighRiskClaimAccepted: boolean;
  conflictingSourcesSilentlyMergedAccepted: boolean;
  missingEffectiveDateRepresentedAsVerifiedCurrentAccepted: boolean;
  historicalInformationTreatedAsCurrentAccepted: boolean;
  futureEffectiveInformationPublishedAsCurrentAccepted: boolean;
  processVariantChosenWithoutContextAccepted: boolean;
  requiredDocumentMarkedMandatoryWithoutEvidenceAccepted: boolean;
  deadlineClaimMissingCalculationSemanticsAccepted: boolean;
  sourceRemovalCausingSilentDeletionAccepted: boolean;
  failedIngestionProducingPublishedPartialDataAccepted: boolean;
  duplicateIngestionProducingDuplicateCanonicalRowsAccepted: boolean;
  firstPackIdentityChangedAccepted: boolean;
  anyTamperCaseSurvivedAccepted: boolean;

  tamperCaseCount: number;
  tamperCasesRejectedCount: number;
  tamperCasesRejected: number;

  ingestionLifecycle: readonly LifecycleStageSpec[];
  sourceAcquisitionClasses: readonly SourceAcquisitionClassSpec[];
  idempotencyKeys: readonly { entityFamily: string; dedupeKey: string }[];
  changeDetectionClasses: readonly ChangeDetectionClass[];
  highImpactChangeClasses: readonly ChangeDetectionClass[];
  riskClasses: readonly RiskClassSpec[];
  architectureDecisions: readonly ArchitectureDecision[];
  dbTableConceptMap: readonly DbMappingEntry[];
  schemaGaps: readonly SchemaGap[];
  firstPackIdentity: typeof FIRST_PACK_IDENTITY;
  processVariants: readonly ProcessVariantId[];
  variantApplicabilityStates: readonly VariantApplicability[];
  variantSelectionEvidenceInputs: readonly string[];
  jurisdictionMatrixLayers: readonly JurisdictionMatrixLayer[];
  jurisdictionConflictPrecedenceRule: string;
  unknownLocalRuleFallback: string;
  triggerCandidateCategories: readonly TriggerCandidateCategory[];
  minimumUserContextFields: readonly string[];
  contextFieldsExplicitlyNotRequired: readonly string[];
  processStepTypes: readonly ProcessStepType[];
  documentRequirementStatuses: readonly DocumentRequirementStatus[];
  processOutcomes: readonly ProcessOutcome[];
  warningTypes: readonly WarningType[];
  packUnitLifecycleStates: readonly PackUnitLifecycleState[];
  firstContactCompatibilityRules: readonly string[];
  multilingualDesignFields: readonly string[];
  crossBorderActivationRule: string;
  launchLocales: readonly string[];
  futureLocales: readonly string[];
  safetyBoundaryNames: readonly string[];
  sourceEvidence: string[];
  notes: string[];
}

// ─── Tamper harness ─────────────────────────────────────────────────────────

type TamperCase = { id: number; description: string; mutate: (r: Result) => void };

const TAMPER_CASES: readonly TamperCase[] = [
  { id: 1, description: "real source content included", mutate: (r) => { r.realSourceContentIncludedAccepted = true; } },
  { id: 2, description: "actual numerical legal deadline inserted", mutate: (r) => { r.actualNumericalLegalDeadlineInsertedAccepted = true; } },
  { id: 3, description: "actual fee inserted", mutate: (r) => { r.actualFeeInsertedAccepted = true; } },
  { id: 4, description: "actual office address inserted", mutate: (r) => { r.actualOfficeAddressInsertedAccepted = true; } },
  { id: 5, description: "unsupported municipality rule marked approved", mutate: (r) => { r.unsupportedMunicipalityRuleMarkedApprovedAccepted = true; } },
  { id: 6, description: "source without immutable version accepted", mutate: (r) => { r.sourceWithoutImmutableVersionAcceptedAccepted = true; } },
  { id: 7, description: "claim without passage citation accepted", mutate: (r) => { r.claimWithoutPassageCitationAcceptedAccepted = true; } },
  { id: 8, description: "citation without source version accepted", mutate: (r) => { r.citationWithoutSourceVersionAcceptedAccepted = true; } },
  { id: 9, description: "translation treated as canonical", mutate: (r) => { r.translationTreatedAsCanonicalAccepted = true; } },
  { id: 10, description: "machine translation auto-published", mutate: (r) => { r.machineTranslationAutoPublishedAccepted = true; r.translationAutoPublicationAllowed = true; } },
  { id: 11, description: "locale used as jurisdiction", mutate: (r) => { r.localeUsedForJurisdiction = true; } },
  { id: 12, description: "changed source overwriting prior version", mutate: (r) => { r.changedSourceOverwritingPriorVersionAccepted = true; } },
  { id: 13, description: "publication without human review for high-risk claim", mutate: (r) => { r.publicationWithoutHumanReviewForHighRiskClaimAccepted = true; r.humanReviewRequiredForHighRiskClaims = false; } },
  { id: 14, description: "conflicting sources silently merged", mutate: (r) => { r.conflictingSourcesSilentlyMergedAccepted = true; } },
  { id: 15, description: "missing effective date represented as verified current", mutate: (r) => { r.missingEffectiveDateRepresentedAsVerifiedCurrentAccepted = true; } },
  { id: 16, description: "historical information treated as current", mutate: (r) => { r.historicalInformationTreatedAsCurrentAccepted = true; } },
  { id: 17, description: "future-effective information published as current", mutate: (r) => { r.futureEffectiveInformationPublishedAsCurrentAccepted = true; } },
  { id: 18, description: "process variant chosen without context", mutate: (r) => { r.processVariantChosenWithoutContextAccepted = true; } },
  { id: 19, description: "required document marked mandatory without evidence", mutate: (r) => { r.requiredDocumentMarkedMandatoryWithoutEvidenceAccepted = true; } },
  { id: 20, description: "deadline claim missing calculation semantics", mutate: (r) => { r.deadlineClaimMissingCalculationSemanticsAccepted = true; } },
  { id: 21, description: "source removal causing silent deletion", mutate: (r) => { r.sourceRemovalCausingSilentDeletionAccepted = true; } },
  { id: 22, description: "failed ingestion producing published partial data", mutate: (r) => { r.failedIngestionProducingPublishedPartialDataAccepted = true; } },
  { id: 23, description: "duplicate ingestion producing duplicate canonical rows", mutate: (r) => { r.duplicateIngestionProducingDuplicateCanonicalRowsAccepted = true; } },
  { id: 24, description: "runtime retrieval activated", mutate: (r) => { r.runtimeRetrievalEnabled = true; } },
  { id: 25, description: "database write performed", mutate: (r) => { r.databaseWritePerformed = true; } },
  { id: 26, description: "remote database used", mutate: (r) => { r.remoteDatabaseUsed = true; } },
  { id: 27, description: "migration 032 modified", mutate: (r) => { r.migration032Modified = true; } },
  { id: 28, description: "DE<->SK connector activated", mutate: (r) => { r.crossBorderConnectorActivated = true; r.deSkConnectorImplementedThisPhase = true; } },
  { id: 29, description: "production authorized", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 30, description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; } },
  { id: 31, description: "standalone First Contact mode reintroduced", mutate: (r) => { r.standaloneFirstContactModeIntroduced = true; } },
  { id: 32, description: "first-pack identity changed", mutate: (r) => { r.firstProcessPackId = "anmeldung_only"; r.firstPackIdentityChangedAccepted = true; } },
  { id: 33, description: "real source fetched", mutate: (r) => { r.realSourceFetched = true; } },
  { id: 34, description: "real government content stored", mutate: (r) => { r.realGovernmentContentStored = true; } },
  { id: 35, description: "real knowledge record inserted", mutate: (r) => { r.realKnowledgeRecordInserted = true; } },
  { id: 36, description: "German knowledge pack published", mutate: (r) => { r.germanKnowledgePackPublished = true; } },
  { id: 37, description: "Smart Talk runtime modified", mutate: (r) => { r.smartTalkRuntimeModified = true; } },
  { id: 38, description: "paid document mode modified", mutate: (r) => { r.paidDocumentModeModified = true; } },
  { id: 39, description: "Vaylo DNA modified", mutate: (r) => { r.vayloDnaModified = true; } },
  { id: 40, description: "Docker started", mutate: (r) => { r.dockerStarted = true; } },
  { id: 41, description: "Supabase started", mutate: (r) => { r.supabaseStarted = true; } },
  { id: 42, description: "network access performed", mutate: (r) => { r.networkAccessPerformed = true; } },
  { id: 43, description: "authority resolution derived from locale", mutate: (r) => { r.authorityResolutionUsesLocale = true; } },
  { id: 44, description: "first pack adds cross-border claims", mutate: (r) => { r.firstPackAddsCrossBorderClaims = true; } },
  { id: 45, description: "createdFileCount not equal to 1", mutate: (r) => { r.createdFileCount = 2; } },
  { id: 46, description: "modifiedExistingFileCount not equal to 0", mutate: (r) => { r.modifiedExistingFileCount = 1; } },
  { id: 47, description: "actualKnowledgeTableCountObservedFromMigration tampered", mutate: (r) => { r.actualKnowledgeTableCountObservedFromMigration = 30; } },
  { id: 48, description: "expectedKnowledgeTableCount tampered", mutate: (r) => { r.expectedKnowledgeTableCount = 30; } },
  { id: 49, description: "schemaMappingComplete claimed true with table mismatch", mutate: (r) => { r.actualKnowledgeTableCountObservedFromMigration = 30; r.schemaMappingComplete = true; } },
  { id: 50, description: "ingestionLifecycleStageCount tampered", mutate: (r) => { r.ingestionLifecycleStageCount = 10; } },
  { id: 51, description: "sourceAcquisitionClassCount tampered", mutate: (r) => { r.sourceAcquisitionClassCount = 3; } },
  { id: 52, description: "riskClassCount tampered", mutate: (r) => { r.riskClassCount = 5; } },
  { id: 53, description: "processVariantCount tampered", mutate: (r) => { r.processVariantCount = 1; } },
  { id: 54, description: "jurisdictionLayerCount tampered", mutate: (r) => { r.jurisdictionLayerCount = 1; } },
  { id: 55, description: "supportedLaunchLanguageCount tampered", mutate: (r) => { r.supportedLaunchLanguageCount = 3; } },
  { id: 56, description: "canonicalSourceLanguage tampered", mutate: (r) => { r.canonicalSourceLanguage = "en"; } },
  { id: 57, description: "translationAutoPublicationAllowed tampered true without marker", mutate: (r) => { r.translationAutoPublicationAllowed = true; } },
  { id: 58, description: "humanReviewRequiredForHighRiskClaims tampered false", mutate: (r) => { r.humanReviewRequiredForHighRiskClaims = false; } },
  { id: 59, description: "readyForRealGermanSourceIngestion tampered true", mutate: (r) => { r.readyForRealGermanSourceIngestion = true; } },
  { id: 60, description: "readyForFirstGermanProcessPackImplementationPlan true while allPassed false", mutate: (r) => { r.readyForFirstGermanProcessPackImplementationPlan = true; r.allPassed = false; } },
  { id: 61, description: "schemaGapCount inconsistent with gap list length", mutate: (r) => { r.schemaGapCount = 1; } },
  { id: 62, description: "blockingSchemaGapCount inconsistent with gap list", mutate: (r) => { r.blockingSchemaGapCount = 99; } },
  { id: 63, description: "onlyExpectedFilesChanged false but allPassed true", mutate: (r) => { r.onlyExpectedFilesChanged = false; r.allPassed = true; } },
  { id: 64, description: "existingFileModified true but allPassed true", mutate: (r) => { r.existingFileModified = true; r.allPassed = true; } },
  { id: 65, description: "migration032Modified true but allPassed true", mutate: (r) => { r.migration032Modified = true; r.allPassed = true; } },
  { id: 66, description: "checkId wrong", mutate: (r) => { (r as { checkId: string }).checkId = "9J"; } },
  { id: 67, description: "tamperCaseCount mismatched", mutate: (r) => { r.tamperCaseCount = 1; } },
  { id: 68, description: "architectureDesignOnly false", mutate: (r) => { r.architectureDesignOnly = false; } },
  { id: 69, description: "sourceMigrationValidationReady false but allPassed true", mutate: (r) => { r.sourceMigrationValidationReady = false; r.allPassed = true; } },
  { id: 70, description: "any tamper case survived", mutate: (r) => { r.anyTamperCaseSurvivedAccepted = true; } },
];

function runTamperCases(good: Result): { total: number; rejected: number; failures: string[] } {
  let rejected = 0;
  const failures: string[] = [];
  for (const tc of TAMPER_CASES) {
    const mutated = clone(good);
    tc.mutate(mutated);
    const ok = computeExpectedAllPassed(mutated);
    if (ok === false) {
      rejected += 1;
    } else {
      failures.push(`#${tc.id} (${tc.description}) was NOT rejected`);
    }
  }
  return { total: TAMPER_CASES.length, rejected, failures };
}

// ─── Validator ───────────────────────────────────────────────────────────────

function computeExpectedAllPassed(r: Result): boolean {
  const checks: boolean[] = [
    r.checkId === "9I",
    r.architectureDesignOnly === true,
    r.sourceClosureCommit === SOURCE_CLOSURE_COMMIT,
    r.sourceMigrationValidationCheckId === SOURCE_MIGRATION_VALIDATION_CHECK_ID,
    r.sourceMigrationValidationReady === true,

    r.createdFileCount === 1,
    r.modifiedExistingFileCount === 0,
    r.existingFileModified === false,
    r.onlyExpectedFilesChanged === true,
    r.newAuditFileCreated === true,

    r.targetMigrationInspected === true,
    r.migration032Modified === false,
    r.actualKnowledgeTableCountObservedFromMigration === 33,
    r.expectedKnowledgeTableCount === 33,
    r.rlsEnabledTableCountObservedFromMigration === 33,
    r.migrationHasInsertStatements === false,
    r.migrationHasAnonOrAuthenticatedPolicy === false,

    r.schemaMappingComplete === true,
    r.schemaGapCount === SCHEMA_GAPS.length,
    r.blockingSchemaGapCount === BLOCKING_SCHEMA_GAP_COUNT,

    r.ingestionLifecycleStageCount === 24,
    r.sourceAcquisitionClassCount === 8,
    r.riskClassCount === 11,
    r.architectureDecisionCount === ARCHITECTURE_DECISIONS.length,
    r.idempotencyKeyFamilyCount === IDEMPOTENCY_KEYS.length,
    r.changeDetectionClassCount === 12,
    r.highImpactChangeClassCount === HIGH_IMPACT_CHANGE_CLASSES.length,

    r.firstProcessPackId === "anmeldung_ummeldung_abmeldung",
    r.firstProcessPackFamily === "residence_registration_lifecycle",
    r.processVariantCount === 3,
    r.jurisdictionLayerCount === 4,
    r.triggerCandidateCategoryCount === 7,
    r.minimumUserContextFieldCount === 9,
    r.processStepTypeCount === 11,
    r.requiredDocumentModelFieldCount === 10,
    r.deadlineModelFieldCount === 12,
    r.authorityResolutionModelFieldCount === 9,
    r.processOutcomeCount === 9,
    r.warningTypeCount === 9,
    r.packUnitLifecycleStateCount === 9,

    r.supportedLaunchLanguageCount === 6,
    r.canonicalSourceLanguage === "de",
    r.translationAutoPublicationAllowed === false,
    r.humanReviewRequiredForHighRiskClaims === true,
    r.localeUsedForJurisdiction === false,
    r.authorityResolutionUsesLocale === false,

    r.firstPackAddsCrossBorderClaims === false,
    r.firstCrossBorderPilotRecorded === "familienkasse_kindergeld",
    r.deSkConnectorImplementedThisPhase === false,

    r.realSourceFetched === false,
    r.realGovernmentContentStored === false,
    r.databaseWritePerformed === false,
    r.remoteDatabaseUsed === false,
    r.realKnowledgeRecordInserted === false,
    r.runtimeRetrievalEnabled === false,
    r.crossBorderConnectorActivated === false,
    r.germanKnowledgePackPublished === false,
    r.standaloneFirstContactModeIntroduced === false,
    r.smartTalkRuntimeModified === false,
    r.paidDocumentModeModified === false,
    r.vayloDnaModified === false,
    r.dockerStarted === false,
    r.supabaseStarted === false,
    r.networkAccessPerformed === false,

    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,

    r.readyForRealGermanSourceIngestion === false,

    r.realSourceContentIncludedAccepted === false,
    r.actualNumericalLegalDeadlineInsertedAccepted === false,
    r.actualFeeInsertedAccepted === false,
    r.actualOfficeAddressInsertedAccepted === false,
    r.unsupportedMunicipalityRuleMarkedApprovedAccepted === false,
    r.sourceWithoutImmutableVersionAcceptedAccepted === false,
    r.claimWithoutPassageCitationAcceptedAccepted === false,
    r.citationWithoutSourceVersionAcceptedAccepted === false,
    r.translationTreatedAsCanonicalAccepted === false,
    r.machineTranslationAutoPublishedAccepted === false,
    r.changedSourceOverwritingPriorVersionAccepted === false,
    r.publicationWithoutHumanReviewForHighRiskClaimAccepted === false,
    r.conflictingSourcesSilentlyMergedAccepted === false,
    r.missingEffectiveDateRepresentedAsVerifiedCurrentAccepted === false,
    r.historicalInformationTreatedAsCurrentAccepted === false,
    r.futureEffectiveInformationPublishedAsCurrentAccepted === false,
    r.processVariantChosenWithoutContextAccepted === false,
    r.requiredDocumentMarkedMandatoryWithoutEvidenceAccepted === false,
    r.deadlineClaimMissingCalculationSemanticsAccepted === false,
    r.sourceRemovalCausingSilentDeletionAccepted === false,
    r.failedIngestionProducingPublishedPartialDataAccepted === false,
    r.duplicateIngestionProducingDuplicateCanonicalRowsAccepted === false,
    r.firstPackIdentityChangedAccepted === false,
    r.anyTamperCaseSurvivedAccepted === false,

    r.tamperCaseCount === TAMPER_CASES.length,
    r.tamperCasesRejectedCount <= r.tamperCaseCount,
    r.tamperCasesRejected <= r.tamperCaseCount,

    // readiness must never be true while allPassed / prerequisites are false
    !(r.readyForFirstGermanProcessPackImplementationPlan === true && r.allPassed === false),
    !(r.readyForFirstGermanProcessPackImplementationPlan === true && r.sourceMigrationValidationReady === false),
    !(r.readyForFirstGermanProcessPackImplementationPlan === true && r.schemaMappingComplete === false),
  ];
  return checks.every(Boolean);
}

// ─── Evidence collection (static source inspection + read-only git) ───────

interface Evidence {
  onlyExpectedFilesChanged: boolean;
  existingFileModified: boolean;
  newAuditFileCreated: boolean;
  createdFileCount: number;
  modifiedExistingFileCount: number;
  sourceMigrationValidationReady: boolean;
  migrationChecksum: string;
  actualKnowledgeTableCountObservedFromMigration: number;
  rlsEnabledTableCountObservedFromMigration: number;
  migrationHasInsertStatements: boolean;
  migrationHasAnonOrAuthenticatedPolicy: boolean;
  targetMigrationInspected: boolean;
  migration032Modified: boolean;
  schemaMappingComplete: boolean;
  notes: string[];
}

function collectEvidence(): Evidence {
  const notes: string[] = [];

  const diffNameOnly = runGitReadOnly("git diff --name-only")
    .split("\n").map((s) => s.trim()).filter(Boolean);
  const statusShort = runGitReadOnly("git status --short")
    .split("\n").map((s) => s.trim()).filter(Boolean);
  const untrackedNew = statusShort
    .filter((line) => line.startsWith("??"))
    .map((line) => line.replace(/^\?\?\s*/, "").replace(/\\/g, "/"))
    .filter((p) => !p.startsWith(".next"));

  const isAuditPathOrDirCovering = (p: string): boolean => {
    if (p === AUDIT_SELF_REL_PATH || p.endsWith(AUDIT_SELF_REL_PATH)) return true;
    const dirPrefix = p.endsWith("/") ? p : `${p}/`;
    return AUDIT_SELF_REL_PATH.startsWith(dirPrefix);
  };

  const unexpectedModified = diffNameOnly.filter((p) => p !== AUDIT_SELF_REL_PATH && p !== MIGRATION_REL_PATH);
  const migration032Modified = diffNameOnly.includes(MIGRATION_REL_PATH);
  const newAuditFileCreated = fileExists(AUDIT_SELF_REL_PATH) && untrackedNew.some((p) => isAuditPathOrDirCovering(p));
  const unexpectedUntracked = untrackedNew.filter((p) => !isAuditPathOrDirCovering(p));

  const onlyExpectedFilesChanged = unexpectedModified.length === 0 && unexpectedUntracked.length === 0 && !migration032Modified;
  const existingFileModified = diffNameOnly.length > 0;

  if (unexpectedModified.length > 0) notes.push(`Unexpected modified files: ${unexpectedModified.join(", ")}`);
  if (unexpectedUntracked.length > 0) notes.push(`Unexpected untracked files: ${unexpectedUntracked.join(", ")}`);
  if (migration032Modified) notes.push("migration 032 appears modified in git diff — this must block allPassed.");

  const createdFileCount = newAuditFileCreated ? 1 : 0;
  const modifiedExistingFileCount = diffNameOnly.filter((p) => p !== AUDIT_SELF_REL_PATH).length;

  const phase9hSrc = readFileText(PHASE_9H_REL_PATH);
  const phase9hExists = fileExists(PHASE_9H_REL_PATH);
  const sourceMigrationValidationReady =
    phase9hExists &&
    phase9hSrc.includes('checkId: "9H"') &&
    phase9hSrc.includes("result.readyForGermanKnowledgeIngestionDesign = genuineAllPassed;");
  if (!sourceMigrationValidationReady) notes.push("PHASE 9H source did not statically confirm readiness for PHASE 9I.");

  const migrationSql = readFileText(MIGRATION_REL_PATH);
  const migrationExists = fileExists(MIGRATION_REL_PATH);
  const migrationChecksum = migrationSql.length > 0 ? sha256Hex(migrationSql) : "not_found";
  const actualTableNames = extractKnowledgeTableNames(migrationSql);
  const rlsTableNames = extractRlsEnabledTables(migrationSql);
  const actualKnowledgeTableCountObservedFromMigration = actualTableNames.length;
  const rlsEnabledTableCountObservedFromMigration = rlsTableNames.length;
  const migrationHasInsert = migrationHasInsertStatements(migrationSql);
  const migrationHasPolicy = migrationHasAnonOrAuthenticatedPolicy(migrationSql);
  const targetMigrationInspected = migrationExists && migrationSql.length > 0;

  const mappedTableNames = DB_TABLE_CONCEPT_MAP.map((e) => e.table).sort();
  const actualTableNamesSorted = [...actualTableNames].sort();
  const tableSetsMatch =
    mappedTableNames.length === actualTableNamesSorted.length &&
    mappedTableNames.every((t, i) => t === actualTableNamesSorted[i]);
  const schemaMappingComplete =
    targetMigrationInspected &&
    tableSetsMatch &&
    actualKnowledgeTableCountObservedFromMigration === EXPECTED_KNOWLEDGE_TABLE_COUNT &&
    DB_TABLE_CONCEPT_MAP.length === EXPECTED_KNOWLEDGE_TABLE_COUNT;
  if (!schemaMappingComplete) {
    notes.push("Schema mapping did not statically verify a 1:1 match against migration 032's real table set.");
  }

  return {
    onlyExpectedFilesChanged,
    existingFileModified,
    newAuditFileCreated,
    createdFileCount,
    modifiedExistingFileCount,
    sourceMigrationValidationReady,
    migrationChecksum,
    actualKnowledgeTableCountObservedFromMigration,
    rlsEnabledTableCountObservedFromMigration,
    migrationHasInsertStatements: migrationHasInsert,
    migrationHasAnonOrAuthenticatedPolicy: migrationHasPolicy,
    targetMigrationInspected,
    migration032Modified,
    schemaMappingComplete,
    notes,
  };
}

// ─── Good-result construction ───────────────────────────────────────────────

function buildGoodResult(evidence: Evidence): Result {
  const designComplete =
    INGESTION_LIFECYCLE.length === 24 &&
    SOURCE_ACQUISITION_CLASSES.length === 8 &&
    RISK_CLASSES.length === 11 &&
    HIGH_RISK_CLASSES_REQUIRING_REVIEW.length === 10 &&
    ARCHITECTURE_DECISIONS.length === 17 &&
    IDEMPOTENCY_KEYS.length === 12 &&
    CHANGE_DETECTION_CLASSES.length === 12 &&
    HIGH_IMPACT_CHANGE_CLASSES.length === 8 &&
    DB_TABLE_CONCEPT_MAP.length === EXPECTED_KNOWLEDGE_TABLE_COUNT &&
    SCHEMA_GAPS.length === 7 &&
    PROCESS_VARIANTS.length === 3 &&
    JURISDICTION_MATRIX_LAYERS.length === 4 &&
    TRIGGER_CANDIDATE_CATEGORIES.length === 7 &&
    MINIMUM_USER_CONTEXT_FIELDS.length === 9 &&
    PROCESS_STEP_TYPES.length === 11 &&
    REQUIRED_DOCUMENT_MODEL_FIELDS.length === 10 &&
    DEADLINE_MODEL_FIELDS.length === 12 &&
    AUTHORITY_RESOLUTION_MODEL_FIELDS.length === 9 &&
    PROCESS_OUTCOMES.length === 9 &&
    WARNING_TYPES.length === 9 &&
    PACK_UNIT_LIFECYCLE_STATES.length === 9 &&
    LAUNCH_LOCALES.length === 6 &&
    FUTURE_LOCALES.length === 5 &&
    SAFETY_BOUNDARY_NAMES.length === 13 &&
    JURISDICTION_FROM_LOCALE_PROHIBITED === true &&
    AUTHORITY_RESOLUTION_FROM_LOCALE_PROHIBITED === true &&
    TRIGGER_CATEGORIES_ARE_LEGAL_CONCLUSIONS === false &&
    HIGH_IMPACT_CHANGE_AUTO_SUSPENDS_PUBLICATION === true &&
    NO_MACHINE_TRANSLATION_AUTO_PUBLICATION === true &&
    STANDALONE_FIRST_CONTACT_MODE_REINTRODUCED === false &&
    DE_SK_CONNECTOR_IMPLEMENTED_THIS_PHASE === false &&
    FIRST_PACK_ADDS_CROSS_BORDER_CLAIMS === false &&
    FIRST_CROSS_BORDER_PILOT === "familienkasse_kindergeld";

  const allPassed =
    designComplete &&
    evidence.onlyExpectedFilesChanged &&
    !evidence.existingFileModified &&
    !evidence.migration032Modified &&
    evidence.newAuditFileCreated &&
    evidence.createdFileCount === 1 &&
    evidence.modifiedExistingFileCount === 0 &&
    evidence.sourceMigrationValidationReady &&
    evidence.targetMigrationInspected &&
    evidence.actualKnowledgeTableCountObservedFromMigration === EXPECTED_KNOWLEDGE_TABLE_COUNT &&
    evidence.rlsEnabledTableCountObservedFromMigration === EXPECTED_KNOWLEDGE_TABLE_COUNT &&
    !evidence.migrationHasInsertStatements &&
    !evidence.migrationHasAnonOrAuthenticatedPolicy &&
    evidence.schemaMappingComplete;

  const readyForFirstGermanProcessPackImplementationPlan = allPassed;
  const readyForRealGermanSourceIngestion = false;

  return {
    checkId: "9I",
    allPassed,

    architectureDesignOnly: true,
    sourceClosureCommit: SOURCE_CLOSURE_COMMIT,
    sourceMigrationValidationCheckId: SOURCE_MIGRATION_VALIDATION_CHECK_ID,
    sourceMigrationValidationReady: evidence.sourceMigrationValidationReady,

    createdFileCount: evidence.createdFileCount,
    modifiedExistingFileCount: evidence.modifiedExistingFileCount,
    existingFileModified: evidence.existingFileModified,
    onlyExpectedFilesChanged: evidence.onlyExpectedFilesChanged,
    newAuditFileCreated: evidence.newAuditFileCreated,

    targetMigrationInspected: evidence.targetMigrationInspected,
    migration032Modified: evidence.migration032Modified,
    migrationChecksum: evidence.migrationChecksum,
    actualKnowledgeTableCountObservedFromMigration: evidence.actualKnowledgeTableCountObservedFromMigration,
    expectedKnowledgeTableCount: EXPECTED_KNOWLEDGE_TABLE_COUNT,
    rlsEnabledTableCountObservedFromMigration: evidence.rlsEnabledTableCountObservedFromMigration,
    migrationHasInsertStatements: evidence.migrationHasInsertStatements,
    migrationHasAnonOrAuthenticatedPolicy: evidence.migrationHasAnonOrAuthenticatedPolicy,

    schemaMappingComplete: evidence.schemaMappingComplete,
    schemaGapCount: SCHEMA_GAPS.length,
    blockingSchemaGapCount: BLOCKING_SCHEMA_GAP_COUNT,

    ingestionLifecycleStageCount: INGESTION_LIFECYCLE.length,
    sourceAcquisitionClassCount: SOURCE_ACQUISITION_CLASSES.length,
    riskClassCount: RISK_CLASSES.length,
    architectureDecisionCount: ARCHITECTURE_DECISIONS.length,
    idempotencyKeyFamilyCount: IDEMPOTENCY_KEYS.length,
    changeDetectionClassCount: CHANGE_DETECTION_CLASSES.length,
    highImpactChangeClassCount: HIGH_IMPACT_CHANGE_CLASSES.length,

    firstProcessPackId: FIRST_PACK_IDENTITY.canonicalProcessPackId,
    firstProcessPackFamily: FIRST_PACK_IDENTITY.processFamily,
    processVariantCount: PROCESS_VARIANTS.length,
    jurisdictionLayerCount: JURISDICTION_MATRIX_LAYERS.length,
    triggerCandidateCategoryCount: TRIGGER_CANDIDATE_CATEGORIES.length,
    minimumUserContextFieldCount: MINIMUM_USER_CONTEXT_FIELDS.length,
    processStepTypeCount: PROCESS_STEP_TYPES.length,
    requiredDocumentModelFieldCount: REQUIRED_DOCUMENT_MODEL_FIELDS.length,
    deadlineModelFieldCount: DEADLINE_MODEL_FIELDS.length,
    authorityResolutionModelFieldCount: AUTHORITY_RESOLUTION_MODEL_FIELDS.length,
    processOutcomeCount: PROCESS_OUTCOMES.length,
    warningTypeCount: WARNING_TYPES.length,
    packUnitLifecycleStateCount: PACK_UNIT_LIFECYCLE_STATES.length,

    supportedLaunchLanguageCount: LAUNCH_LOCALES.length,
    canonicalSourceLanguage: FIRST_PACK_IDENTITY.canonicalSourceLanguage,
    translationAutoPublicationAllowed: !NO_MACHINE_TRANSLATION_AUTO_PUBLICATION,
    humanReviewRequiredForHighRiskClaims: true,
    localeUsedForJurisdiction: !JURISDICTION_FROM_LOCALE_PROHIBITED,
    authorityResolutionUsesLocale: !AUTHORITY_RESOLUTION_FROM_LOCALE_PROHIBITED,

    firstPackAddsCrossBorderClaims: FIRST_PACK_ADDS_CROSS_BORDER_CLAIMS,
    firstCrossBorderPilotRecorded: FIRST_CROSS_BORDER_PILOT,
    deSkConnectorImplementedThisPhase: DE_SK_CONNECTOR_IMPLEMENTED_THIS_PHASE,

    realSourceFetched: false,
    realGovernmentContentStored: false,
    databaseWritePerformed: false,
    remoteDatabaseUsed: false,
    realKnowledgeRecordInserted: false,
    runtimeRetrievalEnabled: false,
    crossBorderConnectorActivated: false,
    germanKnowledgePackPublished: false,
    standaloneFirstContactModeIntroduced: false,
    smartTalkRuntimeModified: false,
    paidDocumentModeModified: false,
    vayloDnaModified: false,
    dockerStarted: false,
    supabaseStarted: false,
    networkAccessPerformed: false,

    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,

    readyForFirstGermanProcessPackImplementationPlan,
    readyForRealGermanSourceIngestion,

    realSourceContentIncludedAccepted: false,
    actualNumericalLegalDeadlineInsertedAccepted: false,
    actualFeeInsertedAccepted: false,
    actualOfficeAddressInsertedAccepted: false,
    unsupportedMunicipalityRuleMarkedApprovedAccepted: false,
    sourceWithoutImmutableVersionAcceptedAccepted: false,
    claimWithoutPassageCitationAcceptedAccepted: false,
    citationWithoutSourceVersionAcceptedAccepted: false,
    translationTreatedAsCanonicalAccepted: false,
    machineTranslationAutoPublishedAccepted: false,
    changedSourceOverwritingPriorVersionAccepted: false,
    publicationWithoutHumanReviewForHighRiskClaimAccepted: false,
    conflictingSourcesSilentlyMergedAccepted: false,
    missingEffectiveDateRepresentedAsVerifiedCurrentAccepted: false,
    historicalInformationTreatedAsCurrentAccepted: false,
    futureEffectiveInformationPublishedAsCurrentAccepted: false,
    processVariantChosenWithoutContextAccepted: false,
    requiredDocumentMarkedMandatoryWithoutEvidenceAccepted: false,
    deadlineClaimMissingCalculationSemanticsAccepted: false,
    sourceRemovalCausingSilentDeletionAccepted: false,
    failedIngestionProducingPublishedPartialDataAccepted: false,
    duplicateIngestionProducingDuplicateCanonicalRowsAccepted: false,
    firstPackIdentityChangedAccepted: false,
    anyTamperCaseSurvivedAccepted: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejectedCount: 0,
    tamperCasesRejected: 0,

    ingestionLifecycle: INGESTION_LIFECYCLE,
    sourceAcquisitionClasses: SOURCE_ACQUISITION_CLASSES,
    idempotencyKeys: IDEMPOTENCY_KEYS,
    changeDetectionClasses: CHANGE_DETECTION_CLASSES,
    highImpactChangeClasses: HIGH_IMPACT_CHANGE_CLASSES,
    riskClasses: RISK_CLASSES,
    architectureDecisions: ARCHITECTURE_DECISIONS,
    dbTableConceptMap: DB_TABLE_CONCEPT_MAP,
    schemaGaps: SCHEMA_GAPS,
    firstPackIdentity: FIRST_PACK_IDENTITY,
    processVariants: PROCESS_VARIANTS,
    variantApplicabilityStates: VARIANT_APPLICABILITY_STATES,
    variantSelectionEvidenceInputs: VARIANT_SELECTION_EVIDENCE_INPUTS,
    jurisdictionMatrixLayers: JURISDICTION_MATRIX_LAYERS,
    jurisdictionConflictPrecedenceRule: JURISDICTION_CONFLICT_PRECEDENCE_RULE,
    unknownLocalRuleFallback: UNKNOWN_LOCAL_RULE_FALLBACK,
    triggerCandidateCategories: TRIGGER_CANDIDATE_CATEGORIES,
    minimumUserContextFields: MINIMUM_USER_CONTEXT_FIELDS,
    contextFieldsExplicitlyNotRequired: CONTEXT_FIELDS_EXPLICITLY_NOT_REQUIRED,
    processStepTypes: PROCESS_STEP_TYPES,
    documentRequirementStatuses: DOCUMENT_REQUIREMENT_STATUSES,
    processOutcomes: PROCESS_OUTCOMES,
    warningTypes: WARNING_TYPES,
    packUnitLifecycleStates: PACK_UNIT_LIFECYCLE_STATES,
    firstContactCompatibilityRules: FIRST_CONTACT_COMPATIBILITY_RULES,
    multilingualDesignFields: MULTILINGUAL_DESIGN_FIELDS,
    crossBorderActivationRule: CROSS_BORDER_ACTIVATION_RULE,
    launchLocales: LAUNCH_LOCALES,
    futureLocales: FUTURE_LOCALES,
    safetyBoundaryNames: SAFETY_BOUNDARY_NAMES,
    sourceEvidence: [
      `onlyExpectedFilesChanged: ${evidence.onlyExpectedFilesChanged}`,
      `existingFileModified: ${evidence.existingFileModified}`,
      `newAuditFileCreated: ${evidence.newAuditFileCreated}`,
      `migration032Modified (git diff): ${evidence.migration032Modified}`,
      `migrationChecksum (sha256, informational only): ${evidence.migrationChecksum}`,
      `actualKnowledgeTableCountObservedFromMigration (dynamic regex over migration text): ${evidence.actualKnowledgeTableCountObservedFromMigration}`,
      `rlsEnabledTableCountObservedFromMigration: ${evidence.rlsEnabledTableCountObservedFromMigration}`,
      `migrationHasInsertStatements: ${evidence.migrationHasInsertStatements}`,
      `migrationHasAnonOrAuthenticatedPolicy: ${evidence.migrationHasAnonOrAuthenticatedPolicy}`,
      `schemaMappingComplete (dynamic table-set equality against DB_TABLE_CONCEPT_MAP): ${evidence.schemaMappingComplete}`,
      `${PHASE_9H_REL_PATH} checkId "9H" + genuineAllPassed wiring confirmed: ${evidence.sourceMigrationValidationReady}`,
      "This audit read only committed plain text for migration 032 and the PHASE 9H audit — neither was imported, executed, or modified.",
      "Zero sources fetched, zero rows inserted, zero databases (local or remote) touched, zero Docker/Supabase processes started, zero runtime retrieval activated.",
    ],
    notes: evidence.notes,
  };
}

// ─── Entry point ────────────────────────────────────────────────────────────

export function runGermanKnowledgeIngestionArchitectureAndFirstProcessPackDesignAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);
  const tamperOutcome = runTamperCases(good);

  const allPassed = computeExpectedAllPassed(good) && tamperOutcome.rejected === tamperOutcome.total && good.allPassed;

  return {
    ...good,
    allPassed,
    tamperCasesRejected: tamperOutcome.rejected,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    readyForFirstGermanProcessPackImplementationPlan: allPassed,
    readyForRealGermanSourceIngestion: false,
    notes: [
      ...good.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(tamperOutcome.failures.length > 0 ? [`Tamper failures: ${tamperOutcome.failures.join("; ")}`] : []),
    ],
  };
}

if (require.main === module) {
  const result = runGermanKnowledgeIngestionArchitectureAndFirstProcessPackDesignAudit();
  console.log(JSON.stringify(result));
}
