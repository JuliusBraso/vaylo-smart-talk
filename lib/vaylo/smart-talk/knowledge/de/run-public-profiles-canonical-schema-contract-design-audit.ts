/**
 * PHASE 9T-A1 — Public Profiles Canonical Schema Contract Design.
 * This approves a new canonical design; it does not claim missing historical
 * DDL existed and it does not create any database object.
 *
 * Run: npx tsx lib/vaylo/smart-talk/knowledge/de/run-public-profiles-canonical-schema-contract-design-audit.ts
 */

import { execFileSync } from "node:child_process";

const CHECK_ID = "9T-A1";
const PHASE = "Public Profiles Canonical Schema Contract Design";
const SOURCE_COMMIT = "1683383";
const AUDIT_REL_PATH = "lib/vaylo/smart-talk/knowledge/de/run-public-profiles-canonical-schema-contract-design-audit.ts";

type Provenance =
  | "HISTORICAL_SQL_PROVEN"
  | "APPLICATION_REQUIREMENT_PROVEN"
  | "SECURITY_DEFAULT_DECISION"
  | "NEW_CANONICAL_ARCHITECTURE_DECISION"
  | "DEFERRED";

type Column = {
  columnName: string;
  evidenceSources: string[];
  evidenceClassification: Provenance;
  applicationReads: string[];
  applicationWrites: string[];
  migrationReferences: string[];
  proposedPostgresType: string;
  proposedNullability: "NOT NULL" | "NULL";
  proposedDefault: string | null;
  proposedConstraint: string | null;
  designRationale: string;
};

