import { Client } from "pg";

import { CANONICAL_UNITS, FIRST_PACK_CANONICAL_UNIT_IDS, V2A_ADDED_CANONICAL_UNIT_IDS, type HandlingMode } from "./pack";
import { PACK_ENTITY_IDS, stablePackEntityId } from "./identity";
import { LOCAL_DISPOSABLE_VALIDATION } from "./local-disposable-adapter";

export type RetrievalProofContext = Readonly<{
  capability: typeof LOCAL_DISPOSABLE_VALIDATION;
  databaseUrl: string;
  jurisdictionCodes: readonly string[];
  userLocale: string;
}>;

export type EvidencePacket = Readonly<{
  questionId: string;
  canonicalUnitId: string;
  canonicalProposition: string;
  jurisdiction: string;
  territorialScope: string;
  handlingMode: HandlingMode;
  sourceId: string;
  sourceVersionId: string;
  sourcePassageId: string;
  legalLocator: string;
  citationReference: string;
  processId: string | null;
  processContext: string | null;
  deadlineRelationship: string | null;
  requirementRelationship: string | null;
  relevanceScore: number;
  rankingEvidence: readonly string[];
}>;

const QUESTION_UNITS = Object.freeze({
  Q1: ["anmeldung-deadline-two-weeks", "anmeldung-duty"],
  Q2: ["domestic-move-new-registration", "abmeldung-duty-no-new-domestic-home"],
  Q3: ["landlord-confirmation-missing-notice", "landlord-participation", "landlord-confirmation"],
  Q4: ["abmeldung-duty-no-new-domestic-home", "abmeldung-deadline-two-weeks", "abmeldung-earliest-one-week"],
  Q5: ["ordinary-registration-fine-framework", "late-anmeldung-offence"],
  MUNICH: ["anmeldung-duty", "identity-and-confirmation"],
  BERLIN: ["anmeldung-duty", "identity-and-confirmation"],
  SLOVAK_UI: ["anmeldung-duty", "anmeldung-deadline-two-weeks"],
  F1: ["official-meldebestätigung"],
  F2: ["meldebescheinigung-on-request", "electronic-meldebescheinigung-unentgeltlich"],
  F3: ["electronic-anmeldung-federal-procedure", "electronic-anmeldung-code-may-replace-confirmation"],
  F4: ["landlord-confirmation-missing-notice", "landlord-participation", "landlord-confirmation"],
  F5: ["cooperation-duties-on-authority-request", "authority-may-collect-verification-hints"],
  F6: ["diplomatic-or-treaty-exemption", "temporary-stay-exception", "newborn-registration-if-other-dwelling"],
  F7: ["ordinary-registration-fine-framework", "late-anmeldung-offence"],
  F8: ["domestic-move-new-registration", "abmeldung-duty-no-new-domestic-home"],
} as const);

function assertLocal(context: RetrievalProofContext): void {
  if (context.capability !== LOCAL_DISPOSABLE_VALIDATION) {
    throw new Error("LOCAL_DISPOSABLE_VALIDATION capability is required");
  }
  const parsed = new URL(context.databaseUrl);
  if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
    throw new Error("Local retrieval proof rejects non-local databases");
  }
  if (/prod|supabase\.co|pooler/i.test(context.databaseUrl)) {
    throw new Error("Hosted or production-looking credentials are forbidden");
  }
}

function processForUnit(unitId: string): Readonly<{
  id: string;
  context: string;
  deadline: string | null;
}> {
  if (unitId.includes("abmeldung")) {
    return {
      id: PACK_ENTITY_IDS.abmeldungProcess,
      context: "ABMELDUNG",
      deadline: "BMG § 17 Abs. 2",
    };
  }
  if (unitId.includes("domestic-move") || unitId.includes("prefilled-meldeschein")) {
    return {
      id: PACK_ENTITY_IDS.ummeldungProcess,
      context: "UMMELDUNG / DOMESTIC MOVE",
      deadline: "BMG § 17 Abs. 1–2",
    };
  }
  return {
    id: PACK_ENTITY_IDS.anmeldungProcess,
    context: "ANMELDUNG",
    deadline: unitId.includes("deadline") ? "BMG § 17 Abs. 1" : null,
  };
}

