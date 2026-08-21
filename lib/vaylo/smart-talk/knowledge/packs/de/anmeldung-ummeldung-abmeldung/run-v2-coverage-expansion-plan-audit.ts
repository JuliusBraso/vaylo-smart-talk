/**
 * Anmeldung/Ummeldung/Abmeldung V2 coverage expansion plan audit.
 *
 * Read-only and source-static: it neither opens a database connection nor
 * fetches a source, changes a migration, ingests data, or touches Smart Talk.
 */
import fs from "node:fs";
import path from "node:path";

import { CANONICAL_UNITS, PACK_ID } from "./pack";

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");
const exists = (file: string) => fs.existsSync(path.join(root, file));

const files = {
  schema: "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  handling: "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
  ingestion: "supabase/migrations/037_add_curated_knowledge_pack_ingestion_rpc.sql",
  retrieval: "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql",
  runtime: "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/controlled-runtime-retrieval.ts",
} as const;

type Category =
  | "duty" | "deadline" | "scope" | "move-in" | "domestic move" | "move-out"
  | "landlord" | "Wohnungsgeberbestätigung" | "identity" | "residence type"
  | "secondary residence" | "exemptions" | "sanctions" | "procedure"
  | "authority" | "evidence/document requirement" | "special cases" | "foreign/EU arrival";

const categoryByUnit: Readonly<Record<string, readonly Category[]>> = {
  "anmeldung-duty": ["duty", "move-in", "authority"],
  "anmeldung-deadline-two-weeks": ["deadline", "move-in"],
  "domestic-move-new-registration": ["domestic move", "procedure", "move-out"],
  "abmeldung-duty-no-new-domestic-home": ["duty", "move-out"],
  "abmeldung-deadline-two-weeks": ["deadline", "move-out"],
  "abmeldung-earliest-one-week": ["deadline", "move-out"],
  "under-16-registration-responsibility": ["duty", "special cases"],
  "landlord-participation": ["landlord", "Wohnungsgeberbestätigung"],
  "landlord-confirmation": ["landlord", "Wohnungsgeberbestätigung", "procedure"],
  "landlord-confirmation-missing-notice": ["landlord", "Wohnungsgeberbestätigung", "special cases"],
  "landlord-confirmation-contents": ["Wohnungsgeberbestätigung", "evidence/document requirement"],
  "electronic-landlord-reference": ["Wohnungsgeberbestätigung", "procedure"],
  "fictitious-address-prohibition": ["duty", "sanctions", "special cases"],
  "definition-wohnung": ["residence type", "scope"],
  "multiple-residences-main-home": ["residence type", "secondary residence", "special cases"],
  "multiple-residences-secondary-home": ["secondary residence", "residence type"],
  "multiple-residences-notification": ["duty", "secondary residence"],
  "main-home-change-notification": ["deadline", "secondary residence"],
  "main-home-special-case-context": ["secondary residence", "special cases"],
  "identity-and-confirmation": ["identity", "evidence/document requirement", "procedure"],
  "electronic-or-meldeschein-model": ["procedure", "evidence/document requirement"],
  "family-common-meldeschein": ["procedure", "special cases"],
  "temporary-stay-exception": ["exemptions", "secondary residence", "special cases"],
  "temporary-stay-six-month-threshold": ["deadline", "exemptions", "secondary residence"],
  "foreign-resident-three-month-threshold": ["deadline", "foreign/EU arrival", "exemptions"],
  "late-anmeldung-offence": ["sanctions", "move-in"],
  "late-abmeldung-offence": ["sanctions", "move-out"],
  "ordinary-registration-fine-framework": ["sanctions"],
};