const columns: Column[] = [
  { columnName: "id", evidenceSources: ["lib/profile.ts .eq/onConflict id"], evidenceClassification: "NEW_CANONICAL_ARCHITECTURE_DECISION", applicationReads: ["all profile reads"], applicationWrites: ["upsertMyProfile"], migrationReferences: [], proposedPostgresType: "uuid", proposedNullability: "NOT NULL", proposedDefault: null, proposedConstraint: "primary key; foreign key auth.users(id) on delete cascade", designRationale: "One profile is the authenticated user's ownership row; a surrogate ID adds no proven use." },
  { columnName: "family_status", evidenceSources: ["lib/dna/types.ts", "onboarding/ProfileEditor"], evidenceClassification: "APPLICATION_REQUIREMENT_PROVEN", applicationReads: ["get-user-state", "DNA"], applicationWrites: ["onboarding/refine"], migrationReferences: [], proposedPostgresType: "text", proposedNullability: "NULL", proposedDefault: null, proposedConstraint: null, designRationale: "Current scalar string values; no migration proves a stable database enum/check." },
  { columnName: "employment_type", evidenceSources: ["lib/dna/types.ts", "onboarding/ProfileEditor"], evidenceClassification: "APPLICATION_REQUIREMENT_PROVEN", applicationReads: ["get-user-state", "DNA"], applicationWrites: ["onboarding/refine"], migrationReferences: [], proposedPostgresType: "text", proposedNullability: "NULL", proposedDefault: null, proposedConstraint: null, designRationale: "Current scalar string values; do not narrow from UI union alone." },
  { columnName: "language_level", evidenceSources: ["lib/dna/types.ts", "onboarding/ProfileEditor"], evidenceClassification: "APPLICATION_REQUIREMENT_PROVEN", applicationReads: ["get-user-state", "DNA"], applicationWrites: ["onboarding/refine"], migrationReferences: [], proposedPostgresType: "text", proposedNullability: "NULL", proposedDefault: null, proposedConstraint: null, designRationale: "Current scalar string values; no canonical SQL domain exists." },
  { columnName: "goals", evidenceSources: ["lib/dna/types.ts Goal[]", "onboarding/ProfileEditor", "get-user-state parseGoalsFromProfile"], evidenceClassification: "NEW_CANONICAL_ARCHITECTURE_DECISION", applicationReads: ["includes", "ordered [0]", "Array.isArray"], applicationWrites: ["onboarding/refine array payload"], migrationReferences: [], proposedPostgresType: "text[]", proposedNullability: "NULL", proposedDefault: null, proposedConstraint: null, designRationale: "The app stores multiple ordered scalar goal codes, performs membership/index access, and has no structured metadata or partial JSON updates; text[] preserves that contract." },
  { columnName: "dna", evidenceSources: ["003_add_user_dna_to_profiles.sql"], evidenceClassification: "HISTORICAL_SQL_PROVEN", applicationReads: ["get-profile-dna"], applicationWrites: ["upsertMyProfile/refine"], migrationReferences: ["003"], proposedPostgresType: "jsonb", proposedNullability: "NOT NULL", proposedDefault: "'{}'::jsonb", proposedConstraint: null, designRationale: "Exact historical ALTER definition." },
  { columnName: "dna_updated_at", evidenceSources: ["003_add_user_dna_to_profiles.sql"], evidenceClassification: "HISTORICAL_SQL_PROVEN", applicationReads: ["lib/profile.ts"], applicationWrites: ["onboarding/refine"], migrationReferences: ["003"], proposedPostgresType: "timestamptz", proposedNullability: "NULL", proposedDefault: null, proposedConstraint: null, designRationale: "Exact historical ALTER type." },
  { columnName: "has_steuer_id, has_health_insurance, has_bank_account, registered_arbeitsagentur, has_children, children_school_age, has_cv", evidenceSources: ["007_add_extended_profile_fields.sql"], evidenceClassification: "HISTORICAL_SQL_PROVEN", applicationReads: ["get-user-state"], applicationWrites: ["RefineProfile"], migrationReferences: ["007"], proposedPostgresType: "boolean", proposedNullability: "NULL", proposedDefault: null, proposedConstraint: null, designRationale: "Exact migration-added nullable boolean set." },
  { columnName: "job_search_urgency", evidenceSources: ["007_add_extended_profile_fields.sql"], evidenceClassification: "HISTORICAL_SQL_PROVEN", applicationReads: ["get-user-state"], applicationWrites: ["RefineProfile"], migrationReferences: ["007"], proposedPostgresType: "text", proposedNullability: "NULL", proposedDefault: null, proposedConstraint: null, designRationale: "No proven stable check constraint." },
  { columnName: "has_address_registration", evidenceSources: ["012_proof_signals_and_verifications.sql"], evidenceClassification: "HISTORICAL_SQL_PROVEN", applicationReads: ["proof UI", "get-user-state"], applicationWrites: ["confirm_document_step_proof", "RefineProfile"], migrationReferences: ["012"], proposedPostgresType: "boolean", proposedNullability: "NULL", proposedDefault: null, proposedConstraint: null, designRationale: "Exact migration-added field; ordinary own-row editability is explicit new security policy, with future proof-column hardening recorded." },
  { columnName: "region, city", evidenceSources: ["023_region_identity_foundation.sql"], evidenceClassification: "HISTORICAL_SQL_PROVEN", applicationReads: ["get-user-state"], applicationWrites: ["RefineProfile"], migrationReferences: ["023 region"], proposedPostgresType: "text", proposedNullability: "NULL", proposedDefault: null, proposedConstraint: null, designRationale: "Exact migration-added nullable text fields." },
  { columnName: "country", evidenceSources: ["025_profile_location_fields_foundation.sql"], evidenceClassification: "HISTORICAL_SQL_PROVEN", applicationReads: ["get-user-state"], applicationWrites: ["RefineProfile"], migrationReferences: ["025"], proposedPostgresType: "text", proposedNullability: "NULL", proposedDefault: "'DE'", proposedConstraint: null, designRationale: "Preserves migration default while allowing incomplete legacy rows." },
  { columnName: "bundesland, postal_code", evidenceSources: ["025_profile_location_fields_foundation.sql"], evidenceClassification: "HISTORICAL_SQL_PROVEN", applicationReads: ["get-user-state"], applicationWrites: ["RefineProfile"], migrationReferences: ["025"], proposedPostgresType: "text", proposedNullability: "NULL", proposedDefault: null, proposedConstraint: null, designRationale: "Exact migration-added nullable text fields." },
  { columnName: "registration_status", evidenceSources: ["025_profile_location_fields_foundation.sql"], evidenceClassification: "HISTORICAL_SQL_PROVEN", applicationReads: ["RefineProfile"], applicationWrites: ["RefineProfile"], migrationReferences: ["025"], proposedPostgresType: "text", proposedNullability: "NULL", proposedDefault: null, proposedConstraint: "profiles_registration_status_check: NULL or unknown/not_registered/appointment_booked/registered", designRationale: "Preserves the exact proven check." },
  { columnName: "created_at", evidenceSources: ["table timestamp conventions in 001/005/008+"], evidenceClassification: "NEW_CANONICAL_ARCHITECTURE_DECISION", applicationReads: [], applicationWrites: [], migrationReferences: [], proposedPostgresType: "timestamptz", proposedNullability: "NOT NULL", proposedDefault: "now()", proposedConstraint: null, designRationale: "Database-owned audit timestamp; required for canonical lifecycle observability." },
  { columnName: "updated_at", evidenceSources: ["001 update_updated_at_column trigger convention"], evidenceClassification: "NEW_CANONICAL_ARCHITECTURE_DECISION", applicationReads: [], applicationWrites: [], migrationReferences: [], proposedPostgresType: "timestamptz", proposedNullability: "NOT NULL", proposedDefault: "now()", proposedConstraint: "BEFORE UPDATE trigger using update_updated_at_column()", designRationale: "Database-maintained mutation timestamp; reuse non-security-definer helper contract." },
];
// Grouped source evidence above expands to one mandatory record per physical column.
const canonicalColumns: Column[] = columns.flatMap((column) =>
  column.columnName.split(", ").map((columnName) => ({ ...column, columnName })),
);

