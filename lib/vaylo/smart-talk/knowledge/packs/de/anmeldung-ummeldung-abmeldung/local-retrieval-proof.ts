import { Client } from "pg";

import { CANONICAL_UNITS, type HandlingMode } from "./pack";
import {
  LOCAL_DISPOSABLE_VALIDATION,
  LOCAL_PACK_IDS,
  stableId,
} from "./local-disposable-adapter";

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
      id: LOCAL_PACK_IDS.abmeldungProcess,
      context: "ABMELDUNG",
      deadline: "BMG § 17 Abs. 2",
    };
  }
  if (unitId.includes("domestic-move")) {
    return {
      id: LOCAL_PACK_IDS.ummeldungProcess,
      context: "UMMELDUNG / DOMESTIC MOVE",
      deadline: "BMG § 17 Abs. 1–2",
    };
  }
  return {
    id: LOCAL_PACK_IDS.anmeldungProcess,
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
  const claimIds = unitIds.map((unitId) => stableId(`claim:${unitId}`));
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
        const row = byClaim.get(stableId(`claim:${unitId}`));
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