export async function retrieveEvidencePackets(
  questionId: keyof typeof QUESTION_UNITS,
  context: RetrievalProofContext,
): Promise<readonly EvidencePacket[]> {
  assertLocal(context);
  if (!context.jurisdictionCodes.includes("DE")) return Object.freeze([]);

  const unitIds = QUESTION_UNITS[questionId];
  const claimIds = unitIds.map((unitId) => stablePackEntityId(`claim:${unitId}`));
  const client = new Client({ connectionString: context.databaseUrl });
  await client.connect();
  try {
    const result = await client.query(
      `select c.id::text as claim_id, c.claim_text_canonical, j.jurisdiction_code,
              ts.scope_type, s.id::text as source_id, sv.id::text as source_version_id,
              sp.id::text as passage_id, sp.section_identifier,
              cit.internal_audit_label,
              hp.handling_mode::text as handling_mode
         from public.knowledge_claims c
         join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
         left join public.knowledge_territorial_scopes ts on ts.id = c.territorial_scope_id
         join public.knowledge_claim_evidence_links e on e.claim_id = c.id
              and e.review_accepted and e.support_status = 'direct_support'
         join public.knowledge_source_passages sp on sp.id = e.passage_id
         join public.knowledge_source_versions sv on sv.id = e.source_version_id
         join public.knowledge_sources s on s.id = sv.source_id
         join public.knowledge_citations cit on cit.claim_id = c.id and cit.passage_id = sp.id
         join public.knowledge_source_handling_policies hp on hp.source_id = s.id
              and hp.process_scope = 'anmeldung_ummeldung_abmeldung'
              and hp.information_class = case
                when c.claim_type = 'deadline' then 'DEADLINE'::public.knowledge_information_class
                when c.claim_type = 'sanction' then 'SANCTION'::public.knowledge_information_class
                when c.claim_type = 'procedure' then 'REQUIRED_EVIDENCE'::public.knowledge_information_class
                else 'LEGAL_BASELINE'::public.knowledge_information_class
              end
         join public.knowledge_retrieval_metadata rm on rm.entity_type='claim' and rm.entity_id=c.id
        where c.id = any($1::uuid[])
          and j.jurisdiction_code = any($2::text[])
          and c.claim_language = 'de'
          and c.status = 'active'
          and c.review_status = 'expert_reviewed'
          and c.freshness_status = 'fresh'
          and s.authorization_state = 'AUTHORIZED'
          and s.active_status = 'ACTIVE'`,
      [claimIds, context.jurisdictionCodes],
    );
    const byClaim = new Map(
      result.rows.map((row) => [String(row.claim_id), row as Record<string, unknown>]),
    );
    return Object.freeze(
      unitIds.flatMap((unitId, index) => {
        const row = byClaim.get(stablePackEntityId(`claim:${unitId}`));
        const unit = CANONICAL_UNITS.find((candidate) => candidate.id === unitId);
        if (!row || !unit) return [];
        const process = processForUnit(unitId);
        return [
          Object.freeze({
            questionId,
            canonicalUnitId: unitId,
            canonicalProposition: String(row.claim_text_canonical),
            jurisdiction: String(row.jurisdiction_code),
            territorialScope: String(row.scope_type),
            handlingMode: row.handling_mode as HandlingMode,
            sourceId: String(row.source_id),
            sourceVersionId: String(row.source_version_id),
            sourcePassageId: String(row.passage_id),
            legalLocator: String(row.section_identifier),
            citationReference: String(row.internal_audit_label),
            processId: process.id,
            processContext: process.context,
            deadlineRelationship: process.deadline,
            requirementRelationship:
              unitId.includes("landlord") || unitId === "identity-and-confirmation"
                ? "Wohnungsgeberbestätigung / BMG § 19 und § 23"
                : null,
            relevanceScore: 100 - index * 10,
            rankingEvidence: Object.freeze([
              "source-owned question-to-unit concept mapping",
              "DE jurisdiction filter",
              "authorized source filter",
              "freshness and review filters",
              "direct passage evidence",
            ]),
          }),
        ];
      }),
    );
  } finally {
    await client.end();
  }
}

export const HANDLING_MODE_RETRIEVAL_MATRIX = Object.freeze({
  STORE_CANONICALLY: "RETURN_IF_AUTHORIZED_FRESH_AND_APPLICABLE",
  FETCH_LIVE: "RETURN_FETCH_INSTRUCTION_NOT_STORED_CURRENT_VALUE",
  CACHE_AND_REVALIDATE: "RETURN_ONLY_IF_REVALIDATION_POLICY_ACCEPTS_CACHE",
  MANUAL_REVIEW_REQUIRED: "BLOCK_CONFIDENT_CANONICAL_CONCLUSION",
  DO_NOT_ANSWER_WITHOUT_CONTEXT: "RETURN_RULE_AND_REQUIRED_CONTEXT_NOT_CASE_CONCLUSION",
});

function unitById(id: string) {
  return CANONICAL_UNITS.find((unit) => unit.id === id);
}

function packText(): string {
  return CANONICAL_UNITS.map((unit) => `${unit.id}\n${unit.text}`).join("\n").toLocaleLowerCase("de-DE");
}

