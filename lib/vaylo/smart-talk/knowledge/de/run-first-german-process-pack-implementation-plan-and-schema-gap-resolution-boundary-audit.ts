/**
 * PHASE 9J — First German Process Pack Implementation Plan and Schema-Gap
 * Resolution Boundary (Design, Planning and Audit Only)
 *
 * Building on PHASE 9A-9I, this file:
 *   1. Classifies all 7 schema gaps identified in PHASE 9I with an explicit
 *      resolution decision, risk assessment and blocking-boundary analysis.
 *   2. Designs the minimum safe fix for the two blocking gaps (publication
 *      state, canonical translation layer) as a normalized, auditable,
 *      append-only extension — never implemented as SQL in this phase.
 *   3. Defines the proposed additive PHASE 9K migration boundary (candidate
 *      table names only, clearly marked as design candidates).
 *   4. Maps the first process pack (`anmeldung_ummeldung_abmeldung`) onto
 *      actual migration-032 entities plus the proposed future extension.
 *   5. Defines a 24-phase surgical implementation sequence (PHASE 9K..9AH),
 *      each phase with an explicit permission matrix, and defines the
 *      ingestion-run model, human-review plan, first source-acquisition
 *      boundary, database-write authorization boundary and runtime-retrieval
 *      boundary — all as schema-design candidates, none implemented here.
 *   6. Statically inspects `supabase/migrations/032_create_minimal_knowledge_schema.sql`
 *      and the PHASE 9I audit file as plain text (never imports/executes
 *      either) to ground every count in real repository evidence.
 *   7. Runs read-only `git` commands to confirm this phase created exactly
 *      one new file and modified no existing file.
 *   8. Runs a large set of pure, in-memory tamper cases against a
 *      deep-cloned "good" Result and confirms each mutation is rejected.
 *   9. Prints a structured JSON report when executed.
 *
 * Zero real German sources are fetched, zero rows are inserted, zero
 * remote/local databases are touched, zero Docker/Supabase processes are
 * started, zero SQL migrations are created, zero runtime retrieval is
 * enabled, zero publication occurs.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// ─── Source / chain constants ───────────────────────────────────────────────

const SOURCE_CLOSURE_COMMIT = "88acd7c";
const SOURCE_PACK_DESIGN_CHECK_ID = "9I";

const MIGRATIONS_DIR_REL_PATH = "supabase/migrations";
const MIGRATION_FILE_NAME = "032_create_minimal_knowledge_schema.sql";
const MIGRATION_REL_PATH = `${MIGRATIONS_DIR_REL_PATH}/${MIGRATION_FILE_NAME}`;
const PHASE_9I_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-knowledge-ingestion-architecture-and-first-process-pack-design-audit.ts";
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-first-german-process-pack-implementation-plan-and-schema-gap-resolution-boundary-audit.ts";

const LAUNCH_LOCALES = ["de", "en", "sk", "cs", "pl", "hu"] as const;
const FUTURE_LOCALES = ["ro", "bg", "uk", "tr", "ru"] as const;

const EXPECTED_KNOWLEDGE_TABLE_COUNT = 33;
const FIRST_PROCESS_PACK_ID = "anmeldung_ummeldung_abmeldung" as const;
const FIRST_PROCESS_PACK_FAMILY = "residence_registration_lifecycle" as const;
const FIRST_CROSS_BORDER_PILOT = "familienkasse_kindergeld" as const;

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

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

function columnLetters(n: number): string {
  let s = "";
  let x = n;
  while (x > 0) {
    const rem = (x - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    x = Math.floor((x - 1) / 26);
  }
  return s;
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
// A. SCHEMA-GAP RESOLUTION DECISIONS (all 7 gaps carried forward from 9I)
// ============================================================================

type SchemaGapId =
  | "no_dedicated_publication_state_column"
  | "no_translation_unit_for_full_claim_or_step_text"
  | "no_dedicated_withdrawn_or_emergency_disabled_status"
  | "no_dedicated_source_discovery_staging_table"
  | "no_generic_append_only_enforcement_trigger_beyond_source_versions"
  | "no_change_classification_granularity_beyond_change_status_enum"
  | "no_confidence_score_on_authority_resolution";

type GapResolutionDecision =
  | "resolve_before_first_ingestion"
  | "resolve_before_first_publication"
  | "resolve_before_runtime_retrieval"
  | "defer_until_later_process_packs"
  | "accept_as_documented_temporary_limitation";

const BLOCKING_DECISIONS: readonly GapResolutionDecision[] = [
  "resolve_before_first_ingestion",
  "resolve_before_first_publication",
  "resolve_before_runtime_retrieval",
];

function isBlockingDecision(d: GapResolutionDecision): boolean {
  return (BLOCKING_DECISIONS as readonly string[]).includes(d);
}

interface SchemaGapResolution {
  id: SchemaGapId;
  description: string;
  affectedMigration032Tables: readonly string[];
  operationalRisk: string;
  governanceRisk: string;
  dataIntegrityRisk: string;
  severity: "low" | "medium" | "high";
  decision: GapResolutionDecision;
  firstPhaseWhereBlocking: string;
  proposedResolution: string;
  sqlMigrationRequired: boolean;
  backfillRequired: boolean;
  existingRowsCouldBeAffected: boolean;
  rollbackAdditiveAndSafe: boolean;
  blocksFirstControlledSourceAcquisition: boolean;
  blocksFirstDatabaseWrite: boolean;
  blocksPublication: boolean;
  blocksRuntimeRetrieval: boolean;
  resolvedAsSideEffectOfGapId: SchemaGapId | null;
}

const SCHEMA_GAP_RESOLUTIONS: readonly SchemaGapResolution[] = [
  {
    id: "no_dedicated_publication_state_column",
    description:
      "knowledge_claims/knowledge_processes/knowledge_process_steps/knowledge_forms/knowledge_deadline_rules/knowledge_fee_rules/knowledge_eligibility_rules/knowledge_localized_terminology/knowledge_retrieval_metadata lack a single explicit publication_state value distinct from review_status+freshness_status+conflict_status+retrieval_metadata flags.",
    affectedMigration032Tables: [
      "knowledge_claims", "knowledge_processes", "knowledge_process_steps", "knowledge_forms",
      "knowledge_deadline_rules", "knowledge_fee_rules", "knowledge_eligibility_rules",
      "knowledge_localized_terminology", "knowledge_retrieval_metadata",
    ],
    operationalRisk:
      "Publication eligibility is a computed combination of several columns rather than one auditable value; a bug in the combination logic could under- or over-report readiness as more entity types are added.",
    governanceRisk:
      "Without one canonical state, two reviewers or tools could disagree on whether a unit is 'published' with no single source of truth to check, and 'suspended' vs 'withdrawn' have no first-class representation at all.",
    dataIntegrityRisk:
      "Low direct corruption risk (no column is mutated destructively today), but medium indirect risk: nothing currently prevents an invalid state transition because no transition-validation surface exists yet.",
    severity: "medium",
    decision: "resolve_before_first_ingestion",
    firstPhaseWhereBlocking: "9K (schema-extension design) must complete, and 9M (migration) must be validated, before 9Q (ingestion contract implementation) begins.",
    proposedResolution:
      "Additive PHASE 9K/9L/9M: a normalized, append-only publication-state extension (see BLOCKING_GAP_1_DESIGN below) — never scattered booleans.",
    sqlMigrationRequired: true,
    backfillRequired: false,
    existingRowsCouldBeAffected: false,
    rollbackAdditiveAndSafe: true,
    blocksFirstControlledSourceAcquisition: false,
    blocksFirstDatabaseWrite: true,
    blocksPublication: true,
    blocksRuntimeRetrieval: true,
    resolvedAsSideEffectOfGapId: null,
  },
  {
    id: "no_translation_unit_for_full_claim_or_step_text",
    description:
      "knowledge_localized_terminology only localizes canonical_german_term/definition_canonical (glossary/term level); claim_text_canonical, process title/summary and process_steps.description_canonical have no localized counterpart.",
    affectedMigration032Tables: [
      "knowledge_claims", "knowledge_processes", "knowledge_process_steps", "knowledge_terminology",
      "knowledge_localized_terminology",
    ],
    operationalRisk:
      "Full-text multilingual presentation of a claim, process or step cannot yet be stored structurally; only glossary-level terminology is covered today.",
    governanceRisk:
      "Without a governed translation-unit table, ad hoc translation would have no enforced link back to the German canonical unit, no reviewer state and no invalidation-on-change mechanism.",
    dataIntegrityRisk:
      "Low today (no translation rows for full text exist at all yet), but the absence of the table means any stop-gap approach would risk widening/narrowing the German claim without governance.",
    severity: "medium",
    decision: "resolve_before_first_ingestion",
    firstPhaseWhereBlocking: "9K (schema-extension design) must complete, and 9M (migration) must be validated, before 9V (translation workflow implementation, item 13) begins.",
    proposedResolution:
      "Additive PHASE 9K/9L/9M: a single generic, polymorphic canonical-unit translation table (see BLOCKING_GAP_2_DESIGN below), reusing the existing entity_type+entity_id convention already used by knowledge_review_records/knowledge_audit_events/knowledge_retrieval_metadata/knowledge_trust_domain_links.",
    sqlMigrationRequired: true,
    backfillRequired: false,
    existingRowsCouldBeAffected: false,
    rollbackAdditiveAndSafe: true,
    blocksFirstControlledSourceAcquisition: false,
    blocksFirstDatabaseWrite: true,
    blocksPublication: true,
    blocksRuntimeRetrieval: true,
    resolvedAsSideEffectOfGapId: null,
  },
  {
    id: "no_dedicated_withdrawn_or_emergency_disabled_status",
    description:
      "status enums on knowledge_sources ('active','archived','superseded','unresolved') and knowledge_claims/knowledge_processes ('active','superseded','unresolved') lack an explicit 'withdrawn'/'emergency_disabled' value.",
    affectedMigration032Tables: ["knowledge_sources", "knowledge_claims", "knowledge_processes"],
    operationalRisk:
      "Emergency suspension must currently be expressed indirectly via freshness_status='review_required' plus knowledge_retrieval_metadata flags rather than one first-class status value.",
    governanceRisk:
      "Low once Gap 1 is resolved: the proposed publication_state extension's state list already includes 'suspended' and 'withdrawn' as first-class values, so this gap is subsumed rather than independently fixed.",
    dataIntegrityRisk: "Low; no existing row depends on a 'withdrawn' status today because nothing is published yet.",
    severity: "medium",
    decision: "defer_until_later_process_packs",
    firstPhaseWhereBlocking: "not independently blocking; resolved as a side effect of PHASE 9K's publication_state extension before runtime retrieval is designed (9AB).",
    proposedResolution:
      "No independent migration; the withdrawn/suspended values are included directly in the Gap-1 publication_state enum in PHASE 9K/9M.",
    sqlMigrationRequired: false,
    backfillRequired: false,
    existingRowsCouldBeAffected: false,
    rollbackAdditiveAndSafe: true,
    blocksFirstControlledSourceAcquisition: false,
    blocksFirstDatabaseWrite: false,
    blocksPublication: false,
    blocksRuntimeRetrieval: true,
    resolvedAsSideEffectOfGapId: "no_dedicated_publication_state_column",
  },
  {
    id: "no_dedicated_source_discovery_staging_table",
    description: "there is no knowledge_* table for pre-registration discovery candidates (ingestion lifecycle stage 1).",
    affectedMigration032Tables: [],
    operationalRisk: "Discovery candidates must be tracked outside the database (e.g. an operator worklist) until vetted.",
    governanceRisk: "None: discovery candidates are intentionally untrusted and outside the canonical registry by design.",
    dataIntegrityRisk: "None; no canonical row is ever created at this stage regardless of where candidates are staged.",
    severity: "low",
    decision: "accept_as_documented_temporary_limitation",
    firstPhaseWhereBlocking: "not blocking any phase in this plan.",
    proposedResolution: "Optional future staging table only if discovery volume later requires durable, queryable tracking.",
    sqlMigrationRequired: false,
    backfillRequired: false,
    existingRowsCouldBeAffected: false,
    rollbackAdditiveAndSafe: true,
    blocksFirstControlledSourceAcquisition: false,
    blocksFirstDatabaseWrite: false,
    blocksPublication: false,
    blocksRuntimeRetrieval: false,
    resolvedAsSideEffectOfGapId: null,
  },
  {
    id: "no_generic_append_only_enforcement_trigger_beyond_source_versions",
    description:
      "knowledge_review_records, knowledge_freshness_records, knowledge_conflicts and knowledge_audit_events rely on fail-closed RLS and absence of cascade deletes rather than a dedicated append-only trigger (already documented as residual debt inside migration 032 itself).",
    affectedMigration032Tables: [
      "knowledge_review_records", "knowledge_freshness_records", "knowledge_conflicts", "knowledge_audit_events",
    ],
    operationalRisk: "A privileged internal tool bug could in principle UPDATE/DELETE governance history; external anon/authenticated access is already blocked.",
    governanceRisk: "Medium over the long run: append-only guarantees for audit/review history should eventually be enforced structurally, not only by convention.",
    dataIntegrityRisk: "Low today (no such row exists yet to corrupt); becomes more material once real review/audit rows accumulate.",
    severity: "low",
    decision: "defer_until_later_process_packs",
    firstPhaseWhereBlocking: "not blocking any phase in this plan; existing, honestly-labelled residual debt from PHASE 9G.",
    proposedResolution: "Future generic append-only trigger migration covering all four tables uniformly.",
    sqlMigrationRequired: true,
    backfillRequired: false,
    existingRowsCouldBeAffected: false,
    rollbackAdditiveAndSafe: true,
    blocksFirstControlledSourceAcquisition: false,
    blocksFirstDatabaseWrite: false,
    blocksPublication: false,
    blocksRuntimeRetrieval: false,
    resolvedAsSideEffectOfGapId: null,
  },
  {
    id: "no_change_classification_granularity_beyond_change_status_enum",
    description:
      "knowledge_freshness_records.change_status ('unchanged','updated','superseded','retracted','unverified') cannot natively distinguish the 12 change-detection classes defined in PHASE 9I (formatting-only vs factual vs deadline vs fee vs document vs jurisdiction vs authority, etc.).",
    affectedMigration032Tables: ["knowledge_freshness_records"],
    operationalRisk: "Finer classification can be recorded in the free-text notes column for now; nothing forces a high-impact change to be silently under-classified as 'unchanged'.",
    governanceRisk: "Low: the coarse enum already forces a 'review_required'-adjacent path for anything not cleanly 'unchanged'.",
    dataIntegrityRisk: "None.",
    severity: "medium",
    decision: "accept_as_documented_temporary_limitation",
    firstPhaseWhereBlocking: "not blocking any phase in this plan.",
    proposedResolution: "Future migration adding a structured change_classification column once real change-monitoring volume justifies it.",
    sqlMigrationRequired: true,
    backfillRequired: false,
    existingRowsCouldBeAffected: false,
    rollbackAdditiveAndSafe: true,
    blocksFirstControlledSourceAcquisition: false,
    blocksFirstDatabaseWrite: false,
    blocksPublication: false,
    blocksRuntimeRetrieval: false,
    resolvedAsSideEffectOfGapId: null,
  },
  {
    id: "no_confidence_score_on_authority_resolution",
    description: "knowledge_territorial_scopes and knowledge_authority_competences have no explicit numeric resolution-confidence column.",
    affectedMigration032Tables: ["knowledge_territorial_scopes", "knowledge_authority_competences"],
    operationalRisk: "Authority-resolution confidence can be tracked in review_status/notes for now; low operational impact.",
    governanceRisk: "Low; authority competence already requires explicit source-supported, effective-dated rows, so an unresolved/low-confidence case is never silently treated as resolved.",
    dataIntegrityRisk: "None.",
    severity: "low",
    decision: "defer_until_later_process_packs",
    firstPhaseWhereBlocking: "not blocking any phase in this plan.",
    proposedResolution: "Future migration adding a resolution_confidence column where operational experience shows it is needed.",
    sqlMigrationRequired: true,
    backfillRequired: false,
    existingRowsCouldBeAffected: false,
    rollbackAdditiveAndSafe: true,
    blocksFirstControlledSourceAcquisition: false,
    blocksFirstDatabaseWrite: false,
    blocksPublication: false,
    blocksRuntimeRetrieval: false,
    resolvedAsSideEffectOfGapId: null,
  },
];

const BLOCKING_GAP_RESOLUTIONS: readonly SchemaGapResolution[] = SCHEMA_GAP_RESOLUTIONS.filter((g) =>
  isBlockingDecision(g.decision)
);

// ============================================================================
// B. BLOCKING GAP 1 DESIGN — PUBLICATION STATE
// ============================================================================

const PUBLICATION_STATES = [
  "draft", "evidence_incomplete", "review_required", "approved", "publication_eligible",
  "published", "suspended", "superseded", "withdrawn",
] as const;

const PUBLICATION_STATE_APPLIES_TO = [
  "sources", "source_versions", "claims", "process_definitions", "process_steps",
  "required_document_rules", "deadlines", "translations", "complete_process_pack_versions",
] as const;

const BLOCKING_GAP_1_DESIGN = {
  gapId: "no_dedicated_publication_state_column" as SchemaGapId,
  states: PUBLICATION_STATES,
  appliesTo: PUBLICATION_STATE_APPLIES_TO,
  publicationStateBelongsOnCanonicalUnitsDirectly: false,
  usesSeparatePublicationRecordTable: true,
  designRationale:
    "A scattered boolean-column design (e.g. a single 'published' flag) cannot represent suspended-vs-withdrawn, cannot preserve history, and cannot be validated as a state machine. A normalized, append-only, polymorphic design (entity_type+entity_id, mirroring the pattern already used by knowledge_review_records/knowledge_audit_events/knowledge_retrieval_metadata/knowledge_trust_domain_links in migration 032) is preferred.",
  candidateTables: [
    {
      name: "knowledge_publication_states",
      purpose: "One row per (entity_type, entity_id): the current publication state only. Mutable pointer, always overwritten in place by a new transition, never the source of historical truth.",
      isDesignCandidateOnly: true,
    },
    {
      name: "knowledge_publication_state_transitions",
      purpose: "Append-only full history: one row per transition (from_state, to_state, transitioned_at, transitioned_by, actor_type, reason, review_record_id). Never UPDATEd or DELETEd.",
      isDesignCandidateOnly: true,
    },
  ],
  stateHistoryMustBeAppendOnly: true,
  transitionAuthorization:
    "Every inserted transition row must reference either a knowledge_review_records.id (human/expert-authorized transition) or an explicit actor_type='system' plus a structured reason (system-triggered, e.g. freshness-driven suspension). No transition may be inserted with neither.",
  suspensionVsWithdrawal:
    "Suspension is temporary and reversible: a suspended entity can transition back to 'published' after re-review. Withdrawal is treated as terminal for that version/claim: a withdrawn entity does not automatically become re-publishable and must re-enter the full review pipeline as if new.",
  supersessionVsDeletion:
    "Supersession creates a new canonical row/version and marks the old one 'superseded'; the old content is retained and remains queryable for historical-date queries. Deletion is never used for authoritative content — migration 032's own 'on delete restrict' foreign keys already structurally prevent deletion while referenced, and application code must never issue DELETE against these tables.",
  runtimeRetrievalChecksPublicationState:
    "The retrieval-eligibility query must include 'knowledge_publication_states.state = published' as one of several mandatory AND conditions (jurisdiction resolved, effective date valid, no unresolved conflict, translation approved or German fallback, risk-class review complete) — publication state is never inferred from any other column.",
  emergencyDisableMechanism:
    "An emergency disable is a single transaction: INSERT into knowledge_publication_state_transitions (to_state='suspended', reason='emergency', actor_type), UPDATE the knowledge_publication_states pointer row, and flip the corresponding knowledge_retrieval_metadata indexing flags to false. No row is ever deleted; the action is fully reversible and fully audited via a matching knowledge_audit_events row.",
  publicationHistoryAuditability:
    "Every row in knowledge_publication_state_transitions must have a corresponding knowledge_audit_events row (linked via review_record_id or a shared correlation id); the two tables cross-verify each other.",
  invalidTransitionBlocking:
    "An explicit adjacency list (draft -> evidence_incomplete -> review_required -> approved -> publication_eligible -> published -> {suspended, superseded, withdrawn}; suspended -> {published, withdrawn}; superseded and withdrawn are terminal for that version) is enforced at the application layer now and by a future DB trigger once implemented; any transition not in the adjacency list is rejected before insert.",
} as const;

// ============================================================================
// C. BLOCKING GAP 2 DESIGN — CANONICAL TRANSLATION LAYER
// ============================================================================

const TRANSLATABLE_UNIT_KINDS = [
  "claim_presentation_text", "process_title", "process_summary", "process_step_title",
  "process_step_explanation", "warning_text", "document_requirement_presentation_text",
  "deadline_explanation_text", "authority_resolution_guidance", "outcome_guidance",
] as const;

const TRANSLATION_UNIT_FIELDS = [
  "canonicalGermanUnitReference", "translationLocale", "translationVersion", "sourceCanonicalVersion",
  "translationStatus", "reviewerState", "machineGeneratedIndicator", "machineModelProviderMetadata",
  "humanReviewedIndicator", "terminologyGlossaryVersion", "createdTimestamp", "verifiedTimestamp",
  "supersededTimestamp", "rejectionReason", "uncertaintyPreservationConfirmation",
  "warningPreservationConfirmation", "effectiveDateInheritance", "jurisdictionInheritance",
  "noIndependentLegalTruthInvariant",
] as const;

const BLOCKING_GAP_2_DESIGN = {
  gapId: "no_translation_unit_for_full_claim_or_step_text" as SchemaGapId,
  translatableUnitKinds: TRANSLATABLE_UNIT_KINDS,
  translationUnitFields: TRANSLATION_UNIT_FIELDS,
  genericVsEntitySpecific: "generic_single_table" as const,
  designRationale:
    "Nine entity-specific translation tables would duplicate governance columns nine times and complicate every future addition of a translatable field. A single generic table keyed by (entity_type, entity_id, field_key, output_locale) mirrors the polymorphic pattern migration 032 already uses for knowledge_review_records/knowledge_audit_events/knowledge_retrieval_metadata/knowledge_trust_domain_links, and keeps the additive migration surgical.",
  candidateTables: [
    {
      name: "knowledge_canonical_unit_translations",
      purpose: "One row per (entity_type, entity_id, field_key, output_locale): the translated text plus the full governance column set (status/reviewer/machine-flag/model metadata/glossary version/timestamps/rejection reason/preservation flags/inheritance flags/no-independent-legal-truth invariant fixed true).",
      isDesignCandidateOnly: true,
    },
  ],
  stableCanonicalUnitIdentity: "(entity_type, entity_id, field_key) tuple, where field_key names the specific translatable text field (e.g. 'claim_text_canonical', 'title', 'description_canonical', 'warning_text').",
  invalidationAfterGermanCanonicalChange:
    "Any update to the German canonical text, or creation of a new source_version superseding the evidence a claim/step relied on, flips every existing translation row for that (entity_type, entity_id, field_key) to translation_status='invalidated_pending_review'. A translation is never left silently 'approved' against stale German text.",
  oldTranslationsRemainHistoricallyQueryable: true,
  fallbackToGermanBehavior:
    "If no row exists with the requested output_locale in translation_status='approved' (and not invalidated), the German canonical text is served together with the 'translation_not_approved' warning type already defined in PHASE 9I.",
  untranslatedContentDisplay: "German canonical text plus an explicit untranslated-content warning banner; never blank content.",
  machineTranslationAutoPublicationPrevention:
    "machine_generated=true rows always start at translation_status='draft' and cannot self-transition to 'approved' — the same transition-validation mechanism proposed for Gap 1's publication_state enforces this; only a human reviewer action can set translation_status='approved'.",
  launchLanguageEnablement:
    "Enforced by a CHECK constraint on output_locale, exactly mirroring knowledge_localized_terminology.output_locale today (in ('de','en','sk','cs','pl','hu')).",
  futureLanguagesRemainInactive:
    "Future languages (ro/bg/uk/tr/ru) remain structurally impossible to insert until a future migration widens the CHECK constraint — no new mechanism is needed beyond the one migration-032 already established.",
  noIndependentLegalTruth: true,
} as const;

// ============================================================================
// D. PROPOSED MIGRATION BOUNDARY — PHASE 9K (design candidates only)
// ============================================================================

const PROPOSED_MIGRATION_BOUNDARY = {
  futurePhaseId: "9K" as const,
  futurePhaseLabel: "Publication and Canonical Translation Schema Extension Design",
  candidateMigrationFileNamePlaceholder: "033_add_publication_state_and_canonical_translations.sql (candidate name only, not created)",
  proposedNewTables: [
    "knowledge_publication_states (candidate)",
    "knowledge_publication_state_transitions (candidate)",
    "knowledge_canonical_unit_translations (candidate)",
  ] as const,
  proposedEnumDomains: [
    "publication_state check (draft, evidence_incomplete, review_required, approved, publication_eligible, published, suspended, superseded, withdrawn)",
    "translation_status check (draft, invalidated_pending_review, review_required, approved, rejected, superseded) — extends the existing 'draft'/review_status vocabulary already used elsewhere in migration 032",
  ] as const,
  proposedIndexes: [
    "unique(entity_type, entity_id) on knowledge_publication_states",
    "index(entity_type, entity_id) on knowledge_publication_state_transitions",
    "index(transitioned_at) on knowledge_publication_state_transitions",
    "unique(entity_type, entity_id, field_key, output_locale) on knowledge_canonical_unit_translations",
    "index(translation_status) on knowledge_canonical_unit_translations",
  ] as const,
  proposedForeignKeys: [
    "knowledge_publication_state_transitions.review_record_id -> knowledge_review_records.id on delete set null",
    "knowledge_canonical_unit_translations.terminology_glossary_version -> (documentation-level version tag, no FK; mirrors existing free-text version fields elsewhere in migration 032)",
  ] as const,
  proposedRlsBehavior:
    "Identical fail-closed pattern to every existing knowledge_* table: RLS enabled, zero anon/authenticated policies, service-role retains normal Supabase RLS-bypass behavior only.",
  proposedGrants: "revoke all on the three new tables from public, anon, authenticated — matching every existing revoke statement in migration 032.",
  proposedAppendOnlyProtections:
    "knowledge_publication_state_transitions gets the same style of BEFORE UPDATE/DELETE-rejecting trigger already used for knowledge_source_versions' locked-content protection, generalized to reject any UPDATE/DELETE unconditionally (not just once-locked).",
  proposedTransitionValidationFunctionOrTrigger:
    "A BEFORE INSERT trigger on knowledge_publication_state_transitions validating (from_state, to_state) against the fixed adjacency list defined in BLOCKING_GAP_1_DESIGN, rejecting any pair not present.",
  proposedImmutableHistoryBehavior: "Both new history-bearing tables (transitions, translations-superseded-rows) are never UPDATEd for their identity/content columns once superseded_at or transitioned_at is set — new rows are added instead.",
  proposedCleanupBehavior: "None required: append-only tables grow monotonically; no destructive cleanup job is proposed. Retention/archival policy is deferred to an operational (non-schema) decision.",
  noDestructiveChangesToExisting33Tables: true,
  noProductionApplicationInSamePhase: true,
  candidateTableNamesAreDesignCandidatesOnlyNotImplementedFacts: true,
} as const;

// ============================================================================
// E. IMPLEMENTATION PLAN — 24 surgical phases (PHASE 9K..9AH)
// ============================================================================

const IMPLEMENTATION_PHASE_COUNT = 24;
const IMPLEMENTATION_PHASE_IDS: readonly string[] = Array.from(
  { length: IMPLEMENTATION_PHASE_COUNT },
  (_, i) => `9${columnLetters(11 + i)}`
);

interface ImplementationPhase {
  phaseId: string;
  index: number;
  itemName: string;
  objective: string;
  allowedFiles: readonly string[];
  forbiddenFiles: readonly string[];
  databaseWritePermission: "none" | "local_only";
  networkPermission: boolean;
  dockerPermission: boolean;
  remoteDatabasePermission: boolean;
  realSourcePermission: boolean;
  expectedArtifacts: readonly string[];
  requiredValidations: readonly string[];
  successConditions: readonly string[];
  rollbackOrContainmentStrategy: string;
  prerequisites: readonly string[];
  nextPhaseAuthorization: string;
  permitsFileWrites: boolean;
  permitsSqlChanges: boolean;
  permitsDocker: boolean;
  permitsNetwork: boolean;
  permitsRealOfficialSourceRetrieval: boolean;
  permitsLocalDatabaseWrites: boolean;
  permitsRemoteDatabaseWrites: boolean;
  permitsProductionWrites: boolean;
  permitsRuntimeChanges: boolean;
  permitsPublication: boolean;
}

const IMPLEMENTATION_ITEM_NAMES = [
  "schema-gap resolution", "migration design", "migration implementation", "isolated PostgreSQL validation",
  "generated database type decision", "ingestion contract implementation", "source-registration tooling",
  "immutable source-version creation", "source-passage segmentation", "extraction-candidate model",
  "review workflow", "publication-state workflow", "translation workflow", "first synthetic process-pack fixture",
  "first official-source controlled acquisition", "controlled database write dry-run", "post-write database audit",
  "retrieval eligibility design", "internal retrieval dry-run", "first Smart Talk read-only integration design",
  "multilingual presentation validation", "stale-source and change-monitoring design", "emergency suspension test",
  "publication authorization boundary",
] as const;

function buildImplementationPhases(): readonly ImplementationPhase[] {
  const base: Omit<ImplementationPhase, "phaseId" | "index" | "itemName">[] = [
    { objective: "Design the additive publication-state + canonical-translation schema extension (Gap 1 & Gap 2) at the DDL-design level, without writing SQL.",
      allowedFiles: ["one new design/plan .ts audit file"], forbiddenFiles: ["any SQL migration", "any existing file"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["design contract enumerating candidate tables/enums/columns"], requiredValidations: ["internal consistency", "no destructive change proposed"],
      successConditions: ["design reviewed as additive and normalized"], rollbackOrContainmentStrategy: "no-op; design only, nothing to roll back",
      prerequisites: ["PHASE 9J complete", "readyForPublicationAndTranslationSchemaExtensionDesign = true"], nextPhaseAuthorization: "unlocks migration design phase only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Translate the schema-extension design into a concrete additive migration plan (table-by-table DDL sketch, index/FK/RLS/grant/trigger plan), still no SQL file.",
      allowedFiles: ["one new migration-plan .ts audit file"], forbiddenFiles: ["any SQL migration", "any existing file"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["migration plan document"], requiredValidations: ["plan matches design phase exactly", "additive-only"],
      successConditions: ["plan is reviewed and additive-only"], rollbackOrContainmentStrategy: "no-op; plan only",
      prerequisites: ["schema-gap resolution design complete"], nextPhaseAuthorization: "unlocks migration implementation phase only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Author the actual additive SQL migration file implementing the publication-state and canonical-translation extension, following migration-032 conventions (RLS enabled, zero anon/authenticated policies, no seed rows).",
      allowedFiles: ["one new supabase/migrations/0NN_*.sql file"], forbiddenFiles: ["032_create_minimal_knowledge_schema.sql", "any other existing file"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["one additive SQL migration file, not yet applied"], requiredValidations: ["migration is additive-only", "zero INSERT statements", "RLS enabled on every new table"],
      successConditions: ["migration file created and self-consistent; not applied to any database"], rollbackOrContainmentStrategy: "delete the unapplied file if design review fails; nothing was ever applied",
      prerequisites: ["migration design phase complete"], nextPhaseAuthorization: "unlocks isolated PostgreSQL validation only",
      permitsFileWrites: true, permitsSqlChanges: true, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Validate the new migration on a disposable, isolated local PostgreSQL 17 container, mirroring the PHASE 9H methodology: confirm additive-only impact, zero data loss, RLS enabled, zero seed rows.",
      allowedFiles: ["one new validation-audit .ts file"], forbiddenFiles: ["any existing file", "the new migration file itself (read-only in this phase)"],
      databaseWritePermission: "local_only", networkPermission: true, dockerPermission: true, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["validation report confirming the migration applies cleanly to a throwaway container"], requiredValidations: ["container destroyed after validation", "no persistent local/Supabase database touched"],
      successConditions: ["migration applies cleanly; existing 33 tables unaffected; new tables empty and RLS-protected"], rollbackOrContainmentStrategy: "destroy the disposable container; nothing persists",
      prerequisites: ["migration implementation phase complete"], nextPhaseAuthorization: "unlocks generated-database-type decision only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: true, permitsNetwork: true, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: true, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Decide and document whether/how to regenerate TypeScript DB types for the new tables (e.g. via a type-generation tool) and define the workflow, without generating types in this same phase.",
      allowedFiles: ["one new decision-document .ts file"], forbiddenFiles: ["generated type files", "any existing file"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["decision document"], requiredValidations: ["workflow decision is explicit and repeatable"],
      successConditions: ["decision recorded"], rollbackOrContainmentStrategy: "no-op; decision only",
      prerequisites: ["isolated PostgreSQL validation passed"], nextPhaseAuthorization: "unlocks ingestion contract implementation only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Implement the ingestion contract types/interfaces and pure functions (fingerprinting, passage segmentation, dedupe-key computation) as reusable library code, with zero network/DB/runtime activation.",
      allowedFiles: ["new lib/vaylo/smart-talk/knowledge/de/ingestion/*.ts files"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["pure ingestion-contract library code with unit tests"], requiredValidations: ["type-checks", "unit-tested against synthetic fixtures only"],
      successConditions: ["contract compiles and is fully covered by synthetic tests"], rollbackOrContainmentStrategy: "revert the new files; nothing external was touched",
      prerequisites: ["generated database type decision complete"], nextPhaseAuthorization: "unlocks source-registration tooling only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Implement source-registration tooling (CLI/script) able to insert a knowledge_sources row given a manually-provided, human-reviewed official-source description — built but not yet executed against any real data.",
      allowedFiles: ["new tooling script files"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["source-registration tool, unexecuted against real data"], requiredValidations: ["dry-run against synthetic input only"],
      successConditions: ["tool builds and validates synthetic input"], rollbackOrContainmentStrategy: "revert the new files",
      prerequisites: ["ingestion contract implementation complete"], nextPhaseAuthorization: "unlocks immutable source-version creation only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Implement the source-version creation function (content hashing, version_sequence assignment, client-side mirror of the DB immutability trigger) as pure, testable code.",
      allowedFiles: ["new tooling/library files"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["source-version creation function with unit tests"], requiredValidations: ["hash determinism verified"],
      successConditions: ["function is pure and deterministic"], rollbackOrContainmentStrategy: "revert the new files",
      prerequisites: ["source-registration tooling complete"], nextPhaseAuthorization: "unlocks source-passage segmentation only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Implement deterministic passage-segmentation logic (heading/paragraph/article anchors) as pure, unit-testable code with no live source input.",
      allowedFiles: ["new tooling/library files"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["segmentation function with unit tests against synthetic HTML/PDF-shaped fixtures"], requiredValidations: ["stable ordering across re-runs"],
      successConditions: ["segmentation is deterministic and stable"], rollbackOrContainmentStrategy: "revert the new files",
      prerequisites: ["immutable source-version creation complete"], nextPhaseAuthorization: "unlocks extraction-candidate model only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Implement the structured extraction-candidate data model and validation rules (rules-based and optional LLM-assisted candidate shape), with explicit machine_prechecked trust-ceiling enforcement in code.",
      allowedFiles: ["new tooling/library files"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["extraction-candidate model with trust-ceiling enforcement"], requiredValidations: ["candidate can never self-elevate above machine_prechecked"],
      successConditions: ["trust ceiling is enforced in code, not just documentation"], rollbackOrContainmentStrategy: "revert the new files",
      prerequisites: ["source-passage segmentation complete"], nextPhaseAuthorization: "unlocks review workflow only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Implement the human-review workflow (queue assignment, reviewer-role enforcement, transition validation) as application logic, exercised only against synthetic fixtures.",
      allowedFiles: ["new tooling/library files"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["review-workflow engine with role-separation enforcement"], requiredValidations: ["self-approval blocked in code"],
      successConditions: ["workflow enforces separation of duties on synthetic fixtures"], rollbackOrContainmentStrategy: "revert the new files",
      prerequisites: ["extraction-candidate model complete"], nextPhaseAuthorization: "unlocks publication-state workflow only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Implement the publication-state workflow (transition validation against the adjacency list, emergency-disable path) against the PHASE 9K/9M extension, exercised only against synthetic fixtures.",
      allowedFiles: ["new tooling/library files"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["publication-state transition engine with adjacency-list enforcement"], requiredValidations: ["invalid transitions rejected in code"],
      successConditions: ["state machine enforces the documented adjacency list"], rollbackOrContainmentStrategy: "revert the new files",
      prerequisites: ["review workflow complete", "PHASE 9M migration validated"], nextPhaseAuthorization: "unlocks translation workflow only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Implement the translation workflow (candidate creation, glossary binding, invalidation-on-German-change, approval gate) against the PHASE 9K/9M extension, exercised only against synthetic fixtures.",
      allowedFiles: ["new tooling/library files"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["translation workflow engine with auto-publication blocked for machine-generated rows"], requiredValidations: ["machine-generated rows cannot self-approve"],
      successConditions: ["translation workflow enforces human-approval gate"], rollbackOrContainmentStrategy: "revert the new files",
      prerequisites: ["publication-state workflow complete"], nextPhaseAuthorization: "unlocks first synthetic process-pack fixture only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Build a fully synthetic (invented, clearly-labelled non-real) process-pack fixture for anmeldung_ummeldung_abmeldung to exercise the whole pipeline end-to-end without any real bureaucratic fact.",
      allowedFiles: ["new synthetic-fixture files, clearly labelled synthetic"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["synthetic fixture data set"], requiredValidations: ["fixture is clearly marked synthetic and never mistaken for real content"],
      successConditions: ["end-to-end pipeline runs against the fixture without touching any database"], rollbackOrContainmentStrategy: "revert the new files",
      prerequisites: ["translation workflow complete"], nextPhaseAuthorization: "unlocks first official-source controlled acquisition only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Perform the first controlled acquisition of exactly one narrowly-scoped, official, allowlisted German source (fetch, hash, store raw evidence only) — no database write, no publication, no runtime retrieval.",
      allowedFiles: ["one new acquisition-evidence file, raw content stored outside the repository"], forbiddenFiles: ["any existing file", "SQL migrations", "any database write"],
      databaseWritePermission: "none", networkPermission: true, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: true,
      expectedArtifacts: ["one immutable raw-content fingerprint and retrieval-timestamp record"], requiredValidations: ["robots.txt compliance", "official-domain allowlist match", "MIME validation"],
      successConditions: ["exactly one source fetched from the allowlist, fingerprinted, and stored outside any database"], rollbackOrContainmentStrategy: "discard the fetched artifact if any validation fails; nothing was written to a database",
      prerequisites: ["first synthetic process-pack fixture complete", "source allowlist reviewed"], nextPhaseAuthorization: "unlocks controlled database write dry-run only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: true, permitsRealOfficialSourceRetrieval: true,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Perform the first controlled, explicitly-authorized write of draft/unreviewed records (source, source_version, passages, draft claims) to a local-only Supabase instance, bounded by an explicit write-set preview and record-count ceiling.",
      allowedFiles: ["one new dry-run audit file"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "local_only", networkPermission: false, dockerPermission: true, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["write-set preview, record-count ceiling, rollback/cleanup plan, post-write row snapshot"], requiredValidations: ["target is verified local, never remote/staging/production", "no publication_state ever reaches 'published' in this phase"],
      successConditions: ["draft rows written locally only; zero publication; zero remote/production writes"], rollbackOrContainmentStrategy: "explicit cleanup script deletes/truncates the local-only dry-run rows",
      prerequisites: ["all items in DATABASE_WRITE_AUTHORIZATION_BOUNDARY.requiredPriorAudits passed"], nextPhaseAuthorization: "unlocks post-write database audit only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: true, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: true, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Audit the local-only dry-run write: verify row counts match the preview ceiling, verify immutability/citation/evidence invariants hold, verify nothing became publication_state='published'.",
      allowedFiles: ["one new post-write audit file"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: true, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["post-write audit report"], requiredValidations: ["row-count ceiling respected", "zero published rows", "zero remote/production rows"],
      successConditions: ["audit confirms the dry-run stayed within its authorized boundary"], rollbackOrContainmentStrategy: "if audit fails, run the cleanup script from the prior phase immediately",
      prerequisites: ["controlled database write dry-run complete"], nextPhaseAuthorization: "unlocks retrieval eligibility design only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: true, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Design (not implement) the full retrieval-eligibility query: every AND condition required before an entity is runtime-visible (see RUNTIME_RETRIEVAL_BOUNDARY below).",
      allowedFiles: ["one new design-document .ts file"], forbiddenFiles: ["any existing file", "SQL migrations", "runtime routes"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["retrieval-eligibility design document"], requiredValidations: ["every mandatory AND condition enumerated"],
      successConditions: ["design reviewed as complete and locale-independent"], rollbackOrContainmentStrategy: "no-op; design only",
      prerequisites: ["post-write database audit complete"], nextPhaseAuthorization: "unlocks internal retrieval dry-run only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Run the retrieval-eligibility query against the local-only dry-run rows internally (no Smart Talk wiring), confirming it correctly returns zero eligible rows (since nothing is published).",
      allowedFiles: ["one new internal-dry-run audit file"], forbiddenFiles: ["any existing file", "SQL migrations", "runtime routes"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: true, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["internal dry-run report confirming zero eligible rows"], requiredValidations: ["query returns zero rows because nothing is published"],
      successConditions: ["eligibility query behaves correctly against a known-empty-of-publications data set"], rollbackOrContainmentStrategy: "no-op; read-only query",
      prerequisites: ["retrieval eligibility design complete"], nextPhaseAuthorization: "unlocks first Smart Talk read-only integration design only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: true, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Design (not implement) how Smart Talk Free Q&A could later read published, eligible knowledge read-only, preserving the First Contact residual principle — no Smart Talk file is modified in this phase.",
      allowedFiles: ["one new integration-design .ts file"], forbiddenFiles: ["app/api/smart-talk/route.ts", "app/smart-talk/SmartTalkClient.tsx", "any other existing file"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["integration design document"], requiredValidations: ["design proves read-only access", "no standalone First Contact mode introduced"],
      successConditions: ["design reviewed as read-only and non-invasive"], rollbackOrContainmentStrategy: "no-op; design only",
      prerequisites: ["internal retrieval dry-run complete"], nextPhaseAuthorization: "unlocks multilingual presentation validation only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Validate multilingual presentation behavior against the dry-run fixture only (fallback-to-German, untranslated warning, warning/uncertainty parity across all 6 launch locales) without publishing anything.",
      allowedFiles: ["one new multilingual-validation audit file"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: true, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["multilingual validation report across de/en/sk/cs/pl/hu"], requiredValidations: ["fallback behaves correctly for every unapproved locale"],
      successConditions: ["all six launch locales behave correctly against the fixture"], rollbackOrContainmentStrategy: "no-op; read-only validation",
      prerequisites: ["first Smart Talk read-only integration design complete"], nextPhaseAuthorization: "unlocks stale-source and change-monitoring design only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: true, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Design (not implement) the stale-source detection and change-monitoring job, including which change classes automatically suspend publication eligibility.",
      allowedFiles: ["one new design-document .ts file"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["change-monitoring design document"], requiredValidations: ["every high-impact change class from PHASE 9I is covered"],
      successConditions: ["design reviewed as complete"], rollbackOrContainmentStrategy: "no-op; design only",
      prerequisites: ["multilingual presentation validation complete"], nextPhaseAuthorization: "unlocks emergency suspension test only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Exercise the emergency-suspension path end-to-end against the local-only dry-run rows only, confirming immediate, reversible, fully-audited suspension with zero deletion.",
      allowedFiles: ["one new emergency-suspension-test audit file"], forbiddenFiles: ["any existing file", "SQL migrations"],
      databaseWritePermission: "local_only", networkPermission: false, dockerPermission: true, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["emergency-suspension test report"], requiredValidations: ["suspension is reversible", "zero rows deleted", "audit trail present"],
      successConditions: ["emergency suspension behaves exactly as designed in BLOCKING_GAP_1_DESIGN"], rollbackOrContainmentStrategy: "cleanup script removes the local-only test rows afterward",
      prerequisites: ["stale-source and change-monitoring design complete"], nextPhaseAuthorization: "unlocks publication authorization boundary only",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: true, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: true, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
    { objective: "Define (not exercise) the explicit publication-authorization boundary: the checklist and sign-off structure a future, separately-authorized phase must satisfy before any entity may ever reach publication_state='published'. This phase authorizes nothing.",
      allowedFiles: ["one new boundary-definition .ts file"], forbiddenFiles: ["any existing file", "SQL migrations", "runtime routes"],
      databaseWritePermission: "none", networkPermission: false, dockerPermission: false, remoteDatabasePermission: false, realSourcePermission: false,
      expectedArtifacts: ["publication-authorization checklist, unexercised"], requiredValidations: ["checklist covers every risk class and every launch locale"],
      successConditions: ["boundary defined; zero publication occurs in this phase or any phase in this plan"], rollbackOrContainmentStrategy: "no-op; definition only",
      prerequisites: ["emergency suspension test complete"], nextPhaseAuthorization: "does NOT unlock publication itself — a further, separately-requested and separately-authorized phase is required",
      permitsFileWrites: true, permitsSqlChanges: false, permitsDocker: false, permitsNetwork: false, permitsRealOfficialSourceRetrieval: false,
      permitsLocalDatabaseWrites: false, permitsRemoteDatabaseWrites: false, permitsProductionWrites: false, permitsRuntimeChanges: false, permitsPublication: false },
  ];

  return base.map((b, i) => ({
    ...b,
    phaseId: IMPLEMENTATION_PHASE_IDS[i],
    index: i,
    itemName: IMPLEMENTATION_ITEM_NAMES[i],
  }));
}

const IMPLEMENTATION_PLAN_PHASES: readonly ImplementationPhase[] = buildImplementationPhases();

// ============================================================================
// F. FIRST PROCESS PACK DATA MODEL PLAN
// ============================================================================

interface PlannedUnit {
  unit: string;
  canonicalIdentityStrategy: string;
  parentRelationship: string;
  versioningBehavior: string;
  evidenceRequirements: string;
  reviewRequirements: string;
  publicationRequirements: string;
  translationRequirements: string;
  jurisdictionRequirements: string;
  effectiveDateRequirements: string;
  supersessionBehavior: string;
  withdrawalBehavior: string;
}

const FIRST_PACK_DATA_MODEL_PLAN: readonly PlannedUnit[] = [
  { unit: "process-pack identity", canonicalIdentityStrategy: "knowledge_processes.process_group_id = 'anmeldung_ummeldung_abmeldung' (already a valid CHECK-constraint value)",
    parentRelationship: "top-level; jurisdiction_id required", versioningBehavior: "new knowledge_processes row per materially-changed variant; old row marked superseded",
    evidenceRequirements: "none at the identity level; evidence lives on the claims/steps it links to", reviewRequirements: "review_status must reach human_reviewed before publication_eligible",
    publicationRequirements: "requires the future publication_state extension (Gap 1)", translationRequirements: "title/summary require the future translation extension (Gap 2)",
    jurisdictionRequirements: "jurisdiction_id required; territorial_scope_id optional for the federal baseline row", effectiveDateRequirements: "effective_from/effective_until columns already present",
    supersessionBehavior: "status='superseded' on the old row; a new row is created, never mutated in place", withdrawalBehavior: "requires the future withdrawn state (Gap 1)" },
  { unit: "process variants (anmeldung/ummeldung/abmeldung)", canonicalIdentityStrategy: "distinct knowledge_processes rows sharing process_group_id, distinguished by title/trigger_description",
    parentRelationship: "siblings under the same process_group_id", versioningBehavior: "each variant versions independently",
    evidenceRequirements: "variant-selection evidence lives on knowledge_process_claim_links to the relevant trigger claims", reviewRequirements: "same as process-pack identity",
    publicationRequirements: "each variant needs its own publication_state row (Gap 1)", translationRequirements: "each variant needs its own translation rows (Gap 2)",
    jurisdictionRequirements: "same jurisdiction rules as identity", effectiveDateRequirements: "same as identity",
    supersessionBehavior: "same as identity, per-variant", withdrawalBehavior: "same as identity, per-variant" },
  { unit: "jurisdiction overlays", canonicalIdentityStrategy: "knowledge_regional_overrides rows keyed by (base_rule_entity_type, base_rule_entity_id, override_rule_entity_type, override_rule_entity_id)",
    parentRelationship: "references the base federal-baseline entity plus territorial_scope_id for the overlay", versioningBehavior: "append-oriented; a changed overlay is a new row, old row retained",
    evidenceRequirements: "source_version_id required (not nullable) and passage_id optional", reviewRequirements: "review_status + conflict_status tracked per overlay",
    publicationRequirements: "inherits the base entity's publication_state (Gap 1) plus its own", translationRequirements: "n/a directly; overlays affect which claim text is shown, not translation itself",
    jurisdictionRequirements: "territorial_scope_id required (not nullable)", effectiveDateRequirements: "effective_from/effective_until present",
    supersessionBehavior: "old overlay rows are never overwritten; substantive_law_changed flag distinguishes a true legal change from a re-statement", withdrawalBehavior: "requires the future withdrawn state (Gap 1)" },
  { unit: "process steps", canonicalIdentityStrategy: "knowledge_process_steps rows, unique(process_id, step_order)",
    parentRelationship: "process_id FK, required responsible_actor_rule_id FK", versioningBehavior: "step_order is stable per process version; a materially-changed step is a new row under a new process version",
    evidenceRequirements: "linked claims via knowledge_process_claim_links, each requiring citation", reviewRequirements: "review_status per step",
    publicationRequirements: "requires Gap 1 extension", translationRequirements: "title/description_canonical require Gap 2 extension",
    jurisdictionRequirements: "inherited from the parent process, overlaid via knowledge_regional_overrides where needed", effectiveDateRequirements: "effective_from/effective_until present",
    supersessionBehavior: "old step row retained, superseded via the parent process's supersession", withdrawalBehavior: "requires Gap 1 extension" },
  { unit: "claim units", canonicalIdentityStrategy: "knowledge_claims rows; claim_language fixed 'de', market fixed 'DE'",
    parentRelationship: "jurisdiction_id required; linked to process/steps via knowledge_process_claim_links", versioningBehavior: "status='superseded' + new row; never mutated in place once cited",
    evidenceRequirements: "requires_citation fixed true; at least one knowledge_claim_evidence_links + knowledge_citations row with source_version_id and passage_id both non-null", reviewRequirements: "review_status must reach at least human_reviewed for any non-informational risk_level",
    publicationRequirements: "requires Gap 1 extension", translationRequirements: "claim_text_canonical requires Gap 2 extension",
    jurisdictionRequirements: "jurisdiction_id required; territorial_scope_id optional", effectiveDateRequirements: "effective_from/effective_until present, requires_effective_date flag per claim",
    supersessionBehavior: "status='superseded'; historical rows remain queryable", withdrawalBehavior: "requires Gap 1 extension" },
  { unit: "document-requirement units", canonicalIdentityStrategy: "knowledge_evidence_requirements + knowledge_form_requirements rows",
    parentRelationship: "required_by_process_id / required_by_step_id / form_id FKs", versioningBehavior: "append-oriented per effective_from/effective_until window",
    evidenceRequirements: "source_version_id/passage_id on knowledge_form_requirements is required (not nullable)", reviewRequirements: "review_status per requirement",
    publicationRequirements: "requires Gap 1 extension", translationRequirements: "presentation text requires Gap 2 extension",
    jurisdictionRequirements: "jurisdiction_id/territorial_scope_id on knowledge_evidence_requirements (nullable, must be set for any non-federal-baseline requirement)", effectiveDateRequirements: "effective_from/effective_until present",
    supersessionBehavior: "new row on change; required_status transitions tracked, not overwritten silently", withdrawalBehavior: "requires Gap 1 extension" },
  { unit: "deadline units", canonicalIdentityStrategy: "knowledge_deadline_rules rows",
    parentRelationship: "jurisdiction_id required; optional authority_id/territorial_scope_id; linked from knowledge_process_steps.deadline_rule_id", versioningBehavior: "append-oriented; conflict_status tracked",
    evidenceRequirements: "source_version_id + passage_id both required (not nullable)", reviewRequirements: "review_status + risk_level required",
    publicationRequirements: "requires Gap 1 extension", translationRequirements: "explanation text requires Gap 2 extension",
    jurisdictionRequirements: "jurisdiction_id required", effectiveDateRequirements: "effective_from/effective_until present; exact_calculation_allowed defaults false",
    supersessionBehavior: "new row on change; conflict_status='open' until resolved", withdrawalBehavior: "requires Gap 1 extension" },
  { unit: "authority-resolution units", canonicalIdentityStrategy: "knowledge_authorities + knowledge_authority_competences rows",
    parentRelationship: "publisher_id, jurisdiction_id, territorial_scope_id required on knowledge_authorities", versioningBehavior: "competence rows are effective-dated and append-oriented; unique(authority_id, subject_matter, territorial_scope_id, effective_from)",
    evidenceRequirements: "competence_source_version_id required (not nullable); competence_passage_id optional", reviewRequirements: "review_status + conflict_status per competence row",
    publicationRequirements: "requires Gap 1 extension for the authority/competence rows themselves", translationRequirements: "guidance text requires Gap 2 extension",
    jurisdictionRequirements: "jurisdiction_id + territorial_scope_id both required on knowledge_authorities", effectiveDateRequirements: "effective_from/effective_until present on competences",
    supersessionBehavior: "new competence row on change; old row retained for historical queries", withdrawalBehavior: "authority status='reorganized' distinguishes withdrawal-like events; full withdrawn state requires Gap 1" },
  { unit: "warnings", canonicalIdentityStrategy: "no dedicated table; warnings are derived at query time from the state of related rows (missing citation, unresolved conflict, stale freshness_status, translation_not_approved, etc.)",
    parentRelationship: "attached conceptually to whichever claim/step/translation triggered the warning", versioningBehavior: "n/a; computed, not stored",
    evidenceRequirements: "n/a", reviewRequirements: "n/a",
    publicationRequirements: "warnings must always be computed and shown regardless of publication_state, never suppressed", translationRequirements: "warning text itself requires Gap 2 extension to be localized",
    jurisdictionRequirements: "n/a", effectiveDateRequirements: "n/a",
    supersessionBehavior: "n/a", withdrawalBehavior: "n/a" },
  { unit: "outcomes", canonicalIdentityStrategy: "no dedicated table; process outcomes are a fixed structural vocabulary applied at the application layer against knowledge_process_steps state, not a stored row per user interaction (no user-content table exists in this schema)",
    parentRelationship: "conceptually attached to a process/step", versioningBehavior: "n/a; vocabulary is fixed by this design, not per-row",
    evidenceRequirements: "n/a", reviewRequirements: "n/a",
    publicationRequirements: "n/a", translationRequirements: "outcome guidance text requires Gap 2 extension",
    jurisdictionRequirements: "n/a", effectiveDateRequirements: "n/a",
    supersessionBehavior: "n/a", withdrawalBehavior: "n/a" },
  { unit: "source citations", canonicalIdentityStrategy: "knowledge_citations rows; claim_id/source_id/source_version_id/passage_id/publisher_id/jurisdiction_id all required (not nullable)",
    parentRelationship: "claim_id FK", versioningBehavior: "append-only; a changed source_version produces a new citation row, old one retained",
    evidenceRequirements: "is itself the evidence-binding mechanism", reviewRequirements: "review is enforced upstream on knowledge_claim_evidence_links.review_accepted",
    publicationRequirements: "a claim cannot be publication_eligible (future Gap 1) without at least one citation row", translationRequirements: "user_facing_label may need Gap 2 extension for full localization",
    jurisdictionRequirements: "jurisdiction_id required", effectiveDateRequirements: "effective_from/effective_until + last_verified_at present",
    supersessionBehavior: "append-only; never overwritten", withdrawalBehavior: "n/a; citations are historical facts, never withdrawn themselves" },
  { unit: "reviews", canonicalIdentityStrategy: "knowledge_review_records rows, polymorphic entity_type+entity_id, chained via supersedes_review_record_id",
    parentRelationship: "polymorphic reference to any reviewable entity", versioningBehavior: "append-only chain; never overwritten",
    evidenceRequirements: "reason/notes fields; high_risk_use_approved flag", reviewRequirements: "is itself the review mechanism",
    publicationRequirements: "a human_reviewed or expert_reviewed record is a prerequisite for the future publication_state to advance past review_required", translationRequirements: "n/a",
    jurisdictionRequirements: "n/a directly; inherited from the reviewed entity", effectiveDateRequirements: "reviewed_at + review_due_at present",
    supersessionBehavior: "new review record supersedes the old via supersedes_review_record_id; old record retained", withdrawalBehavior: "n/a" },
  { unit: "publication state", canonicalIdentityStrategy: "does not exist in migration 032 today (Gap 1); planned as knowledge_publication_states (current) + knowledge_publication_state_transitions (history), both design candidates only",
    parentRelationship: "polymorphic entity_type+entity_id covering all 9 PUBLICATION_STATE_APPLIES_TO kinds", versioningBehavior: "current-state pointer row mutated; full history append-only",
    evidenceRequirements: "every transition requires a review_record_id or system actor_type+reason", reviewRequirements: "human/expert review required for every forward transition past review_required",
    publicationRequirements: "is the publication-requirements mechanism itself", translationRequirements: "n/a directly",
    jurisdictionRequirements: "n/a directly; inherited from the underlying entity", effectiveDateRequirements: "transitioned_at timestamps",
    supersessionBehavior: "superseded is one of the terminal states in the adjacency list", withdrawalBehavior: "withdrawn is one of the terminal states in the adjacency list" },
  { unit: "translations", canonicalIdentityStrategy: "term-level exists today (knowledge_localized_terminology); full-text does not (Gap 2); planned as knowledge_canonical_unit_translations, a design candidate only",
    parentRelationship: "(entity_type, entity_id, field_key, output_locale) keyed to the German canonical unit", versioningBehavior: "invalidated_pending_review on German canonical change; old rows retained",
    evidenceRequirements: "sourceCanonicalVersion field ties every translation to the exact German version it translated", reviewRequirements: "human review required before translation_status='approved'",
    publicationRequirements: "a non-German locale cannot be publication_eligible in that locale without an approved translation row; German fallback is always available", translationRequirements: "is the translation mechanism itself",
    jurisdictionRequirements: "inherited from the German canonical unit, never altered by translation", effectiveDateRequirements: "inherited from the German canonical unit, never altered by translation",
    supersessionBehavior: "supersededTimestamp set on invalidation; old row retained for historical queries", withdrawalBehavior: "follows the German canonical unit's withdrawal" },
  { unit: "runtime retrieval metadata", canonicalIdentityStrategy: "knowledge_retrieval_metadata rows, unique(entity_type, entity_id)",
    parentRelationship: "polymorphic entity_type+entity_id", versioningBehavior: "mutable indexing flags only; jurisdiction/effective-date/review-status/trust-domain filter-required flags are schema-fixed true",
    evidenceRequirements: "n/a directly; gates on upstream evidence via the filter-required flags", reviewRequirements: "review_status_filter_required is schema-fixed true",
    publicationRequirements: "must additionally check the future publication_state = 'published' (Gap 1) before this metadata is ever set to indexed=true", translationRequirements: "must gate per-locale on the future translation approval (Gap 2) or German fallback",
    jurisdictionRequirements: "jurisdiction_filter_required is schema-fixed true", effectiveDateRequirements: "effective_date_filter_required is schema-fixed true",
    supersessionBehavior: "indexing flags flip to false immediately on supersession", withdrawalBehavior: "indexing flags flip to false immediately on withdrawal" },
];

// ============================================================================
// G. INGESTION RUN MODEL (schema-design candidate only; no table created)
// ============================================================================

const INGESTION_RUN_FIELDS = [
  "ingestionRunId", "processPackId", "sourceCandidateIds", "runMode", "startedTimestamp", "completedTimestamp",
  "status", "stageCheckpoints", "deterministicInputFingerprint", "producedCandidateIds", "reviewRequiredCount",
  "failureCount", "retryCount", "idempotencyKey", "lockConcurrencyKey", "operatorOrAutomationIdentity",
  "noPublicationByDefaultFlag", "auditTrace", "containmentStatus",
] as const;

const INGESTION_RUN_STATES = [
  "planned", "acquiring", "acquired", "normalized", "segmented", "extracted", "evidence_bound",
  "review_pending", "reviewed", "write_authorized", "written", "validated", "publication_pending",
  "completed", "failed", "contained", "cancelled",
] as const;

const INGESTION_RUN_MODEL = {
  fields: INGESTION_RUN_FIELDS,
  states: INGESTION_RUN_STATES,
  candidateTableName: "knowledge_ingestion_runs (schema-design candidate only, not created in this phase or any phase in this plan)",
  createdInThisPhase: false,
  noPublicationByDefault: true,
} as const;

// ============================================================================
// H. HUMAN REVIEW PLAN
// ============================================================================

const REVIEWER_ROLES = [
  "source_trust_reviewer", "factual_claim_reviewer", "jurisdiction_reviewer", "effective_date_reviewer",
  "high_risk_claim_reviewer", "translation_reviewer", "publication_authorizer", "emergency_suspension_authorizer",
] as const;

const HUMAN_REVIEW_PLAN = {
  reviewerRoles: REVIEWER_ROLES,
  separationOfDuties:
    "The reviewer who authorizes publication for a given entity must not be the same actor who created or extracted the underlying claim candidate; enforced by comparing actor identity between the extraction audit_event and the review_record.",
  minimumReviewerCountByRiskClass: [
    { riskClass: "informational", minimumReviewers: 0 },
    { riskClass: "procedural", minimumReviewers: 1 },
    { riskClass: "document_requirement", minimumReviewers: 1 },
    { riskClass: "deadline", minimumReviewers: 1 },
    { riskClass: "financial_payment", minimumReviewers: 2 },
    { riskClass: "sanction_consequence", minimumReviewers: 2 },
    { riskClass: "eligibility", minimumReviewers: 2 },
    { riskClass: "legal_status_effect", minimumReviewers: 2 },
    { riskClass: "immigration_residence", minimumReviewers: 2 },
    { riskClass: "health_insurance_coverage", minimumReviewers: 1 },
    { riskClass: "cross_border_coordination", minimumReviewers: 2 },
  ] as const,
  selfApprovalRestrictions: "No actor may approve a review_record for an entity they authored or extracted; enforced structurally via actor-identity comparison, not merely by convention.",
  reReviewTriggers: [
    "source content_hash changed", "freshness_status downgraded to stale/expired", "a conflict is newly detected",
    "a translation's underlying German canonical unit changed", "a scheduled review_due_at has passed",
  ] as const,
  staleReviewThresholds: "review_due_at is required for every review_record; freshness_status='stale' or 'expired' forces re-review before any forward publication-state transition.",
  conflictEscalation: "Any conflict with severity in ('high','critical') sets blocks_high_risk_use=true and requires expert_reviewed (not merely human_reviewed) resolution before it can be cleared.",
  auditEvidence: "Every review decision produces a knowledge_review_records row and a corresponding knowledge_audit_events row with previous/new state hashes.",
  rejectionBehavior: "A rejected candidate/claim never reaches knowledge_claims in an active state usable for output; it is recorded as rejected via the review_record and never silently discarded without a trace.",
  revisionBehavior: "A revision after rejection creates a new candidate/claim version referencing the rejected one; the rejected version is never edited in place.",
  emergencyOverrideBoundary:
    "Emergency suspension may be triggered by a single authorized reviewer (emergency_suspension_authorizer role) without the normal multi-reviewer quorum, but must always produce a review_record and audit_event, and can only ever move an entity toward 'suspended' — never toward 'published' or toward deletion.",
  noGuaranteedAvailabilityOfLegalProfessional:
    "This plan represents reviewer qualification requirements structurally (e.g. expert_reviewed review_status, role-based minimums) and never assumes a licensed legal professional is always available; high-risk claims that cannot obtain the required review level remain blocked from publication rather than being approved by a lower-qualified reviewer.",
} as const;

// ============================================================================
// I. FIRST SOURCE ACQUISITION BOUNDARY
// ============================================================================

const FIRST_SOURCE_ACQUISITION_BOUNDARY = {
  onlyOfficialGermanSources: true,
  exactSourceAllowlisting: "A single, explicitly-reviewed allowlist of official domains (e.g. federal-ministry / *.bund.de-style official domains) — no wildcard or heuristic domain matching is used for the first acquisition.",
  canonicalUrlVerification: "The exact canonical_url must be present on the reviewed allowlist entry before any fetch is attempted.",
  robotsAccessCompliance: "robots.txt is fetched and honored before any content fetch; a disallow blocks the acquisition entirely.",
  mimeVerification: "Content-Type must match the expected class (text/html for the first acquisition) or the retrieval is treated as failed.",
  immutableRawContentFingerprint: "sha256 of the normalized retrieved text, computed and stored immediately, never recomputed differently later for the same retrieval.",
  sourceRetrievalTimestamp: "Recorded separately from any publication/effective date the source itself states.",
  sourceLanguageVerification: "Detected language must be 'de'; a mismatch blocks the acquisition pending manual review.",
  noAuthenticationBypass: true,
  noBulkCrawling: true,
  oneNarrowlyScopedSourceSet: true,
  noDatabaseWriteDuringFirstAcquisition: true,
  noPublicationDuringFirstAcquisition: true,
  noRuntimeRetrievalDuringFirstAcquisition: true,
  decidedFirstSourceClass: "one_federal_baseline_source" as const,
  rationale:
    "A federal-baseline source has the lowest jurisdiction-conflict risk (no Bundesland/municipality overlay to reconcile yet) and is the most stable starting point before introducing municipality-specific variation. A municipality or service-portal source is deferred to a later, separately-scoped acquisition once the federal baseline pipeline is proven.",
} as const;

// ============================================================================
// J. DATABASE WRITE AUTHORIZATION BOUNDARY
// ============================================================================

const DATABASE_WRITE_AUTHORIZATION_BOUNDARY = {
  firstWritePhaseId: IMPLEMENTATION_PLAN_PHASES[15]?.phaseId ?? "unresolved",
  firstWriteItemName: IMPLEMENTATION_PLAN_PHASES[15]?.itemName ?? "unresolved",
  requiredPriorAudits: [
    "publication/translation schema extension implemented (PHASE 9K-9M)",
    "isolated migration validation passed (PHASE 9N)",
    "ingestion tooling audit passed (PHASE 9Q-9T)",
    "source acquisition audit passed (PHASE 9Y)",
    "candidate extraction audit passed (PHASE 9T)",
    "citation binding audit passed (covered inside ingestion contract implementation, PHASE 9Q)",
    "human-review workflow audit passed (PHASE 9U)",
    "idempotency audit passed (covered inside ingestion contract implementation, PHASE 9Q)",
    "synthetic dry-run passed (PHASE 9X)",
    "explicit database target verification (local-only, never staging/production)",
    "explicit local/staging/production distinction documented",
    "rollback or cleanup plan authored and reviewed",
    "write-set preview authored and reviewed",
    "record-count ceiling defined and reviewed",
    "no publication authorization granted at this stage",
  ] as const,
  databaseTargetMustBeExplicit: true,
  localStagingProductionDistinctionRequired: true,
  rollbackOrCleanupPlanRequired: true,
  writeSetPreviewRequired: true,
  recordCountCeilingRequired: true,
  noPublicationAuthorizationAtThisStage: true,
  mustNotBeProductionUnlessSeparatelyAuthorized: true,
} as const;

// ============================================================================
// K. RUNTIME RETRIEVAL BOUNDARY
// ============================================================================

const RUNTIME_RETRIEVAL_REQUIRED_CONDITIONS = [
  "canonical German record approved", "source version current or explicitly historical", "passage citation valid",
  "jurisdiction resolved or explicitly unknown", "effective date valid for query time", "no unresolved source conflict",
  "publication state published", "not suspended", "not withdrawn", "not superseded for current-time retrieval",
  "translation approved for requested locale or German fallback used", "retrieval metadata explicitly active",
  "risk-class-specific review complete",
] as const;

const RUNTIME_RETRIEVAL_BOUNDARY = {
  requiredConditions: RUNTIME_RETRIEVAL_REQUIRED_CONDITIONS,
  allConditionsAreMandatoryAnd: true,
  localeMustNotSelectJurisdiction: true,
  smartTalkMustRemainReadOnly: true,
} as const;

// ============================================================================
// L. FIRST-CONTACT RESIDUAL PRINCIPLE
// ============================================================================

const FIRST_CONTACT_RESIDUAL_PRINCIPLE = {
  standaloneFirstContactModeIntroduced: false,
  sameFactualCore: true,
  sameEvidenceGates: true,
  sameJurisdictionLogic: true,
  sameWarnings: true,
  sameUncertainty: true,
  simplerSequencingOnly: true,
  noPatronizingLanguage: true,
  noProcessVariantSelectionWithoutSufficientContext: true,
} as const;

// ============================================================================
// M. MULTILINGUAL IMPLEMENTATION BOUNDARY
// ============================================================================

const MULTILINGUAL_IMPLEMENTATION_BOUNDARY = {
  launchLocales: LAUNCH_LOCALES,
  futureInactiveLocales: FUTURE_LOCALES,
  canonicalGermanAuthoringWorkflow: "All claim/process/step text is authored and reviewed in German first; no translation candidate may be created before its German canonical unit is at least machine_prechecked.",
  translationCandidateCreation: "Created only from an existing German canonical unit reference; never authored independently.",
  glossaryBinding: "Every translation references a terminologyGlossaryVersion so terminology drift across the glossary can be detected and re-reviewed.",
  translationReview: "Requires a human translation_reviewer distinct from the translator/machine-generation actor.",
  canonicalVersionInvalidation: "Any German canonical change invalidates all existing translations for that unit, per BLOCKING_GAP_2_DESIGN.",
  fallbackBehavior: "German canonical text plus the 'translation_not_approved' warning when no approved translation exists for the requested locale.",
  missingTranslationBehavior: "Never blank; always German fallback plus explicit warning.",
  warningParity: "Every warning attached to the German canonical unit must be preserved verbatim in meaning in every approved translation; enforced by the warningsEquivalent-style boolean already present on knowledge_localized_terminology and proposed for the Gap-2 extension.",
  terminologyConsistencyChecks: "Terminology used in a translated claim/step must match the bound glossary entry's approved localized_term for that locale.",
  noMachineTranslationAutoPublication: true,
  phasedLanguageEnablement: "Launch locales are enabled via the existing/extended CHECK constraint; future locales remain structurally un-insertable until a future migration explicitly widens it.",
  runtimeFeatureFlagBoundaryPerLocale: "Even once a locale is schema-enabled, runtime exposure of that locale is gated separately by the retrieval-eligibility check (translation approved or German fallback), not by the schema CHECK constraint alone.",
} as const;

// ============================================================================
// N. DE↔SK BOUNDARY
// ============================================================================

const DE_SK_BOUNDARY = {
  connectorRepresentableButInactive: true,
  firstPlannedPilot: FIRST_CROSS_BORDER_PILOT,
  activationRule: "The DE<->SK connector activates only from verified case context (e.g. a resolved cross-border claim chain), never from interface locale alone.",
  anmeldungPackContainsCrossBorderClaims: false,
  deSkConnectorImplementedThisPhase: false,
} as const;

// ============================================================================
// O. SCHEMA SUFFICIENCY VERDICT
// ============================================================================

interface SufficiencyVerdict {
  dimension: string;
  technicallyRepresentable: boolean;
  governanceSafe: boolean;
  implementationReady: boolean;
  publicationReady: boolean;
  productionReady: boolean;
  sufficient: boolean;
  rationale: string;
}

const SCHEMA_SUFFICIENCY_VERDICT: readonly SufficiencyVerdict[] = [
  { dimension: "synthetic_implementation_planning", technicallyRepresentable: true, governanceSafe: true, implementationReady: true, publicationReady: false, productionReady: false, sufficient: true,
    rationale: "All 33 existing tables are sufficient to design and plan the full first-pack implementation without any schema change." },
  { dimension: "real_source_acquisition", technicallyRepresentable: true, governanceSafe: true, implementationReady: true, publicationReady: false, productionReady: false, sufficient: true,
    rationale: "knowledge_sources/knowledge_source_versions/knowledge_source_passages already exist and are schema-sufficient for fetch/hash/store; governance readiness (allowlisting, tooling) is a separate, still-unmet readiness gate, not a schema gap." },
  { dimension: "controlled_candidate_extraction", technicallyRepresentable: true, governanceSafe: true, implementationReady: true, publicationReady: false, productionReady: false, sufficient: true,
    rationale: "knowledge_claims/knowledge_process_steps already support review_status='machine_prechecked' as a trust ceiling; no schema change is required to represent unreviewed candidates." },
  { dimension: "controlled_database_write", technicallyRepresentable: true, governanceSafe: true, implementationReady: true, publicationReady: false, productionReady: false, sufficient: true,
    rationale: "A controlled dry-run only ever writes draft/unreviewed rows, which none of the 7 gaps affect; publication_state is never reached in a dry-run by design." },
  { dimension: "publication", technicallyRepresentable: false, governanceSafe: false, implementationReady: false, publicationReady: false, productionReady: false, sufficient: false,
    rationale: "No explicit, auditable publication_state exists yet (Gap 1); publication eligibility would have to be inferred from a fragile combination of columns, which this design explicitly rejects." },
  { dimension: "multilingual_runtime_retrieval", technicallyRepresentable: false, governanceSafe: false, implementationReady: false, publicationReady: false, productionReady: false, sufficient: false,
    rationale: "No full-text canonical-unit translation layer exists yet (Gap 2); only glossary-level terminology can be localized today, which is insufficient for claim/step/warning presentation in non-German locales." },
];

function sufficiency(dim: string): SufficiencyVerdict {
  const found = SCHEMA_SUFFICIENCY_VERDICT.find((v) => v.dimension === dim);
  if (!found) throw new Error(`missing sufficiency verdict for ${dim}`);
  return found;
}

// ============================================================================
// RESULT INTERFACE
// ============================================================================

interface Result {
  checkId: "9J";
  allPassed: boolean;
  planningOnly: boolean;

  createdFileCount: number;
  modifiedExistingFileCount: number;
  existingFileModified: boolean;
  onlyExpectedFilesChanged: boolean;
  newAuditFileCreated: boolean;

  expectedHead: string;
  actualHead: string;
  headMatchesExpected: boolean;

  targetMigrationInspected: boolean;
  phase9IInspected: boolean;
  migration032Modified: boolean;
  expectedKnowledgeTableCount: number;
  actualKnowledgeTableCountObservedFromMigration: number;
  rlsEnabledTableCountObservedFromMigration: number;
  migrationHasInsertStatements: boolean;
  migrationHasAnonOrAuthenticatedPolicy: boolean;

  schemaGapCount: number;
  blockingSchemaGapCount: number;
  blockingGapIds: readonly string[];
  allSchemaGapsClassified: boolean;
  publicationStateGapRemainsBlocking: boolean;
  canonicalTranslationGapRemainsBlocking: boolean;
  futureSchemaMigrationRequired: boolean;
  destructiveSchemaChangeProposed: boolean;
  backfillRequiredBeforeFirstIngestion: boolean;

  implementationPhaseCount: number;

  firstProcessPackId: string;
  firstProcessPackFamily: string;
  processVariantCount: number;

  canonicalSourceLanguage: string;
  supportedLaunchLanguageCount: number;
  futureInactiveLanguageCount: number;

  standaloneFirstContactModeIntroduced: boolean;
  crossBorderConnectorActivated: boolean;
  firstPlannedCrossBorderPilot: string;
  localeUsedForJurisdiction: boolean;
  machineTranslationAutoPublicationAllowed: boolean;
  automaticHighRiskPublicationAllowed: boolean;

  realSourceFetched: boolean;
  realGovernmentContentStored: boolean;
  databaseWritePerformed: boolean;
  remoteDatabaseUsed: boolean;
  dockerStarted: boolean;
  supabaseStarted: boolean;
  sqlMigrationCreated: boolean;
  runtimeRetrievalEnabled: boolean;
  germanKnowledgePackPublished: boolean;
  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;

  migration032SufficientForSyntheticPlanning: boolean;
  migration032SufficientForRealSourceAcquisition: boolean;
  migration032SufficientForCandidateExtraction: boolean;
  migration032SufficientForControlledDatabaseWrite: boolean;
  migration032SufficientForPublication: boolean;
  migration032SufficientForMultilingualRuntimeRetrieval: boolean;

  // Extended tamper-checkable invariants (beyond the REQUIRED REPORT FIELDS list)
  publicationStateDesignUsesAppendOnlyHistory: boolean;
  publicationHistoryAppendOnly: boolean;
  supersededRecordsEverDeleted: boolean;
  translationRequiresCanonicalGermanReference: boolean;
  translationCanBecomeIndependentLegalTruth: boolean;
  germanCanonicalChangeInvalidatesTranslations: boolean;
  realDeadlineInserted: boolean;
  realFeeInserted: boolean;
  realDocumentRequirementInserted: boolean;
  realAuthorityAddressInserted: boolean;
  realGovernmentUrlInserted: boolean;
  ingestionAndPublicationKeptSeparate: boolean;
  databaseWriteAndProductionPublicationKeptSeparate: boolean;
  schemaMigrationAndRemoteApplicationKeptSeparate: boolean;
  highRiskReviewCanBeBypassed: boolean;
  claimWithoutCitationPermitted: boolean;
  citationWithoutSourceVersionPermitted: boolean;
  unresolvedConflictCanBePublished: boolean;
  futureEffectiveClaimTreatedAsCurrent: boolean;
  historicalClaimTreatedAsCurrent: boolean;
  withdrawnClaimRuntimeVisible: boolean;
  suspendedClaimRuntimeVisible: boolean;
  supersededClaimCurrentVisible: boolean;
  partialFailedIngestionCanPublish: boolean;
  duplicateConcurrentIngestionContained: boolean;

  tamperCaseCount: number;
  tamperCasesRejectedCount: number;
  tamperCasesRejected: number;

  readyForPublicationAndTranslationSchemaExtensionDesign: boolean;
  readyForRealGermanSourceIngestion: boolean;
  readyForControlledDatabaseWrite: boolean;
  readyForRuntimeRetrieval: boolean;
  nextRecommendedPhase: string;

  schemaGapResolutions: readonly SchemaGapResolution[];
  blockingGap1Design: typeof BLOCKING_GAP_1_DESIGN;
  blockingGap2Design: typeof BLOCKING_GAP_2_DESIGN;
  proposedMigrationBoundary: typeof PROPOSED_MIGRATION_BOUNDARY;
  implementationPlanPhases: readonly ImplementationPhase[];
  firstPackDataModelPlan: readonly PlannedUnit[];
  ingestionRunModel: typeof INGESTION_RUN_MODEL;
  humanReviewPlan: typeof HUMAN_REVIEW_PLAN;
  firstSourceAcquisitionBoundary: typeof FIRST_SOURCE_ACQUISITION_BOUNDARY;
  databaseWriteAuthorizationBoundary: typeof DATABASE_WRITE_AUTHORIZATION_BOUNDARY;
  runtimeRetrievalBoundary: typeof RUNTIME_RETRIEVAL_BOUNDARY;
  firstContactResidualPrinciple: typeof FIRST_CONTACT_RESIDUAL_PRINCIPLE;
  multilingualImplementationBoundary: typeof MULTILINGUAL_IMPLEMENTATION_BOUNDARY;
  deSkBoundary: typeof DE_SK_BOUNDARY;
  schemaSufficiencyVerdict: readonly SufficiencyVerdict[];

  notes: string[];
}

// ============================================================================
// TAMPER HARNESS
// ============================================================================

type TamperCase = { id: number; description: string; mutate: (r: Result) => void };

const TAMPER_CASES: readonly TamperCase[] = [
  { id: 1, description: "marking both blocking gaps as non-blocking", mutate: (r) => { r.blockingSchemaGapCount = 0; r.publicationStateGapRemainsBlocking = false; r.canonicalTranslationGapRemainsBlocking = false; } },
  { id: 2, description: "permitting real ingestion before schema-gap resolution", mutate: (r) => { r.readyForRealGermanSourceIngestion = true; } },
  { id: 3, description: "permitting publication without explicit publication state", mutate: (r) => { r.germanKnowledgePackPublished = true; r.publicationStateGapRemainsBlocking = true; } },
  { id: 4, description: "using a boolean published flag with no history", mutate: (r) => { r.publicationStateDesignUsesAppendOnlyHistory = false; } },
  { id: 5, description: "destructive overwrite of publication history", mutate: (r) => { r.publicationHistoryAppendOnly = false; } },
  { id: 6, description: "deleting superseded records", mutate: (r) => { r.supersededRecordsEverDeleted = true; } },
  { id: 7, description: "translation stored without canonical German reference", mutate: (r) => { r.translationRequiresCanonicalGermanReference = false; } },
  { id: 8, description: "translation treated as independent truth", mutate: (r) => { r.translationCanBecomeIndependentLegalTruth = true; } },
  { id: 9, description: "machine translation auto-published", mutate: (r) => { r.machineTranslationAutoPublicationAllowed = true; } },
  { id: 10, description: "German canonical change not invalidating translation", mutate: (r) => { r.germanCanonicalChangeInvalidatesTranslations = false; } },
  { id: 11, description: "locale used as jurisdiction", mutate: (r) => { r.localeUsedForJurisdiction = true; } },
  { id: 12, description: "standalone First Contact mode reintroduced", mutate: (r) => { r.standaloneFirstContactModeIntroduced = true; } },
  { id: 13, description: "DE<->SK connector activated", mutate: (r) => { r.crossBorderConnectorActivated = true; } },
  { id: 14, description: "real deadline inserted", mutate: (r) => { r.realDeadlineInserted = true; } },
  { id: 15, description: "real fee inserted", mutate: (r) => { r.realFeeInserted = true; } },
  { id: 16, description: "real document requirement inserted", mutate: (r) => { r.realDocumentRequirementInserted = true; } },
  { id: 17, description: "real authority address inserted", mutate: (r) => { r.realAuthorityAddressInserted = true; } },
  { id: 18, description: "actual government URL inserted", mutate: (r) => { r.realGovernmentUrlInserted = true; } },
  { id: 19, description: "remote database write permitted", mutate: (r) => { r.remoteDatabaseUsed = true; } },
  { id: 20, description: "production write permitted", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 21, description: "runtime retrieval enabled", mutate: (r) => { r.runtimeRetrievalEnabled = true; } },
  { id: 22, description: "migration 032 modified", mutate: (r) => { r.migration032Modified = true; } },
  { id: 23, description: "SQL migration created in this phase", mutate: (r) => { r.sqlMigrationCreated = true; } },
  { id: 24, description: "existing file modified", mutate: (r) => { r.existingFileModified = true; r.modifiedExistingFileCount = 1; } },
  { id: 25, description: "more than one file created", mutate: (r) => { r.createdFileCount = 2; } },
  { id: 26, description: "source fetched", mutate: (r) => { r.realSourceFetched = true; } },
  { id: 27, description: "database written", mutate: (r) => { r.databaseWritePerformed = true; } },
  { id: 28, description: "Docker started", mutate: (r) => { r.dockerStarted = true; } },
  { id: 29, description: "Supabase started", mutate: (r) => { r.supabaseStarted = true; } },
  { id: 30, description: "publication authorized", mutate: (r) => { r.germanKnowledgePackPublished = true; } },
  { id: 31, description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; } },
  { id: 32, description: "first process-pack ID changed", mutate: (r) => { r.firstProcessPackId = "anmeldung_only"; } },
  { id: 33, description: "canonical source language changed from de", mutate: (r) => { r.canonicalSourceLanguage = "en"; } },
  { id: 34, description: "launch language count changed from 6", mutate: (r) => { r.supportedLaunchLanguageCount = 5; } },
  { id: 35, description: "first planned cross-border pilot changed", mutate: (r) => { r.firstPlannedCrossBorderPilot = "some_other_pilot"; } },
  { id: 36, description: "ingestion and publication combined into one phase", mutate: (r) => { r.ingestionAndPublicationKeptSeparate = false; } },
  { id: 37, description: "database write and production publication combined", mutate: (r) => { r.databaseWriteAndProductionPublicationKeptSeparate = false; } },
  { id: 38, description: "schema migration and remote application combined", mutate: (r) => { r.schemaMigrationAndRemoteApplicationKeptSeparate = false; } },
  { id: 39, description: "unsupported automatic legal-claim approval", mutate: (r) => { r.automaticHighRiskPublicationAllowed = true; } },
  { id: 40, description: "high-risk review bypass", mutate: (r) => { r.highRiskReviewCanBeBypassed = true; } },
  { id: 41, description: "missing citation permitted", mutate: (r) => { r.claimWithoutCitationPermitted = true; } },
  { id: 42, description: "missing source version permitted", mutate: (r) => { r.citationWithoutSourceVersionPermitted = true; } },
  { id: 43, description: "unresolved conflict silently published", mutate: (r) => { r.unresolvedConflictCanBePublished = true; } },
  { id: 44, description: "future-effective claim treated as current", mutate: (r) => { r.futureEffectiveClaimTreatedAsCurrent = true; } },
  { id: 45, description: "historical claim treated as current", mutate: (r) => { r.historicalClaimTreatedAsCurrent = true; } },
  { id: 46, description: "withdrawn claim runtime-visible", mutate: (r) => { r.withdrawnClaimRuntimeVisible = true; } },
  { id: 47, description: "suspended claim runtime-visible", mutate: (r) => { r.suspendedClaimRuntimeVisible = true; } },
  { id: 48, description: "superseded claim current-visible", mutate: (r) => { r.supersededClaimCurrentVisible = true; } },
  { id: 49, description: "partial failed ingestion published", mutate: (r) => { r.partialFailedIngestionCanPublish = true; } },
  { id: 50, description: "duplicate concurrent ingestion uncontained", mutate: (r) => { r.duplicateConcurrentIngestionContained = false; } },
  { id: 51, description: "schemaGapCount tampered to hide a gap", mutate: (r) => { r.schemaGapCount = 6; } },
  { id: 52, description: "expectedKnowledgeTableCount tampered", mutate: (r) => { r.expectedKnowledgeTableCount = 30; } },
  { id: 53, description: "actualKnowledgeTableCountObservedFromMigration tampered", mutate: (r) => { r.actualKnowledgeTableCountObservedFromMigration = 30; } },
  { id: 54, description: "processVariantCount tampered", mutate: (r) => { r.processVariantCount = 1; } },
  { id: 55, description: "readyForControlledDatabaseWrite true while gaps still blocking", mutate: (r) => { r.readyForControlledDatabaseWrite = true; } },
  { id: 56, description: "readyForRuntimeRetrieval true in this phase", mutate: (r) => { r.readyForRuntimeRetrieval = true; } },
  { id: 57, description: "migration032SufficientForPublication forced true", mutate: (r) => { r.migration032SufficientForPublication = true; } },
  { id: 58, description: "migration032SufficientForMultilingualRuntimeRetrieval forced true", mutate: (r) => { r.migration032SufficientForMultilingualRuntimeRetrieval = true; } },
  { id: 59, description: "destructiveSchemaChangeProposed true", mutate: (r) => { r.destructiveSchemaChangeProposed = true; } },
  { id: 60, description: "allPassed true while headMatchesExpected false", mutate: (r) => { r.headMatchesExpected = false; r.allPassed = true; } },
  { id: 61, description: "allPassed true while onlyExpectedFilesChanged false", mutate: (r) => { r.onlyExpectedFilesChanged = false; r.allPassed = true; } },
  { id: 62, description: "readyForPublicationAndTranslationSchemaExtensionDesign true while allPassed false", mutate: (r) => { r.readyForPublicationAndTranslationSchemaExtensionDesign = true; r.allPassed = false; } },
  { id: 63, description: "nextRecommendedPhase changed to an implementation/real-ingestion phase", mutate: (r) => { r.nextRecommendedPhase = "9Q — ingestion contract implementation (real ingestion)"; } },
  { id: 64, description: "allSchemaGapsClassified false while allPassed true", mutate: (r) => { r.allSchemaGapsClassified = false; r.allPassed = true; } },
  { id: 65, description: "futureSchemaMigrationRequired false", mutate: (r) => { r.futureSchemaMigrationRequired = false; } },
];

function runTamperCases(good: Result): { rejected: number; total: number; failures: string[] } {
  let rejected = 0;
  const failures: string[] = [];
  for (const tc of TAMPER_CASES) {
    const mutated = clone(good);
    tc.mutate(mutated);
    const stillPasses = computeExpectedAllPassed(mutated);
    if (!stillPasses) {
      rejected += 1;
    } else {
      failures.push(`#${tc.id} ${tc.description}`);
    }
  }
  return { rejected, total: TAMPER_CASES.length, failures };
}

// ============================================================================
// VALIDATOR
// ============================================================================

function computeExpectedAllPassed(r: Result): boolean {
  const checks: boolean[] = [
    r.checkId === "9J",
    r.planningOnly === true,

    r.createdFileCount === 1,
    r.modifiedExistingFileCount === 0,
    r.existingFileModified === false,
    r.onlyExpectedFilesChanged === true,
    r.newAuditFileCreated === true,

    r.headMatchesExpected === true,
    r.expectedHead === SOURCE_CLOSURE_COMMIT,

    r.targetMigrationInspected === true,
    r.phase9IInspected === true,
    r.migration032Modified === false,
    r.expectedKnowledgeTableCount === EXPECTED_KNOWLEDGE_TABLE_COUNT,
    r.actualKnowledgeTableCountObservedFromMigration === EXPECTED_KNOWLEDGE_TABLE_COUNT,
    r.rlsEnabledTableCountObservedFromMigration === EXPECTED_KNOWLEDGE_TABLE_COUNT,
    r.migrationHasInsertStatements === false,
    r.migrationHasAnonOrAuthenticatedPolicy === false,

    r.schemaGapCount === SCHEMA_GAP_RESOLUTIONS.length,
    r.schemaGapCount === 7,
    r.blockingSchemaGapCount === BLOCKING_GAP_RESOLUTIONS.length,
    r.blockingSchemaGapCount === 2,
    r.blockingGapIds.length === 2,
    r.allSchemaGapsClassified === true,
    r.publicationStateGapRemainsBlocking === true,
    r.canonicalTranslationGapRemainsBlocking === true,
    r.futureSchemaMigrationRequired === true,
    r.destructiveSchemaChangeProposed === false,
    r.backfillRequiredBeforeFirstIngestion === false,

    r.implementationPhaseCount === IMPLEMENTATION_PHASE_COUNT,
    r.implementationPhaseCount === 24,

    r.firstProcessPackId === FIRST_PROCESS_PACK_ID,
    r.firstProcessPackFamily === FIRST_PROCESS_PACK_FAMILY,
    r.processVariantCount === 3,

    r.canonicalSourceLanguage === "de",
    r.supportedLaunchLanguageCount === 6,
    r.futureInactiveLanguageCount === 5,

    r.standaloneFirstContactModeIntroduced === false,
    r.crossBorderConnectorActivated === false,
    r.firstPlannedCrossBorderPilot === FIRST_CROSS_BORDER_PILOT,
    r.localeUsedForJurisdiction === false,
    r.machineTranslationAutoPublicationAllowed === false,
    r.automaticHighRiskPublicationAllowed === false,

    r.realSourceFetched === false,
    r.realGovernmentContentStored === false,
    r.databaseWritePerformed === false,
    r.remoteDatabaseUsed === false,
    r.dockerStarted === false,
    r.supabaseStarted === false,
    r.sqlMigrationCreated === false,
    r.runtimeRetrievalEnabled === false,
    r.germanKnowledgePackPublished === false,
    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,

    r.migration032SufficientForSyntheticPlanning === true,
    r.migration032SufficientForPublication === false,
    r.migration032SufficientForMultilingualRuntimeRetrieval === false,

    r.publicationStateDesignUsesAppendOnlyHistory === true,
    r.publicationHistoryAppendOnly === true,
    r.supersededRecordsEverDeleted === false,
    r.translationRequiresCanonicalGermanReference === true,
    r.translationCanBecomeIndependentLegalTruth === false,
    r.germanCanonicalChangeInvalidatesTranslations === true,
    r.realDeadlineInserted === false,
    r.realFeeInserted === false,
    r.realDocumentRequirementInserted === false,
    r.realAuthorityAddressInserted === false,
    r.realGovernmentUrlInserted === false,
    r.ingestionAndPublicationKeptSeparate === true,
    r.databaseWriteAndProductionPublicationKeptSeparate === true,
    r.schemaMigrationAndRemoteApplicationKeptSeparate === true,
    r.highRiskReviewCanBeBypassed === false,
    r.claimWithoutCitationPermitted === false,
    r.citationWithoutSourceVersionPermitted === false,
    r.unresolvedConflictCanBePublished === false,
    r.futureEffectiveClaimTreatedAsCurrent === false,
    r.historicalClaimTreatedAsCurrent === false,
    r.withdrawnClaimRuntimeVisible === false,
    r.suspendedClaimRuntimeVisible === false,
    r.supersededClaimCurrentVisible === false,
    r.partialFailedIngestionCanPublish === false,
    r.duplicateConcurrentIngestionContained === true,

    r.tamperCaseCount === TAMPER_CASES.length,
    r.tamperCasesRejectedCount <= r.tamperCaseCount,
    r.tamperCasesRejected <= r.tamperCaseCount,

    r.readyForRealGermanSourceIngestion === false,
    r.readyForControlledDatabaseWrite === false,
    r.readyForRuntimeRetrieval === false,

    !(r.readyForPublicationAndTranslationSchemaExtensionDesign === true && r.allPassed === false),
    !(r.readyForPublicationAndTranslationSchemaExtensionDesign === true && r.headMatchesExpected === false),
    !(r.readyForPublicationAndTranslationSchemaExtensionDesign === true && r.allSchemaGapsClassified === false),
    !r.nextRecommendedPhase.toLowerCase().includes("ingestion contract implementation"),
    !r.nextRecommendedPhase.toLowerCase().includes("real ingestion"),
  ];
  return checks.every(Boolean);
}

// ============================================================================
// EVIDENCE COLLECTION (static source inspection + read-only git)
// ============================================================================

interface Evidence {
  onlyExpectedFilesChanged: boolean;
  existingFileModified: boolean;
  newAuditFileCreated: boolean;
  createdFileCount: number;
  modifiedExistingFileCount: number;
  actualHead: string;
  headMatchesExpected: boolean;
  migrationChecksumPresent: boolean;
  actualKnowledgeTableCountObservedFromMigration: number;
  rlsEnabledTableCountObservedFromMigration: number;
  migrationHasInsertStatements: boolean;
  migrationHasAnonOrAuthenticatedPolicy: boolean;
  targetMigrationInspected: boolean;
  migration032Modified: boolean;
  phase9IInspected: boolean;
  phase9IReportsCheckId9I: boolean;
  phase9IReportsSchemaGapCount7: boolean;
  phase9IReportsFirstProcessPackId: boolean;
  notes: string[];
}

function collectEvidence(): Evidence {
  const notes: string[] = [];

  const statusPorcelain = runGitReadOnly("git status --porcelain");
  const trackedLines = statusPorcelain
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const relevantLines = trackedLines.filter((l) => !l.includes(".next/") && !l.includes(".next\\"));

  const untracked = relevantLines.filter((l) => l.startsWith("??")).map((l) => l.replace(/^\?\?\s*/, ""));
  const modifiedOrStaged = relevantLines.filter((l) => !l.startsWith("??"));

  const expectedNewFile = AUDIT_SELF_REL_PATH;
  const unexpectedUntracked = untracked.filter((f) => f.replace(/\\/g, "/") !== expectedNewFile);
  const newAuditFileCreated = untracked.some((f) => f.replace(/\\/g, "/") === expectedNewFile);

  const existingFileModified = modifiedOrStaged.length > 0;
  const onlyExpectedFilesChanged = unexpectedUntracked.length === 0 && !existingFileModified;
  const createdFileCount = untracked.filter((f) => f.replace(/\\/g, "/") === expectedNewFile).length;
  const modifiedExistingFileCount = modifiedOrStaged.length;

  if (unexpectedUntracked.length > 0) notes.push(`Unexpected untracked files: ${unexpectedUntracked.join(", ")}`);
  if (existingFileModified) notes.push(`Unexpected modified/staged files: ${modifiedOrStaged.join(", ")}`);

  const actualHead = runGitReadOnly("git rev-parse --short HEAD");
  const headMatchesExpected = actualHead === SOURCE_CLOSURE_COMMIT;

  const migrationSql = readFileText(MIGRATION_REL_PATH);
  const targetMigrationInspected = migrationSql.length > 0;
  const tableNames = extractKnowledgeTableNames(migrationSql);
  const rlsTables = extractRlsEnabledTables(migrationSql);
  const migrationDiff = runGitReadOnly(`git diff -- ${MIGRATION_REL_PATH}`);
  const migration032Modified = migrationDiff.trim().length > 0;

  const phase9ISrc = readFileText(PHASE_9I_REL_PATH);
  const phase9IInspected = phase9ISrc.length > 0;
  const phase9IReportsCheckId9I = /checkId:\s*"9I"/.test(phase9ISrc);
  const phase9IReportsSchemaGapCount7 = /SCHEMA_GAPS\.length\s*===\s*7/.test(phase9ISrc);
  const phase9IReportsFirstProcessPackId = phase9ISrc.includes(FIRST_PROCESS_PACK_ID);

  if (!phase9IInspected) notes.push(`Could not read ${PHASE_9I_REL_PATH}`);
  if (!targetMigrationInspected) notes.push(`Could not read ${MIGRATION_REL_PATH}`);

  return {
    onlyExpectedFilesChanged,
    existingFileModified,
    newAuditFileCreated,
    createdFileCount,
    modifiedExistingFileCount,
    actualHead,
    headMatchesExpected,
    migrationChecksumPresent: migrationSql.length > 0,
    actualKnowledgeTableCountObservedFromMigration: tableNames.length,
    rlsEnabledTableCountObservedFromMigration: rlsTables.length,
    migrationHasInsertStatements: migrationHasInsertStatements(migrationSql),
    migrationHasAnonOrAuthenticatedPolicy: migrationHasAnonOrAuthenticatedPolicy(migrationSql),
    targetMigrationInspected,
    migration032Modified,
    phase9IInspected,
    phase9IReportsCheckId9I,
    phase9IReportsSchemaGapCount7,
    phase9IReportsFirstProcessPackId,
    notes,
  };
}

