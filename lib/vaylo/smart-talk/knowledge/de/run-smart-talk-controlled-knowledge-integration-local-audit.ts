import fs from "node:fs";
import path from "node:path";

import { buildSmartTalkMessages } from "../../build-smart-talk-prompt";
import {
  prepareControlledQuestionKnowledge,
  type ControlledKnowledgeDiagnostics,
} from "../packs/de/anmeldung-ummeldung-abmeldung/controlled-runtime-retrieval";
import { stablePackEntityId } from "../packs/de/anmeldung-ummeldung-abmeldung/identity";
import { CANONICAL_UNITS } from "../packs/de/anmeldung-ummeldung-abmeldung/pack";

const ROOT = path.resolve(__dirname, "../../../../..");
const ADAPTER_PATH = path.join(
  ROOT,
  "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/controlled-runtime-retrieval.ts",
);
const CLIENT_PATH = path.join(ROOT, "app/smart-talk/SmartTalkClient.tsx");
const PRODUCTION_PROOF_PATH = path.join(
  ROOT,
  "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/production-rpc-retrieval-proof.ts",
);
const SECRET = "synthetic-password-never-log";
const ENABLED_ENVIRONMENT: NodeJS.ProcessEnv = {
  NODE_ENV: "test",
  SMART_TALK_PRODUCTION_KNOWLEDGE_CONTROLLED_ENABLED: "true",
  BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_URL:
    `postgresql://birello_knowledge_reader:${SECRET}@db.invalid/postgres`,
  BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_NAME: "postgres",
  BIRELLO_PRODUCTION_KNOWLEDGE_READER: "birello_knowledge_reader",
};

type DependencyOverrides = NonNullable<Parameters<typeof prepareControlledQuestionKnowledge>[1]>;

function row(unitId: string): Record<string, unknown> {
  const unit = CANONICAL_UNITS.find((candidate) => candidate.id === unitId);
  if (!unit) throw new Error(`Unknown fixture unit: ${unitId}`);
  return {
    claim_id: stablePackEntityId(`claim:${unit.id}`),
    canonical_proposition: unit.text,
    canonical_language: "de",
    jurisdiction_code: "DE",
    territorial_scope: null,
    handling_mode: unit.handlingMode,
    canonical_value_usable: unit.handlingMode === "STORE_CANONICALLY",
    stale_behavior: "ALLOW_WITH_STALE_WARNING",
    required_context_keys: `{${(unit.requiredContext ?? []).join(",")}}`,
    revalidation_due_at: null,
    source_id: "11111111-1111-4111-8111-111111111116",
    source_version_id: "11111111-1111-4111-8111-111111111117",
    source_passage_id: stablePackEntityId(`passage:${unit.passageId}`),
    legal_locator: "BMG § 17 Abs. 1",
    citation_reference: "BMG official federal law",
    full_text_indexed: true,
    vector_indexed: false,
    indexed_at: "2026-08-20T00:00:00.000Z",
    effective_date_filter_required: true,
    stale_policy_filter_required: true,
  };
}

function dependencies(
  selected: unknown,
  retrieve: (
    claimIds: readonly string[],
    jurisdictionCodes: readonly string[],
  ) => Promise<readonly Record<string, unknown>[]>,
  state: { selectorCalls: number; retrievalCalls: number; reports: ControlledKnowledgeDiagnostics[] },
): DependencyOverrides {
  return {
    selectUnitIds: async () => {
      state.selectorCalls += 1;
      return selected;
    },
    retrieveRows: async (...args) => {
      state.retrievalCalls += 1;
      return {
        ok: true,
        rows: await retrieve(args[0], args[1]),
        connectionSucceeded: true,
        rpcInvoked: true,
        rpcSucceeded: true,
      };
    },
    report: (report) => state.reports.push(report),
  };
}

function freshState(): {
  selectorCalls: number;
  retrievalCalls: number;
  reports: ControlledKnowledgeDiagnostics[];
} {
  return { selectorCalls: 0, retrievalCalls: 0, reports: [] };
}

function clientFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...clientFiles(target));
    else if (/\.(?:ts|tsx)$/.test(entry.name)) {
      const source = fs.readFileSync(target, "utf8");
      if (/^\s*["']use client["'];/m.test(source)) files.push(target);
    }
  }
  return files;
}

