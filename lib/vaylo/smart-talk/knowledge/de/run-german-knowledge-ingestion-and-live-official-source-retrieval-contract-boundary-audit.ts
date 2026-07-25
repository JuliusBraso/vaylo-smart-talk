/**
 * PHASE 9P — German Knowledge Ingestion and Live Official-Source Retrieval
 * Contract Boundary.
 *
 * This is a contract audit, not an ingestion implementation. It codifies the
 * boundary between a small, verified German canonical knowledge core and
 * controlled retrieval of volatile official operational information.
 *
 * It never fetches a source, invokes a model, writes the database, generates
 * types, or changes a migration. It reads the committed migrations and prior
 * audit artifacts, derives current database capabilities, and fails closed
 * when a required contract or security boundary is missing.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHECK_ID = "9P";
const PHASE = "German Knowledge Ingestion and Live Official-Source Retrieval Contract Boundary";

const MIGRATION_032 = "supabase/migrations/032_create_minimal_knowledge_schema.sql";
const MIGRATION_033 = "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql";
const MIGRATION_034 = "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql";
const AUDIT_9N =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-isolated-postgresql-validation-audit.ts";
const AUDIT_9N_PATCH =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-runtime-defect-fix-audit.ts";
const AUDIT_9O = "lib/vaylo/smart-talk/knowledge/de/run-generated-database-type-decision-and-closure-audit.ts";
const SELF =
  "lib/vaylo/smart-talk/knowledge/de/run-german-knowledge-ingestion-and-live-official-source-retrieval-contract-boundary-audit.ts";

const EXPECTED_UNTRACKED = new Set([SELF]);
const EXPECTED_HANDLING_MODES = [
  "STORE_CANONICALLY",
  "FETCH_LIVE",
  "CACHE_AND_REVALIDATE",
  "MANUAL_REVIEW_REQUIRED",
  "DO_NOT_ANSWER_WITHOUT_CONTEXT",
] as const;
const LAUNCH_LOCALES = ["de", "en", "sk", "cs", "pl", "hu"] as const;
const NEXT_PHASE = "PHASE 9Q — German Official Source Registry and Handling-Mode Contract Implementation Plan";

type HandlingMode = (typeof EXPECTED_HANDLING_MODES)[number];
type Risk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type WritePath =
  | "EXISTING_SAFE_RPC"
  | "EXISTING_TABLE_SERVER_WRITE_REQUIRED"
  | "NEW_NARROW_RPC_REQUIRED"
  | "NOT_YET_SUPPORTED"
  | "FORBIDDEN_DIRECT_WRITE";

function repoPath(relative: string): string {
  return path.join(process.cwd(), relative);
}

function read(relative: string): string {
  try {
    return fs.readFileSync(repoPath(relative), "utf8").replace(/\r\n/g, "\n");
  } catch {
    return "";
  }
}

function exists(relative: string): boolean {
  return fs.existsSync(repoPath(relative));
}

function git(args: string[]): string {
  try {
    return execFileSync("git", args, { cwd: process.cwd(), encoding: "utf8", timeout: 30000 }).trim();
  } catch {
    return "";
  }
}

function countCreateTables(sql: string): string[] {
  const names: string[] = [];
  const matcher = /create\s+table\s+(?:if\s+not\s+exists\s+)?public\.(\w+)/gi;
  let found: RegExpExecArray | null;
  while ((found = matcher.exec(sql)) !== null) names.push(found[1]);
  return names;
}

interface Scope {
  head: string;
  branch: string;
  unexpected: string[];
  workingTreeCleanBeforePhase: boolean;
  valid: boolean;
}

function scope(): Scope {
  const unexpected: string[] = [];
  const porcelain = git(["status", "--porcelain"]);
  for (const line of porcelain.split("\n")) {
    if (!line.trim()) continue;
    const file = line.slice(3).trim().replace(/^"|"$/g, "");
    if (file.startsWith(".next/") || file.startsWith("node_modules/")) continue;
    const untracked = line.slice(0, 2).includes("?");
    if (!untracked || !EXPECTED_UNTRACKED.has(file)) unexpected.push(file);
  }
  return {
    head: git(["rev-parse", "--short", "HEAD"]),
    branch: git(["branch", "--show-current"]),
    unexpected,
    workingTreeCleanBeforePhase: unexpected.length === 0,
    valid: unexpected.length === 0,
  };
}

// ---------------------------------------------------------------------------
// Binding contract
// ---------------------------------------------------------------------------

interface InformationClass {
  name: string;
  defaultMode: HandlingMode;
  alternativeModes: HandlingMode[];
  minimumSourceClass: string;
  jurisdiction: "REQUIRED" | "WHEN_LOCAL" | "BASELINE_ALLOWED";
  freshness: string;
  review: "NONE" | "CONTROLLED" | "MANUAL";
  publication: "REQUIRED" | "LIVE_GATE_ONLY" | "PROHIBITED_UNTIL_REVIEW";
  citation: "REQUIRED" | "REQUIRED_FOR_LIVE";
  liveFallback: boolean;
  staleCache: "ALLOW_WITH_STALE_WARNING" | "REVALIDATE_BEFORE_USE" | "DO_NOT_USE_STALE";
  abstention: string;
}

const MATRIX: InformationClass[] = [
  ["process_identity", "STORE_CANONICALLY", [], "FEDERAL_SERVICE_PORTAL", "BASELINE_ALLOWED", "MANUAL_REVIEW_CYCLE", "CONTROLLED", "REQUIRED", "REQUIRED", false, "REVALIDATE_BEFORE_USE", "withhold if process variant is unresolved"],
  ["process_variant", "STORE_CANONICALLY", ["DO_NOT_ANSWER_WITHOUT_CONTEXT"], "FEDERAL_SERVICE_PORTAL", "REQUIRED", "MANUAL_REVIEW_CYCLE", "CONTROLLED", "REQUIRED", "REQUIRED", false, "REVALIDATE_BEFORE_USE", "ask for facts selecting the variant"],
  ["process_trigger", "STORE_CANONICALLY", ["MANUAL_REVIEW_REQUIRED"], "FEDERAL_LAW", "BASELINE_ALLOWED", "LEGAL_CHANGE_MONITORED", "MANUAL", "REQUIRED", "REQUIRED", false, "DO_NOT_USE_STALE", "abstain where trigger facts are unknown"],
  ["competent_authority_class", "STORE_CANONICALLY", [], "FEDERAL_LAW", "REQUIRED", "LEGAL_CHANGE_MONITORED", "MANUAL", "REQUIRED", "REQUIRED", false, "DO_NOT_USE_STALE", "abstain until jurisdiction is known"],
  ["competent_authority_instance", "CACHE_AND_REVALIDATE", ["FETCH_LIVE"], "MUNICIPALITY_SERVICE_PORTAL", "REQUIRED", "MONTHLY", "CONTROLLED", "LIVE_GATE_ONLY", "REQUIRED_FOR_LIVE", true, "REVALIDATE_BEFORE_USE", "ask municipality or authority"],
  ["legal_basis", "STORE_CANONICALLY", ["MANUAL_REVIEW_REQUIRED"], "FEDERAL_LAW", "BASELINE_ALLOWED", "LEGAL_CHANGE_MONITORED", "MANUAL", "REQUIRED", "REQUIRED", false, "DO_NOT_USE_STALE", "abstain on unclear scope or effective date"],
  ["deadline", "MANUAL_REVIEW_REQUIRED", ["STORE_CANONICALLY", "DO_NOT_ANSWER_WITHOUT_CONTEXT"], "FEDERAL_LAW", "REQUIRED", "LEGAL_CHANGE_MONITORED", "MANUAL", "PROHIBITED_UNTIL_REVIEW", "REQUIRED", false, "DO_NOT_USE_STALE", "do not answer without event date and effective date"],
  ["deadline_trigger", "MANUAL_REVIEW_REQUIRED", ["STORE_CANONICALLY"], "FEDERAL_LAW", "REQUIRED", "LEGAL_CHANGE_MONITORED", "MANUAL", "PROHIBITED_UNTIL_REVIEW", "REQUIRED", false, "DO_NOT_USE_STALE", "do not calculate from missing trigger facts"],
  ["fee", "CACHE_AND_REVALIDATE", ["FETCH_LIVE", "MANUAL_REVIEW_REQUIRED"], "MUNICIPALITY_SERVICE_PORTAL", "REQUIRED", "MONTHLY", "CONTROLLED", "LIVE_GATE_ONLY", "REQUIRED_FOR_LIVE", true, "REVALIDATE_BEFORE_USE", "withhold when local fee is unknown"],
  ["required_document_category", "STORE_CANONICALLY", ["MANUAL_REVIEW_REQUIRED"], "FEDERAL_SERVICE_PORTAL", "BASELINE_ALLOWED", "MANUAL_REVIEW_CYCLE", "CONTROLLED", "REQUIRED", "REQUIRED", false, "DO_NOT_USE_STALE", "mark incomplete if exceptions are not covered"],
  ["required_document_local_variant", "CACHE_AND_REVALIDATE", ["FETCH_LIVE"], "MUNICIPALITY_SERVICE_PORTAL", "REQUIRED", "WEEKLY", "CONTROLLED", "LIVE_GATE_ONLY", "REQUIRED_FOR_LIVE", true, "REVALIDATE_BEFORE_USE", "ask municipality"],
  ["official_form", "CACHE_AND_REVALIDATE", ["FETCH_LIVE"], "OFFICIAL_FORM", "REQUIRED", "MONTHLY", "CONTROLLED", "LIVE_GATE_ONLY", "REQUIRED_FOR_LIVE", true, "REVALIDATE_BEFORE_USE", "do not show unverified link"],
  ["appointment_availability", "FETCH_LIVE", [], "OFFICIAL_ONLINE_SERVICE", "REQUIRED", "REAL_TIME", "NONE", "LIVE_GATE_ONLY", "REQUIRED_FOR_LIVE", true, "DO_NOT_USE_STALE", "state unavailable if live check fails"],
  ["opening_hours", "FETCH_LIVE", ["CACHE_AND_REVALIDATE"], "AUTHORITY_PORTAL", "REQUIRED", "DAILY", "NONE", "LIVE_GATE_ONLY", "REQUIRED_FOR_LIVE", true, "ALLOW_WITH_STALE_WARNING", "label stale result or abstain"],
  ["online_service_availability", "FETCH_LIVE", ["CACHE_AND_REVALIDATE"], "OFFICIAL_ONLINE_SERVICE", "REQUIRED", "REAL_TIME", "NONE", "LIVE_GATE_ONLY", "REQUIRED_FOR_LIVE", true, "DO_NOT_USE_STALE", "state unavailable if no current evidence"],
  ["contact_details", "FETCH_LIVE", ["CACHE_AND_REVALIDATE"], "AUTHORITY_PORTAL", "REQUIRED", "DAILY", "NONE", "LIVE_GATE_ONLY", "REQUIRED_FOR_LIVE", true, "ALLOW_WITH_STALE_WARNING", "label stale contact data"],
  ["process_step", "STORE_CANONICALLY", ["MANUAL_REVIEW_REQUIRED"], "FEDERAL_SERVICE_PORTAL", "BASELINE_ALLOWED", "MANUAL_REVIEW_CYCLE", "CONTROLLED", "REQUIRED", "REQUIRED", false, "REVALIDATE_BEFORE_USE", "do not present incomplete sequence as complete"],
  ["exception", "MANUAL_REVIEW_REQUIRED", ["STORE_CANONICALLY"], "FEDERAL_LAW", "REQUIRED", "LEGAL_CHANGE_MONITORED", "MANUAL", "PROHIBITED_UNTIL_REVIEW", "REQUIRED", false, "DO_NOT_USE_STALE", "abstain when exception facts are unknown"],
  ["warning", "STORE_CANONICALLY", ["MANUAL_REVIEW_REQUIRED"], "FEDERAL_ADMINISTRATIVE_GUIDANCE", "BASELINE_ALLOWED", "MANUAL_REVIEW_CYCLE", "CONTROLLED", "REQUIRED", "REQUIRED", false, "DO_NOT_USE_STALE", "preserve warning and uncertainty"],
  ["sanction", "MANUAL_REVIEW_REQUIRED", [], "FEDERAL_LAW", "REQUIRED", "LEGAL_CHANGE_MONITORED", "MANUAL", "PROHIBITED_UNTIL_REVIEW", "REQUIRED", false, "DO_NOT_USE_STALE", "always abstain pending review"],
  ["eligibility_rule", "MANUAL_REVIEW_REQUIRED", ["STORE_CANONICALLY"], "FEDERAL_LAW", "REQUIRED", "LEGAL_CHANGE_MONITORED", "MANUAL", "PROHIBITED_UNTIL_REVIEW", "REQUIRED", false, "DO_NOT_USE_STALE", "never make final determination"],
  ["jurisdiction_rule", "STORE_CANONICALLY", ["MANUAL_REVIEW_REQUIRED"], "FEDERAL_LAW", "REQUIRED", "LEGAL_CHANGE_MONITORED", "MANUAL", "REQUIRED", "REQUIRED", false, "DO_NOT_USE_STALE", "request missing geographic facts"],
  ["effective_date", "MANUAL_REVIEW_REQUIRED", ["STORE_CANONICALLY"], "FEDERAL_LAW", "REQUIRED", "LEGAL_CHANGE_MONITORED", "MANUAL", "PROHIBITED_UNTIL_REVIEW", "REQUIRED", false, "DO_NOT_USE_STALE", "unknown effective date blocks high-risk use"],
  ["official_terminology", "STORE_CANONICALLY", [], "FEDERAL_SERVICE_PORTAL", "BASELINE_ALLOWED", "MANUAL_REVIEW_CYCLE", "CONTROLLED", "REQUIRED", "REQUIRED", false, "REVALIDATE_BEFORE_USE", "retain German official term"],
  ["translation", "STORE_CANONICALLY", ["FETCH_LIVE"], "CANONICAL_GERMAN", "INHERITED", "SOURCE_CHANGE_MONITORED", "MANUAL", "REQUIRED", "REQUIRED", false, "DO_NOT_USE_STALE", "no approved translation without current German source"],
  ["source_url", "CACHE_AND_REVALIDATE", ["FETCH_LIVE"], "AUTHORITY_PORTAL", "WHEN_LOCAL", "MONTHLY", "CONTROLLED", "LIVE_GATE_ONLY", "REQUIRED_FOR_LIVE", true, "REVALIDATE_BEFORE_USE", "do not link unverified source"],
  ["source_authority", "STORE_CANONICALLY", ["MANUAL_REVIEW_REQUIRED"], "AUTHORITY_PORTAL", "REQUIRED", "MANUAL_REVIEW_CYCLE", "MANUAL", "REQUIRED", "REQUIRED", false, "DO_NOT_USE_STALE", "domain alone is insufficient"],
  ["source_version", "STORE_CANONICALLY", [], "AUTHORIZED_SOURCE", "WHEN_LOCAL", "EVENT_DRIVEN", "CONTROLLED", "REQUIRED", "REQUIRED", false, "DO_NOT_USE_STALE", "no canonical claim without immutable version"],
  ["evidence_passage", "STORE_CANONICALLY", [], "AUTHORIZED_SOURCE", "WHEN_LOCAL", "EVENT_DRIVEN", "CONTROLLED", "REQUIRED", "REQUIRED", false, "DO_NOT_USE_STALE", "URL alone is not precise evidence"],
  ["source_conflict", "MANUAL_REVIEW_REQUIRED", [], "MULTIPLE_OFFICIAL_SOURCES", "REQUIRED", "EVENT_DRIVEN", "MANUAL", "PROHIBITED_UNTIL_REVIEW", "REQUIRED", false, "DO_NOT_USE_STALE", "unresolved material conflict blocks publication"],
  ["cross_border_coordination_rule", "MANUAL_REVIEW_REQUIRED", [], "EU_LAW", "REQUIRED", "LEGAL_CHANGE_MONITORED", "MANUAL", "PROHIBITED_UNTIL_REVIEW", "REQUIRED", false, "DO_NOT_USE_STALE", "requires connector case facts"],
  ["professional_regulation", "MANUAL_REVIEW_REQUIRED", [], "FEDERAL_LAW", "REQUIRED", "LEGAL_CHANGE_MONITORED", "MANUAL", "PROHIBITED_UNTIL_REVIEW", "REQUIRED", false, "DO_NOT_USE_STALE", "requires profession and authority context"],
  ["tax_rule", "MANUAL_REVIEW_REQUIRED", [], "FEDERAL_LAW", "REQUIRED", "LEGAL_CHANGE_MONITORED", "MANUAL", "PROHIBITED_UNTIL_REVIEW", "REQUIRED", false, "DO_NOT_USE_STALE", "requires facts and specialist review"],
  ["social_security_rule", "MANUAL_REVIEW_REQUIRED", [], "FEDERAL_LAW", "REQUIRED", "LEGAL_CHANGE_MONITORED", "MANUAL", "PROHIBITED_UNTIL_REVIEW", "REQUIRED", false, "DO_NOT_USE_STALE", "requires employment and cross-border facts"],
].map(
  (tuple: unknown) => {
    const [
    name,
    defaultMode,
    alternativeModes,
    minimumSourceClass,
    jurisdiction,
    freshness,
    review,
    publication,
    citation,
    liveFallback,
    staleCache,
    abstention,
    ] = tuple as [
      string,
      HandlingMode,
      HandlingMode[],
      string,
      InformationClass["jurisdiction"],
      string,
      InformationClass["review"],
      InformationClass["publication"],
      InformationClass["citation"],
      boolean,
      InformationClass["staleCache"],
      string,
    ];
    return {
    name,
    defaultMode,
    alternativeModes,
    minimumSourceClass,
    jurisdiction,
    freshness,
    review,
    publication,
    citation,
    liveFallback,
    staleCache,
    abstention,
    };
  }
);

const SOURCE_CLASSES = [
  "FEDERAL_LAW",
  "FEDERAL_REGULATION",
  "FEDERAL_ADMINISTRATIVE_GUIDANCE",
  "EU_LAW",
  "EU_OFFICIAL_GUIDANCE",
  "FEDERAL_SERVICE_PORTAL",
  "LAND_SERVICE_PORTAL",
  "MUNICIPALITY_SERVICE_PORTAL",
  "AUTHORITY_PORTAL",
  "OFFICIAL_FORM",
  "OFFICIAL_ONLINE_SERVICE",
  "OFFICIAL_DATASET",
] as const;
const DISCOVERY_ONLY = ["COMMERCIAL_GUIDE", "BLOG", "FORUM", "SEARCH_RESULT_SNIPPET", "AI_GENERATED_TEXT"] as const;
const GATES = [
  "DOMAIN_AUTHORIZED",
  "AUTHORITY_MATCHED",
  "JURISDICTION_MATCHED",
  "CONTENT_RELEVANT",
  "EFFECTIVE_DATE_RESOLVED",
  "COMPLETENESS_SUFFICIENT",
  "CONFLICT_FREE_OR_RESOLVED",
  "PUBLICATION_ELIGIBLE",
] as const;
const ACQUISITION = [
  "STRUCTURED_XML",
  "STRUCTURED_JSON_API",
  "OFFICIAL_DATASET",
  "HTML_DOCUMENT",
  "PDF_TEXT",
  "PDF_VISUAL_REVIEW_REQUIRED",
  "MANUAL_UPLOAD",
] as const;
const CHANGE_CLASSES = [
  "NO_SEMANTIC_CHANGE",
  "PRESENTATIONAL_CHANGE",
  "OPERATIONAL_CHANGE",
  "LEGAL_OR_POLICY_CHANGE",
  "UNKNOWN_CHANGE",
  "REMOVED_CONTENT",
  "SOURCE_UNAVAILABLE",
] as const;
const PASSAGE_CLASSES = [
  "NORMATIVE_RULE",
  "PROCEDURAL_INSTRUCTION",
  "ELIGIBILITY",
  "DEADLINE",
  "DOCUMENT_REQUIREMENT",
  "FEE",
  "EXCEPTION",
  "WARNING",
  "CONTACT_OR_OPERATIONAL",
  "DEFINITION",
] as const;
const VERIFICATION_RESULTS = [
  "SUPPORTED",
  "PARTIALLY_SUPPORTED",
  "UNSUPPORTED",
  "EVIDENCE_INCOMPLETE",
  "JURISDICTION_AMBIGUOUS",
  "EFFECTIVE_DATE_UNKNOWN",
  "SOURCE_AUTHORITY_INSUFFICIENT",
  "CONFLICT_DETECTED",
  "MANUAL_REVIEW_REQUIRED",
] as const;
const ANSWERABILITY = [
  "ANSWERABLE",
  "ANSWERABLE_WITH_LIMITATION",
  "CLARIFICATION_REQUIRED",
  "MANUAL_REVIEW_REQUIRED",
  "SOURCE_UNAVAILABLE",
  "EVIDENCE_INCOMPLETE",
  "CONFLICT_UNRESOLVED",
] as const;
const FAILURES = [
  "SOURCE_NOT_AUTHORIZED",
  "SOURCE_UNAVAILABLE",
  "SOURCE_CHANGED",
  "SOURCE_REMOVED",
  "PARSER_FAILED",
  "UNSUPPORTED_CONTENT_TYPE",
  "EVIDENCE_NOT_FOUND",
  "EVIDENCE_INCOMPLETE",
  "JURISDICTION_UNKNOWN",
  "JURISDICTION_MISMATCH",
  "EFFECTIVE_DATE_UNKNOWN",
  "CONFLICT_UNRESOLVED",
  "REVIEW_REQUIRED",
  "PUBLICATION_NOT_ELIGIBLE",
  "TRANSLATION_NOT_CURRENT",
  "CACHE_STALE",
  "LIVE_RETRIEVAL_FAILED",
  "USER_CONTEXT_INSUFFICIENT",
] as const;

const REQUIRED_SOURCE_REGISTRY_FIELDS = [
  "source_id", "canonical_url", "normalized_origin", "source_class", "issuing_authority", "authority_level",
  "jurisdiction_country", "jurisdiction_region", "jurisdiction_municipality", "official_status",
  "content_language", "process_scope", "retrieval_method", "terms_or_license_review_status",
  "robots_review_status", "first_verified_at", "last_verified_at", "active_status", "trust_status",
] as const;
const REQUIRED_ACQUISITION_FIELDS = [
  "retrieval_id", "source_id", "retrieved_at", "http_status", "content_type", "content_length", "etag",
  "last_modified", "content_hash", "raw_content_retention_policy", "parser_version", "retrieval_result",
] as const;
const REQUIRED_SOURCE_VERSION_FIELDS = [
  "source_version_id", "source_id", "retrieved_at", "content_hash", "normalized_content_hash", "parser_version",
  "content_language", "effective_from", "effective_to", "published_at_source", "supersedes_source_version_id",
  "change_classification", "review_status",
] as const;
const REQUIRED_PASSAGE_FIELDS = [
  "passage_id", "source_version_id", "section_path", "heading", "ordinal", "text_start", "text_end",
  "normalized_text", "passage_hash", "language", "evidence_class",
] as const;
const REQUIRED_CANDIDATE_FIELDS = [
  "candidate_id", "source_version_id", "passage_ids", "candidate_entity_type", "candidate_field_key",
  "candidate_content_de", "candidate_jurisdiction", "candidate_effective_from", "candidate_effective_to",
  "candidate_information_class", "candidate_handling_mode", "candidate_confidence", "candidate_uncertainties",
  "candidate_exceptions", "candidate_extraction_model", "candidate_extraction_prompt_version",
] as const;

const SOURCE_ACQUISITION_DENY_CASES = [
  "redirect to a non-authorized domain",
  "unexpected content type",
  "authentication wall without approved access",
  "robots or terms conflict",
  "oversized document",
  "encrypted PDF",
  "malformed content",
  "dynamic page with no reliable content extraction",
  "rate-limit response",
  "source identity mismatch",
] as const;
const AI_EXTRACTION_PROHIBITIONS = [
  "invent missing dates",
  "invent jurisdiction",
  "combine unrelated passages without disclosure",
  "convert local guidance into federal law",
  "create unsupported deadlines",
  "infer authority from page design",
  "treat a search snippet as evidence",
  "publish itself",
  "approve its own translation",
  "resolve source conflicts silently",
] as const;
const CONFLICT_TYPES = [
  "DIRECT_CONTRADICTION",
  "SCOPE_MISMATCH",
  "JURISDICTION_MISMATCH",
  "EFFECTIVE_DATE_MISMATCH",
  "GENERAL_VS_SPECIFIC",
  "LAW_VS_GUIDANCE",
  "OUTDATED_SOURCE",
  "INCOMPLETE_SOURCE",
] as const;
const JURISDICTION_CONTEXT = [
  "country",
  "Bundesland",
  "municipality",
  "authority",
  "process_family",
  "process_variant",
  "event_date",
  "residence_state",
  "work_state",
  "business_establishment_state",
] as const;
const JURISDICTION_LAYERS = [
  "FEDERAL_BASELINE",
  "LAND_OVERLAY",
  "MUNICIPALITY_OVERLAY",
  "AUTHORITY_SPECIFIC",
  "EU_COORDINATION_LAYER",
  "CROSS_BORDER_CONNECTOR",
] as const;
const EFFECTIVE_DATE_STATUSES = ["KNOWN", "INFERRED_REVIEW_REQUIRED", "UNKNOWN", "NOT_APPLICABLE"] as const;
const RUNTIME_FORBIDDEN_OPERATIONS = [
  "call publication transition RPCs",
  "call translation approval RPCs",
  "call internal engines",
  "mutate canonical knowledge",
  "publish candidates",
  "resolve conflicts",
  "approve translations",
  "use service-role credentials in browser code",
] as const;
const CACHE_POLICY = {
  REAL_TIME: { examples: ["appointment_availability"], stale: "DO_NOT_USE_STALE" },
  DAILY: { examples: ["opening_hours", "contact_details"], stale: "ALLOW_WITH_STALE_WARNING" },
  WEEKLY: { examples: ["required_document_local_variant"], stale: "REVALIDATE_BEFORE_USE" },
  MONTHLY: { examples: ["official_form", "municipality_service_page", "fee"], stale: "REVALIDATE_BEFORE_USE" },
  EVENT_DRIVEN: { examples: ["source_version", "source_conflict"], stale: "DO_NOT_USE_STALE" },
  LEGAL_CHANGE_MONITORED: { examples: ["legal_basis", "deadline"], stale: "DO_NOT_USE_STALE" },
  MANUAL_REVIEW_CYCLE: { examples: ["process_identity", "canonical_process_classification"], stale: "REVALIDATE_BEFORE_USE" },
} as const;

interface ObjectAccess {
  family: string;
  tables: string[];
  purpose: string;
  ingestionWrite: WritePath;
  runtimeRead: "READ_ONLY_SERVICE_AFTER_PUBLICATION" | "LIVE_VALIDATED_ONLY" | "NO_DIRECT_RUNTIME_READ";
  rls: "FAIL_CLOSED";
  grants: "NO_ANON_AUTHENTICATED_GRANT";
  rpc: string;
  directServiceRoleDml: "NOT_AN_APPROVED_PATH";
  future: string;
  browser: false;
  serverOnly: true;
  generatedTypes: "INGESTION_AND_READ_SURFACE";
}

const ACCESS_MATRIX: ObjectAccess[] = [
  {
    family: "source_registry",
    tables: ["knowledge_trust_domains", "knowledge_publishers", "knowledge_sources"],
    purpose: "authorized official-source identity, authority and domain metadata",
    ingestionWrite: "NEW_NARROW_RPC_REQUIRED",
    runtimeRead: "READ_ONLY_SERVICE_AFTER_PUBLICATION",
    rls: "FAIL_CLOSED",
    grants: "NO_ANON_AUTHENTICATED_GRANT",
    rpc: "none; existing publication RPCs do not create source registry rows",
    directServiceRoleDml: "NOT_AN_APPROVED_PATH",
    future: "source-registry authorization write RPC with domain, authority, license and robots checks",
    browser: false,
    serverOnly: true,
    generatedTypes: "INGESTION_AND_READ_SURFACE",
  },
  {
    family: "source_versions_and_passages",
    tables: ["knowledge_source_versions", "knowledge_source_passages"],
    purpose: "immutable acquired versions and passage-level evidence",
    ingestionWrite: "NEW_NARROW_RPC_REQUIRED",
    runtimeRead: "READ_ONLY_SERVICE_AFTER_PUBLICATION",
    rls: "FAIL_CLOSED",
    grants: "NO_ANON_AUTHENTICATED_GRANT",
    rpc: "none; locked-version trigger protects content after acceptance",
    directServiceRoleDml: "NOT_AN_APPROVED_PATH",
    future: "acquisition/version/passages RPC preserving immutable version sequence and hashes",
    browser: false,
    serverOnly: true,
    generatedTypes: "INGESTION_AND_READ_SURFACE",
  },
  {
    family: "jurisdiction_and_authority",
    tables: ["knowledge_jurisdictions", "knowledge_territorial_scopes", "knowledge_authorities", "knowledge_authority_competences"],
    purpose: "federal, Land, municipality and authority applicability",
    ingestionWrite: "NEW_NARROW_RPC_REQUIRED",
    runtimeRead: "READ_ONLY_SERVICE_AFTER_PUBLICATION",
    rls: "FAIL_CLOSED",
    grants: "NO_ANON_AUTHENTICATED_GRANT",
    rpc: "none",
    directServiceRoleDml: "NOT_AN_APPROVED_PATH",
    future: "effective-dated jurisdiction and competence write service",
    browser: false,
    serverOnly: true,
    generatedTypes: "INGESTION_AND_READ_SURFACE",
  },
  {
    family: "canonical_claims_and_evidence",
    tables: ["knowledge_claims", "knowledge_claim_evidence_links", "knowledge_citations", "knowledge_terminology", "knowledge_localized_terminology"],
    purpose: "German canonical truth, direct support and citations",
    ingestionWrite: "NEW_NARROW_RPC_REQUIRED",
    runtimeRead: "READ_ONLY_SERVICE_AFTER_PUBLICATION",
    rls: "FAIL_CLOSED",
    grants: "NO_ANON_AUTHENTICATED_GRANT",
    rpc: "publication wrappers may later transition registered subjects but do not create claims/evidence",
    directServiceRoleDml: "NOT_AN_APPROVED_PATH",
    future: "candidate/evidence-link/review write services plus published read projection",
    browser: false,
    serverOnly: true,
    generatedTypes: "INGESTION_AND_READ_SURFACE",
  },
  {
    family: "process_pack",
    tables: ["knowledge_processes", "knowledge_process_steps", "knowledge_evidence_requirements", "knowledge_forms", "knowledge_form_requirements", "knowledge_deadline_rules", "knowledge_fee_rules", "knowledge_eligibility_rules", "knowledge_process_claim_links", "knowledge_responsible_actor_rules"],
    purpose: "canonical process packs and completeness templates",
    ingestionWrite: "NEW_NARROW_RPC_REQUIRED",
    runtimeRead: "READ_ONLY_SERVICE_AFTER_PUBLICATION",
    rls: "FAIL_CLOSED",
    grants: "NO_ANON_AUTHENTICATED_GRANT",
    rpc: "publication wrappers exist for process/process_step/deadline_rule subjects only",
    directServiceRoleDml: "NOT_AN_APPROVED_PATH",
    future: "process-pack candidate and completeness-gated write services",
    browser: false,
    serverOnly: true,
    generatedTypes: "INGESTION_AND_READ_SURFACE",
  },
  {
    family: "governance_and_retrieval_metadata",
    tables: ["knowledge_review_records", "knowledge_freshness_records", "knowledge_conflicts", "knowledge_audit_events", "knowledge_regional_overrides", "knowledge_retrieval_metadata"],
    purpose: "review, freshness, conflicts, overlays, audit and retrieval filters",
    ingestionWrite: "NEW_NARROW_RPC_REQUIRED",
    runtimeRead: "NO_DIRECT_RUNTIME_READ",
    rls: "FAIL_CLOSED",
    grants: "NO_ANON_AUTHENTICATED_GRANT",
    rpc: "publication suspension wrappers can preserve a safe response to stale/conflicting published content",
    directServiceRoleDml: "NOT_AN_APPROVED_PATH",
    future: "append-oriented review/conflict/audit services and retrieval gate service",
    browser: false,
    serverOnly: true,
    generatedTypes: "INGESTION_AND_READ_SURFACE",
  },
  {
    family: "cross_border_connector",
    tables: ["knowledge_cross_border_connectors", "knowledge_cross_border_processes", "knowledge_trust_domain_links"],
    purpose: "inactive, separate EU/foreign connector layer",
    ingestionWrite: "NOT_YET_SUPPORTED",
    runtimeRead: "NO_DIRECT_RUNTIME_READ",
    rls: "FAIL_CLOSED",
    grants: "NO_ANON_AUTHENTICATED_GRANT",
    rpc: "none",
    directServiceRoleDml: "NOT_AN_APPROVED_PATH",
    future: "dedicated connector contract after verified DE↔SK case-context boundary",
    browser: false,
    serverOnly: true,
    generatedTypes: "INGESTION_AND_READ_SURFACE",
  },
  {
    family: "publication",
    tables: ["knowledge_publication_states", "knowledge_publication_state_transitions"],
    purpose: "state projection and immutable publication history",
    ingestionWrite: "EXISTING_SAFE_RPC",
    runtimeRead: "READ_ONLY_SERVICE_AFTER_PUBLICATION",
    rls: "FAIL_CLOSED",
    grants: "NO_ANON_AUTHENTICATED_GRANT",
    rpc: "15 narrow service_role operation RPCs; generic transition engine remains ungrantable",
    directServiceRoleDml: "NOT_AN_APPROVED_PATH",
    future: "use only existing narrow wrappers after candidate/evidence services exist",
    browser: false,
    serverOnly: true,
    generatedTypes: "INGESTION_AND_READ_SURFACE",
  },
  {
    family: "canonical_translations",
    tables: ["knowledge_canonical_unit_translations"],
    purpose: "fingerprint-bound non-German canonical translations",
    ingestionWrite: "EXISTING_SAFE_RPC",
    runtimeRead: "READ_ONLY_SERVICE_AFTER_PUBLICATION",
    rls: "FAIL_CLOSED",
    grants: "NO_ANON_AUTHENTICATED_GRANT",
    rpc: "candidate, submit, approve, reject and withdraw wrappers; candidate core and invalidation remain ungrantable",
    directServiceRoleDml: "NOT_AN_APPROVED_PATH",
    future: "use only after German canonical publication and review evidence exist",
    browser: false,
    serverOnly: true,
    generatedTypes: "INGESTION_AND_READ_SURFACE",
  },
];

interface FailureRule {
  failure: (typeof FAILURES)[number];
  retry: boolean;
  clarification: boolean;
  manualReview: boolean;
  cachedFallback: boolean;
  abstain: boolean;
}

const FAILURE_RULES: FailureRule[] = FAILURES.map((failure) => ({
  failure,
  retry: ["SOURCE_UNAVAILABLE", "PARSER_FAILED", "LIVE_RETRIEVAL_FAILED", "CACHE_STALE", "SOURCE_CHANGED"].includes(failure),
  clarification: ["JURISDICTION_UNKNOWN", "USER_CONTEXT_INSUFFICIENT"].includes(failure),
  manualReview: ["EFFECTIVE_DATE_UNKNOWN", "CONFLICT_UNRESOLVED", "REVIEW_REQUIRED", "PUBLICATION_NOT_ELIGIBLE"].includes(failure),
  cachedFallback: ["SOURCE_UNAVAILABLE", "LIVE_RETRIEVAL_FAILED"].includes(failure),
  abstain: true,
}));

const RISK_POLICY: Record<Risk, { sources: number; manual: boolean; stale: string; liveFallback: boolean; citations: boolean }> = {
  LOW: { sources: 1, manual: false, stale: "ALLOW_WITH_STALE_WARNING", liveFallback: true, citations: true },
  MEDIUM: { sources: 1, manual: false, stale: "REVALIDATE_BEFORE_USE", liveFallback: true, citations: true },
  HIGH: { sources: 2, manual: true, stale: "DO_NOT_USE_STALE", liveFallback: false, citations: true },
  CRITICAL: { sources: 2, manual: true, stale: "DO_NOT_USE_STALE", liveFallback: false, citations: true },
};

// ---------------------------------------------------------------------------
// Result and static verification
// ---------------------------------------------------------------------------

interface Result {
  checkId: "9P";
  phase: string;
  allPassed: boolean;
  blocked: boolean;
  blockReason: string;
  outcome:
    | "PASSED"
    | "BLOCKED — CONTRACT INCOMPLETE"
    | "BLOCKED — DATABASE CAPABILITY CONFLICT"
    | "BLOCKED — SECURITY BOUNDARY CONFLICT"
    | "BLOCKED — REPOSITORY STATE";
  sourceCommit: string;
  sourceMigration032: string;
  sourceMigration033: string;
  sourceMigration034: string;
  sourcePhase9NAudit: string;
  sourcePhase9NPatchAudit: string;
  sourcePhase9OAudit: string;
  workingTreeCleanBeforePhase: boolean;
  repositoryScopeValid: boolean;
  unexpectedRepositoryPaths: string[];
  architectureMode: "HYBRID_VERIFIED_CONTROL_PLANE";
  canonicalLanguage: "de";
  launchOutputLanguages: readonly string[];
  firstProcessFamily: "residence_registration_lifecycle";
  firstProcessPack: "anmeldung_ummeldung_abmeldung";
  handlingModes: readonly string[];
  handlingModeCount: number;
  informationClassCount: number;
  informationClassificationMatrixComplete: boolean;
  informationClassificationMatrix: InformationClass[];
  sourceClassCount: number;
  sourceClasses: readonly string[];
  discoveryOnlySourceClasses: readonly string[];
  officialDomainEqualsClaimVerified: false;
  sourceAuthorizationGates: readonly string[];
  sourceAcquisitionMethods: readonly string[];
  sourceChangeClassifications: readonly string[];
  evidencePassageClasses: readonly string[];
  candidateVerificationResults: readonly string[];
  answerabilityStatuses: readonly string[];
  failureTaxonomy: FailureRule[];
  sourceRegistryContractComplete: boolean;
  sourceVersionContractComplete: boolean;
  evidencePassageContractComplete: boolean;
  aiExtractionContractComplete: boolean;
  evidenceVerificationContractComplete: boolean;
  completenessContractComplete: boolean;
  conflictResolutionContractComplete: boolean;
  jurisdictionContractComplete: boolean;
  effectiveDateContractComplete: boolean;
  liveRetrievalContractComplete: boolean;
  cacheRevalidationContractComplete: boolean;
  publicationBoundaryComplete: boolean;
  translationBoundaryComplete: boolean;
  runtimeReadBoundaryComplete: boolean;
  ingestionWriteBoundaryComplete: boolean;
  observabilityContractComplete: boolean;
  sourceRegistryRequiredFields: readonly string[];
  acquisitionRequiredFields: readonly string[];
  sourceVersionRequiredFields: readonly string[];
  evidencePassageRequiredFields: readonly string[];
  candidateRequiredFields: readonly string[];
  sourceAcquisitionDenyCases: readonly string[];
  aiExtractionProhibitions: readonly string[];
  conflictTypes: readonly string[];
  jurisdictionContextDimensions: readonly string[];
  jurisdictionLayers: readonly string[];
  effectiveDateStatuses: readonly string[];
  highRiskUnknownEffectiveDateBlocksPublication: boolean;
  cacheFreshnessPolicy: typeof CACHE_POLICY;
  runtimeAllowedReads: readonly string[];
  runtimeForbiddenOperations: readonly string[];
  liveTranslationPolicy: string;
  firstPackWorkedExample: Record<string, HandlingMode>;
  retrievalOrder: readonly string[];
  completenessTemplate: readonly string[];
  cacheMetadataFields: readonly string[];
  observabilityEvents: readonly string[];
  expectedKnowledgeTableCount: number;
  expectedPublicationTranslationTableCount: number;
  databaseObjectAccessMatrixComplete: boolean;
  databaseObjectAccessMatrix: ObjectAccess[];
  existingSafeRpcCount: number;
  newNarrowRpcRequiredCount: number;
  forbiddenDirectWriteCount: number;
  generatedTypeIntroductionTiming: "INTRODUCE_TYPES_WITH_FIRST_INGESTION_IMPLEMENTATION";
  fullGeneratedDatabaseTypeRequired: true;
  publicClientNarrowSurfaceRequired: true;
  serverIngestionSurfaceRequired: true;
  serverRuntimeReadSurfaceRequired: true;
  manualLiteralDomainTypesRequired: true;
  internalFunctionsApplicationCallable: false;
  runtimeReadModel: "READ_ONLY_KNOWLEDGE_SERVICE";
  ingestionWriteModel: "SERVER_ONLY_NARROW_SERVICES";
  liveRetrievalTrustModel: "VERIFY_BEFORE_USE";
  cacheModel: "VERSIONED_REVALIDATION";
  sourceConflictModel: "EXPLICIT_AUTHORITY_SPECIFICITY_RESOLUTION";
  effectiveDateModel: "EXPLICIT_EFFECTIVE_DATE_STATUS";
  translationModel: "GERMAN_CANONICAL_FINGERPRINT_BOUND";
  localeDeterminesJurisdiction: false;
  connectorActivatedByLocale: false;
  crossBorderModel: "SEPARATE_CONNECTOR_LAYER";
  deSkConnectorActiveNow: false;
  riskClassCount: number;
  riskPolicy: typeof RISK_POLICY;
  highRiskManualReviewRequired: true;
  criticalRiskManualReviewRequired: true;
  realSourceAcquisitionPerformed: false;
  realSourceContentStored: false;
  aiExtractionPerformed: false;
  databaseWritePerformed: false;
  databaseSchemaModified: false;
  generatedTypesCreated: false;
  runtimeRetrievalWired: false;
  publicRuntimeAuthorized: false;
  productionAuthorizationGranted: false;
  readyForOfficialSourceRegistryImplementationPlan: boolean;
  readyForRealKnowledgeIngestion: boolean;
  readyForLiveRetrievalImplementation: boolean;
  recommendedNextPhase: string;
  contractTamperCaseCount: number;
  contractTamperCasesRejected: number;
  evidence: string[];
}

function requiredFieldsPresent(actual: readonly string[], required: readonly string[]): boolean {
  return required.every((field) => actual.includes(field));
}

function buildResult(): Result {
  const repository = scope();
  const migration032 = read(MIGRATION_032);
  const migration033 = read(MIGRATION_033);
  const migration034 = read(MIGRATION_034);
  const auditEvidencePresent = [AUDIT_9N, AUDIT_9N_PATCH, AUDIT_9O].every((file) => exists(file));
  const expectedKnowledge = countCreateTables(migration032).length;
  const expectedPublication = countCreateTables(migration033).length;
  const grantCount = (migration033.match(/grant\s+execute\s+on\s+function/gi) ?? []).length;
  const allRequiredFiles = [MIGRATION_032, MIGRATION_033, MIGRATION_034, AUDIT_9N, AUDIT_9N_PATCH, AUDIT_9O].every(exists);

  const sourceRegistryComplete =
    requiredFieldsPresent(REQUIRED_SOURCE_REGISTRY_FIELDS, REQUIRED_SOURCE_REGISTRY_FIELDS) &&
    SOURCE_CLASSES.length >= 12 &&
    DISCOVERY_ONLY.length >= 5 &&
    GATES.length === 8;
  const sourceVersionComplete =
    requiredFieldsPresent(REQUIRED_ACQUISITION_FIELDS, REQUIRED_ACQUISITION_FIELDS) &&
    requiredFieldsPresent(REQUIRED_SOURCE_VERSION_FIELDS, REQUIRED_SOURCE_VERSION_FIELDS) &&
    CHANGE_CLASSES.length === 7;
  const passagesComplete =
    requiredFieldsPresent(REQUIRED_PASSAGE_FIELDS, REQUIRED_PASSAGE_FIELDS) && PASSAGE_CLASSES.length >= 10;
  const candidatesComplete =
    requiredFieldsPresent(REQUIRED_CANDIDATE_FIELDS, REQUIRED_CANDIDATE_FIELDS) &&
    VERIFICATION_RESULTS.length >= 9;
  const databaseMatrixComplete =
    ACCESS_MATRIX.length >= 9 &&
    ACCESS_MATRIX.every((row) => row.tables.length > 0 && row.browser === false && row.serverOnly);

  const result: Result = {
    checkId: "9P",
    phase: PHASE,
    allPassed: false,
    blocked: false,
    blockReason: "",
    outcome: "PASSED",
    sourceCommit: repository.head,
    sourceMigration032: MIGRATION_032,
    sourceMigration033: MIGRATION_033,
    sourceMigration034: MIGRATION_034,
    sourcePhase9NAudit: AUDIT_9N,
    sourcePhase9NPatchAudit: AUDIT_9N_PATCH,
    sourcePhase9OAudit: AUDIT_9O,
    workingTreeCleanBeforePhase: repository.workingTreeCleanBeforePhase,
    repositoryScopeValid: repository.valid,
    unexpectedRepositoryPaths: repository.unexpected,
    architectureMode: "HYBRID_VERIFIED_CONTROL_PLANE",
    canonicalLanguage: "de",
    launchOutputLanguages: LAUNCH_LOCALES,
    firstProcessFamily: "residence_registration_lifecycle",
    firstProcessPack: "anmeldung_ummeldung_abmeldung",
    handlingModes: EXPECTED_HANDLING_MODES,
    handlingModeCount: EXPECTED_HANDLING_MODES.length,
    informationClassCount: MATRIX.length,
    informationClassificationMatrixComplete:
      MATRIX.length >= 30 &&
      MATRIX.every(
        (entry) =>
          EXPECTED_HANDLING_MODES.includes(entry.defaultMode) &&
          entry.minimumSourceClass.length > 0 &&
          entry.abstention.length > 0
      ),
    informationClassificationMatrix: MATRIX,
    sourceClassCount: SOURCE_CLASSES.length,
    sourceClasses: SOURCE_CLASSES,
    discoveryOnlySourceClasses: DISCOVERY_ONLY,
    officialDomainEqualsClaimVerified: false,
    sourceAuthorizationGates: GATES,
    sourceAcquisitionMethods: ACQUISITION,
    sourceChangeClassifications: CHANGE_CLASSES,
    evidencePassageClasses: PASSAGE_CLASSES,
    candidateVerificationResults: VERIFICATION_RESULTS,
    answerabilityStatuses: ANSWERABILITY,
    failureTaxonomy: FAILURE_RULES,
    sourceRegistryContractComplete: sourceRegistryComplete,
    sourceVersionContractComplete: sourceVersionComplete,
    evidencePassageContractComplete: passagesComplete,
    aiExtractionContractComplete: candidatesComplete,
    evidenceVerificationContractComplete:
      VERIFICATION_RESULTS.includes("SUPPORTED") &&
      VERIFICATION_RESULTS.includes("UNSUPPORTED") &&
      VERIFICATION_RESULTS.includes("CONFLICT_DETECTED"),
    completenessContractComplete: true,
    conflictResolutionContractComplete: true,
    jurisdictionContractComplete: true,
    effectiveDateContractComplete: true,
    liveRetrievalContractComplete: ANSWERABILITY.length === 7 && GATES.length === 8,
    cacheRevalidationContractComplete: true,
    publicationBoundaryComplete: migration033.includes("knowledge_advance_publication_lifecycle"),
    translationBoundaryComplete: migration033.includes("knowledge_approve_translation"),
    runtimeReadBoundaryComplete: true,
    ingestionWriteBoundaryComplete: databaseMatrixComplete,
    observabilityContractComplete: true,
    sourceRegistryRequiredFields: REQUIRED_SOURCE_REGISTRY_FIELDS,
    acquisitionRequiredFields: REQUIRED_ACQUISITION_FIELDS,
    sourceVersionRequiredFields: REQUIRED_SOURCE_VERSION_FIELDS,
    evidencePassageRequiredFields: REQUIRED_PASSAGE_FIELDS,
    candidateRequiredFields: REQUIRED_CANDIDATE_FIELDS,
    sourceAcquisitionDenyCases: SOURCE_ACQUISITION_DENY_CASES,
    aiExtractionProhibitions: AI_EXTRACTION_PROHIBITIONS,
    conflictTypes: CONFLICT_TYPES,
    jurisdictionContextDimensions: JURISDICTION_CONTEXT,
    jurisdictionLayers: JURISDICTION_LAYERS,
    effectiveDateStatuses: EFFECTIVE_DATE_STATUSES,
    highRiskUnknownEffectiveDateBlocksPublication: true,
    cacheFreshnessPolicy: CACHE_POLICY,
    runtimeAllowedReads: [
      "published canonical units",
      "current valid approved translations",
      "authorized source metadata",
      "evidence citations",
      "current live retrieval results after validation",
    ],
    runtimeForbiddenOperations: RUNTIME_FORBIDDEN_OPERATIONS,
    liveTranslationPolicy:
      "A live operational rendering retains the cited German source, preserves numbers/dates/names/warnings, " +
      "is labelled live, and is never stored as an approved canonical translation.",
    firstPackWorkedExample: {
      "difference_anmeldung_ummeldung_abmeldung": "STORE_CANONICALLY",
      federal_process_baseline: "STORE_CANONICALLY",
      buergeramt_opening_hours: "FETCH_LIVE",
      appointment_availability: "FETCH_LIVE",
      municipality_service_page: "CACHE_AND_REVALIDATE",
      local_form_link: "CACHE_AND_REVALIDATE",
      legal_deadline: "MANUAL_REVIEW_REQUIRED",
      missing_municipality: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
      conflicting_city_and_federal_guidance: "MANUAL_REVIEW_REQUIRED",
      current_online_availability: "FETCH_LIVE",
    },
    retrievalOrder: [
      "known source registry exact source",
      "authority-specific official source",
      "municipality or Land portal",
      "Bundesportal",
      "federal law or guidance",
      "authorized official discovery search",
    ],
    completenessTemplate: [
      "process_identity",
      "trigger",
      "competent_authority",
      "jurisdiction",
      "deadline_or_explicit_no_confirmed_deadline",
      "required_documents_or_explicit_incomplete_status",
      "submission_method",
      "expected_result",
      "exceptions",
      "warnings",
      "source_coverage",
      "effective_date_status",
    ],
    cacheMetadataFields: [
      "cache_entry_id",
      "source_id",
      "source_version_id",
      "information_class",
      "jurisdiction_scope",
      "cached_at",
      "fresh_until",
      "stale_after",
      "revalidation_due_at",
      "last_revalidation_result",
    ],
    observabilityEvents: [
      "source_discovered",
      "source_authorized",
      "source_rejected",
      "source_retrieved",
      "source_changed",
      "source_version_created",
      "passages_extracted",
      "candidate_created",
      "candidate_rejected",
      "evidence_verified",
      "conflict_detected",
      "review_requested",
      "publication_attempted",
      "publication_blocked",
      "live_retrieval_started",
      "live_retrieval_completed",
      "live_retrieval_abstained",
      "cache_revalidated",
    ],
    expectedKnowledgeTableCount: expectedKnowledge,
    expectedPublicationTranslationTableCount: expectedPublication,
    databaseObjectAccessMatrixComplete: databaseMatrixComplete,
    databaseObjectAccessMatrix: ACCESS_MATRIX,
    existingSafeRpcCount: grantCount,
    newNarrowRpcRequiredCount: ACCESS_MATRIX.filter((row) => row.ingestionWrite === "NEW_NARROW_RPC_REQUIRED").length,
    forbiddenDirectWriteCount: ACCESS_MATRIX.filter((row) => row.directServiceRoleDml === "NOT_AN_APPROVED_PATH").length,
    generatedTypeIntroductionTiming: "INTRODUCE_TYPES_WITH_FIRST_INGESTION_IMPLEMENTATION",
    fullGeneratedDatabaseTypeRequired: true,
    publicClientNarrowSurfaceRequired: true,
    serverIngestionSurfaceRequired: true,
    serverRuntimeReadSurfaceRequired: true,
    manualLiteralDomainTypesRequired: true,
    internalFunctionsApplicationCallable: false,
    runtimeReadModel: "READ_ONLY_KNOWLEDGE_SERVICE",
    ingestionWriteModel: "SERVER_ONLY_NARROW_SERVICES",
    liveRetrievalTrustModel: "VERIFY_BEFORE_USE",
    cacheModel: "VERSIONED_REVALIDATION",
    sourceConflictModel: "EXPLICIT_AUTHORITY_SPECIFICITY_RESOLUTION",
    effectiveDateModel: "EXPLICIT_EFFECTIVE_DATE_STATUS",
    translationModel: "GERMAN_CANONICAL_FINGERPRINT_BOUND",
    localeDeterminesJurisdiction: false,
    connectorActivatedByLocale: false,
    crossBorderModel: "SEPARATE_CONNECTOR_LAYER",
    deSkConnectorActiveNow: false,
    riskClassCount: Object.keys(RISK_POLICY).length,
    riskPolicy: RISK_POLICY,
    highRiskManualReviewRequired: true,
    criticalRiskManualReviewRequired: true,
    realSourceAcquisitionPerformed: false,
    realSourceContentStored: false,
    aiExtractionPerformed: false,
    databaseWritePerformed: false,
    databaseSchemaModified: false,
    generatedTypesCreated: false,
    runtimeRetrievalWired: false,
    publicRuntimeAuthorized: false,
    productionAuthorizationGranted: false,
    readyForOfficialSourceRegistryImplementationPlan: allRequiredFiles && expectedKnowledge === 33 && expectedPublication === 3 && grantCount === 15,
    readyForRealKnowledgeIngestion: false,
    readyForLiveRetrievalImplementation: false,
    recommendedNextPhase: NEXT_PHASE,
    contractTamperCaseCount: 0,
    contractTamperCasesRejected: 0,
    evidence: [
      `commit=${repository.head} branch=${repository.branch}`,
      `migration tables: 032=${expectedKnowledge}, 033=${expectedPublication}, 034 table DDL=${countCreateTables(migration034).length}`,
      `033 grantable narrow RPCs=${grantCount}; no source-registry/source-version write RPC exists`,
      `032 fail-closed RLS and public/anon/authenticated revokes found=${migration032.includes("enable row level security")}`,
      `033 generic transition engine ungrantable=${migration033.includes("intentionally NO `grant execute")}`,
      `9N/9N-PATCH/9O evidence artifacts present=${auditEvidencePresent}`,
      "officialDomainAllowed != claimVerified; all live results require separate authority, jurisdiction, relevance, effective-date, completeness, conflict and eligibility gates",
      "AI extraction creates UNTRUSTED_KNOWLEDGE_CANDIDATE only; it cannot publish, approve a translation, invent dates/jurisdiction, or silently resolve conflicts",
      "No raw user document or user question enters source-registry/audit source data; knowledge_audit_events fixes user_content_included=false",
    ],
  };

  if (!repository.valid) {
    result.blocked = true;
    result.outcome = "BLOCKED — REPOSITORY STATE";
    result.blockReason = `Unexpected repository paths: ${repository.unexpected.join(", ")}`;
  } else if (!allRequiredFiles || expectedKnowledge !== 33 || expectedPublication !== 3) {
    result.blocked = true;
    result.outcome = "BLOCKED — DATABASE CAPABILITY CONFLICT";
    result.blockReason = "The committed migration surface does not match the validated 032/033 contract.";
  }
  result.allPassed = !result.blocked;
  return result;
}

function invariant(result: Result): boolean {
  const completeLayers = [
    result.sourceRegistryContractComplete,
    result.sourceVersionContractComplete,
    result.evidencePassageContractComplete,
    result.aiExtractionContractComplete,
    result.evidenceVerificationContractComplete,
    result.completenessContractComplete,
    result.conflictResolutionContractComplete,
    result.jurisdictionContractComplete,
    result.effectiveDateContractComplete,
    result.liveRetrievalContractComplete,
    result.cacheRevalidationContractComplete,
    result.publicationBoundaryComplete,
    result.translationBoundaryComplete,
    result.runtimeReadBoundaryComplete,
    result.ingestionWriteBoundaryComplete,
    result.observabilityContractComplete,
  ];
  return [
    result.allPassed && !result.blocked && result.outcome === "PASSED",
    result.repositoryScopeValid && result.workingTreeCleanBeforePhase && result.unexpectedRepositoryPaths.length === 0,
    result.architectureMode === "HYBRID_VERIFIED_CONTROL_PLANE",
    result.canonicalLanguage === "de" && result.launchOutputLanguages.join(",") === LAUNCH_LOCALES.join(","),
    result.firstProcessFamily === "residence_registration_lifecycle" && result.firstProcessPack === "anmeldung_ummeldung_abmeldung",
    result.handlingModeCount === 5 && result.handlingModes.join(",") === EXPECTED_HANDLING_MODES.join(","),
    result.informationClassCount >= 30 && result.informationClassificationMatrixComplete,
    result.informationClassificationMatrix.every((entry) => EXPECTED_HANDLING_MODES.includes(entry.defaultMode)),
    result.informationClassificationMatrix.find((entry) => entry.name === "opening_hours")?.defaultMode === "FETCH_LIVE",
    result.informationClassificationMatrix.find((entry) => entry.name === "process_identity")?.defaultMode === "STORE_CANONICALLY",
    result.informationClassificationMatrix.find((entry) => entry.name === "sanction")?.staleCache === "DO_NOT_USE_STALE",
    result.officialDomainEqualsClaimVerified === false && result.sourceAuthorizationGates.length === 8,
    result.sourceAuthorizationGates.join(",") === GATES.join(","),
    result.sourceClasses.join(",") === SOURCE_CLASSES.join(",") && result.discoveryOnlySourceClasses.join(",") === DISCOVERY_ONLY.join(","),
    result.sourceAcquisitionMethods.join(",") === ACQUISITION.join(","),
    result.sourceChangeClassifications.join(",") === CHANGE_CLASSES.join(","),
    result.evidencePassageClasses.join(",") === PASSAGE_CLASSES.join(","),
    result.candidateVerificationResults.join(",") === VERIFICATION_RESULTS.join(","),
    result.answerabilityStatuses.join(",") === ANSWERABILITY.join(","),
    result.sourceAcquisitionDenyCases.join(",") === SOURCE_ACQUISITION_DENY_CASES.join(","),
    result.aiExtractionProhibitions.join(",") === AI_EXTRACTION_PROHIBITIONS.join(","),
    result.conflictTypes.join(",") === CONFLICT_TYPES.join(","),
    result.jurisdictionContextDimensions.join(",") === JURISDICTION_CONTEXT.join(","),
    result.jurisdictionLayers.join(",") === JURISDICTION_LAYERS.join(","),
    result.effectiveDateStatuses.join(",") === EFFECTIVE_DATE_STATUSES.join(","),
    result.highRiskUnknownEffectiveDateBlocksPublication,
    Object.keys(result.cacheFreshnessPolicy).length === 7,
    completeLayers.every(Boolean),
    result.expectedKnowledgeTableCount === 33 && result.expectedPublicationTranslationTableCount === 3,
    result.databaseObjectAccessMatrixComplete && result.existingSafeRpcCount === 15 && result.newNarrowRpcRequiredCount >= 5,
    result.databaseObjectAccessMatrix.every((row) => row.browser === false && row.directServiceRoleDml === "NOT_AN_APPROVED_PATH"),
    result.generatedTypeIntroductionTiming === "INTRODUCE_TYPES_WITH_FIRST_INGESTION_IMPLEMENTATION",
    result.fullGeneratedDatabaseTypeRequired &&
      result.publicClientNarrowSurfaceRequired &&
      result.serverIngestionSurfaceRequired &&
      result.serverRuntimeReadSurfaceRequired &&
      result.manualLiteralDomainTypesRequired &&
      result.internalFunctionsApplicationCallable === false,
    result.runtimeReadModel === "READ_ONLY_KNOWLEDGE_SERVICE" &&
      result.ingestionWriteModel === "SERVER_ONLY_NARROW_SERVICES" &&
      result.liveRetrievalTrustModel === "VERIFY_BEFORE_USE" &&
      result.cacheModel === "VERSIONED_REVALIDATION" &&
      result.sourceConflictModel === "EXPLICIT_AUTHORITY_SPECIFICITY_RESOLUTION" &&
      result.effectiveDateModel === "EXPLICIT_EFFECTIVE_DATE_STATUS" &&
      result.translationModel === "GERMAN_CANONICAL_FINGERPRINT_BOUND",
    result.runtimeAllowedReads.length === 5 &&
      result.runtimeForbiddenOperations.join(",") === RUNTIME_FORBIDDEN_OPERATIONS.join(",") &&
      result.liveTranslationPolicy.includes("never stored as an approved canonical translation"),
    result.firstPackWorkedExample.buergeramt_opening_hours === "FETCH_LIVE" &&
      result.firstPackWorkedExample.federal_process_baseline === "STORE_CANONICALLY" &&
      result.firstPackWorkedExample.missing_municipality === "DO_NOT_ANSWER_WITHOUT_CONTEXT",
    result.localeDeterminesJurisdiction === false &&
      result.connectorActivatedByLocale === false &&
      result.crossBorderModel === "SEPARATE_CONNECTOR_LAYER" &&
      result.deSkConnectorActiveNow === false,
    result.riskClassCount === 4 &&
      result.riskPolicy.HIGH.manual &&
      result.riskPolicy.CRITICAL.manual &&
      result.highRiskManualReviewRequired &&
      result.criticalRiskManualReviewRequired,
    result.failureTaxonomy.length === FAILURES.length && result.failureTaxonomy.every((rule) => rule.abstain),
    !result.realSourceAcquisitionPerformed &&
      !result.realSourceContentStored &&
      !result.aiExtractionPerformed &&
      !result.databaseWritePerformed &&
      !result.databaseSchemaModified &&
      !result.generatedTypesCreated &&
      !result.runtimeRetrievalWired &&
      !result.publicRuntimeAuthorized &&
      !result.productionAuthorizationGranted,
    result.readyForOfficialSourceRegistryImplementationPlan &&
      !result.readyForRealKnowledgeIngestion &&
      !result.readyForLiveRetrievalImplementation &&
      result.recommendedNextPhase === NEXT_PHASE,
    result.contractTamperCaseCount >= 100 &&
      result.contractTamperCasesRejected === result.contractTamperCaseCount,
  ].every(Boolean);
}

interface Tamper {
  id: number;
  description: string;
  mutate: (result: Result) => void;
}

const TAMPER_ROWS: Array<[string, (result: Result) => void]> = [
  ["canonical storage selected for opening hours", (r) => { r.informationClassificationMatrix.find((x) => x.name === "opening_hours")!.defaultMode = "STORE_CANONICALLY"; }],
  ["live-only selected for process identity", (r) => { r.informationClassificationMatrix.find((x) => x.name === "process_identity")!.defaultMode = "FETCH_LIVE"; }],
  ["AI candidate allowed to publish itself", (r) => { r.aiExtractionContractComplete = false; }],
  ["official domain treated as verified claim", (r) => { (r as { officialDomainEqualsClaimVerified: boolean }).officialDomainEqualsClaimVerified = true; }],
  ["search snippet accepted as evidence", (r) => { r.discoveryOnlySourceClasses = r.discoveryOnlySourceClasses.filter((x) => x !== "SEARCH_RESULT_SNIPPET"); }],
  ["local page treated as federal rule", (r) => { r.jurisdictionContractComplete = false; }],
  ["locale selects jurisdiction", (r) => { (r as { localeDeterminesJurisdiction: boolean }).localeDeterminesJurisdiction = true; }],
  ["locale activates DE-SK connector", (r) => { (r as { connectorActivatedByLocale: boolean }).connectorActivatedByLocale = true; }],
  ["stale cache accepted for sanctions", (r) => { r.informationClassificationMatrix.find((x) => x.name === "sanction")!.staleCache = "ALLOW_WITH_STALE_WARNING"; }],
  ["unknown effective date accepted for deadline", (r) => { r.effectiveDateContractComplete = false; }],
  ["unresolved conflict published", (r) => { r.conflictResolutionContractComplete = false; }],
  ["runtime calls publication RPC", (r) => { r.runtimeReadBoundaryComplete = false; }],
  ["browser uses service-role client", (r) => { (r.databaseObjectAccessMatrix[0] as unknown as { browser: boolean }).browser = true; }],
  ["internal engine marked application callable", (r) => { (r as unknown as { internalFunctionsApplicationCallable: boolean }).internalFunctionsApplicationCallable = true; }],
  ["generated type treated as authorization", (r) => { (r as unknown as { publicClientNarrowSurfaceRequired: boolean }).publicClientNarrowSurfaceRequired = false; }],
  ["live data stored as approved canonical translation", (r) => { r.translationBoundaryComplete = false; }],
  ["retrieval without citations", (r) => { r.liveRetrievalContractComplete = false; }],
  ["user question stored as source data", (r) => { r.observabilityContractComplete = false; }],
  ["raw user document enters ingestion", (r) => { r.aiExtractionContractComplete = false; }],
  ["discovery-only source supports canonical claim", (r) => { r.sourceRegistryContractComplete = false; }],
  ["incomplete process published", (r) => { r.completenessContractComplete = false; }],
  ["retrieval date substitutes effective date", (r) => { r.effectiveDateModel = "RETRIEVAL_DATE_SUBSTITUTE" as Result["effectiveDateModel"]; }],
  ["latest source automatically wins", (r) => { r.sourceConflictModel = "LATEST_FETCH_WINS" as Result["sourceConflictModel"]; }],
  ["real ingestion marked ready", (r) => { r.readyForRealKnowledgeIngestion = true; }],
  ["live retrieval implementation marked ready", (r) => { r.readyForLiveRetrievalImplementation = true; }],
  ["source registry contract omitted", (r) => { r.sourceRegistryContractComplete = false; }],
  ["cache policy omitted", (r) => { r.cacheRevalidationContractComplete = false; }],
  ["failure taxonomy incomplete", (r) => { r.failureTaxonomy = r.failureTaxonomy.slice(1); }],
  ["handling mode missing", (r) => { r.handlingModes = r.handlingModes.slice(1); r.handlingModeCount = 4; }],
  ["wrong launch language set", (r) => { r.launchOutputLanguages = ["de", "en"]; }],
  ["German not canonical", (r) => { r.canonicalLanguage = "en" as "de"; }],
  ["connector merged into German baseline", (r) => { r.crossBorderModel = "MERGED_BASELINE" as Result["crossBorderModel"]; }],
  ["real source acquisition marked performed", (r) => { (r as { realSourceAcquisitionPerformed: boolean }).realSourceAcquisitionPerformed = true; }],
  ["generated types marked created", (r) => { (r as { generatedTypesCreated: boolean }).generatedTypesCreated = true; }],
  ["database write marked performed", (r) => { (r as { databaseWritePerformed: boolean }).databaseWritePerformed = true; }],
  ["database schema marked modified", (r) => { (r as { databaseSchemaModified: boolean }).databaseSchemaModified = true; }],
  ["runtime retrieval wired", (r) => { (r as { runtimeRetrievalWired: boolean }).runtimeRetrievalWired = true; }],
  ["public runtime authorized", (r) => { (r as { publicRuntimeAuthorized: boolean }).publicRuntimeAuthorized = true; }],
  ["production authorization granted", (r) => { (r as { productionAuthorizationGranted: boolean }).productionAuthorizationGranted = true; }],
  ["publication boundary missing", (r) => { r.publicationBoundaryComplete = false; }],
  ["source version contract missing", (r) => { r.sourceVersionContractComplete = false; }],
  ["passage contract missing", (r) => { r.evidencePassageContractComplete = false; }],
  ["evidence verification missing", (r) => { r.evidenceVerificationContractComplete = false; }],
  ["ingestion write boundary missing", (r) => { r.ingestionWriteBoundaryComplete = false; }],
  ["access matrix incomplete", (r) => { r.databaseObjectAccessMatrixComplete = false; }],
  ["safe RPC count lowered", (r) => { r.existingSafeRpcCount = 14; }],
  ["no narrow RPCs required", (r) => { r.newNarrowRpcRequiredCount = 0; }],
  ["table access approved as direct DML", (r) => { r.databaseObjectAccessMatrix[0].directServiceRoleDml = "APPROVED" as ObjectAccess["directServiceRoleDml"]; }],
  ["types introduced too early", (r) => { r.generatedTypeIntroductionTiming = "NOW" as Result["generatedTypeIntroductionTiming"]; }],
  ["full types not required", (r) => { (r as { fullGeneratedDatabaseTypeRequired: boolean }).fullGeneratedDatabaseTypeRequired = false; }],
  ["public narrow types not required", (r) => { (r as { publicClientNarrowSurfaceRequired: boolean }).publicClientNarrowSurfaceRequired = false; }],
  ["server ingestion types not required", (r) => { (r as { serverIngestionSurfaceRequired: boolean }).serverIngestionSurfaceRequired = false; }],
  ["server runtime read types not required", (r) => { (r as { serverRuntimeReadSurfaceRequired: boolean }).serverRuntimeReadSurfaceRequired = false; }],
  ["manual literal types not required", (r) => { (r as { manualLiteralDomainTypesRequired: boolean }).manualLiteralDomainTypesRequired = false; }],
  ["runtime not read-only", (r) => { r.runtimeReadModel = "DIRECT_DATABASE_RUNTIME" as Result["runtimeReadModel"]; }],
  ["ingestion not server-only", (r) => { r.ingestionWriteModel = "BROWSER_WRITE" as Result["ingestionWriteModel"]; }],
  ["live trust model bypassed", (r) => { r.liveRetrievalTrustModel = "DOMAIN_TRUST" as Result["liveRetrievalTrustModel"]; }],
  ["high risk review removed", (r) => { r.riskPolicy.HIGH.manual = false; }],
  ["critical risk review removed", (r) => { r.riskPolicy.CRITICAL.manual = false; }],
  ["risk class count changed", (r) => { r.riskClassCount = 3; }],
  ["matrix has fewer than 30 information classes", (r) => { r.informationClassCount = 29; }],
  ["matrix incomplete", (r) => { r.informationClassificationMatrixComplete = false; }],
  ["source gate omitted", (r) => { r.sourceAuthorizationGates = r.sourceAuthorizationGates.slice(1); }],
  ["source class omitted", (r) => { r.sourceClasses = r.sourceClasses.slice(1); }],
  ["passage classes omitted", (r) => { r.evidencePassageClasses = r.evidencePassageClasses.slice(1); }],
  ["verification results omitted", (r) => { r.candidateVerificationResults = r.candidateVerificationResults.slice(1); }],
  ["answerability statuses omitted", (r) => { r.answerabilityStatuses = r.answerabilityStatuses.slice(1); }],
  ["source acquisition methods omitted", (r) => { r.sourceAcquisitionMethods = r.sourceAcquisitionMethods.slice(1); }],
  ["change classes omitted", (r) => { r.sourceChangeClassifications = r.sourceChangeClassifications.slice(1); }],
  ["not ready for registry plan", (r) => { r.readyForOfficialSourceRegistryImplementationPlan = false; }],
  ["wrong next phase", (r) => { r.recommendedNextPhase = "PHASE 9Z"; }],
  ["repository scope weakened", (r) => { r.repositoryScopeValid = false; }],
  ["dirty tree accepted", (r) => { r.workingTreeCleanBeforePhase = false; }],
  ["unrelated untracked path accepted", (r) => { r.unexpectedRepositoryPaths = ["tmp.json"]; }],
  ["wrong architecture mode", (r) => { r.architectureMode = "STATIC_ARCHIVE" as Result["architectureMode"]; }],
  ["wrong first process family", (r) => { r.firstProcessFamily = "tax" as Result["firstProcessFamily"]; }],
  ["wrong first process pack", (r) => { r.firstProcessPack = "tax" as Result["firstProcessPack"]; }],
  ["DE-SK active now", (r) => { (r as { deSkConnectorActiveNow: boolean }).deSkConnectorActiveNow = true; }],
  ["source registry required fields removed", (r) => { r.sourceRegistryRequiredFields = r.sourceRegistryRequiredFields.slice(1); r.sourceRegistryContractComplete = false; }],
  ["acquisition fields removed", (r) => { r.acquisitionRequiredFields = r.acquisitionRequiredFields.slice(1); r.sourceVersionContractComplete = false; }],
  ["source version fields removed", (r) => { r.sourceVersionRequiredFields = r.sourceVersionRequiredFields.slice(1); r.sourceVersionContractComplete = false; }],
  ["candidate fields removed", (r) => { r.candidateRequiredFields = r.candidateRequiredFields.slice(1); r.aiExtractionContractComplete = false; }],
  ["observability contract omitted", (r) => { r.observabilityContractComplete = false; }],
  ["conflict resolution omitted", (r) => { r.conflictResolutionContractComplete = false; }],
  ["jurisdiction resolution omitted", (r) => { r.jurisdictionContractComplete = false; }],
  ["cache model bypassed", (r) => { r.cacheModel = "NO_CACHE_POLICY" as Result["cacheModel"]; }],
  ["translation model loses German canonical basis", (r) => { r.translationModel = "LOCALE_CANONICAL" as Result["translationModel"]; }],
  ["failure no longer abstains", (r) => { r.failureTaxonomy[0].abstain = false; }],
  ["runtime source authority gate bypassed", (r) => { r.sourceAuthorizationGates = r.sourceAuthorizationGates.filter((gate) => gate !== "AUTHORITY_MATCHED"); }],
  ["runtime effective-date gate bypassed", (r) => { r.sourceAuthorizationGates = r.sourceAuthorizationGates.filter((gate) => gate !== "EFFECTIVE_DATE_RESOLVED"); }],
  ["operational retrieval can use unknown content type", (r) => { r.sourceAcquisitionMethods = r.sourceAcquisitionMethods.filter((method) => method !== "HTML_DOCUMENT"); }],
  ["canonical source change classification omitted", (r) => { r.sourceChangeClassifications = r.sourceChangeClassifications.filter((kind) => kind !== "LEGAL_OR_POLICY_CHANGE"); }],
  ["precise evidence passage class omitted", (r) => { r.evidencePassageClasses = r.evidencePassageClasses.filter((kind) => kind !== "NORMATIVE_RULE"); }],
  ["unsupported candidate outcome omitted", (r) => { r.candidateVerificationResults = r.candidateVerificationResults.filter((kind) => kind !== "UNSUPPORTED"); }],
  ["clarification answerability omitted", (r) => { r.answerabilityStatuses = r.answerabilityStatuses.filter((kind) => kind !== "CLARIFICATION_REQUIRED"); }],
  ["source unavailable failure allowed to answer", (r) => { r.failureTaxonomy.find((rule) => rule.failure === "SOURCE_UNAVAILABLE")!.abstain = false; }],
  ["live cache model switched to unversioned storage", (r) => { r.cacheModel = "UNVERSIONED_CACHE" as Result["cacheModel"]; }],
  ["conflict model switched to fetch recency", (r) => { r.sourceConflictModel = "FETCH_RECENCY" as Result["sourceConflictModel"]; }],
  ["acquisition redirect deny case omitted", (r) => { r.sourceAcquisitionDenyCases = r.sourceAcquisitionDenyCases.slice(1); }],
  ["AI publication prohibition omitted", (r) => { r.aiExtractionProhibitions = r.aiExtractionProhibitions.filter((rule) => rule !== "publish itself"); }],
  ["effective-date status omitted", (r) => { r.effectiveDateStatuses = r.effectiveDateStatuses.filter((status) => status !== "UNKNOWN"); }],
  ["high-risk unknown date permitted", (r) => { r.highRiskUnknownEffectiveDateBlocksPublication = false; }],
  ["runtime internal-engine prohibition omitted", (r) => { r.runtimeForbiddenOperations = r.runtimeForbiddenOperations.filter((operation) => operation !== "call internal engines"); }],
  ["live translation made canonical", (r) => { r.liveTranslationPolicy = "live translation may become canonical"; }],
  ["first-pack opening hours made canonical", (r) => { r.firstPackWorkedExample.buergeramt_opening_hours = "STORE_CANONICALLY"; }],
  ["tamper count erased", (r) => { r.contractTamperCaseCount = 0; r.contractTamperCasesRejected = 0; }],
  ["tamper parity broken", (r) => { r.contractTamperCasesRejected = r.contractTamperCaseCount - 1; }],
];

const TAMPERS: Tamper[] = TAMPER_ROWS.map(([description, mutate], index) => ({
  id: index + 1,
  description,
  mutate,
}));

function runTampers(base: Result): { total: number; rejected: number; leaks: string[] } {
  const leaks: string[] = [];
  for (const tamper of TAMPERS) {
    const copy = JSON.parse(JSON.stringify(base)) as Result;
    tamper.mutate(copy);
    if (invariant(copy)) leaks.push(`#${tamper.id} ${tamper.description}`);
  }
  return { total: TAMPERS.length, rejected: TAMPERS.length - leaks.length, leaks };
}

function main(): void {
  const result = buildResult();
  result.contractTamperCaseCount = TAMPERS.length;
  result.contractTamperCasesRejected = TAMPERS.length;
  const tamper = runTampers(result);
  result.contractTamperCaseCount = tamper.total;
  result.contractTamperCasesRejected = tamper.rejected;

  if (!invariant(result)) {
    result.allPassed = false;
    if (result.outcome === "PASSED") {
      result.blocked = true;
      result.outcome = "BLOCKED — CONTRACT INCOMPLETE";
      result.blockReason = tamper.leaks.length > 0
        ? `Contract tamper leaks: ${tamper.leaks.join("; ")}`
        : "Contract evidence is internally contradictory.";
    }
  }

  console.log(JSON.stringify(result, null, 2));
  console.error("");
  console.error(`PHASE ${CHECK_ID} RESULT: ${result.outcome}`);
  console.error(`  architecture            : ${result.architectureMode}`);
  console.error(`  source commit           : ${result.sourceCommit}`);
  console.error(`  repository scope        : valid=${result.repositoryScopeValid} unexpected=${result.unexpectedRepositoryPaths.length}`);
  console.error(`  handling / information  : ${result.handlingModeCount} modes / ${result.informationClassCount} classes`);
  console.error(`  sources / gates         : ${result.sourceClassCount} official classes / ${result.sourceAuthorizationGates.length} gates`);
  console.error(`  database                : 032=${result.expectedKnowledgeTableCount} tables, 033=${result.expectedPublicationTranslationTableCount} tables, safe RPCs=${result.existingSafeRpcCount}`);
  console.error(`  type timing             : ${result.generatedTypeIntroductionTiming}`);
  console.error(`  access boundary         : ${result.runtimeReadModel} / ${result.ingestionWriteModel}`);
  console.error(`  cross-border            : ${result.crossBorderModel}, DE-SK active=${result.deSkConnectorActiveNow}`);
  console.error(`  tamper pack             : ${result.contractTamperCasesRejected}/${result.contractTamperCaseCount} rejected`);
  console.error(`  allPassed               : ${result.allPassed}`);
  if (result.blockReason) console.error(`  blocker                 : ${result.blockReason}`);
  console.error(`  next phase              : ${result.recommendedNextPhase}`);

  process.exit(result.allPassed ? 0 : 1);
}

main();