const localFacts = [
  ["responsible authority", "municipality/service-area", "CACHE_AND_REVALIDATE", "monthly; revalidate on authority-assignment change"],
  ["authority postal/service address", "authority/service point", "CACHE_AND_REVALIDATE", "monthly; source fingerprint and address-change event"],
  ["phone and email", "authority/service point", "CACHE_AND_REVALIDATE", "daily or weekly; label stale only if policy permits"],
  ["opening hours", "authority/service point", "FETCH_LIVE", "daily; cache only with explicit expiry and stale warning"],
  ["appointment requirement", "authority/process variant", "CACHE_AND_REVALIDATE", "weekly; do not assume it from another municipality"],
  ["appointment availability", "authority/service point", "FETCH_LIVE", "real time; abstain when live evidence is unavailable"],
  ["online service URL", "authority/process variant", "CACHE_AND_REVALIDATE", "weekly/monthly with authorized official source"],
  ["downloadable form", "authority/process variant", "CACHE_AND_REVALIDATE", "monthly; source version/fingerprint required"],
  ["local document checklist", "authority/process variant", "CACHE_AND_REVALIDATE", "weekly; qualify as local addition to federal baseline"],
  ["local fee", "authority/process variant", "CACHE_AND_REVALIDATE", "monthly; do not state where not verified"],
  ["local processing note", "authority/process variant", "MANUAL_REVIEW_REQUIRED", "event-driven; publish only if direct official support is clear"],
  ["ambiguous locality without Land/Kreis/AGS", "unresolved", "DO_NOT_ANSWER_WITHOUT_CONTEXT", "request disambiguating locality context"],
] as const;

const retrievalCases = [
  ["R1", "What is the Anmeldung deadline?", "DE federal deadline + duty claims; no local records."],
  ["R2", "What documents do I need for Anmeldung?", "Federal identity/Wohnungsgeber evidence + local checklist only when a verified locality is resolved."],
  ["R3", "I moved from Slovakia to Weiltingen. Where do I register?", "DE federal duty + Bavaria/Weiltingen territorial resolution + verified competent authority; sk locale does not select jurisdiction."],
  ["R4", "Where exactly is the responsible office and when is it open?", "Verified authority competence/address cache plus current opening-hours live/cache record; abstain on volatile data without current evidence."],
  ["R5", "There is no appointment within two weeks. What should I do?", "Federal deadline plus verified local appointment/procedural guidance if present; never invent an exception or consequence."],
  ["R6", "My landlord refuses to give me Wohnungsgeberbestätigung.", "BMG §19 participation/refusal-notice claims and safe authority-contact step; local channel only if verified."],
  ["R7", "I moved from Munich to Berlin. Do I also need Abmeldung?", "Federal domestic-move and §17(2) evidence only; no local authority data required."],
  ["R8", "I am leaving Germany permanently.", "Federal Abmeldung duty, two-week deadline, earliest-one-week rule; local submission channel only if resolved."],
  ["R9", "I live partly in two apartments.", "Federal main/secondary residence rules, required residence facts, and no case conclusion without context."],
  ["R10", "I am Slovak and moved to Germany.", "DE federal rules, German jurisdiction and German canonical evidence; no DE↔SK connector unless a separate verified coordination issue exists."],
] as const;

const implementation = [
  ["V2-A", "Federal canonical completion", [], "Add only high-value missing BMG/Bundesportal claims, passages, terms, process links, deadline/evidence rules and explicit failure guidance."],
  ["V2-B", "Locality and competence data contract", ["V2-A"], "Use existing jurisdiction, territorial-scope, authority and competence tables; extend curated payload/RPC contract only, not broad privileges."],
  ["V2-C", "Bayern and Weiltingen pilot data", ["V2-B"], "Create DE-BY, Landkreis Ansbach and municipality/service-area records, verified competence, official sources and local process metadata."],
  ["V2-D", "Freshness and local handling population", ["V2-B"], "Apply per-source handling policies, revalidation dates, source versions and freshness records for pilot local facts."],
  ["V2-E", "Read packet and retrieval proofs", ["V2-A", "V2-B", "V2-C", "V2-D"], "Narrowly extend the evidence projection to return resolved authority/process/document/local metadata and add local proof cases."],
  ["V2-F", "Controlled Smart Talk scenario verification", ["V2-E"], "Extend the approved selector/catalog and consume the expanded packet; preserve all existing runtime authorization and safety gates."],
] as const;