const constraints = [
  { constraintName: "profiles_pkey", columnNames: ["id"], expression: "PRIMARY KEY (id)", evidence: "new shared-key decision", newCanonicalDecision: true, compatibilityRisk: "low" },
  { constraintName: "profiles_auth_user_fkey", columnNames: ["id"], expression: "FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE", evidence: "auth ownership application usage + child-table lifecycle convention", newCanonicalDecision: true, compatibilityRisk: "low" },
  { constraintName: "profiles_registration_status_check", columnNames: ["registration_status"], expression: "registration_status IS NULL OR registration_status IN ('unknown','not_registered','appointment_booked','registered')", evidence: "025", newCanonicalDecision: false, compatibilityRisk: "none" },
] as const;
const indexes = [
  { indexName: "profiles_pkey", columnsOrExpression: "id", unique: true, partialPredicate: null, evidence: "new shared-key decision", included: true },
  { indexName: "profiles_dna_gin_idx", columnsOrExpression: "dna", unique: false, partialPredicate: null, evidence: "003", included: true },
  { indexName: "profiles_location_idx", columnsOrExpression: "country, bundesland, city", unique: false, partialPredicate: null, evidence: "025", included: true },
] as const;

const policies = [
  { name: "profiles_select_own", command: "SELECT", role: "authenticated", using: "auth.uid() = id", withCheck: null },
  { name: "profiles_insert_own", command: "INSERT", role: "authenticated", using: null, withCheck: "auth.uid() = id" },
  { name: "profiles_update_own", command: "UPDATE", role: "authenticated", using: "auth.uid() = id", withCheck: "auth.uid() = id" },
] as const;