// ============================================================================
// GOOD-RESULT CONSTRUCTION
// ============================================================================

function buildGoodResult(evidence: Evidence): Result {
  const blockingGapIds = BLOCKING_GAP_RESOLUTIONS.map((g) => g.id);
  const allSchemaGapsClassified =
    SCHEMA_GAP_RESOLUTIONS.length === 7 &&
    SCHEMA_GAP_RESOLUTIONS.every(
      (g) =>
        typeof g.decision === "string" &&
        g.description.length > 0 &&
        g.affectedMigration032Tables !== undefined
    );

  const publicationStateGapRemainsBlocking = isBlockingDecision(
    SCHEMA_GAP_RESOLUTIONS.find((g) => g.id === "no_dedicated_publication_state_column")!.decision
  );
  const canonicalTranslationGapRemainsBlocking = isBlockingDecision(
    SCHEMA_GAP_RESOLUTIONS.find((g) => g.id === "no_translation_unit_for_full_claim_or_step_text")!.decision
  );

  const designComplete =
    SCHEMA_GAP_RESOLUTIONS.length === 7 &&
    BLOCKING_GAP_RESOLUTIONS.length === 2 &&
    IMPLEMENTATION_PLAN_PHASES.length === IMPLEMENTATION_PHASE_COUNT &&
    IMPLEMENTATION_PLAN_PHASES.length === 24 &&
    new Set(IMPLEMENTATION_PLAN_PHASES.map((p) => p.phaseId)).size === IMPLEMENTATION_PLAN_PHASES.length &&
    IMPLEMENTATION_PLAN_PHASES.every((p) => p.permitsPublication === false) &&
    IMPLEMENTATION_PLAN_PHASES.every((p) => p.permitsProductionWrites === false) &&
    IMPLEMENTATION_PLAN_PHASES.every((p) => p.permitsRemoteDatabaseWrites === false) &&
    IMPLEMENTATION_PLAN_PHASES.every((p) => p.permitsRuntimeChanges === false) &&
    IMPLEMENTATION_PLAN_PHASES.filter((p) => p.permitsLocalDatabaseWrites).length >= 1 &&
    IMPLEMENTATION_PLAN_PHASES.filter((p) => p.permitsSqlChanges).length === 1 &&
    FIRST_PACK_DATA_MODEL_PLAN.length === 15 &&
    INGESTION_RUN_MODEL.fields.length === 19 &&
    INGESTION_RUN_MODEL.states.length === 17 &&
    INGESTION_RUN_MODEL.createdInThisPhase === false &&
    HUMAN_REVIEW_PLAN.reviewerRoles.length === 8 &&
    PUBLICATION_STATES.length === 9 &&
    PUBLICATION_STATE_APPLIES_TO.length === 9 &&
    TRANSLATABLE_UNIT_KINDS.length === 10 &&
    TRANSLATION_UNIT_FIELDS.length === 19 &&
    RUNTIME_RETRIEVAL_REQUIRED_CONDITIONS.length === 13 &&
    LAUNCH_LOCALES.length === 6 &&
    FUTURE_LOCALES.length === 5 &&
    DE_SK_BOUNDARY.deSkConnectorImplementedThisPhase === false &&
    DE_SK_BOUNDARY.anmeldungPackContainsCrossBorderClaims === false &&
    DE_SK_BOUNDARY.firstPlannedPilot === FIRST_CROSS_BORDER_PILOT &&
    FIRST_CONTACT_RESIDUAL_PRINCIPLE.standaloneFirstContactModeIntroduced === false &&
    sufficiency("synthetic_implementation_planning").sufficient === true &&
    sufficiency("publication").sufficient === false &&
    sufficiency("multilingual_runtime_retrieval").sufficient === false &&
    PROPOSED_MIGRATION_BOUNDARY.noDestructiveChangesToExisting33Tables === true &&
    PROPOSED_MIGRATION_BOUNDARY.noProductionApplicationInSamePhase === true;

  const allPassed =
    designComplete &&
    evidence.onlyExpectedFilesChanged &&
    !evidence.existingFileModified &&
    evidence.newAuditFileCreated &&
    evidence.createdFileCount === 1 &&
    evidence.modifiedExistingFileCount === 0 &&
    evidence.headMatchesExpected &&
    evidence.targetMigrationInspected &&
    !evidence.migration032Modified &&
    evidence.actualKnowledgeTableCountObservedFromMigration === EXPECTED_KNOWLEDGE_TABLE_COUNT &&
    evidence.rlsEnabledTableCountObservedFromMigration === EXPECTED_KNOWLEDGE_TABLE_COUNT &&
    !evidence.migrationHasInsertStatements &&
    !evidence.migrationHasAnonOrAuthenticatedPolicy &&
    evidence.phase9IInspected &&
    evidence.phase9IReportsCheckId9I &&
    evidence.phase9IReportsSchemaGapCount7 &&
    evidence.phase9IReportsFirstProcessPackId &&
    allSchemaGapsClassified &&
    publicationStateGapRemainsBlocking &&
    canonicalTranslationGapRemainsBlocking;

  const readyForPublicationAndTranslationSchemaExtensionDesign = allPassed;
  const readyForRealGermanSourceIngestion = false;
  const readyForControlledDatabaseWrite = false;
  const readyForRuntimeRetrieval = false;
  const nextRecommendedPhase = `${PROPOSED_MIGRATION_BOUNDARY.futurePhaseId} — ${PROPOSED_MIGRATION_BOUNDARY.futurePhaseLabel}`;

  return {
    checkId: "9J",
    allPassed,
    planningOnly: true,

    createdFileCount: evidence.createdFileCount,
    modifiedExistingFileCount: evidence.modifiedExistingFileCount,
    existingFileModified: evidence.existingFileModified,
    onlyExpectedFilesChanged: evidence.onlyExpectedFilesChanged,
    newAuditFileCreated: evidence.newAuditFileCreated,

    expectedHead: SOURCE_CLOSURE_COMMIT,
    actualHead: evidence.actualHead,
    headMatchesExpected: evidence.headMatchesExpected,

    targetMigrationInspected: evidence.targetMigrationInspected,
    phase9IInspected: evidence.phase9IInspected,
    migration032Modified: evidence.migration032Modified,
    expectedKnowledgeTableCount: EXPECTED_KNOWLEDGE_TABLE_COUNT,
    actualKnowledgeTableCountObservedFromMigration: evidence.actualKnowledgeTableCountObservedFromMigration,
    rlsEnabledTableCountObservedFromMigration: evidence.rlsEnabledTableCountObservedFromMigration,
    migrationHasInsertStatements: evidence.migrationHasInsertStatements,
    migrationHasAnonOrAuthenticatedPolicy: evidence.migrationHasAnonOrAuthenticatedPolicy,

    schemaGapCount: SCHEMA_GAP_RESOLUTIONS.length,
    blockingSchemaGapCount: BLOCKING_GAP_RESOLUTIONS.length,
    blockingGapIds,
    allSchemaGapsClassified,
    publicationStateGapRemainsBlocking,
    canonicalTranslationGapRemainsBlocking,
    futureSchemaMigrationRequired: true,
    destructiveSchemaChangeProposed: false,
    backfillRequiredBeforeFirstIngestion: false,

    implementationPhaseCount: IMPLEMENTATION_PLAN_PHASES.length,

    firstProcessPackId: FIRST_PROCESS_PACK_ID,
    firstProcessPackFamily: FIRST_PROCESS_PACK_FAMILY,
    processVariantCount: 3,

    canonicalSourceLanguage: "de",
    supportedLaunchLanguageCount: LAUNCH_LOCALES.length,
    futureInactiveLanguageCount: FUTURE_LOCALES.length,

    standaloneFirstContactModeIntroduced: FIRST_CONTACT_RESIDUAL_PRINCIPLE.standaloneFirstContactModeIntroduced,
    crossBorderConnectorActivated: DE_SK_BOUNDARY.deSkConnectorImplementedThisPhase,
    firstPlannedCrossBorderPilot: DE_SK_BOUNDARY.firstPlannedPilot,
    localeUsedForJurisdiction: false,
    machineTranslationAutoPublicationAllowed: false,
    automaticHighRiskPublicationAllowed: false,

    realSourceFetched: false,
    realGovernmentContentStored: false,
    databaseWritePerformed: false,
    remoteDatabaseUsed: false,
    dockerStarted: false,
    supabaseStarted: false,
    sqlMigrationCreated: false,
    runtimeRetrievalEnabled: false,
    germanKnowledgePackPublished: false,
    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,

    migration032SufficientForSyntheticPlanning: sufficiency("synthetic_implementation_planning").sufficient,
    migration032SufficientForRealSourceAcquisition: sufficiency("real_source_acquisition").sufficient,
    migration032SufficientForCandidateExtraction: sufficiency("controlled_candidate_extraction").sufficient,
    migration032SufficientForControlledDatabaseWrite: sufficiency("controlled_database_write").sufficient,
    migration032SufficientForPublication: sufficiency("publication").sufficient,
    migration032SufficientForMultilingualRuntimeRetrieval: sufficiency("multilingual_runtime_retrieval").sufficient,

    publicationStateDesignUsesAppendOnlyHistory: BLOCKING_GAP_1_DESIGN.stateHistoryMustBeAppendOnly,
    publicationHistoryAppendOnly: true,
    supersededRecordsEverDeleted: false,
    translationRequiresCanonicalGermanReference: true,
    translationCanBecomeIndependentLegalTruth: !BLOCKING_GAP_2_DESIGN.noIndependentLegalTruth,
    germanCanonicalChangeInvalidatesTranslations: true,
    realDeadlineInserted: false,
    realFeeInserted: false,
    realDocumentRequirementInserted: false,
    realAuthorityAddressInserted: false,
    realGovernmentUrlInserted: false,
    ingestionAndPublicationKeptSeparate: true,
    databaseWriteAndProductionPublicationKeptSeparate: true,
    schemaMigrationAndRemoteApplicationKeptSeparate: true,
    highRiskReviewCanBeBypassed: false,
    claimWithoutCitationPermitted: false,
    citationWithoutSourceVersionPermitted: false,
    unresolvedConflictCanBePublished: false,
    futureEffectiveClaimTreatedAsCurrent: false,
    historicalClaimTreatedAsCurrent: false,
    withdrawnClaimRuntimeVisible: false,
    suspendedClaimRuntimeVisible: false,
    supersededClaimCurrentVisible: false,
    partialFailedIngestionCanPublish: false,
    duplicateConcurrentIngestionContained: true,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejectedCount: 0,
    tamperCasesRejected: 0,

    readyForPublicationAndTranslationSchemaExtensionDesign,
    readyForRealGermanSourceIngestion,
    readyForControlledDatabaseWrite,
    readyForRuntimeRetrieval,
    nextRecommendedPhase,

    schemaGapResolutions: SCHEMA_GAP_RESOLUTIONS,
    blockingGap1Design: BLOCKING_GAP_1_DESIGN,
    blockingGap2Design: BLOCKING_GAP_2_DESIGN,
    proposedMigrationBoundary: PROPOSED_MIGRATION_BOUNDARY,
    implementationPlanPhases: IMPLEMENTATION_PLAN_PHASES,
    firstPackDataModelPlan: FIRST_PACK_DATA_MODEL_PLAN,
    ingestionRunModel: INGESTION_RUN_MODEL,
    humanReviewPlan: HUMAN_REVIEW_PLAN,
    firstSourceAcquisitionBoundary: FIRST_SOURCE_ACQUISITION_BOUNDARY,
    databaseWriteAuthorizationBoundary: DATABASE_WRITE_AUTHORIZATION_BOUNDARY,
    runtimeRetrievalBoundary: RUNTIME_RETRIEVAL_BOUNDARY,
    firstContactResidualPrinciple: FIRST_CONTACT_RESIDUAL_PRINCIPLE,
    multilingualImplementationBoundary: MULTILINGUAL_IMPLEMENTATION_BOUNDARY,
    deSkBoundary: DE_SK_BOUNDARY,
    schemaSufficiencyVerdict: SCHEMA_SUFFICIENCY_VERDICT,

    notes: [
      `onlyExpectedFilesChanged: ${evidence.onlyExpectedFilesChanged}`,
      `existingFileModified: ${evidence.existingFileModified}`,
      `newAuditFileCreated: ${evidence.newAuditFileCreated}`,
      `headMatchesExpected (${SOURCE_CLOSURE_COMMIT}): ${evidence.headMatchesExpected}`,
      `migration032Modified (git diff): ${evidence.migration032Modified}`,
      `actualKnowledgeTableCountObservedFromMigration (dynamic regex over migration text): ${evidence.actualKnowledgeTableCountObservedFromMigration}`,
      `rlsEnabledTableCountObservedFromMigration: ${evidence.rlsEnabledTableCountObservedFromMigration}`,
      `phase9IInspected (expected source check id ${SOURCE_PACK_DESIGN_CHECK_ID}): ${evidence.phase9IInspected} (checkId 9I found: ${evidence.phase9IReportsCheckId9I}, schemaGapCount 7 found: ${evidence.phase9IReportsSchemaGapCount7}, firstProcessPackId found: ${evidence.phase9IReportsFirstProcessPackId})`,
      `This audit read only committed plain text for migration 032 and the PHASE 9I audit file — neither was imported, executed, or modified.`,
      `Zero sources fetched, zero rows inserted, zero databases (local or remote) touched, zero Docker/Supabase processes started, zero SQL migrations created, zero runtime retrieval activated, zero publication performed.`,
      ...evidence.notes,
    ],
  };
}

// ============================================================================
// ENTRY POINT
// ============================================================================

export function runFirstGermanProcessPackImplementationPlanAndSchemaGapResolutionBoundaryAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);
  const tamperOutcome = runTamperCases(good);

  const allPassed = computeExpectedAllPassed(good) && tamperOutcome.rejected === tamperOutcome.total && good.allPassed;

  return {
    ...good,
    allPassed,
    tamperCasesRejected: tamperOutcome.rejected,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    readyForPublicationAndTranslationSchemaExtensionDesign: allPassed,
    readyForRealGermanSourceIngestion: false,
    readyForControlledDatabaseWrite: false,
    readyForRuntimeRetrieval: false,
    notes: [
      ...good.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(tamperOutcome.failures.length > 0 ? [`Tamper failures: ${tamperOutcome.failures.join("; ")}`] : []),
    ],
  };
}

if (require.main === module) {
  const result = runFirstGermanProcessPackImplementationPlanAndSchemaGapResolutionBoundaryAudit();
  console.log(JSON.stringify(result));
}
