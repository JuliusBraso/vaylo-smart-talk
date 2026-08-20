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
    required_context_keys: [...(unit.requiredContext ?? [])],
    revalidation_due_at: null,
    legal_locator: "BMG § 17 Abs. 1",
    citation_reference: "BMG official federal law",
  };
}

function dependencies(
  selected: unknown,
  retrieve: DependencyOverrides["retrieveRows"],
  state: { selectorCalls: number; retrievalCalls: number; reports: ControlledKnowledgeDiagnostics[] },
): DependencyOverrides {
  return {
    selectUnitIds: async () => {
      state.selectorCalls += 1;
      return selected;
    },
    retrieveRows: async (...args) => {
      state.retrievalCalls += 1;
      return retrieve(...args);
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
    && disabled.diagnostics.knowledgeGroundedResponse === false
    && JSON.stringify(baselinePrompt) === JSON.stringify(disabledPrompt);

  const supportedState = freshState();
  const supportedUnits = ["anmeldung-duty", "anmeldung-deadline-two-weeks"];
  const supported = await prepareControlledQuestionKnowledge(
    {
      text: "What is the deadline for Anmeldung after moving?",
      locale: "en",
      environment: ENABLED_ENVIRONMENT,
    },
    dependencies(
      supportedUnits,
      async (claimIds, jurisdictions) => {
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
    && supported.diagnostics.knowledgeGroundedResponse === true
    && supportedPrompt.system.includes("Verified Knowledge evidence:")
    && supportedPrompt.system.includes("anmeldung-deadline-two-weeks");

  const slovakState = freshState();
  const slovak = await prepareControlledQuestionKnowledge(
    {
      text: "Do koľkých dní sa musím po presťahovaní prihlásiť?",
      locale: "sk",
      environment: ENABLED_ENVIRONMENT,
    },
    dependencies(
      supportedUnits,
      async (_claimIds, jurisdictions) => {
        if (jurisdictions[0] !== "DE" || jurisdictions.includes("SK")) {
          throw new Error("Locale incorrectly changed jurisdiction");
        }
        return supportedUnits.map(row);
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
  const failed = await prepareControlledQuestionKnowledge(
    {
      text: "What is the Anmeldung deadline?",
      locale: "en",
      environment: ENABLED_ENVIRONMENT,
    },
    dependencies(
      ["anmeldung-deadline-two-weeks"],
      async () => {
        throw new Error(`connection failed ${SECRET}@secret-project.example`);
      },
      failureState,
    ),
  );
  const failedPrompt = buildSmartTalkMessages({
    text: "What is the Anmeldung deadline?",
    locale: "en",
    inputType: "question",
    knowledgeEvidence: failed.evidence,
  });
  const t6 =
    failureState.retrievalCalls === 1
    && failed.diagnostics.knowledgeRetrievalPerformed === true
    && failed.diagnostics.knowledgeGroundedResponse === false
    && failed.evidence.length === 0
    && !JSON.stringify({ failed, failedPrompt, reports: failureState.reports }).includes(SECRET)
    && !failedPrompt.system.includes("Verified Knowledge evidence:");

  const adapterSource = fs.readFileSync(ADAPTER_PATH, "utf8");
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

  const cases = { T1: t1, T2: t2, T3: t3, T4: t4, T5: t5, T6: t6, T7: t7 };
  const report = {
    result: Object.values(cases).every(Boolean) ? "PASS" : "FAILED",
    cases,
    allPassed: Object.values(cases).every(Boolean),
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