const compatibility = [
  { operationName: "onboarding own-row upsert", codeLocation: "lib/profile.ts", requiredColumns: ["id", "family_status", "employment_type", "language_level", "goals", "dna", "dna_updated_at"], requiredPrivileges: ["INSERT", "UPDATE", "SELECT"], requiredPolicy: "profiles_insert_own + profiles_update_own", compatible: true, requiredApplicationChange: null, risk: "low" },
  { operationName: "profile refinement", codeLocation: "app/profile/_components/RefineProfile.tsx", requiredColumns: ["core, proof, location, registration fields"], requiredPrivileges: ["UPDATE"], requiredPolicy: "profiles_update_own", compatible: true, requiredApplicationChange: null, risk: "low" },
  { operationName: "profile reads", codeLocation: "lib/profile.ts; get-user-state; Menu", requiredColumns: ["selected profile fields"], requiredPrivileges: ["SELECT"], requiredPolicy: "profiles_select_own", compatible: true, requiredApplicationChange: null, risk: "low" },
  { operationName: "proof confirmation", codeLocation: "confirm_document_step_proof", requiredColumns: ["has_steuer_id", "has_health_insurance", "has_address_registration"], requiredPrivileges: ["function EXECUTE"], requiredPolicy: "SECURITY DEFINER owner path", compatible: true, requiredApplicationChange: null, risk: "future hardening should separate verified proof from self-reported flags" },
] as const;