async function main(): Promise<void> {
  const disabledState = freshState();
  const disabled = await prepareControlledQuestionKnowledge(
    {
      text: "What is the deadline for Anmeldung after moving?",
      locale: "en",
      environment: { NODE_ENV: "test" },
    },
    dependencies([], async () => [], disabledState),
  );
  const baselinePrompt = buildSmartTalkMessages({
    text: "What is the deadline for Anmeldung after moving?",
    locale: "en",
    inputType: "question",
  });
  const disabledPrompt = buildSmartTalkMessages({
    text: "What is the deadline for Anmeldung after moving?",
    locale: "en",
    inputType: "question",
    knowledgeEvidence: disabled.evidence,
  });
  const t1 =
    disabledState.selectorCalls === 0
    && disabledState.retrievalCalls === 0
    && disabled.diagnostics.knowledgeRetrievalAttempted === false
    && disabled.diagnostics.knowledgeRetrievalPerformed === false
    && disabled.diagnostics.retrievalRpcInvoked === false
    && disabled.diagnostics.knowledgeGroundedResponse === false
    && JSON.stringify(baselinePrompt) === JSON.stringify(disabledPrompt);

  const supportedState = freshState();
  const supportedUnits = ["anmeldung-deadline-two-weeks", "anmeldung-duty"];
  let runtimeClaimPayload: readonly string[] = [];
  let runtimeJurisdictionPayload: readonly string[] = [];
  const supported = await prepareControlledQuestionKnowledge(
    {
      text: "What is the deadline for Anmeldung after moving?",
      locale: "en",
      environment: ENABLED_ENVIRONMENT,
    },
    dependencies(
      supportedUnits,
      async (claimIds, jurisdictions) => {
        runtimeClaimPayload = claimIds;
        runtimeJurisdictionPayload = jurisdictions;
        const expected = supportedUnits.map((id) => stablePackEntityId(`claim:${id}`));
        if (JSON.stringify(claimIds) !== JSON.stringify(expected)) {
          throw new Error("Non-deterministic claim identity");
        }
        if (JSON.stringify(jurisdictions) !== JSON.stringify(["DE"])) {
          throw new Error("Unexpected jurisdiction");
        }
        return supportedUnits.map(row);
      },
      supportedState,
    ),
  );
  const supportedPrompt = buildSmartTalkMessages({
    text: "What is the deadline for Anmeldung after moving?",
    locale: "en",
    inputType: "question",
    knowledgeEvidence: supported.evidence,
  });
  const t2 =
    supportedState.selectorCalls === 1
    && supportedState.retrievalCalls === 1
    && supported.evidence.length === 2
    && supported.evidence.every((evidence) => supportedUnits.includes(evidence.canonicalUnitId))
    && supported.diagnostics.jurisdiction === "DE"
    && supported.diagnostics.canonicalKnowledgeLanguage === "de"
    && supported.diagnostics.retrievalConnectionSucceeded === true
    && supported.diagnostics.retrievalRpcInvoked === true
    && supported.diagnostics.retrievalRpcSucceeded === true
    && supported.diagnostics.knowledgeGroundedResponse === true
    && supportedPrompt.system.includes("Verified Knowledge evidence:")
    && supportedPrompt.system.includes("anmeldung-deadline-two-weeks");

  const slovakState = freshState();
  const slovakSelectedUnits = [
    "anmeldung-deadline-two-weeks",
    "anmeldung-duty",
    "domestic-move-new-registration",
  ];
  const slovak = await prepareControlledQuestionKnowledge(
    {
      text: "Do koľkých dní sa musím po presťahovaní prihlásiť?",
      locale: "sk",
      environment: ENABLED_ENVIRONMENT,
    },
    dependencies(
      slovakSelectedUnits,
      async (_claimIds, jurisdictions) => {
        if (jurisdictions[0] !== "DE" || jurisdictions.includes("SK")) {
          throw new Error("Locale incorrectly changed jurisdiction");
        }
        return slovakSelectedUnits.map(row);
      },
      slovakState,
    ),
  );
  const slovakPrompt = buildSmartTalkMessages({
    text: "Do koľkých dní sa musím po presťahovaní prihlásiť?",
    locale: "sk",
    inputType: "question",
    knowledgeEvidence: slovak.evidence,
  });
  const t3 =
    slovak.diagnostics.requestedOutputLanguage === "sk"
    && slovak.diagnostics.jurisdiction === "DE"
    && slovak.diagnostics.canonicalKnowledgeLanguage === "de"
    && slovak.evidence.every(
      (evidence) => evidence.jurisdiction === "DE" && evidence.canonicalLanguage === "de",
    )
    && slovakPrompt.user.includes("in Slovak")
    && !JSON.stringify(slovak).includes('"jurisdiction":"SK"');

  const unrelatedState = freshState();
  const unrelated = await prepareControlledQuestionKnowledge(
    {
      text: "How do I bake a chocolate cake?",
      locale: "en",
      environment: ENABLED_ENVIRONMENT,
    },
    dependencies([], async () => [row("anmeldung-duty")], unrelatedState),
  );
  const unrelatedPrompt = buildSmartTalkMessages({
    text: "How do I bake a chocolate cake?",
    locale: "en",
    inputType: "question",
    knowledgeEvidence: unrelated.evidence,
  });
  const unrelatedBaseline = buildSmartTalkMessages({
    text: "How do I bake a chocolate cake?",
    locale: "en",
    inputType: "question",
  });
  const t4 =
    unrelatedState.retrievalCalls === 0
    && unrelated.evidence.length === 0
    && unrelated.diagnostics.knowledgeGroundedResponse === false
    && JSON.stringify(unrelatedPrompt) === JSON.stringify(unrelatedBaseline);

  const inventedState = freshState();
  const invented = await prepareControlledQuestionKnowledge(
    {
      text: "What is the Anmeldung deadline?",
      locale: "en",
      environment: ENABLED_ENVIRONMENT,
    },
    dependencies(["invented-production-claim"], async () => [row("anmeldung-duty")], inventedState),
  );
  const t5 =
    inventedState.retrievalCalls === 0
    && invented.evidence.length === 0
    && invented.diagnostics.selectedCanonicalUnitCount === 0
    && invented.diagnostics.knowledgeGroundedResponse === false;

  const failureState = freshState();
  const failureDependencies: DependencyOverrides = {
    selectUnitIds: async () => ["anmeldung-deadline-two-weeks"],
    retrieveRows: async () => {
      failureState.retrievalCalls += 1;
      void `connection failed ${SECRET}@secret-project.example`;
      return {
        ok: false,
        rows: [],
        connectionSucceeded: true,
        rpcInvoked: true,
        rpcSucceeded: false,
        failureStage: "rpc",
      };
    },
    report: (report) => failureState.reports.push(report),
  };
  const failed = await prepareControlledQuestionKnowledge(
    {
      text: "What is the Anmeldung deadline?",
      locale: "en",
      environment: ENABLED_ENVIRONMENT,
    },
    failureDependencies,
  );
  const failedPrompt = buildSmartTalkMessages({
    text: "What is the Anmeldung deadline?",
    locale: "en",
    inputType: "question",
    knowledgeEvidence: failed.evidence,
  });
  const t6 =
    failureState.retrievalCalls === 1
    && failed.diagnostics.knowledgeRetrievalPerformed === false
    && failed.diagnostics.retrievalConnectionSucceeded === true
    && failed.diagnostics.retrievalRpcInvoked === true
    && failed.diagnostics.retrievalRpcSucceeded === false
    && failed.diagnostics.retrievalFailureStage === "rpc"
    && failed.diagnostics.knowledgeGroundedResponse === false
    && failed.evidence.length === 0
    && !JSON.stringify({ failed, failedPrompt, reports: failureState.reports }).includes(SECRET)
    && !failedPrompt.system.includes("Verified Knowledge evidence:");

  const zeroRowsState = freshState();
  const zeroRows = await prepareControlledQuestionKnowledge(
    {
      text: "What is the Anmeldung deadline?",
      locale: "en",
      environment: ENABLED_ENVIRONMENT,
    },
    dependencies(["anmeldung-deadline-two-weeks"], async () => [], zeroRowsState),
  );
  const zeroEvidenceRegression =
    zeroRows.diagnostics.knowledgeRetrievalPerformed === true
    && zeroRows.diagnostics.retrievalConnectionSucceeded === true
    && zeroRows.diagnostics.retrievalRpcInvoked === true
    && zeroRows.diagnostics.retrievalRpcSucceeded === true
    && zeroRows.diagnostics.retrievalZeroRows === true
    && zeroRows.diagnostics.retrievalFailureStage === null
    && zeroRows.diagnostics.knowledgeGroundedResponse === false;

  const adapterSource = fs.readFileSync(ADAPTER_PATH, "utf8");
  const productionProofSource = fs.readFileSync(PRODUCTION_PROOF_PATH, "utf8");
  const smartTalkClientSource = fs.readFileSync(CLIENT_PATH, "utf8");
  const browserSources = clientFiles(path.join(ROOT, "app")).map((file) => fs.readFileSync(file, "utf8"));
  const retrievalCredentialName = "BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_URL";
  const t7 =
    adapterSource.startsWith('import "server-only";')
    && adapterSource.includes("NEXT_PUBLIC_BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_URL")
    && !smartTalkClientSource.includes(retrievalCredentialName)
    && browserSources.every((source) => !source.includes(retrievalCredentialName))
    && !supportedPrompt.system.includes(SECRET)
    && !supportedPrompt.user.includes(SECRET);

  const productionProofClaimPayload = supportedUnits.map((id) => stablePackEntityId(`claim:${id}`));
  const contextState = freshState();
  const contextResult = await prepareControlledQuestionKnowledge(
    {
      text: "When must I report a change of main residence?",
      locale: "en",
      environment: ENABLED_ENVIRONMENT,
    },
    dependencies(
      ["main-home-change-notification"],
      async () => [row("main-home-change-notification")],
      contextState,
    ),
  );
  const identityParityProof =
    productionProofSource.includes(
      'Q1: ["anmeldung-deadline-two-weeks", "anmeldung-duty"]',
    )
    && productionProofSource.includes('stablePackEntityId(`claim:${id}`)')
    && JSON.stringify(runtimeClaimPayload) === JSON.stringify(productionProofClaimPayload);
  const rpcArgumentParityProof =
    productionProofSource.includes(
      '"select * from public.knowledge_retrieve_evidence_packets($1::uuid[],$2::text[])"',
    )
    && productionProofSource.includes('[expectedIds, ["DE"]]')
    && JSON.stringify(runtimeJurisdictionPayload) === JSON.stringify(["DE"]);
  const rowParsingProof =
    supported.evidence.length === 2
    && supported.evidence.every((evidence) =>
      evidence.canonicalLanguage === "de"
      && evidence.jurisdiction === "DE"
      && evidence.proposition.length > 0
      && evidence.handlingMode === "STORE_CANONICALLY"
    )
    && JSON.stringify(contextResult.evidence[0]?.requiredContext)
      === JSON.stringify(["RESIDENCE_STATE", "EVENT_DATE"]);
  const cases = { T1: t1, T2: t2, T3: t3, T4: t4, T5: t5, T6: t6, T7: t7 };
  const closureProofs = {
    identityParityProof,
    rpcArgumentParityProof,
    rowParsingProof,
    zeroEvidenceRegression,
  };
  const report = {
    result: Object.values(cases).every(Boolean) && Object.values(closureProofs).every(Boolean)
      ? "PASS"
      : "FAILED",
    cases,
    closureProofs,
    q1: {
      selectedCanonicalUnitIds: supportedUnits,
      productionProofClaimIds: productionProofClaimPayload,
      runtimeClaimIds: runtimeClaimPayload,
      jurisdictionPayload: runtimeJurisdictionPayload,
    },
    slovakSelectorFixture: {
      selectedCanonicalUnitIds: slovakSelectedUnits,
      expectedQ1UnitsPresent: supportedUnits.every((id) => slovakSelectedUnits.includes(id)),
    },
    allPassed: Object.values(cases).every(Boolean) && Object.values(closureProofs).every(Boolean),
    productionConnectionAttempted: false,
    productionRetrievalAttempted: false,
    productionWriteAttempted: false,
    publicRuntimeAuthorized: false,
  };
  console.log(JSON.stringify(report, null, 2));
  if (!report.allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Controlled integration audit failed");
  process.exitCode = 1;
});