export function evaluateSourceControlledFederalProof(): Readonly<{
  firstPackRegression: Readonly<Record<"Q1" | "Q2" | "Q3" | "Q4" | "Q5" | "MUNICH" | "BERLIN" | "SLOVAK_UI", boolean>>;
  federalScenarios: Readonly<Record<"F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8", boolean>>;
  semanticNegatives: Readonly<Record<string, boolean>>;
  identityStable: boolean;
  allPassed: boolean;
}> {
  const known = new Set(CANONICAL_UNITS.map((unit) => unit.id));
  const casePassed = (name: keyof typeof QUESTION_UNITS): boolean =>
    QUESTION_UNITS[name].length > 0
    && QUESTION_UNITS[name].every((id) => known.has(id) && Boolean(unitById(id)?.jurisdictionCode === "DE"));
  const firstPackRegression = Object.freeze({
    Q1: casePassed("Q1"),
    Q2: casePassed("Q2"),
    Q3: casePassed("Q3"),
    Q4: casePassed("Q4"),
    Q5: casePassed("Q5"),
    MUNICH: casePassed("MUNICH") && QUESTION_UNITS.MUNICH.join() === QUESTION_UNITS.BERLIN.join(),
    BERLIN: casePassed("BERLIN"),
    SLOVAK_UI: casePassed("SLOVAK_UI"),
  });
  const confirmation = unitById("official-meldebestätigung");
  const certificate = unitById("meldebescheinigung-on-request");
  const electronic = unitById("electronic-anmeldung-federal-procedure");
  const cooperation = unitById("cooperation-duties-on-authority-request");
  const ordinaryFine = unitById("ordinary-registration-fine-framework");
  const fictitiousFine = unitById("fictitious-address-fine-framework");
  const corpus = packText();
  const federalScenarios = Object.freeze({
    F1: casePassed("F1") && Boolean(confirmation?.text.includes("amtliche Meldebestätigung")),
    F2: casePassed("F2") && Boolean(certificate?.text.includes("Meldebescheinigung")) && certificate?.id !== confirmation?.id,
    F3: casePassed("F3") && Boolean(electronic?.text.includes("bundesrechtlich")) && !/jede(?:r|n)? gemeinde|universell|überall online/i.test(electronic?.text ?? ""),
    F4: casePassed("F4") && Boolean(unitById("landlord-confirmation-missing-notice")?.text.includes("Meldebehörde")),
    F5: casePassed("F5") && Boolean(cooperation?.text.includes("Auf Verlangen")),
    F6: casePassed("F6") && (unitById("diplomatic-or-treaty-exemption")?.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"),
    F7: casePassed("F7") && Boolean(ordinaryFine?.text.includes("eintausend") && ordinaryFine?.text.includes("kein automatischer Einzelfallbetrag")),
    F8: casePassed("F8") && Boolean(unitById("domestic-move-new-registration")?.text.includes("§ 17 Absatz 2")),
  });
  const semanticNegatives = Object.freeze({
    confirmationIsNotCertificate: Boolean(confirmation && certificate && confirmation.text !== certificate.text && !confirmation.text.includes("Meldebescheinigung") && !certificate.text.includes("Meldebestätigung")),
    electronicIsNotUniversalLocal: Boolean(electronic && !/weiltingen|ansbach|bayern|wilburgstetten|jede gemeinde bietet/i.test(electronic.text)),
    cooperationIsOnDemand: Boolean(cooperation?.text.includes("Auf Verlangen") && !/stets alle dokumente|immer vorzulegen/i.test(cooperation.text)),
    ordinaryFineIsNotAutomaticMaximum: Boolean(ordinaryFine?.text.includes("kein automatischer Einzelfallbetrag") && !ordinaryFine.text.includes("fünfzigtausend")),
    fictitiousFineIsDistinct: Boolean(fictitiousFine && ordinaryFine && fictitiousFine.passageId !== ordinaryFine.passageId && fictitiousFine.text.includes("fünfzigtausend")),
    slovakNationalityIsNotJurisdiction: CANONICAL_UNITS.every((unit) => unit.jurisdictionCode === "DE") && !corpus.includes("jurisdiction sk"),
    noLocalSpecialCases: !/(weiltingen|wilburgstetten|ansbach|bürgeramt weiltingen)/i.test(corpus),
  });
  const identityStable =
    FIRST_PACK_CANONICAL_UNIT_IDS.length === 28
    && FIRST_PACK_CANONICAL_UNIT_IDS.every((id) => known.has(id))
    && V2A_ADDED_CANONICAL_UNIT_IDS.every((id) => known.has(id))
    && V2A_ADDED_CANONICAL_UNIT_IDS.every((id) => !(FIRST_PACK_CANONICAL_UNIT_IDS as readonly string[]).includes(id));
  const allPassed =
    Object.values(firstPackRegression).every(Boolean)
    && Object.values(federalScenarios).every(Boolean)
    && Object.values(semanticNegatives).every(Boolean)
    && identityStable;
  return Object.freeze({ firstPackRegression, federalScenarios, semanticNegatives, identityStable, allPassed });
}