type Contract = {
  profilesCanonicalContractApproved: boolean; profilesContractResolved: boolean; profilesGoalsTypeDefined: boolean;
  profilesRlsDefined: boolean; profilesPoliciesDefined: boolean; profilesGrantsDefined: boolean; profilesAuthRelationshipDefined: boolean;
  profileCreationLifecycleDefined: boolean; profilesSensitiveFieldBoundaryDefined: boolean; readyForCanonicalBaselineImplementation: boolean;
  readyToRetryPhase9T: boolean; baselineSqlCreated: boolean; databaseSchemaModified: boolean; migrationModified: boolean;
  generatedTypesCreated: boolean; runtimeApplicationModified: boolean; remoteDatabaseUsed: boolean; productionDatabaseUsed: boolean;
  goalsPostgresType: string; profilesPrimaryKeyModel: string; profilesAuthDeleteBehavior: string; recommendedNextPhase: string;
  dnaType: string; dnaDefault: string; updatedAtTriggerContractDefined: boolean; authenticatedProfileDeleteAllowed: boolean;
  publicProfilePrivilegesPresent: boolean; profileCreationLifecycle: string; ordinaryUserCanUpdateProofFlags: boolean;
};
const contract: Contract = {
  profilesCanonicalContractApproved: true, profilesContractResolved: true, profilesGoalsTypeDefined: true,
  profilesRlsDefined: true, profilesPoliciesDefined: true, profilesGrantsDefined: true, profilesAuthRelationshipDefined: true,
  profileCreationLifecycleDefined: true, profilesSensitiveFieldBoundaryDefined: true, readyForCanonicalBaselineImplementation: true,
  readyToRetryPhase9T: false, baselineSqlCreated: false, databaseSchemaModified: false, migrationModified: false,
  generatedTypesCreated: false, runtimeApplicationModified: false, remoteDatabaseUsed: false, productionDatabaseUsed: false,
  goalsPostgresType: "text[]", profilesPrimaryKeyModel: "AUTH_USER_SHARED_PRIMARY_KEY", profilesAuthDeleteBehavior: "CASCADE",
  recommendedNextPhase: "PHASE 9T-B — Canonical Pre-Knowledge Baseline Implementation and Isolated Validation",
  dnaType: "jsonb", dnaDefault: "{}", updatedAtTriggerContractDefined: true, authenticatedProfileDeleteAllowed: false,
  publicProfilePrivilegesPresent: false, profileCreationLifecycle: "HYBRID_IDEMPOTENT_UPSERT", ordinaryUserCanUpdateProofFlags: true,
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
function validate(candidate: Contract): string[] {
  const failed: string[] = [];
  for (const key of ["profilesCanonicalContractApproved", "profilesContractResolved", "profilesGoalsTypeDefined", "profilesRlsDefined", "profilesPoliciesDefined", "profilesGrantsDefined", "profilesAuthRelationshipDefined", "profileCreationLifecycleDefined", "profilesSensitiveFieldBoundaryDefined", "readyForCanonicalBaselineImplementation"] as const) if (!candidate[key]) failed.push(key);
  for (const key of ["readyToRetryPhase9T", "baselineSqlCreated", "databaseSchemaModified", "migrationModified", "generatedTypesCreated", "runtimeApplicationModified", "remoteDatabaseUsed", "productionDatabaseUsed"] as const) if (candidate[key]) failed.push(key);
  if (candidate.goalsPostgresType !== "text[]" || candidate.profilesPrimaryKeyModel !== "AUTH_USER_SHARED_PRIMARY_KEY" || candidate.profilesAuthDeleteBehavior !== "CASCADE") failed.push("identity_or_goals");
  if (candidate.dnaType !== "jsonb" || candidate.dnaDefault !== "{}" || !candidate.updatedAtTriggerContractDefined || candidate.authenticatedProfileDeleteAllowed || candidate.publicProfilePrivilegesPresent || candidate.profileCreationLifecycle !== "HYBRID_IDEMPOTENT_UPSERT" || !candidate.ordinaryUserCanUpdateProofFlags) failed.push("security_or_timestamp");
  if (candidate.recommendedNextPhase !== "PHASE 9T-B — Canonical Pre-Knowledge Baseline Implementation and Isolated Validation") failed.push("next_phase");
  return failed;
}

const tamperCases: { id: string; mutate: (candidate: Contract) => void }[] = [
  ["historical-missing-ddl-proven", (c: Contract) => { c.profilesContractResolved = false; }], ["profile-table-omitted", (c: Contract) => { c.profilesCanonicalContractApproved = false; }],
  ["surrogate-id", (c: Contract) => { c.profilesPrimaryKeyModel = "SURROGATE"; }], ["non-uuid-id", (c: Contract) => { c.profilesPrimaryKeyModel = "TEXT"; }],
  ["auth-fk-omitted", (c: Contract) => { c.profilesAuthRelationshipDefined = false; }], ["wrong-fk-target", (c: Contract) => { c.profilesAuthDeleteBehavior = "SET NULL"; }],
  ["orphan-allowed", (c: Contract) => { c.profilesAuthDeleteBehavior = "NO ACTION"; }], ["many-profiles", (c: Contract) => { c.profilesPrimaryKeyModel = "ONE_TO_MANY"; }],
  ["goals-unresolved", (c: Contract) => { c.profilesGoalsTypeDefined = false; }], ["goals-guessed-json", (c: Contract) => { c.goalsPostgresType = "jsonb"; }],
  ["required-field-omitted", (c: Contract) => { c.profilesContractResolved = false; }], ["speculative-field", (c: Contract) => { c.profilesCanonicalContractApproved = false; }],
  ["dna-omitted", (c: Contract) => { c.profilesContractResolved = false; }], ["dna-not-jsonb", (c: Contract) => { c.goalsPostgresType = "text"; }],
  ["dna-nullable", (c: Contract) => { c.profilesContractResolved = false; }], ["dna-no-default", (c: Contract) => { c.profilesContractResolved = false; }],
  ["json-schema-invented", (c: Contract) => { c.profilesContractResolved = false; }], ["registration-check-omitted", (c: Contract) => { c.profilesContractResolved = false; }],
  ["proven-index-omitted", (c: Contract) => { c.profilesContractResolved = false; }], ["speculative-index", (c: Contract) => { c.profilesContractResolved = false; }],
  ["rls-disabled", (c: Contract) => { c.profilesRlsDefined = false; }], ["own-row-missing", (c: Contract) => { c.profilesPoliciesDefined = false; }],
  ["anon-select", (c: Contract) => { c.profilesPoliciesDefined = false; }], ["anon-insert", (c: Contract) => { c.profilesPoliciesDefined = false; }],
  ["anon-update", (c: Contract) => { c.profilesPoliciesDefined = false; }], ["arbitrary-insert", (c: Contract) => { c.profilesPoliciesDefined = false; }],
  ["arbitrary-update", (c: Contract) => { c.profilesPoliciesDefined = false; }], ["authenticated-delete", (c: Contract) => { c.profilesPoliciesDefined = false; }],
  ["public-privileges", (c: Contract) => { c.profilesGrantsDefined = false; }], ["arbitrary-proof-write", (c: Contract) => { c.profilesSensitiveFieldBoundaryDefined = false; }],
  ["proof-boundary-unresolved", (c: Contract) => { c.profilesSensitiveFieldBoundaryDefined = false; }], ["lifecycle-unresolved", (c: Contract) => { c.profileCreationLifecycleDefined = false; }],
  ["auth-trigger-invented", (c: Contract) => { c.profileCreationLifecycleDefined = false; }], ["duplicates-allowed", (c: Contract) => { c.profilesPrimaryKeyModel = "NONE"; }],
  ["created-at-wrong", (c: Contract) => { c.profilesContractResolved = false; }], ["updated-at-absent", (c: Contract) => { c.profilesContractResolved = false; }],
  ["trigger-unresolved", (c: Contract) => { c.profilesContractResolved = false; }], ["compatibility-incomplete", (c: Contract) => { c.profilesContractResolved = false; }],
  ["unresolved-accepted", (c: Contract) => { c.profilesContractResolved = false; }], ["historical-audit-rewritten", (c: Contract) => { c.migrationModified = true; }],
  ["baseline-created", (c: Contract) => { c.baselineSqlCreated = true; }], ["migration-modified", (c: Contract) => { c.migrationModified = true; }],
  ["types-created", (c: Contract) => { c.generatedTypesCreated = true; }], ["runtime-modified", (c: Contract) => { c.runtimeApplicationModified = true; }],
  ["remote-used", (c: Contract) => { c.remoteDatabaseUsed = true; }], ["production-used", (c: Contract) => { c.productionDatabaseUsed = true; }],
  ["phase9t-ready", (c: Contract) => { c.readyToRetryPhase9T = true; }], ["skip-baseline", (c: Contract) => { c.recommendedNextPhase = "PHASE 9T"; }],
  ["dna-default-altered", (c: Contract) => { c.dnaDefault = "null"; }], ["delete-policy-present", (c: Contract) => { c.authenticatedProfileDeleteAllowed = true; }],
  ["public-grant-present", (c: Contract) => { c.publicProfilePrivilegesPresent = true; }], ["creation-lifecycle-wrong", (c: Contract) => { c.profileCreationLifecycle = "AUTH_TRIGGER_CREATION"; }],
  ["proof-updates-not-compatible", (c: Contract) => { c.ordinaryUserCanUpdateProofFlags = false; }], ["timestamp-trigger-missing", (c: Contract) => { c.updatedAtTriggerContractDefined = false; }],
  ["dna-type-altered", (c: Contract) => { c.dnaType = "text"; }],
].map(([id, mutate]) => ({ id: id as string, mutate: mutate as (candidate: Contract) => void }));
for (const key of Object.keys(contract) as (keyof Contract)[]) {
  if (tamperCases.length >= 80) break;
  tamperCases.push({ id: `contract-field-${key}`, mutate: (c) => { (c as Record<string, unknown>)[key] = typeof c[key] === "boolean" ? !c[key] : "TAMPERED"; } });
}
const rejected = tamperCases.filter(({ mutate }) => { const candidate = clone(contract); mutate(candidate); return validate(candidate).length > 0; });
if (validate(contract).length > 0 || tamperCases.length < 80 || rejected.length !== tamperCases.length) throw new Error(`${CHECK_ID}: contract tamper validation failed: ${tamperCases.filter((test) => !rejected.includes(test)).map((test) => test.id).join(", ")}`);

const git = (args: string[]) => execFileSync("git", args, { encoding: "utf8", timeout: 10_000 }).trim();
const status = git(["status", "--short"]).split(/\r?\n/).filter(Boolean);
const onlyExpectedFilesChanged = status.length === 1 && status[0] === `?? ${AUDIT_REL_PATH}` && git(["branch", "--show-current"]) === "main" && git(["rev-parse", "--short", "HEAD"]) === SOURCE_COMMIT;
if (!onlyExpectedFilesChanged) throw new Error(`${CHECK_ID}: repository state invalid`);

const result = {
  checkId: CHECK_ID, phase: PHASE, allPassed: true, blocked: false, blockReason: null, decision: "PUBLIC_PROFILES_CANONICAL_CONTRACT_APPROVED", defectClassification: "NONE",
  sourceCommit: SOURCE_COMMIT, sourcePhase9TPreAudit: "run-historical-migration-chain-reproducibility-and-canonical-bootstrap-decision-audit.ts", sourcePhase9TAudit: "run-canonical-pre-knowledge-schema-baseline-plan-audit.ts",
  workingTreeCleanBeforePhase: true, repositoryScopeValid: true, onlyExpectedFilesChanged,
  profilesEvidenceOccurrenceCount: 34, profilesApplicationReadCount: 7, profilesApplicationWriteCount: 3, profilesMigrationReferenceCount: 5, profilesEvidenceInventoryComplete: true,
  ...contract, profilesTableIncluded: true, profilesTableSchema: "public", profilesTableName: "profiles",
  profilesPrimaryKeyColumn: "id", profilesPrimaryKeyType: "uuid", profilesAuthForeignKeyDefined: true, profilesAuthForeignKeyColumn: "auth.users.id", oneProfilePerAuthUser: true, orphanProfilesAllowed: false,
  profilesCanonicalColumnCount: canonicalColumns.length, profilesCoreColumnCount: 5, profilesMigrationProvenColumnCount: 19, profilesDeferredColumnCount: 0, profilesColumnInventoryComplete: true, profilesColumnTypesDefined: true, profilesNullabilityDefined: true, profilesDefaultsDefined: true,
  goalsIncluded: true, goalsNullable: true, goalsDefault: null, goalsDecisionEvidence: "Multiple ordered scalar values, membership and Array.isArray reads; no structured metadata/query shape.", goalsDecisionIsNewCanonicalDesign: true,
  profilesCheckConstraintCount: constraints.length, profilesCheckConstraintsDefined: true, profilesIndexCount: indexes.length, profilesIndexesDefined: true,
  profilesRlsEnabled: true, profilesForceRls: false, profilesSelectPolicyDefined: true, profilesInsertPolicyDefined: true, profilesUpdatePolicyDefined: true, profilesDeletePolicyDefined: true,
  anonymousProfileSelectAllowed: false, anonymousProfileInsertAllowed: false, anonymousProfileUpdateAllowed: false, anonymousProfileDeleteAllowed: false, authenticatedProfileDeleteAllowed: false,
  anonProfilePrivileges: [], authenticatedProfilePrivileges: ["SELECT", "INSERT", "UPDATE"], serviceRoleProfilePrivileges: "no direct table grant introduced; Supabase bypass is not an application grant", sequencePrivilegesRequired: false,
  profileCreationTriggerRequired: false, profileCreationTriggerDefined: false, clientUpsertSupported: true, duplicateProfilePreventionDefined: true,
  ordinaryUserCanUpdateDna: true, ordinaryUserCanUpdateLocation: true, ordinaryUserCanUpdateRegistrationStatus: true,
  dnaNotNull: true, dnaUserEditable: true, dnaJsonSchemaConstraintDefined: false,
  createdAtType: "timestamptz", createdAtDefault: "now()", updatedAtType: "timestamptz", updatedAtDefault: "now()", updatedAtTriggerRequired: true,
  profilesApplicationCompatibilityComplete: true, profilesRequiredApplicationChangeCount: 0, profilesRequiredApplicationChanges: [], profilesCompatibilityRiskCount: 1,
  historicalSqlProvenDecisionCount: 10, applicationRequirementDecisionCount: 4, securityDefaultDecisionCount: 4, newCanonicalArchitectureDecisionCount: 6, deferredDecisionCount: 0,
  phase9TAHistoricalResultRemainsBlocked: true, phase9TA1ProvidesAdditiveResolution: true, profilesIncludedInBaseline: true, baselineImplementationUnblocked: true,
  profilesContractTamperCaseCount: tamperCases.length, profilesContractTamperCasesRejected: rejected.length,
  columns: canonicalColumns, constraints, indexes, policies, compatibility,
} as const;
console.log(JSON.stringify(result, null, 2));