const curatedWriteSurface = [
  "knowledge_trust_domains", "knowledge_jurisdictions", "knowledge_territorial_scopes",
  "knowledge_publishers", "knowledge_authorities", "knowledge_sources",
  "knowledge_source_versions", "knowledge_source_passages", "knowledge_responsible_actor_rules",
  "knowledge_claims", "knowledge_claim_evidence_links", "knowledge_citations",
  "knowledge_processes", "knowledge_deadline_rules", "knowledge_process_steps",
  "knowledge_evidence_requirements", "knowledge_source_handling_policies",
  "knowledge_freshness_records", "knowledge_retrieval_metadata", "knowledge_terminology",
] as const;

const retrievalReadSurface = [
  "knowledge_claims", "knowledge_jurisdictions", "knowledge_territorial_scopes",
  "knowledge_claim_evidence_links", "knowledge_source_passages", "knowledge_source_versions",
  "knowledge_sources", "knowledge_citations", "knowledge_source_handling_policies",
  "knowledge_retrieval_metadata",
] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function main(): void {
  const missing = Object.values(files).filter((file) => !exists(file));
  assert(missing.length === 0, `Required committed files missing: ${missing.join(", ")}`);
  assert(PACK_ID === "anmeldung_ummeldung_abmeldung", "Unexpected pack identity");
  assert(CANONICAL_UNITS.length === 28, `Expected 28 canonical units, found ${CANONICAL_UNITS.length}`);
  assert(CANONICAL_UNITS.every((unit) => categoryByUnit[unit.id]?.length), "Coverage inventory does not classify every current unit");

  const schema = read(files.schema);
  const handling = read(files.handling);
  const ingestion = read(files.ingestion);
  const retrieval = read(files.retrieval);
  const runtime = read(files.runtime);
  const requiredSchema = [
    "knowledge_jurisdictions", "knowledge_territorial_scopes", "municipality_codes",
    "knowledge_authorities", "knowledge_authority_competences", "knowledge_processes",
    "knowledge_process_steps", "knowledge_evidence_requirements", "knowledge_forms",
    "knowledge_deadline_rules", "knowledge_fee_rules", "knowledge_freshness_records",
    "knowledge_retrieval_metadata",
  ];
  assert(requiredSchema.every((token) => schema.includes(token)), "Existing schema capability evidence is incomplete");
  assert(handling.includes("knowledge_source_handling_policies"), "Handling-policy schema capability evidence is incomplete");
  assert(ingestion.includes("'packId','canonicalLanguage'") && ingestion.includes("knowledge_ingest_curated_pack"), "Curated ingestion contract not found");
  assert(retrieval.includes("knowledge_retrieve_evidence_packets") && runtime.includes("FEDERAL_JURISDICTION_CODE"), "Current read boundary evidence is incomplete");

  const inventory = CANONICAL_UNITS.map((unit) => ({
    id: unit.id,
    claimType: unit.claimType,
    passageId: unit.passageId,
    handlingMode: unit.handlingMode,
    requiredContext: unit.requiredContext ?? [],
    categories: categoryByUnit[unit.id],
  }));
  const output = {
    phaseResult: "PASS",
    preflight: {
      requiredBranch: "main",
      requiredHead: "db02de5ddaf3d9041eeedea71afd36e0e722da4c",
      note: "Branch/HEAD/origin/worktree are verified by the invoking phase; this source audit remains network- and database-free.",
    },
    currentPackInventory: {
      canonicalUnitCount: inventory.length,
      units: inventory,
      strengths: [
        "Direct BMG support for core duty, deadlines, domestic move, leaving Germany, landlord confirmation, identity, multiple residences, temporary stays and offences.",
        "Existing units preserve context gates for main-residence, temporary-stay and foreign-resident threshold questions.",
      ],
      missingAreas: [
        "No source-backed local authority/competence, municipality or service-point records.",
        "No federal registration confirmation output claim, explicit general proxy boundary, complete normal-process sequence, or official service-portal document qualification.",
        "No Bayern/local process variants, office locations, appointment guidance, online service/form, fee, contact or opening-hours knowledge.",
      ],
    },
    target: {
      commercialDefinition: "Answer what, when, where, competent authority, document baseline, verified failure next step and explicitly local changing detail without making unsupported local claims.",
      scope: "Canonical DE law remains separate from DE-BY and local operational facts; user locale never determines jurisdiction.",
    },
    authorityCompetenceModel: {
      chain: "User locality -> knowledge_jurisdictions (DE / DE-BY / Kreis / Gemeinde with parent relation and stable code) -> knowledge_territorial_scopes (municipality_codes/service area) -> knowledge_authority_competences (subject_matter=Anmeldung, effective-dated) -> knowledge_authorities -> knowledge_processes/process_steps/forms/sources.",
      pilot: "Weiltingen is one municipality/service-area record under Landkreis Ansbach/Bayern; the verified competent authority may be a Verwaltungsgemeinschaft, Gemeindeverwaltung, Bürgeramt or Meldebehörde. It is not inferred from naming or proximity.",
      ambiguity: "Resolve exact stable code when supplied; otherwise require Land plus Kreis/postal code where name is non-unique. Return federal baseline but no concrete office while locality remains ambiguous.",
      servicePointRepresentation: "Use a separately scoped authority record for a service point when needed; its contact_channels and source-backed scoped claims carry address/contact facts. There is no dedicated service-point table, which is acceptable for the pilot but must not be presented as a structured nationwide address directory.",
    },
    localityResolution: {
      minimum: ["municipality name", "Land", "one disambiguator: postal code, Landkreis, or official municipality code/AGS"],
      preferredStableIdentifier: "AGS/official municipality code stored in knowledge_jurisdictions.jurisdiction_code and mirrored in territorial scope municipality_codes only when it materially resolves ambiguity.",
      forbidden: ["infer jurisdiction from UI locale", "infer office from postcode alone when it crosses municipalities", "create rows for all municipalities before source-backed coverage exists"],
    },
    localFactHandlingMatrix: localFacts.map(([fact, level, mode, freshness]) => ({ fact, jurisdictionLevel: level, defaultHandlingMode: mode, freshness })),
    officialSourceModel: [
      "Federal law: official Bundesmeldegesetz publication for binding nationwide legal claims.",
      "Bundesportal: official process explanation and document/process qualification, never a replacement for the law where it differs.",
      "Bavarian official portal/authority material: DE-BY scoped procedural variants.",
      "Landkreis, municipality or Verwaltungsgemeinschaft official authority portal: competence, service point, local documents, form and operational data.",
      "Blogs, Reddit, expat sites, SEO law pages and Wikipedia are discovery-only and cannot support canonical claims.",
    ],
    localRefreshModel: [
      "Legal rules: STORE_CANONICALLY, LEGAL_CHANGE_MONITORED, DO_NOT_USE_STALE.",
      "Stable competence mapping: CACHE_AND_REVALIDATE with effective dates and authority-assignment change monitoring.",
      "Address/forms/online URL/local checklist/fee: versioned cache and revalidate before use.",
      "Opening hours: live preferred or short-lived cache with explicit freshness.",
      "Appointment availability: FETCH_LIVE; never return a stored current value.",
    ],
    canonicalVsLocalBoundary: {
      canonicalDE: ["BMG duties, deadlines, multiple-residence legal baseline, Wohnungsgeber duties, sanctions framework, federal document categories"],
      regionalOrLocal: ["competent authority instance", "service point/address/contact", "appointment and online channel", "local checklist/form/fee/process note"],
      applicabilityRule: "Subject matter and verified competence decide applicability. A local instruction may implement a federal rule but cannot override it; no naive municipality > Land > Bund precedence applies.",
    },
    representativeRetrievalCases: retrievalCases.map(([id, question, expectedEvidence]) => ({ id, question, expectedEvidence })),
    schemaGapAnalysis: {
      migrationRequired: "NO",
      reason: "032 already represents hierarchy/locality codes, territorial scopes, effective-dated authority competences, authorities, official sources, process/process-step, forms, evidence/deadline/fee rules and freshness. Locality name normalization/indexing is an application/query contract concern, not a proven missing storage capability.",
      tables: requiredSchema.filter((name) => name.startsWith("knowledge_")),
    },
    ingestionContractAnalysis: {
      currentRpcSufficient: "NO",
      exactGap: "037 is a fixed first-pack federal writer: it accepts one jurisdiction/scope/publisher/authority/source/version and hardcodes FEDERAL_LAW, authority shape, source handling and generic step/requirement values. It neither writes authority competences nor independently models multiple local sources, local scopes, forms, fees or their distinct policies. Preserve curated maintenance-only authority; extend its allowlisted payload/validation or add equally narrow category-specific curated operations.",
      currentTwentyTableWriteSurface: curatedWriteSurface,
      omittedV2Tables: ["knowledge_authority_competences", "knowledge_forms", "knowledge_fee_rules", "knowledge_eligibility_rules", "knowledge_process_claim_links", "knowledge_regional_overrides"],
    },
    retrievalContractAnalysis: {
      currentMigration038Sufficient: "NO",
      exactGap: "038 returns claim evidence from ten tables only. It cannot resolve locality/AGS, select an effective authority competence, return authority/service-point identity/contact, process steps, evidence requirements, forms, fees or distinct local service metadata. The controlled runtime additionally selects only the committed 28-unit catalog and hard-rejects non-DE jurisdiction rows. Keep 038 first-pack scoped now; later add only a narrow V2 evidence projection and explicit selector contract.",
      currentTenTableReadSurface: retrievalReadSurface,
      consultedButNotReturned: ["knowledge_conflicts", "knowledge_publication_states"],
    },
    packSizeEstimate: {
      currentCanonicalUnits: 28,
      additionalCanonicalDEUnits: "12–16 (registration confirmation, authority competence baseline, normal-process trigger/outputs, document distinctions, representation boundary, local appointment failure qualification and precise missing exceptions only after direct support)",
      bayernUnits: "2–4 (only verified state-level process/online-service variants)",
      weiltingenPilot: "1 municipality jurisdiction + 1 territorial scope + 1–2 authorities/service points + 1–2 competences + 1–3 official local sources + 1 local process/variant + 0–2 forms + 4–8 local claims/requirements",
      evidenceAndPhysicalRecords: "Approximately 25–40 additional passages/evidence links/citations and 90–140 total physical rows across existing tables; reduce if one official source covers several facts.",
    },
    implementationDag: implementation.map(([id, title, dependencies, boundary]) => ({ id, title, dependencies, boundary })),
    firstImplementationPackage: {
      recommendation: "V2-A — Federal canonical completion.",
      whyFirst: "It closes high-value nationwide gaps and supplies the stable process/document vocabulary that local pilot records must qualify, without locality or runtime changes.",
      expectedFilesAndTablesLater: ["pack.ts and validation/audit source", "knowledge_claims", "knowledge_source_passages", "knowledge_claim_evidence_links", "knowledge_citations", "knowledge_processes", "knowledge_process_steps", "knowledge_evidence_requirements", "knowledge_deadline_rules", "knowledge_terminology"],
      productionEffectNow: "NONE",
    },
    smartTalkImpact: {
      laterEvidencePacketAdditions: ["resolved locality/scope identity", "authority competence and effective dates", "authority/service-point identity and cited local source", "process steps/document baseline and local qualification", "handling mode, revalidation status and explicit missing/ambiguous state"],
      currentAction: "No runtime, selector, authorization or governance change in this phase.",
    },
    noProductionAction: {
      productionConnection: false, productionWrite: false, productionIngestion: false,
      migrationDeployed: false, smartTalkChanged: false, publicRuntimeAuthorized: false,
    },
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main();
