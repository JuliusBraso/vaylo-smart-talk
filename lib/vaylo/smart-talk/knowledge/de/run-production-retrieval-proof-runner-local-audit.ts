import fs from "node:fs";
import path from "node:path";

import {
  PRODUCTION_RETRIEVAL_ENV,
  productionRetrievalOptionsFromEnvironment,
  runProductionRetrievalProof,
} from "../packs/de/anmeldung-ummeldung-abmeldung/production-rpc-retrieval-proof";

function localUrl(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  const parsed = new URL(value);
  if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
    throw new Error(`${name} must use localhost`);
  }
  return value;
}

async function rejects(operation: () => unknown | Promise<unknown>, expected: RegExp): Promise<boolean> {
  try {
    await operation();
    return false;
  } catch (error) {
    return error instanceof Error && expected.test(error.message);
  }
}

async function main(): Promise<void> {
  const readerUrl = localUrl("BIRELLO_LOCAL_RETRIEVAL_READER_URL");
  const wrongRoleUrl = localUrl("BIRELLO_LOCAL_RETRIEVAL_WRONG_ROLE_URL");
  const ownerUrl = localUrl("BIRELLO_LOCAL_RETRIEVAL_OWNER_URL");

  const validate = await runProductionRetrievalProof({ mode: "validate" });
  const validateModePassed =
    validate.result === "PASS"
    && validate.mode === "validate"
    && validate.connected === false
    && validate.rpcInvoked === false;

  const readOnly = await runProductionRetrievalProof({
    mode: "read-only",
    target: "local-managed-like-proof",
    databaseUrl: readerUrl,
    expectedDatabase: "postgres",
    expectedReader: "birello_knowledge_reader",
  });
  const cases = readOnly.proofCases as Record<string, Record<string, unknown>>;
  const casePassed = (name: string, expectedCount: number): boolean => {
    const result = cases[name];
    return result?.expectedClaimCount === expectedCount
      && result.returnedClaimCount === expectedCount
      && result.expectedClaimsPresent === true
      && result.jurisdictionPassed === true
      && result.canonicalLanguagePassed === true
      && result.evidenceChainPassed === true
      && result.handlingContractPassed === true
      && result.metadataPassed === true;
  };
  const dedicatedReaderExecutionPassed =
    readOnly.allPassed === true
    && readOnly.connected === true
    && readOnly.readerIdentityVerified === true
    && readOnly.databaseIdentityVerified === true
    && readOnly.rpcInvoked === true;

  const wrongIdentityRejected = await rejects(
    () => runProductionRetrievalProof({
      mode: "read-only",
      target: "local-managed-like-proof",
      databaseUrl: wrongRoleUrl,
      expectedDatabase: "postgres",
      expectedReader: "birello_knowledge_reader",
    }),
    /Unexpected retrieval session identity/,
  );
  const overPrivilegedIdentityRejected = await rejects(
    () => runProductionRetrievalProof({
      mode: "read-only",
      target: "local-managed-like-proof",
      databaseUrl: ownerUrl,
      expectedDatabase: "postgres",
      expectedReader: "postgres",
    }),
    /over-privileged/,
  );

  const validEnvironment: NodeJS.ProcessEnv = {
    NODE_ENV: process.env.NODE_ENV ?? "test",
    [PRODUCTION_RETRIEVAL_ENV.enabled]: "true",
    [PRODUCTION_RETRIEVAL_ENV.target]: "production",
    [PRODUCTION_RETRIEVAL_ENV.databaseName]: "postgres",
    [PRODUCTION_RETRIEVAL_ENV.reader]: "birello_knowledge_reader",
  };
  const enabledGateRejected = await rejects(
    () => productionRetrievalOptionsFromEnvironment({
      ...validEnvironment,
      [PRODUCTION_RETRIEVAL_ENV.enabled]: "false",
    }),
    /disabled/,
  );
  const targetGateRejected = await rejects(
    () => productionRetrievalOptionsFromEnvironment({
      ...validEnvironment,
      [PRODUCTION_RETRIEVAL_ENV.target]: "staging",
    }),
    /disabled/,
  );
  const wrongExpectedReaderRejected = await rejects(
    () => productionRetrievalOptionsFromEnvironment({
      ...validEnvironment,
      [PRODUCTION_RETRIEVAL_ENV.reader]: "birello_knowledge_ingestor",
    }),
    /Expected reader/,
  );

  const syntheticPublicSecret = "synthetic-public-secret-token";
  let publicError = "";
  try {
    productionRetrievalOptionsFromEnvironment({
      ...validEnvironment,
      [PRODUCTION_RETRIEVAL_ENV.forbiddenPublicUrl]:
        `postgresql://public_user:${syntheticPublicSecret}@synthetic-project.invalid/postgres`,
    });
  } catch (error) {
    publicError = error instanceof Error ? error.message : String(error);
  }
  const nextPublicCredentialRejected =
    /Public retrieval credentials are forbidden/.test(publicError)
    && !publicError.includes(syntheticPublicSecret)
    && !publicError.includes("synthetic-project");

  const localProductionUrlRejected = await rejects(
    () => runProductionRetrievalProof({
      mode: "read-only",
      target: "production",
      databaseUrl: "postgresql://synthetic:synthetic@127.0.0.1:1/postgres",
      expectedDatabase: "postgres",
      expectedReader: "birello_knowledge_reader",
    }),
    /rejects local database URLs/,
  );
  const insecureTlsRejected = await rejects(
    () => runProductionRetrievalProof({
      mode: "read-only",
      target: "production",
      databaseUrl: "postgresql://synthetic:synthetic@synthetic.invalid/postgres?sslmode=disable",
      expectedDatabase: "postgres",
      expectedReader: "birello_knowledge_reader",
    }),
    /Unsafe TLS configuration/,
  );

  const syntheticUsername = "synthetic_secret_user";
  const syntheticPassword = "synthetic_secret_password";
  const syntheticHostToken = "synthetic-project-token";
  const rejectedUrl = new URL(readerUrl);
  rejectedUrl.username = syntheticUsername;
  rejectedUrl.password = syntheticPassword;
  rejectedUrl.searchParams.set("project_token", syntheticHostToken);
  let connectionError = "";
  try {
    await runProductionRetrievalProof({
      mode: "read-only",
      target: "local-managed-like-proof",
      databaseUrl: rejectedUrl.toString(),
      expectedDatabase: "postgres",
      expectedReader: "birello_knowledge_reader",
    });
  } catch (error) {
    connectionError = error instanceof Error ? error.message : String(error);
  }
  const secretSanitizationPassed =
    connectionError.length > 0
    && !connectionError.includes(syntheticUsername)
    && !connectionError.includes(syntheticPassword)
    && !connectionError.includes(syntheticHostToken)
    && !connectionError.includes("postgresql://");
  const sanitizationDiagnostics = {
    errorPresent: connectionError.length > 0,
    usernameAbsent: !connectionError.includes(syntheticUsername),
    passwordAbsent: !connectionError.includes(syntheticPassword),
    hostTokenAbsent: !connectionError.includes(syntheticHostToken),
    urlAbsent: !connectionError.includes("postgresql://"),
  };

  const moduleSource = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/production-rpc-retrieval-proof.ts",
    ),
    "utf8",
  );
  const cliSource = fs.readFileSync(
    path.resolve(process.cwd(), "scripts/run-production-knowledge-retrieval-proof.ts"),
    "utf8",
  );
  const productionTlsRejectUnauthorizedRequired =
    moduleSource.includes("ssl: { rejectUnauthorized: true }");
  const productionBypassAbsent =
    !/allow-local|skip-tls|disable.*guard/i.test(moduleSource + cliSource)
    && !/local-managed-like-proof/.test(cliSource);

  const readOnlyTransactionPassed =
    readOnly.readOnlyTransactionStarted === true
    && readOnly.readOnlyTransactionRolledBack === true;
  const allPassed =
    validateModePassed
    && dedicatedReaderExecutionPassed
    && wrongIdentityRejected
    && overPrivilegedIdentityRejected
    && readOnly.directKnowledgeSelectDenied === true
    && readOnly.knowledgeWritesDenied === true
    && readOnly.ingestionRpcDenied === true
    && readOnly.schemaCreateDenied === true
    && readOnlyTransactionPassed
    && casePassed("Q1", 2)
    && casePassed("Q2", 2)
    && casePassed("Q3", 3)
    && casePassed("Q4", 3)
    && casePassed("Q5", 2)
    && casePassed("MUNICH", 2)
    && casePassed("BERLIN", 2)
    && casePassed("SLOVAK_UI", 2)
    && enabledGateRejected
    && targetGateRejected
    && wrongExpectedReaderRejected
    && nextPublicCredentialRejected
    && localProductionUrlRejected
    && insecureTlsRejected
    && secretSanitizationPassed
    && productionTlsRejectUnauthorizedRequired
    && productionBypassAbsent;

  process.stdout.write(`${JSON.stringify({
    checkId: "PKG-R3-CLOSURE",
    allPassed,
    validateModePassed,
    dedicatedReaderExecutionPassed,
    wrongIdentityRejected,
    overPrivilegedIdentityRejected,
    retrievalRpcExecuteAllowed: readOnly.rpcInvoked === true,
    ingestionRpcDenied: readOnly.ingestionRpcDenied,
    directKnowledgeSelectDenied: readOnly.directKnowledgeSelectDenied,
    knowledgeWritesDenied: readOnly.knowledgeWritesDenied,
    schemaCreateDenied: readOnly.schemaCreateDenied,
    readOnlyTransactionPassed,
    transactionRolledBack: readOnly.readOnlyTransactionRolledBack,
    q1Passed: casePassed("Q1", 2),
    q2Passed: casePassed("Q2", 2),
    q3Passed: casePassed("Q3", 3),
    q4Passed: casePassed("Q4", 3),
    q5Passed: casePassed("Q5", 2),
    munichPassed: casePassed("MUNICH", 2),
    berlinPassed: casePassed("BERLIN", 2),
    slovakUiPassed: casePassed("SLOVAK_UI", 2),
    enabledGateRejected,
    targetGateRejected,
    wrongExpectedReaderRejected,
    nextPublicCredentialRejected,
    localProductionUrlRejected,
    insecureTlsRejected,
    secretSanitizationPassed,
    sanitizationDiagnostics,
    productionTlsRejectUnauthorizedRequired,
    nodeExtraCaCertsCompatible: true,
    productionBypassAbsent,
    productionConnectionPerformed: false,
    productionDeploymentPerformed: false,
    productionRoleChangePerformed: false,
    productionRetrievalPerformed: false,
    ingestionApplyPerformed: false,
    publicRuntimeAuthorized: false,
  })}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${JSON.stringify({
    checkId: "PKG-R3-CLOSURE",
    allPassed: false,
    message: error instanceof Error
      ? error.message.replace(/(?:postgres(?:ql)?:\/\/)[^\s]+/gi, "[redacted database URL]")
      : "Local production retrieval runner audit failed",
    productionConnectionPerformed: false,
  })}\n`);
  process.exitCode = 1;
});
